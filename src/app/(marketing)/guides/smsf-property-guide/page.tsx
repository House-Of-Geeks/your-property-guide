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
  title: "Buying property in an SMSF: complete guide (2026)",
  description:
    "How SMSFs invest in property: the sole purpose test, residential vs commercial rules, LRBA borrowing, costs, tax advantages including 0% in pension phase, and the risks.",
  slug: "smsf-property-guide",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
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
  "Borrowing requires a Limited Recourse Borrowing Arrangement (LRBA) with a separate bare trust. SMSF loans typically cost 1.5% to 2.5% above standard investment rates.",
  "Tax in pension phase is 0% on rental income and capital gains. In accumulation phase, 15% on rent and 10% on capital gains held over 12 months.",
  "Annual SMSF running costs of $3,000 to $6,000+ make this strategy uneconomic for fund balances below ~$300,000.",
];

const TOC: GuideTOCEntry[] = [
  { id: "can-you-buy",  label: "Can you buy property in an SMSF?" },
  { id: "sole-purpose", label: "The sole purpose test" },
  { id: "residential",  label: "Residential property: strict rules" },
  { id: "commercial",   label: "Commercial property: more flexibility" },
  { id: "lrba",         label: "Borrowing in an SMSF: LRBA explained" },
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
    question: "What is an LRBA?",
    answer:
      "Limited Recourse Borrowing Arrangement. It's the specific structure SMSFs must use to borrow for property. The property is held in a separate bare trust (with a separate bare trustee company), and the lender's recourse on default is limited to that specific asset. Setup involves the SMSF, the bare trust, and an SMSF-specialist lender. Once the loan is repaid, title transfers from the bare trust to the SMSF.",
  },
  {
    question: "How much do SMSF loans cost compared to normal investment loans?",
    answer:
      "Typically 1.5% to 2.5% above standard investment loan rates. Not all major banks offer SMSF loans; specialist lenders include Latrobe Financial, Liberty, and various non-bank lenders. LVR is typically capped at 70% to 80%. The higher rate reflects the limited-recourse risk to the lender.",
  },
  {
    question: "What's the minimum SMSF balance for property to make sense?",
    answer:
      "Generally $300,000+. Below that, the fixed running costs ($3,000 to $6,000 a year for accounting, audit, advice, valuations) typically erode returns more than the tax benefits gain. For purchasing property with an LRBA, you usually need at least 30% of the property value in the SMSF as deposit, plus ongoing buffer for repayments.",
  },
  {
    question: "Can I sell my own commercial property to my SMSF?",
    answer:
      "Yes, this is a popular strategy for business owners. The SMSF buys your business premises at independent market valuation, freeing up capital while keeping the property within super. Your business then pays market rent to the SMSF (which is tax-deductible to the business and concessionally taxed in the fund). Residential property cannot be purchased from a related party.",
  },
  {
    question: "What happens to SMSF property tax in pension phase?",
    answer:
      "Once all SMSF members retire and the fund moves to pension phase, rental income is taxed at 0% and capital gains on sale are taxed at 0% (subject to transfer balance cap rules). This is the most powerful long-term feature of SMSF property and the reason long-term holders favour the structure.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Property Depreciation Guide",   href: "/guides/property-depreciation-guide",        description: "Depreciation works inside an SMSF the same way it does outside it." },
  { title: "Negative Gearing Australia",    href: "/guides/negative-gearing-australia",          description: "Different mechanics inside an SMSF: the deduction is at 15% not your marginal rate." },
  { title: "CGT Calculator",                href: "/cgt-calculator",                              description: "Compare CGT between personal and SMSF ownership." },
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

      <h2 id="can-you-buy">Can you buy property in an SMSF?</h2>
      <p className="lead">
        Yes, a self-managed super fund (SMSF) can invest in property, but
        there are strict rules. The Australian Taxation Office (ATO)
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

      <h2 id="lrba">Borrowing in an SMSF: LRBA explained</h2>
      <p>
        SMSFs can borrow money to purchase property through a{" "}
        <strong>Limited Recourse Borrowing Arrangement (LRBA)</strong>. The
        limited recourse aspect is critical: if the SMSF defaults on the loan,
        the lender can only claim against the specific asset purchased with
        the borrowed funds, not against the SMSF&rsquo;s other assets.
      </p>
      <p>The LRBA structure requires:</p>
      <ul>
        <li><strong>A separate bare trust (holding trust).</strong> The property is held by a bare trustee (a separate legal entity, often a company) on behalf of the SMSF. The SMSF holds a beneficial interest in the asset.</li>
        <li><strong>A separate bare trustee company.</strong> A new company is typically established as the bare trustee. This adds setup cost and complexity.</li>
        <li><strong>An SMSF loan.</strong> SMSF loans are provided by specialist lenders (not all banks). They typically carry significantly higher interest rates than standard home loans, often 1.5% to 2.5% above comparable rates, reflecting the higher risk to lenders.</li>
        <li><strong>Title transfer at loan repayment.</strong> Once the loan is repaid, the property title transfers from the bare trust into the SMSF directly.</li>
      </ul>

      <h2 id="steps">Steps to buy property in an SMSF</h2>
      <ol>
        <li><strong>Establish the SMSF.</strong> If you don&rsquo;t already have one, establish with a corporate trustee (a company as trustee, rather than individual trustees). A corporate trustee is strongly recommended for SMSF property purchases. Cost: $1,000 to $2,500 for establishment.</li>
        <li><strong>Review your SMSF trust deed and investment strategy.</strong> The trust deed must permit investment in property and borrowing (if using an LRBA). Your investment strategy must explicitly include direct property as a permitted asset class.</li>
        <li><strong>Establish the bare trust (if using LRBA).</strong> Set up a separate bare trust with a corporate bare trustee to hold the property during the loan period. Your SMSF administrator or lawyer will handle this. Cost: $1,000 to $2,000.</li>
        <li><strong>Obtain SMSF loan pre-approval.</strong> Apply to an SMSF-specialist lender. Not all major banks offer SMSF loans. Specialist lenders include Latrobe Financial, Liberty, and various non-bank lenders. LVR typically 70 to 80%.</li>
        <li><strong>Find and assess the property.</strong> The property must meet the SIS Act requirements. For residential: cannot buy from related parties. For commercial: can buy from a member&rsquo;s business at market value with independent valuation.</li>
        <li><strong>Conduct due diligence.</strong> Building and pest inspection, title search, strata report (if applicable). All standard property due diligence applies, the fact it&rsquo;s in an SMSF doesn&rsquo;t reduce the need for thorough checks.</li>
        <li><strong>Exchange and settle.</strong> The contract must be in the name of the bare trustee (not the SMSF directly). Your SMSF conveyancer or solicitor manages settlement.</li>
        <li><strong>Ongoing compliance.</strong> The SMSF must be audited annually by a registered SMSF auditor. The property must be independently valued at least every 3 years, and more frequently for unlisted assets in certain circumstances.</li>
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
          <tr><td>Bare trust establishment (LRBA)</td><td>$1,000 to $2,000</td><td>One-off</td></tr>
          <tr><td>Annual SMSF accounting and tax return</td><td>$1,500 to $3,000</td><td>Annual</td></tr>
          <tr><td>Annual SMSF audit</td><td>$500 to $1,000</td><td>Annual</td></tr>
          <tr><td>Financial advice (SMSF specialist)</td><td>$2,000 to $5,000+</td><td>Setup + ongoing</td></tr>
          <tr><td>SMSF loan rate premium (vs standard loan)</td><td>1.5% to 2.5% pa above standard rates</td><td>While loan is outstanding</td></tr>
          <tr><td>Property valuation</td><td>$500 to $1,500</td><td>Every 3 years minimum</td></tr>
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
          <tr><td>Rental income tax</td><td>15%</td><td><strong className="text-success">0%</strong></td><td>Marginal rate (up to 47%)</td></tr>
          <tr><td>CGT (held under 12 months)</td><td>15%</td><td><strong className="text-success">0%</strong></td><td>Marginal rate</td></tr>
          <tr><td>CGT (held over 12 months)</td><td>10% (after 1/3 discount)</td><td><strong className="text-success">0%</strong></td><td>Half marginal rate</td></tr>
        </tbody>
      </table>

      <p>
        The 0% tax in pension phase is perhaps the most powerful feature.
        Once all SMSF members retire and the fund moves to pension phase, all
        earnings and capital gains within the fund become completely
        tax-free. This is an extraordinary benefit for long-term property
        holders.
      </p>
      <p>
        Even in accumulation phase, the 15% tax rate on rental income vs a
        high-income earner&rsquo;s 47% marginal rate represents a significant
        saving. For someone earning $150,000 personally (45% tax rate),
        holding a property in an SMSF instead could reduce the tax rate on
        rental income by 30 percentage points.
      </p>

      <h2 id="risks">Risks and downsides</h2>
      <ul>
        <li><strong>Liquidity risk.</strong> Property cannot be sold in parts. If the SMSF needs to make pension payments and cash is tight, the entire property may need to be sold, potentially at an inopportune time.</li>
        <li><strong>Concentration risk.</strong> If property represents most of the SMSF&rsquo;s assets, the fund is undiversified. A property market downturn or extended vacancy can severely impact members&rsquo; retirement savings.</li>
        <li><strong>High SMSF loan rates.</strong> SMSF loans are significantly more expensive than standard investment loans, reducing net returns.</li>
        <li><strong>Compliance complexity.</strong> SMSFs have extensive compliance obligations. A breach, even an inadvertent one, can result in heavy penalties and the fund losing its complying status (effectively being taxed at 45%).</li>
        <li><strong>Cannot access equity.</strong> Under an LRBA, you cannot use the property&rsquo;s equity as security for further borrowings within the SMSF. The property must be maintained as a single asset.</li>
        <li><strong>Costs erode returns for small balances.</strong> SMSF running costs of $3,000 to $6,000 a year can significantly reduce net returns for funds under $300,000.</li>
      </ul>

      <h2 id="who-suits">Who is SMSF property right for?</h2>
      <p>SMSF property investment is typically most appropriate for:</p>
      <ul>
        <li><strong>SMSF balances of $300,000+.</strong> Below this level, the fixed costs of running an SMSF likely outweigh the tax benefits relative to a retail or industry super fund.</li>
        <li><strong>Business owners wanting to buy commercial premises.</strong> The ability to lease commercial property back to your own business at market rates is a unique and powerful SMSF strategy.</li>
        <li><strong>Investors approaching retirement.</strong> The zero-tax pension phase benefit is most valuable for investors with a medium-term horizon before retirement.</li>
        <li><strong>High-income earners.</strong> The tax differential between a 47% marginal rate and 15% SMSF rate is most powerful for higher-income individuals.</li>
        <li><strong>Property-focused investors.</strong> Those who have a strong conviction about property as an asset class and want to hold it within their super portfolio.</li>
      </ul>
    </GuideArticleLayout>
  );
}
