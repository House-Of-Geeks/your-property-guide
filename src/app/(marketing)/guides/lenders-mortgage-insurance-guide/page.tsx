import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Lenders Mortgage Insurance (LMI): What It Is, What It Costs, and How to Avoid It (2026) | ${SITE_NAME}`,
  description:
    "Complete guide to Lenders Mortgage Insurance (LMI) in Australia. What LMI is, when it applies, how much it costs, who provides it (Helia and Arch), and how to avoid it through the First Home Guarantee, guarantor loans, or professional packages. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/lenders-mortgage-insurance-guide` },
  openGraph: {
    url: `${SITE_URL}/guides/lenders-mortgage-insurance-guide`,
    title: "Lenders Mortgage Insurance (LMI): What It Is, What It Costs, and How to Avoid It (2026)",
    description:
      "Complete guide to Lenders Mortgage Insurance (LMI) in Australia. What LMI is, when it applies, how much it costs, who provides it (Helia and Arch), and how to avoid it through the First Home Guarantee, guarantor loans, or professional packages. Updated 2026.",
    type: "article",
  },
};

export default function LMIGuidePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Lenders Mortgage Insurance Guide", url: "/guides/lenders-mortgage-insurance-guide" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Lenders Mortgage Insurance Guide" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 6 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Lenders Mortgage Insurance (LMI): What It Is, What It Costs, and How to Avoid It (2026)
        </h1>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> LMI costs vary by lender and LMI provider. Figures in this
          guide are indicative only. Always obtain a personalised LMI quote from your lender or
          mortgage broker before making decisions.
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#what-is-lmi" className="hover:underline">What is LMI? (and what it is NOT)</a></li>
            <li><a href="#when-applies" className="hover:underline">When does LMI apply?</a></li>
            <li><a href="#cost" className="hover:underline">How much does LMI cost?</a></li>
            <li><a href="#who-provides" className="hover:underline">Who provides LMI in Australia?</a></li>
            <li><a href="#capitalise" className="hover:underline">Capitalising LMI into your loan</a></li>
            <li><a href="#avoid" className="hover:underline">How to avoid LMI</a></li>
            <li><a href="#is-it-worth-it" className="hover:underline">Is paying LMI worth it?</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="what-is-lmi" className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is LMI? (And What It is NOT)</h2>
          <p className="text-gray-600 mb-4">
            Lenders Mortgage Insurance is one of the most misunderstood costs in Australian
            property. Let&apos;s be absolutely clear:
          </p>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-red-800 mb-1">LMI protects the LENDER, not you</p>
            <p className="text-sm text-red-700">
              LMI is insurance taken out by the lender (the bank) to protect <em>itself</em> in the
              event that you default on your mortgage and the sale of the property does not cover
              the outstanding loan balance. You pay the premium, but the bank is the beneficiary.
              If you default, the bank claims on the LMI policy — you are still liable to repay
              any shortfall.
            </p>
          </div>

          <p className="text-gray-600 mb-4">
            This distinction matters enormously. Many borrowers pay LMI assuming it provides them
            with some protection — it does not. LMI provides no direct benefit to the borrower;
            it simply enables the lender to offer higher-LVR loans with reduced risk to itself.
          </p>
          <p className="text-gray-600 mb-4">
            The practical outcome for borrowers is that LMI allows you to <em>access</em> a home
            loan with a deposit of less than 20%, which would otherwise be unavailable from most
            lenders. That access has value — but you are paying for it.
          </p>

          <h2 id="when-applies" className="text-2xl font-bold text-gray-900 mt-8 mb-4">When Does LMI Apply?</h2>
          <p className="text-gray-600 mb-4">
            LMI applies when the <strong>Loan to Value Ratio (LVR)</strong> of your loan exceeds
            80%. LVR is calculated as:
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200 text-center">
            <p className="text-sm font-mono text-gray-700">LVR = Loan Amount ÷ Property Value × 100</p>
          </div>
          <p className="text-gray-600 mb-4">
            Example: If you are buying a $700,000 property and borrowing $595,000, your LVR
            is 85% — above the 80% threshold, so LMI applies.
          </p>
          <p className="text-gray-600 mb-4">
            The practical implication: to avoid LMI entirely, you need a deposit of at least 20%
            of the purchase price — plus enough to cover stamp duty, legal fees, and other
            upfront costs. For a $700,000 property, that means having at least $140,000 in
            deposit plus approximately $30,000–$40,000 in transaction costs — a total of
            $170,000–$180,000+ before you can buy without LMI.
          </p>
          <p className="text-gray-600 mb-4">
            Most lenders set 80% as the standard LMI threshold, but:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Some lenders charge LMI above a different threshold (e.g. 85%)</li>
            <li>Some professions can access 90% lending without LMI (see professional packages below)</li>
            <li>The government&apos;s First Home Guarantee scheme provides an alternative to LMI for eligible buyers</li>
          </ul>

          <h2 id="cost" className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Much Does LMI Cost?</h2>
          <p className="text-gray-600 mb-4">
            LMI is calculated as a percentage of the loan amount, and increases significantly as
            the LVR increases. The exact premium depends on the lender, the LMI provider, and the
            specific loan details — but the following table gives indicative figures:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Loan amount</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">LVR 85%</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">LVR 90%</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">LVR 95%</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="p-3 border border-gray-200">$400,000</td>
                  <td className="p-3 border border-gray-200">~$5,000 – $7,000</td>
                  <td className="p-3 border border-gray-200">~$7,500 – $10,000</td>
                  <td className="p-3 border border-gray-200">~$12,000 – $16,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">$500,000</td>
                  <td className="p-3 border border-gray-200">~$6,500 – $9,000</td>
                  <td className="p-3 border border-gray-200">~$9,500 – $12,500</td>
                  <td className="p-3 border border-gray-200">~$15,000 – $20,000</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">$700,000</td>
                  <td className="p-3 border border-gray-200">~$9,000 – $13,000</td>
                  <td className="p-3 border border-gray-200">~$14,000 – $18,000</td>
                  <td className="p-3 border border-gray-200">~$22,000 – $28,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">$1,000,000</td>
                  <td className="p-3 border border-gray-200">~$13,000 – $18,000</td>
                  <td className="p-3 border border-gray-200">~$20,000 – $26,000</td>
                  <td className="p-3 border border-gray-200">~$32,000 – $40,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mb-4 text-sm">
            <em>Note: These are indicative figures only. Actual LMI premiums vary by lender, LMI
            provider, and borrower circumstances. Always obtain a personalised quote.</em>
          </p>
          <p className="text-gray-600 mb-4">
            A few key observations from the table:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>LMI costs increase disproportionately at higher LVRs — going from 85% to 95% LVR roughly doubles the premium</li>
            <li>On larger loan amounts, LMI can represent a very significant upfront cost</li>
            <li>The jump from 89.9% to 90% LVR can dramatically increase the premium</li>
          </ul>

          <h2 id="who-provides" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Who Provides LMI in Australia?</h2>
          <p className="text-gray-600 mb-4">
            Australia&apos;s LMI market is dominated by two providers:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Helia</strong> (formerly Genworth Australia) — one of Australia&apos;s largest
              LMI providers, used by many major banks and lenders.
            </li>
            <li>
              <strong>Arch Mortgage Insurance</strong> (formerly QBE LMI) — the other major provider,
              used by a range of lenders.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Some lenders self-insure (retain the LMI risk internally) rather than using an external
            provider. The borrower&apos;s experience is broadly the same — LMI is paid at settlement and
            the premium is set by the lender.
          </p>
          <p className="text-gray-600 mb-4">
            Importantly, LMI premiums are <strong>not portable between lenders</strong>. If you
            refinance your loan before the LVR falls below 80%, you will generally need to pay
            a new LMI premium with the new lender — even if you paid LMI on your original loan.
            This is an often-overlooked cost of refinancing high-LVR loans.
          </p>

          <h2 id="capitalise" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Capitalising LMI Into Your Loan</h2>
          <p className="text-gray-600 mb-4">
            Many lenders allow you to add the LMI premium to your home loan balance rather
            than paying it upfront in cash. This is called &quot;capitalising&quot; the LMI.
          </p>
          <p className="text-gray-600 mb-4">
            The advantage: you don&apos;t need to find the LMI premium in cash at settlement.
          </p>
          <p className="text-gray-600 mb-4">
            The disadvantage: you pay interest on the LMI amount for the life of the loan.
            A $15,000 LMI premium capitalised into a 6% loan over 30 years will cost you
            significantly more in total interest — often 2–3 times the original premium.
          </p>
          <p className="text-gray-600 mb-4">
            If you can pay the LMI premium from savings rather than capitalising it, you will
            save money in the long run.
          </p>

          <h2 id="avoid" className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Avoid LMI</h2>
          <p className="text-gray-600 mb-4">
            There are several strategies to avoid paying LMI:
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">1. Save a 20% deposit</h3>
          <p className="text-gray-600 mb-4">
            The most straightforward approach. With a genuine 20% deposit (plus costs), no LMI
            applies. The challenge is that saving a 20% deposit in a rising property market can
            feel like running on a treadmill — the goalposts keep moving.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">2. First Home Guarantee (government scheme)</h3>
          <p className="text-gray-600 mb-4">
            The federal <strong>First Home Guarantee</strong> allows eligible first home buyers
            to purchase with as little as a 5% deposit, with the government guaranteeing up to
            15% — eliminating the need for LMI entirely. See our{" "}
            <Link href="/guides/first-home-buyer-guide" className="text-primary hover:underline">First Home Buyer Guide</Link>{" "}
            for details and state-specific price caps.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">3. Guarantor loan (family guarantee)</h3>
          <p className="text-gray-600 mb-4">
            A family member (typically a parent) can act as guarantor, using their own property
            as additional security for part of your loan. This can allow you to borrow up to
            100% of the purchase price without LMI, as the lender&apos;s security is effectively
            supplemented by the guarantor&apos;s property.
          </p>
          <p className="text-gray-600 mb-4">
            Guarantor arrangements carry risk for the guarantor — they are liable for the guaranteed
            portion of the loan if you default. All parties should obtain independent legal and
            financial advice before entering a guarantor arrangement.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">4. Professional package (LMI waiver)</h3>
          <p className="text-gray-600 mb-4">
            Many lenders offer LMI waivers for borrowers in certain professions, recognising their
            lower risk of default (stable employment, high income). Eligible professions typically
            include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Medical doctors, specialists, and dentists</li>
            <li>Lawyers and barristers</li>
            <li>Accountants (CPA or CA qualified)</li>
            <li>Optometrists and veterinarians</li>
            <li>Some engineers and other professionals (lender-dependent)</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Waivers typically allow borrowing up to 90–95% LVR without LMI. Eligibility
            requirements vary by lender — check with your mortgage broker for current options.
          </p>

          <h2 id="is-it-worth-it" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Is Paying LMI Worth It?</h2>
          <p className="text-gray-600 mb-4">
            The conventional wisdom is that LMI is a cost to be avoided. But there is a genuine
            argument that paying LMI can sometimes be worth it — and here&apos;s why:
          </p>
          <p className="text-gray-600 mb-4">
            Consider a buyer who has a 10% deposit ($80,000) and is looking at a $800,000 property.
            They could either:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Wait 2 more years to save the full 20% deposit:</strong> During that time,
              the property market might rise — say, 5% per year. The same $800,000 property could
              now cost $882,000, requiring a higher deposit. The &quot;cost&quot; of waiting is potentially
              the additional $82,000 plus $82,000 more in stamp duty and ongoing costs.
            </li>
            <li>
              <strong>Buy now with 10% deposit and pay ~$18,000 LMI:</strong> Enter the market
              2 years earlier, benefit from any capital growth, and pay off LMI over time.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            In a rising market, getting into the property market 2 years earlier can easily
            outweigh the cost of LMI. However, in a flat or falling market, waiting to save
            a larger deposit is almost always better.
          </p>
          <p className="text-gray-600 mb-4">
            The calculation depends on:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Expected property price growth in your target area</li>
            <li>Your ability to save — how quickly could you reach a 20% deposit?</li>
            <li>Your current rental costs (which are &quot;dead money&quot; vs building equity in a purchased property)</li>
            <li>The specific LMI premium for your LVR and loan amount</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Use our{" "}
            <Link href="/borrowing-power-calculator" className="text-primary hover:underline">borrowing power calculator</Link>{" "}
            to model different scenarios and see what makes sense for your situation.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Ready to explore your options?</strong> Browse{" "}
              <Link href="/buy" className="underline hover:text-blue-900">properties for sale</Link>{" "}
              or use our{" "}
              <Link href="/borrowing-power-calculator" className="underline hover:text-blue-900">borrowing power calculator</Link>{" "}
              to see how much you could borrow.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/first-home-buyer-guide" className="text-primary hover:underline">First Home Buyer Guide Australia</Link></li>
              <li><Link href="/guides/first-home-buyer-nsw" className="text-primary hover:underline">First Home Buyer Guide NSW</Link></li>
              <li><Link href="/guides/first-home-buyer-vic" className="text-primary hover:underline">First Home Buyer Guide Victoria</Link></li>
              <li><Link href="/guides/fixed-vs-variable-rate-guide" className="text-primary hover:underline">Fixed vs Variable Rate Guide</Link></li>
              <li><Link href="/guides/buying-property-australia" className="text-primary hover:underline">Buying Property in Australia</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
