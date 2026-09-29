import { cache } from "react";
import { RELIABLE_SALES_SOURCES } from "@/lib/suburb-data-quality";
import type { Suburb, SuburbDataFreshness } from "@/types";
import { db } from "@/lib/db";
import type { Suburb as DbSuburb, School as DbSchool, SuburbHazard as DbSuburbHazard, SuburbClimate as DbSuburbClimate } from "@/generated/prisma/client";
import { publishedSales } from "@/lib/published-medians";
import { hasPublishedHouseMedian, isThinSuburbRow } from "@/lib/suburb-indexability";
// Postal delivery names, institutions and shopping-centre post offices are
// not suburbs: every list and sitemap below leaves them out (LOCALITIES_ONLY).
import { LOCALITIES_ONLY, isHiddenSlug, isNonLocalitySlug } from "@/lib/non-localities";

// Columns the indexability rules read (src/lib/suburb-indexability.ts).
const INDEX_ROW_SELECT = {
  medianHousePrice: true,
  medianUnitPrice: true,
  population: true,
  statsSource: true,
  salesCountHouse: true,
} as const;

type DbSuburbWithSchools = DbSuburb & { schools: DbSchool[] };

const NO_FRESHNESS: SuburbDataFreshness = {
  rentalAsOf:      null,
  rentalSource:    null,
  crimeAsOf:       null,
  crimeSource:     null,
  salesAsOf:       null,
  salesSource:     null,
  salesCount:      null,
  salesPeriodEnd:  null,
  censusAsOf:      null,
  hazardAsOf:      null,
  walkabilityAsOf: null,
  climateAsOf:     null,
};

// End of the period each sales feed's medians describe (DataSource.dataAsOf:
// 31 Dec of the calendar year for NSW and ABS, the quarter for VIC and SA).
// Four rows, memoised per request; rendered under every median as provenance.
const SALES_SOURCES = ["sales-nsw", "sales-vic", "sales-sa", "sales-abs"] as const;
const getSalesPeriodEnds = cache(async (): Promise<Map<string, Date | null>> => {
  const rows = await db.dataSource.findMany({ where: { id: { in: [...SALES_SOURCES] } }, select: { id: true, dataAsOf: true } });
  return new Map(rows.map((r) => [r.id, r.dataAsOf ?? null]));
});

async function fetchFreshness(slug: string): Promise<{
  freshness: SuburbDataFreshness;
  rentalRentHouse: number | null;
  rentalRentUnit:  number | null;
}> {
  const [rental, crime] = await Promise.all([
    // Newest period, and on a tie the most recently written row: two rows for
    // the same quarter (an old feed version's and the current one's) must not
    // resolve by table order (VIC, 7 Sep 2026: Toorak showed the stale $688).
    db.suburbRentalStat.findFirst({
      where:   { suburbSlug: slug },
      orderBy: [{ periodDate: "desc" }, { updatedAt: "desc" }],
      select:  { periodDate: true, source: true, medianRentHouse: true, medianRentUnit: true },
    }),
    db.suburbCrimeStat.findFirst({
      where:   { suburbSlug: slug },
      orderBy: [{ periodDate: "desc" }, { updatedAt: "desc" }],
      select:  { periodDate: true, source: true },
    }),
  ]);

  return {
    freshness: {
      rentalAsOf:      rental?.periodDate ?? null,
      rentalSource:    rental?.source    ?? null,
      crimeAsOf:       crime?.periodDate ?? null,
      crimeSource:     crime?.source     ?? null,
      // Denormalized fields, filled in by toSuburb() after the Suburb row is fetched
      salesAsOf:       null,
      salesSource:     null,
      salesCount:      null,
      salesPeriodEnd:  null,
      censusAsOf:      null,
      hazardAsOf:      null,
      walkabilityAsOf: null,
      climateAsOf:     null,
    },
    rentalRentHouse: rental?.medianRentHouse ?? null,
    rentalRentUnit:  rental?.medianRentUnit  ?? null,
  };
}

