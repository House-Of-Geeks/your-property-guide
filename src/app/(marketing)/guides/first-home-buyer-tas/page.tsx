import type { Metadata } from "next";
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
import { HG_DATES, HG_PRICE_CAPS, fmtCap, hgCapSentence } from "@/lib/data/home-guarantee";
import { FirstHomeDutyFacts, FirstHomeGrantFacts } from "@/components/guide/FirstHomeStateFacts";
import { FIRST_HOME_DUTY, FIRST_HOME_GRANTS, fmt, firstHomeSources, longDate } from "@/lib/data/first-home-grants";
import { dutyFor, money } from "@/lib/data/stamp-duty-state";

// Grant and duty figures come from src/lib/data/first-home-grants.ts and the
// stamp duty engine (commercial-intent review 10 Oct 2026, buying 0.1 row 7).
const GRANT = FIRST_HOME_GRANTS.TAS;
const DUTY = FIRST_HOME_DUTY.TAS;
const GRANT_AMOUNT = fmt(GRANT.amount!);
const DUTY_500K = money(dutyFor("TAS", 500_000, "first").total);

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide Tasmania: Grants, Stamp Duty & Schemes (2026)",
  description:
    "Tasmania first home buyer guide: a $20,000 grant on new homes for contracts to 30 June 2027, no first home duty relief since 1 July 2026, and federal schemes.",
  slug: "first-home-buyer-tas",
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
  `Tasmania pays ${GRANT_AMOUNT} under its First Home Owner Grant on a new home, with no price cap, for transactions that commence between 1 July 2026 and 30 June 2027 (SRO Tasmania, read ${longDate(GRANT.checkedOn)}).`,
  "The grant was $30,000 for transactions that commenced between 1 July 2025 and 30 June 2026, so the amount depends on your contract date.",
  `First home buyers no longer get duty relief: the exemption on established homes up to $750,000 ended for transfers settling after 30 June 2026. On a $500,000 home the duty is now ${DUTY_500K}.`,
  `The 5% Deposit Scheme's price cap is ${fmtCap(HG_PRICE_CAPS.TAS.capital)} in Greater Hobart and ${fmtCap(HG_PRICE_CAPS.TAS.rest)} in the rest of Tasmania, with no income test since ${HG_DATES.expanded}.`,
  "Tasmania remains one of Australia's most affordable states; Hobart medians sit well below Sydney/Melbourne, and the north-west coast is among the cheapest in the country.",
  `The Regional First Home Buyer Guarantee closed to new guarantees on ${HG_DATES.expanded}. Buyers in Launceston, Burnie and Devonport use the 5% Deposit Scheme at the ${fmtCap(HG_PRICE_CAPS.TAS.rest)} cap.`,
];

