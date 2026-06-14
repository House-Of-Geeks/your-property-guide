import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  EditorNote,
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
  title: "Stamp Duty ACT: Calculator, Rates & First Home Buyer Concessions (2026)",
  description:
    "Stamp duty in the Australian Capital Territory (ACT): the rates table, worked examples, the first home buyer position and a free calculator for an exact figure.",
  slug: "stamp-duty-act",
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
  "The ACT is slowly phasing stamp duty out, so its rates and concessions move more often than most states. Check the figure before you bank on it.",
  "Stamp duty is the biggest upfront government cost after your deposit, and the buyer pays it, usually at settlement.",
  "On a $650,000 home a standard ACT buyer pays about $23,000 in duty, an effective rate of roughly 3.54%.",
  "The ACT income-tested Home Buyer Concession Scheme can reduce duty to $0 for eligible buyers whose household income is under the threshold.",
  "The ACT does not charge a foreign buyer stamp duty surcharge, unlike most other states.",
  "The figures here are owner-occupier estimates. Run your own price through the calculator for an exact number.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is-it",      label: "What is stamp duty in ACT?" },
  { id: "what-you-pay",    label: "What you'll actually pay" },
  { id: "how-calculated",  label: "How ACT stamp duty is calculated" },
  { id: "first-home",      label: "First home buyers in ACT" },
  { id: "foreign-buyers",  label: "Foreign buyers and surcharges" },
  { id: "when-you-pay",    label: "When do you pay stamp duty?" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much is stamp duty in ACT?",
    answer:
      "It depends on the price. On a $650,000 home a standard owner-occupier buyer in the ACT pays about $23,000 in duty, which works out to an effective rate of roughly 3.54%. A $500,000 home is closer to $15,500, and a $1,000,000 home is around $44,250. These are owner-occupier estimates before any concession. Run your exact price through the calculator for a precise figure.",
  },
  {
    question: "Do first home buyers pay stamp duty in ACT?",
    answer:
      "Often not. The ACT has no separate first home buyer rate, but its income-tested Home Buyer Concession Scheme can cut duty all the way to $0 for eligible buyers whose household income sits below the threshold. The scheme covers first home buyers and other people who have not owned property recently. The figures in this guide are the standard duty before that scheme applies, so if you qualify your duty could be far lower or nil. Confirm your eligibility with the ACT Revenue Office.",
  },
  {
    question: "When do you pay stamp duty in ACT?",
    answer:
      "Generally at settlement, or within roughly three months of the transaction. Your conveyancer or solicitor usually arranges the payment as part of settlement, so the duty is sorted in the background rather than something you pay separately. Build it into your upfront cash, not your loan, because in most cases you cannot borrow it.",
  },
  {
    question: "Can you avoid or reduce stamp duty in ACT?",
    answer:
      "The main lever is the income-tested Home Buyer Concession Scheme, which can reduce duty to $0 for eligible buyers under the household income threshold. There is no foreign buyer surcharge to worry about in the ACT either. Beyond the concession scheme, the ACT is gradually phasing duty out over time, so the standard rates trend down across budget cycles. Check the current rules with the ACT Revenue Office before you assume a saving.",
  },
  {
    question: "Does the ACT charge a foreign buyer surcharge?",
    answer:
      "No. The ACT does not apply a foreign buyer stamp duty surcharge. This is one of the few areas where the ACT is simpler than the larger states, several of which add 7% or 8% on top for foreign buyers. You still pay the standard duty, just without the extra layer.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Stamp Duty Calculator",          href: "/stamp-duty-calculator",                description: "Estimate your ACT stamp duty in seconds." },
  { title: "First Home Buyer Guide ACT",      href: "/guides/first-home-buyer-act",          description: "Grants, schemes and the ACT buying process." },
  { title: "Buying Property in Australia",    href: "/guides/buying-property-australia",      description: "The complete step-by-step buying process." },
  { title: "How Much Deposit Do You Need?",   href: "/guides/how-much-deposit-to-buy-a-house", description: "Deposit, LMI and the schemes that waive it." },
  { title: "Conveyancing in Australia",       href: "/guides/conveyancing-guide",            description: "What conveyancers do and what they cost." },
];

