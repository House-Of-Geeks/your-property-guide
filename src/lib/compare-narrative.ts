// Algorithmic comparative narrative for suburb-vs-suburb pages.
//
// The /suburbs/[a]/vs/[b] template renders 6 sections of stat tables but
// no reading copy. That makes it a good data-comparison tool but a poor
// ranking page: Google rewards pages that interpret data, not pages that
// list it. This module fixes that by generating multi-paragraph
// comparative prose, persona-specific verdicts, and dynamic FAQs from
// the two suburbs' underlying numbers.
//
// Output is deterministic (same input -> same output) so it caches
// cleanly under the existing 24h ISR on the compare route.

import type { Suburb } from "@/types";

// ─── Formatters ───────────────────────────────────────────────────────

function formatPrice(value: number): string {
  if (value <= 0) return "n/a";
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return m >= 10 ? `$${Math.round(m)}M` : `$${m.toFixed(2)}M`;
  }
  return `$${Math.round(value / 1_000)}K`;
}

function formatPricePrecise(value: number): string {
  if (value <= 0) return "n/a";
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(value);
}

function formatPercent(value: number, signed = false): string {
  const rounded = Math.round(value * 10) / 10;
  const prefix = signed && rounded > 0 ? "+" : "";
  return `${prefix}${rounded}%`;
}

function calcGrossYield(rentPerWeek: number, price: number): number {
  if (!rentPerWeek || !price) return 0;
  return ((rentPerWeek * 52) / price) * 100;
}

function avgIcsea(schools: Suburb["schools"]): number | null {
  const withIcsea = schools.filter((s) => s.icsea !== null);
  if (withIcsea.length === 0) return null;
  return Math.round(withIcsea.reduce((sum, s) => sum + (s.icsea ?? 0), 0) / withIcsea.length);
}

// ─── Comparison helpers ───────────────────────────────────────────────
//
// percentGap returns the percentage difference of (a) vs (b), so 1.2M
// vs 1M returns 20 (a is 20% higher). Returns null if either side is
// missing/zero.

function percentGap(a: number, b: number): number | null {
  if (!a || !b) return null;
  return ((a - b) / b) * 100;
}

function namePair(a: Suburb, b: Suburb) {
  return { aName: a.name, bName: b.name };
}

// Cheaper-of returns the cheaper suburb and the % gap, used to drive
// "Suburb X is N% cheaper" sentences. Returns null if data is missing.
function cheaperOf(a: Suburb, b: Suburb): { cheaper: "a" | "b"; gap: number } | null {
  const pa = a.stats.medianHousePrice;
  const pb = b.stats.medianHousePrice;
  if (!pa || !pb || pa === pb) return null;
  const gap = Math.abs(percentGap(pa, pb) ?? 0);
  return { cheaper: pa < pb ? "a" : "b", gap };
}

// Higher-growth returns the stronger-growth suburb and the gap in
// percentage points. Returns null if growth values are equal/missing.
function higherGrowth(a: Suburb, b: Suburb): { faster: "a" | "b"; gap: number } | null {
  const ga = a.stats.annualGrowthHouse;
  const gb = b.stats.annualGrowthHouse;
  if (ga == null || gb == null || ga === gb) return null;
  return { faster: ga > gb ? "a" : "b", gap: Math.abs(ga - gb) };
}

function fasterToSell(a: Suburb, b: Suburb): { faster: "a" | "b"; aDom: number; bDom: number } | null {
  const da = a.stats.daysOnMarket;
  const db = b.stats.daysOnMarket;
  if (!da || !db || da === db) return null;
  return { faster: da < db ? "a" : "b", aDom: da, bDom: db };
}

function higherYield(a: Suburb, b: Suburb): { better: "a" | "b"; aY: number; bY: number } | null {
  const ya = calcGrossYield(a.stats.medianRentHouse, a.stats.medianHousePrice);
  const yb = calcGrossYield(b.stats.medianRentHouse, b.stats.medianHousePrice);
  if (!ya || !yb || ya === yb) return null;
  return { better: ya > yb ? "a" : "b", aY: ya, bY: yb };
}

function moreWalkable(a: Suburb, b: Suburb): { better: "a" | "b"; aS: number; bS: number } | null {
  const sa = a.stats.walkScore;
  const sb = b.stats.walkScore;
  if (sa == null || sb == null || sa === sb) return null;
  return { better: sa > sb ? "a" : "b", aS: sa, bS: sb };
}

