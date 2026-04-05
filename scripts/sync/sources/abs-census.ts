/**
 * ABS 2021 Census DataPack Sync
 *
 * Downloads the ABS General Community Profile (GCP) DataPack at the
 * Suburb and Locality (SAL) geographic level for SA and VIC, and populates
 * suburb records with real census data:
 *   - population       ← G01 Tot_P_P (Total Persons)
 *   - medianAge        ← G02 Median_age_persons
 *   - ownerOccupied    ← G37 (O_OR + O_MTG) / Total × 100
 *   - renterOccupied   ← G37 R_Tot / Total × 100
 *   - medianRentUnit   ← G02 Median_rent_weekly (census baseline only; synced data takes precedence)
 *
 * SAL code → suburb name lookup comes from:
 *   Metadata/2021Census_geog_desc_1st_2nd_3rd_release.xlsx
 *   Sheet: "2021_ASGS_Non_ABS_Structures"
 *
 * Data source: https://www.abs.gov.au/census/find-census-data/datapacks
 * Schedule: Annual (census data is 2021; next census 2026, releasing from 2027)
 */
import "dotenv/config";
import AdmZip from "adm-zip";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "abs-census";

const STATE_PACKS: Array<{ state: string; url: string }> = [
  {
    state: "SA",
    url: "https://www.abs.gov.au/census/find-census-data/datapacks/download/2021_GCP_SAL_for_SA_short-header.zip",
  },
  {
    state: "VIC",
    url: "https://www.abs.gov.au/census/find-census-data/datapacks/download/2021_GCP_SAL_for_VIC_short-header.zip",
  },
  {
    state: "NSW",
    url: "https://www.abs.gov.au/census/find-census-data/datapacks/download/2021_GCP_SAL_for_NSW_short-header.zip",
  },
  {
    state: "QLD",
    url: "https://www.abs.gov.au/census/find-census-data/datapacks/download/2021_GCP_SAL_for_QLD_short-header.zip",
  },
  {
    state: "WA",
    url: "https://www.abs.gov.au/census/find-census-data/datapacks/download/2021_GCP_SAL_for_WA_short-header.zip",
  },
];

interface CensusRecord {
  population:          number | null;
  medianAge:           number | null;
  medianRent:          number | null;
  ownerOccupied:       number | null;
  renterOccupied:      number | null;
  householdsFamily:    number | null;
  householdsLonePerson: number | null;
}

function normName(s: string): string {
  // Strip state suffixes like "(SA)" "(VIC)" and lowercase
  return s.trim().replace(/\s*\([A-Z]{2,3}\)\s*$/, "").trim().toLowerCase();
}

function findCol(headers: string[], patterns: RegExp[]): string | null {
  for (const pat of patterns) {
    const found = headers.find((h) => pat.test(h));
    if (found) return found;
  }
  return null;
}

