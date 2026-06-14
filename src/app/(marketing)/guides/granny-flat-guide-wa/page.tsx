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
  title: "Granny Flat Guide Western Australia: Rules, Costs & Approvals (2026)",
  description:
    "Building a granny flat (ancillary dwelling) in WA: R-Codes, lot sizes, building permit process, owner-occupier rules, costs $80K to $200K, and Perth rental demand.",
  slug: "granny-flat-guide-wa",
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
  "WA calls them 'ancillary dwellings'. Regulated under the state-wide Residential Design Codes (R-Codes) plus local council policies.",
  "WA has no fast-track CDC pathway like NSW. All ancillary dwellings need a building permit; some councils also require a planning approval.",
  "Maximum size is 70m² on lots under 500m² and up to 100m² on larger lots. Generally permitted in R20+ zones.",
  "Owner-occupier rule applies in most WA councils: one of the two dwellings must be owner-occupied. Pure investment dual-occupancy is generally not allowed.",
  "Total build cost typically $80,000 to $200,000+ (design, fees, site works, construction, landscaping). Modular options available from $70K to $130K+ install.",
  "Perth's rental market has been below 1% vacancy since 2022; rents of $380 to $600/week support strong yields on construction cost.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is",          label: "What is an ancillary dwelling in WA?" },
  { id: "r-codes",          label: "R-Code requirements" },
  { id: "owner-occupier",   label: "Owner-occupier requirement" },
  { id: "approval-process", label: "Approval process" },
  { id: "costs",            label: "Costs of building in WA" },
  { id: "rental-income",    label: "Rental income potential in Perth" },
  { id: "popular-areas",    label: "Popular areas for granny flats" },
  { id: "tips",             label: "Practical tips for WA owners" },
  { id: "resources",        label: "Resources" },
];

const FAQS: FaqItem[] = [
  {
    question: "Why does WA require an owner-occupier in most councils?",
    answer:
      "It's a planning policy choice rooted in neighbourhood-character objectives. The condition is enforced through the planning approval and building permit. The registered owner must reside in either the main house or the ancillary dwelling; pure investment dual-occupancy is generally not permitted in WA.",
  },
  {
    question: "What's the maximum size for an ancillary dwelling in WA?",
    answer:
      "70m² on lots under 500m². Lots over 500m² may permit up to 100m². The cap is the internal living area including bathroom and kitchen. Verandahs and external storage typically don't count, but confirm with your draftsperson.",
  },
  {
    question: "What R-zone do I need to build a granny flat?",
    answer:
      "R20 or higher density zones are generally required. R20 typically corresponds to a minimum lot size of around 660m² for subdivision but lower for ancillary dwellings. Check your specific zone with your local council.",
  },
  {
    question: "Do I need a planning approval as well as a building permit?",
    answer:
      "Sometimes. Some WA councils require a development application (planning approval) before the building permit, particularly if the proposal triggers discretionary assessment. Many councils don't if you comply with the R-Codes. Check with your council early in the process.",
  },
  {
    question: "Can I rent out the ancillary dwelling on Airbnb?",
    answer:
      "Short-stay rentals are increasingly regulated in WA, especially in metropolitan areas. Some councils require additional approvals for short-stay use. Always check council rules and consider whether it conflicts with the owner-occupier requirement.",
  },
  {
    question: "What yields can I expect in Perth?",
    answer:
      "Rental income on a 1 to 2 bed ancillary dwelling typically runs $380 to $600/week in Perth (higher near the coast). At $400/week on a $130K build, gross yield is roughly 16%. Even after expenses (rates, insurance, maintenance), that's well above standalone investment property returns.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Granny Flat Guide NSW",         href: "/guides/granny-flat-guide-nsw", description: "Compare to NSW's CDC pathway and no owner-occupier rule." },
  { title: "Granny Flat Guide VIC",         href: "/guides/granny-flat-guide-vic", description: "Victoria's slower planning permit process." },
  { title: "Granny Flat Guide QLD",         href: "/guides/granny-flat-guide-qld", description: "QLD's code-assessable approach." },
  { title: "Property Depreciation Guide",   href: "/guides/property-depreciation-guide", description: "Maximising deductions on a new ancillary dwelling." },
  { title: "Renter's Rights in WA",         href: "/guides/renters-rights-wa", description: "Tenant entitlements when you rent the dwelling out." },
];

const STEPS = [
  { step: "1", title: "Pre-application research", desc: "Confirm your lot's zone, R-Code, and whether your council has additional local policies. Check if planning approval is required in addition to a building permit." },
  { step: "2", title: "Engage a designer or draftsperson", desc: "Architectural drawings demonstrating R-Code compliance. A draftsperson is usually sufficient for standard ancillary dwellings, you don't always need a full architect." },
  { step: "3", title: "Submit development application (if required)", desc: "Some councils require a DA before the building permit, particularly if the proposal triggers discretionary criteria. Processing: 30 to 60 days." },
  { step: "4", title: "Submit building permit application", desc: "Lodge with your local council or a registered building surveyor. Include plans, specs, and a site plan showing setbacks. Processing: typically 10 to 25 business days." },
  { step: "5", title: "Commence construction", desc: "Don't start without an approved building permit. Inspections required at footings, frame, completion." },
  { step: "6", title: "Final inspection and occupancy", desc: "Final building inspection confirms compliance, then the ancillary dwelling can be occupied." },
];

export default function GrannyFlatGuideWAPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Verify with your council and the WAPC">
        <p>
          Planning and building rules in WA vary by council and zoning. Always
          confirm requirements with your local council and the Western
          Australian Planning Commission before proceeding.
        </p>
      </Callout>

      <h2 id="what-is">What is an ancillary dwelling in WA?</h2>
      <p className="lead">
        In Western Australia, what's commonly called a "granny flat" is
        officially an <strong>ancillary dwelling</strong> (sometimes secondary
        dwelling). It's a self-contained dwelling on the same lot as a primary
        residence, typically smaller than the main house, designed for a family
        member, carer, or tenant.
      </p>
      <p>
        Ancillary dwellings are regulated under the <strong>Residential Design
        Codes (R-Codes)</strong>, WA's state-wide planning framework, plus local
        council policies. The R-Codes set minimum lot sizes, maximum floor
        areas, and setbacks.
      </p>
      <p>
        WA has no fast-track CDC pathway like NSW. All ancillary dwellings
        require a <strong>building permit</strong>, and some require a
        development application (planning approval) from the local council.
      </p>

      <h2 id="r-codes">R-Code requirements</h2>
      <p>
        WA Residential Design Codes set the key parameters for ancillary
        dwellings. Requirements depend on lot size and zoning:
      </p>

      <table>
        <thead>
          <tr><th>Lot size</th><th>Max ancillary dwelling size</th><th>Notes</th></tr>
        </thead>
        <tbody>
          <tr><td>Under 350m²</td><td>70m²</td><td>R20+ zone generally required</td></tr>
          <tr><td>350m² to 500m²</td><td>70m²</td><td>Subject to setback and lot coverage rules</td></tr>
          <tr><td>Over 500m²</td><td>Up to 100m²</td><td>Larger lots may allow larger dwellings</td></tr>
        </tbody>
      </table>

      <p>Key R-Code requirements:</p>
      <ul>
        <li><strong>Minimum lot size:</strong> Generally permitted in R20 and higher density zones. R20 typically corresponds to ~660m² for subdivision but lower for ancillary dwellings. Check your specific zone with your council.</li>
        <li><strong>Floor area cap:</strong> 70m² for most lots (under 500m²); up to 100m² for larger lots. Internal living area including bathroom and kitchen.</li>
        <li><strong>Setbacks:</strong> Must comply with side, rear, and primary-dwelling setbacks. These vary by zone.</li>
        <li><strong>Lot coverage:</strong> Combined coverage of all structures (main house + ancillary + outbuildings) can't exceed the maximum permissible for the zone.</li>
        <li><strong>Parking:</strong> One car bay may need to be provided in addition to those required for the main house.</li>
        <li><strong>Utilities:</strong> Must have a separate or separately metered electricity and water connection.</li>
      </ul>
      <p>
        Always confirm with your specific local council (City of Perth, City of
        Stirling, City of Joondalup, etc.) as some have additional policies
        overlaying the state R-Codes.
      </p>

      <h2 id="owner-occupier">Owner-occupier requirement</h2>
      <p>
        This is a critical difference between WA and NSW or QLD: in most WA
        councils, <strong>one of the two dwellings on the lot must be
        owner-occupied</strong>. Pure investment dual-occupancy is generally not
        allowed.
      </p>
      <ul>
        <li>The registered owner must reside in the main house or the ancillary dwelling</li>
        <li>Applies even if you're building the dwelling for a family member</li>
        <li>Enforced through the planning approval and building permit conditions</li>
        <li>Some councils may have exceptions, always verify</li>
      </ul>
      <p>So WA granny flats best suit owner-occupiers who want to:</p>
      <ul>
        <li>House a family member (elderly parent, adult child) on the same property</li>
        <li>Generate rental income from the ancillary dwelling while living in the main house</li>
        <li>Create multi-generational living arrangements</li>
      </ul>

      <h2 id="approval-process">Approval process, building permit</h2>
      <p>
        Unlike NSW's CDC pathway, WA requires a building permit for all
        ancillary dwellings, processed via your local council or a registered
        building surveyor. The process:
      </p>
      <ol>
        {STEPS.map((s) => (
          <li key={s.step}>
            <strong>{s.title}.</strong> {s.desc}
          </li>
        ))}
      </ol>

      <h2 id="costs">Costs of building a granny flat in WA</h2>
      <p>
        Costs vary significantly with size, finish, and site complexity.
      </p>

      <table>
        <thead>
          <tr><th>Item</th><th>Typical cost range</th></tr>
        </thead>
        <tbody>
          <tr><td>Design and drafting</td><td>$3,000 to $8,000</td></tr>
          <tr><td>Council fees (DA + building permit)</td><td>$2,000 to $5,000</td></tr>
          <tr><td>Site works (slab, drainage, services)</td><td>$15,000 to $40,000</td></tr>
          <tr><td>Construction (50 to 70m² ancillary dwelling)</td><td>$80,000 to $160,000</td></tr>
          <tr><td>Landscaping and fencing</td><td>$5,000 to $15,000</td></tr>
          <tr><td><strong>Total estimated cost</strong></td><td><strong>$80,000 to $200,000+</strong></td></tr>
        </tbody>
      </table>

      <p>
        Prefab/modular ancillary dwellings can reduce time and cost. Several
        WA-based suppliers offer complete modular units in the $70,000 to
        $130,000 range (plus site prep and installation). Ensure any prefab is
        pre-certified for WA building codes.
      </p>

      <h2 id="rental-income">Rental income potential in Perth</h2>
      <p>
        Perth's rental market has been exceptionally tight since 2022, with
        vacancy rates consistently below 1% across most suburbs. Strong demand
        for ancillary dwellings as well as standard rentals.
      </p>
      <p>Typical rents for a 1 to 2 bed ancillary dwelling in 2026:</p>
      <ul>
        <li>Inner Perth (5 to 10km from CBD): <strong>$450 to $600/week</strong></li>
        <li>Middle ring (10 to 20km from CBD): <strong>$380 to $500/week</strong></li>
        <li>Outer suburbs: <strong>$300 to $420/week</strong></li>
        <li>Coastal suburbs (Fremantle, Cottesloe, Scarborough): <strong>$450 to $650/week</strong></li>
      </ul>

      <KeyFigure
        value="13–20%"
        label="Typical gross yield on construction cost: $400/week rent on a $100K to $150K build."
        context="Before rates, insurance, and maintenance"
      />

      <p>
        Even allowing for expenses, returns can be compelling, especially given
        how tight Perth's rental market has been.
      </p>

      <h2 id="popular-areas">Popular areas for granny flats in Perth</h2>
      <p>The best Perth areas for ancillary dwellings combine:</p>
      <ul>
        <li><strong>Suitable zoning:</strong> R20+ with adequate lot sizes</li>
        <li><strong>Strong rental demand:</strong> Near universities, hospitals, train stations</li>
        <li><strong>Owner demographics:</strong> Higher rates of long-term owner-occupancy</li>
      </ul>
      <p>
        Popular areas: Morley, Balga, Midland, Victoria Park, Belmont,
        Cannington, and Gosnells in the middle ring; coastal suburbs like
        Fremantle, Hamilton Hill, and Beaconsfield; established inner suburbs
        like Mount Lawley, Northbridge, and Bayswater.
      </p>

      <h2 id="tips">Practical tips for WA granny flat owners</h2>
      <ul>
        <li><strong>Check your title first:</strong> Some properties have title restrictions (developer covenants) prohibiting secondary dwellings. Your conveyancer or Landgate can check before you invest in plans.</li>
        <li><strong>Strata title:</strong> If your property is in a strata scheme, separate strata company approval may be required in addition to council approval.</li>
        <li><strong>Tax implications:</strong> Rental income is taxable. Consult an accountant about depreciation, which can offset a significant share of income in early years.</li>
        <li><strong>Insurance:</strong> Update building insurance to cover the ancillary dwelling and consider landlord insurance for the rental.</li>
        <li><strong>Tenancy laws:</strong> As a landlord, you're bound by the WA Residential Tenancies Act. See <Link href="/guides/renters-rights-wa">Renter's Rights in WA</Link> for the obligations from the tenant side.</li>
      </ul>

      <h2 id="resources">Resources</h2>
      <ul>
        <li>
          <strong>Western Australian Planning Commission (WAPC)</strong>:{" "}
          <a href="https://www.wa.gov.au/organisation/western-australian-planning-commission" target="_blank" rel="noopener noreferrer">wa.gov.au</a>
        </li>
        <li>
          <strong>Department of Planning, Lands and Heritage WA</strong>, R-Codes:{" "}
          <a href="https://www.dplh.wa.gov.au" target="_blank" rel="noopener noreferrer">dplh.wa.gov.au</a>
        </li>
        <li>
          <strong>Landgate</strong>, property title and land information:{" "}
          <a href="https://www.landgate.wa.gov.au" target="_blank" rel="noopener noreferrer">landgate.wa.gov.au</a>
        </li>
        <li>
          <strong>Building Commission WA</strong>, building permits and standards:{" "}
          <a href="https://www.commerce.wa.gov.au/building-commission" target="_blank" rel="noopener noreferrer">commerce.wa.gov.au</a>
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
