// What a ranking page says about its figures, and when it has none.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  FLOOD_HAZARD_FEED_LOADED,
  WALK_RANKED_UNCAPPED,
  WALK_TIE_NOTE,
  isTiedAtWalkCap,
  listedRows,
  walkScoreFromAmenities,
  GROWTH_RANKED_STATES,
  YIELD_RANKED_STATES,
  isRanked,
  priceSourceLine,
  rankingNote,
  type RankingCategory,
} from "@/lib/ranking-notes";
import { GROWTH_SOURCES } from "@/lib/published-medians";
import sitemap from "@/app/(marketing)/best-suburbs/sitemap";

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"];
const CATEGORIES: RankingCategory[] = ["for-families", "highest-growth", "most-affordable", "most-walkable", "lowest-flood-risk", "best-rental-yield"];

describe("which states are ranked", () => {
  it("growth where a feed measures it", () => {
    expect([...GROWTH_RANKED_STATES]).toEqual(["NSW", "SA"]);
    expect(GROWTH_SOURCES.map((s) => s.replace("sales-", "").toUpperCase())).toEqual([...GROWTH_RANKED_STATES]);
    expect(STATES.filter((s) => isRanked("highest-growth", s))).toEqual(["NSW", "SA"]);
  });
  it("yield where the rent is measured for the suburb", () => {
    expect([...YIELD_RANKED_STATES]).toEqual(["VIC", "QLD"]);
    expect(STATES.filter((s) => isRanked("best-rental-yield", s))).toEqual(["VIC", "QLD"]);
  });
  it("everything else everywhere, and every national page but flood risk", () => {
    for (const c of CATEGORIES) {
      if (c === "lowest-flood-risk") continue;
      expect(isRanked(c, null), c).toBe(true);
      if (c !== "highest-growth" && c !== "best-rental-yield") for (const s of STATES) expect(isRanked(c, s), `${c} ${s}`).toBe(true);
    }
  });
  it("flood risk nowhere until a hazard feed loads (tracker item 49(ii))", () => {
    expect(FLOOD_HAZARD_FEED_LOADED).toBe(false);
    expect(isRanked("lowest-flood-risk", null)).toBe(false);
    for (const s of STATES) expect(isRanked("lowest-flood-risk", s), s).toBe(false);
    const qld = rankingNote("lowest-flood-risk", "QLD", 16, 900);
    expect(qld.empty).toBe(true);
    expect(qld.text).toContain("No flood risk ranking for Queensland yet.");
    expect(qld.text).toContain("a suburb with no flood record is not a suburb with no flood risk");
    expect(rankingNote("lowest-flood-risk", null, 50, null).text).toMatch(/^No flood risk ranking yet\./);
  });
});

