import type { Metadata } from "next";
import Link from "next/link";
import { NegativeGearingCalculator } from "@/components/calculators/NegativeGearingCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Callout, type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import {
  BUDGET_SOURCE,
  TAX_RATES_2026_27,
  TAX_RATES_SOURCE,
  computeNegativeGearing,
  defaultNegativeGearingInput,
} from "@/lib/negative-gearing-calc";

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Negative gearing calculator: your weekly cost after tax (2026)",
  description:
    "Rent in, costs and interest out, depreciation as a deduction, and the tax saving at your 2026–27 marginal rate: what an investment property really costs you each week, and what changes from 1 July 2027.",
  slug: "negative-gearing-calculator",
  schemaName: "Negative Gearing Calculator",
  schemaDescription:
    "Calculate the net rental loss, tax saving at the ATO 2026–27 resident rates and weekly after-tax cost of an Australian investment property.",
  updatedAt: "2026-09-30",
  persona: "investing",
};

const META_TITLE = "Negative Gearing Calculator: Weekly Cost After Tax (2026)";
const META_DESCRIPTION =
  "Free negative gearing calculator on the ATO's 2026–27 tax rates. Your rental loss, tax saving and weekly cost after tax, and what the 1 July 2027 change means.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` },
  openGraph: { url: `${SITE_URL}/${FRONTMATTER.slug}`, title: META_TITLE, description: META_DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

const fmt = (n: number) => `$${Math.abs(Math.round(n)).toLocaleString("en-AU")}`;

// The worked example is the calculator's starting figures (the example in our
// negative gearing guide), run through the same engine, so page and tool agree.
const EX_INPUT = defaultNegativeGearingInput();
const ex = computeNegativeGearing(EX_INPUT);
const exAt = (marginalRate: number) => computeNegativeGearing({ ...EX_INPUT, marginalRate });
const ex30 = exAt(30);
const ex45 = exAt(45);
const exDep = computeNegativeGearing({ ...EX_INPUT, depreciation: 8_000 });
const exQuarantined = computeNegativeGearing({ ...EX_INPUT, timing: "established-after-cutoff" });

const FAQS: FaqItem[] = [
  {
    question: "How do I calculate negative gearing?",
    answer:
      `Add up a year's rent, subtract every deductible cost (interest, rates, insurance, management, repairs, strata) and depreciation. A negative result is the rental loss, and the tax it saves is the loss times your marginal rate. ` +
      `On a $700,000 property with a $560,000 loan at 6.5% and $625 a week in rent, the loss is ${fmt(ex.netRentalResult)}. At 37% that saves ${fmt(ex.taxEffect)} in tax, so the property costs ${fmt(ex.cashFlowAfterTax)} a year, ${fmt(ex.weeklyCostAfterTax)} a week.`,
  },
  {
    question: "Is negative gearing actually worth it?",
    answer:
      `Only if the property grows in value by more than it costs you to hold. The tax saving refunds part of the loss, never all of it: in our example you are still ${fmt(ex.weeklyCostAfterTax)} a week out of pocket at 37%, ` +
      `${fmt(ex45.weeklyCostAfterTax)} at 45% and ${fmt(ex30.weeklyCostAfterTax)} at 30%. Over ten years that is roughly ${fmt(ex.cashFlowAfterTax * 10)} at 37% before rent rises, which the capital gain has to beat after CGT and selling costs. ` +
      "A higher-yield property that costs less to hold is often the safer bet, especially under the rules from 1 July 2027.",
  },
  {
    question: "Can I still claim negative gearing on my investment property?",
    answer:
      `Yes, if you held it at 7:30pm AEST on 12 May 2026 or it is a new build: the ATO says those keep negative gearing (${BUDGET_SOURCE.dated}). ` +
      "For an established home contracted after that time, losses still reduce tax on your wages in 2026–27, but from 1 July 2027 they can only be used against residential rental income or the capital gain on sale, carried forward until then. " +
      `On our example that lifts the weekly cost from ${fmt(exQuarantined.weeklyCostAfterTax)} to ${fmt(exQuarantined.weeklyCostFrom2027)} if you have no other rental income.`,
  },
  {
    question: "What tax rates does the calculator use?",
    answer:
      `The ATO's resident rates for 2026–27 (${TAX_RATES_SOURCE.dated}): nil to $18,200, 15% to $45,000, 30% to $135,000, 37% to $190,000 and 45% above. ` +
      "Pick the band your taxable income sits in before the rental loss. The Medicare levy is not included, so the real saving is slightly higher, and a large loss can drop part of your income into the band below, which makes it slightly lower.",
  },
  {
    question: "How does depreciation change the result?",
    answer:
      `Depreciation is a deduction you don't pay in cash, so it increases the tax saving without increasing the cost. Adding $8,000 of depreciation to our example lifts the tax saving from ${fmt(ex.taxEffect)} to ${fmt(exDep.taxEffect)} and cuts the weekly cost from ${fmt(ex.weeklyCostAfterTax)} to ${fmt(exDep.weeklyCostAfterTax)}. ` +
      "A quantity surveyor's schedule sets the figure; our depreciation guide explains Division 40 and Division 43.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Negative gearing in Australia", href: "/guides/negative-gearing-australia", description: "What is deductible, what is not, and the risks." },
  { title: "Negative gearing changes (2026 Budget)", href: "/guides/negative-gearing-changes-2026-budget", description: "Who is grandfathered and what counts as a new build." },
  { title: "CGT changes (2026 Budget)", href: "/guides/cgt-changes-2026-budget", description: "Indexation and the 30% minimum tax on gains." },
  { title: "Rental yield calculator", href: "/rental-yield-calculator", description: "Gross and net yield on the same property." },
  { title: "CGT calculator", href: "/cgt-calculator", description: "The tax when you sell." },
  { title: "Property depreciation guide", href: "/guides/property-depreciation-guide", description: "The deduction that costs you nothing in cash." },
];

export default function NegativeGearingCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<NegativeGearingCalculator />}
      faqs={FAQS}
      related={RELATED}
      explainer={
        <>
          <h2>Worked example: a $700,000 investment property</h2>
          <p>
            The calculator opens on the example from our{" "}
            <Link href="/guides/negative-gearing-australia">negative gearing guide</Link>: a $560,000 loan at 6.5% interest only,
            $625 a week in rent, $2,000 in rates, $1,500 in insurance, an 8.5% management fee and $1,000 of repairs. Replace
            them with your own figures. The rental loss is {fmt(ex.netRentalResult)}
            {" a year; what it costs you after tax depends on your 2026–27 marginal rate."}
          </p>
          <div className="overflow-x-auto">
          <table>
            <thead>
              <tr><th>Tax rate</th><th>Tax saved</th><th>Cost a year</th><th>A week</th></tr>
            </thead>
            <tbody>
              {TAX_RATES_2026_27.filter((t) => t.rate > 0).map((t) => {
                const r = exAt(t.rate);
                return (
                  <tr key={t.rate}>
                    <td>{t.rate}%</td>
                    <td>{fmt(r.taxEffect)}</td>
                    <td>{fmt(r.cashFlowAfterTax)}</td>
                    <td>{fmt(r.weeklyCostAfterTax)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
          <p>
            Rates: <a href={TAX_RATES_SOURCE.url} rel="noopener" target="_blank">{TAX_RATES_SOURCE.name}</a>,{" "}
            {TAX_RATES_SOURCE.dated}, read {TAX_RATES_SOURCE.readOn}.
          </p>

          <h2>How the calculator works</h2>
          <ol>
            <li>Rent for the weeks the property is let.</li>
            <li>Less cash costs: rates, insurance, the management fee on the rent collected, repairs and strata.</li>
            <li>Less a year&rsquo;s interest on the loan, as if interest only.</li>
            <li>Less depreciation, which is a deduction but not a payment.</li>
            <li>A loss saves tax at your marginal rate; a profit is taxed at it.</li>
            <li>The cost after tax is the cash you put in, less the tax saved, divided by 52 for the weekly figure.</li>
          </ol>

          <h2>What changes on 1 July 2027</h2>
          <p>
            The 2026–27 Budget measures are law. From 1 July 2027 negative gearing on residential property is limited to new
            builds, and properties held at 7:30pm AEST on 12 May 2026 are exempt; the 50% CGT discount is replaced with cost
            base indexation and a 30% minimum tax for gains that accrue after 1 July 2027 (
            <a href={BUDGET_SOURCE.url} rel="noopener" target="_blank">ATO</a>, {BUDGET_SOURCE.dated}). Pick which describes
            your property in the calculator and it shows what the loss is worth from 2027–28.
          </p>
          <Callout variant="info" title="Read the detail before you buy">
            <p>
              Our explainers cover{" "}
              <Link href="/guides/negative-gearing-changes-2026-budget">who is grandfathered and what counts as a new build</Link>,{" "}
              <Link href="/guides/cgt-changes-2026-budget">how CGT is worked out under indexation</Link>, and{" "}
              <Link href="/guides/negative-gearing-cgt-changes-now-law-2026">what passed on 25 June 2026</Link>.
            </p>
          </Callout>

          <h2>What this calculator doesn&rsquo;t do</h2>
          <ul>
            <li>It doesn&rsquo;t include the Medicare levy, or work out your bracket from your income: you pick the rate.</li>
            <li>It treats the loan as interest only. On principal and interest, the interest part is a little lower and the principal is not deductible.</li>
            <li>It doesn&rsquo;t model rent or price growth, land tax, borrowing costs spread over five years, or the capital gain when you sell (the <Link href="/cgt-calculator">CGT calculator</Link> does).</li>
            <li>It doesn&rsquo;t track losses carried forward after 1 July 2027 or offset them against other rental properties you own.</li>
            <li>It is general information, not tax advice. A registered tax agent can confirm what you can claim.</li>
          </ul>
        </>
      }
    />
  );
}
