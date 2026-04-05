/**
 * QLD Property Sales Sync — Census-Derived Proxy
 *
 * ─── DATA SOURCE RESEARCH FINDINGS (verified Apr 2026) ───────────────────────
 * Queensland does NOT publish free bulk property sale price data.
 *
 * Investigated sources (all exhausted as of Apr 2026):
 *
 *   • data.qld.gov.au CKAN portal (https://www.data.qld.gov.au/dataset?q=property+sales)
 *     Result: No property sale price datasets found. Only results were:
 *       – Valuation Property Boundaries – Queensland (QVAS): spatial/cadastral
 *         GIS boundaries only, no prices.
 *       – Historical Cadastral Map Series: scanned historical maps.
 *     API package_search also tried for: "property price", "median house",
 *     "real estate", "property sales", "property transactions", "land sale",
 *     "housing market suburb" — all returned zero relevant hits.
 *
 *   • data.qld.gov.au/dataset/property-sales-information
 *     Result: 404 — dataset does not exist on the portal.
 *
 *   • qldspatial.information.qld.gov.au/catalogue/
 *     Result: HTTP 302 redirect loop — site non-functional / under maintenance.
 *
 *   • Queensland Titles Registry / titlesqld.com.au
 *     URL: https://www.titlesqld.com.au/products-and-services/property-sales-information/
 *     Result: PAID per-report service. Individual sales reports ~$7.40 each.
 *     Suburb sales reports sold individually (price on inquiry).
 *     No bulk download, no API, no CC-licensed export available.
 *
 *   • QGSO (Queensland Government Statistician's Office) — housing reports
 *     published as PDFs only; no machine-readable suburb-level data.
 *
 *   • REIQ (Real Estate Institute of Queensland) — data behind paywall.
 *
 *   • ABS Residential Property Price Indexes — capital city level only,
 *     not suburb-level.
 *
 * ─── WA FINDINGS (same investigation) ────────────────────────────────────────
 *   • catalogue.data.wa.gov.au/dataset/wa-property-sales-statistics — 404.
 *   • Landgate "Sales Evidence data" (catalogue.data.wa.gov.au/dataset/sales-evidence-data)
 *     EXISTS but is PAYWALLED ("Fees Apply"). Contains Transfer of Land records
 *     back to 1988, updated weekly. Access via one-off extract, annual subscription,
 *     or reseller agreement. Contact: CustomerExperience@Landgate.wa.gov.au.
 *     Licence: Custom (non-CC); not freely redistributable.
 *   • Landgate property sales reports portal — paid per-suburb/per-street reports.
 *
 *   WA has no free bulk equivalent. If Landgate access is procured, a sales-wa.ts
 *   script would parse the flat-file export (suburb, parcel, sale price, date) in
 *   a manner similar to sales-nsw.ts. The data dictionary is available free at:
 *   https://catalogue.data.wa.gov.au/dataset/sales-evidence-data (XLSX resource).
 *
 * ─── FALLBACK APPROACH ───────────────────────────────────────────────────────
 * We use the ABS 2021 Census General Community Profile (GCP) DataPack at
 * the Suburb and Locality (SAL) level. Table G02 "Selected Medians and
 * Averages" contains:
 *   • Median_mortgage_repay_monthly  — median monthly mortgage repayment
 *
 * We convert this to an ESTIMATED median house price using the standard
 * annuity formula, assuming:
 *   • Loan-to-value ratio: 80% (20% deposit)
 *   • Interest rate: 5.5% p.a. (approximate long-run average)
 *   • Loan term: 30 years
 *
 *   monthly_rate = 5.5% / 12 = 0.004583
 *   n_payments   = 360
 *   principal    = payment × ((1 − (1+r)^−n) / r)
 *   property_val = principal / 0.80
 *
 * ─── IMPORTANT CAVEATS ───────────────────────────────────────────────────────
 *   • Data is from the 2021 Census — not current-year transaction prices.
 *   • YoY growth, days on market, and sales count are NOT available and
 *     will be left NULL.
 *   • The mortgage-to-price conversion is approximate; actual rates and
 *     LVR vary by household.
 *   • statsSource is set to "sales-qld" so it can be overridden when
 *     real sales data becomes available.
 *   • Only suburbs with ≥5 mortgaged dwellings are included (small sample
 *     warning suppression).
 *
 * Source: https://www.abs.gov.au/census/find-census-data/datapacks
 * License: CC BY 4.0
 * Schedule: Annual (until QLD publishes real sales data)
 *
 * ─── TO UPGRADE WHEN QLD DATA BECOMES AVAILABLE ──────────────────────────────
 * If/when QLD Titles Registry or data.qld.gov.au publishes bulk CSV/ZIP of
 * property sale transactions (similar to NSW Valuer General PSI), replace the
 * FALLBACK_MODE block below with a real downloader and parser, following the
 * pattern in sales-nsw.ts.
 */
