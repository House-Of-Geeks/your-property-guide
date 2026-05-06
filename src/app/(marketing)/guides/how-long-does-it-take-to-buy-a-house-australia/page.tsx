import type { Metadata } from "next";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { HowToJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "How Long Does It Take to Buy a House in Australia? Realistic 2026 Timelines",
  description:
    "From pre-approval to keys in hand, how long does buying a house in Australia really take? A realistic week-by-week breakdown with the typical delays that catch first-time buyers off guard.",
  slug: "how-long-does-it-take-to-buy-a-house-australia",
  publishedAt: "2026-05-06",
  updatedAt: "2026-05-06",
  readingTimeMinutes: 8,
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
  "From pre-approval to settlement, the typical Australian property purchase takes 12 to 20 weeks. Most of that is the search, not the paperwork.",
  "Pre-approval: 1 to 2 weeks. Property search: 6 to 16 weeks (the wildcard). Contract to settlement: 30 to 90 days depending on state and contract terms.",
  "Settlement is typically 30 days in NSW and ACT, 30 to 60 days in VIC and QLD, and 30 to 90 days in WA, SA, TAS, and NT.",
  "The process is fastest if you have pre-approval already, are flexible on suburb, and buy at private treaty (auction skips the cooling-off step but doesn't speed up settlement).",
  "Common delays: finance approval needing a top-up valuation, building inspection finding issues that trigger renegotiation, and conveyancer holiday closures.",
];

const TOC: GuideTOCEntry[] = [
  { id: "the-headline",       label: "The headline timeline" },
  { id: "stage-1",            label: "Stage 1: Get ready (2 to 6 weeks)" },
  { id: "stage-2",            label: "Stage 2: Pre-approval (1 to 2 weeks)" },
  { id: "stage-3",            label: "Stage 3: Search (6 to 16 weeks)" },
  { id: "stage-4",            label: "Stage 4: Offer & contract (1 to 2 weeks)" },
  { id: "stage-5",            label: "Stage 5: Cooling-off (3 to 5 days)" },
  { id: "stage-6",            label: "Stage 6: Settlement (30 to 90 days)" },
  { id: "by-state",           label: "Settlement times by state" },
  { id: "speed-it-up",        label: "How to speed it up" },
  { id: "common-delays",      label: "Common delays" },
  { id: "next-steps",         label: "Next steps" },
];

const FAQS: FaqItem[] = [
  {
    question: "How long does it take to buy a house in Australia?",
    answer:
      "From getting pre-approved to receiving keys at settlement, the typical timeline is 12 to 20 weeks. The biggest variable is the property search itself (often 6 to 16 weeks). Pre-approval takes 1 to 2 weeks; the contract-to-settlement period is 30 to 90 days depending on state and contract terms.",
  },
  {
    question: "What's the fastest you can buy a house in Australia?",
    answer:
      "With pre-approval already in place, a buyer who finds the right property quickly and negotiates a 30-day settlement can complete in 5 to 7 weeks total (1 week for offer/cooling-off + 30 days for settlement). Anything faster requires a cash purchase with no finance contingency.",
  },
  {
    question: "How long is the standard settlement period?",
    answer:
      "30 days is standard in NSW and ACT. 30 to 60 days is typical in Victoria and Queensland. 30 to 90 days is common in WA, SA, TAS, and NT. The settlement date is negotiable as part of the contract — sellers often prefer longer (more time to find their next home), buyers often prefer shorter.",
  },
  {
    question: "How long does pre-approval take?",
    answer:
      "Most lenders return pre-approval in 5 to 10 business days from a complete application. Bringing your full income evidence, identity documents, current liability statements, and 3 months of bank statements upfront can compress this to 3 to 5 business days. Working with a broker can also speed things up because they pre-screen against lender policy before applying.",
  },
  {
    question: "Can I buy a house in 30 days?",
    answer:
      "Yes if you already have pre-approval, find the right property quickly, and the seller is open to a 30-day settlement (more common in NSW/ACT than other states). Without pre-approval, 30 days from start to settlement is essentially impossible.",
  },
  {
    question: "What slows down the process the most?",
    answer:
      "The property search is the wildcard — it can take a weekend or six months. After that, the most common delays are finance issues (a low valuation triggering a top-up, or HEM-driven serviceability cuts), building inspection findings that trigger renegotiation, and conveyancer or bank closures over Christmas/New Year and Easter.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Buying Property in Australia", href: "/guides/buying-property-australia", description: "The full step-by-step buyer's playbook." },
  { title: "How Much Deposit Do You Need?", href: "/guides/how-much-deposit-to-buy-a-house", description: "5%, 10%, 20% — what each tier unlocks, plus schemes." },
  { title: "Cooling-Off Period by State", href: "/guides/cooling-off-period-by-state-australia", description: "Your right to rescind a contract, state by state." },
  { title: "Building & Pest Inspection", href: "/guides/building-pest-inspection", description: "When to inspect and what the report should cover." },
  { title: "Conveyancing in Australia", href: "/guides/conveyancing-guide", description: "What your conveyancer actually does, and how to pick one." },
];