function toSuburb(
  s: DbSuburbWithSchools,
  freshness: SuburbDataFreshness,
  rentalRentHouse: number | null,
  rentalRentUnit: number | null,
  hazard: DbSuburbHazard | null,
  climate: DbSuburbClimate | null,
  salesPeriodEnds: Map<string, Date | null> = new Map(),
): Suburb {
  // Merge denormalized *UpdatedAt fields into freshness
  const mergedFreshness: SuburbDataFreshness = {
    ...freshness,
    // The NSW rental feed is postcode-level and writes no per-suburb
    // SuburbRentalStat row, so the row-level rentalAsOf/rentalSource are
    // null there; fall back to the Suburb row's own rental timestamp.
    rentalAsOf:      freshness.rentalAsOf   ?? s.rentalUpdatedAt ?? null,
    salesAsOf:       s.salesUpdatedAt       ?? null,
    salesSource:     s.statsSource          ?? null,
    salesCount:      s.salesCountHouse > 0 ? s.salesCountHouse : null,
    salesPeriodEnd:  salesPeriodEnds.get(s.statsSource) ?? null,
    censusAsOf:      s.censusUpdatedAt      ?? null,
    hazardAsOf:      s.hazardUpdatedAt      ?? null,
    walkabilityAsOf: s.walkabilityUpdatedAt ?? null,
    climateAsOf:     s.climateUpdatedAt     ?? null,
  };

  // Data-quality gate. If the sales source for this suburb is one we
  // distrust (currently the QLD/WA census-mortgage proxy — see
  // src/lib/suburb-data-quality.ts), zero out the price-derived
  // fields at the boundary so no downstream component publishes
  // fiction as fact. Rental, demographics, walkability, climate,
  // schools, hazard all come from independent sources and are kept.
  // A trusted feed can still hand us a "median" of two or three sales; those
  // are withheld the same way (fix item 1, step v; the count stays in
  // freshness so the page can say why). Unknown counts never suppress.
  // The rule is publishedSales (src/lib/published-medians.ts), which the
  // lists read too, so a list cannot print a figure this page withholds.
  // Growth additionally passes a plausibility clamp: even trusted feeds
  // produce ±40% "growth" on thin-sales suburbs, and 0 is the codebase's
  // "unknown, don't print" convention for these fields. It is published
  // only from a feed that measures it (NSW, SA): a figure beside an ABS or
  // Land Victoria median was left by an earlier import.
  const { medianHousePrice, medianUnitPrice, annualGrowthHouse } = publishedSales(s);
  // No feed measures a 12-month change in the unit median; the eight values
  // on file on 29 Sep 2026 were seed leftovers. Withheld like days on market.
  const annualGrowthUnit = 0;
  // No current feed produces days on market: sales-nsw wrote the settlement
  // period until 6 Sep 2026 and now writes 0, and the remaining values are
  // seed leftovers from the April import. Withheld until a feed supplies it
  // (0 = unknown, not printed). Column kept for that day.
  const daysOnMarket      = 0;

  return {
    id:          s.id,
    slug:        s.slug,
    name:        s.name,
    postcode:    s.postcode,
    state:       s.state,
    region:      s.region,
    description: s.description,
    heroImage:   s.heroImage,
    stats: {
      medianHousePrice,
      medianUnitPrice,
      // Use synced rental data if available, otherwise fall back to seed value
      medianRentHouse:   rentalRentHouse ?? s.medianRentHouse,
      medianRentUnit:    rentalRentUnit  ?? s.medianRentUnit,
      annualGrowthHouse,
      annualGrowthUnit,
      daysOnMarket,
      population:        s.population,
      medianAge:         s.medianAge,
      ownerOccupied:        s.ownerOccupied,
      renterOccupied:       s.renterOccupied,
      householdsFamily:     s.householdsFamily,
      householdsLonePerson: s.householdsLonePerson,
      walkScore:    s.walkScore    ?? null,
      transitScore: s.transitScore ?? null,
      bikeScore:    s.bikeScore    ?? null,
    },
    schools: s.schools.map((sc) => ({
      name:      sc.name,
      type:      sc.type   as Suburb["schools"][number]["type"],
      sector:    sc.sector as Suburb["schools"][number]["sector"],
      distance:  sc.distance,
      yearRange: sc.yearRange ?? null,
      gender:    (sc.gender ?? null) as Suburb["schools"][number]["gender"],
      website:   sc.website ?? null,
      icsea:     sc.icsea ?? null,
      enrolment: sc.enrolment ?? null,
      acaraId:   sc.acaraId ?? null,
    })),
    amenities:      s.amenities,
    transportLinks: s.transportLinks,
    // "Caboolture BC" is not a neighbour; its URL redirects to Caboolture.
    nearbySuburbs:  s.nearbySuburbs.filter((n) => !isNonLocalitySlug(n)),
    dataFreshness:  mergedFreshness,
    hazard: hazard
      ? {
          floodClass:     hazard.floodClass     ?? null,
          floodSource:    hazard.floodSource    ?? null,
          bushfireRisk:   hazard.bushfireRisk   ?? null,
          bushfireSource: hazard.bushfireSource ?? null,
        }
      : null,
    climate:
      climate && climate.bomStationId && climate.bomStationName && climate.distanceKm !== null
        ? {
            bomStationId:   climate.bomStationId,
            bomStationName: climate.bomStationName,
            distanceKm:     climate.distanceKm,
            meanMaxTemp:    climate.meanMaxTemp    ?? [],
            meanMinTemp:    climate.meanMinTemp    ?? [],
            meanRainfall:   climate.meanRainfall   ?? [],
            meanHumidity9am: climate.meanHumidity9am ?? [],
            meanSunshineHrs: climate.meanSunshineHrs ?? [],
            annualRainfallMm: climate.annualRainfallMm ?? null,
          }
        : null,
  };
}

