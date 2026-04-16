/**
 * ABS SA2-Level Property Sales Sync
 *
 * Pulls median house and unit transfer prices at SA2 (Statistical Area Level 2)
 * from the ABS Data API (no auth required).
 *
 * Dataset: ABS_REGIONAL_ASGS2021
 * Measures:
 *   HOUSES_3 — Median price of established house transfers ($)
 *   HOUSES_5 — Median price of attached dwelling transfers ($)
 * Geography: 2,301 SA2 areas (ASGS 2021 boundaries)
 * Frequency: Annual — ABS releases ~August/September for the prior calendar year
 *
 * SA2 state is encoded in the 9-digit SA2 code (first digit):
 *   1=NSW, 2=VIC, 3=QLD, 4=SA, 5=WA, 6=TAS, 7=NT, 8=ACT
 *
 * Only updates suburbs in states without a better free source:
 *   QLD, WA, NT, TAS, ACT
 *
 * SA2 names closely map to suburb names — resolved via resolveSlug().
 *
 * API: https://data.api.abs.gov.au/rest/data/ABS_REGIONAL_ASGS2021/
 * Schedule: Annual (run August–October each year for prior-year data)
 */
import "dotenv/config";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";

const SOURCE_ID = "sales-abs";

// States we update with ABS data (those without a dedicated free state source)
const TARGET_STATES = new Set(["QLD", "WA", "NT", "TAS", "ACT"]);

// SA2 code first digit → state abbreviation (ASGS 2021)
const SA2_STATE: Record<string, string> = {
  "1": "NSW", "2": "VIC", "3": "QLD", "4": "SA", "5": "WA",
  "6": "TAS", "7": "NT", "8": "ACT", "9": "OT",
};

interface AbsObservation {
  sa2Id:   string;
  sa2Name: string;
  state:   string;
  house:   number | null;  // HOUSES_3 — established house median
  unit:    number | null;  // HOUSES_5 — attached dwelling median
  year:    string;
}

async function fetchSa2Medians(year: string): Promise<AbsObservation[]> {
  const url = [
    "https://data.api.abs.gov.au/rest/data/ABS_REGIONAL_ASGS2021",
    "/HOUSES_3+HOUSES_5.SA2..A",
    `?startPeriod=${year}&endPeriod=${year}&dimensionAtObservation=AllDimensions`,
  ].join("");

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`ABS API HTTP ${res.status}: ${url}`);

  const json = await res.json() as {
    dataSets: Array<{ observations: Record<string, [number | null, ...unknown[]]> }>;
    structure: {
      dimensions: {
        observation: Array<{
          id: string;
          values: Array<{ id: string; name: string }>;
        }>;
      };
    };
  };

  const dims = json.structure.dimensions.observation;
  const measureDim = dims.find((d) => d.id === "MEASURE")!;
  const regionDim  = dims.find((d) => d.id === "ASGS_2021")!;

  // Build measure index map: dimension-index → measure id
  const measureById = new Map(measureDim.values.map((v, i) => [i, v.id]));

  // Collect all observations grouped by SA2
  const byRegion = new Map<number, { house: number | null; unit: number | null }>();

  for (const [key, val] of Object.entries(json.dataSets[0].observations)) {
    const parts = key.split(":").map(Number);
    const mIdx = parts[0];
    const rIdx = parts[2];
    const value = typeof val[0] === "number" ? val[0] : null;
    const measureId = measureById.get(mIdx);

    const existing = byRegion.get(rIdx) ?? { house: null, unit: null };
    if (measureId === "HOUSES_3") existing.house = value;
    if (measureId === "HOUSES_5") existing.unit  = value;
    byRegion.set(rIdx, existing);
  }

  const results: AbsObservation[] = [];
  for (const [rIdx, medians] of byRegion) {
    const region = regionDim.values[rIdx];
    if (!region) continue;
    const stateCode = region.id[0];
    const state = SA2_STATE[stateCode] ?? "OT";
    results.push({
      sa2Id:   region.id,
      sa2Name: region.name,
      state,
      house:   medians.house,
      unit:    medians.unit,
      year,
    });
  }
  return results;
}

/** Find the latest year the ABS has data for (tries current year back 3 years). */
async function findLatestYear(): Promise<string> {
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= currentYear - 3; y--) {
    const url = `https://data.api.abs.gov.au/rest/data/ABS_REGIONAL_ASGS2021/HOUSES_3.SA2..A?startPeriod=${y}&endPeriod=${y}&dimensionAtObservation=AllDimensions`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) continue;
    const json = await res.json() as { dataSets?: Array<{ observations?: Record<string, unknown> }> };
    const obsCount = Object.keys(json.dataSets?.[0]?.observations ?? {}).length;
    if (obsCount > 0) return String(y);
  }
  throw new Error("Could not find any ABS SA2 data for recent years");
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    const year = await findLatestYear();
    log(SOURCE_ID, `latest ABS SA2 data year: ${year}`);

    const observations = await fetchSa2Medians(year);
    log(SOURCE_ID, `fetched ${observations.length} SA2 observations`);

    // Filter to target states only
    const targeted = observations.filter((o) => TARGET_STATES.has(o.state));
    log(SOURCE_ID, `${targeted.length} SA2s in target states (${[...TARGET_STATES].join(", ")})`);

    const periodDate = new Date(`${year}-12-31`);
    let updated = 0;
    let skipped = 0;

    // Process with limited concurrency to avoid hammering slug-matcher cache
    const CONCURRENCY = 5;
    for (let i = 0; i < targeted.length; i += CONCURRENCY) {
      const chunk = targeted.slice(i, i + CONCURRENCY);
      await Promise.all(
        chunk.map(async (obs) => {
          if (!obs.house && !obs.unit) { skipped++; return; }

          const suburbSlug = await resolveSlug(obs.sa2Name, obs.state, "");
          if (!suburbSlug) { skipped++; return; }

          await prisma.suburb.updateMany({
            where: {
              slug:  suburbSlug,
              state: obs.state,
            },
            data: {
              ...(obs.house ? { medianHousePrice: obs.house } : {}),
              ...(obs.unit  ? { medianUnitPrice:  obs.unit  } : {}),
              statsSource:   SOURCE_ID,
              salesUpdatedAt: periodDate,
            },
          });
          updated++;
        }),
      );
    }

    log(SOURCE_ID, `updated ${updated} suburbs, skipped ${skipped} (no price or no slug match)`);
    await finishSync(SOURCE_ID, updated, periodDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
