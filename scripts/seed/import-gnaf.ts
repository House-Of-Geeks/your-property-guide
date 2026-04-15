/**
 * Imports G-NAF (Geocoded National Address File) into the PropertyAddress table.
 *
 * Source: Australian Government G-NAF Feb 2026 (all states, GDA2020, PSV format)
 *   https://data.gov.au — free under Creative Commons Attribution 4.0
 * Coverage: ~15.8M residential and non-residential addresses across Australia
 *
 * What G-NAF provides per address:
 *   - Full verified street address (number, street, suburb, state, postcode)
 *   - Lat/lng geocode (property centroid)
 *   - Legal parcel ID (lot/plan reference for cadastral linkage)
 *
 * Pipeline:
 *   1. Download ZIP (1.7 GB) unless --skip-download flag is set
 *   2. Extract per-state files to /tmp/gnaf/
 *   3. For each state:
 *      a. Build Map: LOCALITY_PID → {name, postcode}
 *      b. Build Map: STREET_LOCALITY_PID → {name, type, suffix}
 *      c. Build Map: ADDRESS_DETAIL_PID → {lat, lng}   (geocodes)
 *      d. Stream ADDRESS_DETAIL rows → join → batch upsert
 *   4. Link suburbSlug where locality matches our Suburb table
 *
 * Run:   npx tsx scripts/seed/import-gnaf.ts
 * Flags:
 *   --state QLD        Only process one state (for testing)
 *   --skip-download    Use existing ZIP at /tmp/gnaf.zip
 *   --skip-extract     Use already-extracted files at /tmp/gnaf/
 *   --dry-run          Parse without writing to DB
 *   --link-suburbs     Only run the suburb slug linkage step (post-import)
 *
 * First run (full): ~3–6 hours depending on connection + DB speed.
 * Resume:           Re-run with --skip-download --skip-extract; uses upsert skipDuplicates.
 */
import * as fs   from "fs";
import * as path from "path";
import * as readline from "readline";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { execSync, exec } from "child_process";
import { promisify } from "util";
import { Pool } from "pg";
import { from as copyFrom } from "pg-copy-streams";
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const execAsync = promisify(exec);

// ─── Config ───────────────────────────────────────────────────────────────────
const GNAF_ZIP_URL = "https://data.gov.au/data/dataset/19432f89-dc3a-4ef3-b943-5326ef1dbecc/resource/5be5278c-fe66-459e-845a-bea553f46b4b/download/g-naf_feb26_allstates_gda2020_psv_1022.zip";
const GNAF_ZIP_PATH = "/tmp/gnaf.zip";
const GNAF_DIR      = "/tmp/gnaf";
const COPY_BUFFER   = 50_000; // rows to accumulate before each COPY FROM STDIN call

const ALL_STATES = ["ACT", "NSW", "NT", "OT", "QLD", "SA", "TAS", "VIC", "WA"];
// OT = Other Territories (Jervis Bay, Christmas Island, Cocos Islands, Norfolk Island)

// ─── CLI args ─────────────────────────────────────────────────────────────────
const args         = process.argv.slice(2);
const DRY_RUN       = args.includes("--dry-run");
const SKIP_DOWNLOAD = args.includes("--skip-download");
const SKIP_EXTRACT  = args.includes("--skip-extract");
const LINK_ONLY     = args.includes("--link-suburbs");
// --resume: skip states already recorded as complete in the progress file
const RESUME = args.includes("--resume");

const stateFilter: string | null =
  args.find((a) => a.startsWith("--state="))?.split("=")[1] ??
  (args[args.indexOf("--state") + 1] && !args[args.indexOf("--state") + 1].startsWith("--")
    ? args[args.indexOf("--state") + 1].toUpperCase()
    : null);

// ─── DB ───────────────────────────────────────────────────────────────────────
// Prisma is used for linkSuburbs (ORM queries). Bulk inserts use raw pg + COPY.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

// Shared pg pool — used for COPY FROM STDIN and progress tracking.
// Works both locally and on Railway (DATABASE_URL is injected as an env var there).
const pgPool = new Pool({ connectionString: process.env.DATABASE_URL! });

