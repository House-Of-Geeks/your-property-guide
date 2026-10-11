// The /suburbs index (commercial intent review 10 Oct 2026, suburbs-market
// 3.11): title, H1, first sentence, the three sections, and a table that
// prints only what each profile publishes.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { TOP_SUBURBS } from "@/lib/data/top-suburbs";

const page = fs.readFileSync("src/app/(marketing)/suburbs/page.tsx", "utf8");
const results = fs.readFileSync("src/app/(marketing)/suburbs/Results.tsx", "utf8");
const bar = fs.readFileSync("src/app/(marketing)/suburbs/SuburbsSearchBar.tsx", "utf8");
const constant = (name: string) => page.match(new RegExp(`const ${name} =\\s*"([^"]+)";`))?.[1] ?? "";

describe("/suburbs", () => {
  it("title, description and H1 inside the budgets", () => {
    expect(constant("TITLE")).toBe("Suburb Profiles: House Prices, Rents & Schools by Suburb");
    expect(constant("TITLE").length).toBeLessThanOrEqual(60);
    expect(constant("DESCRIPTION").length).toBeGreaterThan(100);
    expect(constant("DESCRIPTION").length).toBeLessThanOrEqual(160);
    expect(constant("H1")).toBe("Suburb profiles for every Australian suburb");
    expect(page).toMatch(/title: TITLE,\s*description: DESCRIPTION,/);
  });
  it("opens with what a suburb profile is, and promises no figure the profile withholds", () => {
    expect(page).toContain("A suburb profile puts a suburb&rsquo;s median house price, weekly");
    expect(page).toContain("the profile says why");
  });
  it("has the three sections the spec names", () => {
    for (const h of ["Search a suburb", "Most searched suburbs", "What&rsquo;s in a suburb profile"]) expect(page).toContain(h);
  });
  it("the most searched table reads the profile's rule and leaves out duplicate rows", () => {
    expect(page).toContain("withPublishedSales(r)");
    expect(page).toContain("!isSecondaryLocality(s.slug)");
    expect(page).toContain("LOCALITIES_ONLY] }");
    expect(TOP_SUBURBS.length).toBeGreaterThan(20);
  });
  it("names the sources the profiles use, and no revenue office", () => {
    for (const src of ["NSW Valuer General", "Land Victoria", "the SA Government", "the ABS", "ACARA", "ABS 2021 Census", "OpenStreetMap"]) expect(page).toContain(src);
    expect(page).not.toMatch(/revenue office/i);
  });
  it("search: labelled inputs, postcode link, duplicate rows left out of results", () => {
    expect(bar).toContain('<label htmlFor="suburb-search" className="sr-only">');
    expect(bar).toContain('type="search"');
    expect(results).toContain("`/postcodes/${postcode}`");
    expect(results).toContain("found.filter((s) => !isSecondaryLocality(s.slug))");
  });
});
