// Fix item 45: the family ranking's H1 read "The for families suburbs in
// Western Australia." and its state <title> "Best for Families suburbs in
// Western Australia (WA)", because every reader dropped the category's
// qualifier in front of "suburbs". Every category and state now reads as a
// sentence, from one builder (src/lib/best-suburbs-headlines.ts).
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  bestSuburbsHeadline,
  bestSuburbsStateTitle,
  CATEGORY_HEADLINE,
  STATES,
  STATE_NAME,
} from "@/lib/best-suburbs-headlines";
import type { RankingCategory } from "@/lib/ranking-notes";

const CATEGORIES = Object.keys(CATEGORY_HEADLINE) as RankingCategory[];
const PLACES: Array<string | null> = [null, ...STATES];

describe("best-suburbs headlines read as sentences (fix item 45)", () => {
  it("covers all six categories, the national page and all eight states", () => {
    expect(CATEGORIES).toHaveLength(6);
    expect(STATES).toHaveLength(8);
    for (const s of STATES) expect(STATE_NAME[s], s).toBeTruthy();
  });

  it('no H1 starts with "The for" on any category and state combination', () => {
    for (const c of CATEGORIES) {
      for (const p of PLACES) {
        const h1 = bestSuburbsHeadline(c, p);
        const label = `${c} / ${p ?? "national"}: ${h1}`;
        expect(h1, label).not.toMatch(/^The for\b/);
        expect(h1, label).toMatch(
          /^The (best|most affordable|most walkable|highest growth|lowest flood risk|best rental yield) suburbs( for families)? in [A-Z]/,
        );
        expect(h1.endsWith(` in ${p ? STATE_NAME[p] : "Australia"}`), label).toBe(true);
        // No doubled space, no space before a full stop, no full stop of its own.
        expect(h1, label).not.toMatch(/\s{2}|\s\.|\.$/);
      }
    }
  });

  it("prints the sentences the copy review asked for", () => {
    expect(bestSuburbsHeadline("for-families", "WA")).toBe("The best suburbs for families in Western Australia");
    expect(bestSuburbsHeadline("for-families", null)).toBe("The best suburbs for families in Australia");
    expect(bestSuburbsHeadline("most-affordable", "QLD")).toBe("The most affordable suburbs in Queensland");
    expect(bestSuburbsHeadline("best-rental-yield", "QLD")).toBe("The best rental yield suburbs in Queensland");
    expect(bestSuburbsHeadline("highest-growth", "NSW")).toBe("The highest growth suburbs in New South Wales");
    expect(bestSuburbsHeadline("most-walkable", "VIC")).toBe("The most walkable suburbs in Victoria");
    expect(bestSuburbsHeadline("lowest-flood-risk", "TAS")).toBe("The lowest flood risk suburbs in Tasmania");
  });

  it("the state <title> reads the same way; the five titles that were right are unchanged", () => {
    expect(bestSuburbsStateTitle("for-families", "WA")).toBe("Best suburbs for families in Western Australia (WA)");
    expect(bestSuburbsStateTitle("highest-growth", "NSW")).toBe("Highest Growth suburbs in New South Wales (NSW)");
    expect(bestSuburbsStateTitle("most-affordable", "QLD")).toBe("Most Affordable suburbs in Queensland (QLD)");
    expect(bestSuburbsStateTitle("most-walkable", "VIC")).toBe("Most Walkable suburbs in Victoria (VIC)");
    expect(bestSuburbsStateTitle("lowest-flood-risk", "TAS")).toBe("Lowest Flood Risk suburbs in Tasmania (TAS)");
    expect(bestSuburbsStateTitle("best-rental-yield", "QLD")).toBe("Best Rental Yield suburbs in Queensland (QLD)");
    for (const c of CATEGORIES) {
      for (const s of STATES) {
        const t = bestSuburbsStateTitle(c, s);
        expect(t, `${c} / ${s}: ${t}`).not.toMatch(/^Best for |for Families suburbs/);
        expect(t.endsWith(` in ${STATE_NAME[s]} (${s})`), `${c} / ${s}: ${t}`).toBe(true);
      }
    }
  });

  it("the listing and the state page compose the sentence through the one builder", () => {
    const src = (f: string) => fs.readFileSync(f, "utf8");
    const listing = src("src/components/best-suburbs/BestSuburbsListing.tsx");
    const statePage = src("src/app/(marketing)/best-suburbs/[category]/[state]/page.tsx");
    expect(listing).toContain("bestSuburbsHeadline(category, state)");
    expect(listing).not.toContain("italicTitle");
    expect(listing).not.toContain('replace(" Suburbs"');
    expect(statePage).toContain("bestSuburbsStateTitle(category, upperState)");
    expect(statePage).not.toContain('replace(" Suburbs"');
  });
});
