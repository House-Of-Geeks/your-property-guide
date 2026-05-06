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
  title: "Granny Flat Guide Queensland: Rules, Costs & Investment Returns (2026)",
  description:
    "Building a secondary dwelling in Queensland: planning rules, Brisbane City Council requirements, costs, and rental returns in QLD's tight rental market.",
  slug: "granny-flat-guide-qld",
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
  "QLD has no state-wide complying-development pathway for secondary dwellings; most projects are code assessable through the local council (typically 25 to 30 business days).",
  "Brisbane City Council allows up to 80m² secondary dwellings in eligible zones; minimum lot sizes are 600m² detached / 450m² attached.",
  "QLD vacancy rates have been below 1% in Brisbane, Gold Coast and Sunshine Coast for years, supporting strong rents.",
  "Build costs sit between $100K (basic) and $260K+ (full 80m²). Typical Brisbane rents of $380 to $550/week deliver gross yields around 12 to 15%.",
  "Both Gold Coast and Sunshine Coast councils permit secondary dwellings in residential zones with their own planning schemes.",
  "QLD secondary dwellings can't be subdivided or strata titled separately, they sell with the main lot.",
];

const TOC: GuideTOCEntry[] = [
  { id: "overview",     label: "Secondary dwellings in Queensland" },
  { id: "brisbane",     label: "Brisbane City Council rules" },
  { id: "requirements", label: "Size and design requirements" },
  { id: "da",           label: "Development application process" },
  { id: "costs",        label: "Building costs" },
  { id: "rental",       label: "Rental market and returns" },
  { id: "gold-coast",   label: "Gold Coast and Sunshine Coast" },
];

const FAQS: FaqItem[] = [
  {
    question: "What's the maximum size for a granny flat in Brisbane?",
    answer:
      "80m² gross floor area in BCC. Other QLD councils may have different caps, check your council's planning scheme. Verandahs and external storage typically don't count toward the cap, but confirm with your draftsperson.",
  },
  {
    question: "Do I need a DA for a secondary dwelling in Queensland?",
    answer:
      "Most QLD secondary dwellings are code assessable, meaning they're assessed against a checklist of planning standards rather than discretionary merit. If your proposal complies with the code, it should be approved within 25 to 30 business days. If you depart from the code, impact assessment applies and includes public notification.",
  },
  {
    question: "What's the minimum lot size for a granny flat in Brisbane?",
    answer:
      "600m² for a detached secondary dwelling, 450m² for an attached one. Other QLD councils set their own minimums, often in the 400m² to 600m² range.",
  },
  {
    question: "Can I sell the granny flat separately in QLD?",
    answer:
      "No. QLD secondary dwellings can't be subdivided into separate lots or strata titled. They form part of the same lot as the primary dwelling and sell with it.",
  },
  {
    question: "How tight is the Queensland rental market really?",
    answer:
      "Vacancy rates in Brisbane, Gold Coast and Sunshine Coast have been under 1% for years, with rents up substantially since 2022. The supply imbalance has made well-located secondary dwellings extremely lettable, often at premium rents.",
  },
  {
    question: "Are Gold Coast and Sunshine Coast rules different from Brisbane?",
    answer:
      "Yes. Each LGA has its own planning scheme. Gold Coast permits secondary dwellings in Low Density Residential zones with caps typically 70 to 80m². Sunshine Coast allows them in residential zones with minimum lot sizes typically above 450m². Always check the specific council's planning scheme.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Granny Flat Guide NSW",       href: "/guides/granny-flat-guide-nsw", description: "Compare to NSW's faster CDC pathway." },
  { title: "Granny Flat Guide VIC",       href: "/guides/granny-flat-guide-vic", description: "Victoria's slower planning permit process." },
  { title: "Negative Gearing in Australia", href: "/guides/negative-gearing-australia", description: "Tax treatment of investment property and granny flat income." },
  { title: "Property Depreciation Guide",   href: "/guides/property-depreciation-guide", description: "Maximising deductions on a new build." },
  { title: "Rental Yield Calculator",     href: "/rental-yield-calculator",         description: "Model gross and net yield on your scenario." },
];

