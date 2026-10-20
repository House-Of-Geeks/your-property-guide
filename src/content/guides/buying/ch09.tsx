import Link from "next/link";
import type { Chapter } from "../types";
import { Box, Pull, Stat, TableWrap } from "../parts";

export const chapter: Chapter = {
  guide: "buying",
  number: 9,
  step: "Get to settlement",
  standfirst:
    "The weeks between signing and settlement are quiet when everything goes right. Here is what your conveyancer does, what you need to do, and the one inspection that still matters.",
  callout:
    "After exchange, the selling agent’s job is to get the sale to settlement smoothly for the seller. They still act for the seller, and they’ll usually be your contact for the final inspection and the keys. Your conveyancer and your own final inspection are what look after your interests.",
  checklist: [
    "Send every serious contract to your conveyancer before you sign",
    "Know your state’s cooling-off rules, and that auctions have none",
    "Get finance unconditional inside the clause period, in writing",
    "Insure the building from exchange",
    "Use the final inspection: test everything, report problems the same day",
  ],
  cta: {
    kind: "plan",
    title: "Build your next-step plan",
    body: "Your next three steps for where you’re up to, with the checklists and calculators for your state.",
    label: "Build my next-step plan",
    href: "/plan?j=buying&bs=offer&from=buying-guide-ch9",
  },
  checked: "Cooling-off settings as at mid-2026. These get amended, so confirm the current rules when you sign.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        Once the contract is signed, most of the selling agent’s work is done. Yours isn’t. These weeks are where buyers lose money to
        missed deadlines and unchecked inclusions, so treat them as carefully as the search.
      </p>

      <h2>Conveyancing: hire early, use properly</h2>
      <p>
        A conveyancer or property solicitor ($800 to $2,500 for a standard purchase) reviews the contract, runs the searches, manages
        conditions and deadlines, and executes settlement. The single most valuable thing they do costs the least: the{" "}
        <strong>pre-signing contract review</strong>, often $200 to $400 if charged separately. It catches the special condition that
        waives your rights, the easement through the backyard, the sunset clause in the off-the-plan contract, the inclusions list missing
        the dishwasher you shook hands over. Engage them in week one of your search and send every contract you get serious about.
        Solicitors over conveyancers when anything is non-standard: trusts or SMSF purchases, off-the-plan, disputes, or anything involving
        the word “unusual” from your own conveyancer. (In Queensland, conveyancing is done by solicitors as standard practice; in WA,
        settlement agents are the local equivalent.) Our <Link href="/guides/conveyancing-guide">conveyancing guide</Link> covers what to
        ask.
      </p>

      <h2>Cooling-off: your exit window, state by state</h2>
      <p>
        In most states, a buyer who signs a private treaty contract for residential property gets a short statutory window to withdraw,
        for a small penalty or none. It exists so a rushed signature isn’t a life sentence; it is not a free option to keep shopping. It
        never applies to auction purchases, and it can be waived (in NSW via a section 66W certificate from your solicitor) or shortened by
        agreement.
      </p>
      <TableWrap>
        <table>
          <thead>
            <tr><th>State / territory</th><th>Buyer cooling-off period</th><th>Cost to withdraw</th></tr>
          </thead>
          <tbody>
            <tr><td>NSW</td><td>5 business days (10 for off-the-plan)</td><td>0.25% of purchase price</td></tr>
            <tr><td>Victoria</td><td>3 business days</td><td>$100 or 0.2%, whichever is greater</td></tr>
            <tr><td>Queensland</td><td>5 business days</td><td>Up to 0.25%</td></tr>
            <tr><td>South Australia</td><td>2 clear business days (runs from Form 1 service if later)</td><td>Deposit above $100 refunded</td></tr>
            <tr><td>Western Australia</td><td>None (unless written into the contract)</td><td>n/a</td></tr>
            <tr><td>Tasmania</td><td>None (unless written into the contract)</td><td>n/a</td></tr>
            <tr><td>ACT</td><td>5 business days</td><td>0.25% of purchase price</td></tr>
            <tr><td>Northern Territory</td><td>4 business days</td><td>None; deposit refunded in full</td></tr>
          </tbody>
        </table>
      </TableWrap>
      <p>
        In WA and Tasmania there is no statutory window at all, so every protection must be a written condition in the contract before you
        sign. Treat the table as the default and confirm current rules when you sign; these settings get amended. Our guide to{" "}
        <Link href="/guides/cooling-off-period-by-state-australia">cooling-off periods by state</Link> has the detail.
      </p>

      <h2>Exchange to settlement: the quiet checklist</h2>
      <p>
        Settlement is negotiated in the contract: around 30 days is common in Queensland, 42 days (six weeks) the default in NSW and
        Victoria, with 30 to 90 days the practical national range. Between exchange and settlement day:
      </p>

      <Stat value="42 days">The default settlement period in NSW and Victoria; about 30 in Queensland.</Stat>

      <ul>
        <li>
          <strong>Get finance to unconditional</strong> inside the clause period, in writing, and have your conveyancer confirm it to the
          other side. Silence past the deadline puts your deposit at risk.
        </li>
        <li>
          <strong>Insure the building from exchange.</strong> In Queensland, risk formally passes to the buyer shortly after signing;
          elsewhere it generally stays with the seller until settlement, but the cheapest certainty in this list is holding cover from
          exchange everywhere. Strata buildings carry their own insurance; you insure contents.
        </li>
        <li>
          <strong>Sign and return everything fast.</strong> Transfer documents, your lender’s loan pack, identity verification. The most
          common cause of delayed settlements is paperwork sitting in someone’s inbox, and in most states the party who can’t settle on time
          pays penalty interest.
        </li>
        <li>
          <strong>Book the practical life admin:</strong> removalists, utility connections for settlement day, mail redirection, and your
          state revenue office concession paperwork if you’re claiming one (your conveyancer usually lodges duty and concessions for you).
        </li>
      </ul>

      <h2>The final inspection: use it</h2>
      <p>
        You’re entitled to a pre-settlement inspection, usually in the final week, booked through the agent. You’re confirming the property
        is in the same condition as at sale and every contractual inclusion is present and working: light fittings, dishwasher, curtains,
        pool equipment, the shed contents you negotiated. Run taps, test appliances, open every door. If something’s wrong, don’t accept
        the keys-and-promises version; call your conveyancer the same day. The remedies (a settlement adjustment, money held in retention,
        or a short delay) all work vastly better <em>before</em> the money moves. After settlement, you’re chasing a stranger for a favour.
      </p>

      <Pull>Settlement day is boring when everyone has done their job. Aim for boring.</Pull>

      <h2>Settlement day</h2>
      <p>
        Almost everything happens electronically through PEXA or an equivalent platform, attended by the conveyancers and lenders rather
        than you. In sequence: your lender draws down the loan, your funds and theirs settle against the seller’s mortgage discharge, stamp
        duty is paid, rates and water are adjusted to the day, the transfer is lodged and the title moves. Your conveyancer phones you, the
        agent releases the keys, and the property is yours, usually by mid-afternoon. Keep the settlement statement and contract
        permanently; if the property ever produces income, your accountant will want them decades from now.
      </p>

      <Box title="Investor">
        <p>
          If the property comes with a tenant, the lease survives settlement and so do its terms; you inherit the rent, the bond and the
          condition report, so have your conveyancer verify all three before settlement. Appoint your property manager before settlement day,
          and order a <strong>tax depreciation schedule</strong> (around $600 to $800, itself deductible) immediately after it. Rent is
          apportioned at settlement like rates, so check the adjustment statement.
        </p>
      </Box>

      <Box title="First home">
        <p>
          Your concessions get actioned here: the conveyancer lodges the stamp duty exemption paperwork, and any grant for a new build is
          typically paid through your lender at settlement. Most schemes then require you to <strong>move in within 12 months and live there
          for a minimum period</strong> (commonly 6 to 12 months, varying by state and scheme). Renting it out early can mean repaying the
          lot, plus penalties. Diarise the dates.
        </p>
      </Box>
    </>
  );
}
