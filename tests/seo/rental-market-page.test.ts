// The /suburbs/{slug}/rental-market template (commercial-intent review,
// 10 Oct 2026, renting 0.8 and the duplicate postcode rows).
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { DUPLICATE_LOCALITY_PAIRS, canonicalSuburbSlug } from "@/lib/duplicate-localities";

const page = fs.readFileSync("src/app/(marketing)/suburbs/[slug]/rental-market/page.tsx", "utf8");

describe("rental-market canonical", () => {
  it("names the primary row's rental-market page for a duplicate postcode row", () => {
    expect(page).toContain("const canonical = `${SITE_URL}/suburbs/${canonicalSuburbSlug(slug)}/rental-market`;");
    const [secondary, primary] = DUPLICATE_LOCALITY_PAIRS[0];
    expect(canonicalSuburbSlug(secondary)).toBe(primary);
    expect(canonicalSuburbSlug(primary)).toBe(primary);
  });
});

describe("rental-market accuracy (review 10 Oct 2026, renting 0.8)", () => {
  it("names the feed, not its code, and takes the yield rent only from a named feed's newest row", () => {
    expect(page).toContain("const latestLabel = rentalSourceLabel(latest?.source, suburb.postcode);");
    expect(page).toContain("source={latestLabel ?? undefined}");
    expect(page).not.toContain("suburb.stats.medianRentHouse");
    expect(page).toContain("const currentRent = latestLabel && latest?.medianRentHouse ? latest.medianRentHouse : 0;");
    expect(page).toContain("priceProvenance.short");
  });
  it("puts the suburb in the H1, says 'latest published', and dates the Article by the newest row", () => {
    expect(page).toContain('title={<>{suburb.name} <span className="italic text-primary">rental market</span></>}');
    expect(page).not.toContain("right now.");
    expect(page).toContain("dateModified={dateModified}");
    expect(page).not.toMatch(/title=\{`\$\{model\?\.title[^`]*`\} \| \$\{SITE_NAME\}`\}/);
    const sections = fs.readFileSync("src/components/suburb/RentalMarketSections.tsx", "utf8");
    expect(sections).not.toContain("What it costs to rent in {suburb.name} now.");
    expect(sections).toContain("The latest published rents in {suburb.name}.");
  });
});
