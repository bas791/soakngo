# Soak n Go — Custom Shopify Theme

Production-ready Online Store 2.0 theme for **soakngo.co.nz** — the NZ-made
DIY exterior cleaner from Maximum Wash Ltd. Built as a conversion machine:
multi-buy bundles, Subscribe & Save, per-litre value ladder, coverage
calculators, and positioning built to win the comparison shopper.

No build step. Vanilla JS (ES modules) + modern CSS + Liquid. Pushes as-is
with the Shopify CLI.

---

## 1. Quick start

```bash
# Install Shopify CLI (once)
npm install -g @shopify/cli

# From this directory — push to your store as a new unpublished theme
shopify theme push --store soakngo-store.myshopify.com --unpublished

# Or run the live-reload dev server
shopify theme dev --store soakngo-store.myshopify.com
```

Then, in Shopify admin:

1. **Products** — create the 4 SKUs from `docs/PRODUCTS.md`, assign the
   `product.refill` template to the 2L Refill.
2. **Metafields** — create the definitions from `METAFIELDS.md` and fill
   them per product (coverage + volume drive the calculators and per-litre
   pricing).
3. **Pages** — create the pages listed at the bottom of `docs/PRODUCTS.md`
   and assign the matching templates (about, faq, contact, comparison,
   3 landing pages).
4. **Blog** — create "The Soak Files" and publish the three posts from
   `docs/content/blog/`.
5. **Policies** — paste the four documents from `docs/content/policies/`
   into Settings → Policies **after legal review** (they're flagged
   placeholders).
6. **Menus** — main menu + footer menu per `docs/PRODUCTS.md`.
7. **Theme editor** — assign products to: the coverage calculators
   (homepage + product template blocks + collection page), the value-ladder
   block (all 4 SKUs, smallest → largest), the cart drawer/cart page upsell
   slots (2L Refill), and the savings calculator on the "Never run out"
   landing page (2L Refill).
8. **SEO** — paste meta titles/descriptions from `docs/SEO.md`.
9. **Photos** — replace placeholders per `ASSETS-NEEDED.md` as photography
   arrives. Label artwork already exists — export bottle renders from it.

---

## 2. App configuration

The theme integrates three apps but never rebuilds their logic — remove or
swap any of them without breaking the theme.

### Bundler — Product Bundles (multi-buy discounts)

- Install Bundler, create quantity-break bundles per SKU
  (e.g. **2 = 10% off, 3+ = 15% off** — the tiers are yours to set).
- Bundler injects its widget on product pages; the theme provides styled,
  clearly-marked containers so the offer looks native:
  - Product pages: `snippets/bundler-block.liquid`
    (`#bundler-widget-{product id}`)
  - Cart drawer: `#bundler-cart-widget` in `sections/cart-drawer.liquid`
  - Cart page: `#bundler-cart-page-widget` in `sections/main-cart.liquid`
- The display-only nudge text ("2 bottles = 10% off …") is set in
  **Theme settings → Bundles** — keep it in sync with the real tiers, or
  hide it there.

### Subscriptions — Seal Subscriptions (recommended)

**Why Seal:** at this catalogue size (4 SKUs) the deciding factors are
cost and native-API correctness. Seal has a genuinely usable free tier
(up to 150 subscriptions) then flat cheap pricing, uses Shopify's native
selling-plan APIs, and doesn't inject its own checkout. Appstle is the
equally solid runner-up (more features, busier UI). Either works
unchanged: **the theme renders standard Shopify `selling_plan` objects**
(`snippets/selling-plan-picker.liquid`), so any native-API subscription
app plugs in.

Setup:
1. Install Seal Subscriptions, create a selling plan group per product —
   suggest **15% off**, frequencies: 2 / 3 / 4 months (label copy assumes
   ~3-monthly is the sweet spot).
2. The theme automatically shows the one-time vs Subscribe & Save picker
   (savings shown in dollars) wherever a product has selling plans. No
   plans configured → products sell one-time only; the picker hides itself.
3. The 2L Refill template (`product.refill`) has **subscription selected
   by default** (block setting `subscribe_default`).
4. Set the discount % in **two places** to match: the app's selling plans,
   and the savings calculator section on the "Never run out" landing page.
5. Reassurance copy ("Pause, skip or cancel anytime…") lives in
   **Theme settings → Subscriptions**.

### ReConvert (post-purchase upsell + thank-you page)

Runs entirely in checkout/thank-you — zero theme code required.
1. Install ReConvert, build a post-purchase funnel:
   one-click upsell offering the **2L Refill** (subscription variant if
   supported) after any sprayer purchase; downsell to 10% off a refill.
2. Customise the thank-you page: reorder block, "how to apply it" video
   slot, referral prompt.
3. Keep the offer discount stacked sensibly against Bundler tiers so
   post-purchase never undercuts pre-purchase bundles by more than a token.

### Reviews (later)

`sections/reviews.liquid` shows clearly-labelled placeholder cards and
accepts app blocks (`@app`). When ready, install Judge.me or Shopify's
review app, add its app block to the Reviews section, delete the
placeholder blocks and switch off the placeholder note setting.
**Never publish the placeholder quotes as if they were real reviews.**

---

