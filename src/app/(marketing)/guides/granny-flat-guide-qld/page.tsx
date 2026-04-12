import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Granny Flat Guide Queensland: Rules, Costs & Investment Returns (2026) | ${SITE_NAME}`,
  description:
    "Building a secondary dwelling in Queensland? Learn about planning rules, Brisbane City Council requirements, costs, and rental returns. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/granny-flat-guide-qld` },
  openGraph: {
    url: `${SITE_URL}/guides/granny-flat-guide-qld`,
    title: "Granny Flat Guide Queensland: Rules, Costs & Investment Returns (2026)",
    description:
      "Building a secondary dwelling in Queensland? Learn about planning rules, Brisbane City Council requirements, costs, and rental returns. Updated 2026.",
    type: "article",
  },
};

export default function GrannyFlatGuideQLDPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Granny Flat Guide Queensland", url: "/guides/granny-flat-guide-qld" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Granny Flat Guide Queensland" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 7 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Granny Flat Guide Queensland: Rules, Costs &amp; Investment Returns (2026)
        </h1>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Important:</strong> Secondary dwelling rules in Queensland vary by council. Brisbane
          City Council rules differ from Sunshine Coast, Gold Coast, and other LGAs. Always check
          with your local council before committing to a project.
        </div>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#overview" className="hover:underline">Secondary dwellings in Queensland</a></li>
            <li><a href="#brisbane" className="hover:underline">Brisbane City Council rules</a></li>
            <li><a href="#requirements" className="hover:underline">Size and design requirements</a></li>
            <li><a href="#da" className="hover:underline">Development application process</a></li>
            <li><a href="#costs" className="hover:underline">Building costs</a></li>
            <li><a href="#rental" className="hover:underline">Rental market and returns</a></li>
            <li><a href="#gold-coast" className="hover:underline">Gold Coast and Sunshine Coast</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="overview" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Secondary Dwellings in Queensland</h2>
          <p className="text-gray-600 mb-4">
            In Queensland, granny flats are referred to as <strong>secondary dwellings</strong>
            (or sometimes &quot;auxiliary units&quot; under older planning schemes). They must be:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Located on the same lot as the primary dwelling</li>
            <li>Subordinate to the primary dwelling in both size and function</li>
            <li>Self-contained (separate entrance, kitchen, bathroom, living area)</li>
            <li>Maximum <strong>80m²</strong> of floor area (varies by council — Brisbane is 80m², others may differ)</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Unlike NSW, Queensland does not have a state-wide complying development (fast-track)
            pathway for secondary dwellings. Most projects require a Development Application (DA)
            through the local council — or may be assessed as code assessable development (less
            formal than a full DA but still council-assessed).
          </p>

          <h2 id="brisbane" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Brisbane City Council Rules</h2>
          <p className="text-gray-600 mb-4">
            Brisbane City Council (BCC) is the largest local government in Australia and has its
            own planning scheme for secondary dwellings. Key BCC requirements:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Zoning:</strong> Secondary dwellings are allowed in Low-Medium Density
              Residential (LMR) zones and some other zones. Not permitted in all zones — check
              the Brisbane City Plan.
            </li>
            <li>
              <strong>Lot size for detached secondary dwelling:</strong> Minimum <strong>600m²</strong>.
            </li>
            <li>
              <strong>Lot size for attached secondary dwelling:</strong> Minimum <strong>450m²</strong>.
            </li>
            <li>
              <strong>Maximum size:</strong> <strong>80m²</strong> gross floor area.
            </li>
            <li>
              <strong>Separate entry:</strong> The secondary dwelling must have a separate entrance
              to the primary dwelling.
            </li>
            <li>
              <strong>Not to be subdivided:</strong> The secondary dwelling cannot be sold as a
              separate lot or strata titled.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Brisbane City Council has made significant changes to secondary dwelling rules in recent
            years to support housing supply. Check the Brisbane City Plan 2014 (and any recent
            amendments) for the current position.
          </p>

          <h2 id="requirements" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Size and Design Requirements</h2>
          <p className="text-gray-600 mb-4">
            While specific requirements vary by council, general QLD secondary dwelling design rules:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Maximum size:</strong> 80m² (Brisbane) — check your specific council for its limit.
            </li>
            <li>
              <strong>Height:</strong> Generally limited to 2 storeys or 8.5m.
            </li>
            <li>
              <strong>Setbacks:</strong> Generally 1.5m from side boundaries and 3m+ from rear
              boundary (varies by zone and lot size).
            </li>
            <li>
              <strong>Car parking:</strong> May need to provide an additional car space depending
              on council requirements.
            </li>
            <li>
              <strong>Outdoor area:</strong> Minimum outdoor private open space typically required.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Always engage a draftsperson or architect familiar with your council&apos;s requirements before
            preparing DA documents.
          </p>

          <h2 id="da" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Development Application Process</h2>
          <p className="text-gray-600 mb-4">
            Most QLD secondary dwelling proposals are processed as <strong>code assessable
            development</strong> — meaning they are assessed against a checklist of planning
            standards rather than discretionary merit. If your proposal complies with all code
            standards, it should be approved.
          </p>
          <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2">
            <li>Confirm zoning and applicable planning codes for your site</li>
            <li>Prepare plans and application documents</li>
            <li>Lodge the DA via the council&apos;s online portal</li>
            <li>Council assessment (typically 25–30 business days for code assessable development)</li>
            <li>Receive approval (may include conditions)</li>
            <li>Obtain building approval before commencing construction</li>
          </ol>
          <p className="text-gray-600 mb-4">
            If your proposal requires impact assessment (i.e. it departs from the planning code),
            the process takes longer and includes a public notification period.
          </p>

          <h2 id="costs" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Building Costs in Queensland</h2>
          <p className="text-gray-600 mb-4">
            Construction costs in Queensland are broadly similar to NSW and VIC but can be lower
            in outer Brisbane and regional areas:
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
                  <td className="p-3 border border-gray-200">1-bed basic (40–50m²)</td>
                  <td className="p-3 border border-gray-200">$100,000 – $150,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">2-bed mid-range (55–70m²)</td>
                  <td className="p-3 border border-gray-200">$150,000 – $200,000</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">2-bed premium / full 80m²</td>
                  <td className="p-3 border border-gray-200">$200,000 – $260,000+</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 mb-4">
            Additional QLD costs:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>DA fees: $500 – $3,000 depending on council and proposal complexity</li>
            <li>Building approval: $1,500 – $4,000</li>
            <li>Site preparation (slopes common in Brisbane): $5,000 – $25,000+</li>
            <li>Utility connections: $5,000 – $15,000</li>
          </ul>

          <h2 id="rental" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Rental Market and Returns</h2>
          <p className="text-gray-600 mb-4">
            Queensland&apos;s rental market has been extremely tight since 2022, with vacancy rates
            in Brisbane, Gold Coast, and Sunshine Coast all below 1% for extended periods. This has
            pushed rents up sharply and made secondary dwellings highly attractive for investors.
          </p>
          <p className="text-gray-600 mb-4">
            Typical weekly rents for secondary dwellings:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Brisbane inner/middle ring:</strong> $380 – $550/week for a 1–2 bed
              secondary dwelling.
            </li>
            <li>
              <strong>Brisbane outer suburbs:</strong> $300 – $420/week.
            </li>
            <li>
              <strong>Gold Coast:</strong> $380 – $550/week, with higher rents closer to the beach.
            </li>
            <li>
              <strong>Sunshine Coast:</strong> $350 – $500/week.
            </li>
            <li>
              <strong>Regional QLD (larger centres like Toowoomba, Cairns):</strong> $250 – $380/week.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            At $420/week on a $150,000 build, the gross yield on construction cost is approximately
            <strong> 14.6%</strong>. Even accounting for management costs and rates, this is a
            compelling return. The strong QLD rental market continues to support granny flat
            investment returns in 2026.
          </p>

          <h2 id="gold-coast" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Gold Coast and Sunshine Coast</h2>
          <p className="text-gray-600 mb-4">
            Both the Gold Coast City Council and Sunshine Coast Council allow secondary dwellings
            in appropriate zones, but have their own planning schemes with specific requirements.
            Key differences to be aware of:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Gold Coast:</strong> Secondary dwellings are permitted in Low Density
              Residential zones. Maximum size is typically 70–80m². Check the Gold Coast City
              Plan for current standards.
            </li>
            <li>
              <strong>Sunshine Coast:</strong> Permitted in residential zones with lot sizes
              typically above 450m². The Sunshine Coast Planning Scheme 2014 sets out the specifics.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Both regions have seen strong rental demand and rent growth, making secondary dwellings
            an attractive investment in these markets.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Exploring QLD investment properties?</strong>{" "}
              <Link href="/buy" className="underline hover:text-blue-900">Browse Brisbane and QLD listings</Link>{" "}
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
              <li><Link href="/guides/renters-rights-qld" className="text-primary hover:underline">Renter&apos;s Rights in Queensland</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
