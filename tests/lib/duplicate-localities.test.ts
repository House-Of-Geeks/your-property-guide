// Duplicate postcode rows (commercial intent review 10 Oct 2026,
// agents-appraisal F6, item 14 of 0.2): the secondary row's profile names the
// primary as canonical and leaves the profiles sitemap. No redirects.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  DUPLICATE_LOCALITY_PAIRS,
  SECONDARY_LOCALITY_SLUGS,
  canonicalSuburbSlug,
  isSecondaryLocality,
  primaryLocalitySlug,
} from "@/lib/duplicate-localities";
import { isNonLocalitySlug } from "@/lib/non-localities";

const parts = (slug: string) => {
  const m = /^(.*)-(nsw|vic|qld|wa|sa|tas|act|nt)-(\d{4})$/.exec(slug);
  if (!m) throw new Error(`not a suburb slug: ${slug}`);
  return { name: m[1], state: m[2], postcode: m[3] };
};

describe("the three pairs the review named", () => {
  it("Prahran 3143 to 3181, Malvern 3143 to 3144, Bandiana 3694 to 3691 (Australia Post delivery postcodes, read 11 Oct 2026)", () => {
    expect(primaryLocalitySlug("prahran-vic-3143")).toBe("prahran-vic-3181");
    expect(primaryLocalitySlug("malvern-vic-3143")).toBe("malvern-vic-3144");
    expect(primaryLocalitySlug("bandiana-vic-3694")).toBe("bandiana-vic-3691");
    expect(canonicalSuburbSlug("prahran-vic-3143")).toBe("prahran-vic-3181");
    expect(isSecondaryLocality("prahran-vic-3143")).toBe(true);
  });
  it("a primary, and any other suburb, is its own canonical", () => {
    for (const slug of ["prahran-vic-3181", "malvern-vic-3144", "bandiana-vic-3691", "bondi-nsw-2026", "kew-east-vic-3102"]) {
      expect(canonicalSuburbSlug(slug)).toBe(slug);
      expect(isSecondaryLocality(slug)).toBe(false);
      expect(primaryLocalitySlug(slug)).toBeNull();
    }
  });
  it("leaves out names Australia Post gives both postcodes (owner decision)", () => {
    for (const slug of ["melbourne-vic-3004", "melbourne-vic-3000", "canberra-act-2601", "mount-gambier-sa-5291"]) {
      expect(isSecondaryLocality(slug)).toBe(false);
    }
  });
});

describe("the list is well formed", () => {
  it("each pair is one name in one state under two postcodes", () => {
    expect(DUPLICATE_LOCALITY_PAIRS.length).toBeGreaterThan(100);
    for (const [secondary, primary] of DUPLICATE_LOCALITY_PAIRS) {
      const s = parts(secondary);
      const p = parts(primary);
      expect(s.name, secondary).toBe(p.name);
      expect(s.state, secondary).toBe(p.state);
      expect(s.postcode, secondary).not.toBe(p.postcode);
    }
  });
  it("no slug is listed twice, and no primary is itself a secondary (no chains)", () => {
    expect(new Set(SECONDARY_LOCALITY_SLUGS).size).toBe(SECONDARY_LOCALITY_SLUGS.length);
    for (const [, primary] of DUPLICATE_LOCALITY_PAIRS) expect(isSecondaryLocality(primary), primary).toBe(false);
  });
  it("no entry is a postal or institutional row (those redirect already)", () => {
    for (const [secondary, primary] of DUPLICATE_LOCALITY_PAIRS) {
      expect(isNonLocalitySlug(secondary), secondary).toBe(false);
      expect(isNonLocalitySlug(primary), primary).toBe(false);
    }
  });
});

describe("where the site reads it", () => {
  it("the profile's canonical and og:url", () => {
    const page = fs.readFileSync("src/app/(marketing)/suburbs/[slug]/page.tsx", "utf8");
    expect(page).toContain("const canonical = `${SITE_URL}/suburbs/${canonicalSuburbSlug(slug)}`;");
    expect(page).toContain("alternates: { canonical },");
    expect(page).toContain("url: canonical,");
  });
  it("the profiles sitemap leaves secondaries out", () => {
    const sitemap = fs.readFileSync("src/app/(marketing)/suburbs/sitemap.ts", "utf8");
    expect(sitemap).toContain(".filter(({ slug }) => !isSecondaryLocality(slug))");
  });
  it("no redirect is added for them", () => {
    const config = fs.readFileSync("next.config.ts", "utf8");
    expect(config).not.toMatch(/duplicate-localities/);
  });
});
