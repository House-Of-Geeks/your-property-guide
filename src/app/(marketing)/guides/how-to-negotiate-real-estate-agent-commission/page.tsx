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
  title: "How to Negotiate Real Estate Agent Commission in Australia (2026)",
  description:
    "Agent commission is not set by law anywhere in Australia, every rate is an opening offer. Average commission by state, what's actually negotiable, tiered structures, word-for-word scripts, and when a cheap agent costs more than they save.",
  slug: "how-to-negotiate-real-estate-agent-commission",
  publishedAt: "2026-07-03",
  updatedAt: "2026-07-03",
  readingTimeMinutes: 10,
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
  "Commission is not set by law anywhere in Australia. Queensland scrapped the last legislated cap in 2014, so every rate you are quoted is an opening offer, not a fixed price.",
  "Typical residential rates run roughly 1.5 to 3.5% depending on state, suburb and price. Sydney and Melbourne metro sit lowest, regional areas and Tasmania sit highest.",
  "Five things are negotiable, not one: the rate, the structure (flat, fixed fee or tiered), the marketing budget line by line, the exclusive agency period, and the tail clause.",
  "All your leverage exists before you sign the agency agreement. Get three written proposals, negotiate while agents are still competing for the listing, then sign.",
  "A tiered commission (lower base plus a bonus above a target price) aligns the agent's incentive with yours, but only if the target sits above the realistic appraisal range.",
  "Don't over-negotiate. Shaving 0.5% off commission on an $800,000 sale saves $4,000; an agent who negotiates 2% more on the price adds $16,000. Pick the best agent first, then negotiate the fee.",
];

const TOC: GuideTOCEntry[] = [
  { id: "whats-negotiable",   label: "What's actually negotiable" },
  { id: "average-commission", label: "Average commission by state" },
  { id: "dollars",            label: "Think in dollars, not percentages" },
  { id: "tiered",             label: "Tiered and performance commissions" },
  { id: "timing",             label: "When you have leverage" },
  { id: "scripts",            label: "Scripts that work" },
  { id: "marketing",          label: "Marketing costs to challenge" },
  { id: "cheap-agents",       label: "When cheap costs you more" },
  { id: "paperwork",          label: "The paperwork, state by state" },
  { id: "next-steps",         label: "Putting it together" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the average real estate commission in Australia?",
    answer:
      "Most residential sales land between 2% and 3% of the sale price, but the spread by location is wide. Metro Sydney and Melbourne typically run 1.6% to 2.5% with averages around 2%, Brisbane, Perth and Adelaide sit a little higher, and regional areas and Tasmania commonly run 2.5% to 3.5%. Statewide medians that include regional sales sit toward the top of each range. There is no legislated rate anywhere in Australia, so treat any average as a benchmark for negotiation, not a price list.",
  },
  {
    question: "Is real estate agent commission negotiable?",
    answer:
      "Yes, everywhere in Australia. No state or territory sets commission by law, and Queensland, the last to cap rates, removed its cap in 2014. In Victoria an agent must tell you the commission is negotiable before you sign the sales authority. The practical way to negotiate is competition: get written proposals from three agents who sell in your suburb, compare the full package, and ask your preferred agent to sharpen their number before you sign.",
  },
  {
    question: "How much can I realistically negotiate off the commission?",
    answer:
      "In competitive metro markets, 0.2 to 0.5 percentage points off the opening quote is a realistic outcome, and higher-value properties (above roughly $2 million) often settle below 1.5% because the dollar amount is already large. How far you get depends on how many agents are competing for your listing, how saleable the property is, and the state of the local market. In thin regional markets with few agents there is less room to move on the rate, so focus on the marketing budget and the agreement terms instead.",
  },
  {
    question: "Should I just pick the agent with the lowest commission?",
    answer:
      "Usually not. On an $800,000 sale, the gap between a 1.6% agent and a 2.2% agent is $4,800. If the better agent achieves even 1 to 2% more on the price through sharper pricing, marketing and negotiation, that is $8,000 to $16,000, which swamps the fee saving. A very low rate can also signal an agent who carries too many listings or who will push for a fast sale rather than a strong one. Choose the agent most likely to maximise your net proceeds, then negotiate their fee.",
  },
  {
    question: "What is a tiered or performance-based commission?",
    answer:
      "A structure where the agent earns a lower base rate plus a larger share of anything above an agreed target price, for example 1.8% on the sale price plus 8% of every dollar above the top of the appraisal range. Done well, it rewards genuine outperformance and aligns the agent's incentive with yours. The trap is a target set at or below the realistic appraisal range, which pays the agent a premium for an ordinary result. Anchor the threshold to written comparable sales evidence, not the agent's optimism.",
  },
  {
    question: "Can I negotiate the marketing costs as well?",
    answer:
      "Yes, and you should, because marketing is usually charged on top of commission and is often payable whether or not the property sells. In NSW the agency agreement must state the amounts or estimated amounts of expenses, and agents must disclose any rebates they receive on them. In Victoria all expenses are negotiable and must be recorded in the sales authority. Ask for a line-by-line schedule, approve the items that plausibly move your sale price, and challenge the rest before you sign.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Commission Calculator",               href: "/real-estate-commission-calculator",       description: "Turn any quoted rate into dollars on your sale price, by state." },
  { title: "Real Estate Agent Fees in Australia", href: "/guides/real-estate-agent-fees-australia", description: "The full breakdown of commission ranges, marketing costs and fixed-fee models." },
  { title: "How to Choose a Selling Agent",       href: "/guides/how-to-choose-a-selling-agent",    description: "Pick the right agent first, the interview questions and the appraisal-price trap." },
  { title: "The Cost of Selling a House",         href: "/guides/cost-of-selling-a-house-australia", description: "Every selling cost beyond commission, with a worked example." },
  { title: "Free Selling Guide (PDF)",            href: "/selling-guide",                           description: "Fee benchmarks and the negotiation tactics that work, personalised to your suburb." },
  { title: "Free Property Appraisal",             href: "/appraisal",                               description: "A no-commitment appraisal from a vetted local agent, your negotiation baseline." },
  { title: "Find an Expert",                      href: "/find-an-expert",                          description: "Get matched with vetted selling agents who compete for your listing." },
];

