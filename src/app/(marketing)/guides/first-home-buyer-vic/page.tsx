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
  title: "First Home Buyer Guide VIC: Grants, Stamp Duty & Schemes (2026)",
  description:
    "Victoria first home buyer guide: $10K FHOG (regional $20K), stamp duty exemption up to $600K, concession to $750K, federal schemes, and VIC buying tips.",
  slug: "first-home-buyer-vic",
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
  "Victoria's FHOG is $10,000 in metro Melbourne and $20,000 in regional VIC, on new homes only, capped at $750,000.",
  "Full stamp duty exemption applies to any first home (new or established) up to $600,000, with a scaled concession up to $750,000.",
  "On a $550,000 first home, eligible buyers pay $0 stamp duty, saving roughly $26,000.",
  "Federal schemes (FHBG, Family Home Guarantee, Help to Buy) all work in VIC; price caps are $800K Melbourne metro and $650K regional.",
  "The Victorian Homebuyer Fund is a state shared-equity scheme that can cut the required deposit to 5% with no LMI.",
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
    question: "What counts as 'regional Victoria' for the $20,000 FHOG?",
    answer:
      "Anywhere outside Melbourne's metropolitan boundary. Geelong, Ballarat, Bendigo, Wodonga, the Latrobe Valley, and the Surf Coast all qualify. The State Revenue Office publishes the official boundary map. Even some outer-Melbourne suburbs sit within the regional zone, so check the map before assuming.",
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
      "Up to $600,000 purchase price, yes, full exemption. Between $600,001 and $750,000 a scaled concession applies (not zero, but significantly reduced). Above $750,000 the standard rate kicks in.",
  },
  {
    question: "What is the Victorian Homebuyer Fund?",
    answer:
      "A state shared-equity scheme. The Victorian Government takes an equity stake of up to 25% in the property, reducing the deposit you need to 5% with no LMI. Income caps and property price caps apply. The government shares in capital gains proportional to its equity. Check homes.vic.gov.au for current availability and rules.",
  },
  {
    question: "What's the cooling-off period in Victoria?",
    answer:
      "3 business days from signing the contract of sale on private treaty sales. There is no cooling-off period if you buy at auction. If you back out during the cooling-off period you forfeit 0.2% of the price (or $100, whichever is higher).",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide", description: "Federal schemes, FHOG by state, stamp duty concessions and step-by-step process." },
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
          the regional FHOG is double the metro grant ($20K vs $10K),
          but only on new builds in eligible regional postcodes. The
          second: the stamp duty exemption stops dead at $600K with a
          taper to $750K, and Melbourne medians don&rsquo;t play nicely
          with that ceiling. Check your contract price against both
          ceilings before you sign, not after.
        </p>
      </EditorNote>

      <h2 id="fhog-vic">First Home Owner Grant VIC</h2>
      <p className="lead">
        Victoria offers the First Home Owner Grant for eligible buyers purchasing
        new homes. The grant amount depends on whether you're buying in metro
        Melbourne or regional Victoria.
      </p>

      <KeyFigure
        value="$20,000"
        label="The FHOG for new homes in regional Victoria, double the metro Melbourne grant."
        context="Capped at $750,000 total value"
      />

      <ul>
        <li><strong>Metro Melbourne:</strong> $10,000</li>
        <li><strong>Regional Victoria:</strong> $20,000, a meaningful boost for buyers targeting regional cities and towns</li>
      </ul>

      <p>
        "Regional Victoria" for FHOG purposes means anywhere outside Melbourne's
        metropolitan boundary. Cities such as Geelong, Ballarat, Bendigo, Wodonga,
        and the Latrobe Valley all qualify. The State Revenue Office publishes the
        official boundary map.
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
          <tr><td>Up to $600,000</td><td>$0 (full exemption)</td></tr>
          <tr><td>$600,001 to $750,000</td><td>Concession (scaled reduction, not zero but significantly reduced)</td></tr>
          <tr><td>Over $750,000</td><td>Full transfer duty applies</td></tr>
        </tbody>
      </table>

      <p>
        On a $550,000 purchase, an eligible first home buyer in Victoria pays{" "}
        <strong>$0</strong> in stamp duty. Without the concession, stamp duty would
        be roughly $26,000. Use our{" "}
        <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link> for your
        exact figures.
      </p>

      <h3>Principal Place of Residence concession (non-first home buyers)</h3>
      <p>
        Victoria also offers a PPR concession for owner-occupiers who are{" "}
        <em>not</em> first home buyers, on properties up to $550,000. It's a
        separate concession from the first home buyer exemption.
      </p>

      <h2 id="federal-schemes">Federal schemes available in VIC</h2>
      <ul>
        <li>
          <strong>First Home Guarantee (FHBG):</strong> 5% deposit, no LMI. Income
          limits $125K single / $200K couple. Property price cap $800,000 Melbourne
          and $650,000 regional VIC.
        </li>
        <li>
          <strong>Regional First Home Buyer Guarantee:</strong> Same as FHBG for
          buyers purchasing in regional VIC. Geelong, Ballarat, and Bendigo are
          all popular under this scheme.
        </li>
        <li>
          <strong>Family Home Guarantee:</strong> 2% deposit for single parents,
          income limit $125K.
        </li>
        <li>
          <strong>Help to Buy (shared equity):</strong> Up to 40% government equity
          on new homes / 30% on existing. Income limits $90K single / $120K couple.
        </li>
      </ul>
      <p>
        See our{" "}
        <Link href="/guides/first-home-buyer-guide">national First Home Buyer Guide</Link>{" "}
        for full federal scheme detail.
      </p>

      <h2 id="vic-specific">VIC-specific schemes and resources</h2>
      <ul>
        <li>
          <strong>Victorian Homebuyer Fund:</strong> Shared equity scheme where the
          Victorian Government takes an equity stake of up to 25%, reducing the
          required deposit to 5% with no LMI. Income caps and property price caps
          apply. Check homes.vic.gov.au for current availability.
        </li>
        <li>
          <strong>Homes Victoria:</strong> Check homes.vic.gov.au for any current
          co-contribution or affordable housing programs for first home buyers.
        </li>
      </ul>

      <h2 id="median-prices">Median property prices for first home buyers</h2>
      <p>
        Melbourne's property market has large price variation by distance from the
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
        <li><strong>Section 32 (Vendor's Statement):</strong> Vendors must provide a Section 32 before a contract is signed. It contains title, planning overlays, outgoings, and building permits. Review with your solicitor before signing.</li>
        <li><strong>Cooling-off period:</strong> 3 business days from signing the contract of sale. No cooling-off at auction.</li>
        <li><strong>Auction market:</strong> Melbourne is one of Australia's most active auction markets. Pre-auction due diligence (building inspections, finance, contract review) needs to be done before bidding.</li>
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
          <strong>Homes Victoria</strong>, Victorian Homebuyer Fund and affordable housing:{" "}
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
