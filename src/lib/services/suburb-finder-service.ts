import { db } from "@/lib/db";

// ─── Quiz answer shape ──────────────────────────────────────────────────────

export type Priority = "growth" | "yield" | "schools" | "walkability" | "affordability" | "low-risk";
export type BudgetTier = "under-500k" | "500k-800k" | "800k-1.2m" | "1.2m-2m" | "over-2m";
export type LifestyleStage = "first-home" | "young-family" | "established-family" | "downsizer" | "investor";

export interface QuizAnswers {
  /** Top priority — drives the strongest weight in scoring */
  priority: Priority;
  /** State filter, "any" widens to all states */
  state: string | "any";
  /** Approximate budget range */
  budget: BudgetTier;
  /** Lifestyle stage — adjusts secondary weights */
  stage: LifestyleStage;
}

// ─── Result shape ──────────────────────────────────────────────────────────

export interface MatchedSuburb {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  medianHousePrice: number;
  annualGrowthHouse: number;
  walkScore: number | null;
  grossYield: number | null;
  avgIcsea: number | null;
  population: number;
  /** Total score 0–100, higher is better */
  score: number;
  /** Human-readable reasons we matched (top 2 to 3) */
  reasons: string[];
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
    return clamp01(ratio); // cheaper than tier — still partial credit
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

// ─── Scoring ────────────────────────────────────────────────────────────────

function scoreSuburb(
  s: {
    medianHousePrice: number;
    annualGrowthHouse: number;
    walkScore: number | null;
    medianRentHouse: number;
    schools: { icsea: number | null }[];
    householdsFamily: number;
    floodClass: string | null;
    bushfireRisk: string | null;
  },
  answers: QuizAnswers,
): { score: number; reasons: string[] } {
  // Compute per-dimension 0–1 scores
  const growthRaw = s.annualGrowthHouse;          // typically -5 to +25
  const growth = clamp01((growthRaw - 0) / 15);   // 0% → 0, 15%+ → 1

  const yieldRaw = s.medianHousePrice > 0 && s.medianRentHouse > 0
    ? (s.medianRentHouse * 52) / s.medianHousePrice * 100
    : null;
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

  const floodOk = s.floodClass == null || s.floodClass === "low" ? 1 : (s.floodClass === "medium" ? 0.5 : 0);
  const bushfireOk = s.bushfireRisk == null || s.bushfireRisk === "low" ? 1 : (s.bushfireRisk === "medium" ? 0.5 : 0);
  const lowRisk = (floodOk + bushfireOk) / 2;

  const familyShare = clamp01(s.householdsFamily / 80); // 80%+ family households → 1

  // Weight per priority, plus stage bumps
  const weights: Record<string, number> = {
    growth: 0,
    yield: 0,
    schools: 0,
    walk: 0,
    budget: 0.25, // budget always matters
    lowRisk: 0.10, // baseline weight on safety
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

  const dimensions: { key: keyof typeof weights; score: number; reason: string }[] = [
    { key: "growth",      score: growth,      reason: `Capital growth running ${growthRaw.toFixed(1)}% annually` },
    { key: "yield",       score: yieldScore,  reason: yieldRaw != null ? `Gross rental yield around ${yieldRaw.toFixed(1)}%` : "" },
    { key: "schools",     score: schools,     reason: avgIcsea != null ? `Strong school catchment (avg ICSEA ${avgIcsea})` : "" },
    { key: "walk",        score: walk,        reason: s.walkScore != null ? `Walk Score of ${s.walkScore}` : "" },
    { key: "budget",      score: budget,      reason: budget >= 0.95 ? `Median price fits your budget` : (budget >= 0.5 ? `Median price close to your budget` : "") },
    { key: "lowRisk",     score: lowRisk,     reason: lowRisk === 1 ? `Low flood and bushfire risk` : (lowRisk >= 0.5 ? `Moderate hazard risk` : "") },
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

export async function findMatchingSuburbs(
  answers: QuizAnswers,
  limit = 6,
): Promise<MatchedSuburb[]> {
  // Pre-filter by state if specified, and require at least basic data so we
  // don't recommend empty profiles.
  const stateFilter = answers.state === "any" ? {} : { state: answers.state };

  // Use a wider candidate set than the limit so scoring has room to discriminate.
  const candidates = await db.suburb.findMany({
    where: {
      ...stateFilter,
      medianHousePrice: { gt: 0 },
      population: { gt: 500 }, // skip tiny localities
    },
    select: {
      slug: true,
      name: true,
      state: true,
      postcode: true,
      medianHousePrice: true,
      annualGrowthHouse: true,
      walkScore: true,
      population: true,
      medianRentHouse: true,
      householdsFamily: true,
      schools: { select: { icsea: true } },
    },
    take: 1500, // cap; we score in memory
  });

  if (candidates.length === 0) return [];

  // Pull hazard for the candidate set in one query
  const hazards = await db.suburbHazard.findMany({
    where: { suburbSlug: { in: candidates.map((c) => c.slug) } },
    select: { suburbSlug: true, floodClass: true, bushfireRisk: true },
  });
  const hazardMap = new Map(hazards.map((h) => [h.suburbSlug, h]));

  const scored = candidates.map((c) => {
    const h = hazardMap.get(c.slug);
    const { score, reasons } = scoreSuburb(
      {
        medianHousePrice: c.medianHousePrice,
        annualGrowthHouse: c.annualGrowthHouse,
        walkScore: c.walkScore,
        medianRentHouse: c.medianRentHouse,
        schools: c.schools,
        householdsFamily: c.householdsFamily,
        floodClass: h?.floodClass ?? null,
        bushfireRisk: h?.bushfireRisk ?? null,
      },
      answers,
    );

    const icseaScores = c.schools.map((s) => s.icsea).filter((v): v is number => v != null);
    const avgIcsea = icseaScores.length > 0
      ? Math.round(icseaScores.reduce((a, b) => a + b, 0) / icseaScores.length)
      : null;

    const grossYield = c.medianHousePrice > 0 && c.medianRentHouse > 0
      ? parseFloat(((c.medianRentHouse * 52) / c.medianHousePrice * 100).toFixed(2))
      : null;

    return {
      slug: c.slug,
      name: c.name,
      state: c.state,
      postcode: c.postcode,
      medianHousePrice: c.medianHousePrice,
      annualGrowthHouse: c.annualGrowthHouse,
      walkScore: c.walkScore,
      grossYield,
      avgIcsea,
      population: c.population,
      score,
      reasons,
    };
  });

  // Sort by score desc, then by population desc as a tiebreaker (bigger
  // suburbs tend to be more relatable / safer recommendations).
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.population - a.population;
  });

  return scored.slice(0, limit);
}

export function priorityLabel(p: Priority): string {
  return PRIORITY_LABEL[p];
}
