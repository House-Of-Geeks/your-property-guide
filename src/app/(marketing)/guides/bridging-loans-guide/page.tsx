import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  SectionDivider,
  MiniStampDutyEmbed,
  ScrollTable,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import {
  COST_TABLE_AMOUNTS,
  COST_TABLE_MONTHS,
  EXAMPLE_BRIDGING_RATE,
  EXAMPLE_ONGOING_RATE,
  PEAK_LVR_CAP,
  capitalisedInterest,
  computeBridging,
  defaultBridgingInput,
  monthlyRepayment,
} from "@/lib/bridging-calc";
import { BRIDGING_LENDERS, BRIDGING_LENDERS_CHECKED_ON, PUBLISHED_CAPITALISED_RATES } from "@/lib/data/bridging-lenders";
import { AVERAGE_NEW_VARIABLE_RATE, F6_RATE_CAVEAT, F6_SOURCE } from "@/lib/data/rba-lending-rates";

const FRONTMATTER: GuideFrontmatter = {
  title: "Bridging Loans Australia: How They Work, What They Cost & the Risks (2026)",
  description:
    "How a bridging loan works when you buy before you sell: peak debt and end debt, what the interest costs in dollars, how much equity you need, what happens if your home doesn't sell, and the cheaper alternatives.",
  slug: "bridging-loans-guide",
  publishedAt: "2026-05-06",
  updatedAt: "2026-10-11",
  readingTimeMinutes: 14,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "upgrading",
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

const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;

// Every dollar figure on this page comes from the engine behind
// /bridging-loan-calculator (src/lib/bridging-calc.ts), so the guide and the
// tool cannot disagree. The worked example is the calculator's opening state.
const RATE = EXAMPLE_BRIDGING_RATE;
const PER_100K_6 = capitalisedInterest(100_000, RATE, 6);
const ON_500K_6 = capitalisedInterest(500_000, RATE, 6);
const EX = defaultBridgingInput("NSW");
const EXR = computeBridging(EX);
// A sale that comes in $50,000 under the estimate adds $50,000 to the end debt.
const PRICE_DROP = 50_000;
const DROP_REPAYMENT = monthlyRepayment(EXR.endDebt + PRICE_DROP, EXAMPLE_ONGOING_RATE, 30) - EXR.monthlyRepayment;

const TLDR = [
  "A bridging loan lets you buy your next home before you sell the current one. The lender takes a mortgage over both homes until the sale settles.",
  `You pay the full bridging rate on the part of the loan your sale will repay. At ${RATE}% that is about ${fmt(PER_100K_6)} per $100,000 for six months, or ${fmt(ON_500K_6)} on $500,000. Banks that add the interest to the loan published ${PUBLISHED_CAPITALISED_RATES.low}% to ${PUBLISHED_CAPITALISED_RATES.high}% on 6 October 2026.`,
  "Lenders charge the interest in one of two ways. Westpac, St.George and Bendigo Bank add it to the loan; CBA and ANZ ask for monthly interest-only payments.",
  `Two figures decide whether you get one: peak debt, everything you owe before the sale, and end debt, what is left after it. Westpac, NAB and Bendigo Bank cap total lending at ${PEAK_LVR_CAP}% of both homes' combined value, and lenders test your income against the end debt.`,
  "Most of the big banks allow up to 12 months to sell; Bendigo Bank and Bankwest set about 6 months for an established home. Past the term, expect a higher rate, pressure to cut the price, and in the end a forced sale.",
  "Cheaper routes exist when your timing allows: selling first, a subject-to-sale offer, a longer settlement, or a deposit bond for the deposit. A \"relocation loan\" is St.George's name for a bridging loan, not an alternative.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is",          label: "What is a bridging loan?" },
  { id: "how-it-works",     label: "How bridging loans work" },
  { id: "peak-vs-end-debt", label: "Peak debt and end debt" },
  { id: "interest",         label: "Interest and repayments" },
  { id: "costs",            label: "What a bridging loan costs" },
  { id: "qualification",    label: "How much equity you need" },
  { id: "which-banks",      label: "Which banks offer bridging loans" },
  { id: "if-it-doesnt-sell", label: "If your home doesn't sell in time" },
  { id: "alternatives",     label: "Alternatives to bridging" },
  { id: "situations",       label: "Situations people ask about" },
  { id: "when-it-makes-sense", label: "When bridging is the right call" },
  { id: "process",          label: "The bridging loan process" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much does a $100,000 bridging loan cost?",
    answer:
      `About ${fmt(PER_100K_6)} for six months at ${RATE}%, with the interest added to the loan monthly. That is ${fmt(capitalisedInterest(100_000, RATE, 3))} for three months and ${fmt(capitalisedInterest(100_000, RATE, 12))} for twelve. ` +
      `Add the application, valuation and discharge fees. Scale it to your own figure: $500,000 for six months is about ${fmt(ON_500K_6)}. The bridging loan calculator works it out from your sale and purchase prices.`,
  },
  {
    question: "Do you make repayments during a bridging loan?",
    answer:
      "It depends on the lender. Westpac, St.George, Bank of Melbourne, BankSA and Bendigo Bank add the bridging interest to the loan, so there are no repayments on the bridging part until the sale. " +
      "CBA and ANZ ask for interest-only repayments, and Bankwest lets you choose. Repayments on the loan you keep after the sale usually start straight away.",
  },
  {
    question: "What are the downsides of a bridging loan?",
    answer:
      `Cost, and the risk that the sale goes worse than planned. You pay the full bridging rate on a large amount: about ${fmt(ON_500K_6)} on $500,000 over six months. ` +
      "If the home takes longer to sell, the interest keeps adding up and the lender can charge a higher rate or push you to cut the price. If it sells for less than expected, the shortfall stays on your loan for good.",
  },
  {
    question: "Is there a cheaper alternative to a bridging loan?",
    answer:
      "Yes, if your timing allows. Selling first and renting avoids the bridging interest. A subject-to-sale offer lets you buy on condition your home sells, and a longer settlement can line the two settlements up. " +
      "A deposit bond covers the deposit on the new home without cash. A relocation loan is not an alternative: it is St.George's name for a bridging loan. Our guide to the alternatives compares them side by side.",
  },
  {
    question: "How much equity do you need for a bridging loan?",
    answer:
      `Enough that peak debt stays under the lender's cap. Westpac, NAB and Bendigo Bank lend up to ${PEAK_LVR_CAP}% of both homes' combined value, so your equity across both homes needs to be at least 20% of their value at the peak. ANZ lends up to ${PEAK_LVR_CAP}% of the new home's value. ` +
      `In our worked example, a ${fmt(EX.salePrice)} home with ${fmt(EX.mortgageOwing)} owing supports a ${fmt(EX.purchasePrice)} purchase at ${EXR.peakLvr}%.`,
  },
  {
    question: "How long can a bridging loan last?",
    answer:
      "Up to 12 months at Westpac, CBA, NAB, ANZ and the St.George group. Bendigo Bank allows 6 months for an established home and 12 for land or building, and Bankwest usually 6. " +
      "Specialist lender Bridgit goes to 24 months. ANZ says its term generally can't be extended, and Westpac's rate rises a point after the first 3 months.",
  },
  {
    question: "Can you repay a bridging loan early?",
    answer:
      "Yes. The loan is meant to be repaid as soon as your sale settles, and a quicker sale means less interest. CBA says it charges no early repayment penalty, and Westpac allows extra repayments. " +
      "Expect a discharge fee: Westpac and St.George publish $350.",
  },
  {
    question: "What is the difference between open and closed bridging?",
    answer:
      "Closed bridging is when your current home has already sold and you know the settlement date. Open bridging is when it hasn't sold yet. " +
      "Closed bridging is easier to get and usually short. Open bridging carries the risk that the sale takes longer or brings less, so lenders are stricter about equity and the sale plan.",
  },
  {
    question: "Which banks offer bridging loans?",
    answer:
      "Westpac, CBA, NAB, ANZ, Bankwest and Bendigo Bank all publish one, and St.George, Bank of Melbourne and BankSA call theirs a relocation loan. " +
      "Suncorp no longer offers bridging, and Macquarie and ING don't publish a product. Bridgit and Yard are specialist non-bank bridging lenders. Our table sets out each one's term, interest method and limit.",
  },
  {
    question: "What happens if my home doesn't sell in time?",
    answer:
      "The lender may extend the term, usually at a higher rate, and will want the price reduced. CBA says it may charge its default rate after 12 months. If the home still doesn't sell, the lender can require a sale to recover the loan. " +
      "List before you settle on the new home, price from a recent appraisal, and accept a slightly lower offer rather than let the term run out.",
  },
  {
    question: "What's peak debt vs end debt?",
    answer:
      "Peak debt is the most you owe during the bridging period: your existing mortgage plus the new home's price, stamp duty and costs, plus the interest added while you sell. " +
      "End debt is what remains after your current home sells and the proceeds pay the loan down. It becomes your ordinary home loan, and lenders test your income against it.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Bridging Loan Calculator",          href: "/bridging-loan-calculator",           description: "Your peak debt, end debt and what bridging costs, from your own prices." },
  { title: "Alternatives to a Bridging Loan",   href: "/guides/bridging-loan-alternatives",  description: "Deposit bonds, relocation loans, selling first and subject-to-sale compared." },
  { title: "Sell First or Buy First?",          href: "/guides/sell-first-or-buy-first",     description: "The decision tree before you commit to a bridging loan." },
  { title: "Free Property Appraisal",           href: "/appraisal",                          description: "Know what your current home is worth, the foundation of any bridging plan." },
  { title: "Downsizer's Guide",                 href: "/guides/downsizers-guide",            description: "Moving to something smaller, including the downsizer super contribution." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",              description: "Stamp duty on the new place is part of peak debt, factor it in." },
];

const SOURCES: SourceItem[] = [
  ...BRIDGING_LENDERS.flatMap((l) => l.sources.map((src) => ({ label: src.label, href: src.href, note: "read 6 October 2026" }))),
  { label: "ATO: Moving to a new main residence", href: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/property-and-capital-gains-tax/your-main-residence-home/moving-to-a-new-main-residence", note: "updated 22 June 2026, read 6 October 2026" },
  { label: "ATO: Interest expenses on rental properties", href: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/property-and-land/residential-rental-properties/rental-expenses/interest-expenses", note: "updated 21 May 2026, read 6 October 2026" },
  { label: "ATO: Treating a former home as your main residence", href: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/property-and-capital-gains-tax/your-main-residence-home/treating-former-home-as-main-residence", note: "updated 22 June 2026, read 6 October 2026" },
  { label: "ATO: Downsizer super contributions", href: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/downsizer-super-contributions", note: "updated 20 January 2026, read 6 October 2026" },
  { label: "NSW Government: Minimum notice periods for ending a residential tenancy", href: "https://www.nsw.gov.au/housing-and-construction/rules/minimum-notice-periods-for-ending-a-residential-tenancy", note: "read 6 October 2026" },
  { label: "Consumer Affairs Victoria: Notice to vacate in rental properties", href: "https://www.consumer.vic.gov.au/housing/renting/moving-out-giving-notice-and-evictions/notice-to-vacate/notice-to-vacate-in-rental-properties", note: "read 6 October 2026" },
  { label: "Residential Tenancies Authority (Qld): When a property is for sale", href: "https://www.rta.qld.gov.au/during-a-tenancy/events-that-impact-the-agreement/when-a-property-is-for-sale", note: "read 6 October 2026" },
  { label: F6_SOURCE.name, href: F6_SOURCE.url, note: `series ${AVERAGE_NEW_VARIABLE_RATE.series}, ${AVERAGE_NEW_VARIABLE_RATE.period}: the ${EXAMPLE_ONGOING_RATE}% rate on the end debt in the examples. Published ${F6_SOURCE.published}, read ${F6_SOURCE.readOn}; ${F6_RATE_CAVEAT}.` },
  `Interest figures: ${RATE}% a year compounded monthly, an example rate rather than a quote. Stamp duty, selling and buying costs from the same tables as our stamp duty, selling costs and conveyancing tools.`,
];

export default function BridgingLoansGuidePage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="Run your own numbers">
        <p>
          The <Link href="/bridging-loan-calculator">bridging loan calculator</Link> works out your peak debt, whether it
          fits a lender&rsquo;s {PEAK_LVR_CAP}% limit, the interest added while you sell, and the loan you&rsquo;re left
          with. Start from your suburb&rsquo;s median sale price.
        </p>
      </Callout>

      <h2 id="what-is">What is a bridging loan?</h2>
      <p className="lead">
        A bridging loan is a short-term home loan that covers the gap between
        buying your new home and selling your old one. The lender holds both
        properties as security during the bridging period, and the loan
        unwinds when the old home sells.
      </p>
      <p>
        Bridging exists because the property market doesn&rsquo;t line up with
        your moving date. You&rsquo;ve found the new place and don&rsquo;t want
        to lose it, but your current home hasn&rsquo;t sold. The bridging loan
        lets you buy now and sell over the following months.
      </p>

      <h2 id="how-it-works">How bridging loans work</h2>
      <p>A bridging loan is usually one approval in two parts:</p>
      <ol>
        <li>
          <strong>The bridging loan:</strong> the part your sale will repay.
          Depending on the lender, interest on it is either added to the loan
          (capitalised) and cleared at settlement, or paid monthly as interest
          only.
        </li>
        <li>
          <strong>The end debt:</strong> the loan you keep once the sale
          settles. Most lenders ask for normal repayments on this part from the
          start, and this is the loan they test your income against.
        </li>
      </ol>
      <p>
        During the bridging period the lender holds mortgages over both
        properties. You settle the purchase, move in, and have a set time,
        up to 12 months at most big banks, to sell the old home and repay the
        bridging part.
      </p>

      <h3>Open and closed bridging</h3>
      <p>
        <strong>Closed bridging</strong> is when your current home has already
        sold and you know the settlement date; the loan covers a gap of weeks.{" "}
        <strong>Open bridging</strong> is when it hasn&rsquo;t sold yet. Open
        bridging is the riskier of the two, for you and the lender, because the
        sale could take longer or bring less than planned. Westpac, CBA, NAB,
        ANZ and the St.George group all publish open bridging; Bendigo Bank
        covers both.
      </p>

      <h2 id="peak-vs-end-debt">Peak debt and end debt</h2>
      <p>Two numbers matter more than any others in a bridging loan:</p>

      <KeyFigure
        value="Peak vs End"
        label="Peak debt is the most you owe during bridging. End debt is what remains after the old home sells."
        context="Lenders assess your income against end debt, not peak"
      />

      <h3>Peak debt</h3>
      <p>The most you owe during bridging:</p>
      <ul>
        <li>Outstanding balance on your existing mortgage</li>
        <li>+ Purchase price of the new property</li>
        <li>+ Stamp duty, conveyancing and loan fees on the new property</li>
        <li>+ Interest added during the bridging period</li>
        <li>&minus; Any savings you put in</li>
      </ul>
      <p>
        Peak debt has to fit within the lender&rsquo;s loan-to-value ratio (LVR)
        cap. Westpac, NAB and Bendigo Bank cap total lending at{" "}
        {PEAK_LVR_CAP}% of both properties&rsquo; combined value. Above that,
        the bridging loan won&rsquo;t be approved as it stands.
      </p>

      <h3>End debt</h3>
      <p>
        What&rsquo;s left after your old home sells and the proceeds pay the
        loan down. End debt is peak debt less the net sale proceeds (the sale
        price less agent commission, marketing and legal costs). The lender
        assesses your ability to repay the <strong>end debt</strong>, not the
        peak, on your normal income.
      </p>

      <h3>Worked example</h3>
      <p>
        You owe {fmt(EX.mortgageOwing)} on a home you expect to sell for{" "}
        {fmt(EX.salePrice)}. You&rsquo;re buying a {fmt(EX.purchasePrice)} home
        in New South Wales and expect to sell within six months, with the
        bridging interest added to the loan at {RATE}%.
      </p>
      <ScrollTable label="Worked example: bridging a $1.5 million purchase">
        <table>
          <tbody>
            <tr><td>Stamp duty on the purchase (owner-occupier)</td><td>{fmt(EXR.stampDuty)}</td></tr>
            <tr><td>Conveyancing, registration and loan fees</td><td>{fmt(EX.buyingCosts + EX.loanFees)}</td></tr>
            <tr><td>Borrowed at the start: mortgage + price + duty + costs</td><td>{fmt(EXR.startingDebt)}</td></tr>
            <tr><td>Net sale proceeds after {fmt(EX.sellingCosts)} of selling costs</td><td>{fmt(EXR.netSaleProceeds)}</td></tr>
            <tr><td>Interest added over six months on that amount</td><td>{fmt(EXR.capitalisedInterest)}</td></tr>
            <tr><td><strong>Peak debt</strong></td><td><strong>{fmt(EXR.peakDebt)}</strong></td></tr>
            <tr><td>Combined value of both homes</td><td>{fmt(EXR.combinedValue)}</td></tr>
            <tr><td>Peak debt LVR</td><td>{EXR.peakLvr}% ({EXR.withinCap ? `within the ${PEAK_LVR_CAP}% cap` : `above the ${PEAK_LVR_CAP}% cap`})</td></tr>
            <tr><td><strong>End debt after the sale</strong></td><td><strong>{fmt(EXR.endDebt)}</strong></td></tr>
            <tr><td>Monthly repayment on the end debt (30 years at {EXAMPLE_ONGOING_RATE}%)</td><td>{fmt(EXR.monthlyRepayment)}</td></tr>
          </tbody>
        </table>
      </ScrollTable>
      <p>
        The lender tests your income against the {fmt(EXR.endDebt)} end debt,
        not the {fmt(EXR.peakDebt)} peak. If you can comfortably repay the end
        debt, the bridging loan is on the table.
      </p>

      <h2 id="interest">Interest and repayments</h2>
      <p>Lenders charge bridging interest in one of two ways:</p>
      <ul>
        <li>
          <strong>Added to the loan (capitalised).</strong> Westpac, St.George,
          Bank of Melbourne, BankSA and Bendigo Bank add the interest to the loan
          each month, with no repayments on the bridging part until the sale.
          That protects your cash flow while you hold two properties, but you
          pay interest on the interest. Their published rates were{" "}
          {PUBLISHED_CAPITALISED_RATES.low}% to {PUBLISHED_CAPITALISED_RATES.high}%{" "}
          on 6 October 2026, and Westpac&rsquo;s rises a point after the first 3
          months.
        </li>
        <li>
          <strong>Paid monthly, interest only.</strong> CBA and ANZ charge their
          standard variable rate and ask for interest-only repayments. CBA wants
          you to show you can pay interest only on the total debt; ANZ, that you
          can repay both loans.
        </li>
      </ul>
      <p>
        Bankwest lets you choose. What a lender capitalises also differs:
        Westpac charges the interest on the bridging loan alone, Bendigo Bank on
        the whole loan for the new home. Repayments on the loan you keep after
        the sale usually start straight away. If you can afford to pay the
        bridging interest monthly, it costs less overall.
      </p>

      <h2 id="costs">What a bridging loan costs</h2>
      <p>
        The interest is charged at the full rate on everything the sale will
        repay, not just the margin above a normal loan. If you sold first you
        would never borrow that money, so this is the real cost of buying first.
      </p>
      <ScrollTable label="Bridging interest by amount and months">
        <table>
          <thead>
            <tr>
              <th>Amount bridged</th>
              {COST_TABLE_MONTHS.map((m) => <th key={m}>{m} months</th>)}
            </tr>
          </thead>
          <tbody>
            {COST_TABLE_AMOUNTS.map((a) => (
              <tr key={a}>
                <td>{fmt(a)}</td>
                {COST_TABLE_MONTHS.map((m) => <td key={m}>{fmt(capitalisedInterest(a, RATE, m))}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
      <p>
        Interest at {RATE}% a year, added monthly. {RATE}% is an example rate:
        each half a percentage point changes the six-month cost on $100,000 by
        about {fmt(capitalisedInterest(100_000, RATE + 0.5, 6) - PER_100K_6)}.
      </p>
      <p>On top of the interest:</p>
      <ul>
        <li><strong>Loan fees:</strong> Westpac and St.George publish $600 to set up, $100 for documents, $8 a month and $350 to discharge; NAB a $600 application fee and $250 a year</li>
        <li><strong>Valuations</strong> on both properties, which CBA requires</li>
        <li><strong>Double holding costs:</strong> council rates, insurance and utilities on both properties until the sale settles</li>
        <li><strong>Selling costs on the old home:</strong> agent commission, marketing and conveyancing, which you pay whichever route you take</li>
      </ul>
      <p>
        In the worked example, six months of bridging costs about{" "}
        {fmt(EXR.bridgingCost)} in interest and fees on the{" "}
        {fmt(EXR.bridgingLoan)} the sale repays. Selling first instead means
        paying rent between homes and moving twice: at $700 a week for six
        months plus a second move that is about {fmt(EXR.sellFirstCost)}. The{" "}
        <Link href="/bridging-loan-calculator">calculator</Link> runs the same
        comparison with your figures.
      </p>

      <p>
        Stamp duty on the new home is part of peak debt, because it is due
        around settlement, before your sale proceeds arrive:
      </p>
      <MiniStampDutyEmbed />

      <h2 id="qualification">How much equity you need</h2>
      <p>
        Peak debt has to stay under the lender&rsquo;s cap. Westpac, NAB and
        Bendigo Bank lend up to {PEAK_LVR_CAP}% of both homes&rsquo; combined
        value, so your equity across both homes needs to be at least 20% of
        their value at the peak; NAB puts it exactly that way. ANZ lends up to{" "}
        {PEAK_LVR_CAP}% of the new home&rsquo;s value. Most of the equity has to
        come from the home you&rsquo;re selling, which is why bridging is hard
        with a large mortgage.
      </p>
      <p>Lenders also typically want:</p>
      <ul>
        <li><strong>Income that covers the end debt</strong> at the lender&rsquo;s assessment rate, usually 3 percentage points above the actual rate</li>
        <li><strong>A credible sale plan:</strong> the old home listed, or about to be, at a realistic price with an agent engaged</li>
        <li><strong>Clean credit history</strong> on the borrower and the existing mortgage</li>
        <li><strong>Valuations on both homes</strong>, which can come in lower than your own estimate</li>
        <li><strong>Your existing loan with them, at some banks:</strong> CBA takes new customers only with at least $250,000 of ongoing debt, and ANZ and Bankwest need the existing loan moved to them</li>
      </ul>
      <p>
        Bridging is harder to get than a standard home loan, and not every
        lender offers it. A broker who arranges bridging regularly will know
        which lenders are writing it and on what terms.
      </p>

      <h2 id="which-banks">Which banks offer bridging loans</h2>
      <p>
        What each lender publishes about its bridging loan, read on{" "}
        {new Date(BRIDGING_LENDERS_CHECKED_ON).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}.
        A cell says &ldquo;not published&rdquo; where the lender doesn&rsquo;t
        say. This is general information, not a recommendation, and rates
        change: confirm everything with the lender before you apply.
      </p>
      <ScrollTable label="Bridging loans by lender">
        <table style={{ minWidth: 760 }}>
          <thead>
            <tr><th>Lender</th><th>Term</th><th>Interest during bridging</th><th>Limit</th><th>Published rate</th></tr>
          </thead>
          <tbody>
            {BRIDGING_LENDERS.map((l) => (
              <tr key={l.lender}>
                <td>
                  <strong>{l.lender}</strong>
                  <br />
                  <span className="text-sm">{l.product}</span>
                </td>
                <td>{l.term}</td>
                <td>{l.interest}</td>
                <td>{l.limit}</td>
                <td>{l.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
      <p>Other conditions worth knowing before you apply:</p>
      <ul>
        {BRIDGING_LENDERS.map((l) => (
          <li key={l.lender}>
            <strong>{l.lender}:</strong> {l.notes}{" "}
            {l.sources.map((src, i) => (
              <span key={src.href}>
                {i > 0 && ", "}
                <a href={src.href} rel="nofollow noopener" target="_blank">{src.label}</a>
              </span>
            ))}
          </li>
        ))}
      </ul>

      <h2 id="if-it-doesnt-sell">If your home doesn&rsquo;t sell in time</h2>
      <p>
        Most of the big banks give you up to 12 months; Bendigo Bank and
        Bankwest about 6 for an established home. The cost rises before the
        term ends at some lenders: Westpac&rsquo;s bridging rate goes up a point
        after the first 3 months. When the term ends and the home hasn&rsquo;t
        sold, the lender can:
      </p>
      <ul>
        <li><strong>Extend the term</strong>, if it allows one: ANZ says it generally won&rsquo;t</li>
        <li><strong>Charge more:</strong> CBA says it may apply its default rate or remove your discount after 12 months, and may help with the sale</li>
        <li><strong>Ask you to cut the price</strong> or change how you&rsquo;re selling, for example by going to auction</li>
        <li><strong>Require a sale</strong> to recover the loan if nothing else works</li>
      </ul>
      <p>
        <strong>If the price falls</strong>, the shortfall stays on your loan.
        A sale {fmt(PRICE_DROP)} under the estimate adds {fmt(PRICE_DROP)} to the
        end debt, about {fmt(DROP_REPAYMENT)} a month over 30 years at{" "}
        {EXAMPLE_ONGOING_RATE}%. A large drop can also push the end debt past
        what the lender approved, which brings a reassessment of your income.
      </p>
      <p>How to protect yourself:</p>
      <ul>
        <li>Get an <Link href="/appraisal">appraisal</Link> from an agent who sells in your street and plan on the lower end of it</li>
        <li>List the old home before you settle on the new one</li>
        <li>Set a date by which you&rsquo;ll accept a lower offer, well inside the bridging term</li>
        <li>Check how long homes take to sell in your suburb before you commit</li>
        <li>Keep a cash buffer for repayments on the end debt and the double holding costs</li>
      </ul>

      <h2 id="alternatives">Alternatives to bridging</h2>
      <p>
        Bridging is usually the most expensive way to move home. When your
        timing allows, these cost less:
      </p>
      <ScrollTable label="Ways to move home compared">
        <table>
          <thead>
            <tr><th>Option</th><th>Cost</th><th>Main risk</th></tr>
          </thead>
          <tbody>
            <tr><td>Sell first, then buy</td><td>Rent between homes and a second move</td><td>Prices move while you search</td></tr>
            <tr><td>Subject-to-sale offer</td><td>Little beyond your normal costs</td><td>Sellers rarely accept it at auction or in a hot market</td></tr>
            <tr><td>Longer settlement on the purchase</td><td>Nothing, if the seller agrees</td><td>Your sale must still settle first</td></tr>
            <tr><td>Deposit bond for the deposit</td><td>A fee: Deposit Power&rsquo;s calculator charges 1.75% of the deposit for up to 6 months</td><td>You still need the full price at settlement</td></tr>
            <tr><td>Bridging loan</td><td>Interest on the amount the sale repays, plus fees</td><td>The sale takes longer or brings less</td></tr>
          </tbody>
        </table>
      </ScrollTable>
      <p>
        Our guide to the{" "}
        <Link href="/guides/bridging-loan-alternatives">alternatives to a bridging loan</Link>{" "}
        compares each in detail, and the{" "}
        <Link href="/guides/deposit-bonds">deposit bond guide</Link> explains
        how a bond works on a contract. A &ldquo;relocation loan&rdquo; at
        St.George, Bank of Melbourne or BankSA is their bridging loan, so it is
        in the table above. For the decision itself, read{" "}
        <Link href="/guides/sell-first-or-buy-first">Sell first or buy first?</Link>
      </p>

      <h2 id="situations">Situations people ask about</h2>

      <h3>You decide to keep the old home as a rental</h3>
      <p>
        The bridging loan was approved on the basis that the sale repays it. To
        keep the old home you would refinance the whole debt into ordinary
        loans, and the lender would test your income against all of it, with
        the expected rent counted in.
      </p>
      <p>
        Tax works on what the money was used for, not which property secures
        it. The ATO&rsquo;s own example is a couple who borrowed $400,000
        against their old home to buy a new one, then rented the old home out:
        the interest on that $400,000 is not deductible, even though the loan is
        secured on the rental. Only the debt that bought the old home, whatever
        was still owing on it, can be deductible. Speak to an accountant before
        you restructure.
      </p>

      <h3>Renting out the old home while it&rsquo;s for sale</h3>
      <p>
        The ATO lets you treat both homes as your main residence for up to 6
        months when you buy before you sell, so the old home stays free of
        capital gains tax. One condition is that the old home wasn&rsquo;t used
        to earn income, such as rent, in the 12 months before the sale while it
        wasn&rsquo;t your home. Renting it out can cost you that exemption.
      </p>
      <p>
        A tenant also affects the sale. A buyer who wants vacant possession
        means notice to the tenant, and a fixed-term lease can&rsquo;t be ended
        early because of a sale. In New South Wales the notice is 30 days once
        a contract requiring vacant possession is signed. In Victoria it is 90
        days. In Queensland it is 2 months after the contract is signed, on a
        periodic agreement.
      </p>

      <h3>Downsizers and retirees</h3>
      <p>
        When the next home is cheaper than the one you&rsquo;re selling, the
        end debt can be small or nil, which makes bridging easier to justify.
        Lenders still need to be satisfied you can meet the repayments during
        the bridging period, which can be harder without a salary.
      </p>
      <p>
        If you&rsquo;re 55 or older and have owned the home for 10 years or
        more, you may be able to put up to $300,000 of the sale proceeds into
        super as a downsizer contribution, each, within 90 days of settlement.
        Our <Link href="/guides/downsizers-guide">downsizer&rsquo;s guide</Link>{" "}
        covers the move as a whole.
      </p>

      <h3>Building while you live in the old home</h3>
      <p>
        Westpac and the St.George group cover buying land and building with a
        builder within their 12-month term, and Bendigo Bank allows 12 months
        for land or construction against 6 for an established home. ANZ
        won&rsquo;t make the construction loan the bridging part. A build is
        paid in stages, and delays push out the date you move and sell, so
        leave room in the term.
      </p>

      <h3>Buying at auction</h3>
      <p>
        An auction purchase is unconditional, so get bridging pre-approval
        before the day. The deposit, often 10%, is due when you sign, before
        your sale proceeds arrive; a{" "}
        <Link href="/guides/deposit-bonds">deposit bond</Link> can stand in for
        it if the contract allows.
      </p>

      <SectionDivider label="Putting it together" />

      <h2 id="when-it-makes-sense">When bridging is the right call</h2>
      <p>Bridging usually wins on the numbers when:</p>
      <ul>
        <li>The market is moving fast and the new property won&rsquo;t wait for a subject-to-sale offer</li>
        <li>You have plenty of equity in the existing home and can comfortably repay the end debt</li>
        <li>Rent and a second move would cost close to the bridging interest anyway</li>
        <li>The cost of losing the new home would be high</li>
        <li>You&rsquo;re confident your old home will sell within the term: a good agent, a realistic price, a prepared property</li>
      </ul>
      <p>Bridging tends to be the wrong call when:</p>
      <ul>
        <li>Your equity is thin and peak debt would go past the lender&rsquo;s cap</li>
        <li>The market is soft and comparable homes are taking 4 months or more to sell</li>
        <li>You don&rsquo;t have a credible sale plan or a strong selling agent</li>
        <li>Repaying the end debt would be a stretch</li>
      </ul>

      <h2 id="process">The bridging loan process</h2>
      <ol>
        <li>
          <strong>Get an appraisal</strong> on your existing home from a local
          agent who sells in the area. It is the basis of the peak and end
          debt figures. <Link href="/appraisal">Request a free appraisal</Link>.
        </li>
        <li>
          <strong>Run the numbers</strong> in the{" "}
          <Link href="/bridging-loan-calculator">bridging loan calculator</Link>,
          then talk to a lender or a broker who arranges bridging regularly.
        </li>
        <li>
          <strong>Get pre-approval</strong> for the bridging loan before you sign
          a contract on the new home, especially at auction.
        </li>
        <li>
          <strong>Engage your selling agent</strong> and prepare the old home so
          it is on the market by settlement of the new one, or soon after.
        </li>
        <li><strong>Settle the new property</strong> using the bridging loan and move in.</li>
        <li><strong>Sell the old home</strong> within the bridging term.</li>
        <li>
          <strong>Settle the sale.</strong> The proceeds repay the bridging part
          and you&rsquo;re left with the end debt you were assessed for.
        </li>
      </ol>

      <Callout variant="warning" title="General information, not advice">
        <p>
          Lenders set bridging terms, rates and limits differently, and they
          change. Check the loan contract, the fees and the term with your lender
          or broker, and get tax advice before you restructure a loan or rent out
          a home you&rsquo;re selling.
        </p>
      </Callout>

      <Sources items={SOURCES} />
    </GuideArticleLayout>
  );
}
