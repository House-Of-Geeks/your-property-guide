import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL,                                   lastModified: new Date(), changeFrequency: "daily",   priority: 1   },
    { url: `${SITE_URL}/buy`,                          lastModified: new Date(), changeFrequency: "hourly",  priority: 0.9 },
    { url: `${SITE_URL}/rent`,                         lastModified: new Date(), changeFrequency: "hourly",  priority: 0.9 },
    { url: `${SITE_URL}/sold`,                         lastModified: new Date(), changeFrequency: "daily",   priority: 0.7 },
    { url: `${SITE_URL}/house-and-land`,               lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/off-market`,                   lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/suburbs`,                      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/regions`,                      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/agents`,                       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/real-estate-agencies`,         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
    { url: `${SITE_URL}/blog`,                         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/research`,                     lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/price-guide`,                  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
    { url: `${SITE_URL}/schools`,                      lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/mortgage-calculator`,          lastModified: new Date(), changeFrequency: "yearly",  priority: 0.6 },
    { url: `${SITE_URL}/stamp-duty-calculator`,        lastModified: new Date(), changeFrequency: "yearly",  priority: 0.6 },
    { url: `${SITE_URL}/appraisal`,                    lastModified: new Date(), changeFrequency: "yearly",  priority: 0.6 },
    { url: `${SITE_URL}/about`,                        lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5 },
    { url: `${SITE_URL}/contact`,                      lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5 },
    { url: `${SITE_URL}/privacy`,                      lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];
}
