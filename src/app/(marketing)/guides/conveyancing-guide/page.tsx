import type { Metadata } from "next";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  MiniStampDutyEmbed,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { HowToJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Conveyancing in Australia: What it costs and how to choose (2026)",
  description:
    "What conveyancers do, what they cost, when to use a solicitor instead, and the red flags in a contract that a good conveyancer will catch before you sign.",
  slug: "conveyancing-guide",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 8,
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
  "Conveyancing is the legal process of transferring property ownership. Both buyers and sellers engage their own conveyancer.",
  "Licensed conveyancers handle most standard residential transactions for $800 to $1,800 plus disbursements; solicitors handle complex matters for $1,500 to $3,000+.",
  "All Australian property settles electronically via the PEXA platform, which is restricted to licensed practitioners.",
  "Engage your conveyancer before you make an offer so they can review the contract and Section 32 (or equivalent) before you sign.",
  "Red flags in contracts include unusually long settlement periods, missing inclusions, undisclosed title encumbrances, and aggressive sunset clauses on off-the-plan purchases.",
  "Use a solicitor (not a conveyancer) when buying via a trust or SMSF, for complex joint ownership, or when contract disputes are likely.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is",                  label: "What conveyancing is" },
  { id: "conveyancer-vs-solicitor", label: "Conveyancer vs solicitor" },
  { id: "process",                  label: "The conveyancing process step by step" },
  { id: "costs",                    label: "Typical costs by state" },
  { id: "diy",                      label: "DIY conveyancing (not recommended)" },
  { id: "red-flags",                label: "Red flags in contracts" },
  { id: "when-solicitor",           label: "When to use a solicitor instead" },
  { id: "choosing",                 label: "How to choose a conveyancer" },
];

const FAQS: FaqItem[] = [
  {
    question: "What does a conveyancer actually do?",
    answer:
      "A conveyancer reviews the contract of sale, conducts property searches (title, council, zoning, land tax, water), liaises with your lender, prepares and lodges settlement documents on the PEXA platform, and ensures the title is registered correctly in your name. For sellers, they also discharge the existing mortgage and prepare the vendor disclosure documents (Section 32 in Victoria, Form 1 in SA, etc.).",
  },
  {
    question: "Conveyancer or solicitor, which do I need?",
    answer:
      "For straightforward residential purchases, a licensed conveyancer is sufficient and more cost-effective. Use a solicitor when buying via a trust, company or self-managed super fund, when there's a complex joint ownership structure, when buying off-the-plan with non-standard terms, when settling a deceased estate, or when contract disputes are likely.",
  },
  {
    question: "How much does conveyancing cost?",
    answer:
      "Professional fees typically range from $700 to $2,000 for a buyer in most states, plus disbursements of $300 to $900 (PEXA fee, title searches, council searches, registration). Solicitors charge more, often $1,500 to $3,000+, with hourly rates of $300 to $500 for complex matters. Always get a fixed-fee quote before engaging.",
  },
  {
    question: "When should I engage a conveyancer in the buying process?",
    answer:
      "Before you make an offer. The conveyancer should review the contract of sale and any vendor disclosure documents BEFORE you sign anything. Once contracts exchange, you're committed: there's limited cooling-off in some states, and even then, walking away usually means forfeiting part of the deposit.",
  },
  {
    question: "What's a Section 32 / vendor's statement?",
    answer:
      "It's the document a vendor must provide before signing, disclosing material facts about the property: title details, mortgages and easements, zoning, planning overlays, outgoings (rates, body corporate fees), and any building permits or notices. The exact name varies by state (Section 32 in Victoria, Form 1 in SA, contract of sale in NSW). Your conveyancer reviews this for missing or concerning disclosures.",
  },
  {
    question: "Can I do my own conveyancing to save money?",
    answer:
      "Technically yes in most states, practically no for almost everyone. PEXA electronic settlement is restricted to licensed practitioners; missed deadlines and procedural errors can forfeit your deposit; if a licensed conveyancer makes an error, their professional indemnity insurance covers you. The few hundred dollars saved on a $700,000 purchase isn't worth the risk.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide",          href: "/guides/first-home-buyer-guide", description: "Where conveyancing fits in the broader buying process." },
  { title: "Buying Property in Australia",    href: "/guides/buying-property-australia", description: "The full step-by-step buying process." },
  { title: "Property Auction Guide",          href: "/guides/property-auction-guide", description: "What changes when you buy at auction (no cooling off)." },
  { title: "Building and Pest Inspection",    href: "/guides/building-pest-inspection", description: "The other professional you'll engage before settlement." },
  { title: "Real Estate Agent Fees",          href: "/guides/real-estate-agent-fees-australia", description: "If you're selling, the other big professional cost." },
  { title: "Stamp Duty Calculator",           href: "/stamp-duty-calculator", description: "The largest line item your conveyancer will arrange at settlement." },
];

