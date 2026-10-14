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
import { HG_DATES, HG_PRICE_CAPS, fmtCap, hgCapSentence } from "@/lib/data/home-guarantee";
import { calculateStampDuty } from "@/lib/utils/stamp-duty";
import { FIRST_HOME_REVIEWED_ON, currentGrant, formatPolicyDate, grantFor, money } from "@/lib/policy/first-home";

// Figures from src/lib/policy/first-home.ts and the stamp duty engine.
const GRANT = currentGrant("TAS");
const GRANT_TO = formatPolicyDate(GRANT.effectiveTo as string);
const GRANT_FROM = formatPolicyDate(GRANT.effectiveFrom as string);
const PREVIOUS_GRANT = grantFor("TAS", "2026-06-30", "new").version?.amount ?? 0;
const NEXT_GRANT = grantFor("TAS", "2027-07-01", "new").version?.amount ?? 0;
const duty = (price: number) => calculateStampDuty(price, "TAS", true, false, false).total;

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide Tasmania: Grants, Stamp Duty & Schemes (2026)",
  description:
    "Tasmania first home buyer guide: the $20,000 First Home Owner Grant on new homes for 2026-27, why the established-home stamp duty exemption ended on 30 June 2026, federal schemes, and Tasmania's prices.",
  slug: "first-home-buyer-tas",
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
  `Tasmania's First Home Owner Grant is ${money(GRANT.amount)} on a new home, including a kit home, with no value cap, for transactions from ${GRANT_FROM} to ${GRANT_TO}. It was ${money(PREVIOUS_GRANT)} in 2025-26 and is scheduled to fall to ${money(NEXT_GRANT)} from 1 July 2027.`,
  `The stamp duty exemption for first home buyers of established homes up to $750,000 isn't available for transfers settling after 30 June 2026. A first home buyer now pays the full rate: ${money(duty(500_000))} on a $500,000 home.`,
  "There's no first home duty relief on a new home or land either, so the grant is the only Tasmanian first home help left.",
  `The 5% Deposit Scheme's price cap is ${fmtCap(HG_PRICE_CAPS.TAS.capital)} in Greater Hobart and ${fmtCap(HG_PRICE_CAPS.TAS.rest)} in the rest of Tasmania, with no income test since ${HG_DATES.expanded}.`,
  "Tasmania remains one of Australia's most affordable states; Hobart medians sit well below Sydney/Melbourne, and the north-west coast is among the cheapest in the country.",
  `The Regional First Home Buyer Guarantee closed to new guarantees on ${HG_DATES.expanded}. Buyers in Launceston, Burnie and Devonport use the 5% Deposit Scheme at the ${fmtCap(HG_PRICE_CAPS.TAS.rest)} cap.`,
];

