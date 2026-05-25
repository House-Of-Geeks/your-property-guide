// Algorithmic narrative generator for suburb profile pages.
//
// Turns the structured Suburb data we hold (median price, growth,
// demographics, climate, walkability, schools, etc.) into multi-paragraph
// reading copy.  Output is deterministic — same input always produces the
// same text — so it caches cleanly under ISR.
//
// Variation comes from the data itself: a $2M suburb with 1% growth and
// 85% owner-occupiers reads very differently from a $400k suburb with
// 12% growth and 60% renters, even though both pages run through the
// same templates.

import type { Suburb } from "@/types";
import { hasReliablePrice } from "./suburb-data-quality";

// ─── State-level reference baselines ──────────────────────────────────
// Indicative all-suburb medians per state, as of 2026.  Used for
// comparative phrases like "above the QLD median".  Hardcoded for now;
// we can compute these from the live dataset later if we want them to
// move with the market.

interface StateBaseline {
  fullName: string;
  medianHousePrice: number;     // AUD
  medianRent: number;           // AUD/week
  annualGrowth: number;         // percent
  daysOnMarket: number;
}

const STATE_BASELINES: Record<string, StateBaseline> = {
  NSW: { fullName: "NSW",                          medianHousePrice: 1_100_000, medianRent: 700, annualGrowth: 3.0, daysOnMarket: 32 },
  VIC: { fullName: "Victoria",                     medianHousePrice:   850_000, medianRent: 560, annualGrowth: 1.5, daysOnMarket: 35 },
  QLD: { fullName: "Queensland",                   medianHousePrice:   780_000, medianRent: 600, annualGrowth: 6.0, daysOnMarket: 28 },
  WA:  { fullName: "Western Australia",            medianHousePrice:   720_000, medianRent: 650, annualGrowth: 8.0, daysOnMarket: 22 },
  SA:  { fullName: "South Australia",              medianHousePrice:   720_000, medianRent: 560, annualGrowth: 5.0, daysOnMarket: 30 },
  TAS: { fullName: "Tasmania",                     medianHousePrice:   650_000, medianRent: 520, annualGrowth: 2.0, daysOnMarket: 40 },
  ACT: { fullName: "the ACT",                      medianHousePrice:   950_000, medianRent: 670, annualGrowth: 1.0, daysOnMarket: 30 },
  NT:  { fullName: "the Northern Territory",       medianHousePrice:   520_000, medianRent: 600, annualGrowth: 2.0, daysOnMarket: 45 },
};

function baselineFor(state: string): StateBaseline {
  return STATE_BASELINES[state] ?? STATE_BASELINES.NSW;
}

// ─── Tiny formatters ──────────────────────────────────────────────────

function formatPrice(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return m >= 10 ? `$${Math.round(m)}M` : `$${m.toFixed(m >= 2 ? 2 : 2)}M`;
  }
  return `$${Math.round(value / 1_000)}K`;
}

function formatPricePrecise(value: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(value);
}

function formatPercent(value: number, signed = false): string {
  const rounded = Math.round(value * 10) / 10;
  const prefix = signed && rounded > 0 ? "+" : "";
  return `${prefix}${rounded}%`;
}

// ─── Comparative phrasing ─────────────────────────────────────────────
// Returns a band-based descriptor for how a value compares to a baseline.
// Bands are coarse on purpose, so the resulting prose reads naturally.

function priceComparePhrase(price: number, baseline: number): { phrase: string; ratio: number } {
  if (price <= 0 || baseline <= 0) return { phrase: "", ratio: 1 };
  const ratio = price / baseline;
  if (ratio < 0.6)  return { phrase: "well below",   ratio };
  if (ratio < 0.85) return { phrase: "below",        ratio };
  if (ratio < 1.15) return { phrase: "in line with", ratio };
  if (ratio < 1.5)  return { phrase: "above",        ratio };
  return                  { phrase: "well above",    ratio };
}

function growthDescriptor(growth: number): { phrase: string; tone: "strong" | "moderate" | "flat" | "declining" } {
  if (growth >= 8)  return { phrase: "strong growth",            tone: "strong" };
  if (growth >= 3)  return { phrase: "steady growth",            tone: "moderate" };
  if (growth >= 0)  return { phrase: "flat performance",         tone: "flat" };
  return                   { phrase: "a softening market",       tone: "declining" };
}

