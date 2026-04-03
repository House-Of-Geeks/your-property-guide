/**
 * ACARA Schools Sync
 *
 * Downloads the national school list from the ACARA data access portal via data.gov.au.
 * Upserts School records using acaraId as the stable unique key.
 *
 * Data source: https://www.acara.edu.au/contact-us/acara-data-access
 * CKAN dataset: search data.gov.au for "ACARA school locations"
 *
 * To find the resource ID:
 *   curl "https://data.gov.au/api/3/action/package_search?q=acara+school+locations" | jq '.result.results[0].resources[0].id'
 */
import "dotenv/config";
import Papa from "papaparse";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";
import { getCkanResourceId } from "../ckan";

const SOURCE_ID = "acara-schools";
const CKAN_BASE = "https://data.gov.au";
const PACKAGE_ID = "acara-school-locations-2018"; // verify/update annually at data.gov.au

interface AcaraRow {
  ACARA_SML_ID:      string;
  SCHOOL_NAME:       string;
  SCHOOL_TYPE:       string; // "Primary" | "Secondary" | "Combined" | "Special"
  SCHOOL_SECTOR:     string; // "Government" | "Catholic" | "Independent"
  STATE:             string;
  SUBURB:            string;
  POSTCODE:          string;
  LATITUDE:          string;
  LONGITUDE:         string;
  ICSEA:             string;
  TOTAL_ENROLMENTS:  string;
  SCHOOL_URL:        string;
}

function normaliseType(t: string): "primary" | "secondary" | "combined" | "special" {
  const lower = t.toLowerCase();
  if (lower.includes("primary"))   return "primary";
  if (lower.includes("secondary")) return "secondary";
  if (lower.includes("combined"))  return "combined";
  return "special";
}

function normaliseSector(s: string): "government" | "catholic" | "independent" {
  const lower = s.toLowerCase();
  if (lower.includes("catholic"))    return "catholic";
  if (lower.includes("independent")) return "independent";
  return "government";
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    // Discover latest resource ID from CKAN package
    const resourceId = await getCkanResourceId(PACKAGE_ID, CKAN_BASE, "CSV");
    log(SOURCE_ID, `resource ID: ${resourceId}`);

    // Download the CSV
    const url = `${CKAN_BASE}/api/3/action/datastore_search?resource_id=${resourceId}&limit=100000`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json() as { success: boolean; result: { records: AcaraRow[] } };
    if (!json.success) throw new Error("CKAN error fetching ACARA data");

    const rows: AcaraRow[] = json.result.records;
    log(SOURCE_ID, `fetched ${rows.length} schools`);

    let count = 0;
    let skipped = 0;

    for (const row of rows) {
      if (!row.ACARA_SML_ID) continue;

      const suburbSlug = await resolveSlug(row.SUBURB, row.STATE, row.POSTCODE);
      const suburbRow = suburbSlug
        ? await prisma.suburb.findUnique({ where: { slug: suburbSlug }, select: { id: true } })
        : null;

      if (!suburbRow) {
        // Suburb not in DB yet — skip the FK-required School insert but log it
        skipped++;
        continue;
      }

      await prisma.school.upsert({
        where: { acaraId: row.ACARA_SML_ID },
        create: {
          name:     row.SCHOOL_NAME,
          type:     normaliseType(row.SCHOOL_TYPE),
          sector:   normaliseSector(row.SCHOOL_SECTOR),
          distance: 0, // distance is suburb-relative, not in ACARA data
          suburbId: suburbRow.id,
          acaraId:  row.ACARA_SML_ID,
          lat:      parseFloat(row.LATITUDE) || null,
          lng:      parseFloat(row.LONGITUDE) || null,
          icsea:    parseInt(row.ICSEA) || null,
          enrolment: parseInt(row.TOTAL_ENROLMENTS) || null,
          website:  row.SCHOOL_URL || null,
          updatedFromAcara: new Date(),
        },
        update: {
          name:     row.SCHOOL_NAME,
          type:     normaliseType(row.SCHOOL_TYPE),
          sector:   normaliseSector(row.SCHOOL_SECTOR),
          lat:      parseFloat(row.LATITUDE) || null,
          lng:      parseFloat(row.LONGITUDE) || null,
          icsea:    parseInt(row.ICSEA) || null,
          enrolment: parseInt(row.TOTAL_ENROLMENTS) || null,
          website:  row.SCHOOL_URL || null,
          updatedFromAcara: new Date(),
        },
      });
      count++;
    }

    log(SOURCE_ID, `inserted/updated ${count} schools, skipped ${skipped} (suburb not in DB)`);
    await finishSync(SOURCE_ID, count);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