describe("the walk score caps at 100 (review of 10 Oct 2026, 0.1a)", () => {
  it("is two points an amenity, capped, the same rule the sync writes", () => {
    expect(walkScoreFromAmenities(0)).toBe(0);
    expect(walkScoreFromAmenities(37)).toBe(74);
    expect(walkScoreFromAmenities(49)).toBe(98);
    expect(walkScoreFromAmenities(50)).toBe(100);
    expect(walkScoreFromAmenities(400)).toBe(100);
    const sync = fs.readFileSync("scripts/sync/sources/walkability.ts", "utf8");
    expect(sync).toContain("walkScore:   walkScoreFromAmenities(amenityCount),");
    // the uncapped count is computed and returned, ready for a column to store it
    expect(sync).toContain("export function computeScores(elements: OverpassElement[]): WalkabilityCounts {");
    expect(sync).toMatch(/return \{\n\s+amenityCount,/);
  });
  it("lists a tie at the cap alphabetically and unnumbered until the lists rank on the uncapped count", () => {
    expect(WALK_RANKED_UNCAPPED).toBe(false);
    expect(isTiedAtWalkCap(100)).toBe(true);
    expect(isTiedAtWalkCap(98)).toBe(false);
    expect(isTiedAtWalkCap(null)).toBe(false);
    expect(WALK_TIE_NOTE).toMatch(/^These suburbs all score 100; listed alphabetically\./);
    const rows = [
      { name: "Balmain", walkScore: 100 }, { name: "Alexandria", walkScore: 100 }, { name: "Zetland", walkScore: 96 }, { name: "Annandale", walkScore: 100 }, { name: "Yagoona", walkScore: 90 },
    ];
    expect(listedRows("most-walkable", rows).map((r) => [r.suburb.name, r.rank])).toEqual([
      ["Alexandria", null], ["Annandale", null], ["Balmain", null], ["Zetland", 4], ["Yagoona", 5],
    ]);
    expect(listedRows("most-affordable", rows).map((r) => r.rank)).toEqual([1, 2, 3, 4, 5]);
    const listing = fs.readFileSync("src/components/best-suburbs/BestSuburbsListing.tsx", "utf8");
    expect(listing).toContain("const rows = listedRows(category, ranked);");
    expect(listing).toContain("{rank ?? \"\"}");
    expect(listing).toContain("{suburbs.length > 0 && !anyTied && (");
    const commentary = fs.readFileSync("src/lib/data/category-commentary.ts", "utf8");
    expect(commentary).not.toMatch(/Refreshed quarterly|90\+ is exceptional|transit stops, and pedestrian/);
  });
});

describe("the note", () => {
  it("says why a state has no ranking", () => {
    const vic = rankingNote("highest-growth", "VIC", 0, 0);
    expect(vic.empty).toBe(true);
    expect(vic.text).toContain("Land Victoria's quarterly medians come without a 12-month change");
    expect(rankingNote("highest-growth", "WA", 0, 0).text).toContain("ABS statistical-area medians, which come without a 12-month change");
    expect(rankingNote("best-rental-yield", "NSW", 0, 0).text).toContain("published by postcode");
    expect(rankingNote("best-rental-yield", "SA", 0, 0).text).toContain("checking the sales medians");
    expect(rankingNote("best-rental-yield", "TAS", 0, 0).text).toContain("no rental bond data");
    for (const s of STATES) {
      for (const c of ["highest-growth", "best-rental-yield"] as const) {
        if (!isRanked(c, s)) expect(rankingNote(c, s, 0, 0).empty, `${c} ${s}`).toBe(true);
      }
    }
  });
  it("says where the figures come from, and how many suburbs were ranked", () => {
    const qld = rankingNote("most-affordable", "QLD", 50, 281);
    expect(qld.empty).toBe(false);
    expect(qld.text).toContain("Ranked from 281 suburbs in Queensland with a published median.");
    expect(qld.text).toContain("ABS statistical-area (SA2) medians");
    // An area's figure goes to the suburb of its name and to no other.
    expect(qld.text).toContain("the median for the area that carries the suburb's name");
    expect(qld.text).not.toContain("share a figure");
    expect(rankingNote("most-affordable", "NSW", 50, 1882).text).toContain("1,882 suburbs in New South Wales");
    expect(rankingNote("most-affordable", "NSW", 50, 1882).text).toContain("five recorded sales");
    expect(rankingNote("highest-growth", null, 50, 1269).text).toContain("beyond 25%");
    expect(rankingNote("best-rental-yield", null, 50, 312).text).toContain("Victoria and Queensland only");
    expect(rankingNote("best-rental-yield", "VIC", 50, 135).text).toContain("1,000 or more residents");
  });
  it("never promises a figure in a ranking on something else", () => {
    const n = rankingNote("most-walkable", "WA", 50, null);
    expect(n.empty).toBe(false);
    expect(n.text).toContain("a dash means none is published");
    expect(n.text).not.toContain("Ranked from");
    // the family ranking prints no price, so it has nothing to say about one
    expect(rankingNote("for-families", "NSW", 50, null)).toEqual({ empty: false, text: "" });
    expect(rankingNote("for-families", "NT", 0, null).empty).toBe(true);
  });
  it("has no state left without a price line", () => {
    for (const s of [null, ...STATES]) expect(priceSourceLine(s).length).toBeGreaterThan(30);
  });
});

describe("the pages", () => {
  it("an empty ranking is out of the sitemap and noindex", () => {
    const urls = sitemap().map((e) => e.url.replace(/^https?:\/\/[^/]+/, ""));
    expect(urls).toContain("/best-suburbs/highest-growth");
    expect(urls).toContain("/best-suburbs/highest-growth/nsw");
    expect(urls).toContain("/best-suburbs/best-rental-yield/vic");
    expect(urls).not.toContain("/best-suburbs/highest-growth/vic");
    expect(urls).not.toContain("/best-suburbs/best-rental-yield/nsw");
    // flood risk: no national page and no state page until a hazard feed loads
    expect(urls.filter((u) => u.includes("lowest-flood-risk"))).toEqual([]);
    expect(urls).toHaveLength(1 + 5 + 48 - 6 - 6 - 8);
    const page = fs.readFileSync("src/app/(marketing)/best-suburbs/[category]/[state]/page.tsx", "utf8");
    expect(page).toContain("robots: isRanked(category, upperState) ? undefined : { index: false, follow: true },");
    expect(page).toContain("const suburbs = ranked ? await getRankedSuburbs(category, upperState, 50) : [];");
    const national = fs.readFileSync("src/app/(marketing)/best-suburbs/[category]/page.tsx", "utf8");
    expect(national).toContain("robots: isRanked(category as RankingCategory, null) ? undefined : { index: false, follow: true },");
    expect(national).toContain("const suburbs = ranked ? await getRankedSuburbs(cat, undefined, 50) : [];");
    // the hub, the listings' cross-links and the state pages link only to ranked lists
    expect(fs.readFileSync("src/app/(marketing)/best-suburbs/page.tsx", "utf8")).toContain("ALL_CATEGORIES.filter((c) => isRanked(c.slug, null))");
    expect(fs.readFileSync("src/components/best-suburbs/BestSuburbsListing.tsx", "utf8")).toContain(".filter((c) => c !== category && isRanked(c, state))");
    const states = fs.readFileSync("src/app/(marketing)/states/[state]/page.tsx", "utf8");
    expect(states).toContain(".filter(({ slug }) => isRanked(slug, upperState))");
    expect(states).not.toContain("best-suburbs/${slug}?state=");
  });
  it("prints no unsourced state commentary (review of 10 Oct 2026, 0.6)", () => {
    // The blocks said Tasmania pays a $30,000 grant and a 50% duty concession and that the
    // ACT waives duty for downsizers at any price, against our own sourced duty engine.
    expect(fs.existsSync("src/lib/data/state-commentary.ts")).toBe(false);
    for (const f of ["src/components/best-suburbs/BestSuburbsListing.tsx", "src/app/(marketing)/market-reports/[state]/page.tsx"]) {
      const text = fs.readFileSync(f, "utf8");
      expect(text, f).not.toMatch(/STATE_COMMENTARY|state-commentary|Buyer tip|Watch out/);
    }
  });
  it("the methodology says what is done", () => {
    const text = fs.readFileSync("src/lib/data/category-commentary.ts", "utf8");
    expect(text).not.toContain("REIA");
    expect(text).not.toContain("under 12 sales");
    expect(text).toContain("at least five recorded sales");
  });
  it("the rankings read the published figures", () => {
    const service = fs.readFileSync("src/lib/services/suburb-rankings-service.ts", "utf8");
    const ranked = service.slice(service.indexOf("export async function getRankedSuburbs"), service.indexOf("// State stats"));
    expect(ranked).toContain("...PUBLISHED_GROWTH");
    expect(ranked).toContain("...PUBLISHED_HOUSE_MEDIAN,");
    expect(service).toContain("WHERE ${PUBLISHED_HOUSE_MEDIAN_SQL}");
    expect(ranked).not.toMatch(/medianHousePrice: \{ gt: 0 \}/);
    expect(service).toContain("const sales = publishedSales(row);");
  });
});
