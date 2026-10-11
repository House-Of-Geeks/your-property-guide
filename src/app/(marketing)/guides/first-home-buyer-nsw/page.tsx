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
import { HG_DATES, HG_NO_OWNERSHIP_YEARS, HG_PRICE_CAPS, fmtCap } from "@/lib/data/home-guarantee";
import { FirstHomeDutyFacts, FirstHomeGrantFacts } from "@/components/guide/FirstHomeStateFacts";
import { CLOSED_SCHEMES, FIRST_HOME_DUTY, FIRST_HOME_GRANTS, fmt, firstHomeSources, longDate } from "@/lib/data/first-home-grants";
import { dutyFor, money } from "@/lib/data/stamp-duty-state";

// Grant and duty figures come from src/lib/data/first-home-grants.ts and the
// stamp duty engine (commercial-intent review 10 Oct 2026, buying 0.1 rows 1 to 3).
const GRANT = FIRST_HOME_GRANTS.NSW;
const [GRANT_CAP_HOME, GRANT_CAP_BUILD] = GRANT.caps.map((c) => c.value);
const DUTY = FIRST_HOME_DUTY.NSW;
const DUTY_750K = money(dutyFor("NSW", 750_000, "owner").total);
const FHBC = CLOSED_SCHEMES.find((c) => c.name === "First Home Buyer Choice")!;
const SEHBH = CLOSED_SCHEMES.find((c) => c.name === "Shared Equity Home Buyer Helper")!;

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide NSW: Grants, Stamp Duty & Schemes (2026)",
  description:
    "NSW first home buyer guide: $10,000 grant on new homes to $600,000, no stamp duty to $800,000 and a concession to $1,000,000, plus the federal schemes.",
  slug: "first-home-buyer-nsw",
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
  `NSW pays a ${fmt(GRANT.amount!)} First Home Owner (New Homes) Grant on new homes only: up to ${fmt(GRANT_CAP_HOME)} for a home you buy, or ${fmt(GRANT_CAP_BUILD)} for land plus a contract to build (Revenue NSW, read ${longDate(GRANT.checkedOn)}).`,
  `No transfer duty on any home, new or established, up to ${fmt(DUTY.exemptTo!)}, and a concession under ${fmt(DUTY.concessionTo!)}, for contracts from ${DUTY.from} (First Home Buyers Assistance Scheme).`,
  `Federal schemes work in NSW. The 5% Deposit Scheme has had no income test or limit on places since ${HG_DATES.expanded}; its price cap is ${fmtCap(HG_PRICE_CAPS.NSW.capital)} in Greater Sydney and NSW's regional centres and ${fmtCap(HG_PRICE_CAPS.NSW.rest)} elsewhere.`,
  `On a $750,000 home an eligible NSW first home buyer pays $0 transfer duty, where any other buyer pays ${DUTY_750K} on the 2026-27 rates.`,
  `First Home Buyer Choice, the annual property tax option, ${FHBC.status}, so it is not open to new buyers.`,
  "Rules and price caps change. Verify with Revenue NSW or a licensed conveyancer before relying on these figures.",
];

