// Postal delivery names, institutions and shopping-centre post offices are not suburbs.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { DELIVERY_KINDS, baseLocalityName, displayLocalityName, editDistance, findTwin, nonLocalityKind } from "@/lib/locality-names";
import {
  HIDDEN_ROWS,
  MISFILED_SLUGS,
  NON_LOCALITIES,
  NON_LOCALITY_SLUGS,
  isHiddenSlug,
  isNonLocalitySlug,
  nonLocalitiesInPostcode,
  nonLocalityBySlug,
  nonLocalityRedirects,
  nonLocalityTarget,
} from "@/lib/non-localities";
import { normalisePostcode, stateMatchesPostcode, statesForPostcode } from "@/lib/postcode-states";
import { TOP_SUBURBS } from "@/lib/data/top-suburbs";
import nextConfig from "../../next.config";

describe("name rules", () => {
  it("a postal suffix is never a locality, whatever population the row carries", () => {
    for (const name of ["South Melbourne Dc", "Nerang Bc", "Cairns Mc", "Brisbane Gpo", "Booran Road Po", "City Delivery Centre", "Hervey Bay DC"]) {
      expect(nonLocalityKind(name, 0), name).toBe("postal");
      expect(nonLocalityKind(name, 99), name).toBe("postal");
    }
  });
  it("institutions and shopping centres count only without a census population", () => {
    expect(nonLocalityKind("Parliament House", 0)).toBe("institution");
    expect(nonLocalityKind("Hmas Kuttabul", 0)).toBe("institution");
    expect(nonLocalityKind("Monash University", 0)).toBe("institution");
    expect(nonLocalityKind("Wacol East Immigration Centre", 0)).toBe("institution");
    expect(nonLocalityKind("Penrith Plaza", 0)).toBe("shopping-centre");
    expect(nonLocalityKind("Chadstone Centre", 0)).toBe("shopping-centre");
    expect(nonLocalityKind("Parramatta Westfield", 0)).toBe("shopping-centre");
    for (const name of ["North Sydney Shoppingworld", "Pacific Fair", "Warringah Mall", "Macarthur Square", "Rockhampton Shopping Fair", "Forster Shopping Village", "Brisbane Market"]) {
      expect(nonLocalityKind(name, 0), name).toBe("shopping-centre");
    }
    expect(nonLocalityKind("City West Campus", 0)).toBe("institution");
    expect(nonLocalityKind("Gatton College", 0)).toBe("institution");
    expect(nonLocalityKind("Ballarat Roadside Delivery", 0)).toBe("postal");
    expect(nonLocalityKind("Marsden Postal Depot", 0)).toBe("postal");
    // gazetted suburbs with residents
    expect(nonLocalityKind("Brisbane Airport", 22)).toBeNull();
    expect(nonLocalityKind("Melbourne Airport", 64)).toBeNull();
    expect(nonLocalityKind("Airport West", 8173)).toBeNull();
    expect(nonLocalityKind("Noarlunga Centre", 203)).toBeNull();
    expect(nonLocalityKind("Hmas Cerberus", 1124)).toBeNull();
  });
  it("leaves ordinary localities alone", () => {
    for (const name of ["Bondi", "Port Douglas", "Mount Compass", "Plaza Heights", "Centreville", "Pope", "Discovery Bay", "Kiwirrkurra", "Mayfair", "Fairfield", "Squares Creek", "College Park", "Campus Hill", "Marketown", "Mallala", "Box Hill", "Keswick Terminal"]) {
      expect(nonLocalityKind(name, 0), name).toBeNull();
    }
  });
  it("finds the suburb a name is built on", () => {
    expect(baseLocalityName("South Melbourne Dc")).toBe("South Melbourne");
    expect(baseLocalityName("Tweed Heads South Dc")).toBe("Tweed Heads South");
    expect(baseLocalityName("Penrith Plaza")).toBe("Penrith");
    expect(baseLocalityName("Parramatta Westfield")).toBe("Parramatta");
    expect(baseLocalityName("Mitcham Shopping Centre")).toBe("Mitcham");
    expect(baseLocalityName("Mildura Centre Plaza")).toBe("Mildura");
    expect(baseLocalityName("Casula Mall")).toBe("Casula");
    expect(baseLocalityName("Rockhampton Shopping Fair")).toBe("Rockhampton");
    expect(baseLocalityName("Bankstown Square")).toBe("Bankstown");
    expect(baseLocalityName("Westfield")).toBeNull();
    expect(baseLocalityName("Parliament House")).toBeNull();
  });
  it("prints the names the way they are written", () => {
    expect(displayLocalityName("Cairns Mc")).toBe("Cairns MC");
    expect(displayLocalityName("Brisbane Gpo")).toBe("Brisbane GPO");
    expect(displayLocalityName("Hmas Kuttabul")).toBe("HMAS Kuttabul");
    expect(displayLocalityName("Williams Raaf")).toBe("Williams RAAF");
    expect(displayLocalityName("The University Of Sydney")).toBe("The University of Sydney");
    expect(displayLocalityName("Penrith Plaza")).toBe("Penrith Plaza");
  });
});

