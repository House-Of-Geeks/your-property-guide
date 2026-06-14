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
  title: "Granny Flat Guide South Australia: Rules, Costs & Planning (2026)",
  description:
    "Building a secondary dwelling in SA: Planning and Design Code, complying development pathway, lot sizes, costs $100K to $180K, owner-occupier rule, and PlanSA portal.",
  slug: "granny-flat-guide-sa",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 9,
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
  "SA introduced a consolidated Planning and Design Code in 2021. Most residential zones treat compliant secondary dwellings as 'complying development', no DA, no public consultation.",
  "Minimum lot size 250m² in the General Neighbourhood Zone (one of the most flexible in Australia).",
  "Maximum secondary dwelling floor area is 60m² for complying development. Larger requires performance assessment (40 to 60 business days).",
  "Owner-occupier rule: one of the two dwellings must be owner-occupied. SA does NOT allow purely investment dual-occupancy.",
  "Total build cost typically $100,000 to $180,000+ (design, fees, site works, construction, landscaping).",
  "Adelaide rental market is tight; inner-suburb secondary dwellings rent for $350 to $500/week, supporting strong yields on lower SA property prices.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is",              label: "What is a secondary dwelling in SA?" },
  { id: "planning-code",        label: "SA Planning and Design Code" },
  { id: "complying-development",label: "Complying development pathway" },
  { id: "zones",                label: "Zones and lot size requirements" },
  { id: "owner-occupier",       label: "Owner-occupier requirement" },
  { id: "approval-process",     label: "Approval process" },
  { id: "costs",                label: "Costs of building in SA" },
  { id: "rental-market",        label: "Adelaide rental market" },
  { id: "tips",                 label: "Practical tips" },
  { id: "resources",            label: "Resources" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can I rent out both dwellings on the lot in SA?",
    answer:
      "Generally no. SA's owner-occupier rule typically requires one of the two dwellings to be owner-occupied. The condition is attached to the development approval and runs with the land, so it applies to subsequent owners too. Limited exceptions exist in certain zones, confirm via PlanSA or a planning consultant.",
  },
  {
    question: "Is SA's 250m² minimum lot really the most flexible in Australia?",
    answer:
      "It's among the most flexible. NSW requires 450m² for complying development, BCC requires 600m² (detached). SA's 250m² threshold in the General Neighbourhood Zone makes secondary dwellings viable on smaller inner-Adelaide lots that wouldn't qualify in other states.",
  },
  {
    question: "What's the difference between complying and performance assessed?",
    answer:
      "Complying development meets all the specified criteria (lot size, floor area, setbacks, site coverage) and is approved as of right with no public notification, often within days to weeks. Performance assessed development departs from one or more criteria, requires a Development Application, takes 40 to 60 business days, and has a discretionary outcome.",
  },
  {
    question: "Do I have to use PlanSA?",
    answer:
      "Yes, the PlanSA portal is the lodgement system for all development applications in SA, plus the source of zoning maps and the Planning and Design Code. Always check PlanSA for your zone before engaging a designer.",
  },
  {
    question: "What's the maximum size for an SA secondary dwelling?",
    answer:
      "60m² for complying development in most residential zones. Larger dwellings require performance assessment, which is slower and discretionary. 60m² is enough for a comfortable 1 to 2 bedroom layout.",
  },
  {
    question: "Should I use a private certifier or council for building consent?",
    answer:
      "Either works. Private certifiers often have faster turnaround. Building consent verifies compliance with the National Construction Code and is separate from planning approval, you need both.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Granny Flat Guide NSW",         href: "/guides/granny-flat-guide-nsw", description: "Compare to NSW's CDC pathway." },
  { title: "Granny Flat Guide VIC",         href: "/guides/granny-flat-guide-vic", description: "Victoria's slower planning permit process." },
  { title: "Granny Flat Guide QLD",         href: "/guides/granny-flat-guide-qld", description: "QLD's code-assessable approach and tight rental market." },
  { title: "Property Depreciation Guide",   href: "/guides/property-depreciation-guide", description: "Maximising deductions on a new build." },
  { title: "Renter's Rights in SA",         href: "/guides/renters-rights-sa", description: "Tenant entitlements when you rent the dwelling out." },
];

