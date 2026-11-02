import { SITE_URL } from "@/lib/constants";
import { getPageSitemapEntries } from "@/app/pages/sitemap";
import { getGuideSitemapLinks } from "@/app/(marketing)/guides/sitemap";
import { getGlossarySitemapLinks } from "@/app/(marketing)/glossary/sitemap";
import { getRegionSitemapLinks } from "@/app/(marketing)/regions/sitemap";
import { getSuburbSitemapLinks } from "@/app/(marketing)/suburbs/sitemap";
import { getSubpageSitemapLinks } from "@/app/(marketing)/suburbs/subpages/sitemap";
import { getSchoolSitemapLinks } from "@/app/(marketing)/schools/sitemap";
import { getPostcodeSitemapLinks } from "@/app/(marketing)/postcodes/sitemap";
import { getStateSitemapLinks } from "@/app/(marketing)/states/sitemap";
import { getBestSuburbSitemapLinks } from "@/app/(marketing)/best-suburbs/sitemap";
import { getCityEditionSitemapLinks } from "@/app/(marketing)/best-suburbs/cities/sitemap";
import { getCompareSitemapLinks } from "@/app/(marketing)/compare/sitemap";
import { getMarketReportSitemapLinks } from "@/app/(marketing)/market-reports/sitemap";
import { getPropertyMarketSitemapLinks } from "@/app/(marketing)/property-market/sitemap";

// About 1,000 links a page, counting the directory links themselves. A few
// navigation links sit outside that list.
export const HTML_SITEMAP_PAGE_SIZE = 1000;

export type HtmlSitemapLink = { href: string; title: string };

export type HtmlSitemapSectionSummary = {
  id: string;
  title: string;
  hubs: HtmlSitemapLink[];
  linkCount: number;
  pageCount: number;
};

export type HtmlSitemapSectionPage = {
  id: string;
  title: string;
  links: HtmlSitemapLink[];
  page: number;
  pageCount: number;
  linkCount: number;
};

type UrlTitle = { url: string; title: string };

type SectionDef = {
  id: string;
  title: string;
  /** Landing pages. Shown on the index only when the pages sitemap still lists them. */
  hubHrefs: string[];
  load: () => Promise<UrlTitle[]>;
};

// Child paths are words, never /sitemap/0 or /sitemap/1.xml. XML urlsets on
// this site are /sitemap.xml and /{section}/sitemap.xml (and
// /suburbs/subpages/sitemap/{id}.xml). A numeric first segment would sit on
// the same shape as Next's generateSitemaps ids.
const SECTIONS: readonly SectionDef[] = [
  {
    id: "pages",
    title: "Pages",
    hubHrefs: [
      "/",
      "/buying",
      "/selling",
      "/first-home-buyers",
      "/investing",
      "/upgrading",
      "/renovating",
      "/buying-and-selling",
      "/plan",
      "/get-help",
      "/tools",
      "/guides",
      "/about",
      "/contact",
      "/privacy",
    ],
    load: () => getPageSitemapEntries(),
  },
  {
    id: "guides",
    title: "Guides",
    hubHrefs: ["/guides"],
    load: async () => getGuideSitemapLinks(),
  },
  {
    id: "glossary",
    title: "Glossary",
    hubHrefs: ["/glossary"],
    load: async () => getGlossarySitemapLinks(),
  },
  {
    id: "suburbs",
    title: "Suburbs",
    hubHrefs: ["/suburbs", "/find-your-suburb", "/price-guide"],
    load: () => getSuburbSitemapLinks(),
  },
  {
    id: "suburb-schools",
    title: "Suburb schools",
    hubHrefs: ["/schools"],
    load: () => getSubpageSitemapLinks("schools"),
  },
  {
    id: "suburb-rental-market",
    title: "Suburb rental market",
    hubHrefs: [],
    load: () => getSubpageSitemapLinks("rental-market"),
  },
  {
    id: "suburb-agents",
    title: "Suburb agents",
    hubHrefs: [],
    load: () => getSubpageSitemapLinks("agents"),
  },
  {
    id: "schools",
    title: "Schools",
    hubHrefs: ["/schools"],
    load: () => getSchoolSitemapLinks(),
  },
  {
    id: "postcodes",
    title: "Postcodes",
    hubHrefs: ["/postcodes"],
    load: () => getPostcodeSitemapLinks(),
  },
  {
    id: "regions",
    title: "Regions",
    hubHrefs: ["/regions"],
    load: () => getRegionSitemapLinks(),
  },
  {
    id: "states",
    title: "States",
    hubHrefs: ["/states"],
    load: async () => getStateSitemapLinks(),
  },
  {
    id: "best-suburbs",
    title: "Best suburbs",
    hubHrefs: ["/best-suburbs"],
    load: async () => getBestSuburbSitemapLinks(),
  },
  {
    id: "best-suburb-cities",
    title: "Best suburbs by city",
    hubHrefs: ["/best-suburbs"],
    load: () => getCityEditionSitemapLinks(),
  },
  {
    id: "compare",
    title: "Suburb comparisons",
    hubHrefs: ["/compare"],
    load: () => getCompareSitemapLinks(),
  },
  {
    id: "market-reports",
    title: "Market reports",
    hubHrefs: ["/market-reports", "/rba-cash-rate"],
    load: async () => getMarketReportSitemapLinks(),
  },
  {
    id: "property-market",
    title: "Property market",
    hubHrefs: ["/property-market"],
    load: async () => getPropertyMarketSitemapLinks(),
  },
];

