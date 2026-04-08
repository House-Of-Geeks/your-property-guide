import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroSearch } from "@/components/home/HeroSearch";
import { StatsBar } from "@/components/home/StatsBar";
import { ResearchTopics } from "@/components/home/ResearchTopics";
import { SuburbSpotlight } from "@/components/home/SuburbSpotlight";
import { SchoolFinderCallout } from "@/components/home/SchoolFinderCallout";
import { LatestGuides } from "@/components/home/LatestGuides";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { OrganizationJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: `${SITE_NAME} - Property Research, Made Simple`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} - Property Research, Made Simple`,
    description: SITE_DESCRIPTION,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />

      {/* 1. Hero */}
      <HeroSearch />

      {/* 2. Stats bar */}
      <Suspense fallback={null}>
        <StatsBar />
      </Suspense>

      {/* 3. Research topic cards */}
      <ResearchTopics />

      {/* 4. Suburb data spotlight */}
      <Suspense fallback={null}>
        <SuburbSpotlight />
      </Suspense>

      {/* 5. School finder callout */}
      <SchoolFinderCallout />

      {/* 6. Latest guides */}
      <Suspense fallback={null}>
        <LatestGuides />
      </Suspense>

      {/* 7. Listings — de-emphasised, "when you're ready" */}
      <Suspense fallback={null}>
        <FeaturedListings />
      </Suspense>

      {/* 8. Sell CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-black rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Thinking of selling?
            </h2>
            <p className="text-lg text-white/70 mt-3 max-w-xl mx-auto">
              Get a free property appraisal from one of our experienced local agents. No obligation, just expert advice.
            </p>
            <Link href="/appraisal" className="inline-block mt-6">
              <Button size="lg" variant="secondary" className="bg-white text-black hover:bg-gray-100">
                Get free appraisal <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