function tenureDescriptor(ownerOccupied: number): string {
  if (ownerOccupied >= 75) return "predominantly owner-occupied";
  if (ownerOccupied >= 60) return "mostly owner-occupied";
  if (ownerOccupied >= 45) return "a roughly even mix of owners and renters";
  if (ownerOccupied >= 30) return "renter-heavy";
  return "dominated by renters";
}

function ageDescriptor(medianAge: number): string {
  if (medianAge <= 28) return "a young, transient demographic";
  if (medianAge <= 34) return "a young-family demographic";
  if (medianAge <= 42) return "a typical family-age mix";
  if (medianAge <= 50) return "an established, older skew";
  return "a retiree-heavy demographic";
}

function walkScoreDescriptor(score: number): { phrase: string; livingMode: "walkable" | "balanced" | "car-dependent" } {
  if (score >= 70) return { phrase: "very walkable",         livingMode: "walkable" };
  if (score >= 50) return { phrase: "somewhat walkable",     livingMode: "balanced" };
  if (score >= 25) return { phrase: "car-friendly",          livingMode: "car-dependent" };
  return                  { phrase: "car-dependent",         livingMode: "car-dependent" };
}

// ─── Yield calculation ────────────────────────────────────────────────

function calcGrossYield(rentPerWeek: number, price: number): number {
  if (!rentPerWeek || !price) return 0;
  return ((rentPerWeek * 52) / price) * 100;
}

// ─── Heuristic: is the stored description an auto-stub? ───────────────
// The importers generate descriptions like "Bondi is a suburb in NSW."
// We detect those and replace with our generated intro; longer curated
// descriptions are kept as-is.

export function isAutoStubDescription(description: string | undefined, name: string): boolean {
  if (!description) return true;
  const trimmed = description.trim();
  if (trimmed.length < 120) return true;
  // Defensive: stub patterns from both importers
  const stubPattern = new RegExp(`^${name}\\s+is\\s+a\\s+suburb\\s+in`, "i");
  if (stubPattern.test(trimmed)) return true;
  return false;
}

// ─── Narrative builders ───────────────────────────────────────────────
//
// Each builder returns either a string (paragraph) or string[] (multi-
// paragraph), depending on how much it has to say.  The page template
// decides which builders to call.

/** 2-paragraph intro suitable for the "About" section hero. */
export function buildIntro(suburb: Suburb): string[] {
  const s = suburb.stats;
  const baseline = baselineFor(suburb.state);
  const stateName = baseline.fullName;
  // Only make price claims for suburbs where the underlying data is
  // trustworthy (NSW/VIC/SA real sales feeds, or ABS annual SA2). For
  // suburbs backed by the census-mortgage proxy we suppress the
  // price+growth sentences entirely rather than publish fiction.
  const priceOk = hasReliablePrice(suburb);

  // Sentence 1: location anchor.
  const region = suburb.region && suburb.region !== suburb.state ? `${suburb.region} region of ${stateName}` : stateName;
  const para1Parts: string[] = [];
  para1Parts.push(`${suburb.name} (${suburb.postcode}) sits in the ${region}.`);

  // Sentence 2: market position vs state median.
  if (priceOk) {
    const cmp = priceComparePhrase(s.medianHousePrice, baseline.medianHousePrice);
    para1Parts.push(
      `The median house here is ${formatPricePrecise(s.medianHousePrice)}, ${cmp.phrase} the ${stateName} median of around ${formatPrice(baseline.medianHousePrice)}.`,
    );
  }

  // Sentence 3: growth signal vs state baseline. Skipped when price
  // confidence is low — if we don't trust the median, we can't trust
  // the growth percentage either (it's derived from the same proxy).
  if (priceOk && s.annualGrowthHouse !== 0) {
    const gap = s.annualGrowthHouse - baseline.annualGrowth;
    const vsState =
      gap >= 3   ? "well clear of"
      : gap >= 1 ? "ahead of"
      : gap >= -1 ? "in line with"
      : gap >= -3 ? "behind"
      :             "well behind";
    para1Parts.push(
      `Prices have moved ${formatPercent(s.annualGrowthHouse, true)} over the past year, ${vsState} the ${stateName} average (${formatPercent(baseline.annualGrowth)}).`,
    );
  }

  const para1 = para1Parts.join(" ");

  // Paragraph 2: lifestyle + who lives here, woven together.
  const para2Parts: string[] = [];
  if (s.population > 0) {
    const tenure = tenureDescriptor(s.ownerOccupied || 0);
    const age = ageDescriptor(s.medianAge || 35);
    para2Parts.push(
      `${suburb.name} has roughly ${s.population.toLocaleString("en-AU")} residents, with ${age}. Households are ${tenure}.`,
    );
  }
  if (s.walkScore !== null && s.walkScore !== undefined) {
    const w = walkScoreDescriptor(s.walkScore);
    if (w.livingMode === "walkable") {
      para2Parts.push(`Day-to-day life here is ${w.phrase}, with most errands manageable on foot.`);
    } else if (w.livingMode === "balanced") {
      para2Parts.push(`The area is ${w.phrase} for a typical errand run, but a car still helps for grocery runs and weekend trips.`);
    } else {
      para2Parts.push(`Daily life is ${w.phrase}: most residents drive to work, school and the shops.`);
    }
  }
  // Days-on-market is also derived from the sales feed, so it's only
  // trustworthy when the price source is trustworthy.
  if (priceOk && s.daysOnMarket > 0) {
    const slowerOrFaster = s.daysOnMarket < baseline.daysOnMarket ? "faster than" : s.daysOnMarket > baseline.daysOnMarket ? "slower than" : "in line with";
    para2Parts.push(
      `Listings here typically sell in ${s.daysOnMarket} days, ${slowerOrFaster} the ${stateName} average of ${baseline.daysOnMarket}.`,
    );
  }

  const out = [para1];
  if (para2Parts.length > 0) out.push(para2Parts.join(" "));
  return out;
}

