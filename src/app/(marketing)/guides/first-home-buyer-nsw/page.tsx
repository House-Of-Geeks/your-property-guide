import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `First Home Buyer Guide NSW: Grants, Stamp Duty & Schemes (2026) | ${SITE_NAME}`,
  description:
    "NSW first home buyer guide: $10,000 FHOG for new homes, stamp duty exemption up to $800K, concession to $1M, federal schemes, and step-by-step NSW buying advice. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/first-home-buyer-nsw` },
  openGraph: {
    url: `${SITE_URL}/guides/first-home-buyer-nsw`,
    title: "First Home Buyer Guide NSW: Grants, Stamp Duty & Schemes (2026)",
    description:
      "NSW first home buyer guide: $10,000 FHOG, stamp duty exemption up to $800K, concession to $1M, and federal scheme eligibility.",
    type: "article",
  },
};

export default function FirstHomeBuyerNSWPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "First Home Buyer Guide", url: "/guides/first-home-buyer-guide" },
          { name: "NSW", url: "/guides/first-home-buyer-nsw" },
        ]}
      />
      <GuideArticleJsonLd
        title="First Home Buyer Guide NSW: Grants, Stamp Duty & Schemes (2026)"
        description="NSW first home buyer guide: $10,000 FHOG for new homes, stamp duty exemption up to $800K, concession to $1M, federal schemes, and step-by-step NSW buying advice. Updated 2026."
        url="/guides/first-home-buyer-nsw"
        datePublished="2026-04-01"
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "First Home Buyer Guide", href: "/guides/first-home-buyer-guide" },
          { label: "NSW" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <span>Last updated: April 2026</span>
          <span>·</span>
          <span>7 min read</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          First Home Buyer Guide — New South Wales (2026)
        </h1>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#fhog-nsw" className="hover:underline">First Home Owner Grant NSW</a></li>
            <li><a href="#stamp-duty-nsw" className="hover:underline">Stamp duty exemption &amp; concession</a></li>
            <li><a href="#federal-schemes" className="hover:underline">Federal schemes available in NSW</a></li>
            <li><a href="#nsw-specific" className="hover:underline">NSW-specific schemes &amp; resources</a></li>
            <li><a href="#median-prices" className="hover:underline">Median property prices for first home buyers</a></li>
            <li><a href="#buying-process" className="hover:underline">The NSW buying process</a></li>
            <li><a href="#contacts" className="hover:underline">Key contacts</a></li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> Grant amounts, thresholds, and eligibility rules change regularly. Verify current details with Revenue NSW or a licensed professional before proceeding.
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="fhog-nsw">First Home Owner Grant NSW</h2>
          <p>
            NSW offers a $10,000 First Home Owner Grant (FHOG) for eligible first home buyers who purchase or build a new home. The grant is funded by the NSW Government and administered by Revenue NSW.
          </p>
          <h3>Eligibility requirements</h3>
          <ul>
            <li>At least one applicant must be an Australian citizen or permanent resident</li>
            <li>All applicants must be individuals (not companies or trusts)</li>
            <li>All applicants must be at least 18 years old at the date of the transaction</li>
            <li>None of the applicants can have previously owned residential property in Australia</li>
            <li>At least one applicant must occupy the property for at least 12 continuous months within 12 months of settlement</li>
          </ul>
          <h3>Eligible properties</h3>
          <ul>
            <li>New homes (never previously occupied or sold) — $750,000 or less</li>
            <li>Substantially renovated homes — $750,000 or less</li>
            <li>Owner-builder new homes — must meet the same price cap</li>
            <li>Note: established homes do <strong>not</strong> qualify for the NSW FHOG</li>
          </ul>
          <h3>How and when the grant is paid</h3>
          <p>
            For purchases, the grant is typically paid at settlement through your lender. For owner-builders, it is paid when an occupancy certificate is issued. Apply through Revenue NSW (apply online at revenue.nsw.gov.au or through your lending institution).
          </p>

          <h2 id="stamp-duty-nsw">Stamp Duty Exemption &amp; Concession</h2>
          <p>
            NSW offers significant stamp duty relief for first home buyers on both new and established properties. Since September 2023, concessions apply to eligible buyers purchasing any home (new or established).
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Purchase Price</th>
                  <th>Stamp Duty Payable</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Up to $800,000</td><td>$0 (full exemption)</td></tr>
                <tr><td>$800,001 – $1,000,000</td><td>Concession (scaled — reduced rate)</td></tr>
                <tr><td>Over $1,000,000</td><td>Full stamp duty applies</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            For a $750,000 home, a first home buyer in NSW pays <strong>$0</strong> in stamp duty. For a standard buyer, stamp duty on $750,000 would be approximately $28,957 — a significant saving. Use our <Link href="/stamp-duty-calculator" className="text-primary hover:underline">Stamp Duty Calculator</Link> to calculate your exact saving.
          </p>
          <h3>Eligibility for the concession</h3>
          <ul>
            <li>The property must be your first home in Australia</li>
            <li>You must intend to occupy it as your principal place of residence within 12 months</li>
            <li>Both new and established homes are eligible (unlike the FHOG, which is new homes only)</li>
          </ul>
          <h3>First Home Buyer Choice (optional annual property tax)</h3>
          <p>
            NSW introduced the First Home Buyer Choice scheme in 2023, giving buyers the option to pay an annual property tax instead of stamp duty upfront. This is available for properties up to $1.5M. The annual tax is calculated as 0.3% of land value for owner-occupiers. This option can improve cash flow for buyers who prefer not to pay the large stamp duty upfront, but results in ongoing costs. Seek advice on which option suits your situation.
          </p>

          <h2 id="federal-schemes">Federal Schemes Available in NSW</h2>
          <ul>
            <li><strong>First Home Guarantee (FHBG):</strong> 5% deposit, no LMI. Income limits: $125K single / $200K couple. Property price cap in Sydney metro: $900,000. Regional NSW: $750,000.</li>
            <li><strong>Regional First Home Buyer Guarantee:</strong> Same as FHBG for buyers purchasing in regional NSW. You must have lived in the area for 12+ months.</li>
            <li><strong>Family Home Guarantee:</strong> 2% deposit for single parents. Income limit $125K. Price cap same as FHBG.</li>
          </ul>
          <p>
            These federal schemes are available through participating lenders nationwide including in NSW. See our <Link href="/guides/first-home-buyer-guide" className="text-primary hover:underline">National First Home Buyer Guide</Link> for full details.
          </p>

          <h2 id="nsw-specific">NSW-Specific Schemes &amp; Resources</h2>
          <ul>
            <li>
              <strong>Shared Equity Home Buyer Helper (NSW):</strong> The NSW Government&apos;s own shared equity scheme — eligible buyers can purchase with the state government co-investing up to 40% (new homes) or 30% (existing). Income caps apply ($90K single, $120K couple). Available for key workers, single parents, and older singles (50+) in certain circumstances. Check eligibility at Service NSW.
            </li>
            <li>
              <strong>Revenue NSW First Home Buyer Assistance Scheme:</strong> Covers the stamp duty exemption/concession and FHOG application process in one place at revenue.nsw.gov.au.
            </li>
          </ul>

          <h2 id="median-prices">Median Property Prices for First Home Buyers</h2>
          <p>
            Sydney remains one of the most expensive markets in Australia. First home buyers typically target:
          </p>
          <ul>
            <li><strong>Units in middle-ring suburbs:</strong> Median around $700,000–$900,000 (Western Suburbs, Inner West, Northern Beaches units)</li>
            <li><strong>Houses in outer suburbs:</strong> Western Sydney suburbs like Campbelltown, Penrith, and Blacktown with medians from $750,000–$950,000</li>
            <li><strong>Regional NSW:</strong> Cities like Newcastle, Wollongong, and the Central Coast with unit medians from $500,000–$700,000</li>
          </ul>
          <p>
            Use our <Link href="/suburbs" className="text-primary hover:underline">suburb profiles</Link> to research current median prices, rental yields, and market trends in any NSW suburb.
          </p>

          <h2 id="buying-process">The NSW Buying Process</h2>
          <p>
            NSW has some unique features in its conveyancing process:
          </p>
          <ul>
            <li><strong>Cooling-off period:</strong> 5 business days from exchange (except auctions, which have no cooling-off period)</li>
            <li><strong>Contract of sale:</strong> The vendor prepares a contract before listing the property, which you can review prior to making an offer</li>
            <li><strong>Strata reports:</strong> For apartments, your solicitor should review the strata report and financial statements before exchange</li>
            <li><strong>Settlement:</strong> Typically 6 weeks after exchange but negotiable; conducted electronically via PEXA</li>
          </ul>
          <p>
            For the full step-by-step process, see our <Link href="/guides/buying-property-australia" className="text-primary hover:underline">Complete Property Buying Guide</Link>.
          </p>

          <h2 id="contacts">Key NSW Contacts</h2>
          <ul>
            <li>
              <strong>Revenue NSW</strong> — FHOG, stamp duty concessions, First Home Buyer Assistance Scheme:{" "}
              <a href="https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                revenue.nsw.gov.au
              </a>
            </li>
            <li>
              <strong>NSW Fair Trading</strong> — Contracts, conveyancing, and consumer rights:{" "}
              <a href="https://www.fairtrading.nsw.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                fairtrading.nsw.gov.au
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
