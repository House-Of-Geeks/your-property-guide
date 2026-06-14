import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  EditorNote,
  KeyFigure,
  MatchCTA,
  MiniStampDutyEmbed,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Stamp Duty NSW: Calculator, Rates & First Home Buyer Concessions (2026)",
  description:
    "Stamp duty in New South Wales (NSW): the full rates table, worked examples, where first home buyers pay $0, and a free calculator for your exact figure.",
  slug: "stamp-duty-nsw",
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
  "Stamp duty (transfer duty) is the biggest upfront government cost on a NSW purchase after your deposit. The buyer pays it, usually at settlement.",
  "It runs on a tiered, marginal scale. On an $800,000 home a standard NSW buyer pays around $31,217, an effective rate of 3.9%.",
  "First home buyers in NSW pay $0 on any home up to $800,000 (full exemption), with a concession tapering to $1,000,000. Above that, standard duty applies.",
  "On a $650,000 home an eligible NSW first home buyer saves $24,467 versus a standard buyer.",
  "Foreign buyers pay an 8% surcharge purchaser duty on residential property, on top of the standard duty.",
  "Rates and thresholds change. Confirm your figure with Revenue NSW or a conveyancer before you sign.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is-it",      label: "What is stamp duty in NSW?" },
  { id: "what-youll-pay",  label: "What you'll actually pay" },
  { id: "how-calculated",  label: "How NSW stamp duty is calculated" },
  { id: "first-home",      label: "First home buyers in NSW" },
  { id: "foreign-buyers",  label: "Foreign buyers and surcharges" },
  { id: "when-you-pay",    label: "When do you pay stamp duty?" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much is stamp duty in NSW?",
    answer:
      "It depends on the price and whether you're a first home buyer. As a guide for a standard owner-occupier: on a $650,000 home you'd pay around $24,467 (an effective rate of about 3.76%), and on an $800,000 home around $31,217 (about 3.9%). The duty is worked out on a tiered scale, so the effective rate rises as the price rises. For your exact figure, run the numbers through the calculator on this page or the full stamp duty calculator.",
  },
  {
    question: "Do first home buyers pay stamp duty in NSW?",
    answer:
      "Not on a home up to $800,000. Under the First Home Buyers Assistance Scheme an eligible first home buyer pays $0 transfer duty on any home, new or established, up to $800,000. Between $800,001 and $1,000,000 a sliding-scale concession applies, so you pay a reduced amount. Above $1,000,000 the standard rate applies in full with no concession.",
  },
  {
    question: "When do you pay stamp duty in NSW?",
    answer:
      "Generally at settlement, and within about three months of the contract date. In practice your conveyancer or solicitor arranges the payment as part of settlement, so the funds are ready on the day. If you settle late or miss the window, interest can be charged, which is one reason the payment is handled through your conveyancer rather than left to you.",
  },
  {
    question: "Can you avoid or reduce stamp duty in NSW?",
    answer:
      "There's no general way to avoid transfer duty, but eligible first home buyers can wipe it out entirely on a home up to $800,000 through the First Home Buyers Assistance Scheme, and pay a reduced amount up to $1,000,000. Beyond that scheme, duty is payable at the standard rates. Be wary of any arrangement that promises to dodge duty: Revenue NSW treats those seriously and the buyer carries the liability.",
  },
  {
    question: "Is stamp duty the same for an investment property in NSW?",
    answer:
      "The standard transfer duty rates are the same whether you buy to live in or to rent out. The difference is the concessions: the first home buyer exemption and concession only apply to owner-occupiers buying their first home, so an investor pays the full standard duty. A foreign buyer also pays the 8% surcharge purchaser duty on top.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Stamp Duty Calculator",         href: "/stamp-duty-calculator",                description: "Estimate your NSW stamp duty in seconds." },
  { title: "First Home Buyer Guide NSW",     href: "/guides/first-home-buyer-nsw",          description: "Grants, schemes and the NSW buying process." },
  { title: "Buying Property in Australia",   href: "/guides/buying-property-australia",      description: "The complete step-by-step buying process." },
  { title: "How Much Deposit Do You Need?",  href: "/guides/how-much-deposit-to-buy-a-house", description: "Deposit, LMI and the schemes that waive it." },
  { title: "Conveyancing in Australia",      href: "/guides/conveyancing-guide",            description: "What conveyancers do and what they cost." },
];