function strongerSchools(a: Suburb, b: Suburb): { better: "a" | "b"; aI: number; bI: number } | null {
  const ia = avgIcsea(a.schools);
  const ib = avgIcsea(b.schools);
  if (ia == null || ib == null || ia === ib) return null;
  return { better: ia > ib ? "a" : "b", aI: ia, bI: ib };
}

// ─── Intro narrative ──────────────────────────────────────────────────
//
// 2 paragraphs that read like a property column lede: anchor the
// comparison, name the main gaps, hint at who each suburb suits. Pulled
// directly from data — no marketing fluff.

export function buildCompareIntro(a: Suburb, b: Suburb): string[] {
  const { aName, bName } = namePair(a, b);
  const out: string[] = [];

  // Paragraph 1: price and growth picture.
  const para1: string[] = [];
  const cheap = cheaperOf(a, b);
  if (cheap) {
    const cheaperName = cheap.cheaper === "a" ? aName : bName;
    const dearerName  = cheap.cheaper === "a" ? bName : aName;
    const cheaperPrice = cheap.cheaper === "a" ? a.stats.medianHousePrice : b.stats.medianHousePrice;
    const dearerPrice  = cheap.cheaper === "a" ? b.stats.medianHousePrice : a.stats.medianHousePrice;
    para1.push(
      `${cheaperName} (median ${formatPricePrecise(cheaperPrice)}) is roughly ${cheap.gap.toFixed(0)}% cheaper to buy into than ${dearerName} (${formatPricePrecise(dearerPrice)}).`,
    );
  } else if (a.stats.medianHousePrice > 0 && b.stats.medianHousePrice > 0) {
    para1.push(`${aName} and ${bName} have near-identical medians (${formatPricePrecise(a.stats.medianHousePrice)} vs ${formatPricePrecise(b.stats.medianHousePrice)}).`);
  }
  const growth = higherGrowth(a, b);
  if (growth) {
    const fasterName = growth.faster === "a" ? aName : bName;
    const slowerName = growth.faster === "a" ? bName : aName;
    const fasterG = growth.faster === "a" ? a.stats.annualGrowthHouse : b.stats.annualGrowthHouse;
    const slowerG = growth.faster === "a" ? b.stats.annualGrowthHouse : a.stats.annualGrowthHouse;
    para1.push(
      `Over the past year, ${fasterName} (${formatPercent(fasterG, true)}) ran ${growth.gap.toFixed(1)} percentage points ahead of ${slowerName} (${formatPercent(slowerG, true)}) on house-price growth.`,
    );
  }
  const fastSell = fasterToSell(a, b);
  if (fastSell) {
    const fasterName = fastSell.faster === "a" ? aName : bName;
    const fasterDom = fastSell.faster === "a" ? fastSell.aDom : fastSell.bDom;
    const slowerDom = fastSell.faster === "a" ? fastSell.bDom : fastSell.aDom;
    para1.push(`${fasterName} listings turn over faster (${fasterDom} days on market vs ${slowerDom}).`);
  }
  if (para1.length > 0) out.push(para1.join(" "));

  // Paragraph 2: lifestyle, schools, who each suits.
  const para2: string[] = [];
  const walk = moreWalkable(a, b);
  if (walk) {
    const betterName = walk.better === "a" ? aName : bName;
    para2.push(`${betterName} scores higher on walkability (${walk.aS}/100 vs ${walk.bS}/100 ${walk.better === "a" ? "" : ""}), useful if you're optimising for a car-light household.`.replace(/\s+/g, " ").trim());
  }
  const schools = strongerSchools(a, b);
  if (schools) {
    const betterName = schools.better === "a" ? aName : bName;
    para2.push(`On school quality, the average ICSEA across schools serving ${betterName} (${schools.aI > schools.bI ? schools.aI : schools.bI}) sits above ${schools.better === "a" ? bName : aName} (${schools.aI > schools.bI ? schools.bI : schools.aI}).`);
  }
  const aTenure = a.stats.ownerOccupied || 0;
  const bTenure = b.stats.ownerOccupied || 0;
  if (aTenure && bTenure && Math.abs(aTenure - bTenure) >= 10) {
    const ownerHeavy   = aTenure > bTenure ? aName : bName;
    const renterHeavy  = aTenure > bTenure ? bName : aName;
    para2.push(`${ownerHeavy} skews owner-occupied (${aTenure > bTenure ? aTenure : bTenure}%), ${renterHeavy} runs more rental-dense (${aTenure > bTenure ? bTenure : aTenure}% owner).`);
  }
  if (para2.length > 0) out.push(para2.join(" "));

  return out;
}

