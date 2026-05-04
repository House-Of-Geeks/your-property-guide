# PostGIS Migration — Phase 2 Runbook

> Status: **NOT YET EXECUTED.** This is a planning doc for the next session.
> Phase 1 (adapter library) is shipped. Phase 2 moves the spatial join into
> Postgres, which the research identifies as the single highest-leverage
> change remaining (10×+ ingest speedup, removes a class of memory bugs).

## Why this matters

Right now every overlay ingest does point-in-polygon **in Node**:

1. Stream all geocoded `PropertyAddress` rows from Postgres → Node over the
   network (4.84M for NSW, ~17M total when running them all)
2. Build an in-memory R-tree from N polygons
3. For each address, `tree.search()` then `turf.booleanPointInPolygon`
4. Buffer matched rows and `COPY` them back to Postgres

This is the wrong shape:

- **Wire transfer is the bottleneck.** 17M rows × 50 bytes = ~850 MB of
  point coords moved across TCP per full ingest cycle.
- **Memory pressure on Node.** bushfire-nsw OOM'd at the default 2 GB heap
  this session; we mitigated by bumping `NODE_OPTIONS=--max-old-space-size=8192`
  but the underlying issue is keeping 265k polygons + R-tree + streaming
  address batches all live in RAM.
- **No spatial index reuse.** Every ingest rebuilds an R-tree from scratch
  even though Postgres already has the addresses in a queryable form.

A PostGIS-native pipeline:

```sql
-- One-time setup
CREATE EXTENSION postgis;
ALTER TABLE "PropertyAddress" ADD COLUMN geom geography(Point, 4326);
UPDATE "PropertyAddress" SET geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
  WHERE lat IS NOT NULL AND lng IS NOT NULL;
CREATE INDEX idx_property_address_geom ON "PropertyAddress" USING GIST (geom);

-- Per ingest
CREATE TABLE staging.zoning_wa_<runId> (geom geometry(MultiPolygon, 4326), code text, label text, attrs jsonb);
-- ogr2ogr loads from raw GeoJSON straight into the staging table
-- ST_Subdivide for huge polygons (4-60x speedup per Paul Ramsey)
CREATE INDEX ON staging.zoning_wa_<runId> USING GIST (geom);

INSERT INTO "PropertyOverlay" (id, "addressId", kind, source, code, label, attrs, state, "runId", ...)
SELECT
  'pov_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 24),
  pa.id,
  'zoning', 'wa-dplh-zones', s.code, s.label, s.attrs, 'WA', '<runId>',
  ...
FROM "PropertyAddress" pa
JOIN staging.zoning_wa_<runId> s
  ON ST_Contains(s.geom, pa.geom::geometry)
WHERE pa.state = 'WA' AND pa.lat IS NOT NULL
ON CONFLICT ("addressId", kind, source) DO UPDATE SET ...;
```

Postgres does the spatial join with the GIST index in-process. The Node
script becomes a thin orchestrator: download → ogr2ogr → SQL → done.

## Prerequisites

1. **PostGIS extension on the Railway PG instance.** Railway PG supports it
   but it's not enabled by default. Run `CREATE EXTENSION postgis;` once.
   Risk: low — additive, doesn't change existing tables.

2. **`ogr2ogr` (GDAL) in the sync-worker container.** Currently the sync-worker
   uses a Node-based image without GDAL. Either:
   - Add `apt-get install -y gdal-bin` to `Dockerfile.sync-worker` (~30 MB extra)
   - Or use `node-gdal-async` npm package (no system dep, slightly slower)

3. **A `geom` column on `PropertyAddress`.** One-time migration to add a
   `geography(Point, 4326)` column derived from existing `lat`/`lng` and a
   GIST index on it. ~1-2 min on the 17M-row table. Migration:

   ```prisma
   model PropertyAddress {
     // … existing fields …
     // Postgres-only: not surfaced in Prisma client. Maintained via raw SQL.
     // geom Unsupported("geography(Point,4326)")?
   }
   ```

   (Prisma's PostGIS support is awkward; easier to maintain the column via raw
   SQL outside Prisma's view and use `prisma.$queryRawUnsafe` for spatial
   queries.)

## Migration plan

**One-off prep (~1 hour, low risk):**

