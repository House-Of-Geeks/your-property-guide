import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Property Auction Guide: How to Bid and Win at Auction in Australia (2026) | ${SITE_NAME}`,
  description:
    "Everything you need to know about buying at auction in Australia: how auctions work, bidding strategies, registration, finance, and what to do if the property passes in. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/property-auction-guide` },
  openGraph: {
    url: `${SITE_URL}/guides/property-auction-guide`,
    title: "Property Auction Guide: How to Bid and Win at Auction in Australia (2026)",
    description:
      "Everything you need to know about buying at auction in Australia: how auctions work, bidding strategies, registration, finance, and what to do if the property passes in. Updated 2026.",
    type: "article",
  },
};

export default function PropertyAuctionGuidePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Property Auction Guide", url: "/guides/property-auction-guide" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Property Auction Guide" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 9 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Property Auction Guide: How to Bid and Win at Auction in Australia (2026)
        </h1>

        {/* Critical warning */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-sm text-red-800">
          <strong>Critical:</strong> There is <strong>no cooling-off period</strong> when buying at
          auction in Australia. If you are the successful bidder, you are legally bound to complete
          the purchase. You must have your finance unconditionally approved and your building and
          pest inspections done <em>before</em> auction day.
        </div>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#how-auctions-work" className="hover:underline">How auctions work</a></li>
            <li><a href="#auction-day" className="hover:underline">Auction day: step by step</a></li>
            <li><a href="#reserve-price" className="hover:underline">Reserve price explained</a></li>
            <li><a href="#passed-in" className="hover:underline">What &quot;passed in&quot; means</a></li>
            <li><a href="#finance" className="hover:underline">Finance before auction (critical)</a></li>
            <li><a href="#due-diligence" className="hover:underline">Due diligence before auction</a></li>
            <li><a href="#registration" className="hover:underline">Registration requirements by state</a></li>
            <li><a href="#bidding-strategies" className="hover:underline">Bidding strategies</a></li>
            <li><a href="#vendor-bid" className="hover:underline">Vendor bids explained</a></li>
            <li><a href="#after-auction" className="hover:underline">Buying after auction</a></li>
            <li><a href="#buyers-agent" className="hover:underline">Using a buyer&apos;s agent at auction</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="how-auctions-work" className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Auctions Work</h2>
          <p className="text-gray-600 mb-4">
            An auction is a public sale where registered bidders compete in real time to purchase a
            property. The auctioneer runs the process, calling for bids and announcing when the
            highest bid reaches the vendor&apos;s <em>reserve price</em> — the minimum price the vendor
            is willing to accept.
          </p>
          <p className="text-gray-600 mb-4">
            When the reserve price is met or exceeded, the property is &quot;on the market&quot; — meaning
            the auctioneer will sell to the highest bidder. The winning bidder exchanges contracts
            unconditionally and pays the deposit (usually 10%) on the spot.
          </p>
          <p className="text-gray-600 mb-4">
            Auctions are most common in Sydney and Melbourne, where they account for a significant
            portion of sales. They are less common in Queensland, WA, and SA, where private treaty
            is more prevalent.
          </p>

          <h2 id="auction-day" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Auction Day: Step by Step</h2>
          <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-3">
            <li>
              <strong>Arrive early.</strong> Registration usually opens 30 minutes before the auction.
              Bring photo ID and any documents required by the agent for bidder registration.
            </li>
            <li>
              <strong>Register as a bidder.</strong> You must register to bid. In some states this
              is mandatory by law; in others it&apos;s standard practice. You will receive a bidder number.
            </li>
            <li>
              <strong>The auctioneer opens the auction.</strong> They will announce the property,
              confirm it is for sale, and call for opening bids.
            </li>
            <li>
              <strong>Bidding commences.</strong> Bids are made verbally or by raising your number.
              The auctioneer will announce each bid and call for higher offers.
            </li>
            <li>
              <strong>The auctioneer may consult with the vendor.</strong> If bidding stalls below
              the reserve, the auctioneer may pause to speak with the vendor (who may lower their
              reserve or elect to pass in).
            </li>
            <li>
              <strong>Property goes &quot;on the market.&quot;</strong> Once the reserve is met, the
              auctioneer declares the property is &quot;on the market.&quot; The next successful bid wins.
            </li>
            <li>
              <strong>Hammer falls.</strong> The auctioneer calls &quot;going once, going twice, sold&quot;
              (or similar), and the property is sold unconditionally to the highest bidder.
            </li>
            <li>
              <strong>Sign contracts and pay the deposit.</strong> The successful bidder signs the
              contract of sale immediately and pays the deposit (typically 10% by cheque or bank
              transfer). The sale is binding from this point.
            </li>
          </ol>

          <h2 id="reserve-price" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Reserve Price Explained</h2>
          <p className="text-gray-600 mb-4">
            The <strong>reserve price</strong> is the minimum price the vendor is willing to accept
            for the property. It is set confidentially before the auction and is not disclosed to
            buyers.
          </p>
          <p className="text-gray-600 mb-4">
            The agent&apos;s pre-auction <em>price guide</em> is not the reserve — it is an indication
            of expected bidding range. Price guides must be genuinely representative of the vendor&apos;s
            expectations and cannot legally be set artificially low to attract more bidders.
          </p>
          <p className="text-gray-600 mb-4">
            A property cannot be sold at auction for less than the reserve price. If bidding does
            not reach the reserve, the property is &quot;passed in.&quot;
          </p>

          <h2 id="passed-in" className="text-2xl font-bold text-gray-900 mt-8 mb-4">What &quot;Passed In&quot; Means</h2>
          <p className="text-gray-600 mb-4">
            A property is &quot;passed in&quot; when bidding does not reach the vendor&apos;s reserve price by
            the end of the auction. This is not a failed sale — it is the start of post-auction
            negotiations.
          </p>
          <p className="text-gray-600 mb-4">
            When a property is passed in:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              The highest bidder at auction is typically given the <strong>first right to
              negotiate</strong> with the vendor privately after the auction.
            </li>
            <li>
              There is often more room to negotiate a lower price post-auction, as the vendor
              has not been able to achieve their reserve.
            </li>
            <li>
              If the highest bidder cannot reach a deal, the agent can negotiate with other
              interested parties.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Important: if you buy a property after it is passed in (on the same day), <strong>there
            is still no cooling-off period</strong> in some states (e.g. NSW). Check your state&apos;s
            rules. Contracts signed at auction or at the auction venue on auction day are generally
            unconditional.
          </p>

          <h2 id="finance" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Finance Before Auction (Critical)</h2>
          <p className="text-gray-600 mb-4">
            This cannot be overstated: <strong>you must have your finance arranged before bidding
            at auction</strong>. There is no &quot;subject to finance&quot; clause at auction.
          </p>
          <p className="text-gray-600 mb-4">
            Steps to take before bidding:
          </p>
          <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Get unconditional pre-approval</strong> (not just conditional pre-approval).
              This means the lender has assessed your full financial position and is ready to
              lend, subject only to a satisfactory valuation of the specific property.
            </li>
            <li>
              <strong>Request a valuation.</strong> Ask your lender to value the specific property
              before auction. If the bank values it lower than you bid, you may need to fund the
              gap with your own cash.
            </li>
            <li>
              <strong>Know your limit.</strong> Set a firm maximum bid based on your pre-approval
              and stick to it. Auction rooms can create emotional pressure — decide your limit in
              advance.
            </li>
          </ol>
          <p className="text-gray-600 mb-4">
            Use our{" "}
            <Link href="/borrowing-power-calculator" className="text-primary hover:underline">borrowing power calculator</Link>{" "}
            to estimate your capacity, and speak to a mortgage broker before attending any auction.
          </p>

          <h2 id="due-diligence" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Due Diligence Before Auction</h2>
          <p className="text-gray-600 mb-4">
            All due diligence must be completed before auction day:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Building and pest inspection:</strong> Commission an inspection before auction.
              Do not wait until after — you have no recourse if issues are discovered post-sale.
            </li>
            <li>
              <strong>Review the contract of sale:</strong> Have your conveyancer or solicitor review
              the vendor&apos;s contract and Section 32 (VIC) or equivalent before auction day. Clarify
              any unusual clauses.
            </li>
            <li>
              <strong>Title search:</strong> Your conveyancer will search the title for any
              encumbrances, easements, or caveats.
            </li>
            <li>
              <strong>Strata report (if applicable):</strong> For strata properties, obtain the
              strata inspection report to understand the financial health of the body corporate,
              upcoming levies, and any major works planned.
            </li>
            <li>
              <strong>Research comparable sales:</strong> Look at recent sales in the suburb to
              understand what a fair price looks like. Our{" "}
              <Link href="/research" className="text-primary hover:underline">suburb research tools</Link>{" "}
              can help.
            </li>
          </ul>

          <h2 id="registration" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Registration Requirements by State</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">State</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Registration Required?</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">What to Bring</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="p-3 border border-gray-200">NSW</td>
                  <td className="p-3 border border-gray-200">Yes (mandatory)</td>
                  <td className="p-3 border border-gray-200">Photo ID; sometimes proof of ability to pay deposit</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">VIC</td>
                  <td className="p-3 border border-gray-200">Yes (mandatory since 2014)</td>
                  <td className="p-3 border border-gray-200">Photo ID; complete bidder registration form</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">QLD</td>
                  <td className="p-3 border border-gray-200">Yes (standard practice)</td>
                  <td className="p-3 border border-gray-200">Photo ID</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">WA</td>
                  <td className="p-3 border border-gray-200">Standard practice</td>
                  <td className="p-3 border border-gray-200">Photo ID</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">SA</td>
                  <td className="p-3 border border-gray-200">Standard practice</td>
                  <td className="p-3 border border-gray-200">Photo ID</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 mb-4">
            Always check with the agent for specific requirements before auction day.
          </p>

          <h2 id="bidding-strategies" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bidding Strategies</h2>
          <p className="text-gray-600 mb-4">
            How you bid can influence the outcome. Some approaches used by experienced buyers:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-3">
            <li>
              <strong>Open with a strong bid.</strong> Opening with a confident, specific bid (e.g.
              $851,000 rather than $850,000) signals seriousness and can unsettle nervous competitors.
              It may discourage first-time bidders who were only willing to bid up incrementally.
            </li>
            <li>
              <strong>Bid in non-round numbers.</strong> Bidding $932,500 instead of $930,000 can
              confuse the rhythm of the auction and suggests you have thought carefully about your
              maximum — often making opponents wonder whether you have more headroom.
            </li>
            <li>
              <strong>Bid quickly and confidently.</strong> Hesitation signals uncertainty. Responding
              quickly to counter-bids puts psychological pressure on other bidders.
            </li>
            <li>
              <strong>Know your absolute maximum and stick to it.</strong> The auctioneer will
              encourage higher bids — it is their job. Set your limit with your head, not in the
              emotion of the room.
            </li>
            <li>
              <strong>Watch, don&apos;t just bid.</strong> Before joining in, observe other bidders
              for body language cues. Hesitation from a competitor may mean they are near their limit.
            </li>
          </ul>

          <h2 id="vendor-bid" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Vendor Bids Explained</h2>
          <p className="text-gray-600 mb-4">
            A <strong>vendor bid</strong> is a bid made by the auctioneer on behalf of the vendor
            to help progress the auction toward the reserve price. It is legal and must be
            announced clearly by the auctioneer (e.g. &quot;I have a vendor bid at $720,000&quot;).
          </p>
          <p className="text-gray-600 mb-4">
            Key things to know about vendor bids:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>The auctioneer is bidding on behalf of the vendor — not a genuine buyer</li>
            <li>A vendor bid cannot be the winning bid — the property cannot be &quot;sold&quot; to the vendor</li>
            <li>Vendor bids are capped at one per property in some states</li>
            <li>The property is only &quot;on the market&quot; when a genuine bidder exceeds the reserve</li>
          </ul>

          <h2 id="after-auction" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Buying After Auction</h2>
          <p className="text-gray-600 mb-4">
            If a property is passed in and negotiations on auction day are unsuccessful, the property
            moves to private sale. At this point:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              A <strong>cooling-off period may apply</strong> (depending on the state and the timing
              of signing). In NSW, contracts signed after midnight of auction day typically attract
              a cooling-off period.
            </li>
            <li>
              You may be able to include conditions (subject to finance or building inspection) in
              the contract — ask your conveyancer.
            </li>
            <li>
              The vendor may be more flexible on price, given the auction did not meet their reserve.
            </li>
          </ul>

          <h2 id="buyers-agent" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Using a Buyer&apos;s Agent at Auction</h2>
          <p className="text-gray-600 mb-4">
            A licensed buyer&apos;s agent can attend and bid at auction on your behalf. Benefits include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Removes the emotional component of bidding</li>
            <li>Experienced in auction dynamics and strategy</li>
            <li>Can help you set a realistic reserve and market price range beforehand</li>
            <li>Useful if you cannot attend in person (e.g. interstate buyer)</li>
          </ul>
          <p className="text-gray-600 mb-4">
            If using a buyer&apos;s agent, ensure they are licensed in the relevant state and provide
            written authority before auction day.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Looking for properties going to auction?</strong>{" "}
              <Link href="/buy" className="underline hover:text-blue-900">Browse listings</Link>{" "}
              and filter by auction date, or use our{" "}
              <Link href="/borrowing-power-calculator" className="underline hover:text-blue-900">borrowing power calculator</Link>{" "}
              to know your limit before bidding day.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/buying-property-australia" className="text-primary hover:underline">How to Buy Property in Australia</Link></li>
              <li><Link href="/guides/building-pest-inspection" className="text-primary hover:underline">Building &amp; Pest Inspection Guide</Link></li>
              <li><Link href="/guides/conveyancing-guide" className="text-primary hover:underline">Conveyancing Guide</Link></li>
              <li><Link href="/guides/real-estate-agent-fees-australia" className="text-primary hover:underline">Real Estate Agent Fees</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
