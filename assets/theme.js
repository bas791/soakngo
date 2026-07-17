/* Soak n Go — theme.js
   Vanilla ES module. Custom elements only, no dependencies, no build step.
   Loaded with type="module" so it never blocks rendering. */

/* ---------- Utilities ---------------------------------------------------- */

export function formatMoney(cents, format = window.theme?.moneyFormat || '${{amount}}') {
  const value = (cents / 100).toFixed(2);
  const [whole, decimal] = value.split('.');
  const withThousands = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const map = {
    amount: `${withThousands}.${decimal}`,
    amount_no_decimals: withThousands,
    amount_with_comma_separator: `${whole}.${decimal}`.replace('.', ','),
    amount_no_decimals_with_comma_separator: withThousands
  };
  return format.replace(/\{\{\s*(\w+)\s*\}\}/, (m, key) => map[key] ?? map.amount);
}

async function fetchCart() {
  const res = await fetch(`${window.routes.cart_url}.js`);
  return res.json();
}

function publishCartUpdate(cart) {
  document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }));
}

function updateCartCount(count) {
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = count > 0 ? count : '';
    const label = el.closest('[data-cart-count-label]');
    if (label) label.setAttribute('aria-label', `Cart, ${count} items`);
  });
}

function trapFocus(container) {
  const focusable = container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return () => {};
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const handler = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  container.addEventListener('keydown', handler);
  return () => container.removeEventListener('keydown', handler);
}

/* ---------- Drawers (cart + menu) ---------------------------------------- */

class DrawerElement extends HTMLElement {
  connectedCallback() {
    this.releaseFocus = null;
    this.opener = null;
    this.addEventListener('click', (e) => {
      if (e.target.matches('[data-drawer-close], [data-drawer-close] *') || e.target.classList.contains('drawer__overlay')) {
        this.close();
      }
    });
    this.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
    document.querySelectorAll(`[data-drawer-open="${this.id}"]`).forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open(btn);
      });
    });
  }

  open(opener) {
    this.opener = opener || null;
    this.classList.add('is-open');
    this.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    const panel = this.querySelector('.drawer__panel');
    this.releaseFocus = trapFocus(panel);
    const closeBtn = this.querySelector('[data-drawer-close]');
    if (closeBtn) closeBtn.focus();
  }

  close() {
    this.classList.remove('is-open');
    this.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    if (this.releaseFocus) this.releaseFocus();
    if (this.opener) this.opener.focus();
  }
}
customElements.define('drawer-element', DrawerElement);

/* ---------- Cart drawer (AJAX re-render via Section Rendering API) -------- */

class CartDrawer extends DrawerElement {
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('cart:updated', (e) => {
      updateCartCount(e.detail.cart.item_count);
    });
  }

  async refresh(openAfter = false) {
    const res = await fetch(`${window.routes.cart_url}?section_id=cart-drawer`);
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, 'text/html');
    const fresh = doc.querySelector('[data-cart-drawer-content]');
    const target = this.querySelector('[data-cart-drawer-content]');
    if (fresh && target) target.innerHTML = fresh.innerHTML;
    if (openAfter) this.open();
  }
}
customElements.define('cart-drawer', CartDrawer);

/* ---------- Cart line quantity / remove ----------------------------------- */

class CartItems extends HTMLElement {
  connectedCallback() {
    this.sectionId = this.dataset.sectionId || null;
    this.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-cart-remove]');
      if (removeBtn) {
        e.preventDefault();
        this.updateLine(removeBtn.dataset.cartRemove, 0);
      }
    });
    this.addEventListener('change', (e) => {
      const input = e.target.closest('[data-line-qty]');
      if (input) this.updateLine(input.dataset.lineQty, parseInt(input.value, 10) || 0);
    });
  }

  async updateLine(line, quantity) {
    this.setAttribute('aria-busy', 'true');
    try {
      const res = await fetch(window.routes.cart_change_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ line: Number(line), quantity })
      });
      const cart = await res.json();
      if (cart.status) throw new Error(cart.message || 'Cart error');
      publishCartUpdate(cart);
      const drawer = document.querySelector('cart-drawer');
      if (drawer && this.closest('cart-drawer')) {
        await drawer.refresh();
      } else if (this.sectionId) {
        const secRes = await fetch(`${window.routes.cart_url}?section_id=${this.sectionId}`);
        const text = await secRes.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const freshSection = doc.getElementById(`MainCart-${this.sectionId}`);
        const current = document.getElementById(`MainCart-${this.sectionId}`);
        if (freshSection && current) current.innerHTML = freshSection.innerHTML;
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.removeAttribute('aria-busy');
    }
  }
}
customElements.define('cart-items', CartItems);

/* ---------- Product form (AJAX add to cart) -------------------------------- */

