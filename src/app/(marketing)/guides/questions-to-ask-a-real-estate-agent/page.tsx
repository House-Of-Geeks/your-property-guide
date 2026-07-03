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
  title: "23 Questions to Ask a Real Estate Agent Before You List (2026)",
  description:
    "The questions to ask a real estate agent when selling: comparable sales, sale method, commission and marketing costs, the agency agreement, buyer qualification and what happens if it doesn't sell — with what a good answer sounds like versus an evasive one.",
  slug: "questions-to-ask-a-real-estate-agent",
  publishedAt: "2026-07-03",
  updatedAt: "2026-07-03",
  readingTimeMinutes: 11,
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
  "Never sign an agency agreement at the first meeting. Take the agreement home, compare at least three agents, and put every answer you're given in writing.",
  "The three questions that expose a weak agent fastest: which comparable sales support your price estimate, what's your personal (not office-wide) track record in this suburb, and what's the plan if the property doesn't sell.",
  "Commission is negotiable everywhere in Australia. No state sets or caps the rate, so 'that's our standard rate' is a sales line, not a fact. Typical range is 1.5 to 3% plus GST.",
  "Ask who pays marketing if the property doesn't sell. Vendor-paid advertising is generally payable whether or not you get a result, so get the budget capped in writing.",
  "Agreement mechanics matter as much as the pitch: exclusive period length, tail clause wording and how you exit. Queensland caps sole and exclusive appointments at 90 days; NSW gives one business day of cooling-off; Victoria gives none.",
  "A good answer is specific, evidenced and written down. An evasive answer is a vibe: 'trust me, I have buyers waiting'.",
];

const TOC: GuideTOCEntry[] = [
  { id: "why-it-matters",      label: "Why these questions matter" },
  { id: "local-market",        label: "Local market and track record" },
  { id: "price-and-method",    label: "Price and method of sale" },
  { id: "fees-and-costs",      label: "Commission and marketing costs" },
  { id: "agreement",           label: "The agency agreement" },
  { id: "campaign-and-buyers", label: "Campaign and buyer qualification" },
  { id: "communication",       label: "Communication and reporting" },
  { id: "if-it-doesnt-sell",   label: "If the property doesn't sell" },
  { id: "reading-answers",     label: "How to read the answers" },
  { id: "next-steps",          label: "Take the list with you" },
];

