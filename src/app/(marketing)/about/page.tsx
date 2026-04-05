import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, OrganizationJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { Home, Users, TrendingUp, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Your Property Guide is Australia's property search platform. Learn about our mission to connect buyers, sellers, and renters with trusted local agents.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: { title: "About Us", description: "Your Property Guide is Australia's property search platform.", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <OrganizationJsonLd />
      <BreadcrumbJsonLd items={[{ name: "About", url: "/about" }]} />
      <Breadcrumbs items={[{ label: "About" }]} />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">About Your Property Guide</h1>

        <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
          <p>
            Your Property Guide is Australia&apos;s property search, made simple. We bring together listings,
            suburb data, school catchments, and local agent expertise in one place &mdash; so you can make
            confident property decisions wherever you are in the country.
          </p>
          <p>
            We believe property search should be transparent. That&apos;s why every suburb profile on our
            platform shows real market data: median prices, rental yields, annual growth, and demographic
            insights drawn from public sources updated each quarter.
          </p>
          <p>
            We partner with trusted agencies and agents across Australia who know their local markets
            inside and out. When you enquire through Your Property Guide, you&apos;re connected directly
            with the agent who knows your area best &mdash; and you get access to exclusive off-market
            listings you won&apos;t find anywhere else.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-10">
          {[
            { icon: <Home className="w-6 h-6" />, title: "Nationwide Coverage", desc: "Properties and suburb data across Australia" },
            { icon: <Users className="w-6 h-6" />, title: "Trusted Agents", desc: "Verified local professionals" },
            { icon: <TrendingUp className="w-6 h-6" />, title: "Market Data", desc: "Real-time suburb insights" },
            { icon: <Shield className="w-6 h-6" />, title: "Off-Market", desc: "Exclusive pre-market access" },
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-xl border border-gray-200 bg-white">
              <div className="w-10 h-10 rounded-lg gradient-brand text-white flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
