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
  title: "Stamp Duty WA: Calculator, Rates & First Home Buyer Concessions (2026)",
  description:
    "Stamp duty in Western Australia (WA): the rate table, worked examples by price, where first home buyers stand, and a free calculator for your exact figure.",
  slug: "stamp-duty-wa",
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
  "Transfer duty (stamp duty) is the biggest upfront government cost a WA buyer faces after the deposit, and the buyer pays it, usually at settlement.",
  "WA uses a marginal sliding scale, so the rate climbs in steps. The effective rate runs from about 3.25% on a $400,000 home to roughly 4.56% on a $1.5 million one.",
  "First home buyers pay $0 duty up to $450,000 (full exemption), then a concessional rate tapers off to $600,000. Above $600,000 the standard rate applies.",
  "On a $400,000 first home, the exemption wipes out $13,015 of duty. On a $650,000 home there is no concession, so a first home buyer pays the full $24,890.",
  "Foreign buyers pay a 7% surcharge on residential property on top of standard duty.",
  "Figures here are owner-occupier estimates. Confirm current rates with RevenueWA before you sign anything.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is",       label: "What is stamp duty in WA?" },
  { id: "what-youll-pay",label: "What you'll actually pay" },
  { id: "how-calculated",label: "How WA stamp duty is calculated" },
  { id: "first-home",    label: "First home buyers in WA" },
  { id: "foreign-buyers",label: "Foreign buyers and surcharges" },
  { id: "when-you-pay",  label: "When do you pay stamp duty?" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much is stamp duty in WA?",
    answer:
      "It depends on the price, because WA charges duty on a sliding scale. On a $650,000 home a standard buyer pays $24,890, which works out to an effective rate of about 3.83%. A $400,000 home costs $13,015 in duty, and a $1,000,000 home costs $42,616. First home buyers pay less or nothing under the concession, but only up to $600,000.",
  },
  {
    question: "Do first home buyers pay stamp duty in WA?",
    answer:
      "Not always. WA's first home owner rate of duty gives an eligible first home buyer $0 duty up to $450,000, with a concessional sliding scale from $450,001 to $600,000. Above $600,000 the standard duty applies in full. So a first home buyer on a $400,000 home pays nothing and saves $13,015, while one on a $650,000 home gets no concession and pays the full $24,890.",
  },
  {
    question: "When do you pay stamp duty in WA?",
    answer:
      "Duty is generally payable around settlement, and the law requires it to be paid within roughly three months of the transaction. In practice your conveyancer or settlement agent assesses and arranges payment as part of settlement, so it comes out of the funds you bring to the table on the day.",
  },
  {
    question: "Can you avoid or reduce stamp duty in WA?",
    answer:
      "There is no general way to avoid transfer duty, but eligible first home buyers can reduce it to $0 up to $450,000 or pay a concessional rate up to $600,000. Beyond that the standard rate applies. Some transfers, such as between spouses or under a family court order, can attract relief, but for a normal purchase budget for the full amount and confirm any concession with RevenueWA.",
  },
  {
    question: "Is the WA first home owner grant the same as the stamp duty concession?",
    answer:
      "No. They are two separate things. The first home owner rate of duty is the stamp duty concession described here. The First Home Owner Grant is a separate cash grant for building or buying a new home, with its own rules and thresholds. You can qualify for one, both or neither. Our WA first home buyer guide covers the grant and the schemes in detail.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Stamp Duty Calculator",        href: "/stamp-duty-calculator",                   description: "Estimate your WA stamp duty in seconds." },
  { title: "First Home Buyer Guide WA",     href: "/guides/first-home-buyer-wa",              description: "Grants, schemes and the WA buying process." },
  { title: "Buying Property in Australia",  href: "/guides/buying-property-australia",        description: "The complete step-by-step buying process." },
  { title: "How Much Deposit Do You Need?", href: "/guides/how-much-deposit-to-buy-a-house",  description: "Deposit, LMI and the schemes that waive it." },
  { title: "Conveyancing in Australia",     href: "/guides/conveyancing-guide",               description: "What conveyancers do and what they cost." },
];

