import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  GuideNewsletterCallout,
  EditorNote,
  PullQuote,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { HowToJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Offset accounts explained: how they work, what they save, and when they don't (2026)",
  description:
    "The mortgage feature most Australians use wrong. What an offset account actually does, how it saves interest mechanically, when it's worth the package fee, redraw vs offset, and how to use it as a deposit-builder for the next purchase.",
  slug: "offset-accounts-explained-australia",
  publishedAt: "2026-05-18",
  updatedAt: "2026-05-18",
  readingTimeMinutes: 11,
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
  "An offset account is a transaction account linked to your home loan. The balance offsets your loan principal, so you pay interest only on the net amount.",
  "$50,000 sitting in an offset against a $600,000 loan at 6.5 per cent saves you $3,250 per year in interest, every year the money stays there.",
  "Offset is identical to extra repayments in interest-saving terms, but the money stays accessible. That access is the entire reason most people choose offset over extra repayments.",
  "Offset accounts almost always sit inside a packaged home loan (annual fee $250 to $400). The package only pays off when your average offset balance saves more in interest than the fee costs you.",
  "Redraw is the cheaper cousin: same interest-saving effect, but the money is technically a repayment you can pull back out. Redraw can be re-classified by the ATO when it comes to investment loans; offset can't.",
  "Park your everything-balance in offset, not in a savings account. Even at 4.5 per cent in a high-interest savings account, the after-tax return is lower than the after-tax saving from offset on a 6.5 per cent loan.",
  "When you upgrade or buy an investment property, your offset balance becomes the cleanest deposit you can produce: it's already yours, it's already accessible, and pulling it out doesn't trigger any tax event.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-it-is",        label: "What an offset account actually is" },
  { id: "how-it-works",      label: "How it saves you interest (the maths)" },
  { id: "offset-vs-redraw",  label: "Offset vs redraw: which to use when" },
  { id: "vs-savings",        label: "Offset vs a high-interest savings account" },
  { id: "package-fee",       label: "Is the package fee worth it?" },
  { id: "investment-loans",  label: "Why offset matters more on investment loans" },
  { id: "next-purchase",     label: "Using offset to build your next deposit" },
  { id: "common-mistakes",   label: "Common mistakes that cost real money" },
  { id: "when-not",          label: "When an offset account isn't worth it" },
];

