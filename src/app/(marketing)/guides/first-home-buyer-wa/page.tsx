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
import { WA_FIRST_HOME, WA_FIRST_HOME_LAND, WA_FIRST_HOME_PREVIOUS, calculateStampDuty } from "@/lib/utils/stamp-duty";
import { FIRST_HOME_REVIEWED_ON, currentGrant, formatPolicyDate, money } from "@/lib/policy/first-home";

// Figures from src/lib/policy/first-home.ts and the stamp duty engine.
const GRANT = currentGrant("WA");
const [SOUTH_CAP, NORTH_CAP] = GRANT.caps.map((c) => c.cap ?? 0);
const duty = (price: number) => calculateStampDuty(price, "WA", false, false, false).total;
const firstHomeDuty = (price: number) => calculateStampDuty(price, "WA", true, false, false).total;
const RATE = `$${WA_FIRST_HOME.ratePer100.toFixed(2)}`;

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide WA: $10K Grant, Stamp Duty & Schemes (2026)",
  description:
    "Western Australia first home buyer guide: the $10,000 FHOG on new homes (cap $800K in Perth and the south), no stamp duty to $600K and a concessional rate to $800K, federal schemes, and Keystart loans.",
  slug: "first-home-buyer-wa",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-14",
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
  `WA's First Home Owner Grant is ${money(GRANT.amount)} on new homes only, valued up to ${money(SOUTH_CAP)} in Perth and the south of the state, or ${money(NORTH_CAP)} north of the 26th parallel.`,
  `For agreements from ${WA_FIRST_HOME.from}, first home buyers pay no transfer duty up to ${money(WA_FIRST_HOME.exemptTo)} and ${RATE} per $100 above that to ${money(WA_FIRST_HOME.concessionTo)}, on new and established homes.`,
  `On a $550,000 first home an eligible buyer pays $0 transfer duty, saving ${money(duty(550_000))}.`,
  "Keystart is WA's state-owned low-deposit lender, with deposits as low as 2% and no LMI for eligible buyers, unique to WA.",
  `Federal schemes work in WA. The 5% Deposit Scheme has had no income test or limit on places since ${HG_DATES.expanded}; its price cap is ${fmtCap(HG_PRICE_CAPS.WA.capital)} in Greater Perth and ${fmtCap(HG_PRICE_CAPS.WA.rest)} elsewhere.`,
  "WA has no statutory cooling-off period on residential private treaty sales, so pre-contract due diligence matters more.",
];

