import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  Sources,
  EditorNote,
  PullQuote,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "The Best Time to Sell a House in Australia (2026)",
  description:
    "When to sell a house in Australia: why spring and early autumn draw the most buyers, the case for selling in winter, why your suburb matters more than the month, and how interest rates and preparation beat timing the calendar.",
  slug: "best-time-to-sell-a-house-australia",
  publishedAt: "2026-06-14",
  updatedAt: "2026-06-14",
  readingTimeMinutes: 8,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "selling",
};

export const metadata: Metadata = {
  title: FRONTMATTER.title,
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
  "Spring (September to November) and early autumn (February to March) are the traditional peak selling seasons in Australia, with the most buyers out looking and the most stock on the market.",
  "Summer over the Christmas holidays (late December to January) and the depths of winter are the quietest stretches, fewer buyers, but also fewer competing listings.",
  "More buyers in peak season also means more competing homes, so a busy market is not automatically the best market for your property.",
  "Your suburb matters more than the month. Local days on market and auction clearance rates tell you far more about timing than the season does.",
  "The interest rate cycle moves buyer borrowing power, and that shifts demand more than any season. A rate cut can do more for your sale than waiting for spring.",
  "Getting ready beats getting lucky. Presentation, the right agent and accurate pricing decide your result more than the date you list.",
];

