import type { Metadata } from "next";
import Link from "next/link";
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

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide NSW: Grants, Stamp Duty & Schemes (2026)",
  description:
    "NSW first home buyer guide: $10,000 FHOG for new homes, stamp duty exemption up to $800K, concession to $1M, federal schemes, and step-by-step NSW buying advice.",
  slug: "first-home-buyer-nsw",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
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
  "NSW offers a $10,000 First Home Owner Grant on new homes only, capped at $750,000 contract price.",
  "Full stamp duty exemption applies on any home (new or established) up to $800,000, with a scaled concession up to $1,000,000.",
  "Federal schemes (First Home Guarantee, Family Home Guarantee, Help to Buy) work in NSW with the same income limits as elsewhere; price caps are $900K Sydney metro and $750K regional NSW.",
  "On a $750,000 home, an eligible NSW first home buyer pays $0 stamp duty, saving roughly $29,000 versus a standard buyer.",
  "First Home Buyer Choice (annual property tax instead of upfront stamp duty) remains available for properties up to $1.5M for eligible buyers.",
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
      "$750,000 contract price for the new home. One dollar over the cap and you lose the entire grant. Plan well under to leave room for negotiation.",
  },
  {
    question: "Is stamp duty really $0 in NSW for first home buyers?",
    answer:
      "Yes, on any home (new or established) up to $800,000 contract price, an eligible first home buyer in NSW pays no stamp duty. Between $800,001 and $1,000,000 a scaled concession applies. Above $1,000,000 the standard rate kicks in.",
  },
  {
    question: "Should I take stamp duty upfront or use First Home Buyer Choice?",
    answer:
      "First Home Buyer Choice lets eligible buyers pay an annual 0.3% land-value property tax instead of stamp duty upfront, on properties up to $1.5M. It improves cash flow at settlement but costs more long-term if you stay 10+ years. Most owner-occupiers planning to hold long-term are better off with the upfront duty (or exemption). Get advice based on your specific numbers.",
  },
  {
    question: "Can I combine the FHOG with the First Home Guarantee in NSW?",
    answer:
      "Yes, if you're buying a new home under both price caps. The FHBG covers the deposit/LMI side ($900K Sydney, $750K regional NSW caps); the FHOG is a $10,000 cash grant on top, capped at $750K contract price. Stack them with the stamp duty exemption and you can save $40,000 to $50,000 on a Sydney new build.",
  },
  {
    question: "What's the cooling-off period in NSW?",
    answer:
      "5 business days from exchange of contracts on private treaty sales. Auctions have no cooling-off period. If you back out during the cooling-off period you forfeit 0.25% of the purchase price.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide", description: "Federal schemes, FHOG by state, stamp duty concessions and step-by-step process." },
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
          between the $10,000 FHOG (new homes only, $750K cap) and the
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
        label="The NSW First Home Owner Grant for new homes up to $750,000."
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
        <li>New homes (never previously occupied or sold), $750,000 or less</li>
        <li>Substantially renovated homes, $750,000 or less</li>
        <li>Owner-builder new homes that meet the same price cap</li>
        <li>Established homes do <strong>not</strong> qualify for the NSW FHOG</li>
      </ul>

      <h3>How and when the grant is paid</h3>
      <p>
        For purchases, the grant is typically paid at settlement through your lender.
        For owner-builders, it's paid when an occupancy certificate is issued. Apply
        through Revenue NSW (online at revenue.nsw.gov.au) or via your lender.
      </p>

      <h2 id="stamp-duty-nsw">Stamp duty exemption and concession</h2>
      <p>
        NSW offers significant stamp duty relief for first home buyers on both new
        and established properties. Since September 2023, concessions apply to
        eligible buyers purchasing any home, new or established.
      </p>

      <table>
        <thead>
          <tr>
            <th>Purchase price</th>
            <th>Stamp duty payable</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Up to $800,000</td><td>$0 (full exemption)</td></tr>
          <tr><td>$800,001 to $1,000,000</td><td>Concession (scaled, reduced rate)</td></tr>
          <tr><td>Over $1,000,000</td><td>Full stamp duty applies</td></tr>
        </tbody>
      </table>

      <p>
        On a $750,000 home, an eligible first home buyer in NSW pays{" "}
        <strong>$0</strong> in stamp duty. A standard buyer would pay roughly
        $29,000. Use our{" "}
        <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link> to estimate
        your exact saving.
      </p>

      <h3>Eligibility for the concession</h3>
      <ul>
        <li>The property must be your first home in Australia</li>
        <li>You must intend to occupy it as your principal place of residence within 12 months</li>
        <li>Both new and established homes are eligible (unlike the FHOG, which is new homes only)</li>
      </ul>

      <h3>First Home Buyer Choice (optional annual property tax)</h3>
      <p>
        NSW introduced First Home Buyer Choice in 2023, giving buyers the option to
        pay an annual property tax instead of upfront stamp duty. It's available for
        properties up to $1.5M and is calculated as 0.3% of land value for
        owner-occupiers. The option improves cash flow at settlement but adds an
        ongoing cost. Get advice on which option suits your specific situation
        before opting in.
      </p>

      <h2 id="federal-schemes">Federal schemes available in NSW</h2>
      <ul>
        <li>
          <strong>First Home Guarantee (FHBG):</strong> 5% deposit, no LMI. Income
          limits $125K single / $200K couple. Property price cap $900,000 Sydney
          metro and $750,000 regional NSW.
        </li>
        <li>
          <strong>Regional First Home Buyer Guarantee:</strong> Same as FHBG for
          buyers purchasing in regional NSW. You must have lived in the area for
          12+ months continuously prior to purchase.
        </li>
        <li>
          <strong>Family Home Guarantee:</strong> 2% deposit for single parents,
          income limit $125K. Price cap as for FHBG.
        </li>
        <li>
          <strong>Help to Buy (shared equity):</strong> Government takes up to 40%
          equity on new homes / 30% on existing. Income limits $90K single /
          $120K couple. Check housing.gov.au for current operational status.
        </li>
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
          <strong>Shared Equity Home Buyer Helper (NSW):</strong> The NSW
          Government's own shared equity scheme. Eligible buyers can purchase with
          the state co-investing up to 40% (new homes) or 30% (existing). Income
          caps $90K single / $120K couple. Available for key workers, single
          parents, and older singles (50+) in certain circumstances. Check
          eligibility at Service NSW.
        </li>
        <li>
          <strong>Revenue NSW First Home Buyer Assistance Scheme:</strong> Single
          place to apply for the stamp duty exemption/concession and FHOG at
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
