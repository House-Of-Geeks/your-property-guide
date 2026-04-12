import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Granny Flat Guide South Australia: Rules, Costs & Planning (2026) | ${SITE_NAME}`,
  description:
    "Complete guide to building a granny flat (secondary dwelling) in South Australia. Planning and Design Code requirements, complying development, lot sizes, costs $100k–$180k, and PlanSA portal. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/granny-flat-guide-sa` },
  openGraph: {
    url: `${SITE_URL}/guides/granny-flat-guide-sa`,
    title: "Granny Flat Guide South Australia: Rules, Costs & Planning (2026)",
    description:
      "Complete guide to building a granny flat (secondary dwelling) in South Australia. Planning and Design Code requirements, complying development, lot sizes, costs $100k–$180k, and PlanSA portal. Updated 2026.",
    type: "article",
  },
};

export default function GrannyFlatGuideSAPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Granny Flat Guide SA", url: "/guides/granny-flat-guide-sa" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Granny Flat Guide SA" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 9 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Granny Flat Guide South Australia: Rules, Costs &amp; Planning (2026)
        </h1>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> This guide provides general information only. SA planning
          rules vary by zone and may have been updated. Always confirm requirements with the
          relevant planning authority and the PlanSA portal (plan.sa.gov.au) before proceeding.
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#what-is" className="hover:underline">What is a secondary dwelling in SA?</a></li>
            <li><a href="#planning-code" className="hover:underline">SA Planning and Design Code</a></li>
            <li><a href="#complying-development" className="hover:underline">Complying development pathway</a></li>
            <li><a href="#zones" className="hover:underline">Zones and lot size requirements</a></li>
            <li><a href="#owner-occupier" className="hover:underline">Owner-occupier requirement</a></li>
            <li><a href="#approval-process" className="hover:underline">Approval process</a></li>
            <li><a href="#costs" className="hover:underline">Costs of building a granny flat in SA</a></li>
            <li><a href="#rental-market" className="hover:underline">Adelaide rental market</a></li>
            <li><a href="#tips" className="hover:underline">Practical tips</a></li>
            <li><a href="#resources" className="hover:underline">Resources</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="what-is" className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is a Secondary Dwelling in SA?</h2>
          <p className="text-gray-600 mb-4">
            In South Australia, what most people call a &quot;granny flat&quot; is officially referred to
            as a <strong>secondary dwelling</strong> or <strong>ancillary accommodation</strong>
            under the SA Planning and Design Code. It is a self-contained dwelling located on
            the same allotment as a primary residence, typically designed for a family member
            or as a rental property.
          </p>
          <p className="text-gray-600 mb-4">
            South Australia introduced a consolidated <strong>Planning and Design Code (PDC)</strong>
            in 2021, replacing the previous suite of Development Plans. The PDC provides a
            state-wide framework for planning decisions, with zone-specific rules governing
            what can be built and under what approval pathway.
          </p>
          <p className="text-gray-600 mb-4">
            Secondary dwellings in SA can be approved as either <em>complying development</em>
            (fast-track, no public consultation required) or through a formal Development
            Application — depending on whether the proposal meets all the complying criteria.
          </p>

          <h2 id="planning-code" className="text-2xl font-bold text-gray-900 mt-8 mb-4">SA Planning and Design Code</h2>
          <p className="text-gray-600 mb-4">
            The <strong>Planning and Design Code</strong> is SA&apos;s central planning document,
            accessible through the <strong>PlanSA portal</strong> (plan.sa.gov.au). The PDC
            classifies all land in SA into zones and overlays, and specifies what development
            is &quot;accepted&quot; (no approval needed), &quot;complying&quot; (approved as of right if criteria
            met), or &quot;performance assessed&quot; (requires a Development Application and assessment
            against performance outcomes).
          </p>
          <p className="text-gray-600 mb-4">
            For secondary dwellings, most residential zones in SA treat them as complying
            development when the proposal meets specified criteria — primarily around lot size,
            floor area, setbacks, and site coverage.
          </p>
          <p className="text-gray-600 mb-4">
            Use the PlanSA map (plan.sa.gov.au) to look up the zone of your specific property
            and check the applicable rules for secondary dwellings.
          </p>

          <h2 id="complying-development" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Complying Development Pathway</h2>
          <p className="text-gray-600 mb-4">
            The complying development pathway allows eligible secondary dwellings to be approved
            without a full Development Application, saving time and cost. Under this pathway:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>The proposal must meet all specified complying criteria (lot size, floor area, setbacks, etc.)</li>
            <li>A private certifier or the relevant planning authority grants development approval</li>
            <li>No public notification or council discretion is involved — it is assessed as of right</li>
            <li>A building consent (separate to planning approval) is still required from the council or a private certifier</li>
          </ul>
          <p className="text-gray-600 mb-4">
            If your proposal does not meet all the complying criteria — for example, if your lot
            is slightly under the minimum size — you will need to lodge a Development Application
            for performance assessment. This takes longer (typically 40–60 business days) and
            the outcome is discretionary.
          </p>

          <h2 id="zones" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Zones and Lot Size Requirements</h2>
          <p className="text-gray-600 mb-4">
            The key parameters for complying secondary dwellings in the General Neighbourhood Zone
            (the most common residential zone in Adelaide suburbs):
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Criterion</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Typical requirement (General Neighbourhood Zone)</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="p-3 border border-gray-200">Minimum lot size</td>
                  <td className="p-3 border border-gray-200">≥ 250m² (verify current threshold)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Maximum secondary dwelling floor area</td>
                  <td className="p-3 border border-gray-200">60m² (verify current threshold)</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Primary dwelling must be retained</td>
                  <td className="p-3 border border-gray-200">Yes — cannot demolish the main house</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Side and rear setbacks</td>
                  <td className="p-3 border border-gray-200">Minimum 0.9m–1.0m (zone dependent)</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Maximum site coverage</td>
                  <td className="p-3 border border-gray-200">Zone dependent — typically 60–70%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mb-4">
            These parameters apply to the General Neighbourhood Zone. Other zones (Suburban
            Neighbourhood, Urban Corridor, Master Planned Neighbourhood) may have different
            thresholds. Always verify using PlanSA before designing your project.
          </p>
          <p className="text-gray-600 mb-4">
            Notably, SA&apos;s minimum lot size of just 250m² for complying secondary dwellings is
            among the more flexible in Australia — making it viable in smaller inner-Adelaide lots
            that would not qualify in other states.
          </p>

          <h2 id="owner-occupier" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Owner-Occupier Requirement</h2>
          <p className="text-gray-600 mb-4">
            In most cases, SA planning rules require that <strong>one of the two dwellings on
            the allotment must be owner-occupied</strong>. This means you cannot purchase a
            property as a pure investment and rent out both the main house and the secondary
            dwelling.
          </p>
          <p className="text-gray-600 mb-4">
            The owner-occupier condition is typically attached to the development approval.
            Breaching this condition is a planning offence. If you are intending to sell the
            property in future, the condition attaches to the land and will apply to subsequent
            owners as well.
          </p>
          <p className="text-gray-600 mb-4">
            There may be limited exceptions in certain zones or council areas — always confirm
            with PlanSA or your planning consultant.
          </p>

          <h2 id="approval-process" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Approval Process</h2>
          <p className="text-gray-600 mb-4">
            Getting approval for a secondary dwelling in SA involves two stages: planning
            approval (development approval) and building consent.
          </p>

          <div className="space-y-3 mb-6">
            {[
              { step: "1", title: "Check PlanSA for your zone", desc: "Use the PlanSA mapping tool to confirm your zone and the applicable complying criteria for secondary dwellings on your allotment." },
              { step: "2", title: "Engage a designer", desc: "Have plans prepared by an architect, building designer, or draftsperson who is familiar with the SA Planning and Design Code. Ensure the design meets all complying criteria." },
              { step: "3", title: "Development approval (planning consent)", desc: "Lodge via the PlanSA portal. For complying development, this may be assessed quickly (days to weeks). For performance assessed development, allow 40–60 business days." },
              { step: "4", title: "Building consent", desc: "A separate building consent application is required. This can be lodged with your local council or a registered private certifier. The building consent verifies compliance with the National Construction Code (NCC)." },
              { step: "5", title: "Construction", desc: "Once both approvals are in hand, construction can commence. Inspections are required at key stages (footings, frame, waterproofing, completion)." },
              { step: "6", title: "Certificate of Occupancy", desc: "The certifier issues a Certificate of Occupancy once the building passes all inspections and is certified as compliant." },
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

          <h2 id="costs" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Costs of Building a Granny Flat in SA</h2>
          <p className="text-gray-600 mb-4">
            Building costs in South Australia are broadly similar to other states, though
            labour costs are generally slightly lower than in NSW or Victoria.
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
                  <td className="p-3 border border-gray-200">Design and documentation</td>
                  <td className="p-3 border border-gray-200">$3,000 – $7,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Planning and building consent fees</td>
                  <td className="p-3 border border-gray-200">$1,500 – $4,000</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Site works (slab, services, drainage)</td>
                  <td className="p-3 border border-gray-200">$10,000 – $35,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Construction (45–60m² secondary dwelling)</td>
                  <td className="p-3 border border-gray-200">$80,000 – $140,000</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Landscaping and fencing</td>
                  <td className="p-3 border border-gray-200">$4,000 – $12,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200"><strong>Total estimated cost</strong></td>
                  <td className="p-3 border border-gray-200"><strong>$100,000 – $180,000+</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mb-4">
            Modular and prefabricated options are available from SA-based suppliers at the lower
            end of this range. Ensure any modular dwelling is compliant with the NCC and has
            the necessary SA certifications.
          </p>

          <h2 id="rental-market" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Adelaide Rental Market</h2>
          <p className="text-gray-600 mb-4">
            Adelaide has experienced significant rental market tightening since 2021, with
            vacancy rates falling to historic lows. This has driven strong demand for ancillary
            dwellings across the metro area.
          </p>
          <p className="text-gray-600 mb-4">
            Typical weekly rents for a 1–2 bedroom secondary dwelling in Adelaide (2026):
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Inner Adelaide (2–5km from CBD): <strong>$350 – $500/week</strong></li>
            <li>Eastern suburbs: <strong>$370 – $480/week</strong></li>
            <li>Northern and southern suburbs: <strong>$280 – $400/week</strong></li>
          </ul>
          <p className="text-gray-600 mb-4">
            Adelaide&apos;s lower property prices relative to Sydney and Melbourne mean construction
            costs represent a higher proportion of overall value — but the tight rental market
            and strong yields still make secondary dwellings financially compelling for
            owner-occupier investors.
          </p>

          <h2 id="tips" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Practical Tips</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Use PlanSA first:</strong> The PlanSA portal is the definitive source for
              your zone, applicable rules, and the lodgement portal for development applications.
              Start here before engaging any designer.
            </li>
            <li>
              <strong>Private certifier vs council:</strong> SA allows building consents to be
              assessed by either your local council or a registered private certifier. Private
              certifiers often have faster turnaround times.
            </li>
            <li>
              <strong>Energy efficiency:</strong> New dwellings in SA must comply with the
              NCC energy efficiency requirements (NatHERS 7-star rating equivalent). Build this
              into your design from the start.
            </li>
            <li>
              <strong>Depreciation:</strong> As a new dwelling, a secondary dwelling offers
              maximum tax depreciation benefits. Engage a quantity surveyor for a depreciation
              schedule — see our{" "}
              <Link href="/guides/property-depreciation-guide" className="text-primary hover:underline">Property Depreciation Guide</Link>{" "}
              for details.
            </li>
            <li>
              <strong>Separate metering:</strong> Have the secondary dwelling separately metered
              for electricity and water from the outset. This simplifies rent calculation and
              prevents disputes with tenants about utility costs.
            </li>
          </ul>

          <h2 id="resources" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resources</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>PlanSA</strong> — Planning portal, zoning maps, and development applications:{" "}
              <a href="https://www.plan.sa.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">plan.sa.gov.au</a>
            </li>
            <li>
              <strong>SA Building Technical Standards</strong> — Building consent information:{" "}
              <a href="https://www.sa.gov.au/building" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">sa.gov.au/building</a>
            </li>
            <li>
              <strong>Consumer and Business Services SA</strong> — Property and building:{" "}
              <a href="https://www.cbs.sa.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cbs.sa.gov.au</a>
            </li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Investing in Adelaide?</strong> Browse{" "}
              <Link href="/buy" className="underline hover:text-blue-900">SA investment properties</Link>{" "}
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
              <li><Link href="/guides/granny-flat-guide-wa" className="text-primary hover:underline">Granny Flat Guide Western Australia</Link></li>
              <li><Link href="/guides/renters-rights-sa" className="text-primary hover:underline">Renter&apos;s Rights in South Australia</Link></li>
              <li><Link href="/guides/property-depreciation-guide" className="text-primary hover:underline">Property Depreciation Guide</Link></li>
              <li><Link href="/guides/negative-gearing-australia" className="text-primary hover:underline">Negative Gearing Guide</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
