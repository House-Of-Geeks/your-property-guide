import type { Metadata } from "next";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MiniStampDutyEmbed,
  GuideNewsletterCallout,
  GuideGlossaryRail,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { HowToJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "How Much Deposit Do You Need to Buy a House in Australia? (2026)",
  description:
    "The full breakdown of house deposit requirements in Australia: 5% with LMI, 10% standard, 20% to skip LMI. Includes worked examples, government schemes, and a practical roadmap.",
  slug: "how-much-deposit-to-buy-a-house",
  publishedAt: "2026-05-06",
  updatedAt: "2026-05-06",
  readingTimeMinutes: 9,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "first-home",
};

export const metadata: Metadata = {
  title: FRONTMATTER.title,
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
  "Most Australian lenders require a minimum 5% deposit, but you'll pay Lenders Mortgage Insurance (LMI) on anything below 20%.",
  "A 20% deposit is the threshold to avoid LMI entirely. On a $700,000 home that's $140,000 saved, plus another $20,000 to $40,000 for stamp duty and fees.",
  "First Home Buyers can use the Home Guarantee Scheme to buy with just 5% (no LMI), the Family Home Guarantee for 2%, or the Regional First Home Buyer Guarantee.",
  "Genuine savings rules typically require 5% of the price held in your name for at least 3 months. Gifts, FHSS, and inheritance can supplement but rarely replace it.",
  "The total cash you need at settlement is deposit + stamp duty + conveyancing + building inspection + bank fees. Budget 23% to 25% of the price all-in if you want to avoid LMI.",
];

const TOC: GuideTOCEntry[] = [
  { id: "the-short-answer", label: "The short answer" },
  { id: "deposit-tiers",    label: "Deposit tiers explained" },
  { id: "lmi",              label: "What LMI actually costs" },
  { id: "all-in-cash",      label: "All-in cash needed" },
  { id: "schemes",          label: "Government schemes (5% & 2%)" },
  { id: "genuine-savings",  label: "Genuine savings rule" },
  { id: "fhss",             label: "First Home Super Saver" },
  { id: "save-faster",      label: "How to save faster" },
  { id: "next-steps",       label: "Next steps" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can I buy a house with no deposit in Australia?",
    answer:
      "Effectively no. The lowest you can go without a guarantor is 5% (with LMI). With a parental guarantor, some lenders will fund 100% of the purchase price, secured against equity in the parent's home. This works but the guarantor is liable if you default, it's a serious commitment for the family member providing the guarantee.",
  },
  {
    question: "Is a 5% deposit enough?",
    answer:
      "Mathematically yes, most banks accept it. Practically, expect to pay $15,000 to $25,000 in LMI on a $600,000 to $700,000 loan. The Home Guarantee Scheme avoids LMI on a 5% deposit but has property price caps and an income test. If you qualify, it's usually the cheapest path in.",
  },
  {
    question: "How much deposit for a $500,000 house?",
    answer:
      "5% is $25,000 (with LMI), 10% is $50,000, and 20% is $100,000. Add stamp duty (varies by state, about $18,000 in NSW for a non-first-home buyer), conveyancing ($1,500 to $3,000), building/pest inspection ($600 to $1,000), and lender fees ($600 to $1,200). Total cash to settle a 20% deposit purchase: roughly $120,000 to $125,000.",
  },
  {
    question: "Can I use my super for a house deposit?",
    answer:
      "Through the First Home Super Saver scheme (FHSS), first home buyers can voluntarily contribute up to $15,000 per year (max $50,000 total) into super and later withdraw it for a deposit. The contributions are taxed at 15% rather than your marginal rate, so the after-tax balance grows faster than savings outside super. Withdrawals are taxed at marginal rate minus 30%.",
  },
  {
    question: "What counts as genuine savings?",
    answer:
      "Money held in your own bank account for at least 3 months, typically 5% of the purchase price. Shares, term deposits, and rent paid (with a clean rental ledger) often count. Cash gifts and inheritance usually don't, but some lenders will accept them if held for 3+ months.",
  },
  {
    question: "Does the Home Guarantee Scheme have a deadline?",
    answer:
      "Places are allocated in batches (typically 1 July and 1 January each financial year). Demand outstrips supply each round, so apply through a participating lender as early as possible. The scheme is administered by Housing Australia, with eligibility based on income, citizenship, and price caps that vary by suburb.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Schemes by State (2026)", href: "/guides/first-home-buyer-schemes-by-state-australia-2026", description: "Every grant, exemption, and concession by state, in plain English." },
  { title: "Stamp Duty Calculator", href: "/stamp-duty-calculator", description: "Estimate stamp duty for your state, including first home buyer concessions." },
  { title: "Borrowing Power Calculator", href: "/borrowing-power-calculator", description: "Find out what you can borrow on top of your deposit." },
  { title: "Lenders Mortgage Insurance Guide", href: "/guides/lenders-mortgage-insurance-guide", description: "How LMI is calculated and when it's worth paying." },
  { title: "Affordability Calculator", href: "/affordability-calculator", description: "Work out what house price your deposit and income can actually support." },
];

