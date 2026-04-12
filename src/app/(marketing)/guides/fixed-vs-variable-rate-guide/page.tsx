import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Fixed vs Variable Rate Home Loans: Which is Better in 2026? | ${SITE_NAME}`,
  description:
    "Complete guide to fixed vs variable rate home loans in Australia. Pros and cons of each, split loans, break costs explained, the RBA rate context for 2026, and the key questions to ask before fixing. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/fixed-vs-variable-rate-guide` },
  openGraph: {
    url: `${SITE_URL}/guides/fixed-vs-variable-rate-guide`,
    title: "Fixed vs Variable Rate Home Loans: Which is Better in 2026?",
    description:
      "Complete guide to fixed vs variable rate home loans in Australia. Pros and cons of each, split loans, break costs explained, the RBA rate context for 2026, and the key questions to ask before fixing. Updated 2026.",
    type: "article",
  },
};

export default function FixedVsVariableRateGuidePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Fixed vs Variable Rate Guide", url: "/guides/fixed-vs-variable-rate-guide" },
        ]}
      />
      <GuideArticleJsonLd
        title="Fixed vs Variable Rate Home Loans: Which is Better in 2026?"
        description="Complete guide to fixed vs variable rate home loans in Australia. Pros and cons of each, split loans, break costs explained, the RBA rate context for 2026, and the key questions to ask before fixing. Updated 2026."
        url="/guides/fixed-vs-variable-rate-guide"
        datePublished="2026-04-01"
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Fixed vs Variable Rate Guide" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 6 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Fixed vs Variable Rate Home Loans: Which is Better in 2026?
        </h1>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> This guide is for general information only and is not
          financial advice. Interest rates change frequently. Always compare current rates from
          multiple lenders and speak with a licensed mortgage broker before making decisions about
          your home loan structure.
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#what-is-fixed" className="hover:underline">What is a fixed rate loan?</a></li>
            <li><a href="#what-is-variable" className="hover:underline">What is a variable rate loan?</a></li>
            <li><a href="#pros-cons-fixed" className="hover:underline">Pros and cons of fixed rates</a></li>
            <li><a href="#pros-cons-variable" className="hover:underline">Pros and cons of variable rates</a></li>
            <li><a href="#split-loans" className="hover:underline">Split loans: the best of both worlds?</a></li>
            <li><a href="#rba-context" className="hover:underline">The RBA rate environment in 2026</a></li>
            <li><a href="#break-costs" className="hover:underline">Break costs: the hidden danger of fixed rates</a></li>
            <li><a href="#questions" className="hover:underline">Questions to ask before fixing your rate</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="what-is-fixed" className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is a Fixed Rate Loan?</h2>
          <p className="text-gray-600 mb-4">
            A fixed rate home loan locks in your interest rate for a set period — typically
            1, 2, 3, or 5 years. During this fixed period, your interest rate (and therefore
            your monthly repayments) remain the same regardless of what the Reserve Bank of
            Australia (RBA) does with the official cash rate.
          </p>
          <p className="text-gray-600 mb-4">
            After the fixed term expires, the loan typically reverts to the lender&apos;s standard
            variable rate — often a higher rate than comparable variable products. At this point,
            you can choose to refix, refinance to a new lender, or move to a variable rate.
          </p>
          <p className="text-gray-600 mb-4">
            Fixed rate loans are priced by lenders based on their expectations of where
            interest rates will move over the fixed period — incorporating wholesale funding costs,
            competitive pressure, and rate expectations. Fixed rates are often <em>not</em>
            directly linked to the current RBA cash rate.
          </p>

          <h2 id="what-is-variable" className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is a Variable Rate Loan?</h2>
          <p className="text-gray-600 mb-4">
            A variable rate loan has an interest rate that can change over the life of the loan.
            The most common driver of variable rate changes in Australia is the RBA&apos;s monthly
            cash rate decision — when the RBA raises or lowers the cash rate, most lenders pass
            on the change (in full or in part) to their variable rate borrowers.
          </p>
          <p className="text-gray-600 mb-4">
            Variable rates are the &quot;default&quot; loan type in Australia. The majority of Australian
            mortgage holders have variable rate loans, and the variable rate market is highly
            competitive — meaning variable rates can be significantly lower than fixed rates
            when lenders are competing for business.
          </p>

          <h2 id="pros-cons-fixed" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Pros and Cons of Fixed Rates</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-green-800 mb-2">Advantages of fixing</p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>Certainty of repayments — easy to budget</li>
                <li>Protection if rates rise during the fixed period</li>
                <li>Peace of mind — no monthly RBA anxiety</li>
                <li>Can lock in a low rate if you believe rates will rise</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-800 mb-2">Disadvantages of fixing</p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>Break costs can be very large if you need to exit early</li>
                <li>Cannot benefit if rates fall during the fixed period</li>
                <li>Most fixed loans limit or prohibit extra repayments</li>
                <li>Offset accounts generally not available on fixed loans</li>
                <li>May revert to a high standard variable rate at expiry</li>
              </ul>
            </div>
          </div>

          <p className="text-gray-600 mb-4">
            The limitations on extra repayments and offset accounts are particularly significant
            for Australian borrowers who actively use offset accounts as a cash management tool.
            If you keep significant savings in an offset account to reduce your effective interest
            cost, a fixed loan may not suit your structure at all.
          </p>

          <h2 id="pros-cons-variable" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Pros and Cons of Variable Rates</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-green-800 mb-2">Advantages of variable</p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>Benefit immediately when rates fall</li>
                <li>Offset account typically available — powerful cash management tool</li>
                <li>Make unlimited extra repayments without penalty</li>
                <li>No break costs — can sell or refinance freely</li>
                <li>More competitive rates in many market conditions</li>
                <li>Redraw facility usually available</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-800 mb-2">Disadvantages of variable</p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>Repayments can rise if rates increase</li>
                <li>Budget uncertainty — harder to plan long-term</li>
                <li>Psychological stress in a rising rate environment</li>
              </ul>
            </div>
          </div>

          <p className="text-gray-600 mb-4">
            The offset account advantage of variable loans is significant for many borrowers.
            An <strong>offset account</strong> is a linked transaction account where the balance
            offsets against your loan balance for interest calculation purposes. If you have
            a $600,000 loan and $50,000 in an offset account, you only pay interest on
            $550,000 — effectively earning your mortgage rate on your savings, which is
            considerably better than a savings account in most rate environments.
          </p>

          <h2 id="split-loans" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Split Loans: The Best of Both Worlds?</h2>
          <p className="text-gray-600 mb-4">
            A <strong>split loan</strong> divides your mortgage into two portions: one fixed
            and one variable. This is the most common approach for borrowers who want rate
            certainty on part of their loan while maintaining flexibility on the rest.
          </p>
          <p className="text-gray-600 mb-4">
            Example: On a $700,000 loan, you might fix $400,000 at 5.89% for 3 years and
            keep $300,000 on a variable rate with full offset capability. This approach:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Locks in certainty on the majority of your loan</li>
            <li>Maintains the offset account benefit on the variable portion</li>
            <li>Allows extra repayments on the variable portion without penalty</li>
            <li>Reduces (but does not eliminate) the impact of rate movements in either direction</li>
          </ul>
          <p className="text-gray-600 mb-4">
            The split can be in any proportion — it does not need to be 50/50. Your mortgage
            broker can help you determine the right split based on your savings levels, income
            certainty, and financial strategy.
          </p>

          <h2 id="rba-context" className="text-2xl font-bold text-gray-900 mt-8 mb-4">The RBA Rate Environment in 2026</h2>
          <p className="text-gray-600 mb-4">
            The choice between fixed and variable rates is heavily influenced by the current
            and expected RBA rate environment.
          </p>
          <p className="text-gray-600 mb-4">
            General principles:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>In a rising rate environment:</strong> Fixing locks in the current lower
              rate and protects you from further increases. Variable borrowers face increasing
              repayments as the RBA raises rates.
            </li>
            <li>
              <strong>In a falling rate environment:</strong> Variable rate borrowers immediately
              benefit from RBA cuts. Fixed rate borrowers are locked out of the cuts and can end
              up paying above-market rates.
            </li>
            <li>
              <strong>At the top of a rate cycle:</strong> Fixing can capture the peak variable
              rate before the cycle turns — but timing this precisely is very difficult, even for
              professional economists.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            As of April 2026, the RBA has moved through a significant rate hiking cycle (2022–2023)
            and has subsequently begun reducing the cash rate. In a rate-cutting environment,
            variable rates have generally performed better than fixed rates — as variable borrowers
            benefit from each RBA cut while fixed borrowers remain locked to their prior rate.
          </p>
          <p className="text-gray-600 mb-4">
            The key question for 2026 is: are we in the middle of a rate-cutting cycle, or near
            the bottom? If rates are expected to fall further, variable is likely the better
            choice. If rates are expected to stabilise or rise again, fixing provides security.
            No one can predict this with certainty — including the RBA.
          </p>

          <h2 id="break-costs" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Break Costs: The Hidden Danger of Fixed Rates</h2>
          <p className="text-gray-600 mb-4">
            Break costs (also called early repayment costs or economic costs) are fees charged
            by lenders when a fixed rate loan is broken before the end of the fixed period.
            They can be shockingly large — sometimes tens of thousands of dollars — and catch
            many borrowers off guard.
          </p>
          <p className="text-gray-600 mb-4">
            <strong>When break costs are triggered:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Selling the property during the fixed period</li>
            <li>Refinancing to a different lender during the fixed period</li>
            <li>Paying out the loan in full before the fixed term ends</li>
            <li>Switching from fixed to variable during the fixed period</li>
          </ul>
          <p className="text-gray-600 mb-4">
            <strong>How break costs are calculated:</strong>
          </p>
          <p className="text-gray-600 mb-4">
            The calculation method varies by lender but is generally based on the &quot;economic cost&quot;
            to the lender of unwinding the fixed rate position. In simple terms, if you fix at
            a higher rate and rates subsequently fall, the lender can re-lend that money at a
            lower rate — and you compensate them for the difference.
          </p>
          <p className="text-gray-600 mb-4">
            Formula (simplified):
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200 text-sm font-mono text-gray-700">
            Break cost ≈ (Fixed rate − Current wholesale rate) × Loan balance × Remaining term in years
          </div>
          <p className="text-gray-600 mb-4">
            Example: If you fixed at 6.5%, rates have since fallen and the current wholesale
            rate for the remaining 18-month term is 5.0%, and you have $500,000 remaining —
            the break cost could be approximately:
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200 text-sm text-gray-700">
            (6.5% − 5.0%) × $500,000 × 1.5 years = <strong>$11,250</strong>
          </div>
          <p className="text-gray-600 mb-4">
            In practice, the exact calculation is more complex. Always ask your lender for a
            break cost estimate <em>before</em> committing to break a fixed loan.
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Important:</strong> If rates have risen since you fixed (i.e. your fixed rate
            is now below the market), break costs may be zero or minimal — because there is no
            economic cost to the lender.
          </p>

          <h2 id="questions" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Questions to Ask Before Fixing Your Rate</h2>
          <p className="text-gray-600 mb-4">
            Before committing to a fixed rate, consider:
          </p>

          <div className="space-y-3 mb-6">
            {[
              { q: "Are you planning to sell the property during the fixed period?", a: "If there is any possibility you might sell, weigh the break cost risk carefully. Selling a $700,000 home mid-fixed-term could cost you $15,000+ in break costs on top of agent fees." },
              { q: "Do you need an offset account?", a: "If you keep significant savings (e.g. $50,000+) in an offset account, you may lose more from forgoing the offset benefit than you gain from rate certainty. Model the numbers with your broker." },
              { q: "Are you expecting a significant change in income?", a: "A large bonus, inheritance, or other windfall that you want to use to pay down the mortgage will likely incur break costs on a fixed loan. Variable allows unlimited extra repayments." },
              { q: "How confident are you about your rate outlook?", a: "Fixing is essentially a bet that rates will rise (or stay the same). Variable is a bet that rates will fall (or that you can absorb the uncertainty). How confident are you in your outlook?" },
              { q: "What happens at the end of the fixed term?", a: "Most lenders revert to a standard variable rate at expiry — which is often not competitive. Set a calendar reminder to review your loan 2–3 months before expiry." },
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="font-semibold text-gray-900 text-sm mb-1">{item.q}</p>
                <p className="text-sm text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Ready to crunch the numbers?</strong> Use our{" "}
              <Link href="/borrowing-power-calculator" className="underline hover:text-blue-900">borrowing power calculator</Link>{" "}
              to understand what you can afford, or browse{" "}
              <Link href="/buy" className="underline hover:text-blue-900">properties for sale</Link>{" "}
              to start your search.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/lenders-mortgage-insurance-guide" className="text-primary hover:underline">Lenders Mortgage Insurance (LMI) Guide</Link></li>
              <li><Link href="/guides/first-home-buyer-guide" className="text-primary hover:underline">First Home Buyer Guide Australia</Link></li>
              <li><Link href="/guides/buying-property-australia" className="text-primary hover:underline">Buying Property in Australia</Link></li>
              <li><Link href="/guides/negative-gearing-australia" className="text-primary hover:underline">Negative Gearing Guide</Link></li>
              <li><Link href="/guides/property-depreciation-guide" className="text-primary hover:underline">Property Depreciation Guide</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
