import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";

export const metadata: Metadata = {
  title: "Property Research Tools",
  description:
    "Free property research tools for Australian buyers and investors. Price guides, calculators, suburb profiles, school catchments and more.",
  alternates: { canonical: `${SITE_URL}/research` },
  openGraph: { ...DEFAULT_OG,
    url: `${SITE_URL}/research`,
    title: "Property Research Tools | Your Property Guide",
    description:
      "Free property research tools for Australian buyers and investors. Price guides, calculators, suburb profiles, school catchments and more.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

interface ResearchCard {
  icon: string;
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
    heading: "Calculators",
    cards: [
      {
        icon: "/images/icons/calculator.svg",
        title: "Mortgage Calculator",
        description: "Calculate your repayments and total interest over the loan term.",
        href: "/mortgage-calculator",
      },
      {
        icon: "/images/icons/calculator.svg",
        title: "Stamp Duty Calculator",
        description: "Estimate stamp duty by state, including first home buyer concessions.",
        href: "/stamp-duty-calculator",
      },
      {
        icon: "/images/icons/calculator.svg",
        title: "Borrowing Power Calculator",
        description: "Find out how much you can borrow based on your income and expenses.",
        href: "/borrowing-power-calculator",
      },
      {
        icon: "/images/icons/yield.svg",
        title: "Rental Yield Calculator",
        description: "Calculate gross and net rental yield on your investment property.",
        href: "/rental-yield-calculator",
      },
      {
        icon: "/images/icons/calculator.svg",
        title: "CGT Calculator",
        description: "Estimate capital gains tax on your property sale, including the 50% discount.",
        href: "/cgt-calculator",
      },
      {
        icon: "/images/icons/calculator.svg",
        title: "Refinancing Calculator",
        description: "Find your break-even point and total savings when switching home loans.",
        href: "/refinancing-calculator",
      },
      {
        icon: "/images/icons/median.svg",
        title: "Affordability Calculator",
        description: "Find out what property price you can afford based on your deposit and income.",
        href: "/affordability-calculator",
      },
    ],
  },
  {
    heading: "Property Research",
    cards: [
      {
        icon: "/images/icons/median.svg",
        title: "Suburb Price Guide",
        description: "Compare median house and unit prices across Australia.",
        href: "/price-guide",
      },
      {
        icon: "/images/icons/map.svg",
        title: "Compare Suburbs",
        description: "Pick any two suburbs and line them up side by side.",
        href: "/compare",
      },
      {
        icon: "/images/icons/people.svg",
        title: "Find Your Suburb (Quiz)",
        description: "Answer 4 questions, get 6 suburbs scored against your priorities.",
        href: "/find-your-suburb",
      },
      {
        icon: "/images/icons/map.svg",
        title: "Suburb Profiles",
        description: "Demographics, growth trends, schools and lifestyle data for every suburb.",
        href: "/suburbs",
      },
      {
        icon: "/images/icons/map.svg",
        title: "Postcode Guide",
        description: "Browse properties, prices and suburb info by Australian postcode.",
        href: "/postcodes",
      },
      {
        icon: "/images/icons/growth.svg",
        title: "State Market Reports",
        description: "Median prices, growth trends and suburb rankings for every Australian state.",
        href: "/market-reports",
      },
      {
        icon: "/images/icons/growth.svg",
        title: "RBA Cash Rate History",
        description: "Track every RBA rate decision and understand its impact on property prices.",
        href: "/rba-cash-rate",
      },
    ],
  },
  {
    heading: "Schools & Catchments",
    cards: [
      {
        icon: "/images/icons/schools.svg",
        title: "Search Schools",
        description: "Find schools by suburb and view their catchment boundaries.",
        href: "/schools",
      },
    ],
  },
  {
    heading: "Guides & Reference",
    cards: [
      {
        icon: "/images/icons/guide.svg",
        title: "Property Guides",
        description: "In-depth guides for buyers, sellers and investors, from first home to portfolio.",
        href: "/guides",
      },
      {
        icon: "/images/icons/guide.svg",
        title: "Property Glossary",
        description: "Plain-English definitions for every term you'll encounter buying or selling.",
        href: "/glossary",
      },
    ],
  },
  {
    heading: "Talk to someone",
    cards: [
      {
        icon: "/images/icons/expert-match.svg",
        title: "Get a Free Appraisal",
        description: "Request a no-obligation property appraisal from a local expert.",
        href: "/appraisal",
      },
    ],
  },
];

function Card({ card }: { card: ResearchCard }) {
  return (
    <Link
      href={card.href}
      className="group flex flex-col gap-4 rounded-xl bg-surface-raised border border-line p-6 hover:border-ink transition-colors"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-surface-warm border border-line">
        <Image src={card.icon} alt="" width={28} height={28} aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-lg text-ink group-hover:text-primary transition-colors leading-tight">
          {card.title}
        </h3>
        <p className="text-sm text-ink-muted mt-2 leading-relaxed">
          {card.description}
        </p>
      </div>
      <span className="mt-auto pt-2 text-base font-semibold text-ink group-hover:text-primary transition-colors self-start">
        Explore →
      </span>
    </Link>
  );
}

export default function ResearchPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Research", url: "/research" }]} />

      <PhotoHero photo="market" breadcrumbs={[{ label: "Research" }]}>
        <p className="flex items-center gap-4 text-sm text-ink-muted mb-5">
          <span className="font-semibold">
            Free tools and data
          </span>
          <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
          <span>
            Research desk
          </span>
        </p>
        <HeroTitle>
          Everything you need to{" "}
          <span>decide with confidence</span>
        </HeroTitle>
        <HeroLead>
          Calculators, suburb profiles, market reports, school catchments
          and plain-English guides. All free. No login.
        </HeroLead>
      </PhotoHero>

      {/* Sections: bands alternate light and quiet. */}
      {sections.map((section, i) => (
        <Band key={section.heading} tone={i % 2 === 0 ? "light" : "quiet"} spacing="compact">
          <SectionHeading size="md" title={section.heading} />
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {section.cards.map((card) => (
              <Card key={card.href} card={card} />
            ))}
          </div>
        </Band>
      ))}
    </>
  );
}
