import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { PERSONA_BY_ID } from "@/lib/constants/journey";

export const metadata: Metadata = {
  // Brand suffix is appended once by the root title template (%s | SITE_NAME);
  // the page title must not repeat it (was double-branded in the SERP).
  title: "Property Guides for Buyers and Sellers",
  description:
    "Free Australian property guides covering buying, investing, renting, selling, and moving. Plain-English, ungated, updated for 2026.",
  alternates: { canonical: `${SITE_URL}/guides` },
  openGraph: {
    url: `${SITE_URL}/guides`,
    title: `Property Guides | ${SITE_NAME}`,
    description:
      "Free Australian property guides covering buying, investing, renting, selling, and moving. Plain-English, ungated, updated for 2026.",
    type: "website",
  },
};

interface Guide {
  title: string;
  description: string;
  href: string;
  readTime: string;
  pillar?: boolean;
}

interface GuideSection {
  id: string;
  label: string;
  blurb: string;
  icon: string;
  guides: Guide[];
}

const SECTIONS: GuideSection[] = [
  {
    id: "first-home",
    label: "First home buyers",
    blurb: "Schemes, deposits, LMI, and the buying process. Start with the national guide, then drill into your state.",
    icon: "/images/icons/guide.svg",
    guides: [
      { title: "How to Buy Property in Australia",          href: "/guides/buying-property-australia", readTime: "15 min", description: "Complete step-by-step from saving your deposit to settlement.", pillar: true },
      { title: "First Home Buyer Guide (National)",        href: "/guides/first-home-buyer-guide", readTime: "10 min", description: "Federal schemes, FHOG by state, stamp duty concessions and step-by-step buying." },
      { title: "How Much Deposit to Buy a House?",          href: "/guides/how-much-deposit-to-buy-a-house", readTime: "9 min", description: "5%, 10%, 20%, what each tier unlocks, plus LMI, schemes, and FHSS." },
      { title: "10 First Home Buyer Mistakes to Avoid",     href: "/guides/first-home-buyer-mistakes-to-avoid", readTime: "9 min", description: "The expensive errors, ranked, with the simple fix for each." },
      { title: "Best Time to Buy Property in Australia",    href: "/guides/best-time-to-buy-property-australia", readTime: "8 min", description: "Seasonal patterns, the rate cycle, and why timing the market rarely wins." },
      { title: "How Long Does It Take to Buy a House?",     href: "/guides/how-long-does-it-take-to-buy-a-house-australia", readTime: "8 min", description: "Realistic 12 to 20 week timeline, stage by stage, with state settlement times." },
      { title: "Cooling-Off Period by State",               href: "/guides/cooling-off-period-by-state-australia", readTime: "7 min", description: "How long you have to pull out of a private treaty contract, state by state." },
      { title: "Best Brisbane Suburbs for Families 2026",   href: "/guides/best-brisbane-suburbs-for-families-2026", readTime: "10 min", description: "Inner-ring, middle-ring, and outer growth corridors picked for school quality and lifestyle." },
      { title: "How to Negotiate Property Price",           href: "/guides/how-to-negotiate-property-price-australia", readTime: "13 min", description: "Opening offers, counter-offer logic, walk-away triggers and the mistakes that cost buyers money." },
      { title: "What Happens on Settlement Day",            href: "/guides/settlement-day-australia", readTime: "12 min", description: "Plain-English walkthrough of PEXA settlement, final inspection, funds flow, delays and state-by-state notes." },
      { title: "Capital Growth vs Cash Flow",               href: "/guides/capital-growth-vs-cash-flow-australia", readTime: "14 min", description: "The investor decision that gets oversimplified into one sentence. How the trade-off actually works on real Australian property." },
      { title: "Offset Accounts Explained",                 href: "/guides/offset-accounts-explained-australia", readTime: "11 min", description: "How offset accounts save interest mechanically, when the package fee is worth it, and the redraw trap that costs investors deductions." },
      { title: "First Home Buyer Guide, NSW",               href: "/guides/first-home-buyer-nsw", readTime: "7 min",  description: "$10K FHOG, stamp duty exemption to $800K, FHB choice." },
      { title: "First Home Buyer Guide, VIC",               href: "/guides/first-home-buyer-vic", readTime: "7 min",  description: "$10K metro / $20K regional FHOG, stamp duty to $600K." },
      { title: "First Home Buyer Guide, QLD",               href: "/guides/first-home-buyer-qld", readTime: "7 min",  description: "$30K FHOG, transfer-duty concession, REIQ contract." },
      { title: "First Home Buyer Guide, WA",                href: "/guides/first-home-buyer-wa",  readTime: "7 min",  description: "$10K FHOG, stamp duty to $450K, Keystart loans." },
      { title: "First Home Buyer Guide, SA",                href: "/guides/first-home-buyer-sa",  readTime: "9 min",  description: "$15K FHOG, HomeSeeker shared equity, off-the-plan concession." },
      { title: "First Home Buyer Guide, TAS",               href: "/guides/first-home-buyer-tas", readTime: "8 min",  description: "$30K FHOG, 50% stamp duty concession on established homes." },
      { title: "First Home Buyer Guide, ACT",               href: "/guides/first-home-buyer-act", readTime: "9 min",  description: "Full stamp duty waiver via HBCS, Land Rent Scheme, Crown Lease." },
      { title: "First Home Buyer Guide, NT",                href: "/guides/first-home-buyer-nt",  readTime: "8 min",  description: "$10K FHOG plus $23,928 stamp duty discount, leasehold land." },
      { title: "Lenders Mortgage Insurance (LMI)",          href: "/guides/lenders-mortgage-insurance-guide", readTime: "8 min",  description: "What LMI costs and the schemes that waive it." },
      { title: "Fixed vs Variable Rate Mortgages",          href: "/guides/fixed-vs-variable-rate-guide", readTime: "8 min",  description: "Which loan structure fits your situation, with worked examples." },
      { title: "Conveyancing in Australia",                 href: "/guides/conveyancing-guide", readTime: "8 min", description: "What conveyancers do, what they cost, and what to ask." },
      { title: "Building & Pest Inspection",                href: "/guides/building-pest-inspection", readTime: "7 min", description: "When to inspect, what's covered, and how to read the report." },
      { title: "Property Auction Guide",                    href: "/guides/property-auction-guide", readTime: "10 min", description: "How auctions actually run, bidding strategy, and pre-auction due diligence." },
      { title: "Foreign Buyer (FIRB) Guide",                href: "/guides/foreign-buyer-firb-guide", readTime: "12 min", description: "FIRB rules, foreign buyer surcharges, and tax implications." },
    ],
  },
  {
    id: "selling",
    label: "Selling your home",
    blurb: "Picking an agent, the auction process, and how the agent fee structure actually works.",
    icon: "/images/icons/broker.svg",
    guides: [
      { title: "How to Sell a House in Australia",           href: "/guides/how-to-sell-a-house-australia", readTime: "14 min", description: "The full sale process from appraisal to settlement, with timing, costs, and the decisions that move the price.", pillar: true },
      { title: "How Much Is My House Worth?",               href: "/guides/how-much-is-my-house-worth-australia", readTime: "10 min", description: "Appraisal vs bank valuation vs online estimate, why they differ, and how to get an accurate figure." },
      { title: "How to Choose a Selling Agent",             href: "/guides/how-to-choose-a-selling-agent", readTime: "9 min", description: "Interview process, the appraisal-price trap, fees, and the listing agreement." },
      { title: "Real Estate Agent Fees in Australia",       href: "/guides/real-estate-agent-fees-australia", readTime: "8 min", description: "Commission rates by state, marketing costs, and what's negotiable." },
      { title: "Property Auction Guide",                    href: "/guides/property-auction-guide", readTime: "10 min", description: "What to expect on auction day from the seller's side." },
      { title: "Conveyancing in Australia",                 href: "/guides/conveyancing-guide", readTime: "8 min", description: "What your conveyancer does on the sell side." },
    ],
  },
  {
    id: "upgrading",
    label: "Upgrading or downsizing",
    blurb: "When two transactions need to talk to each other. Sell vs buy first, bridging loans, and downsizing strategy.",
    icon: "/images/icons/map.svg",
    guides: [
      { title: "Sell First or Buy First?",                  href: "/guides/sell-first-or-buy-first", readTime: "8 min", description: "Decision tree across the three options, with worked examples." },
      { title: "Bridging Loans Australia",                  href: "/guides/bridging-loans-guide", readTime: "9 min", description: "Peak debt, end debt, capitalised interest, and when bridging is the right call." },
      { title: "Downsizers Guide",                          href: "/guides/downsizers-guide", readTime: "9 min", description: "When to downsize, super contribution rules, and matching the right home to a new lifestyle." },
      { title: "How to Choose a Selling Agent",             href: "/guides/how-to-choose-a-selling-agent", readTime: "9 min", description: "Get the right agent listing your old home before you commit either way." },
    ],
  },
  {
    id: "investing",
    label: "Property investors",
    blurb: "Tax strategy, granny flat economics, depreciation schedules, and SMSF property.",
    icon: "/images/icons/growth.svg",
    guides: [
      { title: "House vs Apartment Investment",             href: "/guides/house-vs-apartment-investment-australia", readTime: "9 min", description: "Capital growth, rental yield, holding costs and a 20-year worked example." },
      { title: "Property Management Fees Australia",         href: "/guides/property-management-fees-australia", readTime: "8 min", description: "All 8 fee types, state ranges, and the all-in cost most quotes hide." },
      { title: "Sydney vs Melbourne Property Market",        href: "/guides/sydney-vs-melbourne-property-market", readTime: "9 min", description: "Median prices, growth, yields and affordability between Australia's two biggest markets." },
      { title: "Buyer's Agent Cost in Australia",           href: "/guides/buyers-agent-cost-australia", readTime: "8 min", description: "Fees by service tier and city, plus when a buyer's agent is actually worth it." },
      { title: "Negative Gearing in Australia",             href: "/guides/negative-gearing-australia", readTime: "8 min", description: "How it works, what you can deduct, and whether it fits your strategy." },
      { title: "Property Depreciation Guide",               href: "/guides/property-depreciation-guide", readTime: "9 min", description: "Capital works vs plant & equipment deductions, and when a depreciation schedule pays off." },
      { title: "SMSF Property Investment",                  href: "/guides/smsf-property-guide", readTime: "10 min", description: "How SMSFs buy property, LRBA rules, and the trade-offs." },
      { title: "Granny Flat Guide, NSW",                    href: "/guides/granny-flat-guide-nsw", readTime: "8 min", description: "NSW's CDC fast-track pathway, costs, and yields." },
      { title: "Granny Flat Guide, VIC",                    href: "/guides/granny-flat-guide-vic", readTime: "7 min", description: "Victorian planning permits, ResCode, and growth corridor opportunities." },
      { title: "Granny Flat Guide, QLD",                    href: "/guides/granny-flat-guide-qld", readTime: "7 min", description: "Brisbane City Council rules and QLD's tight rental market." },
      { title: "Granny Flat Guide, SA",                     href: "/guides/granny-flat-guide-sa", readTime: "9 min", description: "SA Planning and Design Code, complying development, and Adelaide rents." },
      { title: "Granny Flat Guide, WA",                     href: "/guides/granny-flat-guide-wa", readTime: "9 min", description: "R-Codes, owner-occupier rule, and Perth's tight rental market." },
      { title: "Foreign Buyer (FIRB) Guide",                href: "/guides/foreign-buyer-firb-guide", readTime: "12 min", description: "FIRB rules, surcharges, and tax for overseas investors." },
    ],
  },
  {
    id: "renters",
    label: "Renters",
    blurb: "Your rights as a tenant, state by state. Bond, rent increases, repairs, entry, and ending a tenancy.",
    icon: "/images/icons/hazard.svg",
    guides: [
      { title: "Renter's Rights, NSW",  href: "/guides/renters-rights-nsw", readTime: "10 min", description: "Bond, 12-month rent-increase minimum, NCAT, and no-grounds evictions." },
      { title: "Renter's Rights, VIC",  href: "/guides/renters-rights-vic", readTime: "10 min", description: "No-grounds evictions abolished, pet rights, modification rights, and VCAT." },
      { title: "Renter's Rights, QLD",  href: "/guides/renters-rights-qld", readTime: "10 min", description: "2024 reforms, RTA dispute resolution, and QCAT." },
      { title: "Renter's Rights, SA",   href: "/guides/renters-rights-sa",  readTime: "8 min",  description: "SA tenant rules, CBS mediation, and SACAT." },
      { title: "Renter's Rights, WA",   href: "/guides/renters-rights-wa",  readTime: "8 min",  description: "WA's Residential Tenancies Act, no tribunal, Magistrates Court route." },
      { title: "Renter's Rights, TAS",  href: "/guides/renters-rights-tas", readTime: "9 min",  description: "Bond rules, the Rental Deposit Authority, and CBOS dispute resolution." },
      { title: "Renter's Rights, NT",   href: "/guides/renters-rights-nt",  readTime: "9 min",  description: "Tropical-climate urgent repairs, remote community housing, and NTCAT." },
      { title: "Renter's Rights, ACT",  href: "/guides/renters-rights-act", readTime: "10 min", description: "ACT's strong protections including effective no-grounds-eviction ban." },
    ],
  },
];

