import type { Metadata } from "next";
import Link from "next/link";
import { HelpToBuyNote } from "@/components/guide/HelpToBuyNote";
import { FhssNote } from "@/components/guide/FhssNote";
import {
  GuideArticleLayout,
  Callout,
  EditorNote,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { HomeGuaranteeNote } from "@/components/guide/HomeGuaranteeNote";
import { HG_DATES, HG_NT_CAP_BEFORE_SPLIT, HG_PRICE_CAPS, fmtCap, hgCapSentence } from "@/lib/data/home-guarantee";
import { FirstHomeDutyFacts, FirstHomeGrantFacts } from "@/components/guide/FirstHomeStateFacts";
import { FIRST_HOME_DUTY, FIRST_HOME_GRANTS, fmt, firstHomeSources, longDate } from "@/lib/data/first-home-grants";
import { dutyFor, money } from "@/lib/data/stamp-duty-state";

// Grant and duty figures come from src/lib/data/first-home-grants.ts and the
// stamp duty engine (commercial-intent review 10 Oct 2026, buying 0.1 row 8).
// The NT pays the HomeGrown Territory Grant, which replaced its $10,000 First
// Home Owner Grant, and has no first home buyer duty concession.
const GRANT = FIRST_HOME_GRANTS.NT;
const DUTY = FIRST_HOME_DUTY.NT;
const GRANT_AMOUNT = fmt(GRANT.amount!);
const DUTY_500K = money(dutyFor("NT", 500_000, "first").total);

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide Northern Territory: Grants & Schemes (2026)",
  description:
    "NT first home buyer guide: the $50,000 HomeGrown Territory Grant on new homes for contracts to 30 Sep 2027, no first home duty concession, and federal schemes.",
  slug: "first-home-buyer-nt",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-11",
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
  `The NT pays ${GRANT_AMOUNT} under the HomeGrown Territory Grant to a first home buyer who buys or builds a new home, with no price cap, on contracts signed from 1 October 2024 to 30 September 2027 (NT Government, read ${longDate(GRANT.checkedOn)}).`,
  "The HomeGrown Territory Grant replaced the $10,000 First Home Owner Grant. The $10,000 grant for an established home applied only to contracts signed to 30 September 2025.",
  `There is no first home buyer stamp duty concession in the NT: on a $500,000 home a first home buyer pays ${DUTY_500K}, the same as anyone else.`,
  `The 5% Deposit Scheme cap is ${fmtCap(HG_PRICE_CAPS.NT.capital)} in Greater Darwin and ${fmtCap(HG_PRICE_CAPS.NT.rest)} in the rest of the NT; Darwin's rose from ${fmtCap(HG_NT_CAP_BEFORE_SPLIT)} on ${HG_DATES.ntCapSplit}.`,
  "Land tenure matters in the NT: some land is held under Crown lease or on Aboriginal land, not as ordinary freehold. Have your conveyancer confirm the tenure of any property before you offer.",
  "Engage an NT-qualified conveyancer early, especially for properties in remote areas or on community land.",
];