export default function StampDutyWAPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Check the current rates with RevenueWA first">
        <p>
          WA duty rates, first home thresholds and surcharges are set by the
          state and they change. Before you sign a contract or budget off these
          numbers, confirm the current position with{" "}
          <a href="https://www.wa.gov.au/organisation/department-of-finance/revenuewa" target="_blank" rel="noopener noreferrer">
            RevenueWA
          </a>{" "}
          or your settlement agent.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The thing that catches WA first home buyers out is the $600,000 wall.
          Plenty of people assume the first home concession follows them up the
          ladder. It does not. Buy at $599,000 and you get help. Buy at $601,000
          and you pay the full standard rate on the lot, not just the bit over
          the line. In Perth, where a fair few houses sit right around that
          mark, an extra few thousand on the price tag can quietly cost you
          twenty grand in duty. Know where the line is before you start making
          offers.
        </p>
      </EditorNote>

      <h2 id="what-is">What is stamp duty in WA?</h2>
      <p className="lead">
        Stamp duty in Western Australia is officially called transfer duty. It
        is a state tax on the transfer of property, charged on the purchase
        price (or market value, whichever is higher). For most buyers it is the
        single biggest upfront government cost after the deposit itself.
      </p>
      <p>
        The buyer pays it, not the seller. It is assessed on the contract and
        almost always settled at the same time as the property, so it forms part
        of the money you need ready on settlement day rather than something you
        can pay off later. RevenueWA administers it, and your conveyancer or
        settlement agent handles the assessment and payment on your behalf.
      </p>

      <h2 id="what-youll-pay">WA stamp duty: what you&rsquo;ll actually pay</h2>
      <p>
        Here is what transfer duty costs a standard owner-occupier across a
        range of Perth and regional WA price points, alongside where an eligible
        first home buyer lands at the same price.
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
            <td>$13,015 (effective 3.25%)</td>
            <td>$0 (saves $13,015)</td>
          </tr>
          <tr>
            <td>$500,000</td>
            <td>$17,765 (effective 3.55%)</td>
            <td>$5,922 (saves $11,843 (partial))</td>
          </tr>
          <tr>
            <td>$650,000</td>
            <td>$24,890 (effective 3.83%)</td>
            <td>$24,890 (no concession (over $600k))</td>
          </tr>
          <tr>
            <td>$800,000</td>
            <td>$32,316 (effective 4.04%)</td>
            <td>$32,316 (no concession)</td>
          </tr>
          <tr>
            <td>$1,000,000</td>
            <td>$42,616 (effective 4.26%)</td>
            <td>$42,616 (no concession)</td>
          </tr>
          <tr>
            <td>$1,500,000</td>
            <td>$68,366 (effective 4.56%)</td>
            <td>$68,366 (no concession)</td>
          </tr>
        </tbody>
      </table>

      <p>
        These are owner-occupier estimates and they exclude any foreign buyer
        surcharge. For an exact figure on your own price, run the numbers in our{" "}
        <Link href="/stamp-duty-calculator">stamp duty calculator</Link>.
      </p>

      <MiniStampDutyEmbed defaultState="WA" />

      <h2 id="how-calculated">How WA stamp duty is calculated</h2>
      <p>
        WA charges duty on a marginal sliding scale, the same way income tax
        works. The price is split into bands, and each band is taxed at its own
        rate. You do not pay one flat percentage on the whole price. Instead you
        pay a fixed base amount for the band you land in, plus a marginal rate on
        the portion of the price above that band&rsquo;s lower edge.
      </p>
      <p>
        These are the residential and owner-occupier transfer duty brackets WA
        uses:
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
            <td>$0 to $120,000</td>
            <td>1.9% of the value</td>
          </tr>
          <tr>
            <td>$120,001 to $150,000</td>
            <td>$2,280 plus 2.85% of the amount over $120,000</td>
          </tr>
          <tr>
            <td>$150,001 to $360,000</td>
            <td>$3,135 plus 3.8% of the amount over $150,000</td>
          </tr>
          <tr>
            <td>$360,001 to $725,000</td>
            <td>$11,115 plus 4.75% of the amount over $360,000</td>
          </tr>
          <tr>
            <td>$725,001 and above</td>
            <td>$28,453 plus 5.15% of the amount over $725,000</td>
          </tr>
        </tbody>
      </table>

      <p>
        Worked through on a $650,000 home, that means $11,115 for the band up to
        $360,000, plus 4.75% on the remaining $290,000, which comes to $24,890.
        That matches the figure in the table above and the calculator.
      </p>

      <h2 id="first-home">First home buyers in WA</h2>
      <p>
        WA&rsquo;s first home owner rate of duty gives an eligible first home
        buyer $0 duty up to $450,000, with a concessional sliding scale from
        $450,001 to $600,000. Above $600,000 standard duty applies in full,
        which is why a first home buyer on a $650,000 home in the table pays the
        same $24,890 as everyone else.
      </p>

      <KeyFigure
        value="$0 to $450,000"
        label="Full transfer duty exemption for eligible WA first home buyers, tapering to $600,000."
        context="Standard rate applies above $600,000"
      />

      <p>
        WA reviews these thresholds periodically, so confirm the current figures
        before you buy. The duty concession is also separate from the First Home
        Owner Grant, which is a cash grant with its own rules. For the full grant
        and scheme detail, see{" "}
        <Link href="/guides/first-home-buyer-wa">our WA first home buyer guide</Link>.
      </p>

      <MatchCTA
        kind="buyers-agent"
        lead="Buying your first home in WA? The free buying guide walks through deposit, duty, the schemes and a step-by-step plan for the purchase."
        ctaLabel="Get the free guide"
      />

      <h2 id="foreign-buyers">Foreign buyers and surcharges</h2>
      <p>
        WA charges a 7% foreign buyer duty surcharge on residential property
        bought by foreign persons. It sits on top of the standard transfer duty,
        so a foreign buyer pays the normal duty plus 7% of the property value
        again. The surcharge applies to foreign individuals, corporations and
        trusts buying residential land, and the first home concession does not
        offset it.
      </p>

      <h2 id="when-you-pay">When do you pay stamp duty in WA?</h2>
      <p>
        Transfer duty is generally paid at settlement, and the law requires it to
        be paid within roughly three months of the transaction. You will not be
        writing a separate cheque to RevenueWA yourself in most cases. Your
        conveyancer or solicitor lodges the transaction, gets it assessed, and
        arranges the duty payment as part of settlement, drawing on the funds you
        bring to the table.
      </p>
      <p>
        The practical point is to treat duty as cash you need up front, not a
        cost you can finance separately. Build it into your deposit and settlement
        budget from the start, and check the exact amount for your price with the{" "}
        <Link href="/stamp-duty-calculator">stamp duty calculator</Link>.
      </p>

      <MatchCTA kind="buyers-agent" />
    </GuideArticleLayout>
  );
}
