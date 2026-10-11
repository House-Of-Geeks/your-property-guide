// The best-suburbs city editions: /best-suburbs/{category}/{city} for the
// eight greater capital cities (review of 30 Sep 2026, section 3.6, tracker
// item 22). Searchers name a city ("best suburbs to invest in brisbane" 320
// a month, "best suburbs in perth" 880) and the pages that rank give each
// suburb its own section, a method, a date and a FAQ; our nearest pages were
// state tables. Everything here is pure and tested in
// tests/lib/city-editions.test.ts; the queries are in
// src/lib/services/city-rankings-service.ts.
//
// Two rules carry over from the state rankings. A figure is printed only
// where the suburb's own page publishes it (src/lib/published-medians.ts):
// a median through the published-medians rule, a 12-month change only in
// the states whose feed measures one, a rent only from bond data, and never
// a 0 as a figure. And a page with nothing to rank says so, answers noindex
// and stays out of the sitemap: hasCityEdition is the one predicate the page
// and the city sitemap both read.
import type { MedianBasis } from "@/lib/published-medians";
import {
  GROWTH_RANKED_STATES,
  SALES_BASIS_BY_STATE,
  WALK_RANKED_UNCAPPED,
  WALK_SCORE_CAP,
  WALK_SCORE_DEFINITION,
  WALK_TIE_NOTE,
  isRanked,
  isTiedAtWalkCap,
  priceSourceLine,
  type RankingCategory,
} from "@/lib/ranking-notes";
import { rentalSourceLabel, monthYear } from "@/lib/rental-labels";
import { HOUSE_SCREEN_NOTE, coverageShortfall, meetsCoverageFloor, type Coverage } from "@/lib/median-coverage";
import { officialCityMedian, officialMedianSentence } from "@/lib/data/official-city-medians";
import type { CapitalCity } from "@/lib/utils/metro";
import { formatPriceFull } from "@/lib/utils/format";

export const CITY_EDITION_YEAR = 2026;

/**
 * The categories with a city edition. Not lowest-flood-risk: the hazard
 * table is empty in production (tracker item 49), so there is no data to
 * rank a city on.
 */
export const CITY_EDITION_CATEGORIES: readonly RankingCategory[] = [
  "best-rental-yield",
  "highest-growth",
  "for-families",
  "most-affordable",
  "most-walkable",
];

/** Ten suburbs, each with its own section. Fewer and the page is not an edition. */
export const CITY_EDITION_SIZE = 10;

/** Fetched with room for the "five more" and "under $500,000" sections. */
export const CITY_EDITION_POOL = 15;

/** A list with a section per suburb leaves out localities smaller than this. */
export const CITY_EDITION_MIN_POPULATION = 1000;

/** The budget the "under $500,000" section and the PAA answer use. */
export const CITY_EDITION_BUDGET = 500_000;

export function isCityEditionCategory(category: string): category is RankingCategory {
  return (CITY_EDITION_CATEGORIES as readonly string[]).includes(category);
}

/**
 * The categories ranked on a published median (price, change, yield). Their
 * pool must also clear the coverage floor (src/lib/median-coverage.ts): on
 * 10 Oct 2026 Brisbane's "ten cheapest" came from 17 suburbs, most of them
 * acreage (review of 10 Oct 2026, suburbs-market 0.2b).
 */
export const PRICE_RANKED_CATEGORIES: readonly RankingCategory[] = ["best-rental-yield", "highest-growth", "most-affordable"];

/** The edition's pool against the city's suburbs of 1,000 or more residents, or null where it was not counted. */
export function editionCoverage(e: Pick<CityEdition, "eligible" | "citySuburbs">): Coverage | null {
  return e.citySuburbs != null ? { pool: e.eligible, suburbs: e.citySuburbs } : null;
}

/**
 * Whether there is a city edition to publish: ten suburbs to show, in a
 * state the category can rank, and for a price ranking a pool that clears
 * the coverage floor. Below the floor the page says why and answers
 * noindex; when the medians return (QLD, NSW) it follows by itself. Read by
 * the page (robots, through isCityEditionIndexable) and by the city sitemap,
 * from the same query, so the sitemap lists exactly what the pages declare.
 */
export function hasCityEdition(category: RankingCategory, state: string, shown: number, coverage: Coverage | null = null): boolean {
  if (!isCityEditionCategory(category) || !isRanked(category, state) || shown < CITY_EDITION_SIZE) return false;
  if (PRICE_RANKED_CATEGORIES.includes(category)) return coverage != null && meetsCoverageFloor(coverage);
  return true;
}

/** Why there is no edition, for the page that says so; null when there is one. */
export function noEditionReason(e: CityEdition): string | null {
  const shown = top(e).length;
  const coverage = editionCoverage(e);
  if (hasCityEdition(e.category, e.city.state, shown, coverage)) return null;
  if (shown >= CITY_EDITION_SIZE && PRICE_RANKED_CATEGORIES.includes(e.category) && coverage) {
    return `${coverageShortfall(coverage, `Greater ${e.city.name}`)} Ten suburbs from so few would not stand for the city.`;
  }
  return `A city edition needs ${CITY_EDITION_SIZE} suburbs to show, and ${shown === 0 ? "none" : shown === 1 ? "only one" : `only ${shown}`} in Greater ${e.city.name} ${shown === 1 ? "qualifies" : "qualify"} on the rules below.`;
}

