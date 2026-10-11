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
import { ScrollTable } from "@/components/guide/ScrollTable";
import { FIRST_HOME_DUTY, FIRST_HOME_GRANTS, fmt, firstHomeSources, longDate } from "@/lib/data/first-home-grants";
import { SHARED_EQUITY_SCHEMES } from "@/lib/data/help-to-buy";
import { dutyFor, money, standardRateRows } from "@/lib/data/stamp-duty-state";
import { STATE_DUTY_SCHEDULES } from "@/lib/utils/stamp-duty";

// Grant and duty figures come from src/lib/data/first-home-grants.ts and the
// stamp duty engine (commercial-intent review 10 Oct 2026, buying 0.1 rows 10
// and 11). SA's grant has had no price cap since 6 June 2024, and its first
// home duty relief covers new homes, off-the-plan apartments and land only.
const GRANT = FIRST_HOME_GRANTS.SA;
const DUTY = FIRST_HOME_DUTY.SA;
const GRANT_AMOUNT = fmt(GRANT.amount!);
const DUTY_600K = money(dutyFor("SA", 600_000, "owner").total);
const HOMESTART = SHARED_EQUITY_SCHEMES.find((x) => x.state === "SA")!;
const SA_RATES = STATE_DUTY_SCHEDULES.SA.standard;

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide South Australia: Grants, Stamp Duty & Schemes (2026)",
  description:
    "SA first home buyer guide: up to $15,000 grant and no stamp duty on a new home, both with no price cap since 6 June 2024; full duty on established homes.",
  slug: "first-home-buyer-sa",
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
  `SA pays a First Home Owner Grant of up to ${GRANT_AMOUNT} on a new home, with no price cap for contracts from 6 June 2024 (RevenueSA, read ${longDate(GRANT.checkedOn)}).`,
  "A first home buyer pays no stamp duty on a new home, an off-the-plan apartment or vacant land to build on, again with no value cap since 6 June 2024. On an established home there is no first home relief.",
  `On a $600,000 established home, SA stamp duty is ${DUTY_600K} (RevenueSA rates), a large upfront cost to build into your savings target.`,
  `Federal schemes work in SA. The 5% Deposit Scheme has had no income test or limit on places since ${HG_DATES.expanded}; its price cap is ${fmtCap(HG_PRICE_CAPS.SA.capital)} in Greater Adelaide and ${fmtCap(HG_PRICE_CAPS.SA.rest)} elsewhere.`,
  `SA's own shared equity product is the ${HOMESTART.name} (${HOMESTART.terms}); the federal Help to Buy scheme is open in SA too.`,
];

