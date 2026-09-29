import { db } from "@/lib/db";
import { LOCALITIES_ONLY } from "@/lib/non-localities";
import { PUBLISHED_GROWTH, PUBLISHED_HOUSE_MEDIAN, publishedSales } from "@/lib/published-medians";

export interface SuburbMarketRow {
  slug: string;
  name: string;
  postcode: string;
  state: string;
  medianHousePrice: number;
  medianUnitPrice: number;
  annualGrowthHouse: number;
  daysOnMarket: number;
}

export interface StateMarketData {
  state: string;
  stateName: string;
  /** Suburbs whose page publishes a house median. Every figure below is taken over these. */
  totalSuburbsWithData: number;
  avgMedianHousePrice: number | null;
  avgMedianUnitPrice: number | null;
  /** Null where no feed measures a 12-month change (every state but NSW and SA). */
  avgAnnualGrowth: number | null;
  /** Always null: no feed measures days on market. Kept for the day one does. */
  avgDaysOnMarket: number | null;
  topByGrowth: SuburbMarketRow[];
  topByMedianPrice: SuburbMarketRow[];
  topMostAffordable: SuburbMarketRow[];
}

const STATE_NAMES: Record<string, string> = {
  QLD: "Queensland",
  NSW: "New South Wales",
  VIC: "Victoria",
  WA:  "Western Australia",
  SA:  "South Australia",
  TAS: "Tasmania",
  NT:  "Northern Territory",
  ACT: "Australian Capital Territory",
};

export function getStateNameForReport(state: string): string {
  return STATE_NAMES[state.toUpperCase()] ?? state.toUpperCase();
}

const SUBURB_SELECT = {
  slug: true,
  name: true,
  postcode: true,
  state: true,
  medianHousePrice: true,
  medianUnitPrice: true,
  annualGrowthHouse: true,
  statsSource: true,
  salesCountHouse: true,
} as const;

type SelectedRow = {
  slug: string; name: string; postcode: string; state: string;
  medianHousePrice: number; medianUnitPrice: number; annualGrowthHouse: number;
  statsSource: string; salesCountHouse: number;
};

/** A row as the suburb's own page prints it. Days on market: no feed measures it. */
function toMarketRow({ statsSource, salesCountHouse, ...r }: SelectedRow): SuburbMarketRow {
  const sales = publishedSales({ ...r, statsSource, salesCountHouse });
  return {
    ...r,
    medianHousePrice: sales.medianHousePrice,
    medianUnitPrice: sales.medianUnitPrice,
    annualGrowthHouse: sales.annualGrowthHouse,
    daysOnMarket: 0,
  };
}

function avg(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function avgFloat(values: number[]): number | null {
  if (values.length === 0) return null;
  return parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1));
}

export async function getStateMarketData(state: string): Promise<StateMarketData> {
  const upperState = state.toUpperCase();
  const inState = { state: upperState, ...LOCALITIES_ONLY };

  // Every list and every average is over the medians the suburb pages
  // publish (src/lib/published-medians.ts). Until 29 Sep 2026 they were over
  // the raw columns: the NSW report led its growth table with +4,612.1%.
  // One query after another: the runtime pool holds a single connection.
  const topByGrowthRaw = await db.suburb.findMany({
    where: { ...inState, ...PUBLISHED_GROWTH, medianHousePrice: { gt: 100_000 } },
    select: SUBURB_SELECT,
    orderBy: [{ annualGrowthHouse: "desc" }, { name: "asc" }],
    take: 10,
  });
  const topByPriceRaw = await db.suburb.findMany({
    where: { ...inState, ...PUBLISHED_HOUSE_MEDIAN, medianHousePrice: { gt: 100_000 } },
    select: SUBURB_SELECT,
    orderBy: [{ medianHousePrice: "desc" }, { name: "asc" }],
    take: 10,
  });
  const topAffordableRaw = await db.suburb.findMany({
    where: { ...inState, ...PUBLISHED_HOUSE_MEDIAN, medianHousePrice: { gt: 100_000 } },
    select: SUBURB_SELECT,
    orderBy: [{ medianHousePrice: "asc" }, { name: "asc" }],
    take: 10,
  });
  const allPriced = await db.suburb.findMany({
    where: { ...inState, ...PUBLISHED_HOUSE_MEDIAN },
    select: {
      medianHousePrice: true,
      medianUnitPrice: true,
      annualGrowthHouse: true,
      statsSource: true,
      salesCountHouse: true,
    },
  });

  const published = allPriced.map(publishedSales);
  const housePrices = published.map((s) => s.medianHousePrice).filter((p) => p > 0);
  const unitPrices  = published.map((s) => s.medianUnitPrice).filter((p) => p > 0);
  const growths     = published.map((s) => s.annualGrowthHouse).filter((g) => g !== 0);

  return {
    state: upperState,
    stateName: getStateNameForReport(upperState),
    totalSuburbsWithData: housePrices.length,
    avgMedianHousePrice: avg(housePrices),
    avgMedianUnitPrice:  avg(unitPrices),
    avgAnnualGrowth:     avgFloat(growths),
    avgDaysOnMarket:     null,
    topByGrowth:       topByGrowthRaw.map(toMarketRow),
    topByMedianPrice:  topByPriceRaw.map(toMarketRow),
    topMostAffordable: topAffordableRaw.map(toMarketRow),
  };
}