// Cached at module scope so we only pay the "does this column exist" probe
// once per server process. true = use ST_DWithin path. false = fall back to
// haversine. null = not probed yet.
let schoolGeomAvailable: boolean | null = null;

async function nearbySchoolsPostGIS(
  lat: number,
  lng: number,
  radiusKm: number,
): Promise<DbSchool[]> {
  // ST_DWithin on geography(Point, 4326) takes a radius in METERS and uses
  // the GIST index. KNN ordering (geom <-> point) also uses the index.
  const radiusM = radiusKm * 1000;
  return db.$queryRaw<DbSchool[]>`
    SELECT s.*
    FROM "School" s
    WHERE s.geom IS NOT NULL
      AND ST_DWithin(
        s.geom,
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
        ${radiusM}
      )
    ORDER BY s.geom <-> ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
    LIMIT 20
  `;
}

async function nearbySchoolsHaversine(
  lat: number,
  lng: number,
  radiusKm: number,
): Promise<DbSchool[]> {
  return db.$queryRaw<DbSchool[]>`
    SELECT s.*,
      (6371 * acos(
        cos(radians(${lat})) * cos(radians(s.lat)) *
        cos(radians(s.lng) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(s.lat))
      )) AS dist_km
    FROM "School" s
    WHERE s.lat IS NOT NULL AND s.lng IS NOT NULL
      AND (6371 * acos(
        cos(radians(${lat})) * cos(radians(s.lat)) *
        cos(radians(s.lng) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(s.lat))
      )) <= ${radiusKm}
    ORDER BY dist_km ASC
    LIMIT 20
  `;
}

async function getNearbySchools(suburb: { id: string; lat: number | null; lng: number | null }): Promise<DbSchool[]> {
  if (!suburb.lat || !suburb.lng) {
    return db.school.findMany({ where: { suburbId: suburb.id } });
  }
  const lat = suburb.lat;
  const lng = suburb.lng;

  // Try progressively larger radii until we have enough schools. We prefer
  // the PostGIS path (uses GIST index) but fall back to haversine if the
  // geom column doesn't exist yet, keeps deploys safe both before AND after
  // scripts/postgis/2026-05-add-school-geom.sql is run.
  for (const radiusKm of [10, 20, 40]) {
    let schools: DbSchool[];
    if (schoolGeomAvailable === false) {
      schools = await nearbySchoolsHaversine(lat, lng, radiusKm);
    } else {
      try {
        schools = await nearbySchoolsPostGIS(lat, lng, radiusKm);
        schoolGeomAvailable = true;
      } catch (err) {
        // Most likely "column geom does not exist" (42703) before the migration runs.
        if (schoolGeomAvailable === null) {
          schoolGeomAvailable = false;
          console.warn(
            "[suburb-service] School.geom not available, falling back to haversine. " +
            "Run scripts/postgis/2026-05-add-school-geom.sql to enable PostGIS path.",
            err,
          );
        }
        schools = await nearbySchoolsHaversine(lat, lng, radiusKm);
      }
    }

    const hasSecondary = schools.some((s) => s.type === "secondary" || s.type === "combined");
    if (schools.length >= 5 || (schools.length >= 2 && hasSecondary)) return schools;
    if (radiusKm === 40) return schools;
  }
  return [];
}

