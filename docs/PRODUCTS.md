# Product Seed Data — Soak n Go

Create these four products in Shopify admin (or via the Shopify MCP/API).
Prices are placeholders on a deliberate per-litre value ladder — adjust to
your real pricing, keeping the per-litre trend (bigger = cheaper per litre,
refill cheaper than sprayer).

After creating, set the metafields from `METAFIELDS.md`, assign the
templates shown, and add all four to a "Shop" collection (plus set the
main menu to link to it).

---

## 1. Soak n Go 2L Hose-End Sprayer  *(hero / acquisition)*

- **Template:** `product` (default)
- **Price:** $49.95 · **SKU:** SNG-2L-HOSE
- **Metafields:** volume 2 · coverage 250 · flag "Most popular" · blurb "Clicks onto the hose. Fences, decks, paths — no mixing."

**Description (publish-ready):**

Outdoor surface cleaner in a bottle that clicks straight onto your garden
hose. No acid, no bleach, no scrub, no rinse — soak once, walk away, and
the weather does the work on mould, algae, lichen and moss.

The hose-end sprayer has four spray functions (wide, fan, stream and
high-reach) so you can do the fence and the top of the gable without a
ladder. Covers up to 250 m² — an average single-storey house, or a fence
plus the paths with change left over.

**How to use:** Water surrounding plants and grass first. Shake well, click
onto the hose, check pressure on RINSE, turn to CLEAN and soak the dry
surface — ground up on walls. Turn OFF, walk away, do not rinse. Apply on a
dry day with no rain expected for 12 hours. Growth browns off and weathers
away over the following weeks; stubborn stains can take a few months.
Always read the label and SDS before use.

## 2. Soak n Go 2L Refill  *(Subscribe & Save anchor)*

- **Template:** `product.refill`
- **Price:** $39.95 one-time · subscription discount via selling plan (suggest 15%) · **SKU:** SNG-2L-REFILL
- **Metafields:** volume 2 · coverage 250 · flag "Best on subscription" · blurb "Keep the sprayer, click in a refill. Cheapest on Subscribe & Save."

**Description (publish-ready):**

Keep your hose-end sprayer, click in a refill, keep the place immaculate.
Same formula, same 250 m² coverage, less plastic and a better price.

On Subscribe & Save it's better again: a discount on every delivery, on a
rhythm that suits your place (most homes do well on every 3 months). You
get an email before each charge, and you can pause, skip or cancel anytime
from a link in that email. No lock-in, no phone calls.

## 3. Soak n Go 5L Concentrate  *(value tier)*

- **Template:** `product` (default)
- **Price:** $89.95 · **SKU:** SNG-5L-CONC
- **Metafields:** volume 5 · coverage 625 · flag "Best value per litre" · blurb "The whole house, with change left over."

**Description (publish-ready):**

The value tier for bigger properties. Five litres of the same
professional-thinking formula, covering around 625 m² — the whole house,
the fence line, and the path you've been ignoring. Use with a hose-end
applicator or sprayer as directed. Per-litre, it's meaningfully cheaper
than the 2L — the calculator on this page will tell you if your job
justifies it (it probably does).

## 4. Soak n Go 20L Concentrate  *(trade tier)*

- **Template:** `product` (default)
- **Price:** $279.00 · **SKU:** SNG-20L-CONC
- **Metafields:** volume 20 · coverage 2500 · flag "Trade tier" · blurb "Lifestyle blocks and the seriously committed."

**Description (publish-ready):**

The tier we sell to people who own a paddock, a long driveway, three
outbuildings and strong opinions about moss. Twenty litres, roughly
2,500 m² of coverage, and the best per-litre price in the range. If you're
doing the whole lifestyle block — or you're a tradie topping up between
professional washes — this is your drum.

---

## Also create

- **Collection:** "Shop Soak n Go" (handle `all` works too) with all four products, in ladder order.
- **Pages:** About (`page.about`), FAQ (`page.faq`), Contact (`page.contact`),
  "Soak n Go vs the others" (`page.comparison`, handle `soak-n-go-vs-the-others`),
  and the three landing pages: "Ditch the bleach" (`page.landing-ditch-the-bleach`),
  "Never run out" (`page.landing-never-run-out`), "The pro's choice" (`page.landing-pros-choice`).
- **Blog:** "The Soak Files" with the three posts from `docs/content/blog/`.
- **Menus:** Main menu → Shop, How it works (/#how-it-works), Compare, FAQ, About, Contact.
  Footer menu → FAQ, Shipping, Returns, Contact, Blog.
- **Coverage note:** front label says 250 m² per 2L, back label says 350 m² —
  resolve with the printer and align site copy (see METAFIELDS.md).
