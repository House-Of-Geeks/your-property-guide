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
import { HG_DATES, HG_PRICE_CAPS, fmtCap } from "@/lib/data/home-guarantee";
import { calculateStampDuty } from "@/lib/utils/stamp-duty";
import { FIRST_HOME_REVIEWED_ON, currentDutyRelief, dutyReliefFor, formatPolicyDate, money } from "@/lib/policy/first-home";

// Figures from src/lib/policy/first-home.ts and the stamp duty engine.
const HBCS = currentDutyRelief("ACT", "established");
const HBCS_FROM = formatPolicyDate(HBCS.effectiveFrom as string);
const PREVIOUS = dutyReliefFor("ACT", "established", "2026-06-30").version!;
const PREVIOUS_LIMIT = PREVIOUS.method.type === "flat-reduction" ? PREVIOUS.method.exemptTo : 0;
const ownerDuty = (price: number) => calculateStampDuty(price, "ACT", false, false, false).total;

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide ACT: Schemes, Stamp Duty & Canberra Property (2026)",
  description:
    "ACT first home buyer guide: no FHOG, but no stamp duty at any price under the Home Buyer Concession Scheme from 1 July 2026 (no income test), the $1 million 5% Deposit Scheme cap, and how leasehold land works.",
  slug: "first-home-buyer-act",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-14",
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
  "The ACT is the only jurisdiction in Australia with no first home owner grant. Instead, the Home Buyer Concession Scheme removes stamp duty, often worth more than a cash grant.",
  `From ${HBCS_FROM} an eligible buyer pays no duty at any price, with no income test, on a new or established home or vacant land, if they haven't held an interest in any property in the last five years.`,
  `On a $700,000 ACT home, that wipes out a ${money(ownerDuty(700_000))} duty bill (owner-occupier rate); on $1,000,000 it's ${money(ownerDuty(1_000_000))}.`,
  "The ACT's own Shared Equity Scheme is for public housing tenants buying their Housing ACT home; for everyone else the shared equity option is the federal Help to Buy scheme.",
  "Land Rent Scheme lets you lease the land from the ACT Government and only finance the build, lowering upfront capital required.",
  `The 5% Deposit Scheme (First Home Guarantee) cap is ${fmtCap(HG_PRICE_CAPS.ACT.capital)} across the ACT, with no income test since ${HG_DATES.expanded}.`,
  "All ACT land is held under 99-year Crown Lease (leasehold). For standard residential purchases this operates almost identically to freehold.",
];

const TOC: GuideTOCEntry[] = [
  { id: "no-fhog",       label: "No FHOG in the ACT" },
  { id: "hbcs",          label: "Home Buyer Concession Scheme" },
  { id: "shared-equity", label: "Shared equity in the ACT" },
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
      `The ACT's grant ceased on 1 July 2019, and the Home Buyer Concession Scheme removes the duty instead. From ${HBCS_FROM} an eligible buyer pays no conveyance duty at any price. Given Canberra's prices, that's often worth more than a $10,000 to $30,000 grant: ${money(ownerDuty(700_000))} on a $700,000 home at the owner-occupier rate.`,
  },
  {
    question: "Does HBCS apply to both new and established homes?",
    answer:
      `Yes, and vacant residential land too. From ${HBCS_FROM} there's no property value limit and no income test. You, and any domestic partner, must not have held an interest in any property in the five years before the transaction, and one of you must live in the home for at least a year, moving in within a year of settlement.`,
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
    question: "Is there still an income test for the Home Buyer Concession Scheme?",
    answer:
      `Not for transactions from ${HBCS_FROM}: the ACT Revenue Office removed the income threshold and the property value limit. From 1 July 2025 to 30 June 2026 the scheme had an income test ($250,000, plus $4,600 for each dependent child) and gave no duty only up to ${money(PREVIOUS_LIMIT)}, with $35,238 off the duty above that.`,
  },
  {
    question: "What's the cooling-off period in the ACT?",
    answer:
      "5 business days for residential property purchased under private treaty. No cooling-off period at auction. The standard ACT contract is well established and conveyancers handle the process via PEXA.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide", description: "Federal schemes, FHOG by state, stamp duty concessions and step-by-step process." },
  { title: "Stamp Duty ACT",         href: "/guides/stamp-duty-act",          description: "ACT duty rates and the Home Buyer Concession Scheme." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",          description: "Estimate ACT conveyance duty by transaction date, with or without the concession." },
  { title: "Conveyancing in Australia",         href: "/guides/conveyancing-guide",      description: "What conveyancers do, what they cost, and what to ask in the ACT." },
  { title: "Lenders Mortgage Insurance",        href: "/guides/lenders-mortgage-insurance-guide", description: "What LMI costs and the schemes that waive it." },
  { title: "Renter's Rights in the ACT",        href: "/guides/renters-rights-act",      description: "Tenant entitlements while you save your deposit." },
];

