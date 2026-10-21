import { getHtmlSitemapIndex } from "@/lib/html-sitemap";
import { htmlSitemapMetadata, SitemapIndexView } from "./view";

// The URL lists come from the database for suburbs, schools, postcodes and
// the rest. Rendering this at build time either fails (no database) or bakes
// an empty page, the same failure the XML sitemaps hit. Render on request.
// Each child list is its own request, so the build does not walk thousands
// of pages.
export const dynamic = "force-dynamic";
// One request walks every section, including the suburb and school queries.
// 60s matches the admin sync route so a cold cache can finish.
export const maxDuration = 60;

export const metadata = htmlSitemapMetadata({
  title: "Sitemap",
  canonicalPath: "/sitemap",
  description: "Every page on Your Property Guide, grouped by section. The lists use the same URLs as the XML sitemap.",
});

export default async function SitemapPage() {
  const { sections, uniqueCount } = await getHtmlSitemapIndex();
  return <SitemapIndexView sections={sections} uniqueCount={uniqueCount} />;
}