const TOC: GuideTOCEntry[] = [
  { id: "fhog",                  label: "First Home Owner Grant NT" },
  { id: "stamp-duty-discount",   label: "Stamp duty: no first home concession" },
  { id: "federal-schemes",       label: "Federal government schemes" },
  { id: "leasehold",             label: "Leasehold land in the NT" },
  { id: "darwin-market",         label: "Darwin property market" },
  { id: "eligibility",           label: "Eligibility requirements" },
  { id: "steps",                 label: "Step-by-step buying in the NT" },
  { id: "resources",             label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much is the first home buyer grant in the NT?",
    answer:
      `${GRANT_AMOUNT}, under the HomeGrown Territory Grant, for a first home buyer who signs a contract to buy or build a new home between 1 October 2024 and 30 September 2027, with no cap on the price (NT Government, read ${longDate(GRANT.checkedOn)}). You must live in it for 12 months and apply by 30 September 2028. It replaced the $10,000 First Home Owner Grant.`,
  },
  {
    question: "Do first home buyers get a stamp duty discount in the NT?",
    answer:
      `No. The Territory Revenue Office lists no first home buyer duty concession, so a first home buyer pays the same duty as anyone else: ${DUTY_500K} on a $500,000 home. Any buyer of a house and land package from a building contractor, on a contract signed by 30 June 2027, can claim the House and Land Package Exemption (NT Government, read ${longDate(DUTY.checkedOn)}).`,
  },
  {
    question: "Should I worry about leasehold land in Darwin?",
    answer:
      "Check it rather than assume. Tenure in the NT varies: some land is held under Crown lease, and land in remote communities or under the Aboriginal Land Rights Act follows its own rules. Your conveyancer should confirm the tenure of the specific property, and your lender whether it will lend on it, before you sign.",
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
  { title: "Stamp Duty NT",          href: "/guides/stamp-duty-nt",          description: "Northern Territory stamp duty rates and worked examples." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",          description: "Estimate NT stamp duty in seconds." },
  { title: "Building & Pest Inspection",        href: "/guides/building-pest-inspection",description: "Cyclone-zone construction and tropical-climate inspection priorities." },
  { title: "Conveyancing in Australia",         href: "/guides/conveyancing-guide",      description: "What conveyancers do, what they cost, and what to ask." },
  { title: "Renter's Rights in the NT",         href: "/guides/renters-rights-nt",       description: "Tenant entitlements while you save your deposit." },
];

const STEPS = [
  { step: "1", title: "Understand the NT market and land tenure", desc: "Research Darwin/regional and the tenure of any property you consider. Engage an NT conveyancer early, leasehold rules differ from mainland states." },
  { step: "2", title: "Calculate your total costs", desc: "Stamp duty at the full rate (the NT has no first home concession), legal fees, building inspection (cyclone rating compliance), moving costs." },
  { step: "3", title: "Check grant and scheme eligibility", desc: `Confirm eligibility for the ${GRANT_AMOUNT} HomeGrown Territory Grant (new homes, contracts to 30 September 2027) and the 5% Deposit Scheme (${fmtCap(HG_PRICE_CAPS.NT.capital)} cap in Greater Darwin, ${fmtCap(HG_PRICE_CAPS.NT.rest)} elsewhere).` },
  { step: "4", title: "Get pre-approval", desc: "Check the lender will lend on the tenure of the property you want. Not all lenders operate in the NT; a broker familiar with Darwin helps." },
  { step: "5", title: "Search and inspect", desc: "Building and pest inspection. In Darwin also check cyclone ratings, AC systems, flood/inundation exposure." },
  { step: "6", title: "Engage an NT conveyancer", desc: "They review the contract, confirm land tenure, do title searches, and manage settlement." },
  { step: "7", title: "Apply for the grant", desc: "Through your lender or directly with the Territory Revenue Office, within 12 months of settlement." },
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
          <a href={GRANT.source.href} target="_blank" rel="noopener noreferrer">
            NT Government
          </a>{" "}
          and engage a qualified NT conveyancer.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The NT puts all its first home help into one place: a{" "}
          {GRANT_AMOUNT} grant on a new home, and nothing off stamp duty.
          If you are weighing an established home, cost it at full duty
          and no grant. The Territory&rsquo;s other trap is
          land tenure. A meaningful share of NT land is leasehold, and
          properties on community land or in remote areas have
          conveyancing and financing quirks no east-coast lender or
          solicitor will spot. Hire an NT-licensed conveyancer before
          you offer on anything outside established Darwin suburbs.
        </p>
      </EditorNote>

      <h2 id="fhog">HomeGrown Territory Grant (the NT first home grant)</h2>
      <p className="lead">
        The Northern Territory pays the HomeGrown Territory Grant to a first home buyer
        who buys or builds a new home, including off the plan, as an owner-builder or a
        new transportable home fixed to the land. It replaced the First Home Owner Grant.
      </p>

      <FirstHomeGrantFacts state="NT" />

      <p>
        If you apply through your lender, the grant is paid to the lender once you are
        approved, and you can ask for it early to help with the deposit. Through the
        Territory Revenue Office it is paid after settlement, or once the foundations are
        laid on a build (NT Government, read {longDate(GRANT.checkedOn)}).
      </p>

      <h2 id="stamp-duty-discount">Stamp duty: no first home concession</h2>
      <FirstHomeDutyFacts state="NT" />
      <p>
        On a $500,000 home a first home buyer pays {DUTY_500K} in stamp duty, the same as
        any other buyer.
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
        <li><strong>Finance:</strong> Some lenders are cautious about lending on leasehold. Not all standard home loans apply, check with your lender early.</li>
        <li><strong>Remote communities:</strong> Many Aboriginal communities operate under different land tenure under the Aboriginal Land Rights (Northern Territory) Act 1976. Special rules apply and buying involves different processes.</li>
      </ul>
      <p>
        Tenure varies from property to property and lenders treat it differently, so
        confirm the specific tenure of any property with your conveyancer, and check
        your lender will lend on it, before you make an offer.
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
        <li>Prices are generally lower than in the southern capitals; search any NT suburb in our <Link href="/suburbs">suburb profiles</Link> for the figures we can verify</li>
        <li>Strong rental demand from government and defence sector employment</li>
        <li>High proportion of attached dwellings (units, townhouses), popular with first home buyers and investors</li>
        <li>Tropical climate influences property design and maintenance (cyclone ratings, insulation, AC systems)</li>
        <li>Alice Springs and other regional centres offer even lower entry points</li>
      </ul>

      <h2 id="eligibility">Eligibility requirements</h2>
      <p>For the HomeGrown Territory Grant (NT Government, read {longDate(GRANT.checkedOn)}):</p>
      <ul>
        <li>Be a first home buyer: you have not owned a home before anywhere in Australia</li>
        <li>Sign a contract to buy or build in the Territory between 1 October 2024 and 30 September 2027</li>
        <li>The home must never have been lived in or sold as a place of residence</li>
        <li>Apply as people, not a company or trustee; at least one applicant must be over 18 and one an Australian citizen or permanent resident</li>
        <li>Live in the home for at least 12 months after taking possession, or after the build is complete</li>
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
          <strong>Territory Revenue Office</strong>, the HomeGrown Territory Grant and stamp duty:{" "}
          <a href={GRANT.source.href} target="_blank" rel="noopener noreferrer">nt.gov.au</a>
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

      <Sources items={firstHomeSources(["NT"])} />
    </GuideArticleLayout>
  );
}
