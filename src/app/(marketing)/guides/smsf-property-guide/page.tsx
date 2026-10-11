import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { ACT_SOURCE, EM_SOURCE } from "@/lib/data/tax-reform-2027";
import { TAX_RATES_SOURCE } from "@/lib/negative-gearing-calc";

// Schedule 5 of the Treasury Laws Amendment (Tax Reform No. 1) Act 2026, added
// in the Senate, commenced on the 45th day after Royal Assent (26 June 2026).
const LRBA_BAN_START = "10 August 2026";

const ATO_SMSF_TAX = {
  label: "ATO: How SMSFs are taxed",
  href: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/smsf-administration-and-reporting/how-smsfs-are-taxed",
  note: "Last updated 2 April 2025, read 11 October 2026. The 15% rate, the one-third CGT discount after 12 months, exempt current pension income, and 45% for non-complying funds.",
};
const ATO_SMSF_RESTRICTIONS = {
  label: "ATO: What are the SMSF investment restrictions?",
  href: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/smsf-investing/restrictions-on-smsf-investments/what-are-the-smsf-investment-restrictions",
  note: "Last updated 16 September 2025, read 11 October 2026. Buying from related parties (business real property is an exception) and the in-house asset rules.",
};
const ATO_SMSF_VALUATION = {
  label: "ATO: Guide to valuing SMSF assets",
  href: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/smsf-administration-and-reporting/guide-to-valuing-smsf-assets",
  note: "Last updated 15 May 2026, read 11 October 2026.",
};

const FRONTMATTER: GuideFrontmatter = {
  title: "Buying property in an SMSF: complete guide (2026)",
  description:
    "How SMSFs invest in property: the sole purpose test, residential vs commercial rules, the 2026 end of new LRBA loans for homes, costs, tax and the risks.",
  slug: "smsf-property-guide",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-11",
  readingTimeMinutes: 10,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "investing",
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
  "An SMSF can invest in property, but the sole purpose test rules everything: every decision must benefit members' retirement, not provide current personal benefit.",
  "Residential SMSF property cannot be purchased from related parties, occupied by members, or rented to members or relatives. Strict and ATO-monitored.",
  "Commercial property is more flexible: the SMSF can buy from a member's business, and lease it back at market rent. Popular with medical practices, accounting firms, trades.",
  `Since ${LRBA_BAN_START} an SMSF cannot enter a new limited recourse borrowing arrangement (LRBA) to buy residential property, under the Tax Reform No. 1 Act. Loans already in place continue, and business real property can still be bought with an LRBA.`,
  "In accumulation phase the fund pays 15% on rent and, after the one-third discount on an asset held at least 12 months, 10% on capital gains. Income from assets supporting a retirement phase pension is exempt (ATO).",
  "Annual SMSF running costs of $3,000 to $6,000+ make this strategy uneconomic for fund balances below ~$300,000.",
];

