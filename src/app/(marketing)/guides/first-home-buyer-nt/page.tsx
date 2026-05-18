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
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide Northern Territory: Grants & Schemes (2026)",
  description:
    "NT first home buyer guide: $10,000 FHOG, First Home Owner Discount of up to $23,928.60 in stamp duty relief, leasehold land considerations, and federal scheme caps for Darwin.",
  slug: "first-home-buyer-nt",
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
  "NT's FHOG is $10,000 on new or substantially renovated homes (more flexible than most state grants).",
  "The First Home Owner Discount delivers up to $23,928.60 of stamp duty relief, on new and established homes alike.",
  "Total maximum benefit for new homes is roughly $33,928.60, one of the most generous combinations in Australia by dollar value.",
  "First Home Guarantee cap is $600,000 across the NT (Darwin and regional).",
  "Land tenure matters in the NT: a significant share of land is leasehold, not freehold. In established Darwin suburbs Crown Lease is the norm and behaves like freehold for most purposes.",
  "Engage an NT-qualified conveyancer early, especially for properties in remote areas or on community land.",
];

const TOC: GuideTOCEntry[] = [
  { id: "fhog",                  label: "First Home Owner Grant NT" },
  { id: "stamp-duty-discount",   label: "First Home Owner Discount (stamp duty)" },
  { id: "federal-schemes",       label: "Federal government schemes" },
  { id: "leasehold",             label: "Leasehold land in the NT" },
  { id: "darwin-market",         label: "Darwin property market" },
  { id: "eligibility",           label: "Eligibility requirements" },
  { id: "steps",                 label: "Step-by-step buying in the NT" },
  { id: "resources",             label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "How does the NT FHOG differ from other states?",
    answer:
      "Two ways. First, it covers substantially renovated homes (not just new builds), which adds flexibility in the NT where new stock can be limited. Second, it stacks with the First Home Owner Discount on stamp duty (up to $23,928.60), so the total benefit can reach roughly $34,000 on a new home.",
  },
  {
    question: "Does the NT First Home Owner Discount apply to established homes?",
    answer:
      "Yes. Unlike the FHOG (new homes only), the First Home Owner Discount applies to both new and established homes, up to $23,928.60 in stamp duty relief. For lower-priced properties this can fully eliminate stamp duty.",
  },
  {
    question: "Should I worry about leasehold land in Darwin?",
    answer:
      "For established Darwin suburbs on standard Crown Lease, leasehold operates similarly to freehold for practical purposes and major banks lend on it. Concerns rise on remote properties, community land governed by the Aboriginal Land Rights Act, or unusual tenure arrangements. Your conveyancer should confirm tenure for any specific property.",
  },
  {
    question: "What's the FHBG price cap in the NT?",
    answer:
      "$600,000 across the NT (Darwin and regional). This cap is broadly aligned with NT median prices and applies the same income limits as elsewhere ($125K single / $200K couple).",
  },
  {
    question: "Why do I need a building inspection in Darwin specifically?",
    answer:
      "Cyclone ratings, air conditioning, insulation, and any flood/inundation risk all matter more in the tropics. A pre-purchase inspection should cover cyclone-zone construction compliance and the condition of cooling systems, on top of the usual structural checks.",
  },
  {
    question: "What's the cooling-off period in the NT?",
    answer:
      "Generally 4 business days for residential property under private treaty. There's no cooling-off period at auction. Confirm specific terms in your contract with your NT conveyancer.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide", description: "Federal schemes, FHOG by state, and step-by-step process." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",          description: "Estimate NT stamp duty (with or without the First Home Owner Discount)." },
  { title: "Building & Pest Inspection",        href: "/guides/building-pest-inspection",description: "Cyclone-zone construction and tropical-climate inspection priorities." },
  { title: "Conveyancing in Australia",         href: "/guides/conveyancing-guide",      description: "What conveyancers do, what they cost, and what to ask." },
  { title: "Renter's Rights in the NT",         href: "/guides/renters-rights-nt",       description: "Tenant entitlements while you save your deposit." },
];

const STEPS = [
  { step: "1", title: "Understand the NT market and land tenure", desc: "Research Darwin/regional and the tenure of any property you consider. Engage an NT conveyancer early, leasehold rules differ from mainland states." },
  { step: "2", title: "Calculate your total costs", desc: "Stamp duty (up to $23,928.60 offset by the First Home Owner Discount), legal fees, building inspection (cyclone rating compliance), moving costs." },
  { step: "3", title: "Check grant and scheme eligibility", desc: "Confirm eligibility for the $10,000 FHOG (new/substantially renovated), First Home Owner Discount, and FHBG ($600K cap)." },
  { step: "4", title: "Get pre-approval", desc: "Use a lender that actively lends on NT Crown Lease properties. Not all lenders operate in the NT; a broker familiar with Darwin helps." },
  { step: "5", title: "Search and inspect", desc: "Building and pest inspection. In Darwin also check cyclone ratings, AC systems, flood/inundation exposure." },
  { step: "6", title: "Engage an NT conveyancer", desc: "They review the contract, confirm land tenure, do title searches, and manage settlement." },
  { step: "7", title: "Apply for the FHOG and Discount", desc: "Through your lender or directly with the Territory Revenue Office before settlement." },
];

export default function FirstHomeBuyerNTPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Verify with the Territory Revenue Office">
        <p>
          NT property rules, particularly around leasehold land, can be complex.
          Verify grant amounts and eligibility with the{" "}
          <a href="https://www.treasury.nt.gov.au/revenue" target="_blank" rel="noopener noreferrer">
            Territory Revenue Office
          </a>{" "}
          and engage a qualified NT conveyancer.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The NT combines a $10K FHOG with a stamp duty discount worth
          up to $23,928.60 on both new and established homes. Stacked,
          that&rsquo;s one of the bigger combined benefits in the
          country by dollar value. The Territory&rsquo;s real trap is
          land tenure. A meaningful share of NT land is leasehold, and
          properties on community land or in remote areas have
          conveyancing and financing quirks no east-coast lender or
          solicitor will spot. Hire an NT-licensed conveyancer before
          you offer on anything outside established Darwin suburbs.
        </p>
      </EditorNote>

      <h2 id="fhog">First Home Owner Grant, Northern Territory</h2>
      <p className="lead">
        The Northern Territory offers a $10,000 First Home Owner Grant for
        eligible first home buyers purchasing or building a new or substantially
        renovated home. The grant is administered by the Territory Revenue Office.
      </p>

      <KeyFigure
        value="$33,928"
        label="The maximum total benefit available to NT first home buyers stacking the FHOG and First Home Owner Discount."
        context="On a new home meeting all thresholds"
      />

      <p>
        Unlike most state FHOGs, the NT grant also extends to <strong>substantially
        renovated homes</strong>, properties so comprehensively renovated they're
        effectively new. That gives more options in a market where new stock can
        be limited.
      </p>
      <p>
        The grant is paid at settlement for completed purchases, or at the first
        progress payment for construction loans. Applications can be lodged
        through your lender as an approved agent of the Territory Revenue Office.
      </p>

      <h2 id="stamp-duty-discount">First Home Owner Discount, stamp duty relief</h2>
      <p>
        On top of the FHOG, the NT provides a First Home Owner Discount on stamp
        duty (conveyance duty), worth up to <strong>$23,928.60</strong>. That can
        completely eliminate stamp duty on lower-priced properties and
        significantly reduce it on higher-value purchases.
      </p>

      <table>
        <thead>
          <tr><th>Benefit</th><th>Maximum value</th><th>Property type</th></tr>
        </thead>
        <tbody>
          <tr><td>First Home Owner Grant</td><td>$10,000</td><td>New / substantially renovated</td></tr>
          <tr><td>First Home Owner Discount (stamp duty)</td><td>$23,928.60</td><td>New and established</td></tr>
          <tr><td><strong>Total maximum benefit</strong></td><td><strong>~$33,928.60</strong></td><td>New homes</td></tr>
        </tbody>
      </table>

      <p>
        Verify exact eligibility and current discount amounts with the Territory
        Revenue Office, as thresholds can be adjusted.
      </p>

      <h2 id="federal-schemes">Federal government schemes</h2>

      <h3>First Home Guarantee</h3>
      <p>
        5% deposit, no LMI. NT price cap is <strong>$600,000</strong> for both
        Darwin and regional NT.
      </p>

      <h3>Regional First Home Buyer Guarantee</h3>
      <p>
        For buyers in regional NT who've lived in the region for 12+ months. Same
        5% deposit / no LMI benefit. Most of the NT outside Darwin qualifies as
        regional.
      </p>

      <h3>First Home Super Saver Scheme (FHSSS)</h3>
      <p>
        Voluntary super contributions of up to $15,000/year (max $50,000) can be
        withdrawn for a first home deposit. Tax savings can be substantial for
        higher-income earners.
      </p>

      <h2 id="leasehold">Leasehold land, a critical NT consideration</h2>
      <p>
        One of the most important and often misunderstood aspects of buying
        property in the NT is <strong>land tenure</strong>. A significant share
        of NT land operates under leasehold tenure rather than freehold.
      </p>

      <h3>What is leasehold land?</h3>
      <p>
        With leasehold land, the government (or another entity such as a land
        council) retains ownership of the land. You purchase the right to use and
        occupy the land for a specified term, often 99 years.
      </p>
      <ul>
        <li><strong>Security of tenure:</strong> Long-term leases (99 years) provide reasonable security; the government retains underlying ownership.</li>
        <li><strong>Resale:</strong> You can sell your leasehold interest; the buyer inherits the remaining lease term.</li>
        <li><strong>Finance:</strong> Some lenders are cautious about lending on leasehold. Not all standard home loans apply, check with your lender early.</li>
        <li><strong>Remote communities:</strong> Many Aboriginal communities operate under different land tenure under the Aboriginal Land Rights (Northern Territory) Act 1976. Special rules apply and buying involves different processes.</li>
      </ul>
      <p>
        In Darwin's established suburbs, most residential land is on Crown Lease,
        a long-term arrangement that functions similarly to freehold for most
        practical purposes, and most lenders accept it. Always confirm the
        specific tenure of any property with your conveyancer.
      </p>

      <Callout variant="warning" title="Get NT-specific legal advice">
        <p>
          Before purchasing in the NT, particularly in remote areas or on
          community land, engage an NT-qualified conveyancer or solicitor who
          specialises in NT land tenure. Rules differ significantly from mainland
          states.
        </p>
      </Callout>

      <h2 id="darwin-market">Darwin property market overview</h2>
      <p>
        Darwin has historically been more volatile than other Australian capitals,
        with boom-and-bust cycles tied to resource sector activity, government
        infrastructure spending, and population flows.
      </p>
      <ul>
        <li>Median house prices are generally lower than southern capitals, more accessible for first home buyers</li>
        <li>Strong rental demand from government and defence sector employment</li>
        <li>High proportion of attached dwellings (units, townhouses), popular with first home buyers and investors</li>
        <li>Tropical climate influences property design and maintenance (cyclone ratings, insulation, AC systems)</li>
        <li>Alice Springs and other regional centres offer even lower entry points</li>
      </ul>

      <h2 id="eligibility">Eligibility requirements</h2>
      <p>For the NT FHOG and First Home Owner Discount:</p>
      <ul>
        <li>Be an Australian citizen or permanent resident</li>
        <li>Be 18 years or older</li>
        <li>Have never previously owned residential property in Australia used as a place of residence</li>
        <li>Occupy the home as your principal place of residence for at least 6 continuous months, starting within 12 months of settlement or completion</li>
        <li>For the FHOG, the property must be new or substantially renovated</li>
      </ul>

      <h2 id="steps">Step-by-step, buying your first home in the NT</h2>
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
          <strong>Territory Revenue Office</strong>, FHOG and stamp duty:{" "}
          <a href="https://www.treasury.nt.gov.au/revenue" target="_blank" rel="noopener noreferrer">treasury.nt.gov.au/revenue</a>
        </li>
        <li>
          <strong>NT Consumer Affairs</strong>, tenancy and property:{" "}
          <a href="https://www.consumeraffairs.nt.gov.au" target="_blank" rel="noopener noreferrer">consumeraffairs.nt.gov.au</a>
        </li>
        <li>
          <strong>Housing Australia</strong>, First Home Guarantee and federal schemes:{" "}
          <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer">housingaustralia.gov.au</a>
        </li>
        <li>
          <strong>NT Land Administration</strong>, land tenure information:{" "}
          <a href="https://www.lands.nt.gov.au" target="_blank" rel="noopener noreferrer">lands.nt.gov.au</a>
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
