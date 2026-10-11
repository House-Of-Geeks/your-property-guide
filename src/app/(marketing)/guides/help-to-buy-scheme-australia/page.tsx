import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  PullQuote,
  EditorNote,
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
import { STATE_NAMES } from "@/lib/data/commission-rates";
import { AUSTRALIAN_STATES } from "@/lib/utils/stamp-duty";
import {
  HTB_CHECKED_ON,
  HTB_COMBINED_MIN_PCT,
  HTB_DATES,
  HTB_INCOME_LIMITS,
  HTB_INCOME_LIMITS_PREVIOUS,
  HTB_LENDERS,
  HTB_MIN_DEPOSIT_PCT,
  HTB_MIN_REPAYMENT_PCT,
  HTB_PLACES,
  HTB_PRICE_CAPS,
  HTB_RENOVATION_NOTICE,
  HTB_SHARE,
  HTB_SOURCES,
  HTB_UPTAKE,
  HTB_YEAR,
  STATE_CAPITALS,
} from "@/lib/data/help-to-buy";
import { EXAMPLE_LOAN_RATE, computeHelpToBuy, defaultHtbInput } from "@/lib/help-to-buy-calc";

const FRONTMATTER: GuideFrontmatter = {
  title: "Help to Buy Scheme Australia: How the Shared Equity Scheme Works (2026)",
  description:
    "The federal Help to Buy scheme for 2026–27: income limits ($103,000 single, $165,000 joint), price caps by state, the 2% deposit, the government's 30% or 40% share, participating lenders, what happens when you sell, and how it compares with the 5% Deposit Scheme.",
  slug: "help-to-buy-scheme-australia",
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
const checkedOn = new Date(HTB_CHECKED_ON).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
/** Leads from this guide go to the buyer match, tagged with where they started. */
const MATCH_HREF = "/find-an-expert?intent=buying&from=help-to-buy#match";

// The worked example is the calculator's opening state, computed by the same
// engine (src/lib/help-to-buy-calc.ts, pinned by tests/lib/help-to-buy-calc.test.ts).
const EX = defaultHtbInput();
const EXR = computeHelpToBuy(EX);
const SALE_PRICE = 800_000;
const GOV_AT_SALE = Math.round((SALE_PRICE * EXR.sharePct) / 100);
const LENDER_NAMES = HTB_LENDERS.map((l) => l.name);
const lenderList = `${LENDER_NAMES.slice(0, -1).join(", ")} and ${LENDER_NAMES[LENDER_NAMES.length - 1]}`;

const TLDR = [
  `Help to Buy is the federal shared equity scheme. The government contributes up to ${HTB_SHARE.new.max}% of the price of a new home or up to ${HTB_SHARE.existing.max}% of an existing one, so you take out a smaller loan.`,
  `You can buy with a ${HTB_MIN_DEPOSIT_PCT}% deposit, and because your deposit and the government's share reach at least ${HTB_COMBINED_MIN_PCT}%, there's no Lenders Mortgage Insurance.`,
  `For ${HTB_YEAR} your taxable income must be ${fmt(HTB_INCOME_LIMITS.single)} or less as a single, or ${fmt(HTB_INCOME_LIMITS.joint)} for a couple or single parent, and the home must be under your area's price cap (from ${fmt(HTB_PRICE_CAPS.NT.capital)} in the NT to ${fmt(HTB_PRICE_CAPS.NSW.capital)} in Sydney).`,
  "You don't pay rent or interest on the government's share. You can buy it back in steps of at least 5% of the home's value at the time.",
  "When you sell, the government takes its percentage of the sale price or a valuation, whichever is higher, so it shares the growth.",
  `It runs through ${HTB_LENDERS.length} participating lenders, has been open in every state since ${HTB_DATES.tasFrom}, and can't be combined with the 5% Deposit Scheme.`,
];

const TOC: GuideTOCEntry[] = [
  { id: "what-it-is",      label: "What Help to Buy is" },
  { id: "how-it-works",    label: "How shared equity works" },
  { id: "worked-example",  label: "What a 30% government share means" },
  { id: "eligibility",     label: "Eligibility and income limits" },
  { id: "price-caps",      label: "Price caps by state" },
  { id: "rent-question",   label: "Do you pay rent on the government's share?" },
  { id: "buying-out",      label: "Buying out the government's stake" },
  { id: "when-you-sell",   label: "What happens when you sell" },
  { id: "living-with-it",  label: "Living with Help to Buy" },
  { id: "how-to-apply",    label: "How to apply, lenders and places" },
  { id: "combining",       label: "Combining it with other schemes" },
  { id: "vs-guarantee",    label: "Help to Buy vs the 5% Deposit Scheme" },
  { id: "downsides",       label: "The downsides" },
  { id: "states",          label: "Help to Buy in your state" },
  { id: "next-steps",      label: "What to do next" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the Help to Buy scheme?",
    answer:
      `Help to Buy is the Australian Government's shared equity scheme, run by Housing Australia through participating lenders. The government contributes up to ${HTB_SHARE.new.max}% of the price of a new home or up to ${HTB_SHARE.existing.max}% of an existing one, so you need a smaller loan. ` +
      `You can buy with a ${HTB_MIN_DEPOSIT_PCT}% deposit and pay no Lenders Mortgage Insurance. Applications opened on ${HTB_DATES.launched}.`,
  },
  {
    question: "Who is eligible for Help to Buy?",
    answer:
      `Australian citizens aged 18 or over whose taxable income for ${HTB_YEAR} is ${fmt(HTB_INCOME_LIMITS.single)} or less as a single, or ${fmt(HTB_INCOME_LIMITS.joint)} or less for a couple or single parent. ` +
      "You can't own any property in Australia or overseas when you apply, though owning one before is fine. You must live in the home, buy under your area's price cap, and the lender must be satisfied you couldn't buy without the scheme. Permanent residents are not eligible.",
  },
  {
    question: "Do you have to pay rent on the government's share?",
    answer:
      "No. Under Help to Buy you do not pay rent or interest to the government on its share. You repay only your own home loan. " +
      "The government's return comes when you sell or buy back its share, because it receives its percentage of the home's value at that point rather than charging you along the way.",
  },
  {
    question: "Can you buy out the government's stake?",
    answer:
      `Yes. You can buy back the government's share in steps of at least ${HTB_MIN_REPAYMENT_PCT}% of the home's current value, or all of it at once. ` +
      "Each repayment is priced on a valuation at the time, which you pay for, so if the home has risen in value, buying back the share costs more than the government put in.",
  },
  {
    question: "Help to Buy vs First Home Guarantee, which is better?",
    answer:
      `They solve different problems, and you can't use both. Help to Buy cuts your loan: on a ${fmt(EX.price)} home, repayments of about ${fmt(EXR.monthlyRepayment)} a month against ${fmt(EXR.fivePercent.monthlyRepayment)} under the 5% Deposit Scheme (the expanded First Home Guarantee), at ${EXAMPLE_LOAN_RATE}%. ` +
      "In return the government shares the growth. The 5% Deposit Scheme has no income test and lets you keep all the growth, but you borrow almost the whole price. Help to Buy suits buyers who can't service the bigger loan.",
  },
  {
    question: "Is Help to Buy available in every state?",
    answer:
      `Yes. It opened on ${HTB_DATES.launched} in NSW, Victoria, Queensland, South Australia, the ACT and the NT, in Western Australia on ${HTB_DATES.waFrom}, and in Tasmania on ${HTB_DATES.tasFrom}. ` +
      "Places are shared between the states by population, and each state has its own price caps.",
  },
  {
    question: "What does it mean if the government owns 30% of your house?",
    answer:
      `The government has contributed 30% of the price and is repaid 30% of the home's value when you sell or buy it back. On a ${fmt(EX.price)} home that's ${fmt(EXR.governmentContribution)} up front. ` +
      `If you later sell for ${fmt(SALE_PRICE)}, it receives ${fmt(GOV_AT_SALE)}. You pay no rent or interest on its share in the meantime, and the home is in your name.`,
  },
  {
    question: "What are the downsides of the Help to Buy scheme?",
    answer:
      "You share the growth on the government's slice, and buying it back costs today's value, not what it put in. You can't rent the home out, you must tell Housing Australia about renovations of $21,000 or more, " +
      "you can't combine it with the 5% Deposit Scheme, and only a few lenders offer it. If your income stays over the limit for two years, you may be asked to start buying the share back.",
  },
  {
    question: "Which banks are doing the Help to Buy scheme?",
    answer:
      `${lenderList}, as of ${checkedOn}. You apply through one of them or a broker that works with them; you can't apply to Housing Australia directly.`,
  },
  {
    question: "What is the price cap for Help to Buy?",
    answer:
      `It depends on where you buy. In capital cities and named regional centres: NSW ${fmt(HTB_PRICE_CAPS.NSW.capital)}, Queensland and the ACT ${fmt(HTB_PRICE_CAPS.QLD.capital)}, Victoria ${fmt(HTB_PRICE_CAPS.VIC.capital)}, SA ${fmt(HTB_PRICE_CAPS.SA.capital)}, WA ${fmt(HTB_PRICE_CAPS.WA.capital)}, Tasmania ${fmt(HTB_PRICE_CAPS.TAS.capital)} and the NT ${fmt(HTB_PRICE_CAPS.NT.capital)}. ` +
      "The rest of each state has a lower cap; the table on this page has them all.",
  },
  {
    question: "Can I use Help to Buy and the 5% Deposit Scheme together?",
    answer:
      "No. Help to Buy can't be combined with the Home Guarantee Scheme, which includes the 5% Deposit Scheme, or with a state shared equity scheme. " +
      "It can be combined with a first home owner grant, stamp duty concessions and the First Home Super Saver Scheme.",
  },
  {
    question: "Can permanent residents use Help to Buy?",
    answer:
      "No. Every applicant must be an Australian citizen. Housing Australia's guidance is to get your citizenship certificate before you apply.",
  },
  {
    question: "What happens if my income goes over the limit?",
    answer:
      "Nothing straight away. Housing Australia reviews income at least every five years, and only being over the limit for two years in a row triggers a check. " +
      `If the lender finds you can afford it, you must buy back at least ${HTB_MIN_REPAYMENT_PCT}% of the home's value within 90 days; if not, it's reassessed after 12 months. You're never required to repay if it would push you into Lenders Mortgage Insurance.`,
  },
  {
    question: "Can I rent out a Help to Buy home?",
    answer:
      "Generally no. The home must be your principal residence, and renting it out or using it for a business isn't allowed. " +
      "The exceptions are Defence Force postings, an employer relocation after 12 months in the job, and serious illness or compassionate grounds, each with Housing Australia's approval.",
  },
  {
    question: "When did Help to Buy start, and are there places left?",
    answer:
      `Applications opened on ${HTB_DATES.launched}. There are ${HTB_PLACES.perYear.toLocaleString("en-AU")} places a year, with unused places carried over, up to ${HTB_PLACES.totalCap.toLocaleString("en-AU")} in total, and ${HTB_PLACES.perYear.toLocaleString("en-AU")} new places were released on 1 July 2026. ` +
      "Housing Australia doesn't publish how many are left; your lender tells you if a place is available when it submits your application.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Help to Buy Calculator",            href: "/help-to-buy-calculator",                description: "Check your income and price against the limits and see your repayments." },
  { title: "Shared Equity Schemes in Australia", href: "/guides/shared-equity-schemes-australia", description: "Help to Buy and each state's scheme, and which are still open." },
  { title: "5% Deposit Scheme (First Home Guarantee)", href: "/guides/first-home-guarantee",     description: "Buy with a 5% deposit and no LMI while keeping 100% ownership." },
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide",        description: "Federal schemes, grants by state, stamp duty concessions and the buying process." },
  { title: "How Much Deposit to Buy a House",   href: "/guides/how-much-deposit-to-buy-a-house", description: "What you really need to save, and the schemes that lower the bar." },
  { title: "First Home Super Saver Scheme",     href: "/guides/first-home-super-saver-scheme",  description: "Build the deposit in super; it combines with Help to Buy." },
  { title: "Borrowing Power Calculator",        href: "/borrowing-power-calculator",            description: "See how a smaller loan under shared equity changes what you can afford." },
];

const STATE_PAGES: { slug: string; label: string }[] = [
  { slug: "help-to-buy-scheme-qld", label: "Queensland" },
  { slug: "help-to-buy-scheme-nsw", label: "New South Wales" },
  { slug: "help-to-buy-scheme-victoria", label: "Victoria" },
  { slug: "help-to-buy-scheme-wa", label: "Western Australia" },
];

const HELP_TO_BUY_SOURCES: readonly SourceItem[] = [
  { label: HTB_SOURCES.scheme.label, href: HTB_SOURCES.scheme.href, note: `read ${checkedOn}` },
  { label: HTB_SOURCES.thresholds.label, href: HTB_SOURCES.thresholds.href, note: "income limits from 1 July 2026" },
  { label: HTB_SOURCES.factSheet.label, href: HTB_SOURCES.factSheet.href },
  { label: HTB_SOURCES.customerGuide.label, href: HTB_SOURCES.customerGuide.href, note: "repayments, sale, renovations, refinancing, death and separation" },
  { label: HTB_SOURCES.faq.label, href: HTB_SOURCES.faq.href },
  { label: HTB_SOURCES.priceCaps.label, href: HTB_SOURCES.priceCaps.href },
  { label: HTB_SOURCES.lenders.label, href: HTB_SOURCES.lenders.href, note: `read ${checkedOn}` },
  { label: HTB_SOURCES.directions.label, href: HTB_SOURCES.directions.href, note: "the scheme's legal rules: shares, caps, eligibility, places" },
  { label: HTB_SOURCES.launch.label, href: HTB_SOURCES.launch.href },
  { label: HTB_SOURCES.tas.label, href: HTB_SOURCES.tas.href },
  { label: HTB_SOURCES.july2026.label, href: HTB_SOURCES.july2026.href, note: "new places, income limits and uptake" },
  `Worked example: ${EXAMPLE_LOAN_RATE}% over 30 years is an example rate, not a quote.`,
];

export default function HelpToBuySchemeAustraliaPage() {
  return (
    <GuideArticleLayout frontmatter={FRONTMATTER} tldr={TLDR} toc={TOC} faqs={FAQS} related={RELATED}>
      <Callout variant="info" title={`Help to Buy at a glance, ${HTB_YEAR}`}>
        <ScrollTable label="Help to Buy key figures">
          <table>
            <tbody>
              <tr><td><strong>Government share</strong></td><td>Up to {HTB_SHARE.existing.max}% of an existing home, up to {HTB_SHARE.new.max}% of a new home (at least {HTB_SHARE.existing.min}%)</td></tr>
              <tr><td><strong>Your deposit</strong></td><td>At least {HTB_MIN_DEPOSIT_PCT}%; no Lenders Mortgage Insurance</td></tr>
              <tr><td><strong>Income limits</strong></td><td>{fmt(HTB_INCOME_LIMITS.single)} single; {fmt(HTB_INCOME_LIMITS.joint)} joint or single parent (taxable income)</td></tr>
              <tr><td><strong>Who</strong></td><td>Australian citizens 18 or over who don&rsquo;t own property now and will live in the home</td></tr>
              <tr><td><strong>Rent or interest on the government&rsquo;s share</strong></td><td>None</td></tr>
              <tr><td><strong>Lenders</strong></td><td>{lenderList}</td></tr>
              <tr><td><strong>Places</strong></td><td>{HTB_PLACES.perYear.toLocaleString("en-AU")} a year, up to {HTB_PLACES.totalCap.toLocaleString("en-AU")} in total</td></tr>
            </tbody>
          </table>
        </ScrollTable>
        <p>
          From Housing Australia and the Help to Buy Program Directions, checked {checkedOn}. Income limits change every 1
          July. Check your own figures in the <Link href="/help-to-buy-calculator">Help to Buy calculator</Link>.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The part most buyers miss with Help to Buy is that the government
          isn&rsquo;t lending you money in the usual way, it&rsquo;s putting in
          part of the price alongside you and taking a share of the value back
          later. That keeps your loan and your repayments down, which is the whole
          point if servicing is your problem. The trade is that you share the
          future growth on the government&rsquo;s slice. Whether that&rsquo;s a
          good deal depends entirely on your numbers.
        </p>
      </EditorNote>

      <h2 id="what-it-is">What Help to Buy is</h2>
      <p className="lead">
        Help to Buy is the federal shared equity scheme, legislated in 2024 and
        run by Housing Australia through participating lenders. The Australian
        Government contributes part of the price of the home you buy, which means
        you borrow less and need a much smaller deposit. It is one of several first
        home buyer schemes covered in our{" "}
        <Link href="/guides/first-home-buyer-guide">national First Home Buyer Guide</Link>.
      </p>
      <p>
        The headline figures: the government can contribute up to{" "}
        <strong>{HTB_SHARE.new.max}% of the price of a new home</strong> or up to{" "}
        <strong>{HTB_SHARE.existing.max}% of the price of an existing home</strong>. You provide a
        deposit of as little as <strong>{HTB_MIN_DEPOSIT_PCT}%</strong>, and because your deposit and
        the government&rsquo;s share together reach at least {HTB_COMBINED_MIN_PCT}%, you don&rsquo;t pay
        Lenders Mortgage Insurance. Applications opened on {HTB_DATES.launched}, and by{" "}
        {HTB_UPTAKE.asAt} more than {HTB_UPTAKE.applications.toLocaleString("en-AU")} people had applied
        and {HTB_UPTAKE.foundOrSettled.toLocaleString("en-AU")} had found a home or settled.
      </p>

      <KeyFigure
        value={`up to ${HTB_SHARE.new.max}%`}
        label={`The share the government can put into a new home (up to ${HTB_SHARE.existing.max}% of an existing home), so your mortgage is smaller.`}
        context={`You contribute a deposit from ${HTB_MIN_DEPOSIT_PCT}%`}
      />

      <h2 id="how-it-works">How shared equity works</h2>
      <p>
        Shared equity means the government funds part of the purchase and is
        repaid a matching share of the home&rsquo;s value later. On an existing
        home with a {HTB_SHARE.existing.max}% government share, your loan only
        needs to cover {100 - HTB_SHARE.existing.max - HTB_MIN_DEPOSIT_PCT}% of the price (the rest after
        your {HTB_MIN_DEPOSIT_PCT}% deposit), instead of the whole price less your deposit. A smaller loan
        means smaller repayments, which is what makes an otherwise unaffordable
        home reachable.
      </p>
      <ul>
        <li>
          <strong>The home is yours.</strong> It&rsquo;s in your name and you
          live in it as your own. The government&rsquo;s contribution is secured
          by a second mortgage.
        </li>
        <li>
          <strong>Your loan is smaller.</strong> Because the government funds
          part of the purchase, you borrow less and your monthly repayments are
          lower than a standard purchase at the same price.
        </li>
        <li>
          <strong>No LMI.</strong> The small deposit doesn&rsquo;t trigger
          Lenders Mortgage Insurance, the way it normally would below a 20%
          deposit.
        </li>
      </ul>

      <h2 id="worked-example">What a 30% government share means</h2>
      <p>
        A single buyer on {fmt(EX.income)} buys a {fmt(EX.price)} existing home in{" "}
        {STATE_CAPITALS[EX.state]} with a {HTB_MIN_DEPOSIT_PCT}% deposit and the government&rsquo;s full{" "}
        {EXR.sharePct}%. Here it is next to the same home under the 5% Deposit Scheme:
      </p>
      <ScrollTable label="Worked example: a $700,000 existing home">
        <table>
          <thead>
            <tr><th></th><th>Help to Buy</th><th>5% Deposit Scheme</th></tr>
          </thead>
          <tbody>
            <tr><td>Your deposit</td><td>{fmt(EX.deposit)} ({EXR.depositPct}%)</td><td>{fmt(EXR.fivePercent.deposit)} (5%)</td></tr>
            <tr><td>Government share</td><td>{fmt(EXR.governmentContribution)} ({EXR.sharePct}%)</td><td>None, a guarantee only</td></tr>
            <tr><td>Your home loan</td><td>{fmt(EXR.loan)}</td><td>{fmt(EXR.fivePercent.loan)}</td></tr>
            <tr><td>Monthly repayment, 30 years at {EXAMPLE_LOAN_RATE}%</td><td>{fmt(EXR.monthlyRepayment)}</td><td>{fmt(EXR.fivePercent.monthlyRepayment)}</td></tr>
            <tr><td>Sell later for {fmt(SALE_PRICE)}: paid to the government</td><td>{fmt(GOV_AT_SALE)}</td><td>$0</td></tr>
          </tbody>
        </table>
      </ScrollTable>
      <p>
        Help to Buy saves {fmt(EXR.fivePercent.monthlyRepayment - EXR.monthlyRepayment)} a month in
        repayments here. In exchange, the government&rsquo;s {EXR.sharePct}% follows the home&rsquo;s value:
        it put in {fmt(EXR.governmentContribution)} and receives {fmt(GOV_AT_SALE)} on an {fmt(SALE_PRICE)} sale.
        Try your own figures in the <Link href="/help-to-buy-calculator">Help to Buy calculator</Link>.
      </p>

      <h2 id="eligibility">Eligibility and income limits</h2>
      <p>Help to Buy is for owner-occupiers, not investors. To be eligible you must:</p>
      <ul>
        <li><strong>Be an Australian citizen aged 18 or over.</strong> Permanent residents are not eligible; get your citizenship certificate first.</li>
        <li><strong>Earn under the income limit</strong> for {HTB_YEAR}: {fmt(HTB_INCOME_LIMITS.single)} taxable income as a single, {fmt(HTB_INCOME_LIMITS.joint)} combined for a couple, or {fmt(HTB_INCOME_LIMITS.singleParent)} as a single parent. It&rsquo;s tested on your most recent ATO notice of assessment, with no exceptions for one-off bonuses. The limits were {fmt(HTB_INCOME_LIMITS_PREVIOUS.single)} and {fmt(HTB_INCOME_LIMITS_PREVIOUS.joint)} until {HTB_INCOME_LIMITS_PREVIOUS.to} and are indexed every 1 July.</li>
        <li><strong>Not own property now.</strong> You can&rsquo;t own land or property in Australia or overseas when you apply, but you don&rsquo;t have to be a first home buyer: previous owners can apply. Single parents have limited exceptions.</li>
        <li><strong>Live in the home.</strong> Move in at settlement for an established home, or within 3 months of completion for a new build.</li>
        <li><strong>Need the help.</strong> There&rsquo;s no fixed asset test, but the lender checks your finances, and if you could buy without the scheme, you&rsquo;re not eligible.</li>
        <li><strong>Take one principal and interest loan</strong> from a participating lender, for up to 30 years. At most two people can apply together.</li>
      </ul>

      <h2 id="price-caps">Price caps by state</h2>
      <p>
        The home must cost no more than the cap for its area. The higher cap covers
        each capital city and, in three states, named regional centres. Caps
        haven&rsquo;t changed since the scheme started and aren&rsquo;t indexed.
      </p>
      <ScrollTable label="Help to Buy price caps by state">
        <table>
          <thead>
            <tr><th>State or territory</th><th>Capital city and regional centres</th><th>Rest of state</th></tr>
          </thead>
          <tbody>
            {AUSTRALIAN_STATES.map((s) => (
              <tr key={s}>
                <td>{STATE_NAMES[s].replace(/^the /, "")}</td>
                <td>{fmt(HTB_PRICE_CAPS[s].capital)}</td>
                <td>{HTB_PRICE_CAPS[s].rest === null ? "n/a" : fmt(HTB_PRICE_CAPS[s].rest)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
      <p>
        Regional centres on the higher cap: {HTB_PRICE_CAPS.NSW.regionalCentres.join(", ")} in NSW;{" "}
        {HTB_PRICE_CAPS.VIC.regionalCentres.join(", ")} in Victoria; and{" "}
        {HTB_PRICE_CAPS.QLD.regionalCentres.join(" and ")} in Queensland. Jervis Bay Territory and
        Norfolk Island have a $550,000 cap, and Christmas Island and the Cocos (Keeling) Islands $400,000.
      </p>
      <Callout variant="info" title="The price cap is a hard line">
        <p>
          Going even slightly over the cap disqualifies the purchase. Your
          lender&rsquo;s approval letter states the most you can pay, so plan under it
          and leave room to negotiate.
        </p>
      </Callout>

      <h2 id="rent-question">Do you pay rent on the government&rsquo;s share?</h2>
      <p>
        No. This is the question that worries most people looking at shared
        equity, and the answer is straightforward: you do not pay rent or
        interest to the government on its share. You repay only your own home
        loan, the same as any other owner. The government&rsquo;s return comes
        later, from its share of the home&rsquo;s value when you buy it back or
        sell.
      </p>
      <PullQuote attribution="Andy McMaster, Editor">
        You don&rsquo;t pay the government rent on its share. The cost of the deal
        is the slice of future growth you hand over, not a monthly bill.
      </PullQuote>

      <h2 id="buying-out">Buying out the government&rsquo;s stake</h2>
      <p>
        You are not locked into the arrangement for the life of the loan. As your
        income grows, you can buy back the government&rsquo;s share in stages until
        you own the home outright.
      </p>
      <ul>
        <li>
          <strong>It&rsquo;s priced at current value.</strong> Each repayment is
          based on a valuation at the time, not the original price, and you pay for
          the valuation. If the home has grown in value, buying back the share costs
          more than the government first put in.
        </li>
        <li>
          <strong>It&rsquo;s done in steps of at least {HTB_MIN_REPAYMENT_PCT}%.</strong> Each repayment
          must be at least {HTB_MIN_REPAYMENT_PCT}% of the home&rsquo;s current value, or the whole remaining
          share.
        </li>
        <li>
          <strong>It frees the upside.</strong> Once you own the home outright,
          all future growth is yours.
        </li>
      </ul>

      <h2 id="when-you-sell">What happens when you sell</h2>
      <p>
        You can sell at any time, but you must tell Housing Australia and the sale
        must be at arm&rsquo;s length. The government receives its percentage of
        the sale price or a valuation, whichever is higher. The proceeds repay
        your bank first, then the government&rsquo;s share, and the rest is yours.
      </p>
      <ul>
        <li>
          <strong>Growth is shared in proportion.</strong> If the government holds
          30% and the home has doubled in value, it takes 30% of the higher price,
          not just the dollars it put in.
        </li>
        <li>
          <strong>Losses are shared too.</strong> Its share is a percentage of the
          value, so if the home is worth less, so is its share.
        </li>
      </ul>
      <p>
        This is the genuine trade-off of shared equity: a smaller loan and easier
        entry now, in exchange for a share of the growth later.
      </p>

      <h2 id="living-with-it">Living with Help to Buy</h2>
      <h3>If your income goes up</h3>
      <p>
        Housing Australia reviews your income at least every five years. Only
        being over the limit for two years in a row triggers anything: the lender
        then checks whether you can afford to buy back at least{" "}
        {HTB_MIN_REPAYMENT_PCT}% of the home&rsquo;s value. If you can, you pay within
        90 days; if you can&rsquo;t, it&rsquo;s reassessed after 12 months or more.
        You&rsquo;re never required to repay if it would push you into Lenders
        Mortgage Insurance.
      </p>
      <h3>Renovating</h3>
      <p>
        Tell Housing Australia before work costing {fmt(HTB_RENOVATION_NOTICE)} or more in
        12 months, or any work that needs council approval. The government&rsquo;s
        share is then adjusted so you keep the value you add. If you don&rsquo;t
        tell them, there&rsquo;s no adjustment.
      </p>
      <h3>Renting it out</h3>
      <p>
        Not allowed, and nor is business use. The exceptions, with Housing
        Australia&rsquo;s approval, are Defence Force postings, an employer
        relocation after 12 months in the job (up to 12 months, extendable twice),
        and serious illness or compassionate grounds.
      </p>
      <h3>Refinancing</h3>
      <p>
        You can move to another participating lender, with a part or full buy-back
        if you like. Moving to any other lender means repaying the government&rsquo;s
        share in full. Extra borrowing is allowed only to reduce the
        government&rsquo;s share, for repairs or improvements, or in hardship.
      </p>
      <h3>Separation and death</h3>
      <p>
        A participant can be removed only if the lender confirms the other can
        manage the loan, or under a court order, and at least one original
        participant must stay. If an owner dies, up to two eligible beneficiaries
        can take over; otherwise the government&rsquo;s share is recovered, usually
        within two years. A surviving joint owner carries on and must tell Housing
        Australia within 90 days.
      </p>

      <h2 id="how-to-apply">How to apply, lenders and places</h2>
      <p>You apply through a participating lender, or a broker that works with one. You can&rsquo;t apply to Housing Australia directly.</p>
      <ol>
        <li>The lender assesses you and submits a conditional approval, which reserves a place for 90 days (one 90-day extension is possible).</li>
        <li>You get an approval letter with your maximum purchase price, and a letter of support to show sellers.</li>
        <li>Your contract must allow at least 30 days to settlement; the lender needs everything 29 days before.</li>
        <li>After final approval you must settle within 90 days. Housing Australia&rsquo;s conveyancer arranges the participation agreement and the second mortgage.</li>
      </ol>
      <ScrollTable label="Help to Buy participating lenders">
        <table>
          <thead>
            <tr><th>Lender</th><th>Offering Help to Buy since</th></tr>
          </thead>
          <tbody>
            {HTB_LENDERS.map((l) => (
              <tr key={l.name}>
                <td>
                  <a href={l.href} rel="nofollow noopener" target="_blank">{l.name}</a>
                  {l.note && <span className="block text-sm">{l.note}</span>}
                </td>
                <td>{l.since}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
      <p>
        <strong>Places:</strong> {HTB_PLACES.perYear.toLocaleString("en-AU")} a year, shared between the states
        by population, with unused places carried over and {HTB_PLACES.totalCap.toLocaleString("en-AU")} in
        total. From 1 March each year, uncommitted places can be used in any state. Housing Australia
        doesn&rsquo;t publish how many are left. There are no application fees; you pay the usual costs plus
        the registration of the government&rsquo;s mortgage.
      </p>

      <h2 id="combining">Combining it with other schemes</h2>
      <ul>
        <li><strong>Can&rsquo;t combine:</strong> the 5% Deposit Scheme and the rest of the Home Guarantee Scheme, any other shared equity scheme (including state schemes such as Queensland&rsquo;s Boost to Buy), and state home-ownership loans or guarantees.</li>
        <li><strong>Can combine:</strong> your state&rsquo;s first home owner grant, stamp duty concessions, and the <Link href="/guides/first-home-super-saver-scheme">First Home Super Saver Scheme</Link>.</li>
      </ul>
      <p>
        Our guide to{" "}
        <Link href="/guides/shared-equity-schemes-australia">shared equity schemes in Australia</Link>{" "}
        lists each state&rsquo;s scheme and whether it&rsquo;s still open.
      </p>

      <h2 id="vs-guarantee">Help to Buy vs the 5% Deposit Scheme</h2>
      <p>
        Help to Buy and the{" "}
        <Link href="/guides/first-home-guarantee">5% Deposit Scheme</Link> (the
        expanded First Home Guarantee) both cut the deposit and both avoid LMI, but
        they work very differently, and you can only use one.
      </p>
      <ScrollTable label="Help to Buy compared with the 5% Deposit Scheme">
        <table>
          <thead>
            <tr><th></th><th>Help to Buy</th><th>5% Deposit Scheme</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>What the government does</strong></td><td>Puts in up to {HTB_SHARE.new.max}% (new) or {HTB_SHARE.existing.max}% (existing) of the price</td><td>Guarantees the deposit gap; puts in nothing</td></tr>
            <tr><td><strong>Deposit</strong></td><td>From {HTB_MIN_DEPOSIT_PCT}%</td><td>From 5%</td></tr>
            <tr><td><strong>Loan size</strong></td><td>Smaller</td><td>Full price less your deposit</td></tr>
            <tr><td><strong>Future growth</strong></td><td>Shared until you buy the share back</td><td>All yours</td></tr>
            <tr><td><strong>Income test</strong></td><td>{fmt(HTB_INCOME_LIMITS.single)} single, {fmt(HTB_INCOME_LIMITS.joint)} joint</td><td>None since the late-2025 expansion</td></tr>
            <tr><td><strong>Lenders</strong></td><td>{HTB_LENDERS.length}</td><td>Many more</td></tr>
          </tbody>
        </table>
      </ScrollTable>
      <p>
        In short: Help to Buy suits buyers who need the smaller loan to make
        repayments work and accept sharing the upside. The 5% Deposit Scheme suits
        buyers who can service the bigger loan and want to keep all the growth. The
        worked example above shows the gap in repayments on the same home.
      </p>
      <MatchCTA
        lead="Weighing Help to Buy against the 5% Deposit Scheme? Tell us where you're buying: one specialist receives your details and pays us a fee for the introduction; you pay us nothing."
        ctaLabel="Find your specialist"
        href={MATCH_HREF}
      />

      <h2 id="downsides">The downsides</h2>
      <ul>
        <li><strong>You share the growth</strong> on the government&rsquo;s slice, and buying it back costs today&rsquo;s value, plus a valuation each time.</li>
        <li><strong>You can&rsquo;t rent it out</strong> except in narrow cases, which limits your options if your plans change.</li>
        <li><strong>Renovations need notice</strong> once they reach {fmt(HTB_RENOVATION_NOTICE)} in 12 months, or you lose the value you add.</li>
        <li><strong>Few lenders</strong> offer it ({HTB_LENDERS.length} as of {checkedOn}), so you have less choice of rate and features.</li>
        <li><strong>Higher income later</strong> can mean being asked to buy back part of the share.</li>
        <li><strong>No stacking</strong> with the 5% Deposit Scheme or state shared equity schemes.</li>
      </ul>

      <h2 id="states">Help to Buy in your state</h2>
      <p>
        The scheme&rsquo;s rules are national, but the price caps, first home
        grants, stamp duty concessions and state schemes differ:
      </p>
      <ul>
        {STATE_PAGES.map((s) => (
          <li key={s.slug}>
            <Link href={`/guides/${s.slug}`}>Help to Buy in {s.label}</Link>
          </li>
        ))}
        <li>
          South Australia ({fmt(HTB_PRICE_CAPS.SA.capital)} in Adelaide, {fmt(HTB_PRICE_CAPS.SA.rest ?? 0)} elsewhere),
          Tasmania ({fmt(HTB_PRICE_CAPS.TAS.capital)} in Hobart, {fmt(HTB_PRICE_CAPS.TAS.rest ?? 0)} elsewhere), the
          ACT ({fmt(HTB_PRICE_CAPS.ACT.capital)}) and the NT ({fmt(HTB_PRICE_CAPS.NT.capital)}): see the{" "}
          <Link href="/guides/shared-equity-schemes-australia">shared equity schemes guide</Link> for the state schemes.
        </li>
      </ul>

      <h2 id="next-steps">What to do next</h2>
      <ol>
        <li>
          <strong>Check your figures.</strong> The{" "}
          <Link href="/help-to-buy-calculator">Help to Buy calculator</Link> tests your
          income and price against the limits and shows your repayments.
        </li>
        <li>
          <strong>Work out your borrowing power.</strong> Use the{" "}
          <Link href="/borrowing-power-calculator">borrowing power calculator</Link>{" "}
          to see what the smaller loan lets you afford.
        </li>
        <li>
          <strong>Plan your upfront costs.</strong> Our guide to{" "}
          <Link href="/guides/how-much-deposit-to-buy-a-house">how much deposit you need</Link>{" "}
          covers the {HTB_MIN_DEPOSIT_PCT}% plus stamp duty and the other costs.
        </li>
        <li>
          <strong>Talk to a participating lender or someone who works with them.</strong>{" "}
          <Link href={MATCH_HREF}>Tell us your situation</Link>: one specialist receives your
          details and pays us a fee for the introduction.
        </li>
      </ol>
      <MatchCTA
        lead="Ready to see whether Help to Buy works for you? Tell us where you're buying: one specialist receives your details and pays us a fee for the introduction; you pay us nothing. No commitment."
        ctaLabel="Find your specialist"
        href={MATCH_HREF}
      />

      <Sources items={HELP_TO_BUY_SOURCES} />
    </GuideArticleLayout>
  );
}
