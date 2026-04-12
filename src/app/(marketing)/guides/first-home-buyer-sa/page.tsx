import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `First Home Buyer Guide South Australia: Grants, Stamp Duty & Schemes (2026) | ${SITE_NAME}`,
  description:
    "Complete guide for first home buyers in South Australia. FHOG $15,000, stamp duty rules, First Home Guarantee, HomeSeeker SA shared equity, and off-the-plan concessions. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/first-home-buyer-sa` },
  openGraph: {
    url: `${SITE_URL}/guides/first-home-buyer-sa`,
    title: "First Home Buyer Guide South Australia: Grants, Stamp Duty & Schemes (2026)",
    description:
      "Complete guide for first home buyers in South Australia. FHOG $15,000, stamp duty rules, First Home Guarantee, HomeSeeker SA shared equity, and off-the-plan concessions. Updated 2026.",
    type: "article",
  },
};

export default function FirstHomeBuyerSAPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "First Home Buyer Guide SA", url: "/guides/first-home-buyer-sa" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "First Home Buyer Guide SA" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 9 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          First Home Buyer Guide South Australia: Grants, Stamp Duty &amp; Schemes (2026)
        </h1>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> This guide provides general information only and is not
          financial or legal advice. Grant amounts and eligibility criteria change — always verify
          current details with RevenueSA (revenuesa.sa.gov.au) or a licensed mortgage broker before
          making decisions.
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#fhog" className="hover:underline">First Home Owner Grant (FHOG) SA</a></li>
            <li><a href="#stamp-duty" className="hover:underline">Stamp duty in South Australia</a></li>
            <li><a href="#federal-schemes" className="hover:underline">Federal government schemes</a></li>
            <li><a href="#homeseeker" className="hover:underline">HomeSeeker SA shared equity</a></li>
            <li><a href="#off-the-plan" className="hover:underline">Off-the-plan stamp duty concession</a></li>
            <li><a href="#eligibility" className="hover:underline">Who is eligible?</a></li>
            <li><a href="#steps" className="hover:underline">Step-by-step: buying your first home in SA</a></li>
            <li><a href="#resources" className="hover:underline">Resources and contacts</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="fhog" className="text-2xl font-bold text-gray-900 mt-8 mb-4">First Home Owner Grant (FHOG) — South Australia</h2>
          <p className="text-gray-600 mb-4">
            South Australia offers a <strong>First Home Owner Grant of $15,000</strong> to eligible
            first home buyers purchasing or building a new home. The grant is administered by
            <strong> RevenueSA</strong> and is funded by the South Australian Government.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-green-800 mb-1">SA FHOG at a glance</p>
            <ul className="text-sm text-green-700 space-y-1">
              <li><strong>Amount:</strong> $15,000</li>
              <li><strong>Property type:</strong> New homes only (not established/existing homes)</li>
              <li><strong>Contract price cap:</strong> $650,000</li>
              <li><strong>Administered by:</strong> RevenueSA</li>
            </ul>
          </div>

          <p className="text-gray-600 mb-4">
            The FHOG applies to new homes only — if you are purchasing an established (existing)
            property, you are not eligible for the grant. A &quot;new home&quot; includes:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>A newly built home that has not been previously occupied or sold as a place of residence</li>
            <li>A home built by you (owner-builder) for the first time</li>
            <li>Substantially renovated homes may qualify in some circumstances (check with RevenueSA)</li>
          </ul>
          <p className="text-gray-600 mb-4">
            The contract price (or the total value of construction plus land) must not exceed{" "}
            <strong>$650,000</strong>. If you are buying land separately and building, the combined
            value of the land and build contract must fall within this cap.
          </p>
          <p className="text-gray-600 mb-4">
            The grant is generally paid at settlement for off-the-plan or completed new homes, or
            at the first progress payment for construction loans. Your lender can often apply on
            your behalf as an approved agent.
          </p>

          <h2 id="stamp-duty" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Stamp Duty in South Australia</h2>
          <p className="text-gray-600 mb-4">
            Unlike some other states, <strong>South Australia does not offer a stamp duty
            exemption or concession specifically for first home buyers</strong> on established
            properties. The FHOG (available only on new homes) effectively serves as SA&apos;s primary
            concession for first home buyers.
          </p>
          <p className="text-gray-600 mb-4">
            Stamp duty (called &quot;conveyance duty&quot; in SA) is calculated on a sliding scale based on
            the property value:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Property value</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Duty rate</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="p-3 border border-gray-200">$0 – $12,000</td>
                  <td className="p-3 border border-gray-200">$1.00 per $100</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">$12,001 – $30,000</td>
                  <td className="p-3 border border-gray-200">$120 + $2.00 per $100 over $12,000</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">$30,001 – $50,000</td>
                  <td className="p-3 border border-gray-200">$480 + $3.00 per $100 over $30,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">$50,001 – $100,000</td>
                  <td className="p-3 border border-gray-200">$1,080 + $3.50 per $100 over $50,000</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">$100,001 – $200,000</td>
                  <td className="p-3 border border-gray-200">$2,830 + $4.00 per $100 over $100,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">$200,001 – $250,000</td>
                  <td className="p-3 border border-gray-200">$6,830 + $4.25 per $100 over $200,000</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">$250,001 – $300,000</td>
                  <td className="p-3 border border-gray-200">$8,955 + $4.75 per $100 over $250,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">$300,001 – $500,000</td>
                  <td className="p-3 border border-gray-200">$11,330 + $5.00 per $100 over $300,000</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Over $500,000</td>
                  <td className="p-3 border border-gray-200">$21,330 + $5.50 per $100 over $500,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mb-4">
            As an example: on a $600,000 home, stamp duty in SA is approximately $26,830.
            This is a significant upfront cost — factoring it into your savings target alongside
            your deposit is essential.
          </p>
          <p className="text-gray-600 mb-4">
            Always use RevenueSA&apos;s online stamp duty calculator to get the precise figure for your
            purchase, as duty may also apply to associated transactions. Verify rates at{" "}
            <a href="https://www.revenuesa.sa.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">revenuesa.sa.gov.au</a>.
          </p>

          <h2 id="federal-schemes" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Federal Government Schemes</h2>
          <p className="text-gray-600 mb-4">
            First home buyers in SA can also access federal government schemes administered through
            Housing Australia (formerly NHFIC):
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">First Home Guarantee (formerly FHLDS)</h3>
          <p className="text-gray-600 mb-4">
            The <strong>First Home Guarantee</strong> allows eligible first home buyers to purchase
            with as little as a 5% deposit, with the government guaranteeing up to 15% of the loan
            value — meaning no Lenders Mortgage Insurance (LMI) is required.
          </p>
          <p className="text-gray-600 mb-4">
            SA price caps for the First Home Guarantee:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li><strong>Adelaide (metro):</strong> $600,000</li>
            <li><strong>Regional SA:</strong> $450,000</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Places are limited each financial year and allocated on a first-come, first-served basis.
            You must apply through a participating lender. Income caps apply: $125,000 for singles
            and $200,000 for couples (combined taxable income).
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">First Home Super Saver Scheme (FHSSS)</h3>
          <p className="text-gray-600 mb-4">
            The FHSSS allows you to make voluntary super contributions of up to $15,000 per year
            (up to $50,000 total) and then withdraw these — plus associated earnings — to use as a
            home deposit. The tax advantage comes from contributions being taxed at just 15% rather
            than your marginal rate.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Help to Buy (shared equity)</h3>
          <p className="text-gray-600 mb-4">
            The federal government&apos;s Help to Buy scheme — where the government contributes up to 40%
            equity in a new home or 30% in an existing home — has been legislated. Check the current
            rollout status and SA-specific details at the Housing Australia website.
          </p>

          <h2 id="homeseeker" className="text-2xl font-bold text-gray-900 mt-8 mb-4">HomeSeeker SA — State Shared Equity Scheme</h2>
          <p className="text-gray-600 mb-4">
            South Australia has also run the <strong>HomeSeeker SA</strong> program, a shared equity
            scheme aimed at helping lower-to-moderate income earners purchase a home. Under a shared
            equity arrangement, the state government co-invests in your property, reducing the size
            of your mortgage and the deposit you need.
          </p>
          <p className="text-gray-600 mb-4">
            Availability and eligibility criteria for HomeSeeker SA have changed over time, with
            some rounds being fully subscribed. Check the current status directly with the SA Housing
            Authority (housing.sa.gov.au) before planning around this scheme.
          </p>
          <p className="text-gray-600 mb-4">
            Typical shared equity features include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Government takes a share of the property proportional to its equity contribution</li>
            <li>You pay no rent on the government&apos;s share (unlike some other schemes)</li>
            <li>You can buy out the government&apos;s share over time</li>
            <li>Income and property value thresholds apply</li>
          </ul>

          <h2 id="off-the-plan" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Off-the-Plan Stamp Duty Concession</h2>
          <p className="text-gray-600 mb-4">
            SA offers a <strong>stamp duty concession for off-the-plan apartment purchases</strong>,
            primarily targeting CBD and inner-city developments. This concession reduces the stamp
            duty payable on eligible off-the-plan apartment contracts, making high-density new
            developments more accessible.
          </p>
          <p className="text-gray-600 mb-4">
            Key features:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Applies to apartments purchased off-the-plan (i.e. before construction is complete)</li>
            <li>Duty is assessed on the value of the property at the time of contract, not at completion</li>
            <li>This can result in significant savings if property values rise between contract and settlement</li>
            <li>The concession is not exclusive to first home buyers — it applies more broadly</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Verify the current scope and eligibility with RevenueSA, as these concessions are
            periodically reviewed by the government.
          </p>

          <h2 id="eligibility" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Who Is Eligible for the SA FHOG?</h2>
          <p className="text-gray-600 mb-4">
            To be eligible for the SA First Home Owner Grant, all applicants must:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Be an Australian citizen or permanent resident</li>
            <li>Be 18 years of age or older</li>
            <li>Have never previously owned residential property in Australia that was used as a place of residence</li>
            <li>Occupy the property as a principal place of residence for a continuous period of at least 6 months, commencing within 12 months of settlement or construction completion</li>
            <li>Purchase or build a new home with a contract price not exceeding $650,000</li>
          </ul>
          <p className="text-gray-600 mb-4">
            All parties to the transaction (if buying jointly) must satisfy the eligibility criteria,
            unless they are a spouse or de facto partner of an eligible applicant.
          </p>

          <h2 id="steps" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step-by-Step: Buying Your First Home in SA</h2>

          <div className="space-y-4 mb-6">
            {[
              {
                step: "1",
                title: "Calculate your budget",
                desc: "Use a borrowing power calculator to understand how much you can borrow. Account for stamp duty, legal fees ($1,500–$2,500), building inspections, and moving costs on top of your deposit.",
              },
              {
                step: "2",
                title: "Check your eligibility for grants and schemes",
                desc: "Confirm your eligibility for the FHOG ($15,000 for new homes under $650,000), the First Home Guarantee (5% deposit, no LMI), and the FHSSS. Your mortgage broker can assess which combination applies to you.",
              },
              {
                step: "3",
                title: "Get pre-approval",
                desc: "Apply for conditional pre-approval with your lender of choice. Pre-approval gives you a clear budget and demonstrates to sellers that you are a serious buyer.",
              },
              {
                step: "4",
                title: "Search for properties",
                desc: "For the FHOG, focus on new builds and house-and-land packages under $650,000. For established homes (no FHOG), you may still access the First Home Guarantee.",
              },
              {
                step: "5",
                title: "Arrange conveyancing",
                desc: "Engage a SA-licensed conveyancer or solicitor. They will review the contract of sale, conduct title searches, and manage settlement.",
              },
              {
                step: "6",
                title: "Apply for the FHOG",
                desc: "Apply through your lender (approved agent) or directly with RevenueSA. Submit all required documentation before settlement.",
              },
              {
                step: "7",
                title: "Settlement",
                desc: "Your conveyancer manages the settlement process. The FHOG is typically received at settlement and applied to your purchase costs.",
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
              <strong>RevenueSA</strong> — FHOG applications and stamp duty:{" "}
              <a href="https://www.revenuesa.sa.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">revenuesa.sa.gov.au</a>
            </li>
            <li>
              <strong>Consumer and Business Services SA</strong> — Property and conveyancing information:{" "}
              <a href="https://www.cbs.sa.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cbs.sa.gov.au</a>
            </li>
            <li>
              <strong>SA Housing Authority</strong> — HomeSeeker SA and shared equity:{" "}
              <a href="https://www.housing.sa.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">housing.sa.gov.au</a>
            </li>
            <li>
              <strong>Housing Australia</strong> — First Home Guarantee and federal schemes:{" "}
              <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">housingaustralia.gov.au</a>
            </li>
            <li>
              <strong>PlanSA</strong> — Planning and development:{" "}
              <a href="https://www.plan.sa.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">plan.sa.gov.au</a>
            </li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Ready to start your search?</strong> Browse{" "}
              <Link href="/buy" className="underline hover:text-blue-900">properties for sale in South Australia</Link>{" "}
              or use our{" "}
              <Link href="/borrowing-power-calculator" className="underline hover:text-blue-900">borrowing power calculator</Link>{" "}
              to understand your budget.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/first-home-buyer-guide" className="text-primary hover:underline">First Home Buyer Guide Australia (national overview)</Link></li>
              <li><Link href="/guides/first-home-buyer-nsw" className="text-primary hover:underline">First Home Buyer Guide NSW</Link></li>
              <li><Link href="/guides/first-home-buyer-vic" className="text-primary hover:underline">First Home Buyer Guide Victoria</Link></li>
              <li><Link href="/guides/first-home-buyer-qld" className="text-primary hover:underline">First Home Buyer Guide Queensland</Link></li>
              <li><Link href="/guides/first-home-buyer-wa" className="text-primary hover:underline">First Home Buyer Guide Western Australia</Link></li>
              <li><Link href="/guides/first-home-buyer-tas" className="text-primary hover:underline">First Home Buyer Guide Tasmania</Link></li>
              <li><Link href="/guides/first-home-buyer-nt" className="text-primary hover:underline">First Home Buyer Guide Northern Territory</Link></li>
              <li><Link href="/guides/first-home-buyer-act" className="text-primary hover:underline">First Home Buyer Guide ACT</Link></li>
              <li><Link href="/guides/lenders-mortgage-insurance-guide" className="text-primary hover:underline">Lenders Mortgage Insurance (LMI) Guide</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
