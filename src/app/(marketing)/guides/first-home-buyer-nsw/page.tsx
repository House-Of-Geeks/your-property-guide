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
import { NSW_FIRST_HOME, NSW_FIRST_HOME_LAND, calculateStampDuty } from "@/lib/utils/stamp-duty";
import { FIRST_HOME_REVIEWED_ON, formatPolicyDate, money } from "@/lib/policy/first-home";

// Figures from src/lib/policy/first-home.ts and the stamp duty engine.
const duty = (price: number) => calculateStampDuty(price, "NSW", false, false, false).total;
const firstHomeDuty = (price: number) => calculateStampDuty(price, "NSW", true, false, false).total;

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide NSW: Grants, Stamp Duty & Schemes (2026)",
  description:
    "NSW first home buyer guide: $10,000 FHOG for new homes, stamp duty exemption up to $800K, concession to $1M, federal schemes, and step-by-step NSW buying advice.",
  slug: "first-home-buyer-nsw",
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
  "NSW offers a $10,000 First Home Owner Grant on new homes only: up to $600,000 for a home you buy, or $750,000 for land plus a contract to build.",
  `For contracts exchanged from ${NSW_FIRST_HOME.from}, there's no stamp duty on any home (new or established) up to ${money(NSW_FIRST_HOME.exemptTo)}, and a reduced amount below ${money(NSW_FIRST_HOME.concessionTo)}. Vacant land to build on is duty free to ${money(NSW_FIRST_HOME_LAND.exemptTo)}.`,
  `Federal schemes work in NSW. The 5% Deposit Scheme has had no income test or limit on places since ${HG_DATES.expanded}; its price cap is ${fmtCap(HG_PRICE_CAPS.NSW.capital)} in Greater Sydney and NSW's regional centres and ${fmtCap(HG_PRICE_CAPS.NSW.rest)} elsewhere.`,
  `On a $750,000 home, an eligible NSW first home buyer pays $0 stamp duty, saving ${money(duty(750_000))} against any other buyer.`,
  "First Home Buyer Choice (an annual property tax instead of duty) closed to new buyers in 2023, and the Shared Equity Home Buyer Helper closed on 30 June 2024. Help to Buy is now NSW's shared equity option.",
  "Rules and price caps change. Verify with Revenue NSW or a licensed conveyancer before relying on these figures.",
];

