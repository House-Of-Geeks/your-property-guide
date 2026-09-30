// Commercial intent review (30 Sep 2026), section 3.3: the two calculator
// pages carry the query in the H1, keep the title inside the SERP budget,
// export revalidate, render their tables from the tested engines, and the
// header links every calculator in the server HTML. Source-text checks.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const APP = path.resolve(__dirname, "../../src/app/(marketing)");
const read = (p: string) => fs.readFileSync(p, "utf8");
const TITLE_BUDGET = 60; // before " | Your Property Guide"
const metaTitle = (src: string) => /const META_TITLE = "([^"]+)"/.exec(src)![1];

describe("/borrowing-power-calculator", () => {
  const src = read(path.join(APP, "borrowing-power-calculator/page.tsx"));
  it("says how much can I borrow in the H1 and the title, inside the budget, with the URL and schema name unchanged", () => {
    expect(src).toContain('h1: "How much can I borrow? Borrowing power calculator"');
    expect(src).toContain('title: "Borrowing Power Calculator"');
    expect(src).toContain('schemaName: "Borrowing Power Calculator"');
    expect(src).toContain('slug: "borrowing-power-calculator"');
    const title = metaTitle(src);
    expect(title.toLowerCase()).toContain("how much can i borrow");
    expect(title.length).toBeLessThanOrEqual(TITLE_BUDGET);
  });
  it("is ISR, renders the income table and the salary FAQ from the tested engine, and reads no searchParams", () => {
    expect(src).toMatch(/export const revalidate = \d+/);
    expect(src).not.toMatch(/searchParams/);
    expect(src).toContain("<BorrowingPowerTable />");
    expect(src).toContain("borrowingPowerFaqs()");
  });
  it("prints no stale 7.5% default: every assessment-rate figure comes from the sourced constant", () => {
    expect(src).not.toMatch(/7\.5%/);
    expect(src).not.toContain("4.5% offer rate");
    const widget = read(path.resolve(__dirname, "../../src/components/calculators/BorrowingPowerCalculator.tsx"));
    expect(widget).toContain("useState(DEFAULT_ASSESSMENT_RATE)");
  });
});

describe("/rental-yield-calculator", () => {
  const src = read(path.join(APP, "rental-yield-calculator/page.tsx"));
  it("keeps its title, URL and schema name, inside the budget", () => {
    expect(src).toContain('title: "Rental Yield Calculator"');
    expect(src).toContain('schemaName: "Rental Yield Calculator"');
    expect(src).toContain('slug: "rental-yield-calculator"');
    expect(metaTitle(src).length).toBeLessThanOrEqual(TITLE_BUDGET);
  });
  it("is ISR and carries the two H2s the SERP rewards, worked from the engine and the gated data", () => {
    expect(src).toMatch(/export const revalidate = \d+/);
    expect(src).not.toMatch(/searchParams/);
    expect(src).toContain("How to calculate rental yield, step by step");
    expect(src).toContain("workedExample()");
    expect(src).toContain("<GoodYieldTable />");
    expect(src).toContain("yieldFaqs()");
    expect(read(path.resolve(__dirname, "../../src/components/calculators/GoodYieldTable.tsx"))).toContain("What is a good rental yield in 2026?");
    // The old unsourced ranges are gone; the answer now comes from the data file.
    expect(src).not.toContain("Sydney and Melbourne often yield 2.5 to 4% gross");
  });
  it("uses the shared engine in the widget too, so the example and the widget agree", () => {
    const widget = read(path.resolve(__dirname, "../../src/components/calculators/RentalYieldCalculator.tsx"));
    expect(widget).toContain('from "@/lib/rental-yield-calc"');
    expect(widget).not.toMatch(/function computeRentalYield/);
  });
});

describe("header", () => {
  const src = read(path.resolve(__dirname, "../../src/components/layout/Header.tsx"));
  it("links all calculators and renders every dropdown panel in the HTML, hidden until opened", () => {
    expect(src).toContain('{ label: "All calculators",       href: "/tools"');
    expect(src).toContain('href: "/borrowing-power-calculator"');
    expect(src).toContain('href: "/rental-yield-calculator"');
    // No panel is gated on the open state: it is hidden with a class instead.
    expect(src).not.toMatch(/openMenu === link\.label && \(/);
    expect(src).toMatch(/open=\{openMenu === link\.label\}/);
    expect(src).toMatch(/\$\{open \? "" : "hidden "\}/);
  });
  it("adds no top-level item: the 1080px breakpoint of PR #77 was measured with five", () => {
    const navBlock = src.slice(src.indexOf("const NAV_LINKS"), src.indexOf("const BUYER_PATHS"));
    const topLevel = navBlock.match(/^  \{\n    label: "/gm) ?? [];
    expect(topLevel).toHaveLength(5);
    expect(src).toContain("min-[67.5rem]:flex");
  });
});
