/**
 * QLD Rental Data Sync (RTA)
 *
 * Downloads median weekly rent by suburb from the Queensland Residential
 * Tenancies Authority (RTA). The XLSX file is updated in-place quarterly.
 *
 * File structure (as of Apr 2026):
 *   Sheet: "4 sub-rents"
 *   Row 4: labels (col 0 empty, col 1 "Suburb", col 2 "Dwelling", col 3+ = periods)
 *   Row 5: months (Sep, Dec, Mar, Jun, Sep, Dec, ...)
 *   Row 6: years (2017, 2017, 2018, 2018, ...)
 *   Data rows: col 1 = suburb name, col 2 = dwelling type, col 3+ = median rent values
 *
 * Dwelling types: "Flat 1", "Flat 2", "Flat 3",
 *                 "House 2", "House 3", "House 4",
 *                 "Townhouse 2", "Townhouse 3", "All dwellings"
 *
 * Strategy:
 *   - medianRentHouse: House 3 → House 2 → House 4 → Townhouse 3 → Townhouse 2
 *   - medianRentUnit:  Flat 2 → Flat 1 → Flat 3
 *   - Period: derived from last non-empty data column (month + year rows)
 *
 * No postcode in suburb sheet — match by suburb name + state (QLD) only.
 *
 * Data source: https://www.rta.qld.gov.au/forms-resources/rta-quarterly-data/median-rents-quarterly-data
 * Schedule: Quarterly
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";

const SOURCE_ID = "rental-qld";

const RTA_URLS = [
  "https://www.rta.qld.gov.au/sites/default/files/2023-04/rta-bond-statistics.xlsx",
];

const MONTH_QUARTER: Record<string, string> = {
  jan: "Q1", feb: "Q1", mar: "Q1",
  apr: "Q2", may: "Q2", jun: "Q2",
  jul: "Q3", aug: "Q3", sep: "Q3",
  oct: "Q4", nov: "Q4", dec: "Q4",
};
const MONTH_NUM: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4,  may: 5,  jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

async function downloadXlsx(): Promise<Buffer> {
  for (const url of RTA_URLS) {
    log(SOURCE_ID, `trying ${url}`);
    try {
      const res = await fetch(url);
      if (!res.ok) { log(SOURCE_ID, `HTTP ${res.status} — skipping`); continue; }
      const ct = res.headers.get("content-type") ?? "";
      if (ct.includes("text/html")) { log(SOURCE_ID, "got HTML — skipping"); continue; }
      const buf = Buffer.from(await res.arrayBuffer());
      log(SOURCE_ID, `downloaded ${buf.length} bytes`);
      return buf;
    } catch (err) {
      log(SOURCE_ID, `fetch error: ${(err as Error).message} — skipping`);
    }
  }
  throw new Error("Could not download RTA QLD rental XLSX from any known URL");
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    const buffer = await downloadXlsx();
    const wb = XLSX.read(buffer, { type: "buffer" });
    log(SOURCE_ID, `sheets: ${wb.SheetNames.join(", ")}`);

    // ── Find the suburb-level sheet ───────────────────────────────────────────
    // "4 sub-rents" is the suburb sheet; avoid matching "1 pc-rents" by trying
    // "sub-rents" first, then fall back to generic "suburb" match.
    const sheetName =
      wb.SheetNames.find((n) => /sub.?rent/i.test(n)) ??
      wb.SheetNames.find((n) => /suburb/i.test(n)) ??
      wb.SheetNames[1] ??
      wb.SheetNames[0];
    log(SOURCE_ID, `using sheet: ${sheetName}`);

    const ws = wb.Sheets[sheetName];
    const raw = XLSX.utils.sheet_to_json<(string | number)[]>(ws, {
      header: 1,
      defval: "",
    });
    log(SOURCE_ID, `${raw.length} rows in sheet`);

    // ── Detect the header row (has "Suburb" in col 1 and "Dwelling" in col 2) ─
    let headerRowIdx = -1;
    let monthRow: (string | number)[] = [];
    let yearRow:  (string | number)[] = [];

    for (let r = 0; r < Math.min(20, raw.length); r++) {
      const row = raw[r] as (string | number)[];
      const cells = row.map((c) => String(c ?? "").trim());
      // Look for the label row that contains "Suburb" and "Dwelling"
      if (cells.some((c) => /^suburb$/i.test(c)) && cells.some((c) => /^dwelling/i.test(c))) {
        headerRowIdx = r;
        // Month and year labels are in the two rows following the header
        monthRow = raw[r + 1] as (string | number)[] ?? [];
        yearRow  = raw[r + 2] as (string | number)[] ?? [];
        break;
      }
    }

    if (headerRowIdx < 0) {
      throw new Error(
        `Could not find header row with Suburb + Dwelling columns. ` +
        `Sheet "${sheetName}" first 3 rows: ${JSON.stringify(raw.slice(0, 3))}`
      );
    }
    log(SOURCE_ID, `header at row ${headerRowIdx}, month row ${headerRowIdx + 1}, year row ${headerRowIdx + 2}`);

    // ── Detect column positions from header row ───────────────────────────────
    const headers = (raw[headerRowIdx] as (string | number)[]).map((c) => String(c ?? "").trim());
    const colSuburb  = headers.findIndex((h) => /^suburb$/i.test(h));
    const colDwelling = headers.findIndex((h) => /^dwelling/i.test(h));

    if (colSuburb < 0 || colDwelling < 0) {
      throw new Error(`Could not find Suburb (${colSuburb}) or Dwelling (${colDwelling}) columns`);
    }

    // ── Find the last data column (most recent quarter) ───────────────────────
    // Scan backward from the end of the month row to find the last non-empty cell
    let lastDataCol = -1;
    for (let c = monthRow.length - 1; c > colDwelling; c--) {
      const v = String(monthRow[c] ?? "").trim();
      if (v && v !== "") { lastDataCol = c; break; }
    }
    if (lastDataCol < 0) lastDataCol = headers.length - 1;

    // Derive period from month + year at lastDataCol
    const rawMonth = String(monthRow[lastDataCol] ?? "").trim().toLowerCase().slice(0, 3);
    const rawYear  = parseInt(String(yearRow[lastDataCol] ?? "")) || new Date().getFullYear();
    const q   = MONTH_QUARTER[rawMonth] ?? "Q4";
    const mon = MONTH_NUM[rawMonth]     ?? 12;
    const period     = `${rawYear}-${q}`;
    const periodDate = new Date(`${rawYear}-${String(mon).padStart(2, "0")}-01`);
    log(SOURCE_ID, `period: ${period} (col ${lastDataCol}: ${rawMonth} ${rawYear})`);

    // ── Parse data rows ───────────────────────────────────────────────────────
    // suburb → { house3, house2, house4, th3, th2, flat2, flat1, flat3 }
    interface DwellingRents {
      house3: number | null; house2: number | null; house4: number | null;
      th3:    number | null; th2:    number | null;
      flat2:  number | null; flat1:  number | null; flat3:  number | null;
    }
    const dataMap = new Map<string, DwellingRents>();

    const dataStart = headerRowIdx + 3; // skip header + month + year rows
    for (let i = dataStart; i < raw.length; i++) {
      const row = raw[i] as (string | number)[];
      const suburb   = String(row[colSuburb]   ?? "").trim();
      const dwelling = String(row[colDwelling]  ?? "").trim();
      if (!suburb || /total|^-|^\s*$/i.test(suburb)) continue;
      if (!dwelling) continue;

      const rawVal = row[lastDataCol];
      const rent   = typeof rawVal === "number"
        ? Math.round(rawVal)
        : parseInt(String(rawVal ?? "").replace(/[^0-9]/g, "")) || null;
      if (!rent) continue;

      const key = suburb.toLowerCase();
      if (!dataMap.has(key)) {
        dataMap.set(key, {
          house3: null, house2: null, house4: null,
          th3:    null, th2:    null,
          flat2:  null, flat1:  null, flat3:  null,
        });
      }
      const rec = dataMap.get(key)!;

      const dl = dwelling.toLowerCase().replace(/\s+/g, " ");
      if      (dl === "house 3")      rec.house3 = rent;
      else if (dl === "house 2")      rec.house2 = rent;
      else if (dl === "house 4")      rec.house4 = rent;
      else if (dl === "townhouse 3")  rec.th3    = rent;
      else if (dl === "townhouse 2")  rec.th2    = rent;
      else if (dl === "flat 2")       rec.flat2  = rent;
      else if (dl === "flat 1")       rec.flat1  = rent;
      else if (dl === "flat 3")       rec.flat3  = rent;
      // "all dwellings" — ignore; we prefer type-specific rows
    }

    log(SOURCE_ID, `${dataMap.size} suburbs parsed`);

    // ── Build original suburb name lookup (preserve casing for DB) ────────────
    const suburbNames = new Map<string, string>(); // lowercase key → original name
    for (let i = dataStart; i < raw.length; i++) {
      const row    = raw[i] as (string | number)[];
      const suburb = String(row[colSuburb] ?? "").trim();
      if (!suburb || /total|^-|^\s*$/i.test(suburb)) continue;
      const key = suburb.toLowerCase();
      if (!suburbNames.has(key)) suburbNames.set(key, suburb);
    }

    // ── Pre-load QLD suburb slug→id map ──────────────────────────────────────
    const qldSuburbs = await prisma.suburb.findMany({
      where:  { state: "QLD" },
      select: { id: true, slug: true },
    });
    const slugToId = new Map(qldSuburbs.map((s) => [s.slug, s.id]));

    // ── Upsert SuburbRentalStat + collect Suburb updates ─────────────────────
    interface UpdateRow {
      id:              string;
      medianRentHouse: number | null;
      medianRentUnit:  number | null;
    }
    const suburbUpdates: UpdateRow[] = [];
    let count = 0;

    for (const [key, rents] of dataMap) {
      const suburbName = suburbNames.get(key) ?? key;

      const medianHouse =
        rents.house3 ?? rents.house2 ?? rents.house4 ?? rents.th3 ?? rents.th2 ?? null;
      const medianUnit  =
        rents.flat2 ?? rents.flat1 ?? rents.flat3 ?? null;

      if (!medianHouse && !medianUnit) continue;

      // No postcode in suburb sheet — resolve by name + state only
      const suburbSlug = await resolveSlug(suburbName, "QLD", "");

      await prisma.suburbRentalStat.upsert({
        where: {
          suburbName_postcode_state_period: {
            suburbName,
            postcode:   "",
            state:      "QLD",
            period:     period,
          },
        },
        create: {
          suburbSlug,
          suburbName,
          postcode:        "",
          state:           "QLD",
          period,
          periodDate,
          medianRentHouse: medianHouse,
          medianRentUnit:  medianUnit,
          source:          SOURCE_ID,
        },
        update: {
          suburbSlug,
          medianRentHouse: medianHouse,
          medianRentUnit:  medianUnit,
        },
      });
      count++;

      if (suburbSlug) {
        const suburbId = slugToId.get(suburbSlug);
        if (suburbId) {
          suburbUpdates.push({ id: suburbId, medianRentHouse: medianHouse, medianRentUnit: medianUnit });
        }
      }
    }

    // ── Bulk UPDATE Suburb via UNNEST ─────────────────────────────────────────
    if (suburbUpdates.length > 0) {
      await prisma.$executeRaw`
        UPDATE "Suburb" AS s
        SET
          "medianRentHouse" = CASE WHEN u.rent_house IS NOT NULL THEN u.rent_house::int ELSE s."medianRentHouse" END,
          "medianRentUnit"  = CASE WHEN u.rent_unit  IS NOT NULL THEN u.rent_unit::int  ELSE s."medianRentUnit"  END,
          "statsUpdatedAt"  = NOW(),
          "rentalUpdatedAt" = NOW(),
          "statsSource"     = ${SOURCE_ID}
        FROM UNNEST(
          ${suburbUpdates.map((u) => u.id)}::text[],
          ${suburbUpdates.map((u) => u.medianRentHouse)}::int[],
          ${suburbUpdates.map((u) => u.medianRentUnit)}::int[]
        ) AS u(id, rent_house, rent_unit)
        WHERE s.id = u.id
      `;
      log(SOURCE_ID, `bulk-updated ${suburbUpdates.length} Suburb rows`);
    }

    await finishSync(SOURCE_ID, count, periodDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