/**
 * Whether the edition goes in the index and the city sitemap: an edition to
 * show, on a measure that ranks. Not the walkable editions while the walk
 * score caps at 100 (src/lib/ranking-notes.ts): their top ten tie at the cap
 * and are listed alphabetically, which is not a ranking to put in search
 * (review of 10 Oct 2026, suburbs-market 0.1a). The page still renders.
 */
export function isCityEditionIndexable(category: RankingCategory, state: string, shown: number, coverage: Coverage | null = null): boolean {
  if (category === "most-walkable" && !WALK_RANKED_UNCAPPED) return false;
  return hasCityEdition(category, state, shown, coverage);
}

export function cityEditionPath(category: RankingCategory, citySlug: string): string {
  return `/best-suburbs/${category}/${citySlug}`;
}

// ── The rows ────────────────────────────────────────────────────────────────

export interface CityEditionSuburb {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  /** 0 when the suburb's page publishes no median. */
  medianHousePrice: number;
  medianUnitPrice: number;
  /** 0 when no 12-month change is published. */
  annualGrowthHouse: number;
  medianBasis: MedianBasis | null;
  population: number;
  householdsFamily: number;
  walkScore: number | null;
  avgSchoolIcsea: number | null;
  schoolCount: number;
  /** Weekly house rent from the suburb's latest bond-data row; 0 outside the yield edition. */
  medianRentHouse: number;
  rentPeriod: Date | null;
  rentSource: string | null;
  /** Only in the yield edition. */
  grossRentalYield: number | null;
  /** Straight line from the postcode centroid to the city's GPO; null without a centroid. */
  kmToCbd: number | null;
}

export interface CityEdition {
  category: RankingCategory;
  city: CapitalCity;
  /** Up to CITY_EDITION_POOL rows in ranking order; the first CITY_EDITION_SIZE are the edition. */
  suburbs: CityEditionSuburb[];
  /** Suburbs the ranking was drawn from. */
  eligible: number;
  /** The period the medians describe, from the sales feed ("calendar 2025", "2024"). */
  salesPeriod: string | null;
  /** Walkable only: eligible suburbs tied at the capped walk score of 100. */
  atCap?: number;
  /** Price rankings: the city's suburbs of 1,000 or more residents, for the coverage floor. */
  citySuburbs?: number | null;
}

/** The suburbs among the ten that tie at the capped walk score: unnumbered, alphabetical. */
export function tiedAtCap(e: Pick<CityEdition, "suburbs" | "category">): CityEditionSuburb[] {
  return e.category === "most-walkable" ? top(e).filter((s) => isTiedAtWalkCap(s.walkScore)) : [];
}

/** Whether a row carries a rank: not one tied at the walk-score cap. */
export function isNumbered(category: RankingCategory, s: CityEditionSuburb): boolean {
  return !(category === "most-walkable" && isTiedAtWalkCap(s.walkScore));
}

export const top = (e: Pick<CityEdition, "suburbs">) => e.suburbs.slice(0, CITY_EDITION_SIZE);
export const more = (e: Pick<CityEdition, "suburbs">) => e.suburbs.slice(CITY_EDITION_SIZE, CITY_EDITION_POOL);

/** The pool's suburbs with a published median under the budget, in ranking order. */
export function underBudget(e: Pick<CityEdition, "suburbs" | "category">, budget = CITY_EDITION_BUDGET): CityEditionSuburb[] {
  return e.suburbs.filter((s) => s.medianHousePrice > 0 && s.medianHousePrice < budget);
}

/** Only where the section says something the ten do not: the cheapest ten are the answer already. */
export function showUnderBudget(e: Pick<CityEdition, "suburbs" | "category">): boolean {
  return e.category !== "most-affordable" && underBudget(e).length >= 3;
}

// ── Titles and headings ─────────────────────────────────────────────────────

const CITY_TITLE: Record<RankingCategory, (city: string) => string> = {
  "best-rental-yield": (c) => `Best Suburbs to Invest in ${c} ${CITY_EDITION_YEAR}: Rental Yield`,
  "highest-growth": (c) => `Fastest Growing Suburbs in ${c} ${CITY_EDITION_YEAR}`,
  "for-families": (c) => `Best Suburbs for Families in ${c} ${CITY_EDITION_YEAR}`,
  "most-affordable": (c) => `Cheapest Suburbs in ${c} ${CITY_EDITION_YEAR}`,
  "most-walkable": (c) => `Most Walkable Suburbs in ${c} ${CITY_EDITION_YEAR}`,
  "lowest-flood-risk": (c) => `Lowest Flood Risk Suburbs in ${c} ${CITY_EDITION_YEAR}`,
};

/** The title, in the form people search ("best suburbs to invest in brisbane"). Under 60 characters before the brand suffix. */
export function cityEditionTitle(category: RankingCategory, city: Pick<CapitalCity, "name">): string {
  return CITY_TITLE[category](city.name);
}

/** The H1 is the title. */
export const cityEditionH1 = cityEditionTitle;

