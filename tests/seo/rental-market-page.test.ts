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
