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
import { HowToJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "How to Prepare for a Property Appraisal (2026): What Agents Look For",
  description:
    "How to prepare for a property appraisal: what agents assess in the walkthrough, what to clean and fix beforehand, the paperwork to have ready, how to spot an inflated appraisal, and the difference between an appraisal and a bank valuation.",
  slug: "how-to-prepare-for-a-property-appraisal",
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
  "A property appraisal is a free opinion of likely sale price from a local agent, not a formal valuation. Get two or three and judge each on the comparable sales behind it, not the size of the number.",
  "Presentation moves the estimate. A deep clean, a serious declutter and fixing the small, cheap defects is enough. You do not need to renovate for an appraisal.",
  "Have your paperwork ready: council rates notice, floor plans, renovation and building approvals, and rental statements if the property is an investment. It makes the estimate sharper and signals you're a serious seller.",
  "Treat the walkthrough as a two-way interview. You're assessing the agent as much as they're assessing the house, so ask for the comparable sales, the pricing logic and the fee structure in writing.",
  "Beware the inflated appraisal. An agent quoting well above the others without comparable sales evidence is usually buying the listing, and it costs sellers real money over the campaign.",
  "An appraisal is not a bank valuation. The buyer's lender will order its own formal valuation later, done by a certified valuer, and it tends to be more conservative than agent estimates.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is-an-appraisal",  label: "What a property appraisal is" },
  { id: "appraisal-vs-valuation",label: "Appraisal vs bank valuation" },
  { id: "what-agents-look-at",   label: "What agents actually assess" },
  { id: "presentation",          label: "What to clean, fix and declutter" },
  { id: "paperwork",             label: "Paperwork to have ready" },
  { id: "the-conversation",      label: "How to handle the conversation" },
  { id: "inflated-appraisals",   label: "The inflated-appraisal trap" },
  { id: "checklist",             label: "Pre-appraisal checklist" },
  { id: "next-steps",            label: "After the appraisal" },
];

const FAQS: FaqItem[] = [
  {
    question: "Is a property appraisal free?",
    answer:
      "Yes. A market appraisal from a real estate agent is free, because the agent provides it hoping to win your listing. There is no obligation to sell, or to sell with that agent. A formal valuation is different: it's a paid, legally recognised assessment by a certified valuer, typically costing a few hundred dollars for a standard home (commonly quoted in the $300 to $600 range, more for complex or rural properties). Most sellers only need agent appraisals; formal valuations are used for lending, family law, tax and deceased estates.",
  },
  {
    question: "How long does a property appraisal take?",
    answer:
      "Usually 30 to 60 minutes. The agent walks through the property, asks about renovations, timing and your reasons for selling, then talks you through recent comparable sales and their pricing view. Some agents give a range on the spot; better ones follow up within a day or two with a written appraisal that lists the comparable sales supporting it. If an agent quotes a number in the first five minutes without seeing the whole property or referencing a single comparable sale, treat that number with suspicion.",
  },
  {
    question: "Should I renovate before getting an appraisal?",
    answer:
      "No. An appraisal is the wrong trigger for renovation. Clean, declutter and fix small defects, but hold off on anything structural or expensive until you've heard what agents actually say. A good agent will tell you which improvements would pay for themselves in your suburb and which would return cents on the dollar, and that advice is far more reliable than guessing. Many sellers spend thousands on works that don't move the sale price at all, when a professional clean and a garden tidy would have done the job.",
  },
  {
    question: "How accurate is a real estate agent's appraisal?",
    answer:
      "It's an informed opinion, not a guarantee, and accuracy depends entirely on the evidence behind it. An appraisal built on three to five genuinely comparable recent sales in your suburb is usually a solid guide to the likely range. One built on optimism is not. In NSW, agents must put an estimated selling price in the agency agreement and be able to justify it with evidence, and if it's a range, the top can't exceed the bottom by more than 10 per cent. In Victoria, advertised prices can't be below the agent's own estimate. The best accuracy check is simple: get two or three appraisals and compare the evidence, not the numbers.",
  },
  {
    question: "What is the difference between an appraisal and a valuation?",
    answer:
      "An appraisal is a free estimate of likely sale price from a real estate agent. It has no legal standing and is really a market opinion plus a pitch for your listing. A valuation is a formal, paid assessment by a certified valuer, and it's the document banks, courts and the ATO rely on. When your eventual buyer applies for their home loan, their lender orders its own valuation of your property, and lender valuations tend to be conservative compared with agent appraisals. That gap matters: if a buyer's valuation comes in below the agreed price, their finance can fall short.",
  },
  {
    question: "How many appraisals should I get before selling?",
    answer:
      "Two or three. One appraisal gives you a number with nothing to compare it against, and any single agent has an incentive to tell you what wins the listing. Three appraisals from agents who genuinely sell in your suburb give you a credible range, a feel for how each agent works, and negotiating leverage on commission. Queensland's government guidance says the same thing: ask two or three agents to inspect the home before appointing anyone. If the three numbers land close together, you can trust the range. If one is far above the rest, ask for the evidence.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Free Property Appraisal",             href: "/appraisal",                                   description: "An independent appraisal from a vetted local agent, no commitment to list." },
  { title: "How to Choose a Selling Agent",       href: "/guides/how-to-choose-a-selling-agent",        description: "The interview process, the appraisal-price trap, and what to negotiate." },
  { title: "How Much Is My House Worth?",         href: "/guides/how-much-is-my-house-worth-australia", description: "The three ways to value a home and how to land on a figure you can trust." },
  { title: "Cost of Selling a House",             href: "/guides/cost-of-selling-a-house-australia",    description: "Every fee from commission to conveyancing, with a worked example." },
  { title: "Commission Calculator",               href: "/real-estate-commission-calculator",           description: "What an agent costs on your sale price, by state." },
  { title: "Free Selling Guide (PDF)",            href: "/selling-guide",                               description: "The full process from appraisal to settlement, personalised to your suburb." },
];

