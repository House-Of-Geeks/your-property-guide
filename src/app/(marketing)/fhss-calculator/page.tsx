import type { Metadata } from "next";
import Link from "next/link";
import { FhssCalculator } from "@/components/calculators/FhssCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Callout, type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import {
  CONCESSIONAL_CAP,
  CURRENT_SIC,
  FHSS_ANNUAL_LIMIT,
  FHSS_CHECKED_ON,
  FHSS_CONCESSIONAL_RELEASE_PCT,
  FHSS_DEFAULT_WITHHOLDING_PCT,
  FHSS_SIC_RATES,
  FHSS_SOURCES,
  FHSS_TAX_OFFSET_PCT,
  FHSS_TOTAL_LIMIT,
  SUPER_GUARANTEE_PCT,
} from "@/lib/data/fhss";
import { EXAMPLE_BANK_RATE, computeFhss, defaultFhssInput } from "@/lib/fhss-calc";
import { INCOME_TAX_SOURCE, INCOME_TAX_YEAR, MEDICARE_LEVY_PCT } from "@/lib/utils/income-tax";

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "FHSS calculator",
  h1: "FHSS calculator: what the First Home Super Saver scheme adds to your deposit",
  description:
    "Work out your FHSS release from salary sacrifice or after-tax contributions: what counts, the deemed earnings, the tax when you withdraw, and how it compares with saving the same money in a bank.",
  slug: "fhss-calculator",
  schemaName: "First Home Super Saver Scheme Calculator",
  schemaDescription:
    "Estimate the First Home Super Saver (FHSS) release: eligible contributions within the $15,000 and $50,000 limits, 85% of before-tax contributions, deemed earnings at the shortfall interest charge rate, tax on release at your marginal rate plus Medicare levy less the 30% offset, and a comparison with a savings account.",
  updatedAt: "2026-10-07",
  persona: "first-home",
};

const META_TITLE = "FHSS Calculator 2026: First Home Super Saver Scheme Withdrawal & Tax";
const META_DESCRIPTION =
  `Free First Home Super Saver scheme calculator. See how much you can withdraw, the deemed earnings at the current ${CURRENT_SIC.rate}% rate, the tax on release, and whether FHSS beats saving in the bank on your salary.`;

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` },
  openGraph: { url: `${SITE_URL}/${FRONTMATTER.slug}`, title: META_TITLE, description: META_DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;
const checkedOn = new Date(FHSS_CHECKED_ON).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

// Every figure below comes from the engine the calculator runs
// (tests/lib/fhss-calc.test.ts pins the worked example).
const EX = defaultFhssInput();
const EXR = computeFhss(EX);
const AFTER = computeFhss({ ...EX, type: "after-tax" });

const FAQS: FaqItem[] = [
  {
    question: "How is the FHSS calculated?",
    answer:
      `The ATO counts up to ${fmt(FHSS_ANNUAL_LIMIT)} of your voluntary contributions a year and ${fmt(FHSS_TOTAL_LIMIT)} in total. You can release ${FHSS_CONCESSIONAL_RELEASE_PCT}% of the before-tax ones and all of the after-tax ones, plus deemed earnings at the shortfall interest charge rate (${CURRENT_SIC.rate}% for ${CURRENT_SIC.quarter}). ` +
      `Salary sacrificing ${fmt(EX.perYear)} a year for ${EX.years} years gives a maximum release of ${fmt(EXR.maxRelease)}: ${fmt(EXR.releasableContributions)} of contributions and ${fmt(EXR.earnings)} of earnings.`,
  },
  {
    question: "How much tax do you pay on an FHSS withdrawal?",
    answer:
      `The before-tax contributions you release and all the earnings are taxed at your marginal rate plus the ${MEDICARE_LEVY_PCT}% Medicare levy, less a ${FHSS_TAX_OFFSET_PCT}% offset. On a 30% marginal rate that leaves the ${MEDICARE_LEVY_PCT}% levy: ${fmt(EXR.releaseTax)} on the ${fmt(EXR.assessable)} in the example. ` +
      `The ATO withholds its estimate before paying you (${FHSS_DEFAULT_WITHHOLDING_PCT}% if it can't estimate your rate) and settles the rest in your tax return.`,
  },
  {
    question: "Is FHSS better than saving in a bank account?",
    answer:
      `Usually, if you salary sacrifice and your marginal rate is 30% or more. On a ${fmt(EX.salary)} salary, ${fmt(EX.perYear * EX.years)} of salary sacrifice over ${EX.years} years leaves ${fmt(EXR.inHand)} for the deposit through FHSS against ${fmt(EXR.bank.total)} in a bank at ${EXAMPLE_BANK_RATE}%. ` +
      `With after-tax contributions the gain is only the higher deemed earnings rate: ${fmt(AFTER.advantage)} on the same amounts.`,
  },
  {
    question: "Can I salary sacrifice for FHSS above $15,000 a year?",
    answer:
      `You can, but only ${fmt(FHSS_ANNUAL_LIMIT)} a year counts for FHSS and the rest stays in super. Your employer's ${SUPER_GUARANTEE_PCT}% super guarantee and your salary sacrifice also share the ${fmt(CONCESSIONAL_CAP.amount)} concessional cap for ${CONCESSIONAL_CAP.year}, so check you stay under it.`,
  },
  {
    question: "Why does my fund balance differ from my FHSS amount?",
    answer:
      "FHSS earnings are deemed, not real. The ATO uses the shortfall interest charge rate whatever your fund actually earned, so your release can be more or less than the growth in your account.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Super Saver scheme guide", href: "/guides/first-home-super-saver-scheme", description: "The full rules, the timing since September 2024, and how to apply." },
  { title: "Can I use my super to buy a house?", href: "/guides/use-super-to-buy-a-house", description: "What you can and can't take out of super for a home." },
  { title: "How much deposit do I need?", href: "/guides/how-much-deposit-to-buy-a-house", description: "5%, 10%, 20%, and what each one unlocks." },
  { title: "5% Deposit Scheme", href: "/guides/first-home-guarantee", description: "Buy with a 5% deposit and no LMI. Works alongside FHSS." },
  { title: "Borrowing power calculator", href: "/borrowing-power-calculator", description: "What lenders will let you borrow on your income." },
];

