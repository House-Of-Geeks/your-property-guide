import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  KeyFigure,
  MatchCTA,
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
  CURRENT_SIC,
  FHSS_ANNUAL_LIMIT,
  FHSS_CHECKED_ON,
  FHSS_CONCESSIONAL_RELEASE_PCT,
  FHSS_LIVE_IN_MONTHS,
  FHSS_SOURCES,
  FHSS_TAX_PCT,
  FHSS_TOTAL_LIMIT,
} from "@/lib/data/fhss";
import { EXAMPLE_BANK_RATE, computeFhss, defaultFhssInput } from "@/lib/fhss-calc";

const FRONTMATTER: GuideFrontmatter = {
  title: "Can I Use My Super to Buy a House? What You Can and Can't Do (2026)",
  description:
    "Mostly no, with one exception: the First Home Super Saver scheme lets first home buyers withdraw up to $50,000 of voluntary contributions plus earnings for a deposit. What it adds, why employer super can't be used, early release, SMSFs and paying off a mortgage.",
  slug: "use-super-to-buy-a-house",
  publishedAt: "2026-10-07",
  updatedAt: "2026-10-07",
  readingTimeMinutes: 7,
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
const MATCH_HREF = "/find-an-expert?intent=buying&from=super-to-buy-guide#match";

// From the FHSS calculator's engine (src/lib/fhss-calc.ts): three years of
// salary sacrifice on the calculator's example salary, at three amounts.
const EX = defaultFhssInput();
const LEVELS = [5_000, 10_000, FHSS_ANNUAL_LIMIT].map((perYear) => ({ perYear, r: computeFhss({ ...EX, perYear }) }));
const MAX = computeFhss({ ...EX, perYear: FHSS_ANNUAL_LIMIT, years: 4 });

const TLDR = [
  "Mostly no. Super is locked until you can access it, usually when you retire after 60, and the super your employer pays can't go towards a home.",
  `The exception is the First Home Super Saver (FHSS) scheme. First home buyers can withdraw up to ${fmt(FHSS_TOTAL_LIMIT)} of their own voluntary contributions, plus deemed earnings, for a deposit. A couple can each do it.`,
  "It only covers extra contributions you make, so it doesn't eat into your retirement savings. Salary sacrificed contributions save tax on the way in, which is what makes it worth doing.",
  "Early release for severe financial hardship or on compassionate grounds doesn't cover buying a home. Compassionate release can cover mortgage payments to stop the home you have being sold.",
  "A self-managed super fund can buy residential property only as an investment. You, your family and other related parties can't live in it or rent it.",
];

const TOC: GuideTOCEntry[] = [
  { id: "short-answer",   label: "The short answer" },
  { id: "fhss",           label: "The exception: the First Home Super Saver scheme" },
  { id: "how-much",       label: "How much FHSS can add to a deposit" },
  { id: "employer-super", label: "Why you can't use your employer's super" },
  { id: "early-release",  label: "Early release: hardship and compassionate grounds" },
  { id: "smsf",           label: "Buying a home through an SMSF" },
  { id: "after-60",       label: "Once you can access your super" },
  { id: "other-help",     label: "Other help with a deposit" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can I use my super to buy a house?",
    answer:
      `Only through the First Home Super Saver scheme, and only if you've never owned property in Australia. It lets you withdraw up to ${fmt(FHSS_TOTAL_LIMIT)} of extra voluntary contributions you've made since 1 July 2017, plus deemed earnings, for a deposit. ` +
      "The rest of your super, including everything your employer has paid, stays locked until you can access it, usually when you retire after 60.",
  },
  {
    question: "Can I withdraw my super for a first home deposit?",
    answer:
      `Yes, the voluntary part, through FHSS. Up to ${fmt(FHSS_ANNUAL_LIMIT)} a year and ${fmt(FHSS_TOTAL_LIMIT)} in total counts. You get back ${FHSS_CONCESSIONAL_RELEASE_PCT}% of before-tax contributions and all of after-tax ones, plus earnings at the ATO's rate (${CURRENT_SIC.rate}% for ${CURRENT_SIC.quarter}). You request it through myGov and it takes 15 to 20 business days to arrive.`,
  },
  {
    question: "Can I use my super to buy a house if I'm not a first home buyer?",
    answer:
      "No. FHSS is only for people who have never owned property in Australia, including investment property and vacant land. The exception is someone who lost all their property through financial hardship, such as bankruptcy or a relationship breakdown, who can apply to the ATO for a hardship determination.",
  },
  {
    question: "Can I use my super to pay off my mortgage?",
    answer:
      "Not before you can access your super. The one exception is compassionate release, which the ATO can approve for mortgage payments to stop your home being sold, if you have no other way to pay. Once you've retired after 60, or meet another condition of release, you can use your super as you like, including on the mortgage.",
  },
  {
    question: "Can I buy a house with my SMSF and live in it?",
    answer:
      "No. A self-managed super fund's property must be held solely to provide retirement benefits. It can't be bought from you or a relative, and it can't be lived in or rented by a fund member or a related party, even at market rent.",
  },
  {
    question: "Is it smart to use your super to buy a house?",
    answer:
      `FHSS is usually worth it if you salary sacrifice and your tax rate is 30% or more. On a ${fmt(EX.salary)} salary, ${fmt(EX.perYear)} a year for ${EX.years} years leaves ${fmt(LEVELS[1].r.inHand)} for a deposit, against ${fmt(LEVELS[1].r.bank.total)} saved in a bank at ${EXAMPLE_BANK_RATE}%. ` +
      `Because it only covers extra contributions, it doesn't reduce the super you already have. The risk is that the money is locked up until you request it, and if you don't buy you must put it back into super or pay ${FHSS_TAX_PCT}% tax.`,
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Super Saver Scheme", href: "/guides/first-home-super-saver-scheme", description: "The full rules, the tax, the timing and how to apply." },
  { title: "FHSS Calculator", href: "/fhss-calculator", description: "What FHSS would add to your deposit on your own salary." },
  { title: "How Much Deposit to Buy a House", href: "/guides/how-much-deposit-to-buy-a-house", description: "5%, 10%, 20%, and the schemes that lower the bar." },
  { title: "5% Deposit Scheme", href: "/guides/first-home-guarantee", description: "Buy with a 5% deposit and no LMI." },
  { title: "Help to Buy Scheme", href: "/guides/help-to-buy-scheme-australia", description: "The government puts in up to 40% of the price." },
  { title: "First Home Buyer Guide", href: "/guides/first-home-buyer-guide", description: "Federal schemes, grants and duty concessions by state." },
];

export default function UseSuperToBuyAHousePage() {
  return (
    <GuideArticleLayout frontmatter={FRONTMATTER} tldr={TLDR} toc={TOC} faqs={FAQS} related={RELATED}>
      <h2 id="short-answer">The short answer</h2>
      <p className="lead">
        Generally, no. Super is preserved for retirement, so you can&rsquo;t take it out to buy a home. The
        exception is the First Home Super Saver scheme, which lets first home buyers withdraw extra
        contributions they&rsquo;ve put in themselves, up to {fmt(FHSS_TOTAL_LIMIT)} each.
      </p>
      <ScrollTable label="Using super for a home: what you can and can't do">
        <table>
          <thead>
            <tr><th>What you want to do</th><th>Can you?</th></tr>
          </thead>
          <tbody>
            <tr><td>Withdraw extra contributions for a first home deposit</td><td>Yes, through FHSS, up to {fmt(FHSS_TOTAL_LIMIT)} plus earnings</td></tr>
            <tr><td>Withdraw your employer&rsquo;s super guarantee for a deposit</td><td>No</td></tr>
            <tr><td>Use super for a home if you&rsquo;ve owned property before</td><td>No, except after financial hardship</td></tr>
            <tr><td>Use super for mortgage payments to stop your home being sold</td><td>Possibly, on compassionate grounds</td></tr>
            <tr><td>Buy a home to live in through your SMSF</td><td>No</td></tr>
            <tr><td>Pay off a mortgage once retired after 60</td><td>Yes</td></tr>
          </tbody>
        </table>
      </ScrollTable>

      <h2 id="fhss">The exception: the First Home Super Saver scheme</h2>
      <p>
        FHSS lets you make voluntary contributions into your super and later withdraw them, plus deemed
        earnings, to put towards your first home. It only applies to the extra money you choose to put in,
        so the super you already have isn&rsquo;t touched.
      </p>
      <ul>
        <li><strong>Limits:</strong> {fmt(FHSS_ANNUAL_LIMIT)} of contributions counts each financial year, and {fmt(FHSS_TOTAL_LIMIT)} in total, per person.</li>
        <li><strong>What comes back:</strong> {FHSS_CONCESSIONAL_RELEASE_PCT}% of before-tax contributions (salary sacrifice or deductible), 100% of after-tax ones, plus earnings at the ATO&rsquo;s shortfall interest charge rate, {CURRENT_SIC.rate}% for {CURRENT_SIC.quarter}.</li>
        <li><strong>Why bother:</strong> salary sacrifice is taxed at 15% in your fund instead of your marginal rate, and the release is taxed at your marginal rate less a 30% offset.</li>
        <li><strong>Who:</strong> 18 or over, never owned property in Australia, and you must live in the home for {FHSS_LIVE_IN_MONTHS} of the first 12 months.</li>
      </ul>
      <p>
        The <Link href="/guides/first-home-super-saver-scheme">First Home Super Saver scheme guide</Link> has the
        full rules, including the timing rules that changed in September 2024.
      </p>

      <h2 id="how-much">How much FHSS can add to a deposit</h2>
      <p>
        Salary sacrificing for {EX.years} years on a {fmt(EX.salary)} salary, with earnings at {EX.sicRatePct}%,
        against saving the same pay in an account at {EXAMPLE_BANK_RATE}%:
      </p>
      <ScrollTable label={`FHSS over ${EX.years} years on a ${fmt(EX.salary)} salary`}>
        <table>
          <thead>
            <tr><th>Salary sacrifice a year</th><th>FHSS deposit</th><th>Savings account</th><th>Difference</th></tr>
          </thead>
          <tbody>
            {LEVELS.map(({ perYear, r }) => (
              <tr key={perYear}>
                <td>{fmt(perYear)}</td>
                <td>{fmt(r.inHand)}</td>
                <td>{fmt(r.bank.total)}</td>
                <td>{fmt(r.advantage)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
      <p>
        At {fmt(FHSS_ANNUAL_LIMIT)} a year, the {fmt(FHSS_TOTAL_LIMIT)} total is reached in the fourth year; four
        years gives {fmt(MAX.inHand)} after tax. A couple can each do the same. Try your own figures in the{" "}
        <Link href="/fhss-calculator">FHSS calculator</Link>.
      </p>

      <KeyFigure
        value={fmt(FHSS_TOTAL_LIMIT * 2)}
        label={`Of contributions a couple can count towards FHSS for the same home, ${fmt(FHSS_TOTAL_LIMIT)} each.`}
        context="Plus deemed earnings, less tax on release"
      />

      <h2 id="employer-super">Why you can&rsquo;t use your employer&rsquo;s super</h2>
      <p>
        The super guarantee your employer pays, and contributions required by an award, are preserved until
        you meet a condition of release, usually retiring after 60. FHSS counts only voluntary contributions:
        salary sacrifice you arrange, and personal contributions. Contributions your spouse or parents make
        for you don&rsquo;t count either.
      </p>

      <h2 id="early-release">Early release: hardship and compassionate grounds</h2>
      <p>
        You can sometimes get super out early, but not to buy a home:
      </p>
      <ul>
        <li>
          <strong>Severe financial hardship:</strong> before 60, up to $10,000 once every 12 months, if
          you&rsquo;ve been on eligible income support for at least 26 weeks and can&rsquo;t pay urgent living
          costs.
        </li>
        <li>
          <strong>Compassionate grounds:</strong> for specific costs with no other way to pay, including medical
          treatment, disability modifications to your home, and mortgage payments to stop your home being sold.
          You apply to the ATO with evidence.
        </li>
      </ul>
      <p>
        Neither covers a deposit. If you&rsquo;re behind on a mortgage, talk to your lender about hardship
        arrangements before your super.
      </p>

      <h2 id="smsf">Buying a home through an SMSF</h2>
      <p>
        A self-managed super fund can buy residential property, but only as an investment for retirement. The
        property must meet the sole purpose test, can&rsquo;t be bought from a member or a related party, and
        can&rsquo;t be lived in or rented by a fund member or a related party. So an SMSF can&rsquo;t buy the
        home you live in, or one for your family.
      </p>

      <h2 id="after-60">Once you can access your super</h2>
      <p>
        If you&rsquo;re 60 or over and no longer working, you can usually access your super at any time and
        spend it how you like, including on a home or your mortgage. Whether that&rsquo;s wise depends on what
        you need to live on in retirement, so it&rsquo;s worth personal financial advice.
      </p>

      <h2 id="other-help">Other help with a deposit</h2>
      <p>FHSS can be combined with the other first home buyer schemes:</p>
      <ul>
        <li>the <Link href="/guides/first-home-guarantee">5% Deposit Scheme</Link>, to buy with a 5% deposit and no LMI</li>
        <li><Link href="/guides/help-to-buy-scheme-australia">Help to Buy</Link>, where the government puts in up to 40% of the price</li>
        <li>your state&rsquo;s <Link href="/guides/first-home-owner-grant-australia">first home owner grant</Link> and stamp duty concessions</li>
      </ul>
      <p>
        Our guide to <Link href="/guides/how-much-deposit-to-buy-a-house">how much deposit you need</Link> shows
        what each level unlocks.
      </p>

      <MatchCTA
        lead="Putting a deposit together from super, savings and the schemes? Tell us where you're buying: one specialist receives your details and pays us a fee for the introduction; you pay us nothing. No commitment."
        ctaLabel="Find your specialist"
        href={MATCH_HREF}
      />

      <p className="text-sm text-ink-muted">Rules checked {checkedOn}.</p>
      <Sources items={SOURCES} />
    </GuideArticleLayout>
  );
}

const SOURCES: readonly SourceItem[] = [
  { label: FHSS_SOURCES.about.label, href: FHSS_SOURCES.about.href, note: "What FHSS is and who can use it" },
  { label: FHSS_SOURCES.contributions.label, href: FHSS_SOURCES.contributions.href, note: "Which contributions count; super guarantee doesn't" },
  { label: FHSS_SOURCES.releaseAmounts.label, href: FHSS_SOURCES.releaseAmounts.href, note: "The limits and the 85% rule" },
  { label: FHSS_SOURCES.eligibility.label, href: FHSS_SOURCES.eligibility.href, note: "Never owned property, and the hardship exception" },
  { label: FHSS_SOURCES.sic.label, href: FHSS_SOURCES.sic.href, note: "The deemed earnings rate" },
  { label: FHSS_SOURCES.earlyAccess.label, href: FHSS_SOURCES.earlyAccess.href, note: "Severe financial hardship, compassionate grounds, access from 60" },
  { label: FHSS_SOURCES.smsfProperty.label, href: FHSS_SOURCES.smsfProperty.href, note: "Sole purpose test; no living in or renting to members or related parties" },
  { label: FHSS_SOURCES.factSheet.label, href: FHSS_SOURCES.factSheet.href, note: "Combining FHSS with other schemes" },
];
