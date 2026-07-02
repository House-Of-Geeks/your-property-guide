import type { MetadataRoute } from "next";
import { GLOSSARY_TERMS } from "@/lib/data/glossary";
import { SITE_URL } from "@/lib/constants";

// No lastModified: it used to be `new Date()` on every request, which makes
// lastmod meaningless to crawlers, and glossary terms carry no content date.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/glossary`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...GLOSSARY_TERMS.map((t) => ({
      url: `${SITE_URL}/glossary/${t.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
