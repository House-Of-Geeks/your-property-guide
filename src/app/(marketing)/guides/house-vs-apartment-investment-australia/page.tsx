import type { Metadata } from "next";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "House vs Apartment Investment in Australia: Which Builds More Wealth? (2026)",
  description:
    "Houses vs apartments as investments in Australia: capital growth, rental yield, holding costs, and liquidity compared. Worked examples and the case for each.",
  slug: "house-vs-apartment-investment-australia",
  publishedAt: "2026-05-06",
  updatedAt: "2026-05-06",
  readingTimeMinutes: 9,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "investing",
};

export const metadata: Metadata = {
  title: `${FRONTMATTER.title} | ${SITE_NAME}`,
  description: FRONTMATTER.description,
  alternates: { canonical: `${SITE_URL}/guides/${FRONTMATTER.slug}` },
  openGraph: {
    url: `${SITE_URL}/guides/${FRONTMATTER.slug}`,
    title: FRONTMATTER.title,
    description: FRONTMATTER.description,
    type: "article",
    publishedTime: FRONTMATTER.publishedAt,
    modifiedTime: FRONTMATTER.updatedAt,
    images: guideOgImages({
      slug: FRONTMATTER.slug,
      title: FRONTMATTER.title,
      description: FRONTMATTER.description,
      persona: FRONTMATTER.persona,
    }),
  },
};

const TLDR = [
  "Houses tend to deliver stronger long-term capital growth (land appreciates, buildings depreciate) but lower rental yields than apartments.",
  "Apartments typically deliver higher gross yields (4% to 5.5%) compared to houses (2.5% to 4%), but body corporate fees and slower growth eat into the advantage.",
  "Over a 20-year hold, capital city houses have historically out-grown apartments by 1% to 2% annually — that compounds to a meaningful wealth gap.",
  "Apartments win on cash flow (higher yield, lower entry price) and effort (no garden, no roof). Houses win on long-term capital growth and renovation upside.",
  "The right answer depends on your goal: cash flow now (apartment), wealth in 15 to 20 years (house), or somewhere in between (townhouse, dual-key, regional house).",
];

const TOC: GuideTOCEntry[] = [
  { id: "the-question",     label: "Why this is asked so often" },
  { id: "capital-growth",   label: "Capital growth: houses win" },
  { id: "rental-yield",     label: "Rental yield: apartments win" },
  { id: "holding-costs",    label: "Holding costs compared" },
  { id: "worked-example",   label: "20-year worked example" },
  { id: "case-house",       label: "The case for a house" },
  { id: "case-apartment",   label: "The case for an apartment" },
  { id: "middle-ground",    label: "Middle ground options" },
  { id: "next-steps",       label: "Next steps" },
];

