import type { Metadata } from "next";
import { type GuideFrontmatter } from "@/components/guide";
import { HelpToBuyStateGuide } from "@/components/guide/HelpToBuyStateGuide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

// Help to Buy plan (7 Oct 2026): the state page. Content comes from
// src/lib/data/help-to-buy.ts (the scheme) and src/lib/data/help-to-buy-states.ts
// (this state's grants, duty and scheme), rendered by HelpToBuyStateGuide.
const FRONTMATTER: GuideFrontmatter = {
  title: "Help to Buy Scheme WA (2026): Price Caps, Eligibility and Keystart",
  description:
    "Help to Buy in Western Australia for 2026–27: the $850,000 and $600,000 price caps, income limits, the $10,000 grant and first home owner duty rate, how RevenueWA treats the government's share, and Keystart.",
  slug: "help-to-buy-scheme-wa",
  publishedAt: "2026-10-07",
  updatedAt: "2026-10-07",
  readingTimeMinutes: 6,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "first-home",
};

export const metadata: Metadata = {
  title: FRONTMATTER.title,
  description: FRONTMATTER.description,
  alternates: { canonical: `${SITE_URL}/guides/${FRONTMATTER.slug}` },
  openGraph: {
    url: `${SITE_URL}/guides/${FRONTMATTER.slug}`,
    title: FRONTMATTER.title,
    description: FRONTMATTER.description,
    type: "article",
    publishedTime: FRONTMATTER.publishedAt,
    modifiedTime: FRONTMATTER.updatedAt,
    images: guideOgImages({
      slug: FRONTMATTER.slug,
      title: FRONTMATTER.title,
      description: FRONTMATTER.description,
      persona: FRONTMATTER.persona,
    }),
  },
};

export default function HelpToBuySchemeWaPage() {
  return <HelpToBuyStateGuide state="WA" frontmatter={FRONTMATTER} />;
}
