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
    "Queensland first home buyer guide: $30,000 FHOG for new homes under $750K (locked in by the 2026-27 QLD Budget), zero stamp duty on new homes, federal schemes, and QLD buying tips.",
  slug: "first-home-buyer-qld",
  publishedAt: "2026-04-01",
  updatedAt: "2026-07-24",
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
  "Queensland's FHOG is $30,000 on new homes only, capped at $750,000 contract price. The 2026-27 QLD Budget locked the $30,000 amount in for another four years — it was due to halve on 1 July 2026 but didn't.",
  "Eligible first home buyers pay zero transfer duty on new homes and vacant land (made permanent in the 2026-27 Budget), and a full concession applies on established homes up to $700,000, phasing out at $800,000.",
  "Stacked together, the grant plus duty relief on a new build routinely exceeds $50,000 in support.",
  "Federal schemes (the 5% Deposit Scheme, Family Home Guarantee, Help to Buy) all work in QLD, and the 5% Deposit Scheme no longer has income caps or place limits.",
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
    question: "Is QLD's FHOG still $30,000?",
    answer:
      "Yes. The boosted $30,000 grant was due to revert to $15,000 for contracts signed from 1 July 2026, but the 2026-27 Queensland Budget (23 June 2026) locked it in for another four years. The Queensland Revenue Office confirms $30,000 for eligible contracts signed from 20 November 2023, with no end date currently published. It is triple the $10,000 paid in NSW, VIC metro, and WA, and combined with zero transfer duty on new homes it makes Queensland the most generous state for buying a new first home.",
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
  { title: "Stamp Duty QLD",         href: "/guides/stamp-duty-qld",          description: "Queensland transfer duty, the 2024 first home concession and worked examples." },
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
      <Callout variant="success" title="The $30,000 grant stays — the 1 July step-down was cancelled">
        <p>
          Queensland&rsquo;s boosted <strong>$30,000</strong> First Home Owner
          Grant was scheduled to revert to $15,000 for contracts signed from 1
          July 2026. It didn&rsquo;t: the <strong>2026-27 Queensland Budget</strong>{" "}
          (23 June 2026) locked the $30,000 grant in for another four years, and
          made the zero transfer duty for first home buyers on new homes
          permanent. The{" "}
          <a href="https://qro.qld.gov.au/property-concessions-grants/first-home-grant/" target="_blank" rel="noopener noreferrer">
            Queensland Revenue Office
          </a>{" "}
          confirms $30,000 for eligible contracts signed from 20 November 2023,
          with no end date currently published. Verify your own eligibility with
          QRO or a licensed conveyancer before signing.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The step-down everyone (including us, briefly) expected on 1
          July never happened — the Budget kept the $30,000 grant, and
          on a new build it now stacks with zero transfer duty. That
          combination routinely clears $50,000 in support, which is why
          new homes deserve a serious look in Queensland even if you
          started out shopping established. The trap I see most:
          buyers assume the QLD contract works like NSW with a
          cooling-off they&rsquo;ll lean on. The REIQ contract is built
          around subject-to clauses instead. Negotiate the conditions
          in, don&rsquo;t plan to wriggle out later.
        </p>
      </EditorNote>

      <h2 id="fhog-qld">$30,000 First Home Owner Grant QLD</h2>
      <p className="lead">
        Queensland pays a $30,000 First Home Owner Grant to eligible first home
        buyers purchasing or building a new home — the largest first home grant
        in the country, locked in by the 2026-27 State Budget.
      </p>

      <KeyFigure
        value="$30,000"
        label="The QLD First Home Owner Grant on new homes up to $750,000, for eligible contracts signed from 20 November 2023."
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
        Queensland's first home buyer duty relief is now among the most generous
        in the country, and it runs on two tracks depending on what you buy.
      </p>

      <h3>New homes and vacant land: zero duty</h3>
      <ul>
        <li>Eligible first home buyers pay <strong>no transfer duty on a new home</strong>, with no price cap — made permanent in the 2026-27 Budget (in place since 1 May 2025)</li>
        <li>A separate first home vacant land concession applies on land up to $500,000</li>
        <li>The property must be your first home in Australia and you must move in within the required occupancy window</li>
      </ul>

      <h3>Established homes: full concession to $700,000</h3>
      <ul>
        <li>Full concession (i.e. $0 duty) on established homes up to <strong>$700,000</strong></li>
        <li>The concession phases out between $700,000 and $800,000</li>
        <li>Above $800,000, standard duty applies with no first home discount — on an $800,000 buy that's the full $29,025</li>
      </ul>

      <p>
        See our full <Link href="/guides/stamp-duty-qld">Queensland stamp duty
        guide</Link> for worked examples, and use the{" "}
        <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link> for
        precise figures on your price.
      </p>

      <h3>Home Concession (not exclusive to first home buyers)</h3>
      <p>
        Queensland also applies a standard Home Concession for all owner-occupiers,
        not just first home buyers, so even buyers over the first-home thresholds
        pay less than the general rate on a home they'll live in.
      </p>

      <h2 id="federal-schemes">Federal schemes available in QLD</h2>
      <ul>
        <li>
          <strong>5% Deposit Scheme (expanded First Home Guarantee):</strong> 5%
          deposit, no LMI. Since the late-2025 expansion there is no income test
          and places are uncapped. Property price caps apply by location — check
          the current QLD cap with Housing Australia. See our{" "}
          <Link href="/guides/first-home-guarantee">5% Deposit Scheme guide</Link>.
        </li>
        <li>
          <strong>Family Home Guarantee:</strong> 2% deposit for eligible single
          parents and guardians, even if they've owned before.
        </li>
        <li>
          <strong>Help to Buy (shared equity):</strong> Up to 40% government equity
          on new homes / 30% on existing, with a 2% minimum deposit. From 1 July
          2026 the income caps are $103,000 (singles) and $165,000 (joint or
          single parents), with 10,000 new places for 2026-27. See our{" "}
          <Link href="/guides/help-to-buy-scheme-australia">Help to Buy guide</Link>.
        </li>
      </ul>
      <p>
        See our{" "}
        <Link href="/guides/first-home-buyer-guide">national First Home Buyer Guide</Link>{" "}
        for full federal scheme detail and how the schemes stack with Queensland's
        grant and duty relief.
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
          <a href="https://qro.qld.gov.au/property-concessions-grants/first-home-grant/" target="_blank" rel="noopener noreferrer">
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
