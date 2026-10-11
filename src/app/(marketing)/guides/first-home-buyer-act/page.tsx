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
import { HG_DATES, HG_PRICE_CAPS, fmtCap } from "@/lib/data/home-guarantee";
import { FirstHomeDutyFacts, FirstHomeGrantFacts } from "@/components/guide/FirstHomeStateFacts";
import { FIRST_HOME_DUTY, FIRST_HOME_GRANTS, firstHomeSources, longDate } from "@/lib/data/first-home-grants";
import { dutyFor, money } from "@/lib/data/stamp-duty-state";

// The grant's end and the Home Buyer Concession Scheme come from
// src/lib/data/first-home-grants.ts, duty figures from the stamp duty engine
// (commercial-intent review 10 Oct 2026, buying 0.1 row 9: the scheme lost its
// income test and price cap on 1 July 2026).
const GRANT = FIRST_HOME_GRANTS.ACT;
const DUTY = FIRST_HOME_DUTY.ACT;
const DUTY_700K = money(dutyFor("ACT", 700_000, "owner").total);

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide ACT: Schemes, Stamp Duty & Canberra Property (2026)",
  description:
    "ACT first home buyer guide: no grant since 2019, but no stamp duty for eligible buyers from 1 July 2026, with no income test or price cap, plus leasehold.",
  slug: "first-home-buyer-act",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-11",
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
  `The ACT is the only jurisdiction with no first home owner grant: payments ceased on 1 July 2019. The Home Buyer Concession Scheme replaced it, and from ${DUTY.from} an eligible buyer pays no conveyance duty, with no income test and no property value limit (ACT Revenue Office, read ${longDate(DUTY.checkedOn)}).`,
  `On a $700,000 ACT home that saves the ${DUTY_700K} an owner-occupier would otherwise pay.`,
  "The scheme is not only for first home buyers: anyone who has not owned property in the last five years, and will live in the home for a year, can claim it.",
  "Land Rent Scheme lets you lease the land from the ACT Government and only finance the build, lowering upfront capital required.",
  `The 5% Deposit Scheme (First Home Guarantee) cap is ${fmtCap(HG_PRICE_CAPS.ACT.capital)} across the ACT, with no income test since ${HG_DATES.expanded}.`,
  "All ACT land is held under 99-year Crown Lease (leasehold). For standard residential purchases this operates almost identically to freehold.",
];

const TOC: GuideTOCEntry[] = [
  { id: "no-fhog",       label: "No FHOG in the ACT" },
  { id: "hbcs",          label: "Home Buyer Concession Scheme" },
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
      `The ACT stopped paying the grant for transactions from 1 July 2019 and replaced it with the Home Buyer Concession Scheme (ACT Revenue Office, read ${longDate(GRANT.checkedOn)}). From ${DUTY.from} an eligible buyer pays no conveyance duty at any price: on a $700,000 home that saves ${DUTY_700K}, more than any state's grant on a home at that price.`,
  },
  {
    question: "Does HBCS apply to both new and established homes?",
    answer:
      `Yes. Unlike the state grants, the scheme isn't restricted to new builds: new homes, established homes and vacant residential land all qualify, and from ${DUTY.from} there is no income threshold or property value limit (ACT Revenue Office, read ${longDate(DUTY.checkedOn)}).`,
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
    question: "Is there an income limit on the ACT Home Buyer Concession Scheme?",
    answer:
      `Not any more. For transactions from ${DUTY.from} the ACT removed both the income threshold and the property value limit, so income no longer matters (ACT Revenue Office, read ${longDate(DUTY.checkedOn)}). What still applies: every buyer is an individual aged 18 or over, no buyer or partner has owned property in the last five years, and you live in the home for at least a year.`,
  },
  {
    question: "What's the cooling-off period in the ACT?",
    answer:
      "5 business days for residential property purchased under private treaty. No cooling-off period at auction. The standard ACT contract is well established and conveyancers handle the process via PEXA.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide", description: "Federal schemes, FHOG by state, stamp duty concessions and step-by-step process." },
  { title: "Stamp Duty ACT",         href: "/guides/stamp-duty-act",          description: "ACT duty rates and the Home Buyer Concession Scheme, with no income test since 1 July 2026." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",          description: "Estimate ACT conveyance duty (with or without the HBCS waiver)." },
  { title: "Conveyancing in Australia",         href: "/guides/conveyancing-guide",      description: "What conveyancers do, what they cost, and what to ask in the ACT." },
  { title: "Lenders Mortgage Insurance",        href: "/guides/lenders-mortgage-insurance-guide", description: "What LMI costs and the schemes that waive it." },
  { title: "Renter's Rights in the ACT",        href: "/guides/renters-rights-act",      description: "Tenant entitlements while you save your deposit." },
];

