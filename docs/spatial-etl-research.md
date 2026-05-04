# Spatial ETL Refactor — Research Report

> Compiled May 2026 from a focused literature review. Audience: anyone working
> on the `scripts/sync` overlay-ingestion pipeline.

You're rebuilding what is essentially a **government-data aggregator with a
spatial join engine bolted on**. The literature is clear about what shape this
should take. Below is the opinionated digest, ordered by what will actually
move the needle for our context (TS/Node, ~12 active sources, 20M G-NAF points,
Postgres backend, single-developer team).

## 1. Architecture: stop doing point-in-polygon in Node

This is the single highest-leverage change. With 20M G-NAF points and 12+
overlay datasets, **rbush + turf in JS is the wrong tool**. The PostGIS
workshop and Crunchy Data both spell out why: `ST_Contains` automatically uses
a GIST index to do a "two-pass" filter (bbox → exact), which on properly-
indexed datasets at our scale is typically 10–100× faster than application-
layer R-tree because it avoids serialising 20M points across a TCP socket.

**Recommended architecture:**
- Land each source as raw GeoJSON / GeoParquet in object storage (R2 / S3) —
  never re-download to re-process.
- `ogr2ogr` (GDAL) the raw file into a `staging.<source>_<runId>` table.
  ogr2ogr handles MultiPolygon, antimeridian, CRS reprojection, and schema
  sniffing in one battle-tested binary; reimplementing this in TS is a tax we
  keep paying.
- Run `ST_Subdivide` on the staging polygons (Paul Ramsey's blog, Crunchy Data
  benchmarks: 4–60× speedup for point-in-polygon because subdivided bboxes are
  tighter and fit on a single page). Especially valuable for flood/bushfire
  layers where individual polygons can be huge.
- Single SQL:
  `INSERT INTO PropertyOverlay SELECT … FROM PropertyAddress JOIN staging USING ST_Contains`
  — let Postgres do the join.

We keep `node-pg COPY` for what it's good at (raw bulk load), and remove turf /
rbush from the hot path.

## 2. Pitfalls — what to harden against

Confirmed pitfalls per the Esri docs and the koopjs issue tracker:

- **Always** rely on `exceededTransferLimit`, not on
  `features.length < resultRecordCount`. Esri explicitly documents that
  internal spatial-index filtering can return short pages mid-stream, and even
  zero-result pages with `exceededTransferLimit: true`. Loop until the flag is
  absent.
- `maxRecordCount` upper limit is **2,000 for polygons** (16,000 for points).
  Don't waste a request asking for more.
- Don't use `outFields=*` blindly — request only what your schema-mapper needs.
  Keeps payload down and reduces "schema drift" surface area.
- Always pass `outSR=4326` and trust the server reprojection rather than
  reprojecting yourself; the NSW Spatial info sheet documents the **1.8 m
  WGS84/GDA94 misalignment** that bites everyone who hand-rolls datum
  conversion. With G-NAF in GDA94/2020, this matters at parcel boundaries.
- ArcGIS Server timeouts: many council servers will silently truncate at 60 s.
  Implement per-request retry with exponential backoff and a tiled fallback
  (split bbox in 4) when a page fails.
- Things we may not have hit yet: **antimeridian-crossing polygons** (rare in
  AU but Norfolk Island / Christmas Island), **invalid self-intersecting
  polygons** (run `ST_MakeValid` after every load — non-negotiable), **stale
  ETag caches** when council republishes without changing filename.
- The `exceededTransferLimit` field is wrapped under `properties` in GeoJSON
  output for some ArcGIS Server versions, top-level for others. Check both.

## 3. Idempotency: the right primitives

Consensus pattern from the data-engineering literature (Airbyte, Spark
Playground, Start Data Engineering):

- **Composite natural key** per overlay row:
  `(propertyId, overlayKind, sourceId, sourceObjectId)`. Use it as the
  conflict target.
- **`runId` on every write**, plus a `runs` table tracking
  start / finish / source-version-hash / row-count. Lets you `WHERE runId = ?`
  for everything.
- **Replace-by-source pattern**: wrap each source in a transaction —
  `INSERT INTO overlay_new ... ; DELETE FROM overlay WHERE source = X ;
  INSERT INTO overlay SELECT * FROM overlay_new ;`. Atomic swap, no
  soft-delete bookkeeping. Beats per-row upsert at scale.
- **Avoid soft deletes for overlay rows**. They're derivable from polygons;
  the source of truth is the polygon table. Keep soft-delete only for the
  polygon staging table itself if you want time-travel.
- Crash recovery: stage to `staging.<source>_<runId>`, only promote to
  `overlay` after the full source ingest succeeds. A crashed run leaves a
  named staging table you can resume or drop.

## 4. Adapter pattern — what production systems actually do

**OpenAddresses** is the closest precedent to what we're building, and their
answer is dead simple: **a JSON config file per source**, no per-source code
unless absolutely necessary. Their `sources/au/*.json` files declare
`protocol`, `url`, `attribute_map`, `conform.lon`, `conform.lat`, etc. A single
generic runner consumes them.

