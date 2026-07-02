import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { categoryToSlug, getDistinctBlogCategories } from "@/lib/services/blog-service";

// No lastModified here: these are hub/tool pages with no single content
// date, and stamping `new Date()` on every request made lastmod meaningless
// to crawlers. Omit the field rather than fake it.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Category labels ship in the bundled blogs.ts data (no DB), so the hub
  // list is statically known. Advertised in canonical slug form
  // (e.g. /guides/category/buying-guide); raw-label URLs 308 to these.
  const categories = await getDistinctBlogCategories();

  return [
    { url: SITE_URL,                                   changeFrequency: "daily",   priority: 1   },
    { url: `${SITE_URL}/buy`,                          changeFrequency: "weekly",  priority: 0.5 },
    { url: `${SITE_URL}/rent`,                         changeFrequency: "weekly",  priority: 0.5 },
    { url: `${SITE_URL}/sold`,                         changeFrequency: "daily",   priority: 0.7 },
    { url: `${SITE_URL}/house-and-land`,               changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/off-market`,                   changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/suburbs`,                      changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/regions`,                      changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/agents`,                       changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/real-estate-agencies`,         changeFrequency: "weekly",  priority: 0.6 },
    { url: `${SITE_URL}/research`,                     changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/price-guide`,                  changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/schools`,                      changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/mortgage-calculator`,          changeFrequency: "yearly",  priority: 0.6 },
    { url: `${SITE_URL}/stamp-duty-calculator`,        changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/borrowing-power-calculator`,   changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/rental-yield-calculator`,      changeFrequency: "yearly",  priority: 0.6 },
    { url: `${SITE_URL}/cgt-calculator`,               changeFrequency: "yearly",  priority: 0.6 },
    { url: `${SITE_URL}/refinancing-calculator`,       changeFrequency: "yearly",  priority: 0.6 },
    { url: `${SITE_URL}/appraisal`,                    changeFrequency: "yearly",  priority: 0.6 },
    { url: `${SITE_URL}/affordability-calculator`,     changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/real-estate-commission-calculator`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/selling-guide`,                changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/buying-guide`,                 changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/for-agents`,                   changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/best-suburbs`,                 changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/compare`,                      changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/find-your-suburb`,             changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/tools`,                        changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/insights`,                     changeFrequency: "daily",   priority: 0.8 },
    { url: `${SITE_URL}/search`,                       changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/methodology`,                  changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/data`,                         changeFrequency: "daily",   priority: 0.6 },
    { url: `${SITE_URL}/data-updates`,                 changeFrequency: "weekly",  priority: 0.5 },
    { url: `${SITE_URL}/site-map`,                     changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/states`,                       changeFrequency: "weekly",  priority: 0.6 },
    { url: `${SITE_URL}/postcodes`,                    changeFrequency: "weekly",  priority: 0.6 },
    { url: `${SITE_URL}/market-reports`,               changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/rba-cash-rate`,                changeFrequency: "weekly",  priority: 0.6 },
    { url: `${SITE_URL}/glossary`,                     changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/guides`,                       changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/find-an-expert`,               changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/first-home-buyers`,            changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/selling`,                      changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/upgrading`,                    changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/investing`,                    changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/renovating`,                   changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`,                        changeFrequency: "yearly",  priority: 0.5 },
    { url: `${SITE_URL}/contact`,                      changeFrequency: "yearly",  priority: 0.5 },
    { url: `${SITE_URL}/privacy`,                      changeFrequency: "yearly",  priority: 0.3 },
    ...categories.map((category) => ({
      url: `${SITE_URL}/guides/category/${categoryToSlug(category)}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
