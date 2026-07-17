# Metafield Setup Guide — Soak n Go theme

The theme reads a small set of product metafields. Set them up once in
**Shopify admin → Settings → Custom data → Products → Add definition**,
then fill them in on each product. Everything degrades gracefully — a
missing metafield simply hides that feature for that product.

All definitions use the namespace **`soakngo`**.

| Definition name | Namespace & key | Type | Used for |
|---|---|---|---|
| Volume (litres) | `soakngo.volume_litres` | Integer | Per-litre pricing on cards, product page and the value ladder |
| Coverage (m²) | `soakngo.coverage_m2` | Integer | "Covers up to X m²" lines and both coverage calculators |
| Card flag | `soakngo.flag` | Single line text | Badge on product cards, e.g. "Most popular", "Best value" |
| Card blurb | `soakngo.card_blurb` | Single line text | One-line "who it's for" on product cards |
| Before image | `soakngo.before_image` | File (image) | Product-page before/after slider (before) |
| After image | `soakngo.after_image` | File (image) | Product-page before/after slider (after) |

## Values for the four SKUs

Coverage figures below use the label's front-of-pack claim (2L covers up
to 250 m²). **Note:** the current back label says "up to 350 m²" for 2L —
resolve this discrepancy with the label printer, then make the site match
the label. Concentrate figures are pro-rata placeholders — replace with
tested numbers.

| Product | volume_litres | coverage_m2 | flag | card_blurb |
|---|---|---|---|---|
| 2L Hose-End Sprayer | 2 | 250 | Most popular | Clicks onto the hose. Fences, decks, paths — no mixing. |
| 2L Refill | 2 | 250 | Best on subscription | Keep the sprayer, click in a refill. Cheapest on Subscribe & Save. |
| 5L Concentrate | 5 | 625 | Best value per litre | The whole house, with change left over. |
| 20L Concentrate | 20 | 2500 | Trade tier | Lifestyle blocks and the seriously committed. |

## Where the theme reads them

- `snippets/product-card.liquid` — flag, blurb, coverage, per-litre price
- `snippets/price.liquid` — per-litre price
- `sections/main-product.liquid` — coverage line, per-litre, value ladder,
  inline coverage calculator, before/after metafield images
- `sections/coverage-calculator.liquid` — coverage per SKU

## Content that does NOT use metafields (by design)

Comparison-table rows, FAQ questions and landing-page proof points are
section **blocks**, editable in the theme editor — faster for a
one-brand store than metaobject round-trips. If you later want them as
structured data (e.g. to reuse across channels), migrate them to
metaobjects and swap the section loops; the markup is already
block-per-row.
