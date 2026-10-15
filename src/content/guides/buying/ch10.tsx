import type { Chapter } from "../types";
import { Box, Stat, TableWrap } from "../parts";

export const chapter: Chapter = {
  guide: "buying",
  number: 10,
  step: "Run your buying campaign",
  standfirst:
    "Print this page. Twelve weeks from first broker call to exchange is realistic for a prepared buyer, with settlement following four to six weeks later.",
  callout:
    "Running to a schedule. Every campaign you’ll meet has a launch date, open-home weekends and a deadline; yours should too. Set your own timeline, and their deadlines stop being your emergencies.",
  checklist: [
    "Print the timeline and put a date against each week",
    "Lodge a fully assessed pre-approval in week 11",
    "Engage your conveyancer in week 10, before you inspect seriously",
    "Track guides against results from week 9",
    "Have finance, reports and your limit ready before any offer or auction",
  ],
  cta: {
    kind: "plan",
    title: "Build your buying plan",
    body: "Your next three steps for where you’re up to right now, with the tools and guides for your state.",
    label: "Build my buying plan",
    href: "/plan?j=buying&from=buying-guide-ch10",
  },
  checked: "As at mid-2026.",
  Body,
};

const WEEKS: ReadonlyArray<[string, string]> = [
  ["Week 12", "Set your real budget from your own spending, not a calculator. Pull three months of statements, cancel unused credit cards, stop the buy-now-pay-later. Pick your persona from Chapter 1 and write down what you’re actually buying and why."],
  ["Week 11", "Talk to a broker (or two lenders direct). Check your scheme eligibility (Chapter 3) and confirm which lenders participate. Lodge your pre-approval application, fully assessed, not the instant kind. First home buyers using FHSS: request your ATO determination now."],
  ["Week 10", "Engage your conveyancer or solicitor. Shortlist three to five suburbs using the data in Chapter 4: days on market, listings, clearance, discounting. Set up portal alerts for your brief, including “sold” alerts to track real prices."],
  ["Week 9", "Pre-approval in hand. Start inspecting, two to four properties a weekend, to calibrate your eye. Track every shortlisted property’s guide against its eventual result; the gap is your suburb’s quoting habit, and you’ll use it in every negotiation."],
  ["Week 8", "Keep inspecting and recording. Walk your shortlisted streets at different hours. Practise the Chapter 5 checklist until it’s automatic. Refine the brief: what you thought you wanted and what you keep walking into are rarely the same property."],
  ["Week 7", "Serious candidates emerge. Request contracts, send them to your conveyancer for review, and build your comparable-sales file for each. Decide your evidence-based value before asking the agent anything that reveals yours."],
  ["Week 6", "Order building and pest (and strata search for units) on the front-runner. Ring the inspector after reading the report. Re-confirm your pre-approval is current and covers this property type and postcode; some lenders restrict both."],
  ["Week 5", "Make your written offer with conditions, deposit, settlement terms and an expiry (Chapter 7). Auction buyers: contract reviewed, reports done, finance formally approved, limit set in writing. Negotiate from your file, not the guide."],
  ["Week 4", "Agree terms and exchange contracts. Pay the deposit into the trust account. Cooling-off runs if your state has one (Chapter 9). Notify your lender the moment contracts exchange so the valuation and formal approval start immediately."],
  ["Week 3", "Finance goes unconditional inside the clause period; chase it daily near the deadline. Insure the building from exchange. If the valuation falls short, work the Chapter 8 playbook before the clause expires, not after."],
  ["Week 2", "Conveyancer prepares transfer and settlement figures. Sign and return your loan documents the day they arrive. Book removalists and utility connections for settlement day. First home buyers: confirm duty concession paperwork is lodged."],
  ["Week 1", "Final inspection through the agent: same condition, every inclusion present and working. Report problems to your conveyancer the same day. Confirm settlement time, key handover and your cleared funds position."],
  ["Settlement day", "Settlement completes electronically; duty paid, title transferred, balance drawn from your lender. The agent releases the keys, usually mid-afternoon. Keep the settlement statement and contract permanently. Change the locks tonight; you have no idea who has keys."],
];

function Body() {
  return (
    <>
      <p>The seller’s campaign runs to a schedule. This is yours, week by week. Tick each one off as you go.</p>
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
        The twelve weeks compress or stretch with your market: hot suburbs can demand a bid in your first fortnight of looking, and slow
        ones reward another month of patience. The order, though, barely changes. Finance before shopping, evidence before offers, reports
        before signatures.
      </p>

      <Stat value="12 weeks">First broker call to exchange, for a prepared buyer.</Stat>

      <Box title="Persona footnotes">
        <p>
          <strong>First home:</strong> add two to four weeks at the front for scheme paperwork and FHSS release; both move at government
          speed. <strong>Upgrader:</strong> run our 12-week selling timeline in parallel, offset so your sale exchanges first, and negotiate
          long settlements on both sides to make the bridge. <strong>Investor:</strong> add property manager selection in week 2 and the
          depreciation schedule at settlement; skip the street-walking, double the spreadsheet time. <strong>Downsizer:</strong> let the
          timeline stretch; your strength is that you don’t have to buy this one, and long settlements are yours to offer or demand.
        </p>
      </Box>
    </>
  );
}