/** The short name of the list for breadcrumbs and links: "Rental yield", "Families". */
export const CITY_EDITION_LABEL: Record<RankingCategory, string> = {
  "best-rental-yield": "Rental yield",
  "highest-growth": "Fastest growing",
  "for-families": "For families",
  "most-affordable": "Cheapest",
  "most-walkable": "Most walkable",
  "lowest-flood-risk": "Lowest flood risk",
};

/** The link text a state page or hub prints for a city edition. */
export function cityEditionLinkLabel(category: RankingCategory, city: Pick<CapitalCity, "name">): string {
  switch (category) {
    case "best-rental-yield": return `Best suburbs to invest in ${city.name}`;
    case "highest-growth": return `Fastest growing suburbs in ${city.name}`;
    case "for-families": return `Best suburbs for families in ${city.name}`;
    case "most-affordable": return `Cheapest suburbs in ${city.name}`;
    case "most-walkable": return `Most walkable suburbs in ${city.name}`;
    default: return `${CITY_EDITION_LABEL[category]} suburbs in ${city.name}`;
  }
}

const DESCRIPTION_BUDGET = 160;

/** Joins names as "A, B and C". */
export function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/**
 * The meta description: what is ranked, on what, and the first names. No
 * figure, so it never promises one the page withholds. Names are dropped
 * from the end until it fits 160 characters.
 */
export function cityEditionDescription(e: Pick<CityEdition, "category" | "city" | "suburbs">): string {
  const c = e.city.name;
  const stem: Record<RankingCategory, string> = {
    "best-rental-yield": `Ten Greater ${c} suburbs ranked by gross rental yield on published medians and bond rents`,
    "highest-growth": `Ten Greater ${c} suburbs ranked by measured 12-month change in the published median house price`,
    "for-families": `Ten Greater ${c} suburbs ranked by school ICSEA, where family households are 40% or more of households`,
    "most-affordable": `Ten Greater ${c} suburbs ranked by lowest published median house price`,
    "most-walkable": `Greater ${c} suburbs by walk score, ties at the ${WALK_SCORE_CAP} cap listed alphabetically`,
    "lowest-flood-risk": `Ten Greater ${c} suburbs by flood risk`,
  };
  // More names first; the closing line goes before a name does.
  const tail = " Method, table and FAQ.";
  const names = top(e).map((s) => s.name);
  for (let k = Math.min(3, names.length); k >= 0; k--) {
    const list = k > 0 ? `: ${joinNames(names.slice(0, k))}.` : ".";
    for (const end of [tail, ""]) {
      const d = `${stem[e.category]}${list}${end}`;
      if (d.length <= DESCRIPTION_BUDGET) return d;
    }
  }
  return `${stem[e.category]}.`;
}

/** The direct answer under the H1: the ten, named. */
export function cityEditionLede(e: Pick<CityEdition, "category" | "city" | "suburbs"> & { atCap?: number; salesPeriod?: string | null }): string {
  const c = e.city.name;
  const list = joinNames(top(e).map((s) => s.name));
  switch (e.category) {
    case "best-rental-yield":
      return `By gross rental yield on the medians their own pages publish, the ten Greater ${c} suburbs that give an investor the most rent for the price are ${list}.`;
    case "highest-growth":
      return `By the measured 12-month change in the published median house price, the ten fastest growing Greater ${c} suburbs are ${list}.`;
    case "for-families":
      return `By the average ICSEA of their schools (ACARA), among Greater ${c} suburbs where family households are at least 40% of households (2021 Census), the ten that rank highest are ${list}.`;
    case "most-affordable":
      // The data period in the first sentence (review of 10 Oct 2026, 0.2c: Perth's are 2024 ABS medians).
      return `By published median house price${e.salesPeriod ? ` (medians for ${e.salesPeriod})` : ""}, the ten cheapest Greater ${c} suburbs are ${list}.`;
    case "most-walkable": {
      const tied = tiedAtCap(e);
      if (tied.length === 0) return `By walk score, the ten most walkable Greater ${c} suburbs are ${list}.`;
      const reach = e.atCap ?? tied.length;
      if (tied.length === top(e).length) {
        return `The walk score stops at ${WALK_SCORE_CAP}, and ${n(reach)} Greater ${c} suburbs of ${n(CITY_EDITION_MIN_POPULATION)} or more residents reach it, so it cannot rank them. Listed alphabetically, the first ten are ${list}.`;
      }
      const rest = top(e).filter((s) => !tied.includes(s));
      return `${joinNames(tied.map((s) => s.name))} ${tied.length === 1 ? "scores" : "all score"} the maximum walk score of ${WALK_SCORE_CAP}${tied.length === 1 ? "" : ", listed alphabetically"}; after ${tied.length === 1 ? "it" : "them"}, by walk score, come ${joinNames(rest.map((s) => s.name))}.`;
    }
    default:
      return `The ten Greater ${c} suburbs in this ranking are ${list}.`;
  }
}

// ── The method block ────────────────────────────────────────────────────────

const rangesText = (city: CapitalCity) =>
  city.ranges.map(([lo, hi]) => (lo === hi ? String(lo).padStart(4, "0") : `${String(lo).padStart(4, "0")} to ${String(hi).padStart(4, "0")}`)).join(", ");

const n = (v: number) => v.toLocaleString("en-AU");

