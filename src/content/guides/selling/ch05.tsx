import Link from "next/link";
import type { Chapter } from "../types";
import { Box, Ch, Stat } from "../parts";
import { AGREEMENT_CHECK } from "@/lib/service-model";

export const chapter: Chapter = {
  guide: "selling",
  number: 5,
  step: "The right agent runs the campaign",
  standfirst:
    "The most expensive mistake in selling isn’t the commission rate. It’s hiring the agent with the best suit and the biggest appraisal. Hire the campaign, not the quote.",
  callout:
    "At the top end, the vendor interviews the campaign, not the personality. Agents are asked to put the buyer profile, the launch plan, the marketing budget and the negotiation approach in writing, and the fee is tied to the result. The agent with the strongest plan and the best evidence wins the listing, whatever number they quoted.",
  checklist: [
    "Interview at least three agents with the same 10 questions",
    "Ask each for a written campaign plan, line-item marketing and their comparable sales",
    "Phone two of each agent’s recent vendors, including one whose sale was difficult",
    "Negotiate the commission, including GST, and the marketing before you sign",
    "Set the agreement’s term and exit clause, and check the commission tail",
    "Have the agreement checked before you sign it",
  ],
  cta: {
    kind: "agreement-check",
    title: AGREEMENT_CHECK.headline,
    body: AGREEMENT_CHECK.summary,
    label: "Book my agreement check",
    href: "/agreement-check?from=selling-guide-ch5",
  },
  checked: "State agency agreement rules and costs as at mid-2026. Confirm the current rules for your state when you sign.",
  Body,
};