import "dotenv/config";
import AdmZip from "adm-zip";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "sales-qld";

const ABS_QLD_URL =
  "https://www.abs.gov.au/census/find-census-data/datapacks/download/2021_GCP_SAL_for_QLD_short-header.zip";

// Mortgage → price conversion parameters
const ANNUAL_RATE   = 0.055;         // 5.5% p.a. — approximate long-run average
const MONTHLY_RATE  = ANNUAL_RATE / 12;
const N_PAYMENTS    = 360;           // 30-year loan
const LVR           = 0.80;         // 80% loan-to-value ratio assumed
const MIN_DWELLINGS = 5;            // skip SALs with fewer mortgaged dwellings

/**
 * Convert monthly mortgage repayment → estimated median house price.
 * Uses the standard present value of annuity formula.
 *   P = payment × ((1 - (1 + r)^-n) / r)  [= loan principal]
 *   price = P / LVR
 */
function mortgageToPrice(monthlyRepayment: number): number {
  const pvFactor = (1 - Math.pow(1 + MONTHLY_RATE, -N_PAYMENTS)) / MONTHLY_RATE;
  const loanPrincipal = monthlyRepayment * pvFactor;
  return Math.round(loanPrincipal / LVR / 1000) * 1000; // round to nearest $1,000
}

function normName(s: string): string {
  return s.trim().replace(/\s*\([A-Z]{2,3}\)\s*$/, "").trim().toLowerCase();
}

function findCol(headers: string[], patterns: RegExp[]): string | null {
  for (const pat of patterns) {
    const found = headers.find((h) => pat.test(h));
    if (found) return found;
  }
  return null;
}

interface SuburbEstimate {
  estimatedMedianPrice: number;
}

