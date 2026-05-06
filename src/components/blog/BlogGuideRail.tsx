import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

interface RailGuide {
  href: string;
  title: string;
  description: string;
}

// Hand-mapped recommendations. Each blog post slug maps to 2-3 guides that are
// the natural deeper read for that topic. Adding more entries here is the
// fastest way to increase internal-link density across blog content.
//
// Fallbacks are picked by tag categories at the bottom of this file.
const RAIL_BY_BLOG_SLUG: Record<string, RailGuide[]> = {
  // First-home / SEQ blog cluster
  "first-home-buyer-guide-moreton-bay-2025": [
    { href: "/guides/first-home-buyer-qld",                  title: "First Home Buyer Guide, QLD",       description: "$30K FHOG, transfer-duty concession, REIQ contract." },
    { href: "/guides/how-much-deposit-to-buy-a-house",       title: "How much deposit do you need?",     description: "5%, 10%, 20% — what each tier unlocks, plus FHSS." },
    { href: "/guides/first-home-buyer-mistakes-to-avoid",    title: "10 first home buyer mistakes",      description: "The expensive errors, ranked, with the fix for each." },
  ],
  "stamp-duty-queensland-what-you-need-to-know": [
    { href: "/stamp-duty-calculator",                        title: "Stamp Duty Calculator",             description: "Estimate your liability across all Australian states." },
    { href: "/guides/how-much-deposit-to-buy-a-house",       title: "How much deposit do you need?",     description: "Total cash to settle including stamp duty, conveyancing, fees." },
    { href: "/guides/buying-property-australia",             title: "How to buy property in Australia",  description: "End-to-end step-by-step from deposit to settlement." },
  ],
  "house-and-land-packages-are-they-worth-it": [
    { href: "/guides/buying-property-australia",             title: "Buying property in Australia",      description: "End-to-end buyer's playbook." },
    { href: "/guides/conveyancing-guide",                    title: "Conveyancing in Australia",         description: "What conveyancers do for new builds and contract review." },
    { href: "/guides/how-much-deposit-to-buy-a-house",       title: "How much deposit do you need?",     description: "House-and-land tends to need different deposit timing." },
  ],
  "selling-your-home-tips-for-maximum-value": [
    { href: "/guides/how-to-choose-a-selling-agent",         title: "How to choose a selling agent",     description: "Interview process, the appraisal-price trap, and the listing agreement." },
    { href: "/guides/real-estate-agent-fees-australia",      title: "Real estate agent fees",            description: "Commission rates by state and what's negotiable." },
    { href: "/guides/sell-first-or-buy-first",               title: "Sell first or buy first?",          description: "Decision tree if you're upgrading or downsizing." },
  ],
  "understanding-off-market-properties": [
    { href: "/guides/buyers-agent-cost-australia",           title: "Buyer's agent cost in Australia",   description: "Off-market access is part of what a buyer's agent buys you." },
    { href: "/off-market",                                   title: "Off-market listings",               description: "Browse properties before they hit Domain or REA." },
    { href: "/guides/buying-property-australia",             title: "Buying property in Australia",      description: "End-to-end buyer's playbook." },
  ],
  "investment-property-guide-moreton-bay-corridor": [
    { href: "/guides/house-vs-apartment-investment-australia", title: "House vs apartment investment",   description: "Capital growth vs cash flow with a 20-year worked example." },
    { href: "/guides/negative-gearing-australia",            title: "Negative gearing in Australia",     description: "How it works and whether it fits your strategy." },
    { href: "/guides/property-management-fees-australia",    title: "Property management fees",          description: "All-in cost most quotes hide." },
  ],
  "top-5-suburbs-families-moreton-bay": [
    { href: "/guides/best-brisbane-suburbs-for-families-2026", title: "Best Brisbane suburbs for families", description: "Inner / middle / outer ring family picks." },
    { href: "/best-suburbs/for-families",                    title: "Best for families ranking",         description: "Schools, parks, walkability, scored across Australia." },
    { href: "/find-your-suburb",                             title: "Find your suburb (4-question quiz)", description: "Get six suburbs scored against your priorities." },
  ],
  "moreton-bay-property-market-update-q1-2025": [
    { href: "/blog/brisbane-property-market-2026",           title: "Brisbane property market 2026",     description: "The macro outlook for SEQ in the year ahead." },
    { href: "/market-reports/qld",                           title: "Queensland market report",          description: "Median prices, growth, and suburb rankings." },
    { href: "/guides/best-time-to-buy-property-australia",   title: "Best time to buy in Australia",     description: "Seasonal patterns and the rate cycle." },
  ],

  // Capital city / state market posts
  "sydney-property-market-2026": [
    { href: "/guides/sydney-vs-melbourne-property-market",   title: "Sydney vs Melbourne",                description: "Side-by-side strategy comparison." },
    { href: "/market-reports/nsw",                           title: "NSW market report",                  description: "Median prices, growth, suburb rankings." },
    { href: "/guides/buyers-agent-cost-australia",           title: "Buyer's agent cost",                description: "Sydney's tight market often warrants one." },
  ],
  "melbourne-property-market-2026": [
    { href: "/guides/sydney-vs-melbourne-property-market",   title: "Sydney vs Melbourne",                description: "Side-by-side strategy comparison." },
    { href: "/market-reports/vic",                           title: "Victoria market report",             description: "Median prices, growth, suburb rankings." },
    { href: "/guides/best-time-to-buy-property-australia",   title: "Best time to buy",                  description: "Seasonal patterns relevant to Melbourne." },
  ],
  "brisbane-property-market-2026": [
    { href: "/guides/best-brisbane-suburbs-for-families-2026", title: "Best Brisbane family suburbs",     description: "Inner / middle / outer ring picks." },
    { href: "/market-reports/qld",                           title: "QLD market report",                  description: "Median prices, growth, suburb rankings." },
    { href: "/guides/house-vs-apartment-investment-australia", title: "House vs apartment investment",   description: "Brisbane has been the standout for both." },
  ],
  "perth-property-market-2026": [
    { href: "/guides/first-home-buyer-wa",                   title: "First home buyer guide, WA",         description: "FHOG, stamp duty, Keystart loans." },
    { href: "/market-reports/wa",                            title: "WA market report",                   description: "Median prices, growth, suburb rankings." },
    { href: "/guides/best-time-to-buy-property-australia",   title: "Best time to buy",                   description: "Perth's seasonality is mild but matters." },
  ],
  "adelaide-property-market-2026": [
    { href: "/guides/first-home-buyer-sa",                   title: "First home buyer guide, SA",         description: "$15K FHOG, HomeSeeker shared equity." },
    { href: "/market-reports/sa",                            title: "SA market report",                   description: "Median prices, growth, suburb rankings." },
    { href: "/guides/best-time-to-buy-property-australia",   title: "Best time to buy",                   description: "Seasonal patterns and the rate cycle." },
  ],
  "hobart-tasmania-property-market-2026": [
    { href: "/guides/first-home-buyer-tas",                  title: "First home buyer guide, TAS",        description: "$30K FHOG and stamp duty concession." },
    { href: "/market-reports/tas",                           title: "Tasmania market report",             description: "Median prices, growth, suburb rankings." },
    { href: "/guides/best-time-to-buy-property-australia",   title: "Best time to buy",                   description: "Hobart's seasonality is more pronounced." },
  ],
  "canberra-act-property-market-2026": [
    { href: "/guides/first-home-buyer-act",                  title: "First home buyer guide, ACT",        description: "Full stamp duty waiver via HBCS." },
    { href: "/market-reports/act",                           title: "ACT market report",                  description: "Median prices, growth, suburb rankings." },
  ],
  "darwin-nt-property-market-2026": [
    { href: "/guides/first-home-buyer-nt",                   title: "First home buyer guide, NT",         description: "$10K FHOG plus the NT-specific stamp duty discount." },
    { href: "/market-reports/nt",                            title: "NT market report",                   description: "Median prices, growth, suburb rankings." },
  ],

  // Cross-cutting evergreen
  "cheapest-suburbs-buy-house-australia-2026": [
    { href: "/best-suburbs/most-affordable",                 title: "Most affordable suburbs ranking",   description: "Live ranking based on current median prices." },
    { href: "/find-your-suburb",                             title: "Find your suburb (quiz)",            description: "Filter by your budget and priority." },
    { href: "/guides/how-much-deposit-to-buy-a-house",       title: "How much deposit do you need?",     description: "Affordable doesn't mean no deposit needed." },
  ],
  "best-regional-towns-invest-australia-2026": [
    { href: "/guides/house-vs-apartment-investment-australia", title: "House vs apartment investment",   description: "How regional houses compare to capital city units." },
    { href: "/find-your-suburb",                             title: "Find your suburb (quiz)",            description: "Run the matcher with regional priorities." },
    { href: "/regions",                                      title: "Browse Australian regions",          description: "Suburb profiles, region by region." },
  ],
  "rentvesting-australia-state-by-state-guide-2026": [
    { href: "/guides/house-vs-apartment-investment-australia", title: "House vs apartment investment",   description: "The math behind your investment property choice." },
    { href: "/guides/property-management-fees-australia",    title: "Property management fees",          description: "Real numbers for the property manager who'll run your investment." },
    { href: "/rental-yield-calculator",                      title: "Rental yield calculator",            description: "Run the numbers on a candidate investment." },
  ],
  "how-to-buy-property-interstate-australia-2026": [
    { href: "/guides/buyers-agent-cost-australia",           title: "Buyer's agent cost",                description: "When you're buying in a market you don't know." },
    { href: "/guides/buying-property-australia",             title: "Buying property in Australia",      description: "Process is similar across states, the rules differ." },
    { href: "/compare",                                      title: "Compare suburbs",                    description: "Line up two suburbs nationally, side by side." },
  ],
  "australia-fastest-growing-suburbs-2026": [
    { href: "/best-suburbs/highest-growth",                  title: "Highest growth suburbs ranking",    description: "Live ranking based on annual growth." },
    { href: "/guides/house-vs-apartment-investment-australia", title: "House vs apartment investment",   description: "Where growth is happening and what it means for you." },
    { href: "/find-your-suburb",                             title: "Find your suburb (quiz)",            description: "Pick &lsquo;capital growth&rsquo; as your top priority." },
  ],
  "first-home-buyer-schemes-by-state-australia-2026": [
    { href: "/guides/how-much-deposit-to-buy-a-house",       title: "How much deposit do you need?",     description: "Schemes that drop the requirement to 5% or 2%." },
    { href: "/guides/first-home-buyer-mistakes-to-avoid",    title: "10 first home buyer mistakes",      description: "Including the scheme-deadlines mistake." },
    { href: "/guides/first-home-buyer-guide",                title: "National first home buyer guide",    description: "Everything in one place, federal and state." },
  ],
};

