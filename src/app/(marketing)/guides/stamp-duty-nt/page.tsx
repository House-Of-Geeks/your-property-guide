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
  title: "Stamp Duty NT: Calculator, Rates & Costs (2026)",
  description:
    "Stamp duty in the Northern Territory (NT): the rate table, worked examples, where first home buyers stand, and a free calculator for your exact figure.",
  slug: "stamp-duty-nt",
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
  "Stamp duty is the biggest upfront government cost a Territory buyer faces after the deposit, and the buyer pays it, usually at settlement.",
  "The NT has no general first home buyer stamp duty concession, so first home buyers pay the same duty as everyone else.",
  "A $10,000 First Home Owner Grant is available on new or substantially renovated homes, but it is a cash grant, not a duty discount.",
  "On a $500,000 home the duty works out to $23,929, an effective rate of 4.79%. Above roughly $525,000 the rate flattens to 4.95%.",
  "The NT does not charge a foreign buyer surcharge, which sets it apart from most other states.",
  "Rates and programs change. Check current figures with the Territory Revenue Office before you sign.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is",        label: "What is stamp duty in NT?" },
  { id: "what-you-pay",   label: "What you'll actually pay" },
  { id: "how-calculated", label: "How NT stamp duty is calculated" },
  { id: "first-home",     label: "First home buyers in NT" },
  { id: "foreign-buyers", label: "Foreign buyers and surcharges" },
  { id: "when-pay",       label: "When do you pay?" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much is stamp duty in NT?",
    answer:
      "On a $650,000 home in the Northern Territory, stamp duty comes to $32,175, an effective rate of about 4.95%. The rate scales below roughly $525,000 and then sits flat at 4.95% up to $3 million. A $500,000 home attracts $23,929 (4.79%) and an $800,000 home attracts $39,600. Use the calculator on this page for your exact figure.",
  },
  {
    question: "Do first home buyers pay stamp duty in NT?",
    answer:
      "Yes. The Northern Territory has no general first home buyer stamp duty concession, so a first home buyer pays the same duty as any other buyer at the same price. There is a separate $10,000 First Home Owner Grant for new or substantially renovated homes, but that is a cash grant paid to you, not a reduction in the duty you owe.",
  },
  {
    question: "When do you pay stamp duty in NT?",
    answer:
      "Stamp duty in the NT is generally payable at settlement, and as a rule within around three months of the dutiable transaction. In practice your conveyancer or solicitor arranges the assessment and payment as part of settling the purchase, so the duty is cleared before the title transfers to you.",
  },
  {
    question: "Can you avoid or reduce stamp duty in NT?",
    answer:
      "There is no general way for an owner-occupier to avoid the duty, because the NT has no first home buyer concession. The main relief is the $10,000 First Home Owner Grant on new or substantially renovated homes, which offsets your costs without touching the duty itself. The Territory also runs house-and-land and HomeGrown Territory incentives from time to time, so it is worth checking current programs with the Territory Revenue Office before you buy.",
  },
  {
    question: "Does NT charge a foreign buyer stamp duty surcharge?",
    answer:
      "No. The Northern Territory does not apply a foreign buyer stamp duty surcharge. A foreign purchaser pays the same transfer duty as a local buyer at the same price, unlike NSW, Victoria, Queensland, Western Australia, South Australia and Tasmania, which all add a surcharge.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Stamp Duty Calculator",          href: "/stamp-duty-calculator",                 description: "Estimate your NT stamp duty in seconds." },
  { title: "First Home Buyer Guide NT",      href: "/guides/first-home-buyer-nt",            description: "Grants, schemes and the NT buying process." },
  { title: "Buying Property in Australia",   href: "/guides/buying-property-australia",      description: "The complete step-by-step buying process." },
  { title: "How Much Deposit Do You Need?",  href: "/guides/how-much-deposit-to-buy-a-house", description: "Deposit, LMI and the schemes that waive it." },
  { title: "Conveyancing in Australia",      href: "/guides/conveyancing-guide",             description: "What conveyancers do and what they cost." },
];