export default function ConveyancingGuidePage() {
  return (
    <>
      <HowToJsonLd
        name="How to engage a conveyancer in Australia"
        description="The five-step process for engaging a conveyancer or solicitor for an Australian property transaction."
        url={`/guides/${FRONTMATTER.slug}`}
        steps={[
          { name: "Pick conveyancer or solicitor", text: "Conveyancer for standard transactions, solicitor for complex ones (deceased estates, foreign buyers, structural disputes)." },
          { name: "Get three quotes", text: "Compare fees, inclusions, and turnaround time. Cheapest is rarely best." },
          { name: "Engage early, before you find a property", text: "Saves a week of vendor-recommended-conveyancer faff later." },
          { name: "Sign engagement and provide details", text: "ID, financing details, and any specific concerns about the property." },
          { name: "Conveyancer runs searches and reviews contract", text: "Title, planning, council rates, and any easements or covenants." },
          { name: "Settlement coordination", text: "Conveyancer arranges PEXA settlement and the discharge of any existing mortgage." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="State-specific rules apply">
        <p>
          Conveyancing laws and processes vary by state. The names of vendor
          disclosure documents, cooling-off periods, and contract requirements
          differ. Always engage a licensed conveyancer or solicitor in your
          state for your specific transaction.
        </p>
      </Callout>

      <h2 id="what-is">What conveyancing is</h2>
      <p className="lead">
        Conveyancing is the legal process of transferring ownership of real
        property from one person to another. It encompasses everything from
        reviewing the contract of sale and conducting property searches, through
        to organising settlement and registering the new title.
      </p>
      <p>
        In Australia, both buyers and sellers engage their own conveyancers (or
        solicitors) to handle their respective sides of a transaction. The
        buyer&rsquo;s conveyancer protects the buyer&rsquo;s interests; the
        vendor&rsquo;s conveyancer prepares the contract and disclosure
        documents.
      </p>
      <p>
        Conveyancing is now largely conducted electronically in Australia via
        the <strong>PEXA</strong> (Property Exchange Australia) platform, which
        allows funds to be transferred and title documents lodged digitally at
        settlement.
      </p>

      <h2 id="conveyancer-vs-solicitor">Conveyancer vs solicitor</h2>
      <p>
        Both licensed conveyancers and solicitors (lawyers) can handle property
        conveyancing in Australia. The key differences:
      </p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Licensed conveyancer</th>
            <th>Solicitor</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>Qualification</strong></td><td>Specialised conveyancing licence</td><td>Law degree + admission to practice</td></tr>
          <tr><td><strong>Scope</strong></td><td>Property transactions only</td><td>Full legal advice on any matter</td></tr>
          <tr><td><strong>Cost</strong></td><td>Generally lower ($800 to $1,800)</td><td>Generally higher ($1,500 to $3,000+)</td></tr>
          <tr><td><strong>Best for</strong></td><td>Standard residential purchases</td><td>Complex transactions, legal disputes, trust structures</td></tr>
        </tbody>
      </table>

      <p>
        For the vast majority of straightforward residential purchases, a
        licensed conveyancer is sufficient and more cost-effective. For complex
        transactions (e.g. buying via a trust or company, off-the-plan disputes,
        unusual contract conditions), a solicitor is recommended.
      </p>

      <h2 id="process">The conveyancing process step by step</h2>

      <h3>For buyers</h3>
      <ol>
        <li><strong>Engage your conveyancer early.</strong> Ideally before you make an offer, so they can review the contract before you sign.</li>
        <li><strong>Contract review.</strong> Your conveyancer reviews the contract of sale and vendor&rsquo;s statement (Section 32 in VIC), identifying any unusual conditions, risks, or items requiring negotiation.</li>
        <li><strong>Pre-exchange advice.</strong> Your conveyancer explains your rights and obligations, including the cooling-off period (if applicable), deposit amount, and any conditions in the contract.</li>
        <li><strong>Exchange of contracts.</strong> Both parties sign identical contracts and the deposit is paid. The deal is now binding (with any conditions outstanding).</li>
        <li><strong>Property searches.</strong> Your conveyancer conducts searches: title, council rates and zoning, land tax, water rates, and any planned road or infrastructure works that may affect the property.</li>
        <li><strong>Liaising with your lender.</strong> Your conveyancer coordinates with your bank or mortgage broker to ensure loan documents are ready for settlement.</li>
        <li><strong>Pre-settlement inspection.</strong> Done by you (not your conveyancer), usually 24 to 48 hours before settlement, to confirm the property is in the agreed condition.</li>
        <li><strong>Settlement.</strong> Your conveyancer coordinates the electronic settlement via PEXA. Funds are transferred, the title is registered in your name, and you get the keys.</li>
      </ol>

      <h3>For sellers</h3>
      <p>
        The seller&rsquo;s conveyancer prepares the contract of sale and Section
        32 (VIC) / vendor disclosure documents, reviews the buyer&rsquo;s
        requests for special conditions, and handles settlement to ensure funds
        arrive correctly. They also discharge the existing mortgage.
      </p>

      <h2 id="costs">Typical conveyancing costs by state</h2>
      <p>
        Conveyancing fees vary by state and provider. Professional fees
        (excluding disbursements) typically range from:
      </p>

      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Buyer conveyancer fee</th>
            <th>Seller conveyancer fee</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>NSW</td><td>$800 to $1,800</td><td>$700 to $1,500</td></tr>
          <tr><td>VIC</td><td>$900 to $2,000</td><td>$800 to $1,800</td></tr>
          <tr><td>QLD</td><td>$800 to $1,600</td><td>$700 to $1,400</td></tr>
          <tr><td>WA</td><td>$900 to $2,000</td><td>$800 to $1,600</td></tr>
          <tr><td>SA</td><td>$700 to $1,500</td><td>$600 to $1,200</td></tr>
        </tbody>
      </table>

      <p>
        In addition to professional fees, expect <strong>disbursements</strong>{" "}
        (out-of-pocket costs) of $300 to $900, including:
      </p>
      <ul>
        <li>Title search fees: $20 to $50</li>
        <li>Council searches: $50 to $150</li>
        <li>PEXA electronic settlement fee: $100 to $200</li>
        <li>Land tax certificates: $20 to $100</li>
        <li>Registration of transfer: varies by state ($200 to $500+)</li>
      </ul>
      <p>
        For high-value properties or complex transactions, solicitors may charge
        hourly rates ($300 to $500/hour), which can push total costs above $3,000.
      </p>

      <KeyFigure
        value="$1k–$3k"
        label="Total conveyancing fees plus disbursements for a typical Australian residential purchase. Larger or more complex transactions cost more."
        context="Indicative, professional fees + searches + settlement"
      />

      <h2 id="diy">DIY conveyancing (not recommended)</h2>
      <p>
        In theory, it is possible to conduct your own conveyancing in most
        Australian states. In practice, this is strongly{" "}
        <strong>not recommended</strong> for most buyers and sellers.
      </p>
      <p>Reasons to avoid DIY conveyancing:</p>
      <ul>
        <li>
          <strong>Complexity.</strong> Property law and the conveyancing process
          contain many technical requirements. Missing a step or deadline can
          have serious consequences, including forfeiting your deposit or being
          liable for damages.
        </li>
        <li>
          <strong>No professional indemnity.</strong> If a licensed conveyancer
          makes an error, their professional indemnity insurance covers you. If
          you make an error, you bear the cost entirely.
        </li>
        <li>
          <strong>PEXA access.</strong> Electronic settlement requires access to
          the PEXA platform, which is restricted to licensed practitioners.
        </li>
        <li>
          <strong>Cost saving is minimal.</strong> Conveyancing fees are modest
          relative to the property value. The risk-reward calculus strongly
          favours engaging a professional.
        </li>
      </ul>

      <MatchCTA kind="conveyancer" />

      <h2 id="red-flags">Red flags in contracts</h2>
      <p>A good conveyancer will flag these issues, but it helps to know what to watch for:</p>
      <ul>
        <li>
          <strong>Unusually long settlement periods</strong> (e.g. 90+ days
          without explanation). May indicate the vendor has a complicating issue
          to resolve.
        </li>
        <li>
          <strong>Missing inclusions.</strong> Fixtures listed verbally by the
          agent but not included in the contract (e.g. dishwasher, ducted air
          conditioning, garden shed).
        </li>
        <li>
          <strong>Title encumbrances.</strong> Mortgages not yet discharged,
          unregistered easements, or heritage overlays that will restrict future
          development.
        </li>
        <li>
          <strong>GST clauses.</strong> If buying new property from a developer,
          confirm whether the price is inclusive or exclusive of GST.
        </li>
        <li>
          <strong>Unusual &ldquo;as-is&rdquo; clauses.</strong> Some contracts
          try to limit the vendor&rsquo;s disclosure obligations. Your conveyancer
          should flag these.
        </li>
        <li>
          <strong>Sunset clauses (off-the-plan).</strong> A clause allowing the
          developer to cancel the contract if completion doesn&rsquo;t occur by
          a certain date. Controversial and sometimes misused.
        </li>
      </ul>

      <h2 id="when-solicitor">When to use a solicitor instead</h2>
      <p>
        While a licensed conveyancer handles most standard purchases perfectly
        well, there are situations where the broader legal expertise of a
        solicitor is advisable:
      </p>
      <ul>
        <li>Buying or selling via a trust, company, or self-managed super fund (SMSF)</li>
        <li>Complex joint ownership structures</li>
        <li>Off-the-plan purchases with non-standard contract terms</li>
        <li>Development sites or properties with planning disputes</li>
        <li>Contract disputes or vendor non-disclosure claims</li>
        <li>Commercial property transactions</li>
        <li>Deceased estates where title issues are unresolved</li>
      </ul>

      <h2 id="choosing">How to choose a conveyancer</h2>
      <p>Questions to ask before engaging a conveyancer:</p>
      <ul>
        <li>Are you licensed in this state?</li>
        <li>Do you have experience with this type of property (e.g. off-the-plan, strata)?</li>
        <li>What is your total fee, and what disbursements are included?</li>
        <li>Will you be handling my file personally, or will it be delegated?</li>
        <li>What are your communication standards, will you respond to emails within 24 hours?</li>
        <li>Do you use PEXA for electronic settlement?</li>
      </ul>
      <p>
        Avoid choosing a conveyancer solely on price. The cheapest option may
        cut corners on searches or contract review. A few hundred dollars of
        saving is not worth the risk on a $700,000 transaction.
      </p>
      <p>
        Ask your real estate agent, mortgage broker, or friends who have
        recently purchased in the area for recommendations.
      </p>

      <p>
        Speaking of settlement-day costs, your conveyancer will arrange
        payment of stamp duty alongside the loan settlement. Estimate it now:
      </p>
      <MiniStampDutyEmbed />
    </GuideArticleLayout>
    </>
  );
}
