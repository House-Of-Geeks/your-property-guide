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

// Rewritten 11 Oct 2026 (commercial-intent review, 10 Oct 2026, F1): the page
// predated Amendment VC253 and still said a granny flat needs a council
// planning permit. Every rule below is from the Department of Transport and
// Planning's "Small second homes" page (last updated 26 March 2026), read
// 11 October 2026. Unsourced cost, rent, yield and timeline figures removed.
const FRONTMATTER: GuideFrontmatter = {
  title: "Granny Flat Rules Victoria (2026): Small Second Dwellings",
  h1: "Granny flats in Victoria: small second dwelling rules, permits and costs (2026)",
  description:
    "Victoria's granny flat rules since VC253: up to 60 m², no planning permit on most lots, a building permit always, who can live there, and build costs.",
  slug: "granny-flat-guide-vic",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-11",
  readingTimeMinutes: 6,
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

const DTP_URL = "https://www.planning.vic.gov.au/guides-and-resources/strategies-and-initiatives/small-second-dwellings";
const SIZES = [40, 60] as const;
const at60 = rangeText(grannyFlatBuildRange(60));

const TLDR = [
  "Since 14 December 2023 (Amendment VC253), a granny flat in Victoria is a small second dwelling: no more than 60 m² of gross floor area, on the same lot as an existing home, with a kitchen sink, food preparation facilities, a bath or shower, a toilet and a wash basin.",
  "Most small second dwellings in residential and rural zones need no planning permit, unless a flooding, environmental or other special planning control applies to the land.",
  "On a lot under 300 m² in a residential zone (other than the Low Density Residential Zone) a planning permit is still required, assessed against clause 54 of the planning scheme.",
  "A building permit is always required. A small second dwelling cannot be subdivided or sold separately from the main home, must not connect to reticulated natural gas, and needs no car parking space.",
  "Anyone can live in it or rent it: a family member, a dependent person or someone unrelated.",
  `Building a 60 m² granny flat costs about ${at60} for the shell, roof, kitchen and bathroom, on Archicentre Australia's 2026 rates, before site works, connections and fees.`,
];

const TOC: GuideTOCEntry[] = [
  { id: "overview",        label: "What counts as a small second dwelling" },
  { id: "planning",        label: "When you need a planning permit" },
  { id: "building-permit", label: "The building permit" },
  { id: "rental",          label: "Who can live in it, and renting it out" },
  { id: "dpu",             label: "Dependent person's units" },
  { id: "costs",           label: "What a granny flat costs to build" },
  { id: "other-states",    label: "Granny flat rules in other states" },
];

const FAQS: FaqItem[] = [
  {
    question: "Do I need a planning permit for a granny flat in Victoria?",
    answer:
      "Usually not, if it is a small second dwelling of 60 m² or less. Since Amendment VC253 (14 December 2023) most small second dwellings in residential and rural zones need no planning permit, unless a flooding, environmental or other special planning control applies. A permit is still needed on a lot under 300 m² in a residential zone other than the Low Density Residential Zone. A building permit is always required (Department of Transport and Planning, read 11 October 2026).",
  },
  {
    question: "How big can a granny flat be in Victoria?",
    answer:
      "A small second dwelling has a gross floor area of 60 m² or less. Anything larger is not a small second dwelling, so the VC253 permit exemption does not apply; ask your council which permit it needs before you design it.",
  },
  {
    question: "Can I rent out a granny flat in Victoria?",
    answer:
      "Yes. The Department of Transport and Planning says anyone can live in or rent out a small second home, including a family member, a dependent person or unrelated people. The rental minimum standards that apply to any home, such as room sizes, facilities and smoke alarms, apply to it too; Consumer Affairs Victoria has the detail.",
  },
  {
    question: "Can a granny flat be subdivided or sold separately in Victoria?",
    answer:
      "No. A small second dwelling cannot be subdivided or sold separately from the main home.",
  },
  {
    question: "What happened to dependent person's units?",
    answer:
      "Amendment VC253 removed the dependent person's unit from the planning schemes. Transitional provisions at clause 52.04, extended by VC259, VC266 and VC304, let new applications be made until 28 March 2027. Existing lawful units stay lawful.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Granny Flat Guide NSW",           href: "/guides/granny-flat-guide-nsw", description: "Secondary dwellings under the Housing SEPP 2021." },
  { title: "Granny Flat Guide QLD",           href: "/guides/granny-flat-guide-qld", description: "Secondary dwellings under the Planning Regulation 2017." },
  { title: "Granny Flat Guide WA",            href: "/guides/granny-flat-guide-wa",  description: "Ancillary dwellings under the R-Codes Volume 1." },
  { title: "Granny Flat Guide SA",            href: "/guides/granny-flat-guide-sa",  description: "Ancillary accommodation under the Planning and Design Code." },
  { title: "Renovation Cost in Australia",    href: "/guides/renovation-cost-australia-2026", description: "Kitchen, bathroom and extension costs per square metre." },
  { title: "Renter's Rights in Victoria",     href: "/guides/renters-rights-vic", description: "Tenant entitlements when you rent the granny flat." },
];

export default function GrannyFlatGuideVICPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
      sourced
    >
      <Callout variant="info" title="Updated for Amendment VC253">
        <p>
          This guide was rewritten on 11 October 2026. Earlier versions said a
          granny flat in Victoria usually needs a council planning permit. That
          stopped being true for most small second dwellings on 14 December
          2023. Check your own lot&rsquo;s zone and overlays before you design.
        </p>
      </Callout>

      <h2 id="overview">What counts as a small second dwelling</h2>
      <p className="lead">
        In Victoria a granny flat is a <strong>small second dwelling</strong>.
        Amendment VC253 created the term on 14 December 2023, together with the
        Building Amendment (Small Second Dwellings) Regulations 2023, which
        changed the Building Regulations 2018 so the planning and building
        approvals line up.
      </p>
      <p>A small second dwelling must:</p>
      <ul>
        <li>have a gross floor area of <strong>60 m² or less</strong>;</li>
        <li>be on the same lot as an existing dwelling;</li>
        <li>be used as a self-contained residence, with a kitchen sink, food preparation facilities, a bath or shower, and a toilet and wash basin;</li>
        <li>meet the siting, design and amenity requirements of the planning scheme and building regulations.</li>
      </ul>
      <p>
        It must not be connected to reticulated natural gas, and it does not
        need a car parking space. It cannot be subdivided or sold separately
        from the main home.
      </p>

      <h2 id="planning">When you need a planning permit</h2>
      <p>
        A small second dwelling can be built on most properties in residential
        and rural zones <strong>without a planning permit</strong>. You still
        need one when:
      </p>
      <ul>
        <li>a flooding, environmental or other special planning control (an overlay) applies to the land and requires one; or</li>
        <li>the lot is under <strong>300 m²</strong> and in a residential zone other than the Low Density Residential Zone. Clause 54 of the planning scheme then applies, and its assessment forms part of the permit. Amendment VC282 changed clause 54&rsquo;s standards from 8 September 2025.</li>
      </ul>
      <p>
        Look up your lot&rsquo;s zone and overlays on the Victorian
        Government&rsquo;s online planning maps before you pay for a design,
        then confirm with your council if an overlay applies.
      </p>

      <h2 id="building-permit">The building permit</h2>
      <p>
        <strong>A building permit is always required.</strong> On a lot over
        300 m² in a residential zone, the siting and amenity standards are
        assessed through the building permit rather than a planning permit,
        under Part 5 of the Building Regulations 2018. The Building and
        Plumbing Commission&rsquo;s practice note SI 03 covers small second
        dwellings, and Minister&rsquo;s Guideline MG-12 sets out how a variation
        to those siting requirements is considered.
      </p>
      <p>
        Choosing who builds it matters as much as the permit. Our{" "}
        <Link href="/guides/how-to-find-a-builder-australia">guide to finding a builder</Link>{" "}
        has the licence check and the home warranty insurance thresholds for
        each state.
      </p>

      <h2 id="rental">Who can live in it, and renting it out</h2>
      <p>
        Anyone can live in a small second dwelling or rent it: a family member,
        a dependent person or someone unrelated. If you rent it out, the
        residential tenancy requirements that apply to any rented home apply
        to it too, including room sizes, facilities and smoke alarms. Consumer
        Affairs Victoria sets those out, and our{" "}
        <Link href="/guides/renters-rights-vic">renters&rsquo; rights guide for Victoria</Link>{" "}
        covers the tenant&rsquo;s side.
      </p>
      <p>
        We do not publish rent or yield figures for granny flats: no official
        source reports rents for them separately. Look up the rents in your
        suburb, then run your own numbers in the{" "}
        <Link href="/rental-yield-calculator">rental yield calculator</Link>.
      </p>

      <h2 id="dpu">Dependent person&rsquo;s units</h2>
      <p>
        A dependent person&rsquo;s unit is a movable building on the same lot as
        an existing dwelling, used to house someone dependent on a resident of
        that dwelling. VC253 removed the term from the planning schemes.
        Transitional provisions at clause 52.04, introduced by VC259 and
        extended by VC266 and VC304, allow new applications until{" "}
        <strong>28 March 2027</strong>. Existing lawful units remain lawful, and
        a unit that meets every small second dwelling requirement may be
        converted to one; ask your council.
      </p>

      <h2 id="costs">What a granny flat costs to build</h2>
      <p>
        No official source publishes a granny flat price for Victoria. The
        nearest published rates are Archicentre Australia&rsquo;s, and its guide
        says to price an addition with wet areas as the shell plus the
        fit-outs. On that basis:
      </p>
      <GrannyFlatCostTable sizes={SIZES} state="Victoria" />
      <p>
        For the wider picture, including extension and renovation costs per
        square metre by state, see our{" "}
        <Link href="/guides/renovation-cost-australia-2026">renovation cost guide</Link>.
      </p>

      <h2 id="other-states">Granny flat rules in other states</h2>
      <ul>
        <li><Link href="/guides/granny-flat-guide-nsw">Granny flat rules in NSW</Link></li>
        <li><Link href="/guides/granny-flat-guide-qld">Granny flat rules in Queensland</Link></li>
        <li><Link href="/guides/granny-flat-guide-wa">Granny flat rules in WA</Link></li>
        <li><Link href="/guides/granny-flat-guide-sa">Granny flat rules in South Australia</Link></li>
      </ul>

      <Sources
        items={[
          {
            label: "Department of Transport and Planning (Victoria), Small second homes: definition, planning and building permits, occupancy, dependent person's units, clause 54 and VC282",
            href: DTP_URL,
            note: "page last updated 26 March 2026; read 11 October 2026",
          },
          grannyFlatCostSource(),
        ]}
      />
    </GuideArticleLayout>
  );
}
