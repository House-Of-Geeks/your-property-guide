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
  title: "Stamp Duty QLD: Calculator, Rates & First Home Buyer Concessions (2026)",
  description:
    "Stamp duty in Queensland (QLD): the full rates table, worked examples by price, where first home buyers pay $0, and a free calculator for your exact figure.",
  slug: "stamp-duty-qld",
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
  "Stamp duty (transfer duty) in QLD is paid by the buyer at settlement and is your biggest upfront cost after the deposit.",
  "A standard owner-occupier pays about $22,275 on a $650,000 home and $38,025 on a $1,000,000 home.",
  "Queensland's first home concession gives eligible first home buyers a full concession up to $700,000, phasing out to $800,000.",
  "Above $800,000 a first home buyer pays standard duty with no concession. On an $800,000 buy that's $29,025.",
  "Foreign buyers pay an extra 8% additional foreign acquirer duty (AFAD) on top of standard transfer duty.",
  "Rates and thresholds change. Check the Queensland Revenue Office or your conveyancer before you rely on a figure.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is",      label: "What is stamp duty in QLD?" },
  { id: "what-you-pay", label: "What you'll actually pay" },
  { id: "how-calc",     label: "How QLD stamp duty is calculated" },
  { id: "first-home",   label: "First home buyers in QLD" },
  { id: "foreign",      label: "Foreign buyers and surcharges" },
  { id: "when-pay",     label: "When do you pay stamp duty?" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much is stamp duty in QLD?",
    answer:
      "For a standard owner-occupier, transfer duty on a $650,000 home in Queensland is about $22,275, an effective rate of roughly 3.43%. On a $500,000 home it is about $15,925, and on a $1,000,000 home it is about $38,025. These are owner-occupier estimates that exclude any foreign surcharge. Run your own price through the calculator on this page for a closer figure.",
  },
  {
    question: "Do first home buyers pay stamp duty in QLD?",
    answer:
      "Eligible first home buyers get a full concession up to $700,000, so they pay $0 transfer duty at or below that price. Between $700,000 and $800,000 the concession phases out, and above $800,000 standard duty applies with no concession. So a first home buyer paying $650,000 pays nothing, while one paying $800,000 pays the full $29,025.",
  },
  {
    question: "When do you pay stamp duty in QLD?",
    answer:
      "Transfer duty in Queensland is generally payable within about three months of the liability date, which for most purchases is the date you sign the contract, and it is settled at or before settlement. In practice your conveyancer or solicitor calculates the duty and arranges payment as part of settlement, so you rarely deal with the Queensland Revenue Office directly.",
  },
  {
    question: "Can you avoid or reduce stamp duty in QLD?",
    answer:
      "You can't avoid transfer duty entirely on a standard purchase, but eligible first home buyers can reduce it to $0 on a home up to $700,000 through the first home concession, with a partial concession up to $800,000. There is also a separate first home vacant land concession up to $500,000. Beyond those, the duty is a fixed cost set by the price you pay, so the main lever is buying under a concession threshold.",
  },
  {
    question: "Does buying off the plan change stamp duty in QLD?",
    answer:
      "Off-the-plan buying does not get its own blanket duty discount in Queensland the way it does in some states, but the same first home concession thresholds still apply if you qualify. The figures on this page are owner-occupier estimates on the purchase price. For an off-the-plan contract, confirm the dutiable value and timing with your conveyancer or the Queensland Revenue Office.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Stamp Duty Calculator",          href: "/stamp-duty-calculator",                  description: "Estimate your QLD stamp duty in seconds." },
  { title: "First Home Buyer Guide QLD",      href: "/guides/first-home-buyer-qld",            description: "Grants, schemes and the QLD buying process." },
  { title: "Buying Property in Australia",    href: "/guides/buying-property-australia",       description: "The complete step-by-step buying process." },
  { title: "How Much Deposit Do You Need?",   href: "/guides/how-much-deposit-to-buy-a-house", description: "Deposit, LMI and the schemes that waive it." },
  { title: "Conveyancing in Australia",       href: "/guides/conveyancing-guide",              description: "What conveyancers do and what they cost." },
];