export default function HowToPrepareForAPropertyAppraisalPage() {
  return (
    <>
      <HowToJsonLd
        name="How to prepare for a property appraisal"
        description="The seven-step process for preparing your home and yourself before a real estate agent's market appraisal."
        url={`/guides/${FRONTMATTER.slug}`}
        steps={[
          { name: "Book two or three appraisals", text: "Choose agents who have recently sold properties like yours in your suburb. Comparing appraisals is the only reliable accuracy check." },
          { name: "Gather your paperwork", text: "Council rates notice, floor plans, building and renovation approvals, and rental statements if the property is an investment." },
          { name: "Deep clean and declutter", text: "Clear benches, wardrobes and floors so rooms read at full size. Air the house and deal with pet and damp smells." },
          { name: "Fix small, cheap defects", text: "Dripping taps, blown bulbs, squeaky doors, cracked tiles and scuffed walls. Skip renovations until an agent tells you what pays." },
          { name: "Do your own price research", text: "Look up recent comparable sales in your suburb so you can challenge the appraisal against real evidence." },
          { name: "Run the walkthrough like an interview", text: "Ask for comparable sales, pricing logic, marketing strategy and fees. You're auditioning the agent, not just the price." },
          { name: "Compare appraisals on evidence, not size", text: "The highest number is often a listing-winning tactic. Trust the appraisal with the strongest comparable sales behind it." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="An appraisal is an opinion, not a valuation">
        <p>
          A market appraisal from an agent is free, informal and has no legal
          standing. It&rsquo;s also a pitch for your listing. Get more than one,
          ask for the evidence behind every number, and remember your
          buyer&rsquo;s bank will form its own, usually more conservative, view
          later.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The appraisal is where most sales quietly go right or wrong, weeks
          before anything is listed. Sellers treat it as a free price check
          when it&rsquo;s really two things at once: the number that anchors
          your whole campaign, and your first interview with the person
          who&rsquo;ll run it. An hour of preparation, a tidy house, a folder
          of paperwork, three comparable sales you found yourself, changes both.
        </p>
      </EditorNote>

      <h2 id="what-is-an-appraisal">What a property appraisal is (and isn&rsquo;t)</h2>
      <p className="lead">
        A property appraisal is a real estate agent&rsquo;s estimate of what
        your home would likely sell for in the current market. The agent walks
        through the property, usually for 30 to 60 minutes, compares it against
        recent sales of similar homes nearby, and gives you a price or a range.
      </p>
      <p>
        It costs nothing and commits you to nothing. Agents provide appraisals
        free because it&rsquo;s how they win listings, which is exactly why you
        should hear from two or three of them rather than one. It also means
        the number arrives with an incentive attached: every agent in your
        living room wants to be the one who sells your house.
      </p>

      <KeyFigure
        value="$0"
        label="What an agent's market appraisal costs you. A formal valuation by a certified valuer is a paid report, typically a few hundred dollars."
        context="Free, no obligation, and deliberately competitive when you book more than one"
      />

      <h2 id="appraisal-vs-valuation">Appraisal vs bank valuation</h2>
      <p>
        Sellers mix these up constantly, and the difference matters at both
        ends of the sale.
      </p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Agent appraisal</th>
            <th>Formal (bank) valuation</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Who does it</td><td>A local real estate agent</td><td>A certified, independent valuer</td></tr>
          <tr><td>Cost</td><td>Free</td><td>Commonly $300 to $600 for a standard home; more for complex, rural or high-value properties</td></tr>
          <tr><td>Legal standing</td><td>None, it&rsquo;s a market opinion</td><td>A formal report relied on by lenders, courts and the ATO</td></tr>
          <tr><td>Used for</td><td>Deciding whether and how to sell, and at what price to list</td><td>Home loans, refinancing, family law, tax and deceased estates</td></tr>
          <tr><td>Typical tone</td><td>Optimistic, it doubles as a listing pitch</td><td>Conservative, the valuer carries liability for the number</td></tr>
        </tbody>
      </table>

      <p>
        The distinction bites twice. First, before listing: if you need a
        legally defensible figure, for a property settlement, a deceased
        estate or capital gains tax, an agent appraisal won&rsquo;t do, you
        need a valuer. Second, after you accept an offer: your buyer&rsquo;s
        lender will order its own valuation of your property before approving
        their loan. Lender valuations are typically more conservative than
        agent appraisals, and if the valuation lands below the agreed price,
        the buyer&rsquo;s finance can fall short and the deal can wobble. A
        realistic appraisal at the start reduces that risk at the end.
      </p>

      <Callout variant="info" title="Want a number without the sales pitch pressure?">
        <p>
          Our <Link href="/appraisal">free property appraisal</Link> service
          connects you with a vetted local agent who provides an honest
          appraisal backed by comparable sales evidence. No obligation to list,
          no lock-in.
        </p>
      </Callout>

      <h2 id="what-agents-look-at">What agents actually assess</h2>
      <p>
        Knowing what the agent is scoring helps you prepare the right things
        and ignore the rest. In the walkthrough, an experienced agent is
        weighing:
      </p>
      <ul>
        <li><strong>Location and street position.</strong> Proximity to schools, transport and shops, plus the micro stuff: which side of the street, traffic noise, what&rsquo;s next door.</li>
        <li><strong>Land, aspect and orientation.</strong> Block size, north-facing living areas, usable yard versus steep slope.</li>
        <li><strong>Layout and light.</strong> Bedroom and bathroom count matter, but so does flow: open living, indoor-outdoor connection, natural light through the main rooms.</li>
        <li><strong>Kitchens and bathrooms.</strong> The two rooms buyers pay for. Age and condition here move the estimate more than anywhere else.</li>
        <li><strong>Condition and maintenance.</strong> Visible defects, damp, cracked walls, roof condition, and the general sense of whether the home has been cared for.</li>
        <li><strong>Improvements and approvals.</strong> Renovations, extensions, decks and granny flats, and whether they were council-approved (more on this below).</li>
        <li><strong>Parking and storage.</strong> Garaging, off-street parking, sheds, built-ins.</li>
        <li><strong>The market around you.</strong> Recent comparable sales, current competing listings, days on market in your suburb, and what buyer demand looks like right now.</li>
      </ul>
      <p>
        The last item is where the real pricing work happens. Everything about
        your property gets translated into a comparison against what similar
        homes nearby actually sold for recently, which is why a credible
        written appraisal always lists its comparable sales.
      </p>
      <p>
        This isn&rsquo;t just professional habit, in most states it&rsquo;s
        law. In NSW, an agent must include an estimated selling price in the
        agency agreement, be able to justify it with evidence, and if
        it&rsquo;s a range, the top can&rsquo;t exceed the bottom by more than
        10 per cent. In Victoria, agents must prepare a Statement of
        Information for every advertised residential listing showing the three
        most comparable sales, and can&rsquo;t advertise below their own
        estimate. In Queensland, the commission and the appointment must be
        set in writing before the agent acts for you. An agent who
        can&rsquo;t show you comparable sales at appraisal stage will struggle
        to meet those obligations later.
      </p>

      <h2 id="presentation">What to clean, fix and declutter before the walkthrough</h2>
      <p>
        An appraisal is not an open home, and a good agent can see through
        everyday mess. But first impressions anchor estimates, agents are
        human, and a home that presents well makes the top of the range easier
        to defend. The other reason to prepare: the walkthrough is a preview of
        how your home will show to buyers, and the agent&rsquo;s feedback is
        more useful when the basics are already done.
      </p>

      <h3>Clean</h3>
      <ul>
        <li>Deep clean kitchens and bathrooms: grout, glass, taps, oven fronts. These two rooms carry the estimate.</li>
        <li>Windows inside and out. Light is one of the cheapest value signals there is.</li>
        <li>Floors done properly: carpets vacuumed (steam clean if tired), hard floors mopped.</li>
        <li>Air the house the morning of the visit. Deal with pet, damp and cooking smells honestly, mask them and an experienced agent will wonder what else is masked.</li>
      </ul>

      <h3>Declutter</h3>
      <ul>
        <li>Clear kitchen benches to two or three items. Benches read as workspace, and clutter shrinks them.</li>
        <li>Half-empty wardrobes and cupboards. Agents open them, and packed storage says &ldquo;not enough storage&rdquo;.</li>
        <li>Remove bulky furniture that chokes walkways. Rooms should read at full size.</li>
        <li>Tidy the garage and yard: lawns mown, edges done, dead plants gone, bins out of sight.</li>
      </ul>

      <h3>Fix (small and cheap only)</h3>
      <ul>
        <li>Dripping taps, running toilets, blown bulbs, squeaky hinges, sticking doors.</li>
        <li>Cracked tiles, missing grout, scuffed walls and chipped paint in high-traffic spots.</li>
        <li>Broken fence palings, wobbly gates, cracked pavers, the things a buyer&rsquo;s building inspector would list.</li>
      </ul>
      <p>
        What not to do: renovate. Don&rsquo;t re-do a kitchen, repaint the
        whole house or landscape the yard for an appraisal. Ask each agent
        which improvements would actually pay for themselves in your suburb,
        and which won&rsquo;t. That advice, from someone who watches buyers
        react to homes like yours every weekend, is one of the most valuable
        free things you&rsquo;ll get from the process. Our{" "}
        <Link href="/guides/how-to-sell-a-house-australia">how to sell a house guide</Link>{" "}
        covers which presentation spend earns its keep.
      </p>

      <h2 id="paperwork">Paperwork to have ready</h2>
      <p>
        A folder of documents does two things: it sharpens the appraisal,
        because the agent is estimating with facts instead of guesses, and it
        signals you&rsquo;re a genuine seller worth an agent&rsquo;s best work.
        Pull together:
      </p>
      <ul>
        <li><strong>Council rates notice.</strong> Confirms land size and official land value, and the agent will ask for it anyway.</li>
        <li><strong>Floor plan and title documents.</strong> A floor plan from when you bought is fine. Title confirms lot size and any easements or covenants that affect value.</li>
        <li><strong>Building and renovation approvals.</strong> Council approval or certification for extensions, decks, pools, garage conversions and granny flats. Approved works add value; unapproved works can subtract it, complicate the contract, and spook buyers at inspection stage. If something isn&rsquo;t approved, tell the agent now, not after the campaign starts.</li>
        <li><strong>Recent building, pest or strata reports</strong> if you have them, plus warranties for major items (roof, hot water, solar).</li>
        <li><strong>A list of improvements</strong> with rough dates and costs: rewiring, replumbing, new roof, insulation, the invisible spend a walkthrough can&rsquo;t see.</li>
        <li><strong>For investment properties: rental history.</strong> Current lease, rent amount, rental statements and vacancy history. Investor buyers price on yield, and a documented rental record widens your buyer pool. Keep every selling receipt too, selling costs generally feed into the capital gains tax calculation on an investment, per the ATO.</li>
        <li><strong>For units and townhouses: strata details.</strong> Quarterly levies, recent AGM minutes, and any special levies struck or looming. Agents (and buyers) will find out regardless.</li>
      </ul>

      <h2 id="the-conversation">How to handle the conversation</h2>
      <p>
        The walkthrough runs in both directions. The agent is assessing your
        property and how motivated you are; you should be assessing whether
        this is the person you&rsquo;d trust with the biggest transaction most
        households ever make.
      </p>
      <p>Ask every agent the same set of questions so the answers compare cleanly:</p>
      <ul>
        <li>Which three recent sales is this appraisal based on? Show me.</li>
        <li>Where would you set the price guide, and what would you expect it to sell for honestly?</li>
        <li>What would you change or fix before listing, and what would you leave alone?</li>
        <li>How long are similar homes taking to sell here right now?</li>
        <li>What&rsquo;s your commission and marketing cost, in writing?</li>
      </ul>
      <p>
        On your side: be straight about your timeframe and reasons for
        selling, because they genuinely change the strategy, but don&rsquo;t
        volunteer your bottom-line price at appraisal stage. &ldquo;We&rsquo;re
        testing the market and speaking with a few agents&rdquo; is honest and
        keeps the tension where it belongs. Commission is negotiable in every
        state, and knowing the dollar figure before the conversation helps:
        run your likely price through the{" "}
        <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
        first. And always ask for the appraisal in writing with the comparable
        sales listed. Agents who are confident in their number put it on paper.
      </p>
      <p>
        If the appraisal goes well, the same meeting often becomes the first
        agent interview. Our{" "}
        <Link href="/guides/how-to-choose-a-selling-agent">guide to choosing a selling agent</Link>{" "}
        covers the full interview and what to negotiate in the agency
        agreement before you sign anything.
      </p>

      <MatchCTA kind="selling-agent" />

      <h2 id="inflated-appraisals">The inflated-appraisal trap (&ldquo;buying the listing&rdquo;)</h2>
      <p>
        The most expensive mistake at appraisal stage is picking the biggest
        number. Some agents deliberately quote above the realistic range to
        win the listing, then spend the campaign &ldquo;conditioning&rdquo;
        you down toward the price the honest agents quoted at the start. You
        lose weeks, momentum, and often money: a stale, overpriced listing
        attracts lowball offers.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        The appraisal that flatters you most is usually the one costing you
        most. Trust the number with the strongest evidence behind it, not the
        biggest one on the table.
      </PullQuote>

      <p>Red flags that an appraisal is a listing-winning tactic rather than a market read:</p>
      <ul>
        <li>The number sits well above the other appraisals with no comparable sales to support it</li>
        <li>The &ldquo;comparables&rdquo; offered are from a different suburb, a much better street, or six-plus months ago in a moving market</li>
        <li>&ldquo;I have buyers waiting at this price&rdquo; with no specifics on who or how they&rsquo;ll be brought through</li>
        <li>Pressure to sign the agency agreement on the spot, before you&rsquo;ve seen anything in writing</li>
        <li>Vague or dodging answers on days-on-market and recent results when you push</li>
      </ul>
      <p>
        The defence is structural, not clever: get two or three appraisals,
        demand the comparable sales behind each, and do your own research on
        recent sales in your suburb before anyone walks through the door. If
        one number is 10 per cent or more above the pack without evidence,
        treat it as marketing. The underquoting rules in NSW and Victoria
        exist precisely because price estimates get bent for commercial
        reasons, in both directions.
      </p>

      <h2 id="checklist">Pre-appraisal checklist</h2>
      <p>
        Print this, or screenshot it. Everything above, compressed into the
        order you&rsquo;d actually do it.
      </p>

      <h3>A week out</h3>
      <ul>
        <li>Book 2 to 3 appraisals with agents who recently sold similar homes in your suburb</li>
        <li>Look up 3 to 5 recent comparable sales yourself</li>
        <li>Start the declutter: benches, wardrobes, garage, yard</li>
        <li>Book a carpet steam clean if carpets are tired</li>
        <li>Fix the small stuff: taps, bulbs, hinges, cracked tiles, scuffed paint</li>
      </ul>

      <h3>The day before</h3>
      <ul>
        <li>Deep clean kitchen and bathrooms, windows, floors</li>
        <li>Mow, edge, sweep, hide the bins</li>
        <li>Assemble the paperwork folder (list below)</li>
        <li>Write down your questions so you ask every agent the same ones</li>
      </ul>

      <h3>On the day</h3>
      <ul>
        <li>Open curtains and blinds, turn on lamps in dark rooms</li>
        <li>Air the house; take pets (and pet bowls and beds) out if you can</li>
        <li>Clear benches and floors of daily clutter</li>
        <li>Be ready to talk timeframe and motivation, but keep your bottom-line price to yourself</li>
      </ul>

      <h3>The paperwork folder</h3>
      <ul>
        <li>Council rates notice</li>
        <li>Floor plan and title documents</li>
        <li>Building/renovation approvals and certificates</li>
        <li>List of improvements with dates and approximate costs</li>
        <li>Recent building, pest or strata reports and major warranties</li>
        <li>Investment property: lease, rent statements, vacancy history</li>
        <li>Unit or townhouse: strata levies and recent AGM minutes</li>
      </ul>

      <h2 id="next-steps">After the appraisal</h2>
      <p>
        Once the appraisals are in, the work is comparison, not celebration:
      </p>
      <ol>
        <li>
          <strong>Line up the evidence.</strong> Put the written appraisals
          side by side and compare the comparable sales, not the headline
          numbers. Our{" "}
          <Link href="/guides/how-much-is-my-house-worth-australia">how much is my house worth guide</Link>{" "}
          covers how to sanity-check a range yourself.
        </li>
        <li>
          <strong>Size the costs.</strong> Commission, marketing, conveyancing
          and the rest, the{" "}
          <Link href="/guides/cost-of-selling-a-house-australia">cost of selling guide</Link>{" "}
          walks through every line so the net figure doesn&rsquo;t surprise you.
        </li>
        <li>
          <strong>Choose the agent, not the number.</strong> The{" "}
          <Link href="/guides/how-to-choose-a-selling-agent">choosing a selling agent guide</Link>{" "}
          covers references, agreements and the negotiation.
        </li>
        <li>
          <strong>Get the full playbook.</strong> The free{" "}
          <Link href="/selling-guide">selling guide</Link> covers the whole
          journey from appraisal to settlement, personalised to your suburb.
        </li>
      </ol>

      <Callout variant="info" title="Ready for an honest number?">
        <p>
          Start with a{" "}
          <Link href="/appraisal">free property appraisal</Link> from a vetted
          local agent, backed by comparable sales evidence and with no
          obligation to list. Or{" "}
          <Link href="/find-an-expert">find a local expert</Link> if
          you&rsquo;d rather browse agents in your area first.
        </p>
      </Callout>

      <Sources items={APPRAISAL_PREP_SOURCES} />
    </GuideArticleLayout>
    </>
  );
}

const APPRAISAL_PREP_SOURCES: readonly SourceItem[] = [
  { label: "NSW Government: Price estimation and underquoting when selling a property", href: "https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/selling-a-property/price-estimation-and-underquoting", note: "Estimated selling price rules, evidence requirements and the 10% range cap" },
  { label: "Consumer Affairs Victoria: Understanding property prices and underquoting", href: "https://www.consumer.vic.gov.au/housing/buying-and-selling-property/understanding-property-prices-and-underquoting-for-buyers", note: "Statement of Information and the three comparable sales requirement" },
  { label: "Queensland Government: Commissions and costs when selling a home", href: "https://www.qld.gov.au/law/housing-and-neighbours/buying-and-selling-a-property/selling-a-home/before-you-put-your-home-on-the-market/commissions-and-costs", note: "Written commission agreements and comparing multiple agents" },
  { label: "Cotality (formerly CoreLogic): What is my property worth", href: "https://www.cotality.com/au/insights/articles/what-is-my-property-worth-a-definitive-australian-guide-to-discovering-your-homes-value", note: "Agent appraisals vs certified valuations and how value estimates work" },
  { label: "Australian Taxation Office: Capital gains tax", href: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax", note: "Selling costs and the CGT cost base on investment property" },
];
