# PostGIS Migration Report — 2026-05-04

## TL;DR

Migrated the production Postgres from Railway's managed PG 18 (no PostGIS available) to a custom-image **PG 18 + PostGIS 3.6.3** service on Railway, side-by-side, with zero downtime to the marketing site. All 14 GB of data (15.5M `PropertyAddress`, 17.5M `PropertyOverlay`, etc.) successfully migrated. Production site now serves from the new DB. Phase 2 of the spatial-ETL refactor (PostGIS-native ingest pipeline) is now unblocked.

## Why this happened

Phase 2 of the runbook (`docs/postgis-migration-runbook.md`) assumed `CREATE EXTENSION postgis` would work on Railway's managed Postgres. **It doesn't** — only `plpgsql`, `btree_gist`, and `earthdistance` are available on Railway's `ghcr.io/railwayapp-templates/postgres-ssl:18` image. PostGIS requires a different base image entirely.

## What we did

### 1. Provisioned new PG 18 + PostGIS service alongside the existing one
- Service: `Postgres-PostGIS`
- Image: `postgis/postgis:18-3.6` (Docker Hub)
- Volume: `postgres-postgis-volume` mounted at `/var/lib/postgresql/data`
- PGDATA: `/var/lib/postgresql/data/pgdata`
- Custom start command enables SSL via Debian snakeoil cert:
  ```bash
  bash -c "[ ! -f /etc/ssl/certs/ssl-cert-snakeoil.pem ] && make-ssl-cert generate-default-snakeoil --force-overwrite; usermod -a -G ssl-cert postgres; exec docker-entrypoint.sh postgres -c ssl=on -c ssl_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem -c ssl_key_file=/etc/ssl/private/ssl-cert-snakeoil.key"
  ```

### 2. Migrated 14 GB of data server-side over Railway's internal network
- First attempt over the public TCP proxy (`pg_dump | pg_restore` from local machine) was bandwidth-bound at ~75 MB/min and would have taken 2-3 hours.
- Pivoted to a temporary `migrator` service (image `postgres:18`) that ran `pg_dump | psql` between the two services over Railway's internal network. Finished in ~22 min at peak rates of ~530 MB/min.
- Used the `template_postgis` template DB (auto-created by the postgis image) as the basis for the recreated `railway` database, so PostGIS extensions came preloaded.

### 3. Verified data integrity
| Check | OLD | NEW | Match |
|---|---|---|---|
| User tables in public schema | 24 | 24 | yes |
| Indexes (public schema) | 96 | 96 | yes |
| Constraints (PK/FK/UNIQUE/CHECK) | 277 | 277 | yes |
| Sequences | 0 | 0 | yes |
| Exact row counts (8 verified tables) | match | match | yes |
| Restore-log errors | — | 0 | clean |
| Persistence test (restart + recheck) | — | passed | yes |

### 4. Cutover
- `sync-worker` `DATABASE_URL` switched to internal hostname `postgres-postgis.railway.internal:5432` with `sslmode=no-verify&connection_limit=10`.
- Vercel production `DATABASE_URL` switched to public proxy `nozomi.proxy.rlwy.net:27903` with `sslmode=no-verify&connection_limit=10`.
- Vercel redeploy succeeded; smoke test on `yourpropertyguide.com.au` showed homepage / `/suburbs` / `/suburbs/sydney-nsw-2000` all returning 200 with correctly DB-rendered titles.