const TOC: GuideTOCEntry[] = [
  { id: "fhog",          label: "First Home Owner Grant SA" },
  { id: "stamp-duty",    label: "Stamp duty in South Australia" },
  { id: "federal-schemes", label: "Federal government schemes" },
  { id: "shared-equity", label: "Shared equity in SA" },
  { id: "eligibility",   label: "Who is eligible?" },
  { id: "steps",         label: "Step-by-step buying in SA" },
  { id: "resources",     label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Does SA have a stamp duty exemption for first home buyers?",
    answer:
      `Only on a new home. An eligible first home buyer pays no stamp duty on a new home, an off-the-plan apartment or vacant land to build on, with no value cap for contracts from 6 June 2024 (RevenueSA, read ${longDate(DUTY.checkedOn)}). An established home gets no first home relief: on $600,000 the duty is ${DUTY_600K}.`,
  },
  {
    question: "What's the price cap for the SA FHOG?",
    answer:
      `There isn't one for contracts entered into on or after 6 June 2024: RevenueSA says there is no limit to the market value of an eligible new home (read ${longDate(GRANT.checkedOn)}). A $650,000 cap applied to contracts from 15 June 2023 to 5 June 2024. The grant is up to ${GRANT_AMOUNT}, on new homes only.`,
  },
  {
    question: "Is the SA FHOG available on established homes?",
    answer:
      "No. The grant only applies to new homes (never previously occupied or sold as a residence), owner-builder new homes, and some substantially renovated dwellings. If you buy an established home in SA, no grant applies and you pay full stamp duty.",
  },
  {
    question: "Is there a state shared equity scheme in SA?",
    answer:
      `Yes: the ${HOMESTART.name}, through the state lender HomeStart. Its terms are ${HOMESTART.terms} (${HOMESTART.source.label}, read 7 October 2026). The federal Help to Buy scheme is also open in SA. You cannot use both on one home.`,
  },
  {
    question: "What's the cooling-off period in SA?",
    answer:
      "2 clear business days from the date you receive a copy of the contract. There's no cooling-off period at auction. The cooling-off period in SA is shorter than NSW (5 days) or QLD (5 days), so move fast on contract review.",
  },
  {
    question: "Can I combine the FHOG with the federal First Home Guarantee?",
    answer:
      `Yes, on a new home. The grant has no price cap; the 5% Deposit Scheme's cap is ${fmtCap(HG_PRICE_CAPS.SA.capital)} in Greater Adelaide or ${fmtCap(HG_PRICE_CAPS.SA.rest)} elsewhere, so that is the one to watch. Adding the First Home Super Saver Scheme on top can let eligible buyers stack the federal scheme, the state grant and a tax-advantaged super deposit.`,
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide", description: "Federal schemes, FHOG by state, and step-by-step buying process." },
  { title: "Stamp Duty SA",          href: "/guides/stamp-duty-sa",          description: "South Australian rates, worked examples and the new-home first home exemption." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",          description: "Estimate your SA conveyance duty in seconds." },
  { title: "Conveyancing in Australia",         href: "/guides/conveyancing-guide",      description: "What conveyancers do, what they cost, and what to ask." },
  { title: "Lenders Mortgage Insurance",        href: "/guides/lenders-mortgage-insurance-guide", description: "What LMI costs and the schemes that waive it." },
  { title: "Borrowing Power Calculator",        href: "/borrowing-power-calculator",     description: "Estimate how much you can borrow before you start searching." },
];

const STEPS = [
  { step: "1", title: "Calculate your budget", desc: "Use a borrowing power calculator. Account for stamp duty (nil on a new home for an eligible first home buyer, full on an established one), conveyancing, building inspections, and moving costs on top of the deposit." },
  { step: "2", title: "Check eligibility for grants and schemes", desc: `Confirm eligibility for the grant (up to ${GRANT_AMOUNT} on a new home, no price cap), the duty relief, the 5% Deposit Scheme (5% deposit, no LMI) and the FHSS. A broker can assess the right combination.` },
  { step: "3", title: "Get pre-approval", desc: "Conditional pre-approval gives you a clear budget and shows sellers you're serious." },
  { step: "4", title: "Search for properties", desc: "For the grant and the duty relief, look at new builds, off-the-plan apartments and house-and-land packages. For established homes you can still use the 5% Deposit Scheme." },
  { step: "5", title: "Arrange conveyancing", desc: "Engage an SA-licensed conveyancer or solicitor to review the contract, do title searches, and manage settlement." },
  { step: "6", title: "Apply for the FHOG", desc: "Apply through your lender (approved agent) or directly with RevenueSA before settlement." },
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
          South Australia is the odd one out on stamp duty. There is no
          general first-home-buyer exemption or concession on established
          homes, which most buyers from the east coast assume exists.
          Plan on paying full duty unless you&rsquo;re buying new or
          off-the-plan. On a new home it flips: no duty and a grant of up
          to {GRANT_AMOUNT}, with no price cap on either. Run the duty
          number on a calculator before you set your savings target.
        </p>
      </EditorNote>

      <h2 id="fhog">First Home Owner Grant, South Australia</h2>
      <p className="lead">
        South Australia pays a First Home Owner Grant of up to {GRANT_AMOUNT} to eligible first
        home buyers buying or building a new home, including off the plan or a substantial
        renovation. RevenueSA administers it.
      </p>

      <FirstHomeGrantFacts state="SA" />

      <p>
        The grant is paid at settlement or at the first progress payment if you apply through
        an approved agent (usually your lender), which you must do if you need it for
        settlement. Apply within 12 months of completing the purchase or build.
      </p>

      <h2 id="stamp-duty">Stamp duty in South Australia</h2>
      <FirstHomeDutyFacts state="SA" />
      <p>
        On an established home everyone pays the standard rates (RevenueSA, read 30 September 2026):
      </p>
      <ScrollTable label={SA_RATES.label}>
        <table>
          <thead>
            <tr><th>Property value</th><th>Duty</th></tr>
          </thead>
          <tbody>
            {standardRateRows("SA").map((r) => (
              <tr key={r.band}><td>{r.band}</td><td>{r.duty}</td></tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
      <p>
        On a $600,000 established home, SA stamp duty is {DUTY_600K}, a large upfront cost to
        plan for alongside your deposit. Use our{" "}
        <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link> for your
        own price.
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

      <h2 id="shared-equity">Shared equity in SA</h2>
      <p>
        SA&rsquo;s own shared equity product is the {HOMESTART.name}, through the state lender
        HomeStart: {HOMESTART.terms} (
        <a href={HOMESTART.source.href} target="_blank" rel="noopener noreferrer">{HOMESTART.source.label}</a>
        , read 7 October 2026). The federal Help to Buy scheme above is open in SA as well; you
        cannot use both on the same home. Our{" "}
        <Link href="/guides/shared-equity-schemes-australia">shared equity guide</Link> compares
        every scheme and its status.
      </p>

      <h2 id="eligibility">Who is eligible for the SA FHOG?</h2>
      <p>RevenueSA&rsquo;s criteria (read {longDate(GRANT.checkedOn)}):</p>
      <ul>
        <li>Every applicant is a natural person aged 18 or over, and at least one is an Australian citizen or permanent resident (or a New Zealand citizen on a Special Category visa living here permanently)</li>
        <li>For contracts from 13 February 2025, neither you nor your spouse or partner owns or has owned residential property in Australia</li>
        <li>Every applicant lives in the home as their principal place of residence for at least 6 continuous months, starting within 12 months of completing the purchase or build</li>
        <li>The home is new: built and not lived in or sold as a residence, off the plan, a substantial renovation, or built by you as an owner-builder</li>
      </ul>
      <p>
        The stamp duty relief has its own, similar test and a separate application, usually
        lodged by your conveyancer.
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
          <strong>RevenueSA</strong>, FHOG and stamp duty:{" "}
          <a href="https://www.revenuesa.sa.gov.au" target="_blank" rel="noopener noreferrer">revenuesa.sa.gov.au</a>
        </li>
        <li>
          <strong>Consumer and Business Services SA</strong>, property and conveyancing info:{" "}
          <a href="https://www.cbs.sa.gov.au" target="_blank" rel="noopener noreferrer">cbs.sa.gov.au</a>
        </li>
        <li>
          <strong>HomeStart Finance</strong>, the {HOMESTART.name}:{" "}
          <a href={HOMESTART.source.href} target="_blank" rel="noopener noreferrer">homestart.com.au</a>
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

      <Sources items={[...firstHomeSources(["SA"]), { ...SA_RATES.source }, { label: HOMESTART.source.label, href: HOMESTART.source.href, note: "read 7 October 2026" }]} />
    </GuideArticleLayout>
  );
}