export default function HowToNegotiateRealEstateAgentCommissionPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Rates in this guide are benchmarks, not quotes">
        <p>
          Commission varies by agent, suburb, property value and market
          conditions, and it changes over time. Treat every figure here as a
          negotiation benchmark, get written proposals from at least three
          local agents, and run the numbers on your own price with the{" "}
          <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
          before any conversation.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The strangest thing about agent commission is how few sellers
          negotiate it. People who will haggle over a $30,000 car will sign a
          $20,000 agency agreement at the first number quoted. The rate on
          that agreement is an opening offer. The agent expects a
          conversation, and the sellers who have one routinely keep thousands
          of dollars, without souring the relationship.
        </p>
      </EditorNote>

      <h2 id="whats-negotiable">What&rsquo;s actually negotiable</h2>
      <p className="lead">
        No Australian state or territory sets real estate commission by law.
        Queensland was the last to cap rates and removed its cap under the
        Property Occupations Act 2014, so for over a decade every commission
        in the country has been whatever you and the agent agree in writing.
        That makes the whole agreement negotiable, not just the headline rate.
      </p>
      <p>Five things are on the table before you sign:</p>
      <ul>
        <li>
          <strong>The rate itself.</strong> The percentage of the sale price
          the agent keeps. Even 0.2 percentage points matters, that&rsquo;s
          $1,600 on an $800,000 sale.
        </li>
        <li>
          <strong>The structure.</strong> Flat percentage, fixed fee, or a
          tiered rate with a performance bonus above a target price. Each
          shifts the agent&rsquo;s incentive differently.
        </li>
        <li>
          <strong>The marketing budget.</strong> Charged separately from
          commission and usually payable whether or not the property sells.
          Every line item is negotiable.
        </li>
        <li>
          <strong>The exclusive agency period.</strong> How long one agent
          has the sole right to sell. Shorter periods keep the pressure on;
          60 days is a reasonable ask, 90 is the common maximum.
        </li>
        <li>
          <strong>The tail clause.</strong> How long after the agreement ends
          the agent is still owed commission for a buyer they
          &ldquo;introduced&rdquo;, and how loosely that word is defined.
        </li>
      </ul>
      <p>
        One housekeeping point before any numbers: agents often quote
        &ldquo;plus GST&rdquo;, which adds 10% to the figure you heard.
        Always confirm whether a quote is GST-inclusive and get the inclusive
        number in the agreement.
      </p>

      <h2 id="average-commission">Average commission by state (2026)</h2>
      <p>
        Rates track property values and competition. Where prices are high
        and agents are plentiful, percentages compress; in regional markets
        with fewer sales to spread costs across, they climb. These are the
        typical ranges we track across states:
      </p>

      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Typical range</th>
            <th>Average</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><Link href="/guides/real-estate-commission-nsw"><strong>NSW</strong></Link></td><td>1.8% to 2.5%</td><td>~2.0%</td></tr>
          <tr><td><Link href="/guides/real-estate-commission-vic"><strong>VIC</strong></Link></td><td>1.6% to 2.5%</td><td>~2.0%</td></tr>
          <tr><td><Link href="/guides/real-estate-commission-qld"><strong>QLD</strong></Link></td><td>2.3% to 2.9%</td><td>~2.5%</td></tr>
          <tr><td><Link href="/guides/real-estate-commission-wa"><strong>WA</strong></Link></td><td>2.0% to 2.8%</td><td>~2.4%</td></tr>
          <tr><td><Link href="/guides/real-estate-commission-sa"><strong>SA</strong></Link></td><td>1.8% to 2.75%</td><td>~2.0%</td></tr>
          <tr><td><Link href="/guides/real-estate-commission-tas"><strong>TAS</strong></Link></td><td>2.5% to 3.25%</td><td>~2.9%</td></tr>
          <tr><td><Link href="/guides/real-estate-commission-nt"><strong>NT</strong></Link></td><td>2.4% to 2.7%</td><td>~2.5%</td></tr>
          <tr><td><Link href="/guides/real-estate-commission-act"><strong>ACT</strong></Link></td><td>1.8% to 2.25%</td><td>~2.1%</td></tr>
        </tbody>
      </table>

      <p>
        Two caveats. Statewide medians that include regional sales sit toward
        the top of each range, sometimes above it, because regional rates run
        higher than metro. And on properties above roughly $2 million, rates
        frequently negotiate below 1.5% because the dollar amount is already
        substantial. For the full breakdown of what these rates include, see
        the{" "}
        <Link href="/guides/real-estate-agent-fees-australia">agent fees guide</Link>.
      </p>

      <h2 id="dollars">Think in dollars, not percentages</h2>
      <p>
        Percentages hide the size of the money. The single most useful thing
        you can do before negotiating is convert every quote into dollars on
        your realistic sale price.
      </p>

      <KeyFigure
        value="$4,000"
        label="What a 0.5 percentage point reduction is worth on an $800,000 sale. Same agent, same campaign, one conversation."
        context="Run your own price through the commission calculator"
      />

      <p>
        The dollar view cuts both ways, and this is the part most negotiation
        advice skips. On that same $800,000 home, an agent who prices,
        markets and negotiates 2% better adds $16,000 to your result, four
        times the fee saving above. The rate conversation is worth having,
        but it is the second most important decision you&rsquo;ll make. The
        first is which agent you hand the sale to. Work out both numbers for
        your own property with the{" "}
        <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
        so you know exactly what you&rsquo;re playing for.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        Negotiate the fee like it&rsquo;s thousands of dollars, because it
        is. Just never let a $4,000 saving pick a $16,000-worse agent.
      </PullQuote>

      <h2 id="tiered">Tiered and performance commissions</h2>
      <p>
        A tiered (or incentive) commission pays the agent a lower base rate
        plus a larger share of anything above an agreed target. For example:
        1.8% on the sale price, plus 8% of every dollar above $820,000, where
        $820,000 is the top of the written appraisal range.
      </p>
      <p>
        On a sale at $860,000 that structure pays the agent $15,480 base plus
        $3,200 bonus, $18,680 all up, slightly less than a flat 2.2% would
        have cost, and the agent had a genuine reason to fight for every
        dollar past the target. On a sale at $800,000 you pay just $14,400.
        You only pay a premium when you&rsquo;re genuinely ahead.
      </p>
      <p>
        The structure has one failure mode: <strong>a target set too
        low</strong>. If the kicker starts at or below the realistic
        appraisal range, you pay bonus rates for an ordinary result. Anchor
        the threshold to comparable sales evidence, recent sales, same
        suburb, similar property, and set it at or above the top of the
        honest range. If an agent resists a tiered structure with a fair
        threshold, that tells you something about how confident they really
        are in their appraisal.
      </p>
      <p>
        A different flavour worth knowing: some agencies propose declining
        tiers (for example a higher rate on the first $300,000 and a lower
        rate on the balance). These are common on higher-value properties and
        are equally negotiable, always convert them to a single dollar figure
        at your realistic price so you can compare structures side by side.
      </p>

      <h2 id="timing">When you have leverage</h2>
      <p>
        Almost all of your leverage exists <strong>before you sign the
        agency agreement</strong>. Before signing, agents are competing for a
        listing they want; afterwards, you&rsquo;re locked into an exclusive
        period and the power flips. In NSW you get a one-business-day
        cooling-off period after signing; in Victoria there is no cooling-off
        on a sales authority at all. Negotiate first, sign second.
      </p>
      <p>Your position is strongest when:</p>
      <ul>
        <li>
          <strong>Multiple agents are pitching.</strong> Three written
          proposals is the minimum. Competition does most of the negotiating
          for you, agents sharpen their numbers when they know they&rsquo;re
          being compared.
        </li>
        <li>
          <strong>Your property is an easy sell.</strong> Well-presented
          home, liquid suburb, realistic price expectations. Agents discount
          for listings that will sell quickly and make them look good.
        </li>
        <li>
          <strong>The market is slow.</strong> When listings are scarce,
          agents compete harder for each one. A soft market is a bad time to
          sell but a strong time to negotiate fees.
        </li>
        <li>
          <strong>You know the local benchmark.</strong> Walking in knowing
          the going range in your suburb, and the dollar figure on your
          price, changes the conversation entirely.
        </li>
      </ul>
      <p>
        Start the process with a{" "}
        <Link href="/appraisal">free appraisal</Link> from a vetted local
        agent so you have a realistic price baseline before anyone quotes you
        a rate against it.
      </p>

      <h2 id="scripts">Scripts that work</h2>
      <p>
        You don&rsquo;t need to be a negotiator, you need four sentences,
        delivered after the agent has presented their appraisal and proposal,
        while they still want the listing.
      </p>
      <ul>
        <li>
          <strong>The comparison.</strong> &ldquo;I&rsquo;ve got written
          proposals from three agents and two are under 2%. You&rsquo;re my
          preferred agent, can you meet that rate?&rdquo; Simple, honest,
          and it works because it&rsquo;s true, so make it true.
        </li>
        <li>
          <strong>The performance trade.</strong> &ldquo;I&rsquo;ll agree to
          your rate if we restructure it: a lower base, plus a bonus on
          everything above the top of your own appraisal range. If you
          believe your number, this pays you more.&rdquo;
        </li>
        <li>
          <strong>The marketing challenge.</strong> &ldquo;Walk me through
          this budget line by line. Which items move my sale price? I&rsquo;ll
          approve those today and we&rsquo;ll cut the rest.&rdquo;
        </li>
        <li>
          <strong>The exclusivity trade.</strong> &ldquo;I&rsquo;ll sign 60
          days exclusive rather than 90. If it hasn&rsquo;t sold by then,
          we&rsquo;ll renegotiate, and I&rsquo;m happy to extend if the
          campaign is on track.&rdquo;
        </li>
        <li>
          <strong>The GST check.</strong> &ldquo;Is that rate inclusive of
          GST? Put the inclusive figure in the agreement.&rdquo; Ten seconds,
          and it prevents the most common quiet 10% surprise.
        </li>
      </ul>
      <p>
        Two things not to do. Don&rsquo;t open the fee conversation before
        the agent has shown you comparable sales evidence, you&rsquo;ll
        anchor the meeting on price instead of competence. And don&rsquo;t
        grind past the point of goodwill: an agent who feels squeezed to the
        bone has little incentive to fight for your last $10,000, which is
        precisely the work you&rsquo;re paying them for.
      </p>

      <MatchCTA kind="selling-agent" />

      <h2 id="marketing">Marketing costs to challenge</h2>
      <p>
        Marketing is billed on top of commission and usually payable whether
        or not the property sells, which makes it the most under-negotiated
        money in the sale. Typical line items on an Australian campaign:
      </p>
      <ul>
        <li>Professional photography, $500 to $1,500</li>
        <li>Video and drone, $1,500 to $4,000</li>
        <li>Floor plan, $200 to $500</li>
        <li>Online listings on realestate.com.au and Domain, $800 to $2,000+ depending on tier</li>
        <li>Signboard, $200 to $600</li>
        <li>Social media advertising, $300 to $1,000+</li>
        <li>Styling and staging (optional), $2,000 to $8,000+</li>
      </ul>
      <p>
        Worth paying for: photography, an accurate floor plan, and the portal
        tier appropriate to your price point, these drive the early enquiry
        that creates competition. Worth challenging:
      </p>
      <ul>
        <li>
          <strong>Print advertising</strong> in most metro markets, buyers
          search online. Ask for evidence it produces enquiry in your suburb.
        </li>
        <li>
          <strong>Agency-branded material</strong>, oversized signboards and
          glossy brochures that promote the agency as much as your property.
        </li>
        <li>
          <strong>Premium portal upgrades on modest listings</strong>. A
          top-tier placement can be justified on a $1M+ home in a competitive
          suburb and over-spend on a $500,000 one.
        </li>
        <li>
          <strong>Admin or file fees</strong> ($300 to $800 at some
          agencies), pure margin, ask for them to be waived.
        </li>
      </ul>
      <p>
        The rules back you here. In NSW the agency agreement must state the
        amounts or estimated amounts of all expenses, and agents must
        disclose any rebates or discounts they receive on them, so the
        &ldquo;$2,000 portal package&rdquo; that costs the agency $1,400 is
        discloseable. In Victoria, all expenses are negotiable and must be
        recorded in the sales authority. Ask for the schedule in writing and
        approve it line by line.
      </p>

      <h2 id="cheap-agents">When a cheap agent costs more than they save</h2>
      <p>
        Discount agents and fixed-fee models ($3,000 to $10,000 flat) have a
        place, straightforward properties in hot markets where buyers queue
        up regardless. Everywhere else, the maths usually runs the other way.
      </p>

      <KeyFigure
        value="$11,200"
        label="What you'd be ahead on an $800,000 sale if a 2.2% agent achieves 2% more on price than a 1.6% discount agent."
        context="$16,000 extra price minus $4,800 extra fee"
      />

      <p>Warning signs that a low rate will cost you at the sale price:</p>
      <ul>
        <li>
          <strong>Volume model.</strong> The agent carries dozens of listings
          at once. Your campaign gets a junior at the opens and a template
          everywhere else.
        </li>
        <li>
          <strong>Quick-sale incentive.</strong> At a low flat rate, the
          difference to the agent between selling your home for $780,000 this
          week and $810,000 in five weeks is trivial to them and $30,000 to
          you.
        </li>
        <li>
          <strong>Thin marketing by default.</strong> Cheap fee, cheap
          campaign: minimal photography, lowest portal tier, no follow-up on
          buyer enquiry.
        </li>
        <li>
          <strong>Weak negotiation at the pointy end.</strong> The entire
          value of a good agent concentrates in the final negotiation with
          buyers. It&rsquo;s the hardest thing to discount-shop and the most
          expensive thing to get wrong.
        </li>
      </ul>
      <p>
        The order of operations matters: shortlist agents on suburb track
        record, days on market and sale-versus-quote results first, then
        negotiate hard with your preferred one or two. Our{" "}
        <Link href="/find-an-expert">find an expert</Link> service matches
        you with vetted local agents so the shortlist starts from
        performance, not from whoever letterbox-dropped you last week.
      </p>

      <h2 id="paperwork">The paperwork, state by state</h2>
      <p>
        Whatever you negotiate only counts once it&rsquo;s written into the
        agency agreement, and each state frames that document differently:
      </p>
      <ul>
        <li>
          <strong>NSW.</strong> Commissions and fees are explicitly not set
          by law. You get a cooling-off period of one business day (or
          Saturday) after signing an agency agreement, and you can rescind in
          writing within it. Expenses must be stated as amounts or estimates,
          and rebates to the agent must be disclosed.
        </li>
        <li>
          <strong>VIC.</strong> The agent must advise you that commission is
          negotiable <em>before</em> you sign the sales authority, and the
          negotiated commission and marketing expenses (with GST separated)
          must be recorded in it. There is no cooling-off period on a sales
          authority, so negotiate everything first.
        </li>
        <li>
          <strong>QLD.</strong> Appointment is via the government&rsquo;s
          Form 6, which must state the commission and when it&rsquo;s
          payable. A sole or exclusive agency is capped at 90 days, and if
          the appointment runs longer than 60 days either party can end it
          with 30 days&rsquo; written notice.
        </li>
        <li>
          <strong>Other states and territories.</strong> Commission is
          deregulated everywhere; agreement rules and cooling-off periods
          vary, so check your local consumer affairs body (Consumer
          Protection WA, CBS in SA, CBOS in Tasmania) before signing.
        </li>
      </ul>
      <p>
        Whatever your state: rate, structure, marketing schedule, exclusive
        period and tail clause all go in the document, in numbers, before you
        sign. Verbal undertakings from a listing presentation are worth
        exactly nothing at settlement.
      </p>

      <h2 id="next-steps">Putting it together</h2>
      <p>The sequence that saves the most, in order:</p>
      <ol>
        <li>
          <strong>Convert rates to dollars.</strong> Run your realistic price
          through the{" "}
          <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
          so every quote lands as a dollar figure, not an abstract percentage.
        </li>
        <li>
          <strong>Benchmark your market.</strong> The{" "}
          <Link href="/guides/real-estate-agent-fees-australia">agent fees guide</Link>{" "}
          covers what the rate should include and where fixed fees make sense.
        </li>
        <li>
          <strong>Shortlist on performance.</strong> Use the{" "}
          <Link href="/guides/how-to-choose-a-selling-agent">choosing an agent guide</Link>{" "}
          or get matched with vetted locals via{" "}
          <Link href="/find-an-expert">find an expert</Link>.
        </li>
        <li>
          <strong>Get a baseline appraisal.</strong> A{" "}
          <Link href="/appraisal">free, no-commitment appraisal</Link> gives
          you the realistic price range every negotiation anchors to.
        </li>
        <li>
          <strong>Negotiate before signing.</strong> Three written proposals,
          the scripts above, everything in the agreement in numbers.
        </li>
      </ol>

      <MatchCTA kind="selling-agent" />

      <Sources items={COMMISSION_NEGOTIATION_SOURCES} />
    </GuideArticleLayout>
  );
}

const COMMISSION_NEGOTIATION_SOURCES: readonly SourceItem[] = [
  { label: "NSW Government (Fair Trading): Agency agreements for the sale of property in NSW", href: "https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/selling-a-property/agency-agreements", note: "Fees not set by law, cooling-off period, expense and rebate disclosure" },
  { label: "Consumer Affairs Victoria: Selling property with or without an agent", href: "https://www.consumer.vic.gov.au/housing/buying-and-selling-property/selling-property/selling-property-with-or-without-an-agent", note: "Commission negotiable, sales authority contents, no cooling-off in VIC" },
  { label: "Queensland Government: Appointing a real estate agent", href: "https://www.qld.gov.au/law/housing-and-neighbours/buying-and-selling-a-property/selling-a-home/before-you-put-your-home-on-the-market/appointing-a-real-estate-agent", note: "Form 6 appointments, 90-day cap on sole/exclusive agency" },
  { label: "Queensland legislation: Property Occupations Act 2014", href: "https://www.legislation.qld.gov.au/view/html/inforce/current/act-2014-022", note: "Removed the last legislated commission cap in Australia" },
];