function rentLine(e: CityEdition): string | null {
  const withRent = top(e).find((s) => s.medianRentHouse > 0);
  if (!withRent) return null;
  const label = rentalSourceLabel(withRent.rentSource) ?? "rental bond data";
  const period = withRent.rentPeriod ? `, ${monthYear(withRent.rentPeriod)} period` : "";
  return `Rent is the suburb's latest median house rent from ${label}${period}. Gross yield is that rent times 52, divided by the median house price; yields above 20% are left out as artefacts.`;
}

function growthLine(state: string): string {
  if (GROWTH_RANKED_STATES.includes(state)) {
    return "The 12-month change is measured on the same sales as the median. A change beyond 25% in a year is left out as a small-sample artefact.";
  }
  return SALES_BASIS_BY_STATE[state] === "area"
    ? "These ABS medians come without a 12-month change, so none is printed or ranked here."
    : "This feed publishes a median without a 12-month change, so none is printed or ranked here.";
}

/** The lines of "How we ranked them": what is ranked, the sources, the period, who is in, the distance. */
export function cityEditionMethod(e: CityEdition): string[] {
  const { category, city } = e;
  const state = city.state;
  const lines: string[] = [];
  // Never a 0 as a figure: a city with nothing qualifying names no count.
  const from = e.eligible > 0 ? `${n(e.eligible)} Greater ${city.name} suburbs` : `the Greater ${city.name} suburbs`;

  switch (category) {
    case "best-rental-yield":
      lines.push(`Ranked by gross rental yield, highest first, from ${from} with a published median, a bond-data rent and ${n(CITY_EDITION_MIN_POPULATION)} or more residents.`);
      break;
    case "highest-growth":
      lines.push(`Ranked by the 12-month change in the median house price, largest rise first, from ${from} with a published median, a measured change and ${n(CITY_EDITION_MIN_POPULATION)} or more residents.`);
      break;
    case "for-families":
      lines.push(`Ranked by the average ICSEA (ACARA's Index of Community Socio-Educational Advantage) of the schools we hold for each suburb, highest first, from ${from} where family households are at least 40% of households (2021 Census) and ${n(CITY_EDITION_MIN_POPULATION)} or more people live. A family household is any household with a family in it, so couples without children count: the share is not a count of households with children.`);
      break;
    case "most-affordable":
      lines.push(`Ranked by published median house price, lowest first, from ${from} with a published median above $100,000 and ${n(CITY_EDITION_MIN_POPULATION)} or more residents.`);
      lines.push(HOUSE_SCREEN_NOTE);
      {
        // The city-wide figure beside the suburb medians, where a government source publishes one (review 3.2).
        const official = officialCityMedian(city.slug);
        if (official) lines.push(`For context, ${officialMedianSentence(official).replace(/^./, (ch) => ch.toLowerCase())}: a median of every house sale, not of suburb medians.`);
      }
      break;
    case "most-walkable":
      lines.push(`Sorted by walk score, highest first, from ${from} with a walk score and ${n(CITY_EDITION_MIN_POPULATION)} or more residents. ${WALK_SCORE_DEFINITION}`);
      if (tiedAtCap(e).length > 0) lines.push(`${WALK_TIE_NOTE} They carry no rank number.`);
      break;
    default:
      break;
  }

  lines.push(`${priceSourceLine(state)}${e.salesPeriod ? ` The medians are for ${e.salesPeriod}.` : ""}`);
  const rent = category === "best-rental-yield" ? rentLine(e) : null;
  if (rent) lines.push(rent);
  lines.push(growthLine(state));
  if (category === "for-families" || category === "most-walkable") {
    lines.push("The price beside a suburb is the median its own page publishes; a dash means none is published.");
  }
  lines.push(`Greater ${city.name} is the suburbs in postcodes ${rangesText(city)}. Postal delivery names and institutions are left out.`);
  lines.push(`Distance to the CBD is a straight line from the suburb's postcode centroid to the ${city.name} GPO, rounded to the kilometre.`);
  return lines;
}

// ── Per-suburb copy ─────────────────────────────────────────────────────────

