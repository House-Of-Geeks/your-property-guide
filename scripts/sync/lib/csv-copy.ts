/**
 * Generic COPY-into-PropertyOverlay writer.
 *
 * Replaces the per-source writeBatch() functions that were duplicated across
 * every overlay source. Uses pg-copy-streams for the fast bulk insert, then
 * does an `INSERT ... SELECT ... ON CONFLICT DO UPDATE` from the staging temp
 * table to apply idempotent upsert semantics.
 *
 * Note on idempotency: the research doc recommends a stage-and-swap pattern
 * (staging table per runId, atomic DELETE + INSERT) for better crash recovery
 * and faster bulk replacement. That migration is part of Phase 2 alongside
 * PostGIS-native joins; for now we keep the per-row upsert which is what the
 * existing sources used.
 */
import { from as copyFrom } from "pg-copy-streams";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import type { PoolClient } from "pg";

export interface OverlayRow {
  addressId:   string;
  code:        string;
  label:       string | null;
  attrs:       string;            // pre-stringified JSON
  effectiveAt: Date | null;
}

const COPY_COLS = [
  "id", "addressId", "kind", "source", "code", "label", "attrs",
  "state", "runId", "effectiveAt", "createdAt", "updatedAt",
];
const COLS_QUOTED = COPY_COLS.map((c) => `"${c}"`).join(",");

function csvField(v: string | number | Date | null | undefined): string {
  if (v == null) return "\\N";
  if (v instanceof Date) return v.toISOString();
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export async function writeOverlayBatch(
  client: PoolClient,
  rows: OverlayRow[],
  ctx: { kind: string; source: string; state: string; runId: string },
  dryRun: boolean,
): Promise<{ inserted: number }> {
  if (rows.length === 0) return { inserted: 0 };
  if (dryRun) return { inserted: rows.length };

  await client.query("BEGIN");
  try {
    await client.query(
      `CREATE TEMP TABLE _overlay_load (LIKE "PropertyOverlay" INCLUDING DEFAULTS) ON COMMIT DROP`,
    );
    const copyStream = client.query(
      copyFrom(`COPY _overlay_load (${COLS_QUOTED}) FROM STDIN WITH (FORMAT csv, NULL '\\N')`),
    );
    const now = new Date();
    const csvLines = rows.map((r) => {
      const id = `pov_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
      return [
        csvField(id), csvField(r.addressId), csvField(ctx.kind), csvField(ctx.source),
        csvField(r.code), csvField(r.label), csvField(r.attrs), csvField(ctx.state),
        csvField(ctx.runId), csvField(r.effectiveAt), csvField(now), csvField(now),
      ].join(",");
    });
    await pipeline(Readable.from(csvLines.map((l) => l + "\n")), copyStream);

    const result = await client.query(`
      INSERT INTO "PropertyOverlay" (${COLS_QUOTED})
      SELECT ${COLS_QUOTED} FROM _overlay_load
      ON CONFLICT ("addressId", kind, source) DO UPDATE
        SET code        = EXCLUDED.code,
            label       = EXCLUDED.label,
            attrs       = EXCLUDED.attrs,
            "runId"     = EXCLUDED."runId",
            "updatedAt" = EXCLUDED."updatedAt"
    `);
    await client.query("COMMIT");
    return { inserted: result.rowCount ?? 0 };
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  }
}
