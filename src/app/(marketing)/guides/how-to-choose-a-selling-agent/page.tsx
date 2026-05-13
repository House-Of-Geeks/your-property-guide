import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { HowToJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "How to Choose a Selling Agent in Australia (2026)",
  description:
    "A practical guide to picking the right real estate agent to sell your home: how to interview, what questions to ask, the appraisal trap, fee structures, and how to negotiate the listing agreement.",
  slug: "how-to-choose-a-selling-agent",
  publishedAt: "2026-05-06",
  updatedAt: "2026-05-06",
  readingTimeMinutes: 9,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "selling",
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
  "Interview at least 3 agents who actually sell in your suburb. Local knowledge is the single biggest predictor of result.",
  "Don't pick the agent who quotes the highest price. The 'high quote then condition you down' play is one of the most common ways sellers get hurt.",
  "Demand recent comparable sales (last 90 days, same suburb, similar property type) and challenge the appraisal price against them.",
  "Standard commission is 1.5 to 3% of sale price plus marketing costs. The lowest commission isn't automatically best, the right agent earns their fee through a higher sale price.",
  "Read the listing agreement carefully. Watch for: exclusive period length, marketing budget commitments, sole agency vs general agency, and 'tail clauses' that lock you in even after the agreement ends.",
  "References matter. Ask for 2 or 3 sellers from the last 6 months and call them. Ask the questions the agent didn't volunteer.",
];

