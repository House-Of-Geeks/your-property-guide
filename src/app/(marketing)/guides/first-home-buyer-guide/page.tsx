import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `First Home Buyer Guide Australia: Grants, Schemes & Steps (2026) | ${SITE_NAME}`,
  description:
    "Complete guide for Australian first home buyers: federal grants and schemes (FHBG, Family Home Guarantee), state grants by state, stamp duty concessions, and step-by-step buying advice.",
  alternates: { canonical: `${SITE_URL}/guides/first-home-buyer-guide` },
  openGraph: {
    url: `${SITE_URL}/guides/first-home-buyer-guide`,
    title: "First Home Buyer Guide Australia: Grants, Schemes & Steps (2026)",
    description:
      "Complete guide for Australian first home buyers: federal grants and schemes (FHBG, Family Home Guarantee), state grants by state, stamp duty concessions, and step-by-step buying advice.",
    type: "article",
  },
};

export default function FirstHomeBuyerGuidePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "First Home Buyer Guide", url: "/guides/first-home-buyer-guide" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "First Home Buyer Guide" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <span>Last updated: April 2026</span>
          <span>·</span>
          <span>10 min read</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          First Home Buyer Guide Australia: Grants, Schemes &amp; Steps (2026)
        </h1>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#overview" className="hover:underline">Overview</a></li>
            <li><a href="#federal-schemes" className="hover:underline">Federal government schemes</a></li>
            <li><a href="#fhog-by-state" className="hover:underline">First Home Owner Grant by state</a></li>
            <li><a href="#stamp-duty-concessions" className="hover:underline">Stamp duty concessions</a></li>
            <li><a href="#step-by-step" className="hover:underline">Step-by-step buying process</a></li>
            <li><a href="#common-mistakes" className="hover:underline">Common mistakes first home buyers make</a></li>
            <li><a href="#using-a-broker" className="hover:underline">Using a broker with the First Home Guarantee</a></li>
            <li><a href="#state-guides" className="hover:underline">State-specific guides</a></li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> This guide is for general information only. Grant amounts, income limits, and property price caps change regularly. Always verify current eligibility criteria with the relevant government agency or a licensed professional before relying on this information.
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="overview">Overview: Becoming a First Home Buyer in Australia</h2>
          <p>
            Buying your first home in Australia has never been more assisted by government — there are federal schemes, state grants, and stamp duty concessions that together can save eligible buyers $30,000–$60,000 or more. The challenge is that the schemes are complex, have different eligibility rules, and often interact with each other in ways that require careful planning.
          </p>
          <p>
            The good news: if you&apos;re eligible, combining a federal scheme like the First Home Guarantee with a state First Home Owner Grant and stamp duty concessions can mean buying your first home with as little as 5% deposit, no Lenders Mortgage Insurance, a cash grant, and reduced or zero stamp duty.
          </p>
          <p>
            This guide covers the national picture. For state-specific detail, see our guides for{" "}
            <Link href="/guides/first-home-buyer-nsw" className="text-primary hover:underline">NSW</Link>,{" "}
            <Link href="/guides/first-home-buyer-vic" className="text-primary hover:underline">VIC</Link>,{" "}
            <Link href="/guides/first-home-buyer-qld" className="text-primary hover:underline">QLD</Link>, and{" "}
            <Link href="/guides/first-home-buyer-wa" className="text-primary hover:underline">WA</Link>.
          </p>

          <h2 id="federal-schemes">Federal Government Schemes</h2>
          <p>
            The Australian Government runs several schemes administered through Housing Australia (formerly NHFIC). These schemes allow eligible buyers to purchase with a smaller deposit without paying Lenders Mortgage Insurance (LMI) — the government guarantees the gap.
          </p>

          <h3>1. First Home Guarantee (FHBG)</h3>
          <p>
            The most widely used scheme. It allows eligible first home buyers to purchase a property with as little as a <strong>5% deposit</strong> without paying LMI.
          </p>
          <ul>
            <li><strong>Income limits:</strong> $125,000/year for singles; $200,000/year for couples (combined taxable income from the previous financial year)</li>
            <li><strong>Who qualifies:</strong> Australian citizens or permanent residents aged 18+, who have not previously owned or had an interest in real property in Australia</li>
            <li><strong>Property type:</strong> New and established residential properties</li>
            <li><strong>Property price caps (selected, 2025–26):</strong> Vary by location — typically $800,000–$900,000 in capital cities and $650,000–$750,000 in regional areas. Check Housing Australia&apos;s website for the cap in your specific location.</li>
            <li><strong>Number of places per year:</strong> 35,000 places (shared with Regional First Home Buyer Guarantee)</li>
            <li><strong>How to access:</strong> Apply through a participating lender — most major banks and many credit unions participate</li>
          </ul>

          <h3>2. Regional First Home Buyer Guarantee</h3>
          <p>
            The same structure as the FHBG but specifically for buyers purchasing in <strong>regional Australia</strong>. You must have lived in the regional area (or an adjacent area) for at least 12 months continuously prior to purchase.
          </p>
          <ul>
            <li>Same income limits and deposit (5%) as the FHBG</li>
            <li>Property price caps apply — generally the same regional caps as FHBG</li>
            <li>10,000 places per year</li>
          </ul>

          <h3>3. Family Home Guarantee</h3>
          <p>
            Designed for <strong>single parents and single legal guardians</strong> with at least one dependent child. Allows purchase with just a <strong>2% deposit</strong> without LMI.
          </p>
          <ul>
            <li><strong>Income limit:</strong> $125,000/year (single parent or guardian only)</li>
            <li>You do not need to be a first home buyer — the scheme is also available to previous homeowners who no longer own property</li>
            <li>5,000 places per year</li>
            <li>Property price caps apply as for FHBG</li>
          </ul>

          <h3>4. Help to Buy (Shared Equity Scheme)</h3>
          <p>
            The Help to Buy scheme, legislated in 2024, enables eligible buyers to purchase a home with the government taking an equity co-investment of up to 40% (new homes) or 30% (existing homes). This reduces the size of the mortgage required.
          </p>
          <ul>
            <li><strong>Income limits:</strong> $90,000 for singles; $120,000 for couples</li>
            <li>Buyers need a minimum 2% deposit and no LMI</li>
            <li>The government shares in capital gains proportional to its equity stake</li>
            <li>10,000 places per year</li>
            <li><strong>Check availability:</strong> As of 2026, the scheme&apos;s operational status and participating states — check housing.gov.au for current details.</li>
          </ul>

          <h2 id="fhog-by-state">First Home Owner Grant by State</h2>
          <p>
            The First Home Owner Grant (FHOG) is a one-off cash grant available in most states and territories. It generally only applies to <strong>new homes</strong> (newly built, substantially renovated, or off-the-plan), not established properties.
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>State/Territory</th>
                  <th>Grant Amount</th>
                  <th>Eligible Property Types</th>
                  <th>Price Cap</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>QLD</strong></td>
                  <td>$30,000</td>
                  <td>New homes (never lived in)</td>
                  <td>$750,000 contract price</td>
                </tr>
                <tr>
                  <td><strong>NSW</strong></td>
                  <td>$10,000</td>
                  <td>New homes</td>
                  <td>$600,000 (metro) / $750,000 (regional)</td>
                </tr>
                <tr>
                  <td><strong>VIC</strong></td>
                  <td>$10,000 (metro) / $20,000 (regional)</td>
                  <td>New homes</td>
                  <td>$750,000</td>
                </tr>
                <tr>
                  <td><strong>WA</strong></td>
                  <td>$10,000</td>
                  <td>New homes</td>
                  <td>$750,000</td>
                </tr>
                <tr>
                  <td><strong>SA</strong></td>
                  <td>$15,000</td>
                  <td>New homes</td>
                  <td>$650,000</td>
                </tr>
                <tr>
                  <td><strong>TAS</strong></td>
                  <td>$30,000</td>
                  <td>New homes (check current state offer)</td>
                  <td>No cap (check current rules)</td>
                </tr>
                <tr>
                  <td><strong>NT</strong></td>
                  <td>$10,000</td>
                  <td>New or substantially renovated homes</td>
                  <td>No cap</td>
                </tr>
                <tr>
                  <td><strong>ACT</strong></td>
                  <td>No FHOG</td>
                  <td>ACT has its own Home Buyer Concession Scheme instead</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>Important:</strong> Grant amounts, price caps, and eligibility criteria change. Always verify the current rules with the relevant state revenue office before proceeding.
          </p>

          <h2 id="stamp-duty-concessions">First Home Buyer Stamp Duty Concessions</h2>
          <p>
            Stamp duty is one of the biggest upfront costs when buying property. Most states offer first home buyers either a full exemption or a reduced rate on stamp duty, subject to thresholds. Use our <Link href="/stamp-duty-calculator" className="text-primary hover:underline">Stamp Duty Calculator</Link> to estimate your liability.
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>State</th>
                  <th>Full Exemption</th>
                  <th>Concessional Rate</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>NSW</strong></td>
                  <td>≤ $800,000</td>
                  <td>$800,001 – $1,000,000</td>
                  <td>New and established homes; buyer must occupy</td>
                </tr>
                <tr>
                  <td><strong>VIC</strong></td>
                  <td>≤ $600,000</td>
                  <td>$600,001 – $750,000</td>
                  <td>New and established homes</td>
                </tr>
                <tr>
                  <td><strong>QLD</strong></td>
                  <td>No full exemption</td>
                  <td>Concession for homes ≤ $550,000</td>
                  <td>First home concession; buyer must occupy</td>
                </tr>
                <tr>
                  <td><strong>WA</strong></td>
                  <td>≤ $450,000</td>
                  <td>$450,001 – $600,000</td>
                  <td>New and established homes</td>
                </tr>
                <tr>
                  <td><strong>SA</strong></td>
                  <td>Full exemption for new homes</td>
                  <td>N/A</td>
                  <td>Only applies to new/off-the-plan homes</td>
                </tr>
                <tr>
                  <td><strong>TAS</strong></td>
                  <td>50% discount on stamp duty</td>
                  <td>—</td>
                  <td>Applies to established and new homes ≤ $600,000</td>
                </tr>
                <tr>
                  <td><strong>NT</strong></td>
                  <td>Up to $18,601 off duty</td>
                  <td>Scaled reduction</td>
                  <td>First Home Owner Discount</td>
                </tr>
                <tr>
                  <td><strong>ACT</strong></td>
                  <td>Full exemption (income-tested)</td>
                  <td>—</td>
                  <td>Home Buyer Concession Scheme; income and property value limits apply</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="step-by-step">Step-by-Step Buying Process for First Home Buyers</h2>
          <p>
            See our <Link href="/guides/buying-property-australia" className="text-primary hover:underline">Complete Buying Guide</Link> for detailed coverage of each step. For first home buyers specifically, the key additional steps are:
          </p>
          <ol>
            <li><strong>Check your FHOG eligibility</strong> before making any offer. The grant is only available if you haven&apos;t previously owned property in Australia.</li>
            <li><strong>Apply for your chosen federal scheme</strong> through a participating lender before or during your pre-approval application — it&apos;s part of the one process.</li>
            <li><strong>Get pre-approval</strong> specifying you&apos;re accessing the First Home Guarantee (or relevant scheme) so the lender structures it correctly.</li>
            <li><strong>Confirm stamp duty concessions with your conveyancer</strong> — concessions are applied on settlement and reduce the amount you need to pay.</li>
            <li><strong>Apply for the FHOG through your conveyancer or directly with your state revenue office</strong> — timing varies by state (some pay at settlement, some after).</li>
            <li>Complete the standard buying process: offer, exchange, inspections, conveyancing, settlement.</li>
          </ol>

          <h2 id="common-mistakes">Common Mistakes First Home Buyers Make</h2>
          <ul>
            <li><strong>Exceeding the price cap for the FHOG or scheme:</strong> Even $1 over the cap disqualifies you from the entire grant. Stay under.</li>
            <li><strong>Not checking FHOG eligibility before buying an established property:</strong> In most states, the FHOG only applies to new builds. Buying an established home means no grant.</li>
            <li><strong>Underestimating total upfront costs:</strong> First home buyers often budget only for the deposit and forget stamp duty (even if discounted), legal fees, and inspections. Budget 3–5% on top of the purchase price for costs.</li>
            <li><strong>Letting pre-approval lapse:</strong> Pre-approvals typically last 90 days. If you&apos;re not ready to buy in that window, renew before it expires.</li>
            <li><strong>Buying in a hurry due to FOMO:</strong> The property market has cycles. Missing one property is rarely as catastrophic as buying the wrong one.</li>
            <li><strong>Not getting a building inspection:</strong> On a new property, you may have builder warranty cover, but a defect inspection before settlement is still prudent. On an established property, it&apos;s essential.</li>
            <li><strong>Not comparing lenders:</strong> The home loan you get approved for on your first attempt may not be the best rate available to you. A mortgage broker can compare dozens of lenders in one application process.</li>
          </ul>

          <h2 id="using-a-broker">Using a Broker With the First Home Guarantee</h2>
          <p>
            You don&apos;t have to use a mortgage broker to access the First Home Guarantee — you can go direct to a participating lender. However, a good broker can:
          </p>
          <ul>
            <li>Compare rates and features across all participating lenders simultaneously</li>
            <li>Know which lenders currently have available FHBG places (they do run out during the year)</li>
            <li>Help structure your application to maximise your approval chances</li>
            <li>Handle the FHBG paperwork as part of your loan application at no extra cost to you</li>
          </ul>
          <p>
            Broker remuneration is paid by the lender, not you. Ensure your broker is licenced (check ASIC&apos;s register) and ask them to explain how they are compensated to understand any potential bias.
          </p>

          <h2 id="state-guides">State-Specific First Home Buyer Guides</h2>
          <p>For state-specific detail on grants, concessions, and the buying process in your state:</p>
          <ul>
            <li><Link href="/guides/first-home-buyer-nsw" className="text-primary hover:underline">First Home Buyer Guide — New South Wales</Link></li>
            <li><Link href="/guides/first-home-buyer-vic" className="text-primary hover:underline">First Home Buyer Guide — Victoria</Link></li>
            <li><Link href="/guides/first-home-buyer-qld" className="text-primary hover:underline">First Home Buyer Guide — Queensland</Link></li>
            <li><Link href="/guides/first-home-buyer-wa" className="text-primary hover:underline">First Home Buyer Guide — Western Australia</Link></li>
          </ul>

        </div>
      </div>
    </div>
  );
}
