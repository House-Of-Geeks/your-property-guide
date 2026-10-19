import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";

export const metadata: Metadata = {
  title: "Site Map",
  description:
    "Browse every section of Your Property Guide on a single page. Suburb data, calculators, guides, and tools.",
  alternates: { canonical: `${SITE_URL}/site-map` },
  openGraph: { ...DEFAULT_OG,
    url: `${SITE_URL}/site-map`,
    title: "Site Map | Your Property Guide",
    description: "Every section of Your Property Guide on one page.",
    type: "website",
  },
};

interface Section {
  title: string;
  blurb: string;
  links: { label: string; href: string }[];
}

// The Listings section (/buy, /rent, /sold, /off-market, /house-and-land)
// went with those routes on 14 Oct 2026 (docs/portal-consolidation-2026-10-14.md).
const SECTIONS: Section[] = [
  {
    title: "Suburb &amp; market data",
    blurb: "Browse and compare Australian suburbs, postcodes, regions, and states.",
    links: [
      { label: "All suburbs",             href: "/suburbs" },
      { label: "Compare two suburbs",     href: "/compare" },
      { label: "Find your suburb (quiz)", href: "/find-your-suburb" },
      { label: "Best suburbs by category",href: "/best-suburbs" },
      { label: "By state",                href: "/states" },
      { label: "By region",               href: "/regions" },
      { label: "By postcode",             href: "/postcodes" },
      { label: "Suburb price guide",      href: "/price-guide" },
      { label: "Market reports",          href: "/market-reports" },
      { label: "RBA cash rate history",   href: "/rba-cash-rate" },
      { label: "Schools",                 href: "/schools" },
    ],
  },
  {
    title: "Best suburbs",
    blurb: "Six ranked lists across the dimensions that matter most.",
    links: [
      { label: "Best for families",       href: "/best-suburbs/for-families" },
      { label: "Highest growth",          href: "/best-suburbs/highest-growth" },
      { label: "Most affordable",         href: "/best-suburbs/most-affordable" },
      { label: "Most walkable",           href: "/best-suburbs/most-walkable" },
      { label: "Lowest flood risk",       href: "/best-suburbs/lowest-flood-risk" },
      { label: "Best rental yield",       href: "/best-suburbs/best-rental-yield" },
    ],
  },
  {
    title: "Calculators",
    blurb: "Free, no sign-up. Mortgage repayments, stamp duty, borrowing power, and more.",
    links: [
      { label: "All tools (overview)",       href: "/tools" },
      { label: "Property insights hub",      href: "/insights" },
      { label: "RSS feed",                   href: "/guides/feed.xml" },
      { label: "Mortgage calculator",        href: "/mortgage-calculator" },
      { label: "Stamp duty calculator",      href: "/stamp-duty-calculator" },
      { label: "Borrowing power calculator", href: "/borrowing-power-calculator" },
      { label: "Affordability calculator",   href: "/affordability-calculator" },
      { label: "Rental yield calculator",    href: "/rental-yield-calculator" },
      { label: "CGT calculator",             href: "/cgt-calculator" },
      { label: "LMI calculator",             href: "/lmi-calculator" },
      { label: "Negative gearing calculator", href: "/negative-gearing-calculator" },
      { label: "Refinancing calculator",     href: "/refinancing-calculator" },
      { label: "Bridging loan calculator",   href: "/bridging-loan-calculator" },
      { label: "Help to Buy calculator",     href: "/help-to-buy-calculator" },
      { label: "FHSS calculator",            href: "/fhss-calculator" },
    ],
  },
  {
    title: "Guides",
    blurb: "Plain-English guides for buyers, sellers, movers, investors, and renters.",
    links: [
      { label: "All guides",                                  href: "/guides" },
      { label: "First home buyer guide (national)",           href: "/guides/first-home-buyer-guide" },
      { label: "How to buy property in Australia",            href: "/guides/buying-property-australia" },
      { label: "How much deposit do you need?",               href: "/guides/how-much-deposit-to-buy-a-house" },
      { label: "First home buyer mistakes to avoid",          href: "/guides/first-home-buyer-mistakes-to-avoid" },
      { label: "Cooling-off period by state",                 href: "/guides/cooling-off-period-by-state-australia" },
      { label: "How long does it take to buy a house?",       href: "/guides/how-long-does-it-take-to-buy-a-house-australia" },
      { label: "Best time to buy property in Australia",      href: "/guides/best-time-to-buy-property-australia" },
      { label: "Sell first or buy first?",                    href: "/guides/sell-first-or-buy-first" },
      { label: "Bridging loans Australia",                    href: "/guides/bridging-loans-guide" },
      { label: "How to choose a selling agent",               href: "/guides/how-to-choose-a-selling-agent" },
      { label: "Real estate agent fees in Australia",         href: "/guides/real-estate-agent-fees-australia" },
      { label: "Property auction guide",                      href: "/guides/property-auction-guide" },
      { label: "Negative gearing in Australia",               href: "/guides/negative-gearing-australia" },
      { label: "Property depreciation guide",                 href: "/guides/property-depreciation-guide" },
      { label: "House vs apartment investment",               href: "/guides/house-vs-apartment-investment-australia" },
      { label: "Sydney vs Melbourne property market",         href: "/guides/sydney-vs-melbourne-property-market" },
      { label: "Buyer's agent cost in Australia",             href: "/guides/buyers-agent-cost-australia" },
      { label: "Property management fees Australia",          href: "/guides/property-management-fees-australia" },
      { label: "Best time to buy property in Australia",      href: "/guides/best-time-to-buy-property-australia" },
      { label: "How long does it take to buy a house?",       href: "/guides/how-long-does-it-take-to-buy-a-house-australia" },
      { label: "Best Brisbane suburbs for families 2026",     href: "/guides/best-brisbane-suburbs-for-families-2026" },
      { label: "SMSF property investment",                    href: "/guides/smsf-property-guide" },
      { label: "Property glossary (A–Z)",                     href: "/glossary" },
    ],
  },
  {
    title: "Persona hubs",
    blurb: "Whatever your stage, jump straight to the section that fits.",
    links: [
      { label: "Buying: where to start", href: "/buying" },
      { label: "First home buyers",  href: "/first-home-buyers" },
      { label: "Selling your home",  href: "/selling" },
      { label: "Upgrading or downsizing", href: "/upgrading" },
      { label: "Investing",          href: "/investing" },
    ],
  },
  {
    title: "Talk to someone",
    blurb: "When you're ready to bring in an expert.",
    links: [
      { label: "Find an expert",        href: "/find-an-expert" },
      { label: "Get a free appraisal",  href: "/appraisal" },
      // Agent/agency directory rows removed while the directory is paused
      // (placeholder profiles only) per Andy, 2026-07-03.
    ],
  },
  {
    title: "About",
    blurb: "Who we are, how we work, and how to reach us.",
    links: [
      { label: "About Your Property Guide", href: "/about" },
      { label: "Our methodology",           href: "/methodology" },
      { label: "Our data (live counts)",    href: "/data" },
      { label: "Data updates / changelog",  href: "/data-updates" },
      { label: "Contact",                   href: "/contact" },
      { label: "Privacy",                   href: "/privacy" },
    ],
  },
];

