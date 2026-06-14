import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Downsizer's guide to Australian property: super contributions and concessions (2026)",
  description:
    "How the $300,000 downsizer super contribution works, stamp duty concessions, retirement village contracts, CGT, Centrelink implications, and practical considerations.",
  slug: "downsizers-guide",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 7,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "upgrading",
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
  "The Downsizer Super Contribution lets eligible Australians 55+ contribute up to $300,000 per person ($600,000 per couple) from a home sale into super, outside normal contribution caps.",
  "Eligibility: 55+ years old, owned the home for 10+ years, contribution made within 90 days of settlement, one-off only per person.",
  "Several states offer pensioner / senior stamp duty concessions on the new home, but rules vary widely. Verify with the state revenue office before exchanging contracts.",
  "Family home sales are usually CGT-free under the main residence exemption, but partial business or rental use, or foreign residency, can create CGT liabilities.",
  "Sale proceeds become assessable Centrelink assets immediately, potentially reducing Age Pension. A 24-month exemption applies if proceeds are used to buy a new home.",
  "Retirement village contracts often include departure fees of 20% to 30% of the entry price. Always get independent legal advice before signing anything.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is-downsizing",   label: "What downsizing is" },
  { id: "downsizer-super",      label: "The $300k downsizer super contribution" },
  { id: "stamp-duty",           label: "Stamp duty concessions" },
  { id: "first-considerations", label: "Considerations before downsizing" },
  { id: "property-types",       label: "Popular property types" },
  { id: "over-55",              label: "Over-55 lifestyle communities" },
  { id: "retirement-villages",  label: "Retirement village contracts" },
  { id: "cgt",                  label: "CGT and the main residence exemption" },
  { id: "centrelink",           label: "Centrelink implications" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much can I contribute to super when I downsize?",
    answer:
      "Up to $300,000 per person ($600,000 per couple) under the Downsizer Super Contribution scheme. This is on top of, and exempt from, the normal $110,000 a year non-concessional cap. You must be 55+, have owned the home for 10+ years, and make the contribution within 90 days of settlement. It's a one-off contribution, you can only do it once per person.",
  },
  {
    question: "Can both members of a couple make the downsizer contribution?",
    answer:
      "Yes, if both have lived in the home as principal residence for 10+ years and both are 55+, they can each contribute $300,000 ($600,000 total) regardless of which spouse legally owned the property. The 10-year ownership requirement is checked across both partners, not just the legal owner.",
  },
  {
    question: "Will downsizing affect my Age Pension?",
    answer:
      "Possibly, significantly. The family home is assets-test exempt under Centrelink rules, but sale proceeds become assessable assets immediately. A 24-month exemption applies if proceeds are used to buy a new home, but interest earned and any unused proceeds are still deemed. The downsizer super contribution doesn't disappear from the assets test either, it's still counted as an assessable asset under deeming rules.",
  },
  {
    question: "Do I pay CGT on selling my family home?",
    answer:
      "Usually no. The main residence exemption typically eliminates CGT on the sale of your principal residence. Exceptions: if you used part of the home for business or rented out a room or rented the whole property at any time. The six-year absence rule may still preserve full exemption if you moved out and rented for up to six years before selling. Foreign residents lose access to the exemption.",
  },
  {
    question: "Are retirement villages a good financial choice?",
    answer:
      "Often not financially, but lifestyle benefits matter. Retirement village contracts typically include departure fees of 20% to 30% of the entry price (sometimes called Deferred Management Fees), plus capital gain may be retained by the operator, and recurrent charges continue even when you're absent. Independent legal advice from a retirement-village-specialist solicitor is essential before signing.",
  },
  {
    question: "What's the difference between an over-55 community and a retirement village?",
    answer:
      "Over-55 (or land lease) communities offer purpose-built homes for active independent older Australians, typically operating on a land lease model: you own the home, lease the land. Retirement villages are more managed environments often including meals, cleaning and care services, with much more complex contracts and significant departure fees. They serve different stages of retirement.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Sell First or Buy First?",      href: "/guides/sell-first-or-buy-first",           description: "The decision tree before you commit to a sale or purchase order." },
  { title: "Bridging Loans Guide",          href: "/guides/bridging-loans-guide",              description: "How peak debt and end debt work if you go buy-first." },
  { title: "How to Choose a Selling Agent", href: "/guides/how-to-choose-a-selling-agent",     description: "The interview process and the appraisal-price trap to avoid." },
  { title: "Real Estate Agent Fees",        href: "/guides/real-estate-agent-fees-australia",  description: "Selling costs to factor into the downsize maths." },
  { title: "CGT Calculator",                href: "/cgt-calculator",                           description: "Run the CGT scenarios if any business or rental use applied." },
  { title: "Free appraisal",                href: "/appraisal",                                description: "Get a real-world appraisal on the family home before you list." },
];

