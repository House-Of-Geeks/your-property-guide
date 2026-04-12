import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `First Home Buyer Guide VIC: Grants, Stamp Duty & Schemes (2026) | ${SITE_NAME}`,
  description:
    "Victoria first home buyer guide: $10K FHOG (regional $20K), stamp duty exemption up to $600K, concession to $750K, federal schemes, and VIC buying tips. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/first-home-buyer-vic` },
  openGraph: {
    url: `${SITE_URL}/guides/first-home-buyer-vic`,
    title: "First Home Buyer Guide VIC: Grants, Stamp Duty & Schemes (2026)",
    description:
      "Victoria first home buyer guide: $10K FHOG (regional $20K), stamp duty exemption up to $600K, concession to $750K, and federal scheme eligibility.",
    type: "article",
  },
};

export default function FirstHomeBuyerVICPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "First Home Buyer Guide", url: "/guides/first-home-buyer-guide" },
          { name: "VIC", url: "/guides/first-home-buyer-vic" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "First Home Buyer Guide", href: "/guides/first-home-buyer-guide" },
          { label: "VIC" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <span>Last updated: April 2026</span>
          <span>·</span>
          <span>7 min read</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          First Home Buyer Guide — Victoria (2026)
        </h1>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#fhog-vic" className="hover:underline">First Home Owner Grant VIC</a></li>
            <li><a href="#stamp-duty-vic" className="hover:underline">Stamp duty exemption &amp; concession</a></li>
            <li><a href="#federal-schemes" className="hover:underline">Federal schemes in VIC</a></li>
            <li><a href="#vic-specific" className="hover:underline">VIC-specific schemes &amp; resources</a></li>
            <li><a href="#median-prices" className="hover:underline">Median property prices</a></li>
            <li><a href="#buying-process" className="hover:underline">The VIC buying process</a></li>
            <li><a href="#contacts" className="hover:underline">Key contacts</a></li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> Grant amounts, thresholds, and eligibility rules change regularly. Verify current details with the State Revenue Office Victoria (SRO) or a licensed professional before proceeding.
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="fhog-vic">First Home Owner Grant VIC</h2>
          <p>
            Victoria offers the First Home Owner Grant (FHOG) for eligible buyers purchasing new homes. The grant amount depends on whether you are buying in metropolitan Melbourne or regional Victoria:
          </p>
          <ul>
            <li><strong>Metro Melbourne:</strong> $10,000</li>
            <li><strong>Regional Victoria:</strong> $20,000 — a significant boost for buyers targeting regional cities and towns</li>
          </ul>
          <p>
            &ldquo;Regional Victoria&rdquo; for FHOG purposes is broadly defined as anywhere outside of Melbourne&apos;s metropolitan boundary. Cities such as Geelong, Ballarat, Bendigo, Wodonga, and the Latrobe Valley all qualify. The State Revenue Office publishes a boundary map.
          </p>
          <h3>Eligibility requirements</h3>
          <ul>
            <li>At least one applicant must be an Australian citizen or permanent resident</li>
            <li>All applicants must be 18 years or older</li>
            <li>None of the applicants can have previously owned residential property in Australia</li>
            <li>At least one applicant must occupy the home for 12 continuous months within 12 months of settlement or completion</li>
          </ul>
          <h3>Eligible properties</h3>
          <ul>
            <li>New homes (first time sold as residential) with a total value (house + land) of $750,000 or less</li>
            <li>Substantially renovated homes (extensive renovation where original dwelling was removed/replaced)</li>
            <li>Established homes do <strong>not</strong> qualify</li>
          </ul>

          <h2 id="stamp-duty-vic">Stamp Duty Exemption &amp; Concession</h2>
          <p>
            Victoria provides stamp duty (land transfer duty) relief for eligible first home buyers on both new and established properties.
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
                <tr><td>Up to $600,000</td><td>$0 (full exemption)</td></tr>
                <tr><td>$600,001 – $750,000</td><td>Concession (scaled reduction — not zero but significantly reduced)</td></tr>
                <tr><td>Over $750,000</td><td>Full transfer duty applies</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            On a $550,000 purchase, a first home buyer in Victoria pays <strong>$0</strong> in stamp duty. Without the concession, stamp duty on $550,000 would be approximately $26,070. Use our <Link href="/stamp-duty-calculator" className="text-primary hover:underline">Stamp Duty Calculator</Link> for your exact figures.
          </p>
          <h3>Principal Place of Residence (PPR) duty reduction (non-first home buyers)</h3>
          <p>
            Note: Victoria also offers a PPR concession for owner-occupiers who are <em>not</em> first home buyers on properties up to $550,000 — this is separate from the first home buyer exemption.
          </p>

          <h2 id="federal-schemes">Federal Schemes Available in VIC</h2>
          <ul>
            <li><strong>First Home Guarantee (FHBG):</strong> 5% deposit, no LMI. Income limits: $125K single / $200K couple. Property price cap in Melbourne: $800,000. Regional VIC: $650,000.</li>
            <li><strong>Regional First Home Buyer Guarantee:</strong> For buyers in regional VIC. Same terms as FHBG. Regional cities like Geelong, Ballarat, and Bendigo are highly popular under this scheme.</li>
            <li><strong>Family Home Guarantee:</strong> 2% deposit for single parents. $125K income limit.</li>
          </ul>

          <h2 id="vic-specific">VIC-Specific Schemes &amp; Resources</h2>
          <ul>
            <li>
              <strong>Homes Victoria shared equity program:</strong> Check homes.vic.gov.au for any current co-contribution or affordable housing programs for first home buyers in Victoria. The state has run various shared equity pilots aimed at lower and middle-income first home buyers.
            </li>
            <li>
              <strong>Victorian Homebuyer Fund:</strong> A shared equity scheme where the Victorian Government takes an equity stake in the property (up to 25%), reducing the deposit required to 5% with no LMI. Income caps and property price caps apply. Check current availability and eligibility at homes.vic.gov.au.
            </li>
          </ul>

          <h2 id="median-prices">Median Property Prices for First Home Buyers</h2>
          <p>
            Melbourne&apos;s property market has large price variation by distance from the CBD. First home buyers typically focus on:
          </p>
          <ul>
            <li><strong>Outer Melbourne suburbs:</strong> Western suburbs (Werribee, Hoppers Crossing), Outer North (Craigieburn, Epping), and South East (Berwick, Cranbourne) with house medians from $580,000–$780,000</li>
            <li><strong>Units &amp; apartments:</strong> Melbourne CBD fringe and inner suburbs like Footscray and Sunshine, with unit medians from $400,000–$600,000</li>
            <li><strong>Regional Victoria:</strong> Geelong (median houses $700,000–$800,000), Ballarat ($500,000–$600,000), Bendigo ($450,000–$550,000) — all highly affordable compared to Melbourne</li>
          </ul>
          <p>
            Browse our <Link href="/suburbs" className="text-primary hover:underline">suburb profiles</Link> for current market data on any Victorian suburb.
          </p>

          <h2 id="buying-process">The VIC Buying Process</h2>
          <p>
            Victoria has some distinct features:
          </p>
          <ul>
            <li><strong>Section 32 (Vendor&apos;s Statement):</strong> Vendors must provide a Section 32 statement before a contract is signed. It contains title information, planning overlays, outgoings, and building permits. Review it carefully with your solicitor before signing.</li>
            <li><strong>Cooling-off period:</strong> 3 business days from signing the contract of sale (not applicable at auction)</li>
            <li><strong>Auction market:</strong> Melbourne is one of Australia&apos;s most active auction markets. Do your pre-auction due diligence — building inspections, finance confirmation, and contract review should all be completed before bidding.</li>
            <li><strong>Settlement:</strong> Typically 30–60 days; conducted via PEXA</li>
          </ul>

          <h2 id="contacts">Key VIC Contacts</h2>
          <ul>
            <li>
              <strong>State Revenue Office VIC (SRO)</strong> — FHOG, stamp duty concessions:{" "}
              <a href="https://www.sro.vic.gov.au/first-home-buyer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                sro.vic.gov.au
              </a>
            </li>
            <li>
              <strong>Homes Victoria</strong> — Victorian Homebuyer Fund and affordable housing:{" "}
              <a href="https://www.homes.vic.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                homes.vic.gov.au
              </a>
            </li>
            <li>
              <strong>Consumer Affairs Victoria</strong> — Contracts and tenant/buyer rights:{" "}
              <a href="https://www.consumer.vic.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                consumer.vic.gov.au
              </a>
            </li>
          </ul>

        </div>
      </div>
    </div>
  );
}