export default function FhssCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<FhssCalculator />}
      faqs={FAQS}
      related={RELATED}
      intent="buying"
      explainer={
        <>
          <h2>How each figure is worked out</h2>
          <ul>
            <li><strong>Counts towards FHSS:</strong> your voluntary contributions, up to {fmt(FHSS_ANNUAL_LIMIT)} each financial year and {fmt(FHSS_TOTAL_LIMIT)} in total, oldest first. Your employer&rsquo;s compulsory super never counts.</li>
            <li><strong>Releasable:</strong> {FHSS_CONCESSIONAL_RELEASE_PCT}% of before-tax contributions (the fund has paid 15% tax on them) and 100% of after-tax ones.</li>
            <li><strong>Deemed earnings:</strong> the shortfall interest charge rate, compounding daily from the first day of the month each contribution was made. The calculator holds the rate you enter; the real rate moves each quarter.</li>
            <li><strong>Tax on release:</strong> the before-tax part and all the earnings are added to your taxable income in the year you request the release, at your marginal rate plus the {MEDICARE_LEVY_PCT}% Medicare levy, less a {FHSS_TAX_OFFSET_PCT}% offset.</li>
            <li><strong>Savings account:</strong> the same pay taken home after income tax and Medicare, saved monthly, with interest taxed at your marginal rate.</li>
          </ul>

          <h2>The deemed earnings rate</h2>
          <p>
            The shortfall interest charge rate is the 90-day bank bill rate plus 3 percentage points, set each quarter.
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr><th>Quarter</th><th>Rate (% a year)</th></tr>
              </thead>
              <tbody>
                {FHSS_SIC_RATES.map((q) => (
                  <tr key={q.quarter}><td>{q.quarter}</td><td>{q.rate}%</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Sources: <a href={FHSS_SOURCES.sic.href} rel="noopener" target="_blank">{FHSS_SOURCES.sic.label}</a>,{" "}
            <a href={FHSS_SOURCES.releaseAmounts.href} rel="noopener" target="_blank">{FHSS_SOURCES.releaseAmounts.label}</a>,{" "}
            <a href={FHSS_SOURCES.receiving.href} rel="noopener" target="_blank">{FHSS_SOURCES.receiving.label}</a> and{" "}
            <a href={INCOME_TAX_SOURCE.url} rel="noopener" target="_blank">{INCOME_TAX_SOURCE.name}</a> ({INCOME_TAX_YEAR}), checked {checkedOn}.
          </p>

          <Callout variant="info" title="What the calculator can't check">
            <p>
              Whether you&rsquo;re eligible (18 or over and never owned property in Australia), unused concessional cap
              you can carry forward, Division 293 tax, study loan repayments and the low income tax offset. Read the{" "}
              <Link href="/guides/first-home-super-saver-scheme">FHSS guide</Link> for the rules, and request an FHSS
              determination in myGov to see your actual amount before you rely on it.
            </p>
          </Callout>
        </>
      }
    />
  );
}
