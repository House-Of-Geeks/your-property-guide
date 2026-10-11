// Commercial intent review 3.7 (1 Oct 2026): /house-and-land was "Crawled,
// currently not indexed" while the site held no package (0 rows in
// production on 1 Oct 2026): 36 words around "0 new packages", indexable,
// and listed in /house-and-land/sitemap.xml and /pages/sitemap.xml.
// Indexing now follows the stock. One rule (src/lib/house-and-land-indexability.ts)
// read from one cached count by the hub, the package pages,
// /house-and-land/sitemap.xml and the sitemap index. These tests drive every
// reader with the same count and check that they agree, that the empty hub
// says so and points somewhere useful, and that no reader is a longer-lived
// ISR page than the count's cache.
import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { HouseAndLandPackage } from "@/types";

const stock = vi.hoisted(() => ({
  live: 0 as number | Error,
  packages: [] as HouseAndLandPackage[],
}));

// The seo components index reaches a module marked server-only.
vi.mock("server-only", () => ({}));
// No Next runtime here: a cached function is the function.
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/services/house-and-land-service", () => ({
  getLiveHouseAndLandPackageCount: async () => {
    if (stock.live instanceof Error) throw stock.live;
    return stock.live;
  },
  getAllHouseAndLandSlugs: async () => stock.packages.map((p) => p.slug),
  getHouseAndLandPackages: async (suburb?: string) =>
    suburb ? stock.packages.filter((p) => p.suburbSlug === suburb) : stock.packages,
  getHouseAndLandBySlug: async (slug: string) => stock.packages.find((p) => p.slug === slug) ?? null,
}));

import {
  MIN_LIVE_PACKAGES,
  NO_STOCK_DESCRIPTION,
  NO_STOCK_ROBOTS,
  STOCK_CACHE_SECONDS,
  hasHouseAndLandStock,
  houseAndLandRobots,
} from "@/lib/house-and-land-indexability";
import { SITE_URL } from "@/lib/constants";
import HouseAndLandPage, { generateMetadata as hubMetadata } from "@/app/(marketing)/house-and-land/page";
import { generateMetadata as packageMetadata } from "@/app/(marketing)/house-and-land/[slug]/page";
import houseAndLandSitemap from "@/app/(marketing)/house-and-land/sitemap";
import pagesSitemap from "@/app/pages/sitemap";
import { GET as sitemapIndex } from "@/app/sitemap.xml/route";

const SRC = path.resolve(__dirname, "../../src");
const HUB = `${SITE_URL}/house-and-land`;
const HL_SITEMAP = `${SITE_URL}/house-and-land/sitemap.xml`;

function pkg(n: number, suburbSlug = "ripley-qld-4306"): HouseAndLandPackage {
  return {
    id: `p${n}`,
    slug: `package-${n}`,
    title: `Package ${n}`,
    builder: "Builder",
    estate: "Estate",
    suburb: "Ripley",
    suburbSlug,
    price: { display: "Contact agent", value: 1 },
    features: { bedrooms: 4, bathrooms: 2, carSpaces: 2, landSize: 400, buildingSize: 200 },
    description: "",
    images: [],
    agentId: "a",
    agencyId: "b",
    inclusions: [],
    isNew: false,
    dateAdded: "2026-10-01T00:00:00.000Z",
  };
}

function setStock(n: number) {
  stock.packages = Array.from({ length: n }, (_, i) => pkg(i + 1));
  stock.live = n;
}

const noindex = (robots: unknown) =>
  typeof robots === "object" && robots !== null && (robots as { index?: boolean }).index === false;

async function renderHub(searchParams: Record<string, string> = {}): Promise<string> {
  return renderToStaticMarkup(await HouseAndLandPage({ searchParams: Promise.resolve(searchParams) }));
}

const text = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

beforeEach(() => setStock(0));

describe("the rule", () => {
  it("is indexable from the first live package", () => {
    expect(MIN_LIVE_PACKAGES).toBe(1);
    expect(hasHouseAndLandStock(0)).toBe(false);
    expect(hasHouseAndLandStock(1)).toBe(true);
    expect(hasHouseAndLandStock(250)).toBe(true);
    expect(hasHouseAndLandStock(Number.NaN)).toBe(false);
  });
  it("answers noindex, follow without stock and leaves robots to the site default with it", () => {
    expect(houseAndLandRobots(0)).toEqual({ index: false, follow: true });
    expect(houseAndLandRobots(0)).toBe(NO_STOCK_ROBOTS);
    expect(houseAndLandRobots(1)).toBeUndefined();
  });
});

