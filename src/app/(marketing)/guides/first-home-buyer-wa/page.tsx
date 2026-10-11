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
import { FIRST_HOME_DUTY, FIRST_HOME_GRANTS, fmt, firstHomeSources, grantCapText, longDate } from "@/lib/data/first-home-grants";
import { dutyFor, money } from "@/lib/data/stamp-duty-state";
import { WA_FIRST_HOME } from "@/lib/utils/stamp-duty";

// Grant and duty figures come from src/lib/data/first-home-grants.ts and the
// stamp duty engine (commercial-intent review 10 Oct 2026, buying 0.1 rows 4 to 6).
const GRANT = FIRST_HOME_GRANTS.WA;
const [GRANT_CAP_SOUTH, GRANT_CAP_NORTH] = GRANT.caps.map((c) => c.value);
const DUTY = FIRST_HOME_DUTY.WA;
const DUTY_400K = dutyFor("WA", 400_000, "owner").total;

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide WA: $10K Grant, Stamp Duty & Schemes (2026)",
  description:
    "WA first home buyer guide: up to $10,000 grant on new homes to $800,000 in Perth, no transfer duty to $600,000, a concession to $800,000, and Keystart.",
  slug: "first-home-buyer-wa",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-11",
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
  `WA pays up to ${fmt(GRANT.amount!)} under its First Home Owner Grant, on new homes only: ${grantCapText("WA")}, for transactions from 7 May 2026 (RevenueWA, read ${longDate(GRANT.checkedOn)}).`,
  `No transfer duty on a first home, new or established, up to ${fmt(DUTY.exemptTo!)}, then $${WA_FIRST_HOME.ratePer100.toFixed(2)} per $100 of the value over ${fmt(DUTY.exemptTo!)} up to ${fmt(DUTY.concessionTo!)} (first home owner rate, from ${DUTY.from}).`,
  `On a $400,000 first home an eligible buyer pays $0 transfer duty, where any other buyer pays ${money(DUTY_400K)} (RevenueWA rates).`,
  "Keystart is WA's state-owned low-deposit lender, with deposits as low as 2% and no LMI for eligible buyers, unique to WA.",
  `Federal schemes work in WA. The 5% Deposit Scheme has had no income test or limit on places since ${HG_DATES.expanded}; its price cap is ${fmtCap(HG_PRICE_CAPS.WA.capital)} in Greater Perth and ${fmtCap(HG_PRICE_CAPS.WA.rest)} elsewhere.`,
  "WA has no statutory cooling-off period on residential private treaty sales, so pre-contract due diligence matters more.",
];

