/**
 * SA Property Sales Sync (SA Government / data.sa.gov.au)
 *
 * Downloads the Metro Adelaide median house sale price XLSX from the
 * SA Government open data portal via CKAN.
 *
 * XLSX layout:
 *   Row 1:  Header row — includes "Suburb", "Median 4Q {year}", "YoY % Change"
 *   Row 2+: Data — Col B: Suburb name, Col F: current median price,
 *             Col G: YoY change (decimal, e.g. -0.042 = -4.2%)
 *
 * Period is encoded in the column header name (e.g. "Median 4Q 2025").
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
    result: { resources: Array<{ url: string; period_end?: string; metadata_modified?: string; name?: string }> }
  };
  if (!json.success) throw new Error(`CKAN error for package ${PACKAGE_ID}`);

  const resources = [...json.result.resources];
  // Sort by period_end desc (most recent first)
  resources.sort((a, b) =>
    (b.period_end ?? b.metadata_modified ?? "").localeCompare(a.period_end ?? a.metadata_modified ?? "")
  );

  const latest = resources[0];
  if (!latest?.url) throw new Error(`No resource URL found for SA sales package`);

  // Parse period from period_end or metadata_modified
  const dateStr = latest.period_end ?? latest.metadata_modified ?? "";
  const periodDate = dateStr ? new Date(dateStr) : new Date();
  const year = periodDate.getFullYear();
  const month = periodDate.getMonth() + 1;
  const quarter = month <= 3 ? "Q1" : month <= 6 ? "Q2" : month <= 9 ? "Q3" : "Q4";
  const period = `${year}-${quarter}`;

  return { url: latest.url, periodDate, period };
}

async function downloadXlsx(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading SA sales XLSX`);
  return Buffer.from(await res.arrayBuffer());
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    const { url, periodDate, period } = await getLatestResourceUrl();
    log(SOURCE_ID, `downloading from ${url}`);
    log(SOURCE_ID, `period: ${period}`);

    const buffer = await downloadXlsx(url);
    const wb = XLSX.read(buffer, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1, defval: "" });

    if (raw.length < 2) throw new Error("SA sales XLSX has fewer than 2 rows");

    // Row 0 is the header — find column indices
    const headers = (raw[0] as (string | number)[]).map((h) => String(h ?? "").trim());

    // Suburb column (Col B = index 1)
    const suburbCol = headers.findIndex((h) => /suburb/i.test(h));
    if (suburbCol < 0) throw new Error(`Could not find Suburb column in SA sales XLSX. Headers: ${headers.join(", ")}`);

    // Median column — "Median 4Q {year}" or similar
    const medianCol = headers.findIndex((h) => /median/i.test(h));
    if (medianCol < 0) throw new Error(`Could not find Median column in SA sales XLSX. Headers: ${headers.join(", ")}`);

    // Try to extract period from column header name
    const medianHeader = headers[medianCol];
    const periodFromHeader = medianHeader.match(/(\d{4})/);
    if (periodFromHeader) {
      log(SOURCE_ID, `median column: "${medianHeader}"`);
    }

    const medians = new Map<string, number>(); // lowercase suburb name → median price

    // Data rows start at index 1
    for (let i = 1; i < raw.length; i++) {
      const row = raw[i];
      const suburb = String(row[suburbCol] ?? "").trim();
      if (!suburb || suburb.startsWith("^") || suburb.startsWith("*") || suburb.startsWith("Source")) continue;

      const medianRaw = row[medianCol];
      const median = typeof medianRaw === "number"
        ? Math.round(medianRaw)
        : parseInt(String(medianRaw).replace(/[,$]/g, "")) || 0;

      if (!median) continue;
      medians.set(suburb.toLowerCase(), median);
    }

    log(SOURCE_ID, `parsed ${medians.size} suburb medians from XLSX`);

    // Load SA suburbs from DB
    const suburbs = await prisma.suburb.findMany({
      where: { state: "SA" },
      select: { id: true, name: true },
    });
    log(SOURCE_ID, `matching against ${suburbs.length} SA suburbs`);

    let count = 0;
    for (const suburb of suburbs) {
      const key = suburb.name.toLowerCase();
      const medianHouse = medians.get(key) ?? null;
      if (!medianHouse) continue;

      await prisma.suburb.update({
        where: { id: suburb.id },
        data: {
          medianHousePrice: medianHouse,
          statsSource:      SOURCE_ID,
          statsUpdatedAt:   new Date(),
        },
      });
      count++;
    }

    log(SOURCE_ID, `updated ${count} SA suburbs with median house price`);
    await finishSync(SOURCE_ID, count, periodDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
