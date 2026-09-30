// Greater-capital-city classification by postcode range.
//
// Why postcodes: the Suburb rows carry no GCCSA/SA4 geography, and the
// region field is an LGA-ish label that doesn't map cleanly to "Greater
// Sydney". Australian postcode allocation is strongly metro-clustered, so
// conservative ranges give a high-precision (if slightly under-inclusive)
// "is this suburb part of Greater {capital}" signal — good enough for
// phrasing ("Macquarie Park, Sydney") and for aggregating city-level
// market stats. Fringe LGAs that straddle a range are acceptable noise.
//
// Ranges are inclusive and compared numerically (postcodes are stored as
// 4-char strings; NT's leading zero parses fine).

export interface CapitalCity {
  /** URL slug, e.g. "sydney" */
  slug: string;
  /** Display name, e.g. "Sydney" */
  name: string;
  /** State/territory the city belongs to. */
  state: string;
  /** Inclusive numeric postcode ranges covering the greater-city area. */
  ranges: [number, number][];
  /**
   * The city's General Post Office, the conventional city-centre point, in
   * decimal degrees (WGS84). Distances "to the CBD" on the best-suburbs city
   * editions are straight lines from a suburb's postcode centroid to this
   * point, rounded to the kilometre.
   */
  cbd: { lat: number; lng: number };
}

export const CAPITAL_CITIES: CapitalCity[] = [
  {
    slug: "sydney",
    name: "Sydney",
    state: "NSW",
    cbd: { lat: -33.8675, lng: 151.2070 }, // Sydney GPO, 1 Martin Place
    ranges: [
      [2000, 2249], // harbour to Sutherland/Hornsby
      [2555, 2574], // Macarthur / Camden
      [2740, 2786], // Penrith / Blacktown outer / Blue Mountains
    ],
  },
  {
    slug: "melbourne",
    name: "Melbourne",
    state: "VIC",
    cbd: { lat: -37.8136, lng: 144.9631 }, // Melbourne GPO, Bourke and Elizabeth Streets
    ranges: [
      [3000, 3210], // CBD to Werribee/Frankston belt
      [3335, 3341], // Melton corridor
      [3427, 3429], // Sunbury
      [3750, 3765], // Whittlesea / Diamond Creek corridor
      [3800, 3810], // Monash to Berwick / Pakenham
      [3910, 3944], // Mornington Peninsula
      [3975, 3978], // Cranbourne corridor
    ],
  },
  {
    slug: "brisbane",
    name: "Brisbane",
    state: "QLD",
    cbd: { lat: -27.4679, lng: 153.0281 }, // Brisbane GPO, 261 Queen Street
    ranges: [
      [4000, 4207], // Brisbane City, Redlands, Logan
      [4300, 4306], // Ipswich
      [4500, 4521], // Moreton Bay
    ],
  },
  {
    slug: "perth",
    name: "Perth",
    state: "WA",
    cbd: { lat: -31.9535, lng: 115.8605 }, // Perth GPO, Forrest Place
    ranges: [
      [6000, 6175], // metro core to Rockingham/Armadale
      [6210, 6210], // Mandurah (Greater Perth GCCSA)
    ],
  },
  {
    slug: "adelaide",
    name: "Adelaide",
    state: "SA",
    cbd: { lat: -34.9285, lng: 138.6007 }, // Adelaide GPO, King William Street
    ranges: [[5000, 5174]],
  },
  {
    slug: "hobart",
    name: "Hobart",
    state: "TAS",
    cbd: { lat: -42.8821, lng: 147.3272 }, // Hobart GPO, Elizabeth Street
    ranges: [
      [7000, 7055], // Hobart, Glenorchy, Kingborough
      [7170, 7173], // Clarence east
    ],
  },
  {
    slug: "canberra",
    name: "Canberra",
    state: "ACT",
    cbd: { lat: -35.2802, lng: 149.1310 }, // Canberra GPO, Alinga Street
    ranges: [
      [2600, 2620],
      [2900, 2914],
    ],
  },
  {
    slug: "darwin",
    name: "Darwin",
    state: "NT",
    cbd: { lat: -12.4634, lng: 130.8456 }, // Darwin GPO, Cavenagh Street
    ranges: [[800, 832]], // 0800–0832 incl. Palmerston
  },
];

export function getCapitalCity(slug: string): CapitalCity | undefined {
  return CAPITAL_CITIES.find((c) => c.slug === slug);
}

/**
 * The greater capital city a suburb belongs to, or null for regional
 * suburbs. Used for "{Suburb}, {City}" phrasing and city-level rollups.
 */
export function capitalCityFor(state: string, postcode: string): CapitalCity | null {
  const pc = parseInt(postcode, 10);
  if (Number.isNaN(pc)) return null;
  const stateUpper = state.toUpperCase();
  for (const city of CAPITAL_CITIES) {
    if (city.state !== stateUpper) continue;
    if (city.ranges.some(([lo, hi]) => pc >= lo && pc <= hi)) return city;
  }
  return null;
}

const pad4 = (n: number) => String(n).padStart(4, "0");

/**
 * Prisma `where` fragment for the suburbs of a greater capital city: the
 * city's state and its postcode ranges (postcodes are 4-character strings,
 * so the bounds are zero-padded and compared as strings). The same
 * membership as capitalCityFor, for the city rollups and the best-suburbs
 * city editions; tests/lib/city-editions.test.ts holds the two together.
 */
export function cityPostcodeWhere(city: CapitalCity): {
  state: string;
  OR: { postcode: { gte: string; lte: string } }[];
} {
  return {
    state: city.state,
    OR: city.ranges.map(([lo, hi]) => ({ postcode: { gte: pad4(lo), lte: pad4(hi) } })),
  };
}

/** The same membership for raw SQL over "Suburb" aliased `s`. */
export function cityPostcodeSql(city: CapitalCity, alias = "s"): string {
  const ranges = city.ranges
    .map(([lo, hi]) => `(${alias}.postcode >= '${pad4(lo)}' AND ${alias}.postcode <= '${pad4(hi)}')`)
    .join(" OR ");
  return `${alias}.state = '${city.state}' AND (${ranges})`;
}

/** Straight-line distance in kilometres between two points (haversine, Earth radius 6,371 km). */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** Kilometres from a suburb's centroid to the city's GPO, rounded, or null without a centroid. */
export function kmToCbd(city: CapitalCity, s: { lat: number | null; lng: number | null }): number | null {
  if (s.lat == null || s.lng == null) return null;
  return Math.round(distanceKm({ lat: s.lat, lng: s.lng }, city.cbd));
}
