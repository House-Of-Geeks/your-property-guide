// The rentvesting guide and the state-by-state post (commercial-intent
// review, 10 Oct 2026, renting 0.5). Both gave the pre-reform negative
// gearing and CGT position to exactly the buyer the 1 July 2027 change hits,
// and the post printed unsourced suburb medians and yields.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { post } from "@/lib/data/blog-posts/rentvesting-australia-state-by-state-guide-2026";

const guide = fs.readFileSync(
  path.resolve(__dirname, "../../src/app/(marketing)/guides/rentvesting-australia/page.tsx"),
  "utf8",
);

describe("rentvesting guide", () => {
  it("no longer states the pre-reform tax position", () => {
    expect(guide).not.toContain("Negative gearing applies. Rental losses");
    expect(guide).not.toContain("50% discount after 12 months)");
    expect(guide).not.toContain("against your overall taxable income");
    expect(guide).not.toMatch(/39c marginal rate/);
  });

  it("takes the reform from the shared sources and the worked example from the calculator engine", () => {
    expect(guide).toContain("TAX_REFORM_SOURCES");
    expect(guide).toContain("NEGATIVE_GEARING_CUTOFF");
    expect(guide).toContain("computeNegativeGearing");
    expect(guide).toContain('timing: "established-after-cutoff"');
    expect(guide).toContain('id="tax-2027"');
  });
});

describe("rentvesting state-by-state post", () => {
  it("gives the 1 July 2027 rules with a dated correction", () => {
    expect(post.content).toContain("Correction, 11 October 2026");
    expect(post.content).toContain("1 July 2027");
    expect(post.content).toContain("7:30pm AEST on 12 May 2026");
    expect(post.content).not.toContain("can offset other income via negative gearing if applicable");
    expect(post.updatedAt).toBe("2026-10-11");
  });

  it("prints no unsourced suburb median or yield", () => {
    expect(post.content).not.toMatch(/\$\d+(\.\d+)?\s?[KM]\b/);
    expect(post.content).not.toMatch(/\d(\.\d)? to \d(\.\d)?% yields/);
    expect(post.content).not.toMatch(/medians under/);
    expect(post.content).toContain("<h2>Sources</h2>");
  });
});