const STEPS = [
  { step: "1", title: "Check HBCS eligibility first", desc: "Confirm nobody buying (or their domestic partner) has held an interest in any property in the last five years. Zero stamp duty against a $17,000-plus bill changes your budget significantly." },
  { step: "2", title: "Calculate your total budget", desc: "Conveyancing ($1,500 to $2,500), inspections, title searches, moving. Leave out stamp duty if you're HBCS-eligible; include it if not." },
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
          ACT property rules (concession eligibility, leasehold change-of-use
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
          Home Buyer Concession Scheme removes stamp duty at any price
          from {HBCS_FROM}, worth {money(ownerDuty(700_000))}{" "}on a $700K Canberra home and
          more as the price rises. The thing that actually catches
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
        label={`Stamp duty payable by an eligible buyer under the Home Buyer Concession Scheme, at any price, from ${HBCS_FROM}.`}
        context={`A $700K home would otherwise attract ${money(ownerDuty(700_000))} at the owner-occupier rate`}
      />

      <p>
        Given that Canberra has some of the highest property prices in Australia,
        and therefore high stamp duty bills, the HBCS is typically worth far more
        than a FHOG would be.
      </p>

      <h2 id="hbcs">Home Buyer Concession Scheme (HBCS)</h2>
      <p>
        {`From ${HBCS_FROM} the HBCS lets an eligible buyer pay no conveyance duty on a home or vacant residential land, new or established, at any price. The ACT Revenue Office removed both the property value limit and the income threshold on that date.`}
      </p>

      <p>Key eligibility requirements:</p>
      <ul>
        <li>All buyers must be individuals aged 18 or over</li>
        <li>You, and any domestic partner, must not have held an interest in any property in the five years before the transaction</li>
        <li>At least one buyer must live in the home continuously for at least a year, moving in within a year of settlement</li>
        <li>No income test and no property value limit, for transactions from {HBCS_FROM}</li>
      </ul>
      <p>
        {`From 1 July 2025 to 30 June 2026 the scheme had an income test ($250,000, plus $4,600 for each dependent child) and gave no duty only up to ${money(PREVIOUS_LIMIT)}. Checked against the ACT Revenue Office on ${formatPolicyDate(FIRST_HOME_REVIEWED_ON)}; confirm your eligibility at `}
        <a href="https://www.revenue.act.gov.au/home-buyer-assistance/home-buyer-concession-scheme/about-the-home-buyer-concession-scheme" target="_blank" rel="noopener noreferrer">
          revenue.act.gov.au
        </a>
        .
      </p>

      <h2 id="shared-equity">Shared equity in the ACT</h2>
      <p>
        The ACT Government&rsquo;s own Shared Equity Scheme helps public housing
        tenants buy their Housing ACT home. If you aren&rsquo;t a Housing ACT
        tenant, the shared equity option is the federal Help to Buy scheme
        (below), where the government takes a share of the home and you buy
        it back over time.
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

      <h3>5% Deposit Scheme (First Home Guarantee)</h3>
      <ul>
        <HomeGuaranteeNote state="ACT" />
      </ul>

      <h3>Help to Buy</h3>
      <HelpToBuyNote state="ACT" as="p" />

      <h3>First Home Super Saver scheme (FHSS)</h3>
      <FhssNote as="p" />

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
        For first home buyers, the HBCS and the{" "}
        {fmtCap(HG_PRICE_CAPS.ACT.capital)} 5% Deposit Scheme cap are critical enablers in a market where median house prices regularly exceed
        $900,000.
      </p>

      <h2 id="eligibility">Eligibility requirements</h2>
      <p>For the Home Buyer Concession Scheme, from {HBCS_FROM}:</p>
      <ul>
        <li>No buyer (or their domestic partner) can have held an interest in any property in the last five years</li>
        <li>The home must become a buyer&rsquo;s principal place of residence for at least a year</li>
        <li>There&rsquo;s no income test and no property value limit</li>
      </ul>
      <p>
        Because the test is five years without a property interest rather than
        never owning, some people who have owned before can qualify. Check the
        limited exemptions with the ACT Revenue Office.
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
          <strong>Housing ACT</strong>, the Shared Equity Scheme for public housing tenants:{" "}
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
