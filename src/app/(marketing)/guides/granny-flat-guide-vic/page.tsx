import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Granny Flat Guide Victoria: Rules, Costs & Approvals (2026) | ${SITE_NAME}`,
  description:
    "Building a secondary dwelling in Victoria? Learn about planning permits, council rules, costs, and what makes VIC different from NSW. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/granny-flat-guide-vic` },
  openGraph: {
    url: `${SITE_URL}/guides/granny-flat-guide-vic`,
    title: "Granny Flat Guide Victoria: Rules, Costs & Approvals (2026)",
    description:
      "Building a secondary dwelling in Victoria? Learn about planning permits, council rules, costs, and what makes VIC different from NSW. Updated 2026.",
    type: "article",
  },
};

export default function GrannyFlatGuideVICPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Granny Flat Guide Victoria", url: "/guides/granny-flat-guide-vic" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Granny Flat Guide Victoria" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 7 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Granny Flat Guide Victoria: Rules, Costs &amp; Approvals (2026)
        </h1>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Important:</strong> Planning rules for secondary dwellings in Victoria vary
          significantly by council area. Always check with your local council before committing to
          a project. This guide provides general information only.
        </div>

        {/* Key difference callout */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8 text-sm text-orange-800">
          <strong>VIC vs NSW:</strong> Unlike NSW, Victoria does not have a state-wide complying
          development pathway for secondary dwellings. In most cases, you will need a planning permit
          from your local council — which takes longer and costs more than NSW&apos;s CDC process.
        </div>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#overview" className="hover:underline">Secondary dwellings in Victoria</a></li>
            <li><a href="#planning" className="hover:underline">Planning permit requirements</a></li>
            <li><a href="#rescode" className="hover:underline">ResCode and planning overlays</a></li>
            <li><a href="#lot-size" className="hover:underline">Lot size and zone requirements</a></li>
            <li><a href="#costs" className="hover:underline">Building costs</a></li>
            <li><a href="#approval-time" className="hover:underline">How long does approval take?</a></li>
            <li><a href="#growth-corridors" className="hover:underline">Growth corridor opportunities</a></li>
            <li><a href="#rental" className="hover:underline">Rental potential</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="overview" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Secondary Dwellings in Victoria</h2>
          <p className="text-gray-600 mb-4">
            In Victoria, a granny flat is referred to as a <strong>dependent person&apos;s unit</strong> or,
            more broadly, a <strong>secondary dwelling</strong>. The applicable terminology and
            planning rules depend on your zone, overlay, and local planning scheme.
          </p>
          <p className="text-gray-600 mb-4">
            Unlike NSW — which has a state-wide streamlined approval pathway — Victoria&apos;s approach is
            largely council-driven. This means the rules, processing times, and outcomes can vary
            enormously depending on which municipality your property is in.
          </p>
          <p className="text-gray-600 mb-4">
            The Victorian Government has been working to make it easier to build secondary dwellings
            as part of housing supply reforms. Check the Department of Transport and Planning website
            for the latest policy position.
          </p>

          <h2 id="planning" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Planning Permit Requirements</h2>
          <p className="text-gray-600 mb-4">
            In most areas of Victoria, building a secondary dwelling requires a <strong>planning
            permit</strong> from the local council. The planning permit process involves:
          </p>
          <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2">
            <li>Lodging a planning permit application with supporting documents (plans, site analysis)</li>
            <li>Council assessment (which may include a neighbour notification period)</li>
            <li>Council decision — approval, approval with conditions, or refusal</li>
            <li>If approved, obtaining a building permit before commencing construction</li>
          </ol>
          <p className="text-gray-600 mb-4">
            Some minor secondary dwelling proposals may be exempt from a planning permit under
            ResCode or council by-laws. A planning consultant or council planner can advise on
            whether your specific project is exempt.
          </p>

          <h2 id="rescode" className="text-2xl font-bold text-gray-900 mt-8 mb-4">ResCode and Planning Overlays</h2>
          <p className="text-gray-600 mb-4">
            <strong>ResCode</strong> is Victoria&apos;s state-wide residential development code, setting
            standards for setbacks, site coverage, overlooking, overshadowing, and open space.
            All secondary dwelling proposals must comply with ResCode (or receive a variation from
            council).
          </p>
          <p className="text-gray-600 mb-4">
            Planning overlays add additional layers of control. Common overlays that may affect your
            secondary dwelling proposal include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li><strong>Neighbourhood Character Overlay (NCO):</strong> May restrict design or height</li>
            <li><strong>Heritage Overlay:</strong> May require heritage-sensitive design and officer approval</li>
            <li><strong>Flood or Bushfire Overlay:</strong> May require additional assessment or restrict development</li>
            <li><strong>Vegetation Protection Overlay:</strong> May limit tree removal needed for construction</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Check the Planning Maps Online tool (planning.vic.gov.au) to identify all overlays
            applying to your property before starting the design process.
          </p>

          <h2 id="lot-size" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Lot Size and Zone Requirements</h2>
          <p className="text-gray-600 mb-4">
            Victoria does not have a universal minimum lot size for secondary dwellings. Requirements
            vary by zone:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>General Residential Zone (GRZ):</strong> Most common zone in established suburbs.
              Secondary dwellings are generally permissible, but a planning permit is usually required.
              Councils typically expect lots of at least 300–400m² for attached dwellings and more
              for detached.
            </li>
            <li>
              <strong>Neighbourhood Residential Zone (NRZ):</strong> More restrictive than GRZ.
              May limit the number of dwellings per lot and impose stricter design requirements.
              Secondary dwellings are sometimes prohibited in NRZ areas — check your council&apos;s
              planning scheme.
            </li>
            <li>
              <strong>Residential Growth Zone (RGZ):</strong> Encourages higher-density development.
              Secondary dwellings are generally more readily approved in RGZ areas.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Contact your council&apos;s planning department early to understand your site&apos;s development
            potential before spending money on design.
          </p>

          <h2 id="costs" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Building Costs in Victoria</h2>
          <p className="text-gray-600 mb-4">
            Construction costs in Victoria are broadly similar to NSW but can be higher in inner
            Melbourne due to land constraints, builder demand, and heritage requirements:
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Type</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Estimated Cost</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="p-3 border border-gray-200">Basic 1-bed secondary dwelling (40–50m²)</td>
                  <td className="p-3 border border-gray-200">$120,000 – $180,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Mid-range 2-bed secondary dwelling (55–70m²)</td>
                  <td className="p-3 border border-gray-200">$180,000 – $250,000</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Premium / heritage-sensitive design</td>
                  <td className="p-3 border border-gray-200">$250,000 – $350,000+</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 mb-4">
            Additional VIC-specific costs to budget for:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Planning permit application fee: $1,000 – $3,000+</li>
            <li>Planning permit consultant: $3,000 – $8,000 (recommended for complex sites)</li>
            <li>Heritage report: $2,000 – $5,000 (if heritage overlay applies)</li>
            <li>Soil and drainage report: $1,000 – $2,000</li>
          </ul>

          <h2 id="approval-time" className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Long Does Approval Take?</h2>
          <p className="text-gray-600 mb-4">
            The planning permit process in Victoria typically takes:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li><strong>Simple applications (no objections, no overlay):</strong> 2–4 months</li>
            <li><strong>Notifiable applications (neighbour notification):</strong> 4–8 months</li>
            <li><strong>Complex applications (overlays, objections, VCAT appeal):</strong> 12+ months</li>
          </ul>
          <p className="text-gray-600 mb-4">
            After receiving the planning permit, you must still obtain a <strong>building permit</strong>
            before commencing construction. This adds another 4–8 weeks.
          </p>
          <p className="text-gray-600 mb-4">
            Compared to NSW&apos;s CDC pathway (typically 2–4 weeks), Victoria&apos;s planning process is
            significantly slower. Factor this into your project timeline and budget.
          </p>

          <h2 id="growth-corridors" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Growth Corridor Opportunities</h2>
          <p className="text-gray-600 mb-4">
            Melbourne&apos;s urban growth corridors (e.g. Werribee, Melton, Cranbourne, Epping) are zoned
            for higher-density residential development. In these areas, secondary dwellings are often
            more readily approved because:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Lots are often designed for dual occupancy from the outset</li>
            <li>Growth zones typically have simpler planning overlays</li>
            <li>Councils in growth corridors have more established processes for secondary dwellings</li>
          </ul>
          <p className="text-gray-600 mb-4">
            However, rental yields in outer growth corridors are typically lower than established
            inner and middle suburbs. Weigh up the cost savings on approval against the lower
            income potential.
          </p>

          <h2 id="rental" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Rental Potential in Victoria</h2>
          <p className="text-gray-600 mb-4">
            Rental returns for secondary dwellings in Melbourne:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Inner Melbourne (5–15km from CBD):</strong> $350 – $550/week for a 1–2 bed
              secondary dwelling.
            </li>
            <li>
              <strong>Middle ring suburbs (15–30km):</strong> $280 – $420/week.
            </li>
            <li>
              <strong>Outer growth corridors:</strong> $250 – $360/week.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Given the higher construction costs in Victoria (due to planning complexity), yields tend
            to be slightly lower than NSW on a cost-basis. Despite this, secondary dwellings remain
            a popular strategy for Melbourne investors seeking to generate rental income from an
            existing property.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Exploring investment properties in Victoria?</strong>{" "}
              <Link href="/buy" className="underline hover:text-blue-900">Browse Melbourne property listings</Link>{" "}
              or use our{" "}
              <Link href="/rental-yield-calculator" className="underline hover:text-blue-900">rental yield calculator</Link>.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/granny-flat-guide-nsw" className="text-primary hover:underline">Granny Flat Guide NSW</Link></li>
              <li><Link href="/guides/granny-flat-guide-qld" className="text-primary hover:underline">Granny Flat Guide Queensland</Link></li>
              <li><Link href="/guides/renters-rights-vic" className="text-primary hover:underline">Renter&apos;s Rights in Victoria</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
