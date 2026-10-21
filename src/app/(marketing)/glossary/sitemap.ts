import type { MetadataRoute } from "next";
import { GLOSSARY_TERMS } from "@/lib/data/glossary";
import { SITE_URL } from "@/lib/constants";

// No lastModified: it used to be `new Date()` on every request, which makes
// lastmod meaningless to crawlers, and glossary terms carry no content date.

export type GlossarySitemapLink = { url: string; title: string };

export function getGlossarySitemapLinks(): GlossarySitemapLink[] {
  return [
    {
      url: `${SITE_URL}/glossary`,
      title: "Property Glossary: A-Z of Australian Real Estate Terms",
    },
    ...GLOSSARY_TERMS.map((term) => ({
      url: `${SITE_URL}/glossary/${term.slug}`,
      title: `${term.term}, Australian Property Glossary`,
    })),
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const hub = `${SITE_URL}/glossary`;
  return getGlossarySitemapLinks().map(({ url }) => ({
    url,
    changeFrequency: url === hub ? ("monthly" as const) : ("yearly" as const),
    priority: url === hub ? 0.6 : 0.5,
  }));
}