async function processStatePack(
  state: string,
  url: string
): Promise<Map<string, CensusRecord>> {
  log(SOURCE_ID, `downloading ${state} pack from ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading ${state} census pack`);

  const zipBuf = Buffer.from(await res.arrayBuffer());
  const zip = new AdmZip(zipBuf);
  const entries = zip.getEntries();

  // ── SAL code → suburb name from metadata XLSX ─────────────────────────────
  const metaEntry = entries.find((e) => e.entryName.includes("geog_desc") && e.entryName.endsWith(".xlsx"));
  if (!metaEntry) throw new Error(`No metadata XLSX found in ${state} pack`);

  const metaBuf = zip.readFile(metaEntry);
  if (!metaBuf) throw new Error("Could not read metadata XLSX");

  const wb = XLSX.read(metaBuf, { type: "buffer" });
  // Sheet with SAL mappings
  const sheetName =
    wb.SheetNames.find((n) => n.includes("Non_ABS") || n.includes("SAL")) ??
    wb.SheetNames.find((n) => n.includes("2021")) ??
    wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const metaRows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: "" });

  const salToName = new Map<string, string>();
  for (const row of metaRows) {
    const code = String(row["Census_Code_2021"] ?? row["Census Code 2021"] ?? "").trim();
    const name = String(row["Census_Name_2021"] ?? row["Census Name 2021"] ?? "").trim();
    if (code.startsWith("SAL") && name) {
      salToName.set(code, name);
    }
  }
  log(SOURCE_ID, `${state}: ${salToName.size} SAL → name mappings`);

  // Helper to read a CSV entry matching a pattern
  function readCsv(pattern: RegExp): Papa.ParseResult<Record<string, string>> | null {
    const entry = entries.find((e) => pattern.test(e.entryName));
    if (!entry) return null;
    const buf = zip.readFile(entry);
    if (!buf) return null;
    return Papa.parse<Record<string, string>>(buf.toString("utf8"), {
      header: true, skipEmptyLines: true,
    });
  }

  // ── G01: Population ───────────────────────────────────────────────────────
  const g01 = readCsv(/G01_[A-Z]+_SAL\.csv$/i);
  const popMap = new Map<string, number>();
  if (g01) {
    const headers = Object.keys(g01.data[0] ?? {});
    const popCol = findCol(headers, [/^Tot_P_P$/i, /total.*persons.*persons/i, /Tot_P_Tot/i]);
    if (popCol) {
      for (const row of g01.data) {
        const code = String(row["SAL_CODE_2021"] ?? "").trim();
        const val = parseInt(String(row[popCol] ?? "0").replace(/,/g, "")) || 0;
        if (code && val > 0) popMap.set(code, val);
      }
    }
  }

  // ── G02: Medians ──────────────────────────────────────────────────────────
  const g02 = readCsv(/G02_[A-Z]+_SAL\.csv$/i);
  const medianMap = new Map<string, { medianAge: number | null; medianRent: number | null }>();
  if (g02) {
    const headers = Object.keys(g02.data[0] ?? {});
    const ageCol  = findCol(headers, [/Median_age_persons/i, /Med_age/i]);
    const rentCol = findCol(headers, [/Median_rent_weekly/i, /Med_rent/i]);
    for (const row of g02.data) {
      const code = String(row["SAL_CODE_2021"] ?? "").trim();
      if (!code) continue;
      const age  = ageCol  ? parseInt(String(row[ageCol]  ?? "").replace(/,/g, "")) || null : null;
      const rent = rentCol ? parseInt(String(row[rentCol] ?? "").replace(/,/g, "")) || null : null;
      medianMap.set(code, { medianAge: age, medianRent: rent });
    }
  }

  // ── G37: Tenure (owned/rented %) ──────────────────────────────────────────
  const g37 = readCsv(/G37_[A-Z]+_SAL\.csv$/i);
  const tenureMap = new Map<string, { ownerOccupied: number; renterOccupied: number }>();
  if (g37) {
    const headers = Object.keys(g37.data[0] ?? {});
    // Owned outright: total column
    const ownedCol  = findCol(headers, [/^O_OR_Total$/i,    /O_Or_Tot$/i,  /Owned_out.*Total/i]);
    // Owned with mortgage: total column
    const mortgCol  = findCol(headers, [/^O_MTG_Total$/i,   /O_Mtg_Tot$/i, /Owned.*mort.*Total/i]);
    // Total renters
    const rentedCol = findCol(headers, [/^R_Tot_Total$/i,   /R_Ttl_Tot$/i, /Rent.*Total.*Total/i]);
    // Grand total
    const totalCol  = findCol(headers, [/^Total_Total$/i, /^Total$/i, /^Tot$/i, /Grand_Total/i]);

    for (const row of g37.data) {
      const code = String(row["SAL_CODE_2021"] ?? "").trim();
      if (!code) continue;

      const parse = (col: string | null) =>
        col ? parseInt(String(row[col] ?? "0").replace(/,/g, "")) || 0 : 0;

      const owned  = parse(ownedCol) + parse(mortgCol);
      const rented = parse(rentedCol);
      const total  = parse(totalCol);

      if (total > 0) {
        tenureMap.set(code, {
          ownerOccupied:  Math.round((owned  / total) * 100),
          renterOccupied: Math.round((rented / total) * 100),
        });
      }
    }
  }

  // ── G35: Household composition (family vs lone person) ───────────────────
  const g35 = readCsv(/G35_[A-Z]+_SAL\.csv$/i);
  const householdMap = new Map<string, { householdsFamily: number; householdsLonePerson: number }>();
  if (g35) {
    const headers = Object.keys(g35.data[0] ?? {});
    const famCol      = findCol(headers, [/^Total_FamHhold$/i,        /^Total_Fam_Hhold$/i]);
    const loneCol     = findCol(headers, [/^Num_Psns_UR_1_NonFamHhold$/i, /^Lone_Person$/i]);
    const totalCol    = findCol(headers, [/^Total_Total$/i,            /^Total_Dwellings$/i]);

    if (famCol && loneCol && totalCol) {
      for (const row of g35.data) {
        const code = String(row["SAL_CODE_2021"] ?? "").trim();
        if (!code) continue;
        const parse = (col: string) => parseInt(String(row[col] ?? "0").replace(/,/g, "")) || 0;
        const total = parse(totalCol);
        if (total > 0) {
          householdMap.set(code, {
            householdsFamily:    Math.round((parse(famCol)  / total) * 100),
            householdsLonePerson: Math.round((parse(loneCol) / total) * 100),
          });
        }
      }
    }
  }

  // ── Combine into CensusRecord per SAL code ────────────────────────────────
  const result = new Map<string, CensusRecord>();
  const allCodes = new Set([...popMap.keys(), ...medianMap.keys(), ...tenureMap.keys(), ...householdMap.keys()]);
  for (const code of allCodes) {
    const name = salToName.get(code);
    if (!name) continue;
    const key = normName(name);
    result.set(key, {
      population:           popMap.get(code)      ?? null,
      medianAge:            medianMap.get(code)?.medianAge  ?? null,
      medianRent:           medianMap.get(code)?.medianRent ?? null,
      ownerOccupied:        tenureMap.get(code)?.ownerOccupied  ?? null,
      renterOccupied:       tenureMap.get(code)?.renterOccupied ?? null,
      householdsFamily:     householdMap.get(code)?.householdsFamily    ?? null,
      householdsLonePerson: householdMap.get(code)?.householdsLonePerson ?? null,
    });
  }
  log(SOURCE_ID, `${state}: ${result.size} SAL records with data`);
  return result;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    let totalUpdated = 0;

    for (const { state, url } of STATE_PACKS) {
      let censusData: Map<string, CensusRecord>;
      try {
        censusData = await processStatePack(state, url);
      } catch (err) {
        log(SOURCE_ID, `${state} pack failed: ${(err as Error).message} — skipping`);
        continue;
      }

      // Load all suburbs for this state
      const suburbs = await prisma.suburb.findMany({
        where: { state },
        select: { id: true, name: true, medianRentHouse: true, statsSource: true },
      });
      log(SOURCE_ID, `${state}: matching census data to ${suburbs.length} suburb records`);

      let stateUpdated = 0;
      for (const suburb of suburbs) {
        const key = normName(suburb.name);
        const census = censusData.get(key);
        if (!census) continue;

        // Only overwrite medianRentUnit from census (house rent comes from rental-* syncs)
        // Don't overwrite medianRentHouse if it's already been set by a rental sync
        const shouldUpdateRent = suburb.medianRentHouse === 0;

        await prisma.suburb.update({
          where: { id: suburb.id },
          data: {
            ...(census.population          !== null ? { population:          census.population }          : {}),
            ...(census.medianAge           !== null ? { medianAge:           census.medianAge }            : {}),
            ...(census.ownerOccupied       !== null ? { ownerOccupied:       census.ownerOccupied }        : {}),
            ...(census.renterOccupied      !== null ? { renterOccupied:      census.renterOccupied }       : {}),
            ...(census.householdsFamily    !== null ? { householdsFamily:    census.householdsFamily }     : {}),
            ...(census.householdsLonePerson !== null ? { householdsLonePerson: census.householdsLonePerson } : {}),
            ...(census.medianRent !== null && shouldUpdateRent
              ? { medianRentHouse: census.medianRent, medianRentUnit: census.medianRent }
              : census.medianRent !== null
              ? { medianRentUnit: census.medianRent }
              : {}),
          },
        });
        stateUpdated++;
      }
      log(SOURCE_ID, `${state}: updated ${stateUpdated} suburbs`);
      totalUpdated += stateUpdated;
    }

    await finishSync(SOURCE_ID, totalUpdated);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