const STEPS = [
  { step: "1", title: "Check PlanSA for your zone", desc: "Use the mapping tool to confirm your zone and the applicable complying criteria." },
  { step: "2", title: "Engage a designer", desc: "Architect, building designer, or draftsperson familiar with the Planning and Design Code. Ensure design meets all complying criteria." },
  { step: "3", title: "Development approval (planning consent)", desc: "Lodge via the PlanSA portal. Complying: days to weeks. Performance assessed: 40 to 60 business days." },
  { step: "4", title: "Building consent", desc: "Separate consent via your council or a registered private certifier. Verifies compliance with the NCC." },
  { step: "5", title: "Construction", desc: "Once both approvals are in hand, build. Inspections required at footings, frame, waterproofing, completion." },
  { step: "6", title: "Certificate of Occupancy", desc: "Issued by the certifier once the building passes all inspections." },
];

export default function GrannyFlatGuideSAPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Verify with PlanSA before you commit">
        <p>
          SA planning rules vary by zone and are updated periodically. Always
          confirm requirements with the relevant planning authority and the{" "}
          <a href="https://www.plan.sa.gov.au" target="_blank" rel="noopener noreferrer">
            PlanSA portal
          </a>{" "}
          before proceeding.
        </p>
      </Callout>

      <h2 id="what-is">What is a secondary dwelling in SA?</h2>
      <p className="lead">
        In SA, what most people call a "granny flat" is officially a{" "}
        <strong>secondary dwelling</strong> or <strong>ancillary
        accommodation</strong> under the SA Planning and Design Code. It's a
        self-contained dwelling on the same allotment as a primary residence,
        typically for a family member or as a rental.
      </p>
      <p>
        SA introduced a consolidated <strong>Planning and Design Code (PDC)</strong>{" "}
        in 2021, replacing the previous suite of Development Plans. The PDC
        provides a state-wide framework, with zone-specific rules governing what
        can be built and the approval pathway.
      </p>
      <p>
        Secondary dwellings can be approved as <em>complying development</em>{" "}
        (fast-track, no public consultation) or via a Development Application,
        depending on whether the proposal meets all complying criteria.
      </p>

      <h2 id="planning-code">SA Planning and Design Code</h2>
      <p>
        The Planning and Design Code is SA's central planning document, accessed
        via the PlanSA portal. It classifies land into zones and overlays, and
        specifies what's "accepted" (no approval needed), "complying" (approved
        as of right if criteria met), or "performance assessed" (DA required
        against performance outcomes).
      </p>
      <p>
        For secondary dwellings, most residential zones treat them as complying
        development when the proposal meets the criteria, primarily lot size,
        floor area, setbacks, and site coverage.
      </p>
      <p>
        Use the PlanSA map (plan.sa.gov.au) to look up the zone of your specific
        property and check the rules.
      </p>

      <h2 id="complying-development">Complying development pathway</h2>
      <p>
        The complying pathway lets eligible secondary dwellings be approved
        without a full DA, saving time and cost.
      </p>
      <ul>
        <li>The proposal must meet all specified complying criteria</li>
        <li>A private certifier or relevant planning authority grants approval</li>
        <li>No public notification or council discretion, assessed as of right</li>
        <li>A separate building consent (planning approval ≠ building consent) is still required</li>
      </ul>
      <p>
        If your proposal doesn't meet all criteria (e.g. lot slightly under
        minimum size), it shifts to performance assessment, 40 to 60 business
        days, discretionary outcome.
      </p>

      <h2 id="zones">Zones and lot size requirements</h2>
      <p>
        Key parameters for complying secondary dwellings in the General
        Neighbourhood Zone (the most common residential zone in Adelaide):
      </p>

      <table>
        <thead>
          <tr>
            <th>Criterion</th>
            <th>Typical requirement (General Neighbourhood Zone)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Minimum lot size</td><td>≥ 250m² (verify current threshold)</td></tr>
          <tr><td>Maximum secondary dwelling floor area</td><td>60m² (verify current threshold)</td></tr>
          <tr><td>Primary dwelling must be retained</td><td>Yes, can't demolish the main house</td></tr>
          <tr><td>Side and rear setbacks</td><td>Minimum 0.9m to 1.0m (zone dependent)</td></tr>
          <tr><td>Maximum site coverage</td><td>Zone dependent, typically 60 to 70%</td></tr>
        </tbody>
      </table>

      <p>
        These apply to the General Neighbourhood Zone. Other zones (Suburban
        Neighbourhood, Urban Corridor, Master Planned Neighbourhood) may have
        different thresholds. Always verify on PlanSA before designing.
      </p>

      <KeyFigure
        value="250m²"
        label="SA's minimum lot size for a complying secondary dwelling, among the most flexible in Australia."
        context="NSW: 450m². Brisbane (detached): 600m²."
      />

      <h2 id="owner-occupier">Owner-occupier requirement</h2>
      <p>
        In most cases SA planning requires that <strong>one of the two
        dwellings on the allotment must be owner-occupied</strong>. You can't
        purchase a property as a pure investment and rent both the main house
        and the secondary dwelling.
      </p>
      <p>
        The owner-occupier condition is attached to the development approval and
        runs with the land, so it applies to subsequent owners too. Breaching it
        is a planning offence.
      </p>
      <p>
        Limited exceptions exist in certain zones or council areas, always
        confirm via PlanSA or your planning consultant.
      </p>

      <h2 id="approval-process">Approval process</h2>
      <p>
        Two stages: planning approval (development approval) and building
        consent.
      </p>
      <ol>
        {STEPS.map((s) => (
          <li key={s.step}>
            <strong>{s.title}.</strong> {s.desc}
          </li>
        ))}
      </ol>

      <h2 id="costs">Costs of building a granny flat in SA</h2>
      <p>
        SA build costs are broadly similar to other states, with labour
        generally slightly lower than NSW or VIC.
      </p>

      <table>
        <thead>
          <tr><th>Item</th><th>Typical cost range</th></tr>
        </thead>
        <tbody>
          <tr><td>Design and documentation</td><td>$3,000 to $7,000</td></tr>
          <tr><td>Planning and building consent fees</td><td>$1,500 to $4,000</td></tr>
          <tr><td>Site works (slab, services, drainage)</td><td>$10,000 to $35,000</td></tr>
          <tr><td>Construction (45 to 60m² secondary dwelling)</td><td>$80,000 to $140,000</td></tr>
          <tr><td>Landscaping and fencing</td><td>$4,000 to $12,000</td></tr>
          <tr><td><strong>Total estimated cost</strong></td><td><strong>$100,000 to $180,000+</strong></td></tr>
        </tbody>
      </table>

      <p>
        Modular and prefabricated options from SA-based suppliers sit at the
        lower end of this range. Ensure NCC compliance and SA certifications.
      </p>

      <h2 id="rental-market">Adelaide rental market</h2>
      <p>
        Adelaide vacancy rates have hit historic lows since 2021, supporting
        strong demand for ancillary dwellings across the metro area.
      </p>
      <p>Typical weekly rents for a 1 to 2 bedroom secondary dwelling in 2026:</p>
      <ul>
        <li>Inner Adelaide (2 to 5km from CBD): <strong>$350 to $500/week</strong></li>
        <li>Eastern suburbs: <strong>$370 to $480/week</strong></li>
        <li>Northern and southern suburbs: <strong>$280 to $400/week</strong></li>
      </ul>
      <p>
        Adelaide's lower property prices versus Sydney and Melbourne mean
        construction is a higher proportion of overall value, but the tight
        rental market and strong yields still make secondary dwellings
        compelling for owner-occupier investors.
      </p>

      <h2 id="tips">Practical tips</h2>
      <ul>
        <li><strong>Use PlanSA first:</strong> The portal is the definitive source for your zone, applicable rules, and lodgement. Start here before engaging a designer.</li>
        <li><strong>Private certifier vs council:</strong> Building consents can go either way. Private certifiers often have faster turnaround.</li>
        <li><strong>Energy efficiency:</strong> New dwellings must comply with NCC energy efficiency (NatHERS 7-star equivalent). Build it into the design from day one.</li>
        <li><strong>Depreciation:</strong> A new dwelling offers maximum tax depreciation. Engage a quantity surveyor for a depreciation schedule, see our <Link href="/guides/property-depreciation-guide">Property Depreciation Guide</Link>.</li>
        <li><strong>Separate metering:</strong> Have the secondary dwelling separately metered for electricity and water. Simplifies rent calc and prevents disputes.</li>
      </ul>

      <h2 id="resources">Resources</h2>
      <ul>
        <li>
          <strong>PlanSA</strong>, planning portal, zoning maps, and DAs:{" "}
          <a href="https://www.plan.sa.gov.au" target="_blank" rel="noopener noreferrer">plan.sa.gov.au</a>
        </li>
        <li>
          <strong>SA Building Technical Standards</strong>, building consent info:{" "}
          <a href="https://www.sa.gov.au/building" target="_blank" rel="noopener noreferrer">sa.gov.au/building</a>
        </li>
        <li>
          <strong>Consumer and Business Services SA</strong>, property and building:{" "}
          <a href="https://www.cbs.sa.gov.au" target="_blank" rel="noopener noreferrer">cbs.sa.gov.au</a>
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