const FAQS: FaqItem[] = [
  {
    question: "What are the most important questions to ask a real estate agent when selling?",
    answer:
      "Five questions do most of the work: which comparable sales from the last 90 days support your price estimate; how many properties like mine have you personally sold in this suburb in the past year; what exactly is in the commission and marketing quote, including GST; how long is the exclusive agency period and how do I end the agreement; and what is the plan if the property has not sold after the first month. A strong agent answers all five with specifics and is happy to put them in writing. An agent who deflects on any of them is telling you something useful too.",
  },
  {
    question: "How many agents should I interview before listing?",
    answer:
      "Three is the practical minimum. One appraisal tells you nothing because you have no comparison, and beyond four or five the extra meetings add little. Ask each agent the same questions in the same order, note the answers, and compare the evidence rather than the enthusiasm. The spread between their price estimates is itself information: if one agent is 10% or more above the others without comparable sales to back it, treat the high number as a tactic to win your listing, not a promise.",
  },
  {
    question: "Is real estate agent commission negotiable in Australia?",
    answer:
      "Yes. No Australian state sets or caps commission, a point government consumer agencies such as NSW Fair Trading and Consumer Affairs Victoria make explicitly, so every rate you are quoted is an opening position. Typical rates sit somewhere between 1.5 and 3% plus GST depending on state, region and price bracket, with lower rates common in metro areas and on higher-value homes. Always confirm whether a quote includes GST and what marketing costs sit on top, because those two details change the real bill significantly.",
  },
  {
    question: "How long should an exclusive agency agreement be?",
    answer:
      "For an established home, 60 to 90 days covers a full campaign with a buffer. Queensland law caps sole and exclusive appointments at 90 days (they can be renewed), and in Victoria an exclusive authority that does not state an end date defaults to 60 days. NSW sets no statutory maximum, so the term is whatever you sign. Be wary of anything beyond 90 days, and read the tail clause: a long tail can leave the agent entitled to commission months after the agreement ends if the buyer was 'introduced' during it.",
  },
  {
    question: "Do I still pay marketing costs if my house doesn't sell?",
    answer:
      "Usually yes. Vendor-paid advertising covers photography, portal listings, signboards and print, and in most agreements it is payable whether or not the property sells, either upfront, at settlement or on a payment plan. That is why the question belongs in the interview: a good agent will confirm it plainly, cap the budget in writing and explain what each line item adds. An agent who waves it away with 'don't worry, it will sell' is dodging a cost you are contractually on the hook for.",
  },
  {
    question: "What should I do if one agent's price estimate is much higher than the others?",
    answer:
      "Ask for the evidence. An estimate is only as good as the comparable sales behind it, so ask which properties sold in the last 90 days support the number and how each compares to yours. In NSW, agents are legally required to put a reasonable estimated selling price in the agency agreement and cannot advertise below it, which makes the written estimate a useful accountability tool everywhere. The classic trap is the agent who quotes high to win the listing and then conditions you down during the campaign, so the highest appraisal is often the most expensive one to believe.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "How to Choose a Selling Agent",       href: "/guides/how-to-choose-a-selling-agent",       description: "The full selection process: shortlisting, the appraisal-price trap and negotiating the agreement." },
  { title: "Real Estate Agent Fees in Australia", href: "/guides/real-estate-agent-fees-australia",    description: "Commission ranges by state, marketing budgets, and what's negotiable." },
  { title: "Commission Calculator",               href: "/real-estate-commission-calculator",          description: "What an agent costs on your sale price, by state." },
  { title: "The Cost of Selling a House",         href: "/guides/cost-of-selling-a-house-australia",   description: "Every fee from commission to conveyancing, with a worked example." },
  { title: "Property Auction Guide",              href: "/guides/property-auction-guide",              description: "How auctions actually run, and what to expect from your agent on auction day." },
  { title: "Free Selling Guide (PDF)",            href: "/selling-guide",                              description: "The agent interview questions and nine more chapters, personalised to your suburb." },
  { title: "Free Property Appraisal",             href: "/appraisal",                                  description: "An independent appraisal from a vetted local agent, no commitment." },
];

export default function QuestionsToAskARealEstateAgentPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Rules differ by state, agreements differ by agent">
        <p>
          Agency agreement rules, cooling-off periods and underquoting laws
          vary by state, and every agency's agreement is worded differently.
          The figures here are indicative. Check your state's consumer
          affairs or fair trading guidance before signing, and get every
          answer you rely on in writing.
        </p>
      </Callout>

      <EditorNote>
        <p>
          Every seller I speak to prepared harder for their last job interview
          than for the meeting that decides who sells their biggest asset.
          The agent has done this pitch hundreds of times; you'll do it two
          or three times in your life. A written list of questions flips that
          imbalance. You don't need to be adversarial, you just need to be
          the seller who asks for evidence instead of accepting charm.
        </p>
      </EditorNote>

      <h2 id="why-it-matters">Why these questions matter</h2>
      <p className="lead">
        The listing interview is the highest-leverage hour of your entire
        sale. The agent you pick influences your final price more than
        styling, timing or the portal tier, and the agreement you sign locks
        in the commission, the marketing bill and how hard it is to leave.
        These 23 questions, grouped by theme, are designed to separate agents
        who will earn their fee from agents who are good at winning listings.
      </p>
      <p>
        For each question below you'll find why it matters and what a good
        answer sounds like versus an evasive one. Ask every shortlisted agent
        the same list in the same order, and take notes. Patterns show up
        fast.
      </p>

      <h2 id="local-market">Local market and track record</h2>
      <p>
        Local knowledge is the single biggest predictor of result. These
        questions test whether the agent genuinely works your suburb or is
        reading from a data feed printed an hour before the meeting.
      </p>

      <h3>1. Which three recent sales are most comparable to my home, and were you involved in any of them?</h3>
      <p>
        Every price estimate stands or falls on comparable sales: same
        suburb, similar property, sold in the last 90 days. An agent who
        personally negotiated some of them knows what buyers actually paid
        and why.
      </p>
      <p>
        <strong>Good answer:</strong> names addresses, sale dates and prices,
        and explains how each compares to yours. <strong>Evasive:</strong>{" "}
        quotes suburb medians or "the market's really hot right now" without
        a single specific sale.
      </p>

      <h3>2. How many properties like mine have you sold in this suburb in the last 12 months?</h3>
      <p>
        You're hiring the individual, not the franchise. An agent with ten
        recent local sales has a live database of underbidders, buyers who
        missed out and are still hunting. That list is often where your
        buyer comes from.
      </p>
      <p>
        <strong>Good answer:</strong> a specific personal number, with
        examples. <strong>Evasive:</strong> office-wide or network-wide
        figures dressed up as their own.
      </p>

      <h3>3. What are days-on-market and buyer demand doing here right now?</h3>
      <p>
        The answer sets your campaign expectations. An agent who tracks
        suburb-level data weekly will also manage your campaign on evidence
        rather than gut feel.
      </p>
      <p>
        <strong>Good answer:</strong> a current figure and the trend, e.g.
        "median days on market here has drifted from 28 to 35 this quarter".{" "}
        <strong>Evasive:</strong> "demand is strong" with nothing behind it.
      </p>

      <h3>4. Who is the likely buyer for this property?</h3>
      <p>
        The buyer profile dictates the marketing plan: which channels, which
        photos, which open times. If they can't describe your buyer, they're
        guessing at the campaign too.
      </p>
      <p>
        <strong>Good answer:</strong> two or three specific profiles, backed
        by current enquiry on similar listings. <strong>Evasive:</strong>{" "}
        "a home like this appeals to everyone".
      </p>

      <h3>5. Will you personally run the opens and negotiate the offers, or does that go to someone else?</h3>
      <p>
        Some lead agents win the listing and hand the work to a junior. That
        can be fine, but you should know who you're actually getting before
        you sign.
      </p>
      <p>
        <strong>Good answer:</strong> names exactly who does what, and puts
        the lead agent on the negotiation. <strong>Evasive:</strong> "we
        work as a team" with no names attached.
      </p>

      <h2 id="price-and-method">Price and method of sale</h2>
      <p>
        This is where the most expensive mistakes happen: an inflated
        estimate to win your listing, or a sale method chosen by office
        habit rather than what suits your property.
      </p>

      <h3>6. What's your estimated selling price, in writing, and what evidence supports it?</h3>
      <p>
        In NSW, the agent is legally required to include a reasonable
        estimated selling price in the agency agreement, supported by
        factors like comparable sales. In every state, a written estimate is
        your accountability anchor: it makes the classic
        "quote high, condition down" play much harder to run.
      </p>
      <p>
        <strong>Good answer:</strong> a tight range that traces back to the
        comparable sales from question 1, written into the agreement.{" "}
        <strong>Evasive:</strong> a big verbal number, "we'll let the market
        decide", or a range so wide it commits to nothing.
      </p>

      <h3>7. Do you recommend private treaty or auction for my property, and why?</h3>
      <p>
        The right method depends on buyer depth, property type and local
        norms, not on what the office always does. Auction adds an
        auctioneer's fee and a hard deadline; private treaty gives more
        control but can drift.
      </p>
      <p>
        <strong>Good answer:</strong> a recommendation tied to your specific
        property and current buyer demand, with the costs and the fallback
        plan for each method. <strong>Evasive:</strong> a reflexive default
        with no trade-offs discussed.
      </p>

      <h3>8. If you're recommending auction, what's your clearance rate over the last six months?</h3>
      <p>
        Their personal clearance rate tells you whether they can actually
        run an auction campaign. You can sanity-check the claim: Cotality
        (formerly CoreLogic) publishes auction clearance rates for the
        capital cities every week, so a citywide number quoted as a personal
        one is easy to catch.
      </p>
      <p>
        <strong>Good answer:</strong> their own number, plus honest examples
        of pass-ins and how those homes sold afterwards.{" "}
        <strong>Evasive:</strong> the citywide clearance rate presented as
        their own record.
      </p>

      <h3>9. Where would you set the advertised price guide, and how will you keep it honest?</h3>
      <p>
        Underquoting wastes your campaign on buyers who can't reach your
        price. NSW bans advertising below the agent's written estimate,
        bans "offers over" style ads, and caps advertised ranges at a 10%
        spread. Other states police misleading price conduct too. A guide
        set too high is just as costly: it kills early enquiry, and the
        first two weeks are when buyer interest peaks.
      </p>
      <p>
        <strong>Good answer:</strong> a guide strategy anchored to the
        written estimate, updated in writing if the market moves.{" "}
        <strong>Evasive:</strong> "we'll quote it low to get bodies through
        the door".
      </p>

      <h2 id="fees-and-costs">Commission and marketing costs</h2>
      <p>
        Commission is the largest cost of your sale and the most negotiable.
        Marketing is the second, and you usually pay it whether or not the
        home sells.
      </p>

      <KeyFigure
        value="No set rate"
        label="No Australian state sets or caps real estate commission. Every rate you're quoted is an opening position, not a fixed fee."
        context="NSW Fair Trading and Consumer Affairs Victoria both say so explicitly"
      />

      <h3>10. What's your commission rate, and does that include GST?</h3>
      <p>
        Typical rates run roughly 1.5 to 3% plus GST, lower in the big
        metros and on higher-value homes, higher in regional markets. The
        GST question matters: on a $20,000 fee it's a $2,000 difference.
        Run your own numbers through the{" "}
        <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
        before the meeting so you know what any rate means in dollars.
      </p>
      <p>
        <strong>Good answer:</strong> a clear rate, GST treatment stated,
        openness to discussing structure. <strong>Evasive:</strong> "that's
        the standard rate". There is no standard rate, anywhere in
        Australia.
      </p>

      <h3>11. Walk me through the marketing budget line by line. What does each item add?</h3>
      <p>
        A typical residential campaign runs somewhere between $3,000 and
        $10,000 depending on property value, portal tier and whether you
        stage. The portal listing upgrade is usually the biggest line and
        the most debated one. You're entitled to know what each item is
        expected to do for your price.
      </p>
      <p>
        <strong>Good answer:</strong> itemised costs with a rationale for
        each, and options at different budget levels.{" "}
        <strong>Evasive:</strong> one bundled package price and pressure to
        approve it on the spot.
      </p>

      <h3>12. Do I pay the marketing costs if the property doesn't sell?</h3>
      <p>
        In most agreements, vendor-paid advertising is payable regardless of
        the result, upfront, at settlement or via a payment plan. Sellers
        are routinely surprised by this after a failed campaign. Don't be.
      </p>
      <p>
        <strong>Good answer:</strong> a plain yes, with the budget capped in
        writing and payment timing explained. <strong>Evasive:</strong>{" "}
        "don't worry about that, it will sell".
      </p>

      <h3>13. Are there any other costs? Auctioneer, admin fees, mid-campaign upgrades?</h3>
      <p>
        Small fees hide in agreements: auctioneer fees, administration or
        "file" charges, and suggested portal upgrades once the campaign is
        running. Get the complete list before you sign, not as the invoices
        arrive. Our{" "}
        <Link href="/guides/cost-of-selling-a-house-australia">cost of selling guide</Link>{" "}
        covers every line item.
      </p>
      <p>
        <strong>Good answer:</strong> a complete written fee schedule.{" "}
        <strong>Evasive:</strong> "just the usual costs".
      </p>

      <MatchCTA kind="selling-agent" />

      <h2 id="agreement">The agency agreement</h2>
      <p>
        The pitch is marketing; the agreement is the contract. These three
        questions cover the clauses that decide how locked in you are.
      </p>

      <KeyFigure
        value="90 days"
        label="The maximum term for a sole or exclusive agency appointment in Queensland. Other states leave the term to negotiation, so what you sign is what you get."
        context="Property Occupations Act 2014 (Qld)"
      />

      <h3>14. How long is the exclusive period, and why that long?</h3>
      <p>
        For an established home, 60 to 90 days covers a full campaign with
        buffer. Queensland caps sole and exclusive appointments at 90 days
        (renewable). In Victoria, an exclusive authority with no stated end
        date defaults to 60 days. NSW sets no minimum or maximum, so the
        term is purely what you negotiate.
      </p>
      <p>
        <strong>Good answer:</strong> around 60 days with a clear rationale
        and willingness to review. <strong>Evasive:</strong> 120+ days "to
        be safe". Safe for whom?
      </p>

      <h3>15. What's the tail clause? How long, and how is "introduced" defined?</h3>
      <p>
        A tail clause keeps the agent entitled to commission if the buyer
        was "introduced" during the agency period, even if the sale happens
        months after the agreement ends. Reasonable in principle, dangerous
        when "introduced" is defined loosely. Push for a tight definition,
        such as attended an inspection or made a written offer.
      </p>
      <p>
        <strong>Good answer:</strong> a 60 to 90 day tail with a precise
        definition. <strong>Evasive:</strong> 180+ days, vague wording, or
        surprise that you asked.
      </p>

      <h3>16. How do I end this agreement if it isn't working, and is there a cooling-off period?</h3>
      <p>
        This is a great honesty test because the answer is checkable. In
        NSW you get a cooling-off period of one business day after signing
        an agency agreement. In Victoria there is no cooling-off on a sales
        authority at all. In Queensland, cancelling an appointment generally
        requires 30 days' written notice. A good agent knows their state's
        rules cold and volunteers a fair exit path for mid-campaign
        breakdowns.
      </p>
      <p>
        <strong>Good answer:</strong> the correct rule for your state,
        unprompted, plus a written termination process.{" "}
        <strong>Evasive:</strong> "nobody's ever wanted to leave".
      </p>

      <h2 id="campaign-and-buyers">Campaign and buyer qualification</h2>
      <p>
        Anyone can open a door on a Saturday. The value is in what happens
        to every name that walks through it.
      </p>

      <h3>17. How do you qualify buyers before they make an offer?</h3>
      <p>
        A qualified buyer has finance pre-approval, a deposit ready and a
        reason to move. An unqualified one wastes your best campaign weeks
        or crashes the deal after acceptance. Ask how the agent checks
        finance position and motivation before you take a property off the
        market for someone.
      </p>
      <p>
        <strong>Good answer:</strong> a repeatable process, asking about
        pre-approval, deposit readiness and timing before contract.{" "}
        <strong>Evasive:</strong> "we get a feel for who's serious".
      </p>

      <h3>18. What's the opens schedule, and how do you follow up every attendee?</h3>
      <p>
        The follow-up call after the open is where offers are made or lost.
        You want to know the cadence: how many opens per week, how quickly
        attendees are contacted, and what happens to their feedback.
      </p>
      <p>
        <strong>Good answer:</strong> a defined schedule and follow-up
        within 24 to 48 hours, with feedback reported back to you.{" "}
        <strong>Evasive:</strong> no system, just "we stay in touch with
        interested parties".
      </p>

      <h3>19. How will offers be handled? Will I see every offer in writing?</h3>
      <p>
        You are entitled to know about offers on your property, and a
        written record protects you if a "verbal offer" is used to pressure
        you into a quick decision. Agree upfront that every offer reaches
        you in writing, with the buyer's conditions and finance position
        attached.
      </p>
      <p>
        <strong>Good answer:</strong> every offer in writing, promptly, with
        context to judge it. <strong>Evasive:</strong> "we'll only bring you
        the serious ones".
      </p>

      <h2 id="communication">Communication and reporting</h2>
      <p>
        Most seller complaints aren't about the result, they're about
        silence. Set the standard before you sign, when your leverage is
        highest.
      </p>

      <h3>20. How often will I hear from you, and in what format?</h3>
      <p>
        Weekly is the workable minimum during a live campaign: enquiry
        numbers, open attendance, buyer feedback and where each interested
        party sits. A written report plus a call is the standard worth
        asking for.
      </p>
      <p>
        <strong>Good answer:</strong> a fixed weekly rhythm with a written
        report, and calls for anything urgent. <strong>Evasive:</strong>{" "}
        "you can call me anytime", which quietly puts the burden on you.
      </p>

      <h3>21. What feedback would make you change strategy, and at what point?</h3>
      <p>
        Good agents define their triggers upfront: if enquiry is below X
        after two weeks, or opens are strong but no offers land, here's
        what we change. Without agreed triggers, "the market is telling us
        something" becomes code for "drop your price".
      </p>
      <p>
        <strong>Good answer:</strong> specific thresholds and the options at
        each, price, presentation or method. <strong>Evasive:</strong>{" "}
        "let's see how we go".
      </p>

      <h2 id="if-it-doesnt-sell">If the property doesn't sell</h2>
      <p>
        Not every campaign lands. The agents worth hiring have a plan B
        before they need one, and their answer here tells you how honest
        the rest of the pitch was.
      </p>

      <h3>22. What's the plan if we haven't had an acceptable offer after 30 days?</h3>
      <p>
        The first month is when buyer interest peaks. If it passes without a
        serious offer, something needs to change, and you want to know the
        options now: refreshed marketing, a price review against new
        comparable sales, a method switch, or holding firm with a reason.
      </p>
      <p>
        <strong>Good answer:</strong> a staged plan with decision points,
        agreed with you in advance. <strong>Evasive:</strong> "that won't
        happen with this property", which is exactly what over-quoting
        sounds like from the other side.
      </p>

      <h3>23. If the agreement ends without a sale, what do I owe you, and what happens next?</h3>
      <p>
        Get the exit picture clear: marketing costs already incurred are
        usually payable, the tail clause may still apply to buyers already
        introduced, and you'll want your enquiry list and feedback history
        if you relist with someone else.
      </p>
      <p>
        <strong>Good answer:</strong> a transparent account of what's owed
        and a professional handover position. <strong>Evasive:</strong> any
        answer that only makes sense if you never leave.
      </p>

      <h2 id="reading-answers">How to read the answers</h2>
      <p>
        Across all 23 questions, the same patterns separate strong agents
        from smooth ones:
      </p>
      <ul>
        <li><strong>Specifics beat sentiment.</strong> Addresses, dates, numbers and names are good signs. Adjectives are not evidence.</li>
        <li><strong>Written beats verbal.</strong> A good agent volunteers to put estimates, fees and plans in writing. An evasive one treats the request as an insult.</li>
        <li><strong>Pushback is a feature.</strong> The agent who challenges your price expectations with evidence will also challenge buyers on your behalf. The one who agrees with everything is negotiating for your signature, not your sale price.</li>
        <li><strong>Watch the checkable claims.</strong> Clearance rates, cooling-off rules and "my recent sales" can all be verified. Catch one embellishment in the interview and assume the rest of the pitch carries the same discount.</li>
      </ul>

      <PullQuote attribution="Andy McMaster, Editor">
        The agent who wins the listing with the biggest number and the
        fewest documents is the one most likely to cost you money. Hire the
        one who survives the questions.
      </PullQuote>

      <h2 id="next-steps">Take the list with you</h2>
      <p>
        Don't try to memorise 23 questions. Do it in this order instead:
      </p>
      <ol>
        <li>
          <strong>Get the list in your pocket.</strong> The{" "}
          <Link href="/selling-guide">free selling guide</Link> includes the
          agent interview questions as a printable chapter, plus fee
          benchmarks for your state, personalised to your suburb.
        </li>
        <li>
          <strong>Size the fees first.</strong> Run your expected price
          through the{" "}
          <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
          so every rate you're quoted translates to dollars on the spot.
        </li>
        <li>
          <strong>Line up three interviews.</strong> Start with a{" "}
          <Link href="/appraisal">free property appraisal</Link> from a
          vetted local agent, or use{" "}
          <Link href="/find-an-expert">find an expert</Link> to build your
          shortlist without cold-calling agency front desks.
        </li>
        <li>
          <strong>Ask, note, compare.</strong> Same questions, same order,
          every agent. The comparison does the deciding for you.
        </li>
      </ol>

      <Callout variant="info" title="Want a shortlist worth interviewing?">
        <p>
          Our <Link href="/find-an-expert">find an expert</Link> service
          points you to vetted local professionals, and a{" "}
          <Link href="/appraisal">free appraisal</Link> gets you a written
          estimate with comparable sales evidence, exactly what question 6
          demands. No commitment to list with anyone.
        </p>
      </Callout>

      <Sources items={AGENT_QUESTIONS_SOURCES} />
    </GuideArticleLayout>
  );
}

const AGENT_QUESTIONS_SOURCES: readonly SourceItem[] = [
  { label: "NSW Fair Trading: Agency agreements for the sale of property in NSW", href: "https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/selling-a-property/agency-agreements", note: "Cooling-off period, exclusive agency and negotiable commission" },
  { label: "NSW Fair Trading: Price estimation and underquoting", href: "https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/selling-a-property/price-estimation-and-underquoting", note: "Estimated selling price requirements and advertising restrictions" },
  { label: "Queensland Government: Appointing a real estate sales agent", href: "https://www.qld.gov.au/law/housing-and-neighbours/buying-and-selling-a-property/selling-a-home/before-you-put-your-home-on-the-market/appointing-a-real-estate-sales-agent", note: "90-day cap on sole and exclusive appointments, cancellation notice" },
  { label: "Consumer Affairs Victoria: Selling property with or without an agent", href: "https://www.consumer.vic.gov.au/housing/buying-and-selling-property/selling-property/selling-property-with-or-without-an-agent", note: "Exclusive authority, default 60-day period, negotiable commission and marketing" },
  { label: "Cotality (formerly CoreLogic): Auction results", href: "https://www.cotality.com/our-data/auction-results", note: "Weekly auction clearance rates by capital city" },
];
