/**
 * SA Rental Data Sync
 *
 * Downloads median rental data from SA Housing Authority via data.sa.gov.au.
 * The CKAN package provides direct XLSX download links for each quarter.
 *
 * Data source: https://data.sa.gov.au/data/dataset/private-rent-report
 * Schedule: Quarterly
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";
import { getCkanDownloadUrl } from "../ckan";

const SOURCE_ID = "rental-sa";
const CKAN_BASE = "https://data.sa.gov.au/data";
const PACKAGE_ID = "private-rent-report";

// Normalize XLSX header keys to lowercase_underscore
function norm(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function parsePeriod(q: string): { period: string; periodDate: Date } {
  // SA format is typically "YYYY-MM" (from filename) or "Quarter N YYYY" in headers
  const isoMatch = q.match(/^(\d{4})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month] = isoMatch;
    const m = parseInt(month);
    const quarter = m <= 3 ? "Q1" : m <= 6 ? "Q2" : m <= 9 ? "Q3" : "Q4";
    return { period: `${year}-${quarter}`, periodDate: new Date(`${year}-${month}-01`) };
  }
  if (/^\d{4}-Q\d$/.test(q)) {
    const [year, quarter] = q.split("-");
    const monthMap: Record<string, number> = { Q1: 3, Q2: 6, Q3: 9, Q4: 12 };
    return {
      period: q,
      periodDate: new Date(`${year}-${String(monthMap[quarter] ?? 12).padStart(2, "0")}-01`),
    };
  }
  return { period: q, periodDate: new Date() };
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    // Get direct XLSX download URL (SA CKAN package has direct file URLs)
    const xlsxUrl = await getCkanDownloadUrl(PACKAGE_ID, CKAN_BASE, "XLSX");
    log(SOURCE_ID, `downloading from ${xlsxUrl}`);

    const res = await fetch(xlsxUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} downloading SA rental XLSX`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const wb = XLSX.read(buffer, { type: "buffer" });

    // Find the suburb/postcode level sheet
    const sheetName =
      wb.SheetNames.find((n) => n.toLowerCase().includes("suburb")) ??
      wb.SheetNames.find((n) => n.toLowerCase().includes("postcode")) ??
      wb.SheetNames[0];
    log(SOURCE_ID, `using sheet: ${sheetName}`);

    const ws = wb.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: "" });
    log(SOURCE_ID, `parsed ${rawRows.length} rows`);

    const rows = rawRows.map((r) =>
      Object.fromEntries(Object.entries(r).map(([k, v]) => [norm(k), String(v)]))
    );

    // Infer period from URL filename (e.g. private-rental-report-2025-12.xlsx → 2025-12)
    const urlPeriodMatch = xlsxUrl.match(/(\d{4}-\d{2})\.xlsx/i);
    const urlPeriod = urlPeriodMatch?.[1] ?? "";

    const grouped = new Map<string, { house?: number; unit?: number; bonds: number; periodDate: Date; period: string }>();

    for (const row of rows) {
      const suburb   = row["suburb"] ?? row["suburb_name"] ?? row["location"] ?? "";
      const postcode = row["postcode"] ?? row["post_code"] ?? "";
      // Period from row, or fall back to URL-inferred period
      const rawPeriod = row["quarter"] ?? row["period"] ?? row["financial_year"] ?? urlPeriod;
      if (!suburb || !postcode || !rawPeriod) continue;

      const { period, periodDate } = parsePeriod(rawPeriod);
      const key = `${suburb}|${postcode}|${period}`;
      const existing = grouped.get(key) ?? { bonds: 0, periodDate, period };

      const rent = parseInt(row["median_weekly_rent"] ?? row["median_rent"] ?? row["weekly_rent"] ?? "") || undefined;
      const bonds = parseInt(row["number_of_bonds"] ?? row["bond_count"] ?? row["count"] ?? "") || 0;
      const type = (row["dwelling_type"] ?? row["type"] ?? "").toLowerCase();

      if (type.includes("house")) {
        existing.house = rent;
      } else if (type.includes("unit") || type.includes("flat") || type.includes("apartment")) {
        existing.unit = rent;
      } else if (!existing.house) {
        // No type info — store as house median
        existing.house = rent;
      }
      existing.bonds += bonds;
      grouped.set(key, existing);
    }

    let count = 0;
    let latestDate: Date | undefined;

    for (const [key, data] of grouped) {
      const [suburbName, postcode, period] = key.split("|");
      const suburbSlug = await resolveSlug(suburbName, "SA", postcode);
      if (!latestDate || data.periodDate > latestDate) latestDate = data.periodDate;

      await prisma.suburbRentalStat.upsert({
        where: { suburbName_postcode_state_period: { suburbName, postcode, state: "SA", period } },
        create: {
          suburbSlug,
          suburbName,
          postcode,
          state: "SA",
          period,
          periodDate: data.periodDate,
          medianRentHouse: data.house ?? null,
          medianRentUnit:  data.unit ?? null,
          bondLodgements:  data.bonds,
          source: SOURCE_ID,
        },
        update: {
          suburbSlug,
          medianRentHouse: data.house ?? null,
          medianRentUnit:  data.unit ?? null,
          bondLodgements:  data.bonds,
        },
      });
      count++;
    }

    await prisma.suburb.updateMany({
      where: { state: "SA" },
      data: { statsUpdatedAt: new Date(), statsSource: SOURCE_ID },
    });

    await finishSync(SOURCE_ID, count, latestDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
