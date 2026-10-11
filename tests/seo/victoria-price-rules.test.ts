// Victoria's Property Price Statement and published reserve (Consumer Legislation
// Amendment Act 2026: started 1 October 2026; reserve rule for auctions and
// fixed-date sales held on and from 16 October 2026; Consumer Affairs Victoria,
// read 11 October 2026).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { COST_OF_SELLING_STATE } from "@/lib/data/cost-of-selling-state";

const files = [
  "src/lib/data/blog-posts/underquoting-laws-by-state.ts",
  "src/lib/data/blog-posts/reserve-price-auction.ts",
  "src/lib/data/blog-posts/real-estate-agency-agreements-by-state.ts",
  "src/lib/data/blog-posts/real-estate-agent-complaints-and-red-flags.ts",
  "src/app/(marketing)/guides/auction-vs-private-treaty/page.tsx",
];

describe("Victorian price rules", () => {
  it("name the Property Price Statement wherever the Victorian statement appears, and cite CAV", () => {
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      expect(src, f).toContain("Property Price Statement");
      // Any remaining mention of the old name is dated as the former name, or is about NSW's own statement or the tags.
      for (const m of src.matchAll(/statement of information/gi)) {
        const around = src.slice(Math.max(0, m.index! - 400), m.index! + 200);
        expect(around, f).toMatch(/Property Price Statement|1 October 2026|NSW|New South Wales|Fair Trading|tags:/);
      }
    }
    const vic = COST_OF_SELLING_STATE.VIC;
    const text = vic.differences.flatMap((d) => d.body).join(" ");
    expect(text).toContain("Property Price Statement");
    expect(text).toContain("16 October 2026");
    expect(vic.sources.some((s) => typeof s !== "string" && s.href?.includes("consumer.vic.gov.au/housing/buying-and-selling-property/selling-property/selling-property-by-auction"))).toBe(true);
  });
  it("put the 16 October 2026 reserve rule in the future tense", () => {
    expect(readFileSync("src/lib/data/blog-posts/underquoting-laws-by-state.ts", "utf8")).toContain("Victoria will go further and require the reserve itself to be published");
    expect(readFileSync("src/lib/data/blog-posts/reserve-price-auction.ts", "utf8")).toContain("for auctions held from 16 October 2026, Victoria will require the reserve");
    expect(readFileSync("src/app/(marketing)/guides/auction-vs-private-treaty/page.tsx", "utf8")).toContain("the agent will also have to publish the seller&rsquo;s reserve");
  });
});
