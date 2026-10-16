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
  title: "Granny Flat Guide Victoria: Rules, Costs & Approvals (2026)",
  description:
    "Building a small second dwelling (granny flat) in Victoria: when you still need a planning permit, ResCode, overlays, council rules, costs and rental returns.",
  slug: "granny-flat-guide-vic",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-16",
  readingTimeMinutes: 7,
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
  "Since 14 December 2023, a small second dwelling (Victoria’s granny flat) normally needs no planning permit in residential and rural zones, only a building permit. The planning size limit rose from 60m² to 80m² on 15 October 2026.",
  "Where a planning permit is still needed (a lot under 300m² in a residential zone, some rural zones, or an overlay that requires one): 2 to 4 months for simple applications, 4 to 8 months with neighbour notification, 12+ months if there are objections or VCAT involvement.",
  "ResCode is the state-wide residential development code; planning overlays (Heritage, NCO, Flood, Bushfire, VPO) add further constraints.",
  "A small second dwelling is allowed in every residential zone, including the NRZ. The number that matters is 300m²: below it, in a residential zone, you need a planning permit.",
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
    question: "Is building a granny flat slower in Victoria than NSW?",
    answer:
      "Not always any more. Since 14 December 2023, a small second dwelling normally needs no planning permit in Victoria’s residential and rural zones, so you go straight to a building permit. Where a planning permit is still needed (a lot under 300m² in a residential zone, some rural zones, or an overlay that requires one), expect 2 to 4 months minimum, with possible neighbour notification and VCAT appeals. NSW can issue a CDC in 10 to 20 days for eligible sites.",
  },
  {
    question: "Are secondary dwellings allowed in NRZ areas?",
    answer:
      "Yes. A small second dwelling is allowed in every residential zone, including the Neighbourhood Residential Zone, and normally needs no planning permit there if the lot is at least 300m² and no overlay requires one. The zone’s conditions still apply, so check your council’s planning scheme and the schedule to the NRZ in your area.",
  },
  {
    question: "What's a 'dependent person's unit' and how does it differ from a granny flat?",
    answer:
      "A dependent person’s unit was a movable building on the same lot as a house, for someone dependent on a resident of the main house. Amendment VC253 removed the term from Victorian planning schemes in December 2023 and replaced it with the small second dwelling, which anyone can live in or rent. Transitional rules allow new dependent person’s unit applications until 28 March 2027.",
  },
  {
    question: "Can VCAT overturn a council refusal?",
    answer:
      "Yes. If your council refuses or imposes unworkable conditions, you can appeal to VCAT (Victorian Civil and Administrative Tribunal). Appeals add 6+ months and meaningful legal cost, but VCAT regularly grants permits where applicants can demonstrate compliance with state planning policy.",
  },
  {
    question: "Does Victoria have a heritage overlay impact on granny flats?",
    answer:
      "In a Heritage Overlay, a small second dwelling needs no planning permit if it is no more than 5 metres high and finished in muted tones and colours. A taller or bolder design needs a permit, usually with heritage-sensitive materials, scale and detailing, plus a heritage report and officer review. Cost can rise $50K to $100K+ versus a vanilla design. Worth getting heritage advice before lodging.",
  },
  {
    question: "Are yields really lower than NSW for granny flats?",
    answer:
      "Generally yes, on a cost basis. Higher VIC build costs (planning complexity, heritage, ResCode compliance) and similar Melbourne rents to outer Sydney usually deliver 8 to 12% gross versus 12 to 15% in NSW. Still attractive versus a standalone investment property.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Granny Flat Guide NSW",       href: "/guides/granny-flat-guide-nsw", description: "Compare NSW's CDC pathway." },
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
          by council. Always check with your local council&rsquo;s planning department
          before committing to a project.
        </p>
      </Callout>

      <Callout variant="info" title="VIC vs NSW">
        <p>
          Victoria’s fast route works differently from NSW’s. Since December
          2023, a small second dwelling normally needs no planning permit in
          residential and rural zones, so most projects go straight to a
          building permit. A council planning permit is still needed on a lot
          under 300m² in a residential zone, in some rural zones, and where an
          overlay or another planning control requires one.
        </p>
      </Callout>

      <h2 id="overview">Secondary dwellings in Victoria</h2>
      <p className="lead">
        In Victoria’s planning system, a granny flat is a <strong>small second
        dwelling</strong>: a self-contained home on the same lot as an existing
        house, with a kitchen, a bathroom and a toilet. The term replaced the
        old <strong>dependent person’s unit</strong> in December 2023.
      </p>
      <p>
        The small second dwelling rules are state-wide: they sit in the Victoria
        Planning Provisions and every council’s planning scheme. Your zone,
        overlays and any covenant or section 173 agreement on the title still
        decide what you can build, so check them for your property.
      </p>
      <p>
        Amendment VC253 created the small second dwelling on 14 December 2023,
        with a limit of 60m². Amendment VC306 lifted the planning limit to 80m²
        on 15 October 2026, with matching changes to the building regulations
        to follow, so confirm the current size limit with your building
        surveyor. The Department of Transport and Planning’s{" "}
        <a
          href="https://www.planning.vic.gov.au/guides-and-resources/strategies-and-initiatives/small-second-dwellings"
          target="_blank"
          rel="noopener noreferrer"
        >
          small second homes page
        </a>{" "}
        has the latest position.
      </p>

      <h2 id="planning">Planning permit requirements</h2>
      <p>
        A small second dwelling normally needs no planning permit in a
        residential or rural zone. You need one if the lot is under 300m² in a
        residential zone, if the land is in a Rural Conservation, Green Wedge
        or Green Wedge A Zone, if a rural zone’s own setback or earthworks
        rules require one, or if an overlay or another part of the planning
        scheme does. Where a permit is needed, the process:
      </p>
      <ol>
        <li>Lodge a planning permit application with supporting documents (plans, site analysis)</li>
        <li>Council assessment, which may include a neighbour notification period</li>
        <li>Council decision: approval, approval with conditions, or refusal</li>
        <li>If approved, obtain a building permit before commencing construction</li>
      </ol>
      <p>
        With or without a planning permit, you need a building permit. Where no
        planning permit is needed, the building surveyor checks the siting
        rules (setbacks, site coverage, overlooking and the like) as part of
        it. A council planner can confirm whether your project needs a planning
        permit.
      </p>

      <h2 id="rescode">ResCode and planning overlays</h2>
      <p>
        <strong>ResCode</strong>{" "}is Victoria&rsquo;s state-wide residential development
        code, setting standards for setbacks, site coverage, overlooking,
        overshadowing, and open space. All secondary dwelling proposals must
        comply with ResCode (or receive a variation).
      </p>
      <p>Common overlays affecting proposals:</p>
      <ul>
        <li><strong>Neighbourhood Character Overlay (NCO):</strong> May restrict design or height. A small second dwelling up to 5 metres high, in muted tones and colours, needs no planning permit</li>
        <li><strong>Heritage Overlay:</strong> No planning permit for a small second dwelling up to 5 metres high in muted tones and colours; anything taller or bolder needs a permit, heritage-sensitive design and officer approval</li>
        <li><strong>Flood or Bushfire Overlay:</strong> Can trigger a planning permit and additional assessment, may restrict development</li>
        <li><strong>Vegetation Protection Overlay:</strong> Limits tree removal needed for construction</li>
      </ul>
      <p>
        Check the Planning Maps Online tool (planning.vic.gov.au) to identify
        all overlays applying to your property before starting design.
      </p>

      <h2 id="lot-size">Lot size and zone requirements</h2>
      <p>
        For a small second dwelling, the number that matters is 300m²: on a
        smaller lot in a residential zone, you need a planning permit. Beyond
        that, zone conditions vary:
      </p>
      <ul>
        <li>
          <strong>General Residential Zone (GRZ):</strong> Most common in
          established suburbs. A small second dwelling normally needs no
          planning permit on a lot of 300m² or more, subject to the
          zone’s conditions and its minimum garden area requirement.
        </li>
        <li>
          <strong>Neighbourhood Residential Zone (NRZ):</strong>{" "}More
          restrictive for multi-unit development, but a small second dwelling
          is allowed and normally needs no planning permit on a lot of 300m²
          or more. The minimum garden area requirement applies here too; check
          your council’s schedule to the zone.
        </li>
        <li>
          <strong>Residential Growth Zone (RGZ):</strong> Encourages
          higher-density. A small second dwelling normally needs no planning
          permit on a lot of 300m² or more.
        </li>
      </ul>
      <p>
        Contact your council&rsquo;s planning department early to understand your
        site&rsquo;s development potential before spending money on design.
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
        <li>Planning permit application fee, if you need a permit: $1,000 to $3,000+</li>
        <li>Planning permit consultant: $3,000 to $8,000 (recommended for complex sites)</li>
        <li>Heritage report: $2,000 to $5,000 (if heritage overlay applies)</li>
        <li>Soil and drainage report: $1,000 to $2,000</li>
      </ul>

      <h2 id="approval-time">How long does approval take?</h2>
      <p>
        If your small second dwelling needs no planning permit, you go straight
        to the building permit. Where a planning permit is needed:
      </p>
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
        label="Typical Victorian planning permit timeline, where a permit is needed."
        context="NSW CDC by comparison: 10 to 20 days"
      />

      <p>
        Where a permit is needed, Victoria’s planning process is meaningfully
        slower than NSW’s CDC pathway (typically 2 to 4 weeks). Factor this
        into your project timeline and budget.
      </p>

      <h2 id="growth-corridors">Growth corridor opportunities</h2>
      <p>
        Melbourne&rsquo;s urban growth corridors (Werribee, Melton, Cranbourne,
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