export const HTML_SITEMAP_SECTION_IDS: readonly string[] = SECTIONS.map((s) => s.id);

export function isHtmlSitemapSection(id: string): boolean {
  return SECTIONS.some((s) => s.id === id);
}

export function htmlSitemapSectionTitle(id: string): string | null {
  return SECTIONS.find((s) => s.id === id)?.title ?? null;
}

export function htmlSitemapPagePath(id: string, page: number): string {
  return page <= 1 ? `/sitemap/${id}` : `/sitemap/${id}/${page}`;
}

export function compareSitemapLinks(a: HtmlSitemapLink, b: HtmlSitemapLink): number {
  return a.title.localeCompare(b.title, "en", { sensitivity: "base" }) || a.href.localeCompare(b.href);
}

export function paginateSitemapLinks<T>(items: readonly T[], page: number, pageSize = HTML_SITEMAP_PAGE_SIZE): { links: T[]; pageCount: number } | null {
  if (items.length === 0 || page < 1) return null;
  const pageCount = Math.ceil(items.length / pageSize);
  if (page > pageCount) return null;
  const start = (page - 1) * pageSize;
  return { links: items.slice(start, start + pageSize), pageCount };
}

function toHref(url: string): string {
  if (url === SITE_URL || url === `${SITE_URL}/`) return "/";
  if (url.startsWith(`${SITE_URL}/`)) return url.slice(SITE_URL.length);
  return url;
}

function toLinks(rows: UrlTitle[]): HtmlSitemapLink[] {
  return rows.map((row) => ({ href: toHref(row.url), title: row.title.trim() || toHref(row.url) }));
}

function sortLinks(links: HtmlSitemapLink[]): HtmlSitemapLink[] {
  return [...links].sort(compareSitemapLinks);
}

async function loadDef(def: SectionDef): Promise<HtmlSitemapLink[]> {
  return sortLinks(toLinks(await def.load()));
}

export async function loadHtmlSitemapSection(id: string): Promise<HtmlSitemapLink[] | null> {
  const def = SECTIONS.find((s) => s.id === id);
  if (!def) return null;
  return loadDef(def);
}

export async function getHtmlSitemapPage(id: string, page: number): Promise<HtmlSitemapSectionPage | null> {
  const def = SECTIONS.find((s) => s.id === id);
  if (!def) return null;
  const links = await loadDef(def);
  const sliced = paginateSitemapLinks(links, page);
  if (!sliced) return null;
  return {
    id,
    title: def.title,
    links: sliced.links,
    page,
    pageCount: sliced.pageCount,
    linkCount: links.length,
  };
}

export async function getHtmlSitemapIndex(): Promise<{
  sections: HtmlSitemapSectionSummary[];
  linkCount: number;
  uniqueCount: number;
}> {
  // One section after another. Several of these hit the database, and the
  // runtime pool holds a single connection (src/lib/db.ts).
  const loaded: { def: SectionDef; links: HtmlSitemapLink[] }[] = [];
  for (const def of SECTIONS) {
    loaded.push({ def, links: await loadDef(def) });
  }
  const pages = loaded.find((s) => s.def.id === "pages");
  const pageByHref = new Map((pages?.links ?? []).map((link) => [link.href, link]));
  const unique = new Set<string>();
  for (const section of loaded) {
    for (const link of section.links) unique.add(link.href);
  }
  const sections = loaded
    .filter((s) => s.links.length > 0)
    .map(({ def, links }) => ({
      id: def.id,
      title: def.title,
      hubs: def.hubHrefs.flatMap((href) => {
        const hub = pageByHref.get(href);
        return hub ? [hub] : [];
      }),
      linkCount: links.length,
      pageCount: Math.ceil(links.length / HTML_SITEMAP_PAGE_SIZE),
    }));
  const linkCount = loaded.reduce((sum, s) => sum + s.links.length, 0);
  return { sections, linkCount, uniqueCount: unique.size };
}
