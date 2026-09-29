// Postal delivery names, institutions and shopping-centre post offices are not suburbs.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { baseLocalityName, displayLocalityName, nonLocalityKind } from "@/lib/locality-names";
import {
  NON_LOCALITIES,
  NON_LOCALITY_SLUGS,
  isNonLocalitySlug,
  nonLocalitiesInPostcode,
  nonLocalityRedirects,
  nonLocalityTarget,
} from "@/lib/non-localities";
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
    // gazetted suburbs with residents
    expect(nonLocalityKind("Brisbane Airport", 22)).toBeNull();
    expect(nonLocalityKind("Melbourne Airport", 64)).toBeNull();
    expect(nonLocalityKind("Airport West", 8173)).toBeNull();
    expect(nonLocalityKind("Noarlunga Centre", 203)).toBeNull();
    expect(nonLocalityKind("Hmas Cerberus", 1124)).toBeNull();
  });
  it("leaves ordinary localities alone", () => {
    for (const name of ["Bondi", "Port Douglas", "Mount Compass", "Plaza Heights", "Centreville", "Pope", "Discovery Bay", "Kiwirrkurra"]) {
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

describe("the generated list", () => {
  it("has the entries, each well formed", () => {
    expect(NON_LOCALITIES.length).toBeGreaterThanOrEqual(250);
    expect(NON_LOCALITIES.length).toBeLessThanOrEqual(400);
    expect(new Set(NON_LOCALITY_SLUGS).size).toBe(NON_LOCALITIES.length);
    for (const e of NON_LOCALITIES) {
      expect(e.slug, e.slug).toMatch(/^[a-z0-9-]+-(nsw|vic|qld|wa|sa|tas|nt|act)-\d{4}$/);
      expect(e.slug.endsWith(`-${e.state.toLowerCase()}-${e.postcode}`), e.slug).toBe(true);
      expect(["postal", "institution", "shopping-centre"]).toContain(e.kind);
      expect(e.name, e.slug).not.toMatch(/ (Dc|Bc|Mc|Po|Gpo)$|^Hmas |Raaf/);
    }
  });
  it("sends an entry to a real suburb in its own postcode, or to its postcode page", () => {
    for (const e of NON_LOCALITIES) {
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