// ─── Persona verdicts ─────────────────────────────────────────────────
//
// Three short verdicts: who each suburb suits, by intent. These read as
// "if you're a [persona], the math leans toward X" — not a portal-style
// "best" claim.

export interface CompareVerdicts {
  forBuyers:    string;
  forInvestors: string;
  forFamilies:  string;
}

export function buildCompareVerdicts(a: Suburb, b: Suburb): CompareVerdicts {
  const { aName, bName } = namePair(a, b);

  // For buyers (especially first home buyers): price + days on market.
  let forBuyers = "";
  const cheap = cheaperOf(a, b);
  if (cheap) {
    const cheaperName = cheap.cheaper === "a" ? aName : bName;
    const cheaperPrice = cheap.cheaper === "a" ? a.stats.medianHousePrice : b.stats.medianHousePrice;
    forBuyers = `${cheaperName} is the lower entry point at ${formatPricePrecise(cheaperPrice)} median, ${cheap.gap.toFixed(0)}% below the other suburb. For first home buyers, that translates to a smaller deposit and lower stamp duty bill.`;
  } else if (a.stats.medianHousePrice > 0 && b.stats.medianHousePrice > 0) {
    forBuyers = `The two suburbs land at similar price points (${formatPricePrecise(a.stats.medianHousePrice)} vs ${formatPricePrecise(b.stats.medianHousePrice)}), so the buying decision usually comes down to lifestyle fit rather than affordability.`;
  } else {
    forBuyers = `Price data is incomplete for one or both suburbs. Check the individual profiles for the latest medians before comparing affordability.`;
  }

  // For investors: yield + growth.
  let forInvestors = "";
  const y = higherYield(a, b);
  const g = higherGrowth(a, b);
  if (y && g) {
    const yName = y.better === "a" ? aName : bName;
    const gName = g.faster === "a" ? aName : bName;
    if (yName === gName) {
      forInvestors = `${yName} carries both higher gross yield (${y.aY > y.bY ? y.aY.toFixed(2) : y.bY.toFixed(2)}% vs ${y.aY > y.bY ? y.bY.toFixed(2) : y.aY.toFixed(2)}%) and stronger 12-month growth. On the headline numbers, it's the cleaner investor case of the two.`;
    } else {
      forInvestors = `Investors face a yield-versus-growth split: ${yName} delivers the better gross yield (${y.aY > y.bY ? y.aY.toFixed(2) : y.bY.toFixed(2)}% vs ${y.aY > y.bY ? y.bY.toFixed(2) : y.aY.toFixed(2)}%), but ${gName} has run faster on capital growth this year. The right pick depends on whether you're optimising for cash flow or capital appreciation.`;
    }
  } else if (y) {
    const yName = y.better === "a" ? aName : bName;
    forInvestors = `${yName} offers the higher gross rental yield (${y.aY > y.bY ? y.aY.toFixed(2) : y.bY.toFixed(2)}% vs ${y.aY > y.bY ? y.bY.toFixed(2) : y.aY.toFixed(2)}%), favouring cash-flow investors.`;
  } else if (g) {
    const gName = g.faster === "a" ? aName : bName;
    forInvestors = `${gName} has run faster on 12-month capital growth, favouring growth-led investors.`;
  } else {
    forInvestors = `Rental or growth data is incomplete for one or both suburbs. Look at the full investor view on each suburb profile for a complete picture.`;
  }

  // For families: schools + family-household share + walkability.
  let forFamilies = "";
  const schools = strongerSchools(a, b);
  const familyA = a.stats.householdsFamily || 0;
  const familyB = b.stats.householdsFamily || 0;
  if (schools) {
    const sName = schools.better === "a" ? aName : bName;
    forFamilies = `${sName} edges out on average school ICSEA (${schools.aI > schools.bI ? schools.aI : schools.bI} vs ${schools.aI > schools.bI ? schools.bI : schools.aI}).`;
    if (familyA && familyB && Math.abs(familyA - familyB) >= 10) {
      const familyName = familyA > familyB ? aName : bName;
      forFamilies += ` ${familyName} also has a higher family-household share (${familyA > familyB ? familyA : familyB}% vs ${familyA > familyB ? familyB : familyA}%), so the catchment community skews family-heavy.`;
    }
  } else if (familyA && familyB && Math.abs(familyA - familyB) >= 10) {
    const familyName = familyA > familyB ? aName : bName;
    forFamilies = `${familyName} has a heavier family-household mix (${familyA > familyB ? familyA : familyB}% vs ${familyA > familyB ? familyB : familyA}%), which typically signals stronger demand for family-amenable infrastructure (parks, schools, supermarkets).`;
  } else {
    forFamilies = `School and household data is too similar between the two to call a winner on family fit. Check the individual profiles for street-level school catchments.`;
  }

  return { forBuyers, forInvestors, forFamilies };
}

