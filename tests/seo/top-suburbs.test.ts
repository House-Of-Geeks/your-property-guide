// Fix item 5: the most-searched suburb lists that feed the state and city pages.
import { describe, expect, it } from "vitest";
import { TOP_SUBURBS, topSuburbsForCity, topSuburbsForState } from "@/lib/data/top-suburbs";

describe("most searched suburbs", () => {
  it("parses the impressions-ordered slug list", () => {
    expect(TOP_SUBURBS.length).toBeGreaterThanOrEqual(100);
    expect(TOP_SUBURBS[0]).toEqual({ slug: "surfers-paradise-qld-4217", name: "Surfers Paradise", state: "QLD", postcode: "4217" });
  });
  it("filters by state, capped, most impressions first", () => {
    const nsw = topSuburbsForState("nsw", 24);
    expect(nsw.length).toBeGreaterThanOrEqual(5);
    expect(nsw.length).toBeLessThanOrEqual(24);
    for (const s of nsw) expect(s.slug).toMatch(/-nsw-\d{4}$/);
  });
  it("filters a capital city by its postcode ranges", () => {
    const brisbane = topSuburbsForCity("brisbane");
    expect(brisbane.some((s) => s.slug === "morayfield-qld-4506")).toBe(true);
    expect(brisbane.some((s) => s.slug === "surfers-paradise-qld-4217")).toBe(false);
    expect(topSuburbsForCity("nowhere")).toEqual([]);
  });
});
