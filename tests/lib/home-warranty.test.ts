// Commercial-intent review (10 Oct 2026), new homes F6: the builder guide's
// regulators and home warranty thresholds as a dated state table, read on
// each regulator's own page. A threshold change fails here first.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  HOME_WARRANTY,
  HOME_WARRANTY_AS_AT,
  HOME_WARRANTY_ORDER,
  warrantyThresholdText,
} from "@/lib/data/home-warranty";

const PAGE = fs.readFileSync(
  path.resolve(__dirname, "../../src/app/(marketing)/guides/how-to-find-a-builder-australia/page.tsx"),
  "utf8",
);

describe("home warranty and licence registers by state", () => {
  it("covers all eight states and territories, each with a regulator, a register link and a dated government source", () => {
    expect(HOME_WARRANTY_ORDER).toHaveLength(8);
    for (const code of HOME_WARRANTY_ORDER) {
      const r = HOME_WARRANTY[code];
      expect(r.state).toBe(code);
      expect(r.regulator.length).toBeGreaterThan(5);
      expect(r.register.href).toMatch(/^https:\/\/[^/]*\.gov\.au\//);
      expect(r.source.href).toMatch(/^https:\/\/[^/]*\.gov\.au\//);
      expect(r.readOn).toBe(HOME_WARRANTY_AS_AT);
    }
  });
  it("pins the thresholds read on 11 October 2026", () => {
    expect(HOME_WARRANTY.NSW.threshold).toBe(20_000);
    expect(HOME_WARRANTY.VIC.threshold).toBe(20_000);
    expect(HOME_WARRANTY.QLD.threshold).toBe(3_300);
    expect(HOME_WARRANTY.WA.threshold).toBe(20_000);
    expect(HOME_WARRANTY.SA.threshold).toBe(20_000);
    expect(HOME_WARRANTY.ACT.threshold).toBe(12_000);
    expect(HOME_WARRANTY.NT.threshold).toBe(25_000);
    // Not confirmed on a Tasmanian government page: printed as such, never guessed.
    expect(HOME_WARRANTY.TAS.threshold).toBeNull();
    expect(warrantyThresholdText(HOME_WARRANTY.TAS)).toBe("not confirmed");
    expect(warrantyThresholdText(HOME_WARRANTY.QLD)).toBe("$3,300");
  });
  it("names the Building and Plumbing Commission, not the VBA alone, and records the recent changes", () => {
    expect(HOME_WARRANTY.VIC.regulator).toContain("Building and Plumbing Commission");
    expect(HOME_WARRANTY.VIC.change).toContain("$16,000");
    expect(HOME_WARRANTY.SA.change).toContain("10 November 2025");
    expect(HOME_WARRANTY.NT.change).toContain("30 March 2026");
  });
});

describe("/guides/how-to-find-a-builder-australia", () => {
  it("renders the state table and the FAQ answers from the data file, re-dated", () => {
    expect(PAGE).toContain('id="by-state"');
    expect(PAGE).toContain("HOME_WARRANTY_ORDER.map");
    expect(PAGE).toContain('updatedAt: "2026-10-11"');
  });
  it("drops the VBA, the $20,000 to $30,000+ range and the unsourced cost figures", () => {
    expect(PAGE).not.toMatch(/VBA Victoria|\(VBA\) licence search/);
    expect(PAGE).not.toContain("$20,000–$30,000+");
    expect(PAGE).not.toContain("statutory warranty in QLD");
    expect(PAGE).not.toMatch(/\$1,800–\$2,800|\$3,500–\$6,000/);
    expect(PAGE).not.toMatch(/30–60%|\$50–\$200\/day|\(\$9\)/);
  });
  it("no longer sends 'contracts' readers to a home loan rate guide", () => {
    expect(PAGE).not.toContain('href: "/guides/fixed-vs-variable-rate-guide"');
    expect(PAGE).toContain("/guides/renovation-cost-australia-2026#fixed-vs-cost-plus");
    expect(PAGE).toContain('<h2 id="contract">');
  });
});
