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
  title: "First Home Buyer Guide ACT: Schemes, Stamp Duty & Canberra Property (2026)",
  description:
    "ACT first home buyer guide: no FHOG (instead a full stamp duty waiver via the Home Buyer Concession Scheme), ACT Shared Equity, $750,000 First Home Guarantee cap, and how leasehold land works.",
  slug: "first-home-buyer-act",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 9,
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
  "ACT is the only jurisdiction in Australia with no FHOG. Instead, the Home Buyer Concession Scheme delivers a full stamp duty waiver, often worth more than a cash grant.",
  "On a $700,000 ACT home, the HBCS can wipe out a stamp duty bill of roughly $27,000.",
  "The ACT Shared Equity Scheme co-invests with eligible lower-to-middle income buyers (teachers, nurses, junior public servants).",
  "Land Rent Scheme lets you lease the land from the ACT Government and only finance the build, lowering upfront capital required.",
  "First Home Guarantee cap is $750,000 in the ACT, joint second highest in Australia.",
  "All ACT land is held under 99-year Crown Lease (leasehold). For standard residential purchases this operates almost identically to freehold.",
];

const TOC: GuideTOCEntry[] = [
  { id: "no-fhog",       label: "No FHOG in the ACT" },
  { id: "hbcs",          label: "Home Buyer Concession Scheme" },
  { id: "shared-equity", label: "ACT Shared Equity Scheme" },
  { id: "land-rent",     label: "Land Rent Scheme" },
  { id: "federal-schemes", label: "Federal government schemes" },
  { id: "leasehold",     label: "Leasehold land in the ACT" },
  { id: "canberra-market", label: "Canberra property market" },
  { id: "eligibility",   label: "Eligibility requirements" },
  { id: "steps",         label: "Step-by-step buying in the ACT" },
  { id: "resources",     label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Why doesn't the ACT offer a First Home Owner Grant?",
    answer:
      "The ACT replaced the FHOG with the Home Buyer Concession Scheme, which gives eligible first home buyers a full stamp duty waiver. Given Canberra's high property prices and high stamp duty bills, this is typically worth more than a $10,000 to $30,000 grant. On a $700,000 home, the saving can be roughly $27,000.",
  },
  {
    question: "Does HBCS apply to both new and established homes?",
    answer:
      "Yes. Unlike most state FHOGs, the HBCS isn't restricted to new builds. Both new and established homes qualify provided income and property value thresholds are met.",
  },
  {
    question: "Should I worry about leasehold land?",
    answer:
      "For standard residential purchases, no. All ACT land is Crown Lease (typically 99-year terms), but every major Australian bank lends on it without issue, and lease renewals are routine. Leasehold matters more if you plan to develop, subdivide, or change the use of a property, where 'change of use charges' may apply.",
  },
  {
    question: "What's the Land Rent Scheme?",
    answer:
      "An ACT-specific scheme where you lease the land from the ACT Government and pay annual land rent, while owning the dwelling outright. It cuts the upfront capital required because you only finance the build, not the land. You can convert to a standard Crown Lease (buy the land outright) at any time.",
  },
  {
    question: "Can dual-income professional households get the HBCS?",
    answer:
      "It depends on combined gross income. ACT income thresholds are designed to include typical public service incomes at lower classifications, but dual-income professional households can exceed the cap. Check current thresholds at revenue.act.gov.au before assuming eligibility.",
  },
  {
    question: "What's the cooling-off period in the ACT?",
    answer:
      "5 business days for residential property purchased under private treaty. No cooling-off period at auction. The standard ACT contract is well established and conveyancers handle the process via PEXA.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide", description: "Federal schemes, FHOG by state, stamp duty concessions and step-by-step process." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",          description: "Estimate ACT conveyance duty (with or without the HBCS waiver)." },
  { title: "Conveyancing in Australia",         href: "/guides/conveyancing-guide",      description: "What conveyancers do, what they cost, and what to ask in the ACT." },
  { title: "Lenders Mortgage Insurance",        href: "/guides/lenders-mortgage-insurance-guide", description: "What LMI costs and the schemes that waive it." },
  { title: "Renter's Rights in the ACT",        href: "/guides/renters-rights-act",      description: "Tenant entitlements while you save your deposit." },
];

const STEPS = [
  { step: "1", title: "Check HBCS eligibility first", desc: "Confirm income and property-value thresholds before searching. Zero stamp duty vs a $20K+ bill changes your total budget significantly." },
  { step: "2", title: "Calculate your total budget", desc: "Conveyancing ($1,500 to $2,500), inspections, title searches, moving. Exclude stamp duty if HBCS-eligible; include it if not." },
  { step: "3", title: "Consider the First Home Guarantee", desc: "If your deposit is under 20%, FHBG (5% deposit, no LMI, $750,000 cap) saves tens of thousands in LMI. Apply via a participating lender." },
  { step: "4", title: "Get pre-approval", desc: "Any major bank lends on ACT Crown Lease properties without issue, leasehold isn't an obstacle." },
  { step: "5", title: "Understand the Crown Lease", desc: "Have your conveyancer review lease conditions and any development or change-of-use restrictions on the property." },
  { step: "6", title: "Make an offer and sign", desc: "Standard ACT purchase contract. 5 business days cooling-off on private treaty (none at auction)." },
  { step: "7", title: "Apply for HBCS", desc: "Lodge with the ACT Revenue Office, typically as part of settlement through your conveyancer." },
];

export default function FirstHomeBuyerACTPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Verify with the ACT Revenue Office">
        <p>
          ACT property rules (income and property thresholds, leasehold change-of-use
          charges) can be complex and change. Always verify current details with the{" "}
          <a href="https://www.revenue.act.gov.au" target="_blank" rel="noopener noreferrer">
            ACT Revenue Office
          </a>{" "}
          or a licensed ACT conveyancer.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The ACT is the one jurisdiction with no FHOG, and most buyers
          read that as &ldquo;less generous.&rdquo; It isn&rsquo;t. The
          Home Buyer Concession Scheme delivers a full stamp duty waiver
          which on a $700K Canberra home is worth roughly $27K, well
          ahead of any state grant. The thing that actually catches
          Canberra buyers off guard is leasehold land. Every block is a
          99-year Crown Lease. For owner-occupier purchases it behaves
          like freehold, but make sure your conveyancer is ACT-licensed
          and knows the change-of-use rules.
        </p>
      </EditorNote>

      <h2 id="no-fhog">No FHOG in the ACT, here's what you get instead</h2>
      <p className="lead">
        Unlike every other Australian state and territory, the ACT does <strong>not</strong>{" "}
        offer a First Home Owner Grant. The ACT Government replaced it with the Home
        Buyer Concession Scheme, which can deliver more value than a cash grant by
        eliminating stamp duty entirely for eligible buyers.
      </p>

      <KeyFigure
        value="$0"
        label="Stamp duty payable in the ACT under the Home Buyer Concession Scheme."
        context="A $700K home would normally attract roughly $27,000 in duty"
      />

      <p>
        Given that Canberra has some of the highest property prices in Australia,
        and therefore high stamp duty bills, the HBCS is typically worth far more
        than a FHOG would be.
      </p>

      <h2 id="hbcs">Home Buyer Concession Scheme (HBCS)</h2>
      <p>
        The HBCS allows eligible first home buyers in the ACT to pay <strong>no
        stamp duty (conveyance duty)</strong> on their purchase. This is a full
        exemption, not a concession or reduction.
      </p>

      <p>Key eligibility requirements:</p>
      <ul>
        <li>At least one buyer must be an Australian citizen or permanent resident</li>
        <li>No buyer or their spouse/partner can have previously owned residential property in Australia</li>
        <li>The property must be the buyer's principal place of residence</li>
        <li>Income thresholds apply (combined gross income of all buyers)</li>
        <li>Property value thresholds apply (dutiable value cap)</li>
      </ul>
      <p>
        Income and property price thresholds are adjusted periodically. Always
        check current thresholds at{" "}
        <a href="https://www.revenue.act.gov.au" target="_blank" rel="noopener noreferrer">
          revenue.act.gov.au
        </a>{" "}
        before planning around HBCS, buying a property just over the threshold
        means full stamp duty applies.
      </p>

      <h2 id="shared-equity">ACT Shared Equity Scheme</h2>
      <p>
        The ACT Government runs a shared equity scheme for eligible buyers who
        can't afford to purchase without additional support. The government
        contributes a portion of the purchase price (equity contribution) in
        exchange for a proportional interest in the property.
      </p>
      <ul>
        <li>The government's equity stake reduces the loan you need, lowering repayments</li>
        <li>You pay no rent or return on the government's share during occupancy</li>
        <li>You can progressively buy out the government's share over time</li>
        <li>When you sell, the government recoups its proportional share of the sale price</li>
        <li>Strict income and asset eligibility criteria apply</li>
      </ul>
      <p>
        This is particularly valuable in Canberra where prices are high relative
        to income for many essential workers (teachers, nurses, junior public
        servants). Check current availability and eligibility with the ACT Housing
        Authority.
      </p>

      <h2 id="land-rent">Land Rent Scheme</h2>
      <p>
        The ACT offers a unique Land Rent Scheme as an alternative to purchasing
        land outright:
      </p>
      <ul>
        <li>You lease the land from the ACT Government and pay annual rent on the land component only</li>
        <li>You own the dwelling (house or improvements) on the land</li>
        <li>Significantly reduces the upfront capital required, you only finance the build</li>
        <li>Land rent rates are set by the government and are generally lower than servicing a land mortgage</li>
        <li>You can convert to a standard Crown Lease (purchase the land outright) at any time</li>
      </ul>
      <p>
        Worth considering for first home buyers building new homes in the ACT,
        particularly in greenfield developments.
      </p>

      <h2 id="federal-schemes">Federal government schemes</h2>

      <h3>First Home Guarantee</h3>
      <p>
        5% deposit, no LMI. ACT price cap is <strong>$750,000</strong>, joint
        second highest in Australia after NSW ($900,000) and tied with Victoria.
        This reflects Canberra's high median prices and makes the scheme
        applicable to a wide range of ACT properties.
      </p>

      <h3>First Home Super Saver Scheme (FHSSS)</h3>
      <p>
        Given Canberra's high average incomes (driven by the public sector), the
        FHSSS is particularly valuable. Voluntary super contributions of up to
        $15,000/year (max $50,000 total) can be withdrawn for a deposit, with
        contributions taxed at 15% rather than your marginal rate.
      </p>

      <h2 id="leasehold">Leasehold land, the ACT's unique system</h2>
      <p>
        The most important thing to understand about Canberra property: <strong>all
        land in the ACT is held under Crown Lease (leasehold tenure)</strong>.
        There is no freehold land in the ACT, the territory government owns all
        land.
      </p>
      <ul>
        <li><strong>You own the dwelling</strong> (house, apartment, or improvements) and hold a Crown Lease over the land, typically 99 years.</li>
        <li><strong>Crown Leases specify permitted use</strong>, e.g. residential, commercial. Using land contrary to the lease is a breach.</li>
        <li><strong>Change-of-use charges:</strong> if you develop, subdivide, or change the use of the land, the government may charge a fee for the uplift in land value.</li>
        <li><strong>Mortgage and finance:</strong> All major banks lend on ACT Crown Lease properties as a matter of course; no unusual financing challenges for standard residential purchases.</li>
        <li><strong>99-year leases:</strong> When a lease approaches the end of its term (rare in modern residential areas), it's typically renewed automatically.</li>
      </ul>
      <p>
        For most buyers of standard residential homes in Canberra, leasehold
        operates almost identically to freehold. The differences become more
        significant when developing or changing use.
      </p>

      <h2 id="canberra-market">Canberra property market overview</h2>
      <p>
        Canberra is consistently among Australia's most expensive markets, driven
        by high incomes, stable government employment, and quality housing demand.
      </p>
      <ul>
        <li>High median house and unit prices, among the top in Australia</li>
        <li>Strong public service employment provides economic stability</li>
        <li>Low vacancy rates and strong rental demand</li>
        <li>Well-planned city with excellent infrastructure, schools, and amenities</li>
        <li>Greenfield developments (Gungahlin, Molonglo/Whitlam, Googong) offer newer, more affordable stock</li>
        <li>Inner Canberra (Braddon, Kingston, Barton, New Acton) commands significant premiums</li>
      </ul>
      <p>
        For first home buyers, the HBCS waiver and the $750K FHBG cap are
        critical enablers in a market where median house prices regularly exceed
        $900,000.
      </p>

      <h2 id="eligibility">Eligibility requirements</h2>
      <p>For the Home Buyer Concession Scheme:</p>
      <ul>
        <li>At least one buyer must be an Australian citizen or permanent resident</li>
        <li>No buyer (or their domestic partner) can have previously owned residential property in Australia</li>
        <li>The property must become the buyer's principal place of residence</li>
        <li>Income and property value thresholds must be met (check current figures at revenue.act.gov.au)</li>
      </ul>
      <p>
        ACT income thresholds are set to include typical public service incomes at
        lower classifications, recognising the importance of accessibility for
        essential workers. Dual-income professional households may exceed the cap.
      </p>

      <h2 id="steps">Step-by-step, buying your first home in the ACT</h2>
      <ol>
        {STEPS.map((s) => (
          <li key={s.step}>
            <strong>{s.title}.</strong> {s.desc}
          </li>
        ))}
      </ol>

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>ACT Revenue Office</strong>, HBCS, stamp duty, land rent:{" "}
          <a href="https://www.revenue.act.gov.au" target="_blank" rel="noopener noreferrer">revenue.act.gov.au</a>
        </li>
        <li>
          <strong>ACT Housing Authority</strong>, shared equity and community housing:{" "}
          <a href="https://www.housing.act.gov.au" target="_blank" rel="noopener noreferrer">housing.act.gov.au</a>
        </li>
        <li>
          <strong>Housing Australia</strong>, First Home Guarantee and federal schemes:{" "}
          <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer">housingaustralia.gov.au</a>
        </li>
        <li>
          <strong>ACT Civil and Administrative Tribunal (ACAT)</strong>, tenancy and property disputes:{" "}
          <a href="https://www.acat.act.gov.au" target="_blank" rel="noopener noreferrer">acat.act.gov.au</a>
        </li>
        <li>
          <strong>Access Canberra</strong>, general ACT government services:{" "}
          <a href="https://www.accesscanberra.act.gov.au" target="_blank" rel="noopener noreferrer">accesscanberra.act.gov.au</a>
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
