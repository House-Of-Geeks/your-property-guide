import type { Metadata } from "next";
import Link from "next/link";
import { CGTCalculator } from "@/components/calculators/CGTCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Callout, KeyFigure, Sources, type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { ATO_REFORM_SOURCE, BUDGET_EXPLAINER_SOURCE, ACT_SOURCE } from "@/lib/data/tax-reform-2027";
import {
  CGT_DISCOUNT_SOURCE,
  COMPANY_RATE_SOURCE,
  SMSF_TAX_SOURCE,
  TAX_CUTS_2027_SOURCE,
  computeCgt,
  defaultCgtInput,
  type CgtInput,
} from "@/lib/cgt-calc";
import { INCOME_TAX_SOURCE, INCOME_TAX_YEAR, MEDICARE_LEVY_SOURCE } from "@/lib/utils/income-tax";

const src = (s: { name: string; url: string; dated: string; readOn: string }) => ({
  label: s.name,
  href: s.url,
  note: `${s.dated[0].toUpperCase()}${s.dated.slice(1)}, read ${s.readOn}.`,
});

const MAIN_RESIDENCE_SOURCE = {
  label: "ATO: Treating a former home as your main residence",
  href: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/property-and-capital-gains-tax/your-main-residence-home/treating-former-home-as-main-residence",
  note: "Last updated 22 June 2026, read 11 October 2026. The 6-year rule, each period of absence, and no other main residence at the same time.",
};

// Worked figures from the calculator's own engine: an individual selling an
// investment held at least 12 months, before 1 July 2027 (sale contract
// 1 November 2026, 2026-27 rates), no main residence use.
const SALE_2026: CgtInput = { ...defaultCgtInput(), purchasePrice: 500_000, purchaseDate: "2021-11-01", saleDate: "2026-11-01" };
const taxOn = (gain: number, otherIncome: number) => computeCgt({ ...SALE_2026, salePrice: 500_000 + gain, otherIncome });
const GAINS = [100_000, 200_000, 300_000] as const;
const INCOMES = [60_000, 100_000, 150_000, 200_000] as const;
const T300 = taxOn(300_000, 100_000);
const T100 = taxOn(100_000, 100_000);
// The Budget explainer's Jane: bought $800,000 in July 2022, sold $1,600,000 in July 2032.
const JANE = computeCgt({ ...defaultCgtInput(), purchasePrice: 800_000, salePrice: 1_600_000, purchaseDate: "2022-07-01", saleDate: "2032-07-01" });
const usd = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Capital Gains Tax Calculator",
  h1: "Capital gains tax calculator for property: before and after 1 July 2027",
  description:
    "Estimate the capital gains tax on selling an Australian investment property, with the 50% discount on the gain up to 1 July 2027 and indexation and the 30% minimum tax on the gain after it, at the ATO's resident rates (2026-27 rates last updated 13 August 2026).",
  slug: "cgt-calculator",
  schemaName: "Capital Gains Tax Calculator",
  schemaDescription: "Calculate Australian capital gains tax on property: the 50% CGT discount, the 1 July 2027 indexation and 30% minimum tax, and the main residence exemption.",
  updatedAt: "2026-10-11",
  persona: "investing",
};

