import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  ScrollTable,
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
import {
  CONCESSIONAL_CAP,
  CONTRIBUTIONS_TAX_PCT,
  CURRENT_SIC,
  DIVISION_293_THRESHOLD,
  FHSS_ANNUAL_LIMIT,
  FHSS_CHECKED_ON,
  FHSS_CONCESSIONAL_RELEASE_PCT,
  FHSS_DEFAULT_WITHHOLDING_PCT,
  FHSS_LIVE_IN_MONTHS,
  FHSS_MIN_AGE,
  FHSS_RELEASE_BUSINESS_DAYS,
  FHSS_SOURCES,
  FHSS_TAX_OFFSET_PCT,
  FHSS_TAX_PCT,
  FHSS_TIMING,
  FHSS_TOTAL_LIMIT,
  FHSS_TOTAL_LIMIT_BEFORE_2022,
  FHSS_USAGE,
  SUPER_GUARANTEE_PCT,
} from "@/lib/data/fhss";
import { EXAMPLE_BANK_RATE, computeFhss, defaultFhssInput } from "@/lib/fhss-calc";
import { INCOME_TAX_SOURCE, MEDICARE_LEVY_PCT } from "@/lib/utils/income-tax";

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Super Saver Scheme (FHSS) 2026: Limits, Tax and How to Withdraw",
  description:
    "How the FHSS scheme works in 2026: $15,000 a year and $50,000 in total, 85% of before-tax contributions, deemed earnings, the 30% tax offset, the timing rules since September 2024, and whether it beats saving in a bank.",
  slug: "first-home-super-saver-scheme",
  publishedAt: "2026-06-14",
  updatedAt: "2026-10-07",
  readingTimeMinutes: 14,
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

const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;
const checkedOn = new Date(FHSS_CHECKED_ON).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
/** Leads from this guide go to the buyer match, tagged with where they started. */
const MATCH_HREF = "/find-an-expert?intent=buying&from=fhss-guide#match";

// The worked example is the calculator's opening state, computed by the same
// engine (src/lib/fhss-calc.ts, pinned by tests/lib/fhss-calc.test.ts).
const EX = defaultFhssInput();
const EXR = computeFhss(EX);
const AFTER = computeFhss({ ...EX, type: "after-tax" });
const LOW = computeFhss({ ...EX, salary: 40_000 });
const avgRelease = Math.round((FHSS_USAGE.latest.requestedMillions * 1_000_000) / FHSS_USAGE.latest.releaseRequests / 100) * 100;

const TLDR = [
  `The First Home Super Saver (FHSS) scheme lets first home buyers save part of a deposit in super with voluntary contributions, then withdraw them with deemed earnings. Up to ${fmt(FHSS_ANNUAL_LIMIT)} a year and ${fmt(FHSS_TOTAL_LIMIT)} in total count, per person.`,
  `You get back ${FHSS_CONCESSIONAL_RELEASE_PCT}% of before-tax contributions (salary sacrifice, or personal contributions you claim a deduction for) and all of your after-tax ones, plus earnings at the ATO's shortfall interest charge rate (${CURRENT_SIC.rate}% for ${CURRENT_SIC.quarter}), whatever your fund earned.`,
  `When it's released, the before-tax part and the earnings are taxed at your marginal rate plus Medicare levy, less a ${FHSS_TAX_OFFSET_PCT}% offset. On a 30% tax rate that leaves the ${MEDICARE_LEVY_PCT}% Medicare levy.`,
  `Salary sacrificing ${fmt(EX.perYear)} a year for ${EX.years} years on a ${fmt(EX.salary)} salary leaves ${fmt(EXR.inHand)} for a deposit, against ${fmt(EXR.bank.total)} from saving the same pay in a bank at ${EXAMPLE_BANK_RATE}%.`,
  `Since ${FHSS_TIMING.changedOn} you need the ATO's determination before the home becomes yours, not before you sign. You can request the money up to ${FHSS_TIMING.releaseAfterSigningDays} days after signing, and have ${FHSS_TIMING.notifyDays} days to tell the ATO.`,
  `The money takes ${FHSS_RELEASE_BUSINESS_DAYS.min} to ${FHSS_RELEASE_BUSINESS_DAYS.max} business days to arrive. If you don't buy within ${FHSS_TIMING.contractMonths} months (extendable by up to ${FHSS_TIMING.extensionMonths}), put it back into super or pay ${FHSS_TAX_PCT}% FHSS tax.`,
];

