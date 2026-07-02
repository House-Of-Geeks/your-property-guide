import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Free Australian Property Tools, Quizzes & Calculators",
  description:
    "All our free property tools in one place: 7 calculators, the suburb match quiz, the suburb comparison tool, and the suburb finder. No sign-up.",
  alternates: { canonical: `${SITE_URL}/tools` },
  openGraph: {
    url: `${SITE_URL}/tools`,
    title: "Free Australian Property Tools, Quizzes & Calculators",
    description:
      "All our free property tools in one place: calculators, the suburb match quiz, the comparison tool.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

interface Tool {
  href: string;
  title: string;
  description: string;
  badge?: string;
  icon: string;
  primary?: boolean;
}

interface ToolGroup {
  id: string;
  label: string;
  blurb: string;
  tools: Tool[];
}

const GROUPS: ToolGroup[] = [
  {
    id: "discover",
    label: "Discover",
    blurb: "Find the right suburb, then line two up side by side.",
    tools: [
      {
        href: "/find-your-suburb",
        title: "Find Your Suburb",
        description:
          "30-second match quiz that scores six suburbs against your budget, priorities, and stage.",
        badge: "Quiz",
        icon: "/images/icons/people.svg",
        primary: true,
      },
      {
        href: "/compare",
        title: "Compare Suburbs",
        description:
          "Pick any two Australian suburbs and line them up side by side, median to walkability to risk.",
        badge: "Tool",
        icon: "/images/icons/map.svg",
        primary: true,
      },
      {
        href: "/best-suburbs",
        title: "Best Suburbs Rankings",
        description:
          "Six ranked lists across schools, growth, affordability, walkability, hazards, and rental yield.",
        icon: "/images/icons/growth.svg",
      },
    ],
  },
  {
    id: "calculate",
    label: "Calculate",
    blurb: "Free, no sign-up. Cover the seven biggest property numbers you need to know.",
    tools: [
      {
        href: "/mortgage-calculator",
        title: "Mortgage Calculator",
        description:
          "Monthly repayments, total interest, and amortisation over the loan term.",
        icon: "/images/icons/calculator.svg",
      },
      {
        href: "/stamp-duty-calculator",
        title: "Stamp Duty Calculator",
        description:
          "Estimate stamp duty for your state, including first home buyer and foreign buyer rules.",
        icon: "/images/icons/calculator.svg",
      },
      {
        href: "/borrowing-power-calculator",
        title: "Borrowing Power Calculator",
        description:
          "What lenders will let you borrow, based on income, expenses, and existing debts.",
        icon: "/images/icons/calculator.svg",
      },
      {
        href: "/affordability-calculator",
        title: "Affordability Calculator",
        description:
          "What property price you can comfortably afford, factoring in deposit and ongoing costs.",
        icon: "/images/icons/median.svg",
      },
      {
        href: "/rental-yield-calculator",
        title: "Rental Yield Calculator",
        description:
          "Gross and net yield on a candidate investment property, with management fee inputs.",
        icon: "/images/icons/yield.svg",
      },
      {
        href: "/cgt-calculator",
        title: "Capital Gains Tax Calculator",
        description:
          "Estimate CGT on a property sale, including the 50% discount where it applies.",
        icon: "/images/icons/calculator.svg",
      },
      {
        href: "/refinancing-calculator",
        title: "Refinancing Calculator",
        description:
          "Break-even point on switching home loans, after exit and entry fees.",
        icon: "/images/icons/calculator.svg",
      },
    ],
  },
  {
    id: "research",
    label: "Research",
    blurb: "Browse the full library of Australian property data.",
    tools: [
      {
        href: "/suburbs",
        title: "Suburb Profiles",
        description:
          "Demographics, growth trends, schools, walkability, hazard data for every Australian suburb.",
        icon: "/images/icons/map.svg",
      },
      {
        href: "/price-guide",
        title: "Price Guide",
        description:
          "Compare median house and unit prices across every Australian suburb.",
        icon: "/images/icons/median.svg",
      },
      {
        href: "/market-reports",
        title: "Market Reports",
        description:
          "State-by-state property market reports, updated quarterly.",
        icon: "/images/icons/growth.svg",
      },
      {
        href: "/rba-cash-rate",
        title: "RBA Cash Rate",
        description:
          "History of every RBA decision and how rates affect property prices.",
        icon: "/images/icons/growth.svg",
      },
      {
        href: "/schools",
        title: "Schools",
        description:
          "Search 9,600+ Australian schools with catchments and ICSEA scores.",
        icon: "/images/icons/schools.svg",
      },
      {
        href: "/glossary",
        title: "Property Glossary",
        description:
          "Plain-English definitions for every term you'll meet buying or selling.",
        icon: "/images/icons/guide.svg",
      },
    ],
  },
];

export default function ToolsPage() {
  const totalTools = GROUPS.reduce((acc, g) => acc + g.tools.length, 0);

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Tools", url: "/tools" }]} />

      {/* Editorial hero */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.10] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Tools" }]} />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5 inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            {totalTools} free tools
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            Every property tool, <span className="italic text-primary">in one place</span>.
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            Calculators, the suburb match quiz, side-by-side comparison, and the
            full data library. Free, no sign-up, no email gate.
          </p>
        </div>
      </section>

      {/* Hero pair: quiz + compare */}
      <section className="bg-surface-raised border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {GROUPS[0].tools
              .filter((t) => t.primary)
              .map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group rounded-2xl border-2 border-primary/15 bg-surface-warm p-8 hover:border-primary/40 hover:shadow-md transition-all flex flex-col"
                >
                  <div className="flex items-start gap-5 mb-5">
                    <Image
                      src={t.icon}
                      alt=""
                      width={48}
                      height={48}
                      aria-hidden="true"
                      className="shrink-0 opacity-90"
                    />
                    <div>
                      <p className="text-xs font-sans uppercase tracking-[0.25em] text-cta mb-2">
                        {t.badge}
                      </p>
                      <h2 className="font-display text-2xl text-ink group-hover:text-primary transition-colors leading-tight">
                        {t.title}
                      </h2>
                    </div>
                  </div>
                  <p className="font-sans text-base text-ink-muted leading-relaxed mb-5 flex-1">
                    {t.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-ink border-b border-line-strong group-hover:border-primary group-hover:text-primary pb-0.5 transition-colors self-start">
                    Try it
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Grouped tools */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {GROUPS.map((g) => (
          <section key={g.id}>
            <div className="mb-6">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2">
                {g.label}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight">
                {g.blurb}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {g.tools.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group flex items-start gap-4 rounded-2xl border border-line bg-surface-raised p-5 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <Image
                    src={t.icon}
                    alt=""
                    width={32}
                    height={32}
                    aria-hidden="true"
                    className="shrink-0 mt-0.5 opacity-90"
                  />
                  <div className="min-w-0 flex-1">
                    {t.badge && (
                      <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-cta mb-1">
                        {t.badge}
                      </p>
                    )}
                    <p className="font-display text-base text-ink group-hover:text-primary transition-colors leading-tight">
                      {t.title}
                    </p>
                    <p className="mt-1.5 font-sans text-sm text-ink-muted leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-ink-subtle group-hover:text-primary transition-colors mt-1 shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Methodology link */}
      <section className="bg-surface-warm border-t border-line-warm">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14 text-center">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
            How it&rsquo;s built
          </p>
          <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-4">
            Sourced from official Australian data.
          </h2>
          <p className="font-sans text-base text-ink-muted leading-relaxed mb-6">
            Every tool runs on data from state Valuer-General offices, ABS,
            ACARA, BoM, and Geoscience Australia. Sourced and dated.
          </p>
          <Link
            href="/methodology"
            className="inline-flex items-center gap-1.5 font-sans text-base font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
          >
            Read our methodology
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
