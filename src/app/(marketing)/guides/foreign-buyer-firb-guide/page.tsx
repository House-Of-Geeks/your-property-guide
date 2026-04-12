import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Buying Property in Australia as a Foreign Buyer: Complete FIRB Guide (2026) | ${SITE_NAME}`,
  description:
    "Comprehensive guide to FIRB rules for foreign buyers in Australia. Covers who can buy, what types of property, application fees, state surcharges, and tax obligations.",
  alternates: { canonical: `${SITE_URL}/guides/foreign-buyer-firb-guide` },
  openGraph: {
    url: `${SITE_URL}/guides/foreign-buyer-firb-guide`,
    title: "Buying Property in Australia as a Foreign Buyer: Complete FIRB Guide (2026)",
    description:
      "Comprehensive guide to FIRB rules for foreign buyers in Australia. Covers who can buy, what types of property, application fees, state surcharges, and tax obligations.",
    type: "article",
  },
};

export default function ForeignBuyerFirbGuidePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Foreign Buyer FIRB Guide", url: "/guides/foreign-buyer-firb-guide" },
        ]}
      />
      <GuideArticleJsonLd
        title="Buying Property in Australia as a Foreign Buyer: Complete FIRB Guide (2026)"
        description="Comprehensive guide to FIRB rules for foreign buyers in Australia. Covers who can buy, what types of property, application fees, state surcharges, and tax obligations."
        url="/guides/foreign-buyer-firb-guide"
        datePublished="2026-04-01"
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Foreign Buyer FIRB Guide" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <span>Last updated: April 2026</span>
          <span>·</span>
          <span>12 min read</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Buying Property in Australia as a Foreign Buyer: Complete FIRB Guide (2026)
        </h1>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#who-is-foreign" className="hover:underline">Who is a &ldquo;foreign person&rdquo; under FIRB rules?</a></li>
            <li><a href="#what-can-buy" className="hover:underline">What properties can foreign buyers purchase?</a></li>
            <li><a href="#firb-application" className="hover:underline">The FIRB application process</a></li>
            <li><a href="#firb-fees" className="hover:underline">FIRB application fees (2025–2026)</a></li>
            <li><a href="#state-surcharges" className="hover:underline">State-by-state foreign buyer stamp duty surcharges</a></li>
            <li><a href="#land-tax-surcharges" className="hover:underline">Land tax surcharges for foreign owners</a></li>
            <li><a href="#tax-implications" className="hover:underline">Tax implications for foreign property investors</a></li>
            <li><a href="#structures" className="hover:underline">Using a company or trust structure</a></li>
            <li><a href="#practical-tips" className="hover:underline">Practical tips</a></li>
            <li><a href="#useful-resources" className="hover:underline">Useful resources</a></li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> This guide is for general information only and does not constitute legal, financial, or tax advice. FIRB rules, fees, and state surcharges change regularly. Always seek independent legal advice from a solicitor experienced in foreign investment before signing any contract.
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="who-is-foreign">Who Is a &ldquo;Foreign Person&rdquo; Under FIRB Rules?</h2>
          <p>
            Australia&apos;s Foreign Investment Review Board (FIRB) administers the <em>Foreign Acquisitions and Takeovers Act 1975</em> (FATA). Under this legislation, a &ldquo;foreign person&rdquo; includes:
          </p>
          <ul>
            <li><strong>Foreign nationals who are not Australian permanent residents or citizens</strong> — including people on temporary visas (student, working holiday, skilled temporary, partner visas, etc.)</li>
            <li><strong>Foreign corporations</strong> — companies incorporated outside Australia, or Australian companies where a foreign person holds 20% or more, or foreign persons collectively hold 40% or more</li>
            <li><strong>Foreign trusts</strong> — trusts where foreign persons hold a 40% or more interest</li>
            <li><strong>The foreign government sector</strong> — sovereign wealth funds and state-owned enterprises</li>
          </ul>
          <p>
            <strong>Who is NOT a foreign person:</strong> Australian citizens, Australian permanent residents (PR), and New Zealand citizens who hold a Special Category Visa (subclass 444) are not foreign persons for FIRB purposes. These individuals can purchase any residential property without FIRB approval.
          </p>
          <p>
            Note that New Zealand citizens on a 444 visa are treated as residents for FIRB purposes but may still be subject to foreign purchaser duty surcharges in some states (state rules differ from the FIRB national framework).
          </p>

          <h2 id="what-can-buy">What Properties Can Foreign Buyers Purchase?</h2>
          <p>
            The type of property a foreign person can buy depends on their visa status:
          </p>

          <h3>Temporary residents (including temporary visa holders)</h3>
          <p>
            Temporary residents <strong>may</strong> purchase:
          </p>
          <ul>
            <li>One established (existing) dwelling, provided it will be used as their principal place of residence while they live in Australia. They <strong>must sell the property</strong> when they leave Australia permanently — FIRB will impose a condition requiring this.</li>
            <li>New dwellings (subject to FIRB approval)</li>
            <li>Vacant land for development (subject to FIRB approval and construction conditions)</li>
          </ul>
          <p>
            Temporary residents <strong>cannot</strong> buy established dwellings as investment properties or holiday homes. The &ldquo;must live in it&rdquo; and &ldquo;must sell when leaving&rdquo; conditions are firm.
          </p>

          <h3>Non-residents (living offshore)</h3>
          <p>
            Foreign non-residents face the most restrictions:
          </p>
          <ul>
            <li>They <strong>cannot buy established (existing) dwellings</strong> at all, with very limited exceptions.</li>
            <li>They <strong>can buy new dwellings</strong> — properties that have not been previously sold or occupied (off-the-plan apartments, newly built houses).</li>
            <li>They <strong>can buy vacant land</strong> for residential development, subject to conditions requiring construction to begin within 4 years.</li>
          </ul>
          <p>
            The policy rationale is to encourage construction of new housing stock rather than foreign buyers competing with Australians for established homes.
          </p>

          <h3>Significant exception: temporary ban on purchases of established dwellings (2025)</h3>
          <p>
            In April 2025, the Australian Government announced a temporary ban preventing foreign investors (including temporary residents) from purchasing established dwellings for a two-year period. Check firb.gov.au for the current status of this measure, as it may affect your purchasing options.
          </p>

          <h3>Foreign developers</h3>
          <p>
            Foreign entities purchasing new dwellings for resale must obtain developer approval. Different thresholds and conditions apply. If you are acquiring property through a foreign development company, seek specialist advice.
          </p>

          <h2 id="firb-application">The FIRB Application Process</h2>
          <p>
            FIRB approval must generally be obtained <strong>before</strong> signing a contract. In practice, many buyers make the contract conditional on FIRB approval — meaning you can sign, but the contract is only binding once FIRB approves. This is a common and accepted approach, but confirm the wording with your solicitor.
          </p>
          <ol>
            <li>
              <strong>Determine if approval is required:</strong> Use FIRB&apos;s online tool at firb.gov.au to confirm whether your purchase requires approval. Not all foreign purchases are caught by the rules.
            </li>
            <li>
              <strong>Lodge the application:</strong> Apply at <a href="https://firb.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">firb.gov.au</a>. You will need details of the proposed purchase, your visa status, and supporting documents. Applications are submitted and fees paid online.
            </li>
            <li>
              <strong>Pay the application fee:</strong> The fee is based on the purchase price (see table below) and is non-refundable even if approval is denied.
            </li>
            <li>
              <strong>Wait for a decision:</strong> FIRB has 30 days to decide from the date the complete application is received. This period can be extended by the Treasurer to 90 days. In practice, straightforward residential applications are often processed faster, but do not assume.
            </li>
            <li>
              <strong>Conditions on approval:</strong> Approval is typically granted with conditions — for example, temporary residents will have a condition requiring them to sell when they permanently leave Australia.
            </li>
          </ol>
          <p>
            <strong>Penalties for not complying:</strong> Purchasing without FIRB approval (when required) can result in forced divestiture orders, financial penalties up to $168,500 (2025–26), and criminal prosecution in serious cases.
          </p>

          <h2 id="firb-fees">FIRB Application Fees (2025–2026)</h2>
          <p>
            FIRB fees are tiered by property value. Fees are indexed annually. The 2025–26 fees for residential land are:
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Property Value</th>
                  <th>Application Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Up to $75,000</td><td>$4,200</td></tr>
                <tr><td>$75,001 – $1,000,000</td><td>$14,100</td></tr>
                <tr><td>$1,000,001 – $2,000,000</td><td>$28,200</td></tr>
                <tr><td>$2,000,001 – $3,000,000</td><td>$56,400</td></tr>
                <tr><td>$3,000,001 – $4,000,000</td><td>$84,600</td></tr>
                <tr><td>Each additional $1M above $3M</td><td>+$28,200</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            These fees are substantial and non-refundable. They are not a tax — they are an administrative fee for processing the application. Always include FIRB fees in your total acquisition cost budget.
          </p>

          <h2 id="state-surcharges">State-by-State Foreign Buyer Stamp Duty Surcharges</h2>
          <p>
            In addition to standard stamp duty, all Australian states (except ACT and NT) impose a <strong>foreign purchaser surcharge</strong> on top of the normal stamp duty. This is a significant additional cost that many foreign buyers underestimate.
          </p>
          <p>
            Use our <Link href="/stamp-duty-calculator" className="text-primary hover:underline">Stamp Duty Calculator</Link> to estimate your total duty including the foreign surcharge.
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>State/Territory</th>
                  <th>Surcharge Rate</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>NSW</td><td>8%</td><td>Foreign Investor Surcharge Purchaser Duty</td></tr>
                <tr><td>VIC</td><td>8%</td><td>Foreign Purchaser Additional Duty (FPAD)</td></tr>
                <tr><td>QLD</td><td>7%</td><td>Additional Foreign Acquirer Duty (AFAD)</td></tr>
                <tr><td>SA</td><td>7%</td><td>Foreign Ownership Surcharge</td></tr>
                <tr><td>WA</td><td>7%</td><td>Foreign Buyers Duty</td></tr>
                <tr><td>TAS</td><td>8%</td><td>Foreign Investor Duty Surcharge</td></tr>
                <tr><td>ACT</td><td>None</td><td>—</td></tr>
                <tr><td>NT</td><td>None</td><td>—</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>Example (NSW, $1,000,000 property):</strong> Standard stamp duty approximately $40,590 + foreign surcharge 8% = $80,000 + FIRB fee $14,100 = approximately $134,690 in government charges before any other costs. This illustrates how quickly the total upfront cost escalates for foreign buyers.
          </p>
          <p>
            Note: The surcharge applies to the same value as the standard duty calculation. State revenue offices update rates and thresholds regularly — always verify current rates before transacting.
          </p>

          <h2 id="land-tax-surcharges">Land Tax Surcharges for Foreign Owners</h2>
          <p>
            Most Australian states also impose an additional annual land tax surcharge on property owned by foreign persons. This is a recurring charge on top of standard land tax.
          </p>
          <p>
            Rates and thresholds vary by state and are adjusted regularly:
          </p>
          <ul>
            <li><strong>NSW:</strong> 4% annual surcharge on the land value of residential properties owned by foreign persons</li>
            <li><strong>VIC:</strong> 2% absentee owner surcharge (rising to 4% for those with interests in multiple properties)</li>
            <li><strong>QLD:</strong> 2% surcharge land tax on all Queensland land owned by foreign persons</li>
            <li><strong>SA:</strong> 0.5% surcharge on the taxable value</li>
            <li><strong>WA:</strong> No specific foreign owner land tax surcharge (but standard land tax applies)</li>
          </ul>
          <p>
            Always check the current rates with the relevant state revenue office, as these surcharges have been increasing in recent years. For high-value properties, the annual land tax surcharge can amount to tens of thousands of dollars per year.
          </p>

          <h2 id="tax-implications">Tax Implications for Foreign Property Investors</h2>
          <h3>Rental income — withholding tax</h3>
          <p>
            Non-resident foreign investors who earn rental income from Australian property are subject to Australian tax:
          </p>
          <ul>
            <li>Non-residents pay tax at 32.5% on the first $135,000 of Australian-sourced income (2025–26 rates), with no tax-free threshold available to non-residents.</li>
            <li>Rental expenses (interest, management fees, rates, insurance, depreciation) are still deductible, reducing the taxable rental income.</li>
            <li>You must lodge an Australian tax return each year you earn Australian income.</li>
            <li>Withholding agents (property managers) may be required to withhold tax from rent in some circumstances.</li>
          </ul>
          <h3>Capital Gains Tax (CGT)</h3>
          <p>
            When a foreign person sells Australian residential property:
          </p>
          <ul>
            <li>Australian CGT applies to the capital gain.</li>
            <li>Foreign residents are <strong>not entitled to the main residence exemption</strong> for the period they are a foreign resident (since 2020 reforms). This is a significant tax — you cannot exempt the gain on your &ldquo;home&rdquo; if you were a foreign resident during the ownership period.</li>
            <li>The 50% CGT discount is generally available to foreign residents only for the period they were an Australian tax resident. For non-residents, no discount applies to gains accrued while a non-resident.</li>
            <li><strong>Foreign Resident Capital Gains Withholding (FRCGW):</strong> For property sold above $750,000, the buyer must withhold 15% of the purchase price and remit it to the ATO unless the seller provides a clearance certificate. Even Australian sellers must obtain a clearance certificate on sales above this threshold to avoid withholding.</li>
          </ul>
          <h3>FIRB notification on sale</h3>
          <p>
            If you bought under a FIRB approval with conditions, you may be required to notify FIRB when you sell. Check your approval conditions carefully.
          </p>

          <h2 id="structures">Using a Company or Trust to Buy</h2>
          <p>
            Some foreign buyers consider purchasing through an Australian company or discretionary trust for asset protection or tax planning reasons. Key points:
          </p>
          <ul>
            <li>An Australian company or trust becomes a &ldquo;foreign person&rdquo; for FIRB purposes if it is controlled by foreign persons — typically if a foreign person holds 20%+ (company) or 40%+ (trust).</li>
            <li>Buying through a structure does not exempt you from FIRB approval requirements or foreign purchaser surcharges — the surcharges apply to the entity making the purchase if it is a foreign person.</li>
            <li>A structure may have advantages for estate planning, liability limitation, or income splitting, but these benefits must be weighed against the additional compliance costs (company fees, annual returns, separate tax returns).</li>
            <li>Self Managed Superannuation Funds (SMSFs) have separate rules — non-residents generally cannot be trustees or members of an SMSF investing in Australian property.</li>
          </ul>
          <p>
            Do not establish a corporate or trust structure without specific legal and tax advice. Australian tax law, FIRB rules, and state land tax rules all apply differently to different structures.
          </p>

          <h2 id="practical-tips">Practical Tips for Foreign Buyers</h2>
          <ul>
            <li><strong>Budget the full cost upfront:</strong> Add FIRB fees + foreign purchaser surcharge + standard stamp duty + conveyancing to your deposit. On a $1M property in NSW, this can easily total $130,000+.</li>
            <li><strong>Engage a solicitor experienced in foreign investment</strong> before making any offers. A general-practice solicitor may not be familiar with FIRB conditions and their implications.</li>
            <li><strong>Make contracts conditional on FIRB approval</strong> if you haven&apos;t obtained it before signing. Get the wording approved by your solicitor — a poorly drafted condition may not adequately protect you.</li>
            <li><strong>Allow at least 60–90 days from application to settlement</strong> when planning your purchase timeline — 30 days for FIRB processing plus settlement period.</li>
            <li><strong>Maintain Australian tax compliance:</strong> Lodge an Australian tax return each year you have Australian income. Non-compliance attracts significant penalties.</li>
            <li><strong>Check your visa conditions:</strong> Some visa subclasses have additional restrictions on property ownership. Your migration agent can advise.</li>
            <li><strong>New dwellings only (for non-residents):</strong> Focus your search on off-the-plan apartments and new builds. Developers of large projects often have experience dealing with foreign buyers and can streamline the process.</li>
          </ul>

          <h2 id="useful-resources">Useful Resources</h2>
          <ul>
            <li><a href="https://firb.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">FIRB — firb.gov.au</a>: Apply for foreign investment approval, check current rules and fees, and use the online eligibility tool.</li>
            <li><a href="https://www.ato.gov.au/individuals-and-families/investments-and-assets/property-investments/foreign-residents-and-capital-gains-tax" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ATO: Foreign Residents and Capital Gains Tax</a>: Detailed guidance on CGT obligations for non-residents.</li>
            <li><a href="https://www.ato.gov.au/individuals-and-families/investments-and-assets/property-investments/renting-out-your-property/foreign-residents-renting-out-property" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ATO: Renting out property — foreign residents</a>: Tax obligations for non-resident landlords.</li>
            <li><Link href="/stamp-duty-calculator" className="text-primary hover:underline">Stamp Duty Calculator</Link>: Estimate your stamp duty including foreign buyer surcharges by state.</li>
            <li><Link href="/guides/buying-property-australia" className="text-primary hover:underline">How to Buy Property in Australia</Link>: The general buying process guide.</li>
          </ul>

        </div>
      </div>
    </div>
  );
}