const TOC: GuideTOCEntry[] = [
  { id: "how-it-works",    label: "How the FHSS scheme works" },
  { id: "limits",          label: "How much you can put in and take out" },
  { id: "earnings",        label: "Deemed earnings" },
  { id: "tax",             label: "How FHSS is taxed" },
  { id: "worked-example",  label: "FHSS or a savings account? A worked example" },
  { id: "worth-it",        label: "Is FHSS worth it?" },
  { id: "contributing",    label: "How to contribute" },
  { id: "eligibility",     label: "Who can use it" },
  { id: "what-you-can-buy", label: "What you can buy with it" },
  { id: "steps",           label: "Getting your money out, step by step" },
  { id: "timing",          label: "The timing rules since September 2024" },
  { id: "not-buying",      label: "If you don't buy" },
  { id: "couples",         label: "Couples, siblings and friends" },
  { id: "other-schemes",   label: "Using FHSS with other schemes" },
];

const FAQS: FaqItem[] = [
  {
    question: "Is FHSS better than saving outside super?",
    answer:
      `For most people who salary sacrifice, yes. On a ${fmt(EX.salary)} salary, ${fmt(EX.perYear)} a year of salary sacrifice for ${EX.years} years leaves ${fmt(EXR.inHand)} for a deposit through FHSS and ${fmt(EXR.bank.total)} saved in a bank at ${EXAMPLE_BANK_RATE}%, ${fmt(EXR.advantage)} more. ` +
      `Most of the gain is tax: ${CONTRIBUTIONS_TAX_PCT}% going into super instead of your marginal rate plus Medicare levy. With after-tax contributions the gain is only the deemed earnings rate, ${fmt(AFTER.advantage)} on the same amounts. The trade-off is that the money is locked in super until you request it.`,
  },
  {
    question: "Is FHSS salary sacrifice?",
    answer:
      `Salary sacrifice is one way to contribute. FHSS counts any voluntary contribution: salary sacrifice, a personal contribution you claim a tax deduction for, or a personal after-tax contribution. It doesn't count your employer's compulsory super guarantee. Salary sacrifice and deductible contributions give the tax saving, and you get ${FHSS_CONCESSIONAL_RELEASE_PCT}% of them back. After-tax contributions come back in full but save no tax.`,
  },
  {
    question: "Is it worth doing FHSS, and what are the disadvantages?",
    answer:
      `It's usually worth it if your marginal rate is 30% or more (taxable income over $45,000), you can salary sacrifice, and you expect to buy in the next few years. ` +
      `The disadvantages: the money is locked in super until you request it; you can only make one release; it takes ${FHSS_RELEASE_BUSINESS_DAYS.min} to ${FHSS_RELEASE_BUSINESS_DAYS.max} business days to arrive; and if you don't buy you must put it back into super or pay ${FHSS_TAX_PCT}% FHSS tax.`,
  },
  {
    question: "How does the 30% FHSS tax offset work?",
    answer:
      `The released before-tax contributions and all the earnings (the assessable amount) are added to your taxable income in the year you request the release and taxed at your marginal rate plus Medicare levy. You then get a non-refundable offset of ${FHSS_TAX_OFFSET_PCT}% of that amount. ` +
      `On a 30% marginal rate the offset cancels the income tax and you pay the ${MEDICARE_LEVY_PCT}% Medicare levy: ${fmt(EXR.releaseTax)} on ${fmt(EXR.assessable)} in our example. On 37% you pay 9%, and on 45% you pay 17%.`,
  },
  {
    question: "Do you pay tax on FHSS, and does it reduce your taxable income?",
    answer:
      `Salary sacrifice and deductible contributions reduce your taxable income in the year you make them; the fund pays ${CONTRIBUTIONS_TAX_PCT}% tax on them instead. When you withdraw, you pay tax on those contributions and the earnings at your marginal rate plus Medicare levy, less the ${FHSS_TAX_OFFSET_PCT}% offset. ` +
      `The ATO withholds its estimate before paying you (${FHSS_DEFAULT_WITHHOLDING_PCT}% if it can't estimate your rate) and settles the difference in your tax return. After-tax contributions aren't taxed again; only their earnings are.`,
  },
  {
    question: "What happens if you don't use FHSS?",
    answer:
      `If you've requested a release and don't sign a contract within ${FHSS_TIMING.contractMonths} months (or the extension the ATO gives, up to ${FHSS_TIMING.extensionMonths} more), you can put the assessable amount, less the tax withheld, back into super as a non-concessional contribution, or keep it and pay ${FHSS_TAX_PCT}% FHSS tax on the assessable amount. ` +
      "If you never request a release, the money simply stays in your super until retirement.",
  },
  {
    question: "How long does an FHSS release take?",
    answer:
      `Usually ${FHSS_RELEASE_BUSINESS_DAYS.min} to ${FHSS_RELEASE_BUSINESS_DAYS.max} business days from your release request for your fund to send the money and the ATO to pay you. In ${FHSS_USAGE.latest.year}, ${FHSS_USAGE.within20DaysPct}% were done within 20 business days. Plan for the deposit you pay when you sign to come from somewhere else.`,
  },
  {
    question: "Do I need an FHSS determination before signing a contract?",
    answer:
      `Not any more. For determinations made on or after ${FHSS_TIMING.changedOn}, you need the determination before the home becomes yours (generally settlement), and you can request the release up to ${FHSS_TIMING.releaseAfterSigningDays} days after signing. Getting the determination first is still sensible, because it tells you exactly how much you'll get.`,
  },
  {
    question: "How much can I withdraw under FHSS?",
    answer:
      `Up to ${fmt(FHSS_TOTAL_LIMIT)} of eligible contributions (no more than ${fmt(FHSS_ANNUAL_LIMIT)} from any one financial year), at ${FHSS_CONCESSIONAL_RELEASE_PCT}% for before-tax ones and 100% for after-tax ones, plus deemed earnings. The ATO tells you the exact figure, your maximum release amount, when you request a determination.`,
  },
  {
    question: "Can I use FHSS to buy land, build, or buy an investment property?",
    answer:
      `You can use it to build a home, with land and a building contract, or to buy off the plan. You can't use it for vacant land alone, a houseboat, a motor home or an investment property, and you must live in the home for at least ${FHSS_LIVE_IN_MONTHS} of the first 12 months you can.`,
  },
  {
    question: "Can couples both use FHSS?",
    answer:
      `Yes. Eligibility is per person, so each of you can release up to ${fmt(FHSS_TOTAL_LIMIT)} of contributions plus earnings towards the same home. Siblings and friends buying together can do the same. Each person applies separately, and each must be on the title.`,
  },
];