export default function StampDutyNTPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Check the current rules before you rely on this">
        <p>
          Stamp duty rates, grants and incentive programs in the Territory get
          updated, sometimes in a budget, sometimes mid-year. Confirm the
          current position with the{" "}
          <a href="https://nt.gov.au/property/home-owner-assistance" target="_blank" rel="noopener noreferrer">
            Territory Revenue Office
          </a>{" "}
          or your conveyancer before you sign a contract.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The Northern Territory is the odd one out. Most states wave some
          stamp duty relief at first home buyers. The NT does not. There is no
          first home concession on the duty at all, so the number a first home
          buyer pays is the same number everyone else pays. The $10,000 grant
          gets a lot of attention, but it lands in your account as cash on a new
          build. It does nothing to the duty bill. Read those two as separate
          things and you will not be caught out at settlement.
        </p>
      </EditorNote>

      <h2 id="what-is">What is stamp duty in NT?</h2>
      <p className="lead">
        Stamp duty, called transfer duty or conveyance duty in the legislation,
        is the tax the Northern Territory charges when property changes hands.
        For most buyers it is the largest upfront government cost after the
        deposit itself.
      </p>
      <p>
        The buyer pays it, not the seller. It is calculated on the dutiable
        value of the property, usually the purchase price, and it is settled as
        part of buying the home, so it falls due at settlement. Because there is
        no first home concession in the Territory, every owner-occupier at a
        given price pays the same duty, which makes the rate table below the
        whole story for most buyers.
      </p>

      <h2 id="what-you-pay">NT stamp duty: what you&rsquo;ll actually pay</h2>
      <p>
        Here is the duty on a range of common purchase prices for an
        owner-occupier. The first home buyer column is identical to the standard
        column on purpose, because the NT has no general first home duty
        concession to apply.
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
          <tr><td>$400,000</td><td>$16,514 (effective 4.13%)</td><td>$16,514 (no general FHB duty concession)</td></tr>
          <tr><td>$500,000</td><td>$23,929 (effective 4.79%)</td><td>$23,929 (no general FHB duty concession)</td></tr>
          <tr><td>$650,000</td><td>$32,175 (effective 4.95%)</td><td>$32,175 (no general FHB duty concession)</td></tr>
          <tr><td>$800,000</td><td>$39,600 (effective 4.95%)</td><td>$39,600 (no general FHB duty concession)</td></tr>
          <tr><td>$1,000,000</td><td>$49,500 (effective 4.95%)</td><td>$49,500 (no general FHB duty concession)</td></tr>
          <tr><td>$1,500,000</td><td>$74,250 (effective 4.95%)</td><td>$74,250 (no general FHB duty concession)</td></tr>
        </tbody>
      </table>

      <p>
        These are owner-occupier estimates and exclude any foreign surcharge,
        which the NT does not levy anyway. For an exact figure on your own price,
        run the numbers through the full{" "}
        <Link href="/stamp-duty-calculator">stamp duty calculator</Link>.
      </p>

      <MiniStampDutyEmbed defaultState="NT" />

      <h2 id="how-calculated">How NT stamp duty is calculated</h2>
      <p>
        The Territory does not use a flat percentage across the board. Below
        about $525,000 the duty is worked out from a formula that rises with the
        value, so the effective rate climbs as the price climbs. Once the price
        passes roughly $525,000 the formula and the flat band meet, and duty is
        charged at a flat percentage of the whole price from there up.
      </p>

      <table>
        <thead>
          <tr>
            <th>Dutiable value</th>
            <th>How duty is worked out</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Up to $525,000</td>
            <td>A scaling formula on the value, so the effective rate rises from low single figures up to 4.95% at the top of the band</td>
          </tr>
          <tr>
            <td>$525,001 to $3,000,000</td>
            <td>A flat 4.95% of the full purchase price</td>
          </tr>
          <tr>
            <td>Over $3,000,000</td>
            <td>A flat 5.95% of the full purchase price</td>
          </tr>
        </tbody>
      </table>

      <p>
        That is why a $400,000 home sits at an effective 4.13% while a $650,000
        home is already at the flat 4.95%. The two halves of the scale join up
        cleanly at the $525,000 mark, so there is no jump at the boundary.
      </p>

      <KeyFigure
        value="4.95%"
        label="The flat rate on most NT homes once the price clears roughly $525,000."
        context="Lower effective rates apply below that, 5.95% applies above $3 million"
      />

      <h2 id="first-home">First home buyers in NT</h2>
      <p>
        This is the part Territory buyers most often get wrong. The Northern
        Territory has no general first home buyer stamp duty concession, so the
        figures in the table above are what every buyer pays, first home or not.
      </p>
      <p>
        What first home buyers can get is a separate{" "}
        <strong>$10,000 First Home Owner Grant</strong> on new or substantially
        renovated homes. It is a cash grant paid to you, not an exemption that
        reduces the duty bill. The NT also runs house-and-land and HomeGrown
        Territory incentives from time to time, so it is worth checking which
        programs are open right now with the Territory Revenue Office before you
        commit.
      </p>
      <p>
        For the full grant and scheme detail, see{" "}
        <Link href="/guides/first-home-buyer-nt">our NT first home buyer guide</Link>.
      </p>

      <MatchCTA
        kind="buyers-agent"
        href="/selling-guide"
        lead="Buying your first place in the Territory and a sale is part of the move? The free selling guide covers costs, timing and selling and buying at once."
        ctaLabel="Get the free guide"
      />

      <h2 id="foreign-buyers">Foreign buyers and surcharges</h2>
      <p>
        The Northern Territory does not apply a foreign buyer stamp duty
        surcharge. A foreign purchaser pays the same transfer duty as a local
        buyer at the same price. That is a real point of difference, because the
        larger states all stack an extra surcharge on top for foreign buyers,
        often in the range of 7% to 8% of the price.
      </p>

      <h2 id="when-pay">When do you pay stamp duty in NT?</h2>
      <p>
        Stamp duty in the Territory is generally payable at settlement, and as a
        rule within around three months of the dutiable transaction. You do not
        usually deal with the Territory Revenue Office yourself. Your conveyancer
        or solicitor handles the assessment and arranges payment as part of
        settling the purchase, so the duty is cleared before the title passes
        into your name. Budget for it alongside your deposit and conveyancing
        costs from the start, because it is due in full at settlement, not over
        time.
      </p>
    </GuideArticleLayout>
  );
}