/** Short interpretive paragraph for the "Market" section. */
export function buildMarketSummary(suburb: Suburb): string {
  const s = suburb.stats;
  // Skip the entire market interpretation when the price source is
  // unreliable — every sentence in this function leans on price.
  if (!hasReliablePrice(suburb)) return "";
  if (s.medianHousePrice <= 0) return "";
  const baseline = baselineFor(suburb.state);
  const cmp = priceComparePhrase(s.medianHousePrice, baseline.medianHousePrice);
  const g = growthDescriptor(s.annualGrowthHouse);

  const parts: string[] = [];
  parts.push(
    `Houses change hands at ${formatPricePrecise(s.medianHousePrice)} on a typical sale, ${cmp.phrase} the ${baseline.fullName} median.`,
  );
  if (s.medianUnitPrice > 0) {
    const unitGap = Math.round((1 - s.medianUnitPrice / s.medianHousePrice) * 100);
    parts.push(`Units come in around ${formatPricePrecise(s.medianUnitPrice)}, roughly ${unitGap}% below the house median.`);
  }
  if (s.annualGrowthHouse !== 0) {
    parts.push(
      g.tone === "strong"
        ? `The last 12 months delivered ${g.phrase} (${formatPercent(s.annualGrowthHouse, true)}) — well clear of the long-run average for the state.`
        : g.tone === "moderate"
        ? `The 12-month picture is one of ${g.phrase} (${formatPercent(s.annualGrowthHouse, true)}).`
        : g.tone === "flat"
        ? `The 12-month picture is essentially ${g.phrase} (${formatPercent(s.annualGrowthHouse, true)}), so buyers and sellers are negotiating on roughly the same number.`
        : `The 12-month picture shows ${g.phrase} (${formatPercent(s.annualGrowthHouse, true)}), giving buyers more room to negotiate.`,
    );
  }
  if (s.daysOnMarket > 0) {
    parts.push(
      s.daysOnMarket < baseline.daysOnMarket - 7
        ? `Days on market are short (${s.daysOnMarket} days), suggesting strong demand.`
        : s.daysOnMarket > baseline.daysOnMarket + 7
        ? `Days on market run long (${s.daysOnMarket} days), so well-priced listings still need patience.`
        : `Days on market sit around ${s.daysOnMarket}, broadly typical for the state.`,
    );
  }
  return parts.join(" ");
}

