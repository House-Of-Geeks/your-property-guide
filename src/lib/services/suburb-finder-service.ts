import { db } from "@/lib/db";
import { LOCALITIES_ONLY } from "@/lib/non-localities";
import { PUBLISHED_HOUSE_MEDIAN, publishedSales, type MedianBasis, notInvertedMedians } from "@/lib/published-medians";
import { GROWTH_RANKED_STATES, YIELD_RANKED_STATES, priceSourceLine } from "@/lib/ranking-notes";
import { yieldFromSql, yieldStates } from "@/lib/services/suburb-rankings-service";
import { grossYieldPercent } from "@/lib/suburb-snapshot";

// The quiz scores what each suburb's own page publishes (fix item 47):
// a published median, a 12-month change where a feed measures one, a yield
// where rent is measured for the suburb itself, a hazard class where there
// is a record. Until 29 Sep 2026 it read the raw columns of 1,500 suburbs
// taken in no stated order: a Victorian growth search led with Burnley at
// "$506K", a yield of 10.2%, growth of +0.0% and "Low flood and bushfire
// risk", none of which the Burnley page printed.

// ─── Quiz answer shape ──────────────────────────────────────────────────────

export type Priority = "growth" | "yield" | "schools" | "walkability" | "affordability" | "low-risk";
export type BudgetTier = "under-500k" | "500k-800k" | "800k-1.2m" | "1.2m-2m" | "over-2m";
export type LifestyleStage = "first-home" | "young-family" | "established-family" | "downsizer" | "investor";

export interface QuizAnswers {
  /** Top priority, drives the strongest weight in scoring */
  priority: Priority;
  /** State filter, "any" widens to all states */
  state: string | "any";
  /** Approximate budget range */
  budget: BudgetTier;
  /** Lifestyle stage, adjusts secondary weights */
  stage: LifestyleStage;
}

// ─── Result shape ──────────────────────────────────────────────────────────

export interface MatchedSuburb {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  /** The median the suburb's own page publishes. */
  medianHousePrice: number;
  /** "area" for the median of the ABS statistical area that carries the suburb's name. */
  medianBasis: MedianBasis | null;
  /** 0 when there is no published 12-month change. */
  annualGrowthHouse: number;
  walkScore: number | null;
  /** Null unless rent is measured for the suburb itself. */
  grossYield: number | null;
  avgIcsea: number | null;
  population: number;
  /** Total score 0–100, higher is better */
  score: number;
  /** Human-readable reasons we matched (top 2 to 3) */
  reasons: string[];
}

