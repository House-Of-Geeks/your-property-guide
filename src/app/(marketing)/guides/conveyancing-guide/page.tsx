import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Conveyancing in Australia: What It Is, What It Costs & How to Choose (2026) | ${SITE_NAME}`,
  description:
    "What does a conveyancer do? How much does conveyancing cost? When should you use a solicitor? Complete guide for Australian property buyers and sellers. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/conveyancing-guide` },
  openGraph: {
    url: `${SITE_URL}/guides/conveyancing-guide`,
    title: "Conveyancing in Australia: What It Is, What It Costs & How to Choose (2026)",
    description:
      "What does a conveyancer do? How much does conveyancing cost? When should you use a solicitor? Complete guide for Australian property buyers and sellers. Updated 2026.",
    type: "article",
  },
};

export default function ConveyancingGuidePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Conveyancing Guide", url: "/guides/conveyancing-guide" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Conveyancing Guide" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 8 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Conveyancing in Australia: What It Is, What It Costs &amp; How to Choose (2026)
        </h1>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Note:</strong> This guide is general information only. Conveyancing laws and
          processes vary by state. Always engage a licensed conveyancer or solicitor for your
          specific transaction.
        </div>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#what-is" className="hover:underline">What is conveyancing?</a></li>
            <li><a href="#conveyancer-vs-solicitor" className="hover:underline">Conveyancer vs solicitor</a></li>
            <li><a href="#process" className="hover:underline">The conveyancing process step by step</a></li>
            <li><a href="#costs" className="hover:underline">Typical costs by state</a></li>
            <li><a href="#diy" className="hover:underline">DIY conveyancing (not recommended)</a></li>
            <li><a href="#red-flags" className="hover:underline">Red flags in contracts</a></li>
            <li><a href="#when-solicitor" className="hover:underline">When to use a solicitor instead</a></li>
            <li><a href="#choosing" className="hover:underline">How to choose a conveyancer</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="what-is" className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is Conveyancing?</h2>
          <p className="text-gray-600 mb-4">
            Conveyancing is the legal process of transferring ownership of real property from one
            person to another. It encompasses everything from reviewing the contract of sale and
            conducting property searches, through to organising settlement and registering the
            new title.
          </p>
          <p className="text-gray-600 mb-4">
            In Australia, both buyers and sellers engage their own conveyancers (or solicitors) to
            handle their respective sides of a transaction. The buyer&apos;s conveyancer protects the
            buyer&apos;s interests; the vendor&apos;s conveyancer prepares the contract and disclosure documents.
          </p>
          <p className="text-gray-600 mb-4">
            Conveyancing is now largely conducted electronically in Australia via the
            <strong> PEXA</strong> (Property Exchange Australia) platform, which allows funds to be
            transferred and title documents lodged digitally at settlement.
          </p>

          <h2 id="conveyancer-vs-solicitor" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Conveyancer vs Solicitor: What&apos;s the Difference?</h2>
          <p className="text-gray-600 mb-4">
            Both licensed conveyancers and solicitors (lawyers) can handle property conveyancing in
            Australia. The key differences:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200"></th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Licensed Conveyancer</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Solicitor</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">Qualification</td>
                  <td className="p-3 border border-gray-200">Specialised conveyancing licence</td>
                  <td className="p-3 border border-gray-200">Law degree + admission to practice</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">Scope</td>
                  <td className="p-3 border border-gray-200">Property transactions only</td>
                  <td className="p-3 border border-gray-200">Full legal advice on any matter</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">Cost</td>
                  <td className="p-3 border border-gray-200">Generally lower ($800 – $1,800)</td>
                  <td className="p-3 border border-gray-200">Generally higher ($1,500 – $3,000+)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">Best for</td>
                  <td className="p-3 border border-gray-200">Standard residential purchases</td>
                  <td className="p-3 border border-gray-200">Complex transactions, legal disputes, trust structures</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mb-4">
            For the vast majority of straightforward residential purchases, a licensed conveyancer
            is sufficient and more cost-effective. For complex transactions (e.g. buying via a
            trust or company, off-the-plan disputes, unusual contract conditions), a solicitor is
            recommended.
          </p>

          <h2 id="process" className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Conveyancing Process Step by Step</h2>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">For buyers</h3>
          <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-3">
            <li>
              <strong>Engage your conveyancer early.</strong> Ideally before you make an offer,
              so they can review the contract before you sign.
            </li>
            <li>
              <strong>Contract review.</strong> Your conveyancer reviews the contract of sale
              and vendor&apos;s statement (Section 32 in VIC), identifying any unusual conditions,
              risks, or items requiring negotiation.
            </li>
            <li>
              <strong>Pre-exchange advice.</strong> Your conveyancer explains your rights and
              obligations, including the cooling-off period (if applicable), deposit amount, and
              any conditions in the contract.
            </li>
            <li>
              <strong>Exchange of contracts.</strong> Both parties sign identical contracts and
              the deposit is paid. The deal is now binding (with any conditions outstanding).
            </li>
            <li>
              <strong>Property searches.</strong> Your conveyancer conducts searches on the
              property including: title search, council rates and zoning searches, land tax check,
              water rates, and any planned road or infrastructure works that may affect the property.
            </li>
            <li>
              <strong>Liaising with your lender.</strong> Your conveyancer coordinates with
              your bank or mortgage broker to ensure loan documents are ready for settlement.
            </li>
            <li>
              <strong>Pre-settlement inspection.</strong> This is done by you (not your
              conveyancer) — usually 24–48 hours before settlement to confirm the property is
              in the agreed condition.
            </li>
            <li>
              <strong>Settlement.</strong> Your conveyancer coordinates the electronic settlement
              via PEXA. Funds are transferred, the title is registered in your name, and you
              get the keys.
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">For sellers</h3>
          <p className="text-gray-600 mb-4">
            The seller&apos;s conveyancer prepares the contract of sale and Section 32 (VIC) / vendor
            disclosure documents, reviews the buyer&apos;s requests for special conditions, and handles
            settlement to ensure funds arrive correctly. They also discharge the existing mortgage.
          </p>

          <h2 id="costs" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Typical Conveyancing Costs by State</h2>
          <p className="text-gray-600 mb-4">
            Conveyancing fees vary by state and provider. Professional fees (excluding disbursements)
            typically range from:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">State</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Buyer Conveyancer Fee</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Seller Conveyancer Fee</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="p-3 border border-gray-200">NSW</td>
                  <td className="p-3 border border-gray-200">$800 – $1,800</td>
                  <td className="p-3 border border-gray-200">$700 – $1,500</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">VIC</td>
                  <td className="p-3 border border-gray-200">$900 – $2,000</td>
                  <td className="p-3 border border-gray-200">$800 – $1,800</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">QLD</td>
                  <td className="p-3 border border-gray-200">$800 – $1,600</td>
                  <td className="p-3 border border-gray-200">$700 – $1,400</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">WA</td>
                  <td className="p-3 border border-gray-200">$900 – $2,000</td>
                  <td className="p-3 border border-gray-200">$800 – $1,600</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">SA</td>
                  <td className="p-3 border border-gray-200">$700 – $1,500</td>
                  <td className="p-3 border border-gray-200">$600 – $1,200</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mb-4">
            In addition to professional fees, expect <strong>disbursements</strong> (out-of-pocket
            costs) of $300–$900, including:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Title search fees: $20–$50</li>
            <li>Council searches: $50–$150</li>
            <li>PEXA electronic settlement fee: $100–$200</li>
            <li>Land tax certificates: $20–$100</li>
            <li>Registration of transfer: varies by state ($200–$500+)</li>
          </ul>
          <p className="text-gray-600 mb-4">
            For high-value properties or complex transactions, solicitors may charge hourly rates
            ($300–$500/hour), which can push total costs above $3,000.
          </p>

          <h2 id="diy" className="text-2xl font-bold text-gray-900 mt-8 mb-4">DIY Conveyancing (Not Recommended)</h2>
          <p className="text-gray-600 mb-4">
            In theory, it is possible to conduct your own conveyancing in most Australian states.
            In practice, this is strongly <strong>not recommended</strong> for most buyers and sellers.
          </p>
          <p className="text-gray-600 mb-4">
            Reasons to avoid DIY conveyancing:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Complexity:</strong> Property law and the conveyancing process contain many
              technical requirements. Missing a step or deadline can have serious consequences —
              including forfeiting your deposit or being liable for damages.
            </li>
            <li>
              <strong>No professional indemnity:</strong> If a licensed conveyancer makes an error,
              their professional indemnity insurance covers you. If you make an error, you bear the
              cost entirely.
            </li>
            <li>
              <strong>PEXA access:</strong> Electronic settlement requires access to the PEXA
              platform, which is restricted to licensed practitioners.
            </li>
            <li>
              <strong>Cost saving is minimal:</strong> Conveyancing fees are modest relative to the
              property value. The risk-reward calculus strongly favours engaging a professional.
            </li>
          </ul>

          <h2 id="red-flags" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Red Flags in Contracts</h2>
          <p className="text-gray-600 mb-4">
            A good conveyancer will flag these issues — but it helps to know what to watch for:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Unusually long settlement periods</strong> (e.g. 90+ days without explanation):
              May indicate the vendor has a complicating issue to resolve.
            </li>
            <li>
              <strong>Missing inclusions:</strong> Fixtures listed verbally by the agent but not
              included in the contract (e.g. dishwasher, ducted air conditioning, garden shed).
            </li>
            <li>
              <strong>Title encumbrances:</strong> Mortgages not yet discharged, unregistered
              easements, or heritage overlays that will restrict future development.
            </li>
            <li>
              <strong>GST clauses:</strong> If buying new property from a developer, confirm whether
              the price is inclusive or exclusive of GST.
            </li>
            <li>
              <strong>Unusual &quot;as-is&quot; clauses:</strong> Some contracts try to limit the vendor&apos;s
              disclosure obligations. Your conveyancer should flag these.
            </li>
            <li>
              <strong>Sunset clauses (off-the-plan):</strong> A clause allowing the developer to
              cancel the contract if completion doesn&apos;t occur by a certain date. Controversial and
              sometimes misused.
            </li>
          </ul>

          <h2 id="when-solicitor" className="text-2xl font-bold text-gray-900 mt-8 mb-4">When to Use a Solicitor Instead</h2>
          <p className="text-gray-600 mb-4">
            While a licensed conveyancer handles most standard purchases perfectly well, there are
            situations where the broader legal expertise of a solicitor is advisable:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Buying or selling via a trust, company, or self-managed super fund (SMSF)</li>
            <li>Complex joint ownership structures</li>
            <li>Off-the-plan purchases with non-standard contract terms</li>
            <li>Development sites or properties with planning disputes</li>
            <li>Contract disputes or vendor non-disclosure claims</li>
            <li>Commercial property transactions</li>
            <li>Deceased estates where title issues are unresolved</li>
          </ul>

          <h2 id="choosing" className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Choose a Conveyancer</h2>
          <p className="text-gray-600 mb-4">
            Questions to ask before engaging a conveyancer:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Are you licensed in this state?</li>
            <li>Do you have experience with this type of property (e.g. off-the-plan, strata)?</li>
            <li>What is your total fee, and what disbursements are included?</li>
            <li>Will you be handling my file personally, or will it be delegated?</li>
            <li>What are your communication standards — will you respond to emails within 24 hours?</li>
            <li>Do you use PEXA for electronic settlement?</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Avoid choosing a conveyancer solely on price. The cheapest option may cut corners on
            searches or contract review. A few hundred dollars of saving is not worth the risk on
            a $700,000 transaction.
          </p>
          <p className="text-gray-600 mb-4">
            Ask your real estate agent, mortgage broker, or friends who have recently purchased in
            the area for recommendations.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Buying or selling property?</strong>{" "}
              <Link href="/buy" className="underline hover:text-blue-900">Browse listings</Link>{" "}
              or use our{" "}
              <Link href="/stamp-duty-calculator" className="underline hover:text-blue-900">stamp duty calculator</Link>{" "}
              to understand all the costs before you sign.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/buying-property-australia" className="text-primary hover:underline">How to Buy Property in Australia</Link></li>
              <li><Link href="/guides/property-auction-guide" className="text-primary hover:underline">Property Auction Guide</Link></li>
              <li><Link href="/guides/building-pest-inspection" className="text-primary hover:underline">Building &amp; Pest Inspection Guide</Link></li>
              <li><Link href="/guides/real-estate-agent-fees-australia" className="text-primary hover:underline">Real Estate Agent Fees</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
