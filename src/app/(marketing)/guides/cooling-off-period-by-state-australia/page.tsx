import type { Metadata } from "next";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  GuideSuburbSearch,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Cooling-Off Period by State: How Long You Have to Pull Out (Australia 2026)",
  description:
    "Cooling-off periods on Australian property purchases vary by state, from 0 days at auction in Tasmania to 5 days in NSW. Full state-by-state table, how to waive, and how to use it well.",
  slug: "cooling-off-period-by-state-australia",
  publishedAt: "2026-05-06",
  updatedAt: "2026-05-06",
  readingTimeMinutes: 7,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "first-home",
};

export const metadata: Metadata = {
  title: `${FRONTMATTER.title} | ${SITE_NAME}`,
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
  "Cooling-off periods let a buyer rescind a private treaty contract within a defined window after exchange — typically 3 to 5 business days.",
  "Auction purchases have no cooling-off in any state. Once the hammer drops, the contract is binding immediately.",
  "Withdrawing during cooling-off costs you a small penalty — typically 0.2% to 0.25% of the purchase price (e.g. $1,500 on a $700K home in NSW).",
  "Queensland, NSW, Victoria, and SA have cooling-off rights for private treaty buyers. Western Australia and Tasmania do not have a statutory cooling-off period.",
  "You can waive cooling-off (NSW: with a Section 66W certificate). Sellers often request this to firm up the deal.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-it-is",      label: "What cooling-off actually is" },
  { id: "by-state",        label: "Cooling-off by state" },
  { id: "auction",         label: "Auction has no cooling-off" },
  { id: "waiving",         label: "Waiving cooling-off" },
  { id: "how-to-use",      label: "How to use it well" },
  { id: "what-it-costs",   label: "What it costs to pull out" },
  { id: "next-steps",      label: "Next steps" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can a seller pull out during my cooling-off period?",
    answer:
      "Generally no — the cooling-off right belongs to the buyer, not the seller. Once contracts are exchanged, the seller is bound. The exception is rare: certain conditional terms in the contract may allow the seller to terminate.",
  },
  {
    question: "Do I get my deposit back if I pull out?",
    answer:
      "You get most of it back. A small penalty (typically 0.2% to 0.25% of the purchase price) is forfeited to the seller. On a $700,000 NSW home, that's roughly $1,500. The balance of any deposit paid is refunded within a few business days.",
  },
  {
    question: "When does the cooling-off clock start?",
    answer:
      "It starts the day contracts are exchanged (when both parties have signed and the contracts are dated). The end date is calculated in business days, not calendar days — Saturdays, Sundays, and public holidays don't count.",
  },
  {
    question: "Can I extend the cooling-off period?",
    answer:
      "Yes, by mutual agreement with the seller. Common reasons: a building inspection runs longer than expected, finance pre-approval needs to be re-confirmed at the actual loan amount, or strata records need to be reviewed. Get any extension in writing through your conveyancer.",
  },
  {
    question: "What if I find a major issue during cooling-off?",
    answer:
      "You have two paths. Pull out (lose the small penalty) or use the leverage to renegotiate. A genuine structural defect, undisclosed easement, or significant pest finding often gives buyers a strong case to ask for a price reduction or repairs before settlement.",
  },
  {
    question: "Why doesn't WA have a cooling-off period?",
    answer:
      "Western Australia and Tasmania historically rely on \"contracts subject to building inspection / finance / etc.\" being negotiated upfront, before signing. The contract is then conditional rather than wrapped in a separate cooling-off window. The practical protection is similar but it depends on your conveyancer including the right conditions in the offer.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Conveyancing Guide", href: "/guides/conveyancing-guide", description: "What your conveyancer or solicitor does between offer and settlement." },
  { title: "Building & Pest Inspection", href: "/guides/building-pest-inspection", description: "What to look for and when to commission the report." },
  { title: "Property Auction Guide", href: "/guides/property-auction-guide", description: "Auctions skip cooling-off entirely — the playbook for buying at one." },
  { title: "Buying Property in Australia", href: "/guides/buying-property-australia", description: "End-to-end overview of the Australian buying process." },
  { title: "Stamp Duty Calculator", href: "/stamp-duty-calculator", description: "Estimate your stamp duty before signing the contract." },
];

