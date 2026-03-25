import type { MetadataRoute } from "next";
import { getAllPropertySlugs } from "@/lib/services/property-service";
import { getAllAgentSlugs, getAllAgencySlugs } from "@/lib/services/agent-service";
import { getAllSuburbSlugs } from "@/lib/services/suburb-service";
import { getAllBlogSlugs } from "@/lib/services/blog-service";
import { getAllHouseAndLandSlugs } from "@/lib/services/house-and-land-service";

const BASE_URL = "https://yourpropertyguide.com.au";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [propertySlugs, agentSlugs, agencySlugs, suburbSlugs, blogSlugs, hlSlugs] =
    await Promise.all([
      getAllPropertySlugs(),
      getAllAgentSlugs(),
      getAllAgencySlugs(),
      getAllSuburbSlugs(),
      getAllBlogSlugs(),
      getAllHouseAndLandSlugs(),
    ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/buy`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/rent`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/sold`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/off-market`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/house-and-land`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/agents`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/agencies`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/suburbs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/stamp-duty-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/appraisal`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  const propertyPages: MetadataRoute.Sitemap = propertySlugs.map((slug) => ({
    url: `${BASE_URL}/buy/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const agentPages: MetadataRoute.Sitemap = agentSlugs.map((slug) => ({
    url: `${BASE_URL}/agents/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const agencyPages: MetadataRoute.Sitemap = agencySlugs.map((slug) => ({
    url: `${BASE_URL}/agencies/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const suburbPages: MetadataRoute.Sitemap = suburbSlugs.map((slug) => ({
    url: `${BASE_URL}/suburbs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const hlPages: MetadataRoute.Sitemap = hlSlugs.map((slug) => ({
    url: `${BASE_URL}/house-and-land/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...propertyPages,
    ...agentPages,
    ...agencyPages,
    ...suburbPages,
    ...blogPages,
    ...hlPages,
  ];
}
