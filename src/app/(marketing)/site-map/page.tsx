import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Site Map",
  description:
    "Browse every section of Your Property Guide on a single page. Listings, suburb data, calculators, guides, and tools.",
  alternates: { canonical: `${SITE_URL}/site-map` },
  openGraph: {
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

const SECTIONS: Section[] = [
  {
    title: "Listings",
    blurb: "Search properties for sale, for rent, recently sold, off-market, and house & land packages.",
    links: [
      { label: "Properties for sale",     href: "/buy" },
      { label: "Properties for rent",     href: "/rent" },
      { label: "Recently sold",           href: "/sold" },
      { label: "Off-market properties",   href: "/off-market" },
      { label: "House & land packages",   href: "/house-and-land" },
    ],
  },
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
      { label: "Refinancing calculator",     href: "/refinancing-calculator" },
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
      { label: "Browse local agents",   href: "/agents" },
      { label: "Browse local agencies", href: "/real-estate-agencies" },
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
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-20 sm:pb-24">
          <div className="mb-10">
            <Breadcrumbs items={[{ label: "Site map" }]} />
          </div>

          <div className="flex items-center gap-4 mb-10">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              The full index
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              {totalLinks} links · {SECTIONS.length} sections
            </span>
          </div>
          <h1 className="font-display text-ink leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-10 max-w-[18ch] font-medium">
            Everything we do, on{" "}
            <span className="italic font-light text-primary">one page</span>.
          </h1>
          <p className="font-display font-light text-xl sm:text-2xl text-ink leading-[1.25] max-w-3xl">
            Looking for something specific? Browse every section, calculator,
            guide and hub from here.
          </p>
        </div>
      </section>

      {/* Sections */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <div className="mb-5 pb-3 border-b border-line">
              <h2
                className="font-display text-2xl text-ink leading-tight"
                dangerouslySetInnerHTML={{ __html: s.title }}
              />
              <p className="mt-1 font-sans text-sm text-ink-muted">{s.blurb}</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-2.5">
              {s.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-sans text-sm text-ink-muted hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
