import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `First Home Buyer Guide WA: $10K Grant, Stamp Duty & Schemes (2026) | ${SITE_NAME}`,
  description:
    "Western Australia first home buyer guide: $10,000 FHOG for new homes under $750K, stamp duty exemption under $450K, concession to $600K, federal schemes. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/first-home-buyer-wa` },
  openGraph: {
    url: `${SITE_URL}/guides/first-home-buyer-wa`,
    title: "First Home Buyer Guide WA: $10K Grant, Stamp Duty & Schemes (2026)",
    description:
      "WA first home buyer guide: $10,000 FHOG, stamp duty exemption under $450K, concession to $600K, and federal scheme eligibility.",
    type: "article",
  },
};

export default function FirstHomeBuyerWAPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "First Home Buyer Guide", url: "/guides/first-home-buyer-guide" },
          { name: "WA", url: "/guides/first-home-buyer-wa" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "First Home Buyer Guide", href: "/guides/first-home-buyer-guide" },
          { label: "WA" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <span>Last updated: April 2026</span>
          <span>·</span>
          <span>7 min read</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          First Home Buyer Guide — Western Australia (2026)
        </h1>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#fhog-wa" className="hover:underline">First Home Owner Grant WA</a></li>
            <li><a href="#stamp-duty-wa" className="hover:underline">Stamp duty exemption &amp; concession</a></li>
            <li><a href="#federal-schemes" className="hover:underline">Federal schemes in WA</a></li>
            <li><a href="#wa-specific" className="hover:underline">WA-specific schemes &amp; resources</a></li>
            <li><a href="#median-prices" className="hover:underline">Median property prices</a></li>
            <li><a href="#buying-process" className="hover:underline">The WA buying process</a></li>
            <li><a href="#contacts" className="hover:underline">Key contacts</a></li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> Grant amounts, thresholds, and eligibility rules change regularly. Verify current details with the WA State Revenue Office or a licensed professional before proceeding.
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="fhog-wa">First Home Owner Grant WA</h2>
          <p>
            Western Australia offers a $10,000 First Home Owner Grant (FHOG) for eligible first home buyers purchasing or building new homes. WA&apos;s property market has seen strong growth since 2021, making the FHOG a meaningful contributor for buyers targeting new builds.
          </p>
          <h3>Eligibility requirements</h3>
          <ul>
            <li>At least one applicant must be an Australian citizen or permanent resident</li>
            <li>All applicants must be 18 years or older</li>
            <li>No applicant can have previously owned residential property in Australia on or after 1 July 2000 (or received the FHOG on an earlier purchase)</li>
            <li>At least one applicant must occupy the home as their principal place of residence for at least 6 months within 12 months of settlement or completion</li>
          </ul>
          <h3>Eligible properties</h3>
          <ul>
            <li>New homes (never previously sold as residential) with a purchase price of $750,000 or less</li>
            <li>Owner-built homes — the total value of the land plus building contract must be $750,000 or less</li>
            <li>Substantially renovated homes (significant renovation of an existing dwelling)</li>
            <li>Established (second-hand) homes do <strong>not</strong> qualify for the WA FHOG</li>
          </ul>
          <h3>How to apply</h3>
          <p>
            Applications can be lodged through the Office of State Revenue (OSR), or through your lending institution at the time of loan application. For purchases, apply within 12 months of settlement. For construction, apply within 12 months of the first drawing of the loan.
          </p>

          <h2 id="stamp-duty-wa">Stamp Duty (Transfer Duty) Exemption &amp; Concession</h2>
          <p>
            Western Australia provides first home buyers with significant stamp duty relief — one of the more generous regimes in Australia relative to property prices.
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Purchase Price</th>
                  <th>Duty Payable</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Up to $450,000</td><td>$0 (full exemption)</td></tr>
                <tr><td>$450,001 – $600,000</td><td>Concession (scaled — progressively reduced)</td></tr>
                <tr><td>Over $600,000</td><td>Full transfer duty applies</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            On a $400,000 purchase — typical for Perth&apos;s outer suburbs — a first home buyer pays <strong>$0</strong> in transfer duty. The standard transfer duty on $400,000 would be approximately $13,433. Use our <Link href="/stamp-duty-calculator" className="text-primary hover:underline">Stamp Duty Calculator</Link> for your exact figures.
          </p>
          <h3>Eligibility for the concession</h3>
          <ul>
            <li>The property must be your first home in Australia</li>
            <li>You must occupy the property as your principal place of residence within 12 months of settlement</li>
            <li>Both new and established homes qualify for the stamp duty concession (unlike the FHOG)</li>
          </ul>

          <h2 id="federal-schemes">Federal Schemes Available in WA</h2>
          <ul>
            <li><strong>First Home Guarantee (FHBG):</strong> 5% deposit, no LMI. Income limits: $125K single / $200K couple. Property price cap in Perth: $600,000. Regional WA: $450,000.</li>
            <li><strong>Regional First Home Buyer Guarantee:</strong> For buyers in regional WA — areas like Bunbury, Geraldton, Kalgoorlie, and the Pilbara. You must have lived in the area for 12+ months.</li>
            <li><strong>Family Home Guarantee:</strong> 2% deposit for single parents. $125K income limit. Perth price cap $600,000.</li>
          </ul>
          <p>
            Note: WA&apos;s property price caps under the FHBG ($600,000 for Perth) are lower than east coast capitals, reflecting WA&apos;s historically more affordable market. With Perth&apos;s rapid price growth since 2021, this cap has become a limitation for buyers in some inner and middle-ring suburbs — always verify current caps.
          </p>

          <h2 id="wa-specific">WA-Specific Schemes &amp; Resources</h2>
          <ul>
            <li>
              <strong>Keystart Home Loans:</strong> Keystart is a WA Government home loan provider specifically for low-to-moderate income earners who cannot qualify for a standard bank loan. Keystart offers low deposit home loans (as low as 2% deposit in some cases) without LMI. Income limits apply. This is unique to WA and a significant advantage for eligible buyers. Apply at keystart.com.au.
            </li>
            <li>
              <strong>SharedStart (Keystart):</strong> A shared equity option through Keystart where the State Government takes a small equity co-investment, reducing the loan size and required deposit. Check availability at keystart.com.au.
            </li>
            <li>
              <strong>Aboriginal Home Ownership Program:</strong> Specifically for Aboriginal and Torres Strait Islander first home buyers — check the Department of Communities WA for details.
            </li>
          </ul>

          <h2 id="median-prices">Median Property Prices for First Home Buyers</h2>
          <p>
            Perth has experienced strong price growth since 2021 but remains more affordable than Sydney and Melbourne:
          </p>
          <ul>
            <li><strong>Outer Perth (northern corridor):</strong> Joondalup, Wanneroo, Butler — house medians from $530,000–$680,000</li>
            <li><strong>Outer Perth (southern corridor):</strong> Rockingham, Mandurah, Armadale — house medians from $450,000–$600,000</li>
            <li><strong>Middle ring suburbs:</strong> Midland, Swan, Bayswater — house medians from $600,000–$780,000</li>
            <li><strong>Regional WA:</strong> Bunbury, Geraldton, Kalgoorlie — house medians from $350,000–$500,000, with Bunbury seeing strong growth</li>
          </ul>
          <p>
            Explore suburb profiles across WA on <Link href="/suburbs" className="text-primary hover:underline">Your Property Guide</Link>.
          </p>

          <h2 id="buying-process">The WA Buying Process</h2>
          <p>
            Western Australia has some notable differences from eastern states:
          </p>
          <ul>
            <li><strong>No statutory cooling-off period:</strong> Unlike NSW, VIC, and QLD, Western Australia does not have a statutory cooling-off period for residential property purchased under private treaty. Once contracts are exchanged and conditions have been waived or fulfilled, you are committed. This makes pre-contract due diligence even more important.</li>
            <li><strong>Offer and Acceptance:</strong> WA uses an &ldquo;Offer and Acceptance&rdquo; form — the buyer makes a written offer, and if the seller accepts, the signed document becomes a binding contract. Conditions (finance, building inspection, etc.) are negotiated and included in the offer.</li>
            <li><strong>Joint Form of General Conditions:</strong> The offer references general conditions maintained by REIWA and the Law Society of WA.</li>
            <li><strong>Auctions:</strong> Less common in WA than eastern states. Private treaty is the standard method.</li>
            <li><strong>Settlement:</strong> Typically 30–60 days; conducted electronically via PEXA.</li>
          </ul>
          <p>
            For the full step-by-step buying process, see our <Link href="/guides/buying-property-australia" className="text-primary hover:underline">Complete Property Buying Guide</Link>.
          </p>

          <h2 id="contacts">Key WA Contacts</h2>
          <ul>
            <li>
              <strong>WA Department of Finance — Revenue</strong> — FHOG, stamp duty, first home buyer concessions:{" "}
              <a href="https://www.wa.gov.au/service/financial-services/financial-assistance/first-home-owner-grant" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                wa.gov.au
              </a>
            </li>
            <li>
              <strong>Keystart Home Loans</strong> — WA Government low deposit home loans:{" "}
              <a href="https://www.keystart.com.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                keystart.com.au
              </a>
            </li>
            <li>
              <strong>Housing Australia</strong> — First Home Guarantee and federal schemes:{" "}
              <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                housingaustralia.gov.au
              </a>
            </li>
            <li>
              <strong>REIWA</strong> — Real Estate Institute of Western Australia, market data and buying resources:{" "}
              <a href="https://www.reiwa.com.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                reiwa.com.au
              </a>
            </li>
          </ul>

        </div>
      </div>
    </div>
  );
}