const ordinal = (i: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = i % 100;
  return `${i}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
};

/** "the highest", "the 2nd highest": rank 1 needs no number. */
export const rankPhrase = (rank: number, word: string) => (rank === 1 ? `the ${word}` : `the ${ordinal(rank)} ${word}`);

const WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
/** Counts up to ten in words, the way the copy reads them; larger counts in figures. */
export const countWord = (v: number) => WORDS[v] ?? n(v);
const icseaText = (v: number) => String(v);

function basisNote(s: CityEditionSuburb): string {
  return s.medianBasis === "area" ? " (the ABS statistical-area median for the area that carries its name)" : "";
}

function growthSentence(s: CityEditionSuburb): string {
  if (s.annualGrowthHouse === 0) return "";
  const dir = s.annualGrowthHouse > 0 ? "up" : "down";
  return ` The median is ${dir} ${Math.abs(s.annualGrowthHouse).toFixed(1)}% on a year earlier.`;
}

function populationSentence(s: CityEditionSuburb, withFamilies: boolean): string {
  if (!(s.population > 0)) return "";
  const fam = withFamilies && s.householdsFamily > 0 ? `, and family households are ${s.householdsFamily.toFixed(0)}% of households` : "";
  return ` ${n(s.population)} people lived there at the 2021 Census${fam}.`;
}

function priceSentence(s: CityEditionSuburb): string {
  if (!(s.medianHousePrice > 0)) return " No house median is published for it yet.";
  return ` The median house price is ${formatPriceFull(s.medianHousePrice)}${basisNote(s)}.${growthSentence(s)}`;
}

const distanceClause = (s: CityEditionSuburb, city: Pick<CapitalCity, "name">) =>
  s.kmToCbd != null ? ` is about ${n(s.kmToCbd)} km from the ${city.name} CBD` : "";

/** One paragraph per suburb, built from its figures and nothing else. */
export function suburbParagraph(e: Pick<CityEdition, "category" | "city"> & { atCap?: number }, s: CityEditionSuburb, rank: number): string {
  const city = e.city;
  const where = distanceClause(s, city);
  const opener = `${s.name} (${s.postcode})${where || " is in Greater " + city.name}.`;

  switch (e.category) {
    case "best-rental-yield": {
      const label = rentalSourceLabel(s.rentSource) ?? "bond data";
      const y = s.grossRentalYield != null ? ` a gross yield of ${s.grossRentalYield.toFixed(1)}%, ${rankPhrase(rank, "highest")} in Greater ${city.name}` : "";
      return `${opener} The median house price is ${formatPriceFull(s.medianHousePrice)}${basisNote(s)} and the latest median house rent from ${label} is $${n(s.medianRentHouse)} a week,${y}.${growthSentence(s)}${populationSentence(s, false)}`;
    }
    case "highest-growth": {
      const dir = s.annualGrowthHouse > 0 ? "rose" : "fell";
      return `${opener} The median house price ${dir} ${Math.abs(s.annualGrowthHouse).toFixed(1)}% over 12 months to ${formatPriceFull(s.medianHousePrice)}, ${rankPhrase(rank, "largest rise")} in Greater ${city.name}, measured on the same sales as the median.${populationSentence(s, false)}`;
    }
    case "for-families": {
      const held = s.schoolCount === 1
        ? "The one school we hold for the suburb has an ICSEA of"
        : `The ${countWord(s.schoolCount)} schools we hold for the suburb average an ICSEA of`;
      const schools = s.avgSchoolIcsea != null
        ? ` ${held} ${icseaText(s.avgSchoolIcsea)} (ACARA), ${rankPhrase(rank, "highest")} in Greater ${city.name} among suburbs where family households are at least 40% of households.`
        : "";
      const fam = s.householdsFamily > 0 ? ` Family households are ${s.householdsFamily.toFixed(0)}% of households.` : "";
      return `${opener}${schools}${fam}${priceSentence(s)}${populationSentence(s, false)}`;
    }
    case "most-affordable": {
      return `${opener} The median house price is ${formatPriceFull(s.medianHousePrice)}${basisNote(s)}, ${rankPhrase(rank, "lowest")} published median in Greater ${city.name}.${growthSentence(s)}${s.walkScore != null && s.walkScore > 0 ? ` Walk score ${s.walkScore} out of 100.` : ""}${populationSentence(s, true)}`;
    }
    case "most-walkable": {
      const what = "a count of the shops and services mapped within 1 km of its postcode centroid";
      if (isTiedAtWalkCap(s.walkScore)) {
        const others = e.atCap != null && e.atCap > 1 ? `, shared with ${n(e.atCap - 1)} other Greater ${city.name} ${e.atCap - 1 === 1 ? "suburb" : "suburbs"}` : "";
        return `${opener} Its walk score is ${WALK_SCORE_CAP} out of ${WALK_SCORE_CAP}, the maximum${others}: ${what}, which stops counting at ${WALK_SCORE_CAP}.${priceSentence(s)}${populationSentence(s, false)}`;
      }
      return `${opener} Its walk score is ${s.walkScore ?? 0} out of ${WALK_SCORE_CAP}, ${rankPhrase(rank, "highest")} in Greater ${city.name}: ${what}.${priceSentence(s)}${populationSentence(s, false)}`;
    }
    default:
      return opener;
  }
}

/** The one figure the ranking is on, for the ItemList description and the "five more" lines. */
export function metricSummary(category: RankingCategory, s: CityEditionSuburb): string | undefined {
  switch (category) {
    case "best-rental-yield":
      return s.grossRentalYield != null ? `Gross yield ${s.grossRentalYield.toFixed(1)}%, median ${formatPriceFull(s.medianHousePrice)}, rent $${n(s.medianRentHouse)} a week` : undefined;
    case "highest-growth":
      return s.annualGrowthHouse !== 0 ? `${s.annualGrowthHouse > 0 ? "+" : ""}${s.annualGrowthHouse.toFixed(1)}% in 12 months, median ${formatPriceFull(s.medianHousePrice)}` : undefined;
    case "for-families":
      return s.avgSchoolIcsea != null ? `Average school ICSEA ${icseaText(s.avgSchoolIcsea)}, family households ${s.householdsFamily.toFixed(0)}% of households` : undefined;
    case "most-affordable":
      return s.medianHousePrice > 0 ? `Median house price ${formatPriceFull(s.medianHousePrice)}` : undefined;
    case "most-walkable":
      return s.walkScore != null ? `Walk score ${s.walkScore} out of 100` : undefined;
    default:
      return undefined;
  }
}

// ── FAQ: the People Also Ask questions, answered from the data ──────────────
//
// Never a prediction. "What suburbs will boom?" gets what the data shows:
// where a 12-month change is measured, the largest; where it is not, that we
// hold none, and why.

export interface CityFaq {
  question: string;
  answer: string;
}

const STATE_FULL: Record<string, string> = {
  NSW: "New South Wales", VIC: "Victoria", QLD: "Queensland", WA: "Western Australia",
  SA: "South Australia", TAS: "Tasmania", NT: "the Northern Territory", ACT: "the ACT",
};

const withFigure = (s: CityEditionSuburb, f: (s: CityEditionSuburb) => string) => `${s.name} (${f(s)})`;

function boomAnswer(e: CityEdition): CityFaq {
  const { city } = e;
  const stateName = STATE_FULL[city.state] ?? city.state;
  const question = `Which suburbs will boom in ${city.name} in ${CITY_EDITION_YEAR}?`;
  if (GROWTH_RANKED_STATES.includes(city.state)) {
    const rows = e.category === "highest-growth" ? top(e).slice(0, 3) : [...top(e)].filter((s) => s.annualGrowthHouse !== 0).sort((a, b) => b.annualGrowthHouse - a.annualGrowthHouse).slice(0, 3);
    const list = rows.length
      ? ` Among the suburbs on this page, the largest measured rises over the last 12 months were ${joinNames(rows.map((s) => withFigure(s, (r) => `${r.annualGrowthHouse > 0 ? "+" : ""}${r.annualGrowthHouse.toFixed(1)}%`)))}.`
      : "";
    return {
      question,
      answer: `We do not predict which suburbs will boom, and a rise over the last 12 months says what happened, not what will. What we can show is measured.${list} The change is the 12-month movement in the median house price on the same sales as the median${e.salesPeriod ? `, for ${e.salesPeriod}` : ""}, and a change beyond 25% is left out as a small-sample artefact. The ${city.state} growth ranking, linked below, lists every suburb with a measured change.`,
    };
  }
  return {
    question,
    answer: `We do not predict which suburbs will boom, and we hold no growth figure to rank ${city.name} suburbs on: the medians we publish for ${stateName} are ${SALES_BASIS_BY_STATE[city.state] === "area" ? "ABS statistical-area (SA2) medians" : "quarterly medians"}${e.salesPeriod ? ` for ${e.salesPeriod}` : ""}, and they come without a 12-month change. A figure beside a suburb here is a median, a rent, a yield, a walk score or a school ICSEA, each measured and sourced, never a forecast. Each suburb's own page shows its published median and says where it comes from.`,
  };
}

