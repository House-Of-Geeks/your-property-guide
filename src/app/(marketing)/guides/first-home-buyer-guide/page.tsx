import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MiniStampDutyEmbed,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide Australia: Grants, Schemes & Steps (2026)",
  description:
    "Complete guide for Australian first home buyers: federal grants and schemes (FHBG, Family Home Guarantee), state grants by state, stamp duty concessions, and step-by-step buying advice.",
  slug: "first-home-buyer-guide",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 10,
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
  "Combining a federal scheme like the First Home Guarantee with a state First Home Owner Grant and stamp duty concessions can save eligible buyers $30,000 to $60,000+.",
  "The First Home Guarantee lets eligible buyers purchase with a 5% deposit, no Lenders Mortgage Insurance. Income limits: $125,000 single, $200,000 couple.",
  "The Family Home Guarantee allows single parents to buy with a 2% deposit, no LMI, and is available even if you have previously owned a home.",
  "First Home Owner Grants apply mostly to new homes only and vary widely by state, from no grant in ACT up to $30,000 in QLD and TAS.",
  "Most states offer first home buyers a full or partial stamp duty exemption, with thresholds and rules differing by jurisdiction.",
  "Always verify current eligibility, price caps and grant amounts with the relevant government agency before relying on this information.",
];

const TOC: GuideTOCEntry[] = [
  { id: "overview",              label: "Becoming a first home buyer in Australia" },
  { id: "federal-schemes",       label: "Federal government schemes" },
  { id: "fhog-by-state",         label: "First Home Owner Grant by state" },
  { id: "stamp-duty-concessions",label: "Stamp duty concessions" },
  { id: "step-by-step",          label: "Step-by-step buying process" },
  { id: "common-mistakes",       label: "Common mistakes first home buyers make" },
  { id: "using-a-broker",        label: "Using a broker with the First Home Guarantee" },
  { id: "state-guides",          label: "State-specific guides" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can I use the First Home Guarantee and the First Home Owner Grant at the same time?",
    answer: "Yes, in most cases. The First Home Guarantee is a federal scheme that lets you buy with a 5% deposit and no LMI; the First Home Owner Grant is a state cash grant. They have different eligibility rules, but if you qualify for both, they stack. The catch is that the FHOG generally only applies to new homes, while the FHBG can be used for both new and established properties.",
  },
  {
    question: "What is the income limit for the First Home Guarantee?",
    answer: "$125,000 a year for singles and $200,000 a year for couples, based on combined taxable income from the previous financial year. The Family Home Guarantee uses a $125,000 limit for the single parent or guardian.",
  },
  {
    question: "Do I need to be a first home buyer to use the Family Home Guarantee?",
    answer: "No. The Family Home Guarantee is open to single parents and single legal guardians with at least one dependent child, even if you have previously owned property. As long as you do not currently own a home, you can use the scheme.",
  },
  {
    question: "How much deposit do I need to buy a first home in Australia?",
    answer: "Without a government scheme, lenders typically want 20% to avoid LMI. With the First Home Guarantee you can buy with 5%. With the Family Home Guarantee a 2% deposit is enough. Even with the schemes, you also need to budget for stamp duty (where it applies), conveyancing, building inspections, and lender fees, typically 3% to 5% of purchase price on top.",
  },
  {
    question: "Do I have to use a mortgage broker to access the First Home Guarantee?",
    answer: "No. You can apply directly with any participating lender. A broker can compare rates across lenders, know which lenders still have FHBG places (they run out during the year), and handle the FHBG paperwork as part of your loan application at no cost to you. Brokers are paid by the lender, not by you.",
  },
  {
    question: "What happens if my purchase price exceeds the price cap by a small amount?",
    answer: "You lose access to the scheme entirely. The price caps are firm: even one dollar over disqualifies the entire purchase from the FHBG, FHOG, or stamp duty concession. Plan well under the cap to leave room for negotiation.",
  },
  {
    question: "Can I buy an established home as my first home and still get a grant?",
    answer: "You can use the First Home Guarantee on an established home. But the First Home Owner Grant in most states applies only to new builds, off-the-plan, or substantially renovated homes. If you buy an established home, expect the FHBG and stamp duty concession in your state, but no FHOG.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide, NSW",    href: "/guides/first-home-buyer-nsw", description: "State-specific schemes, stamp duty, and price caps for NSW." },
  { title: "First Home Buyer Guide, QLD",    href: "/guides/first-home-buyer-qld", description: "QLD's $30,000 First Home Owner Grant and stamp duty concession explained." },
  { title: "First Home Buyer Guide, VIC",    href: "/guides/first-home-buyer-vic", description: "Victoria's regional grants and stamp duty exemptions." },
  { title: "Lenders Mortgage Insurance",     href: "/guides/lenders-mortgage-insurance-guide", description: "What LMI costs and the schemes that waive it." },
  { title: "Conveyancing in Australia",      href: "/guides/conveyancing-guide", description: "What conveyancers do, what they cost, and what to ask before signing." },
  { title: "Stamp Duty Calculator",          href: "/stamp-duty-calculator", description: "Estimate your liability state-by-state in under a minute." },
];

