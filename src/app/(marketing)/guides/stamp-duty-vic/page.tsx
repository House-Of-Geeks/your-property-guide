import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  EditorNote,
  KeyFigure,
  MatchCTA,
  MiniStampDutyEmbed,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Stamp Duty VIC: Calculator, Rates & First Home Buyer Concessions (2026)",
  description:
    "Stamp duty in Victoria (VIC): the full rate table, worked examples by price, where first home buyers pay $0, and a free calculator for your exact figure.",
  slug: "stamp-duty-vic",
  publishedAt: "2026-06-14",
  updatedAt: "2026-06-14",
  readingTimeMinutes: 7,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "first-home",
};

export const metadata: Metadata = {
  title: FRONTMATTER.title,
  description: FRONTMATTER.description,
  alternates: { canonical: `${SITE_URL}/guides/${FRONTMATTER.slug}` },
  openGraph: {
    url: `${SITE_URL}/guides/${FRONTMATTER.slug}`,
    title: FRONTMATTER.title,
    description: FRONTMATTER.description,
    type: "article",
    publishedTime: FRONTMATTER.publishedAt,
    modifiedTime: FRONTMATTER.updatedAt,
    images: guideOgImages({
      slug: FRONTMATTER.slug,
      title: FRONTMATTER.title,
      description: FRONTMATTER.description,
      persona: FRONTMATTER.persona,
    }),
  },
};

const TLDR = [
  "Stamp duty (land transfer duty) is the largest upfront government cost a Victorian buyer faces after the deposit, and the buyer pays it at settlement.",
  "Victoria runs a tiered, marginal scale. A standard buyer pays about $34,070 on a $650,000 home and $57,970 on a $1,000,000 home.",
  "Eligible first home buyers pay $0 land transfer duty up to $600,000 (full exemption), then a sliding-scale concession tapers off to $750,000.",
  "Buy above $750,000 and no first home buyer duty relief applies, so a $800,000 purchase costs the full $43,070 either way.",
  "A separate $10,000 First Home Owner Grant covers new homes valued up to $750,000, on top of any duty concession.",
  "Foreign buyers pay an extra 8% foreign purchaser additional duty on top of the standard rate.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is-it",     label: "What is stamp duty in VIC?" },
  { id: "what-you-pay",   label: "What you'll actually pay" },
  { id: "how-calculated", label: "How it's calculated" },
  { id: "first-home",     label: "First home buyers in VIC" },
  { id: "foreign",        label: "Foreign buyers and surcharges" },
  { id: "when-pay",       label: "When do you pay?" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much is stamp duty in VIC?",
    answer:
      "It depends on the price, because Victoria uses a tiered marginal scale. On a $650,000 home a standard owner-occupier pays about $34,070 in land transfer duty. On a $500,000 home it's around $25,070, and on a $1,000,000 home about $57,970. An eligible first home buyer pays much less, and nothing at all up to $600,000.",
  },
  {
    question: "Do first home buyers pay stamp duty in VIC?",
    answer:
      "Not up to $600,000. An eligible first home buyer in Victoria pays $0 land transfer duty on a home valued at $600,000 or less. Between $600,001 and $750,000 a sliding-scale concession applies, so on a $650,000 home you'd pay roughly $11,357 instead of the standard $34,070. Above $750,000 there is no first home buyer duty relief and you pay the standard rate.",
  },
  {
    question: "When do you pay stamp duty in VIC?",
    answer:
      "Land transfer duty is generally due at settlement, and Victoria requires it to be paid within about three months of the dutiable transaction. In practice your conveyancer or solicitor arranges payment as part of settlement, so you rarely deal with the State Revenue Office directly. Build the duty into your cash needs at settlement, not at deposit time.",
  },
  {
    question: "Can you avoid or reduce stamp duty in VIC?",
    answer:
      "There is no legitimate way to avoid duty on a standard purchase, but you can reduce it. The first home buyer exemption removes it entirely up to $600,000 and discounts it up to $750,000. Buying a new home up to $750,000 can also unlock the separate $10,000 First Home Owner Grant. Off-the-plan and pensioner concessions exist for some buyers too. Check what you qualify for before you sign.",
  },
  {
    question: "Is stamp duty in VIC higher than in other states?",
    answer:
      "Victoria sits at the higher end for established homes. The marginal rate reaches 6% on value above $130,000 and 6.5% above $960,000, so on a $1,000,000 home the effective rate is around 5.8%. That said, the first home buyer position up to $750,000 is generous, so the comparison swings heavily depending on whether you qualify.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Stamp Duty Calculator",          href: "/stamp-duty-calculator",                    description: "Estimate your VIC stamp duty in seconds." },
  { title: "First Home Buyer Guide VIC",      href: "/guides/first-home-buyer-vic",              description: "Grants, schemes and the VIC buying process." },
  { title: "Buying Property in Australia",    href: "/guides/buying-property-australia",         description: "The complete step-by-step buying process." },
  { title: "How Much Deposit Do You Need?",   href: "/guides/how-much-deposit-to-buy-a-house",   description: "Deposit, LMI and the schemes that waive it." },
  { title: "Conveyancing in Australia",       href: "/guides/conveyancing-guide",                description: "What conveyancers do and what they cost." },
];

