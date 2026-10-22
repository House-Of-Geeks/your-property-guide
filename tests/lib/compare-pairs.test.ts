import { describe, expect, it, vi } from "vitest";

// unstable_cache needs the Next runtime; run the wrapped function directly.
vi.mock("next/cache", () => ({ unstable_cache: <T extends (...a: never[]) => unknown>(fn: T) => fn }));
vi.mock("@/lib/services/suburb-rankings-service", () => ({
  getTopComparisonPairsByState: async (state: string) =>
    state === "NSW"
      ? [{ aSlug: "parramatta-nsw-2150", aName: "Parramatta", bSlug: "harris-park-nsw-2150", bName: "Harris Park", state: "NSW", postcode: "2150" }]
      : [],
}));

import {
  POPULAR_COMPARE_PAIRS,
  allowedCompareSlugs,
  comparePairKey,
  isAllowedComparePair,
} from "@/lib/compare-pairs";

describe("compare pair allowlist", () => {
  it("treats a pair the same in either direction", () => {
    expect(comparePairKey("b", "a")).toBe(comparePairKey("a", "b"));
  });

  it("allows every curated popular pair, in both directions", async () => {
    for (const p of POPULAR_COMPARE_PAIRS) {
      expect(await isAllowedComparePair(p.aSlug, p.bSlug)).toBe(true);
      expect(await isAllowedComparePair(p.bSlug, p.aSlug)).toBe(true);
    }
  });

  it("allows the sitemap pairs and refuses any other combination", async () => {
    expect(await isAllowedComparePair("harris-park-nsw-2150", "parramatta-nsw-2150")).toBe(true);
    expect(await isAllowedComparePair("parramatta-nsw-2150", "bondi-nsw-2026")).toBe(false);
  });

  it("filters link candidates to the published pairs", async () => {
    expect(
      await allowedCompareSlugs("bondi-nsw-2026", ["coogee-nsw-2034", "manly-nsw-2095"]),
    ).toEqual(["coogee-nsw-2034"]);
  });
});
