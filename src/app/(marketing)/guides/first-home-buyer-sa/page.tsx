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
  title: "First Home Buyer Guide South Australia: Grants, Stamp Duty & Schemes (2026)",
  description:
    "Complete guide for first home buyers in South Australia: $15,000 FHOG, stamp duty rules, First Home Guarantee, HomeSeeker SA shared equity, and off-the-plan concessions.",
  slug: "first-home-buyer-sa",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 9,
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
  "SA's FHOG is $15,000 on new homes only, capped at $650,000 contract price.",
  "SA does NOT offer a stamp duty exemption or concession for first home buyers on established homes, the FHOG is the main FHB-specific concession.",
  "On a $600,000 home, SA stamp duty is roughly $26,830, a significant upfront cost to factor into your savings target.",
  "Federal schemes (FHBG, Family Home Guarantee, Help to Buy) work in SA with price caps of $600K Adelaide and $450K regional.",
  "HomeSeeker SA is a state shared-equity scheme; availability changes per round, check the SA Housing Authority before relying on it.",
  "SA's off-the-plan stamp duty concession can deliver meaningful savings on apartment purchases, not exclusive to first home buyers.",
];

const TOC: GuideTOCEntry[] = [
  { id: "fhog",          label: "First Home Owner Grant SA" },
  { id: "stamp-duty",    label: "Stamp duty in South Australia" },
  { id: "federal-schemes", label: "Federal government schemes" },
  { id: "homeseeker",    label: "HomeSeeker SA shared equity" },
  { id: "off-the-plan",  label: "Off-the-plan stamp duty concession" },
  { id: "eligibility",   label: "Who is eligible?" },
  { id: "steps",         label: "Step-by-step buying in SA" },
  { id: "resources",     label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Does SA have a stamp duty exemption for first home buyers?",
    answer:
      "No. Unlike NSW and VIC, South Australia doesn't offer a stamp duty exemption or concession specifically for first home buyers on established homes. The $15,000 FHOG (new homes only) is SA's primary first-home-buyer concession. The off-the-plan apartment concession is available but it's not exclusive to first home buyers.",
  },
  {
    question: "What's the price cap for the SA FHOG?",
    answer:
      "$650,000 contract price (or combined land + build value). One dollar over the cap and you lose the entire grant. With Adelaide's recent price growth, plenty of new builds sit above this cap, so plan around it carefully.",
  },
  {
    question: "Is the SA FHOG available on established homes?",
    answer:
      "No. The grant only applies to new homes (never previously occupied or sold as a residence), owner-builder new homes, and some substantially renovated dwellings. If you buy an established home in SA, no grant applies and you pay full stamp duty.",
  },
  {
    question: "How does HomeSeeker SA shared equity work?",
    answer:
      "The state government co-invests in your home in exchange for a proportional equity share. You don't pay rent on the government's share. You can buy out the government's share over time. Income and property value thresholds apply, and rounds open and close periodically, confirm current availability with the SA Housing Authority before relying on it.",
  },
  {
    question: "What's the cooling-off period in SA?",
    answer:
      "2 clear business days from the date you receive a copy of the contract. There's no cooling-off period at auction. The cooling-off period in SA is shorter than NSW (5 days) or QLD (5 days), so move fast on contract review.",
  },
  {
    question: "Can I combine the FHOG with the federal First Home Guarantee?",
    answer:
      "Yes, on a new home under both caps ($650K FHOG cap and $600K Adelaide / $450K regional FHBG cap). Adding the First Home Super Saver Scheme on top can let eligible buyers stack the federal scheme + state grant + tax-advantaged super deposit, materially reducing your savings target.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide", description: "Federal schemes, FHOG by state, and step-by-step buying process." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",          description: "Estimate your SA conveyance duty in seconds." },
  { title: "Conveyancing in Australia",         href: "/guides/conveyancing-guide",      description: "What conveyancers do, what they cost, and what to ask." },
  { title: "Lenders Mortgage Insurance",        href: "/guides/lenders-mortgage-insurance-guide", description: "What LMI costs and the schemes that waive it." },
  { title: "Borrowing Power Calculator",        href: "/borrowing-power-calculator",     description: "Estimate how much you can borrow before you start searching." },
];

const STEPS = [
  { step: "1", title: "Calculate your budget", desc: "Use a borrowing power calculator. Account for stamp duty, legal fees ($1,500 to $2,500), building inspections, and moving costs on top of the deposit." },
  { step: "2", title: "Check eligibility for grants and schemes", desc: "Confirm eligibility for the FHOG ($15,000 on new homes under $650,000), First Home Guarantee (5% deposit, no LMI), and FHSSS. A broker can assess the right combination." },
  { step: "3", title: "Get pre-approval", desc: "Conditional pre-approval gives you a clear budget and shows sellers you're serious." },
  { step: "4", title: "Search for properties", desc: "For the FHOG, focus on new builds and house-and-land packages under $650,000. For established homes you can still use the federal FHBG." },
  { step: "5", title: "Arrange conveyancing", desc: "Engage an SA-licensed conveyancer or solicitor to review the contract, do title searches, and manage settlement." },
  { step: "6", title: "Apply for the FHOG", desc: "Apply through your lender (approved agent) or directly with RevenueSA before settlement." },
  { step: "7", title: "Settlement", desc: "Your conveyancer manages settlement; the FHOG is typically received at settlement and applied to purchase costs." },
];

export default function FirstHomeBuyerSAPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Verify with RevenueSA before relying on these figures">
        <p>
          Grant amounts and eligibility criteria change. Always verify current
          details with{" "}
          <a href="https://www.revenuesa.sa.gov.au" target="_blank" rel="noopener noreferrer">
            RevenueSA
          </a>{" "}
          or a licensed mortgage broker before signing a contract.
        </p>
      </Callout>

      <EditorNote>
        <p>
          South Australia is the odd one out on stamp duty. There is no
          general first-home-buyer exemption or concession on established
          homes, which most buyers from the east coast assume exists.
          Plan on paying full duty unless you&rsquo;re buying new or
          off-the-plan. The $15K FHOG is the main FHB-specific lever
          here, and the off-the-plan concession quietly does more
          financial work than it gets credit for. Run the duty number on
          a calculator before you set your savings target.
        </p>
      </EditorNote>

      <h2 id="fhog">First Home Owner Grant, South Australia</h2>
      <p className="lead">
        South Australia offers a $15,000 First Home Owner Grant for eligible first
        home buyers purchasing or building a new home. The grant is administered by
        RevenueSA and funded by the South Australian Government.
      </p>

      <KeyFigure
        value="$15,000"
        label="The SA First Home Owner Grant on new homes up to $650,000."
        context="Established homes do not qualify"
      />

      <p>The FHOG applies to new homes only. A "new home" includes:</p>
      <ul>
        <li>A newly built home that has not been previously occupied or sold as a place of residence</li>
        <li>A home built by you (owner-builder) for the first time</li>
        <li>Substantially renovated homes may qualify in some circumstances (check with RevenueSA)</li>
      </ul>
      <p>
        The contract price (or total value of construction plus land) must not
        exceed <strong>$650,000</strong>. If you're buying land separately and
        building, the combined value of land + build contract must fall within
        the cap.
      </p>
      <p>
        The grant is generally paid at settlement for off-the-plan or completed
        new homes, or at the first progress payment for construction loans. Your
        lender can often apply on your behalf as an approved agent.
      </p>

      <h2 id="stamp-duty">Stamp duty in South Australia</h2>
      <p>
        Unlike NSW and VIC, <strong>South Australia does not offer a stamp duty
        exemption or concession specifically for first home buyers</strong> on
        established properties. The FHOG (new homes only) is SA's primary
        first-home-buyer concession.
      </p>
      <p>
        Stamp duty (called "conveyance duty" in SA) is calculated on a sliding
        scale based on the property value:
      </p>

      <table>
        <thead>
          <tr><th>Property value</th><th>Duty rate</th></tr>
        </thead>
        <tbody>
          <tr><td>$0 to $12,000</td><td>$1.00 per $100</td></tr>
          <tr><td>$12,001 to $30,000</td><td>$120 + $2.00 per $100 over $12,000</td></tr>
          <tr><td>$30,001 to $50,000</td><td>$480 + $3.00 per $100 over $30,000</td></tr>
          <tr><td>$50,001 to $100,000</td><td>$1,080 + $3.50 per $100 over $50,000</td></tr>
          <tr><td>$100,001 to $200,000</td><td>$2,830 + $4.00 per $100 over $100,000</td></tr>
          <tr><td>$200,001 to $250,000</td><td>$6,830 + $4.25 per $100 over $200,000</td></tr>
          <tr><td>$250,001 to $300,000</td><td>$8,955 + $4.75 per $100 over $250,000</td></tr>
          <tr><td>$300,001 to $500,000</td><td>$11,330 + $5.00 per $100 over $300,000</td></tr>
          <tr><td>Over $500,000</td><td>$21,330 + $5.50 per $100 over $500,000</td></tr>
        </tbody>
      </table>

      <p>
        On a $600,000 home, SA conveyance duty is roughly $26,830, a significant
        upfront cost to factor in alongside your deposit. Use our{" "}
        <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link> for your
        exact figure.
      </p>

      <h2 id="federal-schemes">Federal government schemes</h2>
      <p>
        First home buyers in SA can also access federal schemes through Housing
        Australia.
      </p>

      <h3>First Home Guarantee (formerly FHLDS)</h3>
      <p>
        The First Home Guarantee allows eligible first home buyers to purchase
        with as little as a 5% deposit, with the government guaranteeing up to 15%
        of the loan, no LMI required. SA price caps:
      </p>
      <ul>
        <li><strong>Adelaide (metro):</strong> $600,000</li>
        <li><strong>Regional SA:</strong> $450,000</li>
      </ul>
      <p>
        Income caps: $125,000 single / $200,000 couple. Places are limited each
        financial year and allocated first-come, first-served. Apply through a
        participating lender.
      </p>

      <h3>First Home Super Saver Scheme (FHSSS)</h3>
      <p>
        The FHSSS lets you make voluntary super contributions of up to $15,000 per
        year (up to $50,000 total) and then withdraw these (plus associated
        earnings) as a home deposit. The tax advantage comes from contributions
        being taxed at 15% rather than your marginal rate.
      </p>

      <h3>Help to Buy (shared equity)</h3>
      <p>
        The federal Help to Buy scheme (government takes up to 40% equity in a new
        home / 30% in existing) has been legislated. Check the current rollout and
        SA-specific details on the Housing Australia site.
      </p>

      <h2 id="homeseeker">HomeSeeker SA, state shared equity</h2>
      <p>
        South Australia has run HomeSeeker SA, a shared equity scheme aimed at
        helping lower-to-moderate income earners buy. The state co-invests in your
        property, reducing the size of your mortgage and the deposit you need.
      </p>
      <p>
        Availability and eligibility have changed over time, with rounds being
        fully subscribed. Check the current status with the SA Housing Authority
        (housing.sa.gov.au) before planning around this scheme.
      </p>
      <p>Typical features of shared equity programs:</p>
      <ul>
        <li>Government takes a share of the property proportional to its equity contribution</li>
        <li>You pay no rent on the government's share (unlike some other schemes)</li>
        <li>You can buy out the government's share over time</li>
        <li>Income and property value thresholds apply</li>
      </ul>

      <h2 id="off-the-plan">Off-the-plan stamp duty concession</h2>
      <p>
        SA offers a stamp duty concession for off-the-plan apartment purchases,
        primarily targeting CBD and inner-city developments. This concession
        reduces the duty payable on eligible off-the-plan apartment contracts,
        making high-density new developments more accessible.
      </p>
      <ul>
        <li>Applies to apartments purchased off-the-plan (before construction is complete)</li>
        <li>Duty is assessed on the value at contract, not at completion</li>
        <li>Significant savings if values rise between contract and settlement</li>
        <li>Not exclusive to first home buyers, applies more broadly</li>
      </ul>
      <p>
        Verify the current scope with RevenueSA, as these concessions are
        periodically reviewed.
      </p>

      <h2 id="eligibility">Who is eligible for the SA FHOG?</h2>
      <p>To be eligible, all applicants must:</p>
      <ul>
        <li>Be an Australian citizen or permanent resident</li>
        <li>Be 18 years or older</li>
        <li>Have never previously owned residential property in Australia used as a place of residence</li>
        <li>Occupy the property as a principal place of residence for at least 6 continuous months, starting within 12 months of settlement or construction completion</li>
        <li>Purchase or build a new home with a contract price not exceeding $650,000</li>
      </ul>
      <p>
        All parties must satisfy the criteria, unless they are a spouse or de
        facto partner of an eligible applicant.
      </p>

      <h2 id="steps">Step-by-step, buying your first home in SA</h2>
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
          <strong>RevenueSA</strong>, FHOG and stamp duty:{" "}
          <a href="https://www.revenuesa.sa.gov.au" target="_blank" rel="noopener noreferrer">revenuesa.sa.gov.au</a>
        </li>
        <li>
          <strong>Consumer and Business Services SA</strong>, property and conveyancing info:{" "}
          <a href="https://www.cbs.sa.gov.au" target="_blank" rel="noopener noreferrer">cbs.sa.gov.au</a>
        </li>
        <li>
          <strong>SA Housing Authority</strong>, HomeSeeker SA and shared equity:{" "}
          <a href="https://www.housing.sa.gov.au" target="_blank" rel="noopener noreferrer">housing.sa.gov.au</a>
        </li>
        <li>
          <strong>Housing Australia</strong>, First Home Guarantee and federal schemes:{" "}
          <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer">housingaustralia.gov.au</a>
        </li>
        <li>
          <strong>PlanSA</strong>, planning and development:{" "}
          <a href="https://www.plan.sa.gov.au" target="_blank" rel="noopener noreferrer">plan.sa.gov.au</a>
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
