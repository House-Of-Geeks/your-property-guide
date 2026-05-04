# Overlay Ingestion Pipeline — `scripts/sync/lib`

This directory contains the shared library for ingesting parcel-level overlay
datasets (zoning, flood, bushfire, heritage) from Australian government
sources into `PropertyOverlay`.

The architecture is documented in `docs/spatial-etl-research.md` (Phase 1
section). This README is the practical "how to add a new source" guide.

## File map

```
lib/
  types.ts                  shared types: OverlayConfig, OverlayPolygon, helpers (s, parseEpochMs)
  cli.ts                    parseCli — standard --dry-run / --limit / --offset / --postcode / --no-cache / --smoke
  spatial-index.ts          R-tree + matchPoint (point-in-polygon)
  csv-copy.ts               COPY-into-PropertyOverlay writer
  runner.ts                 runOverlayIngest — the one orchestrator every source calls
  adapters/
    arcgis-paginated.ts     paginated ArcGIS REST FeatureServer/MapServer downloader
    geojson-bulk.ts         single-URL GeoJSON or GeoJSON-in-ZIP downloader
    multi-lga.ts            aggregator that fans out to N arcgis-paginated endpoints
```

## Adding a new source — paginated ArcGIS endpoint

1. Probe the endpoint to find its layer ID, count, fields:

   ```sh
   curl -s "https://ENDPOINT/query?where=1=1&returnCountOnly=true&f=json"
   curl -s "https://ENDPOINT?f=json" | jq '.fields[] | .name'
   ```

2. Sample one record to see actual values per field:

   ```sh
   curl -s "https://ENDPOINT/query?where=1=1&outFields=*&returnGeometry=false&f=json&resultRecordCount=2" \
     | jq '.features[0].attributes'
   ```

3. Write the source — typically 30-50 lines:

   ```ts
   // sources/zoning-XX.ts
   import { runOverlayIngest } from "../lib/runner";
   import { s, parseEpochMs } from "../lib/types";
   import type { ArcGisPaginatedConfig } from "../lib/types";

   const config: ArcGisPaginatedConfig = {
     adapter: "arcgis-paginated",
     sourceId: "zoning-xx",
     overlayKind: "zoning",
     overlaySource: "xx-foo-bar",   // attribution short string
     state: "XX",
     minAddressCount: 500_000,        // pre-flight threshold
     endpoint: "https://...",
     outFields: "ZONE_CODE,ZONE_DESC,LGA",
     pickCode:  (p) => s(p.ZONE_CODE),
     pickLabel: (p) => s(p.ZONE_DESC),
     pickAttrs: (p) => ({ lga: s(p.LGA) }),
   };

   export async function run(): Promise<void> {
     await runOverlayIngest(config);
   }
   ```

4. Register in `scripts/sync/run.ts`:

   ```ts
   import { run as zoningXx } from "./sources/zoning-xx";
   // ...
   "zoning-xx": { run: zoningXx, schedule: "quarterly" },
   ```

5. Seed the `DataSource` row (one-off):

   ```ts
   await prisma.dataSource.upsert({
     where: { id: "zoning-xx" },
     create: { id: "zoning-xx", label: "...", category: "zoning", schedule: "quarterly", sourceUrl: "..." },
     update: {},
   });
   ```

6. Smoke-test before committing to a full run:

   ```sh
   railway run --service sync-worker -- npx tsx scripts/sync/run.ts zoning-xx -- --smoke
   ```

   `--smoke` implies `--limit=1000` and `--dry-run` — full pipeline, 1000
   addresses, no DB writes. Catches schema drift, broken endpoints, wrong
   field mappings in ~30 seconds.

7. Run for real (locally or on Railway):

   ```sh
   # Locally with Railway env injected:
   railway run --service sync-worker -- npx tsx scripts/sync/run.ts zoning-xx
   # Or on Railway via SSH (long-running, survives disconnect):
   railway ssh --service sync-worker "cd /app && (setsid nohup npx tsx scripts/sync/run.ts zoning-xx > /tmp/zoning-xx.log 2>&1 < /dev/null &)"
   ```