// ─── FAQ generation ───────────────────────────────────────────────────
//
// Per-pair FAQs that lift the page's chance of rich-snippet eligibility
// and give Google a clear question-answer structure to index.

export interface CompareFaqItem {
  question: string;
  answer: string;
}

export function buildCompareFaqs(a: Suburb, b: Suburb): CompareFaqItem[] {
  const { aName, bName } = namePair(a, b);
  const faqs: CompareFaqItem[] = [];

  // Q1: Which is cheaper?
  if (a.stats.medianHousePrice > 0 && b.stats.medianHousePrice > 0) {
    const cheap = cheaperOf(a, b);
    if (cheap) {
      const cheaperName = cheap.cheaper === "a" ? aName : bName;
      const dearerName  = cheap.cheaper === "a" ? bName : aName;
      const cheaperPrice = cheap.cheaper === "a" ? a.stats.medianHousePrice : b.stats.medianHousePrice;
      const dearerPrice  = cheap.cheaper === "a" ? b.stats.medianHousePrice : a.stats.medianHousePrice;
      faqs.push({
        question: `Is ${aName} or ${bName} cheaper to buy in?`,
        answer: `${cheaperName} has the lower median house price at ${formatPricePrecise(cheaperPrice)}, roughly ${cheap.gap.toFixed(0)}% below ${dearerName} (${formatPricePrecise(dearerPrice)}). The gap on units is usually similar but worth checking on the full suburb profiles.`,
      });
    }
  }

  // Q2: Which has stronger growth?
  if (a.stats.annualGrowthHouse !== 0 || b.stats.annualGrowthHouse !== 0) {
    const g = higherGrowth(a, b);
    if (g) {
      const fName = g.faster === "a" ? aName : bName;
      const sName = g.faster === "a" ? bName : aName;
      const fG = g.faster === "a" ? a.stats.annualGrowthHouse : b.stats.annualGrowthHouse;
      const sG = g.faster === "a" ? b.stats.annualGrowthHouse : a.stats.annualGrowthHouse;
      faqs.push({
        question: `Which has stronger property growth, ${aName} or ${bName}?`,
        answer: `Over the past 12 months, ${fName} grew ${formatPercent(fG, true)} vs ${formatPercent(sG, true)} in ${sName}, a gap of ${g.gap.toFixed(1)} percentage points. Twelve-month growth can swing year to year, so weight long-run trends from the individual suburb profiles before making a buy decision.`,
      });
    }
  }

  // Q3: Which has better schools?
  const schools = strongerSchools(a, b);
  if (schools) {
    const sName = schools.better === "a" ? aName : bName;
    faqs.push({
      question: `Does ${aName} or ${bName} have better schools?`,
      answer: `On average school ICSEA (the ACARA index that benchmarks educational advantage), ${sName} scores ${schools.aI > schools.bI ? schools.aI : schools.bI} vs ${schools.aI > schools.bI ? schools.bI : schools.aI} in ${schools.better === "a" ? bName : aName}. ICSEA is a school-community indicator, not a quality rating, so always check NAPLAN results and catchment boundaries for the specific address you're considering.`,
    });
  }

  // Q4: Which is more walkable?
  const walk = moreWalkable(a, b);
  if (walk) {
    const wName = walk.better === "a" ? aName : bName;
    faqs.push({
      question: `Which is more walkable, ${aName} or ${bName}?`,
      answer: `${wName} scores ${walk.aS > walk.bS ? walk.aS : walk.bS}/100 on walkability vs ${walk.aS > walk.bS ? walk.bS : walk.aS}/100. Above 70 is considered very walkable (most errands on foot), 50-69 is walkable for some errands, below 50 typically requires a car for daily life.`,
    });
  }

  // Q5: Which has higher rental yield (investor angle)?
  const y = higherYield(a, b);
  if (y) {
    const yName = y.better === "a" ? aName : bName;
    faqs.push({
      question: `Which suburb has higher rental yield, ${aName} or ${bName}?`,
      answer: `Gross rental yield on houses is ${y.aY > y.bY ? y.aY.toFixed(2) : y.bY.toFixed(2)}% in ${yName} vs ${y.aY > y.bY ? y.bY.toFixed(2) : y.aY.toFixed(2)}% in ${y.better === "a" ? bName : aName}. Gross yield equals annual rent divided by purchase price. Net yield (after strata, rates, insurance, agent fees and maintenance) typically runs 1.5-2 percentage points lower.`,
    });
  }

  // Q6: Which sells faster?
  const ds = fasterToSell(a, b);
  if (ds) {
    const fName = ds.faster === "a" ? aName : bName;
    const fastDom = ds.faster === "a" ? ds.aDom : ds.bDom;
    const slowDom = ds.faster === "a" ? ds.bDom : ds.aDom;
    faqs.push({
      question: `Which sells faster, ${aName} or ${bName}?`,
      answer: `${fName} listings clear in roughly ${fastDom} days on market on average, vs ${slowDom} days in ${ds.faster === "a" ? bName : aName}. Faster days-on-market is a demand signal but it interacts with price strategy — listings priced ambitiously sit longer in any market.`,
    });
  }

  // Q7: Risk comparison if either suburb has hazard data.
  if (a.hazard?.floodClass || a.hazard?.bushfireRisk || b.hazard?.floodClass || b.hazard?.bushfireRisk) {
    faqs.push({
      question: `Which has lower natural-hazard risk, ${aName} or ${bName}?`,
      answer: `Flood class in ${aName} is ${a.hazard?.floodClass ?? "not classified"}; in ${bName} it's ${b.hazard?.floodClass ?? "not classified"}. Bushfire risk: ${aName} is ${a.hazard?.bushfireRisk ?? "not classified"}, ${bName} is ${b.hazard?.bushfireRisk ?? "not classified"}. These are suburb-level overlays; insurance pricing and lender requirements are set at the property level, so always check the specific address.`,
    });
  }

  return faqs;
}

