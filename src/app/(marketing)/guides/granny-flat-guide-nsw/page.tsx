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
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Granny Flat Guide NSW: Rules, Costs & Rental Returns (2026)",
  description:
    "Everything you need to know about building a granny flat in NSW: complying development rules, build costs, rental income, and how to maximise your return.",
  slug: "granny-flat-guide-nsw",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 8,
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
  "NSW has the most streamlined granny flat approval pathway in Australia: complying development under the Low Rise Housing Diversity Code (formerly SEPP 2009), with approvals as fast as 10 to 20 days via a private certifier.",
  "Minimum lot size 450m², minimum lot width 12m, max secondary-dwelling floor area 60m².",
  "Build costs range from ~$100,000 (basic 1-bed) to $280,000+ (premium 60m² 2-bed). Prefab options can come in lower.",
  "Typical western Sydney rents of $350 to $500/week deliver gross yields of 12 to 15% on construction cost, well above standalone investment property yields.",
  "NSW does NOT require the owner to live on the property. Both dwellings can be rented out, making it attractive for pure investors.",
  "Granny flats can't be strata titled separately in NSW. They sell with the main property.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is",          label: "What is a granny flat in NSW?" },
  { id: "complying-dev",    label: "Complying development fast-track" },
  { id: "requirements",     label: "Site requirements and setbacks" },
  { id: "costs",            label: "Building costs" },
  { id: "prefab",           label: "Prefab and modular options" },
  { id: "rental-returns",   label: "Rental returns and yield" },
  { id: "approval-pathway", label: "CDC vs DA pathways" },
  { id: "owner-occupier",   label: "Owner-occupier requirement" },
  { id: "strata",           label: "Selling a granny flat separately" },
  { id: "finance",          label: "Financing your granny flat" },
  { id: "property-value",   label: "Impact on property value" },
];

const FAQS: FaqItem[] = [
  {
    question: "Do I need to live on the property to build a granny flat in NSW?",
    answer:
      "No. NSW doesn't impose an owner-occupier requirement on secondary dwellings. You can build a granny flat on an investment property and rent both dwellings, which is unusual compared to some other states.",
  },
  {
    question: "How fast can I get a granny flat approved in NSW?",
    answer:
      "If your site qualifies for complying development under the Low Rise Housing Diversity Code, a private certifier can issue the Complying Development Certificate (CDC) in roughly 10 to 20 days. If you need a council DA (e.g. heritage area, undersized lot), expect 2 to 6 months.",
  },
  {
    question: "What's the maximum size for a granny flat in NSW?",
    answer:
      "60m² of internal floor area for a secondary dwelling under the complying development code. Verandahs, balconies, and external storage typically don't count toward the 60m² cap, but check with your certifier.",
  },
  {
    question: "Can I sell the granny flat separately from the main house?",
    answer:
      "No. A granny flat in NSW can't be strata titled separately. It must be sold with the primary dwelling on the same lot. Some older properties have been formally subdivided which is a different scenario, check the title.",
  },
  {
    question: "What rental yield should I expect on a granny flat?",
    answer:
      "On a $160,000 all-in build with $450/week rent in western Sydney, gross yield is roughly 14.6%. After property management fees (8 to 10%), insurance, and maintenance, net yield typically lands in the 9 to 11% range, well above standalone investment property yields.",
  },
  {
    question: "Will adding a granny flat increase my property value?",
    answer:
      "In high-demand suburbs near transport and amenities, an approved tenanted granny flat can add 20 to 30% more value than the construction cost. In lower-demand areas the uplift may be closer to break-even. The addition can also make the property harder to sell to buyers wanting privacy and a large yard.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Granny Flat Guide VIC",       href: "/guides/granny-flat-guide-vic", description: "Victoria's secondary dwelling rules and Class 1a/SDA pathways." },
  { title: "Granny Flat Guide QLD",       href: "/guides/granny-flat-guide-qld", description: "Auxiliary dwellings and what's allowed in QLD." },
  { title: "Negative Gearing in Australia", href: "/guides/negative-gearing-australia", description: "Tax treatment of investment property and granny flat income." },
  { title: "Property Depreciation Guide",   href: "/guides/property-depreciation-guide", description: "Maximising deductions on a new granny flat build." },
  { title: "Rental Yield Calculator",     href: "/rental-yield-calculator",         description: "Model gross and net yield on your specific scenario." },
];

export default function GrannyFlatGuideNSWPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Verify before you commit">
        <p>
          Planning rules and costs vary significantly by council and site
          conditions. Always verify with your local council or a certifier before
          committing to a project.
        </p>
      </Callout>

      <Callout variant="info" title="NSW advantage">
        <p>
          NSW has the most streamlined granny flat approval pathway in Australia.
          Eligible properties can be approved as complying development in weeks,
          without a council DA.
        </p>
      </Callout>

      <h2 id="what-is">What is a granny flat in NSW?</h2>
      <p className="lead">
        In NSW, a granny flat is formally a <strong>secondary dwelling</strong>:
        a self-contained dwelling built on the same lot as an existing home (the
        primary dwelling), with its own separate entrance, kitchen, bathroom, and
        living area.
      </p>
      <p>
        Secondary dwellings are governed primarily by the <strong>Low Rise
        Housing Diversity Code</strong> (formerly the Affordable Rental Housing
        SEPP 2009). This state-wide code allows granny flats to be approved as
        complying development on eligible lots, bypassing the need for a council
        DA in most cases.
      </p>
      <p>
        The secondary dwelling must be <strong>subordinate</strong> to the main
        dwelling, it can't be larger or more prominent than the primary home.
      </p>

      <h2 id="complying-dev">Complying development, NSW's fast-track approval</h2>
      <p>
        NSW is unique in having a state-wide complying development pathway for
        granny flats. Under the Low Rise Housing Diversity Code, granny flats
        meeting the criteria can be approved in <strong>10 to 20 days</strong> by
        a private certifier, without going through council.
      </p>

      <KeyFigure
        value="10–20 days"
        label="Typical CDC approval time for an eligible NSW secondary dwelling."
        context="A council DA can take 2 to 6 months"
      />

      <p>To qualify as complying development, a secondary dwelling must:</p>
      <ul>
        <li>Be located on a residential lot</li>
        <li>Meet the minimum lot size and width requirements (see below)</li>
        <li>Not exceed <strong>60m²</strong> of floor area</li>
        <li>Meet setback and height requirements</li>
        <li>Have separate access</li>
      </ul>
      <p>
        If your site doesn't meet these criteria, you may still be able to build
        a granny flat through a council DA, but it takes longer and costs more.
      </p>

      <h2 id="requirements">Site requirements and setbacks</h2>
      <p>Minimum site requirements for complying development:</p>
      <ul>
        <li><strong>Lot size:</strong> Minimum <strong>450m²</strong> for a detached secondary dwelling</li>
        <li><strong>Lot width:</strong> At least <strong>12 metres</strong></li>
        <li><strong>Only one secondary dwelling</strong> per residential lot</li>
      </ul>
      <p>Typical setback requirements for a detached granny flat:</p>
      <ul>
        <li><strong>Rear setback:</strong> Minimum 3 metres</li>
        <li><strong>Side setback:</strong> Minimum 0.9 metres (varies by lot size and height)</li>
        <li><strong>Height:</strong> Maximum 8.5 metres (often limited further by zone and council)</li>
      </ul>
      <p>
        Individual councils can have additional requirements alongside the state
        code. Check with a certifier or council before finalising a design.
      </p>

      <h2 id="costs">Building costs</h2>
      <p>
        Cost depends heavily on size, finish, and site conditions. Rough ranges
        for 2025 to 2026:
      </p>

      <table>
        <thead>
          <tr><th>Type</th><th>Size</th><th>Estimated cost</th></tr>
        </thead>
        <tbody>
          <tr><td>Studio / 1 bed (basic)</td><td>30 to 40m²</td><td>$100,000 to $150,000</td></tr>
          <tr><td>1 to 2 bed (mid-range)</td><td>45 to 55m²</td><td>$150,000 to $200,000</td></tr>
          <tr><td>2 bed (full 60m², premium)</td><td>55 to 60m²</td><td>$200,000 to $280,000+</td></tr>
        </tbody>
      </table>

      <p>Additional costs to budget for:</p>
      <ul>
        <li>Certifier fees: $2,000 to $5,000</li>
        <li>Site preparation (demolition, earthworks): $5,000 to $30,000+ depending on slope and access</li>
        <li>Utility connections (power, water, sewer): $5,000 to $20,000</li>
        <li>Landscaping and fencing: $3,000 to $15,000</li>
      </ul>

      <h2 id="prefab">Prefab and modular options</h2>
      <p>
        Prefab/modular granny flats are a popular alternative to traditional
        construction. They're built off-site and craned into position, often 6 to
        12 weeks from order to installation.
      </p>
      <ul>
        <li><strong>Supply and install (basic):</strong> $80,000 to $120,000</li>
        <li><strong>Supply and install (premium):</strong> $120,000 to $180,000+</li>
      </ul>
      <p>
        Those prices typically include structure, fit-out, and installation but
        exclude site prep and utility connections. Get at least 3 quotes and check
        track record, quality varies significantly.
      </p>

      <h2 id="rental-returns">Rental returns and yield</h2>
      <p>
        Granny flats can generate strong rental income, particularly in Sydney
        and regional NSW.
      </p>
      <ul>
        <li><strong>Sydney metro (western suburbs):</strong> $350 to $500/week for a 1 to 2 bed flat</li>
        <li><strong>Sydney metro (inner/northern suburbs):</strong> $450 to $700/week</li>
        <li><strong>Regional NSW (larger centres):</strong> $250 to $400/week</li>
      </ul>
      <p>
        A worked example: $160,000 construction cost (all-in), $450/week rent in
        western Sydney:
      </p>
      <ul>
        <li>Annual rent: $450 × 52 = $23,400</li>
        <li>Gross yield on construction: $23,400 ÷ $160,000 = <strong>14.6%</strong></li>
      </ul>
      <p>
        That's gross. Deduct property management (8 to 10%), insurance, and
        maintenance for a net figure. Even so, granny flat yields often
        substantially exceed standalone investment property yields. Use our{" "}
        <Link href="/rental-yield-calculator">rental yield calculator</Link> to
        model your scenario.
      </p>

      <h2 id="approval-pathway">Approval pathways, CDC vs DA</h2>
      <ol>
        <li>
          <strong>CDC (Complying Development Certificate)</strong> via a private
          certifier. Fastest and cheapest where eligible. 10 to 20 days. No
          community consultation. Certifier fees $2,000 to $5,000.
        </li>
        <li>
          <strong>DA (Development Application)</strong> via local council.
          Required where CDC criteria aren't met (heritage areas, flood-affected,
          undersized lots). 2 to 6 months. Higher cost, less predictable outcome.
        </li>
      </ol>
      <p>
        CDC is almost always preferable where eligible. Engage a certifier early.
      </p>

      <h2 id="owner-occupier">Owner-occupier requirement</h2>
      <p>
        <strong>NSW does not require the owner to live on the property</strong>{" "}
        to build or rent a granny flat. This makes NSW secondary dwellings
        attractive as pure investment properties, you can build on an investment
        property and rent both dwellings.
      </p>
      <p>
        This differs from some other states and councils. Always verify with your
        council or certifier.
      </p>

      <h2 id="strata">Can you sell a granny flat separately?</h2>
      <p>
        In NSW, a granny flat <strong>cannot be strata titled separately</strong>{" "}
        and sold as a standalone property. The secondary dwelling forms part of
        the same lot as the primary dwelling and must be sold with it.
      </p>
      <p>
        Some older properties may have been formally subdivided into separate
        lots, which is different from a modern secondary dwelling. Check your
        title if unsure.
      </p>

      <h2 id="finance">Financing your granny flat</h2>
      <ul>
        <li>
          <strong>Equity release / redraw from existing mortgage:</strong>{" "}
          Typically the cheapest option if you have equity. Your lender may
          increase your mortgage to fund construction.
        </li>
        <li>
          <strong>Construction loan:</strong> A separate loan with funds drawn
          progressively as building milestones are reached. Typically requires a
          fixed-price building contract.
        </li>
        <li>
          <strong>Personal loan:</strong> Suitable for smaller projects but
          carries a higher rate than secured options.
        </li>
      </ul>
      <p>
        Talk to a mortgage broker before committing, the financing structure
        materially affects your total cost.
      </p>

      <h2 id="property-value">Impact on property value</h2>
      <p>
        A well-built, self-contained granny flat typically adds significant value
        to a residential property. In good locations (close to transport,
        amenities), the added value often <strong>exceeds the construction
        cost</strong>.
      </p>
      <ul>
        <li>20% to 30% more in value than build cost (in high-demand suburbs)</li>
        <li>Closer to cost price in lower-demand areas</li>
      </ul>
      <p>
        Buyers seeking rental income or multigenerational living will pay a
        premium for an approved, tenanted secondary dwelling. The addition can
        make the property harder to sell to buyers seeking privacy (smaller
        backyard). Get a professional valuation before and after construction to
        understand the full picture.
      </p>
    </GuideArticleLayout>
  );
}