function budgetAnswer(e: CityEdition): CityFaq {
  const { city, category } = e;
  const budget = formatPriceFull(CITY_EDITION_BUDGET);
  const cheap = underBudget(e);
  const what: Record<RankingCategory, string> = {
    "best-rental-yield": "to invest in",
    "highest-growth": "that are growing",
    "for-families": "for families",
    "most-affordable": "",
    "most-walkable": "that are walkable",
    "lowest-flood-risk": "",
  };
  const question = category === "most-affordable"
    ? `Where can I buy a house in ${city.name} for under ${budget}?`
    : `What are the best suburbs in ${city.name} ${what[category]} for ${budget} or less?`.replace("  ", " ");
  if (cheap.length === 0) {
    const priced = e.suburbs.filter((s) => s.medianHousePrice > 0).sort((a, b) => a.medianHousePrice - b.medianHousePrice);
    const lowest = priced[0];
    // The cheapest list is ranked lowest first over every eligible suburb, so its first row is the city's lowest.
    const scope = category === "most-affordable"
      ? `No Greater ${city.name} suburb of ${n(CITY_EDITION_MIN_POPULATION)} or more residents has a published median house price under ${budget}.`
      : `None of the ${n(e.suburbs.length)} Greater ${city.name} suburbs at the top of this ranking has a published median house price under ${budget}.`;
    return {
      question,
      answer: `${scope}${lowest ? ` The lowest ${category === "most-affordable" ? "" : "among them "}is ${lowest.name} at ${formatPriceFull(lowest.medianHousePrice)}${basisNote(lowest)}.` : ""} ${priceSourceLine(city.state)} A median is the middle sale, so some houses in these suburbs sold for less than it.`,
    };
  }
  const list = joinNames(cheap.map((s) => withFigure(s, (r) => formatPriceFull(r.medianHousePrice))));
  const metric = category === "best-rental-yield"
    ? ` Their gross yields run from ${Math.min(...cheap.map((s) => s.grossRentalYield ?? 0)).toFixed(1)}% to ${Math.max(...cheap.map((s) => s.grossRentalYield ?? 0)).toFixed(1)}%.`
    : "";
  return {
    question,
    answer: `Of the ${n(e.suburbs.length)} Greater ${city.name} suburbs at the top of this ranking, ${cheap.length === 1 ? "one has" : `${countWord(cheap.length)} have`} a published median house price under ${budget}: ${list}.${metric} ${priceSourceLine(city.state)} A median is the middle sale, so half of a suburb's houses sold for less than it.`,
  };
}

