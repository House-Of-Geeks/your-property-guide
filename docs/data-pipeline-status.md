# Data Pipeline Status — 2026-05-06

A snapshot of which sync sources are populated on production
(`Postgres-PostGIS` / `nozomi.proxy.rlwy.net:27903`), what's broken,
and what needs to be done.

## Cron schedule (Railway)

Per commit `16ddec9`, four cron services run on Railway production:

| Service | Schedule | Script | Coverage |
|---|---|---|---|
| `sync-cron-quarterly`       | `0 2 1 1,4,7,10 *` (Jan/Apr/Jul/Oct 1) | `scripts/cron/quarterly.sh`       | rental, crime, sales, suburb metadata |
| `sync-cron-annual-hazards`  | `0 4 1 4 *` (Apr 1)                    | `scripts/cron/annual-hazards.sh`  | hazard-flood, hazard-bushfire, walkability, bom-climate |
| `sync-cron-annual-overlays` | `0 6 15 4 *` (Apr 15)                  | `scripts/cron/annual-overlays.sh` | catchments, zoning, flood/bushfire/heritage overlays |
| `sync-cron-annual-schools`  | `0 3 15 3 *` (Mar 15)                  | `scripts/cron/annual-schools.sh`  | acara-schools, abs-census, sales-abs/qld/wa, housing-rai, crime-wa |

## Source coverage matrix (production)

| Source | State coverage | Notes |
|---|---|---|
| `abs-census` | All 8 states populated | ~70-94% per state. ~30% gaps are suburbs missing from 2021 ABS SAL geography. |
| `acara-schools` | National (9,693 schools) | OK |
| `bom-climate` | partial (~40-55%) | ACT was 0% — fixed in this session. |
| `rental-vic/nsw/sa/qld` | populated | NT/TAS/WA/ACT use Census fallback (no state-specific source) |
| `housing-rai` | populated | RAI from SGS Economics |
| `sales-nsw` | 58% | Working. |
| `sales-vic` + `sales-vic-historical` | 21% | Limited public data. |
| `sales-qld` | 60% | Working. |
| `sales-sa` + `sales-sa-historical` | 0% (sales-stat) / 56% (suburbs) | Was added in commit `0ccc411`; needs prod run. |
| `sales-wa` | 69% | Working. |
| `sales-abs` | National | Annual fallback. |
| `crime-nsw/vic/sa/act` | 50-71% suburb-level | Working. |
| `crime-qld` | 0% suburb-level / 78 LGA-level rows | LGA-only by design (QLD Police only publishes by LGA). UI now has LGA-fallback rendering (ships in `4a5be06`). |
| `crime-nt` | NEW — running first time this session | Region-level (Darwin / Palmerston / Alice Springs / Katherine / Tennant Creek / Nhulunbuy / NT Balance). Same LGA-fallback rendering applies. |
| `crime-wa` | 0% — **DISABLED** | WA Police migrated to wa.gov.au in Oct 2024 and never republished suburb XLSX. **TODO:** find current URL → set `WA_CRIME_EXCEL_URL` Vercel env var → run. See `crime-wa.ts` script comment. |
| `hazard-flood` | 0 rows in `SuburbHazard` | Cron-scheduled for Apr 1 (annual). Ran on May 2 with 0 records — likely WFS query issue or filter excluding everything. **TODO:** investigate or rerun manually. |
| `hazard-bushfire` | 0 rows in `SuburbHazard` | Same as flood — runs OK status but produces 0 records. **TODO:** investigate. |
| `walkability` | 0 / 18,000 suburbs | Hits Overpass API at 1 req/sec (rate limit) — full run takes ~5 hours. Should run via Railway cron (annual). **TODO:** verify it actually completes via cron next April; consider splitting into chunks if needed. |
| `flood-*` / `bushfire-*` / `heritage-*` / `zoning-*` (per state) | varies | Property-level overlays (`PropertyOverlay` table). Run annually via `sync-cron-annual-overlays`. |
| `catchment-*` (per state) | varies | School catchment overlays. Some states (TAS-secondary, WA, NT, SA) have no source. |

## Open TODOs (data side)

### High value
1. **WA crime URL** — find new wa.gov.au URL since Oct 2024 migration. Set `WA_CRIME_EXCEL_URL` env var; existing `crime-wa.ts` will then work.
2. **Hazard sync investigation** — `hazard-flood` and `hazard-bushfire` run with `status=ok` but write 0 rows to `SuburbHazard`. Likely a query/parsing/insert bug. Without this, suburb risk badges (flood, bushfire) never display.
3. **Run `walkability` once** — manually kick off the Railway cron service or wait until Apr 1 2027. Without it `walkScore` / `transitScore` / `bikeScore` fields are all null on every suburb page.

### Medium value
4. **TAS crime** — only published as PDF annual reports. Would need PDF parsing (likely several hours of dev to do reliably). May not be worth it.
5. **NT suburb-region mapping** — `crime-nt` stores at region level (LGA-style). UI fallback uses suburb's `region` field. Need to verify NT suburbs have meaningful `region` values that match the 7 NT crime regions.
6. **Sales-SA prod run** — `sales-sa` and `sales-sa-historical` were added recently but haven't populated `SuburbSalesStat` for SA suburbs.
7. **Chartwell-style data quality** — small VIC suburb shows population 119,201 (clearly a Werribee aggregation) and householdsFamily 0 (not in 2021 SAL). Audit other small suburbs for similar issues.

### Lower value / future
8. **TAS bushfire / TAS catchment-secondary / WA catchment / NT zoning + heritage** — no sync sources exist. Would need new ingest scripts per state if data sources can be found.

## Open TODOs (rendering / cost side)

1. **Filter pages caching** — `/buy`, `/rent`, `/sold`, `/suburbs`, `/agents`, `/schools` still serve `cache-control: private`. Suspense refactor in `88c7556` didn't fix it (Next 16 marks dynamic when ANY descendant reads `searchParams`). Real fix: enable PPR (experimental) or move filters fully client-side. Currently each filter page hit = one Vercel function invocation.
2. **PostGIS school geom migration** — `scripts/postgis/2026-05-add-school-geom.sql` adds GIS column + GIST index to `School`. Property pages currently fall back to haversine (slower but works). Migration is safe + idempotent; just needs `psql -f` against prod.

## What the `lastFetchedAt` audit means

The `DataSource` table looked empty (all "never") but data was clearly written — the field is only set by `startSync()`/`finishSync()`, and many rows existed but had stale/null fetch timestamps. After running syncs in this session, timestamps are now populated for `abs-census`, `crime-*`, `bom-climate`, `crime-nt`. The audit's "never" finding was misleading on first read; the fix is to ensure `startSync()` always touches `lastFetchedAt` (it does, via `update`).
