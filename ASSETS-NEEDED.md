# ASSETS-NEEDED — Soak n Go shot list

Every image slot in the theme currently renders a labelled SVG placeholder.
Swap photos in via the theme editor (sections) or product admin
(product images / metafields) — no code changes needed.

**Already supplied:** final label artwork (front + back, 2L). Export
flat renders from the label files for use in product images and social
share cards.

## Priority 1 — needed for launch

| # | Shot | Where it appears | Size / ratio | Art direction |
|---|---|---|---|---|
| 1 | Bottle on white — 2L Hose-End Sprayer | Product page gallery, product cards, cart | 2000×2000 (1:1) | Clean studio shot, label facing camera, soft shadow. This is the hero SKU. |
| 2 | Bottle on white — 2L Refill | Same | 2000×2000 | Same setup, consistent lighting across all four. |
| 3 | Bottle on white — 5L Concentrate | Same | 2000×2000 | Same setup. |
| 4 | Bottle on white — 20L Concentrate | Same | 2000×2000 | Same setup. |
| 5 | HERO — sprayer clicked onto hose, house background | Homepage hero (optional photo replacing the animation), landing heroes | 1200×900 (4:3) | Hands clicking the bottle onto a garden hose, tidy Kiwi weatherboard house soft-focus behind. Golden hour. This is the money shot. |
| 6 | BEFORE — mossy fence | Homepage before/after slider (left) | 1200×750 (16:10) | Timber fence with real moss/mould. Tripod position marked — shot 7 must match exactly. |
| 7 | AFTER — same fence, weeks later | Homepage before/after slider (right) | 1200×750 | Identical framing, lens and time of day. The pair is the proof — don't cheat the angle. |

## Priority 2 — strongly recommended

| # | Shot | Where it appears | Size / ratio | Art direction |
|---|---|---|---|---|
| 8 | BEFORE/AFTER — grimy path or driveway pair | Product-page before/after slider (via `soakngo.before_image` / `after_image` metafields) | 1200×750 each | Concrete path half-green, then clean. Same-angle discipline as 6/7. |
| 9 | Crew washing a building | About page, "Pro's choice" landing page | 1200×900 | Maximum Wash crew, branded gear, water arcing — credibility shot. |
| 10 | Bas — founder portrait | About page founder note | 1200×900 | On site, not in a studio. Hi-vis over handshake. |
| 11 | Refill at the front door | "Never run out" landing hero | 1200×900 | Parcel/bottle on a doorstep, morning light. Subscription lifestyle shot. |
| 12 | In-use detail — spray pattern on wall | Product gallery slot 2–3, blog posts | 2000×2000 | Fan spray hitting weatherboard, droplets visible. |

## Priority 3 — nice to have

| # | Shot | Where | Notes |
|---|---|---|---|
| 13 | Roof before/after pair | Blog, comparison page | The label's own roof pair sets the style. |
| 14 | Social/OG share card | Meta tags fallback | 1200×630, logo + "SOAK ONCE, WALK AWAY." |
| 15 | Favicon | Theme settings → Favicon | 64×64 from the droplet logo mark. |
| 16 | Blog hero images ×3 | The three seeded posts | 1400×788 (16:9), one per post topic. |

## Placeholder inventory (what the labels say on-site today)

Search the codebase for `ph-image` to find every slot. Labels used:
`PRODUCT — bottle on white`, `HERO — sprayer on hose, house behind`,
`BEFORE — mossy fence, same angle`, `AFTER — clean fence, same angle`,
`BEFORE — grimy surface, same angle`, `AFTER — clean surface, same angle`,
`PHOTO — crew washing a building`, `PHOTO — Bas, founder portrait`,
`HERO — 2L refill bottle at the front door`, `BLOG — article hero image`.
