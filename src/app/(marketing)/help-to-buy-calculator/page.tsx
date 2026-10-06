import type { Metadata } from "next";
import Link from "next/link";
import { HelpToBuyCalculator } from "@/components/calculators/HelpToBuyCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Callout, type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { STATE_NAMES } from "@/lib/data/commission-rates";
import { AUSTRALIAN_STATES } from "@/lib/utils/stamp-duty";
import {
  HTB_CHECKED_ON,
  HTB_INCOME_LIMITS,
  HTB_MIN_DEPOSIT_PCT,
  HTB_PRICE_CAPS,
  HTB_SHARE,
  HTB_SOURCES,
  HTB_YEAR,
  STATE_CAPITALS,
} from "@/lib/data/help-to-buy";
import { EXAMPLE_LOAN_RATE, computeHelpToBuy, defaultHtbInput } from "@/lib/help-to-buy-calc";

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Help to Buy calculator",
  h1: "Help to Buy calculator: are you eligible, and what would you repay?",
  description:
    "Check your income and price against the 2026–27 Help to Buy limits for your state, see the government's share, your loan and repayments, and compare the same home under the 5% Deposit Scheme.",
  slug: "help-to-buy-calculator",
  schemaName: "Help to Buy Calculator",
  schemaDescription:
    "Estimate the Australian Government Help to Buy shared equity scheme: eligibility against income limits and price caps, the government's equity share, the home loan, monthly repayments, and the comparison with the 5% Deposit Scheme.",
  updatedAt: "2026-10-07",
  persona: "first-home",
};

