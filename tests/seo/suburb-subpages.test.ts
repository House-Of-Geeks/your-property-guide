// Pages link only to suburb sub-pages that have something on them (fix item 40).
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  LISTING_SUBPAGES,
  LISTING_SUBPAGE_FILTERS,
  availabilityFrom,
  emptyListingMessage,
  everyListingSubpage,
  hasRentalRow,
  subpageTabs,
} from "@/lib/suburb-subpages";

const SUB = "src/app/(marketing)/suburbs/[slug]";
const none = availabilityFrom([], false);

describe("availability", () => {
  it("a suburb with no listings and no rental row has nothing to link", () => {
    expect(Object.values(none).every((v) => v === false)).toBe(true);
  });
  it("follows the listings a suburb has, by type", () => {
    const a = availabilityFrom([{ listingType: "buy", propertyType: "house" }], false);
    expect(a).toEqual({ buy: true, rent: false, houses: true, units: false, townhouses: false, land: false, "rental-market": false });
    const b = availabilityFrom(
      [{ listingType: "rent", propertyType: "unit" }, { listingType: "buy", propertyType: "land" }],
      true,
    );
    expect(b).toEqual({ buy: true, rent: true, houses: false, units: false, townhouses: false, land: true, "rental-market": true });
  });
  it("a rental listing is not stock for the for-sale pages", () => {
    const a = availabilityFrom([{ listingType: "rent", propertyType: "house" }], false);
    expect(a.houses).toBe(false);
    expect(a.buy).toBe(false);
    expect(a.rent).toBe(true);
  });
  it("a type the pages have no tab for still counts as for sale", () => {
    expect(availabilityFrom([{ listingType: "buy", propertyType: "acreage" }], false).buy).toBe(true);
  });
  it("rental market follows the rental row, not the listings", () => {
    expect(availabilityFrom([], true)["rental-market"]).toBe(true);
    expect(hasRentalRow({ dataFreshness: { rentalSource: "rental-vic" } })).toBe(true);
    expect(hasRentalRow({ dataFreshness: { rentalSource: null } })).toBe(false);
    expect(hasRentalRow({})).toBe(false);
  });
  it("the fallback links every listing page", () => {
    const f = everyListingSubpage(false);
    for (const p of LISTING_SUBPAGES) expect(f[p]).toBe(true);
    expect(f["rental-market"]).toBe(false);
  });
  it("has one predicate per listing page", () => {
    expect(Object.keys(LISTING_SUBPAGE_FILTERS).sort()).toEqual([...LISTING_SUBPAGES].sort());
  });
});

describe("tab strip", () => {
  it("is the page being read alone when nothing else has anything on it", () => {
    const tabs = subpageTabs("kew-vic-3101", "rental-market", availabilityFrom([], true));
    expect(tabs).toEqual([{ label: "Rental market", href: "/suburbs/kew-vic-3101/rental-market", active: true }]);
  });
  it("keeps the page being read even when it is empty", () => {
    const tabs = subpageTabs("kew-vic-3101", "units", availabilityFrom([], true));
    expect(tabs.map((t) => t.label)).toEqual(["Units", "Rental market"]);
    expect(tabs.find((t) => t.active)?.href).toBe("/suburbs/kew-vic-3101/units");
  });
  it("lists the pages with stock in the usual order", () => {
    const a = availabilityFrom(
      [{ listingType: "buy", propertyType: "house" }, { listingType: "rent", propertyType: "unit" }],
      true,
    );
    expect(subpageTabs("x-qld-4000", "buy", a).map((t) => t.label)).toEqual(["For sale", "For rent", "Houses", "Rental market"]);
    expect(subpageTabs("x-qld-4000", "buy", everyListingSubpage(true))).toHaveLength(7);
  });
});

describe("empty state", () => {
  it("points at the tabs only when there are tabs to point at", () => {
    expect(emptyListingMessage("houses", "Kew", none)).toBe("No house listings in Kew right now. Check back soon.");
    expect(emptyListingMessage("buy", "Kew", none)).toBe("No properties for sale in Kew right now. Check back soon.");
    expect(emptyListingMessage("rent", "Kew", availabilityFrom([], true))).toBe(
      "No rentals listed in Kew right now. The rental market tab above has the latest median rents.",
    );
    expect(emptyListingMessage("units", "Kew", availabilityFrom([{ listingType: "buy", propertyType: "house" }], false))).toBe(
      "No unit listings in Kew right now. Try the other listing types above.",
    );
  });
  it("does not count the page itself as another listing type", () => {
    const onlyUnits = availabilityFrom([{ listingType: "rent", propertyType: "unit" }], false);
    expect(emptyListingMessage("rent", "Kew", onlyUnits)).toBe("No rentals listed in Kew right now. Check back soon.");
  });
});

describe("the pages", () => {
  const src = (f: string) => fs.readFileSync(f, "utf8");
  it("every sub-page with a tab strip passes the availability", () => {
    for (const page of [...LISTING_SUBPAGES, "rental-market"]) {
      const s = src(`${SUB}/${page}/page.tsx`);
      expect(s, page).toContain(`getSuburbListingTabs(slug, "${page}", availability)`);
      expect(s, page).toContain("await getSuburbSubpageAvailability(suburb)");
      expect(s, page).not.toMatch(/tabs above|listing types above/);
    }
  });
  it("the header draws the strip from two tabs", () => {
    expect(src("src/components/suburb/SuburbSubrouteHeader.tsx")).toContain("tabs && tabs.length > 1");
  });
  it("no page links a listing sub-page without asking", () => {
    // Every literal link to a listing sub-page sits behind the availability.
    const schools = src(`${SUB}/schools/page.tsx`);
    expect(schools).toContain("href={hasListings ? `/suburbs/${slug}/buy` : `/suburbs/${slug}`}");
    const rental = src(`${SUB}/rental-market/page.tsx`);
    expect(rental.match(/\/suburbs\/\$\{slug\}\/rent`/g)).toHaveLength(2);
    expect(rental.match(/availability\.rent && \(/g)).toHaveLength(2);
    const profile = src(`${SUB}/page.tsx`);
    for (const p of ["buy", "rent", "houses", "units", "townhouses"]) {
      expect(profile, p).toContain(`{availability.${p} && (\n                  <Link href={\`/suburbs/\${suburb.slug}/${p}\`}>`);
    }
    expect(profile).toContain('{availability["rental-market"] && (');
    const links = src("src/components/suburb/SuburbContextualLinks.tsx");
    expect(links).toContain("].filter((l) => l.show);");
    expect(links).toContain("{availability.rent && (");
    expect(links).toContain("{forSaleLinks.length > 0 && (");
  });
  it("the sitemap and the links share the predicates", () => {
    const sitemap = src("src/app/(marketing)/suburbs/subpages/sitemap.ts");
    expect(sitemap).toContain("LISTING_SUBPAGE_FILTERS");
    expect(sitemap).not.toContain('r.listingType === "buy"');
  });
  it("the pages do not read a cache with a shorter life than their own", () => {
    // A 24-hour unstable_cache inside a page that revalidates weekly makes the
    // page revalidate daily. The availability is a plain indexed query.
    const service = src("src/lib/services/subpage-availability.ts");
    expect(service).not.toMatch(/import[^;]*unstable_cache/);
    expect(service).toContain("where: { suburbSlug: suburb.slug }");
  });
});
