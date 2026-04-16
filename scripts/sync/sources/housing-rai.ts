/**
 * Rental Affordability Index Sync (SGS Economics via housingdata.gov.au)
 *
 * Downloads the postcode-level Rental Affordability Index (RAI) from the
 * Tableau CSV export on AIHW's Housing Data Dashboard. No auth required.
 *
 * RAI scoring:
 *   ≥ 100   Affordable
 *   80–99   Moderately unaffordable
 *   60–79   Unaffordable
 *   < 60    Severely / Extremely unaffordable
 *
 * CSV columns: Bedrooms, Postcode, STE, Year, Avg. RAI, Income, RAI
 * Multiple rows per postcode (one per bedroom count × income level).
 * We average `Avg. RAI` across all bedroom entries per postcode to produce
 * a single overall RAI score, stored on Suburb.rentalAffordabilityIndex.
 *
 * Coverage: NSW, VIC, QLD, WA, SA, ACT, TAS (not NT)
 * Update frequency: Annual — SGS Economics publishes ~November each year
 *
 * Source: https://www.housingdata.gov.au/ (RAI_2 Tableau view)
 * Endpoint: https://viz.aihw.gov.au/t/HDD/views/RentalAffordabilityIndex/RAI_2.csv
 * Schedule: Annual
 */
import "dotenv/config";
import Papa from "papaparse";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "housing-rai";
const CSV_URL = "https://viz.aihw.gov.au/t/HDD/views/RentalAffordabilityIndex/RAI_2.csv";

interface RaiRow {
  Bedrooms:      string;
  Postcode:      string;
  STE:           string;
  Year:          string;
  "Avg. RAI":    string;
  Income:        string;
  RAI:           string;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    log(SOURCE_ID, `downloading from ${CSV_URL}`);
    const res = await fetch(CSV_URL, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} downloading RAI CSV`);

    const text = await res.text();
    const { data } = Papa.parse<RaiRow>(text, { header: true, skipEmptyLines: true });
    log(SOURCE_ID, `parsed ${data.length} rows`);

    // Find the period in the data (e.g. "2025 Q2")
    const periodLabel = data[0]?.Year ?? "unknown";
    log(SOURCE_ID, `period: ${periodLabel}`);

    // Average Avg. RAI per (postcode, state)
    const grouped = new Map<string, { sum: number; count: number; state: string }>();

    for (const row of data) {
      const postcode = String(row.Postcode ?? "").trim().padStart(4, "0");
      const state    = String(row.STE ?? "").trim();
      const avgRai   = parseFloat(String(row["Avg. RAI"] ?? "0")) || 0;
      if (!postcode || !state || avgRai === 0) continue;

      const key = `${postcode}|${state}`;
      const existing = grouped.get(key) ?? { sum: 0, count: 0, state };
      existing.sum   += avgRai;
      existing.count += 1;
      grouped.set(key, existing);
    }

    log(SOURCE_ID, `grouped ${grouped.size} postcode/state combinations`);

    // Parse period into a Date — "2025 Q2" → 2025-06-30
    const periodDate = (() => {
      const m = periodLabel.match(/^(\d{4})\s+Q(\d)/);
      if (m) {
        const year = parseInt(m[1]);
        const qEnd = [3, 6, 9, 12][parseInt(m[2]) - 1] ?? 12;
        return new Date(`${year}-${String(qEnd).padStart(2, "0")}-30`);
      }
      return new Date();
    })();

    // Bulk update suburbs matched by postcode + state
    const updates: Array<{ postcode: string; state: string; rai: number }> = [];
    for (const [key, data] of grouped) {
      const [postcode, state] = key.split("|");
      const rai = Math.round(data.sum / data.count);
      updates.push({ postcode, state, rai });
    }

    // Apply with concurrency
    const CONCURRENCY = 20;
    let updated = 0;
    for (let i = 0; i < updates.length; i += CONCURRENCY) {
      const chunk = updates.slice(i, i + CONCURRENCY);
      await Promise.all(
        chunk.map(async ({ postcode, state, rai }) => {
          const result = await prisma.suburb.updateMany({
            where:  { postcode, state },
            data:   { rentalAffordabilityIndex: rai, raiUpdatedAt: new Date() },
          });
          updated += result.count;
        }),
      );
    }

    log(SOURCE_ID, `updated rentalAffordabilityIndex on ${updated} suburb rows`);
    await finishSync(SOURCE_ID, grouped.size, periodDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
