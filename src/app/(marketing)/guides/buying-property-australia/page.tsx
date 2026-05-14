import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  MiniStampDutyEmbed,
  GuideSuburbSearch,
  GuideGlossaryRail,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { HowToJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "How to buy property in Australia: the complete step-by-step guide (2026)",
  description:
    "Everything you need to know about buying property in Australia. From assessing your finances and researching suburbs through to inspections, exchange, and settlement.",
  slug: "buying-property-australia",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 15,
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
  "Australian property buying involves ten distinct stages, from financial health-check through to settlement, with rules that vary meaningfully by state.",
  "Most lenders require a minimum 5% to 10% deposit; 20% avoids LMI. First home buyer schemes can let you buy with 5% deposit and no LMI.",
  "Budget an additional 3% to 5% of purchase price for upfront transaction costs (stamp duty, conveyancing, inspections, insurance).",
  "Pre-approval typically lasts 90 days and is conditional on the property valuing correctly and your circumstances not changing. It's not a guarantee.",
  "Cooling-off periods exist in most states (3 to 5 business days) but never apply to auction purchases, which are unconditional from the moment the hammer falls.",
  "A building and pest inspection costs $400 to $800 and can save you from buying a structurally compromised property. Never skip it.",
  "Settlement usually occurs 30 to 90 days after exchange and happens electronically via PEXA. You don't need to attend, just collect the keys when it clears.",
];

const TOC: GuideTOCEntry[] = [
  { id: "overview",          label: "Overview" },
  { id: "step-1-finances",   label: "Step 1: Assess your finances" },
  { id: "step-2-borrowing",  label: "Step 2: Understand your borrowing capacity" },
  { id: "step-3-costs",      label: "Step 3: Factor in all costs" },
  { id: "step-4-research",   label: "Step 4: Research suburbs" },
  { id: "step-5-search",     label: "Step 5: Search for properties" },
  { id: "step-6-offer",      label: "Step 6: Making an offer or bidding at auction" },
  { id: "step-7-inspection", label: "Step 7: Building and pest inspection" },
  { id: "step-8-conveyancing", label: "Step 8: Conveyancing" },
  { id: "step-9-exchange",   label: "Step 9: Exchange of contracts" },
  { id: "step-10-settlement",label: "Step 10: Settlement" },
  { id: "after-settlement",  label: "After settlement" },
];

const FAQS: FaqItem[] = [
  {
    question: "What's the minimum deposit to buy property in Australia?",
    answer:
      "Most lenders accept a minimum 5% to 10% deposit, though anything below 20% triggers Lenders Mortgage Insurance (LMI). First home buyers may qualify for federal schemes (First Home Guarantee, Family Home Guarantee) that allow 5% or 2% deposits without LMI. The Help to Buy shared-equity scheme can lower the cap further.",
  },
  {
    question: "How long does buying a property in Australia take from start to finish?",
    answer:
      "From getting pre-approval to picking up the keys typically takes three to six months. Pre-approval and suburb research takes weeks; the active offer / auction phase varies; from contract exchange to settlement is usually 30 to 90 days (typically 30 to 45). Auction purchases compress the search-to-exchange timeline dramatically.",
  },
  {
    question: "What costs are there beyond the deposit?",
    answer:
      "Stamp duty (the largest, varies by state and price), conveyancing ($1,000 to $3,000), building and pest inspection ($400 to $800), LMI if applicable, lender fees ($0 to $600), title and registration fees, building insurance, and moving costs. Budget 3% to 5% of purchase price for these on top of your deposit.",
  },
  {
    question: "Should I buy at auction or by private treaty?",
    answer:
      "Private treaty (negotiating an offer) gives you cooling-off rights and time to do due diligence after exchange. Auction purchases are unconditional from the moment the hammer falls, so all due diligence (finance, inspection, contract review) must be done before auction day. In Sydney and Melbourne, auctions dominate; elsewhere private treaty is more common.",
  },
  {
    question: "Do I need a mortgage broker?",
    answer:
      "Not strictly. You can apply directly with any lender. A broker can compare 30+ lender policies and rates simultaneously, knows which lenders currently have available scheme places, and handles paperwork as part of your loan application. Brokers are paid commission by the lender; their service is typically free to you.",
  },
  {
    question: "What's the cooling-off period after exchange of contracts?",
    answer:
      "It varies by state and never applies to auction purchases. NSW: 5 business days (0.25% penalty); VIC: 3 business days (0.2% penalty); QLD: 5 business days (0.25% penalty); SA: 2 business days; TAS: 3 business days; ACT: 5 business days. WA and NT have no statutory cooling-off period for residential property.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide",          href: "/guides/first-home-buyer-guide", description: "Federal schemes, state grants, and concessions in plain English." },
  { title: "Conveyancing Guide",              href: "/guides/conveyancing-guide", description: "What conveyancers do, what they cost, when to use a solicitor." },
  { title: "Building and Pest Inspection",    href: "/guides/building-pest-inspection", description: "What inspectors look for and what their reports mean." },
  { title: "Property Auction Guide",          href: "/guides/property-auction-guide", description: "How auctions actually run, and how to bid without overpaying." },
  { title: "Borrowing Power Calculator",      href: "/borrowing-power-calculator", description: "Estimate how much you can borrow before you pre-approve." },
  { title: "Stamp Duty Calculator",           href: "/stamp-duty-calculator", description: "Estimate the largest upfront cost after the deposit." },
];

