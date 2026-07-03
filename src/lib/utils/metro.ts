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
}

export const CAPITAL_CITIES: CapitalCity[] = [
  {
    slug: "sydney",
    name: "Sydney",
    state: "NSW",
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
    ranges: [
      [6000, 6175], // metro core to Rockingham/Armadale
      [6210, 6210], // Mandurah (Greater Perth GCCSA)
    ],
  },
  {
    slug: "adelaide",
    name: "Adelaide",
    state: "SA",
    ranges: [[5000, 5174]],
  },
  {
    slug: "hobart",
    name: "Hobart",
    state: "TAS",
    ranges: [
      [7000, 7055], // Hobart, Glenorchy, Kingborough
      [7170, 7173], // Clarence east
    ],
  },
  {
    slug: "canberra",
    name: "Canberra",
    state: "ACT",
    ranges: [
      [2600, 2620],
      [2900, 2914],
    ],
  },
  {
    slug: "darwin",
    name: "Darwin",
    state: "NT",
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