const TOC: GuideTOCEntry[] = [
  { id: "fhog-wa",        label: "First Home Owner Grant WA" },
  { id: "stamp-duty-wa",  label: "Stamp duty exemption and concession" },
  { id: "federal-schemes",label: "Federal schemes in WA" },
  { id: "wa-specific",    label: "WA-specific schemes (Keystart)" },
  { id: "median-prices",  label: "Median property prices" },
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
    question: `Why is stamp duty $0 up to ${money(WA_FIRST_HOME.exemptTo)} in WA but up to $800,000 in NSW?`,
    answer:
      `Each state sets its own threshold. WA raised its threshold from ${money(WA_FIRST_HOME_PREVIOUS.exemptTo)} to ${money(WA_FIRST_HOME.exemptTo)} for agreements from ${WA_FIRST_HOME.from}, and above it charges ${RATE} per $100 up to ${money(WA_FIRST_HOME.concessionTo)}. So a $700,000 first home pays ${money(firstHomeDuty(700_000))} instead of ${money(duty(700_000))}. The date of the agreement decides which rate applies, not settlement.`,
  },
  {
    question: "Can I combine the FHBG, FHOG, and stamp duty exemption in WA?",
    answer:
      `Yes, on a new home under all the relevant caps. A $500,000 new home in outer Perth could get the federal 5% Deposit Scheme (5% deposit, no LMI), the ${money(GRANT.amount)} grant and no transfer duty: ${money(GRANT.amount + duty(500_000))} in grant and duty saved, before the LMI saving.`,
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
          <a href="https://www.wa.gov.au/service/financial-services/financial-assistance/first-home-owner-grant" target="_blank" rel="noopener noreferrer">
            WA Department of Finance (Revenue)
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
        Western Australia offers a $10,000 First Home Owner Grant for eligible
        first home buyers purchasing or building new homes. WA's market has seen
        strong growth since 2021, making the FHOG a meaningful contributor for
        buyers targeting new builds.
      </p>

      <KeyFigure
        value={money(GRANT.amount)}
        label={`The WA First Home Owner Grant on new homes valued up to ${money(SOUTH_CAP)} in Perth and the south of the state.`}
        context="Established homes do not qualify"
      />

      <h3>Eligibility requirements</h3>
      <ul>
        <li>At least one applicant must be an Australian citizen or permanent resident</li>
        <li>All applicants must be 18 years or older</li>
        <li>No applicant can have previously owned residential property in Australia on or after 1 July 2000 (or received the FHOG on an earlier purchase)</li>
        <li>At least one applicant must occupy the home as their principal place of residence for at least 6 months within 12 months of settlement or completion</li>
      </ul>

      <h3>Eligible properties</h3>
      <ul>
        <li>New homes (never previously sold as residential) valued at {money(SOUTH_CAP)} or less south of the 26th parallel, including Perth, or {money(NORTH_CAP)} or less north of it (transactions from 7 May 2026; the southern cap was $750,000 before)</li>
        <li>Owner-built homes and land plus a building contract, under the same caps</li>
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
        Western Australia&rsquo;s first home owner rate of duty applies to new
        and established homes. The rates below apply to agreements from{" "}
        {WA_FIRST_HOME.from}; the date of the agreement decides, not settlement.
      </p>

      <table>
        <thead>
          <tr>
            <th>Purchase price</th>
            <th>Duty payable</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Up to {money(WA_FIRST_HOME.exemptTo)}</td><td>$0</td></tr>
          <tr><td>{money(WA_FIRST_HOME.exemptTo + 1)} to {money(WA_FIRST_HOME.concessionTo)}</td><td>{RATE} per $100 above {money(WA_FIRST_HOME.exemptTo)}</td></tr>
          <tr><td>Over {money(WA_FIRST_HOME.concessionTo)}</td><td>Full transfer duty</td></tr>
        </tbody>
      </table>

      <p>
        On a $550,000 purchase, typical for outer Perth, an eligible first home
        buyer pays <strong>$0</strong>{" "}in transfer duty, where anyone else would pay{" "}
        {money(duty(550_000))}. At $700,000 a first home buyer pays{" "}
        {money(firstHomeDuty(700_000))} instead of {money(duty(700_000))}. Use our{" "}
        <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link> for your
        exact figures; it applies the rate for the agreement date you enter.
      </p>
      <p>
        Vacant land to build your first home pays no duty up to{" "}
        {money(WA_FIRST_HOME_LAND.exemptTo)} and ${WA_FIRST_HOME_LAND.ratePer100.toFixed(2)}{" "}
        per $100 above that to {money(WA_FIRST_HOME_LAND.concessionTo)}. For agreements from{" "}
        {WA_FIRST_HOME_PREVIOUS.from} to {WA_FIRST_HOME_PREVIOUS.to}, homes were duty
        free to {money(WA_FIRST_HOME_PREVIOUS.exemptTo)}, with the concession running to{" "}
        {money(WA_FIRST_HOME_PREVIOUS.metroTo)} in Perth and Peel and{" "}
        {money(WA_FIRST_HOME_PREVIOUS.regionalTo)} elsewhere.
      </p>

      <h3>Eligibility for the concession</h3>
      <ul>
        <li>The property must be your first home in Australia</li>
        <li>You must occupy it as your principal place of residence within 12 months of settlement</li>
        <li>Both new and established homes qualify (unlike the FHOG)</li>
        <li>Since 7 May 2026 the grant&rsquo;s value cap no longer limits the duty concession</li>
      </ul>
      <p>
        Figures checked against{" "}
        <a href="https://www.wa.gov.au/government/publications/duties-fact-sheet-first-home-owner-rate" target="_blank" rel="noopener noreferrer">
          RevenueWA&rsquo;s first home owner rate fact sheet
        </a>{" "}
        on {formatPolicyDate(FIRST_HOME_REVIEWED_ON)}.
      </p>

      <h2 id="federal-schemes">Federal schemes available in WA</h2>
      <ul>
        <HomeGuaranteeNote state="WA" />
        <HelpToBuyNote state="WA" />
        <FhssNote />
      </ul>
      <p>
        {`The 5% Deposit Scheme cap is ${fmtCap(HG_PRICE_CAPS.WA.capital)} in Greater Perth and ${fmtCap(HG_PRICE_CAPS.WA.rest)} in the rest of WA, below Sydney's ${fmtCap(HG_PRICE_CAPS.NSW.capital)} and Brisbane's ${fmtCap(HG_PRICE_CAPS.QLD.capital)}. With Perth's price growth since 2021, the cap can bind in some inner and middle-ring suburbs, so check it before you make an offer.`}
      </p>

      <h2 id="wa-specific">WA-specific schemes and resources</h2>
      <ul>
        <li>
          <strong>Keystart Home Loans:</strong> WA Government home loan provider
          specifically for low-to-moderate income earners who can't qualify for a
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

      <h2 id="median-prices">Median property prices for first home buyers</h2>
      <p>
        Perth has had strong growth since 2021 but remains more affordable than
        Sydney and Melbourne:
      </p>
      <ul>
        <li><strong>Outer Perth (northern corridor):</strong> Joondalup, Wanneroo, Butler, house medians $530K to $680K</li>
        <li><strong>Outer Perth (southern corridor):</strong> Rockingham, Mandurah, Armadale, house medians $450K to $600K</li>
        <li><strong>Middle ring suburbs:</strong> Midland, Swan, Bayswater, house medians $600K to $780K</li>
        <li><strong>Regional WA:</strong> Bunbury, Geraldton, Kalgoorlie, house medians $350K to $500K, Bunbury seeing strong growth</li>
      </ul>
      <p>
        Explore <Link href="/suburbs">WA suburb profiles</Link> for current data.
      </p>

      <h2 id="buying-process">The WA buying process</h2>
      <p>WA has notable differences from eastern states:</p>
      <ul>
        <li><strong>No statutory cooling-off period:</strong> Unlike NSW, VIC, and QLD, WA has no statutory cooling-off period on residential private treaty sales. Once contracts are exchanged and conditions waived or fulfilled, you're committed. Pre-contract due diligence matters even more.</li>
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
          <strong>WA Department of Finance, Revenue</strong>, FHOG, stamp duty, FHB concessions:{" "}
          <a href="https://www.wa.gov.au/service/financial-services/financial-assistance/first-home-owner-grant" target="_blank" rel="noopener noreferrer">
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
    </GuideArticleLayout>
  );
}
