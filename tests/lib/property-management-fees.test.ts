// Commercial intent review (30 Sep 2026), section 3.7: the state fee table,
// the annual cost calculator and the People-also-ask FAQ on
// /guides/property-management-fees-australia.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { computePmFees, defaultPmFeesInput, renewalsPerYear } from "@/lib/property-management-fees-calc";
import {
  PM_FEE_SOURCES,
  PM_FEE_SOURCE_LIST,
  PM_FEES_FAQS,
  PM_NATIONAL,
  PM_STATE_FEES,
  PM_STATE_ORDER,
  dollarCell,
  averageOutsideRange,
  differentSurveyNote,
  lettingCell,
  managementCell,
  noPublishedRange,
  stateFeeAnswer,
  type PmSourceKey,
} from "@/lib/data/property-management-fees";

const PAGE = join(__dirname, "../../src/app/(marketing)/guides/property-management-fees-australia/page.tsx");
const sentences = (s: string) => s.split(/(?<=[.?!])\s+(?=[A-Z])/).filter(Boolean);
const NAMED_SOURCE =
  /LocalAgentFinder|REIQ|WhichRealEstateAgent|Consumer Affairs Victoria|Consumer Protection WA|REIWA|Queensland Government|Property Occupations Act|NSW Government|ATO/;

describe("computePmFees", () => {
  it("works Perth at $600 a week from the published figures: every line, the total and its share of rent", () => {
    const d = defaultPmFeesInput("WA", 600);
    expect(d).toMatchObject({ managementPct: 8.7, lettingWeeks: 1.7, tenancyYears: 2, renewalFee: 200, inspectionFee: 75, inspectionsPerYear: 4, adminFeePerYear: 30, feesIncludeGst: true });
    const r = computePmFees(d);
    expect(r.annualRent).toBe(31_200);
    expect(r.managementCost).toBe(2_714);        // 8.7% of $31,200
    expect(r.lettingFeeOnce).toBe(1_020);        // 1.7 weeks
    expect(r.lettingCost).toBe(510);             // spread over two years
    expect(r.renewalsPerYear).toBe(0.5);
    expect(r.lines.map((l) => [l.key, l.amount])).toEqual([
      ["management", 2_714],
      ["letting", 510],
      ["renewal", 100],
      ["inspections", 300],
      ["admin", 30],
    ]);
    expect(r.gst).toBe(0);
    expect(r.total).toBe(3_654);
    expect(r.pctOfRent).toBe(11.7);
  });
  it("omits the lines a state has no published figure for, and adds GST only when the quote excludes it", () => {
    const nsw = computePmFees(defaultPmFeesInput("NSW", 600));
    expect(nsw.lines.map((l) => l.key)).toEqual(["management", "letting"]);
    expect(nsw.total).toBe(1_810 + 330);
    expect(nsw.pctOfRent).toBe(6.9);
    const exGst = computePmFees({ ...defaultPmFeesInput("NSW", 600), feesIncludeGst: false });
    expect(exGst.gst).toBe(214);
    expect(exGst.lines.at(-1)).toMatchObject({ key: "gst", amount: 214 });
    expect(exGst.total).toBe(2_140 + 214);
  });
  it("spreads the letting fee and counts renewals from the tenancy length on 12-month leases", () => {
    expect(renewalsPerYear(1)).toBe(0);
    expect(renewalsPerYear(2)).toBe(0.5);
    expect(renewalsPerYear(1.5)).toBeCloseTo(2 / 3, 6);
    expect(renewalsPerYear(3)).toBeCloseTo(2 / 3, 6);
    expect(renewalsPerYear(0)).toBe(0);
    const one = computePmFees({ ...defaultPmFeesInput("WA", 600), tenancyYears: 1 });
    expect(one.lettingCost).toBe(1_020);
    expect(one.lines.find((l) => l.key === "renewal")).toBeUndefined();
  });
  it("clamps negative inputs to zero and reports no percentage at a zero rent", () => {
    const r = computePmFees({ ...defaultPmFeesInput("QLD", 0), managementPct: -3, lettingWeeks: -1 });
    expect(r.annualRent).toBe(0);
    expect(r.total).toBe(0);
    expect(r.pctOfRent).toBe(0);
    expect(r.lines).toEqual([{ key: "management", label: "Management fee", amount: 0 }]);
  });
  it("starts every state at its published average and the midpoint of each published extra, nothing where none is published", () => {
    for (const s of PM_STATE_ORDER) {
      const f = PM_STATE_FEES[s];
      const d = defaultPmFeesInput(s, 700);
      expect(d.managementPct).toBe(f.management.average);
      expect(d.lettingWeeks).toBe(f.letting.average);
      expect(d.inspectionsPerYear).toBe(f.inspectionsPerYear);
      expect(d.renewalFee).toBe(f.renewal ? (f.renewal.unit === "weeks" ? Math.round((700 * (f.renewal.low + f.renewal.high)) / 2) : Math.round((f.renewal.low + f.renewal.high) / 2)) : 0);
      expect(d.inspectionFee).toBe(f.inspection ? Math.round((f.inspection.low + f.inspection.high) / 2) : 0);
      expect(d.adminFeePerYear).toBe(f.admin ? Math.round((f.admin.low + f.admin.high) / 2) : 0);
    }
    expect(defaultPmFeesInput("SA", 700).renewalFee).toBe(700); // often one week's rent
  });
  it("keeps the FAQ's all-in range honest: NSW about 7% and WA about 12% of rent at the defaults", () => {
    const nsw = computePmFees(defaultPmFeesInput("NSW", 600)).pctOfRent;
    const wa = computePmFees(defaultPmFeesInput("WA", 600)).pctOfRent;
    expect(nsw).toBeGreaterThanOrEqual(6.5);
    expect(nsw).toBeLessThanOrEqual(7.5);
    expect(wa).toBeGreaterThanOrEqual(11.5);
    expect(wa).toBeLessThanOrEqual(12.5);
    const faq = PM_FEES_FAQS.find((f) => f.question === "What is the average property management fee in Australia?");
    expect(faq?.answer).toContain("about 7% of annual rent");
    expect(faq?.answer).toContain("about 12%");
  });
});

