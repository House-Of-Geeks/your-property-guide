import type { Metadata } from "next";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Property Management Fees in Australia: What You'll Actually Pay (2026)",
  description:
    "Property manager fees in Australia broken down: management fee, letting fee, lease renewal, inspections, and the hidden charges to negotiate out. State-by-state ranges and a real-world annual example.",
  slug: "property-management-fees-australia",
  publishedAt: "2026-05-06",
  updatedAt: "2026-05-06",
  readingTimeMinutes: 8,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "investing",
};

export const metadata: Metadata = {
  title: `${FRONTMATTER.title} | ${SITE_NAME}`,
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
  "The headline management fee in Australia is typically 5% to 10% of weekly rent collected, with most capital cities sitting at 6% to 8%.",
  "On top of management, expect a letting fee (1 to 2 weeks rent), lease renewal fee ($150 to $300), routine inspection fee ($50 to $100 each), and admin charges.",
  "All-in, plan for 9% to 14% of annual rent going to property management once everything is added up.",
  "Cheaper isn't always better, a 5% manager who chases rent late and lets vacancies stretch out costs more than an 8% manager who keeps the property tenanted and well-maintained.",
  "The biggest savings come from negotiating out the small charges (statement fees, monthly admin) and asking for a discount on multiple-property portfolios, not from cutting the headline rate.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-they-do",       label: "What property managers actually do" },
  { id: "fee-types",          label: "The 8 fee types" },
  { id: "by-state",           label: "Typical fees by state" },
  { id: "annual-example",     label: "A real annual example" },
  { id: "negotiable",         label: "What's actually negotiable" },
  { id: "cheap-vs-good",      label: "Cheap isn't the same as good" },
  { id: "self-managing",      label: "Should you self-manage?" },
  { id: "next-steps",         label: "Next steps" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the average property management fee in Australia?",
    answer:
      "The headline management fee averages 6% to 8% of weekly rent across capital cities, with regional areas often higher (8% to 12%) because there are fewer competing managers. NSW and VIC tend to be at the lower end of the range; QLD, SA, and WA at the higher end. Add letting fees and ancillary charges and the all-in cost is typically 9% to 14% of annual rent.",
  },
  {
    question: "Is the property management fee tax deductible?",
    answer:
      "Yes. Property management fees are fully deductible against rental income in the same financial year for an investment property. The same applies to letting fees, lease renewal fees, inspection charges, and most ancillary admin fees, they're all costs of producing rental income.",
  },
  {
    question: "Can I negotiate the property management fee?",
    answer:
      "Yes, especially for higher-rent properties or multi-property portfolios. The headline rate is sometimes negotiable by 0.5% to 1.5%, and the small charges (statement fees, monthly admin, routine inspection fees) are often dropped entirely on request. Get three written quotes before signing.",
  },
  {
    question: "What's a letting fee?",
    answer:
      "A one-off charge when the manager finds and signs a new tenant, typically 1 to 2 weeks of rent. It covers advertising, applicant screening, contract preparation, and the ingoing inspection. You pay it each time tenants change, so high-turnover properties incur it more often.",
  },
  {
    question: "How often should I get routine inspections?",
    answer:
      "Most states limit routine inspections to one every 3 months (some states say 4 per year max). The manager typically charges $50 to $100 per inspection. Quarterly inspections are standard for residential investment properties; annual is too rare and risks issues going unnoticed.",
  },
  {
    question: "Can I switch property managers mid-tenancy?",
    answer:
      "Yes. The management agreement usually has a 30 to 60 day termination clause. You provide written notice; the outgoing manager hands over keys, files, and the bond authority transfer. The tenancy itself continues unchanged, the tenant's obligations don't reset.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Rental Yield Calculator", href: "/rental-yield-calculator", description: "Calculate gross and net rental yield with management fees factored in." },
  { title: "Negative Gearing in Australia", href: "/guides/negative-gearing-australia", description: "How property management fees flow through to your tax return." },
  { title: "Property Depreciation Guide", href: "/guides/property-depreciation-guide", description: "The other big deduction on your investment property." },
  { title: "House vs Apartment Investment", href: "/guides/house-vs-apartment-investment-australia", description: "How property management fits into the holding-cost picture." },
  { title: "Find an Expert", href: "/find-an-expert", description: "Looking for a property manager? Browse our network." },
];

