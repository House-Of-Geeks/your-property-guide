import Link from "next/link";
import type { Chapter } from "../types";
import { Box, Stat } from "../parts";

export const chapter: Chapter = {
  guide: "selling",
  number: 9,
  step: "Close it out",
  standfirst:
    "Every state runs its own rulebook for selling property. Here’s what you must prepare, who should prepare it, and what actually happens on settlement day.",
  callout:
    "At the top end, the legal pack is ready before the launch. The contract, the disclosure documents and the settlement plan are prepared in advance, so a keen buyer is never kept waiting and the vendor’s lender is lined up before exchange. A deal that’s ready to sign is worth more than a deal waiting on paperwork.",
  checklist: [
    "Engage your conveyancer or solicitor before you list",
    "Prepare your state’s contract and disclosure documents before marketing begins",
    "Lodge your mortgage discharge authority the week you exchange",
    "Keep the property insured and in contract condition until settlement",
    "Keep the settlement statement and contract with your tax records",
  ],
  cta: {
    kind: "tool",
    title: "See what lands in your account",
    body: "Your sale price less commission, marketing, legals and the mortgage payout, for your state.",
    label: "Open the selling costs calculator",
    href: "/selling-costs-calculator?from=selling-guide-ch9",
  },
  checked: "State contract and disclosure rules as at mid-2026, including Queensland’s seller disclosure regime from 1 August 2025.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        The campaign isn’t finished when the hammer falls or the contract is signed. It finishes when the money lands. Have the
        paperwork ready before the first buyer walks through, and nothing slows the deal once it’s done.
      </p>

      <h2>Contract and disclosure, state by state</h2>
      <p>
        <strong>NSW.</strong> You cannot legally market a residential property until a contract of sale exists. Your conveyancer or
        solicitor prepares it before listing, attaching prescribed documents: title search, the zoning (section 10.7 planning)
        certificate, a sewer diagram, and any relevant strata or swimming pool compliance documents. Budget one to two weeks to assemble.
        Agents can’t advertise without it, so this is genuinely step one.
      </p>
      <p>
        <strong>Victoria.</strong> The vendor must give buyers a <strong>Section 32 statement</strong> (named for section 32 of the Sale
        of Land Act 1962) before they sign the contract. It discloses title and mortgage details, covenants and easements, zoning, rates
        and outgoings, building permits issued in the past seven years, owner-builder warranty matters, services connected, and notices
        affecting the land. A defective Section 32 can give the buyer the right to walk away even after signing, so this is no place for
        a DIY template. Have it professionally prepared alongside the contract before marketing begins.
      </p>
      <p>
        <strong>Queensland.</strong> The big recent change. Under the Property Law Act 2023, from <strong>1 August 2025</strong> sellers
        must give every buyer a <strong>Form 2 seller disclosure statement</strong>, plus prescribed certificates (title search,
        registered plan, and where applicable body corporate certificate, pool safety certificate and notices), <strong>before the buyer
        signs the contract</strong>. The statement covers title, encumbrances, zoning, rates and water, environmental and heritage
        notices, tree orders and more. Get it wrong, or skip it, and the buyer may be able to terminate any time up to settlement. The
        disclosure pack is now effectively part of listing preparation in Queensland: engage your solicitor or conveyancer before the
        campaign starts, not after a buyer appears.
      </p>
      <p>
        <strong>South Australia.</strong> Buyers must receive a <strong>Form 1</strong> (the vendor’s statement under section 7 of the
        Land and Business (Sale and Conveyancing) Act 1994) disclosing title particulars, encumbrances, charges and a long schedule of
        government interests in the property. It’s prepared by the agent or, more safely, a conveyancer, and must be served on the buyer;
        the buyer’s cooling-off rights run from its service, and errors can extend the buyer’s right to cool off. In practice the Form 1
        gets assembled during the campaign and served at or before contract signing.
      </p>
      <p>
        <strong>Western Australia.</strong> Sales run on a contract for sale by offer and acceptance, with the standard-form{" "}
        <strong>Joint Form of General Conditions</strong> (published jointly by the Law Society of WA and REIWA) doing the heavy lifting
        on terms. WA has no general vendor disclosure statement, though specific duties exist (strata disclosure, and the general
        prohibition on misleading a buyer). The agent typically prepares the offer and acceptance; a settlement agent or solicitor
        handles conveyancing from contract to settlement.
      </p>
      <p>
        <strong>ACT.</strong> Like NSW, the contract must exist before marketing, and the ACT goes further: the pre-listing pack for a
        house must include a building inspection report, pest report, compliance report and an energy efficiency rating (EER), with the
        EER star rating disclosed in all advertising. Buyers can rely on these seller-provided reports, and budget accordingly: the pack
        commonly costs $1,000 to $2,000 before you’ve taken a photo.
      </p>
      <p>
        <strong>Tasmania and NT.</strong> No comprehensive vendor disclosure statement; contracts are prepared by your solicitor or
        conveyancer at or before offer stage, with general law and consumer protections doing the disclosure work. Tasmanian practice
        typically has the seller’s solicitor prepare the contract before or during the campaign.
      </p>

      <h2>Conveyancer or solicitor?</h2>
      <p>
        A licensed conveyancer handles standard property transfers, typically for $800 to $1,500, and for a routine freehold sale is all
        most sellers need. A property solicitor costs more ($1,200 to $2,500 for a standard sale) but can advise beyond the transfer
        itself. Choose the solicitor when anything is non-standard: deceased estates, family law settlements, sales involving trusts or
        SMSFs, boundary or easement disputes, off-the-plan, or a buyer who starts threatening things. One quirk: in Queensland,
        conveyancing is done by solicitors (standalone conveyancer licensing doesn’t exist there), while in WA, settlement agents are the
        local equivalent of conveyancers. Whoever you choose, engage them <strong>before listing</strong>. In NSW, Victoria, Queensland and
        the ACT you legally need documents prepared before or at marketing; everywhere else, early engagement is the difference between
        a 24-hour contract turnaround and losing a keen buyer over a slow draft. Our{" "}
        <Link href="/guides/conveyancing-guide">conveyancing guide</Link> covers what to ask before you hire one.
      </p>

      <h2>Settlement: the 30-to-90-day quiet stretch</h2>
      <p>
        Settlement is the date the money moves and the title transfers, negotiated in the contract. Common defaults: around 30 days in
        Queensland, 42 days (six weeks) in NSW and Victoria, with 30 to 90 days the practical range nationally. Longer settlements are a
        legitimate negotiating chip if you need time to secure your next home.
      </p>

      <Stat value="42 days">The default settlement period in NSW and Victoria.</Stat>

      <p>
        Between exchange and settlement, your side’s job list is short but strict: your conveyancer responds to requisitions and prepares
        the transfer, your lender gets the discharge of mortgage moving (start this immediately; lenders routinely take two to three
        weeks), and you keep the property insured until settlement and in the same condition as at sale. The buyer is entitled to a{" "}
        <strong>pre-settlement inspection</strong>, usually in the final week, to confirm exactly that, including that any contractually
        included items (dishwasher, curtains, the shed contents you promised) are present and working.
      </p>
      <p>
        <strong>On settlement day</strong>, almost everything happens electronically through PEXA or a similar platform, attended by the
        conveyancers and lenders rather than you. In sequence: the buyer’s funds are drawn, your mortgage is paid out and discharged,
        rates and water are adjusted between the parties to the day, transfer documents are lodged, and the balance lands in your
        nominated account, usually that afternoon. The agent, on written authority, releases the keys to the buyer and deducts their
        commission and any unpaid marketing from the deposit they’ve been holding in trust, remitting the remainder to you. Then it’s
        done: no signing ceremony, no handshake, typically just a phone call from your conveyancer and a settlement statement by email.
        Keep that statement and the contract with your tax records, permanently if the property was ever income-producing.
      </p>

      <Box title="Watch for">
        <p>
          Settlement delays caused by your own lender’s discharge paperwork. It is the most common self-inflicted delay in Australian
          conveyancing, and in some states the party who can’t settle on time pays penalty interest. Lodge the discharge authority with
          your bank the week you exchange, then have your conveyancer chase it weekly.
        </p>
      </Box>
    </>
  );
}
