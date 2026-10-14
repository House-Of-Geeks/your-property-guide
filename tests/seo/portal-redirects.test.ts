// Portal consolidation (14 Oct 2026, docs/portal-consolidation-2026-10-14.md).
// The listing routes are retired: each path 308s, in one hop, to the page
// that now serves its reader, through next.config.ts redirects() (applied
// before the filesystem). The rules are matched here the way Next matches
// them at runtime (getPathMatch with strict + removeUnnamedParams, then
// prepareDestination without appending params), in config order, first
// match wins.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";
import { prepareDestination } from "next/dist/shared/lib/router/utils/prepare-destination";
import nextConfig from "../../next.config";

// The seo/sitemap modules reach a module marked server-only; no Next runtime here.
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));

import pagesSitemap from "@/app/pages/sitemap";
import { GET as sitemapIndex } from "@/app/sitemap.xml/route";
import { SUBPAGE_TYPES } from "@/app/(marketing)/suburbs/subpages/sitemap";
import { listingCardHref } from "@/components/property/PropertyCard";

type Redirect = Awaited<ReturnType<NonNullable<typeof nextConfig.redirects>>>[number];

const ROOT = path.resolve(__dirname, "../..");
const MARKETING = path.join(ROOT, "src/app/(marketing)");

let rules: Redirect[] | null = null;
async function redirects(): Promise<Redirect[]> {
  rules ??= await nextConfig.redirects!();
  return rules;
}

/** The redirect Next would answer for a request path, or null when the filesystem serves it. */
async function resolve(pathname: string): Promise<{ status: 307 | 308; location: string } | null> {
  for (const r of await redirects()) {
    const params = getPathMatch(r.source, { strict: true, removeUnnamedParams: true })(pathname);
    if (!params) continue;
    const { parsedDestination } = prepareDestination({
      appendParamsToQuery: false,
      destination: r.destination,
      params,
      query: {},
    });
    const permanent = "permanent" in r ? r.permanent : r.statusCode === 308;
    return { status: permanent ? 308 : 307, location: parsedDestination.pathname ?? "" };
  }
  return null;
}

const SUBURB = "x-qld-4000";

// path → where it lands
const CONSOLIDATED: Record<string, string> = {
  "/buy": "/buying",
  "/buy/28-spearmint-street-griffin-qld-4503": "/buying",
  "/buy/dakabin-qld-4503-21611295": "/buying",
  "/rent": "/guides",
  "/rent/12-some-street-kew-vic-3101": "/guides",
  "/sold": "/suburbs",
  "/sold/12-some-street-kew-vic-3101": "/suburbs",
  "/off-market": "/selling",
  "/off-market/anything": "/selling",
  "/house-and-land": "/buying",
  "/house-and-land/package-1": "/buying",
  "/best-deals": "/buying",
  "/best-deals/cm1abcdef0000": "/buying",
  [`/suburbs/${SUBURB}/buy`]: `/suburbs/${SUBURB}`,
  [`/suburbs/${SUBURB}/rent`]: `/suburbs/${SUBURB}`,
  [`/suburbs/${SUBURB}/houses`]: `/suburbs/${SUBURB}`,
  [`/suburbs/${SUBURB}/units`]: `/suburbs/${SUBURB}`,
  [`/suburbs/${SUBURB}/townhouses`]: `/suburbs/${SUBURB}`,
  [`/suburbs/${SUBURB}/land`]: `/suburbs/${SUBURB}`,
};

// The 17 legacy property-slug redirects (agency suffix dropped) folded into
// the /buy rule. A sample: each must reach /buying in one hop, not via a
// /buy/{new-slug} listing.
const LEGACY_THOMSON = [
  "/buy/28-spearmint-street-griffin-4503-thomson",
  "/buy/dakabin-4503-thomson",
  "/buy/unit-14-9-violet-st-redcliffe-4020-thomson",
  "/buy/burpengary-4505-21049882-thomson",
];

const UNTOUCHED = [
  `/suburbs/${SUBURB}`,
  `/suburbs/${SUBURB}/rental-market`,
  `/suburbs/${SUBURB}/schools`,
  `/suburbs/${SUBURB}/agents`,
  `/suburbs/${SUBURB}/vs/y-qld-4001`,
  `/suburbs/${SUBURB}/smith-street`, // street pages answer 410 from their route
  `/suburbs/${SUBURB}/landsborough-avenue`,
  "/suburbs",
  "/buying",
  "/buying-guide",
  "/selling",
  "/selling-guide",
  "/rental-yield-calculator",
  "/search",
  "/guides",
  "/property/12-some-street-kew-vic-3101", // 410 by design
];

describe("the consolidated routes redirect permanently, in one hop", () => {
  for (const [from, to] of Object.entries(CONSOLIDATED)) {
    it(`${from} → ${to}`, async () => {
      const hit = await resolve(from);
      expect(hit).toEqual({ status: 308, location: to });
      // One hop: the destination is served, not redirected again.
      expect(await resolve(to)).toBeNull();
    });
  }

  it("the legacy /buy/*-thomson slugs land on /buying in one hop", async () => {
    for (const from of LEGACY_THOMSON) {
      expect(await resolve(from), from).toEqual({ status: 308, location: "/buying" });
    }
    const all = await redirects();
    expect(all.filter((r) => r.source.endsWith("-thomson"))).toEqual([]);
    expect(all.filter((r) => r.destination.startsWith("/buy/"))).toEqual([]);
  });

  it("a trailing path under a retired listing route still lands on its target", async () => {
    expect(await resolve("/buy/a/b")).toEqual({ status: 308, location: "/buying" });
    expect(await resolve("/house-and-land/a/b")).toEqual({ status: 308, location: "/buying" });
  });
});

