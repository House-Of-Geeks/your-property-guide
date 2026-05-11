import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

// Suburb-scoped data needed by /property/[slug]. All five queries below
// return identical data for every property in the same suburb, so we cache
// the bundle by suburbSlug. With ~15K suburbs and millions of property URLs,
// each suburb only needs one DB roundtrip per revalidation window regardless
// of how many of its property pages are rendered.
//
// Revalidation matches the /property/[slug] page revalidate (24h). Tagged
// `suburb:${slug}` so the sync worker can invalidate a single suburb when
// its data is refreshed.

const REVALIDATE_SECONDS = 86_400;
// Pool size for "recent sales in this suburb" — page filters out the
// current property and slices to 6, so a small buffer is enough.
const NEARBY_SALES_POOL_SIZE = 12;
const NEARBY_SALES_WINDOW_MS = 24 * 30 * 24 * 3600 * 1000;

type CachedSuburb = {
  id: string;
  slug: string;
  name: string;
  state: string;
  postcode: string;
  medianHousePrice: number;
  medianUnitPrice: number;
  medianRentHouse: number;
  medianRentUnit: number;
  annualGrowthHouse: number;
  annualGrowthUnit: number;
  daysOnMarket: number;
  population: number;
  medianAge: number;
  ownerOccupied: number;
  renterOccupied: number;
  householdsFamily: number;
  householdsLonePerson: number;
  walkScore: number | null;
  transitScore: number | null;
  bikeScore: number | null;
  lat: number | null;
  lng: number | null;
  rentalUpdatedAt: Date | null;
  salesUpdatedAt: Date | null;
  hazardUpdatedAt: Date | null;
};

type CachedSchool = {
  id: string;
  name: string;
  type: string;
  sector: string;
  distance: number;
  yearRange: string | null;
  gender: string | null;
  icsea: number | null;
  enrolment: number | null;
  acaraId: string | null;
};

type CachedHazard = {
  floodClass: string | null;
  floodSource: string | null;
  bushfireRisk: string | null;
  bushfireSource: string | null;
} | null;

type CachedCrimeStat = {
  totalOffences: number;
  offenceBreakdown: unknown;
  period: string;
  periodDate: Date;
  state: string;
} | null;

type CachedClimate = {
  bomStationId: string;
  bomStationName: string;
  distanceKm: number;
  meanMaxTemp: number[];
  meanMinTemp: number[];
  meanRainfall: number[];
  meanHumidity9am: number[];
  meanSunshineHrs: number[];
  annualRainfallMm: number | null;
} | null;

type CachedNearbySale = {
  id: string;
  price: number;
  contractDate: Date;
  source: string;
  natureCode: string | null;
  address: { addressFull: string; slug: string } | null;
};

export type PropertyPageSuburbData = {
  suburb: CachedSuburb;
  schools: CachedSchool[];
  hazard: CachedHazard;
  crimeStat: CachedCrimeStat;
  climate: CachedClimate;
  nearbySalesPool: CachedNearbySale[];
};

async function fetchBundle(suburbSlug: string) {
  const suburb = await db.suburb.findUnique({
    where: { slug: suburbSlug },
    select: {
      id: true,
      slug: true,
      name: true,
      state: true,
      postcode: true,
      medianHousePrice: true,
      medianUnitPrice: true,
      medianRentHouse: true,
      medianRentUnit: true,
      annualGrowthHouse: true,
      annualGrowthUnit: true,
      daysOnMarket: true,
      population: true,
      medianAge: true,
      ownerOccupied: true,
      renterOccupied: true,
      householdsFamily: true,
      householdsLonePerson: true,
      walkScore: true,
      transitScore: true,
      bikeScore: true,
      lat: true,
      lng: true,
      rentalUpdatedAt: true,
      salesUpdatedAt: true,
      hazardUpdatedAt: true,
    },
  });
  if (!suburb) return null;

  const [schools, hazard, crimeStat, climate, nearbySalesPool] = await Promise.all([
    db.school.findMany({
      where: { suburbId: suburb.id },
      select: {
        id: true,
        name: true,
        type: true,
        sector: true,
        distance: true,
        yearRange: true,
        gender: true,
        icsea: true,
        enrolment: true,
        acaraId: true,
      },
      orderBy: [{ sector: "asc" }, { distance: "asc" }],
      take: 6,
    }),
    db.suburbHazard.findUnique({
      where: { suburbSlug },
      select: {
        floodClass: true,
        floodSource: true,
        bushfireRisk: true,
        bushfireSource: true,
      },
    }),
    db.suburbCrimeStat.findFirst({
      where: { suburbSlug },
      orderBy: { periodDate: "desc" },
      select: {
        totalOffences: true,
        offenceBreakdown: true,
        period: true,
        periodDate: true,
        state: true,
      },
    }),
    db.suburbClimate.findUnique({
      where: { suburbSlug },
      select: {
        bomStationId: true,
        bomStationName: true,
        distanceKm: true,
        meanMaxTemp: true,
        meanMinTemp: true,
        meanRainfall: true,
        meanHumidity9am: true,
        meanSunshineHrs: true,
        annualRainfallMm: true,
      },
    }),
    // Recent sales pool — we fetch a small buffer instead of the page's
    // final list so the cache entry doesn't depend on the current address.
    // The page filters out its own address and slices to 6.
    db.propertySale.findMany({
      where: {
        matchConfidence: "exact",
        address: { suburbSlug },
        contractDate: { gt: new Date(Date.now() - NEARBY_SALES_WINDOW_MS) },
      },
      select: {
        id: true,
        price: true,
        contractDate: true,
        source: true,
        natureCode: true,
        address: { select: { addressFull: true, slug: true } },
      },
      orderBy: { contractDate: "desc" },
      take: NEARBY_SALES_POOL_SIZE,
    }),
  ]);

  return { suburb, schools, hazard, crimeStat, climate, nearbySalesPool };
}

// unstable_cache uses JSON.stringify/parse internally, so Date fields come
// back as ISO strings. Walk the bundle and rehydrate the dates the page
// actually calls .toISOString() on (and a couple of denormalised ones that
// flow into freshness components).
function rehydrate(raw: Awaited<ReturnType<typeof fetchBundle>>): PropertyPageSuburbData | null {
  if (!raw) return null;
  return {
    suburb: {
      ...raw.suburb,
      rentalUpdatedAt: raw.suburb.rentalUpdatedAt ? new Date(raw.suburb.rentalUpdatedAt) : null,
      salesUpdatedAt: raw.suburb.salesUpdatedAt ? new Date(raw.suburb.salesUpdatedAt) : null,
      hazardUpdatedAt: raw.suburb.hazardUpdatedAt ? new Date(raw.suburb.hazardUpdatedAt) : null,
    },
    schools: raw.schools,
    hazard: raw.hazard,
    crimeStat: raw.crimeStat
      ? { ...raw.crimeStat, periodDate: new Date(raw.crimeStat.periodDate) }
      : null,
    climate: raw.climate,
    nearbySalesPool: raw.nearbySalesPool.map((s) => ({
      ...s,
      contractDate: new Date(s.contractDate),
    })),
  };
}

export async function getPropertyPageSuburbData(
  suburbSlug: string,
): Promise<PropertyPageSuburbData | null> {
  const raw = await unstable_cache(
    () => fetchBundle(suburbSlug),
    ["property-page-suburb-bundle:v1", suburbSlug],
    { revalidate: REVALIDATE_SECONDS, tags: [`suburb:${suburbSlug}`] },
  )();
  return rehydrate(raw);
}