// ─── Combined export ──────────────────────────────────────────────────

export interface CompareNarrative {
  intro:     string[];
  verdicts:  CompareVerdicts;
  faqs:      CompareFaqItem[];
}

export function buildCompareNarrative(a: Suburb, b: Suburb): CompareNarrative {
  return {
    intro:     buildCompareIntro(a, b),
    verdicts:  buildCompareVerdicts(a, b),
    faqs:      buildCompareFaqs(a, b),
  };
}

// Build a meta description from the comparison without giving up the
// site's positioning. Used by the route's generateMetadata.
export function buildCompareMetaDescription(a: Suburb, b: Suburb): string {
  const parts: string[] = [];
  const cheap = cheaperOf(a, b);
  if (cheap) {
    const cheaperName = cheap.cheaper === "a" ? a.name : b.name;
    parts.push(`${cheaperName} is roughly ${cheap.gap.toFixed(0)}% cheaper`);
  } else if (a.stats.medianHousePrice > 0 && b.stats.medianHousePrice > 0) {
    parts.push(`Medians ${formatPrice(a.stats.medianHousePrice)} vs ${formatPrice(b.stats.medianHousePrice)}`);
  }
  const g = higherGrowth(a, b);
  if (g) {
    const fName = g.faster === "a" ? a.name : b.name;
    parts.push(`${fName} runs ${g.gap.toFixed(1)} points ahead on 12-month growth`);
  }
  const head = parts.length > 0 ? parts.join(", ") + ". " : "";
  return `${head}Compare ${a.name} and ${b.name} side-by-side: median price, growth, schools, walkability, climate, risk. Free, no sign-up.`;
}
