import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `How to Buy Property in Australia: Complete Step-by-Step Guide (2026) | ${SITE_NAME}`,
  description:
    "Everything you need to know about buying property in Australia — from saving your deposit and getting pre-approval to settlement. Updated for 2026.",
  alternates: { canonical: `${SITE_URL}/guides/buying-property-australia` },
  openGraph: {
    url: `${SITE_URL}/guides/buying-property-australia`,
    title: "How to Buy Property in Australia: Complete Step-by-Step Guide (2026)",
    description:
      "Everything you need to know about buying property in Australia — from saving your deposit and getting pre-approval to settlement. Updated for 2026.",
    type: "article",
  },
};

export default function BuyingPropertyAustraliaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "How to Buy Property in Australia", url: "/guides/buying-property-australia" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "How to Buy Property in Australia" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <span>Last updated: April 2026</span>
          <span>·</span>
          <span>15 min read</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          How to Buy Property in Australia: Complete Step-by-Step Guide (2026)
        </h1>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#overview" className="hover:underline">Overview</a></li>
            <li><a href="#step-1-finances" className="hover:underline">Step 1: Assess your finances</a></li>
            <li><a href="#step-2-borrowing" className="hover:underline">Step 2: Understand your borrowing capacity</a></li>
            <li><a href="#step-3-costs" className="hover:underline">Step 3: Factor in all costs</a></li>
            <li><a href="#step-4-research" className="hover:underline">Step 4: Research suburbs</a></li>
            <li><a href="#step-5-search" className="hover:underline">Step 5: Search for properties</a></li>
            <li><a href="#step-6-offer" className="hover:underline">Step 6: Making an offer vs auction</a></li>
            <li><a href="#step-7-inspection" className="hover:underline">Step 7: Building &amp; pest inspection</a></li>
            <li><a href="#step-8-conveyancing" className="hover:underline">Step 8: Conveyancing</a></li>
            <li><a href="#step-9-exchange" className="hover:underline">Step 9: Exchange of contracts</a></li>
            <li><a href="#step-10-settlement" className="hover:underline">Step 10: Settlement</a></li>
            <li><a href="#after-settlement" className="hover:underline">After settlement</a></li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> This guide is for general information only. Consult a licensed professional for advice specific to your circumstances.
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="overview">Overview: Why Buying Property in Australia Is Complex But Manageable</h2>
          <p>
            Buying property in Australia is one of the largest financial decisions most people will ever make. The process involves multiple professionals — mortgage brokers, conveyancers, building inspectors, and real estate agents — and varies meaningfully by state. In Queensland, property is sold under different contract conditions than in New South Wales; auction rules in Victoria differ from those in Western Australia.
          </p>
          <p>
            The good news is that Australia has a robust and well-regulated property market. With the right preparation and a clear understanding of each step, buying property is very much achievable — even in a competitive market. This guide walks you through every stage, from initial financial health-check to collecting the keys.
          </p>

          <h2 id="step-1-finances">Step 1: Assess Your Finances</h2>
          <p>
            Before you start browsing listings, spend time getting a clear picture of where you stand financially. Lenders will look at three core things: your savings (deposit), your income (serviceability), and your credit history.
          </p>
          <h3>How much deposit do you need?</h3>
          <p>
            Most lenders require a minimum 5–10% deposit, though 20% avoids Lenders Mortgage Insurance (LMI). LMI protects the lender — not you — if you default, and can add tens of thousands of dollars to the cost of your loan. On a $700,000 purchase with a 10% deposit, LMI might cost $10,000–$18,000 depending on the lender and insurer.
          </p>
          <p>
            If you&apos;re a first home buyer, certain government schemes allow you to purchase with as little as 5% deposit and no LMI — see our <Link href="/guides/first-home-buyer-guide" className="text-primary hover:underline">First Home Buyer Guide</Link> for details.
          </p>
          <h3>Income and serviceability</h3>
          <p>
            Lenders assess whether your income is sufficient to service (repay) the loan, factoring in all existing debts including credit cards, car loans, and HECS-HELP debt. Since 2021, APRA requires lenders to test serviceability at 3 percentage points above the loan&apos;s interest rate — so if rates are 6%, they test your ability to repay at 9%.
          </p>
          <h3>Check your credit history</h3>
          <p>
            Obtain a free credit report from Equifax, illion, or Experian before applying for pre-approval. Any defaults, late payments, or errors can delay or reduce your borrowing capacity. Errors are surprisingly common and can be disputed and corrected — allow 4–6 weeks if you need to fix anything.
          </p>

          <h2 id="step-2-borrowing">Step 2: Understand Your Borrowing Capacity</h2>
          <p>
            Use our <Link href="/borrowing-power-calculator" className="text-primary hover:underline">Borrowing Power Calculator</Link> to get an estimate of how much you can borrow based on your income, expenses, and deposit. Remember this is a guide only — actual borrowing capacity depends on the specific lender and your complete financial picture.
          </p>
          <p>
            Getting a formal pre-approval (also called conditional approval) from a lender gives you a realistic budget and signals to agents that you&apos;re a serious buyer. Pre-approvals typically last 90 days and can be renewed. Pre-approval is not a guarantee of final approval — it is conditional on the property valuing at or above purchase price and your circumstances not changing.
          </p>
          <p>
            Consider using a mortgage broker. A good broker has access to dozens of lenders and can often find better rates than you&apos;d find going direct. Their service is typically free to you as they receive commission from the lender.
          </p>

          <h2 id="step-3-costs">Step 3: Factor In All Costs</h2>
          <p>
            The purchase price is just the beginning. When budgeting, include all of the following:
          </p>
          <ul>
            <li><strong>Stamp duty (transfer duty):</strong> The largest upfront cost after the deposit. Use our <Link href="/stamp-duty-calculator" className="text-primary hover:underline">Stamp Duty Calculator</Link> to estimate the amount for your state — it varies significantly. For a $700,000 property in QLD, expect around $14,175 (owner-occupier); in NSW, approximately $26,857.</li>
            <li><strong>Conveyancing fees:</strong> $1,000–$3,000 depending on state and complexity.</li>
            <li><strong>Building and pest inspection:</strong> $400–$800. Essential — do not skip this.</li>
            <li><strong>Lenders Mortgage Insurance (LMI):</strong> If your deposit is below 20%, potentially $5,000–$30,000+.</li>
            <li><strong>Loan application/establishment fees:</strong> $0–$600 depending on lender.</li>
            <li><strong>Title search fees:</strong> Typically included in conveyancing.</li>
            <li><strong>Building insurance:</strong> Required from exchange (or earlier in some states). Budget $1,200–$3,000/year.</li>
            <li><strong>Moving costs:</strong> $500–$5,000 depending on volume and distance.</li>
            <li><strong>Strata fees (if buying an apartment):</strong> Ongoing quarterly fees — check the strata records before committing.</li>
          </ul>
          <p>
            As a rough rule of thumb, budget an additional 3–5% of the purchase price for upfront transaction costs.
          </p>

          <h2 id="step-4-research">Step 4: Research Suburbs</h2>
          <p>
            Once you have a realistic budget, start researching suburbs. The best property at the wrong location can be a poor investment. Consider:
          </p>
          <ul>
            <li><strong>Median prices and growth trends:</strong> Each suburb profile on Your Property Guide shows historical median prices, annual growth rates, and time on market — use these to identify suburbs trending upward before they become unaffordable.</li>
            <li><strong>Rental yields:</strong> If you&apos;re buying an investment property, rental yield tells you the income return. Use our <Link href="/rental-yield-calculator" className="text-primary hover:underline">Rental Yield Calculator</Link>.</li>
            <li><strong>Infrastructure and amenity:</strong> Proximity to schools, transport corridors, employment hubs, and shopping. Planned infrastructure (new rail lines, hospital expansions) can drive price growth.</li>
            <li><strong>School catchments:</strong> Particularly important for families. Your Property Guide maps school catchments for primary and secondary schools across Australia.</li>
            <li><strong>Days on market:</strong> Short days on market (below 30 days) indicates a seller&apos;s market — competition is high, negotiate carefully.</li>
          </ul>
          <p>
            Attend open homes in your target suburbs even before you&apos;re ready to buy. Understanding what different price points get you is invaluable context when you start making offers.
          </p>

          <h2 id="step-5-search">Step 5: Search for Properties</h2>
          <p>
            With your budget confirmed and target suburbs identified, begin actively searching. When attending inspections:
          </p>
          <ul>
            <li>Arrive early and take your time — agents expect buyers to look thoroughly.</li>
            <li>Check for signs of water damage (staining on ceilings, peeling paint, damp smell in subfloor areas).</li>
            <li>Test all windows, doors, and fixtures.</li>
            <li>Look at the orientation — north-facing living areas get year-round sun.</li>
            <li>Ask the agent how long the property has been on the market and whether there have been any prior offers.</li>
            <li>Check the council rates notice — it tells you the land valuation and annual rates.</li>
            <li>For apartments, ask for the strata report (body corporate records). Look for major upcoming levies or disputes.</li>
            <li>Visit the street at different times of day if you&apos;re seriously interested — noise, parking, and activity change significantly between morning and evening.</li>
          </ul>

          <h2 id="step-6-offer">Step 6: Making an Offer vs Auction Bidding</h2>
          <h3>Private treaty (making an offer)</h3>
          <p>
            In a private sale, you submit an offer in writing through the agent. Your offer can be conditional (subject to finance, building inspection, etc.) or unconditional. The vendor can accept, reject, or counter-offer. Negotiations are normal — first offers are rarely accepted at face value.
          </p>
          <p>
            Before making an offer, do your due diligence: review the contract (have your conveyancer check it), arrange pre-approval, and if possible get a building inspection done before you exchange. In Queensland, building inspections are often done before signing due to the contract format; in NSW and VIC, they&apos;re typically done during the cooling-off period.
          </p>
          <h3>Buying at auction</h3>
          <p>
            Auctions are common in Sydney and Melbourne. Key points:
          </p>
          <ul>
            <li>Register to bid before the auction (bring ID).</li>
            <li>You must have finance pre-approved — there is no cooling-off period at auction.</li>
            <li>Have your building inspection done before auction day.</li>
            <li>The highest bid above the reserve wins; you exchange contracts and pay the deposit on the spot.</li>
            <li>Set your maximum bid before the auction and stick to it — the atmosphere can be emotionally charged.</li>
            <li>If a property is &ldquo;passed in&rdquo; (no one bids above reserve), the highest bidder gets first right to negotiate with the vendor.</li>
          </ul>

          <h2 id="step-7-inspection">Step 7: Building &amp; Pest Inspection — Why It&apos;s Essential</h2>
          <p>
            A professional building and pest inspection can save you from buying a property with serious structural defects, rising damp, or active termite infestation. Cost: $400–$800. Worth every dollar.
          </p>
          <p>
            A qualified building inspector will examine:
          </p>
          <ul>
            <li>Roof structure and condition (including gutters and downpipes)</li>
            <li>Subfloor structure and moisture levels</li>
            <li>Wall and ceiling cracks (cosmetic vs structural)</li>
            <li>Electrical switchboard condition</li>
            <li>Evidence of previous termite activity or damage</li>
            <li>Drainage and potential water ingress</li>
          </ul>
          <p>
            The report will note items as &ldquo;major defect&rdquo;, &ldquo;minor defect&rdquo;, or &ldquo;maintenance item&rdquo;. Major defects (structural issues, active termites, significant roof damage) may warrant renegotiating the price or walking away. Minor defects are part of normal ownership.
          </p>

          <h2 id="step-8-conveyancing">Step 8: Conveyancing</h2>
          <p>
            A conveyancer (or solicitor) handles the legal transfer of property from the seller to you. Their work includes:
          </p>
          <ul>
            <li>Reviewing the contract of sale and identifying unusual conditions or risks</li>
            <li>Conducting title searches to confirm the seller owns the property and there are no encumbrances</li>
            <li>Liaising with your lender to arrange funds for settlement</li>
            <li>Calculating adjustments (council rates, water charges) between you and the vendor</li>
            <li>Attending settlement and completing the transfer of title</li>
          </ul>
          <p>
            Conveyancers are licensed property transfer specialists. Solicitors can also do conveyancing and may be preferred for complex transactions (deceased estates, company sales, unusual structures). Fees typically range from $1,000–$3,000 plus disbursements (search fees, registration).
          </p>

          <h2 id="step-9-exchange">Step 9: Exchange of Contracts</h2>
          <p>
            Exchange is the point at which both parties sign the contract and it becomes legally binding. You pay the deposit (typically 10%, though sometimes 5% is negotiated) at exchange.
          </p>
          <h3>Cooling-off periods by state</h3>
          <p>
            Most states provide a cooling-off period after exchange during which the buyer can withdraw (usually forfeiting a small penalty):
          </p>
          <ul>
            <li><strong>NSW:</strong> 5 business days (penalty: 0.25% of purchase price)</li>
            <li><strong>VIC:</strong> 3 business days (penalty: 0.2% of purchase price)</li>
            <li><strong>QLD:</strong> 5 business days (penalty: 0.25% of purchase price)</li>
            <li><strong>SA:</strong> 2 business days (penalty: 0.25% of purchase price)</li>
            <li><strong>WA:</strong> No statutory cooling-off period for residential property</li>
            <li><strong>TAS:</strong> 3 business days (penalty: 0.25% of purchase price)</li>
            <li><strong>ACT:</strong> 5 business days</li>
            <li><strong>NT:</strong> No statutory cooling-off period</li>
          </ul>
          <p>
            Note: Properties sold at auction have no cooling-off period in any state. If you buy at auction, you are unconditionally committed from the moment the hammer falls.
          </p>
          <p>
            Use the cooling-off period wisely: finalise your building inspection, confirm your finance is unconditionally approved, and have your solicitor review anything you didn&apos;t understand in the contract.
          </p>

          <h2 id="step-10-settlement">Step 10: Settlement</h2>
          <p>
            Settlement typically occurs 30–90 days after exchange (commonly 30–45 days). During this period, your lender finalises your loan, and your conveyancer prepares the settlement documents.
          </p>
          <p>
            In the days before settlement:
          </p>
          <ul>
            <li>Conduct a pre-settlement inspection to ensure the property is in the same condition as when you purchased it.</li>
            <li>Confirm all included fixtures and fittings are present (check the contract — anything written in is staying).</li>
            <li>Report any damage or missing items to your conveyancer immediately.</li>
          </ul>
          <p>
            On settlement day, your conveyancer and lender exchange funds and documents electronically (through PEXA in most states). You do not need to attend. When settlement is confirmed — usually within a few hours — you collect the keys from the agent.
          </p>
          <p>
            Transfer of title is lodged with the state land titles office. You&apos;re now the legal owner.
          </p>

          <h2 id="after-settlement">After Settlement</h2>
          <h3>Insurance</h3>
          <p>
            Building insurance should be in place from exchange (check your contract — the risk often passes to you at exchange in some states). Contents insurance and landlord insurance (for investment properties) should be arranged before the tenants move in.
          </p>
          <h3>Council rates and land tax</h3>
          <p>
            You will begin receiving quarterly council rate notices. For investment properties, land tax applies in most states once your total land value exceeds the threshold for that state. Thresholds and rates vary — your accountant can advise.
          </p>
          <h3>Loan management</h3>
          <p>
            Review your loan annually. Interest rate changes, your financial situation, or better products on the market may make it worth refinancing. Even 0.5% less on a $600,000 loan saves $3,000 per year.
          </p>
          <h3>Record keeping</h3>
          <p>
            Keep all purchase documents, including the contract, building inspection report, and settlement statement. For investment properties, your accountant will need these. For your primary residence, records of capital improvements reduce CGT when you eventually sell.
          </p>

        </div>
      </div>
    </div>
  );
}