export default function StampDutyVICPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Check the State Revenue Office before you commit">
        <p>
          Duty rates, thresholds and concessions in Victoria change with state
          budgets. Confirm the current numbers with the{" "}
          <a href="https://www.sro.vic.gov.au" target="_blank" rel="noopener noreferrer">
            State Revenue Office Victoria
          </a>{" "}
          or your conveyancer before you sign a contract or budget around a figure.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The part that catches Victorian buyers out is how fast the first home
          buyer benefit disappears. At $600,000 you can pay nothing. At $750,001
          you pay the full $43,000-odd, same as any other buyer. That&rsquo;s a
          cliff, not a gentle slope, so a property that drifts a few thousand
          dollars over $750,000 at auction can quietly cost you a lot more than
          the hammer price suggests. Know exactly where you sit before you raise
          your hand.
        </p>
      </EditorNote>

      <h2 id="what-is-it">What is stamp duty in VIC?</h2>
      <p className="lead">
        Stamp duty in Victoria is officially called land transfer duty. It is a
        one-off state tax on the transfer of property, and for most buyers it is
        the biggest upfront government cost after the deposit itself.
      </p>
      <p>
        The buyer pays it, not the seller, and it is usually settled at the same
        time as the property. It is charged on the dutiable value of the home,
        which is normally the purchase price (or the market value if that is
        higher). The State Revenue Office Victoria administers it. Because the
        rate climbs as the price climbs, the duty bill grows faster than the
        price does, which is why a small jump in purchase price can mean a much
        larger jump in duty.
      </p>

      <h2 id="what-you-pay">VIC stamp duty: what you&rsquo;ll actually pay</h2>
      <p>
        Here is what land transfer duty works out to across a range of common
        Victorian price points, both for a standard buyer and for an eligible
        first home buyer.
      </p>

      <table>
        <thead>
          <tr>
            <th>Purchase price</th>
            <th>Standard buyer</th>
            <th>First home buyer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>$400,000</td>
            <td>$19,070 (effective 4.77%)</td>
            <td>$0 (saves $19,070)</td>
          </tr>
          <tr>
            <td>$500,000</td>
            <td>$25,070 (effective 5.01%)</td>
            <td>$0 (saves $25,070)</td>
          </tr>
          <tr>
            <td>$650,000</td>
            <td>$34,070 (effective 5.24%)</td>
            <td>$11,357 (saves $22,713 (partial))</td>
          </tr>
          <tr>
            <td>$800,000</td>
            <td>$43,070 (effective 5.38%)</td>
            <td>$43,070 (no concession (over $750k))</td>
          </tr>
          <tr>
            <td>$1,000,000</td>
            <td>$57,970 (effective 5.8%)</td>
            <td>$57,970 (no concession)</td>
          </tr>
          <tr>
            <td>$1,500,000</td>
            <td>$90,470 (effective 6.03%)</td>
            <td>$90,470 (no concession)</td>
          </tr>
        </tbody>
      </table>

      <p>
        These are owner-occupier estimates and exclude any foreign purchaser
        surcharge. For an exact figure on your own purchase price, run it through
        the full <Link href="/stamp-duty-calculator">stamp duty calculator</Link>.
      </p>

      <MiniStampDutyEmbed defaultState="VIC" />

      <h2 id="how-calculated">How VIC stamp duty is calculated</h2>
      <p>
        Victoria uses a tiered, marginal scale. You do not pay a single flat rate
        on the whole price. Instead each band of the price is taxed at its own
        rate, and the duty is the fixed base for your band plus a marginal rate on
        the amount above that band&rsquo;s floor. These are the standard
        owner-occupier brackets the calculator on this page uses.
      </p>

      <table>
        <thead>
          <tr>
            <th>Dutiable value</th>
            <th>Duty payable</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>$0 to $25,000</td>
            <td>1.4% of the value</td>
          </tr>
          <tr>
            <td>$25,001 to $130,000</td>
            <td>$350 plus 2.4% of the value above $25,000</td>
          </tr>
          <tr>
            <td>$130,001 to $960,000</td>
            <td>$2,870 plus 6% of the value above $130,000</td>
          </tr>
          <tr>
            <td>Over $960,000</td>
            <td>$55,370 plus 6.5% of the value above $960,000</td>
          </tr>
        </tbody>
      </table>

      <p>
        Worked example on a $650,000 home: that price falls in the third band, so
        the duty is $2,870 plus 6% of the $520,000 above $130,000, which is
        $31,200. Add them together and you get $34,070, matching the standard-buyer
        figure in the table above.
      </p>

      <KeyFigure
        value="6%"
        label="The marginal rate on value between $130,001 and $960,000, where most Victorian homes sit."
        context="Value over $960,000 is taxed at 6.5%"
      />

      <h2 id="first-home">First home buyers in VIC</h2>
      <p>
        Victoria gives first home buyers one of the more generous duty positions
        in the country, but only up to a hard ceiling.
      </p>
      <ul>
        <li>
          <strong>Up to $600,000:</strong> an eligible first home buyer pays $0
          land transfer duty. The full exemption wipes the bill out entirely.
        </li>
        <li>
          <strong>$600,001 to $750,000:</strong> a sliding-scale concession
          applies, so you pay a reduced amount that grows as the price rises. On a
          $650,000 home that works out to roughly $11,357 instead of $34,070.
        </li>
        <li>
          <strong>Above $750,000:</strong> no first home buyer duty relief
          applies and you pay the standard rate in full.
        </li>
      </ul>
      <p>
        Separately, a $10,000 First Home Owner Grant is available on new homes
        valued up to $750,000. That grant sits on top of any duty concession, so
        a first home buyer purchasing a new build under the cap can use both. For
        the full detail on the grant, eligibility and the wider scheme list, read{" "}
        <Link href="/guides/first-home-buyer-vic">our VIC first home buyer guide</Link>.
      </p>

      <MatchCTA kind="buyers-agent" />

      <h2 id="foreign">Foreign buyers and surcharges</h2>
      <p>
        Victoria charges an 8% foreign purchaser additional duty on residential
        property bought by foreign buyers. It sits on top of the standard land
        transfer duty, not instead of it, so a foreign buyer pays the normal scale
        plus 8% of the dutiable value. On a $700,000 home that surcharge alone adds
        $56,000 to the bill, which is why working out your residency status early
        matters. The standard-buyer figures in the table above do not include this
        surcharge.
      </p>

      <h2 id="when-pay">When do you pay stamp duty in VIC?</h2>
      <p>
        Land transfer duty is generally paid at settlement, and Victoria requires
        it to be settled within roughly three months of the transaction. You will
        not usually deal with the State Revenue Office yourself. Your conveyancer
        or solicitor lodges the transfer and arranges payment of the duty as part
        of the settlement process, often through the electronic settlement
        platform. The practical point for budgeting is simple: the duty is due at
        settlement, so it needs to be in your funds-to-complete, separate from the
        deposit you paid at exchange.
      </p>
    </GuideArticleLayout>
  );
}