export async function getSuburbs(opts?: {
  state?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ suburbs: Suburb[]; total: number }> {
  const { state, search, limit = 24, offset = 0 } = opts ?? {};

  const where = {
    ...LOCALITIES_ONLY,
    ...(state ? { state: state.toUpperCase() } : {}),
    ...(search
      ? {
          OR: [
            { name:     { contains: search, mode: "insensitive" as const } },
            { postcode: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    db.suburb.findMany({
      where,
      orderBy: [{ population: "desc" }, { name: "asc" }],
      take: limit,
      skip: offset,
      include: { schools: false },
    }),
    db.suburb.count({ where }),
  ]);

  return {
    suburbs: rows.map((s) => toSuburb({ ...s, schools: [] }, NO_FRESHNESS, null, null, null, null)),
    total,
  };
}

// Wrapped in React's cache() so multiple calls for the same slug
// within a single render pass (e.g. generateMetadata + the page
// handler) share one DB round trip. Cuts suburb-page DB hits in half
// at zero risk — cache is per-request, so different requests still
// see fresh ISR-revalidated data.
export const getSuburbBySlug = cache(async (slug: string): Promise<Suburb | null> => {
  // "Not Disclosed" and "North Pole, VIC 9999" are rows, not places, with
  // nowhere to redirect to: every page built on this lookup answers 404.
  if (isHiddenSlug(slug)) return null;
  const [row, { freshness, rentalRentHouse, rentalRentUnit }, hazard, climate] = await Promise.all([
    db.suburb.findUnique({ where: { slug }, include: { schools: false } }),
    fetchFreshness(slug),
    db.suburbHazard.findUnique({ where: { suburbSlug: slug } }),
    db.suburbClimate.findUnique({ where: { suburbSlug: slug } }),
  ]);
  if (!row) return null;
  const schools = await getNearbySchools(row);
  const salesPeriodEnds = await getSalesPeriodEnds();
  return toSuburb({ ...row, schools }, freshness, rentalRentHouse, rentalRentUnit, hazard, climate, salesPeriodEnds);
});

export async function getAllSuburbSlugs(): Promise<string[]> {
  const rows = await db.suburb.findMany({ where: LOCALITIES_ONLY, select: { slug: true } });
  return rows.map((r) => r.slug);
}

export async function getAllSuburbSlugsWithDates(): Promise<{ slug: string; updatedAt: Date }[]> {
  return db.suburb.findMany({ where: LOCALITIES_ONLY, select: { slug: true, updatedAt: true } });
}

// Sitemap-eligible suburbs only. Excludes thin pages (no price data AND
// no population) which we noindex on the page itself — keeping them out
// of the sitemap is the matching SEO hygiene step. Crawl budget on a
// 9,600-page property site should go to pages with real content.
// Suburbs whose median clears the reliable-price gate. Feeds the sitemap
// for sub-pages that only make sense with a trusted median (agents pages).
// The same rule as the page (hasReliablePrice on the gated object), which
// also withholds a median built on fewer than five recorded sales.
export async function getSuburbSlugsWithReliablePrice(): Promise<string[]> {
  const rows = await db.suburb.findMany({
    where: { medianHousePrice: { gt: 0 }, statsSource: { in: [...RELIABLE_SALES_SOURCES] }, ...LOCALITIES_ONLY },
    select: { slug: true, ...INDEX_ROW_SELECT },
  });
  return rows.filter(hasPublishedHouseMedian).map((r) => r.slug);
}

// Suburb profiles that do not noindex themselves: every locality, less the
// rows the page calls thin (isThinProfile: no published price, no population
// and none of walkability, climate, crime or rental data, or a row filed
// under a state its postcode does not belong to). Each set below is
// read the way the page reads it for one suburb (fetchFreshness and toSuburb
// above), once for all rows; the sitemap caches the result for a day. Feeds
// the suburbs sitemap only; the sub-page sitemaps keep the raw gate because
// each sub-page has its own indexing rule.
export async function getIndexableSuburbProfilesWithDates(): Promise<{ slug: string; updatedAt: Date }[]> {
  // One query after another, not Promise.all: the runtime pool holds a single
  // connection (src/lib/db.ts), so parallel queries queue for it, and the
  // one at the back of four can wait past the 5 s acquisition timeout.
  const rows = await db.suburb.findMany({
    where: LOCALITIES_ONLY,
    select: { slug: true, updatedAt: true, walkScore: true, state: true, postcode: true, ...INDEX_ROW_SELECT },
  });
  const rental = await db.suburbRentalStat.groupBy({ by: ["suburbSlug"], where: { suburbSlug: { not: null } } });
  const crime = await db.suburbCrimeStat.groupBy({ by: ["suburbSlug"], where: { suburbSlug: { not: null } } });
  // toSuburb() drops a climate row that names no station; so does this.
  const climate = await db.suburbClimate.findMany({
    where: { bomStationId: { not: "" }, bomStationName: { not: "" } },
    select: { suburbSlug: true },
  });
  const hasRental = new Set(rental.map((r) => r.suburbSlug));
  const hasCrime = new Set(crime.map((r) => r.suburbSlug));
  const hasClimate = new Set(climate.map((r) => r.suburbSlug));
  return rows
    .filter((r) => !isThinSuburbRow(r, {
      walkScore: r.walkScore,
      hasClimate: hasClimate.has(r.slug),
      hasCrime: hasCrime.has(r.slug),
      hasRental: hasRental.has(r.slug),
    }))
    .map(({ slug, updatedAt }) => ({ slug, updatedAt }));
}

export async function getIndexableSuburbSlugsWithDates(): Promise<{ slug: string; updatedAt: Date }[]> {
  return db.suburb.findMany({
    where: {
      ...LOCALITIES_ONLY,
      OR: [
        { medianHousePrice: { gt: 0 } },
        { medianUnitPrice: { gt: 0 } },
        { population: { gt: 0 } },
      ],
    },
    select: { slug: true, updatedAt: true },
  });
}
