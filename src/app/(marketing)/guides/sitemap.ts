import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

// Hardcoded list of all guide slugs. New guides should be added here when
// they're published so they show up in the sitemap immediately.
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
  "best-brisbane-suburbs-for-families-2026",
  // Selling
  "how-to-choose-a-selling-agent",
  "real-estate-agent-fees-australia",
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

export default function sitemap(): MetadataRoute.Sitemap {
  return GUIDE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
}