const FAQS: FaqItem[] = [
  {
    question: "How does an offset account save me interest?",
    answer:
      "An offset account is a transaction account linked to your home loan. The balance in the offset account is subtracted from your loan principal each day when interest is calculated. If your loan is $600,000 and you have $50,000 in offset, interest is calculated on $550,000 only. The savings are real and compound. $50,000 in offset against a 6.5 per cent loan saves $3,250 in interest per year, every year the money stays there.",
  },
  {
    question: "Is an offset account better than just paying down my loan?",
    answer:
      "In pure interest-saving terms, they're identical: $50,000 in offset saves the same interest as $50,000 paid off the loan. The difference is access. Offset money stays in your transaction account and can be spent or moved at any time. Money paid into the loan is gone (unless your loan has redraw, in which case you can pull it back). Most people prefer offset because the access is genuinely useful in emergencies and during property upgrades.",
  },
  {
    question: "Should I keep my emergency fund in the offset?",
    answer:
      "Yes, in almost every case. An offset account is a transaction account, so the money is fully accessible. Parking your emergency fund there saves more in interest than the equivalent balance in a high-interest savings account would earn (after tax). The only reason not to: if your bank charges a meaningful monthly fee for the offset package and your average balance is too small to justify it (see the package-fee section).",
  },
  {
    question: "Is the package fee for an offset account worth paying?",
    answer:
      "It depends on your average offset balance and your loan rate. Annual package fees are typically $250 to $400. On a 6.5 per cent loan, a $400 fee is paid off by roughly $6,150 in average offset balance ($6,150 × 6.5 per cent = $400 in interest saved). If your average balance is below that breakeven, the package isn't worth it and you should ask for a basic variable rate without the package. Most lenders will refund the package fee or waive it for the first year as a sweetener.",
  },
  {
    question: "What's the difference between offset and redraw?",
    answer:
      "Offset is a separate transaction account whose balance is netted against your loan principal for daily interest calculation. Redraw is a feature on the loan itself: extra repayments you've made above the minimum can be pulled back out. The interest-saving effect is the same. The differences are: (1) offset money is yours, redraw money is technically a repayment you've pulled back, (2) on investment loans, the ATO can re-classify redrawn money in ways that affect deductibility, while offset is clean, (3) some basic-rate loans don't include offset but do include redraw at no charge.",
  },
  {
    question: "Can I have multiple offset accounts?",
    answer:
      "Yes, on most lenders. Common setup is one offset for the household everyday account, one for the emergency fund, and one for upcoming bills (insurance, rates, holidays). All offset against the same loan, all save interest the same way. Useful for mental accounting if you find a single big-balance account hard to budget against. Check your lender's policy: some charge per offset account, some include up to 10 for the same fee.",
  },
  {
    question: "Why does offset matter more for property investors?",
    answer:
      "Investment-loan interest is tax-deductible; owner-occupier loan interest isn't. That changes the calculus around redraw specifically. If you redraw from an investment loan and spend the redrawn amount on private purposes (like buying a car), the ATO can re-classify that portion of the loan as non-deductible, even after the redraw is paid back. Offset doesn't have this problem because the offset balance is your money, not a loan repayment. For investors specifically, never use redraw on an investment loan; always use offset.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Home loan pre-approval guide",            href: "/guides/home-loan-pre-approval-australia", description: "How to get conditional and unconditional pre-approval before house-hunting." },
  { title: "How to choose a mortgage broker",         href: "/guides/how-to-choose-a-mortgage-broker", description: "Brokers shop offset products across 30+ lenders; the right one matters." },
  { title: "Fixed vs variable rate guide",            href: "/guides/fixed-vs-variable-rate-guide", description: "Fully offset accounts are usually only available on variable rates." },
  { title: "How much deposit do I need?",             href: "/guides/how-much-deposit-to-buy-a-house", description: "The offset-as-deposit strategy for upgraders and investors." },
  { title: "Mortgage repayment calculator",           href: "/mortgage-calculator", description: "Model the interest saving from a $20K, $50K or $100K offset balance." },
  { title: "Bridging loans guide",                    href: "/guides/bridging-loans-guide", description: "Offset balances often replace the need for bridging when upgrading." },
];

