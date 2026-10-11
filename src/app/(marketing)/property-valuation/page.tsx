import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { AppraisalForm } from "@/components/forms/AppraisalForm";
import { SuburbValueRange } from "@/components/journey/SuburbValueRange";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, FAQPageJsonLd, JsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { COVERAGE_CAVEAT } from "@/lib/match-coverage";

// Commercial intent review 3.4 (30 Sep 2026): the "property valuation" and
// "property value" family is 101 Keyword Planner terms over 500 a month,
// 369,790 searches, none with a Search Console impression. The SERPs are
// instant-estimate tools and bank "free property report" pages; the AI
// Overview lists the instant estimates first and the agent appraisal second.
// This page carries the three numbers side by side, the sourced cost of a
// valuation and when a lender needs one, the same suburb range block as
// /appraisal and the house-worth guide, the appraisal form, and the People
// Also Ask set as FAQs. Static: no database read at render; the range block
// and the form fetch on the client.

const PATH = "/property-valuation";
// The <title> stays inside the ~60-character SERP budget before the
// " | Your Property Guide" suffix; the long form is the H1 and the WebPage
// name (tests/seo/titles.test.ts).
const TITLE = "Property Valuation Australia: Appraisal vs Estimate (2026)";
const HEADLINE = "Property Valuation in Australia: Appraisal vs Valuation vs Online Estimate (2026)";
const DESCRIPTION =
  "Appraisal, licensed valuation ($300 to $600) or online estimate: what each is for, when a lender needs one, and a suburb range from published sales medians.";