const TOC: GuideTOCEntry[] = [
  { id: "fhog-nsw",       label: "First Home Owner Grant NSW" },
  { id: "stamp-duty-nsw", label: "Stamp duty exemption and concession" },
  { id: "federal-schemes",label: "Federal schemes available in NSW" },
  { id: "nsw-specific",   label: "NSW schemes, open and closed" },
  { id: "buying-process", label: "The NSW buying process" },
  { id: "contacts",       label: "Key NSW contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can I get the NSW First Home Owner Grant on an established home?",
    answer:
      `No. The ${fmt(GRANT.amount!)} NSW grant applies only to new homes (never previously occupied or sold), substantially renovated homes and owner-builder homes (Revenue NSW, read ${longDate(GRANT.checkedOn)}). You can still claim the transfer duty exemption on an established home: an eligible first home buyer pays no duty on a home up to ${fmt(DUTY.exemptTo!)}.`,
  },
  {
    question: "What's the price cap for the NSW FHOG?",
    answer:
      `${fmt(GRANT_CAP_HOME)} for a new or substantially renovated home you buy. If you buy vacant land and sign a building contract, or build as an owner-builder, the land and the build together can be up to ${fmt(GRANT_CAP_BUILD)} (Revenue NSW, read ${longDate(GRANT.checkedOn)}). One dollar over the cap and you lose the entire grant, so plan well under to leave room for negotiation.`,
  },
  {
    question: "Is stamp duty really $0 in NSW for first home buyers?",
    answer:
      `Yes, on any home, new or established, valued up to ${fmt(DUTY.exemptTo!)}: an eligible first home buyer pays no transfer duty. Over ${fmt(DUTY.exemptTo!)} and under ${fmt(DUTY.concessionTo!)} a concessional rate applies, and from ${fmt(DUTY.concessionTo!)} the full rate (Revenue NSW, contracts from ${DUTY.from}). On a $750,000 home that saves ${DUTY_750K}.`,
  },
  {
    question: "Can I still pay an annual property tax instead of stamp duty in NSW?",
    answer:
      `No. First Home Buyer Choice, which let first home buyers pay an annual property tax instead of transfer duty, ${FHBC.status} (Revenue NSW). Buyers who opted in before then keep paying the property tax. Today the relief is the First Home Buyers Assistance Scheme: no duty up to ${fmt(DUTY.exemptTo!)} and a concession under ${fmt(DUTY.concessionTo!)}.`,
  },
  {
    question: "Can I combine the FHOG with the First Home Guarantee in NSW?",
    answer:
      `Yes, if you're buying a new home under both price caps. The 5% Deposit Scheme covers the deposit and LMI side (caps of ${fmtCap(HG_PRICE_CAPS.NSW.capital)} in Greater Sydney and the regional centres, ${fmtCap(HG_PRICE_CAPS.NSW.rest)} elsewhere in NSW); the grant is ${fmt(GRANT.amount!)} on top, for a new home bought for up to ${fmt(GRANT_CAP_HOME)}, or land and a building contract up to ${fmt(GRANT_CAP_BUILD)}. Add the transfer duty exemption, which covers any home up to ${fmt(DUTY.exemptTo!)}.`,
  },
  {
    question: "What qualifies you as a first home buyer in NSW?",
    answer:
      `It depends on the scheme. For the duty exemption, you and your partner must never have owned residential property in Australia. For the grant, neither of you can have owned a home before 1 July 2000 or lived for six months in one you owned since (Revenue NSW, read ${longDate(GRANT.checkedOn)}). The federal 5% Deposit Scheme takes anyone who has not owned Australian property in the last ${HG_NO_OWNERSHIP_YEARS} years.`,
  },
  {
    question: "What's the cooling-off period in NSW?",
    answer:
      "5 business days from exchange of contracts on private treaty sales. Auctions have no cooling-off period. If you back out during the cooling-off period you forfeit 0.25% of the purchase price.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide", description: "Federal schemes, FHOG by state, stamp duty concessions and step-by-step process." },
  { title: "Stamp Duty NSW",         href: "/guides/stamp-duty-nsw",          description: "NSW rates, worked examples and the first home buyer exemption to $800K." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",          description: "Estimate your NSW stamp duty in seconds." },
  { title: "Conveyancing in Australia",         href: "/guides/conveyancing-guide",      description: "What conveyancers do, what they cost, and what to ask." },
  { title: "Lenders Mortgage Insurance",        href: "/guides/lenders-mortgage-insurance-guide", description: "What LMI costs and the schemes that waive it." },
  { title: "Buying Property in Australia",      href: "/guides/buying-property-australia", description: "The complete step-by-step buying process." },
];

export default function FirstHomeBuyerNSWPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Verify with Revenue NSW before you rely on this">
        <p>
          Grant amounts, thresholds, and eligibility rules change. Always verify
          current details with{" "}
          <a href="https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer" target="_blank" rel="noopener noreferrer">
            Revenue NSW
          </a>{" "}
          or a licensed conveyancer before signing a contract.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The single biggest thing buyers misread in NSW is the gap
          between the $10,000 FHOG (new homes only, $600K cap, or $750K for land and a build) and the
          stamp duty exemption (any home, $800K cap). Most first home
          buyers I talk to here qualify for the duty exemption on an
          established home and never get near the grant. That&rsquo;s the
          much larger saving. Worry about the duty rules first, the
          grant second.
        </p>
      </EditorNote>

      <h2 id="fhog-nsw">First Home Owner Grant NSW</h2>
      <p className="lead">
        NSW pays a {fmt(GRANT.amount!)} First Home Owner (New Homes) Grant to eligible first home buyers
        buying or building a new home. Revenue NSW administers it.
      </p>

      <FirstHomeGrantFacts state="NSW" />

      <h3>Eligibility requirements</h3>
      <ul>
        <li>At least one applicant must be an Australian citizen or permanent resident</li>
        <li>All applicants must be individuals (not companies or trusts)</li>
        <li>All applicants must be at least 18 years old at the date of the transaction</li>
        <li>No applicant or spouse can have received a First Home Owner Grant, owned a home in Australia before 1 July 2000, or lived for six continuous months or more in a home they owned since then</li>
        <li>At least one applicant must occupy the property for at least 12 continuous months within 12 months of settlement</li>
      </ul>

      <h3>Eligible properties</h3>
      <ul>
        <li>New homes (never previously occupied or sold), purchase price {fmt(GRANT_CAP_HOME)} or less</li>
        <li>Substantially renovated homes, purchase price {fmt(GRANT_CAP_HOME)} or less</li>
        <li>Vacant land plus a building contract, or an owner-builder home: land and build together {fmt(GRANT_CAP_BUILD)} or less</li>
        <li>Established homes do <strong>not</strong> qualify for the NSW FHOG</li>
      </ul>

      <h3>How and when the grant is paid</h3>
      <p>
        For purchases, the grant is typically paid at settlement through your lender.
        For owner-builders, it&rsquo;s paid when an occupancy certificate is issued. Apply
        through Revenue NSW (online at revenue.nsw.gov.au) or via your lender.
      </p>

      <h2 id="stamp-duty-nsw">Stamp duty exemption and concession</h2>
      <p>
        NSW gives first home buyers transfer duty relief on new and established homes alike,
        under the First Home Buyers Assistance Scheme. The thresholds below apply to contracts
        exchanged from {DUTY.from}.
      </p>

      <FirstHomeDutyFacts state="NSW" />

      <p>
        On a $750,000 home, an eligible first home buyer in NSW pays{" "}
        <strong>$0</strong> in transfer duty; any other buyer pays {DUTY_750K}. Use our{" "}
        <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link> for your
        own price.
      </p>

      <h3>Eligibility for the concession</h3>
      <ul>
        <li>The property must be your first home in Australia</li>
        <li>You must intend to occupy it as your principal place of residence within 12 months</li>
        <li>Both new and established homes are eligible (unlike the FHOG, which is new homes only)</li>
      </ul>

      <h3>First Home Buyer Choice has closed</h3>
      <p>
        First Home Buyer Choice, now closed, let first home buyers pay an annual property tax instead of
        transfer duty. It {FHBC.status}, when the First Home Buyers Assistance Scheme was
        expanded, so new buyers cannot opt in (
        <a href={FHBC.source.href} target="_blank" rel="noopener noreferrer">Revenue NSW</a>
        ). Owners who opted in before then keep paying the property tax.
      </p>

      <h2 id="federal-schemes">Federal schemes available in NSW</h2>
      <ul>
        <HomeGuaranteeNote state="NSW" />
        <HelpToBuyNote state="NSW" />
        <FhssNote />
      </ul>
      <p>
        Federal schemes are available through participating lenders nationwide,
        including in NSW. See our{" "}
        <Link href="/guides/first-home-buyer-guide">national First Home Buyer Guide</Link>{" "}
        for full federal scheme details.
      </p>

      <h2 id="nsw-specific">NSW schemes, open and closed</h2>
      <ul>
        <li>
          <strong>Shared Equity Home Buyer Helper:</strong> the NSW Government&rsquo;s own shared
          equity scheme {SEHBH.status} (
          <a href={SEHBH.source.href} target="_blank" rel="noopener noreferrer">Revenue NSW</a>
          ). The shared equity option open in NSW now is the federal Help to Buy scheme above;
          our <Link href="/guides/shared-equity-schemes-australia">shared equity guide</Link> lists
          every scheme and its status.
        </li>
        <li>
          <strong>First Home Buyer Choice:</strong> {FHBC.status}.
        </li>
        <li>
          <strong>Revenue NSW:</strong> one place to apply for the transfer duty exemption or
          concession and the First Home Owner (New Homes) Grant, at revenue.nsw.gov.au.
        </li>
      </ul>
      <p>
        To compare prices before you set a budget, search any NSW suburb in our{" "}
        <Link href="/suburbs">suburb profiles</Link>; each one shows its median only where the
        sales data behind it passes our checks.
      </p>

      <h2 id="buying-process">The NSW buying process</h2>
      <p>NSW has some unique features in its conveyancing process:</p>
      <ul>
        <li><strong>Cooling-off period:</strong> 5 business days from exchange (auctions have no cooling-off period)</li>
        <li><strong>Contract of sale:</strong> The vendor prepares a contract before listing, which you can review prior to making an offer</li>
        <li><strong>Strata reports:</strong> For apartments, your solicitor should review the strata report and financial statements before exchange</li>
        <li><strong>Settlement:</strong> Typically 6 weeks after exchange but negotiable; conducted electronically via PEXA</li>
      </ul>
      <p>
        For the full step-by-step process, see{" "}
        <Link href="/guides/buying-property-australia">Buying Property in Australia</Link>.
      </p>

      <h2 id="contacts">Key NSW contacts</h2>
      <ul>
        <li>
          <strong>Revenue NSW</strong>, FHOG, stamp duty concessions, First Home Buyer Assistance Scheme:{" "}
          <a href="https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer" target="_blank" rel="noopener noreferrer">
            revenue.nsw.gov.au
          </a>
        </li>
        <li>
          <strong>NSW Fair Trading</strong>, contracts, conveyancing, consumer rights:{" "}
          <a href="https://www.fairtrading.nsw.gov.au" target="_blank" rel="noopener noreferrer">
            fairtrading.nsw.gov.au
          </a>
        </li>
        <li>
          <strong>Housing Australia</strong>, First Home Guarantee and federal schemes:{" "}
          <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer">
            housingaustralia.gov.au
          </a>
        </li>
      </ul>

      <Sources items={firstHomeSources(["NSW"]).concat([{ label: FHBC.source.label, href: FHBC.source.href, note: "read 10 October 2026" }, { label: SEHBH.source.label, href: SEHBH.source.href, note: "read 10 October 2026" }])} />
    </GuideArticleLayout>
  );
}