const TOC: GuideTOCEntry[] = [
  { id: "fhog-nsw",       label: "First Home Owner Grant NSW" },
  { id: "stamp-duty-nsw", label: "Stamp duty exemption and concession" },
  { id: "federal-schemes",label: "Federal schemes available in NSW" },
  { id: "nsw-specific",   label: "NSW-specific schemes and resources" },
  { id: "median-prices",  label: "Median prices for first home buyers" },
  { id: "buying-process", label: "The NSW buying process" },
  { id: "contacts",       label: "Key NSW contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can I get the NSW First Home Owner Grant on an established home?",
    answer:
      "No. The $10,000 NSW FHOG only applies to new homes (never previously occupied or sold), substantially renovated homes, and owner-builder new homes. Established homes do not qualify for the grant. However, you can still get the NSW stamp duty exemption or concession on an established home if it's under the threshold.",
  },
  {
    question: "What's the price cap for the NSW FHOG?",
    answer:
      "$600,000 purchase price for a new or substantially renovated home. If you buy vacant land and sign a building contract, or build as an owner-builder, the land and the build together can be up to $750,000. One dollar over the cap and you lose the entire grant, so plan well under to leave room for negotiation.",
  },
  {
    question: "Is stamp duty really $0 in NSW for first home buyers?",
    answer:
      `Yes, on any home (new or established) up to ${money(NSW_FIRST_HOME.exemptTo)}, for contracts exchanged from ${NSW_FIRST_HOME.from}. Above that the duty rises in a straight line to the full rate at ${money(NSW_FIRST_HOME.concessionTo)}: a $900,000 home pays ${money(firstHomeDuty(900_000))} instead of ${money(duty(900_000))}. Vacant land to build on is duty free to ${money(NSW_FIRST_HOME_LAND.exemptTo)}, with a concession below ${money(NSW_FIRST_HOME_LAND.concessionTo)}.`,
  },
  {
    question: "Can I still pay an annual property tax instead of stamp duty?",
    answer:
      `No. First Home Buyer Choice, which let first home buyers pay an annual property tax instead of upfront duty, closed to new buyers in 2023. Contracts exchanged from ${NSW_FIRST_HOME.from} use the First Home Buyers Assistance Scheme instead: no duty up to ${money(NSW_FIRST_HOME.exemptTo)} and a reduced amount below ${money(NSW_FIRST_HOME.concessionTo)}.`,
  },
  {
    question: "Can I combine the FHOG with the First Home Guarantee in NSW?",
    answer:
      `Yes, if you're buying a new home under both price caps. The 5% Deposit Scheme covers the deposit/LMI side (caps of ${fmtCap(HG_PRICE_CAPS.NSW.capital)} in Greater Sydney and the regional centres, ${fmtCap(HG_PRICE_CAPS.NSW.rest)} elsewhere in NSW); the FHOG is a $10,000 cash grant on top, for a new home bought for up to $600,000, or land and a building contract up to $750,000. Add the stamp duty exemption, which covers any home up to $800,000.`,
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
        NSW offers a $10,000 First Home Owner Grant for eligible first home buyers
        purchasing or building a new home. The grant is funded by the NSW Government
        and administered by Revenue NSW.
      </p>

      <KeyFigure
        value="$10,000"
        label="The NSW First Home Owner Grant for new homes up to $600,000, or land and a building contract up to $750,000."
        context="Established homes do not qualify"
      />

      <h3>Eligibility requirements</h3>
      <ul>
        <li>At least one applicant must be an Australian citizen or permanent resident</li>
        <li>All applicants must be individuals (not companies or trusts)</li>
        <li>All applicants must be at least 18 years old at the date of the transaction</li>
        <li>None of the applicants can have previously owned residential property in Australia</li>
        <li>At least one applicant must occupy the property for at least 12 continuous months within 12 months of settlement</li>
      </ul>

      <h3>Eligible properties</h3>
      <ul>
        <li>New homes (never previously occupied or sold), purchase price $600,000 or less</li>
        <li>Substantially renovated homes, purchase price $600,000 or less</li>
        <li>Vacant land plus a building contract, or an owner-builder home: land and build together $750,000 or less</li>
        <li>Established homes do <strong>not</strong> qualify for the NSW FHOG</li>
      </ul>
      <p>
        Caps from{" "}
        <a href="https://www.revenue.nsw.gov.au/grants-schemes/first-home-owner-new-homes-grant" target="_blank" rel="noopener noreferrer">
          Revenue NSW: First Home Owner (New Homes) Grant
        </a>
        , checked {formatPolicyDate(FIRST_HOME_REVIEWED_ON)}.
      </p>

      <h3>How and when the grant is paid</h3>
      <p>
        For purchases, the grant is typically paid at settlement through your lender.
        For owner-builders, it's paid when an occupancy certificate is issued. Apply
        through Revenue NSW (online at revenue.nsw.gov.au) or via your lender.
      </p>

      <h2 id="stamp-duty-nsw">Stamp duty exemption and concession</h2>
      <p>
        Under the First Home Buyers Assistance Scheme, NSW gives first home
        buyers stamp duty relief on new and established homes alike. These
        thresholds apply to contracts exchanged from {NSW_FIRST_HOME.from}; before
        that the exemption stopped at $650,000.
      </p>

      <table>
        <thead>
          <tr>
            <th>Purchase price</th>
            <th>Stamp duty payable</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Up to {money(NSW_FIRST_HOME.exemptTo)}</td><td>$0 (full exemption)</td></tr>
          <tr><td>Above {money(NSW_FIRST_HOME.exemptTo)} and below {money(NSW_FIRST_HOME.concessionTo)}</td><td>Concession: rises in a straight line to full duty</td></tr>
          <tr><td>{money(NSW_FIRST_HOME.concessionTo)} or more</td><td>Full stamp duty</td></tr>
          <tr><td>Vacant land up to {money(NSW_FIRST_HOME_LAND.exemptTo)}</td><td>$0, with a concession below {money(NSW_FIRST_HOME_LAND.concessionTo)}</td></tr>
        </tbody>
      </table>

      <p>
        {`On a $750,000 home, an eligible first home buyer in NSW pays $0 in stamp duty, where any other buyer pays ${money(duty(750_000))}. At $900,000 a first home buyer pays ${money(firstHomeDuty(900_000))} instead of ${money(duty(900_000))}. `}
        Use our <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link>{" "}
        to estimate your exact saving; it applies the rules for your contract date.
      </p>

      <h3>Eligibility for the concession</h3>
      <ul>
        <li>The property must be your first home in Australia</li>
        <li>You must intend to occupy it as your principal place of residence within 12 months</li>
        <li>Both new and established homes are eligible (unlike the FHOG, which is new homes only)</li>
      </ul>

      <h3>First Home Buyer Choice has closed</h3>
      <p>
        First Home Buyer Choice, which let first home buyers pay an annual
        property tax instead of upfront stamp duty, closed to new buyers in 2023.
        The First Home Buyers Assistance Scheme above is the help that applies
        now.
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

      <h2 id="nsw-specific">NSW-specific schemes and resources</h2>
      <ul>
        <li>
          <strong>Shared Equity Home Buyer Helper:</strong>{" "}closed on 30 June
          2024. NSW&rsquo;s shared equity option is now the federal{" "}
          <Link href="/guides/help-to-buy-scheme-nsw">Help to Buy scheme</Link>.
        </li>
        <li>
          <strong>Revenue NSW, First Home Buyers Assistance Scheme:</strong> where
          you apply for the stamp duty exemption or concession, and the FHOG, at
          revenue.nsw.gov.au.
        </li>
      </ul>

      <h2 id="median-prices">Median property prices for first home buyers</h2>
      <p>
        Sydney remains one of the most expensive markets in Australia. First home
        buyers typically target:
      </p>
      <ul>
        <li><strong>Units in middle-ring suburbs:</strong> Median around $700,000 to $900,000 (Western Suburbs, Inner West, Northern Beaches units)</li>
        <li><strong>Houses in outer suburbs:</strong> Western Sydney suburbs like Campbelltown, Penrith and Blacktown, medians from $750,000 to $950,000</li>
        <li><strong>Regional NSW:</strong> Newcastle, Wollongong and the Central Coast, unit medians from $500,000 to $700,000</li>
      </ul>
      <p>
        Use our <Link href="/suburbs">suburb profiles</Link> to research current
        median prices, rental yields, and market trends in any NSW suburb.
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
    </GuideArticleLayout>
  );
}
