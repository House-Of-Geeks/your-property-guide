import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { ALL_GUIDES, guideLastModified } from "@/lib/guides/registry";

// Every static guide and article, from the guide registry. lastmod is the
// date the page itself reports as dateModified (a static guide's
// FRONTMATTER.updatedAt, else publishedAt; an article's updatedAt, else
// publishedAt). It used to be the request time for every static guide (97
// of 155 entries read 2026-09-30T06:03:41Z while the pages said April to
// September), which tells Google nothing about which guide changed. A guide
// with no recorded date gets no lastmod rather than an invented one.
// tests/seo/guides-sitemap.test.ts checks every entry against the page.
//
// Everything here is bundled data (the posts stopped coming from the
// database), so the per-request render costs nothing.
export const dynamic = "force-dynamic";

export type GuideSitemapLink = {
  url: string;
  title: string;
  lastModified?: string;
  changeFrequency: "monthly" | "weekly";
  priority: number;
};

export function getGuideSitemapLinks(): GuideSitemapLink[] {
  return ALL_GUIDES.map((guide) => {
    const lastModified = guideLastModified(guide);
    const isGuide = guide.kind === "guide";
    return {
      url: `${SITE_URL}${guide.href}`,
      title: guide.title,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: isGuide ? "monthly" : "weekly",
      priority: isGuide ? 0.8 : 0.6,
    };
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  return getGuideSitemapLinks().map(({ url, lastModified, changeFrequency, priority }) => ({
    url,
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
  }));
}