describe("postcodes and states", () => {
  it("knows the state a postcode belongs to", () => {
    expect(statesForPostcode("2000")).toEqual(["NSW"]);
    expect(statesForPostcode("0872").sort()).toEqual(["NT", "SA", "WA"]);
    expect(statesForPostcode("2620").sort()).toEqual(["ACT", "NSW"]);
    expect(statesForPostcode("872")).toEqual([]);
    expect(statesForPostcode("NOT DISCLOSED")).toEqual([]);
    expect(stateMatchesPostcode({ state: "SA", postcode: "2000" })).toBe(false);
    expect(stateMatchesPostcode({ state: "SA", postcode: "0872" })).toBe(true);
  });
  it("restores the zero a spreadsheet dropped, and refuses what is not a postcode", () => {
    expect(normalisePostcode("872")).toBe("0872");
    expect(normalisePostcode(" 5000 ")).toBe("5000");
    expect(normalisePostcode("NOT DISCLOSED")).toBeNull();
    expect(normalisePostcode("")).toBeNull();
    expect(normalisePostcode(null)).toBeNull();
    expect(normalisePostcode("50000")).toBeNull();
  });
});

describe("misfiled rows", () => {
  const places = [
    { slug: "sydney-nsw-2000", name: "Sydney", state: "NSW", postcode: "2000" },
    { slug: "the-rocks-nsw-2000", name: "The Rocks", state: "NSW", postcode: "2000" },
    { slug: "fadden-act-2904", name: "Fadden", state: "ACT", postcode: "2904" },
    { slug: "gowrie-act-2904", name: "Gowrie", state: "ACT", postcode: "2904" },
    { slug: "alice-springs-nt-0870", name: "Alice Springs", state: "NT", postcode: "0870" },
    { slug: "pipalyatjara-sa-0872", name: "Pipalyatjara", state: "SA", postcode: "0872" },
    { slug: "amata-sa-0872", name: "Amata", state: "SA", postcode: "0872" },
    { slug: "sydney-sa-2000", name: "Sydney", state: "SA", postcode: "2000" },
  ];
  const twin = (name: string, state: string, postcode: string) =>
    findTwin({ slug: `${name.toLowerCase().replace(/ /g, "-")}-${state.toLowerCase()}-${postcode}`, name, state, postcode }, places)?.slug ?? null;
  it("finds the real suburb of the same name in the postcode", () => {
    expect(twin("Sydney", "SA", "2000")).toBe("sydney-nsw-2000");
    expect(twin("SYDNEY", "SA", "2000")).toBe("sydney-nsw-2000");
  });
  it("never takes another misfiled row for the real one", () => {
    expect(findTwin({ slug: "sydney-wa-2000", name: "Sydney", state: "WA", postcode: "2000" }, places)?.slug).toBe("sydney-nsw-2000");
  });
  it("restores a dropped zero before looking", () => {
    expect(twin("Pipalyatjara", "SA", "872")).toBe("pipalyatjara-sa-0872");
  });
  it("accepts a name one or two letters away when only one suburb in the postcode is that close", () => {
    expect(twin("Faddon", "SA", "2904")).toBe("fadden-act-2904");
    expect(twin("Alice Spring", "SA", "0870")).toBe("alice-springs-nt-0870");
    expect(editDistance("wooloongabba", "woolloongabba")).toBe(1);
    expect(editDistance("faddon", "fadden")).toBe(1);
    expect(editDistance("sydney", "melbourne")).toBeGreaterThan(2);
  });
  it("finds nothing for a name with no suburb near it, or for something that is not a postcode", () => {
    expect(twin("North Pole", "VIC", "9999")).toBeNull();
    expect(twin("Not Disclosed", "SA", "NOT DISCLOSED")).toBeNull();
    expect(twin("Gowan", "SA", "2000")).toBeNull();
    // a short name is never matched loosely
    expect(twin("Roks", "SA", "2000")).toBeNull();
  });
});