1. SSH into Railway PG via `railway connect Postgres` and run:
   ```sql
   CREATE EXTENSION postgis;
   SELECT PostGIS_Version();
   ```
2. Add the `geom` column + GIST index via a Prisma migration:
   ```sql
   ALTER TABLE "PropertyAddress" ADD COLUMN geom geography(Point, 4326);
   UPDATE "PropertyAddress"
     SET geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
     WHERE lat IS NOT NULL AND lng IS NOT NULL;
   CREATE INDEX idx_property_address_geom ON "PropertyAddress" USING GIST (geom);
   ```
3. Update `Dockerfile.sync-worker` to install `gdal-bin`. Redeploy.

**Per-source migration (~15 min each):**

4. Build a new adapter `lib/adapters/postgis-pipeline.ts` that:
   - Downloads the source as raw GeoJSON
   - Runs `ogr2ogr -f PostgreSQL "PG:..." raw.geojson -nln staging.<source>_<runId> -lco GEOMETRY_NAME=geom -lco FID=id -t_srs EPSG:4326`
   - `CREATE INDEX ... USING GIST (geom)` on the staging table
   - `UPDATE … SET geom = ST_MakeValid(geom)` on the staging table
   - Single SQL `INSERT INTO "PropertyOverlay" SELECT … FROM "PropertyAddress" JOIN staging USING ST_Contains` with the appropriate field mappings
   - DROP the staging table

5. Add `adapter: "postgis-pipeline"` as a new variant of `OverlayConfig`. Each
   source can opt in by changing one line in its config.

6. Migrate sources one at a time, smoke-testing each. Compare match counts vs
   the previous JS-pipeline run — should be within 0.1% (any difference is
   `ST_MakeValid` cleaning up self-intersections that turf was silently
   ignoring).

**Validation:**

7. Run a side-by-side: pick a state that's already ingested (e.g. WA), run
   the PostGIS adapter against the same source, compare `PropertyOverlay`
   row counts and per-address codes for 1000 random addresses. Should match.

## Expected wins

Per the research benchmarks (Crunchy Data, Paul Ramsey):

- bushfire-nsw (4.84M addresses × 265k polygons): **~60 min today → ~5 min**
- zoning-vic (4.12M × 220k): **~45 min → ~4 min**
- zoning-sa (1.12M × 5.4k, small dataset): **~5 min → ~1 min** (less wow,
  but no R-tree memory pressure)

Plus removing the OOM risk and the WAN bandwidth cost.

## Things to watch out for

- `ST_Contains` vs `ST_Intersects` — for parcel-on-boundary cases, use
  `ST_Intersects` to be inclusive (the JS code is doing
  `booleanPointInPolygon` which is contains-only, so to match exactly use
  `ST_Contains`)
- `ST_Subdivide(geom, 256)` — apply on the staging table for any layer with
  polygons > a few thousand vertices. NSW BFPL has these. Per the research,
  4-60× speedup with no behavioral change.
- The `attrs` JSONB column — build it via `jsonb_build_object` in the SELECT.
- Dropping the staging table on success but keeping it on failure (for
  resume / inspection). Wrap the per-source DDL in `BEGIN; … COMMIT;` so
  it's truly atomic.

## Stage-and-swap idempotency (free with Phase 2)

While moving to Postgres-native, also adopt the recommended idempotency
pattern from research §3:

```sql
BEGIN;
DELETE FROM "PropertyOverlay" WHERE source = 'wa-dplh-zones';
INSERT INTO "PropertyOverlay" SELECT … FROM staging…;
COMMIT;
```

Replaces per-row `ON CONFLICT DO UPDATE`. Faster (one DELETE + one INSERT),
cleaner crash semantics (a crash mid-INSERT leaves the old data intact),
removes the "stale rows from a previous source schema" risk.

## Order of operations

1. Phase 1 — adapter library (DONE, this session)
2. Phase 2a — PostGIS extension + geom column + ogr2ogr in container (1 hour)
3. Phase 2b — postgis-pipeline adapter + migrate one source as proof (zoning-sa) (1 hour)
4. Phase 2c — migrate the remaining sources (~15 min × N, mechanical)
5. Phase 3 — schema drift detection + coverage anomaly alerts
   (separate session)
