import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { RelatedGuidesSection } from "@/components/guide/GuideLinkList";
import { calculatorGuideGroups } from "@/lib/guides/hub-guides";

export const metadata: Metadata = {
  title: "Free Australian Property Tools, Quizzes & Calculators",
  description:
    "All our free property tools in one place: 9 calculators, the suburb match quiz, the suburb comparison tool, and the suburb finder. No sign-up.",
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
}

interface ToolGroup {
  id: string;
  label: string;
  blurb: string;
  /** The free guide that fits the group, offered beside its heading. */
  guide?: { href: string; label: string };
  tools: Tool[];
}

// Calculators first, grouped by what the reader is doing (we are a guide,
// not a data tool); the suburb tools and the data library follow.
const GROUPS: ToolGroup[] = [
  {
    id: "selling",
    label: "Selling",
    blurb: "What selling will cost, what you'll keep, and what homes like yours sell for.",
    guide: { href: "/selling-guide?from=tools", label: "Get the free selling guide" },
    tools: [
      {
        href: "/real-estate-commission-calculator",
        title: "Real Estate Commission Calculator",
        description: "What an agent will cost on your sale price, with typical rates by state.",
      },
      {
        href: "/selling-costs-calculator",
        title: "Selling Costs Calculator",
        description: "Commission, marketing and legal costs on your sale, and your net proceeds.",
      },
      {
        href: "/property-valuation",
        title: "Property Valuation Range",
        description:
          "Pick a suburb and a dwelling type for the published median and a range either side, then a free agent appraisal.",
      },
      {
        href: "/bridging-loan-calculator",
        title: "Bridging Loan Calculator",
        description:
          "Buying before you sell: peak debt and its LVR, interest added while you sell, end debt and the cost against selling first.",
      },
    ],
  },
  {
    id: "buying",
    label: "Buying and home loans",
    blurb: "What you can borrow, what it costs to buy, and the schemes that cut the cost.",
    guide: { href: "/buying-guide?from=tools", label: "Get the free buying guide" },
    tools: [
      {
        href: "/borrowing-power-calculator",
        title: "Borrowing Power Calculator",
        description:
          "What lenders will let you borrow, based on income, expenses, and existing debts.",
      },
      {
        href: "/stamp-duty-calculator",
        title: "Stamp Duty Calculator",
        description:
          "Estimate stamp duty for your state, including first home buyer and foreign buyer rules.",
      },
      {
        href: "/mortgage-calculator",
        title: "Mortgage Calculator",
        description:
          "Monthly repayments, total interest, and amortisation over the loan term.",
      },
      {
        href: "/affordability-calculator",
        title: "Affordability Calculator",
        description:
          "What property price you can comfortably afford, factoring in deposit and ongoing costs.",
      },
      {
        href: "/lmi-calculator",
        title: "LMI Calculator",
        description:
          "Lenders mortgage insurance on a deposit under 20%, with your state's stamp duty on the premium.",
      },
      {
        href: "/help-to-buy-calculator",
        title: "Help to Buy Calculator",
        description:
          "Check the Help to Buy income limit and your state's price cap, the government's share, your repayments, and the 5% Deposit Scheme alternative.",
      },
      {
        href: "/fhss-calculator",
        title: "FHSS Calculator",
        description:
          "What the First Home Super Saver scheme adds to your deposit: the release, the deemed earnings, the tax, and the same money saved in a bank.",
      },
      {
        href: "/refinancing-calculator",
        title: "Refinancing Calculator",
        description:
          "Break-even point on switching home loans, after exit and entry fees.",
      },
    ],
  },
  {
    id: "investing",
    label: "Investing",
    blurb: "Yield, the after-tax holding cost, and the tax on a sale.",
    tools: [
      {
        href: "/rental-yield-calculator",
        title: "Rental Yield Calculator",
        description:
          "Gross and net yield on a candidate investment property, with management fee inputs.",
      },
      {
        href: "/negative-gearing-calculator",
        title: "Negative Gearing Calculator",
        description:
          "Rental loss, tax saving at the 2026–27 rates, and your weekly cost after tax.",
      },
      {
        href: "/cgt-calculator",
        title: "Capital Gains Tax Calculator",
        description:
          "Estimate CGT on a property sale, including the 50% discount where it applies.",
      },
    ],
  },
  {
    id: "suburbs",
    label: "Suburbs and research",
    blurb: "Find and compare suburbs, and the data library behind the guides.",
    tools: [
      {
        href: "/find-your-suburb",
        title: "Find Your Suburb",
        description:
          "30-second match quiz that scores six suburbs against your budget, priorities, and stage.",
      },
      {
        href: "/compare",
        title: "Compare Suburbs",
        description:
          "Pick any two Australian suburbs and line them up side by side, median to walkability to risk.",
      },
      {
        href: "/best-suburbs",
        title: "Best Suburbs Rankings",
        description:
          "Six ranked lists across schools, growth, affordability, walkability, hazards, and rental yield.",
      },
      {
        href: "/suburbs",
        title: "Suburb Profiles",
        description:
          "Demographics, growth trends, schools, walkability, hazard data for every Australian suburb.",
      },
      {
        href: "/price-guide",
        title: "Price Guide",
        description:
          "Compare median house and unit prices across every Australian suburb.",
      },
      {
        href: "/market-reports",
        title: "Market Reports",
        description:
          "State-by-state property market reports, updated quarterly.",
      },
      {
        href: "/rba-cash-rate",
        title: "RBA Cash Rate",
        description:
          "History of every RBA decision and how rates affect property prices.",
      },
      {
        href: "/schools",
        title: "Schools",
        description:
          "Search 9,600+ Australian schools with catchments and ICSEA scores.",
      },
      {
        href: "/glossary",
        title: "Property Glossary",
        description:
          "Plain-English definitions for every term you'll meet buying or selling.",
      },
    ],
  },
];