class ProductForm extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('form');
    if (!this.form) return;
    this.submitBtn = this.form.querySelector('[type="submit"]');
    this.form.addEventListener('submit', (e) => this.onSubmit(e));
  }

  async onSubmit(e) {
    if (window.theme?.cartType !== 'drawer' || !document.querySelector('cart-drawer')) return; // fall back to normal submit
    e.preventDefault();
    const btnText = this.submitBtn?.querySelector('[data-atc-text]');
    const original = btnText?.textContent;
    if (this.submitBtn) this.submitBtn.setAttribute('aria-disabled', 'true');
    if (btnText) btnText.textContent = this.submitBtn.dataset.addingText || 'Adding…';
    try {
      const res = await fetch(window.routes.cart_add_url, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(this.form)
      });
      const data = await res.json();
      if (data.status) throw new Error(data.description || 'Add to cart failed');
      const cart = await fetchCart();
      publishCartUpdate(cart);
      const drawer = document.querySelector('cart-drawer');
      if (drawer) await drawer.refresh(true);
    } catch (err) {
      console.error(err);
      this.form.submit(); // graceful fallback to the cart page
    } finally {
      if (this.submitBtn) this.submitBtn.removeAttribute('aria-disabled');
      if (btnText && original) btnText.textContent = original;
    }
  }
}
customElements.define('product-form', ProductForm);

/* ---------- Quantity input -------------------------------------------------- */

class QuantityInput extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector('input');
    this.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const delta = btn.dataset.qtyChange === 'increment' ? 1 : -1;
        const min = parseInt(this.input.min, 10) || 0;
        const next = Math.max(min, (parseInt(this.input.value, 10) || 0) + delta);
        this.input.value = next;
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  }
}
customElements.define('quantity-input', QuantityInput);

/* ---------- Free shipping progress bar -------------------------------------- */

class FreeShippingBar extends HTMLElement {
  connectedCallback() {
    this.threshold = parseInt(this.dataset.threshold, 10) || window.theme?.freeShippingThreshold || 0;
    document.addEventListener('cart:updated', (e) => this.render(e.detail.cart.total_price));
    if (this.dataset.total) this.render(parseInt(this.dataset.total, 10));
  }

  render(totalCents) {
    if (!this.threshold) return;
    const msg = this.querySelector('.free-shipping-bar__msg');
    const fill = this.querySelector('.free-shipping-bar__fill');
    const remaining = this.threshold - totalCents;
    const pct = Math.min(100, Math.round((totalCents / this.threshold) * 100));
    if (fill) {
      fill.style.width = `${pct}%`;
      fill.classList.toggle('is-unlocked', remaining <= 0);
    }
    if (msg) {
      msg.classList.toggle('is-unlocked', remaining <= 0);
      msg.innerHTML =
        remaining <= 0
          ? `<strong>${this.dataset.unlockedText || 'Free NZ shipping unlocked — nice one.'}</strong>`
          : (this.dataset.progressText || "You're STRONG away from free NZ shipping").replace(
              'STRONG',
              `<strong>${formatMoney(remaining)}</strong>`
            );
    }
  }
}
customElements.define('free-shipping-bar', FreeShippingBar);

/* ---------- Before / after slider -------------------------------------------- */

class BeforeAfter extends HTMLElement {
  connectedCallback() {
    this.range = this.querySelector('.ba-slider__range');
    if (!this.range) return;
    const set = (val) => this.style.setProperty('--ba-pos', `${val}%`);
    set(this.range.value);
    this.range.addEventListener('input', () => set(this.range.value));
  }
}
customElements.define('before-after', BeforeAfter);

/* ---------- Coverage calculator ------------------------------------------------
   Reads a JSON list of products [{title, url, coverage, price, priceFormatted}]
   from an embedded <script type="application/json"> and recommends the smallest
   SKU that covers the entered area. --------------------------------------------- */

class CoverageCalculator extends HTMLElement {
  connectedCallback() {
    const dataEl = this.querySelector('[data-coverage-data]');
    this.products = dataEl ? JSON.parse(dataEl.textContent) : [];
    this.products.sort((a, b) => a.coverage - b.coverage);
    this.input = this.querySelector('[data-coverage-input]');
    this.result = this.querySelector('[data-coverage-result]');
    this.querySelector('[data-coverage-submit]')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.calculate();
    });
    this.input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.calculate();
      }
    });
  }

  calculate() {
    const area = parseInt(this.input?.value, 10);
    if (!area || area <= 0 || !this.products.length || !this.result) return;
    let pick = this.products.find((p) => p.coverage >= area);
    let note = '';
    if (!pick) {
      const biggest = this.products[this.products.length - 1];
      const qty = Math.ceil(area / biggest.coverage);
      pick = biggest;
      note = `That's a big job — you'll want ${qty} of these (covers up to ${biggest.coverage * qty} m² combined).`;
    } else {
      note = `Covers up to ${pick.coverage} m² — plenty for your ${area} m².`;
    }
    this.result.hidden = false;
    this.result.querySelector('[data-coverage-pick]').textContent = pick.title;
    this.result.querySelector('[data-coverage-note]').textContent = note;
    const link = this.result.querySelector('[data-coverage-link]');
    if (link) link.href = pick.url;
  }
}
customElements.define('coverage-calculator', CoverageCalculator);