export interface FinderResult {
  matches: MatchedSuburb[];
  /** Set when the top priority could not be measured for any suburb: why there is nothing to rank. */
  unmeasured: string | null;
  /** What was left out of the score, and where the prices come from. Printed under the matches. */
  notes: string[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const BUDGET_RANGE: Record<BudgetTier, [number, number]> = {
  "under-500k":   [0,            500_000],
  "500k-800k":    [400_000,      800_000],
  "800k-1.2m":    [700_000,    1_200_000],
  "1.2m-2m":      [1_100_000,  2_000_000],
  "over-2m":      [1_800_000, 10_000_000],
};

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function withinBudget(price: number, tier: BudgetTier): number {
  // Returns a 0–1 score for how well price fits the tier. Inside the tier = 1.
  // Just outside = 0.5. Far outside = 0. Avoids hard cutoffs that exclude
  // borderline matches in tight markets.
  const [lo, hi] = BUDGET_RANGE[tier];
  if (price >= lo && price <= hi) return 1;
  if (price < lo) {
    const ratio = price / lo;
    return clamp01(ratio); // cheaper than tier, still partial credit
  }
  // price > hi
  const overshoot = price - hi;
  const tolerance = (hi - lo) * 0.5; // 50% over the tier width = score 0
  return clamp01(1 - overshoot / tolerance);
}

const PRIORITY_LABEL: Record<Priority, string> = {
  growth:        "Capital growth",
  yield:         "Rental yield",
  schools:       "School quality",
  walkability:   "Walkability",
  affordability: "Affordability",
  "low-risk":    "Low natural-hazard risk",
};

const STATE_LABEL: Record<string, string> = {
  NSW: "New South Wales", VIC: "Victoria", QLD: "Queensland", WA: "Western Australia",
  SA: "South Australia", TAS: "Tasmania", NT: "the Northern Territory", ACT: "the Australian Capital Territory",
};

// ─── Weights ────────────────────────────────────────────────────────────────

export type Dimension = "growth" | "yield" | "schools" | "walk" | "budget" | "lowRisk" | "familyShare";
export type FinderWeights = Record<Dimension, number>;

/** The dimension each priority is scored on. */
const PRIORITY_DIMENSION: Record<Priority, Dimension> = {
  growth: "growth",
  yield: "yield",
  schools: "schools",
  walkability: "walk",
  affordability: "budget",
  "low-risk": "lowRisk",
};

/** Every quiz carries this much weight on hazard, whatever the answers. */
const BASELINE_HAZARD_WEIGHT = 0.10;

/** The weight the answers put on each dimension, before anything is left out. Pure. */
export function finderWeights(answers: QuizAnswers): FinderWeights {
  const weights: FinderWeights = {
    growth: 0,
    yield: 0,
    schools: 0,
    walk: 0,
    budget: 0.25, // budget always matters
    lowRisk: BASELINE_HAZARD_WEIGHT,
    familyShare: 0,
  };

  switch (answers.priority) {
    case "growth":        weights.growth = 0.40; weights.budget = 0.20; break;
    case "yield":         weights.yield = 0.40; weights.budget = 0.20; break;
    case "schools":       weights.schools = 0.40; weights.familyShare = 0.10; break;
    case "walkability":   weights.walk = 0.40; weights.budget = 0.20; break;
    case "affordability": weights.budget = 0.50; weights.growth = 0.10; break;
    case "low-risk":      weights.lowRisk = 0.40; weights.budget = 0.20; break;
  }

  // Stage tweaks (light, don't dominate priority)
  switch (answers.stage) {
    case "young-family":
    case "established-family":
      weights.schools = Math.max(weights.schools, 0.15);
      weights.familyShare = Math.max(weights.familyShare, 0.10);
      break;
    case "first-home":
      weights.budget = Math.max(weights.budget, 0.30);
      break;
    case "downsizer":
      weights.walk = Math.max(weights.walk, 0.15);
      weights.lowRisk = Math.max(weights.lowRisk, 0.15);
      break;
    case "investor":
      weights.yield = Math.max(weights.yield, 0.20);
      weights.growth = Math.max(weights.growth, 0.20);
      break;
  }
  return weights;
}

/**
 * Which dimensions hold a figure for at least one of the suburbs being
 * scored. One nobody has a figure for is left out of the score: it would
 * add nothing to any suburb, and the results say so.
 */
export interface FinderMeasured {
  /** A published 12-month change. */
  growth: boolean;
  /** A published median and a rent measured for the suburb itself. */
  yield: boolean;
  schools: boolean;
  walk: boolean;
  /** A flood or bushfire record. */
  hazard: boolean;
}

const MEASURED_KEY: Partial<Record<Dimension, keyof FinderMeasured>> = {
  growth: "growth", yield: "yield", schools: "schools", walk: "walk", lowRisk: "hazard",
};

/** The weights with every unmeasured dimension set to 0. Pure. */
export function measuredWeights(weights: FinderWeights, measured: FinderMeasured): FinderWeights {
  const out = { ...weights };
  for (const d of Object.keys(out) as Dimension[]) {
    const key = MEASURED_KEY[d];
    if (key && !measured[key]) out[d] = 0;
  }
  return out;
}

// ─── What the results say ──────────────────────────────────────────────────

const stateNames = (codes: readonly string[]) => codes.map((c) => STATE_LABEL[c] ?? c).join(" and ");

/** Why a dimension could not be measured for this search. */
function whyUnmeasured(d: Dimension, state: string | null): string {
  const where = state ? STATE_LABEL[state] ?? state : null;
  switch (d) {
    case "growth": {
      // Where a change is normally measured and none was found, there is no other state to point to.
      if (!state || GROWTH_RANKED_STATES.includes(state)) return `We hold no 12-month change for ${where ?? "these suburbs"} yet.`;
      return `We hold no 12-month change for ${where}: the figures we publish there come without one. ${stateNames(GROWTH_RANKED_STATES)} have one.`;
    }
    case "yield": {
      const elsewhere = `${stateNames(YIELD_RANKED_STATES)} have one.`;
      if (state === "NSW") return `Rents in New South Wales are published by postcode, not by suburb, so there is no rent to set against a suburb's price. ${elsewhere}`;
      if (state === "SA") return `We are checking the South Australian sales medians, so no yield is worked out there yet. ${elsewhere}`;
      if (!state || YIELD_RANKED_STATES.includes(state)) return `We hold no rent measured suburb by suburb for ${where ?? "these suburbs"} yet.`;
      return `We hold no rent measured suburb by suburb for ${where}. ${elsewhere}`;
    }
    case "lowRisk":
      return "We hold no flood or bushfire record for these suburbs yet.";
    case "schools":
      return "We hold no school results for these suburbs.";
    case "walk":
      return "We hold no walk score for these suburbs.";
    default:
      return "";
  }
}

const DIMENSION_NOUN: Partial<Record<Dimension, string>> = {
  growth: "growth", yield: "yield", schools: "schools", walk: "walkability", lowRisk: "hazard",
};

/**
 * Why there is nothing to rank, when the top priority could not be measured
 * for any suburb. Null when it could. Pure.
 */
export function unmeasuredPriority(answers: QuizAnswers, measured: FinderMeasured): string | null {
  const d = PRIORITY_DIMENSION[answers.priority];
  const key = MEASURED_KEY[d];
  if (!key || measured[key]) return null;
  const state = answers.state === "any" ? null : answers.state;
  return `${whyUnmeasured(d, state)} Pick another priority and we will match on that.`;
}

/** What was left out of the score, and where the prices come from. Pure. */
export function finderNotes(answers: QuizAnswers, measured: FinderMeasured): string[] {
  const asked = finderWeights(answers);
  const state = answers.state === "any" ? null : answers.state;
  const notes: string[] = [];

  for (const d of ["growth", "yield", "schools", "walk", "lowRisk"] as Dimension[]) {
    const key = MEASURED_KEY[d] as keyof FinderMeasured;
    // Hazard is weighted in every quiz: say it is missing only where the answers raised it.
    const raised = d === "lowRisk" ? asked.lowRisk > BASELINE_HAZARD_WEIGHT : asked[d] > 0;
    if (!raised) continue;
    if (!measured[key]) {
      notes.push(`${whyUnmeasured(d, state)} ${DIMENSION_NOUN[d]![0].toUpperCase()}${DIMENSION_NOUN[d]!.slice(1)} is left out of the score.`);
    } else if (!state && d === "growth") {
      notes.push("A 12-month change is measured in New South Wales and South Australia only. Suburbs elsewhere score nothing for growth.");
    } else if (!state && d === "yield") {
      notes.push("Yield is worked out in Victoria and Queensland only, the two states where we hold a published median and a rent measured for the suburb itself. Suburbs elsewhere score nothing for yield.");
    }
  }
  notes.push(`Only suburbs with a published median are matched. ${priceSourceLine(state)}`);
  return notes;
}

// ─── Scoring ────────────────────────────────────────────────────────────────

export interface ScoredInput {
  /** Published median. */
  medianHousePrice: number;
  /** Published 12-month change; 0 when there is none. */
  annualGrowthHouse: number;
  walkScore: number | null;
  /** Null unless rent is measured for the suburb itself. */
  grossYield: number | null;
  schools: { icsea: number | null }[];
  householdsFamily: number;
  floodClass: string | null;
  bushfireRisk: string | null;
}

const hazardScore = (cls: string) => (cls === "low" ? 1 : cls === "medium" ? 0.5 : 0);

/** Pure: the score and the reasons for one suburb, on the weights given. */
export function scoreSuburb(s: ScoredInput, answers: QuizAnswers, weights: FinderWeights): { score: number; reasons: string[] } {
  // Compute per-dimension 0–1 scores
  const growthRaw = s.annualGrowthHouse;          // 0 = none published
  const growth = clamp01((growthRaw - 0) / 15);   // 0% → 0, 15%+ → 1

  const yieldRaw = s.grossYield;
  const yieldScore = yieldRaw == null ? 0 : clamp01((yieldRaw - 2) / 4); // 2% → 0, 6%+ → 1

  const icseaRaw = s.schools
    .map((sch) => sch.icsea)
    .filter((v): v is number => v != null);
  const avgIcsea = icseaRaw.length > 0
    ? Math.round(icseaRaw.reduce((a, b) => a + b, 0) / icseaRaw.length)
    : null;
  const schools = avgIcsea == null ? 0 : clamp01((avgIcsea - 950) / 150); // 950 → 0, 1100+ → 1

  const walk = s.walkScore == null ? 0 : clamp01(s.walkScore / 90); // 90+ → 1

  const budget = withinBudget(s.medianHousePrice, answers.budget);

  // No hazard record is not a low hazard: it scores nothing and claims
  // nothing. Where one of the two is on record, only that one is scored.
  const known = [s.floodClass, s.bushfireRisk].filter((c): c is string => c != null);
  const lowRisk = known.length > 0 ? known.reduce((sum, c) => sum + hazardScore(c), 0) / known.length : 0;
  const hazardNames = [s.floodClass != null ? "flood" : null, s.bushfireRisk != null ? "bushfire" : null].filter(Boolean).join(" and ");

  const familyShare = clamp01(s.householdsFamily / 80); // 80%+ family households → 1

  const dimensions: { key: Dimension; score: number; reason: string }[] = [
    { key: "growth",      score: growth,      reason: growthRaw > 0 ? `Median up ${growthRaw.toFixed(1)}% over 12 months` : "" },
    { key: "yield",       score: yieldScore,  reason: yieldRaw != null ? `Gross rental yield around ${yieldRaw.toFixed(1)}%` : "" },
    { key: "schools",     score: schools,     reason: avgIcsea != null ? `Strong school catchment (avg ICSEA ${avgIcsea})` : "" },
    { key: "walk",        score: walk,        reason: s.walkScore != null ? `Walk Score of ${s.walkScore}` : "" },
    { key: "budget",      score: budget,      reason: budget >= 0.95 ? `Median price fits your budget` : (budget >= 0.5 ? `Median price close to your budget` : "") },
    { key: "lowRisk",     score: lowRisk,     reason: known.length === 0 ? "" : lowRisk === 1 ? `Low ${hazardNames} risk` : (lowRisk >= 0.5 ? `Moderate hazard risk` : "") },
    { key: "familyShare", score: familyShare, reason: s.householdsFamily > 60 ? `Family-heavy demographic (${Math.round(s.householdsFamily)}% family households)` : "" },
  ];

  // Weighted sum
  let total = 0;
  let weightSum = 0;
  for (const d of dimensions) {
    const w = weights[d.key] ?? 0;
    total += d.score * w;
    weightSum += w;
  }
  // Normalise to 0-1 then to 0-100
  const normalised = weightSum > 0 ? total / weightSum : 0;
  const score = Math.round(normalised * 100);

  // Pick top 3 contributing reasons
  const reasons = dimensions
    .filter((d) => weights[d.key] > 0 && d.reason && d.score >= 0.4)
    .sort((a, b) => b.score * weights[b.key] - a.score * weights[a.key])
    .slice(0, 3)
    .map((d) => d.reason);

  return { score, reasons };
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function findSuburbMatches(answers: QuizAnswers, limit = 6): Promise<FinderResult> {
  const state = answers.state === "any" ? undefined : answers.state;

  // Every suburb whose own page publishes a median, of more than 500
  // residents: about 2,800 across Australia on 29 Sep 2026, so the whole set
  // is scored and the cap below is never reached.
  const candidates = await db.suburb.findMany({
    where: {
      ...(state ? { state } : {}),
      ...LOCALITIES_ONLY,
      ...PUBLISHED_HOUSE_MEDIAN, ...notInvertedMedians(db.suburb.fields.medianHousePrice),
      population: { gt: 500 }, // skip tiny localities
    },
    select: {
      slug: true,
      name: true,
      state: true,
      postcode: true,
      medianHousePrice: true,
      annualGrowthHouse: true,
      statsSource: true,
      salesCountHouse: true,
      walkScore: true,
      population: true,
      householdsFamily: true,
      schools: { select: { icsea: true } },
    },
    take: 6000,
  });

  const none: FinderMeasured = { growth: false, yield: false, schools: false, walk: false, hazard: false };
  if (candidates.length === 0) return { matches: [], unmeasured: null, notes: finderNotes(answers, none) };

  // One query after another: the runtime pool holds a single connection.
  const hazards = await db.suburbHazard.findMany({
    where: { suburbSlug: { in: candidates.map((c) => c.slug) } },
    select: { suburbSlug: true, floodClass: true, bushfireRisk: true },
  });
  const hazardMap = new Map(
    hazards.filter((h) => h.floodClass != null || h.bushfireRisk != null).map((h) => [h.suburbSlug, h]),
  );

  // Rent and yield by the yield ranking's own rule (yieldFromSql): the
  // suburb's newest bond-data row, in the states where rent is measured for
  // the suburb itself, a population that makes a rental market, and a yield
  // inside the clamp the suburb pages use.
  const states = yieldStates(state);
  const rentRows = states.length === 0
    ? []
    : await db.$queryRawUnsafe<{ slug: string; rent: number }[]>(`SELECT s.slug, r.rent AS "rent" ${yieldFromSql(states)}`);
  const rentBySlug = new Map(rentRows.map((r) => [r.slug, Number(r.rent)]));

  const rows = candidates.map((c) => {
    const sales = publishedSales(c);
    const rent = rentBySlug.get(c.slug) ?? 0;
    const y = rent > 0 ? grossYieldPercent(rent, sales.medianHousePrice) : null;
    return { c, sales, grossYield: y == null ? null : parseFloat(y.toFixed(2)), hazard: hazardMap.get(c.slug) ?? null };
  });

  const measured: FinderMeasured = {
    growth: rows.some((r) => r.sales.annualGrowthHouse !== 0),
    yield: rows.some((r) => r.grossYield != null),
    schools: rows.some((r) => r.c.schools.some((s) => s.icsea != null)),
    walk: rows.some((r) => r.c.walkScore != null),
    hazard: hazardMap.size > 0,
  };
  const notes = finderNotes(answers, measured);
  const unmeasured = unmeasuredPriority(answers, measured);
  if (unmeasured) return { matches: [], unmeasured, notes };

  const weights = measuredWeights(finderWeights(answers), measured);

  const scored = rows.map(({ c, sales, grossYield, hazard }) => {
    const { score, reasons } = scoreSuburb(
      {
        medianHousePrice: sales.medianHousePrice,
        annualGrowthHouse: sales.annualGrowthHouse,
        walkScore: c.walkScore,
        grossYield,
        schools: c.schools,
        householdsFamily: c.householdsFamily,
        floodClass: hazard?.floodClass ?? null,
        bushfireRisk: hazard?.bushfireRisk ?? null,
      },
      answers,
      weights,
    );

    const icseaScores = c.schools.map((s) => s.icsea).filter((v): v is number => v != null);
    const avgIcsea = icseaScores.length > 0
      ? Math.round(icseaScores.reduce((a, b) => a + b, 0) / icseaScores.length)
      : null;

    return {
      slug: c.slug,
      name: c.name,
      state: c.state,
      postcode: c.postcode,
      medianHousePrice: sales.medianHousePrice,
      medianBasis: sales.basis,
      annualGrowthHouse: sales.annualGrowthHouse,
      walkScore: c.walkScore,
      grossYield,
      avgIcsea,
      population: c.population,
      score,
      reasons,
    };
  });

  // Sort by score desc, then by population desc as a tiebreaker (bigger
  // suburbs tend to be more relatable / safer recommendations), then by slug
  // so the same answers always give the same six.
  scored.sort((a, b) => b.score - a.score || b.population - a.population || a.slug.localeCompare(b.slug));

  return { matches: scored.slice(0, limit), unmeasured: null, notes };
}

export function priorityLabel(p: Priority): string {
  return PRIORITY_LABEL[p];
}