## 3. Theme settings guide (Customise → Theme settings)

| Group | What it controls |
|---|---|
| Colours | Navy / blue / yellow tokens. Yellow is CTA-only by design — resist the urge. |
| Typography | Webfont loading toggle (Barlow Condensed + Source Sans 3 from Google Fonts, `display=swap`). Off = system fonts, fastest possible. |
| Layout | Page max-width. |
| Cart | Drawer vs page; **free-shipping threshold** (drives the progress bar — must match Settings → Shipping). |
| Subscriptions | Label + reassurance line used beside every subscription toggle. |
| Bundles | Multi-buy nudge text shown near Bundler blocks. |
| Trust badges | The four badges used in header drawer, footer, heroes and landing header. |
| Guarantee | Heading + text used on product trust rows and cart summary. |
| Social | Footer + Organization schema links. |

Every section heading, image, toggle and copy block is editable in the
theme editor — there is no hard-coded storefront content.

## 4. Architecture

```
layout/       theme.liquid · theme.landing.liquid (stripped header/footer) · password.liquid
sections/     30 sections — all OS 2.0, all with schemas & presets
snippets/     price, product-card, selling-plan-picker, bundler-block,
              cart-line-items, free-shipping-bar, ph-image (labelled SVG
              placeholders), icon, meta-tags, schema-organization, …
templates/    JSON templates incl. product.refill, page.landing* ×4,
              page.comparison, full customers/* set, gift_card, password
assets/       base.css (design tokens + all components) · theme.js (custom elements)
config/       settings_schema.json (token system) · settings_data.json
docs/         SEO.md · PRODUCTS.md · content/blog/ · content/policies/
```

**Cart:** AJAX drawer using the Section Rendering API (`?section_id=`),
with full no-JS fallback (forms post to `/cart`). Free-shipping bar
updates live from `cart:updated` events.

**Landing system:** `page.landing*.json` templates use the
`theme.landing` layout — logo + trust badges header, minimal footer, no
nav (keeps paid traffic on-page and UTM params intact). Every section is
reorderable; one primary CTA per page.

## 5. Design decisions (the "why")

- **Typography:** Barlow Condensed ExtraBold for display — Barlow's DNA is
  highway signage: condensed, confident, functional. Exactly the register
  of "SOAK ONCE, WALK AWAY". Body is Source Sans 3, a humanist sans that
  stays warm at small sizes. Both load `swap`ped with full system
  fallback stacks; the webfont toggle kills them entirely if you want
  ultimate speed.
- **Signature moment:** the homepage hero is an inline-SVG scene animated
  with CSS only — a yellow soak band sweeps the fence, day cycles to night
  and back, the grime fades, sparkles land. `prefers-reduced-motion`
  freezes it at the clean end-state. Everything else on the site is
  deliberately disciplined so this one moment carries the brand.
- **Yellow = act here.** The accent appears only on CTAs, the savings pill,
  the free-shipping fill and the comparison table's "us" column — the four
  places we want eyes.
- **Comparison strategy:** columns compare product *categories*
  ("bleach-based cleaners", "spray-on concentrates") so every tick/cross is
  factual and defensible; named competitors appear nowhere in claims.
- **Label-accurate copy:** all safety copy follows the actual product
  label — no "safe around plants/pets" claims (the label directs keeping
  spray off plants and animals and watering surrounds before/after), and
  results are framed as weeks-to-months weather action.
- **Separate products, not variants:** the four SKUs are separate products
  linked by the value-ladder block — cleaner analytics, per-SKU templates
  (refill gets its own), and simpler subscription setup.
- **Coverage figure:** front label says 250 m²/2L, back label 350 m² —
  the site uses 250 (conservative). Flagged in METAFIELDS.md; align with
  the printer.

## 6. Performance & accessibility

- One CSS file, one deferred ES module, zero third-party JS in the theme.
- All below-fold images `loading="lazy"` with `srcset`/`sizes`; hero media
  `fetchpriority="high"`; placeholders are inline SVG (0 requests).
- Fonts: preconnect + `display=swap` + system fallbacks; optional off-switch.
- WCAG AA: visible `:focus-visible` states, focus-trapped dialogs with Esc,
  semantic landmarks, `aria-current`/`aria-live` where state changes,
  44px+ touch targets, `prefers-reduced-motion` respected globally,
  colour pairs (navy on white, navy on yellow) pass AA.
- Structured data: Organization, WebSite, Product+Offer, FAQPage (FAQ page
  only), BlogPosting.

## 7. Pre-launch checklist

- [ ] 4 products created + metafields + templates assigned
- [ ] Selling plans configured (Seal) and % matches savings calculator
- [ ] Bundler tiers live and nudge text matches
- [ ] ReConvert funnel published
- [ ] Pages + blog + menus created; theme-editor product pickers assigned
- [ ] Policies legally reviewed and published
- [ ] Free-shipping threshold matches shipping settings ($79 default)
- [ ] Meta titles/descriptions from docs/SEO.md applied
- [ ] Priority-1 photos swapped in (ASSETS-NEEDED.md)
- [ ] Label coverage discrepancy (250 vs 350 m²) resolved
- [ ] Lighthouse mobile run ≥ 90 on home + product (test on live, not preview)
