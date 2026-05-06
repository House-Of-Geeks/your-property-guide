import type { Metadata } from "next";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  GuideNewsletterCallout,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Sydney vs Melbourne Property Market: Which Should You Buy In? (2026)",
  description:
    "Sydney vs Melbourne in 2026: median prices, capital growth, rental yields, affordability, and lifestyle compared. The honest case for each market and who each suits.",
  slug: "sydney-vs-melbourne-property-market",
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
  "Sydney's median house price sits around $1.6M to $1.7M, roughly 50% higher than Melbourne's $1.0M to $1.1M.",
  "Melbourne offers stronger gross rental yields (3.5% to 4.2%) than Sydney (2.5% to 3.2%) — meaningful for cash-flow-focused investors.",
  "Long-run capital growth has been similar (5% to 6% annual nominal), but Sydney has had sharper cyclical peaks and Melbourne deeper troughs.",
  "Affordability heavily favours Melbourne: same income borrows about 50% more property, and stamp duty thresholds are kinder for first home buyers.",
  "Both cities still offer pockets of value — outer Sydney corridors, Melbourne's western and northern growth areas, regional fringes accessible by V/Line or NSW TrainLink.",
];

const TOC: GuideTOCEntry[] = [
  { id: "headline-numbers",  label: "The headline numbers" },
  { id: "capital-growth",    label: "Capital growth history" },
  { id: "rental-yield",      label: "Rental yield &amp; cash flow" },
  { id: "affordability",     label: "Affordability &amp; stamp duty" },
  { id: "supply",            label: "Supply &amp; population" },
  { id: "lifestyle",         label: "Lifestyle &amp; tenant demand" },
  { id: "case-sydney",       label: "When Sydney makes more sense" },
  { id: "case-melbourne",    label: "When Melbourne makes more sense" },
  { id: "next-steps",        label: "Next steps" },
];

const FAQS: FaqItem[] = [
  {
    question: "Is Sydney property always more expensive than Melbourne?",
    answer:
      "Yes, on a like-for-like basis at the median level. Sydney's median house price has been 35% to 60% above Melbourne's for most of the last decade. The gap narrows for apartments (closer to 25% to 35%) and for outer suburbs.",
  },
  {
    question: "Does Sydney or Melbourne grow faster?",
    answer:
      "Over rolling 20-year periods, the two markets have delivered similar nominal growth (5% to 6% annual). Sydney has had sharper cyclical peaks; Melbourne has had deeper cyclical troughs. Picking either as a long-term outperformer is hard to support from the data.",
  },
  {
    question: "Where are rental yields higher?",
    answer:
      "Melbourne, comfortably. Same property type and same outer-middle ring suburb typically yields 0.7% to 1.2% higher gross in Melbourne than in Sydney — because Melbourne prices have grown less aggressively than rents over the last decade.",
  },
  {
    question: "Which city has better stamp duty for first home buyers?",
    answer:
      "Both have generous schemes, but the structures differ. Victoria offers full stamp duty exemption up to $600K (with concessions to $750K); NSW offers full exemption up to $800K (with concessions to $1M). For a $700K first home, NSW is cheaper. For a $550K first home, both are essentially free.",
  },
  {
    question: "What about Brisbane as an alternative?",
    answer:
      "Brisbane has been the standout performer of the last 5 to 7 years, with capital growth above both Sydney and Melbourne and yields closer to Melbourne's. The trade-off is depth of market — Brisbane's job market and population are smaller, so demand can soften faster in a downturn. We cover this in our Brisbane Property Market 2026 outlook.",
  },
  {
    question: "Are interstate investments worth the hassle?",
    answer:
      "Increasingly common. Property managers, conveyancers, and (increasingly) buyer's agents make remote investing manageable. The risk is paying for a market you don't really understand. Use comparable sales data and read our interstate investing primer before pulling the trigger.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Sydney Property Market 2026", href: "/blog/sydney-property-market-2026", description: "Detailed outlook, suburb hotspots, and the macro picture for Sydney." },
  { title: "Melbourne Property Market 2026", href: "/blog/melbourne-property-market-2026", description: "Same treatment for Melbourne — affordability, growth pockets, what to watch." },
  { title: "Brisbane Property Market 2026", href: "/blog/brisbane-property-market-2026", description: "The leading capital city for growth in recent years." },
  { title: "How to Buy Property Interstate", href: "/blog/how-to-buy-property-interstate-australia-2026", description: "Practical workflow for buying outside your home state." },
  { title: "Rentvesting Guide", href: "/blog/rentvesting-australia-state-by-state-guide-2026", description: "Rent where you live, invest where the numbers work — by state." },
];