const TOC: GuideTOCEntry[] = [
  { id: "fhog",          label: "First Home Owner Grant Tasmania" },
  { id: "stamp-duty",    label: "Stamp duty for first home buyers" },
  { id: "federal-schemes", label: "Federal government schemes" },
  { id: "affordability", label: "Tasmania's affordability advantage" },
  { id: "key-areas",     label: "Hobart, Launceston, and Burnie" },
  { id: "eligibility",   label: "Eligibility requirements" },
  { id: "steps",         label: "Step-by-step buying in Tasmania" },
  { id: "resources",     label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much is Tasmania's First Home Owner Grant now?",
    answer:
      `${money(GRANT.amount)} for a new home, including a kit home, with no value cap, for transactions from ${GRANT_FROM} to ${GRANT_TO} (State Revenue Office Tasmania). It was ${money(PREVIOUS_GRANT)} from 1 July 2025 to 30 June 2026 and is scheduled to revert to ${money(NEXT_GRANT)} from 1 July 2027. Queensland pays $30,000 and the NT's HomeGrown Territory Grant $50,000 on a new home, so Tasmania's is no longer the largest, but with lower prices it still covers a good share of a deposit.`,
  },
  {
    question: "Do first home buyers still get a stamp duty exemption in Tasmania?",
    answer:
      `Not for a transfer settling after 30 June 2026. The 100% exemption on established homes up to $750,000 covered settlements from 18 February 2024 to 30 June 2026 and was not extended (State Revenue Office Tasmania). It follows the settlement date, so a contract signed in June that settled in July missed out. A first home buyer now pays ${money(duty(500_000))} on a $500,000 home, and there's no first home relief on a new home or land.`,
  },
  {
    question: "What's the price cap for the Tasmanian First Home Guarantee?",
    answer:
      `${hgCapSentence("TAS")}, under the caps in force since ${HG_DATES.expanded}. Both the price and the lender's valuation must be at or under the cap, and there's no income test.`,
  },
  {
    question: "Can Tasmanian buyers still use the Regional First Home Buyer Guarantee?",
    answer:
      `No. It closed to new guarantees on ${HG_DATES.expanded}. Buyers in Launceston, Burnie, Devonport and the rest of Tasmania outside Greater Hobart now use the 5% Deposit Scheme at the ${fmtCap(HG_PRICE_CAPS.TAS.rest)} cap, with no requirement to have lived in the area.`,
  },
  {
    question: "What's the cooling-off period in Tasmania?",
    answer:
      "Tasmania doesn't have a statutory cooling-off period for residential sales. Once contracts are signed and conditions waived/fulfilled you're committed, similar to WA. Pre-contract due diligence (especially building inspection on older Tassie homes) is essential.",
  },
  {
    question: "Are Tasmanian rental yields really stronger than the mainland?",
    answer:
      "Historically yes, particularly outside Hobart. That investor competition can occasionally squeeze first home buyers, but for owner-occupiers prepared to look at outer suburbs and regional centres, Tasmania remains accessible compared to mainland capitals.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide", description: "Federal schemes, FHOG by state, stamp duty concessions and step-by-step process." },
  { title: "Stamp Duty TAS",         href: "/guides/stamp-duty-tas",          description: "Tasmanian duty rates, worked examples and why the first home exemption ended." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",          description: "Estimate your Tasmanian duty by settlement date." },
  { title: "Building & Pest Inspection",        href: "/guides/building-pest-inspection",description: "Why pre-contract inspections matter, especially on older Tasmanian homes." },
  { title: "Conveyancing in Australia",         href: "/guides/conveyancing-guide",      description: "What conveyancers do, what they cost, and what to ask." },
  { title: "Renter's Rights in Tasmania",       href: "/guides/renters-rights-tas",      description: "Tenant entitlements while you save for that first deposit." },
];

const STEPS = [
  { step: "1", title: "Understand your finances", desc: "Calculate borrow + save. Factor in full stamp duty (the first home exemption ended for settlements after 30 June 2026), legal fees, pest and building inspection, and moving costs." },
  { step: "2", title: "Decide: new or established", desc: `New: the ${money(GRANT.amount)} grant to ${GRANT_TO}, plus full stamp duty. Established: full stamp duty and no grant. Run the numbers at your target price.` },
  { step: "3", title: "Check federal scheme eligibility", desc: "5% Deposit Scheme (5% deposit, no LMI, no income test) via a participating lender." },
  { step: "4", title: "Get pre-approval", desc: "A clear budget and a stronger offer. Important in tight stock markets." },
  { step: "5", title: "Search and inspect", desc: "Building and pest inspection before contract is essential, especially on older Tassie homes." },
  { step: "6", title: "Engage a conveyancer", desc: "A Tasmanian conveyancer or solicitor reviews the contract, runs searches, and manages settlement." },
  { step: "7", title: "Apply for the FHOG", desc: "Through your lender or directly with the State Revenue Office. Typically paid at settlement." },
];

export default function FirstHomeBuyerTasPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Verify with the SRO Tasmania">
        <p>
          Grant amounts, eligibility and thresholds can change. Verify current
          details with the{" "}
          <a href="https://www.sro.tas.gov.au" target="_blank" rel="noopener noreferrer">
            State Revenue Office Tasmania
          </a>{" "}
          before signing a contract.
        </p>
      </Callout>

      <EditorNote>
        <p>
          {`Tasmania changed the maths for first home buyers on 1 July 2026. Until 30 June a first home buyer of an established home up to $750,000 paid no stamp duty; now they pay full duty, ${money(duty(500_000))} on a $500,000 home, and the only help is a ${money(GRANT.amount)} grant on a new home. If you were counting on the exemption, rework your cash-to-buy figure before you make an offer. Check the 5% Deposit Scheme cap for where you're buying too: it's ${fmtCap(HG_PRICE_CAPS.TAS.capital)} in Greater Hobart but ${fmtCap(HG_PRICE_CAPS.TAS.rest)} in Launceston and the rest of the state.`}
        </p>
      </EditorNote>

      <h2 id="fhog">First Home Owner Grant, Tasmania</h2>
      <p className="lead">
        {`Tasmania pays a ${money(GRANT.amount)} First Home Owner Grant for a new home, including a kit home, with no value cap, for transactions from ${GRANT_FROM} to ${GRANT_TO}. It was ${money(PREVIOUS_GRANT)} in 2025-26 and is scheduled to return to ${money(NEXT_GRANT)} from 1 July 2027.`}
      </p>

      <KeyFigure
        value={money(GRANT.amount)}
        label={`The Tasmanian First Home Owner Grant on a new home, for transactions from ${GRANT_FROM} to ${GRANT_TO}.`}
        context="No value cap; established homes don't qualify"
      />

      <p>
        The grant applies to new homes only: newly built homes that haven&rsquo;t
        been occupied or sold as a residence, homes built on vacant land for the
        first time, and kit homes. Established homes don&rsquo;t qualify, and since
        1 July 2026 there&rsquo;s no duty concession on them either.
      </p>
      <p>
        Given Tasmania&rsquo;s lower median prices, the grant still covers a
        meaningful share of a typical deposit. The amount follows the
        commencement date of the transaction, so check the date on your contract
        with the{" "}
        <a href="https://www.sro.tas.gov.au/first-home-owner/eligibility" target="_blank" rel="noopener noreferrer">
          State Revenue Office
        </a>
        .
      </p>

      <h2 id="stamp-duty">Stamp duty for first home buyers</h2>
      <p>
        The first home buyer duty exemption on established homes (100% up to
        $750,000) applied to transfers settling from 18 February 2024 to 30 June
        2026, and is not available for transfers settling after 30 June 2026
        (State Revenue Office Tasmania). Before 18 February 2024 a 50% concession
        applied up to $600,000. There is no first home duty relief on a new home
        or vacant land.
      </p>
      <p>
        {`So a first home buyer now pays the same duty as anyone else: ${money(duty(500_000))} on a $500,000 home and ${money(duty(750_000))} on $750,000. The exemption followed the settlement date, not the contract date. Rules checked on ${formatPolicyDate(FIRST_HOME_REVIEWED_ON)}.`}
      </p>

      <Callout variant="info" title="New or established: the grant is the only first home help now">
        <p>
          Buying new gets you the grant, with full stamp duty. Buying
          established gets you neither the grant nor a duty concession. Run
          both at your target price.
        </p>
      </Callout>

      <table>
        <thead>
          <tr><th>Scenario</th><th>First home help</th><th>Property type</th></tr>
        </thead>
        <tbody>
          <tr><td>Buying new or building</td><td>{`${money(GRANT.amount)} grant (to ${GRANT_TO}) and full stamp duty`}</td><td>New homes, including kit homes</td></tr>
          <tr><td>Buying established</td><td>None: full stamp duty, no grant</td><td>Established homes</td></tr>
        </tbody>
      </table>

      <h2 id="federal-schemes">Federal government schemes</h2>

      <h3>5% Deposit Scheme (First Home Guarantee)</h3>
      <ul>
        <HomeGuaranteeNote state="TAS" />
      </ul>

      <h3>Help to Buy</h3>
      <HelpToBuyNote state="TAS" as="p" />

      <h3>First Home Super Saver scheme (FHSS)</h3>
      <FhssNote as="p" />

      <h2 id="affordability">Tasmania, one of Australia's most affordable states</h2>
      <p>
        Despite COVID-era growth, Tasmania remains considerably more affordable
        than most mainland capitals. For first home buyers priced out of Sydney or
        Melbourne, Tasmania offers genuine value, particularly in regional centres.
      </p>
      <ul>
        <li>Hobart medians are significantly lower than Sydney, Melbourne, and Brisbane</li>
        <li>Launceston, Burnie, and Devonport offer further affordability</li>
        <li>{`The ${money(GRANT.amount)} grant on a new home covers a higher share of a typical deposit than it would in Sydney or Melbourne`}</li>
        <li>Growing remote work culture has made Tasmania viable for mainland workers</li>
      </ul>
      <p>
        Note: Tasmanian rental yields have historically been strong, attracting
        investor competition that can affect entry pricing in some segments.
      </p>

      <h2 id="key-areas">Key property markets, Hobart, Launceston, and Burnie</h2>

      <h3>Hobart</h3>
      <p>
        Tasmania's capital. Inner suburbs (Battery Point, Sandy Bay, North Hobart)
        sit at premium prices; outer suburbs and satellite towns like Glenorchy,
        Clarence and Kingborough offer more accessible entry points for first home
        buyers.
      </p>

      <h3>Launceston</h3>
      <p>
        Tasmania's second-largest city and the main commercial centre of the
        north. Lower medians than Hobart, with strong community infrastructure,
        good schools, and improving connectivity.
      </p>

      <h3>Burnie and the north-west coast</h3>
      <p>
        Burnie, Devonport, and surrounds are among the most affordable property
        markets in Australia. First home buyers can find quality homes under the{" "}
        {fmtCap(HG_PRICE_CAPS.TAS.rest)} 5% Deposit Scheme cap that applies outside
        Greater Hobart.
      </p>

      <h2 id="eligibility">Eligibility requirements</h2>
      <p>To qualify for the Tasmanian FHOG:</p>
      <ul>
        <li>Be an Australian citizen or permanent resident</li>
        <li>Be 18 years or older</li>
        <li>Have never previously owned residential property in Australia used as a place of residence</li>
        <li>Occupy the new home as your principal place of residence for at least 6 months, starting within 12 months of settlement</li>
        <li>The property must be a new home (not previously occupied or sold as a residence)</li>
      </ul>
      <p>
        The established-home duty exemption isn&rsquo;t available for transfers
        settling after 30 June 2026. Confirm the grant rules for your
        transaction date at sro.tas.gov.au.
      </p>

      <h2 id="steps">Step-by-step, buying your first home in Tasmania</h2>
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
          <strong>State Revenue Office Tasmania (SRO)</strong>, FHOG and stamp duty:{" "}
          <a href="https://www.sro.tas.gov.au" target="_blank" rel="noopener noreferrer">sro.tas.gov.au</a>
        </li>
        <li>
          <strong>Consumer, Building and Occupational Services (CBOS)</strong>, property and tenancy:{" "}
          <a href="https://www.cbos.tas.gov.au" target="_blank" rel="noopener noreferrer">cbos.tas.gov.au</a>
        </li>
        <li>
          <strong>Housing Australia</strong>, First Home Guarantee and federal schemes:{" "}
          <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer">housingaustralia.gov.au</a>
        </li>
        <li>
          <strong>ATO, First Home Super Saver Scheme:</strong>{" "}
          <a href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/first-home-super-saver-scheme" target="_blank" rel="noopener noreferrer">ato.gov.au</a>
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
