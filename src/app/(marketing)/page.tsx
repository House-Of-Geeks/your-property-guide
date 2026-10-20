import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import { Homepage } from "@/components/homepage/Homepage";
import { SITE_URL } from "@/lib/constants";
import { PROMISE } from "@/lib/service-model";

// Homepage (20 Oct 2026, "Clear decisions"): src/components/homepage.
export const revalidate = 86400;

const META_TITLE = "Know what matters before you buy or sell";
const META_DESCRIPTION =
  "Free Australian guides, calculators and a next-step plan for buying or selling a home. Understand the costs and choices ahead, at your own pace.";

export const metadata: Metadata = {
  title: { absolute: `Your Property Guide: ${META_TITLE.charAt(0).toLowerCase()}${META_TITLE.slice(1)}` },
  description: META_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: { ...DEFAULT_OG, title: PROMISE.headline, description: META_DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function HomePage() {
  return <Homepage />;
}
