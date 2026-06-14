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
  title: "First Home Buyer Guide WA: $10K Grant, Stamp Duty & Schemes (2026)",
  description:
    "Western Australia first home buyer guide: $10,000 FHOG for new homes under $750K, stamp duty exemption under $450K, concession to $600K, federal schemes, and Keystart loans.",
  slug: "first-home-buyer-wa",
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
  "WA's FHOG is $10,000 on new homes only, capped at $750,000.",
  "Full stamp duty exemption applies up to $450,000 with a scaled concession to $600,000, on both new and established homes.",
  "On a $400,000 first home an eligible buyer pays $0 transfer duty, saving roughly $13,400.",
  "Keystart is WA's state-owned low-deposit lender, with deposits as low as 2% and no LMI for eligible buyers, unique to WA.",
  "Federal schemes work in WA with property price caps of $600K Perth and $450K regional.",
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
    question: "Why is stamp duty $0 up to $450,000 in WA but only up to $800,000 in NSW?",
    answer:
      "Each state sets its own threshold. WA's $450,000 threshold reflects its historically lower median prices, though Perth's recent growth has narrowed the gap. The concession scales up to $600,000 (above which standard duty applies), so plenty of FHB-targeted Perth purchases still get a partial concession.",
  },
  {
    question: "Can I combine the FHBG, FHOG, and stamp duty exemption in WA?",
    answer:
      "Yes, on a new home under all the relevant caps. A $400,000 new home in outer Perth could give you the federal FHBG (5% deposit, no LMI), the $10,000 FHOG, and a full stamp duty exemption, a combined saving of roughly $25,000 to $30,000 over a standard purchase.",
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
        value="$10,000"
        label="The WA First Home Owner Grant on new homes up to $750,000."
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
        <li>New homes (never previously sold as residential) with a purchase price of $750,000 or less</li>
        <li>Owner-built homes where the total value of land plus building contract is $750,000 or less</li>
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
        Western Australia gives first home buyers significant stamp duty relief,
        one of the more generous regimes in Australia relative to property prices.
      </p>

      <table>
        <thead>
          <tr>
            <th>Purchase price</th>
            <th>Duty payable</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Up to $450,000</td><td>$0 (full exemption)</td></tr>
          <tr><td>$450,001 to $600,000</td><td>Concession (scaled, progressively reduced)</td></tr>
          <tr><td>Over $600,000</td><td>Full transfer duty applies</td></tr>
        </tbody>
      </table>

      <p>
        On a $400,000 purchase, typical for outer Perth, an eligible first home
        buyer pays <strong>$0</strong> in transfer duty. Standard duty on $400,000
        would be roughly $13,433. Use our{" "}
        <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link> for your
        exact figures.
      </p>

      <h3>Eligibility for the concession</h3>
      <ul>
        <li>The property must be your first home in Australia</li>
        <li>You must occupy it as your principal place of residence within 12 months of settlement</li>
        <li>Both new and established homes qualify (unlike the FHOG)</li>
      </ul>

      <h2 id="federal-schemes">Federal schemes available in WA</h2>
      <ul>
        <li>
          <strong>First Home Guarantee (FHBG):</strong> 5% deposit, no LMI. Income
          limits $125K single / $200K couple. Property price cap $600,000 Perth
          and $450,000 regional WA.
        </li>
        <li>
          <strong>Regional First Home Buyer Guarantee:</strong> For buyers
          purchasing in regional WA, areas like Bunbury, Geraldton, Kalgoorlie, and
          the Pilbara. You must have lived in the area for 12+ months.
        </li>
        <li>
          <strong>Family Home Guarantee:</strong> 2% deposit for single parents,
          income limit $125K. Perth price cap $600,000.
        </li>
        <li>
          <strong>Help to Buy (shared equity):</strong> Up to 40% government equity
          on new homes / 30% on existing.
        </li>
      </ul>
      <p>
        Note: WA's $600,000 Perth cap is lower than east-coast capitals, reflecting
        WA's historically more affordable market. With Perth's rapid price growth
        since 2021, this cap has become a limitation in some inner and middle-ring
        suburbs. Always verify the current cap before relying on it.
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
