import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `First Home Buyer Guide Northern Territory: Grants & Schemes (2026) | ${SITE_NAME}`,
  description:
    "First home buyer guide for the NT. $10,000 FHOG, First Home Owner Discount (up to $23,928.60 stamp duty relief), leasehold land considerations, and federal scheme caps for Darwin. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/first-home-buyer-nt` },
  openGraph: {
    url: `${SITE_URL}/guides/first-home-buyer-nt`,
    title: "First Home Buyer Guide Northern Territory: Grants & Schemes (2026)",
    description:
      "First home buyer guide for the NT. $10,000 FHOG, First Home Owner Discount (up to $23,928.60 stamp duty relief), leasehold land considerations, and federal scheme caps for Darwin. Updated 2026.",
    type: "article",
  },
};

export default function FirstHomeBuyerNTPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "First Home Buyer Guide NT", url: "/guides/first-home-buyer-nt" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "First Home Buyer Guide NT" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 8 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          First Home Buyer Guide Northern Territory: Grants &amp; Schemes (2026)
        </h1>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> This guide provides general information only and is not
          financial or legal advice. NT property rules — particularly regarding leasehold land —
          can be complex. Always verify grant amounts and eligibility with the Territory Revenue
          Office (treasury.nt.gov.au/revenue) and consult a qualified NT conveyancer.
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#fhog" className="hover:underline">First Home Owner Grant (FHOG) NT</a></li>
            <li><a href="#stamp-duty-discount" className="hover:underline">First Home Owner Discount (stamp duty)</a></li>
            <li><a href="#federal-schemes" className="hover:underline">Federal government schemes</a></li>
            <li><a href="#leasehold" className="hover:underline">Leasehold land: a critical NT consideration</a></li>
            <li><a href="#darwin-market" className="hover:underline">Darwin property market overview</a></li>
            <li><a href="#eligibility" className="hover:underline">Eligibility requirements</a></li>
            <li><a href="#steps" className="hover:underline">Step-by-step: buying your first home in the NT</a></li>
            <li><a href="#resources" className="hover:underline">Resources and contacts</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="fhog" className="text-2xl font-bold text-gray-900 mt-8 mb-4">First Home Owner Grant (FHOG) — Northern Territory</h2>
          <p className="text-gray-600 mb-4">
            The Northern Territory offers a <strong>First Home Owner Grant of $10,000</strong> for
            eligible first home buyers purchasing or building a new or substantially renovated home.
            The grant is administered by the <strong>Territory Revenue Office</strong>.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-green-800 mb-1">NT FHOG at a glance</p>
            <ul className="text-sm text-green-700 space-y-1">
              <li><strong>Amount:</strong> $10,000</li>
              <li><strong>Property type:</strong> New homes or substantially renovated homes</li>
              <li><strong>Administered by:</strong> Territory Revenue Office</li>
              <li><strong>Website:</strong> treasury.nt.gov.au/revenue</li>
            </ul>
          </div>

          <p className="text-gray-600 mb-4">
            Unlike some other states, the NT FHOG also extends to <strong>substantially renovated
            homes</strong> — properties that have been comprehensively renovated to such an extent
            that they are effectively new. This can provide more options for buyers in the NT market
            where new stock may be limited.
          </p>
          <p className="text-gray-600 mb-4">
            The grant is paid at settlement for completed purchases, or at the first progress payment
            for construction loans. Applications can generally be lodged through your lender as an
            approved agent of the Territory Revenue Office.
          </p>

          <h2 id="stamp-duty-discount" className="text-2xl font-bold text-gray-900 mt-8 mb-4">First Home Owner Discount — Stamp Duty Relief</h2>
          <p className="text-gray-600 mb-4">
            In addition to the FHOG, the NT provides a <strong>First Home Owner Discount</strong>
            on stamp duty (conveyance duty) for eligible first home buyers. The discount is worth
            up to <strong>$23,928.60</strong> — which can completely eliminate stamp duty on
            lower-priced properties and significantly reduce it on higher-value purchases.
          </p>
          <p className="text-gray-600 mb-4">
            This is a notable advantage for NT first home buyers compared to some other states that
            offer little or no stamp duty relief. The combination of the $10,000 FHOG plus up to
            $23,928.60 in stamp duty savings means the total benefit package can reach nearly
            $34,000 for eligible buyers.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Benefit</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Maximum value</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Property type</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="p-3 border border-gray-200">First Home Owner Grant</td>
                  <td className="p-3 border border-gray-200">$10,000</td>
                  <td className="p-3 border border-gray-200">New/substantially renovated</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">First Home Owner Discount (stamp duty)</td>
                  <td className="p-3 border border-gray-200">$23,928.60</td>
                  <td className="p-3 border border-gray-200">New and established</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-semibold">Total maximum benefit</td>
                  <td className="p-3 border border-gray-200 font-semibold">~$33,928.60</td>
                  <td className="p-3 border border-gray-200">New homes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mb-4">
            Verify the exact eligibility criteria and current discount amounts with the Territory
            Revenue Office, as thresholds may be adjusted by the NT Government.
          </p>

          <h2 id="federal-schemes" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Federal Government Schemes</h2>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">First Home Guarantee</h3>
          <p className="text-gray-600 mb-4">
            The federal <strong>First Home Guarantee</strong> allows eligible first home buyers to
            purchase with a 5% deposit without paying Lenders Mortgage Insurance (LMI). The
            government guarantees the remaining portion up to 20% of the property value.
          </p>
          <p className="text-gray-600 mb-4">
            NT price cap: <strong>$600,000</strong> for Darwin (and regional NT).
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Regional First Home Buyer Guarantee</h3>
          <p className="text-gray-600 mb-4">
            For buyers purchasing in regional NT who have lived in that region for at least 12 months,
            the Regional First Home Buyer Guarantee offers the same 5% deposit / no LMI benefit.
            Much of the NT outside Darwin qualifies as regional under this scheme.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">First Home Super Saver Scheme (FHSSS)</h3>
          <p className="text-gray-600 mb-4">
            Available to all Australians, the FHSSS allows voluntary superannuation contributions
            of up to $15,000 per year (to a maximum of $50,000) to be withdrawn for a first home
            deposit. The tax savings can be substantial for higher-income earners.
          </p>

          <h2 id="leasehold" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Leasehold Land: A Critical NT Consideration</h2>
          <p className="text-gray-600 mb-4">
            One of the most important — and often misunderstood — aspects of buying property in the
            Northern Territory is <strong>land tenure</strong>. Unlike most other Australian states
            where residential buyers typically receive freehold title to land, a significant portion
            of NT land operates under <strong>leasehold tenure</strong>.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">What is leasehold land?</h3>
          <p className="text-gray-600 mb-4">
            With leasehold land, the government (or another entity such as a land council) retains
            ownership of the land itself. You as the buyer purchase the right to use and occupy the
            land for a specified term — often 99 years — rather than owning it outright.
          </p>
          <p className="text-gray-600 mb-4">
            This distinction has significant implications:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li><strong>Security of tenure:</strong> Long-term leases (99 years) provide reasonable security, but the government retains underlying ownership</li>
            <li><strong>Resale:</strong> You can sell your leasehold interest, but the buyer inherits the remaining lease term</li>
            <li><strong>Finance:</strong> Some lenders are cautious about lending on leasehold properties — not all standard home loans apply. Check with your lender early</li>
            <li><strong>Remote communities:</strong> Many Aboriginal communities operate under different land tenure arrangements under the <em>Aboriginal Land Rights (Northern Territory) Act 1976</em>. Special rules apply and buying in these areas involves different processes</li>
          </ul>
          <p className="text-gray-600 mb-4">
            In Darwin&apos;s established suburbs, most residential land is held on Crown Lease —
            a long-term leasehold arrangement that functions similarly to freehold for most
            practical purposes, and most lenders accept it. However, always confirm the specific
            tenure of any property you are considering with your conveyancer.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> Before purchasing any property in the NT — particularly in
              remote areas or on community land — engage an NT-qualified conveyancer or solicitor
              who specialises in NT land tenure. The rules differ significantly from mainland states.
            </p>
          </div>

          <h2 id="darwin-market" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Darwin Property Market Overview</h2>
          <p className="text-gray-600 mb-4">
            Darwin has historically been more volatile than other Australian capital cities, with
            significant boom-and-bust cycles linked to resource sector activity, government
            infrastructure spending, and population flows.
          </p>
          <p className="text-gray-600 mb-4">
            Key market characteristics:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Median house prices in Darwin are generally lower than southern capitals, making it more accessible for first home buyers</li>
            <li>Strong rental demand due to significant government and defence sector employment</li>
            <li>High proportion of attached dwellings (units, townhouses) in the market — popular with first home buyers and investors</li>
            <li>Tropical climate influences property design and maintenance costs (cyclone ratings, insulation)</li>
            <li>Alice Springs and other regional centres offer even lower entry points</li>
          </ul>

          <h2 id="eligibility" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Eligibility Requirements</h2>
          <p className="text-gray-600 mb-4">
            To be eligible for the NT FHOG and First Home Owner Discount:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Be an Australian citizen or permanent resident</li>
            <li>Be 18 years of age or older</li>
            <li>Have never previously owned residential property in Australia used as a place of residence</li>
            <li>Occupy the home as your principal place of residence for at least 6 continuous months, commencing within 12 months of settlement or completion</li>
            <li>For the FHOG: the property must be new or substantially renovated</li>
          </ul>

          <h2 id="steps" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step-by-Step: Buying Your First Home in the NT</h2>

          <div className="space-y-4 mb-6">
            {[
              {
                step: "1",
                title: "Understand the NT market and land tenure",
                desc: "Research the Darwin market and understand the land tenure of any property you are considering. Engage an NT conveyancer early — leasehold rules differ from mainland states.",
              },
              {
                step: "2",
                title: "Calculate your total costs",
                desc: "Factor in stamp duty (offset by up to $23,928.60 via the First Home Owner Discount), legal fees, building inspections (especially cyclone-rating compliance), and moving costs.",
              },
              {
                step: "3",
                title: "Check grant and scheme eligibility",
                desc: "Confirm eligibility for the $10,000 FHOG (new homes), the First Home Owner Discount, and federal schemes including the First Home Guarantee (5% deposit, no LMI, capped at $600,000).",
              },
              {
                step: "4",
                title: "Get pre-approval",
                desc: "Obtain conditional pre-approval from a lender who actively lends on NT Crown Lease properties. Not all lenders operate in the NT — a broker experienced in the Darwin market is helpful.",
              },
              {
                step: "5",
                title: "Search and inspect",
                desc: "Arrange a building and pest inspection. In Darwin, also check cyclone ratings, air conditioning systems, and any flood or inundation risk.",
              },
              {
                step: "6",
                title: "Engage an NT conveyancer",
                desc: "Your conveyancer reviews the contract, confirms land tenure, conducts title searches, and manages settlement.",
              },
              {
                step: "7",
                title: "Apply for the FHOG and Discount",
                desc: "Lodge applications through your lender or directly with the Territory Revenue Office before settlement.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">{item.step}</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 id="resources" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resources and Contacts</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Territory Revenue Office</strong> — FHOG and stamp duty:{" "}
              <a href="https://www.treasury.nt.gov.au/revenue" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">treasury.nt.gov.au/revenue</a>
            </li>
            <li>
              <strong>NT Consumer Affairs</strong> — Tenancy and property:{" "}
              <a href="https://www.consumeraffairs.nt.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">consumeraffairs.nt.gov.au</a>
            </li>
            <li>
              <strong>Housing Australia</strong> — First Home Guarantee and federal schemes:{" "}
              <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">housingaustralia.gov.au</a>
            </li>
            <li>
              <strong>NT Land Administration</strong> — Land tenure information:{" "}
              <a href="https://www.lands.nt.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">lands.nt.gov.au</a>
            </li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Searching in Darwin?</strong> Browse{" "}
              <Link href="/buy" className="underline hover:text-blue-900">NT properties for sale</Link>{" "}
              or use our{" "}
              <Link href="/borrowing-power-calculator" className="underline hover:text-blue-900">borrowing power calculator</Link>{" "}
              to plan your budget.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/first-home-buyer-guide" className="text-primary hover:underline">First Home Buyer Guide Australia (national overview)</Link></li>
              <li><Link href="/guides/first-home-buyer-sa" className="text-primary hover:underline">First Home Buyer Guide South Australia</Link></li>
              <li><Link href="/guides/first-home-buyer-tas" className="text-primary hover:underline">First Home Buyer Guide Tasmania</Link></li>
              <li><Link href="/guides/first-home-buyer-act" className="text-primary hover:underline">First Home Buyer Guide ACT</Link></li>
              <li><Link href="/guides/lenders-mortgage-insurance-guide" className="text-primary hover:underline">Lenders Mortgage Insurance (LMI) Guide</Link></li>
              <li><Link href="/guides/renters-rights-nt" className="text-primary hover:underline">Renter&apos;s Rights in the Northern Territory</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