export default function StampDutyQLDPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Check the Queensland Revenue Office before you rely on this">
        <p>
          Transfer duty rates, concession thresholds and eligibility rules
          change, and Queensland updated its first home concession in 2024.
          Confirm current figures with the{" "}
          <a href="https://qro.qld.gov.au" target="_blank" rel="noopener noreferrer">
            Queensland Revenue Office
          </a>{" "}
          or your conveyancer before you sign a contract.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The thing that catches Queensland buyers out is the $800,000 cliff on
          the first home concession. Up to $700,000 an eligible first home buyer
          pays nothing. Push to $801,000 and the concession is gone entirely,
          not just trimmed, so you go from $0 to the full $29,025. If you&rsquo;re
          a first home buyer hovering near that line, the difference between an
          offer of $795,000 and $805,000 is a lot more than ten grand once duty
          is counted.
        </p>
      </EditorNote>

      <h2 id="what-is">What is stamp duty in QLD?</h2>
      <p className="lead">
        Stamp duty, officially called transfer duty in Queensland, is a state
        tax you pay when ownership of a property changes hands. It&rsquo;s the
        biggest upfront government cost in a purchase after your deposit, and on
        a typical home it runs to tens of thousands of dollars.
      </p>
      <p>
        The buyer pays it, not the seller, and it&rsquo;s normally settled at or
        before settlement rather than spread over time. The amount is worked out
        from the price you pay (or the property&rsquo;s value, if that&rsquo;s
        higher), which is why it&rsquo;s worth knowing your number before you set
        a budget. Get the duty wrong and your real cash-to-buy figure is wrong
        too.
      </p>

      <h2 id="what-you-pay">QLD stamp duty: what you&rsquo;ll actually pay</h2>
      <p>
        Here&rsquo;s what transfer duty looks like across a range of Queensland
        prices, for a standard owner-occupier and for an eligible first home
        buyer side by side.
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
            <td>$12,425 (effective 3.11%)</td>
            <td>$0 (saves $12,425)</td>
          </tr>
          <tr>
            <td>$500,000</td>
            <td>$15,925 (effective 3.19%)</td>
            <td>$0 (saves $15,925)</td>
          </tr>
          <tr>
            <td>$650,000</td>
            <td>$22,275 (effective 3.43%)</td>
            <td>$0 (saves $22,275)</td>
          </tr>
          <tr>
            <td>$800,000</td>
            <td>$29,025 (effective 3.63%)</td>
            <td>$29,025 (no concession (concession ends $800k))</td>
          </tr>
          <tr>
            <td>$1,000,000</td>
            <td>$38,025 (effective 3.8%)</td>
            <td>$38,025 (no concession)</td>
          </tr>
          <tr>
            <td>$1,500,000</td>
            <td>$66,775 (effective 4.45%)</td>
            <td>$66,775 (no concession)</td>
          </tr>
        </tbody>
      </table>

      <p>
        These are owner-occupier estimates and exclude any foreign surcharge. For
        an exact figure on your price, use the full{" "}
        <Link href="/stamp-duty-calculator">stamp duty calculator</Link>.
      </p>

      <MiniStampDutyEmbed defaultState="QLD" />

      <h2 id="how-calc">How QLD stamp duty is calculated</h2>
      <p>
        Queensland transfer duty is tiered, also called marginal. You don&rsquo;t
        pay one flat percentage on the whole price. Instead each slice of the
        price is taxed at its own rate, and the bands stack. The brackets below
        are the ones the calculator on this page uses for an owner-occupier
        home.
      </p>

      <table>
        <thead>
          <tr>
            <th>Dutiable value</th>
            <th>Duty</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Up to $5,000</td>
            <td>Nil</td>
          </tr>
          <tr>
            <td>$5,000 to $75,000</td>
            <td>1.5% of the amount over $5,000</td>
          </tr>
          <tr>
            <td>$75,000 to $540,000</td>
            <td>$1,050 plus 3.5% of the amount over $75,000</td>
          </tr>
          <tr>
            <td>$540,000 to $1,000,000</td>
            <td>$17,325 plus 4.5% of the amount over $540,000</td>
          </tr>
          <tr>
            <td>Over $1,000,000</td>
            <td>$38,025 plus 5.75% of the amount over $1,000,000</td>
          </tr>
        </tbody>
      </table>

      <p>
        So on a $650,000 home you pay the fixed $17,325 for the band up to
        $540,000, then 4.5% on the remaining $110,000, which lands at $22,275.
        Because the higher rates only ever apply to the top slice, the effective
        rate creeps up slowly as prices rise rather than jumping.
      </p>

      <h2 id="first-home">First home buyers in QLD</h2>
      <p>
        Queensland&rsquo;s first home concession (with rates updated 9 May 2024)
        is the big saving for eligible buyers. It gives a full concession up to
        $700,000, then phases out to $800,000. Above $800,000 standard duty
        applies with no first home discount at all.
      </p>

      <KeyFigure
        value="$0 to $700,000"
        label="An eligible QLD first home buyer pays no transfer duty up to $700,000."
        context="Phasing out to $800,000, then standard duty applies"
      />

      <ul>
        <li>
          <strong>Full concession up to $700,000:</strong> an eligible first home
          buyer pays $0 transfer duty.
        </li>
        <li>
          <strong>Phase-out $700,000 to $800,000:</strong> the concession reduces
          on a sliding scale as the price rises.
        </li>
        <li>
          <strong>Above $800,000:</strong> no first home concession, so standard
          duty applies in full.
        </li>
        <li>
          <strong>First home vacant land concession:</strong> a separate
          concession applies on eligible vacant land up to $500,000 if
          you&rsquo;re building your first home.
        </li>
        <li>
          <strong>First Home Owner Grant:</strong> a cash grant is available on
          new builds, separate from the duty concession.
        </li>
      </ul>
      <p>
        For the full grant amounts, scheme detail and eligibility rules, see{" "}
        <Link href="/guides/first-home-buyer-qld">our QLD first home buyer guide</Link>.
      </p>

      <h2 id="foreign">Foreign buyers and surcharges</h2>
      <p>
        Queensland charges foreign buyers an extra 8% additional foreign acquirer
        duty (AFAD) on residential property, on top of the standard transfer
        duty. So a foreign person buying a $650,000 home pays the standard
        $22,275 plus a $52,000 surcharge. The first home concession does not
        apply to foreign acquirers, so the AFAD effectively doubles the cost of
        entry for many overseas buyers.
      </p>

      <h2 id="when-pay">When do you pay stamp duty in QLD?</h2>
      <p>
        Transfer duty in Queensland is generally payable within about three
        months of the liability date, which for most purchases is when you sign
        the contract. In practice it&rsquo;s settled at or before settlement, and
        your conveyancer or solicitor handles the calculation and payment as part
        of completing the purchase. You rarely deal with the Queensland Revenue
        Office yourself, but the money still has to be ready, so build it into
        your cash-to-buy alongside the deposit and conveyancing costs.
      </p>

      <MatchCTA kind="buyers-agent" />
    </GuideArticleLayout>
  );
}
