import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
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
import { SHARED_EQUITY_SCHEMES } from "@/lib/data/help-to-buy";
import { calculateStampDuty } from "@/lib/utils/stamp-duty";
import {
  FIRST_HOME_REVIEWED_ON,
  currentDutyRelief,
  currentGrant,
  formatPolicyDate,
  grantFor,
  money,
} from "@/lib/policy/first-home";

// Figures from src/lib/policy/first-home.ts, src/lib/data/help-to-buy.ts and the stamp duty engine.
const GRANT = currentGrant("SA");
const GRANT_LABEL = `${GRANT.upTo ? "up to " : ""}${money(GRANT.amount)}`;
const NEW_RELIEF = currentDutyRelief("SA", "new");
const RELIEF_FROM = formatPolicyDate(NEW_RELIEF.effectiveFrom as string);
const PREVIOUS_GRANT_CAP = grantFor("SA", "2024-06-05", "new").version?.caps[0]?.cap ?? 0;
const duty = (price: number) => calculateStampDuty(price, "SA", false, false, false).total;
const HOMESTART = SHARED_EQUITY_SCHEMES.find((x) => x.state === "SA")!;

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide South Australia: Grants, Stamp Duty & Schemes (2026)",
  description:
    "First home buyers in South Australia: no stamp duty on a new home, off-the-plan apartment or land to build (no price cap), a grant of up to $15,000 on new homes, federal schemes and HomeStart shared equity.",
  slug: "first-home-buyer-sa",
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
  openGraph: { ...DEFAULT_OG,
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
  `SA charges first home buyers no stamp duty on a new home, an off-the-plan apartment or vacant land to build, with no price cap, for contracts from ${RELIEF_FROM}. It also pays a First Home Owner Grant of ${GRANT_LABEL} on new homes, with no value cap.`,
  `There's no first home duty relief on an established home: a $600,000 established home costs ${money(duty(600_000))} in stamp duty.`,
  `So on a new $750,000 home a first home buyer pays no duty (${money(duty(750_000))} saved) and can claim the grant on top.`,
  `Federal schemes work in SA. The 5% Deposit Scheme has had no income test or limit on places since ${HG_DATES.expanded}; its price cap is ${fmtCap(HG_PRICE_CAPS.SA.capital)} in Greater Adelaide and ${fmtCap(HG_PRICE_CAPS.SA.rest)} elsewhere.`,
  "HomeStart's Shared Equity Option is SA's own shared equity loan. HomeSeeker SA is something else: the SA Government's listing of affordable homes for eligible buyers.",
  "Since 13 February 2025 any previous interest in residential property rules you out of the duty relief, so check your history before you count on it.",
];