describe("the hub and the sitemaps read the same count and agree", () => {
  for (const n of [0, 1, 3]) {
    it(`${n} live package${n === 1 ? "" : "s"}`, async () => {
      setStock(n);
      const stocked = n > 0;
      const meta = await hubMetadata({ searchParams: Promise.resolve({}) });
      const hl = (await houseAndLandSitemap()).map((e) => e.url);
      const pages = (await pagesSitemap()).map((e) => e.url);
      const index = await (await sitemapIndex()).text();

      expect(noindex(meta.robots)).toBe(!stocked);
      // The hub is submitted exactly when it is indexable, and by one sitemap only.
      expect(hl.includes(HUB)).toBe(stocked);
      expect(pages).not.toContain(HUB);
      expect(index.includes(`<loc>${HL_SITEMAP}</loc>`)).toBe(stocked);
      // Package pages ride on the same gate.
      expect(hl.filter((u) => u.startsWith(`${HUB}/`))).toEqual(stock.packages.map((p) => `${HUB}/${p.slug}`));
      // The canonical never changes.
      expect(meta.alternates?.canonical).toBe(HUB);
    });
  }

  it("a suburb filter follows the hub", async () => {
    const empty = await hubMetadata({ searchParams: Promise.resolve({ suburb: "ripley-qld-4306" }) });
    expect(noindex(empty.robots)).toBe(true);
    setStock(2);
    const stocked = await hubMetadata({ searchParams: Promise.resolve({ suburb: "ripley-qld-4306" }) });
    expect(stocked.robots).toBeUndefined();
    expect(stocked.alternates?.canonical).toBe(HUB);
  });

  it("without stock the description says nothing is listed, and does not promise packages", async () => {
    const meta = await hubMetadata({ searchParams: Promise.resolve({}) });
    expect(meta.description).toBe(NO_STOCK_DESCRIPTION);
    expect(NO_STOCK_DESCRIPTION).toContain("No house and land packages are listed right now.");
    expect(NO_STOCK_DESCRIPTION.length).toBeLessThanOrEqual(160);
    setStock(1);
    expect((await hubMetadata({ searchParams: Promise.resolve({}) })).description).not.toBe(NO_STOCK_DESCRIPTION);
  });

  it("when the count cannot be read the sitemaps submit nothing for the section, and the index still answers", async () => {
    stock.live = new Error("connection terminated");
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(await houseAndLandSitemap()).toEqual([]);
      const res = await sitemapIndex();
      const index = await res.text();
      expect(res.status).toBe(200);
      expect(index).not.toContain("house-and-land");
      expect(index).toContain(`<loc>${SITE_URL}/pages/sitemap.xml</loc>`);
      // The page itself does not guess: it fails (500, retried) rather than answer noindex.
      await expect(hubMetadata({ searchParams: Promise.resolve({}) })).rejects.toThrow("connection terminated");
    } finally {
      spy.mockRestore();
    }
  });
});

describe("package pages", () => {
  it("are indexable with stock and follow the hub while the cached count lags a new package", async () => {
    setStock(1);
    const live = await packageMetadata({ params: Promise.resolve({ slug: "package-1" }) });
    expect(live.robots).toBeUndefined();
    expect(live.alternates?.canonical).toBe(`${HUB}/package-1`);
    stock.live = 0; // the row exists, the cached count has not seen it yet
    expect(noindex((await packageMetadata({ params: Promise.resolve({ slug: "package-1" }) })).robots)).toBe(true);
  });
  it("do not exist without a package (the page calls notFound)", async () => {
    expect((await packageMetadata({ params: Promise.resolve({ slug: "nothing-here" }) })).title).toBe("Package Not Found");
    const src = fs.readFileSync(path.join(SRC, "app/(marketing)/house-and-land/[slug]/page.tsx"), "utf8");
    expect(src).toMatch(/if \(!pkg\) notFound\(\);/);
  });
});

