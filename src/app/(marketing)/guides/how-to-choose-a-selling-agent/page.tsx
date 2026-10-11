import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { STATE_NAMES, STATE_RATES, type StateCode } from "@/lib/data/commission-rates";
import { CAV_PROPERTY_PRICES, NSW_AGENCY_AGREEMENTS, QLD_COMMISSION, cite } from "@/lib/data/appraisal-sources";
import { COMMISSION_RULE_SOURCES } from "@/lib/suburb-agents";

// The national span of the state table, so no national range is typed by
// hand (item 7 of the 10 Oct 2026 review found five on the site).
const COMMISSION_STATES = Object.keys(STATE_RATES) as StateCode[];
const NATIONAL_LOW = Math.min(...COMMISSION_STATES.map((st) => STATE_RATES[st].low));
const NATIONAL_HIGH = Math.max(...COMMISSION_STATES.map((st) => STATE_RATES[st].high));
const NATIONAL_RANGE = `${NATIONAL_LOW}% to ${NATIONAL_HIGH}%`;
import { HowToJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  // Section 3.5 of the 10 Oct 2026 review: the query is "how to choose a
  // real estate agent"; the slug stays.
  title: "How to Choose a Real Estate Agent to Sell Your Home (2026)",
  description:
    "How to choose a real estate agent to sell your home: shortlist on local sales, compare agents side by side, what the law makes them tell you, and fees by state.",
  slug: "how-to-choose-a-selling-agent",
  publishedAt: "2026-05-06",
  updatedAt: "2026-10-11",
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
  "Shortlist three agents with recent sales in your suburb, ask each for the comparable sales behind their price and their fee in writing including GST, and choose on evidence rather than the highest number.",
  "Don't pick the agent who quotes the highest price. The 'high quote then condition you down' play is one of the most common ways sellers get hurt.",
  "Demand recent comparable sales (last 90 days, same suburb, similar property type) and challenge the appraisal price against them.",
  `Commission runs from ${NATIONAL_RANGE} of the sale price across the states in our table, plus marketing and GST, and it is negotiable. The lowest commission isn't automatically best: the right agent earns their fee through a higher sale price.`,
  "Read the listing agreement carefully. Watch for: exclusive period length, marketing budget commitments, sole agency vs general agency, and 'tail clauses' that lock you in even after the agreement ends.",
  "References matter. Ask for 2 or 3 sellers from the last 6 months and call them. Ask the questions the agent didn't volunteer.",
];

const TOC: GuideTOCEntry[] = [
  { id: "why-it-matters",   label: "Why agent choice matters" },
  { id: "shortlist",        label: "How to shortlist agents" },
  { id: "interview",        label: "What to ask in the interview" },
  { id: "appraisal-trap",   label: "The appraisal-price trap" },
  { id: "compare",          label: "How to compare agents side by side" },
  { id: "law",              label: "What the law makes an agent tell you" },
  { id: "fees",             label: "Commission and fees" },
  { id: "marketing",        label: "Marketing budget and strategy" },
  { id: "agreement",        label: "The listing agreement" },
  { id: "references",       label: "Checking references" },
  { id: "red-flags",        label: "Red flags" },
  { id: "decision",         label: "Making the decision" },
];

