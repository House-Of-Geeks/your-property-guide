// The suburb finder scores what each suburb's own page publishes, leaves out
// what it cannot measure, and says so (fix item 47, cohort 3).
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  finderNotes,
  finderWeights,
  measuredWeights,
  scoreSuburb,
  unmeasuredPriority,
  type FinderMeasured,
  type QuizAnswers,
  type ScoredInput,
} from "@/lib/services/suburb-finder-service";

const answers = (over: Partial<QuizAnswers> = {}): QuizAnswers => ({
  priority: "affordability", state: "any", budget: "500k-800k", stage: "first-home", ...over,
});
const all: FinderMeasured = { growth: true, yield: true, schools: true, walk: true, hazard: true };
const suburb = (over: Partial<ScoredInput> = {}): ScoredInput => ({
  medianHousePrice: 650_000, annualGrowthHouse: 0, walkScore: null, grossYield: null,
  schools: [], householdsFamily: 50, floodClass: null, bushfireRisk: null, ...over,
});

describe("weights", () => {
  it("are the ones the quiz has always used", () => {
    expect(finderWeights(answers({ priority: "growth", stage: "investor" }))).toEqual({
      growth: 0.4, yield: 0.2, schools: 0, walk: 0, budget: 0.2, lowRisk: 0.1, familyShare: 0,
    });
    expect(finderWeights(answers({ priority: "low-risk", stage: "downsizer" }))).toEqual({
      growth: 0, yield: 0, schools: 0, walk: 0.15, budget: 0.2, lowRisk: 0.4, familyShare: 0,
    });
    expect(finderWeights(answers({ priority: "affordability", stage: "first-home" }))).toEqual({
      growth: 0.1, yield: 0, schools: 0, walk: 0, budget: 0.5, lowRisk: 0.1, familyShare: 0,
    });
  });
  it("drop a dimension nobody has a figure for", () => {
    const w = measuredWeights(finderWeights(answers({ priority: "schools", stage: "investor" })), { ...all, growth: false, hazard: false });
    expect(w.growth).toBe(0);
    expect(w.lowRisk).toBe(0);
    expect(w.yield).toBe(0.2);
    expect(w.schools).toBe(0.4);
    expect(w.budget).toBe(0.25);
  });
});

describe("a priority that cannot be measured", () => {
  it("is not ranked, and the page says why", () => {
    expect(unmeasuredPriority(answers({ priority: "growth", state: "VIC" }), { ...all, growth: false }))
      .toBe("We hold no 12-month change for Victoria: the figures we publish there come without one. New South Wales and South Australia have one. Pick another priority and we will match on that.");
    expect(unmeasuredPriority(answers({ priority: "yield", state: "NSW" }), { ...all, yield: false })).toContain("published by postcode, not by suburb");
    expect(unmeasuredPriority(answers({ priority: "yield", state: "SA" }), { ...all, yield: false })).toContain("checking the South Australian sales medians");
    expect(unmeasuredPriority(answers({ priority: "yield", state: "TAS" }), { ...all, yield: false })).toContain("no rent measured suburb by suburb for Tasmania");
    expect(unmeasuredPriority(answers({ priority: "low-risk" }), { ...all, hazard: false })).toContain("no flood or bushfire record");
  });
  it("points to another state only from a state that is not measured", () => {
    // A feed that is late or empty: Queensland is normally measured, so there is nowhere to point.
    expect(unmeasuredPriority(answers({ priority: "yield", state: "QLD" }), { ...all, yield: false }))
      .toBe("We hold no rent measured suburb by suburb for Queensland yet. Pick another priority and we will match on that.");
    expect(unmeasuredPriority(answers({ priority: "growth", state: "NSW" }), { ...all, growth: false }))
      .toBe("We hold no 12-month change for New South Wales yet. Pick another priority and we will match on that.");
    expect(unmeasuredPriority(answers({ priority: "growth" }), { ...all, growth: false })).toContain("for these suburbs yet.");
  });
  it("is ranked where it can be", () => {
    expect(unmeasuredPriority(answers({ priority: "growth", state: "NSW" }), all)).toBeNull();
    expect(unmeasuredPriority(answers({ priority: "yield", state: "QLD" }), all)).toBeNull();
    // Budget is measured for every suburb matched: each has a published median.
    expect(unmeasuredPriority(answers({ priority: "affordability" }), { growth: false, yield: false, schools: false, walk: false, hazard: false })).toBeNull();
  });
});

