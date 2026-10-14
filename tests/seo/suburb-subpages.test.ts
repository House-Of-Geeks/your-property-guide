// Pages link only to suburb sub-pages that have something on them (fix item
// 40). Since 14 Oct 2026 the six listing sub-pages are retired and 308 to
// the profile (docs/portal-consolidation-2026-10-14.md), so nothing links to
// them at all; the rental market is the one data-gated sub-page left.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  RETIRED_LISTING_SUBPAGES,
  hasRentalRow,
  subpageAvailability,
  subpageTabs,
} from "@/lib/suburb-subpages";
import { getSuburbSubpageAvailability } from "@/lib/services/subpage-availability";

const SUB = "src/app/(marketing)/suburbs/[slug]";
const src = (f: string) => fs.readFileSync(f, "utf8");

describe("availability", () => {
  it("never offers a retired listing sub-page", () => {
    for (const rental of [false, true]) {
      const a = subpageAvailability(rental);
      for (const p of RETIRED_LISTING_SUBPAGES) expect(a[p], p).toBe(false);
    }
  });
  it("rental market follows the rental row", () => {
    expect(subpageAvailability(true)["rental-market"]).toBe(true);
    expect(subpageAvailability(false)["rental-market"]).toBe(false);
    expect(hasRentalRow({ dataFreshness: { rentalSource: "rental-vic" } })).toBe(true);
    expect(hasRentalRow({ dataFreshness: { rentalSource: null } })).toBe(false);
    expect(hasRentalRow({})).toBe(false);
  });
  it("the service answers from the suburb alone, with no query", async () => {
    expect(await getSuburbSubpageAvailability({ slug: "kew-vic-3101", dataFreshness: { rentalSource: "rental-vic" } })).toEqual({
      buy: false,
      rent: false,
      houses: false,
      units: false,
      townhouses: false,
      land: false,
      "rental-market": true,
    });
    const service = src("src/lib/services/subpage-availability.ts");
    expect(service).not.toMatch(/\bdb\./);
    expect(service).not.toMatch(/import[^;]*unstable_cache/);
  });
});

describe("tab strip", () => {
  it("is the rental market alone, so the header draws no strip", () => {
    const tabs = subpageTabs("kew-vic-3101", "rental-market", subpageAvailability(true));
    expect(tabs).toEqual([{ label: "Rental market", href: "/suburbs/kew-vic-3101/rental-market", active: true }]);
    expect(src("src/components/suburb/SuburbSubrouteHeader.tsx")).toContain("tabs && tabs.length > 1");
  });
});

describe("the pages", () => {
  it("the listing sub-page routes are gone", () => {
    for (const p of RETIRED_LISTING_SUBPAGES) expect(fs.existsSync(`${SUB}/${p}`), p).toBe(false);
    for (const p of ["rental-market", "schools", "agents"]) expect(fs.existsSync(`${SUB}/${p}/page.tsx`), p).toBe(true);
  });
  it("every link left to a listing sub-page sits behind an availability flag that is always false", () => {
    // The profile and the rental-market page still carry the guarded links;
    // with the flags false they draw nothing.
    const rental = src(`${SUB}/rental-market/page.tsx`);
    expect(rental.match(/\/suburbs\/\$\{slug\}\/rent`/g)?.length ?? 0).toBe(rental.match(/availability\.rent && \(/g)?.length ?? 0);
    const profile = src(`${SUB}/page.tsx`);
    for (const p of RETIRED_LISTING_SUBPAGES) {
      if (profile.includes(`/suburbs/\${suburb.slug}/${p}\``)) {
        expect(profile, p).toContain(`{availability.${p} && (\n                  <Link href={\`/suburbs/\${suburb.slug}/${p}\`}>`);
      }
    }
  });
  it("the shared components and the schools page link no listing sub-page", () => {
    const listing = new RegExp(`/(${RETIRED_LISTING_SUBPAGES.join("|")})[\`"?]`);
    for (const f of [
      "src/components/suburb/SuburbContextualLinks.tsx",
      "src/components/suburb/RentalMarketSections.tsx",
      "src/components/suburb/RentalMarketAllDwellings.tsx",
      `${SUB}/schools/page.tsx`,
    ]) {
      expect(src(f), f).not.toMatch(listing);
    }
  });
  it("the sub-page sitemaps list no listing sub-page", () => {
    const sitemap = src("src/app/(marketing)/suburbs/subpages/sitemap.ts");
    for (const p of RETIRED_LISTING_SUBPAGES) expect(sitemap, p).not.toContain(`"${p}",`);
    expect(sitemap).not.toContain("getSuburbListingInventory");
  });
});
