import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `First Home Buyer Guide Tasmania: Grants, Stamp Duty & Schemes (2026) | ${SITE_NAME}`,
  description:
    "First home buyer guide for Tasmania. FHOG $30,000, 50% stamp duty concession on established homes, First Home Guarantee price caps, and why Tasmania remains one of Australia's most affordable states. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/first-home-buyer-tas` },
  openGraph: {
    url: `${SITE_URL}/guides/first-home-buyer-tas`,
    title: "First Home Buyer Guide Tasmania: Grants, Stamp Duty & Schemes (2026)",
    description:
      "First home buyer guide for Tasmania. FHOG $30,000, 50% stamp duty concession on established homes, First Home Guarantee price caps, and why Tasmania remains one of Australia's most affordable states. Updated 2026.",
    type: "article",
  },
};

export default function FirstHomeBuyerTasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "First Home Buyer Guide Tasmania", url: "/guides/first-home-buyer-tas" },
        ]}
      />
      <GuideArticleJsonLd
        title="First Home Buyer Guide Tasmania: Grants, Stamp Duty & Schemes (2026)"
        description="First home buyer guide for Tasmania. FHOG $30,000, 50% stamp duty concession on established homes, First Home Guarantee price caps, and why Tasmania remains one of Australia's most affordable states. Updated 2026."
        url="/guides/first-home-buyer-tas"
        datePublished="2026-04-01"
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "First Home Buyer Guide Tasmania" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 8 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          First Home Buyer Guide Tasmania: Grants, Stamp Duty &amp; Schemes (2026)
        </h1>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> This guide provides general information only and is not
          financial or legal advice. Always verify current grant amounts, eligibility, and thresholds
          with the State Revenue Office Tasmania (sro.tas.gov.au) before making decisions.
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#fhog" className="hover:underline">First Home Owner Grant (FHOG) Tasmania</a></li>
            <li><a href="#stamp-duty" className="hover:underline">Stamp duty concession for first home buyers</a></li>
            <li><a href="#federal-schemes" className="hover:underline">Federal government schemes</a></li>
            <li><a href="#affordability" className="hover:underline">Tasmania: one of Australia&apos;s most affordable states</a></li>
            <li><a href="#key-areas" className="hover:underline">Key property markets: Hobart, Launceston, Burnie</a></li>
            <li><a href="#eligibility" className="hover:underline">Eligibility requirements</a></li>
            <li><a href="#steps" className="hover:underline">Step-by-step: buying your first home in Tasmania</a></li>
            <li><a href="#resources" className="hover:underline">Resources and contacts</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="fhog" className="text-2xl font-bold text-gray-900 mt-8 mb-4">First Home Owner Grant (FHOG) — Tasmania</h2>
          <p className="text-gray-600 mb-4">
            Tasmania offers one of the most generous First Home Owner Grants in Australia. As of 2026,
            eligible first home buyers in Tasmania can receive a grant of <strong>$30,000</strong>{" "}
            when purchasing or building a new home. This amount was increased (from $20,000) to help
            attract buyers and stimulate housing construction in the state.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-green-800 mb-1">Tasmania FHOG at a glance</p>
            <ul className="text-sm text-green-700 space-y-1">
              <li><strong>Amount:</strong> $30,000</li>
              <li><strong>Property type:</strong> New homes only</li>
              <li><strong>Administered by:</strong> State Revenue Office Tasmania (SRO)</li>
              <li><strong>Verify current details at:</strong> sro.tas.gov.au</li>
            </ul>
          </div>

          <p className="text-gray-600 mb-4">
            The grant applies to new homes only — newly built homes that have not previously been
            occupied or sold as a place of residence, or homes being constructed for the first time
            on vacant land. Established (existing) homes do not qualify for the FHOG, but may
            still qualify for the stamp duty concession (see below).
          </p>
          <p className="text-gray-600 mb-4">
            Given Tasmania&apos;s relatively lower median property prices compared to the mainland,
            the $30,000 grant represents a significant proportion of a typical deposit — making
            it a highly valuable incentive for Tasmanian first home buyers.
          </p>
          <p className="text-gray-600 mb-4">
            Always confirm the current grant amount and any property value thresholds with the State
            Revenue Office before signing a contract, as eligibility rules can be updated by the
            government.
          </p>

          <h2 id="stamp-duty" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Stamp Duty Concession for First Home Buyers</h2>
          <p className="text-gray-600 mb-4">
            Tasmania provides a <strong>50% stamp duty concession</strong> for eligible first home
            buyers purchasing established homes up to a threshold of <strong>$600,000</strong>{" "}
            (verify current threshold at sro.tas.gov.au, as this is subject to review).
          </p>
          <p className="text-gray-600 mb-4">
            This concession is a significant financial benefit — stamp duty on a $500,000 Tasmanian
            property is approximately $18,247. With the 50% concession, a first home buyer would
            pay only around $9,123, saving approximately $9,000.
          </p>
          <p className="text-gray-600 mb-4">
            Important: the stamp duty concession applies to <em>established</em> (existing) homes,
            while the FHOG applies to <em>new</em> homes. You cannot receive both on the same
            property — so the benefit you receive depends on whether you buy new or established.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Scenario</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Benefit</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Property type</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="p-3 border border-gray-200">Buying new/building</td>
                  <td className="p-3 border border-gray-200">$30,000 FHOG grant + normal stamp duty applies</td>
                  <td className="p-3 border border-gray-200">New homes only</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Buying established</td>
                  <td className="p-3 border border-gray-200">50% stamp duty concession (up to $600,000 threshold)</td>
                  <td className="p-3 border border-gray-200">Established homes only</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="federal-schemes" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Federal Government Schemes</h2>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">First Home Guarantee</h3>
          <p className="text-gray-600 mb-4">
            The federal <strong>First Home Guarantee</strong> allows eligible first home buyers to
            purchase a property with a minimum 5% deposit, with the government guaranteeing up to
            15% of the purchase price — eliminating the need for Lenders Mortgage Insurance (LMI).
          </p>
          <p className="text-gray-600 mb-4">
            Tasmania price cap: <strong>$600,000</strong> across all areas (metro and regional).
            Tasmania&apos;s uniform cap reflects the state&apos;s more consistent (and lower) property values
            compared to larger states with stark metro/regional price differences.
          </p>
          <p className="text-gray-600 mb-4">
            Income caps apply: $125,000 for singles and $200,000 for couples (combined taxable income,
            assessed on the previous financial year&apos;s tax return).
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Regional First Home Buyer Guarantee</h3>
          <p className="text-gray-600 mb-4">
            The <strong>Regional First Home Buyer Guarantee</strong> provides the same 5% deposit
            / no LMI benefit but is specifically for buyers purchasing in regional areas who have
            lived in that region for at least 12 months. Given that much of Tasmania outside Hobart
            is classified as regional, this scheme is highly relevant for Tasmanian buyers in
            Launceston, Burnie, Devonport, and surrounding areas.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">First Home Super Saver Scheme (FHSSS)</h3>
          <p className="text-gray-600 mb-4">
            The FHSSS lets you voluntarily contribute up to $15,000 per year (capped at $50,000
            total) into superannuation and then withdraw those contributions and associated earnings
            to use as a home deposit. The effective tax saving is the difference between the 15%
            super tax rate and your marginal income tax rate.
          </p>

          <h2 id="affordability" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tasmania: One of Australia&apos;s Most Affordable States</h2>
          <p className="text-gray-600 mb-4">
            Despite significant price growth during the COVID-era property boom, Tasmania remains
            considerably more affordable than most mainland capitals. For first home buyers priced
            out of Sydney or Melbourne markets, Tasmania offers genuine value — particularly in
            regional centres.
          </p>
          <p className="text-gray-600 mb-4">
            Key affordability advantages in Tasmania:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Median house prices in Hobart are significantly lower than Sydney, Melbourne, and Brisbane</li>
            <li>Regional centres like Launceston, Burnie, and Devonport offer even greater affordability</li>
            <li>The $30,000 FHOG represents a higher proportion of a typical deposit relative to purchase price</li>
            <li>Growing remote work culture has made Tasmania a viable option for mainland workers</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Note: Tasmanian rental yields have historically been strong, making it attractive for
            investors as well — which can add competition in some market segments.
          </p>

          <h2 id="key-areas" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Property Markets: Hobart, Launceston, and Burnie</h2>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Hobart</h3>
          <p className="text-gray-600 mb-4">
            Hobart is Tasmania&apos;s capital and largest city. The inner suburbs (Battery Point,
            Sandy Bay, North Hobart) command premium prices, while outer suburbs and satellite
            towns like Glenorchy, Clarence, and Kingborough offer more accessible entry points
            for first home buyers.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Launceston</h3>
          <p className="text-gray-600 mb-4">
            Tasmania&apos;s second-largest city and the main commercial centre of northern Tasmania.
            Launceston typically offers lower median prices than Hobart, with strong community
            infrastructure, good schools, and improving connectivity.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Burnie and North-West Coast</h3>
          <p className="text-gray-600 mb-4">
            The north-west coast — including Burnie, Devonport, and surrounding areas — is among
            the most affordable property markets in Australia. First home buyers can access quality
            homes well within the $600,000 First Home Guarantee cap, often well below it.
          </p>

          <h2 id="eligibility" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Eligibility Requirements</h2>
          <p className="text-gray-600 mb-4">
            To be eligible for the Tasmanian FHOG:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Be an Australian citizen or permanent resident</li>
            <li>Be 18 years of age or older</li>
            <li>Have never previously owned residential property in Australia that was used as a place of residence</li>
            <li>Occupy the new home as your principal place of residence for at least 6 months, commencing within 12 months of settlement</li>
            <li>The property must be a new home (not previously occupied or sold as a residence)</li>
          </ul>
          <p className="text-gray-600 mb-4">
            For the stamp duty concession on established homes, standard first home buyer eligibility
            criteria apply — confirm the exact requirements at sro.tas.gov.au.
          </p>

          <h2 id="steps" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step-by-Step: Buying Your First Home in Tasmania</h2>

          <div className="space-y-4 mb-6">
            {[
              {
                step: "1",
                title: "Understand your finances",
                desc: "Calculate how much you can borrow and save. Factor in stamp duty (or the 50% concession if buying established), legal fees, pest and building inspection costs, and moving expenses.",
              },
              {
                step: "2",
                title: "Decide: new or established?",
                desc: "New home: access the $30,000 FHOG, pay full stamp duty. Established home: no FHOG but get 50% stamp duty concession. Run the numbers for your target price to see which is more beneficial.",
              },
              {
                step: "3",
                title: "Check federal scheme eligibility",
                desc: "Apply for the First Home Guarantee (5% deposit, no LMI) through a participating lender. Check whether the Regional First Home Buyer Guarantee applies to your area.",
              },
              {
                step: "4",
                title: "Get pre-approval",
                desc: "Pre-approval from a lender gives you a clear budget and makes you a more competitive buyer — especially important in areas with tight stock.",
              },
              {
                step: "5",
                title: "Search and inspect",
                desc: "Always arrange a building and pest inspection before making an offer or proceeding with a contract, particularly in older Tasmanian homes.",
              },
              {
                step: "6",
                title: "Engage a conveyancer or solicitor",
                desc: "A Tasmanian conveyancer or solicitor will review the contract, conduct searches, and manage the settlement process.",
              },
              {
                step: "7",
                title: "Apply for the FHOG",
                desc: "Lodge your FHOG application through your lender or directly with the State Revenue Office. The grant is typically paid at settlement.",
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
              <strong>State Revenue Office Tasmania (SRO)</strong> — FHOG and stamp duty:{" "}
              <a href="https://www.sro.tas.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">sro.tas.gov.au</a>
            </li>
            <li>
              <strong>Consumer, Building and Occupational Services (CBOS)</strong> — Property and tenancy:{" "}
              <a href="https://www.cbos.tas.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cbos.tas.gov.au</a>
            </li>
            <li>
              <strong>Housing Australia</strong> — First Home Guarantee and federal schemes:{" "}
              <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">housingaustralia.gov.au</a>
            </li>
            <li>
              <strong>ATO — First Home Super Saver Scheme:</strong>{" "}
              <a href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/first-home-super-saver-scheme" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ato.gov.au</a>
            </li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Exploring Tasmania?</strong> Browse{" "}
              <Link href="/buy" className="underline hover:text-blue-900">properties for sale in Tasmania</Link>{" "}
              or use our{" "}
              <Link href="/borrowing-power-calculator" className="underline hover:text-blue-900">borrowing power calculator</Link>{" "}
              to see what you can afford.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/first-home-buyer-guide" className="text-primary hover:underline">First Home Buyer Guide Australia (national overview)</Link></li>
              <li><Link href="/guides/first-home-buyer-sa" className="text-primary hover:underline">First Home Buyer Guide South Australia</Link></li>
              <li><Link href="/guides/first-home-buyer-nt" className="text-primary hover:underline">First Home Buyer Guide Northern Territory</Link></li>
              <li><Link href="/guides/first-home-buyer-act" className="text-primary hover:underline">First Home Buyer Guide ACT</Link></li>
              <li><Link href="/guides/lenders-mortgage-insurance-guide" className="text-primary hover:underline">Lenders Mortgage Insurance (LMI) Guide</Link></li>
              <li><Link href="/guides/renters-rights-tas" className="text-primary hover:underline">Renter&apos;s Rights in Tasmania</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
