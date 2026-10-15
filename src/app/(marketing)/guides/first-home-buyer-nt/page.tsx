import type { Metadata } from "next";
import { HelpToBuyNote } from "@/components/guide/HelpToBuyNote";
import { FhssNote } from "@/components/guide/FhssNote";
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
import { HomeGuaranteeNote } from "@/components/guide/HomeGuaranteeNote";
import { HG_DATES, HG_NT_CAP_BEFORE_SPLIT, HG_PRICE_CAPS, fmtCap, hgCapSentence } from "@/lib/data/home-guarantee";
import { calculateStampDuty } from "@/lib/utils/stamp-duty";
import { FIRST_HOME_GRANTS, FIRST_HOME_REVIEWED_ON, currentGrant, formatPolicyDate, money, periodLabel } from "@/lib/policy/first-home";

// Figures from src/lib/policy/first-home.ts and the stamp duty engine.
const GRANT = currentGrant("NT");
const GRANT_FROM = formatPolicyDate(GRANT.effectiveFrom as string);
const GRANT_TO = formatPolicyDate(GRANT.effectiveTo as string);
const NT_GRANTS = FIRST_HOME_GRANTS.NT.versions;
const NEXT = NT_GRANTS.find((v) => v.effectiveFrom === "2027-10-01")!;
const ESTABLISHED = NT_GRANTS.find((v) => v.kinds.includes("established"))!;
const duty = (price: number) => calculateStampDuty(price, "NT", true, false, false).total;

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide Northern Territory: Grants & Schemes (2026)",
  description:
    "NT first home buyer guide: the $50,000 HomeGrown Territory Grant for a new home (contracts to 30 September 2027), no first home stamp duty concession, leasehold land, and federal scheme caps for Darwin.",
  slug: "first-home-buyer-nt",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-14",
  readingTimeMinutes: 8,
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
  `The HomeGrown Territory Grant pays ${money(GRANT.amount)} to a first home buyer building or buying a new home, including off-the-plan and owner-builder homes, with no price cap, for contracts from ${GRANT_FROM} to ${GRANT_TO}. Apply by 30 September 2028 and live in the home for 12 months.`,
  `From 1 October 2027 the grant is scheduled to revert to the ${money(NEXT.amount)} First Home Owner Grant on new homes. The ${money(ESTABLISHED.amount)} grant for established homes covered contracts from ${periodLabel(ESTABLISHED)} only.`,
  `The NT has no first home stamp duty concession: a first home buyer pays the same duty as anyone else, ${money(duty(500_000))} on a $500,000 home.`,
  `The 5% Deposit Scheme cap is ${fmtCap(HG_PRICE_CAPS.NT.capital)} in Greater Darwin and ${fmtCap(HG_PRICE_CAPS.NT.rest)} in the rest of the NT; Darwin's rose from ${fmtCap(HG_NT_CAP_BEFORE_SPLIT)} on ${HG_DATES.ntCapSplit}.`,
  "Land tenure matters in the NT: a significant share of land is leasehold, not freehold. In established Darwin suburbs Crown Lease is the norm and behaves like freehold for most purposes.",
  "Engage an NT-qualified conveyancer early, especially for properties in remote areas or on community land.",
];

