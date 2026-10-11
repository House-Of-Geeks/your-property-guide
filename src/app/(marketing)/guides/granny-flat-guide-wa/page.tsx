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

// Rewritten 11 Oct 2026 (commercial-intent review, 10 Oct 2026, F4). The page
// said an owner had to live on the lot in most WA councils
// and named no instrument; the R-Codes set no such condition and the State's
// own guidance says anyone can live in a granny flat. It also gave a size cap,
// a density-code rule and a 350 m2 minimum the 2024 amendments removed, plus
// unsourced rents and return claims. Rules below: State Planning Policy 7.3,
// Residential Design Codes Volume 1, version 3 published 10 April 2026, and
// the Department of Planning, Lands and Heritage granny flats info sheet,
// both read 11 October 2026.
const FRONTMATTER: GuideFrontmatter = {
  title: "Granny Flat Guide WA (2026): Rules, Costs and Approvals",
  h1: "Granny Flat Guide Western Australia: Rules, Costs & Approvals (2026)",
  description:
    "WA granny flats (ancillary dwellings) under the R-Codes Volume 1: the 70 m² limit, no minimum lot size, when no planning approval is needed, renting, costs.",
  slug: "granny-flat-guide-wa",
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

const RCODES_URL = "https://www.wa.gov.au/system/files/2026-08/r-codes-volume-1-10-april-2026.pdf";
const RCODES_PAGE = "https://www.wa.gov.au/government/document-collections/residential-design-codes";
const INFO_SHEET_URL = "https://www.wa.gov.au/system/files/2024-04/info-sheet-granny-flat.pdf";
const HII_URL = "https://www.wa.gov.au/system/files/2026-05/260158_dealing_with_building_challenges.pdf";
const SIZES = [40, 60, 70] as const;
const at70 = rangeText(grannyFlatBuildRange(70));

const TLDR = [
  "In Western Australia a granny flat is an ancillary dwelling, and the rules come from State Planning Policy 7.3, the Residential Design Codes Volume 1 (version 3, 10 April 2026), plus your council's local planning framework.",
  "The deemed-to-comply standard (clause 5.5.1 C1 in Part B, clause 2.8 in Part C): a maximum internal floor area of 70 m², one per site, behind the street setback line, and the house must still meet its open space and outdoor living requirements.",
  "There is no minimum lot size: the old 350 m² minimum was deleted by the amendment dated 10 April 2024.",
  "A granny flat that meets every deemed-to-comply requirement can be exempt from development (planning) approval. A building permit from your local government is still required.",
  "Anyone can live in it, from a relative to a tenant: the R-Codes set no owner-occupier condition.",
  `Building a 70 m² granny flat costs about ${at70} for the shell, roof, kitchen and bathroom, on Archicentre Australia's 2026 rates, before site works, connections and fees.`,
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is",          label: "What is an ancillary dwelling in WA?" },
  { id: "r-codes",          label: "R-Code requirements" },
  { id: "owner-occupier",   label: "Who can live there" },
  { id: "approval-process", label: "Approvals: planning and building" },
  { id: "costs",            label: "Costs of building a granny flat in WA" },
  { id: "rental-income",    label: "Renting it out" },
  { id: "tips",             label: "Practical tips for WA owners" },
  { id: "other-states",     label: "Granny flat rules in other states" },
  { id: "resources",        label: "Resources" },
];

const FAQS: FaqItem[] = [
  {
    question: "Do I have to live on the property to build a granny flat in WA?",
    answer:
      "No. The R-Codes Volume 1 define an ancillary dwelling as a self-contained dwelling on the same site as a dwelling, with no condition on who lives in either, and the Department of Planning, Lands and Heritage says anyone can live in one, from a relative to someone who rents it through an agent. Check your council's local planning policies and your title for any condition that applies to your lot.",
  },
  {
    question: "What's the maximum size for a granny flat in WA?",
    answer:
      "A maximum internal floor area of 70 m² under the deemed-to-comply requirements of the R-Codes Volume 1 (clause 5.5.1 C1 for lower-density codes, clause 2.8 and Table 2.8a for medium-density codes; version 3, 10 April 2026). A larger one is assessed against the design principles and needs development approval.",
  },
  {
    question: "What size block do I need for a granny flat in WA?",
    answer:
      "There is no minimum. The R-Codes amendment dated 10 April 2024 deleted the 350 m² minimum lot size, so a compliant granny flat can go on a lot of any size, provided the house still meets its open space and outdoor living area requirements.",
  },
  {
    question: "Do I need planning approval as well as a building permit?",
    answer:
      "Not if the granny flat meets all the relevant deemed-to-comply requirements, including the 70 m² limit and the setbacks in your local planning scheme: it can then be exempt from development approval. You always need a building permit from your local government and must comply with the National Construction Code (Department of Planning, Lands and Heritage).",
  },
  {
    question: "Does a granny flat in WA need its own parking bay?",
    answer:
      "In most cases no. The State's 2024 changes mean an ancillary dwelling usually needs no parking bay, except in some densities and in locations far from public transport, where clause 5.3.3 C3.1 of the R-Codes applies.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Granny Flat Guide NSW",           href: "/guides/granny-flat-guide-nsw", description: "Secondary dwellings under the Housing SEPP 2021." },
  { title: "Granny Flat Guide VIC",           href: "/guides/granny-flat-guide-vic", description: "Small second dwellings under Amendment VC253." },
  { title: "Granny Flat Guide QLD",           href: "/guides/granny-flat-guide-qld", description: "Secondary dwellings under the Planning Regulation 2017." },
  { title: "Granny Flat Guide SA",            href: "/guides/granny-flat-guide-sa",  description: "Ancillary accommodation under the Planning and Design Code." },
  { title: "Property Depreciation Guide",     href: "/guides/property-depreciation-guide", description: "Deductions on a new ancillary dwelling." },
  { title: "Renter's Rights in WA",           href: "/guides/renters-rights-wa", description: "Tenant entitlements when you rent the dwelling out." },
];

export default function GrannyFlatGuideWAPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
      sourced
    >
      <Callout variant="warning" title="Check your council's local planning framework">
        <p>
          The R-Codes apply state-wide, but a local planning policy, a local
          development plan or your planning scheme can vary some of them, and
          an exemption depends on your lot meeting every deemed-to-comply
          requirement. Ask your local government before you commit.
        </p>
      </Callout>

      <h2 id="what-is">What is an ancillary dwelling in WA?</h2>
      <p className="lead">
        In Western Australia a granny flat is an <strong>ancillary
        dwelling</strong>. The{" "}
        <a href={RCODES_URL} target="_blank" rel="noopener noreferrer">Residential Design Codes Volume 1</a>{" "}
        (State Planning Policy 7.3) define it as a self-contained dwelling on
        the same site as a dwelling, which may be attached to, integrated with
        or detached from that dwelling.
      </p>
      <p>
        The R-Codes are published by the Western Australian Planning
        Commission and applied by local government. Version 3 of Volume 1 was
        published on 10 April 2026. Part B covers single houses coded R40 and
        below and grouped dwellings R25 and below; Part C covers single houses
        R50 and above and grouped dwellings R30 and above.
      </p>

      <h2 id="r-codes">R-Code requirements</h2>
      <p>
        Under clause 5.5.1 C1 (Part B), an ancillary dwelling associated with a
        single house or grouped dwelling on the same site is deemed to comply
        where:
      </p>
      <ul>
        <li>it has a maximum internal floor area of <strong>70 m²</strong>;</li>
        <li>parking is provided in accordance with clause 5.3.3 C3.1;</li>
        <li>it is located behind the street setback line;</li>
        <li>it does not stop the house from meeting the required minimum open space and outdoor living area; and</li>
        <li>it complies with the other R-Code provisions as they apply to single houses and grouped dwellings.</li>
      </ul>
      <p>
        Clause 2.8 and Table 2.8a (Part C, medium-density codes) allow one
        ancillary dwelling per site for a single house or grouped dwelling,
        also with a maximum internal floor area of 70 m².
      </p>
      <p>
        The amendment dated 10 April 2024 deleted the old minimum lot size of
        350 m² (the former clause 5.5.1 C1 i), so a compliant granny flat can
        go on a lot of any size.
      </p>

      <h2 id="owner-occupier">Who can live there</h2>
      <p>
        <strong>Anyone.</strong> The R-Codes set no owner-occupier or family
        condition, and the Department of Planning, Lands and Heritage&rsquo;s
        granny flats info sheet says anyone can live in an ancillary dwelling,
        from a relative or friend to someone unknown to you who rents it
        through you or an agent. A local planning policy or a covenant on your
        title can add conditions, so check both for your lot.
      </p>

      <h2 id="approval-process">Approvals: planning and building</h2>
      <ol>
        <li>
          <strong>Development (planning) approval, often not needed.</strong> A
          granny flat that meets all the relevant deemed-to-comply
          requirements, including the 70 m² limit and the setback
          requirements of your local planning scheme, can be exempt from
          development approval. One that relies on the design principles
          instead needs development approval from your local government.
        </li>
        <li>
          <strong>Building permit, always.</strong> You still need a building
          permit from your local government, and the work must comply with the
          National Construction Code.
        </li>
      </ol>

      <h2 id="costs">Costs of building a granny flat in WA</h2>
      <p>
        No official source publishes a granny flat price for Western
        Australia. The nearest published rates are Archicentre
        Australia&rsquo;s, and its guide says to price an addition with wet
        areas as the shell plus the fit-outs. On that basis:
      </p>
      <GrannyFlatCostTable sizes={SIZES} state="Western Australia" />
      <p>
        On residential building work valued over <strong>$20,000</strong>, the
        builder must take out{" "}
        <a href={HII_URL} target="_blank" rel="noopener noreferrer">home indemnity insurance</a>{" "}
        in your name before taking any payment or starting work. Our{" "}
        <Link href="/guides/how-to-find-a-builder-australia">guide to finding a builder</Link>{" "}
        covers the registration check, and our{" "}
        <Link href="/guides/renovation-cost-australia-2026">renovation and extension costs per square metre</Link>{" "}
        guide has Perth&rsquo;s published adjustments.
      </p>

      <h2 id="rental-income">Renting it out</h2>
      <p>
        We do not publish rent figures for granny flats: no official source
        reports their rents separately. Look up the rents in your suburb and
        run your own build cost and rent through the{" "}
        <Link href="/rental-yield-calculator">rental yield calculator</Link>.
        As a landlord you are bound by WA&rsquo;s residential tenancy laws; see{" "}
        <Link href="/guides/renters-rights-wa">Renter&rsquo;s Rights in WA</Link>{" "}
        for the tenant&rsquo;s side.
      </p>

      <h2 id="tips">Practical tips for WA granny flat owners</h2>
      <ul>
        <li><strong>Check your title first:</strong> a restrictive covenant can rule out a second dwelling. Your conveyancer or Landgate can check before you pay for plans.</li>
        <li><strong>Grouped dwellings and strata lots:</strong> since 2024 an ancillary dwelling is allowed with a grouped dwelling at every density code in Volume 1, but the strata company&rsquo;s by-laws can still apply.</li>
        <li><strong>Tax:</strong> rent is taxable income, and a new build has depreciation to claim; an accountant can set it up. See our <Link href="/guides/property-depreciation-guide">property depreciation guide</Link>.</li>
        <li><strong>Insurance:</strong> update your building insurance to cover the ancillary dwelling, and consider landlord insurance if you rent it.</li>
      </ul>

      <h2 id="other-states">Granny flat rules in other states</h2>
      <ul>
        <li><Link href="/guides/granny-flat-guide-nsw">Granny flat rules in NSW</Link></li>
        <li><Link href="/guides/granny-flat-guide-vic">Granny flat rules in Victoria</Link></li>
        <li><Link href="/guides/granny-flat-guide-qld">Granny flat rules in Queensland</Link></li>
        <li><Link href="/guides/granny-flat-guide-sa">Granny flat rules in South Australia</Link></li>
      </ul>

      <h2 id="resources">Resources</h2>
      <ul>
        <li>
          <strong>Residential Design Codes</strong> (Department of Planning,
          Lands and Heritage):{" "}
          <a href={RCODES_PAGE} target="_blank" rel="noopener noreferrer">wa.gov.au</a>
        </li>
        <li>
          <strong>Landgate</strong>, property title and land information:{" "}
          <a href="https://www.landgate.wa.gov.au" target="_blank" rel="noopener noreferrer">landgate.wa.gov.au</a>
        </li>
        <li>
          <strong>Building and Energy</strong>, the building regulator, and its
          register of building service providers:{" "}
          <a href="https://www.wa.gov.au/organisation/building-and-energy/building-and-energy" target="_blank" rel="noopener noreferrer">wa.gov.au</a>
        </li>
      </ul>

      <Sources
        items={[
          {
            label: "Western Australian Planning Commission, State Planning Policy 7.3 Residential Design Codes Volume 1, version 3 (clause 5.5.1, clause 2.8 and Table 2.8a, Appendix 1 definitions)",
            href: RCODES_URL,
            note: "published 10 April 2026; read 11 October 2026",
          },
          {
            label: "Department of Planning, Lands and Heritage, Granny flats info sheet (who can live there, exemption from planning approval, building permit, parking)",
            href: INFO_SHEET_URL,
            note: "April 2024; read 11 October 2026",
          },
          {
            label: "Department of Local Government, Industry Regulation and Safety, Dealing with building challenges (home indemnity insurance on residential building work over $20,000)",
            href: HII_URL,
            note: "April 2026; read 11 October 2026",
          },
          grannyFlatCostSource(),
        ]}
      />
    </GuideArticleLayout>
  );
}
