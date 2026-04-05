/**
 * National Suburb Import
 *
 * Downloads the community Australian postcodes CSV (community-maintained,
 * sourced from ABS/Australia Post) and creates stub Suburb records for every
 * "Delivery Area" locality not already in the database.
 *
 * Source: https://github.com/matthewproctor/australianpostcodes
 * ~18,000 localities across all states and territories.
 * Schedule: Run once (or annually when the dataset updates).
 */
import "dotenv/config";
import Papa from "papaparse";
import { randomUUID } from "crypto";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID   = "import-suburbs-all";
const CSV_URL     = "https://raw.githubusercontent.com/matthewproctor/australianpostcodes/master/australian_postcodes.csv";
const CHUNK       = 500;

interface PostcodeRow {
  postcode:  string;
  locality:  string;
  state:     string;
  type:      string;
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/(?:^|\s|-|')\S/g, (c) => c.toUpperCase());
}

function makeSlug(name: string, state: string, postcode: string): string {
  const namePart = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${namePart}-${state.toLowerCase()}-${postcode}`;
}

const REGION_MAP: Record<string, string> = {
  SA:  "South Australia",
  VIC: "Victoria",
  NSW: "New South Wales",
  QLD: "Queensland",
  WA:  "Western Australia",
  TAS: "Tasmania",
  NT:  "Northern Territory",
  ACT: "Australian Capital Territory",
};

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    log(SOURCE_ID, `downloading postcodes CSV from GitHub`);
    const res = await fetch(CSV_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching postcodes CSV`);
    const csv = await res.text();

    const parsed = Papa.parse<PostcodeRow>(csv, { header: true, skipEmptyLines: true });
    log(SOURCE_ID, `parsed ${parsed.data.length} rows`);

    // Deduplicate by slug (locality+state+postcode) and only keep delivery areas
    const toCreate = new Map<string, { name: string; state: string; postcode: string }>();
    for (const row of parsed.data) {
      if (row.type !== "Delivery Area") continue;
      const name     = titleCase(row.locality.trim());
      const state    = row.state.trim().toUpperCase();
      const postcode = row.postcode.trim();
      if (!name || !state || !postcode) continue;
      const slug = makeSlug(name, state, postcode);
      if (!toCreate.has(slug)) toCreate.set(slug, { name, state, postcode });
    }
    log(SOURCE_ID, `${toCreate.size} unique delivery area localities`);

    // Load existing slugs so we don't overwrite real content
    const existingSlugs = new Set(
      (await prisma.suburb.findMany({ select: { slug: true } })).map((r) => r.slug)
    );
    log(SOURCE_ID, `${existingSlugs.size} suburbs already in DB`);

    const newSuburbs = [...toCreate.entries()]
      .filter(([slug]) => !existingSlugs.has(slug))
      .map(([slug, { name, state, postcode }]) => ({
        id:                   randomUUID(),
        slug,
        name,
        postcode,
        state,
        region:               REGION_MAP[state] ?? state,
        description:          `${name} is a suburb in ${REGION_MAP[state] ?? state}.`,
        heroImage:            "/images/suburbs/default.jpg",
        medianHousePrice:     0,
        medianUnitPrice:      0,
        medianRentHouse:      0,
        medianRentUnit:       0,
        annualGrowthHouse:    0,
        annualGrowthUnit:     0,
        daysOnMarket:         0,
        salesCountHouse:      0,
        population:           0,
        medianAge:            0,
        ownerOccupied:        0,
        renterOccupied:       0,
        householdsFamily:     0,
        householdsLonePerson: 0,
        amenities:            [] as string[],
        transportLinks:       [] as string[],
        nearbySuburbs:        [] as string[],
        statsSource:          "import-suburbs-all",
      }));

    log(SOURCE_ID, `creating ${newSuburbs.length} new suburb stubs`);

    let created = 0;
    for (let i = 0; i < newSuburbs.length; i += CHUNK) {
      const chunk = newSuburbs.slice(i, i + CHUNK);
      await prisma.suburb.createMany({ data: chunk, skipDuplicates: true });
      created += chunk.length;
      if (created % 2000 === 0) log(SOURCE_ID, `  ${created}/${newSuburbs.length} inserted`);
    }

    log(SOURCE_ID, `done — ${created} new suburbs created`);
    await finishSync(SOURCE_ID, created);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
