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
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Granny Flat Guide Victoria: Rules, Costs & Approvals (2026)",
  description:
    "Building a secondary dwelling in Victoria: planning permits, ResCode, council rules, costs, and what makes VIC slower and more expensive than NSW.",
  slug: "granny-flat-guide-vic",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 7,
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
  "Victoria has no state-wide complying-development pathway for secondary dwellings, you typically need a council planning permit, which takes longer and costs more than NSW's CDC route.",
  "Planning permit timelines: 2 to 4 months for simple applications, 4 to 8 months with neighbour notification, 12+ months if there are objections or VCAT involvement.",
  "ResCode is the state-wide residential development code; planning overlays (Heritage, NCO, Flood, Bushfire, VPO) add further constraints.",
  "Lot size requirements vary by zone. GRZ is most flexible; NRZ may prohibit secondary dwellings.",
  "Build costs sit between $120K (basic 1-bed) and $350K+ (heritage-sensitive).",
  "Inner Melbourne rents of $350 to $550/week deliver gross yields of 8 to 12% on construction cost, lower than NSW due to higher build cost.",
];

const TOC: GuideTOCEntry[] = [
  { id: "overview",         label: "Secondary dwellings in Victoria" },
  { id: "planning",         label: "Planning permit requirements" },
  { id: "rescode",          label: "ResCode and planning overlays" },
  { id: "lot-size",         label: "Lot size and zone requirements" },
  { id: "costs",            label: "Building costs in Victoria" },
  { id: "approval-time",    label: "How long does approval take?" },
  { id: "growth-corridors", label: "Growth corridor opportunities" },
  { id: "rental",           label: "Rental potential" },
];

const FAQS: FaqItem[] = [
  {
    question: "Why is building a granny flat slower in Victoria than NSW?",
    answer:
      "Victoria has no state-wide complying-development pathway for secondary dwellings. Most projects require a council planning permit (2 to 4 months minimum), with neighbour notification, ResCode compliance, and possible VCAT appeals. NSW can issue a CDC in 10 to 20 days for eligible sites.",
  },
  {
    question: "Are secondary dwellings allowed in NRZ areas?",
    answer:
      "Sometimes prohibited, sometimes restricted. The Neighbourhood Residential Zone is more conservative than General Residential Zone. Always check your council's planning scheme and the specific schedule applied to NRZ in your area before assuming a secondary dwelling is permissible.",
  },
  {
    question: "What's a 'dependent person's unit' and how does it differ from a granny flat?",
    answer:
      "A dependent person's unit is a planning category in Victoria where the secondary dwelling is for use by someone dependent on the residents of the main house. It can sometimes be approved more readily but it's restricted to dependent occupancy and typically can't be rented to the general public, which limits investment value.",
  },
  {
    question: "Can VCAT overturn a council refusal?",
    answer:
      "Yes. If your council refuses or imposes unworkable conditions, you can appeal to VCAT (Victorian Civil and Administrative Tribunal). Appeals add 6+ months and meaningful legal cost, but VCAT regularly grants permits where applicants can demonstrate compliance with state planning policy.",
  },
  {
    question: "Does Victoria have a heritage overlay impact on granny flats?",
    answer:
      "Heritage Overlays often require the secondary dwelling to be heritage-sensitive in materials, scale and detailing, plus a heritage report and officer review. Cost can rise $50K to $100K+ versus a vanilla design. Worth getting heritage advice before lodging.",
  },
  {
    question: "Are yields really lower than NSW for granny flats?",
    answer:
      "Generally yes, on a cost basis. Higher VIC build costs (planning complexity, heritage, ResCode compliance) and similar Melbourne rents to outer Sydney usually deliver 8 to 12% gross versus 12 to 15% in NSW. Still attractive versus a standalone investment property.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Granny Flat Guide NSW",       href: "/guides/granny-flat-guide-nsw", description: "Compare to NSW's faster CDC pathway." },
  { title: "Granny Flat Guide QLD",       href: "/guides/granny-flat-guide-qld", description: "Auxiliary dwellings and what's allowed in QLD." },
  { title: "Negative Gearing in Australia", href: "/guides/negative-gearing-australia", description: "Tax treatment of investment property and granny flat income." },
  { title: "Property Depreciation Guide",   href: "/guides/property-depreciation-guide", description: "Maximising deductions on a new build." },
  { title: "Renter's Rights in Victoria",   href: "/guides/renters-rights-vic", description: "Tenant entitlements when you rent the granny flat." },
];

export default function GrannyFlatGuideVICPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Verify with your local council">
        <p>
          Planning rules for secondary dwellings in Victoria vary significantly
          by council. Always check with your local council's planning department
          before committing to a project.
        </p>
      </Callout>

      <Callout variant="info" title="VIC vs NSW">
        <p>
          Unlike NSW, Victoria does not have a state-wide complying-development
          pathway for secondary dwellings. Most projects require a council
          planning permit, taking longer and costing more than NSW's CDC process.
        </p>
      </Callout>

      <h2 id="overview">Secondary dwellings in Victoria</h2>
      <p className="lead">
        In Victoria, a granny flat is referred to as a <strong>dependent person's
        unit</strong> or, more broadly, a <strong>secondary dwelling</strong>.
        Terminology and planning rules depend on your zone, overlay, and local
        planning scheme.
      </p>
      <p>
        Unlike NSW, with its state-wide streamlined pathway, Victoria's approach
        is largely council-driven, so rules, processing times, and outcomes vary
        significantly by municipality.
      </p>
      <p>
        The Victorian Government has been working on housing supply reforms that
        affect secondary dwellings. Check the Department of Transport and
        Planning website for the latest policy position.
      </p>

      <h2 id="planning">Planning permit requirements</h2>
      <p>
        In most Victoria areas, building a secondary dwelling requires a planning
        permit from the local council. The process:
      </p>
      <ol>
        <li>Lodge a planning permit application with supporting documents (plans, site analysis)</li>
        <li>Council assessment, which may include a neighbour notification period</li>
        <li>Council decision, approval, approval with conditions, or refusal</li>
        <li>If approved, obtain a building permit before commencing construction</li>
      </ol>
      <p>
        Some minor secondary dwelling proposals may be exempt under ResCode or
        council by-laws. A planning consultant or council planner can advise on
        whether your project is exempt.
      </p>

      <h2 id="rescode">ResCode and planning overlays</h2>
      <p>
        <strong>ResCode</strong> is Victoria's state-wide residential development
        code, setting standards for setbacks, site coverage, overlooking,
        overshadowing, and open space. All secondary dwelling proposals must
        comply with ResCode (or receive a variation).
      </p>
      <p>Common overlays affecting proposals:</p>
      <ul>
        <li><strong>Neighbourhood Character Overlay (NCO):</strong> May restrict design or height</li>
        <li><strong>Heritage Overlay:</strong> Heritage-sensitive design and officer approval required</li>
        <li><strong>Flood or Bushfire Overlay:</strong> Additional assessment, may restrict development</li>
        <li><strong>Vegetation Protection Overlay:</strong> Limits tree removal needed for construction</li>
      </ul>
      <p>
        Check the Planning Maps Online tool (planning.vic.gov.au) to identify
        all overlays applying to your property before starting design.
      </p>

      <h2 id="lot-size">Lot size and zone requirements</h2>
      <p>
        Victoria has no universal minimum lot size for secondary dwellings.
        Requirements vary by zone:
      </p>
      <ul>
        <li>
          <strong>General Residential Zone (GRZ):</strong> Most common in
          established suburbs. Secondary dwellings generally permissible with a
          planning permit. Councils typically expect lots of at least 300 to
          400m² for attached, more for detached.
        </li>
        <li>
          <strong>Neighbourhood Residential Zone (NRZ):</strong> More
          restrictive. May limit dwellings per lot and impose stricter design
          requirements. Sometimes prohibits secondary dwellings, check your
          council's scheme.
        </li>
        <li>
          <strong>Residential Growth Zone (RGZ):</strong> Encourages
          higher-density. Secondary dwellings more readily approved.
        </li>
      </ul>
      <p>
        Contact your council's planning department early to understand your
        site's development potential before spending money on design.
      </p>

      <h2 id="costs">Building costs in Victoria</h2>
      <p>
        Construction costs in Victoria are broadly similar to NSW but can be
        higher in inner Melbourne due to land constraints, builder demand, and
        heritage requirements.
      </p>

      <table>
        <thead>
          <tr><th>Type</th><th>Estimated cost</th></tr>
        </thead>
        <tbody>
          <tr><td>Basic 1-bed secondary dwelling (40 to 50m²)</td><td>$120,000 to $180,000</td></tr>
          <tr><td>Mid-range 2-bed secondary dwelling (55 to 70m²)</td><td>$180,000 to $250,000</td></tr>
          <tr><td>Premium / heritage-sensitive design</td><td>$250,000 to $350,000+</td></tr>
        </tbody>
      </table>

      <p>Additional VIC-specific costs to budget for:</p>
      <ul>
        <li>Planning permit application fee: $1,000 to $3,000+</li>
        <li>Planning permit consultant: $3,000 to $8,000 (recommended for complex sites)</li>
        <li>Heritage report: $2,000 to $5,000 (if heritage overlay applies)</li>
        <li>Soil and drainage report: $1,000 to $2,000</li>
      </ul>

      <h2 id="approval-time">How long does approval take?</h2>
      <ul>
        <li><strong>Simple applications (no objections, no overlay):</strong> 2 to 4 months</li>
        <li><strong>Notifiable applications (neighbour notification):</strong> 4 to 8 months</li>
        <li><strong>Complex applications (overlays, objections, VCAT appeal):</strong> 12+ months</li>
      </ul>
      <p>
        After the planning permit, you still need a <strong>building permit</strong>{" "}
        before construction. That adds another 4 to 8 weeks.
      </p>

      <KeyFigure
        value="2–8 months"
        label="Typical Victorian planning permit timeline."
        context="NSW CDC by comparison: 10 to 20 days"
      />

      <p>
        Versus NSW's CDC pathway (typically 2 to 4 weeks), Victoria's planning
        process is meaningfully slower. Factor this into your project timeline
        and budget.
      </p>

      <h2 id="growth-corridors">Growth corridor opportunities</h2>
      <p>
        Melbourne's urban growth corridors (Werribee, Melton, Cranbourne,
        Epping) are zoned for higher-density residential development.
        Secondary dwellings tend to be more readily approved because:
      </p>
      <ul>
        <li>Lots are often designed for dual occupancy from the outset</li>
        <li>Growth zones typically have simpler planning overlays</li>
        <li>Councils in growth corridors have established secondary-dwelling processes</li>
      </ul>
      <p>
        Rental yields in outer growth corridors are typically lower than
        established inner and middle suburbs. Weigh up the cost savings on
        approval against the lower income potential.
      </p>

      <h2 id="rental">Rental potential in Victoria</h2>
      <p>Rental returns for secondary dwellings in Melbourne:</p>
      <ul>
        <li><strong>Inner Melbourne (5 to 15km from CBD):</strong> $350 to $550/week for a 1 to 2 bed dwelling</li>
        <li><strong>Middle ring suburbs (15 to 30km):</strong> $280 to $420/week</li>
        <li><strong>Outer growth corridors:</strong> $250 to $360/week</li>
      </ul>
      <p>
        Given higher construction costs in Victoria (planning complexity), yields
        tend to be slightly lower than NSW on a cost basis. Still, secondary
        dwellings remain a popular strategy for Melbourne investors. Use our{" "}
        <Link href="/rental-yield-calculator">rental yield calculator</Link> to
        model your scenario.
      </p>
    </GuideArticleLayout>
  );
}
