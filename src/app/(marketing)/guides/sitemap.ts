import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getBlogSitemapEntries } from "@/lib/services/blog-service";

// Force-dynamic so DB blog/news slugs are always merged at request time.
// Build-time DB is unreachable (static guides ship in the build), and the
// prior ISR approach left the build-time static-only version cached at the
// edge, so DB-backed posts never surfaced in the sitemap. Sitemaps are
// fetched infrequently, so the per-request DB query is negligible.
export const dynamic = "force-dynamic";

// Hardcoded list of static guide slugs. New static guides should be added
// here when they're published so they show up in the sitemap immediately.
const GUIDE_SLUGS = [
  // First-home / process
  "first-home-buyer-guide",
  "buying-property-australia",
  "first-home-buyer-nsw",
  "first-home-buyer-vic",
  "first-home-buyer-qld",
  "first-home-buyer-wa",
  "first-home-buyer-sa",
  "first-home-buyer-tas",
  "first-home-buyer-act",
  "first-home-buyer-nt",
  "lenders-mortgage-insurance-guide",
  "fixed-vs-variable-rate-guide",
  "conveyancing-guide",
  "building-pest-inspection",
  "property-auction-guide",
  "foreign-buyer-firb-guide",
  "how-much-deposit-to-buy-a-house",
  "first-home-buyer-mistakes-to-avoid",
  "best-time-to-buy-property-australia",
  "how-long-does-it-take-to-buy-a-house-australia",
  "cooling-off-period-by-state-australia",
  "how-to-negotiate-property-price-australia",
  "settlement-day-australia",
  "capital-growth-vs-cash-flow-australia",
  "offset-accounts-explained-australia",
  "best-brisbane-suburbs-for-families-2026",
  // Costs / stamp duty by state
  "stamp-duty-nsw",
  "stamp-duty-vic",
  "stamp-duty-qld",
  "stamp-duty-wa",
  "stamp-duty-sa",
  "stamp-duty-tas",
  "stamp-duty-nt",
  "stamp-duty-act",
  // Process, finance & building (were missing from sitemap)
  "home-loan-pre-approval-australia",
  "how-to-choose-a-mortgage-broker",
  "due-diligence-checklist-buying-a-house",
  "how-to-find-a-builder-australia",
  "cooling-off-period-vic",
  "renovation-cost-australia-2026",
  "rentvesting-australia",
  // First-home schemes & borrowing power
  "how-much-can-i-borrow-australia",
  "help-to-buy-scheme-australia",
  "first-home-super-saver-scheme",
  "first-home-guarantee",
  "first-home-owner-grant-australia",
  // Selling
  "how-to-sell-a-house-australia",
  "cost-of-selling-a-house-australia",
  "best-time-to-sell-a-house-australia",
  "how-to-choose-a-selling-agent",
  "how-much-is-my-house-worth-australia",
  "real-estate-agent-fees-australia",
  "how-to-prepare-for-a-property-appraisal",
  "questions-to-ask-a-real-estate-agent",
  "auction-vs-private-treaty",
  "home-staging-cost-australia",
  "what-to-fix-before-selling-a-house",
  "how-to-negotiate-real-estate-agent-commission",
  // Real estate commission by state
  "real-estate-commission-nsw",
  "real-estate-commission-vic",
  "real-estate-commission-qld",
  "real-estate-commission-wa",
  "real-estate-commission-sa",
  "real-estate-commission-tas",
  "real-estate-commission-nt",
  "real-estate-commission-act",
  // Upgrading / moving
  "sell-first-or-buy-first",
  "bridging-loans-guide",
  "downsizers-guide",
  // Investing
  "negative-gearing-australia",
  "property-depreciation-guide",
  "smsf-property-guide",
  "house-vs-apartment-investment-australia",
  "sydney-vs-melbourne-property-market",
  "buyers-agent-cost-australia",
  "property-management-fees-australia",
  "granny-flat-guide-nsw",
  "granny-flat-guide-vic",
  "granny-flat-guide-qld",
  "granny-flat-guide-sa",
  "granny-flat-guide-wa",
  // Renters
  "renters-rights-nsw",
  "renters-rights-vic",
  "renters-rights-qld",
  "renters-rights-sa",
  "renters-rights-wa",
  "renters-rights-tas",
  "renters-rights-nt",
  "renters-rights-act",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = GUIDE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Skip DB fetch at build time, runtime DB isn't reachable. Static entries
  // ship in the build; DB-backed posts populate on the first crawler hit
  // within the revalidate window.
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return staticEntries;
  }

  const dbPosts = await getBlogSitemapEntries();
  return [
    ...staticEntries,
    ...dbPosts.map((post) => ({
      url: `${SITE_URL}/guides/${post.slug}`,
      lastModified: post.updatedAt ?? post.publishedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