const TOC: GuideTOCEntry[] = [
  { id: "fhog",                  label: "HomeGrown Territory Grant" },
  { id: "stamp-duty",            label: "Stamp duty in the NT" },
  { id: "federal-schemes",       label: "Federal government schemes" },
  { id: "leasehold",             label: "Leasehold land in the NT" },
  { id: "darwin-market",         label: "Darwin property market" },
  { id: "eligibility",           label: "Eligibility requirements" },
  { id: "steps",                 label: "Step-by-step buying in the NT" },
  { id: "resources",             label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "How does the NT grant differ from other states?",
    answer:
      `It's the largest first home grant in Australia: ${money(GRANT.amount)} on a new home, with no price cap, for contracts from ${GRANT_FROM} to ${GRANT_TO} (Territory Revenue Office). The NT has no first home stamp duty concession, so the grant is the help; on a $600,000 new home it more than covers the ${money(duty(600_000))} duty bill. It isn't paid on vacant land alone.`,
  },
  {
    question: "Does the NT have a first home stamp duty concession?",
    answer:
      `No. The First Home Owner Discount no longer applies, and there's no first home buyer duty concession on new or established homes. A first home buyer pays ${money(duty(500_000))} on a $500,000 home, the same as anyone else. A separate House and Land Package Exemption, open to any buyer of a new house-and-land package from a builder, applies to contracts from 1 July 2022 to 30 June 2027; check its conditions with the Territory Revenue Office.`,
  },
  {
    question: "Should I worry about leasehold land in Darwin?",
    answer:
      "For established Darwin suburbs on standard Crown Lease, leasehold operates similarly to freehold for practical purposes and major banks lend on it. Concerns rise on remote properties, community land governed by the Aboriginal Land Rights Act, or unusual tenure arrangements. Your conveyancer should confirm tenure for any specific property.",
  },
  {
    question: "What's the 5% Deposit Scheme price cap in the NT?",
    answer:
      `${hgCapSentence("NT")}. Darwin's cap rose from ${fmtCap(HG_NT_CAP_BEFORE_SPLIT)} on ${HG_DATES.ntCapSplit}; the rest of the territory stayed at ${fmtCap(HG_PRICE_CAPS.NT.rest)}. There has been no income test since ${HG_DATES.expanded}.`,
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
  { title: "Stamp Duty NT",          href: "/guides/stamp-duty-nt",          description: "Northern Territory stamp duty, worked examples and the HomeGrown Territory Grant." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",          description: "Estimate NT stamp duty in seconds." },
  { title: "Building & Pest Inspection",        href: "/guides/building-pest-inspection",description: "Cyclone-zone construction and tropical-climate inspection priorities." },
  { title: "Conveyancing in Australia",         href: "/guides/conveyancing-guide",      description: "What conveyancers do, what they cost, and what to ask." },
  { title: "Renter's Rights in the NT",         href: "/guides/renters-rights-nt",       description: "Tenant entitlements while you save your deposit." },
];

const STEPS = [
  { step: "1", title: "Understand the NT market and land tenure", desc: "Research Darwin/regional and the tenure of any property you consider. Engage an NT conveyancer early: leasehold rules differ from mainland states." },
  { step: "2", title: "Calculate your total costs", desc: "Stamp duty at the full rate (there's no first home concession), legal fees, building inspection (cyclone rating compliance), moving costs." },
  { step: "3", title: "Check grant and scheme eligibility", desc: `Confirm eligibility for the ${money(GRANT.amount)} HomeGrown Territory Grant (a new home, contract by ${GRANT_TO}) and the 5% Deposit Scheme (${fmtCap(HG_PRICE_CAPS.NT.capital)} cap in Greater Darwin, ${fmtCap(HG_PRICE_CAPS.NT.rest)} elsewhere).` },
  { step: "4", title: "Get pre-approval", desc: "Use a lender that actively lends on NT Crown Lease properties. Not all lenders operate in the NT; a broker familiar with Darwin helps." },
  { step: "5", title: "Search and inspect", desc: "Building and pest inspection. In Darwin also check cyclone ratings, AC systems, flood/inundation exposure." },
  { step: "6", title: "Engage an NT conveyancer", desc: "They review the contract, confirm land tenure, do title searches, and manage settlement." },
  { step: "7", title: "Apply for the grant", desc: "Through your lender or directly with the Territory Revenue Office, by 30 September 2028." },
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
          The NT&rsquo;s help for first home buyers is one big number: a
          $50,000 grant on a new home, the largest in the country, with no
          price cap. There&rsquo;s no first home duty concession, so on an
          established home you pay full duty and get no grant. The
          Territory&rsquo;s real trap is land tenure. A meaningful share of NT land is leasehold, and
          properties on community land or in remote areas have
          conveyancing and financing quirks no east-coast lender or
          solicitor will spot. Hire an NT-licensed conveyancer before
          you offer on anything outside established Darwin suburbs.
        </p>
      </EditorNote>

      <h2 id="fhog">HomeGrown Territory Grant, Northern Territory</h2>
      <p className="lead">
        {`The HomeGrown Territory Grant pays ${money(GRANT.amount)} to an eligible first home buyer who builds or buys a new home, including off-the-plan and owner-builder homes, for contracts from ${GRANT_FROM} to ${GRANT_TO}. There's no price cap. It's administered by the Territory Revenue Office.`}
      </p>

      <KeyFigure
        value={money(GRANT.amount)}
        label={`The HomeGrown Territory Grant for a first home buyer building or buying a new home, contracts ${GRANT_FROM} to ${GRANT_TO}.`}
        context="No price cap · not for vacant land alone"
      />

      <p>
        {`You must live in the home for 12 months, and apply by 30 September 2028. The grant isn't paid on vacant land alone. For contracts from 1 October 2027 it's scheduled to revert to the ${money(NEXT.amount)} First Home Owner Grant on new homes. The ${money(ESTABLISHED.amount)} grant for an established home applied to contracts from ${periodLabel(ESTABLISHED)} and has closed.`}
      </p>
      <p>
        The grant is paid at settlement for completed purchases, or at the first
        progress payment for construction loans. Applications can be lodged
        through your lender as an approved agent of the Territory Revenue Office.
      </p>

      <h2 id="stamp-duty">Stamp duty in the NT: no first home concession</h2>
      <p>
        {`The NT has no first home buyer duty concession on new or established homes; the First Home Owner Discount no longer applies. Every buyer pays the same duty: ${money(duty(500_000))} on a $500,000 home and ${money(duty(750_000))} on $750,000. A separate House and Land Package Exemption, for any buyer of a new house-and-land package from a builder, applies to contracts from 1 July 2022 to 30 June 2027.`}
      </p>

      <table>
        <thead>
          <tr><th>First home help</th><th>Amount</th><th>Property</th><th>Contracts</th></tr>
        </thead>
        <tbody>
          <tr><td>HomeGrown Territory Grant</td><td>{money(GRANT.amount)}</td><td>New home, bought or built</td><td>{periodLabel(GRANT)}</td></tr>
          <tr><td>Established-home grant (closed)</td><td>{money(ESTABLISHED.amount)}</td><td>Established home</td><td>{periodLabel(ESTABLISHED)}</td></tr>
          <tr><td>First Home Owner Grant (scheduled)</td><td>{money(NEXT.amount)}</td><td>New home</td><td>{periodLabel(NEXT)}</td></tr>
          <tr><td>First home stamp duty concession</td><td>None</td><td>Any</td><td></td></tr>
        </tbody>
      </table>

      <p>
        Checked against the{" "}
        <a href={FIRST_HOME_GRANTS.NT.source.href} target="_blank" rel="noopener noreferrer">
          Territory Revenue Office
        </a>{" "}
        on {formatPolicyDate(FIRST_HOME_REVIEWED_ON)}.
      </p>

      <h2 id="federal-schemes">Federal government schemes</h2>

      <h3>5% Deposit Scheme (First Home Guarantee)</h3>
      <ul>
        <HomeGuaranteeNote state="NT" />
      </ul>

      <h3>Help to Buy</h3>
      <HelpToBuyNote state="NT" as="p" />

      <h3>First Home Super Saver scheme (FHSS)</h3>
      <FhssNote as="p" />

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
        <li><strong>Finance:</strong> Some lenders are cautious about lending on leasehold. Not all standard home loans apply, so check with your lender early.</li>
        <li><strong>Remote communities:</strong> Many Aboriginal communities operate under different land tenure under the Aboriginal Land Rights (Northern Territory) Act 1976. Special rules apply and buying involves different processes.</li>
      </ul>
      <p>
        In Darwin&rsquo;s established suburbs, most residential land is on Crown Lease,
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
      <p>For the HomeGrown Territory Grant:</p>
      <ul>
        <li>Be an Australian citizen or permanent resident</li>
        <li>Be 18 years or older</li>
        <li>Have never previously owned residential property in Australia used as a place of residence</li>
        <li>Live in the home as your principal place of residence for 12 months</li>
        <li>Build or buy a new home, including off-the-plan (not vacant land alone), under a contract signed by 30 September 2027, and apply by 30 September 2028</li>
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