const RELATED: RelatedGuide[] = [
  { title: "FHSS Calculator",                    href: "/fhss-calculator",                       description: "Your release, the tax and the comparison with a bank, on your own salary." },
  { title: "Can I Use My Super to Buy a House?", href: "/guides/use-super-to-buy-a-house",       description: "What you can and can't take out of super for a home." },
  { title: "How Much Deposit to Buy a House",    href: "/guides/how-much-deposit-to-buy-a-house", description: "How much you really need, what counts, and the schemes that lower the bar." },
  { title: "5% Deposit Scheme",                  href: "/guides/first-home-guarantee",           description: "Buy with a 5% deposit and no LMI. Works alongside FHSS." },
  { title: "Help to Buy Scheme",                 href: "/guides/help-to-buy-scheme-australia",   description: "The government puts in up to 40% of the price. Also combines with FHSS." },
  { title: "Deposit Bonds",                      href: "/guides/deposit-bonds",                  description: "Pay the deposit when you sign while your FHSS money is on its way." },
];

export default function FirstHomeSuperSaverSchemePage() {
  return (
    <GuideArticleLayout frontmatter={FRONTMATTER} tldr={TLDR} toc={TOC} faqs={FAQS} related={RELATED}>
      <Callout variant="info" title="FHSS at a glance">
        <ScrollTable label="FHSS key figures">
          <table>
            <tbody>
              <tr><td><strong>What counts</strong></td><td>Voluntary contributions: salary sacrifice, personal contributions (deductible or not). Not super guarantee, or contributions from a spouse, parent or anyone else</td></tr>
              <tr><td><strong>Limits</strong></td><td>{fmt(FHSS_ANNUAL_LIMIT)} of contributions a financial year; {fmt(FHSS_TOTAL_LIMIT)} in total, per person</td></tr>
              <tr><td><strong>What you get back</strong></td><td>{FHSS_CONCESSIONAL_RELEASE_PCT}% of before-tax contributions, 100% of after-tax ones, plus deemed earnings</td></tr>
              <tr><td><strong>Deemed earnings rate</strong></td><td>{CURRENT_SIC.rate}% a year for {CURRENT_SIC.quarter}, compounding daily</td></tr>
              <tr><td><strong>Tax on release</strong></td><td>Marginal rate plus {MEDICARE_LEVY_PCT}% Medicare levy, less a {FHSS_TAX_OFFSET_PCT}% offset, on the before-tax part and the earnings</td></tr>
              <tr><td><strong>Who</strong></td><td>{FHSS_MIN_AGE} or over, never owned property in Australia, and live in the home for {FHSS_LIVE_IN_MONTHS} of the first 12 months</td></tr>
              <tr><td><strong>Timing</strong></td><td>Determination before the home is yours; release up to {FHSS_TIMING.releaseAfterSigningDays} days after signing; paid in {FHSS_RELEASE_BUSINESS_DAYS.min}–{FHSS_RELEASE_BUSINESS_DAYS.max} business days; {FHSS_TIMING.contractMonths} months to sign (extendable to {FHSS_TIMING.contractMonths + FHSS_TIMING.extensionMonths})</td></tr>
              <tr><td><strong>If you don&rsquo;t buy</strong></td><td>Put it back into super, or pay {FHSS_TAX_PCT}% FHSS tax</td></tr>
            </tbody>
          </table>
        </ScrollTable>
        <p>
          From the ATO&rsquo;s FHSS pages, its guidance note and the legislation, checked {checkedOn}. The earnings rate changes
          every quarter. Try your own figures in the <Link href="/fhss-calculator">FHSS calculator</Link>.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The most common misread on this scheme is treating it like a
          government handout. It isn&rsquo;t. FHSS doesn&rsquo;t give you cash;
          it lets you save your own deposit through super so the tax office
          takes a smaller cut on the way in. The benefit is real, and on a
          typical salary it&rsquo;s worth thousands, but it&rsquo;s a tax
          saving on money you were going to put aside anyway.
        </p>
      </EditorNote>

      <h2 id="how-it-works">How the FHSS scheme works</h2>
      <p className="lead">
        The First Home Super Saver scheme lets you save part of your first home
        deposit inside your super fund and withdraw it later. You make extra
        voluntary contributions, the money sits in super, and when you&rsquo;re
        ready to buy you ask the ATO to release those contributions plus an
        amount of deemed earnings.
      </p>
      <p>
        The reason to bother is tax. Before-tax contributions are taxed at{" "}
        {CONTRIBUTIONS_TAX_PCT}% in your fund, not at your marginal rate, and the
        earnings are set at a rate most savings accounts don&rsquo;t match. In{" "}
        {FHSS_USAGE.latest.year} there were {FHSS_USAGE.latest.releaseRequests.toLocaleString("en-AU")} requests
        for a release, for ${FHSS_USAGE.latest.requestedMillions} million between them, about {fmt(avgRelease)} each.
      </p>

      <KeyFigure
        value={fmt(FHSS_TOTAL_LIMIT)}
        label={`The most you can count towards FHSS, at up to ${fmt(FHSS_ANNUAL_LIMIT)} a year. A couple can each use their own.`}
        context="Plus deemed earnings, less tax when it's released"
      />

      <h2 id="limits">How much you can put in and take out</h2>
      <ul>
        <li>
          <strong>Annual limit:</strong> {fmt(FHSS_ANNUAL_LIMIT)} of voluntary contributions counts in each
          financial year. Anything above it stays in super.
        </li>
        <li>
          <strong>Total limit:</strong> {fmt(FHSS_TOTAL_LIMIT)} across all years since 1 July 2017. It
          was {fmt(FHSS_TOTAL_LIMIT_BEFORE_2022)} until it rose for determinations requested from 1 July 2022.
        </li>
        <li>
          <strong>The {FHSS_CONCESSIONAL_RELEASE_PCT}% rule:</strong> you can release{" "}
          {FHSS_CONCESSIONAL_RELEASE_PCT}% of counted before-tax contributions, because your fund has paid{" "}
          {CONTRIBUTIONS_TAX_PCT}% tax on them, and 100% of after-tax ones. Salary sacrifice{" "}
          {fmt(25_000)} in a year and {fmt(FHSS_ANNUAL_LIMIT)} counts, of which {fmt(FHSS_ANNUAL_LIMIT * 0.85)} is releasable.
        </li>
        <li>
          <strong>Order:</strong> contributions count first in, first out, by the date your fund received
          them. When before-tax and after-tax contributions arrive together, the after-tax ones count first.
        </li>
      </ul>
      <p>
        What doesn&rsquo;t count: your employer&rsquo;s super guarantee, contributions required by an award,
        contributions from your spouse, parents or anyone else, government co-contributions, downsizer
        contributions, and anything over the normal contribution caps.
      </p>

      <Callout variant="info" title="The normal contribution caps still apply">
        <p>
          Salary sacrifice shares the {fmt(CONCESSIONAL_CAP.amount)} concessional cap for {CONCESSIONAL_CAP.year}{" "}
          with your employer&rsquo;s {SUPER_GUARANTEE_PCT}% super guarantee. On a $120,000 salary the super
          guarantee is $14,400, which leaves room for $18,100 of salary sacrifice. Go over and the excess is
          taxed at your marginal rate, unless you can carry forward unused cap from the previous five years.
        </p>
      </Callout>

      <h2 id="earnings">Deemed earnings</h2>
      <p>
        You don&rsquo;t get your fund&rsquo;s actual returns. The ATO calculates
        earnings on each counted contribution at the{" "}
        <strong>shortfall interest charge (SIC) rate</strong>, compounding daily
        from the first day of the month the fund received it until the day of
        your determination. The SIC rate is the 90-day bank bill rate plus 3
        percentage points and is reset every quarter: {CURRENT_SIC.rate}% a year
        for {CURRENT_SIC.quarter}.
      </p>
      <p>
        That cuts both ways. In a year when your balanced fund returns 10%, the
        FHSS amount still grows at the SIC rate; in a year when markets fall, it
        still grows. Your release can be more or less than the growth in your
        account.
      </p>

      <h2 id="tax">How FHSS is taxed</h2>
      <ul>
        <li>
          <strong>Going in:</strong> before-tax contributions are taxed at {CONTRIBUTIONS_TAX_PCT}% in
          your fund instead of at your marginal rate. After-tax contributions aren&rsquo;t taxed again.
        </li>
        <li>
          <strong>Coming out:</strong> the released before-tax contributions and all the earnings, called
          the assessable FHSS released amount, are added to your taxable income in the year you request the
          release. You pay your marginal rate plus the {MEDICARE_LEVY_PCT}% Medicare levy, less a
          non-refundable {FHSS_TAX_OFFSET_PCT}% offset.
        </li>
        <li>
          <strong>Withholding:</strong> the ATO withholds your estimated marginal rate including Medicare,
          less {FHSS_TAX_OFFSET_PCT}%, before paying you, or {FHSS_DEFAULT_WITHHOLDING_PCT}% if it can&rsquo;t
          estimate it. You get an FHSS payment summary after 30 June and settle up in your tax return.
        </li>
      </ul>
      <ScrollTable label="Tax on release by marginal rate">
        <table>
          <thead>
            <tr><th>Marginal rate (2026–27)</th><th>Taxable income</th><th>Tax on the assessable amount</th></tr>
          </thead>
          <tbody>
            <tr><td>15%</td><td>$18,201 to $45,000</td><td>{MEDICARE_LEVY_PCT}% (the offset can also reduce tax on your other income)</td></tr>
            <tr><td>30%</td><td>$45,001 to $135,000</td><td>{MEDICARE_LEVY_PCT}%</td></tr>
            <tr><td>37%</td><td>$135,001 to $190,000</td><td>9%</td></tr>
            <tr><td>45%</td><td>Over $190,000</td><td>17%</td></tr>
          </tbody>
        </table>
      </ScrollTable>
      <p>
        The released amount can push you into a higher bracket for the year, so the rate that applies is the
        one on your income plus the release.
      </p>
      <p>Other things to know:</p>
      <ul>
        <li>
          <strong>Study loans (HECS-HELP):</strong> salary sacrifice counts in your repayment income in the
          year you make it. The released amount doesn&rsquo;t count for study loan repayments, family
          assistance, the Medicare levy surcharge or child support.
        </li>
        <li>
          <strong>Division 293:</strong> if your income plus concessional contributions passes{" "}
          {fmt(DIVISION_293_THRESHOLD)}, those contributions are taxed an extra 15%. The released amount is
          taken out of your Division 293 income.
        </li>
        <li>
          <strong>Your pay:</strong> the tax on release is due in your return, so check your employer is
          withholding enough during the year.
        </li>
      </ul>

      <h2 id="worked-example">FHSS or a savings account? A worked example</h2>
      <p>
        A first home buyer on {fmt(EX.salary)} salary sacrifices {fmt(EX.perYear)} a year for{" "}
        {EX.years} years, against taking the same pay and saving it in an account paying{" "}
        {EXAMPLE_BANK_RATE}% (interest taxed at their rate). The deemed earnings rate is held at{" "}
        {EX.sicRatePct}%.
      </p>
      <ScrollTable label={`Worked example: ${fmt(EX.perYear)} a year for ${EX.years} years`}>
        <table>
          <thead>
            <tr><th></th><th>FHSS</th><th>Savings account</th></tr>
          </thead>
          <tbody>
            <tr><td>Pay set aside, before tax</td><td>{fmt(EXR.counted)}</td><td>{fmt(EXR.counted)}</td></tr>
            <tr><td>Tax going in</td><td>{fmt(EXR.contributionsTax)} ({CONTRIBUTIONS_TAX_PCT}% in the fund)</td><td>{fmt(EXR.bank.taxGoingIn)} (30% plus Medicare)</td></tr>
            <tr><td>Saved</td><td>{fmt(EXR.releasableContributions)}</td><td>{fmt(EXR.bank.saved)}</td></tr>
            <tr><td>Earnings</td><td>{fmt(EXR.earnings)} deemed</td><td>{fmt(EXR.bank.interest)} after tax</td></tr>
            <tr><td>Tax coming out</td><td>{fmt(EXR.releaseTax)}</td><td>None</td></tr>
            <tr><td><strong>For the deposit</strong></td><td><strong>{fmt(EXR.inHand)}</strong></td><td><strong>{fmt(EXR.bank.total)}</strong></td></tr>
          </tbody>
        </table>
      </ScrollTable>
      <p>
        FHSS leaves {fmt(EXR.advantage)} more. With after-tax contributions of the same amount the gain falls
        to {fmt(AFTER.advantage)}, all of it from the deemed earnings rate being higher than the account&rsquo;s
        after-tax return. Try your own salary in the <Link href="/fhss-calculator">FHSS calculator</Link>.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        FHSS doesn&rsquo;t add money to your deposit. It stops the tax office
        taking as big a slice of the deposit you were saving anyway.
      </PullQuote>

      <h2 id="worth-it">Is FHSS worth it?</h2>
      <p>It tends to work well when:</p>
      <ul>
        <li>your marginal rate is 30% or more (taxable income over $45,000)</li>
        <li>you can salary sacrifice, or make personal contributions and claim the deduction</li>
        <li>you expect to buy within a few years, and you&rsquo;re saving anyway</li>
      </ul>
      <p>It does less, or can backfire, when:</p>
      <ul>
        <li>
          <strong>Your rate is 15%.</strong> The tax saving going in is the {MEDICARE_LEVY_PCT}% Medicare levy, so most of the gain
          is the earnings rate. On {fmt(40_000)} the same plan is {fmt(LOW.advantage)} ahead of a bank.
        </li>
        <li><strong>You might not buy.</strong> You&rsquo;d have to put the money back into super or pay {FHSS_TAX_PCT}% FHSS tax.</li>
        <li><strong>You might need the money.</strong> It&rsquo;s locked in super until you request a release.</li>
        <li><strong>You&rsquo;re close to the concessional cap</strong> with your employer&rsquo;s super guarantee.</li>
        <li><strong>You&rsquo;re buying within weeks.</strong> The release takes {FHSS_RELEASE_BUSINESS_DAYS.min} to {FHSS_RELEASE_BUSINESS_DAYS.max} business days, and you get one release only.</li>
      </ul>
      <p>
        The deemed rate can also fall. It follows the bank bill rate, which follows the cash rate, so a run of
        rate cuts shrinks the earnings. Everyone&rsquo;s tax position differs, so get personal financial or tax
        advice before committing a large amount.
      </p>

      <MatchCTA
        lead="Working out how FHSS fits with the rest of your deposit? Tell us where you're buying: one specialist receives your details and pays us a fee for the introduction; you pay us nothing. No commitment."
        ctaLabel="Find your specialist"
        href={MATCH_HREF}
      />

      <h2 id="contributing">How to contribute</h2>
      <ul>
        <li>
          <strong>Salary sacrifice:</strong> ask your employer to pay part of your pre-tax salary into your
          super. It&rsquo;s the simplest route and the tax saving comes through your pay.
        </li>
        <li>
          <strong>Personal contribution with a deduction:</strong> pay into your fund from your bank account,
          then lodge a notice of intent to claim a deduction with your fund and wait for its acknowledgement.
          You claim the deduction in your tax return. It counts as before-tax, the same as salary sacrifice.
        </li>
        <li>
          <strong>Personal after-tax contribution:</strong> pay in and don&rsquo;t claim a deduction. It comes
          back in full, but saves no tax.
        </li>
      </ul>
      <p>
        You don&rsquo;t tag contributions as FHSS. Your fund reports them to the
        ATO, and when you request a determination the form is pre-filled with
        your contributions since 1 July 2017. You check it, add any that are
        missing (2017–18 salary sacrifice isn&rsquo;t pre-filled), and list any
        deductions you&rsquo;ve claimed or intend to claim. The ATO matches it
        against your fund&rsquo;s records.
      </p>

      <h2 id="eligibility">Who can use it</h2>
      <ul>
        <li>You must be {FHSS_MIN_AGE} or over to request a determination, though contributions you made before 18 can count.</li>
        <li>
          You must never have owned property in Australia, including an investment property, vacant land,
          commercial property, a lease of land or company title. If you lost all your property through
          financial hardship, such as bankruptcy, a relationship breakdown or serious illness, you can apply
          for a hardship determination.
        </li>
        <li>You can&rsquo;t have had an FHSS release before. A request you withdrew doesn&rsquo;t count.</li>
        <li>You don&rsquo;t need to be an Australian citizen or permanent resident.</li>
        <li>You must move in as soon as practicable and live there for at least {FHSS_LIVE_IN_MONTHS} of the first 12 months.</li>
      </ul>

      <h2 id="what-you-can-buy">What you can buy with it</h2>
      <ul>
        <li>An established home, a new home, or a home off the plan.</li>
        <li>Building a home: land with a contract to build on it.</li>
        <li>Not vacant land on its own, a houseboat, a motor home or an investment property.</li>
      </ul>
      <p>
        FHSS has no price cap, unlike the 5% Deposit Scheme and Help to Buy. It
        works on established homes, unlike most first home owner grants.
      </p>

      <h2 id="steps">Getting your money out, step by step</h2>
      <ol>
        <li>
          <strong>Request an FHSS determination</strong> in myGov (ATO online services, then Super, Manage,
          First home saver). It tells you your maximum release amount. You can request more than one, and
          you must have one before the home becomes yours.
        </li>
        <li>
          <strong>Request the release.</strong> You get one. You can change or cancel it until the ATO starts
          processing it. You can request it before you sign or up to {FHSS_TIMING.releaseAfterSigningDays} days after.
        </li>
        <li>
          <strong>Receive the money.</strong> The ATO withholds tax and pays you in {FHSS_RELEASE_BUSINESS_DAYS.min} to{" "}
          {FHSS_RELEASE_BUSINESS_DAYS.max} business days. It goes to you, not the seller or your conveyancer.
        </li>
        <li>
          <strong>Sign a contract</strong> within {FHSS_TIMING.contractMonths} months of the release request. The ATO can
          extend this by up to {FHSS_TIMING.extensionMonths} months, generally without you applying.
        </li>
        <li><strong>Tell the ATO</strong> within {FHSS_TIMING.notifyDays} days of signing.</li>
        <li><strong>Include it in your tax return</strong> for the year of the release, with the FHSS payment summary.</li>
      </ol>
      <Callout variant="warning" title="The deposit when you sign">
        <p>
          The money can arrive after you sign, which is when the deposit is usually due. If your FHSS release is
          part of that deposit, ask the seller to accept a smaller deposit, or use a{" "}
          <Link href="/guides/deposit-bonds">deposit bond</Link> until it arrives.
        </p>
      </Callout>

      <h2 id="timing">The timing rules since September 2024</h2>
      <p>
        The rules changed on {FHSS_TIMING.changedOn}, and plenty of advice online, including some on
        forums, still describes the old ones. For determinations made on or after that date:
      </p>
      <ScrollTable label="FHSS timing rules before and after 15 September 2024">
        <table>
          <thead>
            <tr><th></th><th>Before 15 September 2024</th><th>Now</th></tr>
          </thead>
          <tbody>
            <tr><td>Determination</td><td>Before signing the contract</td><td>Before the home becomes yours (generally settlement)</td></tr>
            <tr><td>Release after signing</td><td>Within {FHSS_TIMING.releaseAfterSigningDaysBefore} days</td><td>Within {FHSS_TIMING.releaseAfterSigningDays} days</td></tr>
            <tr><td>Telling the ATO you&rsquo;ve signed</td><td>Within {FHSS_TIMING.notifyDaysBefore} days</td><td>Within {FHSS_TIMING.notifyDays} days</td></tr>
          </tbody>
        </table>
      </ScrollTable>
      <p>
        You can now also amend or revoke a determination, and withdraw or amend a release request until the
        ATO starts processing it. If you tried to use FHSS between 1 July 2018 and 14 September 2024, were refused, and now own a home,
        you can apply again until {FHSS_TIMING.transitionalDeadline}. See the{" "}
        <a href={FHSS_SOURCES.previous.href} target="_blank" rel="noopener noreferrer">ATO&rsquo;s page on previous requests</a>.
      </p>

      <h2 id="not-buying">If you don&rsquo;t buy</h2>
      <p>If you&rsquo;ve had the money released and don&rsquo;t sign a contract in time, you have two options:</p>
      <ul>
        <li>
          <strong>Put it back into super:</strong> recontribute the assessable amount, less the tax withheld, as
          a non-concessional contribution and tell the ATO. It then stays in super until retirement, and you
          can&rsquo;t use FHSS again.
        </li>
        <li><strong>Keep it:</strong> pay {FHSS_TAX_PCT}% FHSS tax on the assessable amount, on top of the income tax.</li>
      </ul>
      <p>
        If you haven&rsquo;t requested a release, nothing happens: the contributions stay in your super as
        normal.
      </p>

      <h2 id="couples">Couples, siblings and friends</h2>
      <p>
        FHSS is per person, not per home. Two eligible buyers can each release up to {fmt(FHSS_TOTAL_LIMIT)} of
        contributions plus earnings towards the same purchase, which is {fmt(FHSS_TOTAL_LIMIT * 2)} of
        contributions between a couple. Siblings and friends buying together can do the same. Each of you
        applies through your own myGov account and must be on the title. If your partner has owned property
        before, that doesn&rsquo;t stop you using FHSS, as long as you never have.
      </p>

      <h2 id="other-schemes">Using FHSS with other schemes</h2>
      <p>
        The Australian Government says FHSS can be combined with its other home buyer schemes and with state
        schemes. That includes:
      </p>
      <ul>
        <li>the <Link href="/guides/first-home-guarantee">5% Deposit Scheme</Link>, to buy with a 5% deposit and no LMI</li>
        <li><Link href="/guides/help-to-buy-scheme-australia">Help to Buy</Link>, where the government puts in up to 40% of the price</li>
        <li>your state&rsquo;s <Link href="/guides/first-home-owner-grant-australia">first home owner grant</Link> and stamp duty concessions</li>
      </ul>
      <p>
        State grants and concessions have their own rules, so check with your state&rsquo;s revenue office.
        Our <Link href="/guides/first-home-buyer-guide">national first home buyer guide</Link> shows how the
        pieces fit, and <Link href="/guides/use-super-to-buy-a-house">can I use my super to buy a house?</Link>{" "}
        covers what else super can and can&rsquo;t do.
      </p>

      <MatchCTA
        lead="Ready to plan your deposit? Tell us where you're buying: one specialist receives your details and pays us a fee for the introduction; you pay us nothing. No commitment."
        ctaLabel="Find your specialist"
        href={MATCH_HREF}
      />

      <Sources items={FHSS_GUIDE_SOURCES} />
    </GuideArticleLayout>
  );
}