export default function SydneyVsMelbourneGuide() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="Comparing markets, not picking a winner">
        <p>
          Both cities have produced wealth for property owners over the long
          run. The interesting question isn't which is "better" but which fits
          your strategy — cash flow, capital growth, or affordability.
        </p>
      </Callout>

      <h2 id="headline-numbers">The headline numbers</h2>
      <p className="lead">
        Sydney sits roughly 50% above Melbourne on the median house price. That
        single fact drives most of the strategic differences below: borrowing
        capacity, time-to-deposit, cash flow at year one, and which suburbs
        are accessible to which buyers.
      </p>

      <ul>
        <li><strong>Sydney median house:</strong> $1.6M to $1.7M</li>
        <li><strong>Melbourne median house:</strong> $1.0M to $1.1M</li>
        <li><strong>Sydney median apartment:</strong> $830K to $880K</li>
        <li><strong>Melbourne median apartment:</strong> $620K to $670K</li>
        <li><strong>Sydney gross yield (house):</strong> 2.5% to 3.2%</li>
        <li><strong>Melbourne gross yield (house):</strong> 3.5% to 4.2%</li>
      </ul>

      <KeyFigure
        value="$600K"
        label="Roughly the median house price gap, Sydney vs Melbourne"
        context="That's also the typical outer-middle-ring house price in Adelaide or Hobart."
      />

      <h2 id="capital-growth">Capital growth history</h2>
      <p>
        Both cities have delivered 5% to 6% annual nominal growth on
        established houses over rolling 20-year windows. Sydney has been
        higher beta — bigger peaks (2013 to 2017, 2020 to 2022) and sharper
        corrections. Melbourne has been lower beta with deeper periods of
        flat or declining prices (2018 to 2019, 2022 to 2023).
      </p>
      <p>
        For investors, that volatility difference matters less than people
        think over a 10 to 20 year hold — both markets average out to similar
        end-points. For owner-occupiers planning to upgrade, sequence-of-returns
        risk is real: a Sydney house you bought in 2017 was worth less three
        years later. A Melbourne house bought in the same year was about flat.
      </p>

      <h2 id="rental-yield">Rental yield &amp; cash flow</h2>
      <p>
        Yield is where Melbourne pulls ahead. The same outer-middle-ring
        three-bedroom house typically rents for similar money in dollar terms
        in either city, but Melbourne's lower price pushes the yield higher.
      </p>
      <p>
        For an investor, that 0.7% to 1.2% yield gap means meaningful cash
        flow at year one. On a $1M Melbourne house, a 4% gross yield is
        $40,000 in rent. On a $1.5M Sydney house, a 3% yield is $45,000 — but
        the Sydney loan is 50% larger, so net cash flow can sit $10,000 to
        $20,000 worse despite the higher rent.
      </p>

      <h2 id="affordability">Affordability &amp; stamp duty</h2>

      <h3>Borrowing capacity at the same income</h3>
      <p>
        A couple earning $200,000 combined can comfortably finance roughly
        $900K to $1.0M in Melbourne (a starter house in many suburbs) but
        only $600K to $700K in Sydney (apartment territory or far outer
        suburbs). The same job income unlocks meaningfully more property
        in Melbourne.
      </p>

      <h3>Stamp duty for first home buyers</h3>
      <p>
        Both states offer generous concessions, but the price points differ.
        See our{" "}
        <a href="/blog/first-home-buyer-schemes-by-state-australia-2026">
          state-by-state schemes guide
        </a>{" "}
        for current thresholds. Use the{" "}
        <a href="/stamp-duty-calculator">Stamp Duty Calculator</a> to model
        the exact figure for your scenario.
      </p>

      <h2 id="supply">Supply &amp; population</h2>
      <p>
        Both cities are population-growth machines. Sydney adds about 60,000
        to 80,000 people per year (net of departures); Melbourne adds 80,000
        to 110,000. Net interstate migration has favoured Brisbane and Perth
        over both for the last 4 years.
      </p>
      <p>
        On the supply side, Melbourne builds more dwellings per capita than
        Sydney does, partly because of more available greenfield land in the
        north and west. That extra supply caps growth in some Melbourne
        corridors but also keeps entry prices accessible.
      </p>

      <h2 id="lifestyle">Lifestyle &amp; tenant demand</h2>
      <p>
        For owner-occupiers, this is where personal preference dominates. Both
        cities have world-class education, dining, sport, and beaches/coast.
        Sydney's geography (harbour, beaches, national parks) is more
        constrained — that's both a price-driver and a lifestyle premium.
        Melbourne's grid is flatter and more navigable, with stronger public
        transport in many inner suburbs.
      </p>

      <h2 id="case-sydney">When Sydney makes more sense</h2>
      <ul>
        <li>You want long-term land-banking in a structurally constrained market.</li>
        <li>You're an owner-occupier with strong income and a 15+ year horizon.</li>
        <li>You value harbour, beach, or eastern-suburbs access.</li>
        <li>You're prepared to accept lower yields for the chance of higher peak growth.</li>
      </ul>

      <h2 id="case-melbourne">When Melbourne makes more sense</h2>
      <ul>
        <li>You're an investor focused on near-term cash flow.</li>
        <li>You're a first home buyer at $600K to $900K — Melbourne unlocks a house, Sydney unlocks an apartment.</li>
        <li>You want lower volatility through cycles.</li>
        <li>You value access to AFL, food culture, and a more navigable street grid.</li>
      </ul>

      <GuideNewsletterCallout
        title="Get the next capital city read straight to your inbox"
        subtitle="We'll send a market update each quarter — Sydney, Melbourne, Brisbane and beyond. One email, no spam."
      />

      <h2 id="next-steps">Next steps</h2>
      <ol>
        <li>
          Run your borrowing capacity in both markets via the{" "}
          <a href="/borrowing-power-calculator">Borrowing Power Calculator</a>.
        </li>
        <li>
          Pull comparable sales on three or four target suburbs in each city
          using our{" "}
          <a href="/sold">recently sold</a> data.
        </li>
        <li>
          Cross-reference yield with our{" "}
          <a href="/best-suburbs/best-rental-yield">best rental yield rankings</a>.
        </li>
        <li>
          If you're considering Brisbane as a third option, read our{" "}
          <a href="/blog/brisbane-property-market-2026">Brisbane 2026 outlook</a>.
        </li>
      </ol>
    </GuideArticleLayout>
  );
}