// ─── Progress tracking (DB-backed, survives Railway restarts) ─────────────────
async function initProgressTable(): Promise<void> {
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS _gnaf_import_state (
      state        TEXT PRIMARY KEY,
      "completedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "rowCount"   INTEGER NOT NULL DEFAULT 0
    )
  `);
}

async function loadProgress(): Promise<Set<string>> {
  await initProgressTable();
  const { rows } = await pgPool.query<{ state: string }>(`SELECT state FROM _gnaf_import_state`);
  return new Set(rows.map((r) => r.state));
}

async function markStateComplete(state: string, rowCount: number): Promise<void> {
  await pgPool.query(
    `INSERT INTO _gnaf_import_state (state, "completedAt", "rowCount")
     VALUES ($1, now(), $2)
     ON CONFLICT (state) DO UPDATE SET "completedAt" = now(), "rowCount" = $2`,
    [state, rowCount],
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Build a URL-safe address slug */
function buildSlug(
  flatType: string | null, flatNumber: string | null,
  numberFirst: string | null, numberLast: string | null,
  streetName: string, streetType: string | null,
  locality: string, state: string, postcode: string,
): string {
  const parts: string[] = [];

  // Flat: "UNIT 14" → "unit-14"
  if (flatNumber) {
    parts.push(slugify([flatType, flatNumber].filter(Boolean).join(" ")));
  }

  // Street number
  const streetNo = numberLast
    ? `${numberFirst}-${numberLast}`
    : numberFirst ?? "";
  if (streetNo) parts.push(slugify(streetNo));

  // Street name + type
  parts.push(slugify([streetName, streetType].filter(Boolean).join(" ")));

  // Locality, state, postcode
  parts.push(slugify(locality));
  parts.push(state.toLowerCase());
  parts.push(postcode);

  return parts.join("-");
}

/** Format a human-readable full address */
function buildAddressFull(
  buildingName: string | null,
  flatType: string | null, flatNumber: string | null,
  levelType: string | null, levelNumber: string | null,
  numberFirst: string | null, numberLast: string | null,
  streetName: string, streetType: string | null, streetSuffix: string | null,
  locality: string, state: string, postcode: string,
): string {
  const parts: string[] = [];

  // Flat prefix: "Unit 14, Level 3"
  const flatPart = [flatType, flatNumber].filter(Boolean).join(" ");
  const levelPart = [levelType, levelNumber].filter(Boolean).join(" ");
  const prefix = [flatPart, levelPart].filter(Boolean).join(", ");

  // Street number
  const streetNo = numberLast
    ? `${numberFirst}-${numberLast}`
    : numberFirst ?? "";

  // Street full: "42A Main Street North"
  const streetFull = [streetNo, streetName, streetType, streetSuffix]
    .filter(Boolean).join(" ");

  // Combine
  if (buildingName) parts.push(buildingName);
  if (prefix) parts.push(`${prefix}/`);
  if (streetFull) parts.push(streetFull);

  const streetAddress = parts.join("").replace(/\/(\d)/, "/$1"); // tidy "Unit 14/42A..."
  return `${streetAddress}, ${locality} ${state} ${postcode}`;
}

/** Build column index map from a PSV header row */
function headerMap(header: string): Record<string, number> {
  const cols = header.split("|");
  const map: Record<string, number> = {};
  cols.forEach((col, i) => { map[col.trim()] = i; });
  return map;
}

/**
 * Stream a PSV file synchronously line-by-line (skipping header).
 * Uses `for await...of` so readline can be GC'd after each chunk.
 */
async function streamPsvSync(
  filePath: string,
  onRow: (cols: string[]) => void,
): Promise<number> {
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });
  let lineNo = 0;
  for await (const line of rl) {
    lineNo++;
    if (lineNo === 1 || !line.trim()) continue; // skip header + blank lines
    onRow(line.split("|"));
  }
  return lineNo - 1;
}

/**
 * Stream a PSV file with async row handler + real backpressure.
 * `for await...of` pauses readline until `await onRow()` resolves,
 * preventing unbounded buffering when DB writes are slower than reads.
 */
async function streamPsvAsync(
  filePath: string,
  onRow: (cols: string[]) => Promise<void>,
): Promise<number> {
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });
  let lineNo = 0;
  for await (const line of rl) {
    lineNo++;
    if (lineNo === 1 || !line.trim()) continue;
    await onRow(line.split("|"));
  }
  return lineNo - 1;
}

/** Read first line of a PSV file and return its header map */
async function readHeader(filePath: string): Promise<Record<string, number>> {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath, { encoding: "utf8" }),
      crlfDelay: Infinity,
    });
    let resolved = false;
    rl.on("line", (line) => {
      if (!resolved) {
        resolved = true;
        rl.close();
        resolve(headerMap(line));
      }
    });
    rl.on("error", reject);
  });
}

/** Find a state's PSV files inside the extracted G-NAF directory */
function findStateFiles(state: string): {
  addressDetail: string;
  geocode: string;
  locality: string;
  streetLocality: string;
} | null {
  // G-NAF ZIP extracts to a directory like "G-NAF/G-NAF FEBRUARY 2026/Standard/"
  // We search recursively for the state files
  const find = (pattern: string): string | null => {
    try {
      const result = execSync(`find "${GNAF_DIR}" -iname "${pattern}" -type f 2>/dev/null`).toString().trim();
      return result || null;
    } catch { return null; }
  };

  const addressDetail  = find(`${state}_ADDRESS_DETAIL_psv.psv`);
  const geocode        = find(`${state}_ADDRESS_DEFAULT_GEOCODE_psv.psv`);
  const locality       = find(`${state}_LOCALITY_psv.psv`);
  const streetLocality = find(`${state}_STREET_LOCALITY_psv.psv`);

  if (!addressDetail || !geocode || !locality || !streetLocality) {
    console.warn(`  ⚠ Missing files for ${state}: detail=${!!addressDetail} geo=${!!geocode} loc=${!!locality} street=${!!streetLocality}`);
    return null;
  }

  return { addressDetail, geocode, locality, streetLocality };
}

// ─── Per-state processing ─────────────────────────────────────────────────────
async function processState(state: string): Promise<number> {
  console.log(`\n── ${state} ──`);

  const files = findStateFiles(state);
  if (!files) {
    console.log(`  Skipping ${state} — files not found`);
    return;
  }

  // 1. Build locality map: LOCALITY_PID → {name, postcode}
  console.log("  Loading localities…");
  const localityMap = new Map<string, { name: string; postcode: string }>();
  {
    const hdr = await readHeader(files.locality);
    const PID   = hdr["LOCALITY_PID"]   ?? 0;
    const NAME  = hdr["LOCALITY_NAME"]  ?? 3;
    // G-NAF uses "PRIMARY_POSTCODE" in locality file (may be blank for unnamed localities)
    const POST  = hdr["PRIMARY_POSTCODE"] ?? hdr["POSTCODE"] ?? 4;
    const RETIRED = hdr["DATE_RETIRED"] ?? 2;
    await streamPsvSync(files.locality, (cols) => {
      if (cols[RETIRED]?.trim()) return; // skip retired localities
      const pid  = cols[PID]?.trim();
      const name = cols[NAME]?.trim();
      const post = cols[POST]?.trim();
      if (pid && name) localityMap.set(pid, { name, postcode: post ?? "" });
    });
  }
  console.log(`    ${localityMap.size} localities`);

  // 2. Build street map: STREET_LOCALITY_PID → {name, type, suffix}
  console.log("  Loading streets…");
  const streetMap = new Map<string, { name: string; type: string; suffix: string }>();
  {
    const hdr = await readHeader(files.streetLocality);
    const PID     = hdr["STREET_LOCALITY_PID"] ?? 0;
    const NAME    = hdr["STREET_NAME"]         ?? 4;
    const TYPE    = hdr["STREET_TYPE_CODE"]    ?? 5;
    const SUFFIX  = hdr["STREET_SUFFIX_CODE"]  ?? 6;
    const RETIRED = hdr["DATE_RETIRED"]        ?? 2;
    await streamPsvSync(files.streetLocality, (cols) => {
      if (cols[RETIRED]?.trim()) return;
      const pid    = cols[PID]?.trim();
      const name   = cols[NAME]?.trim();
      const type   = cols[TYPE]?.trim();
      const suffix = cols[SUFFIX]?.trim();
      if (pid && name) streetMap.set(pid, { name, type: type ?? "", suffix: suffix ?? "" });
    });
  }
  console.log(`    ${streetMap.size} streets`);

  // 3. Build geocode map: ADDRESS_DETAIL_PID → {lat, lng}
  console.log("  Loading geocodes…");
  const geocodeMap = new Map<string, { lat: number; lng: number }>();
  {
    const hdr = await readHeader(files.geocode);
    const PID     = hdr["ADDRESS_DETAIL_PID"] ?? 3;
    const LNG     = hdr["LONGITUDE"]          ?? 5;
    const LAT     = hdr["LATITUDE"]           ?? 6;
    const RETIRED = hdr["DATE_RETIRED"]       ?? 2;
    await streamPsvSync(files.geocode, (cols) => {
      if (cols[RETIRED]?.trim()) return;
      const pid = cols[PID]?.trim();
      const lat = parseFloat(cols[LAT]?.trim() ?? "");
      const lng = parseFloat(cols[LNG]?.trim() ?? "");
      if (pid && !isNaN(lat) && !isNaN(lng)) {
        geocodeMap.set(pid, { lat, lng });
      }
    });
  }
  console.log(`    ${geocodeMap.size} geocodes`);

  // 4. Stream ADDRESS_DETAIL, join, batch upsert
  console.log("  Processing addresses…");
  const hdr = await readHeader(files.addressDetail);

  const COL = {
    PID:           hdr["ADDRESS_DETAIL_PID"]    ?? 0,
    DATE_RETIRED:  hdr["DATE_RETIRED"]           ?? 3,
    BUILDING:      hdr["BUILDING_NAME"]          ?? 4,
    LOT_NUMBER:    hdr["LOT_NUMBER"]             ?? 6,
    FLAT_TYPE:     hdr["FLAT_TYPE_CODE"]         ?? 8,
    FLAT_PREFIX:   hdr["FLAT_NUMBER_PREFIX"]     ?? 9,
    FLAT_NUMBER:   hdr["FLAT_NUMBER"]            ?? 10,
    FLAT_SUFFIX:   hdr["FLAT_NUMBER_SUFFIX"]     ?? 11,
    LEVEL_TYPE:    hdr["LEVEL_TYPE_CODE"]        ?? 12,
    LEVEL_NUMBER:  hdr["LEVEL_NUMBER"]           ?? 14,
    NUM_FIRST_PRE: hdr["NUMBER_FIRST_PREFIX"]    ?? 16,
    NUM_FIRST:     hdr["NUMBER_FIRST"]           ?? 17,
    NUM_FIRST_SUF: hdr["NUMBER_FIRST_SUFFIX"]    ?? 18,
    NUM_LAST_PRE:  hdr["NUMBER_LAST_PREFIX"]     ?? 19,
    NUM_LAST:      hdr["NUMBER_LAST"]            ?? 20,
    NUM_LAST_SUF:  hdr["NUMBER_LAST_SUFFIX"]     ?? 21,
    STREET_PID:    hdr["STREET_LOCALITY_PID"]    ?? 22,
    LOCALITY_PID:  hdr["LOCALITY_PID"]           ?? 24,
    ALIAS:         hdr["ALIAS_PRINCIPAL"]        ?? 25,
    POSTCODE:      hdr["POSTCODE"]               ?? 26,
    PARCEL:        hdr["LEGAL_PARCEL_ID"]        ?? 28,
    CONFIDENCE:    hdr["CONFIDENCE"]             ?? 29,
    PRIMARY_SEC:   hdr["PRIMARY_SECONDARY"]      ?? 34,
  };

  // Count total lines for ETA (~1s for 3.5M rows)
  const totalLines = parseInt(
    execSync(`wc -l < "${files.addressDetail}"`).toString().trim(),
    10,
  );

  // ── PostgreSQL COPY FROM STDIN ──────────────────────────────────────────────
  // 10–20× faster than batched INSERTs. Streams CSV into a temp table, then
  // inserts with ON CONFLICT DO NOTHING to skip duplicates on re-runs.
  const COPY_COLS = [
    "id", "slug", `"addressFull"`, `"buildingName"`,
    `"flatType"`, `"flatNumber"`, `"levelType"`, `"levelNumber"`,
    `"numberFirst"`, `"numberLast"`,
    `"streetName"`, `"streetType"`, `"streetSuffix"`,
    "locality", "state", "postcode",
    "lat", "lng", `"legalParcelId"`, "confidence",
    `"createdAt"`, `"updatedAt"`,
  ].join(", ");

  const pgClient = await pgPool.connect();
  await pgClient.query(`
    CREATE TEMP TABLE _gnaf_temp (
      id TEXT, slug TEXT, "addressFull" TEXT, "buildingName" TEXT,
      "flatType" TEXT, "flatNumber" TEXT, "levelType" TEXT, "levelNumber" TEXT,
      "numberFirst" TEXT, "numberLast" TEXT,
      "streetName" TEXT, "streetType" TEXT, "streetSuffix" TEXT,
      locality TEXT, state TEXT, postcode TEXT,
      lat DOUBLE PRECISION, lng DOUBLE PRECISION,
      "legalParcelId" TEXT, confidence INTEGER,
      "createdAt" TIMESTAMPTZ, "updatedAt" TIMESTAMPTZ
    )
  `);

  const now = new Date().toISOString();

  /** Escape a single CSV field (RFC 4180 + PostgreSQL COPY rules) */
  function csvVal(v: string | number | null | undefined): string {
    if (v === null || v === undefined || v === "") return "";
    const s = String(v);
    if (s.includes('"') || s.includes(",") || s.includes("\n") || s.includes("\r")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  }

  let csvRows: string[] = [];
  let inserted = 0;
  let skipped   = 0;
  let totalRead = 0;
  const stateStart = Date.now();

  const flushCopy = async () => {
    if (csvRows.length === 0) return;
    const count = csvRows.length;
    if (!DRY_RUN) {
      const ingestStream = pgClient.query(
        copyFrom(`COPY _gnaf_temp (${COPY_COLS}) FROM STDIN WITH (FORMAT CSV, NULL '')`),
      );
      await pipeline(Readable.from(csvRows.join("")), ingestStream);
      await pgClient.query(`
        INSERT INTO "PropertyAddress" (${COPY_COLS})
        SELECT ${COPY_COLS} FROM _gnaf_temp
        ON CONFLICT (id) DO NOTHING
      `);
      await pgClient.query("TRUNCATE _gnaf_temp");
    }
    inserted += count;
    csvRows = [];

    const elapsedSec = (Date.now() - stateStart) / 1000;
    const rps        = Math.round(totalRead / elapsedSec);
    const etaMin     = rps > 0 ? Math.round((totalLines - totalRead) / rps / 60) : 0;
    const etaStr     = etaMin > 0 ? `, ~${etaMin} min remaining` : " — almost done";
    console.log(`    … ${inserted.toLocaleString()} inserted  (${rps.toLocaleString()}/s${etaStr})`);
  };

  await streamPsvAsync(files.addressDetail, async (cols) => {
    totalRead++;
    // Skip retired addresses
    if (cols[COL.DATE_RETIRED]?.trim()) { skipped++; return; }
    // Only keep principal (not alias) addresses
    if (cols[COL.ALIAS]?.trim() !== "P") { skipped++; return; }

    const pid         = cols[COL.PID]?.trim();
    const localityPid = cols[COL.LOCALITY_PID]?.trim();
    const streetPid   = cols[COL.STREET_PID]?.trim();
    if (!pid) { skipped++; return; }

    const loc    = localityPid ? localityMap.get(localityPid) : null;
    const street = streetPid   ? streetMap.get(streetPid)     : null;
    const geo    = geocodeMap.get(pid) ?? null;

    if (!loc || !street) { skipped++; return; }

    // Build street number: prefix + number + suffix
    const fmtNum = (pre: number, num: number, suf: number): string | null => {
      const p = cols[pre]?.trim();
      const n = cols[num]?.trim();
      const s = cols[suf]?.trim();
      if (!n) return null;
      return [p, n, s].filter(Boolean).join("");
    };

    const numberFirst = fmtNum(COL.NUM_FIRST_PRE, COL.NUM_FIRST, COL.NUM_FIRST_SUF);
    const numberLast  = fmtNum(COL.NUM_LAST_PRE, COL.NUM_LAST, COL.NUM_LAST_SUF);
    const flatNumber  = fmtNum(COL.FLAT_PREFIX, COL.FLAT_NUMBER, 0 /* no suffix col */);
    // Note: FLAT_NUMBER_SUFFIX uses COL.FLAT_SUFFIX but fmtNum only takes idx
    const flatNumFull = (() => {
      const pre = cols[COL.FLAT_PREFIX]?.trim();
      const n   = cols[COL.FLAT_NUMBER]?.trim();
      const suf = cols[COL.FLAT_SUFFIX]?.trim();
      if (!n) return null;
      return [pre, n, suf].filter(Boolean).join("");
    })();

    const flatType    = cols[COL.FLAT_TYPE]?.trim()    || null;
    const levelType   = cols[COL.LEVEL_TYPE]?.trim()   || null;
    const levelNumber = cols[COL.LEVEL_NUMBER]?.trim() || null;
    const buildingName = cols[COL.BUILDING]?.trim()    || null;
    const parcel       = cols[COL.PARCEL]?.trim()      || null;
    const confidence   = parseInt(cols[COL.CONFIDENCE]?.trim() ?? "0") || 0;
    const postcode     = cols[COL.POSTCODE]?.trim() || loc.postcode;

    const streetName = street.name;
    const streetType = street.type || null;
    const streetSuffix = street.suffix || null;
    const locality = loc.name;

    // Must have at least a street name
    if (!streetName) { skipped++; return; }

    const slug = buildSlug(
      flatType, flatNumFull,
      numberFirst, numberLast,
      streetName, streetType,
      locality, state, postcode,
    );

    const addressFull = buildAddressFull(
      buildingName,
      flatType, flatNumFull,
      levelType, levelNumber,
      numberFirst, numberLast,
      streetName, streetType, streetSuffix,
      locality, state, postcode,
    );

    csvRows.push(
      [
        pid, slug, addressFull, buildingName,
        flatType, flatNumFull, levelType, levelNumber,
        numberFirst, numberLast,
        streetName, streetType, streetSuffix,
        locality, state, postcode,
        geo?.lat ?? null, geo?.lng ?? null,
        parcel, confidence,
        now, now,
      ].map(csvVal).join(",") + "\n",
    );

    if (csvRows.length >= COPY_BUFFER) await flushCopy();
  });

  await flushCopy();
  pgClient.release();

  const elapsed = Math.round((Date.now() - stateStart) / 1000);
  console.log(`  ✅ ${state}: ${inserted.toLocaleString()} inserted, ${skipped.toLocaleString()} skipped — ${elapsed}s`);
  return inserted;

  // Free memory
  localityMap.clear();
  streetMap.clear();
  geocodeMap.clear();
}

// ─── Suburb linkage ───────────────────────────────────────────────────────────
async function linkSuburbs(): Promise<void> {
  console.log("\nLinking suburbSlug…");

  const suburbs = await db.suburb.findMany({
    select: { slug: true, name: true, state: true },
  });

  // Build map: "brisbane:QLD" → slug
  const suburbIndex = new Map<string, string>();
  for (const s of suburbs) {
    suburbIndex.set(`${s.name.toUpperCase()}:${s.state}`, s.slug);
  }

  console.log(`  ${suburbs.length} suburbs in index`);

  // Update PropertyAddress rows in batches by locality+state match
  const distinctLocalities = await db.propertyAddress.findMany({
    where: { suburbSlug: null },
    select: { locality: true, state: true },
    distinct: ["locality", "state"],
  });

  let linked = 0;
  for (const { locality, state } of distinctLocalities) {
    const slug = suburbIndex.get(`${locality.toUpperCase()}:${state}`);
    if (!slug) continue;

    await db.propertyAddress.updateMany({
      where: { locality, state, suburbSlug: null },
      data:  { suburbSlug: slug },
    });
    linked++;
    if (linked % 100 === 0) console.log(`  … ${linked} localities linked`);
  }

  console.log(`  ✅ Linked ${linked} localities to suburb slugs`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`G-NAF import${DRY_RUN ? " (DRY RUN)" : ""}${stateFilter ? ` — state: ${stateFilter}` : " — all states"}`);

  if (LINK_ONLY) {
    await linkSuburbs();
    await db.$disconnect();
    return;
  }

  // 1. Download ZIP
  if (!SKIP_DOWNLOAD && !SKIP_EXTRACT) {
    if (fs.existsSync(GNAF_ZIP_PATH)) {
      console.log(`\nZIP already exists at ${GNAF_ZIP_PATH} — skipping download.`);
      console.log("  (Delete it or use --skip-download to force re-download)");
    } else {
      console.log(`\nDownloading G-NAF ZIP (1.7 GB) to ${GNAF_ZIP_PATH}…`);
      console.log("  This will take several minutes depending on connection speed.");
      const { stderr } = await execAsync(
        `curl -L --progress-bar -o "${GNAF_ZIP_PATH}" "${GNAF_ZIP_URL}"`,
      );
      if (stderr) console.log(stderr); // curl progress goes to stderr
      console.log("  Download complete.");
    }
  }

  if (!fs.existsSync(GNAF_DIR)) fs.mkdirSync(GNAF_DIR, { recursive: true });

  // 2–3. Extract and process each state in sequence (then clean up) to conserve disk space
  const statesToProcess = stateFilter ? [stateFilter] : ALL_STATES;
  const completedStates = RESUME ? await loadProgress() : new Set<string>();
  for (const state of statesToProcess) {
    if (RESUME && completedStates.has(state)) {
      console.log(`\n── ${state}: already complete (--resume) ──`);
      continue;
    }
    // Extract this state's files (unless already present on disk)
    const alreadyExtracted = findStateFiles(state) !== null;

    if (!SKIP_EXTRACT && !alreadyExtracted) {
      const filePatterns = [
        `*${state}_ADDRESS_DETAIL_psv.psv`,
        `*${state}_ADDRESS_DEFAULT_GEOCODE_psv.psv`,
        `*${state}_LOCALITY_psv.psv`,
        `*${state}_STREET_LOCALITY_psv.psv`,
      ];
      console.log(`\nExtracting ${state} files from ZIP…`);
      const patterns = filePatterns.map((p) => `"${p}"`).join(" ");
      try {
        execSync(
          `unzip -j -o "${GNAF_ZIP_PATH}" ${patterns} -d "${GNAF_DIR}" 2>&1`,
          { stdio: "inherit", maxBuffer: 10_000_000 },
        );
      } catch {
        console.log(`  Extraction for ${state} complete (some patterns may not have matched).`);
      }
    }

    const rowCount = await processState(state);
    await markStateComplete(state, rowCount);

    // Delete extracted files for this state to free disk space before next state
    if (!SKIP_EXTRACT) {
      const suffixes = [
        "ADDRESS_DETAIL_psv.psv",
        "ADDRESS_DEFAULT_GEOCODE_psv.psv",
        "LOCALITY_psv.psv",
        "STREET_LOCALITY_psv.psv",
      ];
      for (const s of suffixes) {
        const p = path.join(GNAF_DIR, `${state}_${s}`);
        if (fs.existsSync(p)) { fs.unlinkSync(p); }
      }
      console.log(`  Cleaned up ${state} files.`);
    }
  }

  // 4. Link suburbs
  if (!DRY_RUN) {
    await linkSuburbs();
  }

  console.log("\n✅ G-NAF import complete.");
  console.log(`   Data: G-NAF Feb 2026 — https://data.gov.au`);
  console.log(`   Licence: Creative Commons Attribution 4.0`);
  console.log(`   Next update: Run again after next G-NAF quarterly release`);

  await db.$disconnect();
  await pgPool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