const TOC: GuideTOCEntry[] = [
  { id: "fhog-wa",        label: "First Home Owner Grant WA" },
  { id: "stamp-duty-wa",  label: "Stamp duty exemption and concession" },
  { id: "federal-schemes",label: "Federal schemes in WA" },
  { id: "wa-specific",    label: "WA-specific schemes (Keystart)" },
  { id: "buying-process", label: "The WA buying process" },
  { id: "contacts",       label: "Key contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is Keystart and is it really only available in WA?",
    answer:
      "Keystart is a WA Government-owned home loan provider for buyers who can't qualify for a standard bank loan. It offers loans with deposits as low as 2% and no LMI, with income caps that vary by region and household size. It's unique to WA, has no equivalent in other states, and is one of the most powerful tools for first home buyers in Perth or regional WA who don't have a 20% deposit.",
  },
  {
    question: "Does WA really have no cooling-off period?",
    answer:
      "Correct, WA has no statutory cooling-off period on residential private treaty sales. Once the Offer and Acceptance is signed and conditions are waived or fulfilled, you're committed. This is the biggest procedural difference from eastern states. Building inspection, finance, and settlement conditions need to be properly negotiated into the offer before signing, not afterwards.",
  },
  {
    question: "Can I get the WA FHOG on an established home?",
    answer:
      "No. The grant only applies to new homes (never previously sold as residential), substantially renovated homes, and owner-built new homes. Established homes don't qualify. However, the stamp duty exemption is available on both new and established homes.",
  },
  {
    question: "Who is eligible for the first home stamp duty exemption in WA?",
    answer:
      `Anyone who qualifies for the First Home Owner Grant, or would qualify except that the home is established or over the grant's cap: RevenueWA aligns the two tests. For transactions from ${DUTY.from} there is no transfer duty on a home valued up to ${fmt(DUTY.exemptTo!)}, and a reduced rate up to ${fmt(DUTY.concessionTo!)}, on new and established homes alike (RevenueWA, read ${longDate(DUTY.checkedOn)}). Over ${fmt(DUTY.concessionTo!)} the full rate applies.`,
  },
  {
    question: "Can I combine the FHBG, FHOG, and stamp duty exemption in WA?",
    answer:
      `Yes, on a new home under all the relevant caps. On a $400,000 new home in outer Perth that means the federal 5% Deposit Scheme (5% deposit, no LMI), the ${fmt(GRANT.amount!)} grant and no transfer duty, which on its own saves ${money(DUTY_400K)} (RevenueWA rates). Check each scheme's cap for your price and area before you sign.`,
  },
  {
    question: "What's the Offer and Acceptance form?",
    answer:
      "WA uses an Offer and Acceptance contract. The buyer makes a written offer (with conditions), and if the seller accepts, that signed document becomes the binding contract. There's no separate exchange step like NSW. The Joint Form of General Conditions (maintained by REIWA and the Law Society of WA) is referenced from the offer.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide", description: "Federal schemes, FHOG by state, stamp duty concessions and step-by-step process." },
  { title: "Stamp Duty WA",          href: "/guides/stamp-duty-wa",          description: "WA transfer duty rates, the first home owner rate and worked examples." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",          description: "Estimate your WA transfer duty in seconds." },
  { title: "Conveyancing in Australia",         href: "/guides/conveyancing-guide",      description: "What conveyancers do, what they cost, and what to ask." },
  { title: "Building & Pest Inspection",        href: "/guides/building-pest-inspection",description: "Why pre-contract inspections matter even more in WA." },
  { title: "Lenders Mortgage Insurance",        href: "/guides/lenders-mortgage-insurance-guide", description: "What LMI costs and the schemes (including Keystart) that waive it." },
];

export default function FirstHomeBuyerWAPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Verify with WA Revenue and Keystart">
        <p>
          Grant amounts, thresholds, and Keystart eligibility rules change. Verify
          current details with the{" "}
          <a href={GRANT.source.href} target="_blank" rel="noopener noreferrer">
            RevenueWA
          </a>{" "}
          and{" "}
          <a href="https://www.keystart.com.au" target="_blank" rel="noopener noreferrer">
            Keystart
          </a>{" "}
          before signing a contract.
        </p>
      </Callout>

      <EditorNote>
        <p>
          WA is the only state with its own government-backed lender,
          Keystart, and that&rsquo;s the lever first home buyers here
          underuse. A 2% deposit with no LMI changes the maths in a way
          the cash grant alone can&rsquo;t. The other thing to know
          early: WA has no statutory cooling-off period on residential
          private treaty sales. Get your building inspection, finance
          check and contract review done before you sign, not after.
        </p>
      </EditorNote>

      <h2 id="fhog-wa">First Home Owner Grant WA</h2>
      <p className="lead">
        Western Australia pays a First Home Owner Grant of up to {fmt(GRANT.amount!)} to eligible
        first home buyers buying or building a new home. It is not means-tested.
      </p>

      <FirstHomeGrantFacts state="WA" />

      <h3>Eligibility requirements</h3>
      <ul>
        <li>At least one applicant must be an Australian citizen or permanent resident</li>
        <li>All applicants must be 18 years or older</li>
        <li>No applicant or partner can have received a grant or the first home owner rate before, owned residential property in Australia before 1 July 2000, or lived for six continuous months in one they owned since (RevenueWA)</li>
        <li>At least one applicant must occupy the home as their principal place of residence for at least 6 months within 12 months of settlement or completion</li>
      </ul>

      <h3>Eligible properties</h3>
      <ul>
        <li>New homes (never previously sold as residential) valued at {fmt(GRANT_CAP_SOUTH)} or less south of the 26th parallel, which takes in all of Perth, or {fmt(GRANT_CAP_NORTH)} or less north of it</li>
        <li>A building contract or an owner-built home, where the land and the build together are within the same caps</li>
        <li>Substantially renovated homes (significant renovation of an existing dwelling)</li>
        <li>Established (second-hand) homes do <strong>not</strong> qualify for the WA FHOG</li>
      </ul>

      <h3>How to apply</h3>
      <p>
        Lodge through the Office of State Revenue (OSR) or your lending institution
        at the time of loan application. For purchases, apply within 12 months of
        settlement. For construction, apply within 12 months of the first drawing
        of the loan.
      </p>

      <h2 id="stamp-duty-wa">Stamp duty (transfer duty) exemption and concession</h2>
      <p>
        Western Australia charges first home buyers a lower rate of transfer duty, the first
        home owner rate, on new and established homes. The thresholds below apply to
        transactions from {DUTY.from}; rates follow the date you sign, not the settlement date.
      </p>

      <FirstHomeDutyFacts state="WA" />

      <p>
        On a $400,000 purchase an eligible first home buyer pays <strong>$0</strong> in
        transfer duty; any other buyer pays {money(DUTY_400K)}. Use our{" "}
        <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link> for your
        own price.
      </p>

      <h3>Eligibility for the concession</h3>
      <ul>
        <li>The property must be your first home in Australia</li>
        <li>You must occupy it as your principal place of residence within 12 months of settlement</li>
        <li>Both new and established homes qualify (unlike the FHOG)</li>
      </ul>

      <h2 id="federal-schemes">Federal schemes available in WA</h2>
      <ul>
        <HomeGuaranteeNote state="WA" />
        <HelpToBuyNote state="WA" />
        <FhssNote />
      </ul>
      <p>
        The 5% Deposit Scheme&rsquo;s cap in Greater Perth is {fmtCap(HG_PRICE_CAPS.WA.capital)}, above the
        grant&rsquo;s {fmt(GRANT_CAP_SOUTH)} cap and the duty concession&rsquo;s {fmt(DUTY.concessionTo!)} ceiling,
        so a Perth home can qualify for the deposit scheme and still miss the state help.
      </p>

      <h2 id="wa-specific">WA-specific schemes and resources</h2>
      <ul>
        <li>
          <strong>Keystart Home Loans:</strong> WA Government home loan provider
          specifically for low-to-moderate income earners who can&rsquo;t qualify for a
          standard bank loan. Keystart offers low-deposit home loans (as low as 2%
          in some cases) without LMI. Income limits apply. Unique to WA, and a
          major advantage for eligible buyers. Apply at keystart.com.au.
        </li>
        <li>
          <strong>SharedStart (Keystart):</strong> Shared equity option through
          Keystart where the State Government takes a small equity co-investment,
          reducing the loan size and required deposit.
        </li>
        <li>
          <strong>Aboriginal Home Ownership Program:</strong> Specifically for
          Aboriginal and Torres Strait Islander first home buyers. Check the
          Department of Communities WA for details.
        </li>
      </ul>

      <p>
        To compare prices before you set a budget, search any WA suburb in our{" "}
        <Link href="/suburbs">suburb profiles</Link>; each one shows its median only where the
        sales data behind it passes our checks.
      </p>

      <h2 id="buying-process">The WA buying process</h2>
      <p>WA has notable differences from eastern states:</p>
      <ul>
        <li><strong>No statutory cooling-off period:</strong> Unlike NSW, VIC, and QLD, WA has no statutory cooling-off period on residential private treaty sales. Once contracts are exchanged and conditions waived or fulfilled, you&rsquo;re committed. Pre-contract due diligence matters even more.</li>
        <li><strong>Offer and Acceptance:</strong> WA uses an Offer and Acceptance form. The buyer makes a written offer; if the seller accepts, the signed document becomes a binding contract. Conditions (finance, building inspection, etc.) are negotiated and included in the offer.</li>
        <li><strong>Joint Form of General Conditions:</strong> The offer references general conditions maintained by REIWA and the Law Society of WA.</li>
        <li><strong>Auctions:</strong> Less common than eastern states. Private treaty dominates.</li>
        <li><strong>Settlement:</strong> Typically 30 to 60 days; via PEXA.</li>
      </ul>
      <p>
        For the full step-by-step process, see{" "}
        <Link href="/guides/buying-property-australia">Buying Property in Australia</Link>.
      </p>

      <h2 id="contacts">Key WA contacts</h2>
      <ul>
        <li>
          <strong>RevenueWA</strong> (Department of Treasury and Finance), FHOG, transfer duty, the first home owner rate:{" "}
          <a href={GRANT.source.href} target="_blank" rel="noopener noreferrer">
            wa.gov.au
          </a>
        </li>
        <li>
          <strong>Keystart Home Loans</strong>, WA Government low-deposit home loans:{" "}
          <a href="https://www.keystart.com.au" target="_blank" rel="noopener noreferrer">
            keystart.com.au
          </a>
        </li>
        <li>
          <strong>Housing Australia</strong>, First Home Guarantee and federal schemes:{" "}
          <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer">
            housingaustralia.gov.au
          </a>
        </li>
        <li>
          <strong>REIWA</strong>, Real Estate Institute of WA, market data and buying resources:{" "}
          <a href="https://www.reiwa.com.au" target="_blank" rel="noopener noreferrer">
            reiwa.com.au
          </a>
        </li>
      </ul>

      <Sources items={firstHomeSources(["WA"])} />
    </GuideArticleLayout>
  );
}
