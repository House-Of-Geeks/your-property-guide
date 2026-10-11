// Duplicate postcode rows (src/lib/duplicate-localities.ts, 11 Oct 2026):
// the agents page of a secondary row canonicals to the primary's agents
// page, no sub-page sitemap lists a secondary, and the agents template never
// links to one. Same pattern as tests/lib/duplicate-localities.test.ts.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { canonicalSuburbSlug, isSecondaryLocality } from "@/lib/duplicate-localities";
import { pickNearbyAgentLinks } from "@/lib/suburb-agents";

describe("agents pages and sub-page sitemaps read the duplicate-localities lookup", () => {
  it("the agents canonical points at the primary row's agents page", () => {
    const page = fs.readFileSync("src/app/(marketing)/suburbs/[slug]/agents/page.tsx", "utf8");
    expect(page).toContain("const canonical = `${SITE_URL}/suburbs/${canonicalSuburbSlug(slug)}/agents`;");
    expect(canonicalSuburbSlug("prahran-vic-3143")).toBe("prahran-vic-3181");
  });
  it("every sub-page sitemap drops secondary rows", () => {
    const sitemap = fs.readFileSync("src/app/(marketing)/suburbs/subpages/sitemap.ts", "utf8");
    expect(sitemap).toContain("(await getIndexableSuburbsForSitemaps()).filter(({ slug }) => !isSecondaryLocality(slug))");
  });
  it("the neighbour rows mark a secondary row as not linkable", () => {
    const page = fs.readFileSync("src/app/(marketing)/suburbs/[slug]/agents/page.tsx", "utf8");
    expect(page).toContain("indexable: hasPublishedHouseMedian(r) && !isSecondaryLocality(r.slug)");
    expect(isSecondaryLocality("prahran-vic-3143")).toBe(true);
    const links = pickNearbyAgentLinks(
      { slug: "windsor-vic-3181", name: "Windsor", state: "VIC" },
      ["prahran-vic-3143", "prahran-vic-3181"],
      [
        { slug: "prahran-vic-3143", name: "Prahran", state: "VIC", postcode: "3143", indexable: false },
        { slug: "prahran-vic-3181", name: "Prahran", state: "VIC", postcode: "3181", indexable: true },
      ],
    );
    expect(links.map((l) => l.href)).toEqual(["/suburbs/prahran-vic-3181/agents"]);
  });
});
