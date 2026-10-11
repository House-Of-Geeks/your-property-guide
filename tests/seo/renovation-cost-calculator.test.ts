// Commercial-intent review (10 Oct 2026), new homes section 5.1: the
// renovation estimator on its own URL. It reuses the guide's engine and
// tables, keeps the title inside the SERP budget, carries WebApplication
// schema through CalculatorPageLayout, computes its FAQ figures from the
// engine and states the basis of the "this guide" ranges. Source-text checks.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PERSONA_HUB_CONTENT } from "@/lib/persona-hub-content";

const APP = path.resolve(__dirname, "../../src/app/(marketing)");
const src = fs.readFileSync(path.join(APP, "renovation-cost-calculator/page.tsx"), "utf8");
const metaTitle = /const META_TITLE = "([^"]+)"/.exec(src)?.[1] ?? "";
const metaDescription = /const META_DESCRIPTION =\s*\n?\s*"([^"]+)"/.exec(src)?.[1] ?? "";

describe("/renovation-cost-calculator", () => {
  it("has the URL, schema name and a title inside the budget", () => {
    expect(src).toContain('slug: "renovation-cost-calculator"');
    expect(src).toContain('schemaName: "Renovation Cost Calculator"');
    expect(metaTitle).toBe("Renovation Cost Calculator Australia (2026)");
    expect(metaTitle.length).toBeLessThanOrEqual(60);
    expect(metaDescription.length).toBeGreaterThan(50);
    expect(metaDescription.length).toBeLessThanOrEqual(160);
  });
  it("reuses the guide's estimator, engine and tables, and types no cost figure of its own", () => {
    expect(src).toContain("<CalculatorPageLayout");
    expect(src).toContain("calculator={<RenovationCostEstimator />}");
    expect(src).toContain('from "@/lib/renovation-estimate"');
    expect(src).toContain("<RenovationAtAGlanceTable />");
    expect(src).toContain("<Sources items={renovationSourceItems()} />");
    expect(src).not.toMatch(/\$\d/);
  });
  it("states the basis of the 'this guide' ranges where the table's tags link to it", () => {
    expect(src).toContain("id={FIGURES_BASIS_ID}");
    expect(src).toContain("not a survey or a published index");
  });
  it("is linked from the guide and the /renovating hub", () => {
    const guide = fs.readFileSync(path.join(APP, "guides/renovation-cost-australia-2026/page.tsx"), "utf8");
    expect(guide).toContain('href="/renovation-cost-calculator"');
    expect(PERSONA_HUB_CONTENT.renovating.calculators.map((c) => c.href)).toContain("/renovation-cost-calculator");
  });
});
