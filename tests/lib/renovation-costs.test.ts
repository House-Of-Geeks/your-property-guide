// Commercial intent review (30 Sep 2026), section 3.7, priority 9: the
// renovation cost tables, the estimator built from them and the
// People-also-ask FAQs on /guides/renovation-cost-australia-2026.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  ARCHICENTRE_2026,
  CHECK_TABLES,
  COST_ITEMS,
  COST_ITEM_BY_KEY,
  FINISHES,
  KDR_ROWS,
  ON_COSTS,
  RENOVATION_FAQS,
  RENOVATION_PAA_QUESTIONS,
  RENOVATION_SOURCES,
  RENOVATION_SOURCE_ORDER,
  ROOM_ANSWERS,
  SCOPE_PER_M2,
  STATE_COSTS,
  STATE_ORDER,
  grannyFlatBuildRange,
  rangeCellText,
  rangeText,
  type Range,
} from "@/lib/data/renovation-costs";
import {
  cellForFinish,
  defaultRenovationInput,
  estimateRenovation,
  roundForDisplay,
  stateAdjustment,
} from "@/lib/renovation-estimate";

const PAGE = readFileSync(
  join(__dirname, "../../src/app/(marketing)/guides/renovation-cost-australia-2026/page.tsx"),
  "utf8",
);

function expectRange(r: Range | null) {
  if (r === null) return;
  expect(r.low).toBeGreaterThan(0);
  expect(r.high).toBeGreaterThanOrEqual(r.low);
}

