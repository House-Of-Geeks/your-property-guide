import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  GuideNewsletterCallout,
  GuideSuburbSearch,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { HG_DATES } from "@/lib/data/home-guarantee";

const FRONTMATTER: GuideFrontmatter = {
  title: "Best Time to Buy Property in Australia: Seasons, Cycles, and Market Signals (2026)",
  description:
    "When is the best time to buy property in Australia? The honest answer covers seasonal patterns (winter softness), the rate cycle, life stage, and why 'time in market' usually beats 'timing the market'.",
  slug: "best-time-to-buy-property-australia",
  publishedAt: "2026-05-06",
  updatedAt: "2026-10-20",
  readingTimeMinutes: 8,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "first-home",
};

export const metadata: Metadata = {
  title: FRONTMATTER.title,
  description: FRONTMATTER.description,
  alternates: { canonical: `${SITE_URL}/guides/${FRONTMATTER.slug}` },
  openGraph: { ...DEFAULT_OG,
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
  "Winter (June–August) is historically the softest selling season in Australia. Less stock, less competition, and motivated sellers can mean better buyer leverage.",
  "Spring (September–November) is the busiest market, more stock to choose from, but also more buyers competing.",
  "Christmas / New Year (mid-December to late January) is a quiet pocket where serious sellers hold deals together with little buyer competition.",
  "Rate cycles matter more than seasons. Cuts increase borrowing capacity (and prices); hikes do the opposite.",
  "For owner-occupiers, the best time is when your finances are ready and you'll hold for at least 5 to 7 years. Trying to time the bottom rarely beats just buying when you can.",
];

const TOC: GuideTOCEntry[] = [
  { id: "the-honest-answer", label: "The honest answer" },
  { id: "by-season",         label: "Seasonal patterns" },
  { id: "by-rate-cycle",     label: "The rate cycle" },
  { id: "by-life-stage",     label: "Your life-stage signals" },
  { id: "auction-vs-private",label: "Auction vs private treaty timing" },
  { id: "city-by-city",      label: "City-by-city seasonality" },
  { id: "myth-buster",       label: "What people get wrong" },
  { id: "next-steps",        label: "Next steps" },
];

const FAQS: FaqItem[] = [
  {
    question: "When is the cheapest time of year to buy property?",
    answer:
      "Mid-winter (June–August) and the Christmas–New Year window (mid-December to late January) are traditionally the quietest periods. Stock is thinner, but so is competition. The rate cycle can outweigh the season: in spring 2026 clearance rates fell rather than rose, to 45.4% across the combined capitals in the week ending 4 October, against 67.4% a year earlier (Cotality).",
  },
  {
    question: "Should I wait for interest rates to fall before buying?",
    answer:
      "Probably not. When rates fall, borrowing capacity rises for every buyer at once, and prices tend to follow, so waiting for a cut can mean competing with more buyers at higher prices. The exception: if you're stretched at current rates, waiting for a cycle of cuts to refinance into may be sensible.",
  },
  {
    question: "Is there a worst time to buy property in Australia?",
    answer:
      "Not really, in terms of price. But buying just before a known rate hike, or buying without pre-approval in a rapidly tightening lending environment, can leave you settling at a higher rate than you modelled. The worst-time risk isn't the season, it's buying without the financing locked in.",
  },
  {
    question: "Does the property market follow election cycles?",
    answer:
      "There's a temporary slowdown in the 4 to 6 weeks before a federal election, especially if a major policy change affecting property (negative gearing, CGT) is on the table. After the election the market typically resumes its prior trajectory within 1 to 2 months.",
  },
  {
    question: "What about end of financial year?",
    answer:
      "EOFY (June 30) is mid-winter, so it overlaps with the softest selling period. Some investors push to settle before EOFY for tax-year reasons, which can mean a small flurry of motivated activity in mid-June. For owner-occupiers, EOFY itself isn't a meaningful signal.",
  },
  {
    question: "Should first home buyers wait for grant rounds?",
    answer:
      `Not for the 5% Deposit Scheme (the Home Guarantee Scheme): since ${HG_DATES.expanded} it has had no limit on places and no waiting list, so there are no rounds to wait for. For state grants and stamp duty concessions, eligibility is usually based on contract date, check your state's rules before delaying.`,
  },
];

const RELATED: RelatedGuide[] = [
  { title: "RBA Cash Rate History", href: "/rba-cash-rate", description: "Track every RBA decision and how rates affect property prices." },
  { title: "How Much Deposit Do You Need?", href: "/guides/how-much-deposit-to-buy-a-house", description: "Get your deposit right before timing matters at all." },
  { title: "Property Auction Guide", href: "/guides/property-auction-guide", description: "Auctions cluster in spring, here's how to navigate them." },
  { title: "Borrowing Power Calculator", href: "/borrowing-power-calculator", description: "Run your numbers at today's rates to see what you can buy now." },
  { title: "Sydney vs Melbourne Property Market", href: "/guides/sydney-vs-melbourne-property-market", description: "City-level differences that interact with seasonality." },
];

export default function BestTimeToBuyGuide() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="Time in market beats timing the market">
        <p>
          Over a 10+ year hold, the entry-month price has almost no impact on
          your outcome. What matters is buying when you can hold long enough to
          ride out cycles. We&rsquo;ll walk through the signals that genuinely
          matter and the ones that look smart but aren&rsquo;t.
        </p>
      </Callout>

      <h2 id="the-honest-answer">The honest answer</h2>
      <p className="lead">
        For most owner-occupiers, the best time to buy is when three things
        line up: deposit is saved, finance is pre-approved, and you can
        commit to holding for at least 5 to 7 years. Trying to wait for a
        market bottom rarely outperforms just buying when those three
        conditions are met.
      </p>
      <p>
        For investors, timing matters slightly more: buying near the start
        of a rate-cutting cycle gives you a tailwind for both price growth
        and refinancing. But even then, the suburb selection and entry price
        matter far more than the month you bought.
      </p>

      <h2 id="by-season">Seasonal patterns across Australia</h2>

      <h3>Winter (June–August)</h3>
      <p>
        Traditionally the quietest selling period, with fewer new listings than
        spring, especially in the colder capitals. The buyers in market are
        often more committed (less &ldquo;just looking&rdquo; foot traffic at
        open homes), and sellers who list in winter are usually motivated.
      </p>
      <p>
        <strong>Buyer advantage:</strong>{" "}Less competition, more leverage on
        well-priced stock that&rsquo;s been sitting.
      </p>
      <p>
        <strong>Buyer disadvantage:</strong> Less stock to choose from. Your
        ideal property may not be on the market.
      </p>

      <h3>Spring (September–November)</h3>
      <p>
        The traditional peak selling season. Sellers list because gardens look
        good and weather aids photography. Stock volumes climb sharply through
        September and October.
      </p>
      <p>
        <strong>Buyer advantage:</strong> The most choice of the year.
      </p>
      <p>
        <strong>Buyer disadvantage:</strong> Usually the most competition,
        though not always: in spring 2026 capital-city homes were taking a
        median of 39 days to sell, up from 23 a year earlier (Cotality, 1
        October 2026), which gives buyers more room to negotiate.
      </p>

      <h3>Summer (December–February)</h3>
      <p>
        Two distinct sub-seasons. Early December and late February are normal
        market activity. Mid-December through late January is a quiet pocket
        where most agents are on holidays. A small but determined seller pool
        runs deals through this window with much less buyer competition.
      </p>
      <p>
        <strong>Buyer advantage in the holiday window:</strong> Very low
        competition, motivated sellers (relocating for work, divorce,
        deceased estates).
      </p>

      <h3>Autumn (March–May)</h3>
      <p>
        A second mini-spring. Stock builds through March and April after the
        post-holiday lull.
      </p>

      <KeyFigure
        value="39 days"
        label="Median time to sell a capital-city home in September 2026, up from 23 days a year earlier"
        context="Cotality, 1 October 2026. A slower market gives buyers more time and more room to negotiate."
      />

      <h2 id="by-rate-cycle">The rate cycle matters more than the season</h2>
      <p>
        Seasons mostly change how much stock is on the market. The rate cycle
        changes what every buyer can borrow, and that moves prices. In October
        2026 the cycle is rising: the Reserve Bank lifted the cash rate to
        4.60% on 29 September, its fourth rise of the year, and Cotality’s
        national home value index fell 1.1% in September, its sixth monthly
        fall in a row. The four conditions to track:
      </p>
      <ul>
        <li><strong>Cutting cycle, early stage:</strong> Often the best time to buy. Borrowing capacity rises before prices fully respond, which can give you a window of relative affordability.</li>
        <li><strong>Cutting cycle, late stage:</strong> Prices have caught up. Still good for owner-occupiers, less of a clear edge for investors.</li>
        <li><strong>Hiking cycle, early stage:</strong> Borrowing capacity tightens but prices haven&rsquo;t fallen yet. The hardest combination; wait if you can.</li>
        <li><strong>Hiking cycle, late stage:</strong> Prices have softened, sellers are motivated. A genuine buyer&rsquo;s market.</li>
      </ul>
      <p>
        Track the RBA&rsquo;s direction on our{" "}
        <a href="/rba-cash-rate">RBA cash rate history</a> page.
      </p>

      <h2 id="by-life-stage">Your life-stage signals</h2>
      <p>
        Outside the macro picture, your own situation usually determines when
        the right time is:
      </p>
      <ul>
        <li><strong>Just settled into a stable job?</strong> Build 3 to 6 months of income proof before applying for finance, lenders want consistency.</li>
        <li><strong>About to start a family?</strong> Buy with the family configuration in mind. Moving with a 6-month-old is a different proposition to moving without kids.</li>
        <li><strong>Considering a job change?</strong> Ask a lender or broker how they treat income on probation before you move: policies differ between lenders.</li>
        <li><strong>Have an inheritance coming?</strong> Don&rsquo;t time around it; the timing is unpredictable. Plan around your current resources and treat it as upside if it lands.</li>
      </ul>

      <h2 id="auction-vs-private">Auction vs private treaty timing</h2>
      <p>
        Auction numbers are seasonal: more homes go to auction in spring and
        far fewer over the Christmas break. Clearance rates follow the market
        more than the calendar, so check the latest weekly result before you
        plan around one: Cotality’s combined capital-city rate was 45.4% in the
        week ending 4 October 2026, against 67.4% a year earlier. Private
        treaty works year-round.
      </p>
      <p>
        If you&rsquo;re bidding at auction:
      </p>
      <ul>
        <li>Late winter / early spring: less competition, but also fewer auction properties on offer</li>
        <li>October / November: peak supply, peak competition</li>
        <li>December / January: rare auctions but motivated sellers when they happen</li>
      </ul>
      <p>
        If you&rsquo;re negotiating private treaty, winter and the
        Christmas–New Year window are when you&rsquo;re most likely to meet a
        motivated seller with less competition from other buyers.
      </p>

      <h2 id="city-by-city">City-by-city seasonality</h2>
      <p>
        Seasonality is most pronounced in cities with cold winters
        (Melbourne, Hobart, Canberra) and least pronounced in cities with
        warm winters (Brisbane, Darwin, Perth). Sydney sits in the middle.
      </p>
      <ul>
        <li><strong>Melbourne, Hobart, Canberra:</strong> Strong winter softness; sellers actively wait for spring.</li>
        <li><strong>Sydney:</strong> Moderate seasonality; the harbour effect keeps demand steadier than southern cities.</li>
        <li><strong>Brisbane, Perth, Darwin:</strong> Mild seasonality; weather isn&rsquo;t a barrier to inspection or photography year-round.</li>
        <li><strong>Adelaide:</strong> Moderate seasonality, similar shape to Melbourne but smaller swings.</li>
      </ul>

      <Callout variant="warning" title="Don't conflate national and local cycles">
        <p>
          National headlines about &ldquo;the property market&rdquo; aren&rsquo;t
          your suburb&rsquo;s market. A capital city growing 8% nationally can
          contain suburbs growing 15% and others falling 2%. Use suburb-level
          data on{" "}
          <Link href="/best-suburbs">our suburb rankings</Link> rather than national
          averages.
        </p>
      </Callout>

      <GuideSuburbSearch
        title="Skip the headlines, look at your suburb"
        subtitle="Pull median, growth, walkability and risk for any suburb you're considering."
      />


      <h2 id="myth-buster">What people get wrong</h2>

      <h3>&ldquo;I&rsquo;ll wait for the bottom&rdquo;</h3>
      <p>
        The bottom is only visible in retrospect. Waiting for it can mean
        buying after prices have already turned, when more buyers are back
        in the market.
      </p>

      <h3>&ldquo;Auctions are always more expensive&rdquo;</h3>
      <p>
        Auction clearance rates and price-to-reserve ratios vary widely
        season to season. A winter auction property that fails to clear can
        be negotiated below the original reserve.
      </p>

      <h3>&ldquo;I&rsquo;ll buy after the next rate cut&rdquo;</h3>
      <p>
        Rate cuts are largely priced in by the time they happen. The bigger
        price impact is the cycle direction, not the individual cut.
      </p>

      <GuideNewsletterCallout
        title="Track the rate cycle and capital city moves"
        subtitle="Occasional market updates with the data signals that matter for timing. No spam."
      />

      <h2 id="next-steps">Next steps</h2>
      <ol>
        <li>
          Run your numbers at <strong>today&rsquo;s</strong> rates using the{" "}
          <a href="/borrowing-power-calculator">Borrowing Power Calculator</a>.
          Don&rsquo;t plan around hypothetical future rates.
        </li>
        <li>
          Get pre-approval. It&rsquo;s usually free, typically lasts about
          three to six months, and shows what a lender is prepared to lend,
          subject to the property. Our{" "}
          <Link href="/guides/home-loan-pre-approval-australia">pre-approval guide</Link>{" "}
          explains the conditions.
        </li>
        <li>
          Track the sale prices on the{" "}
          <Link href="/suburbs">suburb page</Link> you want for 4 to 6 weeks to
          learn what properties actually fetch (vs the asking price).
        </li>
        <li>
          Check the{" "}
          <a href="/rba-cash-rate">RBA cash rate trajectory</a> for the macro
          context.
        </li>
      </ol>

      <Sources items={BEST_TIME_TO_BUY_SOURCES} />
    </GuideArticleLayout>
  );
}

const BEST_TIME_TO_BUY_SOURCES: readonly SourceItem[] = [
  { label: "Cotality (formerly CoreLogic): Australian housing values down for sixth straight month in September", href: "https://www.cotality.com/au/insights/articles/australian-housing-values-down-for-sixth-straight-month-in-september", note: "1 October 2026. National values and capital-city median days on market." },
  { label: "Cotality: Final clearance rates, week ending 4 October 2026", href: "https://www.cotality.com/au/press-releases/final-clearance-rates-week-ending-4-october-2026", note: "8 October 2026. Combined capital-city final clearance rate 45.4%, 67.4% a year earlier." },
  { label: "Reserve Bank of Australia: Cash rate target", href: "https://www.rba.gov.au/statistics/cash-rate/", note: "4.60% from the 29 September 2026 decision. Read 20 October 2026." },
];
