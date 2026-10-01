import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  GuideGlossaryRail,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { TAX_RATES_SOURCE, computeNegativeGearing, defaultNegativeGearingInput } from "@/lib/negative-gearing-calc";
import { TAX_REFORM_SOURCES } from "@/lib/data/tax-reform-2027";

const FRONTMATTER: GuideFrontmatter = {
  title: "Negative gearing in Australia: how it works (2026)",
  description:
    "How negative gearing works, what's deductible and what isn't, the depreciation overlay, the CGT connection, the risks, and what changes from 1 July 2027 under the law passed in June 2026.",
  slug: "negative-gearing-australia",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-01",
  readingTimeMinutes: 9,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "investing",
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

const fmt = (n: number) => `$${Math.abs(Math.round(n)).toLocaleString("en-AU")}`;

// The worked example runs through the negative gearing calculator's engine, so
// the guide, the calculator and its tests agree. Rates are the ATO's 2026–27
// resident rates (src/lib/negative-gearing-calc.ts); the Medicare levy is left out.
const EXAMPLE = defaultNegativeGearingInput();
const ex = computeNegativeGearing(EXAMPLE);
const RATE_ROWS = [15, 30, 37, 45].map((rate) => {
  const r = computeNegativeGearing({ ...EXAMPLE, marginalRate: rate });
  return { rate, saving: r.taxEffect, cost: -r.cashFlowAfterTax };
});
// From 1 July 2027, an established home contracted after 7:30pm AEST on
// 12 May 2026 (the calculator's default timing) loses the saving against other income.
const exFrom2027 = computeNegativeGearing({ ...EXAMPLE, timing: "established-after-cutoff" });

const TLDR = [
  "Negative gearing means your investment property's costs (interest, rates, fees, depreciation) exceed its rental income. The net loss is deducted from your other taxable income.",
  "The strategy works when capital growth eventually outweighs the cumulative cash-flow losses. It's not a free lunch, you're betting on appreciation.",
  "At a 37% marginal tax rate, the government effectively subsidises about 37% of your annual rental loss. The higher your tax bracket, the bigger the subsidy.",
  "Loan interest, rates, insurance, management fees, repairs, and depreciation are deductible. Capital improvements, principal repayments, and stamp duty are not, they go to your CGT cost base.",
  "On a sale before 1 July 2027, holding for at least 12 months halves the taxable gain (the 50% CGT discount). Gains that accrue from 1 July 2027 are indexed for inflation instead, with a 30% minimum tax for individuals; new builds can keep the discount.",
  "From 1 July 2027, losses on an established home contracted after 7:30pm AEST on 12 May 2026 only offset income from residential property and carry forward. Homes held at that time and new builds keep negative gearing (law passed 25 June 2026; ATO, updated 29 June 2026).",
  "Risks: vacancy, rate rises, no capital growth, legislative change, and serviceability strain. Don't invest solely for the tax break.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is",                   label: "What negative gearing is" },
  { id: "worked-example",            label: "Worked example" },
  { id: "deductible",                label: "What expenses are deductible?" },
  { id: "not-deductible",            label: "What is NOT deductible?" },
  { id: "depreciation",              label: "Depreciation: the deduction most miss" },
  { id: "cgt",                       label: "The CGT connection" },
  { id: "positive-neutral-negative", label: "Positive vs neutral vs negative" },
  { id: "risks",                     label: "Risks" },
  { id: "still-available",           label: "Is negative gearing still available?" },
  { id: "tax-return",                label: "Tax return obligations" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much can I save in tax through negative gearing?",
    answer:
      "It depends on the size of your rental loss and your marginal tax rate. On a typical $700,000 investment property at 80% LVR, the annual rental loss might be around $11,000. At a 37% marginal tax rate, that's roughly $4,100 a year in tax savings. At a 45% rate, $5,000. The strategy is much more effective at higher tax brackets. " +
      "Those savings use the ATO's 2026–27 resident rates, before the 2% Medicare levy. From 1 July 2027 an established home contracted after 7:30pm AEST on 12 May 2026 saves nothing against your other income: the loss is carried forward against residential rental income or capital gains on residential property instead.",
  },
  {
    question: "Does negative gearing make sense in a high interest rate environment?",
    answer:
      "It's harder. Higher interest rates increase your annual rental loss, which means a larger tax deduction but also more out-of-pocket cash flow. The strategy still works mathematically if capital growth keeps pace, but the cash-flow strain is real, especially for variable-rate borrowers. Many investors fix part of their loan or build a cash buffer specifically to weather rate cycles.",
  },
  {
    question: "Can I negatively gear any property?",
    answer:
      "You can claim deductions on any genuinely-rented investment property, but whether the property is positively, neutrally, or negatively geared depends on rental yield vs your costs. Low-yield, high-growth markets (inner Sydney, Melbourne) almost always run negative. Higher-yield regional markets often run positive. Use our rental yield calculator to model the math. " +
      "From 1 July 2027, though, a loss on an established home contracted after 7:30pm AEST on 12 May 2026 can no longer reduce the tax on your wages. New builds, and homes held at that time, keep negative gearing.",
  },
  {
    question: "Will negative gearing be removed in 2026?",
    answer:
      "Not removed, but limited. Parliament passed the 2026–27 Budget package on 25 June 2026, and from 1 July 2027 negative gearing on residential property is limited to new builds. Properties held at 7:30pm AEST on 12 May 2026, including those under a contract not yet settled, keep it until sold. " +
      `An established home contracted after that time can be negatively geared until 30 June 2027; from 1 July 2027 its losses only offset income from residential property, with the excess carried forward. On our worked example that takes the after-tax cost at 37% from ${fmt(exFrom2027.weeklyCostAfterTax)} to ${fmt(exFrom2027.weeklyCostFrom2027)} a week if you have no other rental income (ATO, last updated 29 June 2026; Budget 2026–27 Tax Explainer, 12 May 2026).`,
  },
  {
    question: "What's the difference between negative gearing and depreciation?",
    answer:
      "Negative gearing is the broader strategy: your total expenses exceed total income, creating a net loss deducted from other income. Depreciation is one of the expenses you can claim (a non-cash deduction for the building's wear and tear). Depreciation can convert a positively geared property into a negatively geared one on paper, even when cash-flow positive.",
  },
  {
    question: "Do I need an accountant for a negatively geared property?",
    answer:
      "Strongly recommended. The interaction of depreciation, capital improvements, apportionment, and CGT on eventual sale is genuinely complex. Most investors with one or more rental properties use a property-specialist tax agent. The fee is itself tax deductible.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Property Depreciation Guide",  href: "/guides/property-depreciation-guide", description: "The non-cash deduction that often shifts a property to negative on paper." },
  { title: "Rental Yield Calculator",      href: "/rental-yield-calculator",            description: "Whether a property is likely to run positive, neutral or negative." },
  { title: "CGT Calculator",               href: "/cgt-calculator",                      description: "What you'll pay when you sell and the strategy concludes." },
  { title: "SMSF Property Guide",          href: "/guides/smsf-property-guide",          description: "Negative gearing inside super works very differently." },
  { title: "Best Suburbs for Investors",   href: "/best-suburbs",                        description: "Where to apply this strategy with realistic capital-growth assumptions." },
  { title: "Negative Gearing Calculator",  href: "/negative-gearing-calculator",         description: "Your rental loss, tax saving and weekly cost after tax." },
];

