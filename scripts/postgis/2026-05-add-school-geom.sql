-- PostGIS: add geom column + GIST index to "School"
--
-- WHY: getNearbySchools() in src/lib/services/suburb-service.ts currently runs
-- the haversine formula in SQL, which forces a full School table scan and
-- evaluates cos/acos per row. With a geography column + GIST index, ST_DWithin
-- + KNN ordering uses the spatial index. Expected: ~50ms per call → ~3ms.
--
-- SAFETY:
--   - Additive only. Existing queries continue to work.
--   - getNearbySchools() in property-service has a try-PostGIS / catch-and-fall-back
--     pattern, so the deploy is safe both before AND after this migration runs.
--   - Idempotent: each statement is guarded with IF NOT EXISTS so re-running is a no-op.
--
-- HOW TO RUN:
--   railway connect Postgres
--   \i scripts/postgis/2026-05-add-school-geom.sql
--   -- or paste statement-by-statement
--
-- VERIFY:
--   SELECT COUNT(*) FROM "School" WHERE geom IS NOT NULL;
--   -- should equal: SELECT COUNT(*) FROM "School" WHERE lat IS NOT NULL AND lng IS NOT NULL;
--
--   EXPLAIN ANALYZE
--   SELECT s.id, ST_Distance(s.geom, ST_SetSRID(ST_MakePoint(153.0353, -27.4710), 4326)::geography) AS d
--   FROM "School" s
--   WHERE s.geom IS NOT NULL
--     AND ST_DWithin(s.geom, ST_SetSRID(ST_MakePoint(153.0353, -27.4710), 4326)::geography, 10000)
--   ORDER BY s.geom <-> ST_SetSRID(ST_MakePoint(153.0353, -27.4710), 4326)::geography
--   LIMIT 20;
--   -- plan should show: "Index Scan using idx_school_geom"

-- 1. Ensure PostGIS is enabled (no-op if already on).
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Add the geography column. geography(Point, 4326) stores lon/lat in WGS84
--    and lets ST_DWithin take a radius in meters directly.
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS geom geography(Point, 4326);

-- 3. Backfill from existing lat/lng. ST_MakePoint takes (lng, lat) — order matters.
UPDATE "School"
   SET geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
 WHERE lat IS NOT NULL
   AND lng IS NOT NULL
   AND geom IS NULL;

-- 4. GIST index for spatial queries (ST_DWithin, KNN <->, etc).
CREATE INDEX IF NOT EXISTS idx_school_geom ON "School" USING GIST (geom);

-- 5. (Optional) ANALYZE so the query planner picks the new index immediately.
ANALYZE "School";
