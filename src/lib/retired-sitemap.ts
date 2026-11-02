// The child sitemaps of the listing sections retired on 14 Oct 2026
// (docs/portal-consolidation-2026-10-14.md). The listings are gone and their
// URLs 308 to the hubs, but a 308 from a sitemap URL to an HTML hub is
// reported in Search Console as a sitemap error ("1 error" on
// /sold/sitemap.xml, 2 Nov 2026 crawl), because the sitemap had been
// submitted there on its own. So these five files skip the redirect and
// answer 410 Gone, the same way the removed street pages do, which tells
// Search Console the sitemap is gone for good. The index at /sitemap.xml
// does not list them.
//
// Relative imports only: next.config.ts loads this file outside the app's
// path aliases.

/** Retired section with a child sitemap, and the hub its other paths redirect to. */
export const RETIRED_SITEMAP_SECTIONS = {
  buy: "/buying",
  rent: "/guides",
  sold: "/suburbs",
  "house-and-land": "/buying",
  "best-deals": "/buying",
} as const;

export function GET() {
  return new Response("Gone", {
    status: 410,
    headers: { "Content-Type": "text/plain" },
  });
}
