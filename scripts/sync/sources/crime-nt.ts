/**
 * NT Crime Stats Sync (NT Police)
 *
 * Downloads region-level crime data from data.nt.gov.au (NTG Open Data Portal).
 * The portal is CKAN-based; we use the package_search API to find the latest
 * "current-nt-crime-statistics-{month}-{year}" dataset (updated monthly),
 * then fetch its CSV resource.
 *
 * NT publishes at Reporting Region level (Darwin, Palmerston, Alice Springs,
 * Katherine, Tennant Creek, Nhulunbuy, NT Balance) plus partial SA2 breakdown.
 * We aggregate by Reporting Region and store with suburbSlug=null + lga=region,
 * mirroring the crime-qld pattern.
 *
 * Data source: https://data.nt.gov.au/dataset?tags=Crime
 * Schedule: Monthly (data refreshed monthly)
 */
import "dotenv/config";
import Papa from "papaparse";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { batchUpsertCrime, type CrimeRecord } from "../crime-batch";

const SOURCE_ID = "crime-nt";
const CKAN_SEARCH_URL =
  "https://data.nt.gov.au/api/3/action/package_search?q=current-nt-crime-statistics&sort=metadata_modified+desc&rows=1";

interface CkanResource {
  id: string;
  name: string;
  format: string;
  url: string;
}
interface CkanPackage {
  id: string;
  name: string;
  title: string;
  resources: CkanResource[];
}

async function findLatestCsvUrl(): Promise<string> {
  const res = await fetch(CKAN_SEARCH_URL);
  if (!res.ok) throw new Error(`CKAN API HTTP ${res.status}`);
  const json = (await res.json()) as { result: { results: CkanPackage[] } };
  const pkg = json.result.results[0];
  if (!pkg) throw new Error("No NT crime dataset found in CKAN response");
  const csv = pkg.resources.find((r) => r.format.toUpperCase() === "CSV");
  if (!csv) throw new Error(`No CSV resource on ${pkg.title}`);
  log(SOURCE_ID, `latest dataset: ${pkg.title}`);
  return csv.url;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    const csvUrl = await findLatestCsvUrl();
    log(SOURCE_ID, `downloading from ${csvUrl}`);
    const csvRes = await fetch(csvUrl);
    if (!csvRes.ok) throw new Error(`HTTP ${csvRes.status} downloading NT crime CSV`);
    const text = await csvRes.text();
    const { data, meta } = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
    });
    log(SOURCE_ID, `parsed ${data.length} rows, columns: ${meta.fields?.join(", ")}`);

    // Group by Reporting Region + Year, sum offences, breakdown by Offence category.
    const grouped = new Map<string, { total: number; breakdown: Record<string, number> }>();

    for (const row of data) {
      const region = String(row["Reporting Region"] ?? "").trim();
      const year = String(row["Year"] ?? "").trim();
      const category = String(row["Offence category"] ?? "").trim();
      const count = parseInt(String(row["Number of offences"] ?? "0"), 10) || 0;

      // Skip rows where region is missing, "Unknown", or "-" (sentinel for filler/total rows)
      if (!region || region === "-" || region === "Unknown") continue;
      if (!year || !category || count <= 0) continue;

      const key = `${region}|${year}`;
      const existing = grouped.get(key) ?? { total: 0, breakdown: {} };
      existing.total += count;
      // Strip leading "01 ", "02 " numeric prefix from category for cleaner display
      const catKey = category.replace(/^\d{2}\s+/, "");
      existing.breakdown[catKey] = (existing.breakdown[catKey] ?? 0) + count;
      grouped.set(key, existing);
    }

    // Process the most recent year only.
    const allYears = [...new Set([...grouped.keys()].map((k) => k.split("|")[1]))].sort();
    const latestYear = allYears[allYears.length - 1];
    if (!latestYear) throw new Error("No year data found in NT crime CSV");
    log(SOURCE_ID, `processing year ${latestYear} (${allYears.length} years in dataset)`);

    const periodDate = new Date(`${latestYear}-12-01`);
    const records: CrimeRecord[] = [];

    for (const [key, agg] of grouped) {
      const [region, year] = key.split("|");
      if (year !== latestYear) continue;
      records.push({
        suburbSlug: null,
        suburbName: region,
        lga: region,
        state: "NT",
        period: latestYear,
        periodDate,
        totalOffences: agg.total,
        offenceBreakdown: agg.breakdown,
        source: SOURCE_ID,
      });
    }

    const count = await batchUpsertCrime(records);

    // Mark all NT suburbs as "crime data attempted" so the rendering layer knows
    // to look up region-level data via the lga field.
    await prisma.suburb.updateMany({
      where: { state: "NT" },
      data: { statsUpdatedAt: new Date(), crimeUpdatedAt: new Date() },
    });

    await finishSync(SOURCE_ID, count, periodDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
