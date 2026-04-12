import type { Metadata } from "next";
import Link from "next/link";
import { Users, TrendingUp, DollarSign, Footprints, Shield, Home } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Best Suburbs in Australia | Your Property Guide",
  description:
    "Discover the best Australian suburbs ranked by schools, growth, affordability, walkability, flood risk, and rental yield. Find your perfect suburb.",
  alternates: { canonical: `${SITE_URL}/best-suburbs` },
  openGraph: {
    url: `${SITE_URL}/best-suburbs`,
    title: "Best Suburbs in Australia | Your Property Guide",
    description:
      "Discover the best Australian suburbs ranked by schools, growth, affordability, walkability, flood risk, and rental yield.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const CATEGORIES = [
  {
    slug: "for-families",
    title: "Best for Families",
    description:
      "Top suburbs with the highest-rated schools (by ICSEA) and high proportions of family households.",
    icon: Users,
    colour: "bg-blue-50 text-blue-600",
  },
  {
    slug: "highest-growth",
    title: "Highest Growth",
    description:
      "Suburbs with the strongest annual house price growth — ideal for capital-gain focused buyers.",
    icon: TrendingUp,
    colour: "bg-green-50 text-green-600",
  },
  {
    slug: "most-affordable",
    title: "Most Affordable",
    description:
      "Suburbs with the lowest median house prices — great entry points into the property market.",
    icon: DollarSign,
    colour: "bg-yellow-50 text-yellow-600",
  },
  {
    slug: "most-walkable",
    title: "Most Walkable",
    description:
      "Suburbs with the highest walk scores — perfect for those who love living close to shops, cafes, and transport.",
    icon: Footprints,
    colour: "bg-purple-50 text-purple-600",
  },
  {
    slug: "lowest-flood-risk",
    title: "Lowest Flood Risk",
    description:
      "Suburbs assessed as low flood risk or with no hazard record — peace of mind for homeowners.",
    icon: Shield,
    colour: "bg-teal-50 text-teal-600",
  },
  {
    slug: "best-rental-yield",
    title: "Best Rental Yield",
    description:
      "Suburbs with the highest gross rental yields — top picks for investment property buyers.",
    icon: Home,
    colour: "bg-orange-50 text-orange-600",
  },
];

export default function BestSuburbsHubPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbJsonLd items={[{ name: "Best Suburbs", url: "/best-suburbs" }]} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 to-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumbs items={[{ label: "Best Suburbs" }]} />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
            Best Suburbs in Australia
          </h1>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl">
            Explore ranked suburb lists across Australia — filtered by what matters most to you,
            from top schools and affordability to rental yield and flood safety.
          </p>
        </div>
      </div>

      {/* Category cards */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map(({ slug, title, description, icon: Icon, colour }) => (
            <Link
              key={slug}
              href={`/best-suburbs/${slug}`}
              className="group rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary hover:shadow-lg transition-all"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colour} mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                {title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{description}</p>
              <span className="text-sm font-semibold text-primary group-hover:underline">
                Browse →
              </span>
            </Link>
          ))}
        </div>

        {/* Info note */}
        <div className="mt-12 rounded-xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-800">
          <p>
            Rankings are based on publicly available data including ACARA school scores, ABS Census
            demographics, Geoscience Australia flood risk assessments, and OpenStreetMap walkability
            data. Updated periodically.
          </p>
        </div>
      </div>
    </div>
  );
}