export default function StampDutyNSWPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Check the current rates with Revenue NSW">
        <p>
          NSW transfer duty rates, thresholds and first home buyer limits are
          set by the state and they do change, sometimes at budget time. Before
          you rely on a figure from this page, confirm it against{" "}
          <a href="https://www.revenue.nsw.gov.au" target="_blank" rel="noopener noreferrer">
            Revenue NSW
          </a>{" "}
          or ask your conveyancer.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The thing nobody tells you about NSW stamp duty is how much it dwarfs
          every other cost of buying. People agonise over a $600 building
          inspection and then hand the government thirty grand at settlement
          without blinking. On a typical Sydney purchase the duty is bigger
          than a year of repayments. If you&rsquo;re a first home buyer under
          $800,000, the exemption is the single most valuable thing you can
          claim, so get the eligibility right before anything else.
        </p>
      </EditorNote>

      <h2 id="what-is-it">What is stamp duty in NSW?</h2>
      <p className="lead">
        Stamp duty, officially called transfer duty in NSW, is the tax you pay
        the state government when property changes hands. It&rsquo;s the largest
        upfront cost of buying after your deposit, and on most Sydney purchases
        it runs into the tens of thousands.
      </p>
      <p>
        The buyer pays it, not the seller. It&rsquo;s calculated on the purchase
        price (or the property&rsquo;s market value, whichever is higher) and is
        normally paid at settlement through your conveyancer or solicitor. It
        isn&rsquo;t rolled into your mortgage by default, so you generally need
        it in cash on top of your deposit. Budgeting for it from the start is
        the difference between a clean settlement and a scramble.
      </p>

      <h2 id="what-youll-pay">NSW stamp duty: what you&rsquo;ll actually pay</h2>
      <p>
        Here&rsquo;s what transfer duty works out to across common NSW price
        points, for a standard buyer and for an eligible first home buyer.
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
            <td>$13,217 (effective 3.3%)</td>
            <td>$0 (saves $13,217)</td>
          </tr>
          <tr>
            <td>$500,000</td>
            <td>$17,717 (effective 3.54%)</td>
            <td>$0 (saves $17,717)</td>
          </tr>
          <tr>
            <td>$650,000</td>
            <td>$24,467 (effective 3.76%)</td>
            <td>$0 (saves $24,467)</td>
          </tr>
          <tr>
            <td>$800,000</td>
            <td>$31,217 (effective 3.9%)</td>
            <td>$0 (saves $31,217)</td>
          </tr>
          <tr>
            <td>$1,000,000</td>
            <td>$40,217 (effective 4.02%)</td>
            <td>$40,217 (no concession (over $1m))</td>
          </tr>
          <tr>
            <td>$1,500,000</td>
            <td>$67,590 (effective 4.51%)</td>
            <td>$67,590 (no concession)</td>
          </tr>
        </tbody>
      </table>

      <p>
        These are owner-occupier estimates and exclude any foreign buyer
        surcharge. For an exact figure on your own price, use the full{" "}
        <Link href="/stamp-duty-calculator">stamp duty calculator</Link>.
      </p>

      <MiniStampDutyEmbed defaultState="NSW" />

      <h2 id="how-calculated">How NSW stamp duty is calculated</h2>
      <p>
        NSW transfer duty is tiered and marginal. The price is split across
        bands, and each band is charged at its own rate, then the bands are
        added together. That&rsquo;s why the effective rate creeps up as the
        price rises rather than jumping in steps. The brackets below are the
        ones used by the calculator on this page.
      </p>

      <table>
        <thead>
          <tr>
            <th>Property value</th>
            <th>Duty payable</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>$0 to $17,000</td><td>$1.25 per $100 (min $10)</td></tr>
          <tr><td>$17,000 to $35,000</td><td>$212 plus $1.50 per $100 over $17,000</td></tr>
          <tr><td>$35,000 to $92,000</td><td>$482 plus $1.75 per $100 over $35,000</td></tr>
          <tr><td>$92,000 to $304,000</td><td>$1,477 plus $3.50 per $100 over $92,000</td></tr>
          <tr><td>$304,000 to $1,013,000</td><td>$8,897 plus $4.50 per $100 over $304,000</td></tr>
          <tr><td>$1,013,000 to $3,040,000</td><td>$40,805 plus $5.50 per $100 over $1,013,000</td></tr>
          <tr><td>Over $3,040,000</td><td>$152,285 plus $7.00 per $100 over $3,040,000</td></tr>
        </tbody>
      </table>

      <p>
        Take a $650,000 home as a worked example. It sits in the $304,000 to
        $1,013,000 band, so the duty is the $8,897 base plus 4.5% of the
        $346,000 above $304,000, which is $15,570. Add them and you get
        $24,467, the figure in the table above.
      </p>

      <h2 id="first-home">First home buyers in NSW</h2>
      <p>
        This is where NSW is genuinely generous. Under the First Home Buyers
        Assistance Scheme, an eligible first home buyer pays{" "}
        <strong>$0 transfer duty</strong> on any home, new or established, up to
        $800,000. Between $800,001 and $1,000,000 a sliding-scale concession
        applies, so you pay a reduced amount rather than nothing. Above
        $1,000,000 standard duty applies with no concession.
      </p>

      <KeyFigure
        value="$0"
        label="Transfer duty for an eligible NSW first home buyer on any home up to $800,000."
        context="Concession tapers from $800,001 to $1,000,000"
      />

      <p>
        Separately, a $10,000 First Home Owner Grant is available on new homes
        valued up to $750,000. That grant is about cash toward a new build, not
        duty relief, so the two can stack: an eligible buyer of a new home under
        $750,000 can claim both the duty exemption and the grant. For the full
        eligibility rules, grant detail and how to apply, read{" "}
        <Link href="/guides/first-home-buyer-nsw">our NSW first home buyer guide</Link>.
      </p>

      <h2 id="foreign-buyers">Foreign buyers and surcharges</h2>
      <p>
        If you&rsquo;re a foreign person buying residential property in NSW, you
        pay an extra <strong>8% surcharge purchaser duty</strong> on top of the
        standard transfer duty. On a $1,000,000 purchase that&rsquo;s an
        additional $80,000, separate from the $40,217 standard duty. The
        surcharge also applies to certain foreign trusts and companies, and the
        first home buyer concessions are not available to foreign buyers. If
        residency or visa status is at all unclear in your case, get advice
        before you exchange.
      </p>

      <h2 id="when-you-pay">When do you pay stamp duty in NSW?</h2>
      <p>
        Transfer duty in NSW is generally due within about three months of the
        contract date, and in practice it&rsquo;s paid at settlement. Your
        conveyancer or solicitor usually arranges the payment as part of the
        settlement process, so the funds are accounted for on the day rather
        than left for you to handle afterwards.
      </p>
      <p>
        Pay late and interest can be charged, which is another reason the timing
        sits with your conveyancer. If you&rsquo;re unsure how it&rsquo;s
        handled in your transaction, our{" "}
        <Link href="/guides/conveyancing-guide">conveyancing guide</Link>{" "}
        explains who does what at settlement.
      </p>

      <MatchCTA kind="buyers-agent" />

      <Sources items={STAMP_DUTY_NSW_SOURCES} />
    </GuideArticleLayout>
  );
}

const STAMP_DUTY_NSW_SOURCES: readonly SourceItem[] = [
  { label: "Revenue NSW: Transfer duty", href: "https://www.revenue.nsw.gov.au", note: "Official transfer duty rates, thresholds and payment timing" },
  { label: "Revenue NSW: First Home Buyers Assistance Scheme", href: "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer", note: "First home buyer exemption and concession detail" },
  { label: "Revenue NSW: Surcharge purchaser duty", href: "https://www.revenue.nsw.gov.au", note: "8% foreign buyer surcharge on residential property" },
];
