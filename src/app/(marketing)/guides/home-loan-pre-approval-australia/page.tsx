import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { HowToJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Home Loan Pre-approval in Australia (2026)",
  description:
    "What home loan pre-approval actually means, how to get it, how long it lasts, and the difference between conditional pre-approval and formal approval. Plain English, no bank jargon.",
  slug: "home-loan-pre-approval-australia",
  publishedAt: "2026-05-13",
  updatedAt: "2026-05-13",
  readingTimeMinutes: 10,
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
  "Home loan pre-approval (a.k.a. \"conditional approval\") is a lender's indication of how much they'll lend you, subject to property valuation and final document checks. It's not a guaranteed loan.",
  "Pre-approval typically lasts 3 months and most lenders allow one extension. Hard credit enquiries (which pre-approvals create) ding your credit file slightly. Don't apply to multiple lenders at once.",
  "Pre-approval is not legally binding on either side. The lender can decline at formal approval if your situation changes; you can walk away with no penalty.",
  "Get pre-approval BEFORE you start serious property searching. Agents and auctioneers take pre-approved buyers more seriously, and you avoid bidding on a property you can't fund.",
  "Documents needed: 2 recent payslips, 3 months of bank statements, ID, list of existing debts, and (for self-employed) 2 years of tax returns plus last BAS.",
  "Pre-approval ≠ full approval. After your offer is accepted, the lender does a property valuation and a final document check before issuing the formal/unconditional approval.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-it-is",        label: "What pre-approval is" },
  { id: "types",             label: "Types of pre-approval" },
  { id: "why-it-matters",    label: "Why pre-approval matters" },
  { id: "how-to-get-it",     label: "How to get pre-approved" },
  { id: "documents",         label: "Documents you'll need" },
  { id: "how-long-it-takes", label: "How long it takes" },
  { id: "validity",          label: "How long pre-approval lasts" },
  { id: "credit-impact",     label: "Impact on your credit score" },
  { id: "after-offer",       label: "What happens after your offer is accepted" },
  { id: "common-mistakes",   label: "Common mistakes" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is home loan pre-approval in Australia?",
    answer:
      "Pre-approval (also called conditional approval) is a written indication from a lender of how much they're willing to lend you and at what rate, based on the financial information you've provided. It's the formal version of borrowing-capacity assessment: the lender has checked your credit file, verified your income and expenses, and stress-tested serviceability. It's not a loan offer and not legally binding, but it's the credential agents and auctioneers expect from serious buyers.",
  },
  {
    question: "Is pre-approval a guarantee of a loan?",
    answer:
      "No. Pre-approval is conditional. The most common conditions: the specific property valuing up to the contract price, your financial position not changing between pre-approval and formal approval, and the property meeting the lender's security requirements (some lenders don't lend on certain unit types, mining-town properties, or properties under 40m²). Final approval (also called formal or unconditional approval) is only issued after the lender has valued the specific property and done a final document check.",
  },
  {
    question: "How long does pre-approval last?",
    answer:
      "Typically 3 months from issue. Most lenders will renew or extend for another 3 months on request, provided your financial position hasn't materially changed. After 6 months without an extension, you'd usually need to resubmit a full application. If you're house-hunting in a slow market, plan to renew once or twice; if you find a property within 3 months, you'll usually have time to convert pre-approval to formal approval without an extension.",
  },
  {
    question: "Does pre-approval hurt my credit score?",
    answer:
      "Slightly. A pre-approval application creates a hard credit enquiry on your file, which can lower your credit score by a few points. Multiple applications in a short window have a compounding effect: credit-reporting agencies treat them as a signal of financial stress. Don't apply to multiple lenders for pre-approval at once. Either go via a broker (one application, multiple lender shopping) or pick a single lender carefully before applying.",
  },
  {
    question: "What's the difference between pre-qualification and pre-approval?",
    answer:
      "Pre-qualification is a borrowing-power estimate based on self-reported financial information, with no credit check or document verification. It's basically a calculator output. Useful for your own planning, but it carries zero weight with agents or auctioneers. Pre-approval is the formal version: full application, credit check, income verification, lender's underwriting team review, and a written letter you can show to agents. Always go for full pre-approval before you start serious property searching.",
  },
  {
    question: "Can I bid at an auction with only pre-approval?",
    answer:
      "Yes, and it's the norm. Pre-approval is what agents and auctioneers expect from serious bidders. But understand the risk: an auction contract is unconditional, you can't make it subject to finance. If you win the auction and the lender's valuation comes in below the contract price (or your situation changes), you could be on the hook to settle or lose your deposit. Mitigate by: getting a Lender's Mortgage Insurance buffer in your pre-approval, doing your own informal valuation against comparable sales before bidding, and not bidding above the price your pre-approval comfortably covers.",
  },
  {
    question: "Can I get pre-approved if I'm self-employed?",
    answer:
      "Yes, but expect more documentation and a longer process. Most lenders require two years of personal tax returns and notice of assessment, plus two years of business financials (if you operate through a company or trust). Some \"alt-doc\" specialist lenders accept self-certified income or BAS-only verification, with rates 0.20–0.60% higher than full-doc. A broker who specialises in self-employed clients knows which lenders will accept your specific structure (sole trader vs PAYG via company vs trust distributions) without time-wasting rejections.",
  },
  {
    question: "Should I get pre-approval before talking to an agent?",
    answer:
      "Yes. Walking into an open home with a written pre-approval moves you up the agent's priority list. You're a buyer they can close. Without it, agents (correctly) treat you as a tyre-kicker until you can demonstrate finance is sorted. Once you've found the property, the agent will want a copy of your pre-approval letter as part of any serious negotiation.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "How to Choose a Mortgage Broker",       href: "/guides/how-to-choose-a-mortgage-broker",     description: "The single highest-leverage decision in the home loan process." },
  { title: "Lenders Mortgage Insurance Guide",       href: "/guides/lenders-mortgage-insurance-guide",   description: "When LMI applies, what it costs, and how it interacts with your deposit." },
  { title: "How Much Deposit to Buy a House",        href: "/guides/how-much-deposit-to-buy-a-house",    description: "Real-world deposit numbers, the LMI threshold, and what 5%/10%/20% looks like." },
  { title: "First Home Buyer Guide",                 href: "/guides/first-home-buyer-guide",             description: "Schemes, grants, and the full first-home-buyer playbook." },
  { title: "Fixed vs Variable Rate Loans",           href: "/guides/fixed-vs-variable-rate-guide",       description: "How to decide between fixed, variable, and split rate." },
  { title: "Borrowing Power Calculator",              href: "/borrowing-power-calculator",                description: "Estimate your borrowing capacity in 2 minutes, no credit check." },
];