const FAQS: FaqItem[] = [
  {
    question: "Do houses always outperform apartments?",
    answer:
      "Not always — apartments in genuinely supply-constrained inner-ring suburbs (think Sydney's Lower North Shore or inner Melbourne) can match house growth. But across broader capital city markets and over 15 to 20 year horizons, separate houses on land have historically delivered 1% to 2% higher annual growth than units.",
  },
  {
    question: "What's the typical rental yield difference?",
    answer:
      "Capital city apartments commonly yield 4% to 5.5% gross. Houses in the same areas typically yield 2.5% to 4%. The yield gap reflects price-to-rent ratios — houses cost more per dollar of rent because the land has speculative value beyond its rental income.",
  },
  {
    question: "Are body corporate fees a deal-breaker on apartments?",
    answer:
      "They're a real cost ($2,500 to $8,000+ per year, more for buildings with pools, lifts, gyms) but they cover building insurance, exterior maintenance, and shared facilities you'd have to fund yourself in a house. Net cash flow on a well-managed building can still be positive. Look at the sinking fund and recent special levies before buying — those tell you the building's true health.",
  },
  {
    question: "What about townhouses?",
    answer:
      "Townhouses are a popular middle ground: ground-floor entry, small garden, modest body corporate, share of land. Growth has been intermediate between houses and apartments in most capital city markets — closer to houses than apartments in Brisbane and Adelaide, closer to apartments in Sydney and Melbourne.",
  },
  {
    question: "Are off-the-plan apartments a good investment?",
    answer:
      "Generally riskier than established stock. The full stamp duty on the building (in some states) can be saved or reduced if bought off-the-plan, but you face development risk, valuation shortfall risk at settlement, and a tendency for new apartment values to fall in the first 2 to 3 years before the broader market catches them up. Established apartments in proven buildings are usually the safer call for first-time investors.",
  },
  {
    question: "Which is easier to manage?",
    answer:
      "Apartments by a wide margin. Building insurance is shared, exterior maintenance is the body corporate's problem, and there's no garden, roof, fence, or pool to look after. For interstate or overseas investors who can't physically check on the property, apartments materially reduce headache.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Negative Gearing Australia", href: "/guides/negative-gearing-australia", description: "How negative gearing works and when each property type benefits more." },
  { title: "Property Depreciation Guide", href: "/guides/property-depreciation-guide", description: "Depreciation deductions are bigger on newer apartments — here's how they work." },
  { title: "Rental Yield Calculator", href: "/rental-yield-calculator", description: "Compare gross and net yield on your shortlisted properties side by side." },
  { title: "Investment Property Guide for the Moreton Bay Corridor", href: "/guides/investment-property-guide-moreton-bay-corridor", description: "A worked-up regional case study — useful pattern for any growth corridor." },
  { title: "SMSF Property Guide", href: "/guides/smsf-property-guide", description: "If you're considering buying inside super, what changes." },
];

