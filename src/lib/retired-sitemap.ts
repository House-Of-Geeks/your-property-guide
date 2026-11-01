// The child sitemaps of the listing sections retired on 14 Oct 2026
// (docs/portal-consolidation-2026-10-14.md). The listings are gone and their
// URLs 308 to the hubs. These sitemaps still answer 200 with valid XML,
// because Search Console keeps reading a sitemap that was submitted on its
// own, and a redirect to an HTML page is reported there as a sitemap error
// ("1 error" on /sold/sitemap.xml, 2 Nov 2026 crawl). Each lists one URL,
// the hub its section now redirects to: the sitemap schema needs at least
// one <url>, and the hub is the page that serves those readers now. The
// index at /sitemap.xml does not list them. Removing a submitted one in
// Search Console and Bing Webmaster Tools stops it being read at all.
//
// Relative import only: next.config.ts loads this file outside the app's
// path aliases.
import { SITE_URL } from "./constants/seo";

/** Retired section with a child sitemap, and the hub it redirects to. */
export const RETIRED_SITEMAP_SECTIONS = {
  buy: "/buying",
  rent: "/guides",
  sold: "/suburbs",
  "house-and-land": "/buying",
  "best-deals": "/buying",
} as const;

export type RetiredSitemapSection = keyof typeof RETIRED_SITEMAP_SECTIONS;

export function retiredSitemapXml(section: RetiredSitemapSection): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url><loc>${SITE_URL}${RETIRED_SITEMAP_SECTIONS[section]}</loc></url>`,
    "</urlset>",
    "",
  ].join("\n");
}

export function retiredSitemapRoute(section: RetiredSitemapSection) {
  return function GET() {
    return new Response(retiredSitemapXml(section), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  };
}