export default function HomeLoanPreApprovalAustraliaPage() {
  return (
    <>
      <HowToJsonLd
        name="How to get home loan pre-approval in Australia"
        description="The six-step process for obtaining home loan pre-approval (conditional approval) for an Australian residential mortgage."
        url={`/guides/${FRONTMATTER.slug}`}
        steps={[
          { name: "Calculate your borrowing capacity informally", text: "Use a borrowing-power calculator to estimate the range before applying. Helps you know if you're shopping in the right price bracket." },
          { name: "Choose a lender or engage a broker", text: "A broker submits one application across 30+ lenders; going direct means you're tied to one lender's policy." },
          { name: "Gather your documents", text: "Two payslips, three months of bank statements, ID, list of debts, and (for self-employed) two years of tax returns + last BAS." },
          { name: "Submit the pre-approval application", text: "The lender does a credit check, verifies income, runs serviceability with their assessment rate buffer, and reviews your application." },
          { name: "Receive the pre-approval letter", text: "Typically 3 to 10 business days. The letter states the loan amount, rate, and any conditions." },
          { name: "Renew or extend if needed", text: "Pre-approval typically lasts 3 months. Most lenders renew once on request. After 6 months, expect to resubmit." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="Pre-approval is a credential, not a guarantee">
        <p>
          A pre-approval letter tells agents and auctioneers you&rsquo;re a
          serious, financed buyer. It does <em>not</em> mean the loan will
          definitely settle. The lender still values the property and does
          a final document check after your offer is accepted. Understand
          this before you bid at auction.
        </p>
      </Callout>

      <h2 id="what-it-is">What pre-approval is</h2>
      <p className="lead">
        Pre-approval (formally called &quot;conditional approval&quot;) is a
        lender&rsquo;s written indication of how much they&rsquo;ll lend
        you, at what rate, for the purpose of buying residential property.
        It&rsquo;s the result of a real application: credit check, income
        verification, expense assessment, serviceability test against the
        lender&rsquo;s underwriting policy.
      </p>
      <p>
        The conditions attached to a pre-approval typically include:
      </p>
      <ul>
        <li>The specific property valuing up to (or above) the contract price.</li>
        <li>The property meeting the lender&rsquo;s security policy (some lenders restrict on unit size, mining towns, certain off-the-plan projects, certain hazard zones).</li>
        <li>Your financial position not materially changing between pre-approval and formal approval (don&rsquo;t change jobs, don&rsquo;t take on new debt).</li>
        <li>The pre-approval still being within its validity period when you go to formal approval.</li>
      </ul>

      <h2 id="types">Types of pre-approval</h2>
      <p>
        Not all pre-approvals are created equal. In Australia, three
        categories of pre-approval circulate:
      </p>
      <h3>Full pre-approval (sometimes called &quot;fully assessed&quot;)</h3>
      <p>
        The most rigorous level. The lender&rsquo;s underwriting team has
        reviewed your full application, your documents have been verified,
        and your credit file has been checked. The pre-approval letter
        explicitly states the loan amount, rate, and conditions. This is the
        version agents and auctioneers want to see.
      </p>
      <h3>System pre-approval (algorithmic)</h3>
      <p>
        Some lenders issue pre-approvals based on automated scoring without
        a human underwriter review. These are faster (sometimes same-day)
        but considered less reliable. The lender can still decline at
        formal approval if any underlying assumption was wrong. Workable for
        straightforward PAYG income; risky for anyone complex.
      </p>
      <h3>Pre-qualification (not actually pre-approval)</h3>
      <p>
        Often offered by online lenders or comparison sites. Pre-qualification
        is a borrowing-power estimate based on self-reported information,
        with no credit check or document verification. It carries no weight
        with agents and isn&rsquo;t a substitute for real pre-approval.
        Useful only for your own internal planning.
      </p>

      <KeyFigure
        value="3 to 10 days"
        label="Typical time from application to pre-approval letter"
        context="Full assessment, straightforward application"
      />

      <h2 id="why-it-matters">Why pre-approval matters</h2>
      <p>
        Pre-approval matters for three reasons:
      </p>
      <ul>
        <li><strong>Credibility with agents.</strong> Selling agents have wasted years on buyers who couldn&rsquo;t finance their offers. A pre-approval letter signals you can close, and agents prioritise you on follow-ups and pre-auction offers.</li>
        <li><strong>Real budget clarity.</strong> Pre-approval forces the lender to test your actual numbers against their actual policy. The result is more reliable than a calculator output, and it&rsquo;ll often differ. Sometimes you&rsquo;re approved for more than expected, sometimes less.</li>
        <li><strong>Auction protection.</strong> Auction contracts are unconditional. Without pre-approval, you&rsquo;re bidding speculatively. With pre-approval, you have a defensible upper-limit you can bid to.</li>
      </ul>
      <p>
        The flip side: pre-approval is also the moment lenders start gating
        access to good lender pricing. Going through pre-approval with the
        wrong lender, then having to redo the work with another, costs you
        time and stresses your credit file. Get the lender choice right
        before submitting.
      </p>

      <MatchCTA kind="mortgage-broker" />

      <h2 id="how-to-get-it">How to get pre-approved</h2>
      <p>
        The path:
      </p>
      <ol>
        <li><strong>Decide on broker vs direct.</strong> A broker submits one application across 30+ lenders and picks the right fit for your situation. Going direct ties you to one lender&rsquo;s policy. For 80% of borrowers, broker is the better path, particularly anyone self-employed, with multiple income sources, or with any complexity.</li>
        <li><strong>Choose your lender (if going direct) or your broker.</strong> If broker, see our <Link href="/guides/how-to-choose-a-mortgage-broker">how to choose a mortgage broker</Link> guide for the criteria.</li>
        <li><strong>Run an informal borrowing-power assessment</strong> with the lender or broker to confirm you&rsquo;re shopping in the right price bracket before formal application.</li>
        <li><strong>Gather documents</strong> (see next section).</li>
        <li><strong>Submit the application.</strong> Most brokers and lenders now accept document upload via a portal.</li>
        <li><strong>Respond to lender queries promptly.</strong> Most pre-approvals come back with one or two clarification requests from the lender: incomplete bank statements, an unexplained large deposit, a missing payslip. Respond within 24 hours to keep the file moving.</li>
        <li><strong>Receive your pre-approval letter.</strong> Read it carefully. The conditions matter.</li>
      </ol>

      <h2 id="documents">Documents you&rsquo;ll need</h2>
      <p>
        Standard PAYG borrower:
      </p>
      <ul>
        <li><strong>2 recent payslips</strong> (typically last 60–90 days).</li>
        <li><strong>3 months of bank statements</strong> for your main transaction account.</li>
        <li><strong>3 months of bank statements</strong> for any savings or offset accounts.</li>
        <li><strong>Photo ID</strong>: driver&rsquo;s licence and/or passport.</li>
        <li><strong>List of existing debts</strong>: credit cards (limit + balance), personal loans, HECS/HELP, car loans, BNPL accounts.</li>
        <li><strong>List of regular monthly expenses</strong>. Most lenders use HEM (Household Expenditure Measure) as a baseline; some require detailed expense reporting.</li>
        <li><strong>Rental income evidence</strong> if you own existing investment property: rental statements from a property manager.</li>
      </ul>
      <p>
        Self-employed borrower (add to the above):
      </p>
      <ul>
        <li><strong>2 years of personal tax returns</strong> and notices of assessment.</li>
        <li><strong>2 years of business financial statements</strong> (if you operate through a company or trust).</li>
        <li><strong>Recent BAS</strong> (4 quarters minimum).</li>
        <li><strong>Accountant&rsquo;s declaration of current income</strong> (some lenders).</li>
      </ul>

      <h2 id="how-long-it-takes">How long it takes</h2>
      <p>
        For a straightforward full pre-approval: <strong>3 to 10 business
        days</strong> from submitting a complete application. Complex cases
        (self-employed, multiple income sources, prior credit defaults, large
        loan amounts) can take 2–3 weeks. System (algorithmic) pre-approvals
        can be returned same-day but apply to a narrower borrower set.
      </p>
      <p>
        Brokers track lender SLAs daily; some lenders are slower than
        others by 3 to 5 days at any given time. If timing matters (e.g.
        you&rsquo;re trying to bid at an auction in two weeks), tell the
        broker upfront and they&rsquo;ll prioritise faster lenders.
      </p>

      <h2 id="validity">How long pre-approval lasts</h2>
      <p>
        Standard validity: <strong>3 months</strong>. Most lenders allow one
        extension on request (so 6 months total) if your financial position
        hasn&rsquo;t changed. After that, expect to resubmit a full
        application with refreshed documents.
      </p>
      <p>
        Why the time limit: your financial position changes (salary changes,
        new debts, new dependents, expense changes), the lender&rsquo;s
        policies change, and market conditions change. A pre-approval from
        12 months ago doesn&rsquo;t reflect today&rsquo;s reality.
      </p>

      <h2 id="credit-impact">Impact on your credit score</h2>
      <p>
        Every pre-approval application creates a hard credit enquiry on
        your file. One enquiry: typically 3–10 point reduction in your
        credit score, recovering over 12 months. Multiple enquiries in a
        short window: significantly larger reduction, and credit-reporting
        agencies treat the pattern as a signal of financial stress (you
        appear desperate for credit).
      </p>
      <p>
        Practical rules:
      </p>
      <ul>
        <li>Don&rsquo;t apply to multiple lenders simultaneously.</li>
        <li>Use a broker to shop multiple lenders with one application.</li>
        <li>Don&rsquo;t apply for a credit card, BNPL account, or personal loan in the 6 months before a pre-approval application.</li>
        <li>If you&rsquo;re declined by one lender, fix the issue before applying elsewhere. A second decline within weeks of the first compounds the damage.</li>
      </ul>

      <Callout variant="warning" title="The 'apply everywhere' trap">
        <p>
          A surprisingly common DIY approach is to apply to three or four
          banks simultaneously, &quot;to see who offers the best deal&quot;.
          Each rejection or pre-approval creates a credit enquiry, the
          rejections stay on your file for 5 years, and lenders treat a
          string of recent enquiries as a red flag. Pick a lender carefully
          (or use a broker to do one application across many) before
          applying anywhere.
        </p>
      </Callout>

      <h2 id="after-offer">What happens after your offer is accepted</h2>
      <p>
        Pre-approval is the start of the loan process, not the end. After
        the seller accepts your offer (or you win the auction), the lender
        moves to <strong>formal approval</strong> (also called
        &quot;unconditional&quot; or &quot;full&quot; approval). The steps:
      </p>
      <ol>
        <li><strong>Lender valuation of the specific property.</strong> The lender orders a valuation (typically a desktop or a full inspection depending on lender and property type). If the valuation comes in below the contract price, your loan amount may be reduced. You&rsquo;d need to top up the deposit or renegotiate the contract.</li>
        <li><strong>Final document check.</strong> The lender re-verifies your income (latest payslip), confirms no material change in your situation, and checks the property is acceptable security.</li>
        <li><strong>Formal approval issued.</strong> The lender confirms the loan amount, rate, and terms in writing. You sign the loan offer.</li>
        <li><strong>Property contract goes unconditional.</strong> If your contract was subject to finance, this is the moment that condition is satisfied. Auction contracts skip this step (they&rsquo;re unconditional from the start).</li>
        <li><strong>Settlement preparation.</strong> Your conveyancer and the lender coordinate the settlement date.</li>
        <li><strong>Settlement.</strong> Funds clear, title transfers, mortgage is registered, keys change hands.</li>
      </ol>

      <h2 id="common-mistakes">Common mistakes</h2>
      <ul>
        <li><strong>Skipping pre-approval and bidding speculatively.</strong> A path to losing your deposit at auction.</li>
        <li><strong>Applying to multiple lenders at once.</strong> Damages your credit file.</li>
        <li><strong>Changing financial position mid-process.</strong> Buying a car on finance, taking out a personal loan, or switching jobs between pre-approval and formal approval can collapse the loan.</li>
        <li><strong>Letting pre-approval expire mid-purchase.</strong> Track the validity date and request an extension well before it lapses.</li>
        <li><strong>Trusting the pre-approval amount as a hard ceiling for what you should bid.</strong> The pre-approval covers a price; smart bidding stops 5–10% below it to leave room for negotiation costs, building inspection findings, and lender valuation risk.</li>
        <li><strong>Not reading the conditions.</strong> Pre-approval letters spell out what the lender expects: property type, location, your financial position. Read the fine print.</li>
        <li><strong>Pre-qualification confusion.</strong> A pre-qualification letter looks like a pre-approval but carries none of the weight. Always get full pre-approval before serious property searching.</li>
      </ul>

      <MatchCTA
        kind="mortgage-broker"
        lead="Pre-approval is the moment lender choice locks in. Talk to a broker who can put your application in front of the right lender first time."
      />

      <Sources items={[
        "Australian Securities and Investments Commission, MoneySmart guide to home loans and pre-approval (current 2025).",
        "ASIC Regulatory Guide 209, Credit licensing: Responsible lending conduct (most recent revision).",
        "Australian Prudential Regulation Authority, residential lending serviceability buffer guidance (3.0% buffer in force, 2024–2026).",
        "Mortgage and Finance Association of Australia, broker market-share and approval-time tracking, 2024–2025.",
        { label: "Office of the Australian Information Commissioner, credit reporting and enquiries on your credit file", note: "current" },
      ]} />
    </GuideArticleLayout>
    </>
  );
}
