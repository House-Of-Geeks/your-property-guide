import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Building & Pest Inspection Guide: What to Expect and What to Look For (2026) | ${SITE_NAME}`,
  description:
    "Why you need a building and pest inspection, what&apos;s inspected, common defects found, how to read the report, and how to negotiate after. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/building-pest-inspection` },
  openGraph: {
    url: `${SITE_URL}/guides/building-pest-inspection`,
    title: "Building & Pest Inspection Guide: What to Expect and What to Look For (2026)",
    description:
      "Why you need a building and pest inspection, what&apos;s inspected, common defects found, how to read the report, and how to negotiate after. Updated 2026.",
    type: "article",
  },
};

export default function BuildingPestInspectionPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Building & Pest Inspection Guide", url: "/guides/building-pest-inspection" },
        ]}
      />
      <GuideArticleJsonLd
        title="Building & Pest Inspection Guide: What to Expect and What to Look For (2026)"
        description="Why you need a building and pest inspection, what's inspected, common defects found, how to read the report, and how to negotiate after. Updated 2026."
        url="/guides/building-pest-inspection"
        datePublished="2026-04-01"
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Building & Pest Inspection Guide" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 8 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Building &amp; Pest Inspection Guide: What to Expect and What to Look For (2026)
        </h1>

        {/* Key message */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-sm text-blue-800">
          <strong>Bottom line:</strong> A building and pest inspection is one of the best investments
          you will make in the property buying process. At $400–$800, it can uncover tens of
          thousands of dollars in potential issues — or give you confidence to proceed.
        </div>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#why-need" className="hover:underline">Why you need one</a></li>
            <li><a href="#whats-inspected" className="hover:underline">What&apos;s inspected</a></li>
            <li><a href="#common-issues" className="hover:underline">Common issues found</a></li>
            <li><a href="#cost" className="hover:underline">Cost of inspections</a></li>
            <li><a href="#who-to-hire" className="hover:underline">Who to hire</a></li>
            <li><a href="#timing" className="hover:underline">When to get the inspection</a></li>
            <li><a href="#reading-report" className="hover:underline">How to read the report</a></li>
            <li><a href="#negotiating" className="hover:underline">Negotiating after an inspection</a></li>
            <li><a href="#new-homes" className="hover:underline">Inspections for new homes</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="why-need" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why You Need a Building and Pest Inspection</h2>
          <p className="text-gray-600 mb-4">
            When purchasing property in Australia, you have limited rights to seek remedies after
            settlement for defects you could have discovered beforehand. The principle of
            <em> caveat emptor</em> (buyer beware) means the burden is on you to investigate the
            property&apos;s condition before signing an unconditional contract.
          </p>
          <p className="text-gray-600 mb-4">
            A professional building and pest inspection commissioned before exchange gives you:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Full disclosure of the property&apos;s condition</strong> from a qualified
              professional — not just what&apos;s visible to the naked eye.
            </li>
            <li>
              <strong>Negotiating power</strong> — if significant defects are found, you can ask
              for a price reduction or require the vendor to fix them before settlement.
            </li>
            <li>
              <strong>Walk-away rights</strong> — in a private sale with a building inspection
              condition, you can withdraw from the purchase if major defects are found.
            </li>
            <li>
              <strong>Future maintenance planning</strong> — even if all issues are minor, the
              report helps you understand what maintenance to budget for.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            <strong>Auction buyers:</strong> If you are buying at auction, you must commission
            the inspection before auction day — there is no cooling-off period at auction and
            no subject-to-inspection clause.
          </p>

          <h2 id="whats-inspected" className="text-2xl font-bold text-gray-900 mt-8 mb-4">What&apos;s Inspected</h2>
          <p className="text-gray-600 mb-4">
            A standard combined building and pest inspection in Australia covers:
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Building inspection</h3>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Roof (tiles, gutters, flashings, penetrations)</li>
            <li>Roof space (structure, insulation, ventilation)</li>
            <li>Subfloor area (drainage, moisture, structure)</li>
            <li>External walls (cladding, rendering, cracks)</li>
            <li>Internal walls and ceilings (cracks, water damage, stains)</li>
            <li>Floors (bounce, squeaks, levelness)</li>
            <li>Windows and doors (operation, sealing, frames)</li>
            <li>Wet areas (bathrooms, laundry, kitchen) for waterproofing and drainage</li>
            <li>Garage and outbuildings</li>
            <li>Visible drainage and stormwater</li>
            <li>Retaining walls and fencing</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Pest inspection</h3>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Termite activity (live termites, past activity, damage)</li>
            <li>Termite conducive conditions (timber-to-soil contact, excessive moisture)</li>
            <li>Timber borers</li>
            <li>Evidence of other pests (rodents, wood decay fungus)</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Note: inspectors can only assess what is accessible and visible. A building inspection
            is not a structural engineering report or a compliance inspection — it identifies
            visible defects and issues, not hidden structural faults (unless there are visual indicators).
          </p>
          <p className="text-gray-600 mb-4">
            Inspectors generally do not test individual electrical outlets, gas appliances, or
            plumbing fixtures (beyond a visual check). A separate electrical or plumbing inspection
            may be warranted for older properties.
          </p>

          <h2 id="common-issues" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Issues Found</h2>
          <p className="text-gray-600 mb-4">
            Experienced inspectors find something in almost every property they inspect — the
            question is severity. Common findings include:
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">High severity (deal-breakers or major price negotiation)</h3>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Active termite infestation:</strong> Termites can cause extensive structural
              damage — particularly to timber-framed homes. Active infestations require immediate
              professional treatment and can require significant structural repairs.
            </li>
            <li>
              <strong>Rising damp:</strong> Moisture wicking up through walls from the ground,
              often caused by failed damp-proof courses. Can cause structural damage, mould, and
              health issues. Repairs can cost $5,000–$30,000+.
            </li>
            <li>
              <strong>Major structural cracks:</strong> Diagonal or step cracking through external
              masonry walls, particularly around windows and door frames, can indicate foundation
              movement. May require a structural engineer&apos;s assessment.
            </li>
            <li>
              <strong>Significant roof damage:</strong> Failed flashings, cracked tiles, or
              deteriorated roofing membranes that require full replacement. Roof replacements
              can cost $10,000–$30,000+.
            </li>
            <li>
              <strong>Subfloor drainage issues:</strong> Poor drainage allowing water pooling
              under the house, which promotes termite activity and timber decay.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Moderate (maintenance items to budget for)</h3>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Cracked or missing roof tiles</li>
            <li>Blocked or poorly graded gutters and downpipes</li>
            <li>Failed bathroom waterproofing (common in older properties)</li>
            <li>Termite conducive conditions (but no active infestation)</li>
            <li>Deteriorated external paint and caulking</li>
            <li>Substandard electrical (older switchboards, surface-mounted wiring)</li>
            <li>Retaining walls showing signs of movement</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Minor (normal wear and tear)</h3>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Sticking doors and windows</li>
            <li>Hairline cracks in plasterboard walls</li>
            <li>Worn or damaged floor coverings</li>
            <li>Minor external paint deterioration</li>
          </ul>

          <h2 id="cost" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cost of Inspections</h2>
          <p className="text-gray-600 mb-4">
            Inspection costs vary by property size, location, and type of inspection:
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Type</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Typical Cost</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="p-3 border border-gray-200">Building inspection only</td>
                  <td className="p-3 border border-gray-200">$250 – $500</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Pest inspection only</td>
                  <td className="p-3 border border-gray-200">$150 – $300</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Combined building and pest (recommended)</td>
                  <td className="p-3 border border-gray-200">$400 – $800</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Large home (5+ bed) or rural property</td>
                  <td className="p-3 border border-gray-200">$600 – $1,200+</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Strata / apartment</td>
                  <td className="p-3 border border-gray-200">$250 – $500</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 mb-4">
            Always get a combined building and pest inspection from the same inspector (or at
            least coordinate the two). Many defects that attract pests (e.g. moisture, timber
            decay) are identified in both inspections — a combined report gives the full picture.
          </p>

          <h2 id="who-to-hire" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Who to Hire</h2>
          <p className="text-gray-600 mb-4">
            Look for an inspector with the following qualifications:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Building inspector:</strong> Should be a licensed builder, architect, or
              engineer with inspection qualifications. Check for membership in the Australian
              Institute of Building Surveyors (AIBS) or similar.
            </li>
            <li>
              <strong>Pest inspector:</strong> Should be a licensed pest controller or timber
              pest inspector, qualified under Australian Standard AS 4349.3.
            </li>
            <li>
              <strong>Professional indemnity insurance:</strong> Essential. If the inspector
              misses a significant issue, you need recourse.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Do not use an inspector recommended by the real estate agent — there is an inherent
            conflict of interest. Get your own independent inspector.
          </p>
          <p className="text-gray-600 mb-4">
            Try to attend the inspection in person. A good inspector will walk you through the
            property and explain findings in plain English — far more valuable than reading a
            report alone.
          </p>

          <h2 id="timing" className="text-2xl font-bold text-gray-900 mt-8 mb-4">When to Get the Inspection</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Private sale with conditions:</strong> The inspection clause in your contract
              gives you a set timeframe (typically 7–14 days after exchange) to commission the
              inspection and, if issues are found, to either withdraw or renegotiate.
            </li>
            <li>
              <strong>Before auction:</strong> Must be done <em>before</em> auction day. Contact
              the agent to arrange access. Allow at least 48–72 hours turnaround to receive the
              report.
            </li>
            <li>
              <strong>Before making an offer (preferred):</strong> Some buyers commission inspections
              before making an offer to negotiate with full knowledge. This means paying for an
              inspection on properties you may not buy, but avoids conditional delays.
            </li>
          </ul>

          <h2 id="reading-report" className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Read the Report</h2>
          <p className="text-gray-600 mb-4">
            Building and pest reports follow a standard format (typically AS 4349.1 for building
            and AS 4349.3 for pests). Key sections to focus on:
          </p>
          <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-3">
            <li>
              <strong>Summary / overview:</strong> This section gives the inspector&apos;s overall
              assessment. Read this first — does the inspector flag any &quot;major defects&quot; or
              &quot;safety hazards&quot;?
            </li>
            <li>
              <strong>Major defects:</strong> These are defects that require significant remediation.
              A major defect in the report is different from minor maintenance items.
            </li>
            <li>
              <strong>Pest activity:</strong> Any active termite evidence, past termite damage,
              or conducive conditions. Note: past termite activity (treated and resolved) is less
              concerning than active infestation.
            </li>
            <li>
              <strong>Photographs:</strong> Good reports include photos of all significant findings.
              Review these carefully — a crack in a photo often communicates more than a paragraph
              of text.
            </li>
            <li>
              <strong>Items not inspected:</strong> Reports must disclose what could not be accessed.
              Unexplored areas (e.g. concealed roof void, locked rooms) are risk areas.
            </li>
          </ol>
          <p className="text-gray-600 mb-4">
            Not all defects are created equal. A report listing 15 minor items is very different
            from one listing 3 major defects. If in doubt, call the inspector directly and ask
            them to explain the severity and estimated cost of remediation.
          </p>

          <h2 id="negotiating" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Negotiating After an Inspection</h2>
          <p className="text-gray-600 mb-4">
            If the inspection reveals significant issues, you have several options:
          </p>
          <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-3">
            <li>
              <strong>Withdraw from the purchase</strong> (if within your inspection condition
              timeframe). You are entitled to a refund of the deposit.
            </li>
            <li>
              <strong>Negotiate a price reduction.</strong> Get quotes for the identified repairs
              and ask the vendor to reduce the price by that amount. Be specific — quote the
              estimated cost and attach the relevant section of the report.
            </li>
            <li>
              <strong>Ask the vendor to fix it.</strong> For some issues (particularly safety
              hazards), you can request the vendor rectify the defect before settlement. Less
              common — most vendors prefer to reduce the price than arrange repairs.
            </li>
            <li>
              <strong>Accept and proceed.</strong> If defects are minor and the price already
              reflects the condition, you may choose to proceed without negotiation.
            </li>
          </ol>
          <p className="text-gray-600 mb-4">
            When negotiating based on inspection findings:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Get repair quotes from licensed tradespeople (not verbal estimates)</li>
            <li>Be reasonable — all properties have some defects</li>
            <li>Focus on major defects, not minor wear and tear</li>
            <li>Negotiate through your conveyancer or agent, in writing</li>
          </ul>

          <h2 id="new-homes" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Inspections for New Homes</h2>
          <p className="text-gray-600 mb-4">
            Many buyers assume new homes don&apos;t need an inspection. This is a mistake. Common
            issues found in new construction include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Incomplete waterproofing or substandard bathroom tiling</li>
            <li>Drainage issues not visible at ground level</li>
            <li>Structural cracks in brickwork from settling</li>
            <li>Substandard insulation or missing insulation</li>
            <li>Defects in electrical or plumbing that didn&apos;t pass handover inspection</li>
          </ul>
          <p className="text-gray-600 mb-4">
            For new homes, consider engaging a <strong>pre-handover inspector</strong> who
            attends the builder&apos;s handover inspection with you. Any defects identified can be
            included in a defects list that the builder must rectify before you take possession.
          </p>
          <p className="text-gray-600 mb-4">
            New homes typically come with a statutory warranty period (usually 6 years for
            structural defects, 2 years for non-structural defects in most states). Document
            any issues with photos and written notices to the builder.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>About to buy?</strong>{" "}
              <Link href="/buy" className="underline hover:text-blue-900">Browse properties for sale</Link>{" "}
              or read our{" "}
              <Link href="/guides/buying-property-australia" className="underline hover:text-blue-900">complete buying guide</Link>{" "}
              to make sure you&apos;re prepared for every step.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/buying-property-australia" className="text-primary hover:underline">How to Buy Property in Australia</Link></li>
              <li><Link href="/guides/property-auction-guide" className="text-primary hover:underline">Property Auction Guide</Link></li>
              <li><Link href="/guides/conveyancing-guide" className="text-primary hover:underline">Conveyancing Guide</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