function Body() {
  return (
    <>
      <h2>Hire the campaign, not the quote</h2>
      <p>
        When three agents give you three prices, the instinct is to pick the highest. Resist it. A quoted price costs the agent nothing
        to say; the campaign they run is the thing you’re actually buying. Compare agents on what they will do: the comparable sales
        they bring, the plan they put in writing, the marketing line by line, and how hard they defend their own fee, because that’s a
        preview of how hard they’ll defend your price.
      </p>

      <h2>What actually predicts a good agent</h2>
      <p>
        Ignore the billboard, the awards (mostly bought or self-awarded) and the appraisal number (<Ch n={2} guide="selling">Chapter
        2</Ch> explained why the biggest one is often a trap). Three things predict results:
      </p>
      <ul>
        <li>
          <strong>Recent comparable sales.</strong> Not sales generally: sales of properties like yours, near yours, in the last six
          months. An agent who sold three similar homes within a kilometre has a live buyer database for your exact property. That is
          worth more than any marketing plan.
        </li>
        <li>
          <strong>Days on market and discounting.</strong> How fast do their listings sell against the suburb average, and how far below
          the first advertised price? Both numbers are visible on the portals and agent comparison sites if you look at their past
          listings, not their brochure.
        </li>
        <li>
          <strong>Vendor reviews with specifics.</strong> “Great communicator” is filler. “Called every Monday with written feedback from
          every group through” is signal. Ask for two recent vendors you can actually phone. Good agents hand these over without
          flinching.
        </li>
      </ul>
      <p>
        Interview at least three agents. Not to triangulate the price (though it helps), but because agents behave differently when they
        know they’re in a contest. You’ll also hear three campaign plans and quickly learn which parts are boilerplate. Our{" "}
        <Link href="/tools/agent-proposal-worksheet">agent proposal worksheet</Link> lines up the proposals side by side, including what
        each would cost you at the same price.
      </p>

      <Box title="The 10 questions to ask every agent" tone="warm">
        <ol>
          <li>
            <strong>What have you personally sold within a kilometre of here in the past six months, and for how much?</strong> Names and
            numbers, not “we’re very active in the area”.
          </li>
          <li><strong>What’s your average days on market, and how does it compare with this suburb’s average?</strong></li>
          <li>
            <strong>What’s your average discount from first advertised price to sale price?</strong> This exposes habitual overquoters in
            one question.
          </li>
          <li>
            <strong>Who will actually attend my open homes and take buyer calls: you, or someone I haven’t met?</strong> Big-name agents
            often delegate everything after the listing is signed.
          </li>
          <li><strong>Walk me through the marketing plan line by line. What does each item cost, and who pays if the property doesn’t sell?</strong></li>
          <li><strong>What is your commission including GST, and exactly what triggers it?</strong></li>
          <li><strong>How long is your agency agreement, and how do I exit if it isn’t working?</strong></li>
          <li><strong>What price range will you put in writing on the agency agreement, and which three comparable sales support it?</strong></li>
          <li>
            <strong>How many other listings are you running right now?</strong> Fifteen listings means your campaign gets a fifteenth of
            someone’s week.
          </li>
          <li><strong>Can I speak to your last two vendors, including one whose sale was difficult?</strong></li>
        </ol>
      </Box>

      <Box title="What a $20 million vendor would ask">
        <p>The ten questions test the agent. These test the campaign. At the top end, every one gets a written answer before anyone signs.</p>
        <ul>
          <li><strong>Who is the buyer for this home, and where are they right now?</strong> A campaign starts with a person, not a portal.</li>
          <li><strong>Show me the campaign week by week, from the photo shoot to the first offer.</strong></li>
          <li><strong>What evidence will you put in front of me before you name a price?</strong></li>
          <li><strong>What will your report after every open include, and who will I hear it from?</strong></li>
          <li><strong>How will you create competition if only one buyer is serious?</strong></li>
          <li><strong>What happens to your fee if the campaign doesn’t deliver?</strong></li>
        </ul>
      </Box>

      <h2>Negotiating the commission</h2>
      <p>Commission is negotiable everywhere in Australia, and agents expect the conversation. Some tactics that work:</p>
      <ul>
        <li>
          <strong>Use the contest.</strong> “I have three appraisals; you’re the agent I’d prefer, but your rate is the highest” is honest
          and effective.
        </li>
        <li>
          <strong>Consider a tiered rate.</strong> For example 2 per cent up to an agreed realistic threshold, then 8 to 10 per cent of
          every dollar above it. It rewards the result you actually want. The threshold must come from comparable-sale evidence, not the
          agent’s appraisal, or you’ve just paid a bonus for overquoting.
        </li>
        <li>
          <strong>Negotiate marketing too.</strong> Agencies often have portal volume deals; ask what the agency contributes, and strip
          items you don’t need (<Ch n={7} guide="selling">Chapter 7</Ch>).
        </li>
        <li>
          <strong>Don’t grind to zero.</strong> The cheapest agent’s discount is roughly 0.5 per cent. A better negotiator gets you 2 or 3
          per cent more on price. Hire the negotiator; you’re about to watch them work against buyers, and the audition is how they
          defended their own fee.
        </li>
      </ul>
      <p>
        Our guide to <Link href="/guides/how-to-negotiate-real-estate-agent-commission">negotiating agent commission</Link> has the
        scripts.
      </p>

      <h2>Agency agreements: what you’re signing</h2>
      <p>The agreement is a binding contract. The three common types:</p>
      <ul>
        <li>
          <strong>Exclusive agency:</strong> one agent, who is paid commission no matter who finds the buyer, including you. Standard for
          most residential sales; agents work hardest with protection.
        </li>
        <li>
          <strong>Sole agency:</strong> one agent, but if you genuinely find the buyer yourself, no commission. Worth requesting if you have
          a plausible private buyer.
        </li>
        <li>
          <strong>General / open listing:</strong> multiple agents, commission to whoever sells. Sounds competitive; in practice nobody
          invests in the campaign. Best reserved for hard-to-sell stock or unhurried sellers.
        </li>
      </ul>
      <p>State rules worth knowing before you sign:</p>
      <ul>
        <li>
          <strong>NSW:</strong> residential agency agreements carry a cooling-off period of one business day (ending 5pm the next business
          day or Saturday), and it can’t be waived for sales agreements. There’s no statutory cap on the term, so set one: 8 to 12 weeks
          is reasonable, with the agreement converting to open or ending after that.
        </li>
        <li>
          <strong>Victoria:</strong> no cooling-off on a sale authority, so read before signing, not after. Exclusive authority periods
          are negotiable; 60 to 90 days is common. Check the rebate disclosure section: agents must disclose rebates they receive (for
          example from advertisers).
        </li>
        <li>
          <strong>Queensland:</strong> appointments use the prescribed Form 6. A sole or exclusive agency is capped at <strong>90
          days</strong> for residential sales; you can reappoint, but only within the last 14 days of the current term, for further terms
          of up to 90 days. Open listings have no time limit.
        </li>
        <li><strong>South Australia:</strong> residential sales agency agreements are capped at 90 days, renewable.</li>
        <li>
          <strong>WA, Tasmania, NT, ACT:</strong> no general statutory cooling-off on agency agreements, and term caps vary or don’t
          exist, so negotiate the term and exit clause yourself. Anywhere in Australia, an agent who insists on more than 90 days
          exclusive for a standard home is protecting themselves, not you.
        </li>
      </ul>

      <Stat value="90 days">The longest exclusive agency term worth signing on a standard home.</Stat>

      <p>
        Finally, read the commission trigger clause. You can owe commission if a buyer the agent introduced purchases after the agreement
        ends. That’s fair protection against being cut out, but check the tail period (60 to 90 days is reasonable; open-ended is not)
        and that “introduced” is defined. Our guide to{" "}
        <Link href="/guides/real-estate-agency-agreements-by-state">agency agreements by state</Link> lists the clauses to change first.
      </p>
    </>
  );
}
