import type { Chapter } from "../types";
import { Ch, Stat, TableWrap } from "../parts";

export const chapter: Chapter = {
  guide: "selling",
  number: 10,
  step: "Plan the weeks ahead",
  standfirst:
    "This is the whole sale, week by week. Print it. The weeks count down to exchange, with settlement following four to six weeks later. Adjust for your state’s paperwork lead times.",
  callout:
    "Experienced sellers work to a written schedule, agreed with their agent before launch, with time protected for the paperwork. Each week has an owner and a task, and the seller knows from day one what should have happened by week six. A clear schedule makes a slipping sale easy to spot early, while there’s still time to act.",
  checklist: [
    "Print the timeline and put a date against each week",
    "Book your agent interviews for week 11",
    "Start the contract or disclosure pack in week 10",
    "Agree the launch price in writing before the photos are approved",
    "Keep your written floor in front of you from week 3",
  ],
  cta: {
    kind: "plan",
    title: "Build your next-step plan",
    body: "Your next three steps for where you’re up to right now, with the tools and guides for your state.",
    label: "Build my next-step plan",
    href: "/plan?j=selling&from=selling-guide-ch10",
  },
  checked: "As at mid-2026.",
  Body,
};

const WEEKS: ReadonlyArray<[string, string]> = [
  ["Week 12", "Research your suburb: pull six months of comparable sold prices, days on market and current competition. Build your own price range (Chapter 2). Start decluttering, one room a week. Book a skip if you’re honest with yourself."],
  ["Week 11", "Shortlist and interview three agents using the 10 questions (Chapter 5). Ask each for a written appraisal with comparables, a campaign plan with line-item costs, and their commission including GST. Phone their past vendors."],
  ["Week 10", "Appoint your agent; negotiate commission and the agreement term before signing. Engage your conveyancer or solicitor and start contract or disclosure preparation (mandatory before marketing in NSW, VIC, QLD and the ACT). Notify your lender you intend to sell and ask about discharge timing and any fixed-rate break costs."],
  ["Week 9", "Book trades for repairs and painting. Order a pre-sale building and pest report if you’ve decided to (Chapter 4); in the ACT, commission the mandatory report pack now. Fix every small broken thing."],
  ["Week 8", "Decide on styling: consultation, partial or full staging. Get two quotes. Finish decluttering and deep-clean. Tackle street appeal: garden, fence, letterbox, driveway."],
  ["Week 7", "Trades and styling complete. Book photography for the property’s best light, plus floorplan and (if warranted) video. Confirm the contract or disclosure pack is ready. Agree the launch price and the advertised price strategy in writing."],
  ["Week 6", "Approve photos, floorplan and copy (check every fact yourself). Sign off the portal tier and total marketing spend. Listing goes live late in the week to catch the weekend’s saved-search alerts. Signboard up."],
  ["Week 5", "First open homes. Ask for written feedback after each: groups through, repeat visitors, contract or disclosure requests, price feedback. This fortnight is your biggest audience; treat every enquiry as a live one."],
  ["Week 4", "Second weekend of opens. Review the campaign data against launch expectations. Strong traffic, no offers? Hold briefly. Weak traffic? Reprice decisively now, not weeks later. Auction campaigns: review buyer interest with the agent and start thinking about reserve."],
  ["Week 3", "Offers arriving (or auction week approaching). Insist on written offers with all conditions. Assess each on price, conditions, deposit and settlement terms (Chapter 8). Keep your pre-set floor in front of you."],
  ["Week 2", "Negotiate and accept, or auction day: set the reserve from campaign evidence the same week. Contracts signed or exchanged. Buyer’s cooling-off period runs (state table, Chapter 8). Deposit paid into the agent’s trust account."],
  ["Week 1", "Buyer’s conditions in play: finance approval and building and pest inspection. Respond to any renegotiation attempt with your own evidence, not panic. Lodge your mortgage discharge authority with your lender immediately."],
  ["Settlement window (2 to 6 weeks later)", "Conveyancer prepares the transfer; lender processes the discharge (chase weekly). Book removalists, redirect mail, arrange utility disconnections for settlement day, keep insurance current until settlement. Leave the property in contract condition with all included items in place."],
  ["Settlement day", "Buyer’s pre-settlement inspection passes. Settlement completes electronically; mortgage paid out, balance lands in your account, agent releases keys and remits the deposit less commission. Keep the settlement statement with your tax records. Done."],
];

function Body() {
  return (
    <>
      <p>
        Everything in the first nine chapters, in order. Tick each week off as you go; the sales that slip are almost always the ones
        where the paperwork weeks got squeezed.
      </p>
      <TableWrap>
        <table>
          <thead>
            <tr><th>When</th><th>What to do</th><th>Done</th></tr>
          </thead>
          <tbody>
            {WEEKS.map(([when, what]) => (
              <tr key={when}>
                <td><strong>{when}</strong></td>
                <td>{what}</td>
                <td aria-label="Not done yet">☐</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
      <p>
        Twelve weeks is comfortable, not generous. Sellers in NSW, Victoria, Queensland and the ACT should guard the paperwork weeks
        especially: a contract or disclosure pack that isn’t ready is the most common reason launch dates slip, and slipped launches miss
        the photography weather, the portal weekend, and occasionally the market. The state rules are in{" "}
        <Ch n={9} guide="selling">Chapter 9</Ch>.
      </p>

      <Stat value="12 weeks">Comfortable, not generous: research to exchange.</Stat>
    </>
  );
}
