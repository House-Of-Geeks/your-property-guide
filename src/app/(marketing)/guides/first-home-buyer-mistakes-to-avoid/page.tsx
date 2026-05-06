import type { Metadata } from "next";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MiniStampDutyEmbed,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "10 First Home Buyer Mistakes to Avoid (and How to Fix Them) — Australia 2026",
  description:
    "The 10 most expensive mistakes Australian first home buyers make in 2026, from over-stretching on a deposit to skipping building inspections. Each mistake explained with the simple fix.",
  slug: "first-home-buyer-mistakes-to-avoid",
  publishedAt: "2026-05-06",
  updatedAt: "2026-05-06",
  readingTimeMinutes: 9,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "first-home",
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
  "The most common mistake isn't the one buyers worry about. It's not skipping a building inspection — most do those. It's underestimating the all-in cash needed at settlement.",
  "Pre-approval expires in 90 days, but most buyers don't realise the lender can re-assess if your financial situation changes meaningfully.",
  "Auctions skip cooling-off in every state. Showing up to bid without a building report and unconditional finance is the single fastest way to ruin yourself financially.",
  "Stretching to the absolute borrowing maximum leaves no buffer. A 0.5% rate move can flip a comfortable mortgage into mortgage stress.",
  "School catchments and flood overlays are address-specific, not suburb-specific. The street next door can be in a different catchment or under the flood line.",
];

const TOC: GuideTOCEntry[] = [
  { id: "the-list",          label: "The 10 mistakes" },
  { id: "all-in-cash",       label: "1. Underestimating all-in cash" },
  { id: "skipping-preapp",   label: "2. Skipping or stale pre-approval" },
  { id: "max-borrowing",     label: "3. Borrowing the maximum" },
  { id: "auction-no-finance",label: "4. Bidding without unconditional finance" },
  { id: "skipping-bandp",    label: "5. Skipping building & pest" },
  { id: "address-blindspot", label: "6. Suburb instead of address-level" },
  { id: "scheme-deadlines",  label: "7. Missing scheme deadlines" },
  { id: "ignoring-strata",   label: "8. Not reading strata records" },
  { id: "no-buffer",         label: "9. No emergency buffer" },
  { id: "agent-as-friend",   label: "10. Treating the agent as your friend" },
  { id: "next-steps",        label: "Next steps" },
];

const FAQS: FaqItem[] = [
  {
    question: "What's the most common first home buyer mistake?",
    answer:
      "Underestimating the cash needed at settlement. Most first home buyers focus on the deposit (which they save diligently) but forget that stamp duty, conveyancing, building inspections, lender fees, and council adjustments add another 5% on top. On a $700K home with no first home buyer concession, that's an extra $35K beyond the deposit.",
  },
  {
    question: "Can I lose my deposit if I pull out of a contract?",
    answer:
      "Within the cooling-off period (3 to 5 business days in most states for private treaty), you forfeit a small penalty (0.2% to 0.25% of the price) and get the rest of the deposit back. After cooling-off ends, the deposit is at risk. At auction, there's no cooling-off — the deposit is at risk from the moment the hammer falls.",
  },
  {
    question: "How much should I borrow as a first home buyer?",
    answer:
      "Less than your maximum. A common rule of thumb is to keep loan repayments below 30% of gross household income, even if the lender will approve more. The bank's max-borrow figure assumes today's rates and your current expenses; both can change after you settle.",
  },
  {
    question: "Should I get my own conveyancer or use the seller's?",
    answer:
      "Always get your own. Conveyancing for the buyer and conveyancing for the seller are different roles with different obligations. The seller's conveyancer represents the seller's interests; you need someone whose only obligation is to you.",
  },
  {
    question: "What's the biggest mistake at auction?",
    answer:
      "Going in without unconditional finance. At auction, the contract is binding immediately and there's no cooling-off. If your finance falls through after auction (because the bank's valuation comes in below your purchase price, for example), you've still bought the house — and may forfeit your deposit if you can't settle.",
  },
  {
    question: "Is it a mistake to buy at the top of the market?",
    answer:
      "Less of a mistake than people think, if you hold for 7+ years. The bigger mistake is buying at a price you can't comfortably hold through a downturn. Markets recover; forced sales don't get the recovery price.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (National)", href: "/guides/first-home-buyer-guide", description: "The complete first-home-buyer playbook with state-by-state schemes." },
  { title: "How Much Deposit Do You Need?", href: "/guides/how-much-deposit-to-buy-a-house", description: "5%, 10%, 20% — the full picture including all-in cash needed." },
  { title: "Building & Pest Inspection", href: "/guides/building-pest-inspection", description: "What inspections cover, what they don't, and when to commission." },
  { title: "Cooling-Off Period by State", href: "/guides/cooling-off-period-by-state-australia", description: "Your right to rescind, state by state, and when it doesn't apply." },
  { title: "Property Auction Guide", href: "/guides/property-auction-guide", description: "How to bid, when to walk away, and the pre-auction homework." },
];

