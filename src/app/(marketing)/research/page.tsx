import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart2,
  MapPin,
  GraduationCap,
  Calculator,
  FileText,
  UserRound,
  Building2,
  Star,
  ArrowRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Property Research Tools | Your Property Guide",
  description:
    "Free property research tools for Australian buyers and investors. Price guides, calculators, suburb profiles, school catchments and more.",
  alternates: { canonical: `${SITE_URL}/research` },
  openGraph: {
    title: "Property Research Tools | Your Property Guide",
    description:
      "Free property research tools for Australian buyers and investors. Price guides, calculators, suburb profiles, school catchments and more.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

interface ResearchCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

interface ResearchSection {
  heading: string;
  cards: ResearchCard[];
}

const sections: ResearchSection[] = [
  {
    heading: "Market Data & Prices",
    cards: [
      {
        icon: <BarChart2 className="w-6 h-6" />,
        title: "Suburb Price Guide",
        description: "Compare median house and unit prices across Australia",
        href: "/price-guide",
      },
      {
        icon: <MapPin className="w-6 h-6" />,
        title: "Suburb Profiles",
        description:
          "Demographics, growth trends, schools and lifestyle data for every suburb",
        href: "/suburbs",
      },
    ],
  },
  {
    heading: "Schools & Catchments",
    cards: [
      {
        icon: <GraduationCap className="w-6 h-6" />,
        title: "Search Schools",
        description: "Find schools by suburb and view their catchment boundaries",
        href: "/schools",
      },
    ],
  },
  {
    heading: "Calculators",
    cards: [
      {
        icon: <Calculator className="w-6 h-6" />,
        title: "Mortgage Calculator",
        description: "Calculate your repayments and total interest over the loan term",
        href: "/mortgage-calculator",
      },
      {
        icon: <FileText className="w-6 h-6" />,
        title: "Stamp Duty Calculator",
        description: "Estimate stamp duty costs by state — including first home buyer concessions",
        href: "/stamp-duty-calculator",
      },
    ],
  },
  {
    heading: "Find Professionals",
    cards: [
      {
        icon: <UserRound className="w-6 h-6" />,
        title: "Find an Agent",
        description: "Browse local real estate agents and view their recent sales",
        href: "/agents",
      },
      {
        icon: <Building2 className="w-6 h-6" />,
        title: "Find an Agency",
        description: "Discover agencies operating in your area",
        href: "/agencies",
      },
      {
        icon: <Star className="w-6 h-6" />,
        title: "Get a Free Appraisal",
        description: "Request a no-obligation property appraisal from a local expert",
        href: "/appraisal",
      },
    ],
  },
];

function Card({ card }: { card: ResearchCard }) {
  return (
    <Link
      href={card.href}
      className="group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 hover:shadow-lg hover:border-primary/30 transition-all"
    >
      <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        {card.icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
          {card.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          {card.description}
        </p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Explore <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Research", url: "/research" }]} />
      <Breadcrumbs items={[{ label: "Research" }]} />

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Property Research Tools
        </h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Everything you need to make a confident property decision — free tools,
          market data, and local expertise all in one place.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {section.heading}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.cards.map((card) => (
                <Card key={card.href} card={card} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