const TOC: GuideTOCEntry[] = [
  { id: "can-you-buy",  label: "Can you buy property in an SMSF?" },
  { id: "sole-purpose", label: "The sole purpose test" },
  { id: "residential",  label: "Residential property: strict rules" },
  { id: "commercial",   label: "Commercial property: more flexibility" },
  { id: "lrba",         label: "Borrowing in an SMSF after the 2026 law" },
  { id: "steps",        label: "Steps to buy property in an SMSF" },
  { id: "costs",        label: "Costs of SMSF property ownership" },
  { id: "tax",          label: "Tax advantages" },
  { id: "risks",        label: "Risks and downsides" },
  { id: "who-suits",    label: "Who is SMSF property right for?" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can I live in a property my SMSF owns?",
    answer:
      "No. The sole purpose test prohibits any current personal benefit. SMSF property cannot be occupied by a member of the fund or any of their relatives, even at market rent. The only exception is commercial property, which can be leased to a member's business at arm's length market rates. Breaching this rule can cause the fund to lose its complying status and face significant tax penalties.",
  },
  {
    question: "Can an SMSF still borrow to buy property?",
    answer:
      `Not to buy a home. Since ${LRBA_BAN_START}, section 67A of the SIS Act only allows a new limited recourse borrowing arrangement for real property if it is business real property, broadly land and buildings used wholly and exclusively in a business. An SMSF can still buy residential property with cash it already holds, and loans entered into before ${LRBA_BAN_START}, refinancing of them, and purchases under contracts signed before then continue (Tax Reform No. 1 Act, Schedule 5).`,
  },
  {
    question: "What is an LRBA?",
    answer:
      `A limited recourse borrowing arrangement: the structure an SMSF must use to borrow to buy an asset. The asset is held in a separate holding (bare) trust, and if the fund defaults the lender can only claim against that asset. Once the loan is repaid, the asset can be transferred to the fund. For real property, a new LRBA entered into from ${LRBA_BAN_START} must be for business real property.`,
  },
  {
    question: "What's the minimum SMSF balance for property to make sense?",
    answer:
      "Generally $300,000+. Below that, the fixed running costs ($3,000 to $6,000 a year for accounting, audit, advice, valuations) typically erode returns more than the tax benefits gain. A residential purchase now needs the full price and costs in cash, since a new LRBA can no longer be used for one, plus a buffer for vacancies, repairs and the fund's other obligations.",
  },
  {
    question: "Can I sell my own commercial property to my SMSF?",
    answer:
      "Yes, this is a popular strategy for business owners. The SMSF buys your business premises at independent market valuation, freeing up capital while keeping the property within super. Your business then pays market rent to the SMSF (which is tax-deductible to the business and concessionally taxed in the fund). Residential property cannot be purchased from a related party.",
  },
  {
    question: "What happens to SMSF property tax in pension phase?",
    answer:
      "Income from assets that support a retirement phase pension, including rent and capital gains, is exempt current pension income, so it is not taxed in the fund (ATO). How much can move into retirement phase is limited by the transfer balance cap. This is the most powerful long-term feature of SMSF property and the reason long-term holders favour the structure.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Property Depreciation Guide",   href: "/guides/property-depreciation-guide",        description: "Depreciation works inside an SMSF the same way it does outside it." },
  { title: "Negative Gearing Australia",    href: "/guides/negative-gearing-australia",          description: "Different mechanics inside an SMSF: the deduction is at 15% not your marginal rate." },
  { title: "CGT Calculator",                href: "/cgt-calculator",                              description: "Estimate the CGT on a sale, with the 2027 rules for individuals." },
  { title: "Foreign Buyer FIRB Guide",      href: "/guides/foreign-buyer-firb-guide",            description: "SMSFs with non-resident members face additional FIRB constraints." },
  { title: "Best Suburbs for Investors",    href: "/best-suburbs",                                 description: "Where to apply this strategy in practice." },
  { title: "Buying Property in Australia",  href: "/guides/buying-property-australia",           description: "The general buying process still applies, with additional SMSF-specific steps." },
];

