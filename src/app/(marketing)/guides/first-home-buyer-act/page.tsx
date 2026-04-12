import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `First Home Buyer Guide ACT: Schemes, Stamp Duty & Canberra Property (2026) | ${SITE_NAME}`,
  description:
    "First home buyer guide for the ACT. No FHOG — instead get full stamp duty waiver via the Home Buyer Concession Scheme, ACT Shared Equity scheme, $750,000 First Home Guarantee cap, and leasehold land explained. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/first-home-buyer-act` },
  openGraph: {
    url: `${SITE_URL}/guides/first-home-buyer-act`,
    title: "First Home Buyer Guide ACT: Schemes, Stamp Duty & Canberra Property (2026)",
    description:
      "First home buyer guide for the ACT. No FHOG — instead get full stamp duty waiver via the Home Buyer Concession Scheme, ACT Shared Equity scheme, $750,000 First Home Guarantee cap, and leasehold land explained. Updated 2026.",
    type: "article",
  },
};

export default function FirstHomeBuyerACTPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "First Home Buyer Guide ACT", url: "/guides/first-home-buyer-act" },
        ]}
      />
      <GuideArticleJsonLd
        title="First Home Buyer Guide ACT: Schemes, Stamp Duty & Canberra Property (2026)"
        description="First home buyer guide for the ACT. No FHOG — instead get full stamp duty waiver via the Home Buyer Concession Scheme, ACT Shared Equity scheme, $750,000 First Home Guarantee cap, and leasehold land explained. Updated 2026."
        url="/guides/first-home-buyer-act"
        datePublished="2026-04-01"
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "First Home Buyer Guide ACT" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 9 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          First Home Buyer Guide ACT: Schemes, Stamp Duty &amp; Canberra Property (2026)
        </h1>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> This guide provides general information only and is not
          financial or legal advice. ACT property rules — including leasehold land and income
          thresholds — can be complex and change regularly. Always verify current details with
          the ACT Revenue Office (revenue.act.gov.au) or a licensed ACT conveyancer.
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#no-fhog" className="hover:underline">No FHOG in the ACT — here&apos;s what you get instead</a></li>
            <li><a href="#hbcs" className="hover:underline">Home Buyer Concession Scheme (HBCS)</a></li>
            <li><a href="#shared-equity" className="hover:underline">ACT Shared Equity Scheme</a></li>
            <li><a href="#land-rent" className="hover:underline">Land Rent Scheme</a></li>
            <li><a href="#federal-schemes" className="hover:underline">Federal government schemes</a></li>
            <li><a href="#leasehold" className="hover:underline">Leasehold land: the ACT&apos;s unique system</a></li>
            <li><a href="#canberra-market" className="hover:underline">Canberra property market overview</a></li>
            <li><a href="#eligibility" className="hover:underline">Eligibility requirements</a></li>
            <li><a href="#steps" className="hover:underline">Step-by-step: buying your first home in the ACT</a></li>
            <li><a href="#resources" className="hover:underline">Resources and contacts</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="no-fhog" className="text-2xl font-bold text-gray-900 mt-8 mb-4">No FHOG in the ACT — Here&apos;s What You Get Instead</h2>
          <p className="text-gray-600 mb-4">
            Unlike every other Australian state and territory, the ACT does <strong>not offer a
            First Home Owner Grant (FHOG)</strong>. The ACT Government replaced the FHOG with the{" "}
            <strong>Home Buyer Concession Scheme (HBCS)</strong>, which can provide significantly
            more value than a cash grant — eliminating stamp duty entirely for eligible buyers.
          </p>
          <p className="text-gray-600 mb-4">
            Given that Canberra has some of the highest property prices in Australia (and therefore
            high stamp duty bills), the HBCS can be worth substantially more than a FHOG would be.
            A buyer purchasing a $700,000 home in the ACT would normally face a stamp duty bill of
            approximately $27,000 — the HBCS can reduce this to zero.
          </p>

          <h2 id="hbcs" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Home Buyer Concession Scheme (HBCS)</h2>
          <p className="text-gray-600 mb-4">
            The <strong>Home Buyer Concession Scheme</strong> allows eligible first home buyers in
            the ACT to pay <strong>no stamp duty (conveyance duty)</strong> on their purchase.
            This is a full exemption — not a concession or reduction — making it one of the most
            generous first home buyer benefits in Australia.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-green-800 mb-1">HBCS at a glance</p>
            <ul className="text-sm text-green-700 space-y-1">
              <li><strong>Benefit:</strong> Zero stamp duty (full exemption)</li>
              <li><strong>Applies to:</strong> New and established homes</li>
              <li><strong>Income threshold:</strong> Applies (verify current limits at revenue.act.gov.au)</li>
              <li><strong>Property price threshold:</strong> Applies (verify current limits)</li>
              <li><strong>Administered by:</strong> ACT Revenue Office</li>
            </ul>
          </div>

          <p className="text-gray-600 mb-4">
            Key eligibility requirements for the HBCS:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>At least one buyer must be an Australian citizen or permanent resident</li>
            <li>No buyer or their spouse/partner can have previously owned residential property in Australia</li>
            <li>The property must be used as the buyer&apos;s principal place of residence</li>
            <li>Income thresholds apply — the combined gross income of all buyers must not exceed the current threshold</li>
            <li>Property value thresholds apply — the dutiable value must not exceed the current cap</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Income and property price thresholds are adjusted periodically by the ACT Government.
            Always check the current thresholds at{" "}
            <a href="https://www.revenue.act.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">revenue.act.gov.au</a>{" "}
            before planning around this scheme — buying a property just over the threshold means
            normal stamp duty rates apply in full.
          </p>

          <h2 id="shared-equity" className="text-2xl font-bold text-gray-900 mt-8 mb-4">ACT Shared Equity Scheme</h2>
          <p className="text-gray-600 mb-4">
            The ACT Government operates a <strong>shared equity scheme</strong> for eligible buyers
            who cannot afford to purchase without additional support. Under this scheme, the ACT
            Government contributes a portion of the purchase price (equity contribution) in exchange
            for a proportional interest in the property.
          </p>
          <p className="text-gray-600 mb-4">
            How it works:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>The government&apos;s equity stake reduces the loan amount you need — lowering your repayments</li>
            <li>You pay no rent or return on the government&apos;s share during occupancy</li>
            <li>You can progressively buy out the government&apos;s equity share over time</li>
            <li>When you sell, the government recoups its proportional share of the sale price</li>
            <li>Strict income and asset eligibility criteria apply</li>
          </ul>
          <p className="text-gray-600 mb-4">
            This scheme is particularly valuable in Canberra where property prices are high relative
            to income for many lower-to-middle income earners (teachers, nurses, junior public
            servants). Check current availability and eligibility at the ACT Housing Authority.
          </p>

          <h2 id="land-rent" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Land Rent Scheme</h2>
          <p className="text-gray-600 mb-4">
            The ACT offers a unique <strong>Land Rent Scheme</strong> as an alternative to
            purchasing land outright. Under this scheme:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>You lease the land from the ACT Government and pay an annual rent on the land component only</li>
            <li>You own the dwelling (house or improvements) built on the land</li>
            <li>This significantly reduces the upfront capital required — you only need to finance the construction, not the land</li>
            <li>Land rent rates are set by the government and are generally lower than servicing a land mortgage</li>
            <li>You can choose to purchase the land outright at any time, converting to a standard Crown Lease</li>
          </ul>
          <p className="text-gray-600 mb-4">
            The Land Rent Scheme is a genuinely innovative approach to housing affordability and is
            worth considering for first home buyers building new homes in the ACT, particularly in
            greenfield developments.
          </p>

          <h2 id="federal-schemes" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Federal Government Schemes</h2>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">First Home Guarantee</h3>
          <p className="text-gray-600 mb-4">
            The federal <strong>First Home Guarantee</strong> allows eligible first home buyers to
            purchase with a 5% deposit without paying Lenders Mortgage Insurance (LMI).
          </p>
          <p className="text-gray-600 mb-4">
            ACT price cap: <strong>$750,000</strong> — the second highest cap in Australia after
            NSW ($900,000) and jointly with Victoria. This reflects Canberra&apos;s high median property
            prices and makes the scheme applicable to a wider range of properties in the ACT market.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">First Home Super Saver Scheme (FHSSS)</h3>
          <p className="text-gray-600 mb-4">
            Given Canberra&apos;s high average incomes (driven by the public sector), the FHSSS can
            be particularly valuable for ACT buyers. Voluntary super contributions of up to
            $15,000/year (max $50,000 total) can be withdrawn for a home deposit, with contributions
            taxed at just 15% rather than your marginal rate.
          </p>

          <h2 id="leasehold" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Leasehold Land: The ACT&apos;s Unique System</h2>
          <p className="text-gray-600 mb-4">
            This is perhaps the most important thing to understand about buying property in Canberra:
            <strong> all land in the ACT is held under Crown Lease (leasehold tenure)</strong>. There
            is no freehold land in the ACT — the territory government owns all land.
          </p>
          <p className="text-gray-600 mb-4">
            What this means in practice:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>You own the dwelling</strong> (the house, apartment, or improvements on the land)
              and hold a Crown Lease over the land, typically for 99 years
            </li>
            <li>
              <strong>Crown Leases specify permitted use</strong> — e.g. residential, commercial.
              Using land contrary to its Crown Lease purpose is a lease breach
            </li>
            <li>
              <strong>Change of use charges</strong>: if you want to develop or change the use of
              the land (e.g. subdivide, add a secondary dwelling), the government may charge a
              &quot;change of use charge&quot; — essentially a fee for the uplift in land value
            </li>
            <li>
              <strong>Mortgage and finance:</strong> All major Australian banks lend on ACT Crown
              Lease properties as a matter of course — the leasehold system is well-established and
              presents no unusual financing challenges for standard residential purchases
            </li>
            <li>
              <strong>99-year leases:</strong> When a lease approaches the end of its term (rare in
              modern residential areas), it is typically renewed automatically. In practice, this
              is not a concern for most ACT buyers
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            For most buyers of standard residential homes in Canberra, the leasehold system operates
            almost identically to freehold ownership. The differences become more significant when
            developing or changing use of a property.
          </p>

          <h2 id="canberra-market" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Canberra Property Market Overview</h2>
          <p className="text-gray-600 mb-4">
            Canberra is consistently ranked among Australia&apos;s most expensive property markets, driven
            by high average incomes, stable government employment, and significant demand for quality
            housing.
          </p>
          <p className="text-gray-600 mb-4">
            Key characteristics:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>High median house and unit prices — among the top in Australia</li>
            <li>Strong government and public service employment base provides economic stability</li>
            <li>Low vacancy rates and strong rental demand</li>
            <li>Well-planned city with excellent infrastructure, schools, and amenities</li>
            <li>Greenfield developments (Gungahlin, Molonglo/Whitlam, Googong) offer newer, more affordable stock</li>
            <li>Inner Canberra (Braddon, Kingston, Barton, New Acton) commands significant premiums</li>
          </ul>
          <p className="text-gray-600 mb-4">
            For first home buyers, the HBCS stamp duty waiver and the $750,000 First Home Guarantee
            cap are critical enablers in a market where median house prices regularly exceed $900,000.
          </p>

          <h2 id="eligibility" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Eligibility Requirements</h2>
          <p className="text-gray-600 mb-4">
            For the Home Buyer Concession Scheme (HBCS):
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>At least one buyer must be an Australian citizen or permanent resident</li>
            <li>No buyer (or their domestic partner) can have previously owned residential property in Australia</li>
            <li>The property must become the buyer&apos;s principal place of residence</li>
            <li>Income and property value thresholds must be met (check current figures at revenue.act.gov.au)</li>
          </ul>
          <p className="text-gray-600 mb-4">
            The ACT&apos;s income thresholds for the HBCS are set to include typical public service incomes
            at lower classification levels, recognising the importance of accessibility for essential
            workers. However, dual-income professional households may exceed the thresholds.
          </p>

          <h2 id="steps" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step-by-Step: Buying Your First Home in the ACT</h2>

          <div className="space-y-4 mb-6">
            {[
              {
                step: "1",
                title: "Check HBCS eligibility first",
                desc: "Before searching for properties, confirm whether you meet the HBCS income and property value thresholds. This affects your total budget — zero stamp duty vs a $20,000+ bill is a significant difference.",
              },
              {
                step: "2",
                title: "Calculate your total budget",
                desc: "Account for conveyancing fees ($1,500–$2,500), building inspections, title searches, and moving costs. If eligible for HBCS, exclude stamp duty. If not eligible, include it.",
              },
              {
                step: "3",
                title: "Consider the First Home Guarantee",
                desc: "If your deposit is under 20%, the First Home Guarantee (5% deposit, no LMI, $750,000 cap) can save tens of thousands in LMI costs. Apply through a participating lender.",
              },
              {
                step: "4",
                title: "Get pre-approval",
                desc: "Obtain pre-approval from a lender familiar with ACT Crown Lease properties. All major banks lend on ACT leasehold — this should not be an obstacle.",
              },
              {
                step: "5",
                title: "Understand the Crown Lease",
                desc: "For any property you consider, review the Crown Lease conditions. Your conveyancer can explain any development restrictions or change-of-use implications.",
              },
              {
                step: "6",
                title: "Make an offer and sign contracts",
                desc: "ACT uses a standard purchase contract. There is a standard cooling-off period of 5 business days for residential property.",
              },
              {
                step: "7",
                title: "Apply for HBCS",
                desc: "Lodge your HBCS application with the ACT Revenue Office. This is typically done as part of the settlement process through your conveyancer.",
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
              <strong>ACT Revenue Office</strong> — HBCS, stamp duty, land rent:{" "}
              <a href="https://www.revenue.act.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">revenue.act.gov.au</a>
            </li>
            <li>
              <strong>ACT Housing Authority</strong> — Shared equity and community housing:{" "}
              <a href="https://www.housing.act.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">housing.act.gov.au</a>
            </li>
            <li>
              <strong>Housing Australia</strong> — First Home Guarantee and federal schemes:{" "}
              <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">housingaustralia.gov.au</a>
            </li>
            <li>
              <strong>ACT Civil and Administrative Tribunal (ACAT)</strong> — Tenancy and property disputes:{" "}
              <a href="https://www.acat.act.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">acat.act.gov.au</a>
            </li>
            <li>
              <strong>Access Canberra</strong> — General ACT government services:{" "}
              <a href="https://www.accesscanberra.act.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">accesscanberra.act.gov.au</a>
            </li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Searching in Canberra?</strong> Browse{" "}
              <Link href="/buy" className="underline hover:text-blue-900">ACT properties for sale</Link>{" "}
              or use our{" "}
              <Link href="/borrowing-power-calculator" className="underline hover:text-blue-900">borrowing power calculator</Link>{" "}
              to set your budget.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/first-home-buyer-guide" className="text-primary hover:underline">First Home Buyer Guide Australia (national overview)</Link></li>
              <li><Link href="/guides/first-home-buyer-nsw" className="text-primary hover:underline">First Home Buyer Guide NSW</Link></li>
              <li><Link href="/guides/first-home-buyer-vic" className="text-primary hover:underline">First Home Buyer Guide Victoria</Link></li>
              <li><Link href="/guides/first-home-buyer-sa" className="text-primary hover:underline">First Home Buyer Guide South Australia</Link></li>
              <li><Link href="/guides/first-home-buyer-nt" className="text-primary hover:underline">First Home Buyer Guide Northern Territory</Link></li>
              <li><Link href="/guides/lenders-mortgage-insurance-guide" className="text-primary hover:underline">Lenders Mortgage Insurance (LMI) Guide</Link></li>
              <li><Link href="/guides/renters-rights-act" className="text-primary hover:underline">Renter&apos;s Rights in the ACT</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