export default function GrannyFlatGuideQLDPage() {
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
          Secondary dwelling rules in Queensland vary by council. Brisbane City
          Council's rules differ from Sunshine Coast, Gold Coast, and other
          LGAs. Always check with your local council before committing.
        </p>
      </Callout>

      <h2 id="overview">Secondary dwellings in Queensland</h2>
      <p className="lead">
        In Queensland, granny flats are referred to as <strong>secondary
        dwellings</strong> (or sometimes "auxiliary units" under older planning
        schemes). They must be:
      </p>
      <ul>
        <li>Located on the same lot as the primary dwelling</li>
        <li>Subordinate to the primary dwelling in size and function</li>
        <li>Self-contained (separate entrance, kitchen, bathroom, living area)</li>
        <li>Maximum <strong>80m²</strong> floor area in Brisbane (varies by council)</li>
      </ul>
      <p>
        Unlike NSW, Queensland has no state-wide complying-development pathway
        for secondary dwellings. Most projects require a Development Application
        through the local council, often as code assessable development (less
        formal than a full DA but still council-assessed).
      </p>

      <h2 id="brisbane">Brisbane City Council rules</h2>
      <p>
        Brisbane City Council is the largest local government in Australia and
        has its own planning scheme for secondary dwellings:
      </p>
      <ul>
        <li><strong>Zoning:</strong> Allowed in Low-Medium Density Residential and some other zones; not permitted everywhere, check the Brisbane City Plan.</li>
        <li><strong>Lot size, detached:</strong> Minimum <strong>600m²</strong></li>
        <li><strong>Lot size, attached:</strong> Minimum <strong>450m²</strong></li>
        <li><strong>Maximum size:</strong> <strong>80m²</strong> gross floor area</li>
        <li><strong>Separate entry:</strong> Required, distinct from the primary dwelling</li>
        <li><strong>Cannot be subdivided:</strong> No separate lot or strata title</li>
      </ul>
      <p>
        BCC has made significant changes in recent years to support housing
        supply. Check the Brisbane City Plan 2014 (and amendments) for the
        current position.
      </p>

      <h2 id="requirements">Size and design requirements</h2>
      <p>General QLD secondary dwelling rules (vary by council):</p>
      <ul>
        <li><strong>Maximum size:</strong> 80m² (Brisbane), check your council for its specific cap</li>
        <li><strong>Height:</strong> Generally 2 storeys or 8.5m</li>
        <li><strong>Setbacks:</strong> Generally 1.5m from side boundaries, 3m+ from rear (varies by zone and lot size)</li>
        <li><strong>Car parking:</strong> An additional car space may be required</li>
        <li><strong>Outdoor area:</strong> Minimum private open space typically required</li>
      </ul>
      <p>
        Engage a draftsperson or architect familiar with your council's
        requirements before preparing DA documents.
      </p>

      <h2 id="da">Development application process</h2>
      <p>
        Most QLD secondary dwellings are processed as <strong>code assessable
        development</strong>, assessed against a checklist of planning
        standards. If your proposal complies, it should be approved.
      </p>
      <ol>
        <li>Confirm zoning and applicable planning codes for your site</li>
        <li>Prepare plans and application documents</li>
        <li>Lodge the DA via the council's online portal</li>
        <li>Council assessment, typically 25 to 30 business days for code assessable</li>
        <li>Receive approval (may include conditions)</li>
        <li>Obtain building approval before commencing construction</li>
      </ol>
      <p>
        If your proposal needs impact assessment (departs from code), the
        process takes longer and includes public notification.
      </p>

      <h2 id="costs">Building costs in Queensland</h2>
      <p>
        Construction costs in QLD are broadly similar to NSW and VIC, often
        lower in outer Brisbane and regional areas:
      </p>

      <table>
        <thead>
          <tr><th>Type</th><th>Estimated cost</th></tr>
        </thead>
        <tbody>
          <tr><td>1-bed basic (40 to 50m²)</td><td>$100,000 to $150,000</td></tr>
          <tr><td>2-bed mid-range (55 to 70m²)</td><td>$150,000 to $200,000</td></tr>
          <tr><td>2-bed premium / full 80m²</td><td>$200,000 to $260,000+</td></tr>
        </tbody>
      </table>

      <p>Additional QLD costs:</p>
      <ul>
        <li>DA fees: $500 to $3,000 depending on council and complexity</li>
        <li>Building approval: $1,500 to $4,000</li>
        <li>Site preparation (Brisbane slopes): $5,000 to $25,000+</li>
        <li>Utility connections: $5,000 to $15,000</li>
      </ul>

      <h2 id="rental">Rental market and returns</h2>
      <p>
        Queensland's rental market has been extremely tight since 2022, with
        vacancy rates in Brisbane, Gold Coast and Sunshine Coast all below 1%
        for years. Rents have risen sharply, making secondary dwellings highly
        attractive for investors.
      </p>
      <ul>
        <li><strong>Brisbane inner/middle ring:</strong> $380 to $550/week for a 1 to 2 bed dwelling</li>
        <li><strong>Brisbane outer suburbs:</strong> $300 to $420/week</li>
        <li><strong>Gold Coast:</strong> $380 to $550/week (premium near the beach)</li>
        <li><strong>Sunshine Coast:</strong> $350 to $500/week</li>
        <li><strong>Regional QLD (Toowoomba, Cairns):</strong> $250 to $380/week</li>
      </ul>

      <KeyFigure
        value="~14.6%"
        label="Gross yield on construction cost: $420/week rent on a $150,000 build."
        context="Brisbane outer-middle ring, before management and rates"
      />

      <p>
        Even accounting for management costs and rates, that's a compelling
        return. The strong QLD rental market continues to support granny flat
        investment in 2026.
      </p>

      <h2 id="gold-coast">Gold Coast and Sunshine Coast</h2>
      <p>
        Both Gold Coast City Council and Sunshine Coast Council allow secondary
        dwellings in appropriate zones, with their own planning schemes:
      </p>
      <ul>
        <li>
          <strong>Gold Coast:</strong> Secondary dwellings permitted in Low Density
          Residential zones; max size typically 70 to 80m². Check the Gold Coast
          City Plan for current standards.
        </li>
        <li>
          <strong>Sunshine Coast:</strong> Permitted in residential zones with
          lot sizes typically above 450m². The Sunshine Coast Planning Scheme
          2014 sets the specifics.
        </li>
      </ul>
      <p>
        Both regions have strong rental demand and rent growth, making secondary
        dwellings an attractive investment in these markets.
      </p>
    </GuideArticleLayout>
  );
}
