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
  title: "Stamp Duty SA: Calculator, Rates & Costs (2026)",
  description:
    "Stamp duty in South Australia (SA): the full rate table, worked examples by price, where first home buyers stand, and a free calculator for your exact figure.",
  slug: "stamp-duty-sa",
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
  "Stamp duty (transfer duty) is the largest upfront government cost on an SA purchase after your deposit, and the buyer pays it at settlement.",
  "SA charges the same scaled rates whether you are a first home buyer or not, so most buyers pay full duty on the price.",
  "On a $650,000 home an SA buyer pays $29,580 in transfer duty, an effective rate of about 4.55%.",
  "There is no general stamp duty concession for first home buyers in SA, but a new-home FHB exemption may apply (see below).",
  "Since June 2024 eligible first home buyers who buy or build a NEW home, or buy vacant land, can pay $0 duty with no property value cap.",
  "Rates and thresholds change. Confirm your number with RevenueSA or your conveyancer before you sign.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is-it",     label: "What is stamp duty in SA?" },
  { id: "what-you-pay",   label: "What you'll actually pay" },
  { id: "how-calculated", label: "How SA stamp duty is calculated" },
  { id: "first-home",     label: "First home buyers in SA" },
  { id: "foreign",        label: "Foreign buyers and surcharges" },
  { id: "when-pay",       label: "When do you pay?" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much is stamp duty in SA?",
    answer:
      "It scales with the price. On a $650,000 home an SA buyer pays $29,580 in transfer duty, which works out to an effective rate of about 4.55%. On a $500,000 home it is $21,330, and on an $800,000 home it is $37,830. These are owner-occupier estimates and exclude any foreign surcharge. Use the calculator on this page or the full stamp duty calculator for your exact figure.",
  },
  {
    question: "Do first home buyers pay stamp duty in SA?",
    answer:
      "Usually, yes. South Australia has no general stamp duty concession for first home buyers, so on an established home a first home buyer pays the same full duty as anyone else. The one exception is the new-build path: since June 2024 RevenueSA offers a full stamp duty exemption for eligible first home buyers who buy or build a new home or buy vacant land, with no property value cap. Buy established and you pay full duty. Buy or build new and you may pay $0.",
  },
  {
    question: "When do you pay stamp duty in SA?",
    answer:
      "Stamp duty is generally settled at completion of the transaction, which is usually within about three months of the contract date. In practice your conveyancer or solicitor lodges the documents and arranges payment as part of settlement, so the duty is paid around the same time you take ownership.",
  },
  {
    question: "Can you avoid or reduce stamp duty in SA?",
    answer:
      "There is no general first home buyer concession to lean on, so the main lawful path to a lower bill is the new-home first home buyer exemption. An eligible first home buyer buying or building a new home, or buying vacant land to build on, can pay $0 duty with no value cap. Outside that, your duty is set by the purchase price under the scaled rates. Confirm eligibility with RevenueSA before you rely on a $0 figure.",
  },
  {
    question: "Is SA stamp duty the same for an investment property?",
    answer:
      "For a standard residential purchase the transfer duty is calculated on the purchase price using the same scaled rates whether you live in it or rent it out. The new-home first home buyer exemption does not apply to an investment purchase. If you are a foreign person buying residential property, a 7% foreign ownership surcharge applies on top of the standard duty.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Stamp Duty Calculator",        href: "/stamp-duty-calculator",                  description: "Estimate your SA stamp duty in seconds." },
  { title: "First Home Buyer Guide SA",     href: "/guides/first-home-buyer-sa",             description: "Grants, schemes and the SA buying process." },
  { title: "Buying Property in Australia",  href: "/guides/buying-property-australia",        description: "The complete step-by-step buying process." },
  { title: "How Much Deposit Do You Need?", href: "/guides/how-much-deposit-to-buy-a-house", description: "Deposit, LMI and the schemes that waive it." },
  { title: "Conveyancing in Australia",     href: "/guides/conveyancing-guide",              description: "What conveyancers do and what they cost." },
];

