import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Negative Gearing in Australia: How It Works, Tax Benefits & Risks (2026) | ${SITE_NAME}`,
  description:
    "Comprehensive guide to negative gearing in Australia: how it works, what you can deduct, depreciation schedules, CGT interaction, risks, and current legislative status. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/negative-gearing-australia` },
  openGraph: {
    url: `${SITE_URL}/guides/negative-gearing-australia`,
    title: "Negative Gearing in Australia: How It Works, Tax Benefits & Risks (2026)",
    description:
      "How negative gearing works, worked example, deductible expenses, depreciation, CGT interaction, and risks explained clearly. Updated 2026.",
    type: "article",
  },
};

export default function NegativeGearingAustraliaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Negative Gearing in Australia", url: "/guides/negative-gearing-australia" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Negative Gearing in Australia" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <span>Last updated: April 2026</span>
          <span>·</span>
          <span>8 min read</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Negative Gearing in Australia: How It Works, Tax Benefits &amp; Risks (2026)
        </h1>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#what-is" className="hover:underline">What is negative gearing?</a></li>
            <li><a href="#worked-example" className="hover:underline">Worked example</a></li>
            <li><a href="#deductible" className="hover:underline">What expenses are deductible?</a></li>
            <li><a href="#not-deductible" className="hover:underline">What is NOT deductible?</a></li>
            <li><a href="#depreciation" className="hover:underline">Depreciation — the tax benefit most investors miss</a></li>
            <li><a href="#cgt" className="hover:underline">The CGT connection</a></li>
            <li><a href="#positive-neutral-negative" className="hover:underline">Positive vs neutral vs negative gearing</a></li>
            <li><a href="#risks" className="hover:underline">Risks of negative gearing</a></li>
            <li><a href="#still-available" className="hover:underline">Is negative gearing still available?</a></li>
            <li><a href="#tax-return" className="hover:underline">Tax return obligations for rental property owners</a></li>
          </ul>
        </div>

        {/* Tax disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> Tax laws are complex and subject to change. This guide is for educational purposes only. Speak with a registered tax agent for advice specific to your situation.
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="what-is">What Is Negative Gearing?</h2>
          <p>
            Negative gearing occurs when the costs of owning a rental property exceed the rental income it generates — in other words, the property runs at a net loss. In Australia, this net rental loss can be deducted from your other taxable income (such as wages or business income), reducing your overall tax bill.
          </p>
          <p>
            The tax deduction is the mechanism that makes negative gearing attractive: the government effectively subsidises part of your investment loss through reduced income tax. The strategy works best when you are in a high marginal tax bracket and the property is expected to appreciate in value over time, delivering a capital gain that more than offsets the cumulative rental losses.
          </p>
          <p>
            <strong>Key principle:</strong> Negative gearing is not a free lunch. You are genuinely losing money on a cash-flow basis — you are betting that capital growth will deliver a larger long-term gain.
          </p>

          <h2 id="worked-example">How Negative Gearing Works: Worked Example</h2>
          <p>
            Here is a realistic example using a $700,000 investment property with an 80% LVR loan:
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Amount (per year)</th>
                </tr>
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
          </div>
          <p>
            This $11,163 net rental loss is deducted from your other taxable income. The after-tax benefit depends on your marginal tax rate:
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Marginal Tax Rate</th>
                  <th>Annual Tax Saving</th>
                  <th>After-Tax Net Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>19%</td><td>$2,121</td><td>$9,042/year</td></tr>
                <tr><td>32.5%</td><td>$3,628</td><td>$7,535/year</td></tr>
                <tr><td>37%</td><td>$4,130</td><td>$7,033/year</td></tr>
                <tr><td>45%</td><td>$5,023</td><td>$6,140/year</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            At a 37% marginal rate, the investor&apos;s actual out-of-pocket cost of holding this property is roughly $7,033 per year (about $135/week), compared to the apparent $11,163 rental loss. The higher your tax rate, the more the government subsidises your holding costs.
          </p>
          <p>
            If this property grows at 5% per year, it would be worth approximately $1,128,000 after 10 years — a gain of $428,000, well exceeding the cumulative holding costs of approximately $70,330 over the decade.
          </p>

          <h2 id="deductible">What Expenses Are Deductible?</h2>
          <p>
            The ATO allows deductions for most legitimate costs of earning rental income. Deductible expenses include:
          </p>
          <ul>
            <li><strong>Loan interest:</strong> The interest portion of your mortgage repayment. Principal repayments are <em>not</em> deductible.</li>
            <li><strong>Council rates and water rates</strong></li>
            <li><strong>Building and landlord insurance</strong></li>
            <li><strong>Property management fees</strong> — the agent&apos;s management fee and any leasing/letting fees</li>
            <li><strong>Repairs and maintenance:</strong> Costs to restore the property to its original condition (not improvements — see below)</li>
            <li><strong>Pest control, cleaning, and gardening</strong></li>
            <li><strong>Advertising costs</strong> to find tenants</li>
            <li><strong>Depreciation:</strong> On the building (Division 43) and eligible plant and equipment (Division 40) — see below</li>
            <li><strong>Accountant fees</strong> for preparing your rental schedule</li>
            <li><strong>Travel to inspect the property</strong> — note: deductions for travel to residential rental properties were removed from 1 July 2017</li>
            <li><strong>Legal fees</strong> for issues arising from tenancy (not purchase)</li>
            <li><strong>Borrowing costs</strong> (loan establishment fees, mortgage stamp duty, lenders mortgage insurance) — amortised over the loan term (typically 5 years)</li>
          </ul>

          <h2 id="not-deductible">What Is NOT Deductible?</h2>
          <ul>
            <li><strong>Capital improvements:</strong> Adding a new deck, extending a room, or installing a new kitchen are capital improvements — not repairs. They are added to the property&apos;s cost base for CGT purposes, not deducted immediately.</li>
            <li><strong>Purchase costs:</strong> Stamp duty, conveyancing fees, and purchase-related legal fees are capital costs that form part of the cost base — not immediately deductible.</li>
            <li><strong>Principal loan repayments</strong></li>
            <li><strong>Personal use portion:</strong> If you use the property yourself for any period, you must apportion expenses — only the rental income period is deductible</li>
            <li><strong>Rental losses when not genuinely available for rent:</strong> You must be actively trying to rent the property at market rent for deductions to apply</li>
          </ul>

          <h2 id="depreciation">Depreciation: The Tax Benefit Most Investors Miss</h2>
          <p>
            Depreciation is a non-cash deduction — you don&apos;t spend money on it, but you still get a tax deduction. It represents the decline in value of the building and its fixtures over time. For property investors, depreciation is one of the most powerful (and underutilised) deductions available.
          </p>
          <h3>Division 43: Building Allowance</h3>
          <p>
            The ATO allows you to claim 2.5% of the original construction cost of the building each year, for 40 years from when construction was completed. This is called the Division 43 building allowance (or capital works deduction).
          </p>
          <ul>
            <li><strong>Example:</strong> If a property was built for $300,000, you can claim $7,500/year in Division 43 depreciation.</li>
            <li>You can claim this regardless of what you paid for the property — it is based on construction cost, not purchase price.</li>
            <li>Only applies to properties built after 18 July 1985 (the construction date, not the purchase date).</li>
          </ul>
          <h3>Division 40: Plant &amp; Equipment</h3>
          <p>
            Separate from the building itself, you can claim depreciation on individual &ldquo;plant and equipment&rdquo; assets in the property. Each item has a useful life, and you claim depreciation on it over that period.
          </p>
          <ul>
            <li>Examples: dishwashers, ovens, air conditioning units, hot water systems, carpet, blinds, ceiling fans, smoke alarms</li>
            <li>Each item has an ATO-assigned effective life (e.g., carpet: 8 years; air conditioning: 10 years; dishwasher: 7 years)</li>
            <li>Important: From 1 July 2017, second-hand plant and equipment in a previously used residential property is generally <em>not</em> deductible for individual investors. This applies to established properties — new properties and commercial properties are unaffected.</li>
          </ul>
          <h3>Quantity Surveyor Report</h3>
          <p>
            To claim Division 43 and Division 40 depreciation, you need a depreciation schedule prepared by a registered quantity surveyor. Cost: typically $500–$800 for a standard residential property.
          </p>
          <p>
            This is almost always worth the cost. For a new property worth $700,000 with construction cost of $300,000, Division 43 alone delivers $7,500/year in deductions — at a 37% marginal rate, that is $2,775 in annual tax savings. The quantity surveyor report pays for itself in the first year.
          </p>

          <h2 id="cgt">The CGT Connection: How Negative Gearing Interacts With the 50% CGT Discount</h2>
          <p>
            Negative gearing is most effective when the strategy eventually results in a capital gain. When you sell the investment property, you will pay Capital Gains Tax (CGT) on the profit. However, if you hold the property for more than 12 months, you are entitled to a 50% CGT discount on the gain — meaning only half of the capital gain is included in your assessable income.
          </p>
          <p>
            <strong>Example:</strong> You buy for $700,000 and sell for $1,000,000 after 10 years. Capital gain: $300,000 (less any capital improvements and selling costs). With the 50% CGT discount, only $150,000 is added to your taxable income in the year of sale.
          </p>
          <p>
            This combination — tax deductions at your full marginal rate on rental losses, plus a 50% CGT discount on the eventual gain — is why negative gearing is so widely used in Australia. Critics argue it inflates property prices; proponents argue it incentivises the supply of rental properties. As of 2026, it remains a legal and fully operational strategy.
          </p>
          <p>
            Note: Depreciation deductions may be subject to recapture at sale for the Division 40 (plant and equipment) component. Your accountant can advise on the CGT implications of prior depreciation claims.
          </p>

          <h2 id="positive-neutral-negative">Positive vs Neutral vs Negative Gearing</h2>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Cash Flow</th>
                  <th>Tax Impact</th>
                  <th>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Negative gearing</strong></td>
                  <td>Costs exceed income — running at a loss</td>
                  <td>Deductions reduce other taxable income</td>
                  <td>High-income earners seeking capital growth</td>
                </tr>
                <tr>
                  <td><strong>Neutral gearing</strong></td>
                  <td>Costs equal income — breakeven</td>
                  <td>No net tax impact from property</td>
                  <td>Investors wanting capital growth without cash strain</td>
                </tr>
                <tr>
                  <td><strong>Positive gearing</strong></td>
                  <td>Income exceeds costs — surplus cash</td>
                  <td>Rental profit added to taxable income</td>
                  <td>Investors wanting income now (e.g., approaching retirement)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            High-yield markets (regional towns, mining areas) are more likely to produce positive or neutral gearing. Low-yield, high-growth markets (inner Sydney, Melbourne) typically produce negative gearing at current prices.
          </p>
          <p>
            Use our <Link href="/rental-yield-calculator" className="text-primary hover:underline">Rental Yield Calculator</Link> to estimate the gross yield for any property and assess whether it is likely to be positively or negatively geared.
          </p>

          <h2 id="risks">Risks of Negative Gearing</h2>
          <p>
            Negative gearing is not a risk-free strategy. Key risks include:
          </p>
          <ul>
            <li><strong>Vacancy:</strong> A vacant property earns no rent but still incurs all holding costs. Even a single month&apos;s vacancy significantly worsens your cash flow. Landlord insurance with rent default cover can partially mitigate this.</li>
            <li><strong>Interest rate rises:</strong> Since 2022, the RBA&apos;s rate increases have significantly increased interest costs for investors on variable rate loans. A 2% rate rise on a $560,000 loan adds $11,200/year to costs — potentially turning a manageable loss into a severe one.</li>
            <li><strong>Legislative change:</strong> The ATO or Government could change the rules on negative gearing or the CGT discount. Labor proposed limiting negative gearing to new properties in 2019 (the policy did not pass — see below). There is no guarantee current rules will remain unchanged.</li>
            <li><strong>No capital growth:</strong> If the property does not appreciate, the strategy fails — you are left with accumulated losses and no compensating gain.</li>
            <li><strong>Serviceability strain:</strong> If your income drops (job loss, illness), your ability to cover the ongoing loss is compromised. Many investors have been forced to sell at sub-optimal times due to financial pressure.</li>
          </ul>

          <h2 id="still-available">Is Negative Gearing Still Available in 2026?</h2>
          <p>
            Yes. Negative gearing on investment properties remains fully available and unchanged in Australia as of April 2026.
          </p>
          <p>
            The most significant political threat to negative gearing was the Labor Party&apos;s 2019 election policy to limit negative gearing to new properties only (with existing negatively geared properties grandfathered). Labor lost the 2019 election, and the policy was subsequently abandoned. No major party currently has a policy to remove or substantially limit negative gearing.
          </p>
          <p>
            The 50% CGT discount for assets held more than 12 months also remains unchanged.
          </p>
          <p>
            However, government policy can change. Any investor relying on the continuation of these tax settings should have an investment strategy that remains viable even if the tax benefits were reduced. Do not invest solely on the basis of tax deductions.
          </p>

          <h2 id="tax-return">Tax Return Obligations for Rental Property Owners</h2>
          <p>
            If you own a rental property, you must:
          </p>
          <ul>
            <li><strong>Lodge an Australian income tax return each year</strong> you earn rental income, including a rental property schedule</li>
            <li><strong>Report all rental income</strong> received (including bond money retained, insurance payouts for lost rent)</li>
            <li><strong>Claim all eligible deductions</strong> — you are not required to claim them, but it would be financially irrational not to</li>
            <li><strong>Maintain records</strong> for all income and expenses for at least 5 years (and for the entire period of ownership for CGT purposes)</li>
            <li><strong>Apportion expenses</strong> if the property was rented for only part of the year or used for personal purposes</li>
            <li><strong>Report the sale</strong> in the tax return for the year settlement occurred, including the CGT calculation</li>
          </ul>
          <p>
            Most property investors use a tax agent or accountant who specialises in investment properties. The cost of professional tax advice is itself a deductible expense. For a property with multiple deductions (including depreciation), the accountant fee is typically well worth it.
          </p>

        </div>
      </div>
    </div>
  );
}
