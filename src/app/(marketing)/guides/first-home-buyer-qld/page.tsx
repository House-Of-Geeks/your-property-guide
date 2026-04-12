import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `First Home Buyer Guide QLD: $30K Grant, Stamp Duty & Schemes (2026) | ${SITE_NAME}`,
  description:
    "Queensland first home buyer guide: $30,000 FHOG for new homes under $750K, stamp duty concession for homes under $550K, federal schemes, and QLD buying tips. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/first-home-buyer-qld` },
  openGraph: {
    url: `${SITE_URL}/guides/first-home-buyer-qld`,
    title: "First Home Buyer Guide QLD: $30K Grant, Stamp Duty & Schemes (2026)",
    description:
      "QLD first home buyer guide: $30,000 FHOG, stamp duty concession for homes under $550K, and federal scheme eligibility.",
    type: "article",
  },
};

export default function FirstHomeBuyerQLDPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "First Home Buyer Guide", url: "/guides/first-home-buyer-guide" },
          { name: "QLD", url: "/guides/first-home-buyer-qld" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "First Home Buyer Guide", href: "/guides/first-home-buyer-guide" },
          { label: "QLD" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <span>Last updated: April 2026</span>
          <span>·</span>
          <span>7 min read</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          First Home Buyer Guide — Queensland (2026)
        </h1>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#fhog-qld" className="hover:underline">$30,000 First Home Owner Grant QLD</a></li>
            <li><a href="#stamp-duty-qld" className="hover:underline">Stamp duty concession in QLD</a></li>
            <li><a href="#federal-schemes" className="hover:underline">Federal schemes in QLD</a></li>
            <li><a href="#qld-specific" className="hover:underline">QLD-specific schemes &amp; resources</a></li>
            <li><a href="#median-prices" className="hover:underline">Median property prices</a></li>
            <li><a href="#buying-process" className="hover:underline">The QLD buying process</a></li>
            <li><a href="#contacts" className="hover:underline">Key contacts</a></li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> Grant amounts, thresholds, and eligibility rules change regularly. Verify current details with the Queensland Revenue Office or a licensed professional before proceeding.
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="fhog-qld">$30,000 First Home Owner Grant QLD</h2>
          <p>
            Queensland has one of the most generous First Home Owner Grants in Australia — <strong>$30,000</strong> for eligible first home buyers purchasing or building a new home. This is three times the grant offered by NSW and Victoria.
          </p>
          <h3>Eligibility requirements</h3>
          <ul>
            <li>At least one applicant must be an Australian citizen or permanent resident</li>
            <li>All applicants must be 18 years or older</li>
            <li>No applicant can have previously owned residential property in Australia</li>
            <li>At least one applicant must occupy the home as their principal place of residence for at least 12 months within 12 months of completion or settlement</li>
          </ul>
          <h3>Eligible properties</h3>
          <ul>
            <li>New homes (not previously occupied or sold as residential property) with a contract price of $750,000 or less</li>
            <li>Owner-built new homes must have a building contract value of $750,000 or less</li>
            <li>Established properties do <strong>not</strong> qualify for the FHOG in QLD</li>
          </ul>
          <h3>When is the grant paid?</h3>
          <p>
            For purchases (e.g., off-the-plan), the grant is paid at settlement. For construction contracts (building a new home), it is paid when your first progress payment is requested by the builder. Apply through the Queensland Revenue Office, or through your lender — most lenders can process the FHOG application alongside your loan application.
          </p>

          <h2 id="stamp-duty-qld">Stamp Duty (Transfer Duty) Concession in QLD</h2>
          <p>
            Queensland does not offer a full stamp duty exemption for first home buyers in the way NSW and VIC do. Instead, it offers a concessional duty rate for owner-occupiers (not exclusive to first home buyers). However, first home buyers who are owner-occupiers receive the benefit of the concessional rate.
          </p>
          <h3>First Home Concession</h3>
          <ul>
            <li>Available for properties priced at $550,000 or less for homes (established or new)</li>
            <li>For vacant land: no duty on land valued at $400,000 or less, with a concession for $400,001–$500,000</li>
            <li>The property must be your first home in Australia and you must intend to occupy it within 12 months</li>
          </ul>
          <p>
            On a $500,000 home, a first home buyer in QLD pays approximately $8,750 in transfer duty — compared to $17,325 for a standard buyer (owner-occupier rate). The saving is substantial. Use our <Link href="/stamp-duty-calculator" className="text-primary hover:underline">Stamp Duty Calculator</Link> for precise figures.
          </p>
          <h3>Home Concession (not exclusive to first home buyers)</h3>
          <p>
            Queensland also applies a standard home concession for all owner-occupiers (not just first home buyers), resulting in lower duty than the general rate. This applies to properties where the buyer intends to occupy as principal place of residence.
          </p>

          <h2 id="federal-schemes">Federal Schemes Available in QLD</h2>
          <ul>
            <li><strong>First Home Guarantee (FHBG):</strong> 5% deposit, no LMI. Income limits: $125K single / $200K couple. Property price cap in Brisbane: $700,000. Regional QLD: $550,000.</li>
            <li><strong>Regional First Home Buyer Guarantee:</strong> For buyers in regional Queensland. Moreton Bay, Gold Coast hinterland, and Sunshine Coast hinterland regional zones are popular. Property price cap applies.</li>
            <li><strong>Family Home Guarantee:</strong> 2% deposit for single parents. $125K income limit.</li>
          </ul>
          <p>
            Note: The First Home Guarantee price cap for Brisbane ($700,000) is lower than in Sydney and Melbourne, reflecting Queensland&apos;s lower median prices — though South East Queensland prices have risen significantly since 2020.
          </p>

          <h2 id="qld-specific">QLD-Specific Schemes &amp; Resources</h2>
          <ul>
            <li>
              <strong>Queensland Housing Finance Loan:</strong> For low-to-moderate income earners who cannot access a loan from a traditional lender. Administered by Homes and Housing QLD. Check eligibility at qld.gov.au/housing.
            </li>
            <li>
              <strong>Deposit assist (shared equity):</strong> Some Queensland credit unions and building societies offer shared equity arrangements for first home buyers — check with your broker or lender.
            </li>
            <li>
              <strong>First Home Vacant Land Concession:</strong> For buyers purchasing vacant land to build their first home. Reduced transfer duty applies on land valued at $400,000 or less.
            </li>
          </ul>

          <h2 id="median-prices">Median Property Prices for First Home Buyers</h2>
          <p>
            South East Queensland has experienced significant price growth since 2020. First home buyers typically look at:
          </p>
          <ul>
            <li><strong>Brisbane outer suburbs:</strong> Ipswich, Logan, and Moreton Bay regions with house medians from $600,000–$800,000</li>
            <li><strong>Moreton Bay region:</strong> North Lakes, Caboolture, Redcliffe — popular for first home buyers with medians from $620,000–$750,000</li>
            <li><strong>Gold Coast hinterland:</strong> Ormeau, Coomera, Pimpama — house medians from $680,000–$800,000</li>
            <li><strong>Regional Queensland:</strong> Toowoomba, Rockhampton, Mackay — house medians $400,000–$600,000 with high rental yields</li>
          </ul>
          <p>
            Browse suburb profiles for QLD on <Link href="/suburbs" className="text-primary hover:underline">Your Property Guide</Link> for current data.
          </p>

          <h2 id="buying-process">The QLD Buying Process</h2>
          <p>
            Queensland has some distinct features compared to other states:
          </p>
          <ul>
            <li><strong>REIQ contract:</strong> Queensland uses the Real Estate Institute of Queensland (REIQ) standard contract of sale, which includes standard conditions including building and pest inspection, finance, and sometimes FIRB.</li>
            <li><strong>Conditions are built in:</strong> Unlike NSW, building inspections and finance conditions are typically included in the contract before it is signed — you negotiate the conditions upfront rather than during a cooling-off period.</li>
            <li><strong>Cooling-off period:</strong> 5 business days from the buyer&apos;s receipt of the contract (for residential property, not at auction)</li>
            <li><strong>Auctions:</strong> Less common than in Sydney and Melbourne. Private treaty (conditional contract) is the dominant method in QLD.</li>
            <li><strong>Settlement:</strong> Typically 30–60 days; conducted electronically via PEXA</li>
          </ul>
          <p>
            For the full step-by-step buying process, see our <Link href="/guides/buying-property-australia" className="text-primary hover:underline">Complete Property Buying Guide</Link>.
          </p>

          <h2 id="contacts">Key QLD Contacts</h2>
          <ul>
            <li>
              <strong>Queensland Revenue Office</strong> — FHOG, transfer duty, concessions:{" "}
              <a href="https://www.qro.qld.gov.au/duties/transfer-duty/first-home-grant/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                qro.qld.gov.au
              </a>
            </li>
            <li>
              <strong>Homes and Housing QLD</strong> — Queensland Housing Finance Loan and housing assistance:{" "}
              <a href="https://www.qld.gov.au/housing" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                qld.gov.au/housing
              </a>
            </li>
            <li>
              <strong>Housing Australia</strong> — First Home Guarantee and federal schemes:{" "}
              <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                housingaustralia.gov.au
              </a>
            </li>
          </ul>

        </div>
      </div>
    </div>
  );
}