export default function BuyingPropertyAustraliaPage() {
  return (
    <>
      <HowToJsonLd
        name="How to buy property in Australia"
        description="The eight-step process for buying property in Australia, from assessing finances through to settlement."
        url={`/guides/${FRONTMATTER.slug}`}
        steps={[
          { name: "Assess your finances and set a realistic budget", text: "Use a borrowing power calculator and account for stamp duty, conveyancing, and inspections.", url: "/borrowing-power-calculator" },
          { name: "Get pre-approval", text: "Pre-approval gives you 90 days to shop with confidence and signals seriousness to agents." },
          { name: "Research suburbs and shortlist", text: "Use suburb data, school catchments, walk scores and median prices to narrow down to 2 to 4 suburbs.", url: "/suburbs" },
          { name: "Inspect properties", text: "Open homes are a starting point. Book private inspections of anything that makes the shortlist." },
          { name: "Make an offer or attend auction", text: "Private treaty negotiation or auction bidding, depending on the property's sale method." },
          { name: "Building & pest inspection", text: "Commission inspections within the cooling-off window or before auction.", url: "/guides/building-pest-inspection" },
          { name: "Conveyancing and contract review", text: "Your conveyancer reviews the contract, lodges searches, and prepares for settlement.", url: "/guides/conveyancing-guide" },
          { name: "Settlement and handover", text: "Funds transfer, title transfers, and you receive the keys." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="General information, not advice">
        <p>
          This guide is for general information only. Property law varies
          meaningfully by state. Always consult a licensed conveyancer, mortgage
          broker, or solicitor for advice specific to your circumstances and
          state.
        </p>
      </Callout>

      <h2 id="overview">Why buying property in Australia is complex but manageable</h2>
      <p className="lead">
        Buying property in Australia is one of the largest financial decisions
        most people will ever make. The process involves multiple professionals,
        mortgage brokers, conveyancers, building inspectors, and real estate
        agents, and varies meaningfully by state. In Queensland, property is
        sold under different contract conditions than in New South Wales;
        auction rules in Victoria differ from those in Western Australia.
      </p>
      <p>
        The good news is that Australia has a robust and well-regulated property
        market. With the right preparation and a clear understanding of each
        step, buying property is very much achievable, even in a competitive
        market. This guide walks you through every stage, from initial financial
        health-check to collecting the keys.
      </p>

      <h2 id="step-1-finances">Step 1: Assess your finances</h2>
      <p>
        Before you start browsing listings, spend time getting a clear picture
        of where you stand financially. Lenders will look at three core things:
        your savings (deposit), your income (serviceability), and your credit
        history.
      </p>

      <h3>How much deposit do you need?</h3>
      <p>
        Most lenders require a minimum 5 to 10% deposit, though 20% avoids
        Lenders Mortgage Insurance (LMI). LMI protects the lender, not you, if
        you default, and can add tens of thousands of dollars to the cost of
        your loan. On a $700,000 purchase with a 10% deposit, LMI might cost
        $10,000 to $18,000 depending on the lender and insurer.
      </p>
      <p>
        If you&rsquo;re a first home buyer, certain government schemes allow
        you to purchase with as little as 5% deposit and no LMI. See our{" "}
        <Link href="/guides/first-home-buyer-guide">First Home Buyer Guide</Link>{" "}
        and our <Link href="/guides/lenders-mortgage-insurance-guide">LMI Guide</Link>{" "}
        for details.
      </p>

      <h3>Income and serviceability</h3>
      <p>
        Lenders assess whether your income is sufficient to service (repay) the
        loan, factoring in all existing debts including credit cards, car loans,
        and HECS-HELP debt. Since 2021, APRA requires lenders to test
        serviceability at 3 percentage points above the loan&rsquo;s interest
        rate, so if rates are 6%, they test your ability to repay at 9%.
      </p>

      <h3>Check your credit history</h3>
      <p>
        Obtain a free credit report from Equifax, illion, or Experian before
        applying for pre-approval. Any defaults, late payments, or errors can
        delay or reduce your borrowing capacity. Errors are surprisingly common
        and can be disputed and corrected, allow 4 to 6 weeks if you need to
        fix anything.
      </p>

      <h2 id="step-2-borrowing">Step 2: Understand your borrowing capacity</h2>
      <p>
        Use our{" "}
        <Link href="/borrowing-power-calculator">Borrowing Power Calculator</Link>{" "}
        to get an estimate of how much you can borrow based on your income,
        expenses, and deposit. Remember this is a guide only, actual borrowing
        capacity depends on the specific lender and your complete financial
        picture.
      </p>
      <p>
        Getting a formal{" "}
        <Link href="/guides/home-loan-pre-approval-australia">pre-approval</Link>{" "}
        (also called conditional approval) from a
        lender gives you a realistic budget and signals to agents that
        you&rsquo;re a serious buyer. Pre-approvals typically last 90 days and
        can be renewed. Pre-approval is not a guarantee of final approval, it
        is conditional on the property valuing at or above purchase price and
        your circumstances not changing.
      </p>
      <p>
        Consider using a{" "}
        <Link href="/guides/how-to-choose-a-mortgage-broker">mortgage broker</Link>.
        A good broker has access to dozens of
        lenders and can often find better rates than you&rsquo;d find going
        direct. Their service is typically free to you, they receive commission
        from the lender.
      </p>

      <h2 id="step-3-costs">Step 3: Factor in all costs</h2>
      <p>
        The purchase price is just the beginning. When budgeting, include all of
        the following:
      </p>
      <ul>
        <li><strong>Stamp duty (transfer duty).</strong> The largest upfront cost after the deposit. Use our <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link> to estimate the amount for your state, it varies significantly. For a $700,000 property in QLD, expect around $14,175 (owner-occupier); in NSW, approximately $26,857.</li>
        <li><strong>Conveyancing fees.</strong> $1,000 to $3,000 depending on state and complexity.</li>
        <li><strong>Building and pest inspection.</strong> $400 to $800. Essential, do not skip this.</li>
        <li><strong>Lenders Mortgage Insurance (LMI).</strong> If your deposit is below 20%, potentially $5,000 to $30,000+.</li>
        <li><strong>Loan application or establishment fees.</strong> $0 to $600 depending on lender.</li>
        <li><strong>Title search fees.</strong> Typically included in conveyancing.</li>
        <li><strong>Building insurance.</strong> Required from exchange (or earlier in some states). Budget $1,200 to $3,000 a year.</li>
        <li><strong>Moving costs.</strong> $500 to $5,000 depending on volume and distance.</li>
        <li><strong>Strata fees (if buying an apartment).</strong> Ongoing quarterly fees. Check the strata records before committing.</li>
      </ul>

      <KeyFigure
        value="3–5%"
        label="Of purchase price you should budget for upfront transaction costs (stamp duty, conveyancing, inspection, insurance, lender fees) on top of the deposit."
        context="Rough rule, varies by state and purchase type"
      />

      <MiniStampDutyEmbed />

      <h2 id="step-4-research">Step 4: Research suburbs</h2>
      <p>
        Once you have a realistic budget, start researching suburbs. The best
        property at the wrong location can be a poor investment.
      </p>
      <ul>
        <li><strong>Median prices and growth trends.</strong> Each suburb profile on Your Property Guide shows historical median prices, annual growth rates, and time on market. Use these to identify suburbs trending upward before they become unaffordable.</li>
        <li><strong>Rental yields.</strong> If you&rsquo;re buying an investment property, rental yield tells you the income return. Use our <Link href="/rental-yield-calculator">Rental Yield Calculator</Link>.</li>
        <li><strong>Infrastructure and amenity.</strong> Proximity to schools, transport corridors, employment hubs, and shopping. Planned infrastructure (new rail lines, hospital expansions) can drive price growth.</li>
        <li><strong>School catchments.</strong> Particularly important for families. Your Property Guide maps school catchments for primary and secondary schools across Australia.</li>
        <li><strong>Days on market.</strong> Short days on market (below 30 days) indicates a seller&rsquo;s market, competition is high, negotiate carefully.</li>
      </ul>
      <p>
        Attend open homes in your target suburbs even before you&rsquo;re ready
        to buy. Understanding what different price points get you is invaluable
        context when you start making offers.
      </p>

      <GuideSuburbSearch />

      <h2 id="step-5-search">Step 5: Search for properties</h2>
      <p>
        With your budget confirmed and target suburbs identified, begin actively
        searching. When attending inspections:
      </p>
      <ul>
        <li>Arrive early and take your time, agents expect buyers to look thoroughly.</li>
        <li>Check for signs of water damage (staining on ceilings, peeling paint, damp smell in subfloor areas).</li>
        <li>Test all windows, doors, and fixtures.</li>
        <li>Look at the orientation, north-facing living areas get year-round sun.</li>
        <li>Ask the agent how long the property has been on the market and whether there have been any prior offers.</li>
        <li>Check the council rates notice, it tells you the land valuation and annual rates.</li>
        <li>For apartments, ask for the strata report (body corporate records). Look for major upcoming levies or disputes.</li>
        <li>Visit the street at different times of day if you&rsquo;re seriously interested, noise, parking, and activity change significantly between morning and evening.</li>
      </ul>

      <h2 id="step-6-offer">Step 6: Making an offer or bidding at auction</h2>

      <h3>Private treaty (making an offer)</h3>
      <p>
        In a private sale, you submit an offer in writing through the agent.
        Your offer can be conditional (subject to finance, building inspection,
        etc.) or unconditional. The vendor can accept, reject, or counter-offer.
        Negotiations are normal, first offers are rarely accepted at face value.
      </p>
      <p>
        Before making an offer, do your{" "}
        <Link href="/guides/due-diligence-checklist-buying-a-house">due diligence</Link>:
        review the contract
        (have your conveyancer check it), arrange pre-approval, and if possible
        get a building inspection done before you exchange. In Queensland,
        building inspections are often done before signing due to the contract
        format; in NSW and VIC, they&rsquo;re typically done during the{" "}
        <Link href="/guides/cooling-off-period-by-state-australia">cooling-off period</Link>.
      </p>

      <h3>Buying at auction</h3>
      <p>Auctions are common in Sydney and Melbourne. Key points:</p>
      <ul>
        <li>Register to bid before the auction (bring ID).</li>
        <li>You must have finance pre-approved, there is no cooling-off period at auction.</li>
        <li>Have your building inspection done before auction day.</li>
        <li>The highest bid above the reserve wins; you exchange contracts and pay the deposit on the spot.</li>
        <li>Set your maximum bid before the auction and stick to it, the atmosphere can be emotionally charged.</li>
        <li>If a property is &ldquo;passed in&rdquo; (no one bids above reserve), the highest bidder gets first right to negotiate with the vendor.</li>
      </ul>
      <p>
        See our <Link href="/guides/property-auction-guide">Property Auction Guide</Link>{" "}
        for the full mechanics.
      </p>

      <MatchCTA kind="buyers-agent" />

      <h2 id="step-7-inspection">Step 7: Building and pest inspection, why it&rsquo;s essential</h2>
      <p>
        A professional building and pest inspection can save you from buying a
        property with serious structural defects, rising damp, or active
        termite infestation. Cost: $400 to $800. Worth every dollar.
      </p>
      <p>A qualified building inspector will examine:</p>
      <ul>
        <li>Roof structure and condition (including gutters and downpipes)</li>
        <li>Subfloor structure and moisture levels</li>
        <li>Wall and ceiling cracks (cosmetic vs structural)</li>
        <li>Electrical switchboard condition</li>
        <li>Evidence of previous termite activity or damage</li>
        <li>Drainage and potential water ingress</li>
      </ul>
      <p>
        The report will note items as &ldquo;major defect&rdquo;, &ldquo;minor
        defect&rdquo;, or &ldquo;maintenance item&rdquo;. Major defects
        (structural issues, active termites, significant roof damage) may
        warrant renegotiating the price or walking away. Minor defects are
        part of normal ownership.
      </p>

      <h2 id="step-8-conveyancing">Step 8: Conveyancing</h2>
      <p>
        A conveyancer (or solicitor) handles the legal transfer of property
        from the seller to you. Their work includes:
      </p>
      <ul>
        <li>Reviewing the contract of sale and identifying unusual conditions or risks</li>
        <li>Conducting title searches to confirm the seller owns the property and there are no encumbrances</li>
        <li>Liaising with your lender to arrange funds for settlement</li>
        <li>Calculating adjustments (council rates, water charges) between you and the vendor</li>
        <li>Attending settlement and completing the transfer of title</li>
      </ul>
      <p>
        Conveyancers are licensed property transfer specialists. Solicitors can
        also do conveyancing and may be preferred for complex transactions
        (deceased estates, company sales, unusual structures). Fees typically
        range from $1,000 to $3,000 plus disbursements (search fees,
        registration). Read our{" "}
        <Link href="/guides/conveyancing-guide">Conveyancing Guide</Link> for
        the full picture.
      </p>

      <h2 id="step-9-exchange">Step 9: Exchange of contracts</h2>
      <p>
        Exchange is the point at which both parties sign the contract and it
        becomes legally binding. You pay the deposit (typically 10%, though
        sometimes 5% is negotiated) at exchange.
      </p>

      <h3>Cooling-off periods by state</h3>
      <p>
        Most states provide a cooling-off period after exchange during which
        the buyer can withdraw (usually forfeiting a small penalty):
      </p>
      <ul>
        <li><strong>NSW.</strong> 5 business days (penalty: 0.25% of purchase price)</li>
        <li><strong>VIC.</strong> 3 business days (penalty: 0.2% of purchase price)</li>
        <li><strong>QLD.</strong> 5 business days (penalty: 0.25% of purchase price)</li>
        <li><strong>SA.</strong> 2 business days (penalty: 0.25% of purchase price)</li>
        <li><strong>WA.</strong> No statutory cooling-off period for residential property</li>
        <li><strong>TAS.</strong> 3 business days (penalty: 0.25% of purchase price)</li>
        <li><strong>ACT.</strong> 5 business days</li>
        <li><strong>NT.</strong> No statutory cooling-off period</li>
      </ul>

      <Callout variant="warning" title="Auctions have no cooling-off period">
        <p>
          Properties sold at auction have no cooling-off period in any state.
          If you buy at auction, you are unconditionally committed from the
          moment the hammer falls. All due diligence (finance, inspection,
          contract review) must be complete before you raise your hand.
        </p>
      </Callout>

      <p>
        Use the cooling-off period wisely: finalise your building inspection,
        confirm your finance is unconditionally approved, and have your
        solicitor review anything you didn&rsquo;t understand in the contract.
      </p>

      <h2 id="step-10-settlement">Step 10: Settlement</h2>
      <p>
        Settlement typically occurs 30 to 90 days after exchange (commonly 30
        to 45 days). During this period, your lender finalises your loan, and
        your conveyancer prepares the settlement documents.
      </p>
      <p>In the days before settlement:</p>
      <ul>
        <li>Conduct a pre-settlement inspection to ensure the property is in the same condition as when you purchased it.</li>
        <li>Confirm all included fixtures and fittings are present (check the contract, anything written in is staying).</li>
        <li>Report any damage or missing items to your conveyancer immediately.</li>
      </ul>
      <p>
        On settlement day, your conveyancer and lender exchange funds and
        documents electronically (through PEXA in most states). You do not need
        to attend. When settlement is confirmed, usually within a few hours,
        you collect the keys from the agent.
      </p>
      <p>
        Transfer of title is lodged with the state land titles office.
        You&rsquo;re now the legal owner.
      </p>

      <h2 id="after-settlement">After settlement</h2>

      <h3>Insurance</h3>
      <p>
        Building insurance should be in place from exchange (check your
        contract, the risk often passes to you at exchange in some states).
        Contents insurance and landlord insurance (for investment properties)
        should be arranged before tenants move in.
      </p>

      <h3>Council rates and land tax</h3>
      <p>
        You will begin receiving quarterly council rate notices. For investment
        properties, land tax applies in most states once your total land value
        exceeds the threshold for that state. Thresholds and rates vary, your
        accountant can advise.
      </p>

      <h3>Loan management</h3>
      <p>
        Review your loan annually. Interest rate changes, your financial
        situation, or better products on the market may make it worth
        refinancing. Even 0.5% less on a $600,000 loan saves $3,000 per year.
        Run the maths in our{" "}
        <Link href="/refinancing-calculator">refinancing calculator</Link>.
      </p>

      <h3>Record keeping</h3>
      <p>
        Keep all purchase documents, including the contract, building
        inspection report, and settlement statement. For investment properties,
        your accountant will need these. For your primary residence, records of
        capital improvements reduce CGT when you eventually sell.
      </p>

      <GuideGlossaryRail
        slugs={[
          "exchange-of-contracts",
          "cooling-off-period",
          "stamp-duty-transfer-duty",
          "lenders-mortgage-insurance-lmi",
        ]}
      />
    </GuideArticleLayout>
    </>
  );
}
