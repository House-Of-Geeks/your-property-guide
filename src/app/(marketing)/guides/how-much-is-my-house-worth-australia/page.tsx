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
  title: "How Much Is My House Worth? (Australia, 2026)",
  description:
    "The three ways to value a house in Australia (appraisal, bank valuation, online estimate), why they disagree, what actually drives your number, and how to get an accurate figure before you sell.",
  slug: "how-much-is-my-house-worth-australia",
  publishedAt: "2026-06-14",
  updatedAt: "2026-06-14",
  readingTimeMinutes: 9,
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
  "There are three different numbers for what your house is worth: an agent appraisal (free, market-facing), a bank valuation (conservative, lender-facing) and an online estimate (automated, often wide of the mark). They measure different things, so they disagree.",
  "The agent appraisal is the figure that matters when you're selling. It's an estimate of what a real buyer would pay in today's market, built from recent comparable sales in your suburb.",
  "A bank valuation is deliberately conservative because it protects the lender, not your sale price. It usually lands below the appraisal, sometimes 5 to 10% below.",
  "Free online estimates work off automated models. They can be close on standard homes in high-turnover suburbs and badly wrong on anything unusual, recently renovated, or in a thin market.",
  "Your number is driven by recent comparable sales, location, land size, condition and the current state of the local market. Not what you paid, not what you owe, not what you need.",
  "The accurate way to find out is to get two or three appraisals from agents who actually sell in your suburb, then sanity-check them against comparable sales.",
];

const TOC: GuideTOCEntry[] = [
  { id: "three-numbers",    label: "The three different numbers" },
  { id: "why-they-differ",  label: "Why the three disagree" },
  { id: "what-drives",      label: "What actually drives your number" },
  { id: "online-estimates", label: "Why free online estimates miss" },
  { id: "accurate-figure",  label: "How to get an accurate figure" },
  { id: "next-steps",       label: "What to do next" },
];

const FAQS: FaqItem[] = [
  {
    question: "How do I find out what my house is worth?",
    answer:
      "Get two or three appraisals from local agents who actively sell your type of property in your suburb, then cross-check their figures against recent comparable sales. An appraisal is free and gives you a market-facing estimate of what a buyer would pay today. Online estimates are a useful starting point but shouldn't be treated as your real number. If you need a figure for a loan, refinance or legal matter, you'll need a formal valuation from a licensed valuer instead, which is a paid, independent report.",
  },
  {
    question: "Is a free property appraisal accurate?",
    answer:
      "A good appraisal from an agent who genuinely knows your suburb is the most useful number you can get when you're selling, because it reflects current buyer demand and recent comparable sales. The catch is that it's an estimate, not a guarantee, and some agents quote high to win the listing then condition you down later. That's why you get two or three and ask each one to back the figure with comparable sales from the last 90 days. When the appraisals cluster around a similar range and the comparables support it, you can trust it.",
  },
  {
    question: "What's the difference between an appraisal and a valuation?",
    answer:
      "An appraisal is a free, market-facing estimate from a real estate agent of what your home would likely sell for in the current market. A valuation is a formal, paid report from a licensed valuer that's used for lending, legal, tax or dispute purposes. The valuation is more conservative and more rigorous, but it isn't a prediction of your sale price. When you're selling, the appraisal is the number that matters. When a bank, court or the tax office needs a figure, it's the valuation.",
  },
  {
    question: "Why is my online estimate so different from the agent's appraisal?",
    answer:
      "Online estimates are produced by automated valuation models that work off sales data, property attributes and broad statistical patterns. They can't see inside your home, so they miss a recent renovation, a poor floor plan, a premium outlook or a busy road. On a standard home in a high-turnover suburb the estimate can be close. On anything unusual, recently improved, or in a suburb with few recent sales, the model has thin data to work with and the number drifts. An agent standing in the property, working from genuine comparable sales, will almost always be closer.",
  },
  {
    question: "Does what I paid or what I owe affect my home's value?",
    answer:
      "No. The price you paid, the size of your mortgage and the amount you'd like to walk away with have no bearing on what your home is worth today. Value is set by what a buyer is willing to pay right now, which is driven by recent comparable sales, location, land size, condition and the state of the local market. Anchoring to your purchase price or your loan balance is one of the most common ways sellers misprice a home.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Free Property Appraisal",            href: "/appraisal",                                 description: "An independent appraisal from a vetted local agent, no commitment." },
  { title: "Free Selling Guide (PDF)",            href: "/selling-guide",                             description: "The full process from listing to settlement, personalised to your suburb." },
  { title: "How to Sell a House in Australia",    href: "/guides/how-to-sell-a-house-australia",       description: "Every step from pre-listing prep through to settlement day." },
  { title: "How to Choose a Selling Agent",       href: "/guides/how-to-choose-a-selling-agent",      description: "The interview process, the appraisal-price trap, and what to negotiate." },
  { title: "Real Estate Agent Fees in Australia", href: "/guides/real-estate-agent-fees-australia",   description: "Commission ranges by state, marketing budgets, and what's negotiable." },
  { title: "Commission Calculator",               href: "/real-estate-commission-calculator",         description: "What an agent costs on your sale price, by state." },
];

