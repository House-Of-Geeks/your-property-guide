import Link from "next/link";
import type { Chapter } from "../types";
import { Box, Ch, Pull, Stat } from "../parts";

export const chapter: Chapter = {
  guide: "buying",
  number: 8,
  step: "Finalise your finance",
  standfirst:
    "Pre-approval feels like a green light. It’s a strong maybe with an expiry date, and the gap between the two is where purchases fall over.",
  callout:
    "A finance condition is a risk for the seller: if your loan falls through, so does the sale. That’s why selling agents ask about your finance, and why they tend to favour buyers whose approval looks certain. A fully assessed pre-approval and a short finance period make your offer easier for the seller to accept.",
  checklist: [
    "Get a pre-approval that a credit officer has fully assessed",
    "Diarise its expiry, usually about 90 days",
    "Don’t change jobs, take on debt or raise card limits until settlement",
    "If the valuation falls short, challenge it before the finance clause expires",
    "Investors: settle the loan structure before settlement, not after",
  ],
  cta: {
    kind: "tool",
    title: "Price the LMI before you sign",
    body: "What lenders mortgage insurance costs at your deposit and loan size, and how much a bigger deposit saves.",
    label: "Open the LMI calculator",
    href: "/lmi-calculator?from=buying-guide-ch8",
  },
  checked: "Lending settings as at mid-2026.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        Finance is the part of your purchase the selling agent can’t see but will always ask about. Make it certain, and you can move
        faster and negotiate with more confidence than buyers whose approval is still a maybe.
      </p>

      <h2>What pre-approval is, and isn’t</h2>
      <p>
        Pre-approval (conditional approval) is a lender’s in-principle agreement to lend you up to a stated amount, subject to conditions,
        always including a valuation of whatever property you eventually buy. Get it before you shop seriously: it fixes your real budget,
        marks you as a credible buyer, and finds problems while they’re fixable. But know its limits. Some “pre-approvals” are
        system-generated in minutes without a human reading your documents; ask whether yours was <strong>fully assessed by a credit
        officer</strong>, because the unassessed kind collapses at the worst moment. And it typically <strong>expires after about 90
        days</strong>. Renewing is usually straightforward, but it’s a fresh assessment: if rates have risen or your circumstances changed,
        the number can come back smaller. Our <Link href="/guides/home-loan-pre-approval-australia">pre-approval guide</Link> covers the
        paperwork.
      </p>

      <Stat value="90 days">The typical life of a pre-approval before it expires and must be reassessed.</Stat>

      <p>
        Between pre-approval and final approval, live like the application is still open, because it is: don’t change jobs if avoidable,
        don’t take on new debt or raise card limits, don’t make patterns of unexplained spending, and don’t lodge applications with multiple
        lenders for sport, since every hard enquiry lands on your credit file.
      </p>

      <h2>Valuation shortfalls: the quiet deal-killer</h2>
      <p>
        Final approval hinges on the lender’s valuation of the specific property. Banks lend against the <strong>lower</strong> of price and
        valuation, so if you contract at $800,000 and the valuer says $760,000, your 80 per cent loan just shrank by $32,000, and the gap
        comes from your pocket. Shortfalls cluster in fast-moving markets (valuations look backward at settled sales; you bid forward),
        off-the-plan purchases, and unusual properties with thin comparables.
      </p>
      <p>
        If it happens: ask the broker to <strong>challenge the valuation</strong> with better comparables (it sometimes works), order a
        valuation through a second lender (valuers differ more than banks admit), renegotiate the price with the valuation as evidence, or
        exit under your finance clause. Every one of those options is better than the fifth, which is finding the gap on a credit card. If
        you bought at auction with no finance clause, the gap is simply yours; re-read <Ch n={7} guide="buying">Chapter 7</Ch>’s
        pre-auction checklist.
      </p>

      <Pull>Banks lend against the lower of price and valuation. The gap is yours.</Pull>

      <h2>Investor lending: a different counter</h2>
      <p>Investment loans run on harsher settings than owner-occupier loans, and pricing your purchase on owner-occupier assumptions is a rookie error:</p>
      <ul>
        <li>
          <strong>Rates run higher</strong>, typically 0.2 to 0.6 percentage points above comparable owner-occupier loans, with
          interest-only versions higher again.
        </li>
        <li>
          <strong>Interest-only periods</strong> (commonly five years) maximise deductible interest and cash flow, but you’re assessed on
          your ability to repay principal over the <em>remaining</em> term, which cuts borrowing power, and the repayment jump at the end of
          the IO period is real.
        </li>
        <li>
          <strong>Rental income gets shaded:</strong> most lenders count only about 80 per cent of expected rent, to allow for vacancy and
          costs, and then add their own estimates of expenses on top. Your spreadsheet says the rent covers the loan; the bank’s says
          otherwise, and the bank votes.
        </li>
      </ul>
      <p>
        Structure matters more for investors than anyone: loan splits, offset placement, and keeping investment debt cleanly separate from
        private debt all have tax consequences. Get the structure advice <em>before</em> settlement; restructuring afterwards ranges from
        expensive to impossible.
      </p>

      <h2>Broker or direct?</h2>
      <p>
        Roughly three in four new Australian home loans are now written through mortgage brokers, and the logic is plain: one application,
        dozens of lenders, and the broker is paid commission by the lender rather than by you. Brokers also carry a legal <strong>best
        interests duty</strong> to you; a bank’s own lending staff carry no such duty and can only ever offer that bank’s products. The
        counterweights: a broker’s panel doesn’t include every lender, commission structures can subtly favour some products, and a mediocre
        broker is worse than a good bank banker. Going direct can work better when you have a strong existing banking relationship or a lender
        outside broker panels. Whichever path, compare at least two offers, and ask the broker straight: “Which lenders pay you most, and is
        one of them this recommendation?” Good ones answer without blinking.
      </p>

      <Box title="First home">
        <p>
          The 5% Deposit Scheme and Help to Buy run through participating lenders only, and not every bank participates, so scheme
          eligibility narrows your lender list before rate shopping starts. A broker who writes scheme loans weekly will know which lenders
          are fast, which price scheme loans competitively, and which drown applicants in paperwork. Ask specifically about scheme experience
          when choosing one.
        </p>
      </Box>

      <Box title="Upgrader">
        <p>
          Don’t default to your current lender out of loyalty; the refinance market prices loyalty at zero. But beware{" "}
          <strong>cross-collateralisation</strong>: letting one bank secure the new loan against both your old and new homes ties the
          properties together, complicates your sale and hands the bank all the leverage. Keep the loans clean and separate, even if it means
          more paperwork during the changeover.
        </p>
      </Box>

      <Box title="Downsizer">
        <p>
          If you need a loan at all (to bridge between buying and selling, or to top up), expect age to enter the assessment: lenders must
          see a credible exit strategy for any loan extending past retirement income. Bridging finance works but compounds interest on the
          combined debt, so get it modelled before you commit, and treat a long settlement on your purchase (<Ch n={7} guide="buying">Chapter
          7</Ch>) as the cheaper alternative it usually is.
        </p>
      </Box>
    </>
  );
}