const PERSONA_LINKS = [
  { id: "first-home", href: PERSONA_BY_ID["first-home"].hubPath, label: PERSONA_BY_ID["first-home"].cardLabel },
  { id: "selling",    href: PERSONA_BY_ID["selling"].hubPath,    label: PERSONA_BY_ID["selling"].cardLabel },
  { id: "upgrading",  href: PERSONA_BY_ID["upgrading"].hubPath,  label: PERSONA_BY_ID["upgrading"].cardLabel },
  { id: "investing",  href: PERSONA_BY_ID["investing"].hubPath,  label: PERSONA_BY_ID["investing"].cardLabel },
];

const TOOLS = [
  { title: "Real Estate Commission Calculator", href: "/real-estate-commission-calculator", description: "Work out what an agent's commission costs you on your sale price, state by state." },
  { title: "Borrowing Power Calculator",        href: "/borrowing-power-calculator",        description: "Estimate how much a lender will let you borrow based on income and expenses." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",             description: "Estimate your stamp duty and first home buyer concessions in under a minute." },
];

export default function GuidesHubPage() {
  const totalGuides = SECTIONS.reduce((acc, s) => acc + s.guides.length, 0);

  return (
    <>
      <CollectionPageJsonLd
        name="Property Guides"
        description="Free Australian property guides covering buying, renting, investing, selling, and moving."
        url="/guides"
      />
      <BreadcrumbJsonLd items={[{ name: "Guides", url: "/guides" }]} />

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
            <Breadcrumbs items={[{ label: "Guides" }]} />
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
                {totalGuides} guides, all free, all current
              </p>
              <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
                Property guides for <span className="italic text-primary">every stage</span>.
              </h1>
              <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
                Plain-English guides covering buying, selling, moving, investing,
                and renting in Australia. No paywall, no sign-up, sourced and dated.
              </p>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-line-warm bg-surface-raised shadow-card overflow-hidden">
                <Image
                  src="/images/illustrations/guides-hero.svg"
                  alt=""
                  aria-hidden="true"
                  width={320}
                  height={220}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Stat anchor row, breaks down the {totalGuides} headline by section */}
          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-6">
            {SECTIONS.map((s) => (
              <div key={s.id} className="flex items-start gap-3">
                <Image src={s.icon} alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-display text-2xl text-ink leading-none mb-1">{s.guides.length}</p>
                  <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">{s.label.toLowerCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Persona quick-jump */}
      <section className="border-b border-line bg-surface-raised">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-sans uppercase tracking-wider text-ink-subtle mr-2">
              Or jump to a hub:
            </span>
            {PERSONA_LINKS.map((p) => (
              <Link
                key={p.id}
                href={p.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-1.5 text-sm font-medium text-ink hover:bg-surface-warm hover:border-ink transition-colors"
              >
                {p.label}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Guide sections by persona */}
      <article className="bg-surface-raised">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id}>
              <div className="grid lg:grid-cols-12 gap-8 mb-8">
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-warm border border-line-warm flex items-center justify-center shrink-0">
                      <Image src={section.icon} alt="" width={24} height={24} className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle">
                      For {section.label.toLowerCase()}
                    </p>
                  </div>
                  <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
                    {section.label}
                  </h2>
                </div>
                <div className="lg:col-span-6 lg:col-start-7 flex items-end">
                  <p className="font-sans text-base text-ink-muted leading-relaxed">
                    {section.blurb}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.guides.map((guide) => (
                  <Link
                    key={guide.href + guide.title}
                    href={guide.href}
                    className="group rounded-2xl border border-line bg-surface-raised hover:border-ink hover:shadow-card-hover p-6 transition-all flex flex-col"
                  >
                    {guide.pillar && (
                      <p className="text-xs font-sans uppercase tracking-[0.2em] text-primary mb-2">
                        Start here
                      </p>
                    )}
                    <h3 className="font-display text-lg text-ink leading-tight mb-3">
                      {guide.title}
                    </h3>
                    <p className="font-sans text-sm text-ink-muted leading-relaxed flex-1 mb-4">
                      {guide.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans uppercase tracking-wider text-ink-subtle">
                        {guide.readTime}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-ink">
                        Read
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>

      {/* Calculators & tools */}
      <section className="bg-surface-warm border-t border-line-warm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-12 gap-8 mb-8">
            <div className="lg:col-span-5">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                Run the numbers
              </p>
              <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
                Calculators &amp; tools
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 flex items-end">
              <p className="font-sans text-base text-ink-muted leading-relaxed">
                Free calculators to size up the costs before you commit. No sign-up, instant results.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-2xl border border-line bg-surface-raised hover:border-ink hover:shadow-card-hover p-6 transition-all flex flex-col"
              >
                <h3 className="font-display text-lg text-ink leading-tight mb-3">
                  {tool.title}
                </h3>
                <p className="font-sans text-sm text-ink-muted leading-relaxed flex-1 mb-4">
                  {tool.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-ink self-start">
                  Open tool
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-surface-warm border-t border-line-warm">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 text-center">
          <p className="font-sans text-sm text-ink-muted leading-relaxed">
            Our guides are for general information only and do not constitute
            financial, legal, or tax advice. Always verify current grants,
            thresholds, and rules with the relevant state agency or a licensed
            professional before relying on them.
          </p>
        </div>
      </section>
    </>
  );
}