const STEPS = [
  { step: "1", title: "Check HBCS eligibility first", desc: `Confirm the ownership and residence tests before searching. Zero duty against ${DUTY_700K} on a $700,000 home changes your total budget.` },
  { step: "2", title: "Calculate your total budget", desc: "Conveyancing, inspections, title searches, moving. Exclude stamp duty if HBCS-eligible; include it if not." },
  { step: "3", title: "Consider the First Home Guarantee", desc: `If your deposit is under 20%, the 5% Deposit Scheme (5% deposit, no LMI, ${fmtCap(HG_PRICE_CAPS.ACT.capital)} cap) saves tens of thousands in LMI. Apply via a participating lender.` },
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
          ACT property rules (the Home Buyer Concession Scheme, leasehold change-of-use
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
          which on a $700,000 Canberra home is worth {DUTY_700K}, and since
          1 July 2026 it has no income test or price cap. The thing that actually catches
          Canberra buyers off guard is leasehold land. Every block is a
          99-year Crown Lease. For owner-occupier purchases it behaves
          like freehold, but make sure your conveyancer is ACT-licensed
          and knows the change-of-use rules.
        </p>
      </EditorNote>

      <h2 id="no-fhog">No FHOG in the ACT: what you get instead</h2>
      <p className="lead">
        Unlike every other Australian state and territory, the ACT does <strong>not</strong>{" "}
        pay a first home owner grant. The ACT Government replaced it with the Home
        Buyer Concession Scheme, which removes stamp duty (conveyance duty) for eligible buyers.
      </p>

      <FirstHomeGrantFacts state="ACT" />

      <h2 id="hbcs">Home Buyer Concession Scheme (HBCS)</h2>
      <FirstHomeDutyFacts state="ACT" />

      <p>Eligibility, from the ACT Revenue Office (read {longDate(DUTY.checkedOn)}):</p>
      <ul>
        <li>Every buyer is an individual aged 18 or over (not a company, trustee or business partnership)</li>
        <li>No buyer, or any buyer&rsquo;s domestic partner, has owned or held an interest in any property, in Australia or overseas, in the five years before the transaction</li>
        <li>At least one buyer owns and lives in the home as their principal place of residence for at least a year, starting within a year of settlement</li>
        <li>For transactions before 1 July 2026 an income threshold and a property value limit applied; both were removed from 1 July 2026</li>
      </ul>

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

      <h3>5% Deposit Scheme (First Home Guarantee)</h3>
      <ul>
        <HomeGuaranteeNote state="ACT" />
      </ul>

      <h3>Help to Buy</h3>
      <HelpToBuyNote state="ACT" as="p" />

      <h3>First Home Super Saver scheme (FHSS)</h3>
      <FhssNote as="p" />

      <h2 id="leasehold">Leasehold land, the ACT&rsquo;s unique system</h2>
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
        <li><strong>99-year leases:</strong> When a lease approaches the end of its term (rare in modern residential areas), it&rsquo;s typically renewed automatically.</li>
      </ul>
      <p>
        For most buyers of standard residential homes in Canberra, leasehold
        operates almost identically to freehold. The differences become more
        significant when developing or changing use.
      </p>

      <h2 id="canberra-market">Canberra property market overview</h2>
      <p>
        Canberra is consistently among Australia&rsquo;s most expensive markets, driven
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
        For first home buyers, the HBCS waiver and the{" "}
        {fmtCap(HG_PRICE_CAPS.ACT.capital)} 5% Deposit Scheme cap do the heavy lifting. Search any
        Canberra suburb in our <Link href="/suburbs">suburb profiles</Link> for the prices we can verify.
      </p>

      <h2 id="eligibility">Eligibility requirements</h2>
      <p>
        The Home Buyer Concession Scheme&rsquo;s tests are listed under the scheme above. Since
        {" "}{DUTY.from} there is no income test and no property value limit, so the questions are
        whether you or your partner owned property in the last five years and whether you will
        live in the home for a year.
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

      <Sources items={firstHomeSources(["ACT"])} />
    </GuideArticleLayout>
  );
}