const META_TITLE = "CGT Calculator for Property: 50% Discount and 2027 Rules";
const META_DESCRIPTION = "Free CGT calculator for Australian property: the 50% discount, the 1 July 2027 split with indexation and the 30% minimum tax, and the main residence exemption.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` },
  openGraph: {
    url: `${SITE_URL}/${FRONTMATTER.slug}`,
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const FAQS: FaqItem[] = [
  {
    question: "How much capital gains tax will I pay on $300,000?",
    answer:
      `It depends on your other income. Sell a property held at least 12 months before 1 July 2027 and half the gain, ${usd(T300.taxableGain)}, is added to your taxable income. With $100,000 of other income, that adds about ${usd(T300.incomeTax)} of tax at the ATO's 2026-27 resident rates (last updated 13 August 2026), plus ${usd(T300.medicareLevy)} of Medicare levy. ` +
      `On a $100,000 gain it is about ${usd(T100.incomeTax + T100.medicareLevy)}. The table below works other incomes and gains.`,
  },
  {
    question: "What is the 6 year rule for capital gains tax?",
    answer:
      "If you move out of your home and rent it out, you can keep treating it as your main residence for CGT for up to 6 years, as long as you don't treat another property as your main residence in that time. Sell within those 6 years and the gain can be fully exempt; the 6 years apply to each period you are away. It only works if the property was your main residence first (ATO, last updated 22 June 2026).",
  },
  {
    question: "Can I move back into my investment property to avoid CGT?",
    answer:
      "Only if it was your home first. A period of absence under the 6-year rule ends when you stop renting the property and move back in, and a later absence starts a new 6 years, so a former home you return to can stay exempt. A property you rented out before you ever lived in it has a taxable period that moving in later does not remove: you get a partial exemption at best (ATO, last updated 22 June 2026).",
  },
  {
    question: "What is the 50% CGT discount?",
    answer:
      "If you hold an investment property for at least 12 months, leaving out the day you bought it and the day you sell (contract dates), you are eligible for a 50% CGT discount as an individual or trust. This means only half of your capital gain is added to your taxable income. Complying super funds get a one-third discount and companies get none (ATO). " +
      "For gains that accrue from 1 July 2027 the discount is replaced by cost base indexation and, for resident individuals, a 30% minimum tax. On property you already own, the gain up to 1 July 2027 keeps the discount; investors in new builds can choose to keep it (ATO, last updated 29 June 2026).",
  },
  {
    question: "What is the main residence exemption?",
    answer:
      "If you sell your primary place of residence and have never rented it out, you generally pay no CGT on the sale. This is known as the main residence (or principal place of residence) exemption.",
  },
  {
    question: "What happens if I rented out my home for part of the time?",
    answer:
      "A partial main residence exemption applies. Only the proportion of time the property was rented is taxable. For example, if you owned the property for 5 years and rented it for 2 years, 40% of the gain would be assessable, and if held more than 12 months, the 50% discount would then also apply to that assessable portion.",
  },
  {
    question: "How does joint ownership affect CGT?",
    answer:
      "In a 50/50 joint ownership arrangement, each owner is liable for CGT on their own share of the gain. Each party adds their half of the taxable gain to their own taxable income, so it is taxed at their own rates. The calculator assumes both owners have the same other income.",
  },
  {
    question: "What costs can I include in my cost base?",
    answer:
      "Your cost base includes the original purchase price, stamp duty, legal fees, building and pest inspection costs, and capital improvements made during ownership. Agent commissions and legal fees paid on sale reduce your capital proceeds.",
  },
  {
    question: "When is CGT actually paid?",
    answer:
      "CGT is paid as part of your income tax return for the year in which the contract of sale is signed (not settlement). If you exchange contracts in June 2026 with settlement in August 2026, the CGT obligation falls into the 2025/26 financial year. Most investors put aside funds at exchange to cover the eventual tax bill.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Property Depreciation Guide", href: "/guides/property-depreciation-guide", description: "Depreciation reduces tax during ownership but reduces cost base on sale." },
  { title: "Rental Yield Calculator",     href: "/rental-yield-calculator",          description: "What the property earns while you hold it." },
  { title: "Negative Gearing Australia",  href: "/guides/negative-gearing-australia", description: "How holding-period tax mechanics interact with CGT on exit." },
  { title: "SMSF Property Guide",         href: "/guides/smsf-property-guide",       description: "CGT works very differently inside super." },
  { title: "Best suburbs for investors",  href: "/best-suburbs",                     description: "High-growth suburbs are also high-CGT suburbs at exit." },
  { title: "Conveyancing Guide",          href: "/guides/conveyancing-guide",        description: "When CGT crystallises (contract date, not settlement)." },
];

export default function CGTCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<CGTCalculator />}
      faqs={FAQS}
      related={RELATED}
      explainer={
        <>
          <h2>How CGT works on Australian property</h2>
          <p>
            When you sell an investment property in Australia, the profit (capital
            gain) is added to your assessable income in the year of sale and taxed
            at your marginal rate. There are several mechanics that determine how
            much of the gain is taxable.
          </p>

          <h3>Cost base</h3>
          <p>
            What you paid for the property, plus most costs associated with
            buying it (stamp duty, conveyancing, building inspection) and any
            capital improvements you made during ownership.
          </p>

          <h3>Capital proceeds</h3>
          <p>
            The amount you receive on sale, less costs of sale such as real
            estate agent commissions and legal fees.
          </p>

          <h3>50% CGT discount</h3>
          <p>
            If you&rsquo;ve owned the property for at least 12 months as an
            individual or via a trust, only 50% of the net capital gain is
            taxable. The 12 months run between the contract dates, leaving out
            both days. Complying super funds get a one-third discount and
            companies get none: a company pays 25% as a base rate entity or 30%
            otherwise on the whole gain, and a company that mainly holds
            property is usually not a base rate entity (ATO).
          </p>

          <h3>Your tax rate on the gain</h3>
          <p>
            The taxable gain is added to your other income for the year and
            taxed at the ATO&rsquo;s {INCOME_TAX_YEAR} resident rates: nil to
            $18,200, 15% to $45,000, 30% to $135,000, 37% to $190,000 and 45%
            above, plus the 2% Medicare levy. A large gain can push part of
            itself into a higher bracket, which is why the calculator asks for
            your other taxable income rather than a single rate.
          </p>

          <Callout variant="info" title="Gains after 1 July 2027">
            <p>
              The 50% discount is being replaced. Under the Treasury Laws
              Amendment (Tax Reform No. 1) Act 2026, passed on 25 June 2026,
              gains that accrue from 1 July 2027 are worked out with cost base
              indexation (only the gain above inflation is taxed) and, for
              resident individuals, a 30% minimum tax. On property you own
              before then, the gain up to 1 July 2027 keeps the 50% discount
              and the gain after it is indexed from the property&rsquo;s value
              on that date. Investors in new builds can choose the discount or
              indexation when they sell. This calculator applies the rules for
              the sale date you enter: from 1 July 2027 it splits the gain at
              that date, indexes the later part at the inflation rate you choose
              (2.5% a year by default, the Budget explainer&rsquo;s assumption),
              applies the 30% minimum unless you receive an exempting payment,
              and offers the new build choice. Source: ATO, last updated 29 June
              2026; our <Link href="/guides/cgt-changes-2026-budget">CGT changes explainer</Link>{" "}
              has worked examples.
            </p>
          </Callout>

          <h2 id="by-gain">CGT on a $100,000, $200,000 and $300,000 gain</h2>
          <p>
            The tax an individual pays on a gain from an investment held at least 12 months and sold before
            1 July 2027, by their other taxable income for the year: half the gain added to income at the
            ATO&rsquo;s {INCOME_TAX_YEAR} resident rates, plus the 2% Medicare levy, before offsets. Worked by
            the calculator above (a sale contract dated 1 November 2026).
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Other taxable income</th>
                  {GAINS.map((g) => <th key={g}>Gain of {usd(g)}</th>)}
                </tr>
              </thead>
              <tbody>
                {INCOMES.map((inc) => (
                  <tr key={inc}>
                    <td>{usd(inc)}</td>
                    {GAINS.map((g) => <td key={g}>{usd(taxOn(g, inc).totalTax)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="after-2027">Selling after 1 July 2027: the split, indexation and the 30% minimum</h2>
          <p>
            Enter a sale date from 1 July 2027 and the calculator switches rules. For something you own before
            then, the gain is split at 1 July 2027: the part up to that date keeps the 50% discount, and the
            part after it is the sale price less the asset&rsquo;s value on 1 July 2027 indexed for inflation.
            A resident individual then pays at least 30% on that later part, unless they receive the Age
            Pension, JobSeeker or another listed payment in the year of sale. Anything bought from 1 July
            2027 is indexed from its own cost base.
          </p>
          <p>
            The Budget explainer&rsquo;s example: Jane buys for $800,000 in July 2022 and sells for
            $1,600,000 in July 2032. Her asset is worth {usd(JANE.valueAt2027 ?? 0)} on 1 July 2027, so{" "}
            {usd(JANE.gainBefore2027)} of the gain is discounted to half, and the {usd(1_600_000 - (JANE.valueAt2027 ?? 0))}{" "}
            after it falls to {usd(JANE.indexedGainAfter2027)} after five years of 2.5% indexation: a taxable
            gain of {usd(JANE.taxableGain)}, against $400,000 if the 50% discount applied to it all.
          </p>

          <h3>Main residence exemption</h3>
          <p>
            If the property is your principal place of residence and you never
            rented it out, no CGT applies. If you rented it for part of the time,
            a partial exemption applies based on the proportion of days it was
            your main residence.
          </p>

          <KeyFigure
            value="50%"
            label="Of your net capital gain that's taxable when an individual or trust holds an investment property for at least 12 months, on a gain that accrues before 1 July 2027. Companies don't get the discount."
            context="ATO, individual marginal-rate basis"
          />

          <h2>The biggest decisions that affect your CGT</h2>
          <h3>Hold for at least 12 months</h3>
          <p>
            The cliff is hard. The ATO leaves out the day you bought and the day
            you sell: its example is an asset acquired on 2 February 2021, which
            gets the discount on a sale contract signed on or after 3 February
            2022. A day earlier and 100% of the gain is taxable. If you&rsquo;re
            close to the threshold, check the contract dates.
          </p>
          <h3>Sell in a low-income year</h3>
          <p>
            CGT is taxed at your marginal rate. If you can time the sale into a
            year of lower other income (parental leave, sabbatical, retirement
            year), the CGT rate applied to the gain falls accordingly. From
            1 July 2027 the 30% minimum tax limits this for gains that accrue
            after that date, unless you receive an exempting payment such as
            the Age Pension in the year of sale.
          </p>
          <h3>Joint ownership splits the gain</h3>
          <p>
            A 50/50 joint ownership splits the gain across two marginal-rate
            assessments, often pulling at least one party into a lower bracket.
          </p>
          <h3 id="six-year-rule">The 6-year rule for a former home</h3>
          <p>
            If you live in a property as your main residence then move out and
            rent it, you can continue to treat it as your main residence for CGT
            for up to 6 years, provided you don&rsquo;t treat another property
            as your main residence in that time (except for up to 6 months when
            moving house). The 6 years apply to each period of absence, and a
            period ends when you stop renting and move back in. If you leave it
            empty instead of renting it, there is no time limit. It only applies
            to a property that was your main residence first (ATO, last updated
            22 June 2026). Useful for accidental landlords or moves driven by
            work.
          </p>

          <h2 id="structures">Companies, trusts and SMSFs</h2>
          <ul>
            <li><strong>Companies</strong> get no CGT discount and pay 25% (a base rate entity) or 30% on the whole gain; a company whose income is mostly rent and capital gains is usually not a base rate entity (ATO). The 2027 changes do not apply to them.</li>
            <li><strong>Trusts</strong> can discount a gain by 50% and pass it to beneficiaries, who are taxed on it; from 1 July 2027 trusts are under indexation like individuals (ATO; Tax Reform No. 1 Act).</li>
            <li><strong>Complying super funds, SMSFs included,</strong> discount a gain by one-third and pay 15%, so 10% on a gain held at least 12 months; gains on assets supporting a retirement phase pension are exempt. They are outside the 2027 changes (ATO; explanatory memorandum).</li>
          </ul>

          <h2 id="capital-losses">Capital losses</h2>
          <p>
            A capital loss reduces capital gains, not your other income. Each year, losses come off the year&rsquo;s
            gains first, then any unapplied net capital losses carried forward from earlier years, and only then is
            the discount applied to what is left. A net capital loss cannot be deducted from your other income; it
            carries forward to later years (Income Tax Assessment Act 1997, section 100-50, as amended by the Tax
            Reform No. 1 Act; ATO, CGT discount). From 1 July 2027, quarantined rental
            losses on established homes bought after 7:30pm AEST on 12 May 2026 can also reduce capital gains on
            residential property.
          </p>

          <Callout variant="warning" title="This is general information, not tax advice">
            <p>
              CGT mechanics interact with depreciation, capital improvements, and
              your specific income picture in ways that materially change the
              outcome. The calculator is a starting point. Always confirm with a
              tax accountant before relying on a specific figure.
            </p>
          </Callout>

          <h2>What this calculator doesn&rsquo;t do</h2>
          <ul>
            <li>It doesn&rsquo;t handle complex partial-exemption scenarios with multiple rental periods.</li>
            <li>It doesn&rsquo;t adjust the cost base for depreciation that you claimed during ownership (which reduces your cost base on sale).</li>
            <li>It treats a trust as one resident adult beneficiary taking the whole gain, an SMSF as in accumulation phase, and a company as paying the rate you pick; real structures have more moving parts, see our <Link href="/guides/smsf-property-guide">SMSF Property Guide</Link>.</li>
            <li>It leaves out tax offsets, the Medicare levy&rsquo;s low-income reduction and the Medicare levy surcharge, and your other capital gains and losses.</li>
            <li>It doesn&rsquo;t model temporary residents, foreign residents, or non-residents (different rules apply).</li>
            <li>For gains from 1 July 2027 it indexes at one inflation rate a year rather than the CPI quarter by quarter, and estimates the 1 July 2027 value by steady growth unless you enter one; the ATO&rsquo;s tools and the Minister&rsquo;s instruments will set both.</li>
          </ul>

          <Sources
            items={[
              src(INCOME_TAX_SOURCE),
              src(TAX_CUTS_2027_SOURCE),
              src(MEDICARE_LEVY_SOURCE),
              src(CGT_DISCOUNT_SOURCE),
              MAIN_RESIDENCE_SOURCE,
              src(COMPANY_RATE_SOURCE),
              src(SMSF_TAX_SOURCE),
              ATO_REFORM_SOURCE,
              ACT_SOURCE,
              BUDGET_EXPLAINER_SOURCE,
            ]}
          />
        </>
      }
    />
  );
}