const FHSS_GUIDE_SOURCES: readonly SourceItem[] = [
  { label: FHSS_SOURCES.about.label, href: FHSS_SOURCES.about.href, note: "What the scheme is and how it works" },
  { label: FHSS_SOURCES.eligibility.label, href: FHSS_SOURCES.eligibility.href, note: "Age, never owned property, one release" },
  { label: FHSS_SOURCES.contributions.label, href: FHSS_SOURCES.contributions.href, note: "Which contributions count, and study loan repayment income" },
  { label: FHSS_SOURCES.releaseAmounts.label, href: FHSS_SOURCES.releaseAmounts.href, note: "The $15,000 and $50,000 limits, the 85% rule, ordering and deemed earnings" },
  { label: FHSS_SOURCES.determination.label, href: FHSS_SOURCES.determination.href, note: "Requesting a determination in myGov, pre-filled contributions" },
  { label: FHSS_SOURCES.release.label, href: FHSS_SOURCES.release.href, note: "Requesting the release, up to 90 days after signing" },
  { label: FHSS_SOURCES.contract.label, href: FHSS_SOURCES.contract.href, note: "12 months to sign, extensions, notifying within 90 days, recontributing" },
  { label: FHSS_SOURCES.receiving.label, href: FHSS_SOURCES.receiving.href, note: "Withholding and the 15 to 20 business days" },
  { label: FHSS_SOURCES.taxAssessment.label, href: FHSS_SOURCES.taxAssessment.href, note: "The 20% FHSS tax" },
  { label: FHSS_SOURCES.guidance.label, href: FHSS_SOURCES.guidance.href, note: "Tax on release, the 30% offset, what you can buy, living in the home" },
  { label: FHSS_SOURCES.law2023.label, href: FHSS_SOURCES.law2023.href, note: "The timing changes from 15 September 2024" },
  { label: FHSS_SOURCES.sic.label, href: FHSS_SOURCES.sic.href, note: `The deemed earnings rate, ${CURRENT_SIC.rate}% for ${CURRENT_SIC.quarter}` },
  { label: FHSS_SOURCES.caps.label, href: FHSS_SOURCES.caps.href, note: `The ${fmt(CONCESSIONAL_CAP.amount)} concessional cap for ${CONCESSIONAL_CAP.year}` },
  { label: FHSS_SOURCES.usage.label, href: FHSS_SOURCES.usage.href, note: `Release requests and amounts, ${FHSS_USAGE.latest.year}, as at ${FHSS_USAGE.asAt}` },
  { label: FHSS_SOURCES.factSheet.label, href: FHSS_SOURCES.factSheet.href, note: "Combining FHSS with other schemes" },
  { label: INCOME_TAX_SOURCE.name, href: INCOME_TAX_SOURCE.url, note: "The 2026–27 rates in the worked example" },
];