/** Demographics / "Who lives here" narrative. */
export function buildDemographicsSummary(suburb: Suburb): string {
  const s = suburb.stats;
  if (s.population <= 0) return "";

  const parts: string[] = [];
  const tenure = tenureDescriptor(s.ownerOccupied || 0);
  const age = ageDescriptor(s.medianAge || 35);

  parts.push(`The 2021 Census put ${suburb.name}'s population at ${s.population.toLocaleString("en-AU")}, with a median age of ${s.medianAge || "n/a"}.`);
  parts.push(`That sits as ${age}.`);

  if (s.ownerOccupied > 0) {
    parts.push(
      `Households are ${tenure} (${s.ownerOccupied}% own, ${s.renterOccupied}% rent), which shapes everything from school catchment stability to how often properties turn over.`,
    );
  }

  if (s.householdsFamily > 0 || s.householdsLonePerson > 0) {
    const family = s.householdsFamily;
    const lone = s.householdsLonePerson;
    if (family >= 60) {
      parts.push(`The household mix skews family-dominated (${family}% family households, ${lone}% lone person), so amenity decisions tend to follow what families want: parks, schools, supermarkets.`);
    } else if (lone >= 35) {
      parts.push(`Lone-person households are notable here (${lone}%), often a marker of unit-heavy stock and walkable infrastructure.`);
    } else {
      parts.push(`The household mix is balanced (${family}% family, ${lone}% lone person).`);
    }
  }

  return parts.join(" ");
}

/** "What it's like to live here" — climate, walkability, lifestyle. */
export function buildLifestyleSummary(suburb: Suburb): string[] {
  const s = suburb.stats;
  const parts: string[] = [];

  // Walkability paragraph
  if (s.walkScore !== null && s.walkScore !== undefined) {
    const w = walkScoreDescriptor(s.walkScore);
    const transit = s.transitScore !== null && s.transitScore !== undefined
      ? s.transitScore >= 50
        ? "with workable public transport options"
        : "with limited public transport"
      : "";
    parts.push(
      `${suburb.name} scores ${s.walkScore}/100 on walkability, which makes it ${w.phrase} ${transit}. ${
        w.livingMode === "walkable"
          ? "Coffee, groceries and a meal out are mostly walking-distance, which keeps a household viable on one car."
          : w.livingMode === "balanced"
          ? "A short drive opens up most amenities; a car-light household is workable but not optimal."
          : "Plan for two cars in a typical household, especially if work isn't local."
      }`,
    );
  }

  // Climate paragraph (only when BoM data is loaded)
  if (suburb.climate) {
    const c = suburb.climate;
    const summerMax = c.meanMaxTemp[0] ?? c.meanMaxTemp[1] ?? null;
    const winterMin = c.meanMinTemp[6] ?? c.meanMinTemp[5] ?? null;
    const rainfall = c.annualRainfallMm;
    if (summerMax !== null && winterMin !== null) {
      const summerWord = summerMax >= 32 ? "hot" : summerMax >= 27 ? "warm" : "mild";
      const winterWord = winterMin <= 4 ? "cold" : winterMin <= 8 ? "cool" : "mild";
      parts.push(
        `Summer days here average around ${Math.round(summerMax)}°C (${summerWord}), winter mornings around ${Math.round(winterMin)}°C (${winterWord}).${rainfall ? ` Annual rainfall lands at about ${Math.round(rainfall)}mm.` : ""} Data comes from the Bureau of Meteorology's ${c.bomStationName} station, ${c.distanceKm.toFixed(1)}km away.`,
      );
    }
  }

  // Schools paragraph
  if (suburb.schools && suburb.schools.length > 0) {
    const govPrimary  = suburb.schools.filter((sc) => sc.type === "primary"   && sc.sector === "government").length;
    const govSecondary = suburb.schools.filter((sc) => sc.type === "secondary" && sc.sector === "government").length;
    const indep        = suburb.schools.filter((sc) => sc.sector === "independent").length;
    const catholic     = suburb.schools.filter((sc) => sc.sector === "catholic").length;
    const counts: string[] = [];
    if (govPrimary)   counts.push(`${govPrimary} government primary`);
    if (govSecondary) counts.push(`${govSecondary} government secondary`);
    if (catholic)     counts.push(`${catholic} Catholic`);
    if (indep)        counts.push(`${indep} independent`);
    if (counts.length > 0) {
      parts.push(`Schooling within or near the suburb covers ${counts.join(", ")}.`);
    }
  }

  return parts;
}

