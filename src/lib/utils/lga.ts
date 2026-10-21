import { fullLgaName } from "@/lib/utils/lga-names";

// Pure helpers over Suburb.region, which holds the LGA short name ("Ipswich",
// "Lake Macquarie", "Scenic Rim") from the database. Everything on the suburb
// template that names the council derives from it, so a corrected row
// corrects the page.

const STATE_CODES = new Set(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"]);
const STATE_FULL_NAMES = new Set([
  "new south wales",
  "victoria",
  "queensland",
  "south australia",
  "western australia",
  "tasmania",
  "northern territory",
  "australian capital territory",
]);

/** The full council name: "Ipswich" -> "Ipswich City Council". */
export function lgaCouncilName(region: string): string {
  return fullLgaName(region);
}

/** The place name for schema: "X City Council" -> "City of X", "X Regional Council" -> "X Region", "X Shire Council" -> "Shire of X", "X Council" -> "X". */
export function lgaPlaceName(region: string): string {
  const council = lgaCouncilName(region);
  let m = /^(.+) City Council$/.exec(council);
  if (m) return `City of ${m[1]}`;
  m = /^(.+) Regional Council$/.exec(council);
  if (m) return `${m[1]} Region`;
  m = /^(.+) Shire Council$/.exec(council);
  if (m) return `Shire of ${m[1]}`;
  m = /^(.+) Council$/.exec(council);
  if (m) return m[1];
  return council;
}

function normaliseCouncil(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/^city of\s+/, "")
    .replace(/\s+(city\s+council|council|city)$/, "")
    .trim();
}

/** True when the LGA is the capital's own council ("Brisbane" or "Brisbane City" for capital "Brisbane"). */
export function isCapitalCouncil(region: string, capital: { name: string }): boolean {
  if (!region) return false;
  return normaliseCouncil(region) === normaliseCouncil(capital.name);
}

/** True when region names a real LGA: not empty, not a state code and not a state's full name. */
export function hasLga(suburb: { region?: string | null }): boolean {
  const region = (suburb.region ?? "").trim();
  if (!region) return false;
  if (STATE_CODES.has(region.toUpperCase())) return false;
  if (STATE_FULL_NAMES.has(region.toLowerCase())) return false;
  return true;
}

/** The area phrase for meta text: "Greater Brisbane", "the Ipswich City Council area", or null. */
export function regionPhrase(
  suburb: { region?: string | null },
  capital: { name: string } | null,
): string | null {
  const lga = hasLga(suburb);
  if (capital && (!lga || isCapitalCouncil(suburb.region as string, capital))) return `Greater ${capital.name}`;
  if (lga) return `the ${lgaCouncilName(suburb.region as string)} area`;
  return null;
}

const STATE_SCHEMA_NAMES: Record<string, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  SA: "South Australia",
  WA: "Western Australia",
  TAS: "Tasmania",
  NT: "Northern Territory",
  ACT: "Australian Capital Territory",
};

/** The full state name for schema ("QLD" -> "Queensland"); the code itself when unknown. */
export function stateSchemaName(state: string): string {
  return STATE_SCHEMA_NAMES[state.toUpperCase()] ?? state;
}

/** The geo, council and state props PlaceJsonLd takes for one suburb. The council only when region names a real LGA. */
export function suburbPlaceProps(suburb: {
  region?: string | null;
  state: string;
  lat?: number | null;
  lng?: number | null;
}) {
  return {
    latitude: suburb.lat,
    longitude: suburb.lng,
    lgaName: hasLga(suburb) ? lgaPlaceName(suburb.region as string) : undefined,
    stateName: stateSchemaName(suburb.state),
  };
}