describe("the generated list", () => {
  it("has the entries, each well formed", () => {
    expect(NON_LOCALITIES.length).toBeGreaterThanOrEqual(250);
    expect(NON_LOCALITIES.length).toBeLessThanOrEqual(400);
    expect(new Set(NON_LOCALITY_SLUGS).size).toBe(NON_LOCALITIES.length + HIDDEN_ROWS.length);
    for (const e of NON_LOCALITIES) {
      expect(e.slug, e.slug).toMatch(/^[a-z0-9-]+-(nsw|vic|qld|wa|sa|tas|nt|act)-\d{3,4}$/);
      expect(e.slug.endsWith(`-${e.state.toLowerCase()}-${e.postcode}`), e.slug).toBe(true);
      expect(["postal", "institution", "shopping-centre", "misfiled"]).toContain(e.kind);
      expect(e.name, e.slug).not.toMatch(/ (Dc|Bc|Mc|Po|Gpo)$|^Hmas |Raaf/);
    }
  });
  it("sends a delivery name to a real suburb in its own postcode, or to its postcode page", () => {
    for (const e of NON_LOCALITIES.filter((x) => x.kind !== "misfiled")) {
      expect(stateMatchesPostcode(e), e.slug).toBe(true);
      if (e.parent) {
        expect(isNonLocalitySlug(e.parent), e.slug).toBe(false);
        expect(e.parent.endsWith(`-${e.state.toLowerCase()}-${e.postcode}`), `${e.slug} -> ${e.parent}`).toBe(true);
        expect(nonLocalityTarget(e)).toBe(`/suburbs/${e.parent}`);
      } else {
        expect(nonLocalityTarget(e)).toBe(`/postcodes/${e.postcode}`);
      }
    }
    expect(nonLocalityTarget(NON_LOCALITIES.find((e) => e.slug === "south-melbourne-dc-vic-3205")!)).toBe("/suburbs/south-melbourne-vic-3205");
    expect(nonLocalityTarget(NON_LOCALITIES.find((e) => e.slug === "parliament-house-nsw-2000")!)).toBe("/postcodes/2000");
    expect(nonLocalitiesInPostcode("4211").map((e) => e.name).sort()).toEqual(["Nerang BC", "Nerang DC"]);
  });
  it("sends a misfiled row to the real suburb beside it, in a state the postcode belongs to", () => {
    const misfiled = NON_LOCALITIES.filter((e) => e.kind === "misfiled");
    expect(misfiled.length).toBeGreaterThanOrEqual(25);
    for (const e of misfiled) {
      expect(stateMatchesPostcode(e), e.slug).toBe(false);
      expect(e.parent, e.slug).toBeTruthy();
      const parent = e.parent!;
      expect(isNonLocalitySlug(parent), e.slug).toBe(false);
      const m = parent.match(/-(nsw|vic|qld|wa|sa|tas|nt|act)-(\d{4})$/);
      expect(m, parent).not.toBeNull();
      expect(m![2]).toBe(normalisePostcode(e.postcode));
      expect(stateMatchesPostcode({ state: m![1].toUpperCase(), postcode: m![2] }), parent).toBe(true);
    }
    expect(nonLocalityBySlug("sydney-sa-2000")?.parent).toBe("sydney-nsw-2000");
    expect(nonLocalityBySlug("pipalyatjara-sa-872")?.parent).toBe("pipalyatjara-sa-0872");
    expect(nonLocalityBySlug("faddon-sa-2904")?.parent).toBe("fadden-act-2904");
  });
  it("does not list a misfiled row as a delivery name on the postcode page", () => {
    expect(nonLocalitiesInPostcode("2000").map((e) => e.slug)).not.toContain("sydney-sa-2000");
    for (const e of nonLocalitiesInPostcode("2000")) expect(DELIVERY_KINDS).toContain(e.kind);
    expect(nonLocalitiesInPostcode("872")).toEqual([]);
    expect(nonLocalitiesInPostcode("9999")).toEqual([]);
  });
  it("hides the rows with nowhere to go", () => {
    expect(HIDDEN_ROWS.map((h) => h.name).sort()).toEqual(["North Pole", "Not Disclosed"]);
    for (const h of HIDDEN_ROWS) {
      expect(isHiddenSlug(h.slug)).toBe(true);
      expect(isNonLocalitySlug(h.slug)).toBe(true);
      expect(NON_LOCALITY_SLUGS).toContain(h.slug);
      expect(MISFILED_SLUGS).toContain(h.slug);
      expect(nonLocalityBySlug(h.slug)).toBeNull();
    }
    expect(isHiddenSlug("sydney-sa-2000")).toBe(false);
    expect(MISFILED_SLUGS).toContain("sydney-sa-2000");
    expect(MISFILED_SLUGS).not.toContain("nerang-dc-qld-4211");
  });
});

