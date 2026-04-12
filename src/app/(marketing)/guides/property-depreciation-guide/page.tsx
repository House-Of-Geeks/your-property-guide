import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Property Depreciation: How Investors Maximise Tax Deductions (2026) | ${SITE_NAME}`,
  description:
    "Complete guide to property depreciation for Australian investors. Division 40 and Division 43, who can claim, the 2017 rules change, quantity surveyor reports, worked examples, and how to claim in your tax return. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/property-depreciation-guide` },
  openGraph: {
    url: `${SITE_URL}/guides/property-depreciation-guide`,
    title: "Property Depreciation: How Investors Maximise Tax Deductions (2026)",
    description:
      "Complete guide to property depreciation for Australian investors. Division 40 and Division 43, who can claim, the 2017 rules change, quantity surveyor reports, worked examples, and how to claim in your tax return. Updated 2026.",
    type: "article",
  },
};

export default function PropertyDepreciationGuidePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Property Depreciation Guide", url: "/guides/property-depreciation-guide" },
        ]}
      />
      <GuideArticleJsonLd
        title="Property Depreciation: How Investors Maximise Tax Deductions (2026)"
        description="Complete guide to property depreciation for Australian investors. Division 40 and Division 43, who can claim, the 2017 rules change, quantity surveyor reports, worked examples, and how to claim in your tax return. Updated 2026."
        url="/guides/property-depreciation-guide"
        datePublished="2026-04-01"
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Property Depreciation Guide" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 7 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Property Depreciation: How Investors Maximise Tax Deductions (2026)
        </h1>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> This guide provides general information only and is not
          tax advice. Depreciation rules are complex and have changed over time — always consult
          a registered tax agent or accountant before claiming depreciation deductions. Quantity
          surveyor reports should be prepared by a qualified ATO-recognised QS.
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#what-is" className="hover:underline">What is property depreciation?</a></li>
            <li><a href="#div-43" className="hover:underline">Division 43: capital works deduction</a></li>
            <li><a href="#div-40" className="hover:underline">Division 40: plant and equipment</a></li>
            <li><a href="#who-can-claim" className="hover:underline">Who can claim depreciation?</a></li>
            <li><a href="#2017-change" className="hover:underline">The 2017 rule change: second-hand plant and equipment</a></li>
            <li><a href="#qs-report" className="hover:underline">Quantity surveyor report</a></li>
            <li><a href="#worked-example" className="hover:underline">Worked example</a></li>
            <li><a href="#new-vs-established" className="hover:underline">New vs established properties</a></li>
            <li><a href="#how-to-claim" className="hover:underline">How to claim in your tax return</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="what-is" className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is Property Depreciation?</h2>
          <p className="text-gray-600 mb-4">
            In Australia, investment property owners can claim a tax deduction for the gradual
            wear and tear of a property&apos;s structure and its internal fittings. This is called
            <strong> depreciation</strong> — and it is one of the most valuable (and commonly
            overlooked) tax deductions available to property investors.
          </p>
          <p className="text-gray-600 mb-4">
            Depreciation is a <em>non-cash deduction</em> — you do not physically spend money
            to claim it. The ATO allows you to deduct the theoretical decline in value of the
            property&apos;s components over time, reducing your taxable income and therefore your
            annual tax bill.
          </p>
          <p className="text-gray-600 mb-4">
            There are two categories of property depreciation:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li><strong>Division 43</strong> — Capital Works Deduction (building structure)</li>
            <li><strong>Division 40</strong> — Plant and Equipment (removable fixtures and fittings)</li>
          </ul>

          <h2 id="div-43" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Division 43: Capital Works Deduction</h2>
          <p className="text-gray-600 mb-4">
            <strong>Division 43</strong> covers the structural components of the building itself —
            walls, floors, roof, windows, built-in wardrobes, plumbing, wiring within the structure,
            and other permanent components.
          </p>
          <p className="text-gray-600 mb-4">
            Key rules for Division 43:
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <ul className="text-sm text-blue-800 space-y-1">
              <li><strong>Rate:</strong> 2.5% per year for 40 years from the date of construction</li>
              <li><strong>Eligibility cutoff:</strong> Only properties with construction commenced after 16 September 1987 qualify</li>
              <li><strong>Based on:</strong> Original construction cost (not purchase price)</li>
              <li><strong>Claimed by:</strong> Any investor owning a rental property, regardless of whether it was new or established when purchased</li>
            </ul>
          </div>

          <p className="text-gray-600 mb-4">
            Example: A residential property built in 2010 with construction costs of $400,000:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Annual Division 43 deduction: $400,000 × 2.5% = <strong>$10,000/year</strong></li>
            <li>Available for 40 years from construction commencement</li>
            <li>Remaining years available depends on construction date and when you purchased</li>
          </ul>
          <p className="text-gray-600 mb-4">
            If you buy an established property, you inherit the remaining depreciation life.
            For example, if the building is 15 years old when you buy it, you have approximately
            25 years of Division 43 deductions remaining. A quantity surveyor can calculate
            the precise deductible amount.
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Properties built before 16 September 1987</strong> are not eligible for
            Division 43 deductions, regardless of when you purchased them. This excludes many
            older inner-city terrace houses, period homes, and pre-war properties.
          </p>

          <h2 id="div-40" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Division 40: Plant and Equipment</h2>
          <p className="text-gray-600 mb-4">
            <strong>Division 40</strong> covers assets that can be physically removed from the
            property — items that are not structurally part of the building. Common examples:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Asset</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Effective life</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Category</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="p-3 border border-gray-200">Carpet</td>
                  <td className="p-3 border border-gray-200">10 years</td>
                  <td className="p-3 border border-gray-200">Division 40</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Blinds and curtains</td>
                  <td className="p-3 border border-gray-200">6 years</td>
                  <td className="p-3 border border-gray-200">Division 40</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Hot water system</td>
                  <td className="p-3 border border-gray-200">12 years</td>
                  <td className="p-3 border border-gray-200">Division 40</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Air conditioning unit</td>
                  <td className="p-3 border border-gray-200">10 years</td>
                  <td className="p-3 border border-gray-200">Division 40</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Oven and cooktop</td>
                  <td className="p-3 border border-gray-200">12 years</td>
                  <td className="p-3 border border-gray-200">Division 40</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Dishwasher</td>
                  <td className="p-3 border border-gray-200">10 years</td>
                  <td className="p-3 border border-gray-200">Division 40</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Ceiling fans</td>
                  <td className="p-3 border border-gray-200">15 years</td>
                  <td className="p-3 border border-gray-200">Division 40</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Solar panels</td>
                  <td className="p-3 border border-gray-200">20 years</td>
                  <td className="p-3 border border-gray-200">Division 40</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mb-4">
            The ATO sets the effective life for each asset type. Depreciation can be claimed
            using either the <em>diminishing value method</em> (front-loaded, higher deductions
            in early years) or the <em>prime cost method</em> (straight-line, equal deductions
            each year). The diminishing value method generally provides higher early-year deductions
            and is used by most investors.
          </p>

          <h2 id="who-can-claim" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Who Can Claim Depreciation?</h2>
          <p className="text-gray-600 mb-4">
            Any investor who:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Owns a rental property (or property available for rent)</li>
            <li>Derives rental income from the property</li>
            <li>Has an eligible property (construction commenced after 16 September 1987 for Division 43)</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Importantly, depreciation is only available on investment properties — not your
            own home (principal place of residence). If a property switches between personal
            use and investment use, the depreciation entitlement is adjusted proportionally.
          </p>

          <h2 id="2017-change" className="text-2xl font-bold text-gray-900 mt-8 mb-4">The 2017 Rule Change: Second-Hand Plant and Equipment</h2>
          <p className="text-gray-600 mb-4">
            A significant rule change took effect on <strong>9 May 2017</strong> (Budget night)
            that affects Division 40 claims on <em>existing</em> (second-hand) properties.
          </p>
          <p className="text-gray-600 mb-4">
            Under the new rules:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>If you purchased an established residential property after 9 May 2017:</strong>
              You cannot claim Division 40 depreciation on the <em>existing</em> plant and
              equipment in the property (carpet, blinds, appliances, etc.) unless you installed
              them yourself as new assets.
            </li>
            <li>
              <strong>New plant and equipment you purchase and install yourself</strong> (after
              buying the property) can still be depreciated under Division 40.
            </li>
            <li>
              <strong>Division 43 (capital works) is unaffected</strong> by this rule change —
              you can still claim 2.5% on the original construction cost regardless of when you
              purchased the property.
            </li>
            <li>
              <strong>New properties are unaffected</strong> — if you buy a brand new property
              (from the developer, never previously occupied as a residence), you can claim
              Division 40 on all plant and equipment.
            </li>
          </ul>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">Summary: who can claim Division 40?</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2 font-semibold text-gray-700 border border-gray-200">Scenario</th>
                    <th className="text-left p-2 font-semibold text-gray-700 border border-gray-200">Division 40 on existing P&amp;E?</th>
                    <th className="text-left p-2 font-semibold text-gray-700 border border-gray-200">Division 40 on new P&amp;E you install?</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr>
                    <td className="p-2 border border-gray-200">New property (never occupied)</td>
                    <td className="p-2 border border-gray-200 text-green-700 font-medium">Yes</td>
                    <td className="p-2 border border-gray-200 text-green-700 font-medium">Yes</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border border-gray-200">Established property — purchased before 9 May 2017</td>
                    <td className="p-2 border border-gray-200 text-green-700 font-medium">Yes (grandfathered)</td>
                    <td className="p-2 border border-gray-200 text-green-700 font-medium">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200">Established property — purchased after 9 May 2017</td>
                    <td className="p-2 border border-gray-200 text-red-700 font-medium">No</td>
                    <td className="p-2 border border-gray-200 text-green-700 font-medium">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h2 id="qs-report" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Quantity Surveyor Report</h2>
          <p className="text-gray-600 mb-4">
            A <strong>tax depreciation schedule</strong> prepared by a qualified Quantity
            Surveyor (QS) is the standard way to maximise and substantiate your depreciation
            claims. The ATO accepts QS reports as evidence of the cost of capital works and
            the value of plant and equipment.
          </p>
          <p className="text-gray-600 mb-4">
            What a depreciation schedule includes:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Estimated original construction cost (for Division 43)</li>
            <li>Itemised list of plant and equipment with values and effective lives (for Division 40)</li>
            <li>Year-by-year depreciation schedule for the next 40 years</li>
            <li>Both diminishing value and prime cost methods shown</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Cost of a QS depreciation schedule:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li><strong>Residential properties:</strong> $500 – $800 for an initial schedule</li>
            <li><strong>Commercial properties:</strong> $700 – $1,500+</li>
          </ul>
          <p className="text-gray-600 mb-4">
            The QS fee itself is tax deductible as an expense of managing your investment property.
            Given that the schedule can generate tens of thousands of dollars in deductions over
            its lifetime, the cost is almost always worth it.
          </p>
          <p className="text-gray-600 mb-4">
            Well-known ATO-recognised QS firms include BMT Tax Depreciation, Washington Brown,
            and MCG Quantity Surveyors — but there are many others. Your accountant or property
            manager can usually recommend a local firm.
          </p>

          <h2 id="worked-example" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Worked Example</h2>
          <p className="text-gray-600 mb-4">
            <strong>Scenario:</strong> An investor purchases a new 3-bedroom house in 2026 for
            $650,000. The land is valued at $280,000 and the construction cost is $370,000.
            The property is rented at $650/week and generates $33,800 per year in rental income.
            The investor earns $150,000 from their job and is in the 37% tax bracket.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Year 1 depreciation deductions</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody className="text-gray-600">
                  <tr>
                    <td className="p-2 border border-gray-200">Division 43 (capital works)</td>
                    <td className="p-2 border border-gray-200">$370,000 × 2.5%</td>
                    <td className="p-2 border border-gray-200 font-semibold">$9,250</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border border-gray-200">Division 40 — carpet ($15,000 at DV 20%)</td>
                    <td className="p-2 border border-gray-200">$15,000 × 20%</td>
                    <td className="p-2 border border-gray-200 font-semibold">$3,000</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200">Division 40 — hot water, appliances, etc. ($12,000 at DV 18%)</td>
                    <td className="p-2 border border-gray-200">$12,000 × 18%</td>
                    <td className="p-2 border border-gray-200 font-semibold">$2,160</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border border-gray-200">Division 40 — blinds ($3,000 at DV 25%)</td>
                    <td className="p-2 border border-gray-200">$3,000 × 25%</td>
                    <td className="p-2 border border-gray-200 font-semibold">$750</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="p-2 border border-gray-200 font-semibold">Total depreciation deductions — Year 1</td>
                    <td className="p-2 border border-gray-200"></td>
                    <td className="p-2 border border-gray-200 font-bold text-green-700">$15,160</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-700 font-semibold mb-1">Tax saving:</p>
              <p className="text-sm text-gray-600">$15,160 × 37% = <strong className="text-green-700">$5,609 tax saving in Year 1</strong></p>
            </div>
          </div>

          <p className="text-gray-600 mb-4">
            Over the 40-year life of the property, the cumulative Division 43 deductions alone
            would total $370,000 (i.e. the full construction cost). At a 37% marginal rate,
            that represents $136,900 in total tax savings — from a single non-cash deduction.
          </p>

          <h2 id="new-vs-established" className="text-2xl font-bold text-gray-900 mt-8 mb-4">New vs Established Properties</h2>
          <p className="text-gray-600 mb-4">
            New properties offer significantly higher depreciation deductions than established
            properties, for several reasons:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Full Division 43 remaining:</strong> A new property has the full 40-year
              capital works schedule ahead of it. An established 20-year-old property has only
              20 years remaining (and therefore half the deductible life).
            </li>
            <li>
              <strong>Full Division 40 available:</strong> New properties allow Division 40
              claims on all plant and equipment. Established properties purchased after 9 May 2017
              cannot claim Division 40 on existing assets.
            </li>
            <li>
              <strong>Higher construction costs:</strong> Recently built properties generally
              have higher construction costs (due to inflation and higher building standards),
              resulting in higher Division 43 deductions.
            </li>
          </ul>

          <h2 id="how-to-claim" className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Claim in Your Tax Return</h2>
          <p className="text-gray-600 mb-4">
            Depreciation deductions are claimed in your annual income tax return under the
            &quot;rental income and expenses&quot; section:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Division 43</strong> is typically claimed as &quot;Capital works deductions&quot;
              in the rental schedule.
            </li>
            <li>
              <strong>Division 40</strong> is claimed as &quot;Decline in value of depreciating assets&quot;.
            </li>
            <li>
              Your QS depreciation schedule shows the exact amounts to claim for each year.
            </li>
            <li>
              Your tax agent will use these figures when preparing your return.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Depreciation can also convert a positively geared property into a negatively geared
            one on paper — creating a tax loss that can be offset against your other income.
            This is one of the core mechanisms behind negative gearing tax benefits. See our{" "}
            <Link href="/guides/negative-gearing-australia" className="text-primary hover:underline">Negative Gearing Guide</Link>{" "}
            for more detail.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Ready to invest?</strong> Browse{" "}
              <Link href="/buy" className="underline hover:text-blue-900">investment properties for sale</Link>{" "}
              or use our{" "}
              <Link href="/rental-yield-calculator" className="underline hover:text-blue-900">rental yield calculator</Link>{" "}
              to model your returns.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/negative-gearing-australia" className="text-primary hover:underline">Negative Gearing Guide</Link></li>
              <li><Link href="/guides/smsf-property-guide" className="text-primary hover:underline">SMSF Property Guide</Link></li>
              <li><Link href="/guides/granny-flat-guide-nsw" className="text-primary hover:underline">Granny Flat Guide NSW</Link></li>
              <li><Link href="/guides/buying-property-australia" className="text-primary hover:underline">Buying Property in Australia</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
