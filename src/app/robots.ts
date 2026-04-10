import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/buy/sitemap.xml`,
      `${SITE_URL}/rent/sitemap.xml`,
      `${SITE_URL}/sold/sitemap.xml`,
      `${SITE_URL}/house-and-land/sitemap.xml`,
      `${SITE_URL}/suburbs/sitemap.xml`,
      `${SITE_URL}/agents/sitemap.xml`,
      `${SITE_URL}/real-estate-agencies/sitemap.xml`,
      `${SITE_URL}/blog/sitemap.xml`,
      `${SITE_URL}/schools/sitemap.xml`,
    ],
  };
}
