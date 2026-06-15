import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  MiniBorrowingPowerEmbed,
  Sources,
  EditorNote,
  PullQuote,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "How Much Can I Borrow? Home Loan Borrowing Power in Australia (2026)",
  description:
    "How lenders work out your borrowing power: income, living expenses, debts, dependants, deposit and the serviceability buffer. Why two banks give different numbers, and how to lift your capacity.",
  slug: "how-much-can-i-borrow-australia",
  publishedAt: "2026-06-14",
  updatedAt: "2026-06-14",
  readingTimeMinutes: 8,
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
  "Borrowing power is what a lender will let you borrow, set by your income minus your living expenses, existing debts and a safety buffer. It is not the same as what you can comfortably afford.",
  "Lenders assess your repayments at a rate around 3% above the actual loan rate. This serviceability buffer is why your approved amount is lower than a simple repayment sum suggests.",
  "Living expenses are floored at a benchmark (the Household Expenditure Measure, or HEM) even if you spend less, and your real spending is used if it is higher.",
  "Credit card limits count against you at the full limit, not the balance. Clearing or reducing cards is one of the fastest ways to lift your capacity.",
  "Two banks can give very different numbers because they use different expense benchmarks, buffers, debt-to-income limits and how they treat overtime, bonuses and HECS/HELP debt.",
  "Get a personal figure from our borrowing power calculator, then confirm it with a lender or broker before you make an offer. Rules and buffers change.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-it-means",   label: "What borrowing power actually means" },
  { id: "how-lenders",     label: "How lenders calculate it" },
  { id: "the-buffer",      label: "The serviceability buffer" },
  { id: "dti",             label: "Debt-to-income (DTI) limits" },
  { id: "why-differ",      label: "Why two banks give different numbers" },
  { id: "indicative",      label: "Indicative borrowing by household income" },
  { id: "lift-cut",        label: "What lifts and what cuts your capacity" },
  { id: "next-steps",      label: "What to do next" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much can I borrow on a single income?",
    answer:
      "On a single income, lenders apply the same test as for couples but with one wage and one set of living expenses, so your capacity is typically lower per dollar of income because there is no second salary to share the fixed costs. As a rough rule of thumb, many single borrowers are assessed at somewhere around four to five times gross income, but the real figure depends heavily on your living expenses, existing debts, credit card limits, dependants, the interest rate and the serviceability buffer. Two lenders can land thousands of dollars apart on the same single income. Use our borrowing power calculator for a personal estimate, then confirm it with a lender or broker.",
  },
  {
    question: "How do banks calculate how much I can borrow?",
    answer:
      "A lender starts with your gross income, deducts tax, then deducts your living expenses (floored at a benchmark called the HEM if you report less), your existing debt repayments and a buffer for your credit card limits. What is left is your surplus. They then test whether that surplus covers the repayments on the loan you want at an assessment rate that is roughly 3% above the actual rate. If the repayments fit inside your surplus and you sit within their debt-to-income limit, the loan is serviceable. Change any input and the number moves.",
  },
  {
    question: "Does HECS or HELP debt affect how much I can borrow?",
    answer:
      "Yes. While your HECS/HELP balance does not attract interest in the way a normal loan does, the compulsory repayment is taken from your pay once you earn above the threshold, so it reduces the income a lender counts as available to service a mortgage. The closer you are to paying the debt off, the more some lenders are willing to look past it, and policies differ between lenders. If your HELP balance is small, paying it out before you apply can lift your borrowing power. If it is large, the repayment will weigh on your capacity until it clears.",
  },
  {
    question: "How can I increase my borrowing power?",
    answer:
      "The fastest lever is usually your credit cards: cancel cards you do not use and reduce the limit on the ones you keep, because lenders count the full limit against you, not the balance. Pay down or clear personal loans, car loans and buy-now-pay-later facilities. Reduce discretionary spending in the months before you apply, since lenders review your statements. A larger deposit lowers the loan size you need to service, and a longer loan term reduces the assessed repayment. Finally, shop around or use a broker, because lender policies vary and the same profile can be serviceable at very different amounts.",
  },
  {
    question: "Is borrowing capacity the same as pre-approval?",
    answer:
      "No. Borrowing capacity is an estimate of the maximum a lender might lend you based on your inputs. Pre-approval (also called conditional approval) is a lender actually reviewing your documents and agreeing, subject to conditions, to lend up to a set amount for a limited window, usually around 90 days. A calculator estimate is a useful starting point, but it carries no commitment from a lender. Pre-approval is the step that tells an agent and vendor you are a serious buyer. See our pre-approval guide for how the process works.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Borrowing Power Calculator",        href: "/borrowing-power-calculator",                description: "Get a personal borrowing estimate from your income, expenses and debts." },
  { title: "How Much Deposit Do I Need?",        href: "/guides/how-much-deposit-to-buy-a-house",    description: "The 20% rule, low-deposit schemes, and what counts toward a deposit." },
  { title: "Home Loan Pre-Approval",             href: "/guides/home-loan-pre-approval-australia",   description: "How conditional approval works, what lenders check, and how long it lasts." },
  { title: "Lenders Mortgage Insurance",         href: "/guides/lenders-mortgage-insurance-guide",   description: "What LMI costs on a smaller deposit and the schemes that waive it." },
  { title: "How to Choose a Mortgage Broker",    href: "/guides/how-to-choose-a-mortgage-broker",    description: "When a broker beats going direct, and how brokers are paid." },
  { title: "First Home Buyer Guide (national)",  href: "/guides/first-home-buyer-guide",             description: "Federal schemes, state grants and stamp duty concessions for first buyers." },
];

export default function HowMuchCanIBorrowAustraliaPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="Want your own number first?">
        <p>
          This guide explains how lenders work out borrowing power and what
          moves it up or down. If you just want a figure for your situation,
          start with our{" "}
          <Link href="/borrowing-power-calculator">borrowing power calculator</Link>,
          then read on to understand what is behind the number and how to
          improve it.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The thing most buyers get wrong is treating one lender&rsquo;s number
          as the number. There isn&rsquo;t one. Borrowing power is a calculation,
          and every lender runs it with slightly different assumptions about your
          expenses, your buffer and your debts. The same household can be quoted
          $650,000 at one bank and $740,000 at another on the same payslips. Get
          a baseline, then let a broker or two lenders compete on the policy that
          suits you.
        </p>
      </EditorNote>

      <h2 id="what-it-means">What borrowing power actually means</h2>
      <p className="lead">
        Your borrowing power is the maximum a lender is willing to lend you for a
        home loan. It is built from your income, minus your living expenses, minus
        your existing debts, with a safety margin on top. It is a lender&rsquo;s
        view of risk, not a measure of what you can comfortably live with.
      </p>
      <p>
        That distinction matters. A lender can approve you for an amount that would
        leave your budget stretched if rates rose or your circumstances changed.
        Borrowing power tells you the ceiling. What you should actually borrow is a
        separate, more personal decision about the repayments you want to live with.
      </p>

      <KeyFigure
        value="~3%"
        label="The serviceability buffer lenders add on top of the actual loan rate when they test whether you can afford repayments."
        context="A regulator-set minimum; some lenders test higher"
      />

      <h2 id="how-lenders">How lenders calculate it</h2>
      <p>
        Behind the calculator, every lender runs roughly the same sequence. The
        inputs are where they differ.
      </p>
      <ul>
        <li>
          <strong>Gross income.</strong> Your base salary, plus a portion of
          overtime, bonuses, commissions and (for investors) expected rent.
          Lenders often discount variable income, counting only 80% of overtime or
          rent, because it is less reliable than base pay.
        </li>
        <li>
          <strong>Living expenses.</strong> Your declared monthly spending, floored
          at a benchmark (see HEM below). If your real spending is higher than the
          benchmark, the higher figure is used.
        </li>
        <li>
          <strong>Existing debts.</strong> Repayments on personal loans, car loans,
          HECS/HELP and buy-now-pay-later, plus a notional repayment on your credit
          card limits.
        </li>
        <li>
          <strong>Dependants.</strong> Each dependent child increases your assessed
          living expenses, which lowers the surplus available to service a loan.
        </li>
        <li>
          <strong>Deposit and loan size.</strong> A larger deposit means a smaller
          loan to service, and may keep you below thresholds where Lenders Mortgage
          Insurance applies.
        </li>
      </ul>
      <p>
        What is left after expenses and debts is your surplus. The lender then
        tests whether that surplus covers the repayments on the loan you want,
        assessed at a buffered rate.
      </p>

      <h3>The HEM benchmark</h3>
      <p>
        Lenders do not simply take your word on what you spend. They compare your
        declared living expenses against the Household Expenditure Measure (HEM), a
        benchmark of typical spending for a household of your size, income and
        location. If you declare less than the benchmark, the lender uses the
        benchmark anyway. If you declare more, they use your figure. The practical
        effect is a floor under your assessed expenses, which is why understating
        your spending rarely lifts your borrowing power.
      </p>

      <h2 id="the-buffer">The serviceability buffer</h2>
      <p>
        This is the single biggest reason your approved amount feels lower than the
        repayments suggest it should be. Lenders do not test you at the actual
        interest rate on the loan. Under APRA guidance they add a buffer, around 3
        percentage points, and check that you could still afford the repayments at
        that higher assessment rate.
      </p>
      <p>
        So if a loan is advertised at, say, 6%, you are assessed as though you were
        paying around 9%. The buffer exists so that borrowers are not pushed to the
        edge the moment rates rise. It also means a rate cut does not lift your
        borrowing power as much as you might expect, because the buffer moves with
        the rate.
      </p>

      <Callout variant="warning" title="Buffers and rules change, so verify the current figure">
        <p>
          The serviceability buffer is set by the prudential regulator and has
          moved before. Income thresholds, expense benchmarks and lender policies
          also change. Treat the figures here as a guide to how the calculation
          works, not a guaranteed current number, and confirm the current rules
          with{" "}
          <a href="https://www.apra.gov.au" target="_blank" rel="noopener noreferrer">
            APRA
          </a>,{" "}
          <a href="https://moneysmart.gov.au" target="_blank" rel="noopener noreferrer">
            ASIC MoneySmart
          </a>{" "}
          or a licensed lender or broker before you rely on them.
        </p>
      </Callout>

      <h2 id="dti">Debt-to-income (DTI) limits</h2>
      <p>
        Alongside serviceability, most lenders apply a debt-to-income ratio. DTI
        compares your total borrowings (the new loan plus any existing debt)
        against your gross annual income. A DTI of six, for example, means your
        total debt is six times your income.
      </p>
      <p>
        Lenders watch high-DTI lending closely, and many tighten their criteria or
        charge more once a loan pushes past a certain multiple. A strong income
        with little other debt gives you more room; a modest income already
        carrying a car loan and credit cards hits the ceiling sooner. DTI is one
        reason clearing existing debt can lift your borrowing power even when your
        income has not changed.
      </p>

      <h2 id="why-differ">Why two banks give different numbers</h2>
      <p>
        It surprises buyers that the same payslips produce different answers at
        different lenders. There is no single formula. The variation comes from:
      </p>
      <ul>
        <li>
          <strong>Different expense benchmarks.</strong> Lenders use their own HEM
          tables and update them at different times.
        </li>
        <li>
          <strong>Different treatment of variable income.</strong> One lender may
          count 80% of your overtime, another 100%, another none.
        </li>
        <li>
          <strong>Different buffers and floor rates.</strong> Most apply the APRA
          minimum buffer, but some test at a higher rate as their own policy.
        </li>
        <li>
          <strong>Different DTI limits.</strong> One lender may stop at a lower
          multiple than another for the same profile.
        </li>
        <li>
          <strong>Different rules on HECS/HELP, dependants and casual work.</strong>
          {" "}A lender close to clearing your HELP debt may look past it; another
          may not.
        </li>
      </ul>
      <p>
        This is exactly why shopping around, or using a broker who knows which
        lender suits your profile, can be worth tens of thousands of dollars in
        capacity. See our{" "}
        <Link href="/guides/how-to-choose-a-mortgage-broker">guide to choosing a mortgage broker</Link>{" "}
        for how that works.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        There is no single borrowing power number. There is the number this lender,
        with these assumptions, on these payslips, will give you today.
      </PullQuote>

      <h2 id="indicative">Indicative borrowing by household income</h2>
      <p>
        The table below gives a rough sense of how borrowing capacity scales with
        income. These are indicative only. Your real figure depends on your living
        expenses, dependants, existing debts, deposit, the interest rate and the
        serviceability buffer, and it will differ between lenders.
      </p>

      <MiniBorrowingPowerEmbed />

      <p>
        Prefer a glance? The table below shows roughly how capacity scales with
        income, assuming minimal other debt and a standard deposit.
      </p>

      <table>
        <thead>
          <tr>
            <th>Gross household income</th>
            <th>Rough indicative borrowing</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>$80,000 (single)</td><td>Around $350,000 to $450,000</td></tr>
          <tr><td>$100,000 (single)</td><td>Around $450,000 to $560,000</td></tr>
          <tr><td>$120,000 (single)</td><td>Around $540,000 to $680,000</td></tr>
          <tr><td>$150,000 (couple, combined)</td><td>Around $650,000 to $830,000</td></tr>
          <tr><td>$200,000 (couple, combined)</td><td>Around $880,000 to $1,100,000</td></tr>
        </tbody>
      </table>

      <Callout variant="warning" title="Treat these ranges as a starting point only">
        <p>
          The figures above assume minimal other debt, no dependants and a
          standard deposit. Add a car loan, a couple of credit cards, children or
          HECS/HELP debt and the number falls, sometimes sharply. They are not an
          offer, a guarantee or a substitute for a lender assessment. For a figure
          built on your own inputs, use our{" "}
          <Link href="/borrowing-power-calculator">borrowing power calculator</Link>.
        </p>
      </Callout>

      <h2 id="lift-cut">What lifts and what cuts your capacity</h2>
      <p>
        If your borrowing power comes back lower than you hoped, several of these
        levers are within your control before you apply.
      </p>
      <p>What lifts it:</p>
      <ul>
        <li><strong>Clearing or reducing credit card limits.</strong> Lenders count the full limit, not the balance, so cancelling unused cards and trimming limits is one of the fastest wins.</li>
        <li><strong>Paying off personal and car loans.</strong> Every repayment you remove frees up surplus to service a mortgage.</li>
        <li><strong>A bigger deposit.</strong> A smaller loan is easier to service and may keep you under LMI thresholds.</li>
        <li><strong>A longer loan term.</strong> A 30-year term spreads the assessed repayment thinner than a 25-year one, which lifts capacity, though you pay more interest over time.</li>
        <li><strong>Reducing discretionary spending.</strong> Lenders review recent statements, so cutting back in the months before you apply can lower your assessed expenses.</li>
        <li><strong>Clearing a small HECS/HELP balance.</strong> If the debt is nearly paid off, settling it removes the compulsory repayment from the assessment.</li>
      </ul>
      <p>What cuts it:</p>
      <ul>
        <li><strong>High credit card limits</strong>, even on cards you never use.</li>
        <li><strong>Buy-now-pay-later and car loans</strong>, which lenders treat as ongoing commitments.</li>
        <li><strong>Dependants</strong>, which raise your assessed living expenses.</li>
        <li><strong>A large HECS/HELP balance</strong>, through the compulsory repayment taken from your pay.</li>
        <li><strong>Variable or casual income</strong>, which lenders discount or may not count at all.</li>
        <li><strong>A higher interest rate or buffer</strong>, which raises the assessed repayment on the same loan.</li>
      </ul>

      <MatchCTA
        kind="mortgage-broker"
        href="/borrowing-power-calculator"
        lead="Want a number built on your own income, expenses and debts? Our borrowing power calculator gives you a personal estimate in a couple of minutes."
        ctaLabel="Use the borrowing power calculator"
      />

      <h2 id="next-steps">What to do next</h2>
      <p>
        Knowing your borrowing power is the foundation of a confident search. Once
        you have a figure you trust, here is where to take it:
      </p>
      <ol>
        <li>
          <strong>Get a personal estimate.</strong> Run your numbers through the{" "}
          <Link href="/borrowing-power-calculator">borrowing power calculator</Link>{" "}
          before you talk to anyone, so you walk in with a baseline.
        </li>
        <li>
          <strong>Work out your deposit.</strong> Your deposit sets the loan size
          you need to service. Our{" "}
          <Link href="/guides/how-much-deposit-to-buy-a-house">deposit guide</Link>{" "}
          covers the 20% rule and the low-deposit schemes.
        </li>
        <li>
          <strong>Understand LMI.</strong> A smaller deposit can mean Lenders
          Mortgage Insurance. See what it costs in our{" "}
          <Link href="/guides/lenders-mortgage-insurance-guide">LMI guide</Link>.
        </li>
        <li>
          <strong>Get pre-approval.</strong> A calculator estimate is not a
          commitment. Our{" "}
          <Link href="/guides/home-loan-pre-approval-australia">pre-approval guide</Link>{" "}
          explains how conditional approval turns a number into a real offer.
        </li>
        <li>
          <strong>Check first home buyer support.</strong> Grants and schemes can
          change the deposit and price you are working with. Start with the{" "}
          <Link href="/guides/first-home-buyer-guide">national first home buyer guide</Link>.
        </li>
      </ol>

      <MatchCTA kind="mortgage-broker" />

      <Sources items={BORROWING_POWER_SOURCES} />
    </GuideArticleLayout>
  );
}

const BORROWING_POWER_SOURCES: readonly SourceItem[] = [
  { label: "APRA: Prudential guidance on residential mortgage lending and serviceability", href: "https://www.apra.gov.au", note: "Source for the serviceability buffer used in the buffer section" },
  { label: "ASIC MoneySmart: How much can I borrow and mortgage basics", href: "https://moneysmart.gov.au/home-loans", note: "Consumer guidance on borrowing capacity and repayments" },
  { label: "Australian Taxation Office: Study and training loan repayment thresholds (HECS/HELP)", href: "https://www.ato.gov.au", note: "Background on how compulsory HELP repayments affect assessed income" },
  { label: "Housing Australia: First home buyer schemes and deposit requirements", href: "https://www.housingaustralia.gov.au", note: "Referenced in the deposit and first home buyer next-steps" },
];
