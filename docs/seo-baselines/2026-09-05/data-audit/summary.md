# Production data-quality audit — 5 Sep 2026 (read-only)

Run with `scripts/seo/audit-data-quality.ts` against production (17,994 suburbs). CSVs alongside this file.

## Headline
- Only **1,847 suburbs (10%)** show a median price. 15,845 store one but suppress it because `statsSource` is not a sales feed.
- **The quarterly cron on 1 July ran two days before the fix that stops rental feeds overwriting `statsSource`** (be3def1, 3 Jul). Result: NSW 5,049, SA 1,647 and QLD 293 suburbs carry `rental-*` as their sales provenance (stamped 2026-07-01); VIC 2,732 carry `rental-vic` from the 3 May run. `sales-nsw` no longer appears as a provenance at all: **every NSW suburb page has shown no price since 1 July.**
- Region-relative gate in report mode: 357 of 1,847 priced suburbs are >25% off their region median, but the top of the list is real premium suburbs (Springfield SA +316%, Tennyson +226%, Toorak +143%, New Farm +130%, Byron Bay +123%). **A region gate would suppress correct medians on the most valuable pages. Do not build it.**
- Morayfield ($1,095,000) is `sales-abs`, +22% vs the Moreton Bay region median ($897,000, n=23): inside any sane gate. ABS SA2 areas are not suburbs (the Morayfield SA2 includes rural-residential lots), so ABS-sourced medians need an "ABS statistical area" label, not a gate.
- **The NSW "house" median is a non-strata-residence median that includes flats.** `sales-nsw` aggregates Valuer General nature code R, but R covers company-title and other non-strata apartments sold with a unit number. Production sales rows since 2023 (read-only):

  | Suburb | Year | R (what the feed uses) | R with no unit number | Market (sources Google cites) |
  |---|---|---:|---:|---:|
  | Bondi | 2025 | $1,730,000 (n=142) | $4,300,000 (n=35) | $4.25M–$4.6M |
  | Bondi | 2024 | $1,625,000 (n=226) | $3,775,000 (n=45) | |
  | Cronulla | 2025 | $1,350,000 (n=543) | $3,400,000 (n=98) | ~$3M+ |
  | Mosman | 2025 | $3,000,000 (n=491) | $5,600,000 (n=228) | |

  Filtering on "no unit number" alone reproduces the market figure (adding a land-area floor changes nothing). Every NSW suburb with apartments is affected. Fix the aggregate filter before re-running `sales-nsw`, or the repaired provenance re-exposes wrong house medians on 5,000 pages.
- **"Days on market" from `sales-nsw` is settlement minus contract date**, i.e. the settlement period: Bondi, Cronulla and Badagarang all show 42 days. Relabel as settlement period or drop it.
- Population is copied from a wider area for **2,094 suburbs**: 311 population values are each shared by ≥3 suburbs (85,500 shared by 30 Mackay suburbs; 115,218 by 23 Toowoomba suburbs). Badagarang's 48,267 residents and "Unincorp. Other Territories" region are this fallback.
- 831 suburbs have |annual growth| > 25% (already clamped to "unknown" at render).

## What to do instead of a gate (in order)
1. Fix the `sales-nsw` aggregate: house median = nature R **and no unit number**; stop writing settlement period as days on market. Add a unit test on captured rows.
2. Re-run `sales-nsw`, `sales-vic`, `sales-sa`, `sales-abs` with the fixed code to restore provenance (or wait for the 1 Oct cron). Restores prices on ~9,900 pages.
3. Stop the census fallback copying LGA/postcode populations onto localities; store null and say "not published for this locality".
4. Label `sales-abs` medians as ABS statistical-area medians with the area name and year.
5. Render provenance (source, period) under every median; keep the existing growth clamp and price bounds.