const META_TITLE = "Help to Buy Calculator 2026: Eligibility, Price Caps & Repayments";
const META_DESCRIPTION =
  "Free Help to Buy scheme calculator for Australia. Check the 2026–27 income limits and your state's price cap, see the government's 30% or 40% share, your loan and repayments, and compare with the 5% Deposit Scheme.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` },
  openGraph: { url: `${SITE_URL}/${FRONTMATTER.slug}`, title: META_TITLE, description: META_DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;
const checkedOn = new Date(HTB_CHECKED_ON).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

// Every figure below comes from the engine the calculator runs
// (tests/lib/help-to-buy-calc.test.ts pins the worked example).
const EX = defaultHtbInput();
const EXR = computeHelpToBuy(EX);

const FAQS: FaqItem[] = [
  {
    question: "How do you calculate Help to Buy?",
    answer:
      `Take the price, subtract your deposit (at least ${HTB_MIN_DEPOSIT_PCT}%) and the government's share (up to ${HTB_SHARE.existing.max}% of an existing home or ${HTB_SHARE.new.max}% of a new one), and what's left is your home loan. ` +
      `On a ${fmt(EX.price)} existing home with a ${fmt(EX.deposit)} deposit and a ${EXR.sharePct}% share, the government puts in ${fmt(EXR.governmentContribution)} and you borrow ${fmt(EXR.loan)}: about ${fmt(EXR.monthlyRepayment)} a month over 30 years at ${EXAMPLE_LOAN_RATE}%.`,
  },
  {
    question: "What does it mean if the government owns 30% of your house?",
    answer:
      "The home is in your name, but the government's contribution of 30% of the price is secured by a second mortgage and is repaid as 30% of the home's value, not a fixed amount. You pay no rent or interest on it. " +
      `When you sell, it receives 30% of the sale price or a valuation, whichever is higher, so it shares any growth. You can buy its share back in steps of at least 5% of the home's value at the time.`,
  },
  {
    question: "Am I eligible for Help to Buy?",
    answer:
      `For ${HTB_YEAR}, your taxable income must be ${fmt(HTB_INCOME_LIMITS.single)} or less as a single, or ${fmt(HTB_INCOME_LIMITS.joint)} or less for a couple or a single parent. ` +
      "You must be an Australian citizen aged 18 or over, not own any property now, live in the home, and buy under your area's price cap. Lenders also check that you couldn't buy without the scheme.",
  },
  {
    question: "How much deposit do I need for a $700,000 house with Help to Buy?",
    answer:
      `At least 2%, which is $14,000 on a $700,000 home. Under the 5% Deposit Scheme it would be $35,000, and with a normal loan and no lenders mortgage insurance, $140,000. ` +
      "You'll also need money for stamp duty (first home buyer concessions apply with Help to Buy), legal costs and the loan fees.",
  },
  {
    question: "Can I use Help to Buy with the 5% Deposit Scheme?",
    answer:
      "No. Help to Buy can't be combined with the Home Guarantee Scheme, which includes the 5% Deposit Scheme, or with any other shared equity scheme. " +
      "It can be combined with a first home owner grant, stamp duty concessions and the First Home Super Saver Scheme.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Help to Buy scheme guide", href: "/guides/help-to-buy-scheme-australia", description: "How the scheme works, the full rules, and what happens when you sell." },
  { title: "5% Deposit Scheme", href: "/guides/first-home-guarantee", description: "The alternative: a 5% deposit, no LMI, and you keep all the growth." },
  { title: "Shared equity schemes in Australia", href: "/guides/shared-equity-schemes-australia", description: "Help to Buy and each state's scheme, and which are still open." },
  { title: "Stamp duty calculator", href: "/stamp-duty-calculator", description: "Duty on the purchase, with first home buyer concessions." },
  { title: "Borrowing power calculator", href: "/borrowing-power-calculator", description: "Whether your income covers the loan." },
];

export default function HelpToBuyCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<HelpToBuyCalculator />}
      faqs={FAQS}
      related={RELATED}
      intent="buying"
      explainer={
        <>
          <h2>Help to Buy price caps by state</h2>
          <p>
            The home must cost no more than the cap for its area. The capital-city cap also applies in the regional
            centres listed. Caps haven&rsquo;t changed since the scheme started and aren&rsquo;t indexed.
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr><th>State</th><th>Capital city and regional centres</th><th>Rest of state</th></tr>
              </thead>
              <tbody>
                {AUSTRALIAN_STATES.map((s) => (
                  <tr key={s}>
                    <td>{STATE_NAMES[s].replace(/^the /, "")}</td>
                    <td>
                      {fmt(HTB_PRICE_CAPS[s].capital)}{" "}
                      <span className="text-sm">
                        ({STATE_CAPITALS[s]}
                        {HTB_PRICE_CAPS[s].regionalCentres.length ? `; ${HTB_PRICE_CAPS[s].regionalCentres.join(", ")}` : ""})
                      </span>
                    </td>
                    <td>{HTB_PRICE_CAPS[s].rest === null ? "n/a" : fmt(HTB_PRICE_CAPS[s].rest)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Source: <a href={HTB_SOURCES.priceCaps.href} rel="noopener" target="_blank">{HTB_SOURCES.priceCaps.label}</a> and the
            Help to Buy Program Directions 2025, checked {checkedOn}.
          </p>

          <h2>Income limits for {HTB_YEAR}</h2>
          <ul>
            <li><strong>Single:</strong> {fmt(HTB_INCOME_LIMITS.single)} taxable income</li>
            <li><strong>Couple applying together:</strong> {fmt(HTB_INCOME_LIMITS.joint)} combined</li>
            <li><strong>Single parent:</strong> {fmt(HTB_INCOME_LIMITS.singleParent)}</li>
          </ul>
          <p>
            Income is your taxable income on your most recent ATO notice of assessment, with no allowance for one-off
            bonuses. The limits rose on 1 July 2026 and are indexed every 1 July.
          </p>

          <h2>How each figure is worked out</h2>
          <ul>
            <li><strong>Government share</strong> is the percentage you choose, between {HTB_SHARE.existing.min}% and {HTB_SHARE.existing.max}% for an existing home or up to {HTB_SHARE.new.max}% for a new one. In practice the lender and Housing Australia set it from what you can afford.</li>
            <li><strong>Your loan</strong> is the price less your deposit and the government&rsquo;s share, repaid over 30 years at the rate you enter.</li>
            <li><strong>Eligibility</strong> checks your income against the limit, the price against the cap, a {HTB_MIN_DEPOSIT_PCT}% minimum deposit, and that your deposit plus the share reaches 20%, which is why there&rsquo;s no lenders mortgage insurance.</li>
            <li><strong>Stamp duty</strong> applies your state&rsquo;s first home buyer concession on an established home, from the same tables as our <Link href="/stamp-duty-calculator">stamp duty calculator</Link>. New-home concessions vary, so the calculator doesn&rsquo;t estimate them.</li>
            <li><strong>At sale</strong>, the government receives its percentage of the home&rsquo;s value at the time, assuming you haven&rsquo;t bought any back.</li>
          </ul>

          <Callout variant="info" title="What the calculator can't check">
            <p>
              Citizenship, owning property now, living in the home and the lender&rsquo;s test that you couldn&rsquo;t buy
              without the scheme. Read the <Link href="/guides/help-to-buy-scheme-australia">Help to Buy guide</Link> for the
              full rules, and check with a participating lender before you rely on a figure.
            </p>
          </Callout>
        </>
      }
    />
  );
}
