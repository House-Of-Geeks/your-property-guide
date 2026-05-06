# Data Pipeline Status — 2026-05-07

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
| `crime-wa` | 15 District-level rows (FY 2025-26) | **REWRITTEN** in `c9a1b27` to ingest the post-migration district XLSX. Mandurah district top with 14,595 offences. **GAP**: WA suburb `region` field carries LGA names that don't match Police district names — needs an LGA→District mapping in `data-freshness.ts` for display. |
| `hazard-flood` | 0 rows in `SuburbHazard` | **BROKEN UPSTREAM**: GA AFRIP retired the polygon WFS — only point metadata exists at the new ArcGIS endpoint. Script needs full rewrite to either aggregate from `PropertyOverlay` (data already in DB) or query each state's flood feature service. |
| `hazard-bushfire` | 0 rows in `SuburbHazard` | **BROKEN UPSTREAM**: 4 of 5 state URLs stale (VIC GeoServer typeName changed, QLD service moved, SA UUID changed, WA HTML page). NSW URL still works but somehow produces 0 rows — needs deeper debug. Replacement candidates per state listed below. |
| `walkability` | 0 / 18,000 suburbs | Script optimised in `9c8676c` — 3s delay, 429/504 backoff, per-suburb commit, resume support. Should now complete reliably via cron. Ran out of time this session because the in-flight Railway run is using older build. |
| `flood-*` / `bushfire-*` / `heritage-*` / `zoning-*` (per state) | varies | Property-level overlays (`PropertyOverlay` table). Run annually via `sync-cron-annual-overlays`. |
| `catchment-*` (per state) | varies | School catchment overlays. Some states (TAS-secondary, WA, NT, SA) have no source. |

## Open TODOs (data side)

### High value — confirmed broken upstream sources

#### `hazard-flood` — GA AFRIP retired the polygon WFS
- Old URL `https://www.ga.gov.au/geoserver/ows?service=WFS&typeName=AFRIP:FHZ_Level_1` → 404.
- AFRIP migrated to ArcGIS Online (item `40a5a6f713724c44994406bf6369cd17`, REST: `https://services-ap1.arcgis.com/ypkPEy1AmwPKGNNv/arcgis/rest/services/flood_study_summary_3ce61/FeatureServer`).
- New service has **POINT-only flood-study metadata**, NOT polygon flood-hazard zones. The original `FHZ_Level_1` data is no longer published.
- **Fix**: rewrite `hazard-flood.ts` to either (a) aggregate per-suburb risk from `PropertyOverlay` rows already populated by `flood-nsw/vic/qld/wa/act` ingests, or (b) query each state's flood feature service directly (different endpoint per state).

#### `hazard-bushfire` — 4 of 5 state URLs stale
| State | Status | Replacement candidate |
|---|---|---|
| NSW | ✅ 200 OK | (current URL works — script needs deeper debug for why 0 rows) |
| VIC | ❌ "Feature type unknown" | `discover.data.vic.gov.au/dataset/designated-bushfire-prone-area-bpa` |
| QLD | ❌ "Service not found" | `data.qld.gov.au/dataset/bushfire-prone-area-queensland-series` (multiple regional resources) |
| SA | ❌ 404 | `https://www.dptiapps.com.au/dataportal/BushfireProtectionAreas_geojson.zip` |
| WA | ❌ HTML page | Hunt on `data.wa.gov.au` |

#### `crime-wa` — no suburb-level data published
WA Police migrated to wa.gov.au Oct 2024 and never republished suburb-level data. Power BI only covers districts. Third-party aggregators (Burb Score, OpenStats, Red Suburbs) repackage scraped data with no API. Practical options: (a) accept gap, (b) contact WA Police, (c) scrape Power BI (fragile).

#### `crime-tas` — PDF only
Tasmania Police only publishes annual Crime Statistics Supplements as PDFs. No structured CSV/XLSX/JSON. Would need ~half-day dev to add a `pdfplumber`-based parser if worth doing.

### Medium value
1. **`walkability` first run** — kicked off in this session; ~5 hours due to Overpass throttling. Will continue running after session ends.

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