export default function SiteMapPage() {
  const totalLinks = SECTIONS.reduce((acc, s) => acc + s.links.length, 0);

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Site map", url: "/site-map" }]} />

      {/* A plain charcoal hero: an index needs no photo. */}
      <PhotoHero breadcrumbs={[{ label: "Site map" }]}>
        <div className="flex items-center gap-4 mb-8">
          <span className="text-sm font-semibold text-ink-muted leading-none">
            The full index
          </span>
          <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
          <span className="text-sm text-ink-subtle font-medium">
            {totalLinks} links · {SECTIONS.length} sections
          </span>
        </div>
        <HeroTitle>
          Everything we do, on{" "}
          <span>one page</span>
        </HeroTitle>
        <HeroLead>
          Looking for something specific? Browse every section, calculator,
          guide and hub from here.
        </HeroLead>
      </PhotoHero>

      {/* Sections */}
      <Band spacing="compact">
        <div className="space-y-14">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <div className="mb-6 pb-4 border-b-2 border-ink">
                <h2
                  className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-ink leading-tight"
                  dangerouslySetInnerHTML={{ __html: s.title }}
                />
                <p className="mt-2 text-base text-ink-muted">{s.blurb}</p>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-3">
                {s.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-base text-ink-muted hover:text-primary transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Band>
    </>
  );
}
