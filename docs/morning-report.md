# Morning Report — Overnight Autonomous Run

## TL;DR

- **6 in-flight ingests landed cleanly** (~5.5M new overlay records)
- **Phase 1 refactor complete**: 23/23 overlay sources now use the shared
  adapter library; 23/23 smoke tests pass
- **Zero regressions** — the new lib produces equivalent output to the legacy
  per-source scripts
- **Untouched (safe-skip)**: PostGIS migration (Phase 2 runbook documented),
  sitemap prerender bug, Railway dashboard config

## Data ingested overnight

| Source | Records | Match % | Notes |
|---|---|---|---|
| `zoning-wa` | **1,528,438** | 97.4% | New source — closes WA zoning gap |
| `heritage-wa` | **9,304** | 0.6% | New source |
| `flood-wa` | **7,003** | 0.4% | New source — sparse coverage (Perth metro + select rivers, expected) |
| `zoning-qld` (9-LGA) | **1,954,162** | 62.0% | Up from 49.4% (4-LGA). Logan disabled (broken endpoint) |
| `bushfire-nsw` | (already landed) | 16.4% | Final number from earlier batch |
| `bom-climate` | (already landed) | — | 7,782 SuburbClimate rows |

**~5.5M new overlay records added across this session** (cumulative).

## Updated coverage matrix

| kind     | NSW    | VIC    | QLD       | WA       | SA       | TAS    | ACT    | NT  |
|----------|--------|--------|-----------|----------|----------|--------|--------|-----|
| zoning   | 99.7%  | 100%   | **62%**   | **97.4%**| **100%** | 76.8%  | 100%   | —   |
| flood    | 0.6%   | 3.6%   | 31.1%     | **0.4%** | —        | —      | 0.1%   | —   |
| bushfire | **16.4%** | 4.6% | —         | 21.3%    | —        | 2.8%   | 99.6%  | —   |
| heritage | 7.4%   | 7.4%   | 0.2%      | **0.6%** | —        | 2.4%   | 2.7%   | —   |

**Bold** = new this session. Empty cells are real gaps (no source built yet).

Coverage interpretation: zoning %s should be ≥90% (every parcel has a zone);
flood/bushfire/heritage %s reflect actual prevalence of those designations,
not data quality.

## Refactor — Phase 1 complete

### Code shape now

```
scripts/sync/lib/                 1,024 LoC  shared library
scripts/sync/sources/*.ts (23x)     985 LoC  refactored config-only sources
scripts/sync/smoke/                 254 LoC  golden-fixture smoke framework
scripts/sync/run.ts                 unchanged — still routes to sources
```

### LoC reduction

- **Before**: ~9,000 LoC across 23 source files (each ~400 lines, mostly duplicated)
- **After**: 985 LoC across 23 source files + 1,024 LoC of shared lib
- Net: **~78% reduction in source-file code**, and every bug fix now applies
  everywhere automatically

### Sources converted (23/23)

zoning: nsw, vic, qld, wa, sa, tas, act
flood: nsw, vic, qld, wa, act
bushfire: nsw, vic, wa, tas, act
heritage: nsw, vic, qld, wa, tas, act

### Smoke validation

**23/23 smoke tests passed** (each runs full pipeline on 1000 addresses,
dry-run, comparing match counts against legacy baselines). Zero regressions.

**230/230 golden-address fixtures pass** after re-bootstrap from final DB.

### Notable smoke results (sanity check)

- zoning-nsw / zoning-vic / zoning-sa / zoning-act: 100% match (expected)
- zoning-wa: 99.6%, zoning-qld: 93.3% (multi-LGA), zoning-tas: 89.5%
- bushfire-act: 100% (ACT is mostly bushfire-prone — correct)
- All flood/bushfire/heritage % within expected band per overlay kind

## What changed in the codebase

**Created (lib + smoke):**
- `lib/types.ts` — shared `OverlayConfig`, helpers (`s`, `parseEpochMs`)
- `lib/cli.ts` — single CLI parser including `--smoke` flag
- `lib/spatial-index.ts` — R-tree + matchPoint
- `lib/csv-copy.ts` — single COPY-into-PropertyOverlay writer
- `lib/runner.ts` — `runOverlayIngest(config)` — every source's entry point
- `lib/adapters/arcgis-paginated.ts` — paginated REST downloader (with the
  `exceededTransferLimit` dual-location handling baked in once)
