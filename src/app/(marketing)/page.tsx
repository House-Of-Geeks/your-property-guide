import type { Metadata } from "next";
import { Homepage } from "@/components/homepage/Homepage";
import { ALL_GUIDES } from "@/lib/guides/registry";
import { SITE_URL } from "@/lib/constants";

// Homepage (Concierge, chosen 14 Oct 2026): src/components/homepage.
export const revalidate = 86400;

const META_TITLE = "Buy or sell property with confidence";
const META_DESCRIPTION =
  "Free Australian guides and tools for every step of buying and selling property. And when you’re ready, a proven local agent, checked by us. Free for you.";

export const metadata: Metadata = {
  title: { absolute: `${META_TITLE} | Your Property Guide` },
  description: META_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: { title: META_TITLE, description: META_DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function HomePage() {
  return <Homepage guideCount={ALL_GUIDES.length} />;
}
