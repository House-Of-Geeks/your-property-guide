/**
 * ABS 2021 Census DataPack Sync
 *
 * Downloads the ABS General Community Profile (GCP) DataPack at the
 * Suburb and Locality (SAL) geographic level for SA, VIC, NSW, QLD, WA and
 * the states/territories without a dedicated rental sync source (WA, TAS,
 * NT, ACT), and populates suburb records with real census data:
 *   - population       ← G01 Tot_P_P (Total Persons)
 *   - medianAge        ← G02 Median_age_persons
 *   - ownerOccupied    ← G37 (O_OR + O_MTG) / Total × 100
 *   - renterOccupied   ← G37 R_Tot / Total × 100
 *   - medianRentUnit   ← G02 Median_rent_weekly (census baseline; synced data takes precedence)
 *
 * For states WITHOUT a dedicated rental sync (WA, TAS, NT, ACT), G02
 * Med_rent_wkly is also written to Suburb.medianRentHouse as a fallback
 * proxy — but ONLY when the current value is 0 (i.e. no real rental data
 * has been loaded yet).
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

const STATE_PACKS: Array<{ state: string; url: string; rentalFallback?: boolean }> = [
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
    // WA has no free dedicated rental sync — use census rent as fallback proxy
    rentalFallback: true,
  },
  {
    state: "TAS",
    url: "https://www.abs.gov.au/census/find-census-data/datapacks/download/2021_GCP_SAL_for_TAS_short-header.zip",
    rentalFallback: true,
  },
  {
    state: "NT",
    url: "https://www.abs.gov.au/census/find-census-data/datapacks/download/2021_GCP_SAL_for_NT_short-header.zip",
    rentalFallback: true,
  },
  {
    state: "ACT",
    url: "https://www.abs.gov.au/census/find-census-data/datapacks/download/2021_GCP_SAL_for_ACT_short-header.zip",
    rentalFallback: true,
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

    for (const { state, url, rentalFallback } of STATE_PACKS) {
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

      // Collect all matches in memory
      interface UpdateRow {
        id:                   string;
        population:           number | null;
        medianAge:            number | null;
        ownerOccupied:        number | null;
        renterOccupied:       number | null;
        householdsFamily:     number | null;
        householdsLonePerson: number | null;
        medianRentHouse:      number | null;  // null = don't overwrite
        medianRentUnit:       number | null;
      }
      const updates: UpdateRow[] = [];
      for (const suburb of suburbs) {
        const census = censusData.get(normName(suburb.name));
        if (!census) continue;
        // Only write census rent to medianRentHouse when the field is still 0
        // (i.e. no real rental data has been loaded from a state-specific source).
        // This applies equally to fallback states (WA, TAS, NT, ACT) and to
        // non-fallback states where the dedicated sync hasn't run yet.
        const shouldUpdateRent = suburb.medianRentHouse === 0;
        updates.push({
          id:                   suburb.id,
          population:           census.population,
          medianAge:            census.medianAge,
          ownerOccupied:        census.ownerOccupied,
          renterOccupied:       census.renterOccupied,
          householdsFamily:     census.householdsFamily,
          householdsLonePerson: census.householdsLonePerson,
          medianRentHouse:      census.medianRent !== null && shouldUpdateRent ? census.medianRent : null,
          medianRentUnit:       census.medianRent,
        });
      }

      const stateUpdated = updates.length;
      if (stateUpdated > 0) {
        // Single round-trip bulk UPDATE via UNNEST
        await prisma.$executeRaw`
          UPDATE "Suburb" AS s
          SET
            population            = CASE WHEN u.population           IS NOT NULL THEN u.population::int           ELSE s.population            END,
            "medianAge"           = CASE WHEN u.median_age           IS NOT NULL THEN u.median_age::int           ELSE s."medianAge"           END,
            "ownerOccupied"       = CASE WHEN u.owner_occupied       IS NOT NULL THEN u.owner_occupied::float8    ELSE s."ownerOccupied"       END,
            "renterOccupied"      = CASE WHEN u.renter_occupied      IS NOT NULL THEN u.renter_occupied::float8   ELSE s."renterOccupied"      END,
            "householdsFamily"    = CASE WHEN u.households_family    IS NOT NULL THEN u.households_family::float8 ELSE s."householdsFamily"    END,
            "householdsLonePerson"= CASE WHEN u.households_lone      IS NOT NULL THEN u.households_lone::float8  ELSE s."householdsLonePerson" END,
            "medianRentHouse"     = CASE WHEN u.rent_house           IS NOT NULL THEN u.rent_house::int           ELSE s."medianRentHouse"     END,
            "medianRentUnit"      = CASE WHEN u.rent_unit            IS NOT NULL THEN u.rent_unit::int            ELSE s."medianRentUnit"      END,
            "censusUpdatedAt"     = NOW()
          FROM UNNEST(
            ${updates.map((u) => u.id)}::text[],
            ${updates.map((u) => u.population)}::int[],
            ${updates.map((u) => u.medianAge)}::int[],
            ${updates.map((u) => u.ownerOccupied)}::float8[],
            ${updates.map((u) => u.renterOccupied)}::float8[],
            ${updates.map((u) => u.householdsFamily)}::float8[],
            ${updates.map((u) => u.householdsLonePerson)}::float8[],
            ${updates.map((u) => u.medianRentHouse)}::int[],
            ${updates.map((u) => u.medianRentUnit)}::int[]
          ) AS u(id, population, median_age, owner_occupied, renter_occupied, households_family, households_lone, rent_house, rent_unit)
          WHERE s.id = u.id
        `;
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
