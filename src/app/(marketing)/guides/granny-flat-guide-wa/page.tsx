import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Granny Flat Guide Western Australia: Rules, Costs & Approvals (2026) | ${SITE_NAME}`,
  description:
    "Complete guide to building a granny flat (ancillary dwelling) in Western Australia. R-Code requirements, lot sizes, building permit process, owner-occupier rules, costs $80k–$200k, and Perth rental demand. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/granny-flat-guide-wa` },
  openGraph: {
    url: `${SITE_URL}/guides/granny-flat-guide-wa`,
    title: "Granny Flat Guide Western Australia: Rules, Costs & Approvals (2026)",
    description:
      "Complete guide to building a granny flat (ancillary dwelling) in Western Australia. R-Code requirements, lot sizes, building permit process, owner-occupier rules, costs $80k–$200k, and Perth rental demand. Updated 2026.",
    type: "article",
  },
};

export default function GrannyFlatGuideWAPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Granny Flat Guide WA", url: "/guides/granny-flat-guide-wa" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Granny Flat Guide WA" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 9 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Granny Flat Guide Western Australia: Rules, Costs &amp; Approvals (2026)
        </h1>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> This guide provides general information only. Planning and
          building rules in WA vary by council and zoning. Always confirm requirements with your
          local council and the Western Australian Planning Commission (WAPC) before proceeding.
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#what-is" className="hover:underline">What is an ancillary dwelling in WA?</a></li>
            <li><a href="#r-codes" className="hover:underline">R-Code requirements</a></li>
            <li><a href="#owner-occupier" className="hover:underline">Owner-occupier requirement</a></li>
            <li><a href="#approval-process" className="hover:underline">Approval process: building permit</a></li>
            <li><a href="#costs" className="hover:underline">Costs of building a granny flat in WA</a></li>
            <li><a href="#rental-income" className="hover:underline">Rental income potential in Perth</a></li>
            <li><a href="#popular-areas" className="hover:underline">Popular areas for granny flats in Perth</a></li>
            <li><a href="#tips" className="hover:underline">Practical tips for WA granny flat owners</a></li>
            <li><a href="#resources" className="hover:underline">Resources</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="what-is" className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is an Ancillary Dwelling in WA?</h2>
          <p className="text-gray-600 mb-4">
            In Western Australia, what is commonly called a &quot;granny flat&quot; is officially known as an
            <strong> ancillary dwelling</strong> (sometimes called a secondary dwelling). It is a
            self-contained dwelling on the same lot as a primary residence, typically smaller than
            the main house and designed for a family member, carer, or tenant.
          </p>
          <p className="text-gray-600 mb-4">
            Ancillary dwellings are regulated under the <strong>Residential Design Codes (R-Codes)</strong>
            — WA&apos;s state-wide planning framework — as well as local council planning policies. The
            R-Codes set out the minimum lot sizes, maximum floor areas, and setback requirements
            that an ancillary dwelling must meet.
          </p>
          <p className="text-gray-600 mb-4">
            WA does not have a fast-track complying development pathway like NSW&apos;s CDC system. All
            ancillary dwellings in WA require a <strong>building permit</strong> and, in some cases,
            a development application (planning approval) from the local council.
          </p>

          <h2 id="r-codes" className="text-2xl font-bold text-gray-900 mt-8 mb-4">R-Code Requirements</h2>
          <p className="text-gray-600 mb-4">
            The WA Residential Design Codes set the key parameters for ancillary dwellings. The
            requirements depend primarily on your lot size and zoning:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Lot size</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Maximum ancillary dwelling size</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Notes</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="p-3 border border-gray-200">Under 350m²</td>
                  <td className="p-3 border border-gray-200">70m²</td>
                  <td className="p-3 border border-gray-200">R20+ zone generally required</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">350m² – 500m²</td>
                  <td className="p-3 border border-gray-200">70m²</td>
                  <td className="p-3 border border-gray-200">Subject to setback and lot coverage rules</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Over 500m²</td>
                  <td className="p-3 border border-gray-200">Up to 100m²</td>
                  <td className="p-3 border border-gray-200">Larger lots may allow larger ancillary dwellings</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mb-4">
            Key R-Code requirements to be aware of:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Minimum lot size:</strong> Ancillary dwellings are generally permitted in
              R20 and higher density zones. R20 zoning typically requires a minimum lot size of
              around 660m² for subdivision but lower for ancillary dwellings. Check your specific
              zone with your local council.
            </li>
            <li>
              <strong>Floor area cap:</strong> Maximum 70m² for most lots (under 500m²) and
              up to 100m² for larger lots. This is the internal living area including bathroom
              and kitchen.
            </li>
            <li>
              <strong>Setbacks:</strong> The ancillary dwelling must comply with setback
              requirements from the side boundaries, rear boundary, and the primary dwelling.
              These vary by zone.
            </li>
            <li>
              <strong>Lot coverage:</strong> The combined coverage of all structures on the
              lot (main house plus ancillary dwelling plus outbuildings) must not exceed the
              maximum permissible lot coverage for the zone.
            </li>
            <li>
              <strong>Parking:</strong> One car bay may need to be provided for the ancillary
              dwelling in addition to those already required for the main house.
            </li>
            <li>
              <strong>Utilities:</strong> The ancillary dwelling must have a separate or
              separately metered electricity and water connection.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Always confirm requirements with your specific local council (e.g. City of Perth,
            City of Stirling, City of Joondalup) as some councils have additional local planning
            policies that overlay the state R-Codes.
          </p>

          <h2 id="owner-occupier" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Owner-Occupier Requirement</h2>
          <p className="text-gray-600 mb-4">
            This is a critical difference between WA and NSW or Queensland: in most WA council
            areas, <strong>one of the two dwellings on the lot must be owner-occupied</strong>.
            You cannot own a property with an ancillary dwelling as a pure investment (i.e. rent
            out both the main house and the granny flat) in most areas.
          </p>
          <p className="text-gray-600 mb-4">
            The owner-occupier requirement:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Typically means the registered owner of the property must reside in either the main house or the ancillary dwelling</li>
            <li>Applies even if you are building the ancillary dwelling to house a family member</li>
            <li>Is enforced through the planning approval and conditions on the building permit</li>
            <li>Some councils may have exceptions or different rules — always verify</li>
          </ul>
          <p className="text-gray-600 mb-4">
            This requirement means that WA granny flats are primarily suited to owner-occupiers
            who want to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>House a family member (elderly parent, adult child) while living on the same property</li>
            <li>Generate rental income from the ancillary dwelling while continuing to live in the main house</li>
            <li>Create multi-generational living arrangements</li>
          </ul>

          <h2 id="approval-process" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Approval Process: Building Permit</h2>
          <p className="text-gray-600 mb-4">
            Unlike NSW&apos;s Complying Development Certificate (CDC) pathway — which allows granny
            flats to be approved by a private certifier without council involvement — WA requires
            a <strong>building permit</strong> for all ancillary dwellings, processed through
            your local council or a registered building surveyor.
          </p>
          <p className="text-gray-600 mb-4">
            The approval process in WA generally involves:
          </p>

          <div className="space-y-3 mb-6">
            {[
              { step: "1", title: "Pre-application research", desc: "Confirm your lot&apos;s zone, R-Code, and whether your council has additional local planning policies. Check if a planning approval (development application) is required in addition to a building permit." },
              { step: "2", title: "Engage a designer or draftsperson", desc: "Have architectural drawings prepared that demonstrate compliance with the R-Codes and local requirements. For standard ancillary dwellings, a draftsperson is usually sufficient — you may not need a full architect." },
              { step: "3", title: "Submit development application (if required)", desc: "Some councils require a development application (DA) before the building permit stage, particularly if the proposal triggers discretionary assessment criteria. Processing time: 30–60 days." },
              { step: "4", title: "Submit building permit application", desc: "Lodge with your local council or a registered building surveyor. Include plans, specifications, and a site plan showing setbacks. Processing: typically 10–25 business days." },
              { step: "5", title: "Commence construction", desc: "Do not start construction without an approved building permit. Inspections are required at key stages (e.g. footings, frame, completion)." },
              { step: "6", title: "Final inspection and occupancy", desc: "A final building inspection confirms compliance. The ancillary dwelling can then be occupied." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">{item.step}</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 id="costs" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Costs of Building a Granny Flat in WA</h2>
          <p className="text-gray-600 mb-4">
            Building costs in WA vary significantly depending on the size of the ancillary
            dwelling, the level of finish, and the complexity of site works required.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Item</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Typical cost range</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="p-3 border border-gray-200">Design and drafting</td>
                  <td className="p-3 border border-gray-200">$3,000 – $8,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Council fees (DA + building permit)</td>
                  <td className="p-3 border border-gray-200">$2,000 – $5,000</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Site works (slab, drainage, services)</td>
                  <td className="p-3 border border-gray-200">$15,000 – $40,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Construction (50–70m² ancillary dwelling)</td>
                  <td className="p-3 border border-gray-200">$80,000 – $160,000</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Landscaping and fencing</td>
                  <td className="p-3 border border-gray-200">$5,000 – $15,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200"><strong>Total estimated cost</strong></td>
                  <td className="p-3 border border-gray-200"><strong>$80,000 – $200,000+</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mb-4">
            Prefabricated or modular ancillary dwellings can reduce construction time and cost.
            Several WA-based suppliers offer complete modular units in the $70,000–$130,000 range
            (plus site preparation and installation). Always ensure any prefab supplier&apos;s design
            is pre-certified for WA building codes.
          </p>

          <h2 id="rental-income" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Rental Income Potential in Perth</h2>
          <p className="text-gray-600 mb-4">
            Perth&apos;s rental market has been exceptionally tight since 2022, with vacancy rates
            consistently below 1% across most suburbs. This has driven strong rental demand for
            ancillary dwellings as well as traditional rentals.
          </p>
          <p className="text-gray-600 mb-4">
            Typical rental income for a 1–2 bedroom ancillary dwelling in Perth (2026):
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Inner Perth suburbs (5–10km from CBD): <strong>$450 – $600/week</strong></li>
            <li>Middle ring suburbs (10–20km from CBD): <strong>$380 – $500/week</strong></li>
            <li>Outer suburbs: <strong>$300 – $420/week</strong></li>
            <li>Coastal suburbs (Fremantle, Cottesloe, Scarborough): <strong>$450 – $650/week</strong></li>
          </ul>
          <p className="text-gray-600 mb-4">
            Using a conservative rental income of $400/week, an ancillary dwelling generating
            $20,800/year gross income would provide a gross yield of approximately 13–20% on
            a $100,000–$150,000 construction cost. Even allowing for expenses (rates, insurance,
            maintenance), the returns can be compelling.
          </p>

          <h2 id="popular-areas" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Popular Areas for Granny Flats in Perth</h2>
          <p className="text-gray-600 mb-4">
            The best areas for ancillary dwellings in Perth combine:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li><strong>Suitable zoning:</strong> R20+ zones with adequate lot sizes</li>
            <li><strong>Strong rental demand:</strong> Near universities, hospitals, train stations</li>
            <li><strong>Owner demographics:</strong> Areas with higher rates of long-term owner-occupancy</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Popular areas include: Morley, Balga, Midland, Victoria Park, Belmont, Cannington,
            and Gosnells in the middle ring; coastal suburbs like Fremantle, Hamilton Hill, and
            Beaconsfield; and established inner suburbs like Mount Lawley, Northbridge, and Bayswater.
          </p>

          <h2 id="tips" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Practical Tips for WA Granny Flat Owners</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Check your title first:</strong> Some properties in WA have title restrictions
              (e.g. developer covenants) that prohibit secondary dwellings. Your conveyancer or
              the Landgate website can check this before you invest in plans.
            </li>
            <li>
              <strong>Strata title:</strong> If your property is part of a strata scheme, separate
              strata approval from the strata company may be required in addition to council approval.
            </li>
            <li>
              <strong>Tax implications:</strong> Rental income from an ancillary dwelling is taxable.
              Consult an accountant about depreciation claims, which can offset a significant portion
              of income in the early years.
            </li>
            <li>
              <strong>Insurance:</strong> Update your building insurance to cover the ancillary
              dwelling and consider landlord insurance for the rental component.
            </li>
            <li>
              <strong>Tenancy laws:</strong> As a landlord, you are bound by the{" "}
              <Link href="/guides/renters-rights-wa" className="text-primary hover:underline">WA Residential Tenancies Act</Link>.
              Understand your obligations before renting out the dwelling.
            </li>
          </ul>

          <h2 id="resources" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resources</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Western Australian Planning Commission (WAPC)</strong>:{" "}
              <a href="https://www.wa.gov.au/organisation/western-australian-planning-commission" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">wa.gov.au</a>
            </li>
            <li>
              <strong>Department of Planning, Lands and Heritage WA</strong> — R-Codes:{" "}
              <a href="https://www.dplh.wa.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">dplh.wa.gov.au</a>
            </li>
            <li>
              <strong>Landgate</strong> — Property title and land information:{" "}
              <a href="https://www.landgate.wa.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">landgate.wa.gov.au</a>
            </li>
            <li>
              <strong>Building Commission WA</strong> — Building permits and standards:{" "}
              <a href="https://www.commerce.wa.gov.au/building-commission" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">commerce.wa.gov.au</a>
            </li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Investing in Perth?</strong> Browse{" "}
              <Link href="/buy" className="underline hover:text-blue-900">WA investment properties</Link>{" "}
              or use our{" "}
              <Link href="/rental-yield-calculator" className="underline hover:text-blue-900">rental yield calculator</Link>{" "}
              to model your returns.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/granny-flat-guide-nsw" className="text-primary hover:underline">Granny Flat Guide NSW</Link></li>
              <li><Link href="/guides/granny-flat-guide-vic" className="text-primary hover:underline">Granny Flat Guide Victoria</Link></li>
              <li><Link href="/guides/granny-flat-guide-qld" className="text-primary hover:underline">Granny Flat Guide Queensland</Link></li>
              <li><Link href="/guides/granny-flat-guide-sa" className="text-primary hover:underline">Granny Flat Guide South Australia</Link></li>
              <li><Link href="/guides/renters-rights-wa" className="text-primary hover:underline">Renter&apos;s Rights in WA</Link></li>
              <li><Link href="/guides/property-depreciation-guide" className="text-primary hover:underline">Property Depreciation Guide</Link></li>
              <li><Link href="/guides/negative-gearing-australia" className="text-primary hover:underline">Negative Gearing Guide</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