describe("renovation cost sources", () => {
  it("every source used by a table is dated and, except this guide, linked", () => {
    for (const id of RENOVATION_SOURCE_ORDER) {
      const s = RENOVATION_SOURCES[id];
      expect(s.date).toMatch(/20(23|24|25|26)/);
      expect(s.label.length).toBeGreaterThan(20);
      expect(s.href).toMatch(/^https:\/\//);
    }
    expect(RENOVATION_SOURCES.guide.href).toBeNull();
  });
  it("every cell cites a known source, and empty cells stay empty rather than guessed", () => {
    for (const item of COST_ITEMS) {
      for (const f of FINISHES) {
        const c = item.byFinish[f];
        expect(RENOVATION_SOURCES[c.source]).toBeDefined();
        expectRange(c.range);
      }
    }
    for (const row of KDR_ROWS) {
      // A row is either one range across every finish (demolition) or one cell per finish.
      expect(Boolean(row.all) !== Boolean(row.byFinish)).toBe(true);
      const cells = row.all ? [row.all] : FINISHES.map((f) => row.byFinish?.[f]);
      for (const c of cells) {
        expect(c).toBeDefined();
        expect(RENOVATION_SOURCES[c!.source]).toBeDefined();
        expectRange(c!.range);
      }
    }
    for (const t of CHECK_TABLES) {
      for (const row of t.rows) {
        expect(RENOVATION_SOURCES[row.source]).toBeDefined();
        expect(row.cells).toHaveLength(t.columns.length - 2);
        for (const c of row.cells) {
          if (typeof c === "string") expect(c).toMatch(/\$[0-9,]+|%/);
          else expectRange(c);
        }
      }
    }
    // The cells the review said to leave blank rather than guess.
    expect(COST_ITEM_BY_KEY.laundry.byFinish.basic.range).toBeNull();
    expect(COST_ITEM_BY_KEY.secondStorey.byFinish.high.range).toBeNull();
    expect(STATE_COSTS.TAS.rlbCustom).toBeNull();
    expect(STATE_COSTS.ACT.ckaPct).toBeNull();
    expect(STATE_COSTS.NT.absNewHousePerM2).toBeNull();
    // Landmark Valuations (the dated source) publishes no Tasmania per-m² figure.
    expect(STATE_COSTS.TAS.absNewHousePerM2).toBeNull();
  });
  it("keeps the guide's own figures the page has quoted since May 2026", () => {
    expect(COST_ITEM_BY_KEY.kitchen.byFinish.mid.range).toEqual({ low: 25_000, high: 45_000 });
    expect(COST_ITEM_BY_KEY.bathroom.byFinish.mid.range).toEqual({ low: 15_000, high: 22_000 });
    expect(SCOPE_PER_M2.guide.mid).toEqual({ low: 2_800, high: 4_500 });
    expect(COST_ITEM_BY_KEY.extension.byFinish.mid.range).toEqual({ low: 3_500, high: 5_500 });
    expect(COST_ITEM_BY_KEY.secondStorey.byFinish.mid.range).toEqual({ low: 4_500, high: 7_000 });
  });
  it("covers all eight states in a fixed order with a capital each", () => {
    expect(STATE_ORDER).toHaveLength(8);
    for (const s of STATE_ORDER) {
      expect(STATE_COSTS[s].capital.length).toBeGreaterThan(3);
      expectRange(STATE_COSTS[s].rlbCustom);
    }
  });
  it("formats ranges plainly, with an open high figure as 'or more' in prose and '+' in a cell", () => {
    expect(rangeText({ low: 12_000, high: 18_000 })).toBe("$12,000 to $18,000");
    expect(rangeText({ low: 60_000, high: 60_000, open: true })).toBe("$60,000 or more");
    expect(rangeText({ low: 3_500, high: 5_500 }, "/m²")).toBe("$3,500/m² to $5,500/m²");
    expect(rangeCellText({ low: 60_000, high: 60_000, open: true })).toBe("$60,000+");
    expect(rangeCellText({ low: 7_000, high: 15_000, open: true })).toBe("$7,000 to $15,000+");
    expect(rangeCellText({ low: 2_500, high: 7_600 }, "/m²")).toBe("$2,500 to $7,600 /m²");
  });
});

describe("granny flat build range (Archicentre Cost Guide 2026)", () => {
  it("pins the Archicentre 2026 figures the five state guides use", () => {
    expect(ARCHICENTRE_2026.newConstructionPerM2).toEqual({ low: 2_700, high: 5_100 });
    expect(ARCHICENTRE_2026.renovationPerM2).toEqual({ low: 1_600, high: 3_900 });
    expect(ARCHICENTRE_2026.kitchen).toEqual({ low: 23_000, high: 49_000 });
    expect(ARCHICENTRE_2026.bathroom).toEqual({ low: 17_500, high: 35_000 });
    expect(ARCHICENTRE_2026.laundry).toEqual({ low: 10_000, high: 19_000 });
  });
  it("adds the shell rate times the area to one kitchen and one bathroom fit-out, as the guide says", () => {
    expect(grannyFlatBuildRange(60)).toEqual({ low: 2_700 * 60 + 23_000 + 17_500, high: 5_100 * 60 + 49_000 + 35_000 });
    expect(grannyFlatBuildRange(40)).toEqual({ low: 148_500, high: 288_000 });
    expect(grannyFlatBuildRange(70)).toEqual({ low: 229_500, high: 441_000 });
  });
});

describe("estimateRenovation", () => {
  it("adds the guide's mid-range kitchen and bathroom for NSW with no adjustment, then the on-costs", () => {
    const r = estimateRenovation(defaultRenovationInput("NSW"));
    expect(r.lines.map((l) => l.key)).toEqual(["kitchen", "bathroom"]);
    expect(r.subtotal).toEqual({ low: 40_000, high: 67_000, open: false });
    expect(r.adjustment.lowPct).toBe(0);
    expect(r.adjusted.low).toBe(40_000);
    expect(r.adjusted.high).toBe(67_000);
    const d = ON_COSTS.designAndApprovalsPct;
    const c = ON_COSTS.contingencyPct;
    expect(r.budget.low).toBe(Math.round(40_000 * (1 + (d.low + c.low) / 100)));
    expect(r.budget.high).toBe(Math.round(67_000 * (1 + (d.high + c.high) / 100)));
    expect(r.empty).toBe(false);
  });
  it("applies the CKA capital adjustment and the regional premium to both ends", () => {
    const base = { ...defaultRenovationInput("QLD"), bathrooms: 0 };
    const r = estimateRenovation(base);
    expect(r.adjustment).toMatchObject({ lowPct: 4, highPct: 4 });
    expect(r.adjusted).toEqual({ low: 26_000, high: 46_800, open: false });
    const rural = estimateRenovation({ ...base, regional: true });
    expect(rural.adjustment).toMatchObject({ lowPct: 9, highPct: 19 });
    expect(rural.adjusted.low).toBe(Math.round(25_000 * 1.09));
    expect(rural.adjusted.high).toBe(Math.round(45_000 * 1.19));
    const vic = stateAdjustment("VIC", false);
    expect(vic.lowPct).toBe(-1);
    expect(vic.label).toContain("minus 1%");
  });
  it("applies no adjustment where CKA publishes none and says so", () => {
    for (const s of ["ACT", "NT"] as const) {
      const a = stateAdjustment(s, false);
      expect(a.lowPct).toBe(0);
      expect(a.label).toContain("No published adjustment");
    }
  });
  it("flags an open-ended total when a premium line has no published ceiling", () => {
    const r = estimateRenovation({ ...defaultRenovationInput("SA"), finish: "high" });
    expect(r.lines.find((l) => l.key === "kitchen")).toMatchObject({ low: 60_000, high: 60_000, open: true });
    expect(r.subtotal.open).toBe(true);
    expect(r.budget.open).toBe(true);
  });
  it("falls back to the mid-range cell where a finish level has no published figure, and names it", () => {
    const laundry = cellForFinish("laundry", "high");
    expect(laundry?.fellBack).toBe(true);
    const r = estimateRenovation({ ...defaultRenovationInput("WA"), kitchen: false, bathrooms: 0, laundry: true, finish: "basic", secondStoreyM2: 60 });
    const l = r.lines.find((x) => x.key === "laundry");
    expect(l).toMatchObject({ low: 10_000, high: 19_000 });
    expect(l?.basis).toContain("mid-range used");
    const ss = r.lines.find((x) => x.key === "secondStorey");
    expect(ss).toMatchObject({ quantity: 60, low: 270_000, high: 420_000 });
  });
  it("adds 10% GST to a source that publishes without it (CKA extension shell)", () => {
    const r = estimateRenovation({ ...defaultRenovationInput("NSW"), kitchen: false, bathrooms: 0, finish: "basic", extensionM2: 10 });
    const e = r.lines.find((x) => x.key === "extension");
    expect(e).toMatchObject({ unitLow: 2_761, unitHigh: 4_136, low: 27_610, high: 41_360 });
    expect(e?.basis).toContain("plus 10% GST");
  });
  it("multiplies per-room lines by the count and clamps bad input", () => {
    const r = estimateRenovation({ ...defaultRenovationInput("VIC"), kitchen: false, bathrooms: 2, bedrooms: 3 });
    expect(r.lines.find((x) => x.key === "bathroom")).toMatchObject({ quantity: 2, low: 30_000, high: 44_000 });
    expect(r.lines.find((x) => x.key === "bedroom")).toMatchObject({ quantity: 3, low: 3_000, high: 6_000 });
    const bad = estimateRenovation({ ...defaultRenovationInput("VIC"), kitchen: false, bathrooms: -2, bedrooms: NaN, extensionM2: -50, secondStoreyM2: 5_000 });
    expect(bad.lines.map((l) => l.key)).toEqual(["secondStorey"]);
    expect(bad.lines[0].quantity).toBe(1_000);
  });
  it("returns an empty estimate when nothing is selected", () => {
    const r = estimateRenovation({ ...defaultRenovationInput("TAS"), kitchen: false, bathrooms: 0 });
    expect(r.empty).toBe(true);
    expect(r.subtotal).toEqual({ low: 0, high: 0, open: false });
  });
  it("rounds display figures to $1,000, or $100 under $10,000", () => {
    expect(roundForDisplay(67_449)).toBe(67_000);
    expect(roundForDisplay(67_500)).toBe(68_000);
    expect(roundForDisplay(4_149)).toBe(4_100);
  });
});

describe("renovation guide copy", () => {
  it("answers the four People-also-ask questions in 40+ words with a figure and a dated source (rule 9)", () => {
    for (const q of RENOVATION_PAA_QUESTIONS) {
      const f = RENOVATION_FAQS.find((x) => x.question === q);
      expect(f, q).toBeDefined();
      const a = f?.answer ?? "";
      expect(a.split(/\s+/).length).toBeGreaterThanOrEqual(40);
      expect(a).toMatch(/\$[0-9,]+/);
      expect(a).toMatch(/Archicentre|Three Birds|Canstar|Rider Levett Bucknall|ABS|Landmark/);
      expect(a).toMatch(/20(25|26)/);
    }
    expect(new Set(RENOVATION_FAQS.map((f) => f.question)).size).toBe(RENOVATION_FAQS.length);
  });
  it("gives each room section a one-sentence dated answer built from the tables", () => {
    for (const [key, sentence] of Object.entries(ROOM_ANSWERS)) {
      expect(sentence, key).toMatch(/^As at September 2026, /);
      expect(sentence).toMatch(/\$[0-9,]+/);
      expect(sentence.trim().endsWith(".")).toBe(true);
      expect(sentence.split(/\. [A-Z]/).length).toBe(1);
    }
    expect(ROOM_ANSWERS.kitchen).toContain("$25,000 to $45,000");
    expect(ROOM_ANSWERS.bathroom).toContain("$15,000 to $22,000");
  });
  it("the page renders the estimator, the tables and the FAQs from the data module, and keeps its URL and sections", () => {
    expect(PAGE).toContain('slug: "renovation-cost-australia-2026"');
    expect(PAGE).toContain("RenovationCostEstimator");
    expect(PAGE).toContain("RenovationAtAGlanceTable");
    expect(PAGE).toContain("RenovationPerM2Table");
    expect(PAGE).toContain("RenovationByStateTable");
    expect(PAGE).toContain("faqs={RENOVATION_FAQS}");
    for (const id of ["at-a-glance", "estimator", "cost-per-m2", "cost-by-state", "kitchens", "bathrooms", "laundry-living-bedrooms", "full-renovation", "extensions", "knock-down-rebuild", "pre-construction", "fixed-vs-cost-plus", "finance", "what-adds-value", "budgeting-method"]) {
      expect(PAGE, id).toContain(`id: "${id}"`);
      expect(PAGE, id).toContain(`id="${id}"`);
    }
    expect(PAGE).toContain('updatedAt: "2026-10-11"');
  });
  it("quotes no unsourced return ratios and no national granny flat range (review 10 Oct 2026, F8 and F8c)", () => {
    const valueFaq = RENOVATION_FAQS.find((f) => f.question === "Will renovating add value at sale?")?.answer ?? "";
    for (const text of [PAGE, valueFaq]) {
      expect(text).not.toMatch(/\d(\.\d)?× (to|cost)/);
      expect(text).not.toMatch(/\d(\.\d)?–\d+(\.\d)?× /);
      expect(text).not.toContain("$130,000–$220,000");
      expect(text).not.toMatch(/best ROI/);
    }
    expect(PAGE).toContain("/guides/what-to-fix-before-selling-a-house");
    expect(PAGE).toContain("<h3>What devalues a house</h3>");
    for (const st of ["nsw", "vic", "qld", "wa", "sa"]) expect(PAGE).toContain(`/guides/granny-flat-guide-${st}`);
  });
});