async function downloadAndParse(): Promise<Map<string, SuburbEstimate>> {
  log(SOURCE_ID, `downloading ABS 2021 Census QLD SAL pack from ${ABS_QLD_URL}`);

  const res = await fetch(ABS_QLD_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; YourPropertyGuide/1.0)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ABS QLD census pack`);

  const zipBuf = Buffer.from(await res.arrayBuffer());
  const zip = new AdmZip(zipBuf);
  const entries = zip.getEntries();

  // ── SAL code → suburb name from metadata XLSX ───────────────────────────
  const metaEntry = entries.find(
    (e) => e.entryName.includes("geog_desc") && e.entryName.endsWith(".xlsx")
  );
  if (!metaEntry) throw new Error("No metadata XLSX found in QLD census pack");

  const metaBuf = zip.readFile(metaEntry);
  if (!metaBuf) throw new Error("Could not read metadata XLSX");

  const wb = XLSX.read(metaBuf, { type: "buffer" });
  const sheetName =
    wb.SheetNames.find((n) => n.includes("Non_ABS") || n.includes("SAL")) ??
    wb.SheetNames.find((n) => n.includes("2021")) ??
    wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const metaRows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: "" });

  const salToName = new Map<string, string>(); // SAL code → normalised suburb name
  for (const row of metaRows) {
    const code = String(row["Census_Code_2021"] ?? row["Census Code 2021"] ?? "").trim();
    const name = String(row["Census_Name_2021"] ?? row["Census Name 2021"] ?? "").trim();
    if (code.startsWith("SAL") && name) {
      salToName.set(code, normName(name));
    }
  }
  log(SOURCE_ID, `${salToName.size} SAL → name mappings loaded`);

  // ── G02: Selected Medians — median mortgage repayment ───────────────────
  const g02Entry = entries.find((e) => /G02_[A-Z]+_SAL\.csv$/i.test(e.entryName));
  if (!g02Entry) throw new Error("G02 SAL CSV not found in QLD census pack");

  const g02Buf = zip.readFile(g02Entry);
  if (!g02Buf) throw new Error("Could not read G02 CSV");

  const g02 = Papa.parse<Record<string, string>>(g02Buf.toString("utf8"), {
    header: true,
    skipEmptyLines: true,
  });

  const headers = Object.keys(g02.data[0] ?? {});
  const mortgageCol = findCol(headers, [
    /Median_mortgage_repay_monthly/i,
    /Med_mortg_repay/i,
    /Median_mtg/i,
  ]);
  const dwellingCountCol = findCol(headers, [
    /O_MTG_Total/i,
    /Owned.*mortg.*total/i,
    /Count_dwellings_with_mortg/i,
  ]);

  if (!mortgageCol) {
    throw new Error(
      `G02 mortgage column not found. Available columns: ${headers.slice(0, 20).join(", ")}`
    );
  }

  log(SOURCE_ID, `G02 mortgage column: "${mortgageCol}"`);

  const estimates = new Map<string, SuburbEstimate>();
  let skippedSmall = 0;

  for (const row of g02.data) {
    const salCode = String(row["SAL_CODE_2021"] ?? "").trim();
    if (!salCode) continue;

    const mortgageRaw = parseInt(String(row[mortgageCol] ?? "").replace(/,/g, "")) || 0;
    if (!mortgageRaw) continue;

    // Skip SALs with very few mortgaged dwellings (unreliable median)
    if (dwellingCountCol) {
      const count = parseInt(String(row[dwellingCountCol] ?? "0").replace(/,/g, "")) || 0;
      if (count < MIN_DWELLINGS) { skippedSmall++; continue; }
    }

    const suburbName = salToName.get(salCode);
    if (!suburbName) continue;

    estimates.set(suburbName, {
      estimatedMedianPrice: mortgageToPrice(mortgageRaw),
    });
  }

  log(SOURCE_ID, `parsed ${estimates.size} QLD suburb estimates (skipped ${skippedSmall} small SALs)`);
  return estimates;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    log(SOURCE_ID, "NOTE: QLD publishes no free bulk property sale price data.");
    log(SOURCE_ID, "Using ABS 2021 Census G02 Median_mortgage_repay_monthly as price proxy.");
    log(SOURCE_ID, "YoY growth, days on market, and sales count will NOT be populated.");

    const estimates = await downloadAndParse();

    // Load QLD suburbs from DB
    const suburbs = await prisma.suburb.findMany({
      where: { state: "QLD" },
      select: { id: true, name: true, postcode: true },
    });
    log(SOURCE_ID, `matching against ${suburbs.length} QLD DB suburbs`);

    interface UpdateRow {
      id:               string;
      medianHousePrice: number;
    }
    const updates: UpdateRow[] = [];

    for (const suburb of suburbs) {
      const key = normName(suburb.name);
      const est = estimates.get(key);
      if (!est) continue;

      updates.push({
        id:               suburb.id,
        medianHousePrice: est.estimatedMedianPrice,
      });
    }

    log(SOURCE_ID, `updating ${updates.length} QLD suburbs with census-derived price estimates`);

    if (updates.length > 0) {
      await prisma.$executeRaw`
        UPDATE "Suburb" AS s
        SET
          "medianHousePrice" = u.median_house,
          "statsSource"      = 'sales-qld',
          "statsUpdatedAt"   = NOW()
        FROM UNNEST(
          ${updates.map((u) => u.id)}::text[],
          ${updates.map((u) => u.medianHousePrice)}::int[]
        ) AS u(id, median_house)
        WHERE s.id = u.id
      `;
    }

    // Data is from 2021 Census
    const dataAsOf = new Date("2021-08-10"); // 2021 Census night
    await finishSync(SOURCE_ID, updates.length, dataAsOf);
    log(SOURCE_ID, `done — ${updates.length} QLD suburbs updated with census-derived mortgage-proxy prices`);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
