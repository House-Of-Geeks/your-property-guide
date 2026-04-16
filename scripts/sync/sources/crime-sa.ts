/**
 * SA Crime Stats Sync (SA Police)
 *
 * Downloads suburb-level crime data via the data.sa.gov.au CKAN API.
 * CSV columns: "Reported Date", "Suburb - Incident", "Postcode - Incident",
 * "Offence Level 1 Description", "Offence Level 2 Description",
 * "Offence Level 3 Description", "Offence count"
 *
 * Data source: https://data.sa.gov.au/data/dataset/860126f7-eeb5-4fbc-be44-069aa0467d11
 * Schedule: Quarterly
 */
import "dotenv/config";
import Papa from "papaparse";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";
import { getCkanDownloadUrl } from "../ckan";
import { batchUpsertCrime, type CrimeRecord } from "../crime-batch";

const SOURCE_ID = "crime-sa";
const CKAN_BASE = "https://data.sa.gov.au/data";
const PACKAGE_ID = "860126f7-eeb5-4fbc-be44-069aa0467d11";

interface SaCrimeRow {
  "Reported Date":               string;
  "Suburb - Incident":           string;
  "Postcode - Incident":         string;
  "Offence Level 1 Description": string;
  "Offence Level 2 Description": string;
  "Offence Level 3 Description": string;
  "Offence count":               string;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    // Filter for "Crime Statistics" resources — package also contains FDV (Family/DV) data
    const csvUrl = await getCkanDownloadUrl(PACKAGE_ID, CKAN_BASE, "CSV", "Crime Statistics");
    log(SOURCE_ID, `downloading from ${csvUrl}`);

    const res = await fetch(csvUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} downloading SA crime CSV`);
    const text = await res.text();
    const { data } = Papa.parse<SaCrimeRow>(text, { header: true, skipEmptyLines: true });
    log(SOURCE_ID, `parsed ${data.length} rows`);

    // Group by suburb + financial year
    const grouped = new Map<string, {
      total:    number;
      breakdown: Record<string, number>;
      postcode: string;
      period:   string;
      date:     Date;
    }>();

    for (const row of data) {
      const suburb   = String(row["Suburb - Incident"]   ?? "").trim();
      const postcode = String(row["Postcode - Incident"] ?? "").trim();
      const dateStr  = String(row["Reported Date"]       ?? "").trim();
      if (!suburb || !dateStr) continue;

      // "Reported Date" format: "DD/MM/YYYY" — extract financial year
      // SA financial year: Jul–Jun (so Jul 2025–Jun 2026 = FY2025-26)
      const dateParts = dateStr.split("/");
      const d = dateParts.length === 3
        ? new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`)
        : new Date(dateStr);
      if (isNaN(d.getTime())) continue;

      const calYear = d.getFullYear();
      const month   = d.getMonth() + 1; // 1-12
      // Financial year starts July: if month >= 7, FY = calYear/calYear+1, else calYear-1/calYear
      const fyStart = month >= 7 ? calYear : calYear - 1;
      const period  = `${fyStart}-${String(fyStart + 1).slice(-2)}`;
      const fyDate  = new Date(`${fyStart + 1}-06-30`); // End of FY

      const offence = String(row["Offence Level 1 Description"] ?? "Other").trim();
      const count   = parseInt(row["Offence count"] ?? "0") || 0;

      const key = `${suburb}|${postcode}|${period}`;
      const existing = grouped.get(key) ?? { total: 0, breakdown: {}, postcode, period, date: fyDate };
      existing.total += count;
      if (offence) existing.breakdown[offence] = (existing.breakdown[offence] ?? 0) + count;
      grouped.set(key, existing);
    }

    // Process only the most recent financial year
    const allPeriods = [...new Set([...grouped.values()].map((v) => v.period))].sort();
    const latestPeriod = allPeriods[allPeriods.length - 1];
    if (!latestPeriod) throw new Error("No period data found in SA crime CSV");
    log(SOURCE_ID, `processing FY ${latestPeriod}`);

    let latestDate: Date | undefined;
    const records: CrimeRecord[] = [];

    for (const [key, data] of grouped) {
      if (data.period !== latestPeriod) continue;
      const [suburbName, postcode] = key.split("|");
      const suburbSlug = await resolveSlug(suburbName, "SA", postcode);
      if (!latestDate || data.date > latestDate) latestDate = data.date;

      records.push({
        suburbSlug,
        suburbName,
        postcode:         postcode || null,
        state:            "SA",
        period:           data.period,
        periodDate:       data.date,
        totalOffences:    data.total,
        offenceBreakdown: data.breakdown,
        source:           SOURCE_ID,
      });
    }

    const count = await batchUpsertCrime(records);

    await prisma.suburb.updateMany({
      where: { state: "SA" },
      data: { crimeUpdatedAt: new Date() },
    });

    await finishSync(SOURCE_ID, count, latestDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
