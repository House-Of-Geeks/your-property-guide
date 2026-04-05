/**
 * SA Property Sales Sync (SA Government / data.sa.gov.au)
 *
 * Downloads the Metro Adelaide median house sale price XLSX from the
 * SA Government open data portal via CKAN.
 *
 * XLSX layout (two periods side by side):
 *   Row 1:  Headers — "City", "Suburb",
 *             "Sales 4Q {prev_year}", "Median 4Q {prev_year}",
 *             "Sales 4Q {year}", "Median 4Q {year}",
 *             "Median Change"
 *   Row 2+: Data rows — suburb names in ALL CAPS
 *
 * We pick the LATEST median column (highest year in header name),
 * the sales count directly preceding it, and the "Median Change" decimal
 * (e.g. -0.042 = -4.2%) for YoY growth.
 *
 * This data covers Metro Adelaide only (not regional SA).
 *
 * Data source: https://data.sa.gov.au/data/dataset/0d447195-1158-4a3c-8cc7-0e333b87eb72
 * License: CC BY 4.0
 * Schedule: Quarterly
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "sales-sa";
const CKAN_BASE = "https://data.sa.gov.au/data";
const PACKAGE_ID = "0d447195-1158-4a3c-8cc7-0e333b87eb72";

async function getLatestResourceUrl(): Promise<{ url: string; periodDate: Date; period: string }> {
  const apiUrl = `${CKAN_BASE}/api/3/action/package_show?id=${PACKAGE_ID}`;
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`CKAN HTTP ${res.status}: ${apiUrl}`);
  const json = await res.json() as {
    success: boolean;
    result: { resources: Array<{ url: string; period_end?: string; metadata_modified?: string }> }
  };
  if (!json.success) throw new Error(`CKAN error for package ${PACKAGE_ID}`);

  const resources = [...json.result.resources];
  resources.sort((a, b) =>
    (b.period_end ?? b.metadata_modified ?? "").localeCompare(a.period_end ?? a.metadata_modified ?? "")
  );

  const latest = resources[0];
  if (!latest?.url) throw new Error(`No resource URL found for SA sales package`);

  const dateStr = latest.period_end ?? latest.metadata_modified ?? "";
  const periodDate = dateStr ? new Date(dateStr) : new Date();
  const year = periodDate.getFullYear();
  const month = periodDate.getMonth() + 1;
  const quarter = month <= 3 ? "Q1" : month <= 6 ? "Q2" : month <= 9 ? "Q3" : "Q4";
  const period = `${year}-${quarter}`;

  return { url: latest.url, periodDate, period };
}

interface SuburbSalesRow {
  median:    number;
  salesCount: number;
  yoyGrowth: number | null; // percentage e.g. -4.2
}

function parseXlsx(buffer: Buffer): Map<string, SuburbSalesRow> {
  const wb = XLSX.read(buffer, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1, defval: "" });

  if (raw.length < 2) throw new Error("SA sales XLSX has fewer than 2 rows");

  const headers = (raw[0] as (string | number)[]).map((h) => String(h ?? "").trim());

  const suburbCol = headers.findIndex((h) => /^suburb$/i.test(h));
  if (suburbCol < 0) throw new Error(`No Suburb column. Headers: ${headers.join(", ")}`);

  // Find the latest "Median {period} {year}" column — the one with the highest year.
  // Exclude "Median Change" which also starts with "Median".
  let latestMedianCol = -1;
  let latestYear = -1;
  headers.forEach((h, i) => {
    const m = h.match(/^Median\s+\S+\s+(\d{4})$/i);
    if (m) {
      const yr = parseInt(m[1]);
      if (yr > latestYear) { latestYear = yr; latestMedianCol = i; }
    }
  });
  if (latestMedianCol < 0) throw new Error(`No Median column found. Headers: ${headers.join(", ")}`);

  // Sales count is the column immediately before the median column
  const salesCol = latestMedianCol - 1;

  // YoY change column ("Median Change")
  const yoyCol = headers.findIndex((h) => /change/i.test(h));

  log(SOURCE_ID, `median column: "${headers[latestMedianCol]}", sales: "${headers[salesCol]}", yoy: "${yoyCol >= 0 ? headers[yoyCol] : "none"}"`);

  const result = new Map<string, SuburbSalesRow>();

  for (let i = 1; i < raw.length; i++) {
    const row = raw[i];
    const suburb = String(row[suburbCol] ?? "").trim();
    if (!suburb || suburb.startsWith("^") || suburb.startsWith("*") || suburb.startsWith("Source")) continue;

    const medianRaw = row[latestMedianCol];
    const median = typeof medianRaw === "number"
      ? Math.round(medianRaw)
      : parseInt(String(medianRaw).replace(/[,$]/g, "")) || 0;
    if (!median) continue;

    const salesRaw = row[salesCol];
    const salesCount = typeof salesRaw === "number"
      ? Math.round(salesRaw)
      : parseInt(String(salesRaw).replace(/,/g, "")) || 0;

    const yoyRaw = yoyCol >= 0 ? row[yoyCol] : null;
    const yoyDecimal = typeof yoyRaw === "number"
      ? yoyRaw
      : yoyRaw ? parseFloat(String(yoyRaw)) : null;
    const yoyGrowth = (yoyDecimal !== null && !isNaN(yoyDecimal))
      ? Math.round(yoyDecimal * 1000) / 10  // decimal → %, 1 d.p.
      : null;

    result.set(suburb.toLowerCase(), { median, salesCount, yoyGrowth });
  }

  return result;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    const { url, periodDate, period } = await getLatestResourceUrl();
    log(SOURCE_ID, `downloading from ${url}`);
    log(SOURCE_ID, `period: ${period}`);

    const buffer = await (await fetch(url)).arrayBuffer().then(Buffer.from);
    const salesData = parseXlsx(buffer);
    log(SOURCE_ID, `parsed ${salesData.size} suburb rows from XLSX`);

    const suburbs = await prisma.suburb.findMany({
      where: { state: "SA" },
      select: { id: true, name: true },
    });
    log(SOURCE_ID, `matching against ${suburbs.length} SA suburbs`);

    let count = 0;
    for (const suburb of suburbs) {
      const row = salesData.get(suburb.name.toLowerCase());
      if (!row) continue;

      await prisma.suburb.update({
        where: { id: suburb.id },
        data: {
          medianHousePrice:  row.median,
          salesCountHouse:   row.salesCount,
          ...(row.yoyGrowth !== null ? { annualGrowthHouse: row.yoyGrowth } : {}),
          statsSource:       SOURCE_ID,
          statsUpdatedAt:    new Date(),
        },
      });
      count++;
    }

    log(SOURCE_ID, `updated ${count} SA suburbs (median + sales count + YoY growth)`);
    await finishSync(SOURCE_ID, count, periodDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