const TOC: GuideTOCEntry[] = [
  { id: "why-it-matters",   label: "Why agent choice matters" },
  { id: "shortlist",        label: "How to shortlist agents" },
  { id: "interview",        label: "What to ask in the interview" },
  { id: "appraisal-trap",   label: "The appraisal-price trap" },
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
      "A tail clause says that if your property sells to a buyer who was introduced during the agency period, even months after the agreement ends, the original agent is still owed commission. Tail clauses can run 60 to 180 days. That's reasonable in principle but watch the wording: 'introduced' can be defined loosely. Negotiate a tighter definition or shorter tail before signing.",
  },
  {
    question: "Sole agency vs general agency, what's the difference?",
    answer:
      "Sole agency: one agent has the exclusive right to sell during the agency period. They get paid even if you find the buyer yourself. General agency: multiple agents can list the property simultaneously, only the one who finds the buyer earns commission. Sole agency is the norm and aligns the agent's incentive to actually market your property; general agency tends to result in less effort from any individual agent.",
  },
  {
    question: "How much should I spend on marketing?",
    answer:
      "Typically $3,000 to $10,000 for a residential sale: professional photography, a videography pass, online listing on realestate.com.au and domain.com.au, signboard, and printed brochures. Above $10,000 you're into premium photography, drone, video tour, and broader print spend. Marketing is paid by the seller separately from commission. Be wary of agents who push you toward expensive marketing packages, ask what specific spend will move your sale price.",
  },
  {
    question: "Can I negotiate the commission rate?",
    answer:
      "Yes, especially if you're getting a 3% quote. The market range is typically 1.5 to 3% of sale price; below 2% is achievable in most metro areas, particularly for higher-value properties. The trade-off: cutting commission too aggressively can reduce the agent's incentive to push for a higher price. A 0.5pp commission difference on a $1M sale is $5,000, an extra 2% on the sale price is $20,000. Pick the agent who'll get you the higher price, then negotiate the fee.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Real Estate Agent Fees in Australia", href: "/guides/real-estate-agent-fees-australia", description: "Detailed breakdown of commission structures across states." },
  { title: "Property Auction Guide",              href: "/guides/property-auction-guide",            description: "How auctions actually run, and what to expect from your agent on auction day." },
  { title: "Free Property Appraisal",             href: "/appraisal",                                description: "An independent appraisal from a vetted local agent, no commitment." },
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
          { name: "Negotiate the commission", text: "Standard residential commission is 1.5% to 3% depending on state and price. Higher prices and more straightforward sales attract lower rates." },
          { name: "Read the listing agreement carefully", text: "Exclusive agency vs sole agency vs auction agreement, terms matter. Read the cancellation clause and the marketing budget commitment." },
          { name: "Agree on a marketing campaign", text: "Photography, copywriting, signboards, online listings, print, brochures. Marketing typically runs $3K to $15K depending on property and strategy." },
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
        between agents is small; the price difference can be five to ten times
        the fee.
      </p>
      <p>
        Treat this like hiring a contractor for a major renovation. You
        wouldn't pick the first quote without comparison, and you wouldn't pick
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
        listing pitch.
      </p>

      <h2 id="interview">What to ask in the interview</h2>
      <p>
        The interview/appraisal is a one-hour meeting at the property. You're
        evaluating them as much as they're evaluating the property. Specific
        questions to ask:
      </p>

      <h3>Local market</h3>
      <ul>
        <li>What three properties most recently sold in this suburb that are most comparable to mine? Show me.</li>
        <li>What's the days-on-market trend in this suburb over the last quarter?</li>
        <li>What's your auction clearance rate over the last 6 months? (If they recommend auction)</li>
        <li>What types of buyers are active in this suburb right now?</li>
      </ul>

      <h3>Appraisal and pricing</h3>
      <ul>
        <li>What's your appraisal price, and exactly which comparable sales support it?</li>
        <li>Where would you set the price guide if listed for private treaty? For auction reserve?</li>
        <li>What's the most likely sale price range, in your honest assessment?</li>
        <li>If we don't get our target price, what would you recommend, drop the price, change the strategy, or wait?</li>
      </ul>

      <h3>Marketing and process</h3>
      <ul>
        <li>What marketing package do you recommend, and what's the spend?</li>
        <li>What's your campaign timeline (open homes, auction date, etc.)?</li>
        <li>How many opens per week, and for how many weeks?</li>
        <li>Will you be the lead agent on inspections or will it be passed to a junior?</li>
        <li>How do you handle pre-auction offers?</li>
      </ul>

      <h3>Fees and agreement</h3>
      <ul>
        <li>What's your commission rate, and is it negotiable?</li>
        <li>What's the exclusive agency period in your standard agreement?</li>
        <li>What's the tail clause length, and how is "introduced" defined?</li>
        <li>Are there any fees beyond commission and marketing?</li>
        <li>What happens if I'm not happy and want to terminate the agreement early?</li>
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
        <li>You interview three agents. Two appraise at $1.4M to $1.5M based on comparable sales. One quotes $1.6M, "we have buyers waiting".</li>
        <li>You sign with the high quote, hoping to capture the upside.</li>
        <li>First two weeks of opens, agent reports "good interest but no firm offers at this level".</li>
        <li>Week 4 they suggest "the market's giving us feedback at $1.45M, what would you do at that level?"</li>
        <li>Sale settles at $1.42M. Less than the honest agents would have got you, after a longer, more stressful campaign.</li>
      </ol>

      <p>How to avoid it:</p>
      <ul>
        <li><strong>Demand specific comparable sales</strong> for any appraisal. Last 90 days, same suburb, similar property. If they can't show you 3 to 5 supporting sales, the number is fiction.</li>
        <li><strong>Get a second opinion from a buyer's agent or independent valuer</strong> if the appraisals diverge significantly.</li>
        <li><strong>Pay attention to the spread.</strong> If one agent quotes 10%+ above the others without supporting sales, treat it as a sales tactic.</li>
      </ul>

      <h2 id="fees">Commission and fees</h2>
      <p>
        Commission is typically <strong>1.5% to 3%</strong> of the final sale
        price, plus GST. The range is wide, with major variation by region:
      </p>
      <ul>
        <li><strong>Sydney metro:</strong> 1.5% to 2.2% on most sales. Higher-value properties (above $2M) often negotiate to 1.5% or below.</li>
        <li><strong>Melbourne metro:</strong> Similar, 1.5% to 2.2%.</li>
        <li><strong>Brisbane, Perth, Adelaide metro:</strong> 2% to 2.8% common.</li>
        <li><strong>Regional areas:</strong> 2.5% to 3% common, sometimes higher in low-volume markets.</li>
      </ul>
      <p>
        See our{" "}
        <Link href="/guides/real-estate-agent-fees-australia">Agent Fees guide</Link>{" "}
        for the full state-by-state breakdown.
      </p>

      <h3>Tiered commission structures</h3>
      <p>
        Some agents propose tiered commission: e.g. 1.5% on sale price up to
        $1M, then 5% on every dollar above $1M. The intent is to align the
        agent's incentive to push for a higher price. The risk is that the
        tier kicks in at a price that's already a stretch, and you end up
        paying more for a marginal uplift.
      </p>
      <p>
        If a tiered structure is offered, push back on where the kicker sits.
        Set it above the realistic appraisal range so it only triggers on
        genuine outperformance.
      </p>

      <h3>What's not in commission</h3>
      <p>Commission usually doesn't include:</p>
      <ul>
        <li>Marketing costs ($3K to $10K typical, paid separately)</li>
        <li>Auctioneer fee if going to auction ($500 to $1,500)</li>
        <li>Conveyancing on the sell side ($1K to $2K)</li>
        <li>Some agencies charge admin/file fees ($300 to $800), worth challenging</li>
      </ul>

      <h2 id="marketing">Marketing budget and strategy</h2>
      <p>A standard residential marketing campaign includes:</p>
      <ul>
        <li>Professional photography (10 to 20 shots), $400 to $800</li>
        <li>Floor plan, $200 to $400</li>
        <li>Online listing on realestate.com.au and domain.com.au, $1,500 to $4,000+ depending on tier (highlight, premier, etc.)</li>
        <li>Signboard, $200 to $500</li>
        <li>Printed brochures and flyer drop, $300 to $1,000</li>
        <li>Optional: video tour ($500 to $1,500), drone footage ($300 to $700), styling/staging ($2,000 to $8,000)</li>
      </ul>
      <p>
        Total typical spend: <strong>$3,000 to $10,000</strong> for an
        unstaged campaign, $5,000 to $15,000 with staging.
      </p>
      <p>
        The realestate.com.au listing tier is usually the biggest line item
        and the one with the most ROI debate. "Premier" or "Highlight"
        listings get top placement and more views, but cost a lot more than
        standard. For a $1M+ property in a competitive area, the upgraded
        listing is usually justified. For a $500K property in a soft market,
        it may be over-spend.
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
        How long is the agency exclusive? 60 days is typical for a campaign;
        90 days is on the long side. Avoid anything beyond 90 days for an
        established home.
      </p>

      <h3>Tail clause</h3>
      <p>
        After the exclusive period ends, for how long is the agent still
        owed commission if a "buyer they introduced" purchases? 60 to 90 days
        is typical; some agreements have 180+ day tails. The wording of
        "introduced" matters, push for a tight definition (e.g. "made a
        written offer" or "attended an inspection during the agency period").
      </p>

      <h3>Marketing commitment</h3>
      <p>
        The agreement should specify exactly what marketing will be delivered
        and at what cost. Avoid open-ended marketing budgets, you should know
        the cap upfront.
      </p>

      <h3>Termination</h3>
      <p>
        What's the termination process if you're not happy? Can you switch
        agents during the exclusive period for serious cause (lack of opens,
        no offers, lack of communication)? Negotiate a clear termination right
        upfront.
      </p>

      <h3>Sole vs general agency</h3>
      <p>
        Almost always go with sole agency, it aligns the agent's incentive to
        actually market the property. General agency tends to result in less
        effort from any individual agent.
      </p>

      <h2 id="references">Checking references</h2>
      <p>
        Ask the agent for 2 or 3 sellers from their last 6 months. Call them
        (don't just email) and ask:
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
        <li>The proposed listing agreement has long tail clauses (180+ days) or vague termination terms</li>
        <li>They can't provide recent comparable sales they personally negotiated</li>
        <li>References are reluctantly provided, vague, or unable to be reached</li>
        <li>They promise specific buyers ("I have 5 buyers waiting") without naming them or explaining how they'll be brought through</li>
      </ul>

      <h2 id="decision">Making the decision</h2>
      <p>
        After three or four interviews, you'll usually have a clear front-runner.
        It's typically the agent who:
      </p>
      <ol>
        <li>Quoted a realistic appraisal supported by genuine comparable sales</li>
        <li>Showed deep, current knowledge of your specific suburb</li>
        <li>Was direct and honest in the interview, including pushback on your assumptions</li>
        <li>Has a clear, specific marketing strategy with line-item rationale</li>
        <li>Provided strong references from recent sellers</li>
        <li>Offered a reasonable listing agreement (60 to 90 day exclusive, tight tail clause, clear termination)</li>
      </ol>
      <p>
        Once you've picked, negotiate the agreement before signing. The most
        common negotiation points: commission rate (especially on higher-value
        properties), marketing package, exclusive period length, and tail
        clause definition.
      </p>

      <Callout variant="info" title="Need help finding the right agent?">
        <p>
          Our{" "}
          <Link href="/appraisal">free property appraisal</Link>{" "}
          service connects you with vetted local agents who'll provide an
          honest appraisal with comparable sales evidence. No commitment to
          list with them.
        </p>
      </Callout>
    </GuideArticleLayout>
    </>
  );
}
