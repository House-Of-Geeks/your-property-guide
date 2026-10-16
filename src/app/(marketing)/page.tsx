import type { Metadata } from "next";
import { CampaignHomepage } from "@/components/campaign/CampaignHomepage";
import { ALL_GUIDES } from "@/lib/guides/registry";
import { TOOLS } from "@/lib/tools";
import { SITE_URL } from "@/lib/constants";

// Homepage (v6, "It's the campaign that wins", 15 Oct 2026): src/components/campaign.
export const revalidate = 86400;

const META_TITLE = "It’s the campaign that wins, not the market";
const META_DESCRIPTION =
  "Free Australian guides and tools for selling and buying property, built on the campaign that sells $20 million homes. One checked local agent when you want one, free.";

export const metadata: Metadata = {
  title: { absolute: `Your Property Guide: ${META_TITLE.charAt(0).toLowerCase()}${META_TITLE.slice(1)}` },
  description: META_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: { title: META_TITLE, description: META_DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function HomePage() {
  return <CampaignHomepage guidesAndTools={ALL_GUIDES.length + TOOLS.length} />;
}
