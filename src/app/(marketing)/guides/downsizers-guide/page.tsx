import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Downsizer's Guide to Property in Australia: Super Contributions & Concessions (2026) | ${SITE_NAME}`,
  description:
    "Complete guide for Australian property downsizers. Downsizer super contribution ($300k per person), stamp duty concessions, over-55 communities, retirement villages, CGT main residence exemption, and Centrelink implications. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/downsizers-guide` },
  openGraph: {
    url: `${SITE_URL}/guides/downsizers-guide`,
    title: "Downsizer's Guide to Property in Australia: Super Contributions & Concessions (2026)",
    description:
      "Complete guide for Australian property downsizers. Downsizer super contribution ($300k per person), stamp duty concessions, over-55 communities, retirement villages, CGT main residence exemption, and Centrelink implications. Updated 2026.",
    type: "article",
  },
};

export default function DownsizersGuidePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Downsizer's Guide", url: "/guides/downsizers-guide" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Downsizer's Guide" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 7 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Downsizer&apos;s Guide to Property in Australia: Super Contributions &amp; Concessions (2026)
        </h1>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Disclaimer:</strong> This guide provides general information only and is not
          financial, tax, or legal advice. Superannuation, Centrelink, and taxation rules are
          complex and change regularly. Always seek advice from a licensed financial adviser
          and your accountant before making decisions. Always obtain independent legal advice
          before signing retirement village or lifestyle community contracts.
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#what-is-downsizing" className="hover:underline">What is downsizing?</a></li>
            <li><a href="#downsizer-super" className="hover:underline">Downsizer super contribution: up to $300,000 per person</a></li>
            <li><a href="#stamp-duty" className="hover:underline">Stamp duty concessions for downsizers</a></li>
            <li><a href="#first-considerations" className="hover:underline">Key considerations before you downsize</a></li>
            <li><a href="#property-types" className="hover:underline">Popular property types for downsizers</a></li>
            <li><a href="#over-55" className="hover:underline">Over-55 communities and lifestyle villages</a></li>
            <li><a href="#retirement-villages" className="hover:underline">Retirement village contracts: what to watch</a></li>
            <li><a href="#cgt" className="hover:underline">CGT and the main residence exemption</a></li>
            <li><a href="#centrelink" className="hover:underline">Centrelink implications</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="what-is-downsizing" className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is Downsizing?</h2>
          <p className="text-gray-600 mb-4">
            Downsizing refers to selling a larger family home and moving to a smaller, more
            manageable property. For many Australians, the family home represents their largest
            financial asset — and downsizing can unlock significant capital at a stage of life
            when income may be reducing and retirement is approaching or underway.
          </p>
          <p className="text-gray-600 mb-4">
            Motivations for downsizing include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Reducing ongoing costs (rates, maintenance, insurance) of a large property</li>
            <li>Moving to a more accessible property better suited to ageing in place</li>
            <li>Relocating closer to family, healthcare services, or lifestyle amenities</li>
            <li>Freeing up capital to supplement retirement income or contribute to super</li>
            <li>Moving to a retirement community or over-55 lifestyle village</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Done well, downsizing can significantly improve financial security and quality of
            life in retirement. Done poorly — particularly with retirement village contracts —
            it can lock homeowners into unfavourable financial arrangements that are difficult
            or costly to reverse.
          </p>

          <h2 id="downsizer-super" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Downsizer Super Contribution: Up to $300,000 Per Person</h2>
          <p className="text-gray-600 mb-4">
            One of the most powerful financial benefits available to Australian downsizers is
            the <strong>Downsizer Super Contribution</strong>. This allows eligible Australians
            to contribute proceeds from the sale of their home into superannuation — outside
            the normal contribution caps.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-green-800 mb-2">Downsizer super contribution at a glance</p>
            <ul className="text-sm text-green-700 space-y-1">
              <li><strong>Maximum contribution:</strong> $300,000 per person ($600,000 per couple)</li>
              <li><strong>Age eligibility:</strong> 55 years or older</li>
              <li><strong>Property ownership requirement:</strong> Must have owned the home for 10+ years</li>
              <li><strong>Timing:</strong> Contribution must be made within 90 days of settlement</li>
              <li><strong>No work test:</strong> No work test applies (unlike other contribution types)</li>
              <li><strong>Super balance limit:</strong> No limit on existing super balance</li>
              <li><strong>Administered by:</strong> ATO — notify via ATO form before or when making the contribution</li>
            </ul>
          </div>

          <p className="text-gray-600 mb-4">
            The downsizer contribution is treated as a non-concessional contribution (after-tax)
            but is exempt from the standard $110,000/year non-concessional contribution cap.
            This makes it an exceptionally powerful super-boosting mechanism for older Australians
            who may have limited other ways to contribute to super.
          </p>
          <p className="text-gray-600 mb-4">
            Example: A couple aged 62 and 64 sell the family home for $1.2 million. They can
            each contribute $300,000 (total $600,000) into their respective super accounts.
            The contributions are taxed at just 15% (or 0% in pension phase) on future
            earnings — far more tax-effective than holding the same funds in their personal names.
          </p>
          <p className="text-gray-600 mb-4">
            Key eligibility rules:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Both people in a couple qualify:</strong> If the home is jointly owned or
              owned by one partner, both can contribute up to $300,000 each — provided both have
              lived in the home as their principal residence for at least 10 years.
            </li>
            <li>
              <strong>Only one downsizer contribution per person:</strong> You can only make
              a downsizer contribution once in your lifetime.
            </li>
            <li>
              <strong>The home must be in Australia.</strong>
            </li>
            <li>
              <strong>You cannot make the contribution if you have already made a downsizer
              contribution.</strong>
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            The 90-day rule is critical: the ATO form must be submitted and the contribution
            made within 90 days of receiving the sale proceeds. Missing this window means
            losing the opportunity for that specific property sale.
          </p>

          <h2 id="stamp-duty" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Stamp Duty Concessions for Downsizers</h2>
          <p className="text-gray-600 mb-4">
            Several states and territories offer stamp duty concessions for pensioners, seniors,
            or downsizers. These vary significantly by jurisdiction:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">State/Territory</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Pensioner/senior concession</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="p-3 border border-gray-200">NSW</td>
                  <td className="p-3 border border-gray-200">No specific senior/downsizer concession on stamp duty</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Victoria</td>
                  <td className="p-3 border border-gray-200">Pensioner exemption/concession up to 50% off (income and value limits apply)</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Queensland</td>
                  <td className="p-3 border border-gray-200">Home concession available; limited pensioner concession for eligible buyers</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Western Australia</td>
                  <td className="p-3 border border-gray-200">Senior, pensioner, and carer concession available (verify with RevWA)</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">South Australia</td>
                  <td className="p-3 border border-gray-200">No specific downsizer concession; verify with RevenueSA</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Tasmania</td>
                  <td className="p-3 border border-gray-200">Verify with SRO Tasmania</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">ACT</td>
                  <td className="p-3 border border-gray-200">Senior, pensioner, carer concession available; verify at revenue.act.gov.au</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Northern Territory</td>
                  <td className="p-3 border border-gray-200">Verify with Territory Revenue Office</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mb-4">
            Always verify current eligibility and amounts with the relevant state revenue
            authority before purchase, as thresholds and eligibility criteria change regularly.
          </p>

          <h2 id="first-considerations" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Considerations Before You Downsize</h2>
          <p className="text-gray-600 mb-4">
            Before committing to downsize, carefully consider:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Net proceeds after costs:</strong> Selling the family home involves agent
              commission (typically 1.5–2.5%), marketing costs, legal fees, moving costs, and
              potentially repairs or staging costs. Total selling costs can easily reach 3–5% of
              the sale price on a large property.
            </li>
            <li>
              <strong>Buying costs:</strong> Stamp duty, legal fees, removalist costs, and any
              renovation or fit-out of the new property add to the total.
            </li>
            <li>
              <strong>Lifestyle needs:</strong> Will the smaller property meet your needs for the
              next 10–20 years? Consider accessibility features, proximity to health services,
              social connections, and public transport.
            </li>
            <li>
              <strong>Aged care planning:</strong> If full aged care is a possibility in the
              medium term, the sale proceeds from the family home and subsequent property decisions
              will affect aged care means testing. Get specialist aged care financial advice.
            </li>
            <li>
              <strong>Emotional factors:</strong> Leaving the family home can be emotionally
              significant. Allow adequate time for the decision and involve family where appropriate.
            </li>
          </ul>

          <h2 id="property-types" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Popular Property Types for Downsizers</h2>
          <p className="text-gray-600 mb-4">
            Downsizers have a range of property options, each with different financial and
            lifestyle implications:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Apartments and units:</strong> Low maintenance, good security, often in
              desirable inner-city or coastal locations. Strata fees can be significant. Consider
              the lift situation and accessibility.
            </li>
            <li>
              <strong>Townhouses:</strong> A balance of house-like space without the large garden.
              Many are two-storey (check accessibility for future needs).
            </li>
            <li>
              <strong>Single-level homes:</strong> If remaining in the broader community, a smaller
              single-level house may offer the best combination of accessibility and space.
            </li>
            <li>
              <strong>Over-55 lifestyle communities:</strong> Purpose-designed communities offering
              independent living for active older Australians (see below).
            </li>
            <li>
              <strong>Retirement villages:</strong> Managed communities with on-site services,
              typically for those needing more support (see below).
            </li>
          </ul>

          <h2 id="over-55" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Over-55 Communities and Lifestyle Villages</h2>
          <p className="text-gray-600 mb-4">
            Over-55 (or land lease) communities are purpose-built for active, independent older
            Australians. They typically offer:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Modern, well-designed homes specifically for older residents</li>
            <li>Community facilities (pool, gym, clubhouse, bowls)</li>
            <li>A social community of similar-aged residents</li>
            <li>Lower purchase prices than surrounding residential property (because you typically pay for the home only, not the land — see below)</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Land lease vs title ownership</h3>
          <p className="text-gray-600 mb-4">
            Many over-55 communities operate on a <strong>land lease</strong> model: you purchase
            the home (dwelling) but lease the land from the operator, paying weekly or monthly site
            fees. This is fundamentally different to owning a freehold property.
          </p>
          <p className="text-gray-600 mb-4">
            Key considerations for land lease communities:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Site fees typically increase annually (often CPI-linked) and can become a significant ongoing cost</li>
            <li>The dwelling can be sold, but the buyer also inherits the land lease obligation</li>
            <li>Capital growth on the dwelling may be limited compared to freehold property</li>
            <li>Centrelink assessment of land lease arrangements differs from standard homeownership — seek advice</li>
          </ul>

          <h2 id="retirement-villages" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Retirement Village Contracts: What to Watch</h2>
          <p className="text-gray-600 mb-4">
            Retirement villages are not the same as over-55 lifestyle communities. They are more
            managed environments — often including meals, cleaning, and care services — and typically
            have far more complex contractual arrangements.
          </p>
          <p className="text-gray-600 mb-4">
            The most important financial concept to understand is the <strong>departure fee</strong>
            (also called a deferred management fee or DMF):
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>What it is:</strong> A fee payable to the retirement village operator when you
              leave — either on departure or death. It is typically calculated as a percentage of the
              entry price or sale price, accruing over the years you were in residence.
            </li>
            <li>
              <strong>How much:</strong> Departure fees of <strong>20–30% of the entry price</strong>
              are common. In some contracts, the fee continues to accrue until it reaches a cap
              (e.g. 30% after 10 years). This can significantly reduce the capital available to
              you or your estate.
            </li>
            <li>
              <strong>Capital gains:</strong> Many contracts allow the operator to retain all or part
              of any capital gain on the unit when it is resold — not the resident.
            </li>
            <li>
              <strong>Recurrent charges:</strong> Ongoing village fees (for maintenance, management,
              and services) are payable even if you are in hospital or temporarily absent.
            </li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800">
              <strong>Critical warning:</strong> Always obtain <strong>independent legal advice</strong>{" "}
              from a solicitor who specialises in retirement village contracts before signing
              anything. Do not rely on the village&apos;s own representatives or generic advice.
              The financial implications of a retirement village contract can be irreversible
              and long-lasting.
            </p>
          </div>

          <h2 id="cgt" className="text-2xl font-bold text-gray-900 mt-8 mb-4">CGT and the Main Residence Exemption</h2>
          <p className="text-gray-600 mb-4">
            For most Australian downsizers, the sale of the family home is a CGT-free event
            under the <strong>main residence exemption</strong>. The capital gain on your principal
            place of residence is generally fully exempt from capital gains tax.
          </p>
          <p className="text-gray-600 mb-4">
            Important exceptions and complexities:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>If part of the home was used for business or investment</strong> (e.g. you
              rented a room or ran a business from the property), a partial CGT liability may apply.
            </li>
            <li>
              <strong>Six-year rule:</strong> If you moved out of the family home and rented it
              for up to 6 years before selling, you may still be fully exempt under the absence rule.
            </li>
            <li>
              <strong>Foreign residents:</strong> Foreign residents for tax purposes are no longer
              eligible for the main residence exemption in most cases — seek specialist tax advice.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Consult your accountant to confirm your CGT position before selling, particularly if
            there has been any period of rental or business use.
          </p>

          <h2 id="centrelink" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Centrelink Implications</h2>
          <p className="text-gray-600 mb-4">
            Downsizing can have significant effects on Centrelink pension eligibility, primarily
            through the <strong>assets test</strong>. Key points:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>The family home is assets test exempt:</strong> Under Centrelink&apos;s assets test,
              the value of your principal residence does not count toward your assessable assets.
            </li>
            <li>
              <strong>Sale proceeds are assessable:</strong> When you sell and receive the proceeds,
              those funds immediately become assessable assets — potentially reducing or eliminating
              your Age Pension entitlement.
            </li>
            <li>
              <strong>A 24-month asset test exemption may apply:</strong> Centrelink provides a
              24-month assets test exemption on proceeds from selling the principal home if you
              intend to use the funds to purchase or build a new home. This exemption is time-limited
              and conditions apply.
            </li>
            <li>
              <strong>Downsizer contribution to super:</strong> Amounts contributed to super under
              the downsizer contribution scheme are subject to the deeming rules for Centrelink
              purposes — they don&apos;t &quot;disappear&quot; from the assets test.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Centrelink rules are complex and interact with each other in non-obvious ways. If you
            currently receive (or are approaching eligibility for) the Age Pension, seek
            specialist Centrelink/aged care financial advice before completing a sale.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Ready to explore?</strong> Browse{" "}
              <Link href="/buy" className="underline hover:text-blue-900">apartments, townhouses, and lifestyle properties</Link>{" "}
              or use our{" "}
              <Link href="/borrowing-power-calculator" className="underline hover:text-blue-900">borrowing power calculator</Link>{" "}
              to plan your next move.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/buying-property-australia" className="text-primary hover:underline">Buying Property in Australia</Link></li>
              <li><Link href="/guides/conveyancing-guide" className="text-primary hover:underline">Conveyancing Guide</Link></li>
              <li><Link href="/guides/smsf-property-guide" className="text-primary hover:underline">SMSF Property Guide</Link></li>
              <li><Link href="/guides/lenders-mortgage-insurance-guide" className="text-primary hover:underline">Lenders Mortgage Insurance (LMI) Guide</Link></li>
              <li><Link href="/guides/real-estate-agent-fees-australia" className="text-primary hover:underline">Real Estate Agent Fees</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
