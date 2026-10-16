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
import { VIC_FIRST_HOME, VIC_PPR_MAX, calculateStampDuty } from "@/lib/utils/stamp-duty";
import { FIRST_HOME_REVIEWED_ON, VIC_OFF_THE_PLAN_TEMPORARY, currentGrant, formatPolicyDate, money } from "@/lib/policy/first-home";

// Figures from src/lib/policy/first-home.ts and the stamp duty engine.
const GRANT = currentGrant("VIC");
const GRANT_CAP = GRANT.caps[0].cap ?? 0;
const ownerDuty = (price: number) => calculateStampDuty(price, "VIC", false, false, false).total;
const investorDuty = (price: number) => calculateStampDuty(price, "VIC", false, false, true).total;
const firstHomeDuty = (price: number) => calculateStampDuty(price, "VIC", true, false, false).total;

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide VIC: Grants, Stamp Duty & Schemes (2026)",
  description:
    "Victoria first home buyer guide: the $10,000 FHOG on new homes, stamp duty exemption up to $600K and concession to $750K, Help to Buy and federal schemes, and VIC buying tips.",
  slug: "first-home-buyer-vic",
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
  "Victoria's FHOG is $10,000 on new homes only, capped at $750,000. The $20,000 regional grant ended on 30 June 2021.",
  `First home buyers pay no stamp duty up to ${money(VIC_FIRST_HOME.exemptTo)} and reduced duty to ${money(VIC_FIRST_HOME.concessionTo)}, on new and established homes and vacant land (contracts from ${VIC_FIRST_HOME.from}).`,
  `On a $550,000 first home an eligible buyer pays $0, where an owner-occupier who isn't a first home buyer pays ${money(ownerDuty(550_000))}. At $700,000 a first home buyer pays ${money(firstHomeDuty(700_000))} instead of ${money(ownerDuty(700_000))}.`,
  `Federal schemes all work in VIC. The 5% Deposit Scheme has had no income test or limit on places since ${HG_DATES.expanded}; its price cap is ${fmtCap(HG_PRICE_CAPS.VIC.capital)} in Greater Melbourne and Geelong and ${fmtCap(HG_PRICE_CAPS.VIC.rest)} elsewhere.`,
  "The Victorian Homebuyer Fund closed to new applications on 10 September 2025; the federal Help to Buy scheme is now Victoria's shared equity option.",
  "Always verify amounts and thresholds with the State Revenue Office Victoria before signing.",
];