export default function SMSFPropertyGuidePage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="SMSF rules are complex, get specialist advice">
        <p>
          The consequences of non-compliance can be severe, including the
          fund losing its complying status and significant tax penalties.
          Always seek advice from a licensed financial adviser (with SMSF
          specialisation) and a registered SMSF auditor before establishing
          an SMSF or making investment decisions.
        </p>
      </Callout>

      <Callout variant="info" title={`What changed on ${LRBA_BAN_START}`}>
        <p>
          The Treasury Laws Amendment (Tax Reform No. 1) Act 2026, passed on 25 June 2026
          with a Senate amendment adding Schedule 5, changed section 67A of the
          Superannuation Industry (Supervision) Act 1993. A limited recourse borrowing
          arrangement entered into from {LRBA_BAN_START} can only be used to buy real
          property that is business real property. Residential property is out. Arrangements
          entered into before then, refinancing of them, and purchases under a contract
          signed before then are not affected. The same Act leaves super funds outside the
          2027 negative gearing and CGT changes. See{" "}
          <a href="#lrba">borrowing in an SMSF after the 2026 law</a>.
        </p>
      </Callout>

      <h2 id="can-you-buy">Can you buy property in an SMSF?</h2>
      <p className="lead">
        Yes. A self-managed super fund (SMSF) can still buy property that
        passes the sole purpose test, but since {LRBA_BAN_START} it can no
        longer take out a new limited recourse loan to buy residential
        property; loans already in place continue. The Australian Taxation Office (ATO)
        regulates SMSFs and closely scrutinises property investments,
        particularly where a related party (i.e. an SMSF member or their
        family) might benefit personally from the investment.
      </p>
      <p>
        SMSF property investment is popular in Australia because of the tax
        advantages available within the superannuation environment. However,
        it is not suitable for everyone, the compliance obligations, costs,
        and liquidity constraints make it appropriate only for investors with
        clear strategy and adequate fund balances.
      </p>

      <h2 id="sole-purpose">The sole purpose test</h2>
      <p>
        The most fundamental rule governing SMSF investments is the{" "}
        <strong>sole purpose test</strong> (Section 62 of the Superannuation
        Industry (Supervision) Act 1993, the SIS Act). The rule is simple: an
        SMSF must be maintained for the sole purpose of providing retirement
        benefits to its members.
      </p>
      <p>
        Every investment decision must be made solely to benefit members&rsquo;
        retirement interests, not to provide any current benefit to the
        members or their associates. Any property purchased by the SMSF:
      </p>
      <ul>
        <li>Must be purchased at arm&rsquo;s length (at market value)</li>
        <li>Must not be used by a member or their relatives for personal enjoyment</li>
        <li>Must generate a return (rental income) consistent with market rates</li>
        <li>Must be managed solely for the benefit of the fund&rsquo;s retirement purposes</li>
      </ul>
      <p>
        Breaching the sole purpose test, for example, using an SMSF-owned
        beach house for family holidays, is a serious contravention that can
        result in the fund losing its complying status, triggering significant
        tax liabilities.
      </p>

      <h2 id="residential">Residential property: strict rules apply</h2>
      <p>
        An SMSF <strong>can</strong> invest in residential property, but with
        critical restrictions:
      </p>

      <Callout variant="warning" title="Absolute prohibitions for residential SMSF property">
        <p>
          Cannot purchase from a related party (member, family member, business
          associate). Cannot be occupied by a member of the fund. Cannot be
          rented to a member of the fund or their relatives. Cannot be used
          for any personal benefit by a member or their associates.
        </p>
      </Callout>

      <p>
        In practice, this means an SMSF can buy a residential investment
        property and rent it to a third-party tenant at market rates, but the
        member&rsquo;s family cannot live in it (even for a fee), and you
        cannot buy a property currently owned by a fund member.
      </p>
      <p>
        The ATO actively monitors these arrangements, particularly in family
        situations where members may be tempted to use SMSF property for
        personal purposes.
      </p>

      <h2 id="commercial">Commercial property: more flexibility</h2>
      <p>
        Commercial property (offices, warehouses, retail premises, factories)
        within an SMSF has considerably more flexibility than residential
        property:
      </p>
      <ul>
        <li><strong>Can be leased to a related party at market rent.</strong> An SMSF can purchase a commercial property and lease it to the member&rsquo;s own business, at arm&rsquo;s length market rent, and this is one of the most popular SMSF strategies for business owners.</li>
        <li><strong>Can be purchased from a related party.</strong> A member can sell their business premises to their SMSF (at market value, independently valued) and then continue to lease it back from the fund. This sale-and-leaseback strategy can free up business capital while keeping the property within the super environment.</li>
        <li><strong>Must still be at arm&rsquo;s length.</strong> All lease terms must reflect genuine commercial terms, market rent, proper lease documentation, and regular rent reviews.</li>
      </ul>
      <p>
        The commercial property SMSF strategy is particularly popular with
        medical practices, accounting firms, engineering businesses, and trade
        businesses that own their premises.
      </p>

      <h2 id="lrba">Borrowing in an SMSF after the 2026 law</h2>
      <p>
        An SMSF generally cannot borrow. The exception in section 67A of the SIS Act is a{" "}
        <strong>limited recourse borrowing arrangement (LRBA)</strong>: the fund borrows to
        buy a single asset, the asset is held in a separate holding (bare) trust, and if the
        fund defaults the lender can only claim against that asset, not the fund&rsquo;s
        other assets.
      </p>
      <p>
        Schedule 5 of the Tax Reform No. 1 Act added a condition to section 67A(2): where the
        asset is real property, it must be <strong>business real property</strong> within
        the meaning of section 66 of the SIS Act, broadly land and buildings used wholly and
        exclusively in a business. It applies to arrangements entered into on or after{" "}
        {LRBA_BAN_START}, the 45th day after Royal Assent on 26 June 2026. In practice:
      </p>
      <ul>
        <li><strong>A new LRBA for a home or other residential property is no longer available.</strong> An SMSF can still buy residential property, but only with money it already holds.</li>
        <li><strong>Existing loans continue.</strong> An LRBA entered into before {LRBA_BAN_START} is unaffected, and so is a new arrangement that refinances or maintains that borrowing.</li>
        <li><strong>Contracts signed before the start date are protected.</strong> Borrowing for an asset bought under an arrangement entered into before {LRBA_BAN_START} is still allowed, even if settlement happens after it.</li>
        <li><strong>Business real property can still be bought with an LRBA</strong>, such as premises leased to a business, including a member&rsquo;s own business at market rent.</li>
      </ul>
      <p>Where an LRBA is still allowed, the structure requires:</p>
      <ul>
        <li><strong>A separate holding (bare) trust.</strong> The property is held by a bare trustee, often a company set up for the purpose, on behalf of the SMSF, which holds the beneficial interest.</li>
        <li><strong>A lender that offers SMSF loans.</strong> Fewer lenders offer them than standard investment loans; compare the rate, fees and maximum loan-to-value ratio with a broker.</li>
        <li><strong>Transfer once the loan is repaid.</strong> The fund can then take legal title to the property from the holding trust.</li>
      </ul>

      <h2 id="steps">Steps to buy property in an SMSF</h2>
      <ol>
        <li><strong>Establish the SMSF.</strong> If you don&rsquo;t already have one, establish with a corporate trustee (a company as trustee, rather than individual trustees). A corporate trustee is strongly recommended for SMSF property purchases. Cost: $1,000 to $2,500 for establishment.</li>
        <li><strong>Review your SMSF trust deed and investment strategy.</strong> The trust deed must permit investment in property and, for business real property bought with a loan, borrowing under an LRBA. Your investment strategy must explicitly include direct property as a permitted asset class.</li>
        <li><strong>Establish the bare trust (business real property with an LRBA only).</strong> Set up a separate bare trust with a corporate bare trustee to hold the property during the loan period. Your SMSF administrator or lawyer will handle this. Cost: $1,000 to $2,000.</li>
        <li><strong>Confirm how the fund will pay.</strong> For residential property, the fund pays from its own money: a new LRBA has not been available since {LRBA_BAN_START}. For business real property, a lender that offers SMSF loans can provide pre-approval under an LRBA.</li>
        <li><strong>Find and assess the property.</strong> The property must meet the SIS Act requirements. For residential: cannot buy from related parties. For commercial: can buy from a member&rsquo;s business at market value with independent valuation.</li>
        <li><strong>Conduct due diligence.</strong> Building and pest inspection, title search, strata report (if applicable). All standard property due diligence applies, the fact it&rsquo;s in an SMSF doesn&rsquo;t reduce the need for thorough checks.</li>
        <li><strong>Exchange and settle.</strong> With an LRBA the contract is in the name of the bare trustee, not the SMSF; without one, the fund&rsquo;s trustee buys directly. Your SMSF conveyancer or solicitor manages settlement.</li>
        <li><strong>Ongoing compliance.</strong> The SMSF must be audited annually by a registered SMSF auditor, and its assets valued at market value each year for its accounts. The ATO does not require a qualified independent valuer every year, but a previous valuation can only be relied on with other evidence of the current value, and not after a significant event affecting it (ATO guide to valuing SMSF assets).</li>
      </ol>

      <h2 id="costs">Costs of SMSF property ownership</h2>
      <table>
        <thead>
          <tr>
            <th>Cost item</th>
            <th>Typical range</th>
            <th>Frequency</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>SMSF establishment</td><td>$1,500 to $3,000</td><td>One-off</td></tr>
          <tr><td>Bare trust establishment (LRBA, business real property only)</td><td>$1,000 to $2,000</td><td>One-off</td></tr>
          <tr><td>Annual SMSF accounting and tax return</td><td>$1,500 to $3,000</td><td>Annual</td></tr>
          <tr><td>Annual SMSF audit</td><td>$500 to $1,000</td><td>Annual</td></tr>
          <tr><td>Financial advice (SMSF specialist)</td><td>$2,000 to $5,000+</td><td>Setup + ongoing</td></tr>
          <tr><td>Property valuation</td><td>$500 to $1,500</td><td>When a previous valuation can no longer be relied on</td></tr>
        </tbody>
      </table>

      <KeyFigure
        value="$3k–$6k"
        label="Total annual ongoing costs of an SMSF holding a single property. Below ~$300,000 fund balance, these costs erode the tax benefits."
        context="Accounting + audit + advice + valuations"
      />

      <p>
        Total ongoing costs of an SMSF holding a single property typically
        range from $3,000 to $6,000+ per year. This is substantial, and means
        that small SMSF balances will see their returns significantly eroded
        by these fixed costs.
      </p>

      <h2 id="tax">Tax advantages</h2>
      <p>
        The tax treatment of property held within an SMSF is a primary
        motivation for the strategy:
      </p>
      <table>
        <thead>
          <tr>
            <th>Tax event</th>
            <th>SMSF (accumulation)</th>
            <th>SMSF (pension)</th>
            <th>Personal ownership</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Rental income tax</td><td>15%</td><td><strong className="text-success">0%</strong></td><td>Marginal rate (up to 45%, plus the 2% Medicare levy)</td></tr>
          <tr><td>CGT (held under 12 months)</td><td>15%</td><td><strong className="text-success">0%</strong></td><td>Marginal rate</td></tr>
          <tr><td>CGT (held at least 12 months)</td><td>10% (after the one-third discount)</td><td><strong className="text-success">0%</strong></td><td>Half the marginal rate on the gain to 1 July 2027; indexation and a 30% minimum on the gain after it</td></tr>
        </tbody>
      </table>

      <p>
        The 0% tax in pension phase is perhaps the most powerful feature.
        Income from assets that support a retirement phase pension, rent and
        capital gains included, is exempt current pension income, so it is not
        taxed in the fund (ATO). How much can move into retirement phase is
        limited by the transfer balance cap.
      </p>
      <p>
        Even in accumulation phase, the 15% rate is well below personal rates.
        With a taxable income of $150,000, the next dollar of rent is taxed at
        37% in 2026&ndash;27 plus the 2% Medicare levy ({TAX_RATES_SOURCE.dated});
        in the fund it is taxed at 15%, 22 percentage points less before the levy.
      </p>
      <p>
        The 2026 tax reform leaves super funds where they were. The 50% CGT
        discount&rsquo;s replacement from 1 July 2027 applies to individuals,
        trusts and partnerships; super funds keep their one-third discount
        (explanatory memorandum). And complying super funds, including SMSFs,
        are excluded from the negative gearing change (section 26-155(4) of the
        Income Tax Assessment Act 1997), so a loss on a fund&rsquo;s residential
        property still reduces the fund&rsquo;s other taxable income. Our article on{" "}
        <Link href="/guides/cgt-changes-2026-budget">how the CGT change works from 1 July 2027</Link>{" "}
        covers the rules for individuals.
      </p>

      <h2 id="risks">Risks and downsides</h2>
      <ul>
        <li><strong>Liquidity risk.</strong> Property cannot be sold in parts. If the SMSF needs to make pension payments and cash is tight, the entire property may need to be sold, potentially at an inopportune time.</li>
        <li><strong>Concentration risk.</strong> If property represents most of the SMSF&rsquo;s assets, the fund is undiversified. A property market downturn or extended vacancy can severely impact members&rsquo; retirement savings.</li>
        <li><strong>Fewer ways to fund a purchase.</strong> A residential purchase can no longer be funded with a new LRBA, so the fund must hold the full price and costs in cash. Where borrowing is still allowed, for business real property, fewer lenders offer SMSF loans.</li>
        <li><strong>Compliance complexity.</strong> SMSFs have extensive compliance obligations. A breach, even an inadvertent one, can result in heavy penalties and the fund losing its complying status (effectively being taxed at 45%).</li>
        <li><strong>Cannot access equity.</strong> An SMSF cannot draw on a property&rsquo;s equity for further borrowing, and under an LRBA the property must be held as a single asset.</li>
        <li><strong>Costs erode returns for small balances.</strong> SMSF running costs of $3,000 to $6,000 a year can significantly reduce net returns for funds under $300,000.</li>
      </ul>

      <h2 id="who-suits">Who is SMSF property right for?</h2>
      <p>SMSF property investment is typically most appropriate for:</p>
      <ul>
        <li><strong>SMSF balances of $300,000+.</strong> Below this level, the fixed costs of running an SMSF likely outweigh the tax benefits relative to a retail or industry super fund.</li>
        <li><strong>Business owners wanting to buy commercial premises.</strong> The ability to lease business real property back to your own business at market rates is a distinctive SMSF strategy, and it is the one kind of real property an SMSF can still borrow to buy.</li>
        <li><strong>Investors approaching retirement.</strong> The zero-tax pension phase benefit is most valuable for investors with a medium-term horizon before retirement.</li>
        <li><strong>High-income earners.</strong> The gap between the 45% top rate (plus the Medicare levy) and the fund&rsquo;s 15% rate is widest for higher-income individuals.</li>
        <li><strong>Property-focused investors.</strong> Those who have a strong conviction about property as an asset class and want to hold it within their super portfolio.</li>
      </ul>

      <Sources
        items={[
          { ...ACT_SOURCE, note: `${ACT_SOURCE.note} Schedule 5 (limited recourse borrowing, section 67A of the SIS Act) commenced on ${LRBA_BAN_START}. Read 10 October 2026.` },
          { ...EM_SOURCE, note: `${EM_SOURCE.note} The 33.3% discount for super funds is kept, and complying super funds are outside the negative gearing change. Read 10 October 2026.` },
          ATO_SMSF_TAX,
          ATO_SMSF_RESTRICTIONS,
          ATO_SMSF_VALUATION,
          { label: TAX_RATES_SOURCE.name, href: TAX_RATES_SOURCE.url, note: `${TAX_RATES_SOURCE.dated}, read 10 October 2026.` },
          "The cost ranges are indicative figures, not quotes: ask your SMSF administrator, auditor and adviser for theirs.",
        ]}
      />
    </GuideArticleLayout>
  );
}