const TOC: GuideTOCEntry[] = [
  { id: "best-time",     label: "When is the best time to sell?" },
  { id: "by-season",     label: "Spring vs autumn vs winter" },
  { id: "your-suburb",   label: "Why your suburb matters more than the month" },
  { id: "rate-cycle",    label: "The interest rate cycle and the market" },
  { id: "getting-ready", label: "Getting ready beats getting lucky" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the best month to sell a house in Australia?",
    answer:
      "There is no single best month that holds everywhere, but the traditional peaks are in spring, roughly September through November, and again in early autumn, February and March. These are the months when the most buyers are actively looking and gardens, light and presentation are at their best in most of the country. The trade-off is that more stock comes to market at the same time, so you have more competition. The quietest months are the Christmas to New Year holiday window and the middle of winter. The right month for your home still depends on your suburb and the state of the local market more than the calendar.",
  },
  {
    question: "Is spring really the best time to sell?",
    answer:
      "Spring earns its reputation because buyer demand is high, the weather suits open homes, and homes present well with gardens in bloom and good natural light. For a lot of sellers it is the strongest season. But spring is also when the most listings hit the market, so your home competes with more stock and buyers have more choice. If your suburb floods with similar properties every spring, a slightly quieter season with fewer rivals can sometimes deliver a cleaner result. Spring is a strong default, not a guarantee.",
  },
  {
    question: "Should I sell in winter?",
    answer:
      "Selling in winter can work well, and it suits a deliberate low-competition strategy. Fewer homes are listed, so a well-presented property stands out, and the buyers who are out in the cold tend to be motivated rather than casual browsers. The downsides are shorter days, harder light for photography and inspections, and gardens that are not at their best. If your home presents well in winter and your local market still has active buyers, the reduced competition can outweigh the smaller buyer pool.",
  },
  {
    question: "Does the time of year affect my sale price?",
    answer:
      "Season can influence how quickly you sell and how much competition you face, but it is rarely the main driver of price. Price is set by buyer demand, recent comparable sales and how well your home is presented and marketed, and those factors swing far more than the month does. A strong campaign in a quiet season can beat a rushed one in peak season. Treat timing as one input among several, not the lever that sets your result.",
  },
  {
    question: "Is it better to sell before or after interest rate changes?",
    answer:
      "Interest rates move buyer borrowing power, which moves demand, so the rate cycle matters more than the season. When rates fall, buyers can borrow more and competition tends to lift, which can support price. When rates rise, borrowing power tightens and demand can soften. Trying to time the exact day of a rate decision is a guessing game, and rate moves are already partly priced into the market by the time they happen. It is more useful to understand which way the cycle is heading and how that is affecting buyers in your suburb than to wait for a single announcement.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "How to Sell a House in Australia",     href: "/guides/how-to-sell-a-house-australia",       description: "Every step from pre-listing prep through to settlement day." },
  { title: "How Much Is My House Worth?",           href: "/guides/how-much-is-my-house-worth-australia", description: "The three ways to value a home and how to land on a figure you can trust." },
  { title: "The Cost of Selling a House",           href: "/guides/cost-of-selling-a-house-australia",   description: "Every fee a seller faces, with a worked example and where to negotiate." },
  { title: "How to Choose a Selling Agent",         href: "/guides/how-to-choose-a-selling-agent",        description: "The interview process, the appraisal-price trap, and what to negotiate." },
  { title: "Best Time to Buy Property",             href: "/guides/best-time-to-buy-property-australia",  description: "The same timing question from the buyer's side of the market." },
  { title: "Free Selling Guide (PDF)",              href: "/selling-guide",                              description: "The full process from listing to settlement, personalised to your suburb." },
];

export default function BestTimeToSellAHouseAustraliaPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Timing is one input, not the whole answer">
        <p>
          Seasonal patterns are useful background, but they are general
          tendencies, not rules. Local conditions, buyer demand and how well
          your home is prepared swing your result far more than the month you
          list. Use the seasons as a guide, then check what is actually
          happening in your suburb before you set a date.
        </p>
      </Callout>

      <EditorNote>
        <p>
          Sellers ask me for the magic month more than almost anything else.
          The honest answer is that the calendar is the smallest lever you have.
          I have watched well-prepared homes sell strongly in the middle of
          winter and tired ones sit through a busy spring. Pick a sensible
          window, then put your energy into the things that actually move the
          number: presentation, the right agent and a price the market believes.
        </p>
      </EditorNote>

      <h2 id="best-time">When is the best time to sell?</h2>
      <p className="lead">
        The honest answer is that two windows do most of the heavy lifting in
        Australia. <strong>Spring</strong>, roughly September to November, and{" "}
        <strong>early autumn</strong>, February to March, are the traditional
        peak selling seasons. They are when the most buyers are out looking and
        the most homes come to market.
      </p>
      <p>
        The quieter stretches are the <strong>summer holidays</strong> from late
        December into January, when buyers are at the beach rather than at open
        homes, and the <strong>depths of winter</strong>, when cold, short days
        thin out the crowd. Activity does not stop in these periods, it just
        slows.
      </p>
      <p>
        Here is the catch most sellers miss: more buyers in peak season also
        means more competing listings. A busy market cuts both ways. You reach a
        larger pool of buyers, but your home is one of many they are weighing up,
        so the extra demand does not automatically translate into a better price.
      </p>

      <KeyFigure
        value="2 peaks"
        label="Spring (Sep to Nov) and early autumn (Feb to Mar) are the traditional high points of the Australian selling year."
        context="More buyers, but also more competing listings"
      />

      <h2 id="by-season">Spring vs autumn vs winter</h2>
      <p>
        Each season has a different shape for a seller. Here is how the main
        windows stack up.
      </p>

      <h3>Spring (September to November)</h3>
      <p>
        The classic selling season. Buyer demand is at its highest, the weather
        suits open homes, and gardens and natural light show a home at its best.
        The downside is competition: spring is when the most stock lists, so
        buyers have plenty of choice and your home has to stand out in a crowded
        field. Strong for demand, but you are not the only one selling.
      </p>

      <h3>Early autumn (February to March)</h3>
      <p>
        The second peak. The market reopens after the summer break with a fresh
        wave of motivated buyers, and the weather is still kind for inspections.
        Stock levels are usually a little lighter than the spring rush, which can
        mean less direct competition for a well-presented home. For many sellers
        this is the sweet spot of demand without the full spring glut.
      </p>

      <h3>Winter (June to August)</h3>
      <p>
        Quieter on both sides. Fewer buyers are out, but fewer homes are listed,
        so a well-presented property faces less competition and the buyers who do
        turn up tend to be serious rather than casual. The trade-offs are real:
        shorter days, harder light for photography and inspections, and gardens
        that are not at their peak. Winter suits a deliberate low-competition
        strategy aimed at motivated buyers, especially if your home presents well
        in the cooler months.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        A busy spring market is not automatically your best market. The right
        season is the one where your home stands out, not the one with the most
        noise.
      </PullQuote>

      <h2 id="your-suburb">Why your suburb matters more than the month</h2>
      <p>
        National seasonal patterns are a starting point, but they wash out the
        thing that actually decides your timing: what is happening on your own
        street. Two suburbs in the same city can be running on completely
        different clocks.
      </p>
      <p>
        The local signals worth reading before you set a date:
      </p>
      <ul>
        <li>
          <strong>Days on market.</strong> How long are comparable homes in your
          suburb taking to sell right now? Falling days on market points to
          strengthening demand; rising days point to a slower patch.
        </li>
        <li>
          <strong>Auction clearance rates.</strong> In auction-heavy markets, the
          local clearance rate is a near real-time read on buyer appetite. High
          and steady clearances signal a confident market.
        </li>
        <li>
          <strong>Competing stock.</strong> How many similar homes are listed in
          your suburb this month? A glut of comparable properties is a stronger
          reason to wait or adjust than the season ever is.
        </li>
        <li>
          <strong>Recent comparable sales.</strong> What similar homes have
          actually sold for in the last 90 days tells you where the market sits
          better than any calendar.
        </li>
      </ul>
      <p>
        Check the conditions where you actually live. Our{" "}
        <Link href="/suburbs">suburb profiles</Link> show local medians and
        market activity so you can judge your own market rather than the national
        average.
      </p>

      <Callout variant="info" title="Read the local clock, not the calendar">
        <p>
          A suburb with strong demand and thin stock can be a great place to sell
          in July. A suburb drowning in similar listings can be a hard place to
          sell in October. The season sets the backdrop; your suburb sets the
          result.
        </p>
      </Callout>

      <h2 id="rate-cycle">The interest rate cycle and the market</h2>
      <p>
        If the season is the backdrop, interest rates are the weather system. Rate
        movements change how much buyers can borrow, and borrowing power drives
        demand far more powerfully than any time of year.
      </p>
      <p>
        When rates fall, buyers can service larger loans, budgets stretch further
        and competition tends to build, which supports prices. When rates rise,
        borrowing power tightens, buyers pull back and demand can soften, even in
        the middle of a traditional peak season. A rate cut can do more for your
        sale than waiting for spring ever would.
      </p>
      <p>
        That is why the buyer side of the market is worth understanding before you
        list. What a buyer can borrow sets the ceiling on what they can offer, and
        that ceiling moves with the rate cycle. Our guide to{" "}
        <Link href="/guides/how-much-can-i-borrow-australia">borrowing power</Link>{" "}
        explains the lever that sits behind buyer demand, and where it is heading
        shapes your market more than the date on the calendar.
      </p>

      <Callout variant="warning" title="Don't try to time a single rate decision">
        <p>
          Picking the exact day of a rate move is guesswork, and the market often
          prices in expected changes before they are announced. It is more useful
          to know which way the cycle is heading and how that is affecting buyers
          in your suburb than to hold your campaign hostage to one announcement.
        </p>
      </Callout>

      <h2 id="getting-ready">Getting ready beats getting lucky</h2>
      <p>
        Here is the part that matters most, and the part timing can never fix.
        Presentation, the right agent and accurate pricing decide your result far
        more than the week you happen to list. A prepared home in a quiet season
        will beat an unprepared one in a busy one, every time.
      </p>
      <p>
        The things actually worth your energy:
      </p>
      <ul>
        <li>
          <strong>Presentation.</strong> A clean, decluttered, well-styled home
          that photographs well draws the early enquiry that builds competition.
          This is where preparation pays for itself.
        </li>
        <li>
          <strong>The right agent.</strong> An agent who genuinely sells in your
          suburb, runs a sharp campaign and negotiates hard will move your number
          more than any month on the calendar.
        </li>
        <li>
          <strong>Accurate pricing.</strong> A price the market believes brings
          buyers through the door. An overpriced home stalls in any season; a
          well-pitched one sells in most.
        </li>
      </ul>
      <p>
        Three guides cover the work that actually shifts the result. Our{" "}
        <Link href="/guides/how-to-sell-a-house-australia">how to sell a house guide</Link>{" "}
        walks the full process from prep to settlement. The guide to{" "}
        <Link href="/guides/how-much-is-my-house-worth-australia">what your house is worth</Link>{" "}
        helps you land on a price you can trust. And if you are weighing both
        sides of a move, the{" "}
        <Link href="/guides/best-time-to-buy-property-australia">buyer&rsquo;s view of timing</Link>{" "}
        shows the same market from the other side of the table.
      </p>

      <KeyFigure
        value="Prep > timing"
        label="A well-presented, well-priced home with the right agent beats a perfectly timed listing that isn't ready."
        context="The levers you control outweigh the calendar"
      />

      <p>
        Pick a sensible window, then spend your effort getting ready. That is the
        order that actually lifts the result.
      </p>

      <MatchCTA kind="selling-agent" />

      <Sources items={BEST_TIME_TO_SELL_SOURCES} />
    </GuideArticleLayout>
  );
}

const BEST_TIME_TO_SELL_SOURCES: readonly SourceItem[] = [
  { label: "CoreLogic Australia: Home Value Index and market conditions", href: "https://www.corelogic.com.au/our-data/corelogic-indices", note: "Seasonal listing patterns, days on market and auction clearance data" },
  { label: "Reserve Bank of Australia: Cash rate and monetary policy", href: "https://www.rba.gov.au/", note: "How the rate cycle moves borrowing power and housing demand" },
  { label: "ASIC MoneySmart: Selling a property", href: "https://moneysmart.gov.au/", note: "Consumer guidance on preparing, pricing and selling a home" },
];