export default function PropertyManagementFeesGuide() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="The headline rate is just the start">
        <p>
          Most quotes you&rsquo;ll get advertise the management percentage and
          stop there. The full picture is the management fee, plus the letting
          fee, plus 5 to 7 ancillary charges most managers don&rsquo;t mention
          upfront. We&rsquo;ll list them all below.
        </p>
      </Callout>

      <h2 id="what-they-do">What property managers actually do</h2>
      <p className="lead">
        A residential property manager handles the day-to-day operations of an
        investment property: finding tenants, collecting rent, coordinating
        repairs, conducting inspections, managing the bond, and handling
        disputes. The headline fee covers the rent collection and basic admin;
        most other tasks attract a separate charge.
      </p>

      <h2 id="fee-types">The 8 fee types you need to know</h2>

      <h3>1. Management fee</h3>
      <p>
        The headline percentage. Calculated on rent <em>collected</em>, not
        rent owed, so a vacancy means no fee for that period. Standard range:
        6% to 8% in capital cities, 7% to 12% regional.
      </p>

      <h3>2. Letting fee</h3>
      <p>
        Charged when a new tenant is signed. Covers advertising, screening,
        contract prep, ingoing inspection. Typical: 1 to 2 weeks of weekly
        rent. On a $600/week property, that&rsquo;s $600 to $1,200 each
        time tenants change.
      </p>

      <h3>3. Lease renewal fee</h3>
      <p>
        When the existing tenant renews for another fixed term, some managers
        charge $150 to $300 for paperwork. Others include it in the
        management fee. Easy to negotiate out at the contract stage.
      </p>

      <h3>4. Routine inspection fee</h3>
      <p>
        $50 to $100 per inspection, usually quarterly. Some managers
        bundle 2 free per year and charge for any extras.
      </p>

      <h3>5. Ingoing &amp; outgoing inspection</h3>
      <p>
        Detailed condition reports at the start and end of each tenancy. Often
        $200 to $400 each, sometimes bundled with the letting fee. These
        reports are critical for bond claims, so don&rsquo;t skip them.
      </p>

      <h3>6. Statement &amp; admin fees</h3>
      <p>
        Monthly or annual statement fees ($5 to $15/month). Annual financial
        year statement (often $40 to $100). EFT or postage fees per disbursement.
        Add up to $100 to $300/year and almost always negotiable.
      </p>

      <h3>7. Tribunal &amp; arrears</h3>
      <p>
        If the manager has to attend QCAT/NCAT/VCAT for a dispute, expect
        $100 to $200/hour plus filing fees. Arrears chasing is sometimes
        billed at a flat $50 to $100 after a notice is issued.
      </p>

      <h3>8. End-of-management fee</h3>
      <p>
        Some agreements include a fee to switch managers, often 1 to 2
        weeks of rent or a flat $200 to $500. Read the termination clause
        before signing.
      </p>

      <h2 id="by-state">Typical fees by state (2026)</h2>
      <ul>
        <li><strong>NSW (Sydney):</strong> 5.5% to 7% management; letting fee 1 to 2 weeks rent</li>
        <li><strong>VIC (Melbourne):</strong> 5.5% to 7.5% management; letting fee 1 to 2 weeks rent</li>
        <li><strong>QLD (Brisbane):</strong> 7% to 9% management; letting fee 1 week rent</li>
        <li><strong>WA (Perth):</strong> 8.5% to 11% management; letting fee 2 weeks rent (often higher headline rate but lower letting fee structure)</li>
        <li><strong>SA (Adelaide):</strong> 7% to 9% management; letting fee 1 to 1.5 weeks rent</li>
        <li><strong>TAS (Hobart):</strong> 7% to 10% management</li>
        <li><strong>ACT (Canberra):</strong> 6% to 8.5% management</li>
        <li><strong>NT (Darwin):</strong> 8% to 12% management</li>
      </ul>

      <KeyFigure
        value="9% to 14%"
        label="All-in property management cost as % of annual rent"
        context="Management fee + letting fee + ancillary charges, calculated over a typical 1 to 2 year tenant cycle."
      />

      <h2 id="annual-example">A real annual example</h2>
      <p>
        $600/week property in Brisbane, 7% management fee, tenant signed
        with 1-week letting fee, no turnover during the year:
      </p>
      <ul>
        <li>Annual rent: <strong>$31,200</strong></li>
        <li>Management fee (7%): $2,184</li>
        <li>Letting fee (1 week, prorated since signed mid-year): $300</li>
        <li>Routine inspections (4 × $80): $320</li>
        <li>Statement fees ($10/month): $120</li>
        <li>EOFY statement: $80</li>
        <li><strong>Total: $3,004 = 9.6% of annual rent</strong></li>
      </ul>
      <p>
        If the tenant moves out and a new one is signed, add another
        $600 letting fee plus $300 ingoing/outgoing inspection.
        That pushes the year&rsquo;s total to roughly 12% of rent.
      </p>

      <h2 id="negotiable">What&rsquo;s actually negotiable</h2>
      <ul>
        <li><strong>Headline management fee:</strong> 0.5% to 1.5% off the asking rate, especially on multi-property portfolios or high-rent properties.</li>
        <li><strong>Lease renewal fee:</strong> Almost always droppable.</li>
        <li><strong>Statement fees and admin:</strong> Almost always droppable.</li>
        <li><strong>Routine inspection fee:</strong> Sometimes droppable to 2 free / year.</li>
        <li><strong>Letting fee:</strong> Hardest to negotiate, but worth a try if you sign a 12-month exclusive agreement.</li>
        <li><strong>End-of-management fee:</strong> Push hard to remove this, it locks you in.</li>
      </ul>

      <Callout variant="warning" title="Get the full fee schedule in writing">
        <p>
          Always ask for the full fee schedule before signing the management
          agreement. If a manager is reluctant to put every charge on paper,
          take it as a signal about how transparent the rest of the relationship
          will be.
        </p>
      </Callout>

      <h2 id="cheap-vs-good">Cheap isn&rsquo;t the same as good</h2>
      <p>
        A 5% manager who lets rent slip into 14-day arrears, or a manager
        whose vacancies stretch from 1 week to 4 weeks, easily costs more
        than an 8% manager who keeps the property tenanted and chases late
        rent on day one.
      </p>
      <p>
        Ask each candidate manager for their average vacancy period (in
        days) and arrears rate (% of rent more than 7 days late). The good
        ones will tell you. The ones who can&rsquo;t are the ones to skip.
      </p>

      <h2 id="self-managing">Should you self-manage?</h2>
      <p>
        Self-management saves the management fee but requires you to learn
        your state&rsquo;s tenancy law, run the application screening, deal
        with maintenance calls at all hours, and represent yourself at the
        tenancy tribunal if it comes to that. It works for owners with one
        property nearby, time on their hands, and stomach for difficult
        conversations.
      </p>
      <p>
        For most investors, the time and risk reduction is worth the 8% to 12%.
      </p>

      <h2 id="next-steps">Next steps</h2>
      <ol>
        <li>
          Get three written fee schedules from local managers. Compare the
          all-in number, not just the headline percentage.
        </li>
        <li>
          Ask each candidate for their average vacancy days and arrears rate.
        </li>
        <li>
          Use the{" "}
          <a href="/rental-yield-calculator">Rental Yield Calculator</a> with
          the all-in cost (not just management %) to model true net yield.
        </li>
        <li>
          Read the management agreement&rsquo;s termination clause carefully -
          remove any fees for switching managers before signing.
        </li>
      </ol>
    </GuideArticleLayout>
  );
}