function topThreeAnswer(e: CityEdition): CityFaq {
  const { city, category } = e;
  const rows = top(e).slice(0, 3);
  switch (category) {
    case "best-rental-yield":
      return {
        question: `Which ${city.name} suburbs have the highest rental yields?`,
        answer: `On the medians their own pages publish and their latest bond-data rents, the highest gross rental yields in Greater ${city.name} are in ${joinNames(rows.map((s) => withFigure(s, (r) => `${r.grossRentalYield?.toFixed(1)}%`)))}. Gross yield is the median weekly house rent times 52 divided by the median house price, so it counts none of the costs of holding a property; net yield is usually one to one and a half percentage points lower. The ranking is drawn from ${n(e.eligible)} suburbs.`,
      };
    case "highest-growth":
      return {
        question: `Which ${city.name} suburbs grew fastest in the last 12 months?`,
        answer: `By the measured 12-month change in the median house price, the largest rises in Greater ${city.name} were in ${joinNames(rows.map((s) => withFigure(s, (r) => `+${r.annualGrowthHouse.toFixed(1)}% to ${formatPriceFull(r.medianHousePrice)}`)))}. ${priceSourceLine(city.state)} A change beyond 25% in a year is left out as a small-sample artefact, and the ranking is drawn from ${n(e.eligible)} suburbs with a measured change.`,
      };
    case "for-families":
      return {
        question: `What are the best suburbs in ${city.name} for families?`,
        answer: `By the average ICSEA of their schools, among Greater ${city.name} suburbs where family households (couples without children included) are at least 40% of households, the top three are ${joinNames(rows.map((s) => withFigure(s, (r) => `ICSEA ${icseaText(r.avgSchoolIcsea ?? 0)}`)))}. ICSEA is ACARA's index of the socio-educational backgrounds of a school's students, published for every Australian school; it is a proxy for resourcing and outcomes, not a measure of teaching, so check the in-catchment school for an address before buying. The ranking is drawn from ${n(e.eligible)} suburbs.`,
      };
    case "most-affordable":
      return {
        question: `What are the cheapest suburbs in ${city.name}?`,
        answer: `By published median house price, the cheapest Greater ${city.name} suburbs of ${n(CITY_EDITION_MIN_POPULATION)} or more residents are ${joinNames(rows.map((s) => withFigure(s, (r) => formatPriceFull(r.medianHousePrice))))}. ${priceSourceLine(city.state)} A suburb is listed only when its own page publishes the median, and the ranking is drawn from ${n(e.eligible)} suburbs with one.`,
      };
    case "most-walkable": {
      const tied = tiedAtCap(e);
      const lead = tied.length === top(e).length && tied.length > 0
        ? `The walk score cannot say: ${n(e.atCap ?? tied.length)} Greater ${city.name} suburbs of ${n(CITY_EDITION_MIN_POPULATION)} or more residents score the maximum of ${WALK_SCORE_CAP}, and the score stops there. Listed alphabetically, the first three are ${joinNames(rows.map((s) => s.name))}.`
        : `By walk score, the most walkable Greater ${city.name} suburbs of ${n(CITY_EDITION_MIN_POPULATION)} or more residents are ${joinNames(rows.map((s) => withFigure(s, (r) => `${r.walkScore} out of ${WALK_SCORE_CAP}`)))}${tied.length > 0 ? `; those at ${WALK_SCORE_CAP} are tied and listed alphabetically` : ""}.`;
      return {
        question: `Which are the most walkable suburbs in ${city.name}?`,
        answer: `${lead} ${WALK_SCORE_DEFINITION} It counts places, not footpaths, transport or hills. The list is drawn from ${n(e.eligible)} suburbs with a score.`,
      };
    }
    default:
      return { question: `Which are the best suburbs in ${city.name}?`, answer: cityEditionLede(e) };
  }
}

function undervaluedAnswer(e: CityEdition): CityFaq {
  const { city } = e;
  const priced = top(e).filter((s) => s.medianHousePrice > 0);
  const lowest = [...priced].sort((a, b) => a.medianHousePrice - b.medianHousePrice)[0];
  const highest = [...priced].sort((a, b) => b.medianHousePrice - a.medianHousePrice)[0];
  const range = lowest && highest && lowest !== highest
    ? ` Among the ten on this page the published medians run from ${formatPriceFull(lowest.medianHousePrice)} in ${lowest.name} to ${formatPriceFull(highest.medianHousePrice)} in ${highest.name}.`
    : "";
  const lead = top(e)[0];
  const led = lead?.grossRentalYield != null ? `, led by ${lead.name} at ${lead.grossRentalYield.toFixed(1)}% gross` : "";
  return {
    question: `Which ${city.name} suburbs are undervalued?`,
    answer: `We do not label a suburb undervalued: that is a judgement about the future, and this page prints only what is measured. A high gross yield means the rent is high relative to the price, which is the nearest measured thing to it, and the ten suburbs above are where that ratio is highest among the ${n(e.eligible)} Greater ${city.name} suburbs with a published median and a bond-data rent${led}.${range} Whether a price is low for what it buys depends on the street, the block and the house, so read the suburb's own page and the sales it lists.`,
  };
}

function avoidAnswer(e: CityEdition): CityFaq {
  const { city } = e;
  return {
    question: `What suburbs should I stay away from in ${city.name}?`,
    answer: `We do not publish a list of suburbs to avoid. This page ranks suburbs for families on measured figures, and a suburb missing from it may simply have no school with an ICSEA we hold, a family-household share under 40% of households or fewer than ${n(CITY_EDITION_MIN_POPULATION)} residents. Each suburb's own page shows its crime figures where the state publishes them and its rents and sales, so check those for the address you are looking at rather than the suburb's reputation.`,
  };
}

