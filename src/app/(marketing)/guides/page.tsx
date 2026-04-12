import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { BookOpen, Home, TrendingUp, Key, DollarSign, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: `Property Guides | ${SITE_NAME}`,
  description:
    "Comprehensive Australian property guides covering buying, investing, renting, and selling. Free expert guides updated for 2026.",
  alternates: { canonical: `${SITE_URL}/guides` },
  openGraph: {
    url: `${SITE_URL}/guides`,
    title: `Property Guides | ${SITE_NAME}`,
    description:
      "Comprehensive Australian property guides covering buying, investing, renting, and selling. Free expert guides updated for 2026.",
    type: "website",
  },
};

const categories = [
  {
    label: "Buying",
    icon: <Home className="w-5 h-5" />,
    color: "text-blue-600 bg-blue-50",
    guides: [
      {
        title: "How to Buy Property in Australia",
        description:
          "A complete step-by-step guide from saving your deposit to settlement day — everything first-time and experienced buyers need to know.",
        href: "/guides/buying-property-australia",
        readTime: "15 min read",
      },
      {
        title: "First Home Buyer Guide (National)",
        description:
          "Grants, schemes, stamp duty concessions and step-by-step advice for first home buyers across every Australian state and territory.",
        href: "/guides/first-home-buyer-guide",
        readTime: "10 min read",
      },
      {
        title: "First Home Buyer Guide — NSW",
        description:
          "NSW-specific first home buyer grants, stamp duty exemptions, and the step-by-step buying process in New South Wales.",
        href: "/guides/first-home-buyer-nsw",
        readTime: "7 min read",
      },
      {
        title: "First Home Buyer Guide — VIC",
        description:
          "Victoria-specific first home buyer grants (including regional $20K grant), stamp duty exemptions up to $600K, and local buying tips.",
        href: "/guides/first-home-buyer-vic",
        readTime: "7 min read",
      },
      {
        title: "First Home Buyer Guide — QLD",
        description:
          "Queensland's $30,000 First Home Owner Grant, stamp duty concessions, and everything you need to buy your first home in QLD.",
        href: "/guides/first-home-buyer-qld",
        readTime: "7 min read",
      },
      {
        title: "First Home Buyer Guide — WA",
        description:
          "Western Australia's first home buyer grants, stamp duty exemptions up to $450K, and state-specific buying tips.",
        href: "/guides/first-home-buyer-wa",
        readTime: "7 min read",
      },
      {
        title: "Buying Property as a Foreign Buyer (FIRB Guide)",
        description:
          "The most comprehensive guide to FIRB rules, foreign buyer stamp duty surcharges, and tax implications for overseas investors.",
        href: "/guides/foreign-buyer-firb-guide",
        readTime: "12 min read",
      },
    ],
  },
  {
    label: "Investing",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-green-600 bg-green-50",
    guides: [
      {
        title: "Negative Gearing in Australia",
        description:
          "How negative gearing works, what you can deduct, depreciation schedules, and whether it makes sense for your investment strategy.",
        href: "/guides/negative-gearing-australia",
        readTime: "8 min read",
      },
      {
        title: "Property Investment for Beginners",
        description: "Coming soon — foundational guide to building a property investment portfolio in Australia.",
        href: "/guides",
        readTime: "Coming soon",
        comingSoon: true,
      },
      {
        title: "Understanding Rental Yield",
        description: "Coming soon — how to calculate and compare gross and net rental yield across suburbs.",
        href: "/guides",
        readTime: "Coming soon",
        comingSoon: true,
      },
    ],
  },
  {
    label: "Renting",
    icon: <Key className="w-5 h-5" />,
    color: "text-purple-600 bg-purple-50",
    guides: [
      {
        title: "Renters Rights in Australia",
        description: "Coming soon — state-by-state guide to tenant rights, bond rules, and what landlords can and cannot do.",
        href: "/guides",
        readTime: "Coming soon",
        comingSoon: true,
      },
      {
        title: "How to Apply for a Rental Property",
        description: "Coming soon — what landlords look for, how to stand out, and what to check before you sign.",
        href: "/guides",
        readTime: "Coming soon",
        comingSoon: true,
      },
    ],
  },
  {
    label: "Selling",
    icon: <FileText className="w-5 h-5" />,
    color: "text-orange-600 bg-orange-50",
    guides: [
      {
        title: "How to Sell Your Home",
        description: "Coming soon — choosing an agent, pricing your property, marketing strategies, and negotiating the best price.",
        href: "/guides",
        readTime: "Coming soon",
        comingSoon: true,
      },
    ],
  },
  {
    label: "Finance",
    icon: <DollarSign className="w-5 h-5" />,
    color: "text-yellow-600 bg-yellow-50",
    guides: [
      {
        title: "Property Glossary",
        description: "Coming soon — plain-English definitions of every property term, from auction to zoning.",
        href: "/guides",
        readTime: "Coming soon",
        comingSoon: true,
      },
      {
        title: "Understanding Stamp Duty",
        description: "Coming soon — how stamp duty is calculated in every state and how to minimise it legally.",
        href: "/guides",
        readTime: "Coming soon",
        comingSoon: true,
      },
    ],
  },
];

export default function GuidesHubPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <CollectionPageJsonLd
        name="Property Guides"
        description="Free Australian property guides covering buying, renting, investing, and more."
        url="/guides"
      />
      <BreadcrumbJsonLd items={[{ name: "Guides", url: "/guides" }]} />
      <Breadcrumbs items={[{ label: "Guides" }]} />

      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg gradient-brand text-white flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Property Guides</h1>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">
          Free, comprehensive guides written for Australian property buyers, investors, renters, and sellers.
          Updated for 2026 with the latest grants, schemes, and tax rules.
        </p>
      </div>

      <div className="space-y-12">
        {categories.map((category) => (
          <section key={category.label}>
            <div className="flex items-center gap-2 mb-5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color}`}>
                {category.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{category.label}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.guides.map((guide) => (
                <div
                  key={guide.href + guide.title}
                  className={`rounded-xl border border-gray-200 bg-white p-5 flex flex-col ${
                    guide.comingSoon ? "opacity-60" : "hover:shadow-md transition-shadow"
                  }`}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 text-base leading-snug">
                      {guide.comingSoon ? (
                        guide.title
                      ) : (
                        <Link href={guide.href} className="hover:text-primary transition-colors">
                          {guide.title}
                        </Link>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{guide.description}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{guide.readTime}</span>
                    {!guide.comingSoon && (
                      <Link
                        href={guide.href}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Read guide &rarr;
                      </Link>
                    )}
                    {guide.comingSoon && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 rounded-xl bg-gray-50 border border-gray-200 p-6 max-w-3xl mx-auto text-center">
        <p className="text-sm text-gray-500">
          Our guides are for general information only and do not constitute financial, legal, or tax advice.
          Always consult a licensed professional for advice specific to your circumstances.
        </p>
      </div>
    </div>
  );
}