export default function FirstHomeBuyerGuidePage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="A note on accuracy">
        <p>
          Grant amounts, income limits, and property price caps change regularly.
          Always verify current eligibility with the relevant government agency or
          a licensed professional before relying on this information.
        </p>
      </Callout>

      <h2 id="overview">Becoming a first home buyer in Australia</h2>
      <p className="lead">
        Buying your first home in Australia has never been more government-assisted.
        Federal schemes, state grants, and stamp duty concessions together can save
        eligible buyers tens of thousands of dollars. The challenge is that the
        schemes are complex, have different eligibility rules, and often interact
        with each other in ways that need careful planning.
      </p>
      <p>
        The good news: if you&rsquo;re eligible, combining a federal scheme like the
        First Home Guarantee with a state First Home Owner Grant and stamp duty
        concessions can mean buying your first home with as little as 5% deposit, no
        Lenders Mortgage Insurance, a cash grant, and reduced or zero stamp duty.
      </p>
      <p>
        This guide covers the national picture. For state-specific detail, see our
        guides for{" "}
        <Link href="/guides/first-home-buyer-nsw">NSW</Link>,{" "}
        <Link href="/guides/first-home-buyer-vic">VIC</Link>,{" "}
        <Link href="/guides/first-home-buyer-qld">QLD</Link>, and{" "}
        <Link href="/guides/first-home-buyer-wa">WA</Link>.
      </p>

      <KeyFigure
        value="$30k–$60k+"
        label="What an eligible first home buyer can save by stacking the federal scheme, state grant and stamp duty concession on a typical capital-city purchase."
        context="Estimate, varies by state and price"
      />

      <h2 id="federal-schemes">Federal government schemes</h2>
      <p>
        The Australian Government runs several schemes administered through Housing
        Australia (formerly NHFIC). These schemes allow eligible buyers to purchase
        with a smaller deposit without paying Lenders Mortgage Insurance (LMI). The
        government guarantees the gap.
      </p>

      <h3>1. First Home Guarantee (FHBG)</h3>
      <p>
        The most widely used scheme. It allows eligible first home buyers to
        purchase a property with as little as a <strong>5% deposit</strong> without
        paying LMI.
      </p>
      <ul>
        <li><strong>Income limits:</strong> $125,000/year for singles; $200,000/year for couples (combined taxable income from the previous financial year)</li>
        <li><strong>Who qualifies:</strong> Australian citizens or permanent residents aged 18+, who have not previously owned or had an interest in real property in Australia</li>
        <li><strong>Property type:</strong> New and established residential properties</li>
        <li><strong>Property price caps (selected, 2025/26):</strong> Vary by location, typically $800,000 to $900,000 in capital cities and $650,000 to $750,000 in regional areas. Check Housing Australia&rsquo;s website for the cap in your specific location.</li>
        <li><strong>Number of places per year:</strong> 35,000 places (shared with Regional First Home Buyer Guarantee)</li>
        <li><strong>How to access:</strong> Apply through a participating lender. Most major banks and many credit unions participate.</li>
      </ul>

      <h3>2. Regional First Home Buyer Guarantee</h3>
      <p>
        The same structure as the FHBG but specifically for buyers purchasing in{" "}
        <strong>regional Australia</strong>. You must have lived in the regional area
        (or an adjacent area) for at least 12 months continuously prior to purchase.
      </p>
      <ul>
        <li>Same income limits and deposit (5%) as the FHBG</li>
        <li>Property price caps apply, generally the same regional caps as FHBG</li>
        <li>10,000 places per year</li>
      </ul>

      <h3>3. Family Home Guarantee</h3>
      <p>
        Designed for <strong>single parents and single legal guardians</strong> with
        at least one dependent child. Allows purchase with just a{" "}
        <strong>2% deposit</strong> without LMI.
      </p>
      <ul>
        <li><strong>Income limit:</strong> $125,000/year (single parent or guardian only)</li>
        <li>You do not need to be a first home buyer. The scheme is also available to previous homeowners who no longer own property.</li>
        <li>5,000 places per year</li>
        <li>Property price caps apply as for FHBG</li>
      </ul>

      <h3>4. Help to Buy (Shared Equity Scheme)</h3>
      <p>
        The Help to Buy scheme, legislated in 2024, enables eligible buyers to
        purchase a home with the government taking an equity co-investment of up to
        40% (new homes) or 30% (existing homes). This reduces the size of the
        mortgage required.
      </p>
      <ul>
        <li><strong>Income limits:</strong> $90,000 for singles; $120,000 for couples</li>
        <li>Buyers need a minimum 2% deposit and no LMI</li>
        <li>The government shares in capital gains proportional to its equity stake</li>
        <li>10,000 places per year</li>
        <li><strong>Check availability:</strong> As of 2026, the scheme&rsquo;s operational status and participating states. Check housing.gov.au for current details.</li>
      </ul>

      <h2 id="fhog-by-state">First Home Owner Grant by state</h2>
      <p>
        The First Home Owner Grant (FHOG) is a one-off cash grant available in most
        states and territories. It generally only applies to <strong>new homes</strong>{" "}
        (newly built, substantially renovated, or off-the-plan), not established
        properties.
      </p>
      <table>
        <thead>
          <tr>
            <th>State/Territory</th>
            <th>Grant Amount</th>
            <th>Eligible Property Types</th>
            <th>Price Cap</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>QLD</strong></td><td>$30,000</td><td>New homes (never lived in)</td><td>$750,000 contract price</td></tr>
          <tr><td><strong>NSW</strong></td><td>$10,000</td><td>New homes</td><td>$600,000 (metro) / $750,000 (regional)</td></tr>
          <tr><td><strong>VIC</strong></td><td>$10,000 (metro) / $20,000 (regional)</td><td>New homes</td><td>$750,000</td></tr>
          <tr><td><strong>WA</strong></td><td>$10,000</td><td>New homes</td><td>$750,000</td></tr>
          <tr><td><strong>SA</strong></td><td>$15,000</td><td>New homes</td><td>$650,000</td></tr>
          <tr><td><strong>TAS</strong></td><td>$30,000</td><td>New homes (check current state offer)</td><td>No cap (check current rules)</td></tr>
          <tr><td><strong>NT</strong></td><td>$10,000</td><td>New or substantially renovated homes</td><td>No cap</td></tr>
          <tr><td><strong>ACT</strong></td><td>No FHOG</td><td>ACT has its own Home Buyer Concession Scheme instead</td><td></td></tr>
        </tbody>
      </table>

      <Callout variant="info" title="Always verify before relying on these figures">
        <p>
          Grant amounts, price caps, and eligibility criteria change. Check the
          relevant state revenue office for the current rules before proceeding.
        </p>
      </Callout>

      <h2 id="stamp-duty-concessions">First home buyer stamp duty concessions</h2>
      <p>
        Stamp duty is one of the biggest upfront costs when buying property. Most
        states offer first home buyers either a full exemption or a reduced rate on
        stamp duty, subject to thresholds.
      </p>

      <MiniStampDutyEmbed />

      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Full Exemption</th>
            <th>Concessional Rate</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>NSW</strong></td><td>≤ $800,000</td><td>$800,001 to $1,000,000</td><td>New and established homes; buyer must occupy</td></tr>
          <tr><td><strong>VIC</strong></td><td>≤ $600,000</td><td>$600,001 to $750,000</td><td>New and established homes</td></tr>
          <tr><td><strong>QLD</strong></td><td>No full exemption</td><td>Concession for homes ≤ $550,000</td><td>First home concession; buyer must occupy</td></tr>
          <tr><td><strong>WA</strong></td><td>≤ $450,000</td><td>$450,001 to $600,000</td><td>New and established homes</td></tr>
          <tr><td><strong>SA</strong></td><td>Full exemption for new homes</td><td>N/A</td><td>Only applies to new/off-the-plan homes</td></tr>
          <tr><td><strong>TAS</strong></td><td>50% discount on stamp duty</td><td></td><td>Applies to established and new homes ≤ $600,000</td></tr>
          <tr><td><strong>NT</strong></td><td>Up to $18,601 off duty</td><td>Scaled reduction</td><td>First Home Owner Discount</td></tr>
          <tr><td><strong>ACT</strong></td><td>Full exemption (income-tested)</td><td></td><td>Home Buyer Concession Scheme; income and property value limits apply</td></tr>
        </tbody>
      </table>

      <h2 id="step-by-step">Step-by-step buying process for first home buyers</h2>
      <p>
        See our{" "}
        <Link href="/guides/buying-property-australia">Complete Buying Guide</Link>{" "}
        for detailed coverage of each step. For first home buyers specifically, the
        key additional steps are:
      </p>
      <ol>
        <li><strong>Check your FHOG eligibility</strong> before making any offer. The grant is only available if you haven&rsquo;t previously owned property in Australia.</li>
        <li><strong>Apply for your chosen federal scheme</strong> through a participating lender before or during your pre-approval application. It&rsquo;s part of the one process.</li>
        <li><strong>Get pre-approval</strong> specifying you&rsquo;re accessing the First Home Guarantee (or relevant scheme) so the lender structures it correctly.</li>
        <li><strong>Confirm stamp duty concessions with your conveyancer.</strong> Concessions are applied on settlement and reduce the amount you need to pay.</li>
        <li><strong>Apply for the FHOG through your conveyancer or directly with your state revenue office.</strong> Timing varies by state; some pay at settlement, some after.</li>
        <li>Complete the standard buying process: offer, exchange, inspections, conveyancing, settlement.</li>
      </ol>

      <h2 id="common-mistakes">Common mistakes first home buyers make</h2>
      <ul>
        <li><strong>Exceeding the price cap for the FHOG or scheme:</strong> Even $1 over the cap disqualifies you from the entire grant. Stay under.</li>
        <li><strong>Not checking FHOG eligibility before buying an established property:</strong> In most states, the FHOG only applies to new builds. Buying an established home means no grant.</li>
        <li><strong>Underestimating total upfront costs:</strong> First home buyers often budget only for the deposit and forget stamp duty (even if discounted), legal fees, and inspections. Budget 3 to 5% on top of the purchase price for costs.</li>
        <li><strong>Letting pre-approval lapse:</strong> Pre-approvals typically last 90 days. If you&rsquo;re not ready to buy in that window, renew before it expires.</li>
        <li><strong>Buying in a hurry due to FOMO:</strong> The property market has cycles. Missing one property is rarely as catastrophic as buying the wrong one.</li>
        <li><strong>Not getting a building inspection:</strong> On a new property, you may have builder warranty cover, but a defect inspection before settlement is still prudent. On an established property, it&rsquo;s essential.</li>
        <li><strong>Not comparing lenders:</strong> The home loan you get approved for on your first attempt may not be the best rate available to you. A mortgage broker can compare dozens of lenders in one application process.</li>
      </ul>

      <h2 id="using-a-broker">Using a broker with the First Home Guarantee</h2>
      <p>
        You don&rsquo;t have to use a mortgage broker to access the First Home
        Guarantee. You can go direct to a participating lender. However, a good
        broker can:
      </p>
      <ul>
        <li>Compare rates and features across all participating lenders simultaneously</li>
        <li>Know which lenders currently have available FHBG places (they do run out during the year)</li>
        <li>Help structure your application to maximise your approval chances</li>
        <li>Handle the FHBG paperwork as part of your loan application at no extra cost to you</li>
      </ul>
      <p>
        Broker remuneration is paid by the lender, not you. Ensure your broker is
        licenced (check ASIC&rsquo;s register) and ask them to explain how they are
        compensated to understand any potential bias.
      </p>

      <h2 id="state-guides">State-specific first home buyer guides</h2>
      <p>For state-specific detail on grants, concessions, and the buying process:</p>
      <ul>
        <li><Link href="/guides/first-home-buyer-nsw">First Home Buyer Guide, New South Wales</Link></li>
        <li><Link href="/guides/first-home-buyer-vic">First Home Buyer Guide, Victoria</Link></li>
        <li><Link href="/guides/first-home-buyer-qld">First Home Buyer Guide, Queensland</Link></li>
        <li><Link href="/guides/first-home-buyer-wa">First Home Buyer Guide, Western Australia</Link></li>
      </ul>
    </GuideArticleLayout>
  );
}