export default function ToolsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Tools", url: "/tools" }]} />

      <section className="bg-surface-warm border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6 sm:pb-10">
          <div className="mb-4 sm:mb-6">
            <Breadcrumbs items={[{ label: "Tools" }]} />
          </div>
          <h1 className="font-display text-ink tracking-[-0.035em] text-[2.125rem] leading-[1.05] sm:text-5xl font-bold max-w-3xl">
            Property calculators and tools
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-ink leading-normal max-w-2xl">
            Every calculator on the site, grouped by what you&rsquo;re doing:
            selling, buying or investing. Free, no sign-up.
          </p>
          <nav aria-label="Tool groups" className="mt-4">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {GROUPS.map((g) => (
                <li key={g.id}>
                  <a href={`#${g.id}`} className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                    {g.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16 space-y-12">
          {GROUPS.map((g) => (
            <section key={g.id} id={g.id} className="scroll-mt-20">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-6 mb-4">
                <div>
                  <h2 className="font-display text-ink tracking-[-0.02em] text-2xl sm:text-3xl leading-tight font-bold">
                    {g.label}
                  </h2>
                  <p className="mt-1 text-base text-ink-muted">{g.blurb}</p>
                </div>
                {g.guide && (
                  <Link
                    href={g.guide.href}
                    className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
                  >
                    {g.guide.label} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 border-t border-line">
                {g.tools.map((t) => (
                  <li key={t.href} className="border-b border-line">
                    <Link href={t.href} className="group flex items-start justify-between gap-3 py-4">
                      <span className="min-w-0">
                        <span className="block font-semibold text-ink group-hover:underline underline-offset-4">{t.title}</span>
                        <span className="block mt-0.5 text-sm text-ink-muted leading-snug">{t.description}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 mt-1 shrink-0 text-ink-subtle group-hover:text-ink" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              {g.id === "suburbs" && (
                <p className="mt-4 text-sm text-ink-muted">
                  The suburb figures come from state Valuer-General offices, ABS, ACARA, BoM and Geoscience Australia.{" "}
                  <Link href="/methodology" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                    Read our methodology
                  </Link>
                </p>
              )}
            </section>
          ))}
        </div>
      </div>

      {/* Each calculator with the guides it pairs with (src/lib/guides/hub-guides.ts);
          the page linked no guide at all until 30 Sep 2026. */}
      <RelatedGuidesSection
        heading="Every calculator, with the guide behind it"
        intro="The calculator runs the numbers; the guides explain the rules, rates and exemptions it applies."
        groups={calculatorGuideGroups()}
        tone="warm"
        id="calculator-guides"
      />
    </>
  );
}
