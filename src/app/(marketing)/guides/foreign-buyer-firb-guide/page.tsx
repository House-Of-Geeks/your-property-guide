import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { HowToJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Buying property in Australia as a foreign buyer: complete FIRB guide (2026)",
  description:
    "Who counts as a foreign buyer, what properties you can purchase, FIRB application process and fees, state-by-state foreign-buyer surcharges, and tax implications.",
  slug: "foreign-buyer-firb-guide",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 12,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "investing",
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
  "FIRB approval is required for most foreign-person purchases of Australian residential property. Approval typically takes 30 days; lodge before signing or with a FIRB-conditional clause.",
  "Non-resident foreign buyers can generally buy new dwellings or vacant land, but NOT established homes (with very limited exceptions, plus a 2025 to 2027 ban announced by government).",
  "Temporary residents (student, working holiday, partner visas) can buy ONE established home as principal residence, but must sell when leaving Australia permanently.",
  "FIRB application fees are tiered by purchase price, $14,100 on a $1M property, $84,600+ on $4M, and are non-refundable.",
  "All states except ACT and NT charge a foreign-buyer stamp duty surcharge of 7% to 8% on top of standard duty. Most also charge an annual foreign land-tax surcharge.",
  "On a $1M NSW purchase, total foreign-buyer charges (FIRB fee + surcharge + standard duty) can exceed $130,000 before any other costs.",
];

const TOC: GuideTOCEntry[] = [
  { id: "who-is-foreign",       label: "Who is a 'foreign person'?" },
  { id: "what-can-buy",         label: "What can foreign buyers purchase?" },
  { id: "firb-application",     label: "The FIRB application process" },
  { id: "firb-fees",            label: "FIRB application fees" },
  { id: "state-surcharges",     label: "State-by-state stamp duty surcharges" },
  { id: "land-tax-surcharges",  label: "Land tax surcharges" },
  { id: "tax-implications",     label: "Tax implications" },
  { id: "structures",           label: "Companies and trusts" },
  { id: "practical-tips",       label: "Practical tips" },
];

const FAQS: FaqItem[] = [
  {
    question: "Do I need FIRB approval if I'm on a temporary visa?",
    answer:
      "Usually yes. Temporary residents are foreign persons under FIRB rules and need approval to buy any residential property in Australia. The exception is for genuinely incidental purchases (very rare). If you're a student, working holiday, partner, or skilled-temporary visa holder, plan on FIRB approval and the foreign buyer surcharge.",
  },
  {
    question: "Can foreign non-residents buy established homes?",
    answer:
      "Generally no. Foreign non-residents can buy new dwellings or vacant land for development, but NOT established (existing) homes, with very limited exceptions. The Australian Government also announced in April 2025 a temporary ban on foreign investors purchasing established dwellings; check firb.gov.au for the current status of that measure.",
  },
  {
    question: "What's the foreign buyer stamp duty surcharge?",
    answer:
      "An additional state duty on top of standard stamp duty. NSW 8%, VIC 8%, QLD 7%, SA 7%, WA 7%, TAS 8%. ACT and NT have no surcharge. On a $1M property, the surcharge alone is $70,000 to $80,000 in addition to the standard $40,000 to $55,000 duty.",
  },
  {
    question: "How long does FIRB approval take?",
    answer:
      "FIRB has 30 days to decide from when the complete application is received. The Treasurer can extend this to 90 days. In practice, straightforward residential applications often clear faster, but plan for the full 30 days at least. Most contracts are made conditional on FIRB approval to manage timing.",
  },
  {
    question: "Are New Zealand citizens classed as foreign buyers?",
    answer:
      "For FIRB purposes, NZ citizens on a Special Category Visa (subclass 444) are not foreign persons and don't need FIRB approval. However, some states still charge the foreign-purchaser stamp duty surcharge to NZ citizens, the state rules differ from the FIRB national framework. Always check your specific state's rules.",
  },
  {
    question: "Can I avoid FIRB by buying through an Australian company?",
    answer:
      "No. An Australian company or trust counts as a foreign person if foreign persons hold 20%+ (company) or 40%+ (trust). FIRB approval and foreign-buyer surcharges still apply. Structures can have legitimate uses (estate planning, liability limitation), but they don't exempt you from FIRB rules.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Stamp Duty Calculator",        href: "/stamp-duty-calculator",            description: "Estimate total duty including foreign-buyer surcharges by state." },
  { title: "Buying Property in Australia", href: "/guides/buying-property-australia", description: "The general Australian buying process." },
  { title: "Negative Gearing Australia",   href: "/guides/negative-gearing-australia", description: "Foreign residents have different access to deductions and the CGT discount." },
  { title: "CGT Calculator",               href: "/cgt-calculator",                    description: "Foreign residents lose access to the main-residence exemption." },
  { title: "Best Suburbs for Investors",   href: "/best-suburbs",                       description: "Where new-dwelling supply is most active." },
  { title: "Conveyancing Guide",           href: "/guides/conveyancing-guide",          description: "Why your solicitor must be experienced in foreign-investment law." },
];

