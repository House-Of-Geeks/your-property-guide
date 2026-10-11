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

// Rewritten 11 Oct 2026 (commercial-intent review, 10 Oct 2026, F3 and F3b).
// The page said most projects need a council development application and
// named no instrument, and printed an unsourced rental market figure, yields and
// a return claim. The rules below come from the Planning Regulation
// 2017 (reprint current from 11 September 2026) and the Queensland
// Government's secondary dwellings page (last updated 21 July 2026), the
// home warranty threshold from the QBCC, all read 11 October 2026.
// Brisbane's own limits are not printed: the council's fact sheet now
// redirects to Major amendment package L, which proposes new secondary
// dwelling rules, so we could not confirm the limits in force today.
const FRONTMATTER: GuideFrontmatter = {
  title: "Secondary Dwellings QLD (2026): Granny Flat Rules and Costs",
  h1: "Granny flats (secondary dwellings) in Queensland: rules, costs and renting one out (2026)",
  description:
    "Queensland granny flat rules: a secondary dwelling under the Planning Regulation 2017, renting it to anyone since 2022, the approvals you need, and costs.",
  slug: "granny-flat-guide-qld",
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

const REG_URL = "https://www.legislation.qld.gov.au/view/whole/html/inforce/current/sl-2017-0078";
const QLD_GOV_URL = "https://www.planning.qld.gov.au/planning-issues-and-interests/granny-flats";
const QBCC_URL = "https://www.qbcc.qld.gov.au/running-your-business/home-warranty-insurance-obligations/what-work-requires-insurance";
const BCC_URL = "https://www.brisbane.qld.gov.au/building-and-planning/planning-and-design/city-plan-amendments/major-amendment-package-l";
const SIZES = [40, 60] as const;
const at60 = rangeText(grannyFlatBuildRange(60));

const TLDR = [
  "In Queensland a granny flat is a secondary dwelling: a dwelling on a lot used in conjunction with, but subordinate to, another dwelling on the lot (Planning Regulation 2017, Schedule 24). A house with one is still a 'dwelling house'.",
  "Since 26 September 2022 a secondary dwelling can be rented to anyone, whether or not they are related to the household in the main house.",
  "Every new secondary dwelling needs building approval from a building certifier. Whether it also needs a development approval depends on your council's planning scheme.",
  "Renting out an existing granny flat can trigger extra fire safety and sound separation requirements of the building code.",
  "Residential building work in Queensland over $3,300 (labour, materials and GST) must be covered by the Queensland Home Warranty Scheme (QBCC).",
  `Building a 60 m² granny flat costs about ${at60} for the shell, roof, kitchen and bathroom, on Archicentre Australia's 2026 rates, before site works, connections and fees.`,
];

const TOC: GuideTOCEntry[] = [
  { id: "overview",  label: "Secondary dwellings in Queensland" },
  { id: "renting",   label: "Can you rent out a granny flat in Queensland?" },
  { id: "approval",  label: "Approval: building approval and, sometimes, a development application" },
  { id: "brisbane",  label: "Brisbane City Council" },
  { id: "modular",   label: "Granny flat or modular home?" },
  { id: "costs",     label: "What a granny flat costs in Queensland" },
  { id: "other-states", label: "Granny flat rules in other states" },
];

const FAQS: FaqItem[] = [
  {
    question: "Do you need council approval for a granny flat in QLD?",
    answer:
      "You always need building approval from a building certifier. Whether you also need a development approval from the council depends on its planning scheme: the Queensland Government says to check with your council, because that has not changed. A proposal that meets the scheme's requirements may need no development application; one that does not will. (Queensland Government secondary dwellings page, last updated 21 July 2026.)",
  },
  {
    question: "Can I rent out my granny flat in Queensland?",
    answer:
      "Yes. An amendment to the Planning Regulation 2017 that took effect on 26 September 2022 removed restrictions on who can live in a secondary dwelling, so it can be rented to anyone. If an older development approval has conditions that restrict occupancy, you may need to apply to change them under the Planning Act 2016. Renting it out may also trigger extra fire and sound separation requirements, so check with a building certifier first.",
  },
  {
    question: "What is a secondary dwelling in Queensland?",
    answer:
      "Schedule 24 of the Planning Regulation 2017 defines it as a dwelling on a lot that is used in conjunction with, but subordinate to, another dwelling on the lot, whether or not it is attached to that dwelling or occupied by people related to its household. A dwelling house can include one secondary dwelling.",
  },
  {
    question: "What is the difference between a granny flat and a dual occupancy?",
    answer:
      "A secondary dwelling is used with, and subordinate to, the main dwelling and cannot be developed on its own. A dual occupancy is two dwellings on one lot, or on two lots sharing common property, and they can be of similar size (Queensland Government, read 11 October 2026).",
  },
  {
    question: "Do I need home warranty insurance for a granny flat in Queensland?",
    answer:
      "If a licensed contractor builds it, yes: most residential building work valued at more than $3,300, including materials, labour and GST, must have cover under the Queensland Home Warranty Scheme, and the premium is built into the contract price (QBCC, read 11 October 2026).",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Granny Flat Guide NSW",           href: "/guides/granny-flat-guide-nsw", description: "Secondary dwellings under the Housing SEPP 2021." },
  { title: "Granny Flat Guide VIC",           href: "/guides/granny-flat-guide-vic", description: "Small second dwellings under Amendment VC253." },
  { title: "Granny Flat Guide WA",            href: "/guides/granny-flat-guide-wa",  description: "Ancillary dwellings under the R-Codes Volume 1." },
  { title: "Granny Flat Guide SA",            href: "/guides/granny-flat-guide-sa",  description: "Ancillary accommodation under the Planning and Design Code." },
  { title: "Property Depreciation Guide",     href: "/guides/property-depreciation-guide", description: "Deductions on a new granny flat you rent out." },
  { title: "Rental Yield Calculator",         href: "/rental-yield-calculator", description: "Run gross and net yield on your own build cost and rent." },
];

export default function GrannyFlatGuideQLDPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
      sourced
    >
      <Callout variant="warning" title="Your council's planning scheme decides the planning side">
        <p>
          State law defines a secondary dwelling and lets anyone rent one.
          Whether yours needs a development approval, and how big it can be,
          is set by your council&rsquo;s planning scheme. Check it before you
          pay for a design.
        </p>
      </Callout>

      <h2 id="overview">Secondary dwellings in Queensland</h2>
      <p className="lead">
        In Queensland a granny flat is a <strong>secondary dwelling</strong>.
        Schedule 24 of the{" "}
        <a href={REG_URL} target="_blank" rel="noopener noreferrer">Planning Regulation 2017</a>{" "}
        defines it as a dwelling on a lot that is used in conjunction with, but
        subordinate to, another dwelling on the lot, whether or not it is
        attached to that dwelling, and whether or not the people in it are
        related to the household of the other dwelling.
      </p>
      <p>
        The same schedule defines a <strong>dwelling house</strong> as one
        dwelling, or two dwellings of which one is a secondary dwelling, with
        their outbuildings. So a house with a granny flat is still a dwelling
        house, which is why planning schemes deal with granny flats in their
        dwelling house rules.
      </p>

      <h2 id="renting">Can you rent out a granny flat in Queensland?</h2>
      <p>
        <strong>Yes.</strong> An amendment to the Planning Regulation that took
        effect on 26 September 2022 removed restrictions on who can live in a
        secondary dwelling. It can be rented to anyone, related to the main
        household or not, in every council area.
      </p>
      <ul>
        <li>If your granny flat did not need planning approval, or its approval has no occupancy condition, you can rent it out now.</li>
        <li>If its approval restricts who can live there, you may need a change application under the Planning Act 2016; ask your council.</li>
        <li>Renting it out can trigger extra fire safety and sound transmission requirements of the building code. Ask a building certifier before you sign a lease.</li>
      </ul>
      <p>
        We do not publish rent or yield figures for granny flats: no official
        source reports their rents separately. Look up the rents in your
        suburb and run your own numbers in the{" "}
        <Link href="/rental-yield-calculator">rental yield calculator</Link>.
        Tenancy agreements come from the Residential Tenancies Authority.
      </p>

      <h2 id="approval">Approval: building approval and, sometimes, a development application</h2>
      <ol>
        <li>
          <strong>Building approval, always.</strong> Any new secondary dwelling
          needs building approval from a building certifier (private or
          council), licensed by the QBCC. So does converting an existing
          structure into one.
        </li>
        <li>
          <strong>Development approval, depending on the planning scheme.</strong>{" "}
          The Queensland Government says to speak with your council to find out
          whether you need a development approval before you build. Planning
          schemes typically set size, siting and design requirements for a
          dwelling house with a secondary dwelling: a proposal that meets them
          may need no development application, and one that departs from them
          needs one.
        </li>
      </ol>

      <h2 id="brisbane">Brisbane City Council</h2>
      <p>
        In Brisbane the requirements sit in the Dwelling house code (and the
        Dwelling house (small lot) code) of Brisbane City Plan 2014. Council
        has proposed new rules for secondary dwellings in{" "}
        <a href={BCC_URL} target="_blank" rel="noopener noreferrer">Major amendment package L</a>,
        including a size limit tied to the site area, a 50% site cover and a
        single storey where the granny flat is detached. Public consultation
        ran from 3 November to 1 December 2025, and council expected to adopt
        the amendment in mid to late 2026. Because the rules are changing, we
        do not print Brisbane&rsquo;s size or lot limits here: check the
        current version of City Plan online, or ask council, before you
        design.
      </p>
      <p>
        Gold Coast, Sunshine Coast, Moreton Bay and every other council has its
        own planning scheme with its own rules.
      </p>

      <h2 id="modular">Granny flat or modular home?</h2>
      <p>
        &quot;Modular&quot; describes how a granny flat is built (in a factory,
        then craned onto the site), not what it is under planning law. A
        modular granny flat is still a secondary dwelling: it needs the same
        building approval and the same check against your council&rsquo;s
        planning scheme, plus a slab or footings, connections and site works
        on your block.
      </p>

      <h2 id="costs">What a granny flat costs in Queensland</h2>
      <p>
        No official source publishes a granny flat price for Queensland. The
        nearest published rates are Archicentre Australia&rsquo;s, and its
        guide says to price an addition with wet areas as the shell plus the
        fit-outs. On that basis:
      </p>
      <GrannyFlatCostTable sizes={SIZES} state="Queensland" />
      <p>
        Most residential building work in Queensland valued at more than{" "}
        <strong>$3,300</strong> (including materials, labour and GST) must have
        cover under the{" "}
        <a href={QBCC_URL} target="_blank" rel="noopener noreferrer">Queensland Home Warranty Scheme</a>,
        and the premium is built into the contract price. Our{" "}
        <Link href="/guides/how-to-find-a-builder-australia">guide to finding a builder</Link>{" "}
        covers the licence check, and our{" "}
        <Link href="/guides/renovation-cost-australia-2026">renovation and extension costs per square metre</Link>{" "}
        guide has Brisbane&rsquo;s published adjustments.
      </p>

      <h2 id="other-states">Granny flat rules in other states</h2>
      <ul>
        <li><Link href="/guides/granny-flat-guide-nsw">Granny flat rules in NSW</Link></li>
        <li><Link href="/guides/granny-flat-guide-vic">Granny flat rules in Victoria</Link></li>
        <li><Link href="/guides/granny-flat-guide-wa">Granny flat rules in WA</Link></li>
        <li><Link href="/guides/granny-flat-guide-sa">Granny flat rules in South Australia</Link></li>
      </ul>

      <Sources
        items={[
          {
            label: "Planning Regulation 2017 (Qld), Schedule 24 Dictionary: dwelling house, secondary dwelling, household",
            href: REG_URL,
            note: "reprint current from 11 September 2026; read 11 October 2026",
          },
          {
            label: "Queensland Government, Department of State Development, Infrastructure and Planning, Secondary dwellings providing housing solutions (renting to anyone from 26 September 2022; building and development approval; fire and sound requirements)",
            href: QLD_GOV_URL,
            note: "last updated 21 July 2026; read 11 October 2026",
          },
          {
            label: "Queensland Building and Construction Commission, What work requires insurance (Queensland Home Warranty Scheme, work over $3,300)",
            href: QBCC_URL,
            note: "read 11 October 2026",
          },
          {
            label: "Brisbane City Council, Major amendment package L (proposed secondary dwelling changes; consultation 3 November to 1 December 2025)",
            href: BCC_URL,
            note: "read 11 October 2026",
          },
          grannyFlatCostSource(),
        ]}
      />
    </GuideArticleLayout>
  );
}