export default function OffsetAccountsExplainedPage() {
  return (
    <>
      <HowToJsonLd
        name="How to use an offset account in Australia"
        description="A six-step framework for setting up and using an offset account to minimise the interest you pay on your home loan."
        url={`/guides/${FRONTMATTER.slug}`}
        steps={[
          { name: "Check your loan has an offset feature", text: "Basic-rate loans often skip offset. Packaged loans almost always include 100 per cent offset." },
          { name: "Move your everyday account into the offset", text: "Your salary, bills, transfer hub — all of it sits in the offset. The balance offsets your loan daily." },
          { name: "Move your emergency fund into the offset",  text: "Better after-tax return than any savings account on the market, with the same accessibility." },
          { name: "Sweep idle balances out of low-interest accounts", text: "Any cash sitting in a low-interest savings or chequing account is leaving money on the table." },
          { name: "Run the breakeven on the package fee",      text: "If your average offset balance × loan rate > annual package fee, the package pays off. Otherwise switch to a basic-rate loan.", url: "/mortgage-calculator" },
          { name: "Plan offset as a deposit source for upgrade or investment", text: "When you're ready for the next property, offset balance is the cleanest deposit you can produce." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="General information, not personal financial advice">
        <p>
          This guide is for general information only. Loan products,
          offset features and lender package fees vary, and the right
          loan structure depends on your full financial picture. Talk
          to a{" "}
          <Link href="/guides/how-to-choose-a-mortgage-broker">mortgage broker who understands lender policy</Link>{" "}
          before changing your loan structure.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The offset account is the mortgage feature most Australians
          have and don&rsquo;t fully use. The classic mistake is
          leaving $30,000 sitting in a low-interest savings account
          while paying 6.5 per cent on the home loan next to it.
          That&rsquo;s costing $1,950 per year, every year, in
          interest you don&rsquo;t have to pay. This guide is the
          maths, the trade-offs and the small habit shifts that
          actually move the number.
        </p>
      </EditorNote>

      <h2 id="what-it-is">What an offset account actually is</h2>
      <p className="lead">
        An offset account is a transaction account linked to your home
        loan. It works like any everyday account: you can deposit
        salary, pay bills, use a debit card, transfer money. The
        difference is that the balance in the account is subtracted
        from your loan principal each day when interest is calculated.
      </p>
      <p>
        If your loan is $600,000 and you have $50,000 in the offset
        account, interest is calculated on $550,000 of principal that
        day. The bigger the offset balance, the lower the daily
        interest charge. Loan term and minimum repayment stay the
        same; the principal portion of each repayment just goes up
        because less of the repayment is interest.
      </p>

      <h2 id="how-it-works">How it saves you interest (the maths)</h2>
      <p>
        Interest on Australian home loans is typically calculated
        daily and charged monthly. Each day, the lender takes the loan
        balance, subtracts the offset balance, multiplies by the daily
        interest rate, and adds that to the month&rsquo;s interest tally.
      </p>
      <p>
        Worked example. $600,000 loan, 6.5 per cent rate, $50,000
        average offset balance over the year.
      </p>
      <ul>
        <li><strong>Without offset:</strong> interest on $600,000 at 6.5% = $39,000/year</li>
        <li><strong>With $50K offset:</strong> interest on $550,000 at 6.5% = $35,750/year</li>
        <li><strong>Saving:</strong> $3,250/year, every year the offset balance stays at $50,000</li>
      </ul>
      <p>
        That saving compounds. A $50,000 average offset balance held
        for 20 years saves $65,000 in total interest, ignoring the
        knock-on effect of the loan paying down faster (because more
        of each repayment goes to principal). Real total saving over
        20 years on a 25-year loan: closer to $85,000 to $95,000.
      </p>
      <KeyFigure
        value="$3,250/yr"
        label="Interest saved on a $50K average offset balance against a 6.5% loan"
        context="Every year the balance stays at that level"
      />

      <h2 id="offset-vs-redraw">Offset vs redraw: which to use when</h2>
      <p>
        Redraw is the cheaper cousin of offset. It&rsquo;s a feature on
        the loan itself: any extra repayments you make above the
        minimum can be pulled back out (redrawn) later. Interest is
        calculated on the lower balance after the extra repayment,
        which gives you the same interest-saving effect as offset.
      </p>
      <p>
        Three differences matter:
      </p>
      <ul>
        <li>
          <strong>Status of the money.</strong> Offset balance is your
          money in an account. Redraw is a repayment you&rsquo;ve made
          that the lender allows you to reverse. For most owner-occupier
          purposes that distinction doesn&rsquo;t matter; it matters a
          lot for investment loans (see below).
        </li>
        <li>
          <strong>Cost.</strong> Offset is almost always part of a
          packaged loan with an annual fee ($250 to $400). Redraw is
          often included for free on basic-rate variable loans. If you
          don&rsquo;t need offset specifically, a basic loan with
          redraw can save you the package fee.
        </li>
        <li>
          <strong>Friction.</strong> Offset money is in a transaction
          account with a debit card. Redraw money has to be requested
          from the lender (some are instant; some take 1 to 3 days).
          Offset is more usable as an emergency fund.
        </li>
      </ul>

      <PullQuote attribution="Andy McMaster, Editor">
        Offset and redraw save the same interest. Offset wins
        because the money stays accessible and stays yours.
      </PullQuote>

      <h2 id="vs-savings">Offset vs a high-interest savings account</h2>
      <p>
        High-interest savings accounts (HISAs) in 2026 typically offer
        4 to 4.75 per cent on balances up to $250,000, conditional on
        monthly deposit and withdrawal rules. Sounds competitive with
        a 6.5 per cent loan saving. It isn&rsquo;t, once you tax it.
      </p>
      <p>
        HISA interest is fully taxable as ordinary income. On a 32.5
        per cent marginal rate, 4.5 per cent gross becomes 3.04 per
        cent after tax. On a 37 per cent marginal rate, 2.84 per cent
        after tax. On a 47 per cent marginal rate (including
        Medicare), 2.39 per cent after tax.
      </p>
      <p>
        Offset interest savings, by contrast, are not taxable. You
        didn&rsquo;t earn income; you avoided expense. Every dollar of
        interest saved is a dollar in your pocket, untaxed. On a 6.5
        per cent loan, offset effectively earns you 6.5 per cent
        after-tax. The HISA cannot match this.
      </p>
      <p>
        Rule: any cash you&rsquo;d otherwise hold in a savings or
        chequing account should sit in the offset.
      </p>

      <h2 id="package-fee">Is the package fee worth it?</h2>
      <p>
        Offset accounts almost always sit inside a packaged home loan,
        which carries an annual fee of $250 to $400. The package
        usually includes a rate discount (10 to 25 basis points), the
        offset feature, free credit card, fee waivers on other
        products. Whether it&rsquo;s worth it depends on whether your
        average offset balance saves more interest than the fee costs.
      </p>
      <p>
        Breakeven calculation. Annual fee ÷ loan rate = minimum
        average offset balance required.
      </p>
      <ul>
        <li>$400 fee ÷ 6.5% = $6,154 average balance to break even</li>
        <li>$300 fee ÷ 6.5% = $4,615 average balance to break even</li>
        <li>$250 fee ÷ 6.5% = $3,846 average balance to break even</li>
      </ul>
      <p>
        Below that average balance, you&rsquo;re paying more in fees
        than you&rsquo;re saving in interest. Above it, the offset
        pays for itself (and the rate discount on top is pure upside).
        For most households with a salary running through the account,
        average balance is comfortably above $10,000, so the package
        works. For low-balance situations (early career, fresh
        deposit, all cash spent), a basic-rate loan without the
        package is sometimes the cheaper option.
      </p>

      <GuideNewsletterCallout
        title="Want the next mortgage and rate read in your inbox?"
        subtitle="One quarterly email covering RBA cash-rate decisions, lender pricing moves, and the loan-structure changes that affect every offset balance. No spam."
      />

      <h2 id="investment-loans">Why offset matters more on investment loans</h2>
      <p>
        Investment-loan interest is tax-deductible against rental
        income (and other income, in the case of negative gearing).
        Owner-occupier loan interest isn&rsquo;t deductible. That
        difference changes how offset and redraw work tactically.
      </p>
      <p>
        Here&rsquo;s the trap. If you use redraw on an investment loan,
        the ATO can re-classify a portion of the loan as non-deductible
        based on what you spent the redrawn money on. Example:
        $400,000 investment loan, you redraw $20,000 to buy a car.
        Even after you pay the $20,000 back via extra repayments, the
        ATO treats the loan as having two parts: $380,000 deductible
        (rental-related) and $20,000 non-deductible (car-related). The
        car-related portion stays non-deductible for the life of the
        loan.
      </p>
      <p>
        Offset doesn&rsquo;t have this problem. Money in an offset
        account is your money, not a loan repayment. Pulling it out
        and spending it on a car doesn&rsquo;t affect the loan&rsquo;s
        deductibility at all. For investment loans specifically: never
        use redraw, always use offset.
      </p>
      <p>
        See our{" "}
        <Link href="/guides/negative-gearing-australia">negative gearing guide</Link>{" "}
        for the full deductibility framework.
      </p>

      <h2 id="next-purchase">Using offset to build your next deposit</h2>
      <p>
        When you upgrade your owner-occupier home or buy an investment
        property, the cleanest deposit you can produce is your offset
        balance. It&rsquo;s already yours, already accessible, and
        pulling it out doesn&rsquo;t trigger any tax event.
      </p>
      <p>
        The mechanics:
      </p>
      <ol>
        <li>You hold $80,000 in the offset of your owner-occupier loan.</li>
        <li>You buy an investment property. You withdraw the $80,000 from offset and use it as the deposit.</li>
        <li>The offset balance drops to $0. Your owner-occupier loan now charges interest on the full balance again (still owner-occupier, still non-deductible).</li>
        <li>The new investment loan is sized at $560,000 (property price minus $80,000 deposit). All of the investment loan&rsquo;s interest is tax-deductible.</li>
      </ol>
      <p>
        This is cleaner than the alternative (refinancing your
        owner-occupier loan to extract equity, then re-borrowing it as
        an investment loan) because there&rsquo;s no debt
        re-classification needed and no refinance friction.
      </p>

      <h2 id="common-mistakes">Common mistakes that cost real money</h2>
      <ul>
        <li>
          <strong>Holding cash in a separate savings account.</strong>{" "}
          Even at 4.5 per cent gross HISA, the after-tax return is
          lower than the offset saving on any loan above 4 per cent.
        </li>
        <li>
          <strong>Using redraw on an investment loan.</strong> Will
          cost you tax deductions you can&rsquo;t get back.
        </li>
        <li>
          <strong>Paying the package fee on a low-balance offset.</strong>{" "}
          Run the breakeven number. If your average balance is below
          it, switch to a basic variable loan.
        </li>
        <li>
          <strong>Not negotiating the package fee waiver.</strong> Most
          lenders will waive the fee for the first year, sometimes
          longer, as a competitive lever. Ask. If they say no, your
          broker can usually get it.
        </li>
        <li>
          <strong>Splitting cash across multiple banks.</strong> Cash
          held outside your offset is cash earning less than it could.
          Consolidate.
        </li>
        <li>
          <strong>Forgetting to use offset during interest-only
          periods.</strong> On interest-only investment loans the
          offset saving is the entire game. Maximising the offset
          balance is the only way to reduce the interest bill during
          the interest-only period.
        </li>
        <li>
          <strong>Using offset for sinking funds and forgetting they&rsquo;re
          there.</strong> Annual insurance, rates, holidays: sitting in
          offset, all good. Withdraw at bill time, pay the bill, then
          actually replenish. The benefit only persists if the balance
          persists.
        </li>
      </ul>

      <h2 id="when-not">When an offset account isn&rsquo;t worth it</h2>
      <p>
        Three situations where offset doesn&rsquo;t earn its keep:
      </p>
      <ul>
        <li>
          <strong>Tiny balances.</strong> If your offset average sits
          below the package-fee breakeven (typically under $5,000),
          you&rsquo;re paying more in fees than you&rsquo;re saving in
          interest. Switch to a basic variable loan.
        </li>
        <li>
          <strong>Fixed-rate loans.</strong> Most fixed-rate loans
          don&rsquo;t allow offset at all, or only allow it on a
          portion of the loan (10 to 50 per cent of the fixed
          balance). If you&rsquo;ve fixed everything, offset
          isn&rsquo;t available anyway. See the{" "}
          <Link href="/guides/fixed-vs-variable-rate-guide">fixed vs variable guide</Link>{" "}
          for the trade-off.
        </li>
        <li>
          <strong>You actively pay down the loan.</strong> If your
          strategy is to make extra repayments and never withdraw
          them, redraw on a basic-rate loan gives you the same
          interest saving without the package fee. The offset
          advantage is the access, and you&rsquo;ve said you
          don&rsquo;t need access.
        </li>
      </ul>

      <MatchCTA kind="buyers-agent" />

      <Sources items={OFFSET_SOURCES} />
    </GuideArticleLayout>
    </>
  );
}

const OFFSET_SOURCES: readonly SourceItem[] = [
  { label: "ATO: Rental properties guide", href: "https://www.ato.gov.au/", note: "Investment-loan interest deductibility, redraw re-classification rules" },
  { label: "ASIC Moneysmart: Home loans", href: "https://moneysmart.gov.au/home-loans", note: "Plain-language explanations of offset and redraw used as cross-check" },
  { label: "APRA Authorised Deposit-taking Institutions Statistics", href: "https://www.apra.gov.au/", note: "Lender concentration and product feature coverage" },
  { label: "Mortgage and Finance Association of Australia (MFAA)", href: "https://www.mfaa.com.au/", note: "Industry data on offset adoption and broker recommendations" },
  { label: "Reserve Bank of Australia: Statistical Tables", href: "https://www.rba.gov.au/statistics/", note: "Standard variable rate benchmarks used in worked examples" },
  { label: "Choice: Home loan offset account comparison", note: "Independent product comparison referenced for package fee ranges" },
];