export default function HouseVsApartmentInvestmentGuide() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="There's no universal winner">
        <p>
          Over a long enough horizon, separate houses on land usually deliver
          more capital growth. Over a shorter horizon — or if you need positive
          cash flow today — apartments often win. We'll show the trade-off in
          numbers below.
        </p>
      </Callout>

      <h2 id="the-question">Why this is asked so often</h2>
      <p className="lead">
        First-time investors face a choice: stretch into a house in an outer
        suburb on a thin yield, or buy an apartment in a more central location
        with healthier cash flow but slower growth. Both can work. The right
        answer depends on your time horizon, cash flow needs, and tolerance
        for management overhead.
      </p>

      <h2 id="capital-growth">Capital growth: houses win on the long horizon</h2>
      <p>
        The reason is structural: houses include a higher proportion of land
        value, and land appreciates while buildings depreciate. Across capital
        city markets in Australia, houses have historically delivered 1% to 2%
        higher annual capital growth than units over rolling 20-year periods.
      </p>
      <p>
        That gap compounds. A property growing at 6% annually doubles in about
        12 years; one growing at 4% takes about 18 years. Over a 20-year hold,
        the higher-growth property finishes worth roughly 50% more in nominal
        terms.
      </p>

      <KeyFigure
        value="1% to 2%"
        label="Average annual growth gap, capital city houses vs units"
        context="Compounded over 20 years that's a 25% to 50% difference in end value."
      />

      <h2 id="rental-yield">Rental yield: apartments win</h2>
      <p>
        Apartments cost less per dollar of rent. A typical capital city
        apartment yields 4% to 5.5% gross; a comparable house yields 2.5% to
        4%. The reason: a house's price reflects both its rental value and the
        speculative value of the land underneath it.
      </p>
      <p>
        Higher yield doesn't always mean higher net cash flow. Body corporate
        fees, special levies, and lower depreciation deductions can narrow the
        gap. But on a pure income basis, apartments fund more of their own
        holding costs.
      </p>

      <h2 id="holding-costs">Holding costs compared</h2>

      <h3>House</h3>
      <ul>
        <li>Council rates: $1,800 to $4,000+ depending on state and value</li>
        <li>Building insurance: $1,200 to $2,500</li>
        <li>Maintenance allowance: 1% to 1.5% of value annually</li>
        <li>No body corporate fees</li>
        <li>Land tax (state-dependent) hits sooner above the threshold</li>
      </ul>

      <h3>Apartment</h3>
      <ul>
        <li>Council rates: $1,000 to $2,500</li>
        <li>Building insurance: included in body corporate</li>
        <li>Body corporate / strata: $2,500 to $8,000+ per year</li>
        <li>Maintenance allowance inside the unit: 0.5% to 1% of value</li>
        <li>Special levies (irregular but can be $5,000 to $50,000+)</li>
      </ul>

      <h2 id="worked-example">20-year worked example: $700K house vs $550K apartment</h2>
      <p>
        Two starting points, both in a Brisbane outer-middle ring suburb. Same
        deposit, same loan size after relativising for the deposit. We assume
        6% annual growth for the house and 4% for the apartment, with rental
        yields of 3.5% (house) and 5% (apartment).
      </p>

      <h3>House: $700,000 starting value</h3>
      <ul>
        <li>End value at 6% growth over 20 years: $2.24M</li>
        <li>Total nominal growth: $1.54M</li>
        <li>Annual rent (year 1): $24,500</li>
        <li>Annual holding costs: $4,500 (rates + insurance + maintenance)</li>
        <li>Net cash flow before mortgage: $20,000 / year</li>
      </ul>

      <h3>Apartment: $550,000 starting value</h3>
      <ul>
        <li>End value at 4% growth over 20 years: $1.21M</li>
        <li>Total nominal growth: $660K</li>
        <li>Annual rent (year 1): $27,500</li>
        <li>Annual holding costs: $7,500 (rates + body corporate)</li>
        <li>Net cash flow before mortgage: $20,000 / year</li>
      </ul>

      <p>
        Net cash flow is similar in year one. By year 20, the house is worth
        $1M more than the apartment despite costing $150K more to buy
        originally. That's the compounding gap in action.
      </p>

      <Callout variant="warning" title="The model has limits">
        <p>
          These are illustrative rates of growth, not guarantees. The 6%
          assumption isn't universal — apartments in genuinely supply-constrained
          areas can match or beat houses, and houses in oversupplied outer
          estates can underperform apartments. Use suburb-level data on{" "}
          <a href="/best-suburbs/highest-growth">our growth rankings</a> rather
          than national averages.
        </p>
      </Callout>

      <h2 id="case-house">The case for a house</h2>
      <ul>
        <li>Higher long-term capital growth (the wealth-building case)</li>
        <li>Renovation upside — you can add value through extensions, kitchen, bathroom</li>
        <li>Subdivision or granny flat potential on larger blocks</li>
        <li>No body corporate, no surprise levies</li>
        <li>Easier to attract long-term family tenants</li>
      </ul>

      <h2 id="case-apartment">The case for an apartment</h2>
      <ul>
        <li>Higher rental yield, easier to be cash-flow positive earlier</li>
        <li>Lower entry price — often $200K to $400K cheaper than a comparable house</li>
        <li>Building insurance and external maintenance shared</li>
        <li>Easier to manage (especially interstate or overseas investors)</li>
        <li>Better access to inner-ring suburbs with strong rental demand</li>
      </ul>

      <h2 id="middle-ground">Middle ground options</h2>
      <ul>
        <li><strong>Townhouses:</strong> Mix of land share, modest body corporate, owner-occupier appeal.</li>
        <li><strong>Dual-key apartments:</strong> Two rentable units in one title, often higher gross yield.</li>
        <li><strong>Regional houses:</strong> Lower entry price + higher yield than capital city houses, with growth potential in genuine population-growth corridors.</li>
        <li><strong>Granny-flat-capable houses:</strong> Add a second income stream after settlement. See our{" "}
          <a href="/guides/granny-flat-guide-qld">granny flat guides</a>.</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>
      <ol>
        <li>
          Decide your priority: cash flow now, wealth in 20 years, or balance.
          That sets the property type.
        </li>
        <li>
          Use the{" "}
          <a href="/rental-yield-calculator">Rental Yield Calculator</a> on
          three or four candidates side by side.
        </li>
        <li>
          Pull comparable sales for the suburb on{" "}
          <a href="/sold">recently sold</a> to ground-truth the asking price.
        </li>
        <li>
          Read our{" "}
          <a href="/guides/negative-gearing-australia">negative gearing guide</a>{" "}
          to model the after-tax position correctly.
        </li>
      </ol>
    </GuideArticleLayout>
  );
}