export default function StampDutySAPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Check the current rules with RevenueSA">
        <p>
          SA duty rates, thresholds and the new-home first home buyer
          exemption all change from time to time. Confirm the current detail
          with{" "}
          <a href="https://www.revenuesa.sa.gov.au" target="_blank" rel="noopener noreferrer">
            RevenueSA
          </a>{" "}
          or your conveyancer before you sign a contract.
        </p>
      </Callout>

      <EditorNote>
        <p>
          South Australia is the odd one out. Most states hand first home
          buyers a duty break on any home under a threshold. SA does not. If
          you buy an established home in Adelaide you pay the same duty as an
          investor, full stop. The break SA does give sits entirely on the
          new-build side, so the question that decides your bill here is not
          your income or your price, it is whether the home is new or
          established.
        </p>
      </EditorNote>

      <h2 id="what-is-it">What is stamp duty in SA?</h2>
      <p className="lead">
        Stamp duty, properly called transfer duty, is a state tax on the
        transfer of property. In South Australia it is the biggest upfront
        government cost you face after the deposit itself.
      </p>
      <p>
        The buyer pays it, not the seller, and it falls due around settlement.
        It is charged on the purchase price of the property and rises on a
        scale, so a dearer home carries a higher bill and a higher effective
        rate. RevenueSA collects it, and in practice your conveyancer handles
        the lodgement and payment for you.
      </p>

      <h2 id="what-you-pay">SA stamp duty: what you&rsquo;ll actually pay</h2>
      <p>
        Here is the duty on a range of common Adelaide price points. Because SA
        gives no general first home buyer concession, the standard buyer and
        first home buyer columns read the same.
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
            <td>$16,330 (effective 4.08%)</td>
            <td>$16,330 (no general FHB concession)</td>
          </tr>
          <tr>
            <td>$500,000</td>
            <td>$21,330 (effective 4.27%)</td>
            <td>$21,330 (no general FHB concession)</td>
          </tr>
          <tr>
            <td>$650,000</td>
            <td>$29,580 (effective 4.55%)</td>
            <td>$29,580 (no general FHB concession)</td>
          </tr>
          <tr>
            <td>$800,000</td>
            <td>$37,830 (effective 4.73%)</td>
            <td>$37,830 (no general FHB concession)</td>
          </tr>
          <tr>
            <td>$1,000,000</td>
            <td>$48,830 (effective 4.88%)</td>
            <td>$48,830 (no general FHB concession)</td>
          </tr>
          <tr>
            <td>$1,500,000</td>
            <td>$76,330 (effective 5.09%)</td>
            <td>$76,330 (no general FHB concession)</td>
          </tr>
        </tbody>
      </table>

      <p>
        These are owner-occupier estimates and exclude any foreign surcharge.
        For an exact figure on your own price, run it through the full{" "}
        <Link href="/stamp-duty-calculator">stamp duty calculator</Link>.
      </p>

      <MiniStampDutyEmbed defaultState="SA" />

      <h2 id="how-calculated">How SA stamp duty is calculated</h2>
      <p>
        SA duty is tiered, or marginal. You do not pay one flat percentage on
        the whole price. Instead the price falls into a bracket, and you pay a
        fixed base amount for that bracket plus a marginal rate on the slice of
        the price above the bracket&rsquo;s lower limit. The figures below match
        the rates used by the calculator on this page.
      </p>

      <table>
        <thead>
          <tr>
            <th>Dutiable value</th>
            <th>Duty</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Up to $12,000</td><td>1.00% of the value</td></tr>
          <tr><td>$12,001 to $30,000</td><td>$120 plus 2.00% over $12,000</td></tr>
          <tr><td>$30,001 to $50,000</td><td>$480 plus 3.00% over $30,000</td></tr>
          <tr><td>$50,001 to $100,000</td><td>$1,080 plus 3.50% over $50,000</td></tr>
          <tr><td>$100,001 to $200,000</td><td>$2,830 plus 4.00% over $100,000</td></tr>
          <tr><td>$200,001 to $250,000</td><td>$6,830 plus 4.25% over $200,000</td></tr>
          <tr><td>$250,001 to $300,000</td><td>$8,955 plus 4.75% over $250,000</td></tr>
          <tr><td>$300,001 to $500,000</td><td>$11,330 plus 5.00% over $300,000</td></tr>
          <tr><td>Over $500,000</td><td>$21,330 plus 5.50% over $500,000</td></tr>
        </tbody>
      </table>

      <p>
        Worked example on a $650,000 home: you start at the over-$500,000
        bracket base of $21,330, then add 5.50% on the $150,000 above
        $500,000, which is $8,250. That totals $29,580, the figure in the
        table above.
      </p>

      <h2 id="first-home">First home buyers in SA</h2>
      <p>
        South Australia has no general stamp duty concession for first home
        buyers, so the figures in the tables above are exactly what a first home
        buyer pays on an established home. That is the headline most people get
        wrong about SA.
      </p>
      <p>
        There is one important exception. Since June 2024 RevenueSA offers a
        full stamp duty exemption for eligible first home buyers who buy or
        build a new home, or who buy vacant land to build on, with no property
        value cap. So the path splits cleanly:
      </p>
      <ul>
        <li>
          <strong>Buying an established home:</strong> you pay full duty at the
          rates above. No first home buyer relief on the duty.
        </li>
        <li>
          <strong>Buying or building new, or buying vacant land:</strong> as an
          eligible first home buyer you may pay $0 stamp duty.
        </li>
      </ul>
      <p>
        Confirm your eligibility with RevenueSA, and see{" "}
        <Link href="/guides/first-home-buyer-sa">our SA first home buyer guide</Link>{" "}
        for the full grant and scheme detail.
      </p>

      <h2 id="foreign">Foreign buyers and surcharges</h2>
      <p>
        South Australia applies a 7% foreign ownership surcharge on residential
        property bought by foreign persons. It sits on top of the standard
        stamp duty, so a foreign buyer pays the scaled duty above plus 7% of the
        purchase price as an extra charge. The new-home first home buyer
        exemption does not change this.
      </p>

      <h2 id="when-pay">When do you pay stamp duty in SA?</h2>
      <p>
        Duty is generally due at completion of the transaction, which is usually
        within about three months of the contract date. For most purchases that
        lines up with settlement, when ownership transfers to you.
      </p>
      <p>
        You will rarely arrange the payment yourself. Your conveyancer or
        solicitor lodges the transfer documents and settles the duty as part of
        the settlement process, then it is rolled into the funds that move on
        the day. Budget for it as a settlement cost, not a later bill.
      </p>

      <MatchCTA
        kind="conveyancer"
        lead="Buying in SA and want the costs and the process in one place? The free buying guide covers stamp duty, deposit, conveyancing and a clear step-by-step plan."
        ctaLabel="Get the free buying guide"
        href="/buying-guide"
      />
    </GuideArticleLayout>
  );
}