export default function ForeignBuyerFIRBGuidePage() {
  return (
    <>
      <HowToJsonLd
        name="How to buy Australian property as a foreign buyer (FIRB process)"
        description="The six-step process for foreign buyers acquiring Australian residential property, from FIRB application to settlement."
        url={`/guides/${FRONTMATTER.slug}`}
        steps={[
          { name: "Determine your eligibility category", text: "Temporary residents, foreign non-residents, and Australian citizens overseas have different FIRB rules and surcharges." },
          { name: "Apply to FIRB before signing a contract", text: "FIRB approval is required before contracts exchange. Standard processing time: 30 days. Application fee scales with property price." },
          { name: "Pay the FIRB application fee", text: "Tiered by property price, for a $1M property, around $14,000+. Non-refundable even if FIRB declines." },
          { name: "Sign contract subject to FIRB approval", text: "Most foreign buyer contracts include a FIRB-approval clause that lets you rescind if FIRB declines." },
          { name: "Pay state foreign buyer stamp duty surcharge", text: "On top of standard stamp duty, foreign buyers pay an additional 7-8% in most states. NSW: 8%. VIC: 8%. QLD: 7%." },
          { name: "Settle as a normal Australian property purchase", text: "Once FIRB approval is granted and contracts are unconditional, settlement proceeds the same as any other purchase." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Engage specialist legal advice">
        <p>
          FIRB rules, fees, and state surcharges change regularly. Always seek
          independent legal advice from a solicitor experienced in foreign
          investment before signing any contract. Penalties for proceeding
          without FIRB approval (when required) include forced divestiture and
          fines up to $168,500.
        </p>
      </Callout>

      <h2 id="who-is-foreign">Who is a &ldquo;foreign person&rdquo; under FIRB rules?</h2>
      <p className="lead">
        Australia&rsquo;s Foreign Investment Review Board (FIRB) administers
        the Foreign Acquisitions and Takeovers Act 1975 (FATA). Under this
        legislation, a &ldquo;foreign person&rdquo; includes:
      </p>
      <ul>
        <li><strong>Foreign nationals who are not Australian permanent residents or citizens</strong>, including people on temporary visas (student, working holiday, skilled temporary, partner visas, etc.)</li>
        <li><strong>Foreign corporations.</strong> Companies incorporated outside Australia, or Australian companies where a foreign person holds 20%+, or foreign persons collectively hold 40%+</li>
        <li><strong>Foreign trusts.</strong> Trusts where foreign persons hold a 40%+ interest</li>
        <li><strong>The foreign government sector.</strong> Sovereign wealth funds and state-owned enterprises</li>
      </ul>
      <p>
        <strong>Who is NOT a foreign person:</strong> Australian citizens,
        Australian permanent residents (PR), and New Zealand citizens who hold
        a Special Category Visa (subclass 444) are not foreign persons for
        FIRB purposes. These individuals can purchase any residential property
        without FIRB approval.
      </p>
      <p>
        Note that NZ citizens on a 444 visa are treated as residents for FIRB
        purposes but may still be subject to foreign-purchaser duty surcharges
        in some states (state rules differ from the FIRB national framework).
      </p>

      <h2 id="what-can-buy">What can foreign buyers purchase?</h2>
      <p>The type of property a foreign person can buy depends on their visa status:</p>

      <h3>Temporary residents (including temporary visa holders)</h3>
      <p>Temporary residents <strong>may</strong> purchase:</p>
      <ul>
        <li>One established (existing) dwelling, provided it will be used as their principal place of residence while they live in Australia. They <strong>must sell the property</strong> when they leave Australia permanently, FIRB will impose this condition.</li>
        <li>New dwellings (subject to FIRB approval).</li>
        <li>Vacant land for development (subject to FIRB approval and construction conditions).</li>
      </ul>
      <p>
        Temporary residents <strong>cannot</strong> buy established dwellings
        as investment properties or holiday homes. The &ldquo;must live in
        it&rdquo; and &ldquo;must sell when leaving&rdquo; conditions are firm.
      </p>

      <h3>Non-residents (living offshore)</h3>
      <p>Foreign non-residents face the most restrictions:</p>
      <ul>
        <li>They <strong>cannot buy established (existing) dwellings</strong> at all, with very limited exceptions.</li>
        <li>They <strong>can buy new dwellings</strong>, properties that have not been previously sold or occupied (off-the-plan apartments, newly built houses).</li>
        <li>They <strong>can buy vacant land</strong> for residential development, subject to conditions requiring construction to begin within 4 years.</li>
      </ul>
      <p>
        The policy rationale is to encourage construction of new housing stock
        rather than foreign buyers competing with Australians for established
        homes.
      </p>

      <Callout variant="warning" title="Temporary ban on established dwellings (2025)">
        <p>
          In April 2025, the Australian Government announced a temporary ban
          preventing foreign investors (including temporary residents) from
          purchasing established dwellings for a two-year period. Check
          firb.gov.au for the current status of this measure, as it may
          affect your purchasing options.
        </p>
      </Callout>

      <h3>Foreign developers</h3>
      <p>
        Foreign entities purchasing new dwellings for resale must obtain
        developer approval. Different thresholds and conditions apply. Seek
        specialist advice if buying through a foreign development company.
      </p>

      <h2 id="firb-application">The FIRB application process</h2>
      <p>
        FIRB approval must generally be obtained <strong>before</strong>{" "}
        signing a contract. In practice, many buyers make the contract
        conditional on FIRB approval, meaning you can sign, but the contract
        is only binding once FIRB approves. Confirm the wording with your
        solicitor.
      </p>
      <ol>
        <li><strong>Determine if approval is required.</strong> Use FIRB&rsquo;s online tool at firb.gov.au.</li>
        <li><strong>Lodge the application.</strong> Apply at firb.gov.au. You will need details of the proposed purchase, your visa status, and supporting documents.</li>
        <li><strong>Pay the application fee.</strong> The fee is based on the purchase price and is non-refundable even if approval is denied.</li>
        <li><strong>Wait for a decision.</strong> FIRB has 30 days to decide; the Treasurer can extend to 90 days.</li>
        <li><strong>Conditions on approval.</strong> Approval is typically granted with conditions, for example, temporary residents will have a condition requiring them to sell when they permanently leave Australia.</li>
      </ol>

      <Callout variant="warning" title="Penalties for non-compliance are severe">
        <p>
          Purchasing without FIRB approval (when required) can result in
          forced divestiture orders, financial penalties up to $168,500
          (2025 to 2026), and criminal prosecution in serious cases.
        </p>
      </Callout>

      <h2 id="firb-fees">FIRB application fees (2025 to 2026)</h2>
      <p>
        FIRB fees are tiered by property value. Fees are indexed annually. The
        2025 to 2026 fees for residential land are:
      </p>
      <table>
        <thead>
          <tr>
            <th>Property value</th>
            <th>Application fee</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Up to $75,000</td><td>$4,200</td></tr>
          <tr><td>$75,001 to $1,000,000</td><td>$14,100</td></tr>
          <tr><td>$1,000,001 to $2,000,000</td><td>$28,200</td></tr>
          <tr><td>$2,000,001 to $3,000,000</td><td>$56,400</td></tr>
          <tr><td>$3,000,001 to $4,000,000</td><td>$84,600</td></tr>
          <tr><td>Each additional $1M above $3M</td><td>+$28,200</td></tr>
        </tbody>
      </table>
      <p>
        These fees are substantial and non-refundable. They are not a tax,
        they are an administrative fee for processing the application. Always
        include FIRB fees in your total acquisition cost budget.
      </p>

      <h2 id="state-surcharges">State-by-state foreign buyer stamp duty surcharges</h2>
      <p>
        In addition to standard stamp duty, all Australian states (except ACT
        and NT) impose a <strong>foreign purchaser surcharge</strong> on top
        of the normal stamp duty. This is a significant additional cost that
        many foreign buyers underestimate.
      </p>
      <p>
        Use our <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link>{" "}
        to estimate your total duty including the foreign surcharge.
      </p>
      <table>
        <thead>
          <tr>
            <th>State / Territory</th>
            <th>Surcharge rate</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>NSW</td><td>8%</td><td>Foreign Investor Surcharge Purchaser Duty</td></tr>
          <tr><td>VIC</td><td>8%</td><td>Foreign Purchaser Additional Duty (FPAD)</td></tr>
          <tr><td>QLD</td><td>7%</td><td>Additional Foreign Acquirer Duty (AFAD)</td></tr>
          <tr><td>SA</td><td>7%</td><td>Foreign Ownership Surcharge</td></tr>
          <tr><td>WA</td><td>7%</td><td>Foreign Buyers Duty</td></tr>
          <tr><td>TAS</td><td>8%</td><td>Foreign Investor Duty Surcharge</td></tr>
          <tr><td>ACT</td><td>None</td><td></td></tr>
          <tr><td>NT</td><td>None</td><td></td></tr>
        </tbody>
      </table>

      <KeyFigure
        value="$130k+"
        label="Total government charges on a $1M NSW purchase by a foreign buyer (FIRB fee + foreign surcharge + standard stamp duty), before any other costs."
        context="Example, illustrative only"
      />

      <p>
        State revenue offices update rates and thresholds regularly. Always
        verify current rates before transacting.
      </p>

      <h2 id="land-tax-surcharges">Land tax surcharges for foreign owners</h2>
      <p>
        Most Australian states also impose an additional annual land tax
        surcharge on property owned by foreign persons. This is a recurring
        charge on top of standard land tax.
      </p>
      <ul>
        <li><strong>NSW.</strong> 4% annual surcharge on the land value of residential properties owned by foreign persons</li>
        <li><strong>VIC.</strong> 2% absentee owner surcharge (rising to 4% for those with interests in multiple properties)</li>
        <li><strong>QLD.</strong> 2% surcharge land tax on all Queensland land owned by foreign persons</li>
        <li><strong>SA.</strong> 0.5% surcharge on the taxable value</li>
        <li><strong>WA.</strong> No specific foreign-owner land tax surcharge (but standard land tax applies)</li>
      </ul>
      <p>
        Always check the current rates with the relevant state revenue office,
        as these surcharges have been increasing in recent years. For
        high-value properties, the annual land tax surcharge can amount to
        tens of thousands of dollars per year.
      </p>

      <h2 id="tax-implications">Tax implications for foreign property investors</h2>

      <h3>Rental income, withholding tax</h3>
      <p>
        Non-resident foreign investors who earn rental income from Australian
        property are subject to Australian tax:
      </p>
      <ul>
        <li>Non-residents pay tax at 32.5% on the first $135,000 of Australian-sourced income (2025 to 2026 rates), with no tax-free threshold available to non-residents.</li>
        <li>Rental expenses (interest, management fees, rates, insurance, depreciation) are still deductible, reducing the taxable rental income.</li>
        <li>You must lodge an Australian tax return each year you earn Australian income.</li>
        <li>Withholding agents (property managers) may be required to withhold tax from rent in some circumstances.</li>
      </ul>

      <h3>Capital Gains Tax (CGT)</h3>
      <p>When a foreign person sells Australian residential property:</p>
      <ul>
        <li>Australian CGT applies to the capital gain.</li>
        <li>Foreign residents are <strong>not entitled to the main residence exemption</strong> for the period they are a foreign resident (since 2020 reforms). This is a significant tax, you cannot exempt the gain on your &ldquo;home&rdquo; if you were a foreign resident during the ownership period.</li>
        <li>The 50% CGT discount is generally available to foreign residents only for the period they were an Australian tax resident. For non-residents, no discount applies to gains accrued while a non-resident.</li>
        <li><strong>Foreign Resident Capital Gains Withholding (FRCGW).</strong> For property sold above $750,000, the buyer must withhold 15% of the purchase price and remit it to the ATO unless the seller provides a clearance certificate.</li>
      </ul>

      <h3>FIRB notification on sale</h3>
      <p>
        If you bought under a FIRB approval with conditions, you may be
        required to notify FIRB when you sell. Check your approval conditions
        carefully.
      </p>

      <h2 id="structures">Using a company or trust</h2>
      <p>
        Some foreign buyers consider purchasing through an Australian company
        or discretionary trust for asset protection or tax planning reasons.
        Key points:
      </p>
      <ul>
        <li>An Australian company or trust becomes a foreign person for FIRB purposes if it is controlled by foreign persons, typically if a foreign person holds 20%+ (company) or 40%+ (trust).</li>
        <li>Buying through a structure does not exempt you from FIRB approval requirements or foreign-purchaser surcharges, the surcharges apply to the entity making the purchase if it is a foreign person.</li>
        <li>A structure may have advantages for estate planning, liability limitation, or income splitting, but these benefits must be weighed against the additional compliance costs (company fees, annual returns, separate tax returns).</li>
        <li>Self Managed Superannuation Funds (SMSFs) have separate rules, non-residents generally cannot be trustees or members of an SMSF investing in Australian property.</li>
      </ul>
      <p>
        Do not establish a corporate or trust structure without specific legal
        and tax advice.
      </p>

      <h2 id="practical-tips">Practical tips for foreign buyers</h2>
      <ul>
        <li><strong>Budget the full cost upfront.</strong> Add FIRB fees + foreign purchaser surcharge + standard stamp duty + conveyancing to your deposit. On a $1M property in NSW, this can easily total $130,000+.</li>
        <li><strong>Engage a solicitor experienced in foreign investment</strong> before making any offers. A general-practice solicitor may not be familiar with FIRB conditions and their implications.</li>
        <li><strong>Make contracts conditional on FIRB approval</strong> if you haven&rsquo;t obtained it before signing. Get the wording approved by your solicitor.</li>
        <li><strong>Allow at least 60 to 90 days from application to settlement</strong> when planning your purchase timeline.</li>
        <li><strong>Maintain Australian tax compliance.</strong> Lodge an Australian tax return each year you have Australian income.</li>
        <li><strong>Check your visa conditions.</strong> Some visa subclasses have additional restrictions on property ownership. Your migration agent can advise.</li>
        <li><strong>New dwellings only (for non-residents).</strong> Focus your search on off-the-plan apartments and new builds.</li>
      </ul>
    </GuideArticleLayout>
    </>
  );
}