export default function DownsizersGuidePage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Get specialist advice first">
        <p>
          Superannuation, Centrelink, and taxation rules are complex and
          change regularly. Always seek advice from a licensed financial
          adviser and your accountant before making decisions. Always obtain
          independent legal advice before signing retirement village or
          lifestyle community contracts.
        </p>
      </Callout>

      <h2 id="what-is-downsizing">What downsizing is</h2>
      <p className="lead">
        Downsizing means selling a larger family home and moving to a smaller,
        more manageable property. For many Australians, the family home
        represents their largest financial asset, and downsizing can unlock
        significant capital at a stage of life when income may be reducing
        and retirement is approaching or underway.
      </p>
      <p>Motivations for downsizing include:</p>
      <ul>
        <li>Reducing ongoing costs (rates, maintenance, insurance) of a large property</li>
        <li>Moving to a more accessible property better suited to ageing in place</li>
        <li>Relocating closer to family, healthcare services, or lifestyle amenities</li>
        <li>Freeing up capital to supplement retirement income or contribute to super</li>
        <li>Moving to a retirement community or over-55 lifestyle village</li>
      </ul>
      <p>
        Done well, downsizing can significantly improve financial security and
        quality of life in retirement. Done poorly, particularly with
        retirement village contracts, it can lock homeowners into unfavourable
        financial arrangements that are difficult or costly to reverse.
      </p>

      <h2 id="downsizer-super">The $300k downsizer super contribution</h2>
      <p>
        One of the most powerful financial benefits available to Australian
        downsizers is the <strong>Downsizer Super Contribution</strong>. This
        allows eligible Australians to contribute proceeds from the sale of
        their home into superannuation, outside the normal contribution caps.
      </p>

      <Callout variant="success" title="Downsizer contribution at a glance">
        <p>
          <strong>Maximum.</strong> $300,000 per person ($600,000 per couple).
          <br />
          <strong>Age.</strong> 55 years or older.<br />
          <strong>Ownership.</strong> Must have owned the home for 10+ years.<br />
          <strong>Timing.</strong> Contribution within 90 days of settlement.<br />
          <strong>No work test.</strong> Doesn&rsquo;t apply (unlike other contribution types).<br />
          <strong>No super balance limit.</strong> Existing super balance is not a barrier.<br />
          <strong>Administered by.</strong> ATO. Notify via the ATO form before or when making the contribution.
        </p>
      </Callout>

      <p>
        The downsizer contribution is treated as a non-concessional
        contribution (after-tax) but is exempt from the standard $110,000 a
        year non-concessional contribution cap. This makes it an exceptionally
        powerful super-boosting mechanism for older Australians who may have
        limited other ways to contribute to super.
      </p>

      <KeyFigure
        value="$600k"
        label="Maximum a couple aged 55+ can contribute to super from a single family home sale, regardless of their existing super balance. Outside the normal contribution caps."
        context="Per person $300k, contributions within 90 days of settlement"
      />

      <p>
        Example: a couple aged 62 and 64 sell the family home for $1.2 million.
        They can each contribute $300,000 (total $600,000) into their
        respective super accounts. The contributions are taxed at just 15%
        (or 0% in pension phase) on future earnings, far more tax-effective
        than holding the same funds in their personal names.
      </p>
      <p>Key eligibility rules:</p>
      <ul>
        <li><strong>Both people in a couple qualify</strong> if the home is jointly owned or owned by one partner, both can contribute up to $300,000 each, provided both have lived in the home as their principal residence for at least 10 years.</li>
        <li><strong>Only one downsizer contribution per person.</strong> You can only make a downsizer contribution once in your lifetime.</li>
        <li><strong>The home must be in Australia.</strong></li>
      </ul>
      <p>
        The 90-day rule is critical: the ATO form must be submitted and the
        contribution made within 90 days of receiving the sale proceeds.
        Missing this window means losing the opportunity for that specific
        property sale.
      </p>

      <h2 id="stamp-duty">Stamp duty concessions for downsizers</h2>
      <p>
        Several states and territories offer stamp duty concessions for
        pensioners, seniors, or downsizers. These vary significantly by
        jurisdiction:
      </p>
      <table>
        <thead>
          <tr>
            <th>State / Territory</th>
            <th>Pensioner / senior concession</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>NSW</td><td>No specific senior / downsizer concession on stamp duty</td></tr>
          <tr><td>Victoria</td><td>Pensioner exemption / concession up to 50% off (income and value limits apply)</td></tr>
          <tr><td>Queensland</td><td>Home concession available; limited pensioner concession for eligible buyers</td></tr>
          <tr><td>Western Australia</td><td>Senior, pensioner, and carer concession available (verify with RevWA)</td></tr>
          <tr><td>South Australia</td><td>No specific downsizer concession; verify with RevenueSA</td></tr>
          <tr><td>Tasmania</td><td>Verify with SRO Tasmania</td></tr>
          <tr><td>ACT</td><td>Senior, pensioner, carer concession available; verify at revenue.act.gov.au</td></tr>
          <tr><td>Northern Territory</td><td>Verify with Territory Revenue Office</td></tr>
        </tbody>
      </table>
      <p>
        Always verify current eligibility and amounts with the relevant state
        revenue authority before purchase, as thresholds and eligibility
        criteria change regularly.
      </p>

      <h2 id="first-considerations">Key considerations before you downsize</h2>
      <p>Before committing to downsize, carefully consider:</p>
      <ul>
        <li><strong>Net proceeds after costs.</strong> Selling the family home involves agent commission (typically 1.5 to 2.5%), marketing costs, legal fees, moving costs, and potentially repairs or staging costs. Total selling costs can easily reach 3 to 5% of the sale price on a large property.</li>
        <li><strong>Buying costs.</strong> Stamp duty, legal fees, removalist costs, and any renovation or fit-out of the new property add to the total.</li>
        <li><strong>Lifestyle needs.</strong> Will the smaller property meet your needs for the next 10 to 20 years? Consider accessibility features, proximity to health services, social connections, and public transport.</li>
        <li><strong>Aged care planning.</strong> If full aged care is a possibility in the medium term, the sale proceeds from the family home and subsequent property decisions will affect aged care means testing. Get specialist aged care financial advice.</li>
        <li><strong>Emotional factors.</strong> Leaving the family home can be emotionally significant. Allow adequate time for the decision and involve family where appropriate.</li>
      </ul>

      <h2 id="property-types">Popular property types for downsizers</h2>
      <ul>
        <li><strong>Apartments and units.</strong> Low maintenance, good security, often in desirable inner-city or coastal locations. Strata fees can be significant. Consider the lift situation and accessibility.</li>
        <li><strong>Townhouses.</strong> A balance of house-like space without the large garden. Many are two-storey, check accessibility for future needs.</li>
        <li><strong>Single-level homes.</strong> If remaining in the broader community, a smaller single-level house may offer the best combination of accessibility and space.</li>
        <li><strong>Over-55 lifestyle communities.</strong> Purpose-designed communities offering independent living for active older Australians.</li>
        <li><strong>Retirement villages.</strong> Managed communities with on-site services, typically for those needing more support.</li>
      </ul>

      <h2 id="over-55">Over-55 lifestyle communities</h2>
      <p>
        Over-55 (or land lease) communities are purpose-built for active,
        independent older Australians. They typically offer:
      </p>
      <ul>
        <li>Modern, well-designed homes specifically for older residents</li>
        <li>Community facilities (pool, gym, clubhouse, bowls)</li>
        <li>A social community of similar-aged residents</li>
        <li>Lower purchase prices than surrounding residential property (because you typically pay for the home only, not the land)</li>
      </ul>

      <h3>Land lease vs title ownership</h3>
      <p>
        Many over-55 communities operate on a <strong>land lease</strong>{" "}
        model: you purchase the home (dwelling) but lease the land from the
        operator, paying weekly or monthly site fees. This is fundamentally
        different to owning a freehold property.
      </p>
      <ul>
        <li>Site fees typically increase annually (often CPI-linked) and can become a significant ongoing cost</li>
        <li>The dwelling can be sold, but the buyer also inherits the land lease obligation</li>
        <li>Capital growth on the dwelling may be limited compared to freehold property</li>
        <li>Centrelink assessment of land lease arrangements differs from standard homeownership, seek advice</li>
      </ul>

      <h2 id="retirement-villages">Retirement village contracts: what to watch</h2>
      <p>
        Retirement villages are not the same as over-55 lifestyle communities.
        They are more managed environments, often including meals, cleaning,
        and care services, and typically have far more complex contractual
        arrangements.
      </p>
      <p>
        The most important financial concept to understand is the{" "}
        <strong>departure fee</strong> (also called a deferred management fee
        or DMF):
      </p>
      <ul>
        <li><strong>What it is.</strong> A fee payable to the retirement village operator when you leave, either on departure or death. Typically calculated as a percentage of the entry price or sale price, accruing over the years you were in residence.</li>
        <li><strong>How much.</strong> Departure fees of <strong>20 to 30% of the entry price</strong> are common. In some contracts, the fee continues to accrue until it reaches a cap (e.g. 30% after 10 years). This can significantly reduce the capital available to you or your estate.</li>
        <li><strong>Capital gains.</strong> Many contracts allow the operator to retain all or part of any capital gain on the unit when it is resold, not the resident.</li>
        <li><strong>Recurrent charges.</strong> Ongoing village fees (for maintenance, management, and services) are payable even if you are in hospital or temporarily absent.</li>
      </ul>

      <Callout variant="warning" title="Get retirement-village-specialist legal advice">
        <p>
          Always obtain <strong>independent legal advice</strong> from a
          solicitor who specialises in retirement village contracts before
          signing anything. Do not rely on the village&rsquo;s own
          representatives or generic advice. The financial implications of a
          retirement village contract can be irreversible and long-lasting.
        </p>
      </Callout>

      <h2 id="cgt">CGT and the main residence exemption</h2>
      <p>
        For most Australian downsizers, the sale of the family home is a
        CGT-free event under the <strong>main residence exemption</strong>.
        The capital gain on your principal place of residence is generally
        fully exempt from capital gains tax.
      </p>
      <p>Important exceptions and complexities:</p>
      <ul>
        <li><strong>If part of the home was used for business or investment</strong> (e.g. you rented a room or ran a business from the property), a partial CGT liability may apply.</li>
        <li><strong>Six-year rule.</strong> If you moved out of the family home and rented it for up to 6 years before selling, you may still be fully exempt under the absence rule.</li>
        <li><strong>Foreign residents.</strong> Foreign residents for tax purposes are no longer eligible for the main residence exemption in most cases, seek specialist tax advice.</li>
      </ul>
      <p>
        Consult your accountant to confirm your CGT position before selling,
        particularly if there has been any period of rental or business use.
      </p>

      <h2 id="centrelink">Centrelink implications</h2>
      <p>
        Downsizing can have significant effects on Centrelink pension
        eligibility, primarily through the <strong>assets test</strong>. Key
        points:
      </p>
      <ul>
        <li><strong>The family home is assets-test exempt.</strong> Under Centrelink&rsquo;s assets test, the value of your principal residence does not count toward your assessable assets.</li>
        <li><strong>Sale proceeds are assessable.</strong> When you sell and receive the proceeds, those funds immediately become assessable assets, potentially reducing or eliminating your Age Pension entitlement.</li>
        <li><strong>A 24-month asset test exemption may apply.</strong> Centrelink provides a 24-month assets test exemption on proceeds from selling the principal home if you intend to use the funds to purchase or build a new home. This exemption is time-limited and conditions apply.</li>
        <li><strong>Downsizer contribution to super.</strong> Amounts contributed to super under the downsizer contribution scheme are subject to the deeming rules for Centrelink purposes, they don&rsquo;t disappear from the assets test.</li>
      </ul>
      <p>
        Centrelink rules are complex and interact with each other in
        non-obvious ways. If you currently receive (or are approaching
        eligibility for) the Age Pension, seek specialist Centrelink and aged
        care financial advice before completing a sale.
      </p>
    </GuideArticleLayout>
  );
}
