import type { Metadata } from "next";
import { HeroSearch } from "@/components/home/HeroSearch";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { SuburbSpotlight } from "@/components/home/SuburbSpotlight";
import { OrganizationJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ArrowRight, Shield, TrendingUp, Users, Home } from "lucide-react";

export const metadata: Metadata = {
  title: `${SITE_NAME} - Property Search, Made Simple`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} - Property Search, Made Simple`,
    description: SITE_DESCRIPTION,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <HeroSearch />

      {/* Value props */}
      <section className="py-12 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueProp
              icon={<Home className="w-6 h-6" />}
              title="Local Expertise"
              description="Our agents know their local markets inside and out"
            />
            <ValueProp
              icon={<Shield className="w-6 h-6" />}
              title="Off-Market Access"
              description="Exclusive properties you won't find on other portals"
            />
            <ValueProp
              icon={<TrendingUp className="w-6 h-6" />}
              title="Market Insights"
              description="Real-time data on prices, trends, and suburb statistics"
            />
            <ValueProp
              icon={<Users className="w-6 h-6" />}
              title="Trusted Agents"
              description="Verified local agents with proven track records"
            />
          </div>
        </div>
      </section>

      <FeaturedListings />
      <SuburbSpotlight />

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="gradient-brand rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Thinking of Selling?
            </h2>
            <p className="text-lg text-white/90 mt-3 max-w-xl mx-auto">
              Get a free property appraisal from one of our experienced local agents. No obligation, just expert advice.
            </p>
            <Link href="/appraisal" className="inline-block mt-6">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Get Free Appraisal <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ValueProp({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-xl gradient-brand text-white flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
}
