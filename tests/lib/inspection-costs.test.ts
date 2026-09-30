// Commercial intent review 30 Sep 2026, section 3.7: the city cost table and
// FAQs on /guides/building-pest-inspection.
import { describe, expect, it } from "vitest";
import {
  ALL_CITIES,
  HOUSE_ALL,
  INSPECTION_COSTS,
  INSPECTION_FAQS,
  formatCostRange,
  spanAcross,
  type CostRange,
} from "@/lib/data/inspection-costs";

const CITIES = ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Hobart", "Canberra", "Darwin"];

describe("inspection cost table", () => {
  it("covers the eight capitals in order", () => {
    expect(ALL_CITIES).toEqual(CITIES);
  });
  it("names at least two dated sources per city, each an https page with its GST basis", () => {
    for (const c of INSPECTION_COSTS) {
      expect(c.sources.length, c.city).toBeGreaterThanOrEqual(2);
      for (const s of c.sources) {
        expect(s.href).toMatch(/^https:\/\//);
        expect(s.note).toMatch(/20\d\d/);
        expect(s.note).toMatch(/GST/);
      }
      expect(c.note.length).toBeGreaterThan(20);
    }
  });
  it("keeps every range ordered and inside what inspectors publish", () => {
    const check = (r: CostRange | null, label: string) => {
      if (!r) return;
      expect(r.low, label).toBeGreaterThan(150);
      expect(r.low, label).toBeLessThanOrEqual(r.high);
      expect(r.high, label).toBeLessThanOrEqual(1_200);
    };
    for (const c of INSPECTION_COSTS) {
      check(c.combined.unit, `${c.city} unit`);
      check(c.combined.small, `${c.city} small`);
      check(c.combined.house, `${c.city} house`);
      check(c.combined.large, `${c.city} large`);
      check(c.buildingOnly, `${c.city} building`);
      check(c.pestOnly, `${c.city} pest`);
      // A large home never starts below a standard house's floor.
      expect(c.combined.large.low, c.city).toBeGreaterThanOrEqual(c.combined.house.low);
    }
  });
  it("flags a single-source point figure, and says so in the city note", () => {
    for (const c of INSPECTION_COSTS) {
      const cells = [c.combined.unit, c.combined.small, c.combined.house, c.combined.large];
      if (cells.some((r) => r.single)) expect(c.note, c.city).toMatch(/Only iSPECT/);
    }
  });
});

describe("formatCostRange and spanAcross", () => {
  it("formats cells and prose", () => {
    expect(formatCostRange({ low: 395, high: 520 })).toBe("$395–$520");
    expect(formatCostRange({ low: 567, high: 695, open: true })).toBe("$567–$695+");
    expect(formatCostRange({ low: 468, high: 468, single: true })).toBe("$468*");
    expect(formatCostRange({ low: 567, high: 695, open: true }, "prose")).toBe("$567 to $695 or more");
    expect(formatCostRange({ low: 1_090, high: 1_090 }, "prose")).toBe("$1,090");
  });
  it("takes the lowest low and highest high across cities", () => {
    const r = spanAcross(["Sydney", "Perth"], (c) => c.combined.house);
    const syd = INSPECTION_COSTS.find((c) => c.city === "Sydney")!.combined.house;
    const per = INSPECTION_COSTS.find((c) => c.city === "Perth")!.combined.house;
    expect(r.low).toBe(Math.min(syd.low, per.low));
    expect(r.high).toBe(Math.max(syd.high, per.high));
  });
  it("says \"or more\" only when the range that sets the top is open-ended", () => {
    // Perth's pest-only "$274–$295+" is open but lower than Sydney's $534 top.
    const pest = spanAcross(["Sydney", "Perth"], (c) => c.pestOnly);
    expect(pest.high).toBe(534);
    expect(pest.open).toBe(false);
    const large = spanAcross(["Sydney"], (c) => c.combined.large);
    expect(large.open).toBe(true);
  });
});

describe("inspection FAQs", () => {
  const PAA: Array<[string, RegExp]> = [
    ["How much does a building and pest inspection cost in Australia?", /read 30 September 2026/],
    ["How much does a building and pest inspection cost in Victoria?", /BuyWise|iSPECT/],
    ["Who pays for building and pest inspection in QLD?", /REIQ/],
    ["Can you claim building and pest inspection cost?", /ATO/],
  ];
  it("answers every People Also Ask question in 40+ words with a figure and a named, dated source", () => {
    for (const [q, source] of PAA) {
      const f = INSPECTION_FAQS.find((x) => x.question === q);
      expect(f, q).toBeDefined();
      expect(f!.answer.split(/\s+/).length).toBeGreaterThanOrEqual(40);
      expect(f!.answer).toMatch(/\$[0-9,]+/);
      expect(f!.answer).toMatch(source);
      expect(f!.answer).toMatch(/20\d\d/);
    }
  });
  it("prints the national range from the table, so the answer and the table agree", () => {
    const f = INSPECTION_FAQS[0];
    expect(f.answer).toContain(formatCostRange(HOUSE_ALL, "prose"));
  });
  it("places the inspection fee in the cost base, not deductions", () => {
    const f = INSPECTION_FAQS.find((x) => x.question === "Can you claim building and pest inspection cost?")!;
    expect(f.answer).toMatch(/cost base/);
    expect(f.answer).toMatch(/Not as a deduction/);
  });
  it("has no em dash and no duplicate question", () => {
    const qs = INSPECTION_FAQS.map((f) => f.question);
    expect(new Set(qs).size).toBe(qs.length);
    for (const f of INSPECTION_FAQS) expect(`${f.question} ${f.answer}`).not.toMatch(/—/);
  });
});