8. After a clean run, refresh smoke fixtures to lock in the new baseline:

   ```sh
   railway run --service sync-worker -- npx tsx scripts/sync/smoke/bootstrap.ts
   git add scripts/sync/smoke/golden-addresses.json
   ```

## Adding a new source — bulk GeoJSON download

Same pattern, different adapter:

```ts
const config: GeoJsonBulkConfig = {
  adapter: "geojson-bulk",
  sourceId: "zoning-xx",
  // … (same overlayKind, overlaySource, state, minAddressCount)
  url: "https://example.com/zones.zip",
  geojsonInZipPath: ["zones.geojson"],   // optional; auto-detects if omitted
  pickCode:  (p) => s(p.value),
  pickLabel: (p) => s(p.name),
};
```

The adapter auto-detects ZIP vs raw GeoJSON via magic bytes; if a ZIP, it
extracts the named entry (or the first `.geojson` if name omitted).

## Adding a new source — multi-LGA aggregator

For states like QLD where each council publishes its own endpoint:

```ts
const config: MultiLgaConfig = {
  adapter: "multi-lga",
  sourceId: "zoning-xx",
  overlayKind: "zoning",
  overlaySource: "xx-multi-lga",
  state: "XX",
  minAddressCount: 1_000_000,
  lgas: [
    {
      id: "council-a",
      name: "Council A",
      endpoint: "https://...",
      outFields: "ZONE_CODE,ZONE_DESC",
      pickCode:  (p) => s(p.ZONE_CODE),
      pickLabel: (p) => s(p.ZONE_DESC),
    },
    // …
  ],
};
```

Each LGA is downloaded independently; one LGA failing does not abort the
rest. The polygons are unioned into a single statewide R-tree before
matching.

## Migrating a legacy source

The 17 source files that still inline the full pipeline (zoning-nsw,
zoning-act, zoning-tas, flood-nsw, flood-vic, flood-act, flood-qld,
bushfire-nsw, bushfire-vic, bushfire-act, bushfire-wa, bushfire-tas,
heritage-nsw, heritage-vic, heritage-act, heritage-qld, heritage-tas) can
each be converted to the new pattern by:

1. Reading the legacy source's `outFields`, `OVERLAY_SOURCE`, and field
   mappers (look for `pickCode` / `categoryCode` / `zoneCode` etc.)
2. Writing a 40-line config in the same shape as `zoning-vic.ts`
3. Smoke-testing with `--smoke` to confirm match rate matches the legacy
   baseline (check `audit-gaps.ts` for the previous match %)

Done in batches, the conversion is mechanical and low-risk because the
adapters preserve identical semantics — same retry behavior, same
exceededTransferLimit handling, same R-tree, same COPY pattern, same runId
scheme. The only thing that changes is who owns the code.

## What this refactor is NOT

This is **Phase 1** only. It is not yet:

- **PostGIS-native spatial join** (Phase 2) — moving point-in-polygon into
  the database via `ST_Contains` + GIST + `ST_Subdivide`. Promises a 10×+
  speed-up but requires installing PostGIS on the Railway PG and adding
  `ogr2ogr` to the sync-worker container. Documented as a separate runbook.
- **Stage-and-swap idempotency** — the current writer still does per-row
  `ON CONFLICT DO UPDATE`. The research recommends staging tables per
  `runId` and atomic `DELETE+INSERT` swap; cheaper at scale.
- **Schema drift detection** — a periodic job that probes each endpoint's
  `?f=pjson` field hash and alerts if the source's schema has changed since
  the last successful run.
- **Coverage anomaly detection** — match-rate baselines per
  `(source, overlayKind)` tracked over time, with alerts on > 2σ drops.

Phase 2 / 3 are described in `docs/spatial-etl-research.md`. They're worth
doing but each deserves its own focused session and PR.