export default function HowMuchIsMyHouseWorthAustraliaPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="There isn't one answer, there are three">
        <p>
          Ask three different sources what your house is worth and you&rsquo;ll
          get three different numbers. That&rsquo;s not because someone is
          wrong. An agent appraisal, a bank valuation and an online estimate
          each measure a different thing for a different purpose. This guide
          explains what each one is for, why they disagree, and how to land on
          a figure you can actually trust.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The number most sellers fixate on is the online estimate, because
          it&rsquo;s instant and free. It&rsquo;s also the one I&rsquo;d trust
          least. The figure that matters when you&rsquo;re selling is what a
          real buyer will pay this month, and the only people who watch that in
          real time are the agents selling on your street. Get two or three of
          them in, and make each one show you the comparable sales behind their
          number.
        </p>
      </EditorNote>

      <h2 id="three-numbers">The three different numbers</h2>
      <p className="lead">
        When people ask &quot;how much is my house worth?&quot; they&rsquo;re
        usually after one figure. In practice there are three, and they answer
        different questions.
      </p>

      <h3>1. The agent appraisal</h3>
      <p>
        A free estimate from a real estate agent of what your home would most
        likely sell for in the current market. It&rsquo;s built from recent
        comparable sales in your suburb, adjusted for your home&rsquo;s
        condition, position and features. This is the number that matters when
        you&rsquo;re selling, because it&rsquo;s the agent&rsquo;s read on what
        a buyer will actually pay. It&rsquo;s an estimate, not a promise, and
        it usually comes as a range rather than a single figure.
      </p>

      <h3>2. The bank valuation</h3>
      <p>
        A formal figure produced by or for a lender when you borrow against the
        property. Sometimes it&rsquo;s a full inspection by a licensed valuer,
        sometimes it&rsquo;s a desktop or kerbside assessment. Its job is to
        protect the bank if you default, so it&rsquo;s deliberately
        conservative. A bank valuation typically lands below the agent
        appraisal, sometimes well below.
      </p>

      <h3>3. The online estimate</h3>
      <p>
        An automated number from a property portal or data site, generated by
        an automated valuation model (AVM) that crunches sales data and
        property attributes. It&rsquo;s instant and free, and it&rsquo;s the
        roughest of the three. On a standard home in a busy suburb it can be
        close. On anything out of the ordinary it can be a long way off.
      </p>

      <KeyFigure
        value="3 numbers"
        label="Appraisal, bank valuation and online estimate measure different things"
        context="Disagreement between them is normal, not an error"
      />

      <h2 id="why-they-differ">Why the three disagree</h2>
      <p>
        The gap between the three numbers confuses a lot of sellers. It
        shouldn&rsquo;t. Each is built for a different audience:
      </p>
      <ul>
        <li>
          <strong>The appraisal is optimistic by design,</strong> in the sense
          that it reflects what a motivated buyer might pay in a competitive
          campaign. A good agent prices to the market, but the appraisal is
          still a forward-looking estimate of a sale that hasn&rsquo;t happened
          yet.
        </li>
        <li>
          <strong>The bank valuation is pessimistic by design.</strong> The
          lender assumes a forced or quick sale and wants a figure it could
          recover even in a soft market. That&rsquo;s why it&rsquo;s
          conservative, and why a valuation coming in under your contract price
          is a known headache for buyers arranging finance.
        </li>
        <li>
          <strong>The online estimate is statistical, not personal.</strong>
          {" "}The model has never been inside your home. It can&rsquo;t see the
          renovated kitchen, the awkward floor plan, the district view or the
          main road at the front. It fills those gaps with averages.
        </li>
      </ul>
      <p>
        So a home might appraise at $880,000, value at $820,000 for the bank,
        and show $910,000 on a portal. None of those is a lie. They&rsquo;re
        three tools doing three different jobs.
      </p>

      <Callout variant="warning" title="When a low bank valuation bites">
        <p>
          A conservative bank valuation only becomes a real problem on the buy
          side. If a buyer agrees to pay $900,000 but the bank values the
          property at $850,000, the bank lends against the lower figure and the
          buyer has to find the difference in cash. As a seller, your appraisal
          and your eventual sale price are what count, not the valuation a
          buyer&rsquo;s bank happens to run.
        </p>
      </Callout>

      <h2 id="what-drives">What actually drives your number</h2>
      <p>
        Whichever method you use, the same handful of factors set the value.
        Worth knowing what&rsquo;s on the list, and what isn&rsquo;t.
      </p>
      <p>What drives it:</p>
      <ul>
        <li>
          <strong>Recent comparable sales.</strong> The single biggest input.
          What did similar homes (same suburb, similar bedrooms, bathrooms,
          land size and condition) actually sell for in the last 90 days?
        </li>
        <li>
          <strong>Location.</strong> Suburb, street, proximity to schools,
          transport and shops, plus the small stuff: a quiet street versus a
          main road, a north-facing rear, a district outlook.
        </li>
        <li>
          <strong>Land size and the block.</strong> Frontage, usable land,
          slope, aspect, and whether the block has development or subdivision
          potential.
        </li>
        <li>
          <strong>Condition and presentation.</strong> A well-maintained,
          well-presented home commands more than a tired one of the same size,
          even before any styling for the campaign.
        </li>
        <li>
          <strong>The current market.</strong> Buyer demand, interest rates,
          how much comparable stock is listed right now, and where the local
          market sits in its cycle. The same house is worth more in a hot
          market than a soft one.
        </li>
      </ul>
      <p>What doesn&rsquo;t drive it:</p>
      <ul>
        <li><strong>What you paid.</strong> Your purchase price is history. Buyers price off today&rsquo;s market, not your 2018 contract.</li>
        <li><strong>What you owe.</strong> Your mortgage balance is your business, not a buyer&rsquo;s. It has no effect on value.</li>
        <li><strong>What you need to walk away with.</strong> Understandable, but the market doesn&rsquo;t care what your next purchase costs.</li>
        <li><strong>What you spent on improvements.</strong> Money spent isn&rsquo;t value added. Some upgrades return well, many return cents on the dollar.</li>
      </ul>

      <PullQuote attribution="Andy McMaster, Editor">
        Your house is worth what a buyer will pay for it this month, not what
        you paid, not what you owe, and not what you&rsquo;d like.
      </PullQuote>

      <h2 id="online-estimates">Why free online estimates miss</h2>
      <p>
        Free online estimates are everywhere, and they&rsquo;re genuinely
        useful as a starting point. The trouble starts when sellers treat the
        number as fact. Here&rsquo;s why an automated estimate drifts:
      </p>
      <ul>
        <li>
          <strong>The model can&rsquo;t see your home.</strong> A renovation, a
          poor layout, a premium view or a noisy road are invisible to an AVM.
          It works off recorded attributes, which are often out of date.
        </li>
        <li>
          <strong>Thin data breaks it.</strong> In suburbs with few recent
          sales, or for unusual properties (acreage, prestige homes, mixed-use,
          heavily renovated), the model has little to compare against and the
          confidence range blows out.
        </li>
        <li>
          <strong>It lags the market.</strong> Sales data takes weeks to
          settle and report. In a fast-moving market the estimate is reading
          last quarter&rsquo;s prices, not this week&rsquo;s.
        </li>
        <li>
          <strong>Different sites give different numbers.</strong> Each portal
          runs its own model on its own data, so two estimates for the same
          home can sit tens of thousands of dollars apart. That spread alone
          tells you not to bank on any single figure.
        </li>
      </ul>
      <p>
        Use online estimates to get a feel for the rough range, then treat the
        appraisal from an agent who&rsquo;s standing in your living room as the
        figure that counts.
      </p>

      <h2 id="accurate-figure">How to get an accurate figure</h2>
      <p>
        If you want a number you can act on, here&rsquo;s the method that
        works:
      </p>
      <ol>
        <li>
          <strong>Start with an online estimate</strong> to anchor the rough
          range. Check two or three sites so you can see the spread rather than
          trusting one.
        </li>
        <li>
          <strong>Pull your own comparable sales.</strong> Look up sold (not
          listed) prices in your suburb over the last 90 days for homes like
          yours: similar bedrooms, bathrooms, land size and condition. This is
          your reality check on every figure that follows.
        </li>
        <li>
          <strong>Get two or three agent appraisals.</strong> Pick agents who
          genuinely sell your type of property in your suburb, not whoever
          letterboxes you most. Each appraisal is free.
        </li>
        <li>
          <strong>Make each agent justify the number.</strong> Ask for the
          comparable sales behind their figure. A confident appraisal that
          can&rsquo;t be backed with recent comparables is a warning sign.
        </li>
        <li>
          <strong>Look for the cluster.</strong> When the appraisals land in a
          similar range and your comparables support it, that range is your
          honest value. When one agent quotes far higher than the rest with no
          evidence, treat it as a sales tactic, not a price.
        </li>
      </ol>
      <p>
        If you need a figure for a loan, a refinance, a divorce settlement, a
        deceased estate or a tax matter, an agent appraisal won&rsquo;t do.
        That calls for a formal valuation from a licensed valuer, which is a
        paid, independent report carrying legal weight.
      </p>

      <Callout variant="warning" title="The over-quote trap">
        <p>
          The agent who appraises your home highest is rarely the one who sells
          it for the most. Some quote high to win the listing, then spend the
          campaign &quot;managing your expectations&quot; back down to where the
          market always was. This is exactly why you get more than one
          appraisal and insist on comparable-sales evidence behind each. Read
          our <Link href="/guides/how-to-choose-a-selling-agent">guide to choosing a selling agent</Link>{" "}
          for the full picture.
        </p>
      </Callout>

      <MatchCTA
        kind="selling-agent"
        href="/appraisal"
        lead="Want a real number, not an automated guess? Get a free appraisal from a vetted local agent who sells your type of property in your suburb."
        ctaLabel="Get my free appraisal"
      />

      <h2 id="next-steps">What to do next</h2>
      <p>
        Knowing your number is the first step in any sale. Once you have a range
        you trust, here&rsquo;s where to take it:
      </p>
      <ol>
        <li>
          <strong>Book a free appraisal.</strong> An independent appraisal from
          a local agent gives you a market-facing figure and costs nothing.{" "}
          <Link href="/appraisal">Start here</Link>.
        </li>
        <li>
          <strong>Read the full selling process.</strong> Our{" "}
          <Link href="/guides/how-to-sell-a-house-australia">how to sell a house guide</Link>{" "}
          covers every step from pricing through to settlement.
        </li>
        <li>
          <strong>Work out what selling will cost you.</strong> Use the{" "}
          <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
          to see what an agent costs on your likely sale price, by state.
        </li>
        <li>
          <strong>Get the complete guide.</strong> The free{" "}
          <Link href="/selling-guide">selling guide</Link> pulls the whole
          process into one PDF, personalised to your suburb.
        </li>
      </ol>

      <MatchCTA kind="selling-agent" />

      <Sources items={HOUSE_VALUE_SOURCES} />
    </GuideArticleLayout>
  );
}

const HOUSE_VALUE_SOURCES: readonly SourceItem[] = [
  { label: "CoreLogic Australia: Property valuations and automated valuation models", href: "https://www.corelogic.com.au/", note: "Background on AVMs and comparable-sales methodology" },
  { label: "Australian Property Institute: What a valuation is and who provides it", href: "https://www.api.org.au/", note: "Distinction between an agent appraisal and a licensed valuation" },
  { label: "ASIC MoneySmart: Buying and selling property", href: "https://moneysmart.gov.au/", note: "Consumer guidance on appraisals, valuations and pricing" },
  { label: "CoreLogic Australia: Home Value Index and market conditions", href: "https://www.corelogic.com.au/our-data/corelogic-indices", note: "Market-condition factors cited in the value drivers section" },
];