export default function HowMuchDepositGuidePage() {
  return (
    <>
      <HowToJsonLd
        name="How to save a house deposit in Australia"
        description="A practical, six-step roadmap to saving a house deposit in Australia, including government schemes and the FHSS scheme."
        url={`/guides/${FRONTMATTER.slug}`}
        steps={[
          { name: "Decide your deposit tier", text: "Pick 5%, 10%, or 20% based on your timeline and tolerance for paying LMI." },
          { name: "Calculate the all-in cash needed", text: "Add stamp duty, conveyancing, building/pest inspections, and lender fees on top of the deposit itself.", url: "/stamp-duty-calculator" },
          { name: "Check eligibility for government schemes", text: "Home Guarantee Scheme, Family Home Guarantee, and Regional First Home Buyer Guarantee can drop your required deposit to 5% or 2% with no LMI." },
          { name: "Open a high-interest savings account and auto-transfer on payday", text: "Treat your deposit savings as a fixed expense, paid before discretionary spending." },
          { name: "Use the First Home Super Saver scheme if eligible", text: "FHSS lets you contribute up to $50,000 into super at 15% tax and withdraw it later for a deposit." },
          { name: "Get pre-approval and lock in", text: "Get 90-day pre-approval from a lender once you're within $20K of your target deposit.", url: "/borrowing-power-calculator" },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="The headline number isn't the only number">
        <p>
          Deposit gets all the attention, but it's only half the cash you need
          to settle. Stamp duty, conveyancing, and building inspections add another
          5% on top in most states. We break the full picture down below.
        </p>
      </Callout>

      <h2 id="the-short-answer">The short answer</h2>
      <p className="lead">
        Most Australian lenders need a minimum 5% deposit. To avoid Lenders Mortgage
        Insurance (LMI), you need 20%. Government schemes for first home buyers can
        bridge that gap, dropping the LMI-free threshold to 5% (or 2% for single
        parents) on eligible properties.
      </p>

      <KeyFigure
        value="20%"
        label="Deposit needed to avoid LMI on a standard purchase"
        context="On a $700,000 home that's $140,000 saved before stamp duty and fees."
      />

      <h2 id="deposit-tiers">Deposit tiers explained</h2>

      <h3>5% deposit</h3>
      <p>
        The bare minimum at most banks. You'll pay LMI (typically $15,000 to $25,000
        on a $500,000 to $700,000 loan), and your interest rate may be slightly
        higher than for a 20% deposit borrower. Eligible first home buyers can
        skip LMI entirely via the Home Guarantee Scheme.
      </p>

      <h3>10% deposit</h3>
      <p>
        A common middle ground. LMI is roughly 1.5% to 2% of the loan amount,
        rather than 3% to 4% at the 5% level. You unlock more lenders and
        better rates than a 5% deposit would, without waiting another year or
        two to hit 20%.
      </p>

      <h3>20% deposit</h3>
      <p>
        The classic "no LMI" benchmark. You get the widest choice of lenders,
        the sharpest interest rates, and no upfront insurance premium. You also
        start with more equity, which means a smaller loan and lower repayments.
      </p>

      <h2 id="lmi">What LMI actually costs</h2>
      <p>
        LMI is a one-off premium that protects the lender (not you) if you default
        and the sale doesn't recover the loan. The premium scales with your
        loan-to-value ratio (LVR).
      </p>

      <p>
        Indicative LMI on a $600,000 purchase:
      </p>
      <ul>
        <li><strong>5% deposit ($30,000):</strong> roughly $20,000 to $25,000 LMI</li>
        <li><strong>10% deposit ($60,000):</strong> roughly $10,000 to $13,000 LMI</li>
        <li><strong>15% deposit ($90,000):</strong> roughly $5,000 to $7,000 LMI</li>
        <li><strong>20% deposit ($120,000):</strong> $0 LMI</li>
      </ul>
      <p>
        Most lenders will let you capitalise LMI into the loan rather than pay it
        upfront, but you then pay interest on it for the life of the loan. Our
        Lenders Mortgage Insurance Guide walks through when capitalising makes sense.
      </p>

      <h2 id="all-in-cash">All-in cash needed at settlement</h2>
      <p>
        Beyond the deposit itself, you need to budget for:
      </p>
      <ul>
        <li><strong>Stamp duty:</strong> $0 to $40,000+ depending on price, state, and first home buyer status. Use our Stamp Duty Calculator for the exact figure.</li>
        <li><strong>Conveyancing or solicitor:</strong> $1,500 to $3,000.</li>
        <li><strong>Building &amp; pest inspection:</strong> $500 to $1,000.</li>
        <li><strong>Bank application &amp; valuation fees:</strong> $400 to $1,200.</li>
        <li><strong>Title transfer &amp; registration:</strong> $200 to $400.</li>
        <li><strong>Council and water adjustments:</strong> $200 to $1,500 (rates already paid by the seller, prorated).</li>
      </ul>
      <p>
        On a $700,000 house with a 20% deposit and no first home buyer
        exemptions, plan for about $165,000 to $175,000 in total cash to
        complete the purchase.
      </p>

      <MiniStampDutyEmbed />

      <GuideGlossaryRail
        slugs={[
          "lenders-mortgage-insurance-lmi",
          "stamp-duty-transfer-duty",
          "deposit-bond",
          "cooling-off-period",
        ]}
      />

      <h2 id="schemes">Government schemes (5% &amp; 2%)</h2>

      <h3>Home Guarantee Scheme (HGS)</h3>
      <p>
        The federal government guarantees the gap between your 5% deposit and
        the 20% LMI threshold for eligible first home buyers. You skip LMI
        entirely. Income caps apply ($125,000 single, $200,000 couple), and
        each region has a price cap.
      </p>

      <h3>Family Home Guarantee (FHG)</h3>
      <p>
        For single parents with at least one dependent, the deposit drops to
        2% of the property price. Same LMI exemption mechanism as the HGS.
      </p>

      <h3>Regional First Home Buyer Guarantee (RFHBG)</h3>
      <p>
        Same 5% deposit / no LMI structure as the HGS but for regional buyers
        who've lived in or moved to a regional area. Place caps and price caps
        apply.
      </p>

      <p>
        Our blog post on{" "}
        <a href="/guides/first-home-buyer-schemes-by-state-australia-2026">
          first home buyer schemes by state
        </a>{" "}
        covers state grants and stamp duty exemptions on top of these federal schemes.
      </p>

      <h2 id="genuine-savings">Genuine savings rule</h2>
      <p>
        Most lenders require 5% of the purchase price to be "genuine savings" -
        money you've held in your own name for at least 3 months. The point is
        to demonstrate you can budget consistently. Gifts and inheritance often
        don't count toward this 5%, though some lenders will accept them after
        a 3-month holding period. Rent paid on time (with a rental ledger) can
        substitute for genuine savings at some banks.
      </p>

      <h2 id="fhss">First Home Super Saver scheme</h2>
      <p>
        FHSS lets first home buyers contribute up to $15,000 per financial year
        (max $50,000 total per person) into super, then withdraw it later for a
        deposit. Contributions are taxed at 15% rather than your marginal rate,
        and withdrawals are taxed at marginal rate minus 30%. For a couple
        earning $90,000 each, this can mean $4,000 to $6,000 in tax savings on
        a $50,000 contribution each.
      </p>

      <Callout variant="warning" title="FHSS isn't fast money">
        <p>
          The withdrawal application takes about 25 business days from the
          first request to funds in your bank account. Don't request the
          withdrawal until you have a signed contract, once requested, the
          funds must be used for a home or returned (with tax penalties).
        </p>
      </Callout>

      <h2 id="save-faster">How to save faster</h2>
      <ol>
        <li>
          <strong>Open a high-interest savings account.</strong> The 1% to 2%
          difference between bonus saver accounts and a standard transaction
          account adds $500 to $2,000 a year on a deposit balance.
        </li>
        <li>
          <strong>Auto-transfer on payday.</strong> Money you don't see is money
          you don't spend. Treat your deposit savings as a fixed expense.
        </li>
        <li>
          <strong>FHSS if you're a first home buyer.</strong> The 15% super tax
          rate beats most after-tax savings. See our notes above.
        </li>
        <li>
          <strong>Renegotiate fixed costs.</strong> Insurance, energy, mobile,
          internet, and streaming subscriptions can usually be cut by 10% to 30%
          with one round of phone calls.
        </li>
        <li>
          <strong>Avoid HECS lump sum repayments.</strong> Counter-intuitive,
          but lenders treat HECS as an expense that reduces borrowing capacity.
          Paying it off helps borrowing power but burns cash you could have
          used as deposit.
        </li>
      </ol>

      <GuideNewsletterCallout
        title="Get notified when scheme rounds open"
        subtitle="The Home Guarantee Scheme allocates places twice a year. Subscribe to get a heads-up when the next round opens."
      />

      <h2 id="next-steps">Next steps</h2>
      <p>
        Three concrete moves once you know your target deposit:
      </p>
      <ol>
        <li>
          <strong>Run the numbers.</strong> Use the{" "}
          <a href="/borrowing-power-calculator">Borrowing Power Calculator</a> and{" "}
          <a href="/stamp-duty-calculator">Stamp Duty Calculator</a> to back into
          a realistic price range.
        </li>
        <li>
          <strong>Get pre-approval.</strong> Most lenders give 90-day pre-approval
          for free. It tells you exactly what you'll be allowed to borrow at
          today's rates.
        </li>
        <li>
          <strong>Apply for any scheme places early.</strong> HGS, FHG, and RFHBG
          spots fill within weeks of each new financial year.
        </li>
      </ol>
    </GuideArticleLayout>
    </>
  );
}