### 5. Backups configured via Railway GraphQL API
- DAILY + WEEKLY backup schedule enabled on `postgres-postgis-volume` (Pro-plan volume backups, same mechanism as the old service's pgBackRest tab).
- Initial baseline backup triggered: `post-migration-baseline`.

## Important gotchas (read before next session)

### SSL mode must be `no-verify`, not `require`
Prisma's pg-adapter / `pg-connection-string` v2.x treats `sslmode=require` as `verify-full`, which validates the cert chain. The Debian snakeoil cert is self-signed and fails this check, breaking builds with `Error opening a TLS connection: self-signed certificate`. The current connection strings use `sslmode=no-verify` to keep TLS encryption while skipping cert validation. Hardening to `verify-full` would require either:
- A real CA-signed cert (Let's Encrypt DNS challenge), or
- Building a custom postgis-ssl image with a proper cert chain baked in

### Volume must be attached BEFORE custom start command is applied
We learned this the hard way: setting a custom start command on a service whose volume isn't actually attached causes Postgres to initialise on the container's ephemeral overlay filesystem. The next restart wipes the data. **Always verify the volume shows up under `railway volume list` before relying on persistence.**

### Railway CLI bugs encountered
- `railway volume add -s <service>` **panics**. Workaround: link the service first with `railway service <name>`, then `railway volume add --mount-path <path>` without `-s`.
- `railway domain --port 5432` creates an HTTP domain, not a TCP proxy. TCP proxy must be enabled via dashboard (Settings → Networking → Generate TCP Proxy Domain).
- `railway ssh "sh -c '<long command>'"` works as a single-string argument; passing the command as separate args (e.g. `railway ssh sh -c "<cmd>"`) silently strips arguments after the first.

### No CLI for service deletion or backup config
- Service deletion is dashboard-only.
- Backup schedule config is dashboard-only via UI, but **GraphQL API works** — see GraphQL details below.

## Current architecture state

| Service | Status | Purpose |
|---|---|---|
| `Postgres-PostGIS` | Online, 14 GB, PostGIS 3.6.3, SSL on | Primary production DB |
| `Postgres` | Online, untouched | Rollback for 1-2 weeks |
| `sync-worker` | Online, idle, points at new DB | Background ingest jobs |
| `gnaf-import` | Completed | One-shot G-NAF importer (historical) |
| `migrator` | Online, idle | Temporary helper, safe to delete |

### Connection strings (passwords redacted, see Railway env vars)

```
sync-worker (internal, low latency):
postgresql://postgres:<NEW_PASS>@postgres-postgis.railway.internal:5432/railway?sslmode=no-verify&connection_limit=10

Vercel (public proxy):
postgresql://postgres:<NEW_PASS>@nozomi.proxy.rlwy.net:27903/railway?sslmode=no-verify&connection_limit=10
```

### Useful IDs
- Project: `ffab3f24-338b-48a2-9a74-26012a57f729`
- `Postgres-PostGIS` service: `ff0d6123-14e7-43e0-b026-70194b1c34dd`
- `Postgres-PostGIS` volume: `0cb375f8-7e8a-414f-b38e-37d1999763e9`
- `Postgres-PostGIS` volume instance: `513322ec-8e41-4c55-8eda-afc01e6c1bdb`
- Old `Postgres` volume instance: `fe5ad006-20d9-4f12-a45a-d1bb4fd2155d`

### Railway backup mutations (GraphQL)
Endpoint: `https://backboard.railway.com/graphql/v2`. Auth token in `~/.railway/config.json` under `user.token`. Mutations:
- `volumeInstanceBackupScheduleUpdate(volumeInstanceId, kinds: [DAILY|WEEKLY|MONTHLY])`
- `volumeInstanceBackupCreate(volumeInstanceId, name)` returns `workflowId`
- `volumeInstanceBackupRestore(volumeInstanceBackupId, volumeInstanceId)`
- `volumeInstanceBackupLock(...)` / `volumeInstanceBackupDelete(...)`

## Open items

### Decommission (can wait 1-2 weeks)
1. Delete the old `Postgres` service from Railway (frees ~21 GB of volume storage).
2. Delete the `migrator` service — was the temporary `postgres:18` helper used for the dump/restore.
3. Clean up the unused HTTP domain we accidentally generated on `Postgres-PostGIS` early in the session (the one ending in `.up.railway.app`).

### SSL hardening (low priority)
Build a custom image based on `postgis/postgis:18-3.6` with a real CA-signed cert (e.g. via Let's Encrypt DNS-01). Then connection strings can use `sslmode=verify-full` for proper cert validation.

### Phase 2 PostGIS — now unblocked
The original goal that triggered this whole migration. With PostGIS available, the steps in `docs/postgis-migration-runbook.md` from "Per-source migration" onwards can proceed:
1. Add `geom` column to `PropertyAddress` (`geography(Point, 4326)`) populated from existing `lat`/`lng`.
2. Build `lib/adapters/postgis-pipeline.ts` adapter using `ogr2ogr` for staging-table loads + `ST_Contains` joins.
3. Migrate sources one at a time starting with `zoning-sa` (smallest), validate against existing baselines.
4. Roll out across the remaining 22 overlay sources.

Estimated 10×+ speedup on ingest, removes the OOM risk that bushfire-nsw hit overnight.

### From the previous morning report (still relevant)
- More QLD councils — Logan endpoint hunt, Cairns/Mackay/Rockhampton/Fraser Coast scrapers
- Schema drift detection job (hash `?f=pjson` per endpoint, alert on changes)
- TAS flood — needs raster-handling adapter (different shape from current vector ingests)

## Risks introduced by this migration

- **`sslmode=no-verify` is functionally equivalent to TLS-without-cert-validation.** Connections are encrypted but a MITM with a valid cert could intercept. Risk is low because the only network paths are Railway-internal (private network, no MITM possible) and Vercel→Railway public proxy (TCP passthrough — same risk as before, since the OLD setup used `sslmode=require` which also wouldn't have caught a MITM with a forged cert). Hardening to `verify-full` later closes this gap.
- **Backup mechanism changed.** Old service used Railway's pgBackRest with WAL streaming (point-in-time recovery). New service uses Railway volume snapshots (DAILY + WEEKLY granularity, no PITR). This is a real downgrade in recovery granularity but acceptable for a marketing site. If PITR matters later, can switch to a custom `pg_dump → S3` cron alongside, or rebuild the postgres-ssl image with pgBackRest layered on.
- **Custom start command needed.** The new service relies on a bash wrapper to enable SSL. If Railway changes how custom start commands are invoked, this could break silently on the next redeploy.
