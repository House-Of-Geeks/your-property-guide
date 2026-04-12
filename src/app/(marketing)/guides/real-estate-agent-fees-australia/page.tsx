import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Real Estate Agent Fees & Commission Rates in Australia (2026) | ${SITE_NAME}`,
  description:
    "What do real estate agents charge in Australia? Commission rates by state, what's included, marketing costs, and how to negotiate. Updated for 2026.",
  alternates: { canonical: `${SITE_URL}/guides/real-estate-agent-fees-australia` },
  openGraph: {
    url: `${SITE_URL}/guides/real-estate-agent-fees-australia`,
    title: "Real Estate Agent Fees & Commission Rates in Australia (2026)",
    description:
      "What do real estate agents charge in Australia? Commission rates by state, what's included, marketing costs, and how to negotiate. Updated for 2026.",
    type: "article",
  },
};

export default function RealEstateAgentFeesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Real Estate Agent Fees Australia", url: "/guides/real-estate-agent-fees-australia" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Real Estate Agent Fees Australia" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 8 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Real Estate Agent Fees &amp; Commission Rates in Australia (2026)
        </h1>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Note:</strong> Commission rates vary significantly by agent, location, and property
          type. The rates below are indicative ranges only. Always get quotes from at least 3 agents
          before signing an agency agreement.
        </div>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#how-commission-works" className="hover:underline">How real estate commission works</a></li>
            <li><a href="#rates-by-state" className="hover:underline">Commission rates by state</a></li>
            <li><a href="#whats-included" className="hover:underline">What&apos;s included in commission</a></li>
            <li><a href="#marketing-costs" className="hover:underline">Marketing costs (charged separately)</a></li>
            <li><a href="#fixed-fee" className="hover:underline">Fixed fee vs commission</a></li>
            <li><a href="#negotiate" className="hover:underline">How to negotiate agent fees</a></li>
            <li><a href="#cheapest-agent" className="hover:underline">The risk of choosing the cheapest agent</a></li>
            <li><a href="#questions" className="hover:underline">Questions to ask before signing</a></li>
            <li><a href="#agency-agreement" className="hover:underline">Understanding the agency agreement</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="how-commission-works" className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Real Estate Commission Works</h2>
          <p className="text-gray-600 mb-4">
            When you sell a property through a real estate agent in Australia, you pay the agent a
            <strong> commission</strong> — a percentage of the final sale price. Commission is only
            payable if the property sells (typically at settlement), so agents are incentivised to
            achieve the best possible price.
          </p>
          <p className="text-gray-600 mb-4">
            Commission is not a fixed dollar amount — it scales with the sale price. On a $900,000
            home sold at a 2% commission rate, the agent earns $18,000. On a $1.5 million property,
            that&apos;s $30,000.
          </p>
          <p className="text-gray-600 mb-4">
            In Australia, agent commissions are <strong>negotiable</strong>. There is no legislated
            minimum or maximum. Some agencies use tiered structures (e.g. 2.5% on the first $300,000
            and 1.5% on the remainder), which can be worth negotiating on higher-value properties.
          </p>
          <p className="text-gray-600 mb-4">
            Commission is typically paid at settlement from the sale proceeds — you don&apos;t need to pay
            upfront.
          </p>

          <h2 id="rates-by-state" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Commission Rates by State (Typical Ranges, 2026)</h2>
          <p className="text-gray-600 mb-4">
            Commission rates vary significantly by state, suburb, and property type. Premium suburbs
            in capital cities often attract lower percentage rates because agents compete more aggressively
            for high-value listings. Regional areas may have higher rates.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">State</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Typical Range</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Average</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">NSW</td>
                  <td className="p-3 border border-gray-200">1.5% – 3.0%</td>
                  <td className="p-3 border border-gray-200">~2.0%</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">VIC</td>
                  <td className="p-3 border border-gray-200">1.6% – 2.5%</td>
                  <td className="p-3 border border-gray-200">~2.0%</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">QLD</td>
                  <td className="p-3 border border-gray-200">2.0% – 3.5%</td>
                  <td className="p-3 border border-gray-200">~2.5%</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">WA</td>
                  <td className="p-3 border border-gray-200">2.5% – 3.5%</td>
                  <td className="p-3 border border-gray-200">~3.0%</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">SA</td>
                  <td className="p-3 border border-gray-200">1.5% – 2.5%</td>
                  <td className="p-3 border border-gray-200">~2.0%</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">TAS</td>
                  <td className="p-3 border border-gray-200">2.0% – 3.0%</td>
                  <td className="p-3 border border-gray-200">~2.5%</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">NT</td>
                  <td className="p-3 border border-gray-200">2.5% – 4.0%</td>
                  <td className="p-3 border border-gray-200">~3.0%</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">ACT</td>
                  <td className="p-3 border border-gray-200">1.5% – 2.5%</td>
                  <td className="p-3 border border-gray-200">~2.0%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mb-4">
            <strong>Important:</strong> These are indicative ranges only. High-value properties (above
            $2M) often achieve lower percentage rates — sometimes below 1.5% — because the absolute
            dollar value of commission is high. Always negotiate.
          </p>

          <h2 id="whats-included" className="text-2xl font-bold text-gray-900 mt-8 mb-4">What&apos;s Included in Commission</h2>
          <p className="text-gray-600 mb-4">
            A full-service real estate commission typically includes:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Appraisal and pricing strategy:</strong> The agent assesses your property and
              recommends a price range or reserve.
            </li>
            <li>
              <strong>Property preparation advice:</strong> Guidance on presentation, styling, or
              minor repairs that could improve sale price.
            </li>
            <li>
              <strong>Open homes and private inspections:</strong> The agent hosts all inspections
              and qualifies buyers.
            </li>
            <li>
              <strong>Negotiation:</strong> The agent negotiates on your behalf with buyers,
              working to achieve the best possible price and terms.
            </li>
            <li>
              <strong>Contract coordination:</strong> Working with your conveyancer/solicitor to
              manage the sales process through to exchange and settlement.
            </li>
            <li>
              <strong>Communication:</strong> Regular updates on buyer feedback, inspection numbers,
              and market activity.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Commission does <em>not</em> typically include marketing costs (photography, online
            listings, signboards) — these are almost always charged separately.
          </p>

          <h2 id="marketing-costs" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Marketing Costs — Charged Separately</h2>
          <p className="text-gray-600 mb-4">
            Marketing is one of the most significant additional costs of selling. Expect to pay:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Photography &amp; video:</strong> $500 – $1,500 for professional photos;
              $1,500 – $4,000 for video and aerial drone shots.
            </li>
            <li>
              <strong>Floor plan:</strong> $200 – $500.
            </li>
            <li>
              <strong>Online listings (REA / Domain):</strong> $800 – $2,000+ depending on the
              package and listing prominence. Premium listings on realestate.com.au can cost over
              $2,000 in competitive markets.
            </li>
            <li>
              <strong>Signboard:</strong> $200 – $600 for a standard board; more for illuminated or
              custom boards.
            </li>
            <li>
              <strong>Social media and digital ads:</strong> $300 – $1,000+ depending on reach and
              targeting.
            </li>
            <li>
              <strong>Property styling / staging:</strong> $2,000 – $8,000+ if using a professional
              stylist (optional, but can significantly improve sale price).
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            For an average family home, expect total marketing costs of $3,000 – $6,000. In premium
            markets, campaigns can easily exceed $10,000.
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Key point:</strong> Marketing costs are usually payable whether or not the property
            sells. Confirm this before signing.
          </p>

          <h2 id="fixed-fee" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Fixed Fee vs Commission</h2>
          <p className="text-gray-600 mb-4">
            Some agencies — particularly online or hybrid operators — offer a flat fee to sell your
            property rather than a percentage commission. Typical flat fees range from $3,000 to
            $10,000 depending on the service level.
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Advantages of fixed fee:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-2 space-y-1 text-sm">
            <li>Predictable cost upfront</li>
            <li>Significant savings on high-value properties</li>
          </ul>
          <p className="text-gray-600 mb-4">
            <strong>Disadvantages of fixed fee:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Agent has less financial incentive to negotiate hard for you</li>
            <li>Service levels may be reduced (fewer open homes, less negotiation support)</li>
            <li>Often best suited to straightforward properties in strong markets where buyer demand is high</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Fixed fee models can work well in a sellers&apos; market. In a slower market where active
            negotiation is critical, a full-commission agent may achieve a higher price that more
            than covers the fee difference.
          </p>

          <h2 id="negotiate" className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Negotiate Agent Fees</h2>
          <p className="text-gray-600 mb-4">
            Most vendors don&apos;t realise agent fees are negotiable — but they almost always are. Here&apos;s
            how to negotiate effectively:
          </p>
          <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-3">
            <li>
              <strong>Interview at least 3 agents.</strong> Getting competing quotes gives you
              leverage and information. Don&apos;t just accept the first number you&apos;re given.
            </li>
            <li>
              <strong>Compare the full package.</strong> Don&apos;t compare commission rates alone —
              compare marketing packages, proposed listing prices, and track records in your suburb.
            </li>
            <li>
              <strong>Ask about a performance clause.</strong> Some agents will agree to a tiered
              commission that rewards them more if they achieve above a set price threshold. This
              aligns their incentives with yours.
            </li>
            <li>
              <strong>Don&apos;t over-negotiate on commission.</strong> Shaving 0.2% off commission on
              a $700,000 property saves $1,400. If the better agent achieves $15,000 more at
              auction, it&apos;s not worth the saving. Focus on who you think will get you the best price.
            </li>
            <li>
              <strong>Ask what happens if it doesn&apos;t sell.</strong> Understand any conditions in the
              agency agreement about what happens if the property is passed in or withdrawn.
            </li>
          </ol>

          <h2 id="cheapest-agent" className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Risk of Choosing the Cheapest Agent</h2>
          <p className="text-gray-600 mb-4">
            Your property is likely your largest asset. Choosing an agent solely based on the
            lowest commission can be a costly mistake. Consider:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              An agent who negotiates an extra $20,000 on a sale earns back their commission many
              times over — even if their rate is slightly higher than competitors.
            </li>
            <li>
              A low-commission agent who is juggling 50 listings may not give your property the
              attention it deserves.
            </li>
            <li>
              Poor photography, weak marketing, or a low-energy campaign can cost you more in
              foregone sale price than you saved in commission.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Ask to see recent sales results in your specific suburb, check online reviews, and ask
            for references from recent vendors.
          </p>

          <h2 id="questions" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Questions to Ask Before Signing an Agency Agreement</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>What is your proposed sale price range, and how did you arrive at it?</li>
            <li>What commission rate and marketing package are you proposing?</li>
            <li>What is your average days-on-market for properties in this suburb?</li>
            <li>How many properties are you currently managing? (Too many may mean less attention)</li>
            <li>How will you run the campaign — auction, private treaty, or expressions of interest?</li>
            <li>Who specifically will be handling my property day-to-day?</li>
            <li>What happens if I want to withdraw the property from sale?</li>
            <li>What are your fees if the property doesn&apos;t sell?</li>
          </ul>

          <h2 id="agency-agreement" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Understanding the Agency Agreement</h2>
          <p className="text-gray-600 mb-4">
            The agency agreement is a legally binding contract between you and the agent. Key things
            to check:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Exclusive vs open listing:</strong> An exclusive agency agreement means only
              that agent can sell the property during the term. An open listing allows multiple agents
              to market the property. Exclusive agreements are the norm for auction campaigns.
            </li>
            <li>
              <strong>Duration:</strong> Most exclusive agreements run for 60–90 days. Be cautious
              about signing for more than 90 days without a strong reason.
            </li>
            <li>
              <strong>Cooling off period:</strong> In most states, you have a short cooling-off period
              (often 1–3 days) after signing an agency agreement to cancel without penalty. Check
              your state&apos;s rules.
            </li>
            <li>
              <strong>Commission trigger:</strong> Understand exactly when commission is payable —
              usually on unconditional exchange or settlement.
            </li>
            <li>
              <strong>Conjunctional sales:</strong> Some agreements allow the listing agent to
              &quot;conjunct&quot; with another agent. Understand how commission is shared in this case.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Always read the full agreement before signing, and ask your conveyancer or solicitor to
            review it if you have any concerns.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Selling a property?</strong>{" "}
              <Link href="/agents" className="underline hover:text-blue-900">Find top-rated agents</Link>{" "}
              in your suburb on Your Property Guide, or use our{" "}
              <Link href="/stamp-duty-calculator" className="underline hover:text-blue-900">stamp duty calculator</Link>{" "}
              to understand the full costs of buying and selling.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/buying-property-australia" className="text-primary hover:underline">How to Buy Property in Australia</Link></li>
              <li><Link href="/guides/conveyancing-guide" className="text-primary hover:underline">Conveyancing in Australia</Link></li>
              <li><Link href="/guides/property-auction-guide" className="text-primary hover:underline">Property Auction Guide</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