const PUBLISHED = "2026-09-30";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { url: `${SITE_URL}${PATH}`, title: TITLE, description: DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

// Every figure below carries its source and date. The valuation fee is the
// range two lenders' guides publish; the free-report facts are read from the
// banks' own pages; the land-value definition is the NSW Government's.
const SOURCES: { label: string; href: string; note: string }[] = [
  { label: "Aussie (Lendi Group): Property appraisals vs valuations, what's the difference?", href: "https://www.aussie.com.au/insights/articles/property-appraisals-vs-valuations-difference/", note: "31 January 2025. Valuation cost $300 to $600; who can provide each; when a valuation is needed." },
  { label: "ANZ: Getting a property valuation, what it is and when you might need one", href: "https://www.anz.com.au/personal/home-loans/tips-and-guides/property-valuation-what-it-is-and-when-you-might-need-one/", note: "Read 30 September 2026. $300 to $600; an appraisal cannot be used for a home loan application." },
  { label: "NAB: Understanding bank valuations on your property", href: "https://www.nab.com.au/personal/life-moments/home-property/buy-next-home/valuations", note: "Read 30 September 2026. When a lender orders a valuation; inside or from the street." },
  { label: "NAB: The costs of refinancing your home loan", href: "https://www.nab.com.au/personal/life-moments/home-property/pay-off-home-loan/cost-refinance-home-loan", note: "Read 30 September 2026. Some lenders include the valuation in the application fee or cover it." },
  { label: "Westpac: What's the cost of refinancing your home loan?", href: "https://www.westpac.com.au/personal-banking/home-loans/refinance/refinance-costs/", note: "Read 30 September 2026. A new lender may need a valuation; the cost varies." },
  { label: "CommBank: Property Insights", href: "https://www.commbank.com.au/retail/netbank/home-buying/tools/property-insights", note: "Read 30 September 2026. Estimate from Cotality data; \"the estimate is not a valuation\"." },
  { label: "ANZ: Property Profile Reports", href: "https://www.anz.com.au/personal/home-loans/calculators-tools/property-profile-reports/", note: "Read 30 September 2026. Free report; PropTrack price range estimate; \"NOT a valuation\"." },
  { label: "NSW Government: Land values in NSW", href: "https://www.nsw.gov.au/housing-and-construction/land-values-nsw", note: "Land values published November 2025, as at 1 July 2025. Land value is the value of the land only." },
  { label: "Your Property Guide: methodology and data sources", href: "/methodology", note: "The state sales feeds behind every suburb median on this site, and the rule that withholds one." },
];

// People Also Ask on the "property valuation", "free property valuation",
// "property appraisal" and "how much is my house worth" SERPs (baseline
// docs/seo-baselines/2026-09-30/serp-summary.csv). Each answer carries a
// figure and a source where one exists; mirrored into FAQPage JSON-LD.
const FAQS: { question: string; answer: string }[] = [
  {
    question: "Can I get a free CoreLogic property value report?",
    answer:
      "Yes, through a bank rather than from CoreLogic itself. CoreLogic now trades as Cotality, and CommBank's Property Insights tool uses Cotality data to give customers who log in to NetBank a property estimate; CommBank's page states that the estimate is not a valuation. ANZ's free Property Profile Report uses PropTrack price ranges instead and says the same. Both are automated estimates built from recorded sales, not an inspection of your home (pages read 30 September 2026).",
  },
  {
    question: "What is the most accurate website for property value?",
    answer:
      "No website gives you a valuation, and the banks that publish estimates say so on the page: CommBank calls its Cotality-powered figure \"not a valuation\" and ANZ says its PropTrack range is \"NOT a valuation\" (read 30 September 2026). The estimates are built from recorded sales and property attributes, so they are closest on a standard home in a suburb with many sales and widest on anything unusual, and each site runs its own model, so two sites can give different figures for the same address. For a figure you can act on, get two or three agent appraisals; for a figure a lender or a court will accept, pay for a valuation.",
  },
  {
    question: "How much do property valuations charge?",
    answer:
      "A valuation by a licensed valuer typically costs $300 to $600, depending on your location, the size of the property and other factors (Aussie, 31 January 2025; ANZ, read 30 September 2026). When a lender orders the valuation for a home loan or a refinance the cost varies: some lenders include it in the application fee and some cover it themselves (NAB and Westpac refinancing pages, read 30 September 2026). An agent's appraisal is free.",
  },
  {
    question: "How do I check what my property is worth?",
    answer:
      "Start with the published median for your suburb and dwelling type: the range tool on this page shows it with its source and period wherever a state sales feed publishes one, with 15% either side as a band. Then look up sold prices, not asking prices, for homes like yours from the last 90 days, and ask two or three agents who sell in your suburb for a free appraisal backed by those comparable sales. If a lender, a court or the tax office needs the figure, order a valuation from a licensed valuer, which costs $300 to $600 (Aussie, January 2025).",
  },
  {
    question: "Will a lender accept an agent's appraisal instead of a valuation?",
    answer:
      "No. ANZ's guide puts it plainly: an appraisal has no legal standing and cannot be used for your home loan application (read 30 September 2026). When you buy, refinance or draw on equity, the lender arranges its own valuation, and the valuer may need to inspect inside or may value the property from the street (NAB, read 30 September 2026). The lender's figure exists to protect the lender, so it usually sits below an agent's appraisal.",
  },
  {
    question: "Is the land value on my rates notice a valuation of my property?",
    answer:
      "No. In New South Wales the Valuer General issues a land value each year as at 1 July; the latest, published in November 2025, is as at 1 July 2025. The NSW Government's page states that land value is the value of the land only and does not include the value of a home or other structures. It is used for land tax and council rates. A market valuation of the property includes the house, so the two figures are not comparable, and the same distinction applies to the statutory values the other states issue.",
  },
];

const THREE_NUMBERS: { row: string; appraisal: string; valuation: string; estimate: string }[] = [
  { row: "Who produces it", appraisal: "A licensed real estate agent who sells in your suburb", valuation: "A qualified, licensed valuer (Aussie, January 2025)", estimate: "An automated valuation model run by a data company such as Cotality or PropTrack, or a portal" },
  { row: "What it costs", appraisal: "Free", valuation: "$300 to $600 (Aussie, January 2025; ANZ)", estimate: "Free, usually behind a login" },
  { row: "What it is for", appraisal: "Deciding whether and when to sell, and at what price", valuation: "Home loans, refinancing and equity release, family law settlements, deceased estates and disputes (Aussie)", estimate: "A first look before you talk to anyone" },
  { row: "How it is made", appraisal: "An inspection plus recent comparable sales", valuation: "An inspection, inside or from the street, plus sales evidence, written to a professional standard", estimate: "Statistics over recorded sales and property attributes; nobody inspects the home" },
  { row: "Legal standing", appraisal: "None: \"cannot be used for your home loan application\" (ANZ)", valuation: "Accepted by lenders and courts", estimate: "None: \"not a valuation\" (CommBank, ANZ)" },
  { row: "Where it tends to sit", appraisal: "The market-facing figure, usually given as a range", valuation: "Conservative, because it protects the lender", estimate: "Wide, and different sites disagree" },
];

const WEBPAGE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}${PATH}#webpage`,
  url: `${SITE_URL}${PATH}`,
  name: HEADLINE,
  description: DESCRIPTION,
  inLanguage: "en-AU",
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  isPartOf: { "@type": "WebSite", url: SITE_URL, name: SITE_NAME },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}#organization`, name: SITE_NAME, url: SITE_URL },
  about: [
    { "@type": "Thing", name: "Property valuation" },
    { "@type": "Thing", name: "Property appraisal" },
    { "@type": "Thing", name: "Automated valuation model" },
  ],
  isAccessibleForFree: true,
};