const TOC: GuideTOCEntry[] = [
  { id: "stamp-duty",    label: "Stamp duty: new homes and land" },
  { id: "fhog",          label: "First Home Owner Grant SA" },
  { id: "federal-schemes", label: "Federal government schemes" },
  { id: "shared-equity", label: "Shared equity and affordable homes" },
  { id: "off-the-plan",  label: "Off-the-plan apartments" },
  { id: "eligibility",   label: "Who is eligible?" },
  { id: "steps",         label: "Step-by-step buying in SA" },
  { id: "resources",     label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Does SA have a stamp duty exemption for first home buyers?",
    answer:
      `Yes, on a new home, an off-the-plan apartment or vacant land to build a home: an eligible first home buyer pays no stamp duty, with no price cap, for contracts from ${RELIEF_FROM} (RevenueSA). There is no relief on an established home, where you pay the full rate, ${money(duty(600_000))} on a $600,000 home. Since 13 February 2025 any previous interest in residential property rules you out, and the relief doesn't cover the foreign ownership surcharge.`,
  },
  {
    question: "What's the price cap for the SA FHOG?",
    answer:
      `There isn't one for contracts from ${RELIEF_FROM}. The grant of ${GRANT_LABEL} applies to a new home, an off-the-plan home, a substantially renovated home or a building contract at any value. Contracts from 15 June 2023 to 5 June 2024 had a ${money(PREVIOUS_GRANT_CAP)} cap.`,
  },
  {
    question: "Is the SA FHOG available on established homes?",
    answer:
      "No. The grant only applies to new homes (never previously occupied or sold as a residence), off-the-plan homes, owner-builder and building contracts, and some substantially renovated dwellings. It isn't paid on vacant land alone. If you buy an established home in SA, no grant applies and you pay full stamp duty.",
  },
  {
    question: "Does SA have a shared equity scheme?",
    answer:
      `Yes. HomeStart's Shared Equity Option is an extra loan taken with a HomeStart home loan: HomeStart lends 5% to 25% of the price, interest free, for a matching share of the home, for households with net income up to $120,000 after tax, on homes up to $750,000. HomeStart shares in the gain or loss when you sell. You can't use it together with the federal Help to Buy scheme. HomeSeeker SA is a different thing: the SA Government's listing of affordable homes for buyers who meet its income and asset limits.`,
  },
  {
    question: "What's the cooling-off period in SA?",
    answer:
      "2 clear business days from the date you receive a copy of the contract. There's no cooling-off period at auction. The cooling-off period in SA is shorter than NSW (5 days) or QLD (5 days), so move fast on contract review.",
  },
  {
    question: "Can I combine the FHOG with the federal First Home Guarantee?",
    answer:
      `Yes. With no cap on the grant or on the duty relief for a new home, the cap to watch is the 5% Deposit Scheme's: ${fmtCap(HG_PRICE_CAPS.SA.capital)} in Greater Adelaide and ${fmtCap(HG_PRICE_CAPS.SA.rest)} elsewhere. Adding the First Home Super Saver Scheme lets eligible buyers stack the federal scheme, the state grant, no stamp duty and a tax-advantaged super deposit.`,
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide", description: "Federal schemes, FHOG by state, and step-by-step buying process." },
  { title: "Stamp Duty SA",          href: "/guides/stamp-duty-sa",          description: "South Australian rates, worked examples and the new-home first home exemption." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",          description: "Estimate your SA stamp duty, new or established, in seconds." },
  { title: "Conveyancing in Australia",         href: "/guides/conveyancing-guide",      description: "What conveyancers do, what they cost, and what to ask." },
  { title: "Lenders Mortgage Insurance",        href: "/guides/lenders-mortgage-insurance-guide", description: "What LMI costs and the schemes that waive it." },
  { title: "Borrowing Power Calculator",        href: "/borrowing-power-calculator",     description: "Estimate how much you can borrow before you start searching." },
];

const STEPS = [
  { step: "1", title: "Calculate your budget", desc: "Use a borrowing power calculator. Account for stamp duty on an established home, legal fees ($1,500 to $2,500), building inspections, and moving costs on top of the deposit." },
  { step: "2", title: "Check eligibility for grants and schemes", desc: `Confirm eligibility for the grant (${GRANT_LABEL} on a new home, no value cap), no stamp duty on a new home or land to build, the 5% Deposit Scheme (5% deposit, no LMI), and the FHSS. A broker can assess the right combination.` },
  { step: "3", title: "Get pre-approval", desc: "Conditional pre-approval gives you a clear budget and shows sellers you're serious." },
  { step: "4", title: "Search for properties", desc: "A new build, house-and-land package or off-the-plan apartment gets you the grant and no stamp duty at any price. An established home means full duty, but you can still use the 5% Deposit Scheme." },
  { step: "5", title: "Arrange conveyancing", desc: "Engage an SA-licensed conveyancer or solicitor to review the contract, do title searches, and manage settlement." },
  { step: "6", title: "Apply for the FHOG and duty relief", desc: "Apply through your lender (approved agent) or directly with RevenueSA before settlement; your conveyancer claims the duty relief." },
  { step: "7", title: "Settlement", desc: "Your conveyancer manages settlement; the FHOG is typically received at settlement and applied to purchase costs." },
];

export default function FirstHomeBuyerSAPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Verify with RevenueSA before relying on these figures">
        <p>
          Grant amounts and eligibility criteria change. Always verify current
          details with{" "}
          <a href="https://www.revenuesa.sa.gov.au" target="_blank" rel="noopener noreferrer">
            RevenueSA
          </a>{" "}
          or a licensed mortgage broker before signing a contract.
        </p>
      </Callout>

      <EditorNote>
        <p>
          South Australia splits first home buyers in two. Buy new, off the
          plan, or land to build on, and you pay no stamp duty at any price and
          can claim the grant as well. Buy established and you get neither: full
          duty, and no grant. On a $600,000 home that gap is the whole duty bill,
          so run both numbers before you set your savings target.
        </p>
      </EditorNote>

      <h2 id="stamp-duty">Stamp duty: no duty on a new home or land</h2>
      <p className="lead">
        {`South Australia charges an eligible first home buyer no stamp duty on a new home, an off-the-plan apartment or vacant land to build a home, with no value cap, for contracts from ${RELIEF_FROM}. There's no first home relief on an established home.`}
      </p>

      <KeyFigure
        value="$0"
        label="Stamp duty for an eligible SA first home buyer on a new home, an off-the-plan apartment or vacant land to build, at any value."
        context={`RevenueSA · contracts from ${RELIEF_FROM} · established homes excluded`}
      />

      <ul>
        <li>Since 13 February 2025 any previous interest in residential property rules you out</li>
        <li>The relief doesn&rsquo;t cover the foreign ownership surcharge</li>
        <li>From 15 June 2023 to 5 June 2024 the relief had caps: a new home was duty free to $650,000 (partial to $700,000) and land to $400,000 (partial to $450,000)</li>
      </ul>

      <p>
        On an established home everyone pays the same scale. Stamp duty (called
        &ldquo;conveyance duty&rdquo; in SA) is worked out on a sliding scale:
      </p>

      <table>
        <thead>
          <tr><th>Property value</th><th>Duty rate</th></tr>
        </thead>
        <tbody>
          <tr><td>$0 to $12,000</td><td>$1.00 per $100</td></tr>
          <tr><td>$12,001 to $30,000</td><td>$120 + $2.00 per $100 over $12,000</td></tr>
          <tr><td>$30,001 to $50,000</td><td>$480 + $3.00 per $100 over $30,000</td></tr>
          <tr><td>$50,001 to $100,000</td><td>$1,080 + $3.50 per $100 over $50,000</td></tr>
          <tr><td>$100,001 to $200,000</td><td>$2,830 + $4.00 per $100 over $100,000</td></tr>
          <tr><td>$200,001 to $250,000</td><td>$6,830 + $4.25 per $100 over $200,000</td></tr>
          <tr><td>$250,001 to $300,000</td><td>$8,955 + $4.75 per $100 over $250,000</td></tr>
          <tr><td>$300,001 to $500,000</td><td>$11,330 + $5.00 per $100 over $300,000</td></tr>
          <tr><td>Over $500,000</td><td>$21,330 + $5.50 per $100 over $500,000</td></tr>
        </tbody>
      </table>

      <p>
        {`On a $600,000 established home, SA stamp duty is ${money(duty(600_000))}; a first home buyer of a new home at the same price pays $0. `}
        Use our <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link>{" "}
        and choose new or established for your exact figure. Rules checked
        against{" "}
        <a href="https://www.revenuesa.sa.gov.au/stamp-duty-land/first-home-buyer-relief" target="_blank" rel="noopener noreferrer">
          RevenueSA
        </a>{" "}
        on {formatPolicyDate(FIRST_HOME_REVIEWED_ON)}.
      </p>

      <h2 id="fhog">First Home Owner Grant, South Australia</h2>
      <p>
        {`South Australia pays a First Home Owner Grant of ${GRANT_LABEL} to eligible first home buyers buying or building a new home. The grant is administered by RevenueSA.`}
      </p>

      <KeyFigure
        value={`${GRANT.upTo ? "Up to " : ""}${money(GRANT.amount)}`}
        label={`The SA First Home Owner Grant on a new home, with no value cap for contracts from ${RELIEF_FROM}.`}
        context="Established homes and vacant land alone do not qualify"
      />

      <p>The grant applies to new homes only. A &ldquo;new home&rdquo; includes:</p>
      <ul>
        <li>A newly built home that has not been previously occupied or sold as a place of residence, including off-the-plan</li>
        <li>A home built under a building contract, or by you as an owner-builder</li>
        <li>Substantially renovated homes in some circumstances (check with RevenueSA)</li>
      </ul>
      <p>
        {`For contracts from ${RELIEF_FROM} there is no value cap. Contracts from 15 June 2023 to 5 June 2024 had a ${money(PREVIOUS_GRANT_CAP)} cap, and earlier contracts $575,000.`}
      </p>
      <p>
        The grant is generally paid at settlement for off-the-plan or completed
        new homes, or at the first progress payment for construction loans. Your
        lender can often apply on your behalf as an approved agent.
      </p>

      <h2 id="federal-schemes">Federal government schemes</h2>
      <p>
        First home buyers in SA can also access federal schemes through Housing
        Australia.
      </p>

      <h3>5% Deposit Scheme (First Home Guarantee)</h3>
      <ul>
        <HomeGuaranteeNote state="SA" />
      </ul>

      <h3>First Home Super Saver scheme (FHSS)</h3>
      <FhssNote as="p" />

      <h3>Help to Buy (shared equity)</h3>
      <HelpToBuyNote state="SA" as="p" />

      <h2 id="shared-equity">Shared equity and affordable homes in SA</h2>
      <p>
        HomeStart Finance, the SA Government&rsquo;s lender, offers a Shared
        Equity Option with a HomeStart home loan. It lends 5% to 25% of the
        price, for households with net income up to $120,000 after tax, on homes
        up to $750,000 in metropolitan Adelaide and some regional centres.
        HomeStart takes a share of the home that matches what it lends, charges
        no interest on it, and shares in the gain or loss when you sell. You
        can&rsquo;t combine it with Help to Buy.
      </p>
      <p>
        HomeSeeker SA is a different thing: the SA Government&rsquo;s sales
        listing of affordable homes, open only to buyers who meet its income and
        asset limits and will live in the home. It can be a way into a cheaper
        home, not a source of equity.
      </p>

      <h2 id="off-the-plan">Off-the-plan apartments</h2>
      <p>
        An off-the-plan apartment counts as a new home, so an eligible first
        home buyer pays no stamp duty on it at any price and can claim the
        grant. Duty is assessed on the contract, so check with your conveyancer
        how the value is worked out for your purchase. SA has run off-the-plan
        concessions for all buyers in the past; ask RevenueSA whether one applies
        to your contract date before counting on it.
      </p>

      <h2 id="eligibility">Who is eligible for the SA FHOG?</h2>
      <p>To be eligible, all applicants must:</p>
      <ul>
        <li>Be an Australian citizen or permanent resident</li>
        <li>Be 18 years or older</li>
        <li>Have never previously owned residential property in Australia used as a place of residence</li>
        <li>Occupy the property as a principal place of residence for at least 6 continuous months, starting within 12 months of settlement or construction completion</li>
        <li>Buy or build a new home (no value cap for contracts from 6 June 2024)</li>
      </ul>
      <p>
        All parties must satisfy the criteria, unless they are a spouse or de
        facto partner of an eligible applicant.
      </p>

      <h2 id="steps">Step-by-step, buying your first home in SA</h2>
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
          <strong>RevenueSA</strong>, FHOG and stamp duty relief:{" "}
          <a href="https://www.revenuesa.sa.gov.au" target="_blank" rel="noopener noreferrer">revenuesa.sa.gov.au</a>
        </li>
        <li>
          <strong>Consumer and Business Services SA</strong>, property and conveyancing info:{" "}
          <a href="https://www.cbs.sa.gov.au" target="_blank" rel="noopener noreferrer">cbs.sa.gov.au</a>
        </li>
        <li>
          <strong>HomeStart Finance</strong>, Shared Equity Option:{" "}
          <a href={HOMESTART.source.href} target="_blank" rel="noopener noreferrer">homestart.com.au</a>
        </li>
        <li>
          <strong>HomeSeeker SA</strong>, affordable homes for eligible buyers:{" "}
          <a href="https://homeseeker.sa.gov.au" target="_blank" rel="noopener noreferrer">homeseeker.sa.gov.au</a>
        </li>
        <li>
          <strong>Housing Australia</strong>, First Home Guarantee and federal schemes:{" "}
          <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer">housingaustralia.gov.au</a>
        </li>
        <li>
          <strong>PlanSA</strong>, planning and development:{" "}
          <a href="https://www.plan.sa.gov.au" target="_blank" rel="noopener noreferrer">plan.sa.gov.au</a>
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
