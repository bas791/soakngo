# SEO Plan — Soak n Go

Meta titles/descriptions to paste into Shopify admin (Search engine
listing section on each page/product), plus the query map each page
targets. NZ English throughout.

## Query → page map

| Target query cluster | Page |
|---|---|
| soak n go, soak and go cleaner | Homepage |
| house wash without bleach, no bleach house wash nz | Landing: Ditch the bleach + Blog post 1 |
| wet and forget alternative nz, spray and forget alternative | Blog post 2 + Comparison page |
| 30 seconds vs, bleach exterior cleaner comparison | Comparison page |
| moss and mould remover nz, moss killer fence/path/roof | Homepage, Collection, Blog post 1 |
| best house wash nz | Landing: The pro's choice |
| house wash subscription, never run out | Landing: Never run out |
| how often wash house nz | Blog post 3 |

## Homepage
- **Title:** Soak n Go — No-Bleach Exterior Cleaner NZ | Soak Once, Walk Away
- **Description:** NZ-made outdoor surface cleaner for houses, fences, decks, paths and roofs. No acid, no bleach, no scrub, no rinse — clicks onto your hose and the weather does the work. Free NZ shipping over $79.

## Collection (All products)
- **Title:** Shop Soak n Go — Hose-End, Refills & Concentrate | NZ Exterior Cleaner
- **Description:** One no-bleach formula, four sizes. 2L hose-end sprayer for fences and paths, refills on Subscribe & Save, 5L and 20L concentrate for bigger jobs. NZ made & owned.

## Products
- **2L Hose-End Sprayer — Title:** Soak n Go 2L Hose-End Sprayer — No-Mix Outdoor Surface Cleaner
  **Description:** Clicks straight onto your garden hose — no mixing, no scrubbing, no rinsing. Covers up to 250 m² of fences, decks, paths and walls. No acid, no bleach. NZ made.
- **2L Refill — Title:** Soak n Go 2L Refill — Subscribe & Save and Never Run Out
  **Description:** Keep your sprayer, click in a refill. Cheapest on Subscribe & Save with a discount on every delivery — pause, skip or cancel anytime. NZ made, no bleach.
- **5L Concentrate — Title:** Soak n Go 5L Concentrate — Whole-House Value | No Bleach
  **Description:** The value tier for bigger properties. Covers around 625 m², best per-litre pricing short of the trade tier. No acid, no bleach, no rinse.
- **20L Concentrate — Title:** Soak n Go 20L Concentrate — Trade & Lifestyle Block Tier
  **Description:** Serious coverage for lifestyle blocks, sheds, long fences and committed DIYers. Best per-litre value in the range. NZ made by professional exterior cleaners.

## Pages
- **Comparison (/pages/soak-n-go-vs-the-others) — Title:** Soak n Go vs Bleach Cleaners & Spray-On Concentrates (NZ Comparison)
  **Description:** Honest, feature-by-feature comparison: no bleach, no mixing, hose-end application, NZ made, Subscribe & Save. See how the walk-away method stacks up.
- **FAQ — Title:** Soak n Go FAQs — Using It, Safety, Coverage, Subscriptions
  **Description:** How long it takes to work, what it treats, roof and water-tank precautions, coverage per bottle, and how Subscribe & Save works. Straight answers from the pros.
- **About — Title:** About Soak n Go — Made by the Pros Who Wash Buildings for a Living
  **Description:** Soak n Go is made by Maximum Wash Ltd, a professional NZ exterior cleaning company. The product we'd use at home — no acid, no bleach, no scrub, no rinse.
- **Contact — Title:** Contact Soak n Go — Product Help & Order Support NZ
  **Description:** Questions about the product, your order or your subscription? We reply within one working day. Big job? Maximum Wash can quote your building wash.

## Landing pages (paid traffic — set to noindex if running heavy ad spend, or index if you want the SEO)
- **Ditch the bleach — Title:** House Wash Without Bleach NZ — Ditch the Bleach | Soak n Go
  **Description:** Fast bleach results get rinsed down the drain. Soak once with a no-bleach, no-acid cleaner and let NZ weather do the work. No scrubbing, no rinsing.
- **Never run out — Title:** Soak n Go Subscribe & Save — Refills Delivered Before You Run Out
  **Description:** Put refills on autopilot: save on every delivery, pause or cancel anytime from your email. The houses that always look washed are just on a rhythm.
- **The pro's choice — Title:** Best House Wash NZ? Ask the Pros Who Wash Buildings Daily | Soak n Go
  **Description:** Made by Maximum Wash, a professional exterior cleaning company across Auckland, Tauranga and Christchurch. The product the pros would use at home.

## Blog posts
Meta titles/descriptions are in each post file: `docs/content/blog/*.md`.

## Structured data (already built into the theme)
- Organization + WebSite (homepage, `snippets/schema-organization.liquid`)
- Product with Offer (product pages, `sections/main-product.liquid`)
- FAQPage (FAQ page — the `enable_schema` toggle is ON only there)
- BlogPosting (articles, `sections/main-article.liquid`)

## Housekeeping
- Set the homepage title/description in Online Store → Preferences.
- Keep one FAQPage schema per site (already enforced via the toggle).
- Landing pages have no nav, so add them to the sitemap deliberately or
  noindex them depending on strategy.
- Register the `soakngo.co.nz` domain in Shopify → Domains and set as primary
  so canonical URLs resolve correctly.
