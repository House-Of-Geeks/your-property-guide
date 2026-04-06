/**
 * ACARA Schools Sync
 *
 * Downloads two XLSX files directly from the ACARA data access portal:
 *   - School Profile 2025: name, type, sector, year range, ICSEA, enrolments, URL
 *   - School Location 2025: lat, lng
 *
 * Joined on ACARA SML ID. Suburbs matched in-memory (no per-row DB calls).
 * Upserted in batches via raw SQL for speed.
 *
 * Data source: https://www.acara.edu.au/contact-us/acara-data-access
 * License: CC BY 4.0
 * Schedule: Annual (update URLs when new data releases)
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "acara-schools";

const PROFILE_URL  = "https://dataandreporting.blob.core.windows.net/anrdataportal/Data-Access-Program/School%20Profile%202025.xlsx";
const LOCATION_URL = "https://dataandreporting.blob.core.windows.net/anrdataportal/Data-Access-Program/School%20Location%202025.xlsx";

interface ProfileRow {
  "ACARA SML ID":                       number | string;
  "School Name":                        string;
  "Suburb":                             string;
  "State":                              string;
  "Postcode":                           string | number;
  "School Sector":                      string;
  "School Type":                        string;
  "School URL":                         string;
  "Year Range":                         string;
  "ICSEA":                              number | string;
  "Total Enrolments":                   number | string;
  "Girls Enrolments":                   number | string;
  "Boys Enrolments":                    number | string;
  "Indigenous Enrolments (%)":                    number | string;
  "Language Background Other Than English - Yes (%)": number | string;
  "Teaching Staff":                               number | string;
  "Full Time Equivalent Teaching Staff":          number | string;
  "Non-Teaching Staff":                           number | string;
  "Full Time Equivalent Non-Teaching Staff":      number | string;
  [key: string]: number | string; // allow extra columns
}

interface LocationRow {
  "ACARA SML ID": number | string;
  "Latitude":     number | string;
  "Longitude":    number | string;
}

async function downloadXlsx(url: string): Promise<XLSX.WorkBook> {
  log(SOURCE_ID, `downloading ${decodeURIComponent(url.split("/").pop() ?? url)}`);
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; YourPropertyGuide/1.0)" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return XLSX.read(Buffer.from(await res.arrayBuffer()), { type: "buffer" });
}

function sheetRows<T>(wb: XLSX.WorkBook, sheetIndex = 1): T[] {
  return XLSX.utils.sheet_to_json<T>(wb.Sheets[wb.SheetNames[sheetIndex]], { defval: "" });
}

function normaliseType(t: string): string {
  const l = t.toLowerCase();
  if (l.includes("primary"))   return "primary";
  if (l.includes("secondary")) return "secondary";
  if (l.includes("combined"))  return "combined";
  return "special";
}

function normaliseSector(s: string): string {
  const l = s.toLowerCase();
  if (l.includes("catholic"))    return "catholic";
  if (l.includes("independent")) return "independent";
  return "government";
}

function deriveGender(girls: number | string, boys: number | string): string {
  const g = typeof girls === "number" ? girls : parseInt(String(girls)) || 0;
  const b = typeof boys  === "number" ? boys  : parseInt(String(boys))  || 0;
  if (g > 0 && b === 0) return "girls";
  if (b > 0 && g === 0) return "boys";
  return "coed";
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    // ── 1. Download both XLSXes in parallel ────────────────────────────────
    const [profileWb, locationWb] = await Promise.all([
      downloadXlsx(PROFILE_URL),
      downloadXlsx(LOCATION_URL),
    ]);

    const profileRows  = sheetRows<ProfileRow>(profileWb);
    const locationRows = sheetRows<LocationRow>(locationWb);
    log(SOURCE_ID, `profile: ${profileRows.length} rows, location: ${locationRows.length} rows`);

    // ── 2. Build lat/lng lookup in memory ──────────────────────────────────
    const latLng = new Map<string, { lat: number; lng: number }>();
    for (const row of locationRows) {
      const id  = String(row["ACARA SML ID"]).trim();
      const lat = Number(row["Latitude"]);
      const lng = Number(row["Longitude"]);
      if (id && !isNaN(lat) && !isNaN(lng)) latLng.set(id, { lat, lng });
    }

    // ── 3. Load ALL suburbs into memory once (1 DB call) ──────────────────
    const allSuburbs = await prisma.suburb.findMany({
      select: { id: true, name: true, state: true, postcode: true },
    });
    log(SOURCE_ID, `loaded ${allSuburbs.length} suburbs from DB`);

    // Build lookup maps
    const norm = (s: string) => s.trim().toLowerCase();

    // name+state+postcode → id (exact match)
    const exactMap = new Map<string, string>();
    // postcode+state → [id] (fallback)
    const postcodeMap = new Map<string, string[]>();

    for (const s of allSuburbs) {
      const key = `${norm(s.name)}|${norm(s.state)}|${s.postcode.trim()}`;
      exactMap.set(key, s.id);

      const pk = `${s.postcode.trim()}|${norm(s.state)}`;
      const arr = postcodeMap.get(pk) ?? [];
      arr.push(s.id);
      postcodeMap.set(pk, arr);
    }

    function resolveSuburbId(name: string, state: string, postcode: string): string | null {
      const key = `${norm(name)}|${norm(state)}|${postcode.trim()}`;
      const exact = exactMap.get(key);
      if (exact) return exact;
      // Postcode+state fallback (only if unique)
      const candidates = postcodeMap.get(`${postcode.trim()}|${norm(state)}`);
      if (candidates?.length === 1) return candidates[0];
      return null;
    }

    // ── 4. Build upsert payload in memory ─────────────────────────────────
    interface SchoolRow {
      acaraId:             string;
      name:                string;
      type:                string;
      sector:              string;
      distance:            number;
      suburbId:            string;
      lat:                 number | null;
      lng:                 number | null;
      icsea:               number | null;
      enrolment:           number | null;
      boysEnrolment:       number | null;
      girlsEnrolment:      number | null;
      indigenousPct:       number | null;
      lbotePct:            number | null;
      teachingStaff:       number | null;
      teachingStaffFte:    number | null;
      nonTeachingStaff:    number | null;
      nonTeachingStaffFte: number | null;
      website:             string | null;
      yearRange:           string | null;
      gender:              string;
      updatedFromAcara:    Date;
    }

    const schools: SchoolRow[] = [];
    let skipped = 0;

    for (const row of profileRows) {
      const acaraId = String(row["ACARA SML ID"]).trim();
      if (!acaraId) continue;

      const name     = String(row["School Name"]).trim();
      const suburb   = String(row["Suburb"]).trim();
      const state    = String(row["State"]).trim().toUpperCase();
      const postcode = String(row["Postcode"]).trim();
      if (!name || !suburb || !state) continue;

      const suburbId = resolveSuburbId(suburb, state, postcode);
      if (!suburbId) { skipped++; continue; }

      const geo   = latLng.get(acaraId);
      const num   = (v: number | string) => Number(v) || null;
      const girls = row["Girls Enrolments"];
      const boys  = row["Boys Enrolments"];
      schools.push({
        acaraId,
        name,
        type:                normaliseType(String(row["School Type"])),
        sector:              normaliseSector(String(row["School Sector"])),
        distance:            0,
        suburbId,
        lat:                 geo?.lat ?? null,
        lng:                 geo?.lng ?? null,
        icsea:               num(row["ICSEA"]),
        enrolment:           num(row["Total Enrolments"]),
        boysEnrolment:       num(boys),
        girlsEnrolment:      num(girls),
        indigenousPct:       num(row["Indigenous Enrolments (%)"]),
        lbotePct:            num(row["Language Background Other Than English - Yes (%)"]),
        teachingStaff:       num(row["Teaching Staff"]),
        teachingStaffFte:    num(row["Full Time Equivalent Teaching Staff"]),
        nonTeachingStaff:    num(row["Non-Teaching Staff"]),
        nonTeachingStaffFte: num(row["Full Time Equivalent Non-Teaching Staff"]),
        website:             String(row["School URL"]).trim() || null,
        yearRange:           String(row["Year Range"]).trim() || null,
        gender:              deriveGender(girls, boys),
        updatedFromAcara:    new Date(),
      });
    }

    log(SOURCE_ID, `${schools.length} schools matched, ${skipped} skipped (suburb not in DB)`);

    // ── 5. Bulk upsert via raw SQL in batches of 500 ──────────────────────
    const CHUNK = 500;
    let count = 0;

    for (let i = 0; i < schools.length; i += CHUNK) {
      const chunk = schools.slice(i, i + CHUNK);

      // Use createMany with skipDuplicates=false won't update — use raw upsert
      await prisma.$executeRaw`
        INSERT INTO "School" (
          id, "acaraId", name, type, sector, distance, "suburbId",
          lat, lng, icsea, enrolment, "boysEnrolment", "girlsEnrolment",
          "indigenousPct", "lbotePct",
          "teachingStaff", "teachingStaffFte", "nonTeachingStaff", "nonTeachingStaffFte",
          website, "yearRange", gender, "updatedFromAcara"
        )
        SELECT
          gen_random_uuid()::text,
          u.acara_id, u.name, u.type, u.sector, u.distance::float8, u.suburb_id,
          u.lat::float8, u.lng::float8, u.icsea::int, u.enrolment::int,
          u.boys::int, u.girls::int,
          u.indigenous::float8, u.lbote::float8,
          u.teaching::int, u.teaching_fte::float8,
          u.non_teaching::int, u.non_teaching_fte::float8,
          u.website, u.year_range, u.gender, u.updated_at
        FROM UNNEST(
          ${chunk.map((s) => s.acaraId)}::text[],
          ${chunk.map((s) => s.name)}::text[],
          ${chunk.map((s) => s.type)}::text[],
          ${chunk.map((s) => s.sector)}::text[],
          ${chunk.map(() => 0)}::float8[],
          ${chunk.map((s) => s.suburbId)}::text[],
          ${chunk.map((s) => s.lat)}::float8[],
          ${chunk.map((s) => s.lng)}::float8[],
          ${chunk.map((s) => s.icsea)}::int[],
          ${chunk.map((s) => s.enrolment)}::int[],
          ${chunk.map((s) => s.boysEnrolment)}::int[],
          ${chunk.map((s) => s.girlsEnrolment)}::int[],
          ${chunk.map((s) => s.indigenousPct)}::float8[],
          ${chunk.map((s) => s.lbotePct)}::float8[],
          ${chunk.map((s) => s.teachingStaff)}::int[],
          ${chunk.map((s) => s.teachingStaffFte)}::float8[],
          ${chunk.map((s) => s.nonTeachingStaff)}::int[],
          ${chunk.map((s) => s.nonTeachingStaffFte)}::float8[],
          ${chunk.map((s) => s.website)}::text[],
          ${chunk.map((s) => s.yearRange)}::text[],
          ${chunk.map((s) => s.gender)}::text[],
          ${chunk.map((s) => s.updatedFromAcara)}::timestamptz[]
        ) AS u(acara_id, name, type, sector, distance, suburb_id, lat, lng, icsea, enrolment,
               boys, girls, indigenous, lbote, teaching, teaching_fte, non_teaching, non_teaching_fte,
               website, year_range, gender, updated_at)
        ON CONFLICT ("acaraId") DO UPDATE SET
          name                  = EXCLUDED.name,
          type                  = EXCLUDED.type,
          sector                = EXCLUDED.sector,
          "suburbId"            = EXCLUDED."suburbId",
          lat                   = EXCLUDED.lat,
          lng                   = EXCLUDED.lng,
          icsea                 = EXCLUDED.icsea,
          enrolment             = EXCLUDED.enrolment,
          "boysEnrolment"       = EXCLUDED."boysEnrolment",
          "girlsEnrolment"      = EXCLUDED."girlsEnrolment",
          "indigenousPct"       = EXCLUDED."indigenousPct",
          "lbotePct"            = EXCLUDED."lbotePct",
          "teachingStaff"       = EXCLUDED."teachingStaff",
          "teachingStaffFte"    = EXCLUDED."teachingStaffFte",
          "nonTeachingStaff"    = EXCLUDED."nonTeachingStaff",
          "nonTeachingStaffFte" = EXCLUDED."nonTeachingStaffFte",
          website               = EXCLUDED.website,
          "yearRange"           = EXCLUDED."yearRange",
          gender                = EXCLUDED.gender,
          "updatedFromAcara"    = EXCLUDED."updatedFromAcara"
      `;

      count += chunk.length;
      log(SOURCE_ID, `  ${count}/${schools.length} schools upserted`);
    }

    log(SOURCE_ID, `done — ${count} schools upserted`);
    await finishSync(SOURCE_ID, count);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