/** Investor-angle paragraph for the "For investors" section. */
export function buildInvestorView(suburb: Suburb): string {
  const s = suburb.stats;
  // Yield calculation needs a trustworthy price. Skip entirely when
  // the price source is unreliable rather than computing a fake yield.
  if (!hasReliablePrice(suburb)) return "";
  if (s.medianHousePrice <= 0 || s.medianRentHouse <= 0) return "";

  const houseYield = calcGrossYield(s.medianRentHouse, s.medianHousePrice);
  const unitYield  = calcGrossYield(s.medianRentUnit,  s.medianUnitPrice);

  const parts: string[] = [];
  parts.push(`Gross rental yield on houses sits at ${houseYield.toFixed(2)}% (median rent ${s.medianRentHouse ? `$${s.medianRentHouse}/wk` : "n/a"} against a ${formatPricePrecise(s.medianHousePrice)} price tag).`);
  if (unitYield > 0) {
    parts.push(`Units yield ${unitYield.toFixed(2)}% gross, often the better cash-flow play for first-time investors.`);
  }
  if (s.renterOccupied >= 30) {
    parts.push(`With ${s.renterOccupied}% of households renting, the leasing market is established and vacancy risk tends to be lower than in owner-dominated suburbs.`);
  } else if (s.renterOccupied > 0) {
    parts.push(`Renter share is modest (${s.renterOccupied}%), so the rental pool is smaller and tenant demand can be patchier than in higher-density suburbs.`);
  }
  if (s.annualGrowthHouse >= 5) {
    parts.push(`The 12-month growth of ${formatPercent(s.annualGrowthHouse, true)} adds a capital-growth case on top of the yield.`);
  }
  return parts.join(" ");
}

/** Short buyer angle: affordability, schools, deposit. */
export function buildBuyerView(suburb: Suburb): string {
  const s = suburb.stats;
  if (!hasReliablePrice(suburb)) return "";
  if (s.medianHousePrice <= 0) return "";
  const baseline = baselineFor(suburb.state);
  const cmp = priceComparePhrase(s.medianHousePrice, baseline.medianHousePrice);
  const deposit20 = Math.round((s.medianHousePrice * 0.2) / 1000) * 1000;

  const parts: string[] = [];
  parts.push(`A 20% deposit on the median house works out to roughly ${formatPricePrecise(deposit20)}.`);
  parts.push(
    cmp.ratio < 0.85
      ? `Prices are ${cmp.phrase} the ${baseline.fullName} median, which keeps ${suburb.name} on the radar for first-home buyers and right-sizers.`
      : cmp.ratio > 1.15
      ? `Prices sit ${cmp.phrase} the ${baseline.fullName} median, so plan for a stretched deposit and shop carefully on borrowing capacity.`
      : `Prices are ${cmp.phrase} the ${baseline.fullName} median, so the broader state lending settings apply.`,
  );
  return parts.join(" ");
}

/** Short seller angle: market temperature. */
export function buildSellerView(suburb: Suburb): string {
  const s = suburb.stats;
  if (!hasReliablePrice(suburb)) return "";
  if (s.medianHousePrice <= 0) return "";
  const baseline = baselineFor(suburb.state);

  const parts: string[] = [];
  if (s.daysOnMarket > 0) {
    parts.push(
      s.daysOnMarket < baseline.daysOnMarket - 7
        ? `Sellers in ${suburb.name} are seeing fast turnover (${s.daysOnMarket} days on market), so well-priced listings tend to clear quickly.`
        : s.daysOnMarket > baseline.daysOnMarket + 7
        ? `Days on market are running long here (${s.daysOnMarket} days), so realistic pricing and patient marketing matter.`
        : `Days on market run around ${s.daysOnMarket}, typical for the state.`,
    );
  }
  if (s.annualGrowthHouse >= 3) {
    parts.push(`Twelve-month growth is ${formatPercent(s.annualGrowthHouse, true)}, supporting confident pricing at the upper end of recent comparables.`);
  } else if (s.annualGrowthHouse < 0) {
    parts.push(`With 12-month growth at ${formatPercent(s.annualGrowthHouse, true)}, pricing should anchor to the most recent six months of comparables, not last year's peak.`);
  }
  return parts.join(" ");
}
