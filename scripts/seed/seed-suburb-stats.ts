/**
 * Seeds median house price, growth, days on market and rent stats
 * for the suburbs that have active property listings.
 *
 * Data: manually researched from PropTrack / REA market data, April 2026.
 * Update each quarter by rerunning with fresh figures.
 *
 * Run: npx tsx scripts/seed/seed-suburb-stats.ts
 */
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

// ─── Suburb stats (April 2026) ────────────────────────────────────────────────
// Sources: PropTrack / REA market data, CoreLogic suburb summaries
const STATS: Record<string, {
  medianHousePrice:  number;
  medianUnitPrice:   number;
  annualGrowthHouse: number;
  annualGrowthUnit:  number;
  daysOnMarket:      number;
  medianRentHouse:   number;
  medianRentUnit:    number;
  population?:       number;
  medianAge?:        number;
}> = {
  "redcliffe-qld-4020": {
    medianHousePrice:  850_000,
    medianUnitPrice:   520_000,
    annualGrowthHouse: 8.2,
    annualGrowthUnit:  6.5,
    daysOnMarket:      28,
    medianRentHouse:   580,
    medianRentUnit:    430,
    population:        12_800,
    medianAge:         42,
  },
  "newport-qld-4020": {
    medianHousePrice:  1_150_000,
    medianUnitPrice:   680_000,
    annualGrowthHouse: 9.5,
    annualGrowthUnit:  7.8,
    daysOnMarket:      35,
    medianRentHouse:   720,
    medianRentUnit:    520,
    population:        6_500,
    medianAge:         40,
  },
  "margate-qld-4019": {
    medianHousePrice:  780_000,
    medianUnitPrice:   480_000,
    annualGrowthHouse: 7.5,
    annualGrowthUnit:  6.2,
    daysOnMarket:      26,
    medianRentHouse:   550,
    medianRentUnit:    420,
    population:        9_200,
    medianAge:         41,
  },
  "north-lakes-qld-4509": {
    medianHousePrice:  740_000,
    medianUnitPrice:   520_000,
    annualGrowthHouse: 7.2,
    annualGrowthUnit:  6.0,
    daysOnMarket:      24,
    medianRentHouse:   550,
    medianRentUnit:    450,
    population:        24_000,
    medianAge:         34,
  },
  "griffin-qld-4503": {
    medianHousePrice:  720_000,
    medianUnitPrice:   490_000,
    annualGrowthHouse: 7.8,
    annualGrowthUnit:  6.3,
    daysOnMarket:      25,
    medianRentHouse:   530,
    medianRentUnit:    420,
    population:        11_000,
    medianAge:         33,
  },
  "dakabin-qld-4503": {
    medianHousePrice:  690_000,
    medianUnitPrice:   460_000,
    annualGrowthHouse: 7.0,
    annualGrowthUnit:  5.8,
    daysOnMarket:      28,
    medianRentHouse:   510,
    medianRentUnit:    400,
    population:        4_200,
    medianAge:         35,
  },
  "burpengary-east-qld-4505": {
    medianHousePrice:  710_000,
    medianUnitPrice:   470_000,
    annualGrowthHouse: 7.5,
    annualGrowthUnit:  6.0,
    daysOnMarket:      26,
    medianRentHouse:   520,
    medianRentUnit:    410,
    population:        7_800,
    medianAge:         35,
  },
  "burpengary-qld-4505": {
    medianHousePrice:  680_000,
    medianUnitPrice:   450_000,
    annualGrowthHouse: 6.8,
    annualGrowthUnit:  5.5,
    daysOnMarket:      29,
    medianRentHouse:   500,
    medianRentUnit:    395,
    population:        13_500,
    medianAge:         36,
  },
  "banya-qld-4551": {
    medianHousePrice:  820_000,
    medianUnitPrice:   540_000,
    annualGrowthHouse: 6.2,
    annualGrowthUnit:  5.0,
    daysOnMarket:      42,
    medianRentHouse:   580,
    medianRentUnit:    440,
    population:        3_100,
    medianAge:         38,
  },
  "palmview-qld-4553": {
    medianHousePrice:  880_000,
    medianUnitPrice:   580_000,
    annualGrowthHouse: 7.0,
    annualGrowthUnit:  5.8,
    daysOnMarket:      36,
    medianRentHouse:   610,
    medianRentUnit:    460,
    population:        8_500,
    medianAge:         35,
  },
  "bridgeman-downs-qld-4035": {
    medianHousePrice:  1_050_000,
    medianUnitPrice:   620_000,
    annualGrowthHouse: 8.8,
    annualGrowthUnit:  7.0,
    daysOnMarket:      22,
    medianRentHouse:   730,
    medianRentUnit:    530,
    population:        10_200,
    medianAge:         39,
  },
  "caboolture-qld-4510": {
    medianHousePrice:  610_000,
    medianUnitPrice:   390_000,
    annualGrowthHouse: 5.8,
    annualGrowthUnit:  5.0,
    daysOnMarket:      32,
    medianRentHouse:   465,
    medianRentUnit:    370,
    population:        22_000,
    medianAge:         36,
  },
  "morayfield-qld-4506": {
    medianHousePrice:  640_000,
    medianUnitPrice:   420_000,
    annualGrowthHouse: 6.0,
    annualGrowthUnit:  5.2,
    daysOnMarket:      30,
    medianRentHouse:   475,
    medianRentUnit:    380,
    population:        16_000,
    medianAge:         35,
  },
};

async function main() {
  const now = new Date();
  let updated = 0;
  let notFound = 0;

  for (const [slug, stats] of Object.entries(STATS)) {
    const existing = await db.suburb.findUnique({ where: { slug } });
    if (!existing) {
      console.warn(`  ⚠  Not found in DB: ${slug}`);
      notFound++;
      continue;
    }

    await db.suburb.update({
      where: { slug },
      data: {
        medianHousePrice:  stats.medianHousePrice,
        medianUnitPrice:   stats.medianUnitPrice,
        annualGrowthHouse: stats.annualGrowthHouse,
        annualGrowthUnit:  stats.annualGrowthUnit,
        daysOnMarket:      stats.daysOnMarket,
        medianRentHouse:   stats.medianRentHouse,
        medianRentUnit:    stats.medianRentUnit,
        ...(stats.population  != null ? { population:  stats.population  } : {}),
        ...(stats.medianAge   != null ? { medianAge:   stats.medianAge   } : {}),
        statsSource:    "seed-apr-2026",
        statsUpdatedAt: now,
        salesUpdatedAt: now,
        rentalUpdatedAt: now,
      },
    });

    console.log(`  ✅ ${existing.name} (${existing.postcode}) — $${stats.medianHousePrice.toLocaleString()} | +${stats.annualGrowthHouse}% | ${stats.daysOnMarket}d | $${stats.medianRentHouse}/wk`);
    updated++;
  }

  console.log(`\nDone. Updated: ${updated}, Not found: ${notFound}`);
  await db.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
