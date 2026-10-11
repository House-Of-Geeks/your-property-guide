import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { GrannyFlatCostTable, grannyFlatCostSource } from "@/components/guide/GrannyFlatCostTable";
import { grannyFlatBuildRange, rangeText } from "@/lib/data/renovation-costs";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

// Rewritten 11 Oct 2026 (commercial-intent review, 10 Oct 2026, F5). The page
// used NSW's "complying development" for SA's assessment pathways, said an
// owner had to live on the site with no clause behind it (renting to anyone
// has been lawful since 27 November 2023), gave a 60 m2 limit the Code raised
// to 70 m2 in November 2024, and printed an unverified 250 m2 minimum lot,
// setbacks, site coverage, costs and rents. Rules below come from PlanSA, the
// Department for Housing and Urban Development and the City of Onkaparinga
// (quoting the Code's definition), all read 11 October 2026.
const FRONTMATTER: GuideFrontmatter = {
  title: "Secondary Dwellings SA (2026): Granny Flat Rules and Costs",
  h1: "Granny flats (secondary dwellings) in South Australia: rules, costs and approval (2026)",
  description:
    "SA granny flats are ancillary accommodation under the Planning and Design Code: approval under the PDI Act 2016, the 70 m² limit, renting it out, and costs.",
  slug: "granny-flat-guide-sa",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-11",
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

const PATHWAYS_URL = "https://plan.sa.gov.au/development_applications/getting_approval/how_applications_are_assessed/assessment_pathways";
const RENT_URL = "https://plan.sa.gov.au/news/article/2023/new-planning-rules-secure-granny-flats-for-rental-and-boost-design-for-new-homes";
const DHUD_URL = "https://www.dhud.sa.gov.au/news/bigger,-more-accessible-granny-flats";
const ONKA_URL = "https://www.onkaparingacity.com/Planning-and-development/Planning-and-development-FAQs/Ancillary-accommodation-granny-flats-tiny-homes-and-transportables";
const BII_URL = "https://safa.sa.gov.au/insurance/building-indemnity-insurance";
const SIZES = [40, 60, 70] as const;
const at70 = rangeText(grannyFlatBuildRange(70));

const TLDR = [
  "In South Australia a granny flat is 'ancillary accommodation' under the Planning and Design Code: on the same site as an existing dwelling and ancillary to it, self-contained or not, with no more than 2 bedrooms.",
  "Building one needs development approval under the Planning, Development and Infrastructure Act 2016, whatever its size: planning consent and building consent, lodged through the PlanSA portal.",
  "Your zone's tables in the Code classify it as accepted, deemed-to-satisfy or performance assessed. A deemed-to-satisfy proposal meets every criterion and cannot be refused; one that misses a criterion is performance assessed on its merits.",
  "The Code's maximum floor area for a granny flat rose from 60 m² to 70 m² in November 2024, and it no longer has to share a kitchen, bathroom or laundry with the house.",
  "Since 27 November 2023 a granny flat can be rented to anyone, even where an older approval limited it to the main household's family.",
  `Building a 70 m² granny flat costs about ${at70} for the shell, roof, kitchen and bathroom, on Archicentre Australia's 2026 rates, before site works, connections and fees.`,
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is",          label: "What is a granny flat in SA?" },
  { id: "planning-code",    label: "Approval under the PDI Act 2016" },
  { id: "deemed-to-satisfy", label: "Deemed-to-satisfy pathway" },
  { id: "size",             label: "Size and the 2024 changes" },
  { id: "owner-occupier",   label: "Who can live there, and renting it out" },
  { id: "costs",            label: "Costs of building in SA" },
  { id: "tips",             label: "Practical tips" },
  { id: "other-states",     label: "Granny flat rules in other states" },
  { id: "resources",        label: "Resources" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can I rent out a granny flat in South Australia?",
    answer:
      "Yes. Amended regulations in effect from 27 November 2023 mean ancillary accommodation can be rented to anyone, and it is no longer an offence to rent it out even where the development approval limits use or occupation to the family of the main home's residents (PlanSA). The City of Onkaparinga says there are no restrictions on who can occupy it.",
  },
  {
    question: "Do I need approval for a granny flat in SA?",
    answer:
      "Yes, whatever its size. Under the Planning, Development and Infrastructure Act 2016 building ancillary accommodation needs development approval, covering planning consent and building consent, lodged through the PlanSA portal. That includes a pre-designed or transportable tiny home. Building without approval can bring a penalty of up to $120,000 (City of Onkaparinga, read 11 October 2026).",
  },
  {
    question: "What is the difference between deemed-to-satisfy and performance assessed?",
    answer:
      "Both are code assessed. A deemed-to-satisfy proposal meets every criterion the Planning and Design Code sets for it and cannot be refused. A performance assessed proposal is assessed on its merits by an assessment manager or panel (PlanSA). Your zone's tables in the Code say which applies to ancillary accommodation on your land.",
  },
  {
    question: "How big can a granny flat be in SA?",
    answer:
      "The Code's maximum floor area for a granny flat is 70 m², raised from 60 m² by the Ancillary Accommodation and Student Accommodation Definitions Review Code Amendment (Department for Housing and Urban Development, 22 November 2024). It can have no more than 2 bedrooms or rooms capable of use as a bedroom.",
  },
  {
    question: "Do I have to use PlanSA?",
    answer:
      "Yes. Development applications in South Australia, including for ancillary accommodation, are lodged through the PlanSA portal, which also holds the Planning and Design Code and its zone maps.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Granny Flat Guide NSW",           href: "/guides/granny-flat-guide-nsw", description: "Secondary dwellings under the Housing SEPP 2021." },
  { title: "Granny Flat Guide VIC",           href: "/guides/granny-flat-guide-vic", description: "Small second dwellings under Amendment VC253." },
  { title: "Granny Flat Guide QLD",           href: "/guides/granny-flat-guide-qld", description: "Secondary dwellings under the Planning Regulation 2017." },
  { title: "Granny Flat Guide WA",            href: "/guides/granny-flat-guide-wa",  description: "Ancillary dwellings under the R-Codes Volume 1." },
  { title: "Property Depreciation Guide",     href: "/guides/property-depreciation-guide", description: "Deductions on a new build you rent out." },
  { title: "Renter's Rights in SA",           href: "/guides/renters-rights-sa", description: "Tenant entitlements when you rent the dwelling out." },
];

export default function GrannyFlatGuideSAPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
      sourced
    >
      <Callout variant="warning" title="Check your zone on PlanSA before you commit">
        <p>
          Which pathway applies, and the criteria a granny flat must meet,
          depend on your zone and any overlays in the Planning and Design Code.
          Look your property up on the{" "}
          <a href="https://plan.sa.gov.au" target="_blank" rel="noopener noreferrer">PlanSA portal</a>{" "}
          before you pay for a design.
        </p>
      </Callout>

      <h2 id="what-is">What is a granny flat in SA?</h2>
      <p className="lead">
        In South Australia a granny flat is <strong>ancillary
        accommodation</strong> under the Planning and Design Code. The
        Code&rsquo;s land use definition is accommodation that is located on the
        same site as an existing dwelling and is ancillary to it, can be (but
        need not be) self-contained, and contains no more than 2 bedrooms or
        rooms or areas capable of being used as a bedroom.
      </p>
      <p>
        &quot;Granny flat&quot;, &quot;secondary dwelling&quot;, a tiny home or
        a transportable studio are all ancillary accommodation if they meet
        that definition, and they are always secondary to the main dwelling.
      </p>

      <h2 id="planning-code">Approval under the PDI Act 2016</h2>
      <p>
        Under the Planning, Development and Infrastructure Act 2016,
        building ancillary accommodation needs <strong>development
        approval</strong>, whatever its size. Approval has two parts:
      </p>
      <ul>
        <li><strong>Planning consent</strong>, so the granny flat is suitably sited and does not harm neighbours or the locality; and</li>
        <li><strong>Building consent</strong>, so it meets the National Construction Code as a habitable building, with water, wastewater, electricity, fire and structural provisions.</li>
      </ul>
      <p>
        Applications are lodged through the PlanSA portal. Building without
        approval, or contrary to one, can bring a penalty of up to $120,000
        (City of Onkaparinga).
      </p>
      <p>
        PlanSA sorts development into exempt, accepted, code assessed
        (deemed-to-satisfy or performance assessed) and impact assessed
        (restricted or impact assessed). Accepted development needs building
        consent only. The tables in each zone of the Code say which pathway
        applies to ancillary accommodation on your land.
      </p>

      <h2 id="deemed-to-satisfy">Deemed-to-satisfy pathway</h2>
      <p>
        A deemed-to-satisfy proposal meets <strong>every</strong> criterion the
        Code sets for it in your zone. It is fast-tracked and cannot be refused
        planning consent. If a granny flat misses any criterion, for example on
        floor area or setbacks, it is performance assessed instead: assessed on
        its merits by an assessment manager or assessment panel, with a
        discretionary outcome.
      </p>
      <p>
        The criteria differ by zone, so we do not print lot sizes, setbacks or
        site coverage here: read them for your zone in the Code on PlanSA.
      </p>

      <h2 id="size">Size and the 2024 changes</h2>
      <p>
        The Ancillary Accommodation and Student Accommodation Definitions
        Review Code Amendment, reported by the Department for Housing and Urban
        Development on 22 November 2024, made two changes:
      </p>
      <ul>
        <li>the Code&rsquo;s maximum floor area for a granny flat rose from <strong>60 m² to 70 m²</strong>; and</li>
        <li>a granny flat no longer has to share a kitchen, bathroom or laundry with the house, so it can be fully self-contained.</li>
      </ul>

      <h2 id="owner-occupier">Who can live there, and renting it out</h2>
      <p>
        <strong>Anyone.</strong> Amended regulations in effect from 27
        November 2023 mean every existing granny flat can be leased or rented,
        and it is no longer an offence to rent one to anyone, even if its
        development approval limited use or occupation to the family of the
        main home&rsquo;s residents.
      </p>
      <p>
        We do not publish rent figures for granny flats: no official source
        reports their rents separately. Look up the rents in your suburb and
        run your own build cost and rent through the{" "}
        <Link href="/rental-yield-calculator">rental yield calculator</Link>.
      </p>

      <h2 id="costs">Costs of building a granny flat in SA</h2>
      <p>
        No official source publishes a granny flat price for South Australia.
        The nearest published rates are Archicentre Australia&rsquo;s, and its
        guide says to price an addition with wet areas as the shell plus the
        fit-outs. On that basis:
      </p>
      <GrannyFlatCostTable sizes={SIZES} state="South Australia" />
      <p>
        On building work that needs development approval and is worth{" "}
        <strong>$20,000 or more</strong>, the builder must take out{" "}
        <a href={BII_URL} target="_blank" rel="noopener noreferrer">building indemnity insurance</a>{" "}
        in your name (Building Work Contractors Act 1995; the threshold rose
        from $12,000 on 10 November 2025). Our{" "}
        <Link href="/guides/how-to-find-a-builder-australia">guide to finding a builder</Link>{" "}
        covers the licence check, and our{" "}
        <Link href="/guides/renovation-cost-australia-2026">renovation and extension costs per square metre</Link>{" "}
        guide has Adelaide&rsquo;s published figures.
      </p>

      <h2 id="tips">Practical tips</h2>
      <ul>
        <li><strong>Use PlanSA first:</strong> it holds the Code, the zone maps and the lodgement system. Start there before you engage a designer.</li>
        <li><strong>Pre-built and transportable units:</strong> a flat-packed or ready-made tiny home still needs development approval. A maker&rsquo;s claim that it &quot;meets council standards&quot; is not an approval.</li>
        <li><strong>Depreciation:</strong> a new dwelling you rent out has depreciation to claim. See our <Link href="/guides/property-depreciation-guide">Property Depreciation Guide</Link>.</li>
        <li><strong>Tenancy law:</strong> as a landlord you are bound by SA&rsquo;s residential tenancy laws; see <Link href="/guides/renters-rights-sa">Renter&rsquo;s Rights in SA</Link>.</li>
      </ul>

      <h2 id="other-states">Granny flat rules in other states</h2>
      <ul>
        <li><Link href="/guides/granny-flat-guide-nsw">Granny flat rules in NSW</Link></li>
        <li><Link href="/guides/granny-flat-guide-vic">Granny flat rules in Victoria</Link></li>
        <li><Link href="/guides/granny-flat-guide-qld">Granny flat rules in Queensland</Link></li>
        <li><Link href="/guides/granny-flat-guide-wa">Granny flat rules in WA</Link></li>
      </ul>

      <h2 id="resources">Resources</h2>
      <ul>
        <li>
          <strong>PlanSA</strong>, the Planning and Design Code, zone maps and lodgement:{" "}
          <a href="https://plan.sa.gov.au" target="_blank" rel="noopener noreferrer">plan.sa.gov.au</a>
        </li>
        <li>
          <strong>Consumer and Business Services SA</strong>, builder licences:{" "}
          <a href="https://www.cbs.sa.gov.au" target="_blank" rel="noopener noreferrer">cbs.sa.gov.au</a>
        </li>
      </ul>

      <Sources
        items={[
          {
            label: "City of Onkaparinga, Ancillary accommodation: granny flats, tiny homes and transportables (the Planning and Design Code definition; development approval under the PDI Act 2016; occupancy; $120,000 penalty)",
            href: ONKA_URL,
            note: "read 11 October 2026",
          },
          {
            label: "PlanSA, Assessment pathways (exempt, accepted, deemed-to-satisfy, performance assessed, restricted, impact assessed)",
            href: PATHWAYS_URL,
            note: "read 11 October 2026",
          },
          {
            label: "PlanSA, New planning rules secure granny flats for rental and boost design for new homes",
            href: RENT_URL,
            note: "published 27 November 2023; read 11 October 2026",
          },
          {
            label: "Department for Housing and Urban Development (SA), Bigger, more accessible granny flats (maximum floor area 60 to 70 m²; self-contained)",
            href: DHUD_URL,
            note: "22 November 2024; read 11 October 2026",
          },
          {
            label: "South Australian Government Financing Authority, Building Indemnity Insurance (threshold $20,000 from 10 November 2025)",
            href: BII_URL,
            note: "read 11 October 2026",
          },
          grannyFlatCostSource(),
        ]}
      />
    </GuideArticleLayout>
  );
}