const TOC: GuideTOCEntry[] = [
  { id: "fhog",          label: "First Home Owner Grant Tasmania" },
  { id: "stamp-duty",    label: "Stamp duty: no first home relief" },
  { id: "federal-schemes", label: "Federal government schemes" },
  { id: "affordability", label: "Tasmania's affordability advantage" },
  { id: "key-areas",     label: "Hobart, Launceston, and Burnie" },
  { id: "eligibility",   label: "Eligibility requirements" },
  { id: "steps",         label: "Step-by-step buying in Tasmania" },
  { id: "resources",     label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much is the First Home Owner Grant in Tasmania?",
    answer:
      `${GRANT_AMOUNT} on a new home, for transactions that commence between 1 July 2026 and 30 June 2027, with no price cap (SRO Tasmania, read ${longDate(GRANT.checkedOn)}). The amount is set a year at a time: it was $30,000 for transactions that commenced in 2025-26 and $10,000 in 2024-25, so check the figure for your contract date. Established homes do not qualify.`,
  },
  {
    question: "Do first home buyers pay stamp duty in Tasmania?",
    answer:
      `Yes, at the full rate, since 1 July 2026. The 100% exemption for first home buyers of an established home valued up to $750,000 applied to transfers settling from 18 February 2024 to 30 June 2026 and is not available after that (SRO Tasmania, read ${longDate(DUTY.checkedOn)}). On a $500,000 home the duty is ${DUTY_500K}. A new home gets the grant instead.`,
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
  { title: "Stamp Duty TAS",         href: "/guides/stamp-duty-tas",          description: "Tasmanian duty rates and worked examples; the first home exemption ended 30 June 2026." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",          description: "Estimate your Tasmanian duty in seconds." },
  { title: "Building & Pest Inspection",        href: "/guides/building-pest-inspection",description: "Why pre-contract inspections matter, especially on older Tasmanian homes." },
  { title: "Conveyancing in Australia",         href: "/guides/conveyancing-guide",      description: "What conveyancers do, what they cost, and what to ask." },
  { title: "Renter's Rights in Tasmania",       href: "/guides/renters-rights-tas",      description: "Tenant entitlements while you save for that first deposit." },
];

const STEPS = [
  { step: "1", title: "Understand your finances", desc: "Calculate borrow + save. Factor in stamp duty at the full rate (first home relief ended 30 June 2026), legal fees, pest and building inspection, and moving costs." },
  { step: "2", title: "Decide: new or established", desc: `New: the ${GRANT_AMOUNT} grant on contracts to 30 June 2027, with full stamp duty. Established: no grant and full duty. Run the numbers at your target price.` },
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
          Tasmania changed the maths on 1 July 2026. The established-home
          duty exemption ended, so a first home buyer of an existing house
          now pays full duty, and the grant on a new home fell to{" "}
          {GRANT_AMOUNT} for contracts to 30 June 2027. If you are comparing
          new against established, cost both at today&rsquo;s rules, not last
          year&rsquo;s. Check the 5% Deposit
          Scheme cap for where you&rsquo;re buying too: it&rsquo;s{" "}
          {fmtCap(HG_PRICE_CAPS.TAS.capital)} in Greater Hobart but{" "}
          {fmtCap(HG_PRICE_CAPS.TAS.rest)} in Launceston and the rest of the
          state.
        </p>
      </EditorNote>

      <h2 id="fhog">First Home Owner Grant, Tasmania</h2>
      <p className="lead">
        Tasmania pays a First Home Owner Grant on a new home: a home that has not
        been lived in or sold as a residence before, including a kit home or one
        you build on vacant land. The amount is set by contract date.
      </p>

      <FirstHomeGrantFacts state="TAS" />

      <h2 id="stamp-duty">Stamp duty: no first home relief since 1 July 2026</h2>
      <FirstHomeDutyFacts state="TAS" />
      <p>
        So on a $500,000 Tasmanian home a first home buyer now pays {DUTY_500K} in
        property transfer duty, the same as any other buyer. A new home gets the{" "}
        {GRANT_AMOUNT} grant instead; an established home gets nothing from the state.
      </p>

      <h2 id="federal-schemes">Federal government schemes</h2>

      <h3>5% Deposit Scheme (First Home Guarantee)</h3>
      <ul>
        <HomeGuaranteeNote state="TAS" />
      </ul>

      <h3>Help to Buy</h3>
      <HelpToBuyNote state="TAS" as="p" />

      <h3>First Home Super Saver scheme (FHSS)</h3>
      <FhssNote as="p" />

      <h2 id="affordability">Tasmania, one of Australia&rsquo;s most affordable states</h2>
      <p>
        Despite COVID-era growth, Tasmania remains considerably more affordable
        than most mainland capitals. For first home buyers priced out of Sydney or
        Melbourne, Tasmania offers genuine value, particularly in regional centres.
      </p>
      <ul>
        <li>Hobart medians are significantly lower than Sydney, Melbourne, and Brisbane</li>
        <li>Launceston, Burnie, and Devonport offer further affordability</li>
        <li>The {GRANT_AMOUNT} grant on a new home goes further against Tasmanian prices than the same sum on the mainland</li>
        <li>Growing remote work culture has made Tasmania viable for mainland workers</li>
      </ul>
      <p>
        Note: Tasmanian rental yields have historically been strong, attracting
        investor competition that can affect entry pricing in some segments.
      </p>

      <h2 id="key-areas">Key property markets, Hobart, Launceston, and Burnie</h2>

      <h3>Hobart</h3>
      <p>
        Tasmania&rsquo;s capital. Inner suburbs (Battery Point, Sandy Bay, North Hobart)
        sit at premium prices; outer suburbs and satellite towns like Glenorchy,
        Clarence and Kingborough offer more accessible entry points for first home
        buyers.
      </p>

      <h3>Launceston</h3>
      <p>
        Tasmania&rsquo;s second-largest city and the main commercial centre of the
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
      <p>To qualify for the Tasmanian FHOG (SRO Tasmania, read {longDate(GRANT.checkedOn)}):</p>
      <ul>
        <li>Be a natural person aged 18 or over; at least one applicant must be an Australian citizen or permanent resident</li>
        <li>Neither you nor your spouse can have owned a home in Australia before 1 July 2000, owned and lived in one for more than six months since, or received the grant before</li>
        <li>Live in the new home as your principal place of residence for at least six continuous months, starting within 12 months of completing the transaction</li>
        <li>The property must be a new home (not previously occupied or sold as a residence); for the higher grant, a build must be finished within 24 months</li>
      </ul>

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

      <Sources items={firstHomeSources(["TAS"])} />
    </GuideArticleLayout>
  );
}