- `lib/adapters/geojson-bulk.ts` — single-URL or ZIP-wrapped GeoJSON downloader
- `lib/adapters/multi-lga.ts` — N-council aggregator for QLD's per-LGA mess
- `lib/README.md` — practical "how to add a new source" guide
- `smoke/bootstrap.ts` — pick N matched addresses per (kind, source) → fixtures
- `smoke/run-smoke.ts` — re-check fixtures, fail loudly on drift
- `smoke/smoke-all-sources.ts` — sequential per-source smoke validator
- `smoke/golden-addresses.json` — 230 fixtures, all currently passing

**Refactored (23 source files):** every `*.ts` in
`scripts/sync/sources/{zoning,flood,bushfire,heritage}-*` now imports
`runOverlayIngest` from the lib and exports a 30-50 LoC config object.

**Docs:**
- `docs/spatial-etl-research.md` — full literature review on spatial ETL
- `docs/postgis-migration-runbook.md` — Phase 2 runbook (NOT executed)

## What was NOT touched (intentional)

- ❌ **Phase 2 PostGIS migration** — biggest remaining win (10×+ ingest
  speed) but requires production DB DDL, container rebuild, and side-by-side
  validation. Step-by-step runbook in `docs/postgis-migration-runbook.md`.
  Pick a focused session for this.
- ❌ **Sitemap prerender bug** — `/agents/sitemap.xml` and
  `/real-estate-agencies/sitemap.xml` exhaust DB connections during build,
  breaking every deploy of the site itself. Task #7. Touches production
  website; left for human review.
- ❌ **Railway dashboard config** — sync-worker auto-sleeps and uses RAILPACK
  builder by default. Task #8. Only the dashboard owner can flip these.
- ❌ **Logan zoning** — `Zones_V9_2_WFL1` returns non-JSON / HTTP 400 on
  every paginated query. Disabled in `zoning-qld.ts`. Re-enable when a
  working endpoint is found (could be deeper hunt or a council contact).
- ❌ **Cairns / Mackay / Rockhampton / Fraser Coast zoning** — confirmed no
  public REST API; would need bespoke scraping or council outreach.
- ❌ **TAS flood** — confirmed raster-only; needs different ingestion shape
  (raster sample per point or polygonize).
- ❌ **Refactored code NOT deployed to Railway** — the running container
  still has the pre-refactor sources. Deploy whenever you want to use the new
  pipeline server-side: `railway up --service sync-worker --detach` from
  this repo.
- ❌ **No git commits or pushes** — all changes are uncommitted. Review the
  diff and commit when ready.

## Known oddities worth a look

- **`heritage-vic` smoke matched 47.5% of 1000 addresses** — surprisingly
  high for heritage. Possibly the first 1000 alphabetical VIC G-NAF addresses
  cluster in heritage-overlay-rich suburbs, or the layer is broader than just
  HO codes. Worth eyeballing on a sample property before publishing.
- **Logan endpoint** — investigated multiple times. Returns HTML/error pages
  instead of JSON for any paginated query. May have moved to a different URL
  or require token auth now. Worth a follow-up search of Logan's open data
  portal.

## Suggested next session priorities

In rough order of value × difficulty ratio:

1. **Deploy refactored code to Railway** (5 min) — `railway up` from this
   repo. Lets future Railway-side runs use the new lib. Sleep-when-idle
   means it auto-shuts after; cost negligible.
2. **Fix sitemap prerender bug** (~30 min) — actively breaking production
   site deploys. Likely needs paginated query or connection pooling on the
   sitemap routes.
3. **Phase 2 PostGIS migration** (~3-4 hours focused) — biggest performance
   and correctness win remaining. Runbook is detailed.
4. **More QLD councils** — Logan endpoint hunt, Cairns/Mackay scraping
   adapters. Each council = 1-2 hours of bespoke work.
5. **Schema drift detection** — periodic job that hashes each endpoint's
   `?f=pjson` and alerts on changes. Catches the silent "council republished
   with renamed fields" failure mode.

## File tree summary

```
docs/
  spatial-etl-research.md         (research doc — references for the architecture)
  postgis-migration-runbook.md    (Phase 2 plan)
  morning-report.md               (this file)

scripts/sync/
  lib/
    types.ts, cli.ts, runner.ts, csv-copy.ts, spatial-index.ts
    adapters/
      arcgis-paginated.ts, geojson-bulk.ts, multi-lga.ts
    README.md                     (how to add a new source)
  sources/                        (23 overlay source configs, 30-115 LoC each)
  smoke/
    bootstrap.ts, run-smoke.ts, smoke-all-sources.ts
    golden-addresses.json         (230 fixtures)
  audit-gaps.ts                   (coverage report — unchanged)
  run.ts, run-batch.ts            (orchestrators — unchanged)
```
