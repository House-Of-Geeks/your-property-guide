import type { Metadata } from "next";
import Link from "next/link";
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
import { HG_DATES, HG_MIN_DEPOSIT_PCT, HG_NO_OWNERSHIP_YEARS, HG_PREAPPROVAL_DAYS } from "@/lib/data/home-guarantee";

const FRONTMATTER: GuideFrontmatter = {
  title: "How Much Deposit Do You Need to Buy a House in Australia? (2026)",
  description:
    "The full breakdown of house deposit requirements in Australia: 5% with LMI, 10% standard, 20% to skip LMI. Includes worked examples, government schemes, and a practical roadmap.",
  slug: "how-much-deposit-to-buy-a-house",
  publishedAt: "2026-05-06",
  updatedAt: "2026-10-07",
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
  `First home buyers can use the 5% Deposit Scheme (the Home Guarantee Scheme) to buy with just ${HG_MIN_DEPOSIT_PCT.firstHome}% and no LMI, and single parents the Family Home Guarantee with ${HG_MIN_DEPOSIT_PCT.singleParent}%. The Regional First Home Buyer Guarantee closed on ${HG_DATES.expanded}.`,
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
      `Mathematically yes, most banks accept it. Practically, expect to pay $15,000 to $25,000 in LMI on a $600,000 to $700,000 loan. The 5% Deposit Scheme avoids LMI on a 5% deposit; it has property price caps but no income test since ${HG_DATES.expanded}. If you qualify, it's usually the cheapest path in.`,
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
      `No. Since ${HG_DATES.expanded} places in the 5% Deposit Scheme are unlimited and there's no waiting list, so there are no rounds to wait for. Once a participating lender pre-approves you, you have ${HG_PREAPPROVAL_DAYS} days to find a home and sign a contract. The scheme is administered by Housing Australia, with eligibility based on citizenship or permanent residency, not having owned property in Australia in the last ${HG_NO_OWNERSHIP_YEARS} years, and a price cap for the area you buy in.`,
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Schemes by State (2026)", href: "/guides/first-home-buyer-schemes-by-state-australia-2026", description: "Every grant, exemption, and concession by state, in plain English." },
  { title: "Stamp Duty Calculator", href: "/stamp-duty-calculator", description: "Estimate stamp duty for your state, including first home buyer concessions." },
  { title: "Borrowing Power Calculator", href: "/borrowing-power-calculator", description: "Find out what you can borrow on top of your deposit." },
  { title: "Lenders Mortgage Insurance Guide", href: "/guides/lenders-mortgage-insurance-guide", description: "How LMI is calculated and when it's worth paying." },
  { title: "Affordability Calculator", href: "/affordability-calculator", description: "Work out what house price your deposit and income can actually support." },
  { title: "LMI Calculator", href: "/lmi-calculator", description: "What LMI costs on your price and deposit, with your state's stamp duty on it." },
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
          { name: "Check eligibility for government schemes", text: `The 5% Deposit Scheme, and the Family Home Guarantee for single parents, can drop your required deposit to ${HG_MIN_DEPOSIT_PCT.firstHome}% or ${HG_MIN_DEPOSIT_PCT.singleParent}% with no LMI.` },
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
          Deposit gets all the attention, but it&rsquo;s only half the cash you need
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
        The bare minimum at most banks. You&rsquo;ll pay LMI (typically $15,000 to $25,000
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
        The classic &ldquo;no LMI&rdquo; benchmark. You get the widest choice of lenders,
        the sharpest interest rates, and no upfront insurance premium. You also
        start with more equity, which means a smaller loan and lower repayments.
      </p>

      <h2 id="lmi">What LMI actually costs</h2>
      <p>
        LMI is a one-off premium that protects the lender (not you) if you default
        and the sale doesn&rsquo;t recover the loan. The premium scales with your
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
        Run your own price and deposit through our{" "}
        <Link href="/lmi-calculator">LMI calculator</Link>, which adds the stamp
        duty your state charges on the premium.
      </p>
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

      <h3>5% Deposit Scheme (Home Guarantee Scheme)</h3>
      <p>
        The federal government guarantees the gap between your{" "}
        {HG_MIN_DEPOSIT_PCT.firstHome}% deposit and the 20% LMI threshold for eligible
        first home buyers. You skip LMI entirely. Since {HG_DATES.expanded}{" "}
        there&rsquo;s no income test and no limit on places, but each area has a
        price cap. Our{" "}
        <Link href="/guides/first-home-guarantee">5% Deposit Scheme guide</Link> has the
        caps for every state.
      </p>

      <h3>Family Home Guarantee (FHG)</h3>
      <p>
        For single parents with at least one dependent, the deposit drops to{" "}
        {HG_MIN_DEPOSIT_PCT.singleParent}% of the property price, with no income test.
        Same LMI exemption mechanism and price caps as the 5% Deposit Scheme.
      </p>

      <h3>Regional First Home Buyer Guarantee (RFHBG)</h3>
      <p>
        Closed. No new regional guarantees have been issued since{" "}
        {HG_DATES.expanded}; regional buyers use the 5% Deposit Scheme at their
        area&rsquo;s price cap.
      </p>

      <p>
        Our blog post on{" "}
        <Link href="/guides/first-home-buyer-schemes-by-state-australia-2026">
          first home buyer schemes by state
        </Link>{" "}
        covers state grants and stamp duty exemptions on top of these federal schemes.
      </p>

      <h2 id="genuine-savings">Genuine savings rule</h2>
      <p>
        Most lenders require 5% of the purchase price to be &ldquo;genuine savings&rdquo; -
        money you&rsquo;ve held in your own name for at least 3 months. The point is
        to demonstrate you can budget consistently. Gifts and inheritance often
        don&rsquo;t count toward this 5%, though some lenders will accept them after
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
          first request to funds in your bank account. Don&rsquo;t request the
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
          <strong>Auto-transfer on payday.</strong> Money you don&rsquo;t see is money
          you don&rsquo;t spend. Treat your deposit savings as a fixed expense.
        </li>
        <li>
          <strong>FHSS if you&rsquo;re a first home buyer.</strong> The 15% super tax
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
        title="Get notified when scheme rules change"
        subtitle="Price caps, grants and stamp duty concessions change with budgets and new legislation. Subscribe to hear when the rules behind your deposit move."
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
          for free. It tells you exactly what you&rsquo;ll be allowed to borrow at
          today&rsquo;s rates.
        </li>
        <li>
          <strong>Check the price cap where you&rsquo;re buying.</strong> The 5% Deposit
          Scheme has no limit on places, but the cap for your area decides which homes
          qualify.
        </li>
      </ol>
    </GuideArticleLayout>
    </>
  );
}
