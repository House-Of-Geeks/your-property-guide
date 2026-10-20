import Link from "next/link";
import type { Chapter } from "../types";
import { Ch, Stat, TableWrap } from "../parts";

export const chapter: Chapter = {
  guide: "selling",
  number: 3,
  step: "Understand your costs",
  standfirst:
    "The figure that matters is what you walk away with, not the sale price. Most sellers budget for commission and overlook the rest, and on a typical sale the rest runs to five figures. Here is every line item.",
  callout:
    "Experienced sellers cost the sale before it starts. They write down every line item, agree what each one is for, and plan from the net figure rather than the price. It takes an evening with a calculator, and it makes every later conversation about fees and marketing clearer.",
  checklist: [
    "Get every quoted commission rate in writing, including GST",
    "List the marketing line by line and ask who pays if the home doesn’t sell",
    "Add conveyancing, styling, repairs and lender discharge fees",
    "Ask your lender about break costs if you’re on a fixed rate",
    "If the property was ever an investment, see an accountant about CGT before you list",
  ],
  cta: {
    kind: "tool",
    title: "Run your own numbers",
    body: "Commission, marketing, legals and your mortgage payout for your state, and what you’ll walk away with.",
    label: "Open the selling costs calculator",
    href: "/selling-costs-calculator?from=selling-guide-ch3",
  },
  checked: "Commission ranges and costs are typical as at mid-2026.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        Cost the sale before it starts, so you know what each item buys and what you’ll keep. Do this now, before an agent quotes
        you, and you can discuss the fee and the marketing knowing what’s typical, rather than hearing the figures for the first
        time.
      </p>

      <h2>Agent commission</h2>
      <p>
        Commission is the big one, and it is entirely negotiable. There are no set rates anywhere in Australia. As a rule, commission
        runs lower where prices are high and competition between agencies is fierce (inner Sydney and Melbourne) and higher where
        prices are lower or markets are thin (regional and remote areas). The figures below are typical ranges as at mid-2026; your
        suburb will have its own going rate, which any agent will tell you if asked directly.
      </p>
      <TableWrap>
        <table>
          <thead>
            <tr><th>State / territory</th><th>Typical commission range</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr><td>NSW</td><td>1.8% - 2.5% (Sydney)<br />2.5% - 3.5% (regional)</td><td>Among the lowest metro rates in the country</td></tr>
            <tr><td>Victoria</td><td>1.6% - 2.5% (Melbourne)<br />2.5% - 3.5% (regional)</td><td>Heavy agency competition keeps Melbourne rates down</td></tr>
            <tr><td>Queensland</td><td>2.0% - 3.0% (SEQ)<br />2.5% - 3.5% (regional)</td><td>The old capped rate is long gone; everything is negotiable</td></tr>
            <tr><td>Western Australia</td><td>2.2% - 3.25%</td><td>Perth averages sit higher than Sydney or Melbourne</td></tr>
            <tr><td>South Australia</td><td>1.9% - 2.75%</td><td>Adelaide rates are among the sharpest in the country</td></tr>
            <tr><td>Tasmania</td><td>2.5% - 3.25%</td><td>Smaller market, less discounting</td></tr>
            <tr><td>ACT</td><td>2.0% - 3.0%</td><td>Published averages vary widely by source; get three quotes</td></tr>
            <tr><td>Northern Territory</td><td>2.5% - 4.0%</td><td>Darwin averages around 2.5%; remote areas higher</td></tr>
          </tbody>
        </table>
      </TableWrap>
      <p>
        Always confirm whether a quoted rate <strong>includes GST</strong>. A “2.5 per cent” that turns out to be 2.75 per cent
        including GST is a $2,125 difference on an $850,000 sale. Get it in writing as a GST-inclusive figure. Some agents offer tiered
        structures (a base rate plus a higher percentage above an agreed threshold), which can align incentives well if the threshold
        is set honestly. More on negotiating in <Ch n={5} guide="selling">Chapter 5</Ch>, and our{" "}
        <Link href="/real-estate-commission-calculator">commission calculator</Link> shows the dollars at your price.
      </p>

      <h2>Marketing: $2,000 to $10,000</h2>
      <p>
        Marketing is almost always paid by you, on top of commission, and usually upfront or at settlement regardless of whether the
        property sells. A typical metro campaign:
      </p>
      <TableWrap>
        <table>
          <thead>
            <tr><th>Item</th><th>Typical cost</th></tr>
          </thead>
          <tbody>
            <tr><td>Portal listing (realestate.com.au and/or Domain, premium tier)</td><td>$1,500 - $5,000+</td></tr>
            <tr><td>Professional photography (day, plus twilight shots)</td><td>$300 - $800</td></tr>
            <tr><td>Floorplan</td><td>$150 - $350</td></tr>
            <tr><td>Video walkthrough or drone</td><td>$500 - $1,500</td></tr>
            <tr><td>Copywriting</td><td>$150 - $400</td></tr>
            <tr><td>Signboard (photo board)</td><td>$150 - $450</td></tr>
            <tr><td>Print, brochures, social media boosts</td><td>$200 - $1,000</td></tr>
            <tr><td>Auctioneer (if auctioning)</td><td>$400 - $1,000</td></tr>
          </tbody>
        </table>
      </TableWrap>
      <p>
        Portal pricing depends on your suburb’s median price, which is why the same ad costs three times as much in Mosman as in
        Maryborough. <Ch n={7} guide="selling">Chapter 7</Ch> covers which of these items make the most difference.
      </p>

      <h2>Everything else</h2>
      <ul>
        <li>
          <strong>Conveyancing or solicitor fees: $800 to $2,500.</strong> Covers contract preparation, state disclosure documents, and
          settlement. Complex sales (deceased estates, subdivisions, disputes) sit at the upper end of that range or above it.
        </li>
        <li>
          <strong>Styling and staging.</strong> A consultation using your own furniture: $200 to $500. Partial staging: $1,500 to
          $4,000. Full furniture hire for a vacant home: $2,000 to $8,000+ for a four-to-six-week campaign.{" "}
          <Ch n={4} guide="selling">Chapter 4</Ch> covers when it pays.
        </li>
        <li>
          <strong>Repairs and presentation.</strong> Painting, garden tidy, minor trades. Budget $1,000 to $5,000 for a lived-in home;
          many sellers spend more, not always wisely.
        </li>
        <li>
          <strong>Lender discharge fees.</strong> If you have a mortgage, your lender charges a discharge administration fee, typically
          $150 to $600, plus a state government fee to register the discharge of mortgage, roughly $100 to $250 depending on the state.
          If you’re on a fixed rate, ask about break costs before you list; on a large fixed loan these can run to thousands.
        </li>
        <li>
          <strong>Council and water rate adjustments</strong> are settled at settlement and are usually small, but they’re on the
          statement.
        </li>
      </ul>
      <p>
        Every state has its own quirks. Our state guides to the <Link href="/guides/cost-of-selling-a-house-australia">cost of
        selling a house</Link> go through them one by one.
      </p>

      <h2>Capital gains tax, in plain English</h2>
      <p>
        If the property has been <strong>your main residence for the whole time you’ve owned it</strong>, and you haven’t used it to
        produce income, you generally pay no CGT at all. That covers most owner-occupier sales. (One quirk: the exemption generally
        applies from when you move in, so a long gap between buying and occupying can create a partial liability.)
      </p>
      <p>
        If it’s an <strong>investment property</strong>, the gain (sale price minus your “cost base”, which includes the purchase price,
        stamp duty, buying and selling costs, and capital improvements) is added to your taxable income in the year you sign the
        contract. Two things soften it:
      </p>
      <ul>
        <li>
          <strong>The 50 per cent discount.</strong> Individuals who have held the property for more than 12 months pay tax on only half
          the gain.
        </li>
        <li>
          <strong>The six-year rule.</strong> If the property was your main residence before you rented it out, you can generally still
          treat it as your main residence for up to six years of absence, provided you’re not claiming another property as your main
          residence at the same time.
        </li>
      </ul>
      <p>
        Two traps. First, CGT is triggered by the <strong>contract date</strong>, not settlement, which matters if you exchange in late
        June. Second, if you’ve lived in it part of the time and rented it part of the time, the exemption is apportioned, and the sums
        get fiddly. For anything beyond a straightforward whole-period main residence, spend a few hundred dollars on an accountant
        before you list. It is the highest-return professional fee in this entire guide. Our{" "}
        <Link href="/cgt-calculator">CGT calculator</Link> gives you a first estimate.
      </p>

      <h2>Worked example: an $850,000 sale</h2>
      <p>Owner-occupied house in suburban Brisbane, sold by private treaty with a mid-range campaign and partial staging:</p>
      <TableWrap>
        <table>
          <thead>
            <tr><th>Cost item</th><th>Amount</th></tr>
          </thead>
          <tbody>
            <tr><td>Agent commission at 2.5% incl. GST</td><td>$21,250</td></tr>
            <tr><td>Marketing campaign (portal premium, photos, floorplan, board, copy)</td><td>$4,300</td></tr>
            <tr><td>Conveyancing, including disclosure documents</td><td>$1,400</td></tr>
            <tr><td>Partial staging, four weeks</td><td>$2,800</td></tr>
            <tr><td>Repairs, paint touch-ups, garden</td><td>$2,600</td></tr>
            <tr><td>Lender discharge fee plus registration</td><td>$550</td></tr>
            <tr><td><strong>Total cost of sale</strong></td><td><strong>$32,900</strong></td></tr>
          </tbody>
        </table>
      </TableWrap>

      <Stat value="$32,900">The full cost of selling in the worked $850,000 example.</Stat>

      <p>
        That’s about 3.9 per cent of the sale price, with no CGT because it’s a main residence. The same property as an investment
        held nine years with a $300,000 gross gain could add a tax bill in the tens of thousands depending on the owner’s income, which
        is why investors should work out the tax before they budget for the marketing.
      </p>
    </>
  );
}