For us that translates to:

```ts
// sources/zoning/qld-brisbane.ts
export const source: ArcGISSource = {
  kind: 'zoning',
  adapter: 'arcgis-feature-server',
  url: '…/MapServer/3',
  attributeMap: { code: 'ZONE_CODE', label: 'ZONE_DESC' },
  priority: 50,
}
```

One `arcgis-feature-server` adapter, one `geojson-zip` adapter, one `wfs`
adapter — three adapters cover ~95 % of AU gov endpoints. Per-source code
becomes config. The Dagster/po'boy article reinforces this exact split:
**resources** (reusable I/O) vs **assets** (declarations). Our 400-line
per-source scripts collapse to ~30-line config files plus a shared adapter
library.

For schema discovery: hit `?f=pjson` on the layer, log all field names, and
have the config explicitly declare the mapping. Don't try to LLM-map at ingest
time — log the unmapped field set as a warning so a human (you) can update the
config. Schema drift detection = compare current `?f=pjson` field hash against
a stored hash; alert on diff.

## 5. Smoke tests — golden-address fixtures

The pattern that works for spatial pipelines specifically (Dagster's "Smoke
Test Your Data Pipelines First" plus golden-master testing):

- Maintain a **golden fixture file** of ~20 known addresses per overlay kind:
  e.g. `"123 Sample St, Lismore NSW → expected flood overlay = present"`.
  Property characterisation tests, not unit tests.
- After every source ingest, the smoke runner re-queries those addresses and
  asserts the expected match status. Fast (sub-second SQL), catches
  regressions that pure row-count checks miss.
- For new sources: run the adapter against a single bbox containing 5–10 known
  addresses before letting it loose on the full state. If those addresses
  don't match, the rest won't either.

## 6. Coverage / data-quality monitoring — the "0 % problem"

The right framing (Monte Carlo, AWS Glue Data Quality docs): **anomaly
detection on rolling baselines**, not absolute thresholds.

For each `(source, runId)` record:

- `polygons_downloaded`, `polygons_after_make_valid`, `addresses_matched`,
  `match_rate`.
- A `match_rate` that drops > 2 σ from the trailing-30-run mean for that
  source = alert. This distinguishes "source genuinely changed" from "ingest
  broke."
- For a brand-new source, set an **expected match-rate band by overlay kind**:
  zoning ~90–100 % of addresses in jurisdiction, flood 5–30 %, bushfire
  10–40 %, heritage 0.1–2 %. Anything outside the band is "investigate before
  trusting."
- Distinguish "no overlap" from "no data downloaded" by always recording
  `polygons_downloaded` separately. Match rate of 0 with 5,000 polygons
  downloaded = real no-overlap; match rate of 0 with 0 polygons = broken
  ingest.

## 7. Multi-source aggregation — conflict resolution

Smallest-polygon-wins is defensible (it's the standard cartographic
generalisation rule per the ArcGIS conflict-resolution docs) but fragile when
councils publish overlapping coverage. Better approach used by the
rates-comparison / property-data industry:

- **Don't resolve at write time, resolve at read time.** Store all matching
  polygons per property with a `(source, priority, polygon_area)` tuple. Let
  the API return the "winning" overlay according to a documented rule, but
  keep the audit trail.
- Priority chain:
  `state-authoritative > LGA > federal-derived`. Tie-break on smallest
  polygon, then most-recent `runDate`.
- This also lets you show "X says zone is RU2, Y says R5" in the UI when they
  disagree — useful for property-data buyers.

## 8. What a "good" repo looks like

OpenAddresses + the Dagster po'boy pipeline give the template:

```
ingest/
  adapters/                 # 3-5 generic adapters, ~200 LoC each
    arcgis-feature-server.ts
    geojson-zip.ts
    wfs.ts
  sources/                  # config-only, one file per source
    zoning/qld-brisbane.ts
    flood/nsw-state.ts
  pipeline/
    download.ts             # raw → R2/S3
    stage.ts                # ogr2ogr → staging table
    materialise.sql         # PostGIS spatial join
    promote.ts              # staging → overlay swap
  smoke/
    fixtures/golden-addresses.json
    run-smoke.ts
  monitoring/
    coverage-report.ts
  cli.ts                    # `ingest run <source>`, `ingest smoke <source>`
```

CI checks that pay off:

- every source config validates against a Zod schema
- `ogr2ogr --version` available
- a `--dry-run` mode that hits the source, downloads 1 page, validates schema,
  exits.

Reference projects worth reading:

- **OpenAddresses** (`github.com/openaddresses/openaddresses`) — the
  JSON-config-per-source pattern.
- **Pelias importers** (`github.com/pelias`) — adapter pattern over many
  disparate sources, well-tested.
- **Geocint** (Kontur) — DAG-shaped spatial ETL in pure SQL / Make.
- **The po'boy Dagster pipeline** for resource / asset separation if we ever
  outgrow a single-process runner.

## Highest-ROI changes for *our* context

1. **Move point-in-polygon into Postgres** with `ST_Subdivide` + GIST. This
   alone will likely 10×+ ingest speed and remove a class of bugs.
2. **Extract 3 generic adapters**, convert sources to config files. Cuts
   ~400 LoC × 12 sources to ~30 LoC × 12 + ~600 LoC of shared adapter code.
   ~80 % code reduction.
3. **Stage-and-swap idempotency** with `runId`-tagged staging tables. Solves
   the half-finished-run problem cleanly.
4. **Golden-address smoke fixtures** + per-source rolling-baseline match-rate
   alerts. Catches the "source silently changed schema" failure mode that's
   currently invisible.
5. **Always `ST_MakeValid` and trust server reprojection** (`outSR=4326`).
   Quietly eliminates two whole classes of footguns.

Everything else (Dagster orchestration, GeoParquet intermediate format,
anomaly-detection ML) is worth knowing about but probably premature for 12
sources and one developer. Revisit when there are 50+ sources or
multi-developer ingest contention.

## Sources

- [PostGIS Spatial Indexing — workshop](http://postgis.net/workshops/postgis-intro/indexing.html)
- [Crunchy Data: PostGIS Performance — Indexing & EXPLAIN](https://www.crunchydata.com/blog/postgis-performance-indexing-and-explain)
- [Paul Ramsey: ST_Subdivide all the Things](http://blog.cleverelephant.ca/2019/11/subdivide.html)
- [Crunchy Data: Improve Bounding Boxes with Decompose and Subdivide](https://www.crunchydata.com/blog/postgis-performance-improve-bounding-boxes-with-decompose-and-subdivide)
- [Esri: Query (Feature Service/Layer) — pagination & exceededTransferLimit](https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-layer/)
- [Esri KB: maxRecordCount and maxRecordCountFactor limits](https://support.esri.com/en-us/knowledge-base/faq-what-are-the-limits-of-the-maxrecordcount-and-maxre-000030432)
- [koopjs/FeatureServer #141: exceededTransferLimit edge cases](https://github.com/koopjs/FeatureServer/issues/141)
- [NSW Spatial: WGS84 and Australia's misaligned web-maps](https://www.spatial.nsw.gov.au/__data/assets/pdf_file/0008/224396/WGS84_and_Australias_misaligned_web-maps_Information_Sheet.pdf)
- [NSW Spatial: Common Australian EPSG Codes](https://www.spatial.nsw.gov.au/__data/assets/pdf_file/0020/230429/Common_Australian_EPSG_Codes_and_Transformations_Information_Sheet.pdf)
- [Spark Playground: Idempotency in Data Ingestion Pipelines](https://www.sparkplayground.com/blog/idempotency-in-data-ingestion-pipelines)
- [Start Data Engineering: How to make data pipelines idempotent](https://www.startdataengineering.com/post/why-how-idempotent-data-pipeline/)
- [Airbyte: Idempotency in Data Pipelines](https://airbyte.com/data-engineering-resources/idempotency-in-data-pipelines)
- [OpenAddresses repo (sources/ JSON pattern)](https://github.com/openaddresses/openaddresses)
- [Coleman McCormick: Creating an Open Database of Addresses](https://medium.com/@colemanm/creating-an-open-database-of-addresses-73a7d0dc24c5)
- [Pelias modular geocoder](https://github.com/pelias/pelias)
- [Building a po'boy's spatial pipeline with Dagster + GeoParquet + R2](https://alexlowellmartin.com/building-a-po-boys-spatial-data-pipeline-from-scratch-with-dagster-geoparquet-r2-2/)
- [Kontur: Geospatial Data Pipeline (Geocint, SQL-first)](https://www.kontur.io/solutions/geospatial-data-pipeline/)
- [Dagster: Smoke Test Your Data Pipelines First](https://dagster.io/blog/smoke-test-data-pipeline)
- [Spatial Eye: Geospatial Data Quality and Validation](https://spatial-eye.com/blog/spatial-analysis/a-guide-to-geospatial-data-quality-and-validation/)
- [Monte Carlo: Data Quality Monitoring Explained](https://www.montecarlodata.com/blog-data-quality-monitoring/)
- [AWS Glue Data Quality anomaly detection](https://docs.aws.amazon.com/glue/latest/dg/data-quality-anomaly-detection.html)
- [ArcGIS: Conflict resolution and generalization with geoprocessing](https://desktop.arcgis.com/en/arcmap/latest/tools/cartography-toolbox/conflict-resolution-and-generalization-with-geoprocessing.htm)
- [BigData Earth: Building-level Geocoding of G-NAF for Flood & Bushfire](https://www.bigdataearth.com/bushfire/building-level-geocoding-g-naf-address-database-improved-flood-bushfire-risk-analysis-australia/)
- [Geoscape: G-NAF Data Product Description](https://docs.geoscape.com.au/_/downloads/gnaf_desc/en/stable/pdf/)
