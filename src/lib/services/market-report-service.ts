import { db } from "@/lib/db";

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
  totalSuburbsWithData: number;
  avgMedianHousePrice: number | null;
  avgMedianUnitPrice: number | null;
  avgAnnualGrowth: number | null;
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
  daysOnMarket: true,
} as const;

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

  const [topByGrowthRaw, topByPriceRaw, topAffordableRaw, allSuburbs] = await Promise.all([
    // Top 10 by growth
    db.suburb.findMany({
      where: {
        state: upperState,
        medianHousePrice: { gt: 100_000 },
        annualGrowthHouse: { gt: 0 },
      },
      select: SUBURB_SELECT,
      orderBy: { annualGrowthHouse: "desc" },
      take: 10,
    }),
    // Top 10 by median house price
    db.suburb.findMany({
      where: {
        state: upperState,
        medianHousePrice: { gt: 100_000 },
      },
      select: SUBURB_SELECT,
      orderBy: { medianHousePrice: "desc" },
      take: 10,
    }),
    // Top 10 most affordable (lowest price, but exclude unrealistic values)
    db.suburb.findMany({
      where: {
        state: upperState,
        medianHousePrice: { gt: 100_000 },
      },
      select: SUBURB_SELECT,
      orderBy: { medianHousePrice: "asc" },
      take: 10,
    }),
    // All suburbs for aggregate stats
    db.suburb.findMany({
      where: { state: upperState },
      select: {
        medianHousePrice: true,
        medianUnitPrice: true,
        annualGrowthHouse: true,
        daysOnMarket: true,
      },
    }),
  ]);

  const suburbsWithData = allSuburbs.filter((s) => s.medianHousePrice > 0);
  const housePrices   = suburbsWithData.map((s) => s.medianHousePrice);
  const unitPrices    = suburbsWithData.filter((s) => s.medianUnitPrice > 0).map((s) => s.medianUnitPrice);
  const growths       = suburbsWithData.filter((s) => s.annualGrowthHouse !== 0).map((s) => s.annualGrowthHouse);
  const domValues     = suburbsWithData.filter((s) => s.daysOnMarket > 0).map((s) => s.daysOnMarket);

  return {
    state: upperState,
    stateName: getStateNameForReport(upperState),
    totalSuburbsWithData: suburbsWithData.length,
    avgMedianHousePrice: avg(housePrices),
    avgMedianUnitPrice:  avg(unitPrices),
    avgAnnualGrowth:     avgFloat(growths),
    avgDaysOnMarket:     avg(domValues),
    topByGrowth:     topByGrowthRaw,
    topByMedianPrice: topByPriceRaw,
    topMostAffordable: topAffordableRaw,
  };
}