export default function HowLongBuyHouseGuide() {
  return (
    <>
      <HowToJsonLd
        name="How long it takes to buy a house in Australia"
        description="The six stages of buying a property in Australia and the typical time each takes."
        url={`/guides/${FRONTMATTER.slug}`}
        totalTime="P16W"
        steps={[
          { name: "Get ready", text: "Save deposit, clean up credit, get income documentation in order. 2 to 6 weeks of preparation, but can be done in parallel with the next steps." },
          { name: "Pre-approval", text: "Apply for conditional finance approval through a lender or broker. Typically 1 to 2 weeks." },
          { name: "Property search", text: "Inspect, shortlist, and negotiate. The big wildcard — anywhere from 1 weekend to 6 months." },
          { name: "Offer and contract exchange", text: "Make an offer or attend auction, then sign the contract. 1 to 2 weeks." },
          { name: "Cooling-off and due diligence", text: "Building & pest, contract review, finance unconditional. 3 to 5 business days in most states." },
          { name: "Settlement", text: "Final payment, title transfer, key handover. Typically 30 to 90 days from contract exchange." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="The honest answer: it depends on the search">
        <p>
          The paperwork side of buying property in Australia is fairly
          predictable. The search isn&rsquo;t. We&rsquo;ll break down the
          typical time at each stage so you can plan around the variables you
          can control.
        </p>
      </Callout>

      <h2 id="the-headline">The headline timeline</h2>
      <p className="lead">
        From the day you start the pre-approval process to the day you receive
        the keys, expect <strong>12 to 20 weeks</strong> for a typical
        Australian property purchase. The search itself is the biggest
        variable — finance and contracts are relatively predictable.
      </p>

      <KeyFigure
        value="12 to 20 weeks"
        label="Typical end-to-end timeline for buying a house in Australia"
        context="From applying for pre-approval to settlement and key handover."
      />

      <h2 id="stage-1">Stage 1: Get ready (2 to 6 weeks, in parallel)</h2>
      <p>
        Before any lender or agent enters the picture:
      </p>
      <ul>
        <li>Final deposit savings (or confirm gift / inheritance is in your account for the genuine-savings rule)</li>
        <li>Pull your credit report; resolve any defaults or late marks</li>
        <li>Reduce credit card limits to the actual amount you use (limits, not balances, count against borrowing power)</li>
        <li>Stabilise income — if you&rsquo;re changing jobs, finish probation first</li>
        <li>Gather: 3 months of payslips, 3 months of bank statements, ID, current liabilities, super statements</li>
      </ul>
      <p>
        Most of this can happen in parallel with the next stages. If
        you&rsquo;ve been planning for a while, this stage may already be done.
      </p>

      <h2 id="stage-2">Stage 2: Pre-approval (1 to 2 weeks)</h2>
      <p>
        Apply for conditional finance approval through a lender or mortgage
        broker. The lender assesses your income, expenses, and credit, and
        confirms (in writing) the maximum amount they&rsquo;d lend you,
        subject to a satisfactory property valuation later.
      </p>
      <p>
        <strong>Speed factors:</strong>
      </p>
      <ul>
        <li>Complete application up front: 3 to 5 business days</li>
        <li>Missing documents requiring follow-up: 7 to 10 business days</li>
        <li>Self-employed or complex income: 10 to 15 business days</li>
      </ul>
      <p>
        Pre-approval is typically valid for <strong>90 days</strong>. Some
        lenders extend on request without re-assessment.
      </p>

      <h2 id="stage-3">Stage 3: Property search (6 to 16 weeks)</h2>
      <p>
        The wildcard. Some buyers find their property the first weekend.
        Others search for six months. The median in capital city markets
        is 8 to 12 weeks of active searching for first home buyers.
      </p>
      <p>
        Factors that lengthen the search:
      </p>
      <ul>
        <li>Tight budget that puts you at the cheap end of the suburb</li>
        <li>Specific feature requirements (school catchment, north-facing, parking)</li>
        <li>Hot market with multiple bidders on every property</li>
        <li>Self-imposed delays (only inspecting on certain weekends)</li>
      </ul>

      <h2 id="stage-4">Stage 4: Offer and contract exchange (1 to 2 weeks)</h2>
      <p>
        Once you find the property, the offer process varies by sale method:
      </p>
      <ul>
        <li><strong>Auction:</strong> Bid on auction day. Contract exchanges immediately on the fall of the hammer. No cooling-off.</li>
        <li><strong>Private treaty:</strong> Submit a written offer, negotiate, sign contracts when accepted. Typically 3 to 7 days from first offer to signed contract.</li>
        <li><strong>Expression of interest / tender:</strong> Submit by deadline; vendor reviews and accepts. Can take 1 to 2 weeks.</li>
      </ul>

      <h2 id="stage-5">Stage 5: Cooling-off and due diligence (3 to 5 business days)</h2>
      <p>
        For private treaty purchases in NSW, VIC, QLD, SA, ACT, and NT, you
        have a short cooling-off window after exchange to commission building
        and pest inspections, get unconditional finance approval, and review
        the contract carefully. WA and Tasmania don&rsquo;t have a statutory
        cooling-off — protections are negotiated as contract conditions
        instead.
      </p>
      <p>
        See our{" "}
        <a href="/guides/cooling-off-period-by-state-australia">
          cooling-off period by state guide
        </a>{" "}
        for the exact window in your state.
      </p>

      <h2 id="stage-6">Stage 6: Settlement (30 to 90 days)</h2>
      <p>
        The settlement period is the time between contract exchange and the
        final payment + title transfer + key handover. During this period:
      </p>
      <ul>
        <li>Your conveyancer lodges title and council searches</li>
        <li>Your bank books the valuation, prepares the loan documents</li>
        <li>You sign loan documents and pay any insurance / mortgage protection</li>
        <li>The seller arranges to vacate (if the property is owner-occupied)</li>
        <li>Final pre-settlement inspection 1 to 3 days before settlement</li>
        <li>Settlement day: funds transfer through PEXA, title transfers, agent releases keys</li>
      </ul>

      <h2 id="by-state">Settlement times by state</h2>
      <ul>
        <li><strong>NSW:</strong> 30 days standard (sometimes 42 to 60 days)</li>
        <li><strong>VIC:</strong> 30 to 60 days standard</li>
        <li><strong>QLD:</strong> 30 to 60 days standard</li>
        <li><strong>WA:</strong> 30 to 90 days; 60 days common for established stock</li>
        <li><strong>SA:</strong> 30 to 90 days standard</li>
        <li><strong>TAS:</strong> 30 to 90 days standard</li>
        <li><strong>NT:</strong> 30 to 60 days standard</li>
        <li><strong>ACT:</strong> 30 days standard</li>
      </ul>
      <p>
        Settlement date is negotiable as part of the contract terms. Buyers
        sometimes ask for a longer settlement to give them time to sell their
        existing property; sellers sometimes ask for a longer settlement to
        find their next home.
      </p>

      <h2 id="speed-it-up">How to speed it up</h2>
      <ul>
        <li><strong>Get pre-approved before searching.</strong> The biggest single time saver.</li>
        <li><strong>Pick a conveyancer before you find a property.</strong> Saves a week of vendor-recommended-conveyancer faff.</li>
        <li><strong>Negotiate a 30-day settlement.</strong> Most achievable in NSW/ACT, harder in WA/SA.</li>
        <li><strong>Keep building &amp; pest inspectors and brokers on speed-dial.</strong> Booking in 24 hours instead of 5 days saves a week of cooling-off.</li>
        <li><strong>Be flexible on suburb.</strong> Three target suburbs vs one cuts search time materially.</li>
      </ul>

      <Callout variant="warning" title="Avoid Christmas and Easter periods">
        <p>
          Conveyancers, banks, and inspection firms close down between
          mid-December and late January, and around Easter. A purchase that
          would settle in 30 days in March can take 50 days in December
          because of holiday closures. If you&rsquo;re settling in this window,
          add 2 to 3 weeks to your timeline.
        </p>
      </Callout>

      <h2 id="common-delays">Common delays</h2>
      <ul>
        <li>
          <strong>Low valuation.</strong> The bank&rsquo;s valuer comes in
          below your purchase price; the lender wants you to top up the
          deposit or renegotiate. Adds 1 to 2 weeks.
        </li>
        <li>
          <strong>Building inspection findings.</strong> A significant defect
          triggers price renegotiation or further specialist reports. Adds
          3 to 10 days.
        </li>
        <li>
          <strong>Strata report concerns (apartments).</strong> A pending
          special levy or active dispute triggers renegotiation. Adds 3 to
          7 days.
        </li>
        <li>
          <strong>Income re-verification.</strong> A late payslip or change
          in employment between pre-approval and unconditional approval
          can trigger a re-assessment. Adds 1 to 2 weeks.
        </li>
        <li>
          <strong>Settlement booking issues.</strong> The PEXA workspace
          isn&rsquo;t set up in time, or one party isn&rsquo;t ready.
          Settlement reschedules to the next business day or week.
        </li>
      </ul>

      <h2 id="next-steps">Next steps</h2>
      <ol>
        <li>
          Apply for pre-approval through a broker or directly with a lender.
          Free, takes 1 to 2 weeks, valid for 90 days.
        </li>
        <li>
          Use our{" "}
          <a href="/borrowing-power-calculator">Borrowing Power Calculator</a>{" "}
          to set a realistic search budget.
        </li>
        <li>
          Pick a conveyancer or solicitor and have their details ready before
          you find a property.
        </li>
        <li>
          Book building &amp; pest inspectors on speed-dial in your target
          suburbs.
        </li>
        <li>
          Read our full{" "}
          <a href="/guides/buying-property-australia">buying property in Australia guide</a>{" "}
          for the step-by-step playbook.
        </li>
      </ol>
    </GuideArticleLayout>
    </>
  );
}