describe("what stays where it is", () => {
  for (const p of UNTOUCHED) {
    it(`${p} is not redirected`, async () => {
      expect(await resolve(p)).toBeNull();
    });
  }
  it("/suburbs/x-qld-4000/rental-market in particular", async () => {
    expect(await resolve("/suburbs/x-qld-4000/rental-market")).toBeNull();
  });
});

describe("no redirect chains", () => {
  it("no rule with a fixed destination points at a path another rule redirects", async () => {
    for (const r of await redirects()) {
      if (r.destination.includes(":")) continue;
      expect(await resolve(r.destination), `${r.source} → ${r.destination}`).toBeNull();
    }
  });
});

describe("the retired routes are gone from the filesystem", () => {
  it("their route directories and dedicated sitemaps are deleted", () => {
    for (const dir of ["buy", "rent", "sold", "off-market", "house-and-land", "best-deals"]) {
      expect(fs.existsSync(path.join(MARKETING, dir)), dir).toBe(false);
    }
    for (const sub of ["buy", "rent", "houses", "units", "townhouses", "land"]) {
      expect(fs.existsSync(path.join(MARKETING, "suburbs/[slug]", sub)), sub).toBe(false);
    }
    // Left alone: the 410 routes and the suburb pages with traffic.
    expect(fs.existsSync(path.join(MARKETING, "suburbs/[slug]/[street]/route.ts"))).toBe(true);
    expect(fs.existsSync(path.join(MARKETING, "suburbs/[slug]/rental-market/page.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(MARKETING, "suburbs/[slug]/page.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(MARKETING, "search/page.tsx"))).toBe(true);
  });
});

describe("no sitemap submits a retired route", () => {
  const RETIRED = /\/(buy|rent|sold|off-market|house-and-land|best-deals)(\/|$)/;

  it("the static pages sitemap", async () => {
    const urls = (await pagesSitemap()).map((e) => new URL(e.url).pathname);
    expect(urls.length).toBeGreaterThan(30);
    expect(urls.filter((u) => RETIRED.test(u))).toEqual([]);
  });

  it("the sitemap index", async () => {
    const xml = await (await sitemapIndex()).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    expect(locs.length).toBeGreaterThan(10);
    expect(locs.filter((u) => RETIRED.test(u))).toEqual([]);
    expect(locs.filter((u) => /\/suburbs\/subpages\/sitemap\/(buy|rent|houses|units|townhouses|land)\.xml$/.test(u))).toEqual([]);
    expect(locs).toContain("/suburbs/subpages/sitemap/rental-market.xml");
  });

  it("the suburb sub-page sitemaps", () => {
    expect([...SUBPAGE_TYPES].sort()).toEqual(["agents", "rental-market", "schools"]);
  });

  it("the IndexNow seed script", () => {
    const seed = fs.readFileSync(path.join(ROOT, "scripts/seed-bing-indexnow.cjs"), "utf8");
    const include = seed.slice(seed.indexOf("const INCLUDE_CHILDREN"), seed.indexOf("];", seed.indexOf("const INCLUDE_CHILDREN")));
    for (const child of ["buy", "rent", "sold", "house-and-land", "best-deals"]) expect(include, child).not.toContain(`"${child}"`);
  });
});

describe("internal links go straight to the target", () => {
  it("a listing card links where its old page now redirects, without the hop", async () => {
    expect(listingCardHref({ listingType: "buy", suburbSlug: SUBURB })).toBe("/buying");
    expect(listingCardHref({ listingType: "off-market", suburbSlug: SUBURB })).toBe("/buying");
    expect(listingCardHref({ listingType: "rent", suburbSlug: SUBURB })).toBe("/guides");
    expect(listingCardHref({ listingType: "sold", suburbSlug: SUBURB })).toBe(`/suburbs/${SUBURB}`);
    for (const t of ["buy", "rent", "sold", "off-market", "house-and-land"] as const) {
      expect(await resolve(listingCardHref({ listingType: t, suburbSlug: SUBURB })), t).toBeNull();
    }
  });

  it("no marketing page, component or blog post links a retired route", () => {
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full);
        else if (/\.(ts|tsx)$/.test(e.name)) files.push(full);
      }
    };
    // Layout, journey and homepage files belong to the layout rewrite and are
    // checked there; the profile and rental-market pages keep links guarded
    // by an availability flag that is always false (suburb-subpages.test.ts).
    for (const d of ["src/app/(marketing)", "src/components", "src/lib/data", "src/lib/guides"]) walk(path.join(ROOT, d));
    const href = /(href=|href:\s*|<a href=)["'`{]*\/(buy|rent|sold|off-market|house-and-land|best-deals)([/?#"'`]|$)/;
    const hits = files
      .filter((f) => !/src\/components\/(layout|journey|journeys)\//.test(f))
      .flatMap((f) =>
        fs
          .readFileSync(f, "utf8")
          .split("\n")
          .map((line, i) => ({ line, at: `${path.relative(ROOT, f)}:${i + 1}` }))
          .filter(({ line }) => href.test(line))
          .map(({ at }) => at),
      );
    expect(hits).toEqual([]);
  });
});

describe("lead data is preserved", () => {
  it("/api/leads still accepts the listing lead types, so nothing in flight breaks", () => {
    const route = fs.readFileSync(path.join(ROOT, "src/app/api/leads/route.ts"), "utf8");
    for (const t of ["property-enquiry", "off-market-register", "house-and-land-enquiry"]) {
      expect(route, t).toContain(`"${t}"`);
    }
  });
});