const FAQS: FaqItem[] = [
  {
    question: "How many agents should I interview?",
    answer:
      "At least three. One is too few to compare, and over five becomes a time-sink. Three to four well-chosen interviews give you a useful spread on appraisal price, fee structure, and marketing approach. Pick agents who genuinely sell in your suburb (check their recent sold listings on realestate.com.au or domain.com.au), not whoever is most aggressive on cold calls.",
  },
  {
    question: "Should I pick the agent who quotes the highest price?",
    answer:
      "Almost never. The 'over-quote to win the listing, then condition you down' play is one of the most common ways sellers get hurt. The agent quotes a high appraisal, you sign with them, then over the campaign they progressively lower your expectations until you accept a price closer to (or below) what the more honest agents quoted upfront. Always demand comparable sales evidence and challenge inflated appraisals.",
  },
  {
    question: "What's a tail clause and why does it matter?",
    answer:
      "A tail clause says that if your property sells to a buyer who was introduced during the agency period, even months after the agreement ends, the original agent is still owed commission. Check how long it runs and how 'introduced' is defined: it can be defined loosely. Negotiate a tighter definition or a shorter tail before signing.",
  },
  {
    question: "Sole agency vs general agency, what's the difference?",
    answer:
      "Sole agency: one agent has the exclusive right to sell during the agency period. They get paid even if you find the buyer yourself. General agency: multiple agents can list the property simultaneously, only the one who finds the buyer earns commission. Sole agency is the norm and aligns the agent's incentive to actually market your property; general agency tends to result in less effort from any individual agent.",
  },
  {
    question: "How much should I spend on marketing?",
    answer:
      "It depends on the property, the portal listing tier and the campaign: the agent quotes a marketing budget, and it is paid by the seller separately from commission. Ask for it itemised (photography, floor plan, portal listings, signboard, print, any video or styling) and ask which lines will move your sale price. Our selling costs calculator puts a marketing line beside the commission so you see the total.",
  },
  {
    question: "Can I negotiate the commission rate?",
    answer:
      `Yes. Commission is agreed with the agent: in NSW you can negotiate the commission, fees and expenses (${cite(NSW_AGENCY_AGREEMENTS, "NSW Government")}), in Victoria the agent must tell you they are negotiable, and in Queensland the government sets no limit. Our typical ranges run from ${NATIONAL_RANGE} across the states. The trade-off: a 0.5 percentage point difference on a $1,000,000 sale is $5,000, while 2% more on the sale price is $20,000. Pick the agent who will get you the higher price, then negotiate the fee.`,
  },
  {
    question: "What is the biggest mistake a real estate agent can make?",
    answer:
      "Pricing the property to win the listing rather than to sell it. A figure far above the comparable sales brings the listing in, then the campaign runs long and the price is talked down, often below what an evidence-based price would have achieved. Ask every agent for the comparable sales behind their number before you sign.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Free Selling Guide (PDF)",            href: "/selling-guide",                           description: "The 10 agent interview questions and nine more chapters as a free PDF, personalised to your suburb." },
  { title: "Commission Calculator",               href: "/real-estate-commission-calculator",       description: "What an agent costs on your sale price, by state." },
  { title: "Real Estate Agent Fees in Australia", href: "/guides/real-estate-agent-fees-australia", description: "Detailed breakdown of commission structures across states." },
  { title: "Property Auction Guide",              href: "/guides/property-auction-guide",            description: "How auctions actually run, and what to expect from your agent on auction day." },
  { title: "Free Property Appraisal",             href: "/appraisal",                                description: "Ask one local agent for a free appraisal, no commitment to list." },
  { title: "Sell First or Buy First?",            href: "/guides/sell-first-or-buy-first",           description: "The decision tree before you commit to either a sale or a purchase." },
  { title: "Conveyancing in Australia",           href: "/guides/conveyancing-guide",                description: "What your conveyancer does on the sell side." },
];