function priceRangeAnswer(e: CityEdition): CityFaq {
  const { city, category } = e;
  const priced = top(e).filter((s) => s.medianHousePrice > 0).sort((a, b) => a.medianHousePrice - b.medianHousePrice);
  const what = category === "for-families" ? "the top family suburbs" : "the most walkable suburbs";
  if (priced.length === 0) {
    return {
      question: `How much does a house cost in ${what} in ${city.name}?`,
      answer: `None of the ten suburbs on this page has a published median house price yet. ${priceSourceLine(city.state)} A suburb's median is withheld where its source is a census proxy or where fewer than five sales were recorded, so a dash in the table means no figure, not a cheap one. Each suburb's own page says which, and lists the sales it holds.`,
    };
  }
  const lo = priced[0];
  const hi = priced[priced.length - 1];
  return {
    question: `How much does a house cost in ${what} in ${city.name}?`,
    answer: `${priced.length === 10 ? "All ten" : `${countWord(priced.length).replace(/^./, (c) => c.toUpperCase())} of the ten`} suburbs on this page ${priced.length === 1 ? "has" : "have"} a published median house price, from ${formatPriceFull(lo.medianHousePrice)} in ${lo.name}${lo !== hi ? ` to ${formatPriceFull(hi.medianHousePrice)} in ${hi.name}` : ""}. ${priceSourceLine(city.state)} A dash in the table means the suburb's own page publishes no median, because its source is distrusted or it rests on fewer than five recorded sales.`,
  };
}

function growthOfCheapAnswer(e: CityEdition): CityFaq {
  const { city } = e;
  const moved = top(e).filter((s) => s.annualGrowthHouse !== 0);
  if (!GROWTH_RANKED_STATES.includes(city.state) || moved.length === 0) {
    return {
      question: `Are ${city.name}'s cheapest suburbs rising in price?`,
      answer: `${growthLine(city.state)} ${priceSourceLine(city.state)} So this page cannot say whether the cheapest suburbs rose or fell over the last year; it ranks them on the level of the median alone. The suburb pages keep each median as it is republished, which is the honest way to follow a cheap suburb's price over time.`,
    };
  }
  const up = moved.filter((s) => s.annualGrowthHouse > 0).length;
  const sorted = [...moved].sort((a, b) => b.annualGrowthHouse - a.annualGrowthHouse);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  return {
    question: `Are ${city.name}'s cheapest suburbs rising in price?`,
    answer: `Of the ten cheapest Greater ${city.name} suburbs, ${moved.length === 10 ? "all ten have" : moved.length === 1 ? "one has" : `${countWord(moved.length)} have`} a measured 12-month change and ${countWord(up)} of ${moved.length === 1 ? "it" : "those"} rose. The largest rise was ${best.name} at +${best.annualGrowthHouse.toFixed(1)}%${worst !== best ? `, and the weakest was ${worst.name} at ${worst.annualGrowthHouse > 0 ? "+" : ""}${worst.annualGrowthHouse.toFixed(1)}%` : ""}. The change is measured on the same sales as the median${e.salesPeriod ? ` for ${e.salesPeriod}` : ""}, and a change beyond 25% is left out as a small-sample artefact.`,
  };
}

function yieldGoodAnswer(e: CityEdition): CityFaq {
  const { city } = e;
  const ys = top(e).map((s) => s.grossRentalYield).filter((y): y is number => y != null);
  const lo = Math.min(...ys).toFixed(1);
  const hi = Math.max(...ys).toFixed(1);
  return {
    question: `Is a ${lo}% rental yield good in ${city.name}?`,
    answer: `The ten suburbs on this page yield between ${lo}% and ${hi}% gross, the ten highest of the ${n(e.eligible)} Greater ${city.name} suburbs with a published median and a bond-data rent. Gross yield leaves out council rates, insurance, management fees, maintenance and vacancy, which together usually take one to one and a half percentage points off it, and a high yield often goes with slower capital growth. Run the net figure on the rental yield calculator before deciding.`,
  };
}

function walkPriceAnswer(e: CityEdition): CityFaq {
  return priceRangeAnswer(e);
}

/** The FAQ for a city edition: the People Also Ask questions of the target queries, answered from the rows. */
export function cityEditionFaqs(e: CityEdition): CityFaq[] {
  switch (e.category) {
    case "best-rental-yield":
      return [topThreeAnswer(e), budgetAnswer(e), undervaluedAnswer(e), boomAnswer(e), yieldGoodAnswer(e)];
    case "highest-growth":
      return [topThreeAnswer(e), boomAnswer(e), budgetAnswer(e)];
    case "for-families":
      return [topThreeAnswer(e), priceRangeAnswer(e), avoidAnswer(e), boomAnswer(e)];
    case "most-affordable":
      return [topThreeAnswer(e), budgetAnswer(e), growthOfCheapAnswer(e), boomAnswer(e)];
    case "most-walkable":
      return [topThreeAnswer(e), walkPriceAnswer(e), boomAnswer(e)];
    default:
      return [];
  }
}