// Default fallback — used if the blog slug isn't mapped above. Picks the
// most universally-relevant guides.
const DEFAULT_RAIL: RailGuide[] = [
  { href: "/guides/buying-property-australia",         title: "How to buy property in Australia",   description: "Step-by-step from deposit to settlement." },
  { href: "/guides/how-much-deposit-to-buy-a-house",   title: "How much deposit do you need?",      description: "5%, 10%, 20% — what each tier unlocks." },
  { href: "/find-your-suburb",                         title: "Find your suburb (quiz)",            description: "4 questions, 6 matched suburbs." },
];

interface BlogGuideRailProps {
  blogSlug: string;
}

/**
 * "Read next" rail of guide recommendations rendered after every blog post
 * body. Pairs the casual blog content with the deeper guide content for
 * topical link density and longer session duration.
 */
export function BlogGuideRail({ blogSlug }: BlogGuideRailProps) {
  const guides = RAIL_BY_BLOG_SLUG[blogSlug] ?? DEFAULT_RAIL;
  return (
    <section className="mt-12 rounded-2xl border border-line bg-surface-warm p-6 sm:p-8">
      <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2 inline-flex items-center gap-2">
        <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
        Read next
      </p>
      <h2 className="font-display text-2xl text-ink leading-tight mb-5">
        Go deeper with our <span className="italic text-primary">guides</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {guides.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="group flex flex-col rounded-xl border border-line bg-surface-raised p-5 hover:border-primary/40 hover:shadow-md transition-all"
          >
            <p className="font-display text-base text-ink group-hover:text-primary transition-colors leading-tight mb-2">
              {g.title}
            </p>
            <p
              className="font-sans text-sm text-ink-muted leading-relaxed flex-1"
              dangerouslySetInnerHTML={{ __html: g.description }}
            />
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-sans uppercase tracking-wider text-ink group-hover:text-primary transition-colors">
              Read the guide <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