export default function HowToChooseSellingAgentPage() {
  return (
    <>
      <HowToJsonLd
        name="How to choose a selling agent in Australia"
        description="The seven-step process for selecting and engaging a residential selling agent in Australia."
        url={`/guides/${FRONTMATTER.slug}`}
        steps={[
          { name: "Get three written appraisals", text: "Pick agents who recently sold in your suburb. Compare appraised price ranges, recommended marketing strategy, and commission." },
          { name: "Verify each agent's licence", text: "Each Australian state has a real estate licensing register. Check the licence number is current and the agent has no recent disciplinary actions." },
          { name: "Review their last 6 months of sold listings", text: "Days on market, sale-vs-asking price, and clearance rate tell you more than any sales pitch." },
          { name: "Negotiate the commission", text: `Commission is agreed with the agent and negotiable; our typical ranges run from ${NATIONAL_RANGE} of the sale price across the states. Get it in writing with GST shown.` },
          { name: "Read the listing agreement carefully", text: "Exclusive agency vs sole agency vs auction agreement, terms matter. Read the cancellation clause and the marketing budget commitment." },
          { name: "Agree on a marketing campaign", text: "Photography, copywriting, signboards, online listings, print, brochures. Ask for the budget itemised and capped in the agreement." },
          { name: "Set a realistic reserve and start price", text: "The agent's appraisal is a guide, not gospel. Reserve too high = no buyers; reserve too low = leaves money on the table." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="The biggest decision in your sale">
        <p>
          The agent you pick will probably have more influence on your final
          sale price than anything else you do. Take the interviews seriously,
          challenge the appraisal numbers, and read the agreement carefully
          before signing.
        </p>
      </Callout>

      <h2 id="why-it-matters">Why agent choice matters</h2>
      <p className="lead">
        A great selling agent will get you a higher price, faster, with less
        stress. A mediocre one will list at the wrong price, market lazily, and
        condition you to accept a result well below market. The fee difference
        between agents is usually small next to the difference in sale price.
      </p>
      <p>
        Treat this like hiring a contractor for a major renovation. You
        wouldn&rsquo;t pick the first quote without comparison, and you wouldn&rsquo;t pick
        purely on price. Same logic applies here.
      </p>

      <h2 id="shortlist">How to shortlist agents</h2>
      <p>Before any interviews, build a shortlist of 4 to 6 candidates:</p>
      <ul>
        <li>
          <strong>Search recent sold listings</strong> in your suburb on
          realestate.com.au and domain.com.au (last 6 months). Note which
          agents appear frequently, especially for properties similar to yours.
        </li>
        <li>
          <strong>Look at their photos and copy.</strong> Are the listings
          well-presented? Hero photos, full floor plans, considered video?
          Sloppy listings suggest sloppy campaigns.
        </li>
        <li>
          <strong>Check their sale-vs-quote performance.</strong> Many
          listings show the original price guide and the actual sale price. An
          agent consistently selling above quote is a positive signal; well
          below suggests either a soft market or over-quoting on intake.
        </li>
        <li>
          <strong>Ask neighbours.</strong> Who sold their house? Were they
          happy? In a tight network, anecdotal feedback is gold.
        </li>
        <li>
          <strong>Avoid franchise pressure.</strong> The brand on the
          signboard matters less than the individual agent. Shortlist by
          person, not office.
        </li>
      </ul>

      <p>
        From the shortlist, invite three or four to provide an appraisal and
        listing pitch. To add one more name, you can{" "}
        <Link href="/find-an-expert">find a real estate agent</Link> through
        us: one introduction where we have an agent in your area.
      </p>

      <h2 id="interview">What to ask in the interview</h2>
      <p>
        The interview/appraisal is a one-hour meeting at the property. You&rsquo;re
        evaluating them as much as they&rsquo;re evaluating the property. Specific
        questions to ask:
      </p>

      <h3>Local market</h3>
      <ul>
        <li>What three properties most recently sold in this suburb that are most comparable to mine? Show me.</li>
        <li>What&rsquo;s the days-on-market trend in this suburb over the last quarter?</li>
        <li>What&rsquo;s your auction clearance rate over the last 6 months? (If they recommend auction)</li>
        <li>What types of buyers are active in this suburb right now?</li>
      </ul>

      <h3>Appraisal and pricing</h3>
      <ul>
        <li>What&rsquo;s your appraisal price, and exactly which comparable sales support it?</li>
        <li>Where would you set the price guide if listed for private treaty? For auction reserve?</li>
        <li>What&rsquo;s the most likely sale price range, in your honest assessment?</li>
        <li>If we don&rsquo;t get our target price, what would you recommend, drop the price, change the strategy, or wait?</li>
      </ul>

      <h3>Marketing and process</h3>
      <ul>
        <li>What marketing package do you recommend, and what&rsquo;s the spend?</li>
        <li>What&rsquo;s your campaign timeline (open homes, auction date, etc.)?</li>
        <li>How many opens per week, and for how many weeks?</li>
        <li>Will you be the lead agent on inspections or will it be passed to a junior?</li>
        <li>How do you handle pre-auction offers?</li>
      </ul>

      <h3>Fees and agreement</h3>
      <ul>
        <li>What&rsquo;s your commission rate, and is it negotiable?</li>
        <li>What&rsquo;s the exclusive agency period in your standard agreement?</li>
        <li>What&rsquo;s the tail clause length, and how is &ldquo;introduced&rdquo; defined?</li>
        <li>Are there any fees beyond commission and marketing?</li>
        <li>What happens if I&rsquo;m not happy and want to terminate the agreement early?</li>
      </ul>

      <p>
        Watch how they answer. Specific, evidence-based, and willing to push
        back on assumptions = good signal. Vague, defensive, or bristling at
        being challenged = move on.
      </p>

      <h2 id="appraisal-trap">The appraisal-price trap</h2>
      <p>
        The most common way sellers get hurt: an agent quotes an inflated
        appraisal to win the listing, then progressively conditions the seller
        down once committed.
      </p>

      <KeyFigure
        value="Highest ≠ Best"
        label="The agent with the highest appraisal often isn't the agent who'll get you the highest sale price."
        context="Demand comparable sales evidence, not optimism"
      />

      <p>How it plays out:</p>
      <ol>
        <li>You interview three agents. Two appraise at $1.4M to $1.5M based on comparable sales. One quotes $1.6M, &ldquo;we have buyers waiting&rdquo;.</li>
        <li>You sign with the high quote, hoping to capture the upside.</li>
        <li>First two weeks of opens, agent reports &ldquo;good interest but no firm offers at this level&rdquo;.</li>
        <li>Week 4 they suggest &ldquo;the market&rsquo;s giving us feedback at $1.45M, what would you do at that level?&rdquo;</li>
        <li>Sale settles at $1.42M. Less than the honest agents would have got you, after a longer, more stressful campaign.</li>
      </ol>

      <p>How to avoid it:</p>
      <ul>
        <li><strong>Demand specific comparable sales</strong> for any appraisal. Last 90 days, same suburb, similar property. If they can&rsquo;t show you 3 to 5 supporting sales, the number is fiction.</li>
        <li><strong>Get a second opinion from a buyer&rsquo;s agent or independent valuer</strong> if the appraisals diverge significantly.</li>
        <li><strong>Pay attention to the spread.</strong> If one agent quotes 10%+ above the others without supporting sales, treat it as a sales tactic.</li>
      </ul>

      <h2 id="compare">How to compare real estate agents side by side</h2>
      <p>
        Put the same six things side by side for every agent you interview.
        The comparison does the deciding for you.
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th scope="col">Compare</th>
              <th scope="col">Ask for</th>
              <th scope="col">Good sign</th>
              <th scope="col">Warning sign</th>
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row">Recent local sales</th><td>Their last five sales in your suburb, with the first price guide and the result</td><td>Sales like yours, in your suburb, recently</td><td>Sales across the region but few in your suburb</td></tr>
            <tr><th scope="row">Price evidence</th><td>The three or four comparable sales behind their figure</td><td>Comparable sales that support the number</td><td>A number with no sales behind it, or far above the others</td></tr>
            <tr><th scope="row">Commission</th><td>The rate or fee in writing, with GST shown</td><td>All-in figure, clear about when it is earned</td><td>A rate &ldquo;excluding GST&rdquo; you have to work out yourself</td></tr>
            <tr><th scope="row">Marketing budget</th><td>An itemised budget and a cap</td><td>Each line explained against your property</td><td>A package price with no breakdown</td></tr>
            <tr><th scope="row">Method of sale</th><td>Auction, private treaty or expressions of interest, and why</td><td>A reason tied to your suburb and property</td><td>The same method for every property</td></tr>
            <tr><th scope="row">Reporting</th><td>How often you hear, from whom, and what about</td><td>Weekly written updates and buyer feedback</td><td>&ldquo;We&rsquo;ll keep you posted&rdquo;</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="law">What the law makes an agent tell you</h2>
      <p>
        The rules differ by state. Three of them, as the states&rsquo; own pages
        put them:
      </p>
      <ul>
        <li>
          <strong>New South Wales.</strong> The agency agreement must include
          the agent&rsquo;s estimated selling price, as a single figure or a
          range whose top is no more than 10% above its bottom; you can
          negotiate the commission, fees and expenses; the agreement must warn
          you if commission is payable even when a sale is not completed; and
          you have one business day of cooling-off after signing ({cite(NSW_AGENCY_AGREEMENTS, "NSW Government, Agency agreements")}).
        </li>
        <li>
          <strong>Victoria.</strong> The agent&rsquo;s estimated selling price
          must be reasonable and based on research into comparable properties,
          and the agent must tell you that commission and expenses are
          negotiable ({COMMISSION_RULE_SOURCES.VIC ? `Consumer Affairs Victoria, ${COMMISSION_RULE_SOURCES.VIC.asAt}` : "Consumer Affairs Victoria"}).
          Buyers see a Property Price Statement with a price or a range of up
          to 10%, the three most comparable sales and the suburb median
          ({cite(CAV_PROPERTY_PRICES, "Consumer Affairs Victoria")}).
        </li>
        <li>
          <strong>Queensland.</strong> The government sets no limit on
          commission; it must be set in writing, including GST, when you
          appoint the agent, and the appointment must say whether commission
          may still apply if the sale does not go through ({cite(QLD_COMMISSION, "Queensland Government")}).
        </li>
      </ul>
      <p>
        Our{" "}
        <Link href="/guides/questions-to-ask-a-real-estate-agent">questions to ask a real estate agent</Link>{" "}
        turn these rules into questions for the interview.
      </p>

      <h2 id="fees">Commission and fees</h2>
      <p>
        Commission is agreed with the agent and paid on top of marketing, with
        GST. Our typical ranges, by state:
      </p>
      <ul>
        {COMMISSION_STATES.map((st) => (
          <li key={st}>
            <strong>{STATE_NAMES[st].replace(/^the /, "The ")}:</strong> {STATE_RATES[st].low}% to {STATE_RATES[st].high}%, around {STATE_RATES[st].typical}% common.{" "}
            <Link href={`/guides/real-estate-commission-${st.toLowerCase()}`}>Commission in {st}</Link>
          </li>
        ))}
      </ul>
      <p>
        These are Your Property Guide&rsquo;s typical figures as at September
        2026; each state guide explains its range, and the{" "}
        <Link href="/guides/real-estate-agent-fees-australia">agent fees guide</Link>{" "}
        covers how fee structures work.
      </p>

      <h3>Tiered commission structures</h3>
      <p>
        Some agents propose tiered commission: e.g. 1.5% on sale price up to
        $1M, then 5% on every dollar above $1M. The intent is to align the
        agent&rsquo;s incentive to push for a higher price. The risk is that the
        tier kicks in at a price that&rsquo;s already a stretch, and you end up
        paying more for a marginal uplift.
      </p>
      <p>
        If a tiered structure is offered, push back on where the kicker sits.
        Set it above the realistic appraisal range so it only triggers on
        genuine outperformance.
      </p>

      <h3>What&rsquo;s not in commission</h3>
      <p>Commission usually doesn&rsquo;t include:</p>
      <ul>
        <li>Marketing costs, quoted by the agent and paid separately</li>
        <li>An auctioneer&rsquo;s fee if the property goes to auction</li>
        <li>Your conveyancer or solicitor on the sell side</li>
        <li>Admin or file fees some agencies charge, worth challenging</li>
      </ul>
      <p>
        The <Link href="/selling-costs-calculator">selling costs calculator</Link>{" "}
        puts these beside the commission for your price and state.
      </p>

      <h2 id="marketing">Marketing budget and strategy</h2>
      <p>A standard residential marketing campaign includes:</p>
      <ul>
        <li>Professional photography</li>
        <li>A floor plan</li>
        <li>Online listings on the portals, priced by listing tier</li>
        <li>A signboard</li>
        <li>Printed brochures and a flyer drop</li>
        <li>Optional: a video tour, drone footage, styling or staging</li>
      </ul>
      <p>
        The agent quotes the budget. Ask for every line priced, and agree a
        cap in the agreement. The portal listing tier is often the biggest
        line and the one most worth questioning: an upgraded listing gets
        more placement, and whether that pays depends on your property and
        how much competing stock is listed.
      </p>
      <p>
        Ask the agent specifically: <strong>which line items in this
        marketing budget are most likely to move the sale price?</strong> A
        good agent will have a clear, evidence-based answer.
      </p>

      <h2 id="agreement">The listing agreement</h2>
      <p>
        Read the agreement carefully before signing. Critical clauses:
      </p>

      <h3>Exclusive period</h3>
      <p>
        How long is the agency exclusive? Agree the length before you sign:
        a shorter period gives you a way out sooner if the campaign is not
        working.
      </p>

      <h3>Tail clause</h3>
      <p>
        After the exclusive period ends, for how long is the agent still
        owed commission if a &ldquo;buyer they introduced&rdquo; purchases? Check the
        length, and treat a long tail as something to negotiate. The wording of
        &ldquo;introduced&rdquo; matters, push for a tight definition (e.g. &ldquo;made a
        written offer&rdquo; or &ldquo;attended an inspection during the agency period&rdquo;).
      </p>

      <h3>Marketing commitment</h3>
      <p>
        The agreement should specify exactly what marketing will be delivered
        and at what cost. Avoid open-ended marketing budgets, you should know
        the cap upfront.
      </p>

      <h3>Termination</h3>
      <p>
        What&rsquo;s the termination process if you&rsquo;re not happy? Can you switch
        agents during the exclusive period for serious cause (lack of opens,
        no offers, lack of communication)? Negotiate a clear termination right
        upfront.
      </p>

      <h3>Sole vs general agency</h3>
      <p>
        Almost always go with sole agency, it aligns the agent&rsquo;s incentive to
        actually market the property. General agency tends to result in less
        effort from any individual agent.
      </p>

      <h2 id="references">Checking references</h2>
      <p>
        Ask the agent for 2 or 3 sellers from their last 6 months. Call them
        (don&rsquo;t just email) and ask:
      </p>
      <ul>
        <li>Did the final sale price match the original appraisal?</li>
        <li>How was communication during the campaign? Weekly updates? Returned calls?</li>
        <li>Did the agent push back on your expectations or just tell you what you wanted to hear?</li>
        <li>Were there any surprises in the final invoice?</li>
        <li>Would you use them again?</li>
        <li>Would you recommend them?</li>
      </ul>
      <p>
        Treat any reluctance to provide references as a red flag. Reputable
        agents will have a list of recent sellers happy to speak.
      </p>

      <h2 id="red-flags">Red flags</h2>
      <p>Walk away if:</p>
      <ul>
        <li>The appraisal price is significantly above the others without supporting comparable sales</li>
        <li>The agent dismisses your questions, deflects, or gets defensive when challenged</li>
        <li>They push hard on a marketing package without explaining how each line moves the sale price</li>
        <li>The proposed listing agreement has a long tail clause or vague termination terms</li>
        <li>They can&rsquo;t provide recent comparable sales they personally negotiated</li>
        <li>References are reluctantly provided, vague, or unable to be reached</li>
        <li>They promise specific buyers (&ldquo;I have 5 buyers waiting&rdquo;) without naming them or explaining how they&rsquo;ll be brought through</li>
      </ul>

      <h2 id="decision">Making the decision</h2>
      <p>
        After three or four interviews, you&rsquo;ll usually have a clear front-runner.
        It&rsquo;s typically the agent who:
      </p>
      <ol>
        <li>Quoted a realistic appraisal supported by genuine comparable sales</li>
        <li>Showed deep, current knowledge of your specific suburb</li>
        <li>Was direct and honest in the interview, including pushback on your assumptions</li>
        <li>Has a clear, specific marketing strategy with line-item rationale</li>
        <li>Provided strong references from recent sellers</li>
        <li>Offered a reasonable listing agreement (a short exclusive period, a tight tail clause, clear termination)</li>
      </ol>
      <p>
        Once you&rsquo;ve picked, negotiate the agreement before signing. The most
        common negotiation points: commission rate (especially on higher-value
        properties), marketing package, exclusive period length, and tail
        clause definition.
      </p>

      <Callout variant="info" title="Need help finding the right agent?">
        <p>
          Our{" "}
          <Link href="/appraisal">free property appraisal</Link>{" "}
          service introduces you to one local agent, where we have one in
          your area, to give you an appraisal with the comparable sales behind
          it; where we do not yet have one, we tell you. The agent pays us a
          fee for the introduction. You pay nothing, and there&rsquo;s no
          commitment to list with them.
        </p>
      </Callout>

      <Sources items={CHOOSE_AGENT_SOURCES} />
    </GuideArticleLayout>
    </>
  );
}

const CHOOSE_AGENT_SOURCES: readonly SourceItem[] = [
  { label: NSW_AGENCY_AGREEMENTS.label, href: NSW_AGENCY_AGREEMENTS.href, note: `Updated ${NSW_AGENCY_AGREEMENTS.updated}, read ${NSW_AGENCY_AGREEMENTS.read}` },
  { label: CAV_PROPERTY_PRICES.label, href: CAV_PROPERTY_PRICES.href, note: `Updated ${CAV_PROPERTY_PRICES.updated}, read ${CAV_PROPERTY_PRICES.read}` },
  ...Object.values(COMMISSION_RULE_SOURCES)
    .filter((src) => src.href !== NSW_AGENCY_AGREEMENTS.href)
    .map((src) => ({ label: src.label, href: src.href, note: src.asAt })),
  { label: "Your Property Guide: typical commission by state (STATE_RATES)", href: "/real-estate-commission-calculator", note: "As at September 2026; each state commission guide explains its range" },
];