describe("state fee table", () => {
  it("covers the eight states with a sourced range and average, and every source carries a date", () => {
    expect(PM_STATE_ORDER).toHaveLength(8);
    const keys = new Set(Object.keys(PM_FEE_SOURCES));
    for (const s of PM_STATE_ORDER) {
      const f = PM_STATE_FEES[s];
      expect(f.state).toBe(s);
      expect(f.management.low).toBeLessThanOrEqual(f.management.high);
      expect(f.management.average).toBeGreaterThan(0);
      expect(f.management.sources).toContain("laf");
      expect(f.letting.average).toBeGreaterThan(0);
      if (f.letting.low !== undefined) expect(f.letting.low).toBeLessThanOrEqual(f.letting.high!);
      for (const line of [f.renewal, f.inspection, f.admin]) {
        if (!line) continue;
        expect(line.low).toBeLessThanOrEqual(line.high);
        expect(line.sources.length).toBeGreaterThan(0);
      }
      const used: PmSourceKey[] = [...f.management.sources, ...f.letting.sources, ...(f.renewal?.sources ?? []), ...(f.inspection?.sources ?? []), ...(f.admin?.sources ?? [])];
      for (const k of used) expect(keys.has(k), k).toBe(true);
      expect(f.regulated.length).toBeGreaterThan(80);
    }
    for (const src of PM_FEE_SOURCE_LIST) {
      expect(src.date).toMatch(/20(2[0-9])/);
      expect(src.href).toMatch(/^https:\/\//);
    }
    expect(PM_FEE_SOURCE_LIST.map((s) => s.n)).toEqual(PM_FEE_SOURCE_LIST.map((_, i) => i + 1));
  });
  it("matches the AI Overview's state averages (LocalAgentFinder, March 2026)", () => {
    expect(PM_STATE_FEES.NSW.management.average).toBe(5.8);
    expect(PM_STATE_FEES.VIC.management.average).toBe(5.9);
    expect(PM_STATE_FEES.QLD.management.average).toBe(7.5);
    expect(PM_STATE_FEES.WA.management.average).toBe(8.7);
    expect(PM_STATE_FEES.SA.management.average).toBe(7.5);
    expect(PM_STATE_FEES.TAS.management.average).toBe(8.7);
    expect(PM_NATIONAL.managementAverage).toBe(7.5);
  });
  it("prints a footnoted cell for every published figure and says so where a state has no published range", () => {
    const wa = PM_STATE_FEES.WA;
    expect(managementCell(wa)).toEqual({ text: "8.5% to 11% (Perth; 11% or more in regional WA); state average 8.7%", refs: [1, 2, 6] });
    expect(lettingCell(wa)).toEqual({
      text: "2 to 3 weeks; state average 1.7 weeks (LocalAgentFinder, March 2026, a different survey that sits below this range)",
      refs: [1, 6],
    });
    expect(dollarCell("WA", wa.inspection)).toEqual({ text: "$50 to $100 (each, at most four a year)", refs: [6, 16] });
    expect(dollarCell("SA", PM_STATE_FEES.SA.renewal)).toEqual({ text: "1 week's rent (often one week's rent)", refs: [7] });
    expect(lettingCell(PM_STATE_FEES.NT)).toEqual({ text: "about 1 week (state average)", refs: [1] });
    expect(lettingCell(PM_STATE_FEES.QLD)).toEqual({ text: "1 to 2 weeks; state average 1 week", refs: [1, 5] });
    expect(stateFeeAnswer("NT")).toContain("The letting fee averages 1 week's rent (LocalAgentFinder, March 2026).");
    expect(stateFeeAnswer("QLD")).toContain("Letting fees run 1 to 2 weeks' rent when a new tenant is signed, averaging 1 week.");
    expect(stateFeeAnswer("NSW")).toContain("5% to 8% of rent collected (Sydney; up to 12% in regional NSW; REIQ, December 2023; WhichRealEstateAgent Sydney, March 2026), and LocalAgentFinder's March 2026 state average is 5.8%.");
    for (const s of PM_STATE_ORDER) {
      const f = PM_STATE_FEES[s];
      for (const line of [f.renewal, f.inspection, f.admin]) {
        const c = dollarCell(s, line);
        if (line) expect(c.refs.length).toBeGreaterThan(0);
        else expect(c).toEqual({ text: noPublishedRange(s), refs: [] });
      }
    }
    expect(noPublishedRange("QLD")).toBe("No published QLD range");
  });
  it("never prints an average outside its range without saying the two surveys differ (review 10 Oct 2026, renting 0.6)", () => {
    for (const code of PM_STATE_ORDER) {
      const f = PM_STATE_FEES[code];
      for (const [r, cell] of [
        [f.management, managementCell(f)],
        [f.letting, lettingCell(f)],
      ] as const) {
        const side = averageOutsideRange(r);
        const inside = r.low === undefined || r.high === undefined || (r.low <= r.average && r.average <= r.high);
        expect(side === null, `${code}: ${cell.text}`).toBe(inside);
        if (side) {
          expect(cell.text, code).toContain(differentSurveyNote(side));
          expect(stateFeeAnswer(code), code).toMatch(/different survey/);
        } else {
          expect(cell.text, code).not.toContain("different survey");
        }
      }
    }
    // The two cells the review found: SA management and WA letting.
    expect(averageOutsideRange(PM_STATE_FEES.SA.management)).toBe("below");
    expect(averageOutsideRange(PM_STATE_FEES.WA.letting)).toBe("below");
  });
  it("answers each state's H2 in two to four sentences with the range, the average and the regulated part", () => {
    for (const s of PM_STATE_ORDER) {
      const a = stateFeeAnswer(s);
      const n = sentences(a).length;
      expect(n, `${s}: ${n} sentences`).toBeGreaterThanOrEqual(2);
      expect(n, `${s}: ${n} sentences`).toBeLessThanOrEqual(4);
      expect(a).toContain(`${PM_STATE_FEES[s].management.average}%`);
      expect(a).toContain("LocalAgentFinder");
      expect(a).not.toMatch(/(?<![0-9.])1 weeks/);
      expect(a).not.toMatch(/week' /);
      expect(a).toMatch(/Act|Consumer|Form 6|Access Canberra|Property Agents Board/);
    }
  });
});

describe("FAQ", () => {
  it("answers the three People-also-ask questions first, each 40+ words with a figure and a named source", () => {
    expect(PM_FEES_FAQS.slice(0, 3).map((f) => f.question)).toEqual([
      "What percentage do most property management companies charge?",
      "What is the typical property management fee in Western Australia?",
      "What is a reasonable management fee?",
    ]);
    for (const f of PM_FEES_FAQS.slice(0, 3)) {
      expect(f.answer, f.question).toMatch(/\$[0-9,]+|[0-9.]+%|[0-9.]+ weeks/);
    }
    for (const f of PM_FEES_FAQS) {
      expect(f.question.endsWith("?")).toBe(true);
      expect(f.answer.split(/\s+/).length, f.question).toBeGreaterThanOrEqual(40);
      expect(f.answer, f.question).toMatch(NAMED_SOURCE);
    }
  });
});

describe("the guide page", () => {
  const src = readFileSync(PAGE, "utf8");
  it("offers no property manager network it does not have (review 10 Oct 2026, renting 0.6)", () => {
    expect(src).not.toContain("Browse our network");
    expect(src).not.toContain('href: "/find-an-expert"');
  });
  it("promises the state table and the calculator in its title and delivers both", () => {
    // H1 and Article headline: the long form, from the frontmatter.
    expect(src).toContain('title: "Property Management Fees in Australia 2026: Rates by State, With Calculator"');
    // <title>: the short form, inside the 60-character budget before the " | Your Property Guide" suffix.
    const seo = src.match(/const SEO_TITLE = "([^"]+)";/)?.[1];
    expect(seo).toBe("Property Management Fees 2026: Rates by State & Calculator");
    expect(seo!.length).toBeLessThanOrEqual(60);
    expect(src).toMatch(/export const metadata: Metadata = \{\s*title: SEO_TITLE,/);
    expect(src).toMatch(/openGraph: \{\s*url: [^\n]*\n\s*title: SEO_TITLE,/);
    // Six columns scroll in their own box; the containment keeps the table's width out of the page width on a phone.
    expect(src).toMatch(/<div className="overflow-x-auto" style=\{\{ contain: "inline-size" \}\}[^>]*>\s*<table/);
    expect(src).toContain("PropertyManagementFeesCalculator");
    expect(src).toContain("stateFeeAnswer(");
    expect(src).toContain("faqs={PM_FEES_FAQS}");
    expect(src).toContain('updatedAt: "2026-10-11"');
  });
});
