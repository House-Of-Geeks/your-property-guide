import { SITE_URL } from "@/lib/constants";

const SITEMAPS = [
  `${SITE_URL}/pages/sitemap.xml`,
  `${SITE_URL}/regions/sitemap.xml`,
  `${SITE_URL}/buy/sitemap.xml`,
  `${SITE_URL}/sold/sitemap.xml`,
  `${SITE_URL}/house-and-land/sitemap.xml`,
  `${SITE_URL}/suburbs/sitemap.xml`,
  `${SITE_URL}/agents/sitemap.xml`,
  `${SITE_URL}/real-estate-agencies/sitemap.xml`,
  `${SITE_URL}/blog/sitemap.xml`,
  `${SITE_URL}/schools/sitemap.xml`,
  `${SITE_URL}/postcodes/sitemap.xml`,
  `${SITE_URL}/states/sitemap.xml`,
  `${SITE_URL}/best-suburbs/sitemap.xml`,
];

export function GET() {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...SITEMAPS.map((url) => `  <sitemap><loc>${url}</loc></sitemap>`),
    "</sitemapindex>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