export default function CoolingOffPeriodByStateGuide() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="Cooling-off is a buyer protection, not a free option">
        <p>
          The cooling-off period exists to give buyers a chance to commission
          inspections, finalise finance, and re-read the contract carefully.
          It's not a "test drive" — pulling out costs a small penalty and
          burns trust with the seller and agent.
        </p>
      </Callout>

      <h2 id="what-it-is">What cooling-off actually is</h2>
      <p className="lead">
        After you exchange contracts on a private treaty (non-auction) property
        purchase, most Australian states give the buyer a short statutory
        window to rescind the contract. If you pull out within the window, you
        forfeit a small penalty but get the rest of your deposit back. After
        the window closes, the contract is unconditionally binding.
      </p>

      <h2 id="by-state">Cooling-off by state (2026)</h2>

      <h3>New South Wales</h3>
      <p>
        <strong>5 business days</strong> for residential property purchases.
        Penalty for rescission: 0.25% of the purchase price. Can be waived
        with a Section 66W certificate from the buyer's solicitor or
        conveyancer.
      </p>

      <h3>Victoria</h3>
      <p>
        <strong>3 business days</strong> for residential property purchases.
        Penalty: 0.2% of the purchase price (or $100, whichever is greater).
        Doesn't apply to auctions, properties bought within 3 days of an
        auction, or to commercial / industrial property.
      </p>

      <h3>Queensland</h3>
      <p>
        <strong>5 business days</strong> for residential property purchases.
        Penalty: 0.25% of the purchase price. Doesn't apply to auctions.
        Buyer must receive a clear cooling-off statement before exchange or
        the period extends.
      </p>

      <h3>South Australia</h3>
      <p>
        <strong>2 clear business days</strong> after the buyer receives a
        signed copy of the contract (and the prescribed Form 1 vendor's
        statement). No penalty for rescission in SA — full deposit refund.
      </p>

      <h3>Australian Capital Territory</h3>
      <p>
        <strong>5 business days</strong> for residential property. Penalty:
        0.25% of the purchase price.
      </p>

      <h3>Northern Territory</h3>
      <p>
        <strong>4 business days</strong> for residential property. No statutory
        penalty in the NT — though forfeiture terms can be written into the
        contract.
      </p>

      <h3>Western Australia</h3>
      <p>
        <strong>No statutory cooling-off period</strong>. Buyers protect
        themselves through contract conditions (subject to finance, subject
        to building inspection, subject to strata report, etc.) negotiated
        before signing.
      </p>

      <h3>Tasmania</h3>
      <p>
        <strong>No statutory cooling-off period</strong>. As in WA, protection
        comes from conditions written into the contract before signing.
      </p>

      <KeyFigure
        value="0 to 5 business days"
        label="Cooling-off range across Australian states"
        context="0 days at auction in any state, 0 days for any private treaty purchase in WA or Tasmania."
      />

      <h2 id="auction">Auction has no cooling-off — anywhere</h2>
      <p>
        When the hammer falls at a public auction, the contract is binding
        immediately and unconditionally. There's no cooling-off in any
        Australian state for auction purchases. This is why pre-auction due
        diligence (building &amp; pest, contract review, finance approval)
        has to happen before auction day, not after.
      </p>

      <Callout variant="warning" title="Pre-auction offers are often treated as auction sales">
        <p>
          If you make an offer in the days leading up to the auction and it's
          accepted, some states (notably Victoria) will treat it as an auction
          sale and waive your cooling-off rights. Always confirm with your
          conveyancer before signing a pre-auction contract.
        </p>
      </Callout>

      <h2 id="waiving">Waiving cooling-off</h2>
      <p>
        Sellers often ask the buyer to waive cooling-off to firm up the deal —
        especially in hot markets or when there are competing offers.
        Waiving is legally enforceable but strips your protection.
      </p>
      <p>
        In NSW, waiving is done via a Section 66W certificate signed by the
        buyer's solicitor or conveyancer. Don't sign one until you've completed
        building &amp; pest inspections and unconditional finance approval —
        otherwise you've taken on the same risks as an auction buyer with none
        of the auction discipline.
      </p>

      <h2 id="how-to-use">How to use cooling-off well</h2>
      <ol>
        <li>
          <strong>Commission inspections immediately.</strong> Building &amp;
          pest takes 1 to 3 business days; strata report (for apartments)
          takes 2 to 4. Order on day one.
        </li>
        <li>
          <strong>Re-confirm finance.</strong> Pre-approval is conditional.
          Send the contract to your broker or lender for unconditional
          approval at the actual loan amount.
        </li>
        <li>
          <strong>Re-read the contract.</strong> Ask your conveyancer about
          easements, covenants, special conditions, and chattel inclusions.
        </li>
        <li>
          <strong>Negotiate, don't pull out.</strong> If an inspection turns
          up issues, use them to renegotiate price or repairs rather than
          rescinding outright.
        </li>
      </ol>

      <h2 id="what-it-costs">What it costs to pull out</h2>
      <p>
        State-by-state penalty as a percentage of the purchase price:
      </p>
      <ul>
        <li>NSW: 0.25% (e.g. $1,750 on $700,000)</li>
        <li>VIC: 0.2% (e.g. $1,400 on $700,000)</li>
        <li>QLD: 0.25% (e.g. $1,750 on $700,000)</li>
        <li>SA: $0 statutory penalty</li>
        <li>ACT: 0.25%</li>
        <li>NT: $0 statutory penalty (contract terms may apply)</li>
      </ul>
      <p>
        These penalties are forfeited to the seller. The rest of any deposit
        you've paid is refunded, typically within a few business days.
      </p>

      <GuideSuburbSearch
        title="Researching a specific suburb before signing?"
        subtitle="Pull median, growth, schools, walkability and hazard for any suburb you're considering — all on one page."
      />

      <h2 id="next-steps">Next steps</h2>
      <ol>
        <li>
          Confirm your state's cooling-off window with your conveyancer before
          exchange.
        </li>
        <li>
          Read the{" "}
          <a href="/guides/building-pest-inspection">
            building &amp; pest inspection guide
          </a>{" "}
          and book the inspection for the day after exchange.
        </li>
        <li>
          Re-confirm finance approval at the actual loan amount within the
          cooling-off window.
        </li>
        <li>
          Read the{" "}
          <a href="/guides/conveyancing-guide">conveyancing guide</a> for what
          your conveyancer is doing in parallel.
        </li>
      </ol>
    </GuideArticleLayout>
  );
}
