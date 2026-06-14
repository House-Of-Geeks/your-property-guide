import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Cooling-Off Period in Victoria (2026)",
  description:
    "The Victorian cooling-off period explained: how long you have, when it applies (and when it doesn't), the penalty if you withdraw, and how it interacts with auctions and Section 32 statements.",
  slug: "cooling-off-period-vic",
  publishedAt: "2026-05-13",
  updatedAt: "2026-05-13",
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
  "Victorian residential cooling-off period is 3 clear business days from the date you sign the contract.",
  "If you withdraw during cooling-off, the seller can keep the lesser of $100 or 0.2% of the purchase price (so $2,000 on a $1M property).",
  "Cooling-off doesn't apply to: auction purchases, purchases within 3 clear business days before or after a publicly advertised auction, sales within 3 days of withdrawal from auction (passed-in), or sales to estate agents and bodies corporate. There are also some exclusions for industrial/business property.",
  "To withdraw, give written notice to the seller or seller's agent before the cooling-off period ends. Don't rely on verbal or last-minute notice.",
  "Cooling-off is independent of subject-to-finance conditions, which can give you a longer withdrawal window in private treaty sales.",
  "Section 32 vendor statement issues that exist at the time of contract can support contract rescission under the Sale of Land Act even outside cooling-off. Talk to your conveyancer.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-it-is",       label: "What cooling-off is in VIC" },
  { id: "how-long",          label: "How long the period is" },
  { id: "exclusions",        label: "When cooling-off doesn't apply" },
  { id: "penalty",           label: "The penalty if you withdraw" },
  { id: "how-to-withdraw",   label: "How to withdraw properly" },
  { id: "auction-context",   label: "Cooling-off and auctions" },
  { id: "section-32",        label: "Section 32 and other rescission rights" },
  { id: "practical-advice",  label: "Practical advice" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the cooling-off period in Victoria?",
    answer:
      "Victorian residential buyers have 3 clear business days from the date the contract is signed (by both buyer and seller) to withdraw without needing to give any reason. The cooling-off period is granted by section 31 of the Sale of Land Act 1962 (Vic). \"Clear business days\" means the day you sign and the day you withdraw are not counted, only the full business days in between.",
  },
  {
    question: "Does cooling-off apply to auction purchases in Victoria?",
    answer:
      "No. Cooling-off does not apply if you bought at a publicly advertised auction. It also doesn't apply if you bought within 3 clear business days before or after the scheduled auction (because those purchases are considered auction-equivalent, and sellers shouldn't be able to lose auction protections through last-minute private negotiation). Auction contracts are unconditional from the fall of the hammer; you can't withdraw.",
  },
  {
    question: "What does it cost to withdraw during cooling-off?",
    answer:
      "The seller can retain the lesser of $100 or 0.2% of the purchase price. On a $500,000 property that's $1,000; on a $1.5M property that's $3,000. The rest of any deposit you've paid must be refunded. The seller cannot pursue other damages provided you've withdrawn within the cooling-off period. The 0.2%/$100 penalty is the full and final cost.",
  },
  {
    question: "How do I withdraw during the cooling-off period?",
    answer:
      "Give written notice to either the seller or the seller's estate agent, before the cooling-off period ends. Email is generally accepted but the safer practice is a signed letter delivered by hand or sent via registered post, and confirmed by email. Don't leave it to the last day; if the notice doesn't reach the seller/agent before the 3-business-day window expires, the contract becomes binding and you've lost the right. Your conveyancer or solicitor handles this for you. Give them notice as soon as you decide to withdraw.",
  },
  {
    question: "Can I extend the cooling-off period?",
    answer:
      "The statutory cooling-off period itself is 3 business days and cannot be unilaterally extended. However, you can negotiate the contract to include additional conditions (subject to finance, subject to building and pest, subject to sale of buyer's existing home, etc.) that effectively give you a longer withdrawal window if those conditions aren't met. These are typically called \"special conditions\" in the contract and are an alternative to (or in addition to) cooling-off. Most private-treaty buyers in Victoria negotiate finance and building-and-pest conditions with their offer.",
  },
  {
    question: "What if I find a problem with the Section 32 after cooling-off ends?",
    answer:
      "Section 32 issues are a separate matter from cooling-off. Under the Sale of Land Act 1962 (Vic) section 32K, if the seller has failed to disclose certain matters that they were legally required to include in the vendor statement, you may have a right to rescind the contract entirely (without the 0.2% penalty) at any time before settlement. Examples: undisclosed encumbrances, planning matters, building permits, owners corporation issues. This is rescission territory; engage your conveyancer immediately if you suspect a Section 32 issue.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Cooling-Off Period by State (national)",  href: "/guides/cooling-off-period-by-state-australia",  description: "Comparison across all Australian states and territories." },
  { title: "Conveyancing Guide",                       href: "/guides/conveyancing-guide",                     description: "What your conveyancer does for you, in Victoria specifically." },
  { title: "Property Auction Guide",                   href: "/guides/property-auction-guide",                 description: "Auction-specific contract behaviour: why no cooling-off applies." },
  { title: "Due Diligence Checklist",                  href: "/guides/due-diligence-checklist-buying-a-house", description: "What to check before signing, the better path than relying on cooling-off." },
  { title: "Buying Property in Australia",             href: "/guides/buying-property-australia",              description: "The full national playbook for buyers." },
];

export default function CoolingOffPeriodVicPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="Cooling-off is a backstop, not a strategy">
        <p>
          The right way to buy property is to do due diligence{" "}
          <em>before</em> signing. The 3-business-day cooling-off period
          gives you a narrow escape hatch, but using it costs you 0.2% of
          the purchase price and you can&rsquo;t reuse it. Treat cooling-off
          as the last-resort exit, not the plan.
        </p>
      </Callout>

      <h2 id="what-it-is">What cooling-off is in VIC</h2>
      <p className="lead">
        Victorian residential property buyers have a statutory right to
        withdraw from a private-treaty contract within 3 clear business
        days of signing, without needing to give the seller any reason.
        The right is granted by section 31 of the Sale of Land Act 1962
        (Vic). It exists because residential property is a large,
        emotionally-charged purchase and buyers sometimes commit before
        they&rsquo;ve had time to think.
      </p>

      <KeyFigure
        value="3 business days"
        label="Victorian residential cooling-off period"
        context="From date of contract signing"
      />

      <h2 id="how-long">How long the period is</h2>
      <p>
        The period is <strong>3 clear business days</strong> from the date
        the contract is signed by both parties. &quot;Clear business
        days&quot; excludes weekends, public holidays, and both the day you
        sign and the day you withdraw.
      </p>
      <p>
        Example: contract signed by both parties on Monday afternoon.
        Cooling-off period runs Tuesday, Wednesday, and Thursday business
        days. Your written notice must be delivered to the seller or
        seller&rsquo;s agent <strong>before the end of business on
        Thursday</strong>. Leave it to Friday morning and the contract is
        binding.
      </p>
      <p>
        If a public holiday falls in the middle (e.g. Melbourne Cup Day),
        that day doesn&rsquo;t count and the period effectively extends by
        a day.
      </p>

      <h2 id="exclusions">When cooling-off doesn&rsquo;t apply</h2>
      <p>
        The Sale of Land Act 1962 lists specific exclusions where cooling-off
        rights do not apply:
      </p>
      <ul>
        <li><strong>Auction purchases</strong>: contracts entered into at a publicly advertised auction.</li>
        <li><strong>Pre-auction and post-auction purchases</strong>: contracts signed within 3 clear business days before or after a publicly advertised auction (preventing sellers from losing auction protections through last-minute private negotiation).</li>
        <li><strong>Passed-in auction sales</strong>: properties passed in at auction then sold within 3 clear business days afterward.</li>
        <li><strong>Estate agent buyers</strong>: contracts where the buyer is a licensed estate agent or a corporate body.</li>
        <li><strong>Commercial / industrial property</strong>: some non-residential property categories.</li>
      </ul>
      <p>
        Residential private-treaty sales not falling into the above
        categories DO have cooling-off rights. The most common buyer
        scenario where cooling-off doesn&rsquo;t apply is auction, and
        auction is also where buyers most need protection, which is why
        thorough pre-auction due diligence matters.
      </p>

      <h2 id="penalty">The penalty if you withdraw</h2>
      <p>
        The seller can keep <strong>the lesser of $100 or 0.2% of the
        purchase price</strong>. On a $500,000 property that&rsquo;s $1,000.
        On a $1.5M property that&rsquo;s $3,000. The rest of any deposit
        you&rsquo;ve paid must be refunded to you within 14 days.
      </p>
      <p>
        Importantly, this 0.2%/$100 penalty is the seller&rsquo;s full and
        final remedy. They cannot pursue you for additional damages for
        withdrawing during cooling-off, even if they had been planning to
        accept a higher offer in the meantime.
      </p>

      <h2 id="how-to-withdraw">How to withdraw properly</h2>
      <p>
        To exercise cooling-off rights, you must give written notice to the
        seller or seller&rsquo;s estate agent before the cooling-off period
        ends. Key practical points:
      </p>
      <ul>
        <li><strong>Written notice only.</strong> Phone calls and verbal statements don&rsquo;t count. Notice can be email or letter.</li>
        <li><strong>Belt and braces.</strong> Best practice: signed letter delivered by hand (with photo evidence) AND email AND registered post.</li>
        <li><strong>Send to the seller or seller&rsquo;s estate agent</strong>. Either is sufficient under the Act, but going via the agent is the easier path because they&rsquo;ll have a process for it.</li>
        <li><strong>Don&rsquo;t leave it to the last day.</strong> If the agent is out of office on Thursday afternoon and your email goes unread until Friday, you&rsquo;ve missed the window.</li>
        <li><strong>Your conveyancer handles this.</strong> Tell your conveyancer immediately when you decide to withdraw; they&rsquo;ll send formal notice on the day they receive instructions.</li>
      </ul>

      <Callout variant="warning" title="The deadline is firm">
        <p>
          The 3-business-day cooling-off period is strictly enforced.
          Notice that arrives one business hour late is too late. Don&rsquo;t
          rely on the seller&rsquo;s good will. If they receive your
          notice on day 4, they&rsquo;re entitled to hold you to the
          contract.
        </p>
      </Callout>

      <h2 id="auction-context">Cooling-off and auctions</h2>
      <p>
        Auction contracts are unconditional from the fall of the hammer.
        There is no cooling-off period and no path to renegotiate or
        withdraw. The exclusion extends 3 business days either side of the
        auction date for purchases of the same property, so you
        can&rsquo;t escape auction terms by negotiating a private sale on
        the auction-day-minus-1 either.
      </p>
      <p>
        This makes pre-auction due diligence (building and pest, contract
        review, finance pre-approval) much more important in Victoria than
        in private treaty. Read our <Link href="/guides/property-auction-guide">property auction guide</Link>{" "}
        and the <Link href="/guides/due-diligence-checklist-buying-a-house">due diligence checklist</Link>.
      </p>

      <h2 id="section-32">Section 32 and other rescission rights</h2>
      <p>
        Cooling-off is one withdrawal mechanism. There are others:
      </p>
      <h3>Section 32 deficiencies</h3>
      <p>
        Under section 32K of the Sale of Land Act 1962, a buyer may rescind
        the contract (at any time before settlement, without the
        cooling-off penalty) if the seller failed to disclose certain
        matters in the Section 32 vendor statement that they were legally
        required to include. Examples: undisclosed encumbrances, planning
        matters, building permits, owners corporation issues, GAIC
        (Growth Areas Infrastructure Contribution) status.
      </p>
      <p>
        This is rescission territory and requires legal advice. If your
        conveyancer finds a material undisclosed matter in the Section 32
        after cooling-off has ended, they may still be able to extract you
        from the contract.
      </p>
      <h3>Special conditions in the contract</h3>
      <p>
        Private treaty contracts often include &quot;subject to&quot;
        conditions: subject to finance, subject to building and pest,
        subject to sale of buyer&rsquo;s existing property. If these
        conditions aren&rsquo;t satisfied by the dates specified, the
        contract terminates and your deposit is refunded, without the
        0.2% penalty. These are an alternative to (or in addition to)
        cooling-off and often give a longer, less penalised withdrawal
        path.
      </p>

      <h2 id="practical-advice">Practical advice</h2>
      <ul>
        <li><strong>Plan to use cooling-off as your last-resort exit only.</strong> Better path: do due diligence before signing.</li>
        <li><strong>Have your conveyancer review the contract and Section 32 the day after you sign</strong>, leaving you 2 business days to act on anything they flag.</li>
        <li><strong>Have a final discussion with your broker</strong> about whether your finance pre-approval is solid for this specific property.</li>
        <li><strong>If you&rsquo;re withdrawing, decide by end of day 2</strong> so day 3 is for executing the notice, not deciding.</li>
        <li><strong>Always use written notice</strong>. Email, signed letter, and registered post. Photograph or scan the proof of delivery.</li>
        <li><strong>Check the contract for any waiver of cooling-off</strong> the seller might have included. Some contracts (rarely) ask buyers to waive cooling-off; don&rsquo;t sign that without legal advice.</li>
      </ul>

      <MatchCTA kind="conveyancer" />

      <Sources items={[
        { label: "Sale of Land Act 1962 (Vic), section 31: cooling-off rights" },
        { label: "Sale of Land Act 1962 (Vic), section 32: vendor statement requirements" },
        { label: "Sale of Land Act 1962 (Vic), section 32K: rescission rights" },
        "Consumer Affairs Victoria, \"Buying a home, cooling off period\" (current 2025).",
        "Law Institute of Victoria, residential conveyancing standards (current).",
      ]} />
    </GuideArticleLayout>
  );
}
