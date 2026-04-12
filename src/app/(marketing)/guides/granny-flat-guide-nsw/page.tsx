import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Granny Flat Guide NSW: Rules, Costs & Rental Returns (2026) | ${SITE_NAME}`,
  description:
    "Everything you need to know about building a granny flat in NSW: complying development rules, costs, rental income, and how to maximise your return. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/granny-flat-guide-nsw` },
  openGraph: {
    url: `${SITE_URL}/guides/granny-flat-guide-nsw`,
    title: "Granny Flat Guide NSW: Rules, Costs & Rental Returns (2026)",
    description:
      "Everything you need to know about building a granny flat in NSW: complying development rules, costs, rental income, and how to maximise your return. Updated 2026.",
    type: "article",
  },
};

export default function GrannyFlatGuideNSWPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Granny Flat Guide NSW", url: "/guides/granny-flat-guide-nsw" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Granny Flat Guide NSW" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 8 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Granny Flat Guide NSW: Rules, Costs &amp; Rental Returns (2026)
        </h1>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Important:</strong> Planning rules and costs vary significantly by council area and
          site conditions. Always verify with your local council or a certifier before committing
          to a project. This guide provides general information only.
        </div>

        {/* Key highlight */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-sm text-green-800">
          <strong>NSW advantage:</strong> NSW has the most streamlined approval pathway for granny
          flats (secondary dwellings) in Australia. Properties meeting the minimum criteria can be
          approved as complying development in weeks — without needing council DA approval.
        </div>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#what-is" className="hover:underline">What is a granny flat in NSW?</a></li>
            <li><a href="#complying-dev" className="hover:underline">Complying development: fast-track approval</a></li>
            <li><a href="#requirements" className="hover:underline">Site requirements and setbacks</a></li>
            <li><a href="#costs" className="hover:underline">Building costs</a></li>
            <li><a href="#prefab" className="hover:underline">Prefab and modular options</a></li>
            <li><a href="#rental-returns" className="hover:underline">Rental returns and yield</a></li>
            <li><a href="#approval-pathway" className="hover:underline">Approval pathways: CDC vs DA</a></li>
            <li><a href="#owner-occupier" className="hover:underline">Owner-occupier requirement</a></li>
            <li><a href="#strata" className="hover:underline">Can you sell a granny flat separately?</a></li>
            <li><a href="#finance" className="hover:underline">Financing your granny flat</a></li>
            <li><a href="#property-value" className="hover:underline">Impact on property value</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="what-is" className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is a Granny Flat in NSW?</h2>
          <p className="text-gray-600 mb-4">
            In NSW, a granny flat is formally known as a <strong>secondary dwelling</strong>. It is a
            self-contained dwelling built on the same lot as an existing home (the primary dwelling).
            It must have its own separate entrance, kitchen, bathroom, and living area.
          </p>
          <p className="text-gray-600 mb-4">
            Secondary dwellings in NSW are governed primarily by the <strong>Low Rise Housing
            Diversity Code</strong> (formerly the Affordable Rental Housing SEPP 2009). This
            state-wide code allows granny flats to be approved as complying development on eligible
            lots — bypassing the need for a council development application (DA) in most cases.
          </p>
          <p className="text-gray-600 mb-4">
            The secondary dwelling must be <strong>subordinate</strong> to the main dwelling — it
            cannot be larger or more prominent than the primary home.
          </p>

          <h2 id="complying-dev" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Complying Development: NSW&apos;s Fast-Track Approval</h2>
          <p className="text-gray-600 mb-4">
            NSW is unique in having a state-wide complying development pathway for granny flats.
            Under the Low Rise Housing Diversity Code, granny flats that meet the minimum criteria
            can be approved in <strong>as little as 10–20 days</strong> by a private certifier,
            without needing to go through council.
          </p>
          <p className="text-gray-600 mb-4">
            To qualify as complying development, a secondary dwelling must:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Be located on a residential lot</li>
            <li>Meet the minimum lot size and width requirements (see below)</li>
            <li>Not exceed <strong>60m²</strong> of floor area</li>
            <li>Meet setback and height requirements</li>
            <li>Have separate access to the secondary dwelling</li>
          </ul>
          <p className="text-gray-600 mb-4">
            If your site does not meet these criteria, you may still be able to build a granny flat
            through a council DA — but this takes longer and costs more.
          </p>

          <h2 id="requirements" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Site Requirements and Setbacks</h2>
          <p className="text-gray-600 mb-4">
            The minimum site requirements for complying development under the code:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Lot size:</strong> Minimum <strong>450m²</strong> for a detached secondary
              dwelling.
            </li>
            <li>
              <strong>Lot width:</strong> At least <strong>12 metres</strong>.
            </li>
            <li>
              <strong>Only one secondary dwelling</strong> is permitted per residential lot.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Typical setback requirements for a detached granny flat:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li><strong>Rear setback:</strong> Minimum 3 metres</li>
            <li><strong>Side setback:</strong> Minimum 0.9 metres (may vary by lot size and height)</li>
            <li><strong>Height:</strong> Maximum 8.5 metres (often limited by the zone and council area)</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Note: Individual councils can have additional requirements that sit alongside the state
            code. Always check with a certifier or your council before finalising a design.
          </p>

          <h2 id="costs" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Building Costs</h2>
          <p className="text-gray-600 mb-4">
            The cost of building a granny flat in NSW depends heavily on size, finish, and site
            conditions. Rough ranges for 2025–26:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Type</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Size</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Estimated Cost</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="p-3 border border-gray-200">Studio / 1 bed (basic)</td>
                  <td className="p-3 border border-gray-200">30–40m²</td>
                  <td className="p-3 border border-gray-200">$100,000 – $150,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">1–2 bed (mid-range)</td>
                  <td className="p-3 border border-gray-200">45–55m²</td>
                  <td className="p-3 border border-gray-200">$150,000 – $200,000</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">2 bed (full 60m², premium)</td>
                  <td className="p-3 border border-gray-200">55–60m²</td>
                  <td className="p-3 border border-gray-200">$200,000 – $280,000+</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mb-4">
            Additional costs to budget for:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Certifier fees: $2,000 – $5,000</li>
            <li>Site preparation (demolition, earthworks): $5,000 – $30,000+ depending on slope and access</li>
            <li>Utility connections (power, water, sewer): $5,000 – $20,000</li>
            <li>Landscaping and fencing: $3,000 – $15,000</li>
          </ul>

          <h2 id="prefab" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Prefab and Modular Options</h2>
          <p className="text-gray-600 mb-4">
            Prefabricated (prefab) or modular granny flats are a popular alternative to traditional
            construction. They are built off-site and craned into position, which can significantly
            reduce build time (often 6–12 weeks from order to installation).
          </p>
          <p className="text-gray-600 mb-4">
            Typical costs for prefab granny flats in NSW:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li><strong>Supply and install (basic):</strong> $80,000 – $120,000</li>
            <li><strong>Supply and install (premium):</strong> $120,000 – $180,000+</li>
          </ul>
          <p className="text-gray-600 mb-4">
            These prices typically include the structure, fit-out, and installation but exclude site
            preparation and utility connections. Get at least 3 quotes and check the supplier&apos;s
            track record — quality varies significantly.
          </p>

          <h2 id="rental-returns" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Rental Returns and Yield</h2>
          <p className="text-gray-600 mb-4">
            Granny flats can generate strong rental income, particularly in Sydney and regional NSW.
            Typical weekly rents:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Sydney metro (western suburbs):</strong> $350 – $500/week for a 1–2 bed flat
            </li>
            <li>
              <strong>Sydney metro (inner/northern suburbs):</strong> $450 – $700/week
            </li>
            <li>
              <strong>Regional NSW (larger centres):</strong> $250 – $400/week
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Using a $160,000 construction cost (all-in) and a $450/week rent in a western Sydney
            suburb:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Annual rent: $450 × 52 = $23,400</li>
            <li>Gross yield on construction cost: $23,400 ÷ $160,000 = <strong>14.6%</strong></li>
          </ul>
          <p className="text-gray-600 mb-4">
            This is a gross yield — deduct property management fees (typically 8–10%), insurance,
            and maintenance for net return. Even so, granny flat yields often substantially exceed
            those achievable from a standalone investment property.
          </p>
          <p className="text-gray-600 mb-4">
            Use our{" "}
            <Link href="/rental-yield-calculator" className="text-primary hover:underline">rental yield calculator</Link>{" "}
            to model your specific scenario.
          </p>

          <h2 id="approval-pathway" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Approval Pathways: CDC vs DA</h2>
          <p className="text-gray-600 mb-4">
            There are two main approval pathways in NSW:
          </p>
          <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-3">
            <li>
              <strong>CDC (Complying Development Certificate)</strong> via a private certifier:
              Fastest and cheapest option for eligible sites. Typically 10–20 days to approve.
              No community consultation required. Cost: $2,000 – $5,000 in certifier fees.
            </li>
            <li>
              <strong>DA (Development Application)</strong> via local council:
              Required for sites that don&apos;t meet CDC criteria (e.g. heritage areas, flood-affected
              land, undersized lots with exceptions sought). Takes 2–6 months or more. Higher cost
              and less predictable outcome.
            </li>
          </ol>
          <p className="text-gray-600 mb-4">
            The CDC pathway is almost always preferable where eligible. Engage a certifier early in
            your planning process.
          </p>

          <h2 id="owner-occupier" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Owner-Occupier Requirement</h2>
          <p className="text-gray-600 mb-4">
            <strong>NSW does not require the owner to live on the property</strong> to build or rent
            a granny flat. This makes NSW secondary dwellings attractive as pure investment properties
            — you can build a granny flat on an investment property and rent both dwellings.
          </p>
          <p className="text-gray-600 mb-4">
            This is different from some other states and councils. Always verify with your council or
            certifier.
          </p>

          <h2 id="strata" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Can You Sell a Granny Flat Separately?</h2>
          <p className="text-gray-600 mb-4">
            In NSW, a granny flat <strong>cannot be strata titled separately</strong> and sold as a
            standalone property. The secondary dwelling forms part of the same lot as the primary
            dwelling and must be sold with it.
          </p>
          <p className="text-gray-600 mb-4">
            However, some older properties may have been subdivided to create separate lots — which
            is different from a modern secondary dwelling. Check your title documents if you are
            unsure.
          </p>

          <h2 id="finance" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Financing Your Granny Flat</h2>
          <p className="text-gray-600 mb-4">
            Common financing options for granny flat construction:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Equity release / redraw from existing mortgage:</strong> If you have equity in
              your property, this is typically the cheapest option. Your lender may increase your
              mortgage to fund the construction.
            </li>
            <li>
              <strong>Construction loan:</strong> A separate loan specifically for construction, with
              funds drawn down progressively as building milestones are reached. Typically requires
              a fixed-price building contract.
            </li>
            <li>
              <strong>Personal loan:</strong> Suitable for smaller or lower-cost projects, but
              typically at a higher interest rate than a secured loan.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Speak to a mortgage broker before committing to a construction approach — the financing
            structure can significantly affect your total cost.
          </p>

          <h2 id="property-value" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Impact on Property Value</h2>
          <p className="text-gray-600 mb-4">
            A well-built, self-contained granny flat typically adds significant value to a residential
            property. In good locations (close to transport, amenities), the added value often
            <strong> exceeds the construction cost</strong>.
          </p>
          <p className="text-gray-600 mb-4">
            As a rough guide, a granny flat may add:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>20%–30% more in value than the cost to build (in high-demand suburbs)</li>
            <li>Closer to cost price in lower-demand areas</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Buyers who are looking for rental income or multigenerational living will pay a premium
            for a property with an approved, tenanted secondary dwelling. However, the addition can
            make the property harder to sell to buyers seeking privacy (smaller backyard).
          </p>
          <p className="text-gray-600 mb-4">
            Get a professional valuation before and after construction to understand the full
            financial picture.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Exploring investment options?</strong> Browse{" "}
              <Link href="/buy" className="underline hover:text-blue-900">properties for sale with granny flats</Link>{" "}
              or use our{" "}
              <Link href="/rental-yield-calculator" className="underline hover:text-blue-900">rental yield calculator</Link>{" "}
              to model your potential return.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/granny-flat-guide-vic" className="text-primary hover:underline">Granny Flat Guide Victoria</Link></li>
              <li><Link href="/guides/granny-flat-guide-qld" className="text-primary hover:underline">Granny Flat Guide Queensland</Link></li>
              <li><Link href="/guides/negative-gearing-australia" className="text-primary hover:underline">Negative Gearing Guide</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
