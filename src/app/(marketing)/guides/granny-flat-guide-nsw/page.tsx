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

// Rewritten 11 Oct 2026 (commercial-intent review, 10 Oct 2026, F2 and F2b).
// The page named the wrong instrument (the low rise housing code it cited
// covers dual occupancies, manor houses and terraces) and printed unsourced
// yield and value-uplift claims. Every rule below is from the State
// Environmental Planning Policy (Housing) 2021, Chapter 3, Part 1 and
// Schedule 1, version in force from 11 September 2026, read 10 October 2026.
const FRONTMATTER: GuideFrontmatter = {
  title: "Granny Flat Guide NSW: Rules, Costs & Rental Returns (2026)",
  description:
    "Granny flats in NSW under the Housing SEPP 2021: the 60 m² cap, the 450 m² lot and 12 m frontage for a CDC, renting it out, and what one costs to build.",
  slug: "granny-flat-guide-nsw",
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

const SEPP_URL = "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2021-0714";
const SIZES = [40, 60] as const;
const at60 = rangeText(grannyFlatBuildRange(60));

const TLDR = [
  "In NSW a granny flat is a secondary dwelling under the State Environmental Planning Policy (Housing) 2021, Chapter 3, Part 1, which applies in residential zones R1 to R5 wherever a dwelling house is permitted.",
  "Floor area: no more than 60 m², or more where another planning instrument (usually your council's LEP) allows it (section 52; Schedule 1, section 4).",
  "A certifier can approve it as complying development (a CDC, no council DA) on a lot of at least 450 m² in a residential zone other than R5, at least 12 m wide at the building line on a lot of up to 900 m², if it meets every Schedule 1 standard (section 54).",
  "A lot developed under this Part cannot be subdivided, so the granny flat cannot be sold on its own title (section 51).",
  "The Housing SEPP sets no condition on who lives in either dwelling, so you can rent the granny flat, the house or both.",
  `Building a 60 m² granny flat costs about ${at60} for the shell, roof, kitchen and bathroom, on Archicentre Australia's 2026 rates, before site works, connections and fees.`,
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is",          label: "What is a granny flat in NSW?" },
  { id: "complying-dev",    label: "Complying development: the CDC route" },
  { id: "requirements",     label: "Lot, size and setback standards" },
  { id: "approval-pathway", label: "CDC or development application" },
  { id: "costs",            label: "What a granny flat costs to build" },
  { id: "costs-outside",    label: "Costs outside the build price" },
  { id: "owner-occupier",   label: "Who can live there, and renting it out" },
  { id: "disadvantages",    label: "Disadvantages of a granny flat" },
  { id: "finance",          label: "Financing your granny flat" },
  { id: "other-states",     label: "Granny flat rules in other states" },
];

const FAQS: FaqItem[] = [
  {
    question: "Do I need to live on the property to build a granny flat in NSW?",
    answer:
      "No. Chapter 3, Part 1 of the State Environmental Planning Policy (Housing) 2021, which governs secondary dwellings, sets no condition on who lives in the principal dwelling or the granny flat. You can rent either or both. Check your title for any private covenant before you design.",
  },
  {
    question: "What's the maximum size for a granny flat in NSW?",
    answer:
      "60 m² of floor area, or a larger area if another environmental planning instrument (usually your council's LEP) permits it (Housing SEPP 2021, section 52 and Schedule 1, section 4). For a CDC the principal dwelling, granny flat and attached structures together are also capped: 330 m² on a lot of 450 to 600 m², 380 m² up to 900 m² and 430 m² above that.",
  },
  {
    question: "What size block do I need for a granny flat in NSW?",
    answer:
      "For complying development (a CDC from a certifier) the lot must be at least 450 m² and in a residential zone other than R5, and at least 12 m wide at the building line if it is 450 to 900 m² (15 m up to 1,500 m², 18 m above). Through a council DA, a detached granny flat on a site of at least 450 m² meets the Housing SEPP's non-discretionary standard, so the council cannot demand a larger site.",
  },
  {
    question: "Can I sell the granny flat separately from the main house?",
    answer:
      "No. Section 51 of the Housing SEPP 2021 says development consent must not be granted to subdivide a lot developed under its secondary dwelling Part, so the granny flat stays on the same title as the house.",
  },
  {
    question: "Is a granny flat complying development in NSW?",
    answer:
      "It can be. Under section 54 of the Housing SEPP 2021 a detached or attached granny flat is complying development if the lot is in a residential zone other than R5, is at least 450 m², meets the general requirements of the Codes SEPP (clauses 1.17A and 1.18) and is not on land excluded by clause 1.19, and the design meets every standard in Schedule 1. Otherwise it needs a development application to the council.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Granny Flat Guide VIC",           href: "/guides/granny-flat-guide-vic", description: "Small second dwellings under Amendment VC253." },
  { title: "Granny Flat Guide QLD",           href: "/guides/granny-flat-guide-qld", description: "Secondary dwellings under the Planning Regulation 2017." },
  { title: "Granny Flat Guide WA",            href: "/guides/granny-flat-guide-wa",  description: "Ancillary dwellings under the R-Codes Volume 1." },
  { title: "Granny Flat Guide SA",            href: "/guides/granny-flat-guide-sa",  description: "Ancillary accommodation under the Planning and Design Code." },
  { title: "Property Depreciation Guide",     href: "/guides/property-depreciation-guide", description: "Deductions on a new granny flat you rent out." },
  { title: "Rental Yield Calculator",         href: "/rental-yield-calculator", description: "Run gross and net yield on your own build cost and rent." },
];

export default function GrannyFlatGuideNSWPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
      sourced
    >
      <Callout variant="warning" title="Check your own lot first">
        <p>
          Whether your lot qualifies depends on its zone, size, frontage and
          any exclusion in the Codes SEPP (heritage, flood, bushfire and
          others). A certifier or your council can confirm before you pay for
          a design.
        </p>
      </Callout>

      <h2 id="what-is">What is a granny flat in NSW?</h2>
      <p className="lead">
        In NSW a granny flat is a <strong>secondary dwelling</strong>, and the
        rules for it sit in the{" "}
        <a href={SEPP_URL} target="_blank" rel="noopener noreferrer">State Environmental Planning Policy (Housing) 2021</a>,
        Chapter 3, Part 1 (sections 49 to 57) and Schedule 1. That Part applies
        on land in zones R1, R2, R3, R4 and R5 where a dwelling house is
        permitted under another planning instrument.
      </p>
      <p>
        With development consent, a secondary dwelling is allowed if no other
        dwelling than the principal dwelling and the secondary dwelling will be
        on the land, the two together stay within the floor area your LEP
        allows for a dwelling house, and the secondary dwelling is no more than
        60 m², or a larger area another instrument permits (section 52).
      </p>

      <h2 id="complying-dev">Complying development: the CDC route</h2>
      <p>
        Under section 54 a granny flat can be <strong>complying
        development</strong>, approved by a certifier with a complying
        development certificate (CDC) instead of a council development
        application, if:
      </p>
      <ul>
        <li>the land is in a residential zone other than R5 Large Lot Residential;</li>
        <li>the work involves no basement and no roof terrace on the topmost roof;</li>
        <li>it meets the general requirements for complying development in the Codes SEPP (clauses 1.17A and 1.18) and is not on land excluded by clause 1.19(1);</li>
        <li>the lot is at least <strong>450 m²</strong>; and</li>
        <li>it meets every development standard in Schedule 1.</li>
      </ul>
      <p>
        A granny flat built inside the existing house follows a shorter list
        (section 54(3)): it must meet the Building Code of Australia, avoid
        environmentally sensitive land and heritage items, add no more than a
        new entrance to the outside of the house, and stay within 60 m².
      </p>

      <h2 id="requirements">Lot, size and setback standards</h2>
      <p>The main Schedule 1 standards for a CDC on a lot of 450 to 900 m²:</p>
      <ul>
        <li><strong>Frontage:</strong> at least 12 m at the building line (15 m on a lot over 900 m² and up to 1,500 m², 18 m above that); a battle-axe lot needs an access laneway at least 3 m wide (section 2).</li>
        <li><strong>One of each:</strong> one principal dwelling and one secondary dwelling on the lot when the work is finished (section 2).</li>
        <li><strong>Site coverage:</strong> no more than 50% of the lot for the house, granny flat and ancillary structures together (40% from 900 m², 30% above 1,500 m²) (section 3).</li>
        <li><strong>Floor area:</strong> granny flat no more than 60 m², or more where another instrument allows; house, granny flat and attached structures together no more than 330 m² up to 600 m² of lot, 380 m² up to 900 m² (section 4).</li>
        <li><strong>Height:</strong> no more than 8.5 m above existing ground level (section 6).</li>
        <li><strong>Side setback:</strong> at least 0.9 m, more as the building rises above 3.8 m (section 9).</li>
        <li><strong>Rear setback:</strong> at least 3 m, plus three times any height above 3.8 m, up to 8 m (section 10).</li>
      </ul>
      <p>
        No extra parking space is required (section 2(3)). The full schedule
        also covers privacy, landscaping, bushfire-prone land and more; your
        certifier works through it.
      </p>

      <h2 id="approval-pathway">CDC or development application</h2>
      <ol>
        <li>
          <strong>CDC from a certifier:</strong> where the lot and the design
          meet section 54 and Schedule 1.
        </li>
        <li>
          <strong>Development application to the council:</strong> for
          everything else, including R5 lots, excluded land and designs that
          miss a Schedule 1 standard. For a detached granny flat, a site of at
          least 450 m² is a non-discretionary standard (section 53): if the
          site meets it, the council cannot require a larger one.
        </li>
      </ol>

      <h2 id="costs">What a granny flat costs to build</h2>
      <p>
        No official source publishes a granny flat price for NSW. The nearest
        published rates are Archicentre Australia&rsquo;s, and its guide says
        to price an addition with wet areas as the shell plus the fit-outs. On
        that basis:
      </p>
      <GrannyFlatCostTable sizes={SIZES} state="NSW" />
      <p>
        Extension and renovation rates per square metre, by state, are in our{" "}
        <Link href="/guides/renovation-cost-australia-2026">renovation and extension costs per square metre</Link>{" "}
        guide.
      </p>

      <h2 id="costs-outside">Costs outside the build price</h2>
      <p>
        Archicentre&rsquo;s rates assume good site access and a simple roof.
        Its guide tells you to allow extra for:
      </p>
      <ul>
        <li>adverse ground conditions, such as a sloping or reactive site;</li>
        <li>upgrading services (electrical, plumbing) and connecting the new dwelling to them;</li>
        <li>site drainage, paving and landscaping;</li>
        <li>professional fees: design, engineering and the certifier.</li>
      </ul>
      <p>
        Get those priced on your own site before you compare builders&rsquo;
        quotes.
      </p>

      <h2 id="owner-occupier">Who can live there, and renting it out</h2>
      <p>
        <strong>The Housing SEPP sets no owner-occupier condition.</strong>{" "}
        Nothing in Chapter 3, Part 1 limits who lives in the principal dwelling
        or the granny flat, so you can rent either or both. A private covenant
        on the title can still restrict building one; your conveyancer can
        check.
      </p>
      <p>
        We do not publish rent or yield figures for granny flats: no official
        source reports their rents separately. Look up the rents in your
        suburb and run your own build cost and rent through the{" "}
        <Link href="/rental-yield-calculator">rental yield calculator</Link>.
        Rent is taxable income, and a new build has depreciation to claim; see
        our <Link href="/guides/property-depreciation-guide">property depreciation guide</Link>.
      </p>

      <h2 id="disadvantages">Disadvantages of a granny flat</h2>
      <ul>
        <li><strong>Space:</strong> 60 m² is the cap in most areas, enough for one or two bedrooms.</li>
        <li><strong>Privacy and yard:</strong> it shares the block, and site coverage and setbacks take garden space from the house.</li>
        <li><strong>Resale:</strong> it cannot be subdivided or sold on its own title (section 51), and some buyers want the yard more than the income.</li>
        <li><strong>Cost before rent:</strong> site works, connections and fees sit on top of the build price.</li>
      </ul>

      <h2 id="finance">Financing your granny flat</h2>
      <ul>
        <li><strong>Equity in your home:</strong> a top-up or refinance of your existing loan, if you have the equity.</li>
        <li><strong>Construction loan:</strong> drawn down in stages as the build reaches milestones, usually against a fixed-price building contract.</li>
        <li><strong>Personal loan:</strong> for smaller projects, at a higher rate than secured lending.</li>
      </ul>
      <p>
        A mortgage broker can compare how lenders treat granny flat
        construction. Our{" "}
        <Link href="/guides/how-to-find-a-builder-australia">guide to finding a builder</Link>{" "}
        covers the licence check and the home warranty insurance the builder
        must take out on work over the state threshold.
      </p>

      <h2 id="other-states">Granny flat rules in other states</h2>
      <ul>
        <li><Link href="/guides/granny-flat-guide-vic">Granny flat rules in Victoria</Link></li>
        <li><Link href="/guides/granny-flat-guide-qld">Granny flat rules in Queensland</Link></li>
        <li><Link href="/guides/granny-flat-guide-wa">Granny flat rules in WA</Link></li>
        <li><Link href="/guides/granny-flat-guide-sa">Granny flat rules in South Australia</Link></li>
      </ul>

      <Sources
        items={[
          {
            label: "State Environmental Planning Policy (Housing) 2021 (NSW), Chapter 3, Part 1 Secondary dwellings (sections 49 to 57) and Schedule 1 Complying development, secondary dwellings",
            href: SEPP_URL,
            note: "version in force from 11 September 2026; read 10 October 2026",
          },
          grannyFlatCostSource(),
        ]}
      />
    </GuideArticleLayout>
  );
}