describe("the empty hub", () => {
  it("says plainly that nothing is listed and prints no count", async () => {
    const t = text(await renderHub());
    expect(t).toContain("No house and land packages are listed right now.");
    expect(t).not.toMatch(/\b0 new package/);
    expect(t).not.toContain("No packages found");
    // No figure in the page's own copy (the guide titles below carry their own, sourced on each guide).
    const own = t.slice(0, t.indexOf("Related guides"));
    expect(own).not.toMatch(/\d/);
  });

  it("points to the house-and-land guide, the first home buyer and stamp duty pages", async () => {
    const html = await renderHub();
    for (const href of [
      "/guides/house-and-land-packages-are-they-worth-it",
      "/guides/how-to-find-a-builder-australia",
      "/guides/first-home-owner-grant-australia",
      "/guides/first-home-buyer-guide",
      "/first-home-buyers",
      "/guides/first-home-buyer-qld",
      "/guides/first-home-buyer-wa",
      "/stamp-duty-calculator",
      "/guides/stamp-duty-qld",
      "/guides/stamp-duty-nsw",
    ]) {
      expect(html, href).toContain(`href="${href}"`);
    }
    // Spacing around the inline links (the JSX spacing trap), read from the markup itself.
    expect(html).toMatch(
      /use the <a [^>]*>stamp duty calculator<\/a>\. Every grant and scheme for a first home is on the <a [^>]*>first home buyers<\/a> page\./,
    );
  });

  it("names the suburb when filtered", async () => {
    const t = text(await renderHub({ suburb: "ripley-qld-4306" }));
    expect(t).toContain("No house and land packages are listed in Ripley right now.");
    expect(t).not.toContain("See every package listed");
  });
});

describe("the stocked hub", () => {
  it("lists the packages with their count and keeps the guides", async () => {
    setStock(3);
    const html = await renderHub();
    const t = text(html);
    expect(t).toContain("3 new packages");
    expect(t).not.toContain("No house and land packages are listed");
    for (const p of stock.packages) expect(html).toContain(`href="/house-and-land/${p.slug}"`);
    expect(html).toContain('href="/guides/house-and-land-packages-are-they-worth-it"');
    // Review 10 Oct 2026, F10: true the day stock appears.
    expect(t).not.toMatch(/top (Australian )?builders/i);
    expect(t).not.toMatch(/stamp-duty savings/i);
    expect(t).toContain("depends on your state and on how the land and building contracts are written");
  });
  it("a suburb with nothing listed says so and links every package", async () => {
    setStock(2);
    const t = text(await renderHub({ suburb: "logan-reserve-qld-4133" }));
    expect(t).toContain("No house and land packages are listed in Logan Reserve right now.");
    expect(t).toContain("See every package listed");
  });
});

describe("caching", () => {
  const readers = (): string[] => {
    const out: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full);
        else if (/\.tsx?$/.test(e.name) && fs.readFileSync(full, "utf8").includes("getLiveHouseAndLandPackageCount(")) out.push(full);
      }
    };
    walk(path.join(SRC, "app"));
    return out.map((f) => path.relative(SRC, f)).sort();
  };

  it("the count is read by the hub, the package pages and the two sitemaps, nothing else", () => {
    expect(readers()).toEqual([
      "app/(marketing)/house-and-land/[slug]/page.tsx",
      "app/(marketing)/house-and-land/page.tsx",
      "app/(marketing)/house-and-land/sitemap.ts",
      "app/sitemap.xml/route.ts",
    ]);
  });

  it("no reader is an ISR page with a longer window than the count's cache", () => {
    for (const rel of readers()) {
      const code = fs.readFileSync(path.join(SRC, rel), "utf8").replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, "");
      const m = /export const revalidate\s*=\s*(\d+)/.exec(code);
      if (m) expect(Number(m[1]), rel).toBeLessThanOrEqual(STOCK_CACHE_SECONDS);
    }
  });

  it("the hub reads searchParams, so it exports no revalidate (rule: no top-level searchParams in an ISR route)", () => {
    const code = fs
      .readFileSync(path.join(SRC, "app/(marketing)/house-and-land/page.tsx"), "utf8")
      .replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, "");
    expect(code).toMatch(/await searchParams/);
    expect(code).not.toMatch(/export const revalidate/);
  });

  it("the cached count uses the window and tag the rule declares", () => {
    const src = fs.readFileSync(path.join(SRC, "lib/services/house-and-land-service.ts"), "utf8");
    expect(src).toMatch(/revalidate: STOCK_CACHE_SECONDS, tags: \[STOCK_CACHE_TAG\]/);
    expect(STOCK_CACHE_SECONDS).toBe(3600);
  });
});