describe("notes under the matches", () => {
  it("always say where the prices come from", () => {
    const n = finderNotes(answers({ priority: "schools", stage: "young-family" }), all);
    expect(n).toHaveLength(1);
    expect(n[0]).toContain("Only suburbs with a published median are matched.");
    expect(finderNotes(answers({ priority: "schools", stage: "young-family", state: "WA" }), all)[0]).toContain("ABS statistical-area (SA2) medians");
  });
  it("say what the score left out", () => {
    const n = finderNotes(answers({ priority: "schools", stage: "investor", state: "WA" }), { ...all, growth: false, yield: false });
    expect(n).toHaveLength(3);
    expect(n[0]).toBe("We hold no 12-month change for Western Australia: the figures we publish there come without one. New South Wales and South Australia have one. Growth is left out of the score.");
    expect(n[1]).toContain("Yield is left out of the score.");
  });
  it("say which states carry growth and yield in a search of all of them", () => {
    const n = finderNotes(answers({ priority: "growth", stage: "investor" }), all);
    expect(n[0]).toContain("measured in New South Wales and South Australia only");
    expect(n[1]).toContain("worked out in Victoria and Queensland only");
    expect(finderNotes(answers({ priority: "growth", stage: "investor", state: "NSW" }), { ...all, yield: false })[0]).toContain("published by postcode");
  });
  it("mention hazard only where the answers raised it", () => {
    const none = { ...all, hazard: false };
    expect(finderNotes(answers({ priority: "schools", stage: "young-family" }), none)).toHaveLength(1);
    expect(finderNotes(answers({ priority: "schools", stage: "downsizer" }), none)[0]).toBe("We hold no flood or bushfire record for these suburbs yet. Hazard is left out of the score.");
  });
});

describe("scoring", () => {
  const w = (a: QuizAnswers, m: FinderMeasured = all) => measuredWeights(finderWeights(a), m);

  it("claims no low hazard where there is no record", () => {
    const a = answers({ priority: "low-risk", stage: "downsizer" });
    const unknown = scoreSuburb(suburb(), a, w(a));
    expect(unknown.reasons.join(" ")).not.toMatch(/risk/i);
    const low = scoreSuburb(suburb({ floodClass: "low", bushfireRisk: "low" }), a, w(a));
    expect(low.reasons).toContain("Low flood and bushfire risk");
    expect(low.score).toBeGreaterThan(unknown.score);
    expect(scoreSuburb(suburb({ floodClass: "low" }), a, w(a)).reasons).toContain("Low flood risk");
    expect(scoreSuburb(suburb({ floodClass: "high", bushfireRisk: "low" }), a, w(a)).reasons).toContain("Moderate hazard risk");
  });
  it("prints a change only where one is published", () => {
    const a = answers({ priority: "growth", stage: "investor", state: "NSW" });
    expect(scoreSuburb(suburb({ annualGrowthHouse: 0 }), a, w(a)).reasons.join(" ")).not.toMatch(/12 months/);
    expect(scoreSuburb(suburb({ annualGrowthHouse: 8.7 }), a, w(a)).reasons).toContain("Median up 8.7% over 12 months");
  });
  it("scores over what was measured, so a missing dimension does not drag the score down", () => {
    const a = answers({ priority: "schools", stage: "downsizer", budget: "500k-800k" });
    // Full marks on schools, walkability, budget and family share; no hazard record.
    const s = suburb({ schools: [{ icsea: 1100 }], walkScore: 90, householdsFamily: 80 });
    expect(scoreSuburb(s, a, w(a, { ...all, hazard: false })).score).toBe(100);
    expect(scoreSuburb(s, a, w(a)).score).toBe(86); // hazard weighs 0.15 of 1.05 and scores nothing
  });
});

describe("the query", () => {
  const service = fs.readFileSync("src/lib/services/suburb-finder-service.ts", "utf8");
  it("matches only suburbs with a published median, and takes rent by the yield ranking's rule", () => {
    expect(service).toContain("...PUBLISHED_HOUSE_MEDIAN,");
    expect(service).not.toMatch(/medianRentHouse:\s*true/);
    expect(service).toContain("${yieldFromSql(states)}");
    expect(service).toContain("const states = yieldStates(state);");
  });
  it("runs one query after another", () => {
    expect(service).not.toContain("Promise.all");
  });
});
