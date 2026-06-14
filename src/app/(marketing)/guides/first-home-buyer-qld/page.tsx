import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  EditorNote,
  KeyFigure,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide QLD: $30K Grant, Stamp Duty & Schemes (2026)",
  description:
    "Queensland first home buyer guide: $30,000 FHOG for new homes under $750K, stamp duty concession for homes under $550K, federal schemes, and QLD buying tips.",
  slug: "first-home-buyer-qld",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
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
  "Queensland's FHOG is $30,000 on new homes only, capped at $750,000 contract price, three times the NSW or VIC grant.",
  "QLD doesn't offer a full stamp duty exemption, but the First Home Concession reduces transfer duty significantly on homes up to $550,000.",
  "On a $500,000 home an eligible first home buyer pays roughly $8,750 in transfer duty, versus about $17,325 for a standard buyer.",
  "Federal schemes (FHBG, Family Home Guarantee, Help to Buy) all work in QLD; price caps are $700K Brisbane and $550K regional.",
  "QLD uses the REIQ standard contract with conditions built in (building, pest, finance) rather than relying on a cooling-off period.",
  "Cooling-off in QLD is 5 business days from the buyer receiving the contract; no cooling-off at auction.",
];

const TOC: GuideTOCEntry[] = [
  { id: "fhog-qld",       label: "$30,000 First Home Owner Grant QLD" },
  { id: "stamp-duty-qld", label: "Stamp duty (transfer duty) concession" },
  { id: "federal-schemes",label: "Federal schemes in QLD" },
  { id: "qld-specific",   label: "QLD-specific schemes and resources" },
  { id: "median-prices",  label: "Median property prices" },
  { id: "buying-process", label: "The QLD buying process" },
  { id: "contacts",       label: "Key contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Is QLD's $30,000 FHOG really the highest in Australia?",
    answer:
      "Tasmania's grant is also $30,000 (check current rules), so QLD ties for the highest. NSW, VIC metro, and WA grants are $10,000; SA is $15,000. Combined with the federal First Home Guarantee, QLD is one of the most generous environments in Australia for buying a new home.",
  },
  {
    question: "Can I get the QLD FHOG on an established home?",
    answer:
      "No. The grant only applies to new homes, off-the-plan, or owner-builder new builds. Established properties don't qualify. However, the First Home Concession on stamp duty is available for both new and established homes up to $550,000.",
  },
  {
    question: "Does QLD have a full stamp duty exemption like NSW or VIC?",
    answer:
      "No. QLD reduces transfer duty rather than eliminating it. The First Home Concession applies to homes up to $550,000 and gives a flat reduction. There's also a separate Home Concession (the standard owner-occupier rate) that applies even if you're not a first home buyer.",
  },
  {
    question: "When is the FHOG paid?",
    answer:
      "For purchases (e.g. off-the-plan), it's paid at settlement through your lender. For construction contracts, it's paid when the first progress payment is requested by the builder. Apply through the Queensland Revenue Office or via your lender; most lenders process the FHOG application alongside your loan.",
  },
  {
    question: "What does the REIQ contract include that other states' contracts don't?",
    answer:
      "Queensland's standard REIQ contract typically has conditions for building and pest inspection, finance, and sometimes FIRB built in upfront. You negotiate these conditions before signing, rather than relying on a cooling-off period to back out. This means due diligence often happens before contract signing in QLD.",
  },
  {
    question: "What's the cooling-off period in Queensland?",
    answer:
      "5 business days from the buyer's receipt of the contract (residential, not auction). If you back out during cooling-off, you forfeit 0.25% of the price. Auctions have no cooling-off period.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide", description: "Federal schemes, FHOG by state, stamp duty concessions and step-by-step process." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",          description: "Estimate your QLD transfer duty in seconds." },
  { title: "Building & Pest Inspection",        href: "/guides/building-pest-inspection",description: "What to expect from QLD's contract conditions on inspections." },
  { title: "Conveyancing in Australia",         href: "/guides/conveyancing-guide",      description: "What conveyancers do, what they cost, and what to ask." },
  { title: "Lenders Mortgage Insurance",        href: "/guides/lenders-mortgage-insurance-guide", description: "What LMI costs and the schemes that waive it." },
];

export default function FirstHomeBuyerQLDPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Verify with the Queensland Revenue Office">
        <p>
          Grant amounts, thresholds, and eligibility rules change. Always verify
          current details with the{" "}
          <a href="https://www.qro.qld.gov.au/duties/transfer-duty/first-home-grant/" target="_blank" rel="noopener noreferrer">
            Queensland Revenue Office
          </a>{" "}
          or a licensed conveyancer before signing a contract.
        </p>
      </Callout>

      <EditorNote>
        <p>
          Queensland is the state where the FHOG actually moves the
          needle. At $30,000 on a new home, it&rsquo;s three times what
          NSW or VIC pay, and on a sub-$550K purchase the transfer-duty
          concession stacks neatly on top. The trap I see most: buyers
          assume the QLD contract works like NSW with a cooling-off
          they&rsquo;ll lean on. The REIQ contract is built around
          subject-to clauses instead. Negotiate the conditions in,
          don&rsquo;t plan to wriggle out later.
        </p>
      </EditorNote>

      <h2 id="fhog-qld">$30,000 First Home Owner Grant QLD</h2>
      <p className="lead">
        Queensland has one of the most generous First Home Owner Grants in
        Australia. $30,000 for eligible first home buyers purchasing or building a
        new home, three times the grant offered by NSW or metro VIC.
      </p>

      <KeyFigure
        value="$30,000"
        label="The QLD First Home Owner Grant on new homes up to $750,000."
        context="Established homes do not qualify"
      />

      <h3>Eligibility requirements</h3>
      <ul>
        <li>At least one applicant must be an Australian citizen or permanent resident</li>
        <li>All applicants must be 18 years or older</li>
        <li>No applicant can have previously owned residential property in Australia</li>
        <li>At least one applicant must occupy the home as their principal place of residence for at least 12 months within 12 months of completion or settlement</li>
      </ul>

      <h3>Eligible properties</h3>
      <ul>
        <li>New homes (not previously occupied or sold as residential property) with a contract price of $750,000 or less</li>
        <li>Owner-built new homes must have a building contract value of $750,000 or less</li>
        <li>Established properties do <strong>not</strong> qualify for the FHOG in QLD</li>
      </ul>

      <h3>When is the grant paid?</h3>
      <p>
        For purchases (e.g. off-the-plan), the grant is paid at settlement. For
        construction contracts, it's paid when the first progress payment is
        requested by the builder. Apply through the Queensland Revenue Office or
        via your lender; most lenders process the FHOG alongside your loan.
      </p>

      <h2 id="stamp-duty-qld">Stamp duty (transfer duty) concession in QLD</h2>
      <p>
        Queensland doesn't offer a full stamp duty exemption for first home buyers
        the way NSW or VIC do. Instead, it offers a concessional duty rate for
        owner-occupiers, with a deeper concession for first home buyers.
      </p>

      <h3>First Home Concession</h3>
      <ul>
        <li>Available for properties priced at $550,000 or less (established or new)</li>
        <li>For vacant land: no duty on land valued at $400,000 or less, with a concession from $400,001 to $500,000</li>
        <li>The property must be your first home in Australia and you must intend to occupy it within 12 months</li>
      </ul>

      <p>
        On a $500,000 home, a first home buyer in QLD pays roughly $8,750 in
        transfer duty, versus about $17,325 for a standard buyer at the
        owner-occupier rate. Use our{" "}
        <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link> for
        precise figures.
      </p>

      <h3>Home Concession (not exclusive to first home buyers)</h3>
      <p>
        Queensland also applies a standard Home Concession for all owner-occupiers,
        not just first home buyers. The First Home Concession sits on top of this.
      </p>

      <h2 id="federal-schemes">Federal schemes available in QLD</h2>
      <ul>
        <li>
          <strong>First Home Guarantee (FHBG):</strong> 5% deposit, no LMI. Income
          limits $125K single / $200K couple. Property price cap $700,000 Brisbane
          and $550,000 regional QLD.
        </li>
        <li>
          <strong>Regional First Home Buyer Guarantee:</strong> For buyers
          purchasing in regional QLD. Moreton Bay, Gold Coast hinterland, and
          Sunshine Coast hinterland are popular zones.
        </li>
        <li>
          <strong>Family Home Guarantee:</strong> 2% deposit for single parents,
          income limit $125K.
        </li>
        <li>
          <strong>Help to Buy (shared equity):</strong> Up to 40% government equity
          on new homes / 30% on existing. Income limits $90K single / $120K couple.
        </li>
      </ul>
      <p>
        See our{" "}
        <Link href="/guides/first-home-buyer-guide">national First Home Buyer Guide</Link>{" "}
        for full federal scheme detail. The FHBG cap of $700K in Brisbane is lower
        than Sydney/Melbourne, reflecting QLD's historically lower medians, though
        SEQ prices have risen significantly since 2020.
      </p>

      <h2 id="qld-specific">QLD-specific schemes and resources</h2>
      <ul>
        <li>
          <strong>Queensland Housing Finance Loan:</strong> For low-to-moderate
          income earners who can't access a loan from a traditional lender.
          Administered by Homes and Housing QLD. Check eligibility at qld.gov.au/housing.
        </li>
        <li>
          <strong>Deposit assist (shared equity):</strong> Some QLD credit unions
          and building societies offer shared-equity arrangements for first home
          buyers. Check with your broker or lender.
        </li>
        <li>
          <strong>First Home Vacant Land Concession:</strong> For buyers
          purchasing vacant land to build their first home. Reduced transfer duty
          applies on land valued at $400,000 or less.
        </li>
      </ul>

      <h2 id="median-prices">Median property prices for first home buyers</h2>
      <p>
        South East Queensland has had significant price growth since 2020. First
        home buyers typically target:
      </p>
      <ul>
        <li><strong>Brisbane outer suburbs:</strong> Ipswich, Logan, and Moreton Bay regions, house medians $600K to $800K</li>
        <li><strong>Moreton Bay region:</strong> North Lakes, Caboolture, Redcliffe, popular FHB suburbs with medians $620K to $750K</li>
        <li><strong>Gold Coast hinterland:</strong> Ormeau, Coomera, Pimpama, house medians $680K to $800K</li>
        <li><strong>Regional Queensland:</strong> Toowoomba, Rockhampton, Mackay, house medians $400K to $600K with high rental yields</li>
      </ul>
      <p>
        Browse <Link href="/suburbs">QLD suburb profiles</Link> for current data.
      </p>

      <h2 id="buying-process">The QLD buying process</h2>
      <p>QLD has some distinct features versus other states:</p>
      <ul>
        <li><strong>REIQ contract:</strong> QLD uses the Real Estate Institute of Queensland standard contract of sale, with standard conditions for building and pest inspection, finance, and sometimes FIRB.</li>
        <li><strong>Conditions are built in:</strong> Unlike NSW, building inspections and finance conditions are typically negotiated into the contract before it's signed, rather than relying on a cooling-off window.</li>
        <li><strong>Cooling-off period:</strong> 5 business days from the buyer's receipt of the contract (residential, not auction).</li>
        <li><strong>Auctions:</strong> Less common than Sydney/Melbourne. Private treaty (conditional contract) dominates in QLD.</li>
        <li><strong>Settlement:</strong> Typically 30 to 60 days; via PEXA.</li>
      </ul>
      <p>
        For the full step-by-step process, see{" "}
        <Link href="/guides/buying-property-australia">Buying Property in Australia</Link>.
      </p>

      <h2 id="contacts">Key QLD contacts</h2>
      <ul>
        <li>
          <strong>Queensland Revenue Office</strong>, FHOG, transfer duty, concessions:{" "}
          <a href="https://www.qro.qld.gov.au/duties/transfer-duty/first-home-grant/" target="_blank" rel="noopener noreferrer">
            qro.qld.gov.au
          </a>
        </li>
        <li>
          <strong>Homes and Housing QLD</strong>, Queensland Housing Finance Loan and housing assistance:{" "}
          <a href="https://www.qld.gov.au/housing" target="_blank" rel="noopener noreferrer">
            qld.gov.au/housing
          </a>
        </li>
        <li>
          <strong>Housing Australia</strong>, First Home Guarantee and federal schemes:{" "}
          <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer">
            housingaustralia.gov.au
          </a>
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