export default function NegativeGearingPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Tax laws are complex">
        <p>
          Tax rules change. This guide is for educational purposes only.
          Speak with a registered tax agent for advice specific to your
          situation.
        </p>
        <p>
          Updated 1 October 2026: negative gearing and the 50% CGT discount
          change from 1 July 2027 under the law Parliament passed on 25 June
          2026. See <a href="#still-available">what changes</a> and{" "}
          <a href="#cgt">the CGT connection</a>.
        </p>
      </Callout>

      <h2 id="what-is">What negative gearing is</h2>
      <p className="lead">
        Negative gearing occurs when the costs of owning a rental property
        exceed the rental income it generates, in other words, the property
        runs at a net loss. In Australia, this net rental loss can be deducted
        from your other taxable income (such as wages or business income),
        reducing your overall tax bill.
      </p>
      <p>
        The tax deduction is the mechanism that makes negative gearing
        attractive: the government effectively subsidises part of your
        investment loss through reduced income tax. The strategy works best
        when you are in a high marginal tax bracket and the property is
        expected to appreciate over time, delivering a capital gain that more
        than offsets the cumulative rental losses.
      </p>
      <p>
        <strong>Key principle.</strong> Negative gearing is not a free lunch.
        You are genuinely losing money on a cash-flow basis, you are betting
        that capital growth will deliver a larger long-term gain.
      </p>

      <h2 id="worked-example">Worked example</h2>
      <p>A realistic example using a $700,000 investment property with an 80% LVR loan:</p>

      <table>
        <thead>
          <tr><th>Item</th><th>Amount per year</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Annual rental income</strong> ($625/week × 52)</td><td>$32,500</td></tr>
          <tr><td colSpan={2}><em>Deductible costs:</em></td></tr>
          <tr><td>Loan interest ($560,000 at 6.5%)</td><td>$36,400</td></tr>
          <tr><td>Council rates</td><td>$2,000</td></tr>
          <tr><td>Landlord insurance</td><td>$1,500</td></tr>
          <tr><td>Property management fees (8.5%)</td><td>$2,763</td></tr>
          <tr><td>Maintenance and repairs</td><td>$1,000</td></tr>
          <tr><td><strong>Total deductible costs</strong></td><td><strong>$43,663</strong></td></tr>
          <tr><td><strong>Net rental loss</strong></td><td><strong>($11,163)</strong></td></tr>
        </tbody>
      </table>

      <p>
        This $11,163 net rental loss is deducted from your other taxable
        income. The after-tax benefit depends on your marginal tax rate. At
        the ATO&rsquo;s 2026&ndash;27 resident rates ({TAX_RATES_SOURCE.dated}),
        before the 2% Medicare levy:
      </p>

      <table>
        <thead>
          <tr><th>Marginal tax rate (2026&ndash;27)</th><th>Annual tax saving</th><th>After-tax net cost</th></tr>
        </thead>
        <tbody>
          {RATE_ROWS.map((row) => (
            <tr key={row.rate}>
              <td>{row.rate}%</td>
              <td>{fmt(row.saving)}</td>
              <td>{fmt(row.cost)} a year</td>
            </tr>
          ))}
        </tbody>
      </table>

      <KeyFigure
        value="$7,033"
        label="Real out-of-pocket annual cost on this property at a 37% marginal tax rate, vs the apparent $11,163 rental loss. The higher your tax bracket, the bigger the subsidy."
        context="Worked example, before depreciation"
      />

      <p>
        At a 37% marginal rate, the investor&rsquo;s actual out-of-pocket cost
        of holding this property is roughly $7,033 a year (about $135 a week),
        compared to the apparent $11,163 rental loss. The higher your tax
        rate, the more the government subsidises your holding costs.
      </p>
      <p>
        Run your own figures through our{" "}
        <Link href="/negative-gearing-calculator">negative gearing calculator</Link>,
        which uses the 2026&ndash;27 tax rates and shows what changes for your
        property from 1 July 2027.
      </p>
      <Callout variant="info" title="The same property from 1 July 2027">
        <p>
          Held at 7:30pm AEST on 12 May 2026, or a new build: no change. An
          established home contracted after that time: from 1 July 2027 the{" "}
          {fmt(ex.netRentalResult)} loss no longer reduces the tax on your
          wages. It carries forward against future income from residential
          property, including the capital gain when you sell, so the year
          costs the full {fmt(exFrom2027.cashFlowBeforeTax)}, about{" "}
          {fmt(exFrom2027.weeklyCostFrom2027)}{" "}a week, unless you have other
          residential rental income to absorb it. Sources: ATO, last updated
          29 June 2026; Budget 2026&ndash;27 Tax Explainer, 12 May 2026.
        </p>
      </Callout>
      <p>
        If this property grows at 5% a year, it would be worth approximately
        $1,128,000 after 10 years, a gain of $428,000, well exceeding the
        cumulative holding costs of approximately $70,330 over the decade.
      </p>

      <h2 id="deductible">What expenses are deductible?</h2>
      <p>
        The ATO allows deductions for most legitimate costs of earning rental
        income. Deductible expenses include:
      </p>
      <ul>
        <li><strong>Loan interest.</strong> The interest portion of your mortgage repayment. Principal repayments are <em>not</em> deductible.</li>
        <li><strong>Council rates and water rates.</strong></li>
        <li><strong>Building and landlord insurance.</strong></li>
        <li><strong>Property management fees.</strong> The agent&rsquo;s management fee and any leasing/letting fees.</li>
        <li><strong>Repairs and maintenance.</strong> Costs to restore the property to its original condition (not improvements, see below).</li>
        <li><strong>Pest control, cleaning, and gardening.</strong></li>
        <li><strong>Advertising costs</strong> to find tenants.</li>
        <li><strong>Depreciation.</strong> On the building (Division 43) and eligible plant and equipment (Division 40), see below.</li>
        <li><strong>Accountant fees</strong> for preparing your rental schedule.</li>
        <li><strong>Travel to inspect the property.</strong> Note: deductions for travel to residential rental properties were removed from 1 July 2017.</li>
        <li><strong>Legal fees</strong> for issues arising from tenancy (not purchase).</li>
        <li><strong>Borrowing costs</strong> (loan establishment fees, mortgage stamp duty, lenders mortgage insurance), amortised over the loan term (typically 5 years).</li>
      </ul>

      <h2 id="not-deductible">What is NOT deductible?</h2>
      <ul>
        <li><strong>Capital improvements.</strong> Adding a new deck, extending a room, or installing a new kitchen are capital improvements, not repairs. They are added to the property&rsquo;s cost base for CGT purposes, not deducted immediately.</li>
        <li><strong>Purchase costs.</strong> <Link href="/stamp-duty-calculator">Stamp duty</Link>, <Link href="/guides/conveyancing-guide">conveyancing</Link> fees, and purchase-related legal fees are capital costs that form part of the cost base, not immediately deductible.</li>
        <li><strong>Principal loan repayments.</strong></li>
        <li><strong>Personal use portion.</strong> If you use the property yourself for any period, you must apportion expenses, only the rental income period is deductible.</li>
        <li><strong>Rental losses when not genuinely available for rent.</strong> You must be actively trying to rent the property at market rent for deductions to apply.</li>
      </ul>

      <h2 id="depreciation">Depreciation: the tax benefit most investors miss</h2>
      <p>
        Depreciation is a non-cash deduction, you don&rsquo;t spend money on
        it, but you still get a tax deduction. It represents the decline in
        value of the building and its fixtures over time.
      </p>

      <h3>Division 43: building allowance</h3>
      <p>
        The ATO allows you to claim 2.5% of the original construction cost of
        the building each year, for 40 years from when construction was
        completed. Only applies to properties built after 18 July 1985 (the
        construction date, not the purchase date).
      </p>

      <h3>Division 40: plant and equipment</h3>
      <p>
        Separate from the building itself, you can claim depreciation on
        individual plant and equipment assets in the property. Each item has a
        useful life, and you claim depreciation on it over that period.
      </p>
      <p>
        From 1 July 2017, second-hand plant and equipment in a previously used
        residential property is generally <em>not</em> deductible for
        individual investors. New properties and commercial properties are
        unaffected.
      </p>

      <h3>Quantity surveyor report</h3>
      <p>
        To claim Division 43 and Division 40 depreciation, you need a
        depreciation schedule prepared by a registered quantity surveyor.
        Cost: typically $500 to $800 for a standard residential property. See
        our <Link href="/guides/property-depreciation-guide">Property Depreciation Guide</Link>{" "}
        for the full mechanics.
      </p>

      <h2 id="cgt">The CGT connection</h2>
      <p>
        Negative gearing is most effective when the strategy eventually
        results in a capital gain. When you sell the investment property, you
        will pay Capital Gains Tax (CGT) on the profit. On a sale before
        1 July 2027, if you have held the property for at least 12 months, an
        individual or trust gets a 50% CGT discount on the gain, meaning only
        half of the capital gain is included in your assessable income.
      </p>
      <p>
        <strong>Example.</strong> You bought for $700,000 in 2017 and sell for
        $1,000,000 before 1 July 2027. Capital gain: $300,000 (less any capital
        improvements and selling costs). With the 50% CGT discount, only
        $150,000 is added to your taxable income in the year of sale.
      </p>
      <p>
        <strong>From 1 July 2027.</strong>{" "}
        The law passed on 25 June 2026 replaces the 50% discount for
        individuals, trusts and partnerships with cost base indexation, so
        only the gain above inflation is taxed, and a 30% minimum tax on the
        gain for resident individuals. It covers property you already own:
        the gain up to 1 July 2027 keeps the 50% discount, and the gain after
        it is indexed from the property&rsquo;s value on that date. Nothing is payable until you sell. An investor
        who buys a new build can choose the 50% discount or indexation when
        they sell. The 12 May 2026 cut-off is a negative gearing rule only; it
        does not keep the CGT discount. Our{" "}
        <Link href="/guides/cgt-changes-2026-budget">CGT changes explainer</Link>{" "}
        has the worked examples.
      </p>
      <p>
        Tax deductions at your full marginal rate on rental losses, plus a
        discounted tax rate on the eventual gain, is why negative gearing has
        been so widely used in Australia. Use our{" "}
        <Link href="/cgt-calculator">CGT Calculator</Link> to model the exit
        under the rules that apply before 1 July 2027.
      </p>
      <p>
        Note: depreciation deductions may be subject to recapture at sale for
        the Division 40 (plant and equipment) component. Your accountant can
        advise on the CGT implications of prior depreciation claims.
      </p>

      <h2 id="positive-neutral-negative">Positive vs neutral vs negative gearing</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Cash flow</th>
            <th>Tax impact</th>
            <th>Best for</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>Negative gearing</strong></td><td>Costs exceed income, running at a loss</td><td>Deductions reduce other taxable income</td><td>High-income earners seeking capital growth</td></tr>
          <tr><td><strong>Neutral gearing</strong></td><td>Costs equal income, breakeven</td><td>No net tax impact from property</td><td>Investors wanting capital growth without cash strain</td></tr>
          <tr><td><strong>Positive gearing</strong></td><td>Income exceeds costs, surplus cash</td><td>Rental profit added to taxable income</td><td>Investors wanting income now (e.g., approaching retirement)</td></tr>
        </tbody>
      </table>
      <p>
        High-yield markets (regional towns, mining areas) are more likely to
        produce positive or neutral gearing. Low-yield, high-growth markets
        (inner Sydney, Melbourne) typically produce negative gearing at
        current prices.
      </p>
      <p>
        Use our <Link href="/rental-yield-calculator">Rental Yield Calculator</Link> to
        estimate the gross yield for any property and assess whether it is
        likely to be positively or negatively geared.
      </p>

      <h2 id="risks">Risks of negative gearing</h2>
      <ul>
        <li><strong>Vacancy.</strong> A vacant property earns no rent but still incurs all holding costs. Even a single month&rsquo;s vacancy significantly worsens your cash flow. Landlord insurance with rent default cover can partially mitigate this.</li>
        <li><strong>Interest rate rises.</strong> Since 2022, RBA rate increases have significantly increased interest costs for investors on variable rate loans. A 2% rate rise on a $560,000 loan adds $11,200 a year to costs, potentially turning a manageable loss into a severe one.</li>
        <li><strong>Legislative change.</strong> The rules have just changed: the 2026&ndash;27 Budget package, passed on 25 June 2026, limits negative gearing to new builds and replaces the 50% CGT discount from 1 July 2027 (see below). Parliament can change them again, so a property should still work if the tax benefits shrink further.</li>
        <li><strong>No capital growth.</strong> If the property does not appreciate, the strategy fails, you are left with accumulated losses and no compensating gain.</li>
        <li><strong>Serviceability strain.</strong> If your income drops (job loss, illness), your ability to cover the ongoing loss is compromised. Many investors have been forced to sell at sub-optimal times due to financial pressure.</li>
      </ul>

      <h2 id="still-available">Is negative gearing still available in 2026?</h2>
      <p>
        Yes, for every investor until 30 June 2027. After that it depends on
        when you bought and what. The 2026&ndash;27 Budget package is law: the
        Treasury Laws Amendment (Tax Reform No. 1) Act 2026 passed both Houses
        on 25 June 2026 and received Royal Assent on 26 June 2026. From
        1 July 2027 it limits negative gearing for residential property to new
        builds (ATO, last updated 29 June 2026).
      </p>
      <ul>
        <li><strong>Held at 7:30pm AEST on 12 May 2026</strong>, including under a contract signed but not yet settled: keeps negative gearing for as long as you own it.</li>
        <li><strong>An established home contracted after that time:</strong> can be negatively geared until 30 June 2027. From 1 July 2027 its losses only offset income from residential property, including capital gains on residential property, and the excess carries forward to later years.</li>
        <li><strong>A new build:</strong> keeps negative gearing whenever you buy it, but only the first buyer gets it. The Act leaves the exact definition to a ministerial instrument; the Budget explainer&rsquo;s examples include an off-the-plan apartment, a home built on vacant land and a knock-down that replaces one house with more than one dwelling, but not an extension or a one-for-one rebuild.</li>
        <li><strong>Who it covers:</strong> individuals, partnerships, companies and most trusts. Super funds, including SMSFs, and widely held trusts are excluded.</li>
        <li><strong>Commercial property and shares:</strong> negative gearing is unchanged.</li>
      </ul>
      <p>
        The 50% CGT discount changes on the same date; see{" "}
        <a href="#cgt">the CGT connection</a> above. Parliament can change
        these settings again, so any investment should remain viable if the
        tax benefits were reduced further. Do not invest solely on the basis
        of tax deductions.
      </p>

      <MatchCTA kind="accountant" />

      <h2 id="tax-return">Tax return obligations</h2>
      <p>If you own a rental property, you must:</p>
      <ul>
        <li><strong>Lodge an Australian income tax return each year</strong> you earn rental income, including a rental property schedule.</li>
        <li><strong>Report all rental income</strong> received (including bond money retained, insurance payouts for lost rent).</li>
        <li><strong>Claim all eligible deductions.</strong> You are not required to claim them, but it would be financially irrational not to.</li>
        <li><strong>Maintain records</strong> for all income and expenses for at least 5 years (and for the entire period of ownership for CGT purposes).</li>
        <li><strong>Apportion expenses</strong> if the property was rented for only part of the year or used for personal purposes.</li>
        <li><strong>Report the sale</strong> in the tax return for the year settlement occurred, including the CGT calculation.</li>
      </ul>
      <p>
        Most property investors use a tax agent or accountant who specialises
        in investment properties. The cost of professional tax advice is
        itself a deductible expense.
      </p>

      <Sources items={[...TAX_REFORM_SOURCES, { label: TAX_RATES_SOURCE.name, href: TAX_RATES_SOURCE.url, note: `${TAX_RATES_SOURCE.dated[0].toUpperCase()}${TAX_RATES_SOURCE.dated.slice(1)}. Used in the worked example, before the Medicare levy.` }]} />

      <GuideGlossaryRail
        slugs={[
          "negative-gearing",
          "gearing-positive-negative-neutral",
          "gross-rental-yield",
          "depreciation-property",
        ]}
      />
    </GuideArticleLayout>
  );
}
