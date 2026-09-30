// Frontmatter of the eight state stamp duty guides (/guides/stamp-duty-{state}).
// Lives outside the page template so the guide registry (sitemap lastmod,
// /guides, hub lists) can read a guide's title and date without importing
// the React template, the same way as the cost-of-selling guides. The
// template re-exports it, so existing imports hold.
import type { GuideFrontmatter } from "@/components/guide/GuideArticleLayout";
import {
  STAMP_DUTY_GUIDES,
  STAMP_DUTY_GUIDE_PUBLISHED,
  STAMP_DUTY_VERIFIED_ON,
  type AustralianState,
} from "@/lib/data/stamp-duty-state";

export function stampDutyFrontmatter(state: AustralianState): GuideFrontmatter {
  const g = STAMP_DUTY_GUIDES[state];
  return {
    title: g.title,
    description: g.description,
    slug: g.slug,
    publishedAt: STAMP_DUTY_GUIDE_PUBLISHED,
    updatedAt: STAMP_DUTY_VERIFIED_ON,
    readingTimeMinutes: 8,
    author: { name: "Your Property Guide editorial", role: "Australian property research" },
    reviewedBy: { name: "Andy McMaster", role: "Editor" },
    persona: "first-home",
  };
}