const linkClass = "text-ink hover:text-primary underline underline-offset-4 decoration-line-strong";

export default function PropertyValuationPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Property valuation", url: PATH }]} />
      <JsonLd data={WEBPAGE_JSON_LD} />
      <FAQPageJsonLd faqs={FAQS} />

      <section className="bg-surface-warm border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Property valuation" }]} />
          </div>
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-display italic text-primary text-base sm:text-lg leading-none">Three numbers, one house</span>
                <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
                <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">Property valuation</span>
              </div>
              <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl mb-6 font-medium">
                Property valuation in Australia:{" "}
                <span className="italic font-light text-primary">appraisal vs valuation vs online estimate</span> (2026)
              </h1>
              <div className="space-y-4 font-sans text-base sm:text-lg text-ink-muted leading-[1.7] max-w-2xl">
                <p>
                  Ask what a property is worth in Australia and you get three different numbers. A real estate
                  agent&rsquo;s appraisal is free and tells you what a buyer would probably pay now. A valuation is a
                  paid report from a licensed valuer, the only one of the three that a lender, a court or the tax office
                  will accept, and it typically costs $300 to $600 (Aussie, 31 January 2025; ANZ, read 30 September
                  2026). An online estimate is a model&rsquo;s figure from recorded sales, and every bank that publishes
                  one says on the page that it is not a valuation.
                </p>
                <p>
                  This page sets the three side by side, gives the sourced cost of a valuation and the moments a lender
                  insists on one, and shows what homes like yours sell for in your suburb from the published median,
                  before an agent puts a figure on yours.
                </p>
              </div>
              <ul className="mt-6 flex flex-col gap-2.5 font-sans text-sm text-ink-muted">
                {[
                  "Every figure carries its source and date",
                  "The suburb range comes from the state sales feeds, never a model of your home",
                  "The appraisal is free, from one local agent where we have one in your area, with no commitment to list",
                ].map((p) => (
                  <li key={p} className="inline-flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-cta shrink-0" aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-5">
              <SuburbValueRange after="link" appraisalHref="#appraisal-form" headingLevel="h2" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-raised border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 space-y-14">
          <div>
            <p className="font-display italic text-primary text-base mb-3 leading-none">Side by side</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-5">
              The three numbers and why they differ
            </h2>
            <p className="font-sans text-base sm:text-lg text-ink-muted leading-[1.7] max-w-3xl mb-6">
              The word &ldquo;valuation&rdquo; gets used for all three, which is where most of the confusion starts. They
              are made by different people, for different readers, from different evidence, and each is right for its
              own job.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[640px] font-sans text-sm text-left border-collapse">
                <thead className="bg-surface-warm">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium text-ink-subtle uppercase tracking-wider text-[11px]"><span className="sr-only">Aspect</span></th>
                    <th scope="col" className="px-4 py-3 font-display text-base text-ink">Agent appraisal</th>
                    <th scope="col" className="px-4 py-3 font-display text-base text-ink">Licensed valuation</th>
                    <th scope="col" className="px-4 py-3 font-display text-base text-ink">Online estimate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {THREE_NUMBERS.map((r) => (
                    <tr key={r.row} className="align-top">
                      <th scope="row" className="px-4 py-3 font-medium text-ink whitespace-nowrap">{r.row}</th>
                      <td className="px-4 py-3 text-ink-muted leading-relaxed">{r.appraisal}</td>
                      <td className="px-4 py-3 text-ink-muted leading-relaxed">{r.valuation}</td>
                      <td className="px-4 py-3 text-ink-muted leading-relaxed">{r.estimate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 space-y-4 font-sans text-base text-ink-muted leading-[1.7] max-w-3xl">
              <p>
                The gap between the three is built in. The appraisal looks forward to a campaign that has not happened
                yet, so a good agent prices to the market and a poor one prices to win your listing. The valuation looks
                back to what the property would fetch if the lender had to sell it, so it is conservative on purpose;
                NAB&rsquo;s own guide says the market value &ldquo;is just a guide of what your property may be
                worth&rdquo;. The online estimate has never been inside the house, so it fills every gap with the
                average for the street.
              </p>
              <p>
                As an illustration, a home might appraise at $880,000, value at $820,000 for the bank and show $910,000
                on a portal, and none of those would be wrong. When you are selling, the appraisal is the figure that matters. When someone else
                needs to rely on the number, it is the valuation.
              </p>
            </div>
          </div>

          <div id="valuation-cost" className="scroll-mt-24">
            <p className="font-display italic text-primary text-base mb-3 leading-none">The paid one</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-5">
              What a formal valuation costs, and when a lender needs one
            </h2>
            <div className="grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 space-y-4 font-sans text-base text-ink-muted leading-[1.7]">
                <p>
                  A valuation can only be carried out by a qualified valuer, and it typically costs between $300 and $600
                  depending on your location, the size of the property and other factors. That figure comes from
                  Aussie&rsquo;s guide of 31 January 2025 and is repeated in ANZ&rsquo;s valuation guide as read on 30
                  September 2026. Because the price turns on the location and the size of the property, ask for a quote
                  before you book.
                </p>
                <p>
                  You need one when someone other than you has to rely on the figure. Aussie lists the common cases:
                  a property settlement, a home loan including a refinance or an equity loan, working out your equity,
                  proving the value of a deceased estate, and resolving a dispute. A tax matter can call for one too,
                  such as the market value of a home on the day it was first rented out, which sets the cost base
                  for capital gains tax later; our{" "}
                  <Link href="/guides/selling-a-house-with-tenants" className={linkClass}>guide to selling with tenants</Link>{" "}
                  covers that rule.
                </p>
                <p>
                  A lender orders its own valuation when you buy, refinance or draw on the equity in your property
                  (NAB, read 30 September 2026). You do not choose the valuer. The valuer may need to get inside or may
                  value the property from the street and compare it with recent sales (NAB, Westpac). Whether you pay
                  is the lender&rsquo;s call: the cost varies, some lenders include it in the application fee and some
                  cover it themselves (NAB and Westpac refinancing pages, read 30 September 2026). What you cannot do
                  is hand the bank an agent&rsquo;s appraisal instead; ANZ&rsquo;s guide states that an appraisal has no
                  legal standing and cannot be used for your home loan application.
                </p>
                <p>
                  One more figure is often mistaken for a valuation: the land value on a rates or land tax notice. In
                  New South Wales the Valuer General issues it each year as at 1 July (the latest, published November
                  2025, is as at 1 July 2025), and the NSW Government&rsquo;s page says it is the value of the land only
                  and does not include the value of a home or other structures. It is a statutory figure for land tax
                  and council rates, not what the property would sell for.
                </p>
              </div>
              <aside className="lg:col-span-5">
                <div className="rounded-2xl border border-line bg-surface-warm p-6">
                  <p className="text-xs font-sans uppercase tracking-[0.22em] text-ink-subtle mb-3">At a glance</p>
                  <dl className="space-y-4 font-sans text-sm">
                    <div>
                      <dt className="font-medium text-ink">Cost of a licensed valuation</dt>
                      <dd className="text-ink-muted">$300 to $600, by location and property size. Aussie, 31 January 2025; ANZ, read 30 September 2026.</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-ink">When a lender orders one</dt>
                      <dd className="text-ink-muted">Buying, refinancing or accessing equity. The lender picks the valuer; inside or from the street. NAB, Westpac, read 30 September 2026.</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-ink">Who pays on a loan</dt>
                      <dd className="text-ink-muted">Varies: some lenders include it in the application fee, some cover it. NAB and Westpac refinancing pages.</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-ink">An appraisal in its place</dt>
                      <dd className="text-ink-muted">Not accepted: &ldquo;cannot be used for your home loan application&rdquo;. ANZ.</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-ink">Land value on the rates notice</dt>
                      <dd className="text-ink-muted">Land only, no house. NSW Government, land values as at 1 July 2025.</dd>
                    </div>
                  </dl>
                </div>
              </aside>
            </div>
          </div>

          <div id="online-estimates" className="scroll-mt-24">
            <p className="font-display italic text-primary text-base mb-3 leading-none">The instant one</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-5">
              How automated estimates work, and where they miss
            </h2>
            <div className="space-y-4 font-sans text-base text-ink-muted leading-[1.7] max-w-3xl">
              <p>
                The instant figures on the portals and the banks&rsquo; free property reports come from automated
                valuation models. A model takes every recorded sale it can see, the attributes on file for each
                property (bedrooms, land size, year built, last sale price) and the movement of the local market, and
                works out where a property with your attributes would sit. CommBank&rsquo;s Property Insights draws on
                Cotality data and says its estimates &ldquo;do not include property inspections&rdquo; and may miss
                recent changes to the property. ANZ&rsquo;s free Property Profile Report uses PropTrack price ranges
                and says a price range estimate &ldquo;is an estimate only&rdquo; and not a valuation (both read 30
                September 2026).
              </p>
              <p>They miss for four reasons, and the banks&rsquo; own disclaimers name most of them:</p>
              <ul className="space-y-2.5">
                {[
                  "The model has never been inside. A renovated kitchen, a poor floor plan, a district view and a main road are invisible to it, so it prices the average home on your street.",
                  "Thin data breaks it. In a suburb with few recent sales, or for an unusual property, the model has little to compare against and the range widens.",
                  "It lags. Sales take weeks to settle and be recorded, so in a fast market the estimate reads last quarter.",
                  "Different models disagree. Each site runs its own model on its own data, so two estimates for the same address rarely match.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-cta" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                The range on this page is different in kind, and it is worth being clear about how. It is not a model
                of your property. It is the suburb&rsquo;s published median for houses or units, taken from the state
                sales feed with its source and period printed beside it, and a band of 15% either side. An ABS figure
                covers the statistical area that carries the suburb&rsquo;s name and is labelled that way. Where a feed
                publishes no median for a suburb, or the median rests on fewer than five recorded sales, the block says
                so and shows nothing. The{" "}
                <Link href="/methodology" className={linkClass}>methodology page</Link> lists the feeds.
              </p>
            </div>
          </div>

          <div id="how-to-check" className="scroll-mt-24">
            <p className="font-display italic text-primary text-base mb-3 leading-none">In order</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-5">
              How to check what your property is worth
            </h2>
            <ol className="space-y-3 font-sans text-base text-ink-muted leading-relaxed list-decimal pl-5 max-w-3xl">
              <li>Pick your suburb and dwelling type in the range block above for the published median and its band. That is the suburb, not your home; it anchors everything that follows.</li>
              <li>Look up sold prices, not asking prices, for homes like yours from the last 90 days: similar bedrooms, land and condition. Our <Link href="/sold" className={linkClass}>sold listings</Link> and the suburb pages are a start.</li>
              <li>Get two or three free appraisals from agents who actually sell in your suburb, and ask each for the comparable sales behind the figure. When they cluster, that is your range; when one sits far above the rest, treat it as a pitch.</li>
              <li>If a lender, a court or the tax office needs the number, book a licensed valuer. Expect $300 to $600 (Aussie, January 2025) and a written report you can hand over.</li>
              <li>Before you list, run the figure through the <Link href="/selling-costs-calculator" className={linkClass}>selling costs calculator</Link> so you know what you keep, then read <Link href="/guides/how-to-choose-a-selling-agent" className={linkClass}>how to choose a selling agent</Link>.</li>
            </ol>
          </div>
        </div>
      </section>

      <section id="appraisal-form" className="scroll-mt-24 bg-surface-warm border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6">
              <p className="font-display italic text-primary text-base mb-3 leading-none">The free one</p>
              <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-5">
                Get a free appraisal from a local agent
              </h2>
              <div className="space-y-4 font-sans text-base text-ink-muted leading-[1.7] max-w-xl">
                <p>
                  An appraisal is the number that matters when you are deciding whether to sell, because it comes from
                  someone who watches buyers in your street every week and can show you the sales behind it. Tell us
                  where the property is: where we have an agent who sells there, we introduce one, who inspects and
                  gives you a figure or a range; where we do not yet have one, we tell you. There is no commitment to
                  list, with them or with anyone.
                </p>
                <p>
                  Not ready for an agent yet? Read{" "}
                  <Link href="/guides/how-much-is-my-house-worth-australia" className={linkClass}>how much is my house worth</Link>{" "}
                  for what drives the number, or the{" "}
                  <Link href="/appraisal" className={linkClass}>appraisal page</Link> for what to have ready.
                </p>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-line bg-surface-raised shadow-card p-6 sm:p-8">
                <p className="text-xs font-sans uppercase tracking-[0.22em] text-ink-subtle mb-2">Tell us about the property</p>
                <h3 className="font-display text-ink leading-tight tracking-tight text-xl sm:text-2xl mb-5">
                  Two minutes, then we take it from there.
                </h3>
                <Suspense fallback={<div className="h-96" aria-busy="true" />}>
                  <AppraisalForm />
                </Suspense>
                <p className="mt-4 font-sans text-xs text-ink-subtle leading-relaxed">{COVERAGE_CAVEAT}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-raised border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-6">
            Property valuation questions
          </h2>
          <dl className="divide-y divide-line border-y border-line">
            {FAQS.map((faq) => (
              <div key={faq.question} className="py-5">
                <dt className="font-display text-lg text-ink leading-snug mb-2">{faq.question}</dt>
                <dd className="font-sans text-base text-ink-muted leading-relaxed max-w-3xl">{faq.answer}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12">
            <h2 className="font-display text-xl text-ink leading-tight tracking-tight mb-4">Sources</h2>
            <ul className="space-y-2 font-sans text-sm text-ink-muted">
              {SOURCES.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className={linkClass} rel={s.href.startsWith("/") ? undefined : "noopener"} target={s.href.startsWith("/") ? undefined : "_blank"}>
                    {s.label}
                  </a>
                  <span className="text-ink-subtle"> {s.note}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-sans text-xs text-ink-subtle leading-relaxed max-w-3xl">
              Published 30 September 2026. Fees and lender policies are the sources&rsquo; figures on the dates given;
              check the current page before you rely on one. Nothing here is financial advice.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