/* ---------- Subscription savings calculator ------------------------------------ */

class SavingsCalculator extends HTMLElement {
  connectedCallback() {
    this.price = parseInt(this.dataset.price, 10) || 0; // cents
    this.discountPct = parseFloat(this.dataset.discountPct) || 0;
    this.select = this.querySelector('[data-savings-frequency]');
    this.output = this.querySelector('[data-savings-output]');
    this.select?.addEventListener('change', () => this.render());
    this.render();
  }

  render() {
    if (!this.output || !this.price) return;
    const perYear = parseInt(this.select?.value, 10) || 4;
    const saving = Math.round(this.price * (this.discountPct / 100)) * perYear;
    this.output.textContent = formatMoney(saving);
    const count = this.querySelector('[data-savings-count]');
    if (count) count.textContent = perYear;
  }
}
customElements.define('savings-calculator', SavingsCalculator);

/* ---------- Selling plan picker --------------------------------------------------
   Radios carry data-selling-plan (id or empty for one-time) and data-price (cents).
   Updates the hidden selling_plan input and any [data-main-price] displays. -------- */

class SellingPlanPicker extends HTMLElement {
  connectedCallback() {
    this.hiddenInput = this.querySelector('input[name="selling_plan"]');
    this.form = this.closest('form') || document.getElementById(this.dataset.formId);
    this.addEventListener('change', (e) => {
      const radio = e.target.closest('input[type="radio"][data-selling-plan]');
      if (radio) this.select(radio);
      const freq = e.target.closest('select[data-plan-frequency]');
      if (freq) this.selectFrequency(freq);
    });
    const checked = this.querySelector('input[type="radio"][data-selling-plan]:checked');
    if (checked) this.select(checked);
  }

  select(radio) {
    let planId = radio.dataset.sellingPlan;
    let price = radio.dataset.price;
    if (radio.dataset.hasFrequencies === 'true') {
      const freq = this.querySelector('select[data-plan-frequency]');
      if (freq) {
        const opt = freq.selectedOptions[0];
        planId = opt.value;
        price = opt.dataset.price || price;
      }
    }
    this.setPlan(planId, price);
    this.querySelectorAll('[data-plan-frequency-wrap]').forEach((wrap) => {
      wrap.hidden = radio.dataset.hasFrequencies !== 'true';
    });
  }

  selectFrequency(select) {
    const opt = select.selectedOptions[0];
    this.setPlan(opt.value, opt.dataset.price);
  }

  setPlan(planId, priceCents) {
    if (this.hiddenInput) this.hiddenInput.value = planId || '';
    if (priceCents) {
      const formatted = formatMoney(parseInt(priceCents, 10));
      document.querySelectorAll(`[data-main-price="${this.dataset.productId}"]`).forEach((el) => {
        el.textContent = formatted;
      });
    }
  }
}
customElements.define('selling-plan-picker', SellingPlanPicker);

/* ---------- Sticky add-to-cart (mobile) ------------------------------------------- */

class StickyAtc extends HTMLElement {
  connectedCallback() {
    const target = document.getElementById(this.dataset.watch);
    const bar = this.querySelector('.sticky-atc');
    if (!target || !bar) return;
    const observer = new IntersectionObserver(
      ([entry]) => bar.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    observer.observe(target);
  }
}
customElements.define('sticky-atc', StickyAtc);

/* ---------- Product gallery --------------------------------------------------------- */

class ProductGallery extends HTMLElement {
  connectedCallback() {
    this.main = this.querySelector('[data-gallery-main]');
    this.addEventListener('click', (e) => {
      const thumb = e.target.closest('[data-gallery-thumb]');
      if (!thumb || !this.main) return;
      e.preventDefault();
      this.main.innerHTML = thumb.querySelector('template').innerHTML;
      this.querySelectorAll('[data-gallery-thumb]').forEach((t) => t.setAttribute('aria-current', 'false'));
      thumb.setAttribute('aria-current', 'true');
    });
  }
}
customElements.define('product-gallery', ProductGallery);

/* ---------- Initial cart count sync --------------------------------------------------- */

if (document.querySelector('[data-cart-count]')) {
  fetchCart()
    .then((cart) => updateCartCount(cart.item_count))
    .catch(() => {});
}