const TOC: GuideTOCEntry[] = [
  { id: "fhog-vic",       label: "First Home Owner Grant VIC" },
  { id: "stamp-duty-vic", label: "Stamp duty exemption and concession" },
  { id: "federal-schemes",label: "Federal schemes in VIC" },
  { id: "vic-specific",   label: "VIC-specific schemes and resources" },
  { id: "median-prices",  label: "Median property prices" },
  { id: "buying-process", label: "The VIC buying process" },
  { id: "contacts",       label: "Key contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Is there still a $20,000 FHOG for regional Victoria?",
    answer:
      "No. The State Revenue Office's historical rates show the $20,000 regional grant ran from 1 July 2017 to 30 June 2021. The grant is now $10,000 for a new home anywhere in Victoria, capped at $750,000.",
  },
  {
    question: "Can I get the VIC FHOG on an established home?",
    answer:
      "No. The grant only applies to new homes (first time sold as residential), substantially renovated homes (where the original dwelling was effectively replaced), and house-and-land contracts. Established homes do not qualify, though you can still get the stamp duty exemption on them.",
  },
  {
    question: "What's the price cap for the VIC FHOG?",
    answer:
      "$750,000 total value (house plus land). One dollar over the cap and you lose the entire grant.",
  },
  {
    question: "Do I really pay $0 stamp duty in VIC for a first home?",
    answer:
      `Up to ${money(VIC_FIRST_HOME.exemptTo)}, yes, a full exemption. Between ${money(VIC_FIRST_HOME.exemptTo + 1)} and ${money(VIC_FIRST_HOME.concessionTo)} the duty is reduced on a sliding scale: SRO Victoria's own example is a $700,000 home paying ${money(firstHomeDuty(700_000))} instead of ${money(ownerDuty(700_000))}. Above ${money(VIC_FIRST_HOME.concessionTo)} the standard rate applies.`,
  },
  {
    question: "Is the Victorian Homebuyer Fund still open?",
    answer:
      "No. The Victorian Homebuyer Fund closed to new applications on 10 September 2025, and the State Revenue Office lists it among its closed schemes. The federal Help to Buy scheme is now Victoria's shared equity option: the government contributes up to 40% of a new home or 30% of an existing one, with a 2% deposit.",
  },
  {
    question: "What's the cooling-off period in Victoria?",
    answer:
      "3 business days from signing the contract of sale on private treaty sales. There is no cooling-off period if you buy at auction. If you back out during the cooling-off period you forfeit 0.2% of the price (or $100, whichever is higher).",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide", description: "Federal schemes, FHOG by state, stamp duty concessions and step-by-step process." },
  { title: "Stamp Duty VIC",         href: "/guides/stamp-duty-vic",          description: "Victorian land transfer duty, worked examples and the $600K first home exemption." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",          description: "Estimate your VIC stamp duty in seconds." },
  { title: "Conveyancing in Australia",         href: "/guides/conveyancing-guide",      description: "What conveyancers do, what they cost, and what to ask." },
  { title: "Lenders Mortgage Insurance",        href: "/guides/lenders-mortgage-insurance-guide", description: "What LMI costs and the schemes that waive it." },
  { title: "Property Auction Guide",            href: "/guides/property-auction-guide",  description: "Bidding strategy and pre-auction due diligence in VIC." },
];

export default function FirstHomeBuyerVICPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Verify with the SRO before you rely on this">
        <p>
          Grant amounts, thresholds, and eligibility rules change. Always verify
          current details with the{" "}
          <a href="https://www.sro.vic.gov.au/first-home-buyer" target="_blank" rel="noopener noreferrer">
            State Revenue Office Victoria
          </a>{" "}
          or a licensed conveyancer before signing a contract.
        </p>
      </Callout>

      <EditorNote>
        <p>
          Two Victorian quirks catch buyers out every week. The first:
          the $10K grant is for new homes only, so it doesn&rsquo;t help on
          an established home. The second: the stamp duty exemption stops
          dead at $600K with a taper to $750K, and Melbourne medians don&rsquo;t play nicely
          with that ceiling. Check your contract price against both
          ceilings before you sign, not after.
        </p>
      </EditorNote>

      <h2 id="fhog-vic">First Home Owner Grant VIC</h2>
      <p className="lead">
        Victoria offers the First Home Owner Grant for eligible buyers purchasing
        new homes, the same amount anywhere in the state.
      </p>

      <KeyFigure
        value="$10,000"
        label={`The FHOG for a new home in Victoria, for contracts from ${formatPolicyDate(GRANT.effectiveFrom as string)}.`}
        context={`Capped at ${money(GRANT_CAP)} total value`}
      />

      <p>
        The $20,000 grant for new homes in regional Victoria ran from 1 July 2017 to
        30 June 2021 and no longer applies, according to the State Revenue
        Office&rsquo;s historical rates.
      </p>

      <h3>Eligibility requirements</h3>
      <ul>
        <li>At least one applicant must be an Australian citizen or permanent resident</li>
        <li>All applicants must be 18 years or older</li>
        <li>None of the applicants can have previously owned residential property in Australia</li>
        <li>At least one applicant must occupy the home for 12 continuous months within 12 months of settlement or completion</li>
      </ul>

      <h3>Eligible properties</h3>
      <ul>
        <li>New homes (first time sold as residential) with a total value (house plus land) of $750,000 or less</li>
        <li>Substantially renovated homes (extensive renovation where the original dwelling was effectively removed/replaced)</li>
        <li>Established homes do <strong>not</strong> qualify</li>
      </ul>

      <h2 id="stamp-duty-vic">Stamp duty exemption and concession</h2>
      <p>
        Victoria provides stamp duty (land transfer duty) relief for eligible first
        home buyers on both new and established properties.
      </p>

      <table>
        <thead>
          <tr>
            <th>Purchase price</th>
            <th>Duty payable</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Up to {money(VIC_FIRST_HOME.exemptTo)}</td><td>$0 (full exemption)</td></tr>
          <tr><td>{money(VIC_FIRST_HOME.exemptTo + 1)} to {money(VIC_FIRST_HOME.concessionTo)}</td><td>Reduced duty on a sliding scale</td></tr>
          <tr><td>Over {money(VIC_FIRST_HOME.concessionTo)}</td><td>Full transfer duty applies</td></tr>
        </tbody>
      </table>

      <p>
        {`On a $550,000 purchase, an eligible first home buyer in Victoria pays $0 in stamp duty. An owner-occupier who isn't a first home buyer would pay ${money(ownerDuty(550_000))} at the principal place of residence rate, and an investor ${money(investorDuty(550_000))}. The same thresholds apply to vacant land, on the land's value. Rules checked against SRO Victoria on ${formatPolicyDate(FIRST_HOME_REVIEWED_ON)}. `}
        Use our <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link>{" "}
        for your exact figures.
      </p>

      <h3>Principal place of residence concession (non-first home buyers)</h3>
      <p>
        {`Victoria also has a lower principal place of residence rate for owner-occupiers who aren't first home buyers, on properties up to ${money(VIC_PPR_MAX)}. It's separate from the first home buyer exemption.`}
      </p>

      <h2 id="federal-schemes">Federal schemes available in VIC</h2>
      <ul>
        <HomeGuaranteeNote state="VIC" />
        <HelpToBuyNote state="VIC" />
        <FhssNote />
      </ul>
      <p>
        See our{" "}
        <Link href="/guides/first-home-buyer-guide">national First Home Buyer Guide</Link>{" "}
        for full federal scheme detail.
      </p>

      <h2 id="vic-specific">VIC-specific schemes and resources</h2>
      <ul>
        <li>
          <strong>Victorian Homebuyer Fund:</strong>{" "}closed to new applications on
          10 September 2025. Victoria&rsquo;s shared equity option is now the federal{" "}
          <Link href="/guides/help-to-buy-scheme-victoria">Help to Buy scheme</Link>.
        </li>
        <li>
          <strong>Off-the-plan apartments and townhouses:</strong>{" "}
          {`a temporary duty concession for any buyer of a lot in a strata subdivision with common property, for contracts from ${formatPolicyDate(VIC_OFF_THE_PLAN_TEMPORARY.effectiveFrom)} to ${formatPolicyDate(VIC_OFF_THE_PLAN_TEMPORARY.effectiveTo)}. SRO Victoria says it has been extended to that date; confirm with SRO before relying on a late contract date.`}
        </li>
        <li>
          <strong>Homes Victoria:</strong> Check homes.vic.gov.au for any current
          co-contribution or affordable housing programs for first home buyers.
        </li>
      </ul>

      <h2 id="median-prices">Median property prices for first home buyers</h2>
      <p>
        Melbourne’s property market has large price variation by distance from the
        CBD. First home buyers typically focus on:
      </p>
      <ul>
        <li><strong>Outer Melbourne suburbs:</strong> Western (Werribee, Hoppers Crossing), Outer North (Craigieburn, Epping), South East (Berwick, Cranbourne), house medians $580K to $780K</li>
        <li><strong>Units and apartments:</strong> CBD fringe and inner suburbs like Footscray and Sunshine, unit medians $400K to $600K</li>
        <li><strong>Regional Victoria:</strong> Geelong (houses $700K to $800K), Ballarat ($500K to $600K), Bendigo ($450K to $550K), all highly affordable versus Melbourne</li>
      </ul>
      <p>
        Browse our <Link href="/suburbs">suburb profiles</Link> for current market
        data on any Victorian suburb.
      </p>

      <h2 id="buying-process">The VIC buying process</h2>
      <p>Victoria has some distinct features:</p>
      <ul>
        <li><strong>Section 32 (Vendor’s Statement):</strong> Vendors must provide a Section 32 before a contract is signed. It contains title, planning overlays, outgoings, and building permits. Review with your solicitor before signing.</li>
        <li><strong>Cooling-off period:</strong> 3 business days from signing the contract of sale. No cooling-off at auction.</li>
        <li><strong>Auction market:</strong> Melbourne is one of Australia’s most active auction markets. Pre-auction due diligence (building inspections, finance, contract review) needs to be done before bidding.</li>
        <li><strong>Settlement:</strong> Typically 30 to 60 days, conducted via PEXA.</li>
      </ul>

      <h2 id="contacts">Key VIC contacts</h2>
      <ul>
        <li>
          <strong>State Revenue Office VIC (SRO)</strong>, FHOG and stamp duty concessions:{" "}
          <a href="https://www.sro.vic.gov.au/first-home-buyer" target="_blank" rel="noopener noreferrer">
            sro.vic.gov.au
          </a>
        </li>
        <li>
          <strong>Homes Victoria</strong>, affordable housing:{" "}
          <a href="https://www.homes.vic.gov.au" target="_blank" rel="noopener noreferrer">
            homes.vic.gov.au
          </a>
        </li>
        <li>
          <strong>Consumer Affairs Victoria</strong>, contracts and consumer rights:{" "}
          <a href="https://www.consumer.vic.gov.au" target="_blank" rel="noopener noreferrer">
            consumer.vic.gov.au
          </a>
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