export default function StampDutyACTPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Verify with the ACT Revenue Office before you rely on this">
        <p>
          The ACT is part-way through phasing stamp duty out, so its rates and
          the income thresholds behind its concessions shift more often than in
          other states. Always confirm the current figure with the{" "}
          <a href="https://www.revenue.act.gov.au" target="_blank" rel="noopener noreferrer">
            ACT Revenue Office
          </a>{" "}
          or a licensed conveyancer before you sign a contract.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The ACT is the one territory where the headline rate is only half the
          story. Canberra has been winding duty down for years and pushing the
          cost onto rates instead, so a figure that was right last budget can be
          out by the time you settle. And the concession here is income-tested,
          not price-tested like New South Wales or Victoria, which trips people
          up. Plenty of buyers who assume they earn too much to qualify never
          check, and leave a $0 duty bill on the table.
        </p>
      </EditorNote>

      <h2 id="what-is-it">What is stamp duty in ACT?</h2>
      <p className="lead">
        Stamp duty, properly called transfer duty, is the tax the ACT Government
        charges when a property changes hands. After your deposit it is usually
        the single biggest upfront cost of buying, and it is the buyer who pays
        it, not the seller.
      </p>
      <p>
        You pay it once, on the purchase, and in most cases at settlement. It is
        not a tax on the loan, it is a tax on the transfer, so even a cash buyer
        pays it. Because you generally cannot add it to your mortgage, it has to
        come out of your own savings on top of the deposit. That is what makes it
        worth getting right before you start making offers.
      </p>

      <h2 id="what-you-pay">ACT stamp duty: what you&rsquo;ll actually pay</h2>
      <p>
        Here is what a standard owner-occupier buyer pays at a range of common
        Canberra price points. The first home buyer column reflects the ACT
        position: there is no separate first home rate, but an income-tested
        scheme can reduce these amounts, sometimes to nil.
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
            <td>$11,500 (effective 2.88%)</td>
            <td>$11,500 (income-tested scheme may apply)</td>
          </tr>
          <tr>
            <td>$500,000</td>
            <td>$15,500 (effective 3.1%)</td>
            <td>$15,500 (income-tested scheme may apply)</td>
          </tr>
          <tr>
            <td>$650,000</td>
            <td>$23,000 (effective 3.54%)</td>
            <td>$23,000 (income-tested scheme may apply)</td>
          </tr>
          <tr>
            <td>$800,000</td>
            <td>$31,250 (effective 3.91%)</td>
            <td>$31,250 (income-tested scheme may apply)</td>
          </tr>
          <tr>
            <td>$1,000,000</td>
            <td>$44,250 (effective 4.43%)</td>
            <td>$44,250 (income-tested scheme may apply)</td>
          </tr>
          <tr>
            <td>$1,500,000</td>
            <td>$78,193 (effective 5.21%)</td>
            <td>$78,193 (income-tested scheme may apply)</td>
          </tr>
        </tbody>
      </table>

      <p>
        These are owner-occupier estimates and exclude any foreign surcharge.
        For an exact figure on your own price, use the{" "}
        <Link href="/stamp-duty-calculator">stamp duty calculator</Link>.
      </p>

      <MiniStampDutyEmbed defaultState="ACT" />

      <h2 id="how-calculated">How ACT stamp duty is calculated</h2>
      <p>
        ACT duty is tiered and marginal, so you do not pay a single flat rate on
        the whole price. Each slice of the value is taxed at the rate for its
        band, and the bands stack. That is why the effective rate in the table
        above climbs gradually as the price rises rather than jumping.
      </p>

      <table>
        <thead>
          <tr>
            <th>Property value</th>
            <th>Duty payable</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Up to $200,000</td><td>2.00% of the value</td></tr>
          <tr><td>$200,001 to $300,000</td><td>$4,000 plus 3.50% of the amount over $200,000</td></tr>
          <tr><td>$300,001 to $500,000</td><td>$7,500 plus 4.00% of the amount over $300,000</td></tr>
          <tr><td>$500,001 to $750,000</td><td>$15,500 plus 5.00% of the amount over $500,000</td></tr>
          <tr><td>$750,001 to $1,000,000</td><td>$28,000 plus 6.50% of the amount over $750,000</td></tr>
          <tr><td>$1,000,001 to $1,455,000</td><td>$44,250 plus 7.00% of the amount over $1,000,000</td></tr>
          <tr><td>Over $1,455,000</td><td>A flat 4.54% applies to the whole value</td></tr>
        </tbody>
      </table>

      <p>
        To read it, find the band your price falls in, take the fixed base
        amount, then add the marginal rate on the part of the price above that
        band&rsquo;s floor. A $650,000 home, for example, sits in the
        $500,001 to $750,000 band: $15,500 plus 5.00% of the $150,000 above
        $500,000, which lands at $23,000.
      </p>

      <h2 id="first-home">First home buyers in ACT</h2>
      <p>
        The ACT is phasing out stamp duty over time, so the way it helps first
        home buyers is different to the exemptions and concessions you see in
        New South Wales or Victoria. Instead of a price threshold, the ACT runs
        an income-tested Home Buyer Concession Scheme.
      </p>
      <p>
        That scheme can reduce duty all the way to $0 for eligible buyers whose
        household income is below the threshold. It is open to first home buyers
        as well as others who have not owned property recently. The figures in
        the table above are the standard duty before the scheme is applied, so
        if you qualify your duty could be much lower, or nil. Eligibility turns
        on your household income, so check it with the ACT Revenue Office rather
        than assuming you earn too much.
      </p>
      <p>
        For the full detail on the scheme, the grants and the rest of the
        Canberra buying process, see{" "}
        <Link href="/guides/first-home-buyer-act">our ACT first home buyer guide</Link>.
      </p>

      <MatchCTA
        kind="conveyancer"
        href="/selling-guide"
        lead="Buying in Canberra and selling elsewhere first? The free guide covers the sell side: your real costs, settlement timing, and buying and selling at the same time."
        ctaLabel="Get the free guide"
      />

      <h2 id="foreign-buyers">Foreign buyers and surcharges</h2>
      <p>
        The ACT does not apply a foreign buyer stamp duty surcharge. Several of
        the larger states add 7% or 8% on top of standard duty for foreign
        buyers, but the ACT does not. A foreign buyer in Canberra pays the same
        standard transfer duty as a local owner-occupier, with no extra layer on
        top.
      </p>

      <h2 id="when-you-pay">When do you pay stamp duty in ACT?</h2>
      <p>
        Stamp duty in the ACT is generally paid at settlement, or within around
        three months of the transaction. In practice your conveyancer or
        solicitor arranges the payment for you as part of completing the
        purchase, so it is handled alongside the rest of settlement rather than
        as a separate bill you chase down.
      </p>
      <p>
        Because it is due so early and usually cannot be borrowed, treat it as
        part of your upfront cash. Have the duty, your deposit and your other
        settlement costs accounted for before you sign, so nothing catches you
        short on the day.
      </p>
    </GuideArticleLayout>
  );
}