describe("redirects", () => {
  it("two per entry, none to itself, sub-pages kept on a parent suburb", () => {
    const rules = nonLocalityRedirects();
    expect(rules).toHaveLength(NON_LOCALITIES.length * 2);
    for (const r of rules) expect(r.source).not.toBe(r.destination);
    expect(rules).toContainEqual({ source: "/suburbs/nerang-dc-qld-4211", destination: "/suburbs/nerang-qld-4211", permanent: true });
    expect(rules).toContainEqual({ source: "/suburbs/nerang-dc-qld-4211/:path*", destination: "/suburbs/nerang-qld-4211/:path*", permanent: true });
    expect(rules).toContainEqual({ source: "/suburbs/parliament-house-nsw-2000/:path*", destination: "/postcodes/2000", permanent: true });
  });
  it("next.config.ts serves exactly those rules, and the total stays well inside the platform limit", async () => {
    const all = await nextConfig.redirects!();
    const ours = all.filter((r) => r.source.startsWith("/suburbs/"));
    expect(ours).toEqual(nonLocalityRedirects());
    expect(all.length).toBeLessThan(1000);
  });
});

describe("lists that must not carry them", () => {
  it("the most-searched suburbs", () => {
    expect(TOP_SUBURBS.filter((s) => isNonLocalitySlug(s.slug))).toEqual([]);
    expect(TOP_SUBURBS.length).toBeGreaterThan(250);
  });
  it("the services filter them out at the query", () => {
    const has = (file: string, needle: string) => expect(fs.readFileSync(file, "utf8"), file).toContain(needle);
    has("src/lib/services/suburb-service.ts", "s.nearbySuburbs.filter((n) => !isNonLocalitySlug(n))");
    has("src/lib/services/postcode-service.ts", "where: { postcode, ...LOCALITIES_ONLY }");
    has("src/lib/services/region-service.ts", "where: { region, ...LOCALITIES_ONLY }");
    has("src/lib/services/search-service.ts", "slug: { notIn: NON_LOCALITY_SLUGS }");
    has("src/app/api/suburbs/search/route.ts", "slug: { notIn: NON_LOCALITY_SLUGS }");
    has("src/app/api/suggest/route.ts", "slug: { notIn: NON_LOCALITY_SLUGS }");
    has("src/lib/services/suburb-rankings-service.ts", "const stateFilter = { ...(state ? { state } : {}), ...LOCALITIES_ONLY };");
    has("src/lib/services/suburb-rankings-service.ts", "if (!isNonLocalitySlug(n)) candidateNeighbourSlugs.add(n)");
    has("src/app/(marketing)/compare/sitemap.ts", "sitemap-compare:v3");
    has("src/lib/services/suburb-service.ts", "if (isHiddenSlug(slug)) return null;");
    has("src/lib/services/postcode-service.ts", "where: LISTED_POSTCODES,");
    has("scripts/sync/slug-matcher.ts", "if (!stateMatchesPostcode(s)) continue;");
    has("scripts/sync/sources/import-suburbs.ts", "!stateMatchesPostcode({ state: row.state, postcode })");
  });
  it("every file that lists suburbs filters them, or says why it does not", () => {
    // PR #66 filtered the lists it knew of. The rankings, the comparison
    // pairs, the price guide and the market reports were not among them, and
    // 50 pairs with a mail centre stayed in the comparison sitemap. A new
    // list now has to make the choice.
    const ON_PURPOSE: Record<string, string> = {
      "src/lib/services/school-service.ts": "resolves the suburb slugs it is handed, which the region lists have filtered",
    };
    const files = (fs.readdirSync("src", { recursive: true, encoding: "utf8" }) as string[])
      .map((f) => `src/${f.split("\\").join("/")}`)
      .filter((f) => /\.(ts|tsx)$/.test(f) && !f.startsWith("src/generated/"));
    const listing = files.filter((f) => /\.suburb\.(findMany|groupBy|count)\(|FROM "Suburb"/.test(fs.readFileSync(f, "utf8")));
    expect(listing.length).toBeGreaterThanOrEqual(12);
    for (const f of Object.keys(ON_PURPOSE)) expect(listing, f).toContain(f);
    for (const f of listing) {
      if (ON_PURPOSE[f]) continue;
      expect(fs.readFileSync(f, "utf8"), f).toMatch(/LOCALITIES_ONLY|NON_LOCALITY_SLUGS|isNonLocalitySlug/);
    }
  });
});
