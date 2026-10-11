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
import { FIRST_HOME_DUTY, FIRST_HOME_GRANTS, fmt, firstHomeSources, longDate } from "@/lib/data/first-home-grants";
import { dutyFor, money } from "@/lib/data/stamp-duty-state";
import { VIC_PPR_MAX } from "@/lib/utils/stamp-duty";

// Grant and duty figures come from src/lib/data/first-home-grants.ts and the
// stamp duty engine (commercial-intent review 10 Oct 2026, buying 0.1 minor
// rows and row 18).
const GRANT = FIRST_HOME_GRANTS.VIC;
const DUTY = FIRST_HOME_DUTY.VIC;
const GRANT_AMOUNT = fmt(GRANT.amount!);
const GRANT_CAP = fmt(GRANT.caps[0].value);
const DUTY_550K = money(dutyFor("VIC", 550_000, "owner").total);

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide VIC: Grants, Stamp Duty & Schemes (2026)",
  description:
    "Victoria first home buyer guide: the $10,000 FHOG on new homes, stamp duty exemption up to $600K and concession to $750K, Help to Buy and federal schemes, and VIC buying tips.",
  slug: "first-home-buyer-vic",
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
  `Victoria's First Home Owner Grant is ${GRANT_AMOUNT} on new homes only, valued up to ${GRANT_CAP} (SRO Victoria, read ${longDate(GRANT.checkedOn)}). The $20,000 regional grant applied only from 1 July 2017 to 30 June 2021.`,
  `No land transfer duty on any first home, new or established, valued up to ${fmt(DUTY.exemptTo!)}, and a reduced amount up to ${fmt(DUTY.concessionTo!)}.`,
  `On a $550,000 first home an eligible buyer pays $0 duty, where an owner-occupier who is not a first home buyer pays ${DUTY_550K} at the principal place of residence rate.`,
  `Federal schemes all work in VIC. The 5% Deposit Scheme has had no income test or limit on places since ${HG_DATES.expanded}; its price cap is ${fmtCap(HG_PRICE_CAPS.VIC.capital)} in Greater Melbourne and Geelong and ${fmtCap(HG_PRICE_CAPS.VIC.rest)} elsewhere.`,
  "The Victorian Homebuyer Fund closed to new applications on 10 September 2025; the federal Help to Buy scheme is now Victoria's shared equity option.",
  "Always verify amounts and thresholds with the State Revenue Office Victoria before signing.",
];

const TOC: GuideTOCEntry[] = [
  { id: "fhog-vic",       label: "First Home Owner Grant VIC" },
  { id: "stamp-duty-vic", label: "Stamp duty exemption and concession" },
  { id: "federal-schemes",label: "Federal schemes in VIC" },
  { id: "vic-specific",   label: "VIC-specific schemes and resources" },
  { id: "buying-process", label: "The VIC buying process" },
  { id: "contacts",       label: "Key contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Is the first home grant bigger in regional Victoria?",
    answer:
      `No. The State Revenue Office's historical rates show the $20,000 regional grant ran from 1 July 2017 to 30 June 2021. The grant is now ${GRANT_AMOUNT} for a new home anywhere in Victoria valued up to ${GRANT_CAP} (SRO Victoria, read ${longDate(GRANT.checkedOn)}).`,
  },
  {
    question: "Can I get the VIC FHOG on an established home?",
    answer:
      "No. The grant only applies to new homes (first time sold as residential), substantially renovated homes (where the original dwelling was effectively replaced), and house-and-land contracts. Established homes do not qualify, though you can still get the stamp duty exemption on them.",
  },
  {
    question: "What's the price cap for the VIC FHOG?",
    answer:
      `${GRANT_CAP} total value (house plus land), SRO Victoria (read ${longDate(GRANT.checkedOn)}). One dollar over the cap and you lose the entire grant.`,
  },
  {
    question: "Do I really pay $0 stamp duty in VIC for a first home?",
    answer:
      `Up to ${fmt(DUTY.exemptTo!)}, yes: an eligible first home buyer pays no land transfer duty. From ${fmt(DUTY.exemptTo! + 1)} to ${fmt(DUTY.concessionTo!)} a reduced amount applies, on a sliding scale, and above ${fmt(DUTY.concessionTo!)} the general rate (SRO Victoria, read ${longDate(DUTY.checkedOn)}). On $550,000 that saves ${DUTY_550K}.`,
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

      <FirstHomeGrantFacts state="VIC" />

      <h3>Eligibility requirements</h3>
      <ul>
        <li>At least one applicant must be an Australian citizen or permanent resident</li>
        <li>All applicants must be 18 years or older</li>
        <li>None of the applicants can have previously owned residential property in Australia</li>
        <li>At least one applicant must occupy the home for 12 continuous months within 12 months of settlement or completion</li>
      </ul>

      <h3>Eligible properties</h3>
      <ul>
        <li>New homes (first time sold as residential) with a total value (house plus land) of {GRANT_CAP} or less</li>
        <li>Substantially renovated homes (extensive renovation where the original dwelling was effectively removed/replaced)</li>
        <li>Established homes do <strong>not</strong> qualify</li>
      </ul>

      <h2 id="stamp-duty-vic">Stamp duty exemption and concession</h2>
      <p>
        Victoria provides stamp duty (land transfer duty) relief for eligible first
        home buyers on both new and established properties.
      </p>

      <FirstHomeDutyFacts state="VIC" />

      <p>
        On a $550,000 purchase, an eligible first home buyer in Victoria pays{" "}
        <strong>$0</strong> in duty; an owner-occupier who is not a first home buyer pays{" "}
        {DUTY_550K}. Use our{" "}
        <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link> for your
        own price.
      </p>

      <h3>Principal Place of Residence concession (non-first home buyers)</h3>
      <p>
        Victoria also charges a lower principal place of residence rate to any
        owner-occupier, first home buyer or not, on a home valued up to{" "}
        {fmt(VIC_PPR_MAX)} (SRO Victoria). It&rsquo;s a separate concession from the first home
        buyer exemption.
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
          <strong>Victorian Homebuyer Fund:</strong> closed to new applications on
          10 September 2025. Victoria&rsquo;s shared equity option is now the federal{" "}
          <Link href="/guides/help-to-buy-scheme-victoria">Help to Buy scheme</Link>.
        </li>
        <li>
          <strong>Homes Victoria:</strong> Check homes.vic.gov.au for any current
          co-contribution or affordable housing programs for first home buyers.
        </li>
      </ul>

      <p>
        To compare prices before you set a budget, search any Victorian suburb in our{" "}
        <Link href="/suburbs">suburb profiles</Link>; each one shows its median only where the
        sales data behind it passes our checks.
      </p>

      <h2 id="buying-process">The VIC buying process</h2>
      <p>Victoria has some distinct features:</p>
      <ul>
        <li><strong>Section 32 (Vendor&rsquo;s Statement):</strong> Vendors must provide a Section 32 before a contract is signed. It contains title, planning overlays, outgoings, and building permits. Review with your solicitor before signing.</li>
        <li><strong>Cooling-off period:</strong> 3 business days from signing the contract of sale. No cooling-off at auction.</li>
        <li><strong>Auction market:</strong> Melbourne is one of Australia&rsquo;s most active auction markets. Pre-auction due diligence (building inspections, finance, contract review) needs to be done before bidding.</li>
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

      <Sources items={firstHomeSources(["VIC"])} />
    </GuideArticleLayout>
  );
}