export default function FirstHomeBuyerMistakesGuide() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="Most of these are preventable in an afternoon">
        <p>
          None of the mistakes below need expert help to avoid. They need a
          checklist and the discipline to follow it. We&rsquo;ve packed each one
          into a single &ldquo;mistake → fix&rdquo; pair you can scan in 30
          seconds.
        </p>
      </Callout>

      <h2 id="the-list">The 10 mistakes (and the simple fix for each)</h2>

      <h2 id="all-in-cash">1. Underestimating the all-in cash needed</h2>
      <p>
        <strong>The mistake:</strong> You save a 20% deposit, then discover at
        settlement that stamp duty, conveyancing, building inspection, and
        lender fees add another $25K to $40K you don&rsquo;t have.
      </p>
      <p>
        <strong>The fix:</strong> Budget the deposit + 5% on top for
        ancillary costs. Use our{" "}
        <a href="/stamp-duty-calculator">Stamp Duty Calculator</a> to lock in
        the biggest single number.
      </p>

      <KeyFigure
        value="~5%"
        label="Of purchase price for ancillary costs on top of the deposit"
        context="Stamp duty + conveyancing + building & pest + lender fees + council adjustments."
      />

      <MiniStampDutyEmbed />

      <h2 id="skipping-preapp">2. Skipping pre-approval (or letting it go stale)</h2>
      <p>
        <strong>The mistake:</strong> You shop without pre-approval, then your
        offer is rejected because you can&rsquo;t prove finance. Or your 90-day
        pre-approval expired and you didn&rsquo;t renew before bidding.
      </p>
      <p>
        <strong>The fix:</strong> Get pre-approval before any open homes. It&rsquo;s
        free, takes 1 to 2 weeks, and lasts 90 days. Renew if you&rsquo;re
        still searching past the expiry.
      </p>

      <h2 id="max-borrowing">3. Borrowing the absolute maximum the bank will lend</h2>
      <p>
        <strong>The mistake:</strong> The bank approves you for $850K, so you
        buy at $850K. Your repayments swallow 38% of your take-home pay.
        A 0.5% rate rise pushes you into mortgage stress.
      </p>
      <p>
        <strong>The fix:</strong> Stress-test your repayments at 2% above
        today&rsquo;s rate. If they exceed 30% of your take-home pay at the
        stress-test rate, buy less.
      </p>

      <h2 id="auction-no-finance">4. Bidding at auction without unconditional finance</h2>
      <p>
        <strong>The mistake:</strong> You attend an auction with pre-approval,
        win at $50K above the bank&rsquo;s valuation, and your finance gets
        cut back. You&rsquo;re bound by the contract with no cooling-off — and
        no funding gap solution.
      </p>
      <p>
        <strong>The fix:</strong> Before auction, get the bank to formally
        value the specific property and confirm finance up to the auction
        ceiling. If the valuation doesn&rsquo;t support your max bid, lower
        your max bid.
      </p>

      <h2 id="skipping-bandp">5. Skipping building &amp; pest to save $600</h2>
      <p>
        <strong>The mistake:</strong> Inspection costs $500 to $900. You skip
        it to save money or speed things up. Three months in, you discover
        $40K of structural repairs the report would have caught.
      </p>
      <p>
        <strong>The fix:</strong> Always commission building &amp; pest. For
        auctions, do it before bidding (you can&rsquo;t back out after).
        See our{" "}
        <a href="/guides/building-pest-inspection">building &amp; pest inspection guide</a>.
      </p>

      <h2 id="address-blindspot">6. Buying on suburb reputation, not address-level data</h2>
      <p>
        <strong>The mistake:</strong> &ldquo;This suburb has good schools&rdquo;
        — but your specific address is in a different school catchment, or
        the block backs onto a flood-prone creek you didn&rsquo;t notice.
      </p>
      <p>
        <strong>The fix:</strong> For each shortlisted property, check (1) the
        official school catchment finder for the address, and (2) the council
        flood overlay map for the specific lot. Don&rsquo;t rely on suburb
        averages.
      </p>

      <h2 id="scheme-deadlines">7. Missing first home buyer scheme deadlines</h2>
      <p>
        <strong>The mistake:</strong> You qualify for the Home Guarantee
        Scheme but apply too late and miss the allocation round. Or you sign
        a contract one day after a stamp duty concession changes.
      </p>
      <p>
        <strong>The fix:</strong> Check scheme allocation rounds before you
        start shopping (HGS resets on 1 July and 1 January). Confirm your
        state&rsquo;s stamp duty concession is in force at the contract date.
      </p>

      <h2 id="ignoring-strata">8. Buying an apartment without reading strata records</h2>
      <p>
        <strong>The mistake:</strong> The apartment looks fine but the strata
        report shows a $50K special levy due in 6 months for waterproofing
        works.
      </p>
      <p>
        <strong>The fix:</strong> Always commission a strata report ($200 to
        $400) before signing. Read the sinking fund balance, recent and
        upcoming special levies, AGM minutes, and any active disputes.
      </p>

      <h2 id="no-buffer">9. No emergency buffer at settlement</h2>
      <p>
        <strong>The mistake:</strong> Every dollar goes into the deposit and
        purchase costs. You move in with $500 in savings. Six weeks later the
        hot water system dies and you can&rsquo;t cover the $4K repair.
      </p>
      <p>
        <strong>The fix:</strong> Hold back at least 2 months of mortgage
        repayments and $5K of cash buffer for repairs. Don&rsquo;t deplete
        your savings to the deposit minimum.
      </p>

      <h2 id="agent-as-friend">10. Treating the selling agent as your friend</h2>
      <p>
        <strong>The mistake:</strong> The agent is friendly and helpful. You
        share your maximum budget and your move-in deadline in casual
        conversation. The agent uses both to extract a higher price.
      </p>
      <p>
        <strong>The fix:</strong> Be polite but professional. The selling
        agent is paid by the vendor and works for the vendor — they have a
        legal obligation to extract the best price for the seller. Never
        share your top number, your urgency, or your fall-back plan.
      </p>

      <Callout variant="warning" title="The pattern across all 10">
        <p>
          Most first home buyer mistakes come from optimism (assuming the
          best case will happen) or rush (skipping a step to move faster).
          A two-week delay to do due diligence costs nothing. A bad purchase
          costs years.
        </p>
      </Callout>

      <h2 id="next-steps">Next steps</h2>
      <ol>
        <li>
          Build the all-in cash budget using our{" "}
          <a href="/guides/how-much-deposit-to-buy-a-house">deposit guide</a>.
        </li>
        <li>
          Get pre-approval (free, 90-day validity) before your first open
          home.
        </li>
        <li>
          For each shortlisted property: school catchment check, flood
          overlay check, building &amp; pest, strata report (if apartment).
        </li>
        <li>
          Stress-test repayments at +2% rates using the{" "}
          <a href="/mortgage-calculator">Mortgage Calculator</a>.
        </li>
        <li>
          Read our{" "}
          <a href="/guides/cooling-off-period-by-state-australia">cooling-off period guide</a>{" "}
          before signing any contract.
        </li>
      </ol>
    </GuideArticleLayout>
  );
}
