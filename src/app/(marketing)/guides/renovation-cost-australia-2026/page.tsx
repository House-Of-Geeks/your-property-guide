import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  EditorNote,
  KeyFigure,
  MatchCTA,
  PullQuote,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type RelatedGuide,
} from "@/components/guide";
import {
  RenovationAtAGlanceTable,
  RenovationByStateTable,
  RenovationCheckTable,
  RenovationPerM2Table,
  renovationSourceItems,
} from "@/components/guide/RenovationCostTables";
import { RenovationCostEstimator } from "@/components/calculators/RenovationCostEstimator";
import {
  ARCHICENTRE_2026,
  ABS_PPI_HOUSE_ANNUAL_PCT,
  ABS_PPI_HOUSE_QUARTER_PCT,
  BATHROOM_CHECKS,
  COST_ITEM_BY_KEY,
  FULL_RENO_EXAMPLE_M2,
  FULL_RENO_PER_100,
  EXTENSION_CHECKS,
  KDR_CHECKS,
  KITCHEN_CHECKS,
  KDR_ROWS,
  FIGURES_BASIS_ID,
  ON_COSTS,
  REGIONAL_ADJUSTMENT_PCT,
  RENOVATION_COSTS_AS_AT,
  RENOVATION_FAQS,
  ROOM_ANSWERS,
  SCOPE_PER_M2,
  SECONDARY_ROOM_CHECKS,
  STATE_COSTS,
  perM2Total,
  rangeText,
  type Range,
} from "@/lib/data/renovation-costs";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Renovation Cost in Australia (2026): Tables and Calculator",
  description:
    "Renovation costs in Australia at September 2026: kitchens, bathrooms, laundries, extensions and rebuilds by finish level, per m² by state, and a calculator.",
  slug: "renovation-cost-australia-2026",
  publishedAt: "2026-05-13",
  updatedAt: "2026-10-11",
  readingTimeMinutes: 17,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "renovating",
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

// Every total below is computed from the tables in renovation-costs.ts
// (review 10 Oct 2026, F8e), so the TL;DR, the body and the FAQs agree.
const SECOND_STOREY_EXAMPLE_M2 = 60;
const KDR_EXAMPLE_M2 = 220;
const ss = COST_ITEM_BY_KEY.secondStorey.byFinish.mid.range as Range;
const kdrDemo = KDR_ROWS[0].all?.range as Range;
const kdrVolume = KDR_ROWS[1].byFinish?.basic.range as Range;
const kdrCustom = KDR_ROWS[1].byFinish?.high.range as Range;
const per100 = (r: Range) => rangeText(r);

const TLDR = [
  `Costs have not come back down. Master Builders Australia puts the cost of building a home at more than 50% above pre-pandemic (26 August 2026), and ABS house construction prices rose ${ABS_PPI_HOUSE_ANNUAL_PCT}% in the year to June 2026. Expect $2,800–$4,500/m² for a mid-range full renovation in metro areas.`,
  "Kitchen renovations: $12K–$18K (budget refresh), $25K–$45K (mid-range), $60K+ (premium). Cabinetry and stone benchtops drive most of the cost. Archicentre Australia's Cost Guide 2026 puts a standard kitchen fit-out at $23K–$49K.",
  "Bathroom renovations: $15K–$22K (standard), $25K–$40K (premium). Waterproofing and tiling labour drive cost. Archicentre's 2026 fit-out range is $17.5K–$35K.",
  `Full house renovation: ${rangeText(SCOPE_PER_M2.guide.mid, "/m²")} mid-range, ${per100(FULL_RENO_PER_100.mid)} for every ${FULL_RENO_EXAMPLE_M2} m² renovated. A ${SECOND_STOREY_EXAMPLE_M2} m² second storey: ${rangeText(perM2Total(ss, SECOND_STOREY_EXAMPLE_M2))}. Knock-down rebuild: ${rangeText(kdrVolume, "/m²")} for a volume-built home or ${rangeText(kdrCustom, "/m²")} custom, plus ${rangeText(kdrDemo)} to demolish.`,
  "Builder margin sits at 15–25% on smaller jobs, 12–18% on larger ones. Add 10–15% contingency on top of every quoted price.",
  "Pre-construction costs (architect, structural engineer, council, certifier, surveyor) typically run 8–15% of total project cost and are easy to forget when budgeting.",
];

const TOC: GuideTOCEntry[] = [
  { id: "at-a-glance",            label: "Renovation costs at a glance" },
  { id: "estimator",              label: "Renovation cost calculator" },
  { id: "cost-per-m2",            label: "Cost per square metre by scope" },
  { id: "cost-by-state",          label: "Cost by state and capital city" },
  { id: "why-costs-rose",         label: "Why costs rose, and where they are now" },
  { id: "kitchens",               label: "Kitchen renovation costs" },
  { id: "bathrooms",              label: "Bathroom renovation costs" },
  { id: "laundry-living-bedrooms", label: "Laundry, living areas and bedrooms" },
  { id: "budget-30000",           label: "What can you renovate for $30,000?" },
  { id: "full-renovation",        label: "Full house renovation cost" },
  { id: "extensions",             label: "Extensions and second storeys" },
  { id: "knock-down-rebuild",     label: "Knock-down rebuild" },
  { id: "pre-construction",       label: "Pre-construction costs" },
  { id: "fixed-vs-cost-plus",     label: "Fixed-price vs cost-plus contracts" },
  { id: "finance",                label: "How to finance the work" },
  { id: "what-adds-value",        label: "What actually adds value at sale" },
  { id: "budgeting-method",       label: "How to budget honestly" },
];

const RELATED: RelatedGuide[] = [
  { title: "Fixed vs Variable Rate Loans Guide",  href: "/guides/fixed-vs-variable-rate-guide",      description: "How home loan rates work, relevant when adding a construction or equity loan." },
  { title: "Granny Flat Rules by State",          href: "/guides/granny-flat-guide-nsw",             description: "Approvals and build costs for a granny flat in NSW, with links to VIC, QLD, WA and SA." },
  { title: "How to Sell a House in Australia",    href: "/guides/how-to-sell-a-house-australia",     description: "If you're renovating to sell, read this on what actually moves the price." },
  { title: "How to Choose a Mortgage Broker",     href: "/guides/how-to-choose-a-mortgage-broker",   description: "Renovation finance is broker territory. Most lenders price construction differently." },
  { title: "Borrowing Power Calculator",           href: "/borrowing-power-calculator",               description: "Run the numbers on what your renovation loan looks like before you talk to a broker." },
];

const d = ON_COSTS.designAndApprovalsPct;
const c = ON_COSTS.contingencyPct;

export default function RenovationCostAustralia2026Page() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={RENOVATION_FAQS}
      related={RELATED}
    >
      <p className="lead">
        Archicentre Australia&rsquo;s Cost Guide 2026 puts a standard kitchen
        fit-out at {rangeText(ARCHICENTRE_2026.kitchen)}, a bathroom at{" "}
        {rangeText(ARCHICENTRE_2026.bathroom)} and renovation inside an
        existing house at {rangeText(ARCHICENTRE_2026.renovationPerM2, "/m²")},
        all including GST. The tables below set those figures beside every
        other dated source, room by room, as at {RENOVATION_COSTS_AS_AT}.
      </p>

      <div id={FIGURES_BASIS_ID} className="scroll-mt-28">
        <Callout variant="info" title="Where these numbers come from">
          <p>
            Each room section opens with a dated published figure: Archicentre
            Australia&rsquo;s Cost Guide 2026, the CKA cost indicator (June
            2026), Rider Levett Bucknall, the ABS, Canstar, Three Birds
            Renovations or Houzz. Ranges marked &quot;this guide&quot; are our
            editorial working ranges for metro Australia, including GST, first
            published in May 2026 and set beside those sources in every table
            as at {RENOVATION_COSTS_AS_AT}. They are not a survey or a
            published index, so read them as a cross-check on the published
            figures, not a substitute for them. Where no source publishes a
            figure, the cell says so rather than guessing. The quote for{" "}
            <em>your</em> project will vary with site access, structural
            condition, design complexity and your finish choices.
          </p>
        </Callout>
      </div>

      <EditorNote>
        <p>
          Quoting at 2019 prices is how owners blow their budget before
          the first wall comes down. The renovation market reset in 2022
          and stayed reset. If your mental anchor for what a kitchen
          should cost was set during the Block era, throw it out. Build
          your budget from current quotes on real jobs, add a serious
          contingency, and make sure you can fund the upper end of that
          range without selling shares to do it.
        </p>
      </EditorNote>

      <h2 id="at-a-glance">Renovation costs at a glance</h2>
      <p>
        Every room at three finish levels, as at {RENOVATION_COSTS_AS_AT}.
        Where this guide has no figure for a finish level, the cell uses a
        dated published source and names it. Where nobody publishes one, it
        says &quot;no published range&quot;. Each room section below sets
        this guide&rsquo;s range beside every source that publishes one.
      </p>
      <RenovationAtAGlanceTable />

      <h2 id="estimator">Renovation cost calculator</h2>
      <p>
        Pick the rooms, the finish level and your state. The calculator adds
        the ranges from the table above, applies the CKA indicator&rsquo;s
        capital-city adjustment (and its {REGIONAL_ADJUSTMENT_PCT.low} to{" "}
        {REGIONAL_ADJUSTMENT_PCT.high}% regional premium if you tick
        regional), then adds this guide&rsquo;s design and approvals ({d.low}{" "}
        to {d.high}%) and contingency ({c.low} to {c.high}%). It is an
        estimate built from the tables on this page, not a quote.
      </p>
      <div className="not-prose my-6">
        <RenovationCostEstimator />
      </div>
      <p>
        The same calculator has its own page, the{" "}
        <Link href="/renovation-cost-calculator">renovation cost calculator</Link>,
        if you want to come back to it.
      </p>

      <h2 id="cost-per-m2">Renovation cost per square metre by scope</h2>
      <p>
        The rate per square metre depends first on scope: how much of the
        work is cosmetic, how much replaces services, and how much is
        structural. This guide&rsquo;s three tiers sit against the three
        published sources that quote a rate for renovation work.
      </p>
      <RenovationPerM2Table />

      <h2 id="cost-by-state">Renovation cost by state and capital city</h2>
      <p>
        No published source gives a renovation rate per square metre for
        each state. What is published: the CKA indicator&rsquo;s capital-city
        adjustments for renovation work, Rider Levett Bucknall&rsquo;s rates
        for custom-built houses in each capital, the ABS average cost of new
        houses by state, and the ABS house construction price index by
        capital. The calculator uses the CKA adjustments.
      </p>
      <p>
        House construction prices rose fastest in Hobart
        ({STATE_COSTS.TAS.ppiAnnualPct}%), Perth ({STATE_COSTS.WA.ppiAnnualPct}%)
        and Adelaide ({STATE_COSTS.SA.ppiAnnualPct}%) in the year to June
        2026, and slowest in Melbourne ({STATE_COSTS.VIC.ppiAnnualPct}%),
        according to the ABS (31 July 2026). Demand is strongest in New
        South Wales: HIA expects renovation investment there to outpace
        Victoria by nearly 50% in 2026 (21 October 2025).
      </p>
      <RenovationByStateTable />

      <h2 id="why-costs-rose">Why costs rose, and where they are now</h2>
      <p className="lead">
        Renovation costs in Australia rose sharply between 2021 and 2024,
        driven by COVID-era supply chain disruption, materials inflation, and
        a building trades shortage that pushed up labour rates. They have
        not come back down. ABS house construction output prices rose{" "}
        {ABS_PPI_HOUSE_QUARTER_PCT.toFixed(1)}% in the June quarter 2026, the largest
        quarterly rise since September 2022, and {ABS_PPI_HOUSE_ANNUAL_PCT}%
        over the year (31 July 2026). Master Builders Australia puts the cost
        of building a home at more than 50% above pre-pandemic (26 August
        2026). Don&rsquo;t budget against pre-2021 numbers. The renovation
        market has reset.
      </p>
      <p>
        What&rsquo;s happened since:
      </p>
      <ul>
        <li><strong>Materials</strong> inflation has picked up again. Master Builders Australia reported building materials inflation at a three-year high on 2 September 2026, though the 2022–23 timber and steel shortages are behind us.</li>
        <li><strong>Labour</strong> remains the binding constraint. Construction trades shortages haven&rsquo;t eased: apprenticeships dropped in the late 2010s and the pipeline is still thin. Expect 6 to 12 week waits to engage a{" "}
        <Link href="/guides/how-to-find-a-builder-australia">quality builder</Link> for anything substantial.</li>
        <li><strong>Energy efficiency</strong> requirements from NCC 2022 (the 7-star housing standard) raise insulation, glazing and air-tightness requirements on new and substantially renovated work. They commenced between 1 October 2023 and 1 May 2025 depending on the state; Tasmania did not adopt them and the NT kept 5 stars (ABCB). NCC 2025 was released on 1 May 2026 and each state sets its own start date; New South Wales adopts it on 1 May 2027. This guide&rsquo;s estimate of the real cost: 3–8% added to most renovation budgets, partially offset by lower energy bills.</li>
        <li><strong>Builder failures</strong> in 2023–24 (multiple high-profile insolvencies, especially in NSW and VIC) have driven up insurance costs and made owner-builders and small renovators more cautious. Always check builder solvency and home warranty insurance before signing.</li>
      </ul>

      <h2 id="kitchens">Kitchen renovation costs</h2>
      <p className="lead">{ROOM_ANSWERS.kitchen}</p>
      <p>
        Kitchens are the most popular single-room renovation in Australia and
        the most variable on price. Three realistic tiers in 2026:
      </p>
      <h3>Budget kitchen: $12,000 to $18,000</h3>
      <ul>
        <li>Flat-pack cabinetry (kaboodle, IKEA, Bunnings-tier) in the existing layout.</li>
        <li>Laminate benchtop.</li>
        <li>Basic-tier appliances (cooktop, oven, rangehood, dishwasher).</li>
        <li>Existing plumbing and electrical reused.</li>
        <li>Labour for installation, basic tiling splashback, and minor electrical.</li>
      </ul>
      <h3>Mid-range kitchen: $25,000 to $45,000</h3>
      <ul>
        <li>Custom-built or premium flat-pack cabinetry (laminex, polytec, two-pack on doors).</li>
        <li>20mm or 40mm engineered stone or porcelain benchtop ($400–$900/m² installed).</li>
        <li>Quality appliances (Bosch, AEG, Miele entry).</li>
        <li>Possible minor layout change: moving the dishwasher, repositioning the rangehood.</li>
        <li>New tiled splashback or premium glass.</li>
        <li>Improved lighting (LED downlights, pendant over island).</li>
      </ul>
      <h3>Premium kitchen: $60,000+</h3>
      <ul>
        <li>Designer-spec custom cabinetry, often two-pack with handle-less drawers.</li>
        <li>Premium benchtop: natural stone, sintered stone, or thick porcelain ($1,200–$2,500/m² installed).</li>
        <li>Integrated high-end appliances (Miele, Gaggenau, Liebherr).</li>
        <li>Full layout reconfiguration with new plumbing, electrical, gas.</li>
        <li>Specialty joinery: butler&rsquo;s pantry, integrated bins, charging stations.</li>
      </ul>
      <h3>How the published sources compare</h3>
      <p>
        The published kitchen ranges sit close to this guide&rsquo;s mid-range.
        The CKA figures exclude GST, so add 10% before comparing.
      </p>
      <RenovationCheckTable table={KITCHEN_CHECKS} />

      <KeyFigure
        value="$25k–$45k"
        label="Mid-range kitchen renovation, 2026 metro Australia"
        context="Excluding any structural changes"
      />

      <Callout variant="warning" title="What sneaks up on the budget">
        <p>
          Three things consistently blow kitchen budgets: engineered stone
          choices (a $1,500 benchtop and a $4,500 benchtop look almost
          identical at quote stage and very different on the invoice), gas
          appliance changes that require new gas lines, and replacing the
          floor. Once you pull out the old kitchen, the existing floor often
          looks dated, and that&rsquo;s another $3,000–$8,000 you weren&rsquo;t
          counting on.
        </p>
      </Callout>

      <h2 id="bathrooms">Bathroom renovation costs</h2>
      <p className="lead">{ROOM_ANSWERS.bathroom}</p>
      <p>
        Bathrooms are smaller in scope but punch above their weight on cost
        because of waterproofing, tiling, plumbing and the dense regulatory
        environment around wet areas.
      </p>
      <h3>Standard bathroom: $15,000 to $22,000</h3>
      <ul>
        <li>In-place refresh, same fixture positions, no layout change.</li>
        <li>New tiles (floor and partial walls).</li>
        <li>New vanity, toilet, shower screen.</li>
        <li>Quality but not premium tapware ($300–$700 per outlet).</li>
        <li>Waterproofing redone to AS 3740.</li>
      </ul>
      <h3>Premium bathroom: $25,000 to $40,000+</h3>
      <ul>
        <li>Premium tiles, full-height wall tiling.</li>
        <li>Frameless glass screen, freestanding bath, niche shelving.</li>
        <li>Designer tapware (brushed brass, matte black, $700–$1,500 per outlet).</li>
        <li>Possible layout change with new plumbing rough-in.</li>
        <li>Underfloor heating, heated towel rail.</li>
        <li>Custom vanity with stone top.</li>
      </ul>
      <p>
        Tiling labour alone is $60–$120/m² for floors and walls, with materials
        on top. A bathroom with 25m² of tiling can absorb $4,000–$5,000 in
        tiling labour. <strong>Waterproofing is not the place to cut
        corners</strong>. It&rsquo;s legally required, it&rsquo;s the most
        common source of subsequent insurance claims, and remediation when it
        fails costs many multiples of doing it right the first time.
      </p>
      <h3>How the published sources compare</h3>
      <p>
        CKA prices an ensuite separately from a main bathroom; Archicentre
        gives one range for both. CKA figures exclude GST.
      </p>
      <RenovationCheckTable table={BATHROOM_CHECKS} />

      <h2 id="laundry-living-bedrooms">Laundry, living areas and bedrooms</h2>
      <p className="lead">{ROOM_ANSWERS.secondary}</p>
      <p>
        These rooms are rarely renovated on their own. They are usually part
        of a wider refresh, so the published figures are mostly per room or
        per square metre of a single trade: painting, flooring, rewiring and
        re-plumbing. Use the per-square-metre rows to price a whole-house
        paint or floor.
      </p>
      <RenovationCheckTable table={SECONDARY_ROOM_CHECKS} />

      <h2 id="budget-30000">What can you renovate for $30,000?</h2>
      <p>
        At Archicentre Australia&rsquo;s 2026 rates, including GST, $30,000
        pays for one of these:
      </p>
      <ul>
        <li><strong>A standard kitchen in the same layout</strong>, at the lower end of the {rangeText(ARCHICENTRE_2026.kitchen)} fit-out range, with white goods extra.</li>
        <li><strong>A bathroom or ensuite</strong> fit-out, {rangeText(ARCHICENTRE_2026.bathroom)}.</li>
        <li><strong>A laundry</strong> fit-out ({rangeText(ARCHICENTRE_2026.laundry)}) with paint and new flooring elsewhere: interior painting is $20 to $40 per m² and carpet $45 to $165 per m².</li>
      </ul>
      <p>
        It does not stretch to moving walls, plumbing or gas, which add
        structural and services work, or to more than one wet area. Keep
        the {ON_COSTS.contingencyPct.low} to {ON_COSTS.contingencyPct.high}%
        contingency out of the $30,000, and use the{" "}
        <Link href="#estimator">calculator</Link> to price your own mix.
      </p>

      <h2 id="full-renovation">Full house renovation cost</h2>
      <p className="lead">{ROOM_ANSWERS.fullHouse}</p>
      <p>
        For a standard three-bedroom house being renovated room-by-room or as
        a whole-house project, 2026 budgets break down as follows:
      </p>
      <ul>
        <li><strong>Cosmetic only</strong> (paint, flooring, tapware, lighting, minor): <strong>{rangeText(SCOPE_PER_M2.guide.cosmetic, "/m²")}</strong>, or {per100(FULL_RENO_PER_100.cosmetic)} for every {FULL_RENO_EXAMPLE_M2} m² renovated.</li>
        <li><strong>Mid-range</strong> (cosmetic plus kitchen, one bathroom, some replanning): <strong>{rangeText(SCOPE_PER_M2.guide.mid, "/m²")}</strong>, or {per100(FULL_RENO_PER_100.mid)} for every {FULL_RENO_EXAMPLE_M2} m².</li>
        <li><strong>Premium</strong> (architect-designed, structural work, full re-stack of services, designer finishes): <strong>{rangeText(SCOPE_PER_M2.guide.premium, "/m²")}</strong>, or {per100(FULL_RENO_PER_100.premium)} for every {FULL_RENO_EXAMPLE_M2} m².</li>
      </ul>
      <p>
        Regional work generally costs more, not less. The CKA indicator (June
        2026) adds {REGIONAL_ADJUSTMENT_PCT.low} to{" "}
        {REGIONAL_ADJUSTMENT_PCT.high}% outside the capital cities depending
        on distance, and Archicentre Australia&rsquo;s Cost Guide 2026 notes
        that regional areas may attract a premium: land is cheaper in the
        regions, building is not. Among the capitals, CKA puts Perth 5% and
        Brisbane 4% above Sydney, Adelaide and Hobart level with it, and
        Melbourne 1% below. The{" "}
        <Link href="#cost-by-state">state table</Link> has the detail.
      </p>

      <h2 id="extensions">Extensions and second storeys</h2>
      <p className="lead">{ROOM_ANSWERS.extensions}</p>
      <p>
        Adding floor area is the most common way to step up a property
        without selling. Two main approaches:
      </p>
      <h3>Ground-floor extension: $3,500–$5,500/m²</h3>
      <p>
        Easier and cheaper than going up. New slab or raised floor, new
        external walls, roof, and tying the extension into the existing
        services. A 25m² ground-floor extension lands at $90,000–$140,000 for
        the build, plus design, certification, and any fit-out for the new
        space (kitchen, bathroom, bedroom).
      </p>
      <h3>Second-storey addition: $4,500–$7,000/m²</h3>
      <p>
        Considerably more complex. Adds load to the existing structure,
        usually requires structural reinforcement of the ground floor, scaffold
        and access costs, and you&rsquo;ll need to lift the existing roof off.
        A {SECOND_STOREY_EXAMPLE_M2} m² second storey (typically two bedrooms and a bathroom) lands at{" "}
        {rangeText(perM2Total(ss, SECOND_STOREY_EXAMPLE_M2))}. Some builders won&rsquo;t take on second-storey
        adds because of structural risk; specialists are the better
        approach.
      </p>
      <h3>How the published sources compare</h3>
      <RenovationCheckTable table={EXTENSION_CHECKS} />
      <p>
        <small>{EXTENSION_CHECKS.note}</small>
      </p>
      <h3>Granny flats</h3>
      <p>
        A granny flat is a separate dwelling with its own approval rules in
        each state. Our guides set out the rules and a build cost derived from
        Archicentre Australia&rsquo;s 2026 rates for{" "}
        <Link href="/guides/granny-flat-guide-nsw">NSW</Link>,{" "}
        <Link href="/guides/granny-flat-guide-vic">Victoria</Link>,{" "}
        <Link href="/guides/granny-flat-guide-qld">Queensland</Link>,{" "}
        <Link href="/guides/granny-flat-guide-wa">Western Australia</Link> and{" "}
        <Link href="/guides/granny-flat-guide-sa">South Australia</Link>.
      </p>

      <MatchCTA kind="builder" />

      <h2 id="knock-down-rebuild">Knock-down rebuild</h2>
      <p className="lead">{ROOM_ANSWERS.knockDownRebuild}</p>
      <p>
        At some point, renovation becomes worse value than starting fresh.
        Rough rule: if your projected renovation budget exceeds 70–80% of the
        cost of a new build, look at knock-down rebuild instead.
      </p>
      <ul>
        <li><strong>Demolition</strong>: {rangeText(kdrDemo)} for a typical detached house, more for asbestos remediation or difficult access.</li>
        <li><strong>New build (volume builder)</strong>: {rangeText(kdrVolume, "/m²")} for a project home. A {KDR_EXAMPLE_M2} m² home lands at {rangeText(perM2Total(kdrVolume, KDR_EXAMPLE_M2))}.</li>
        <li><strong>New build (custom architect-designed)</strong>: {rangeText(kdrCustom, "/m²")}. A {KDR_EXAMPLE_M2} m² home lands at {rangeText(perM2Total(kdrCustom, KDR_EXAMPLE_M2))}.</li>
        <li><strong>Renting elsewhere during the build</strong>: 8–14 months of rent, factor it in.</li>
      </ul>
      <h3>How the published sources compare</h3>
      <RenovationCheckTable table={KDR_CHECKS} />

      <PullQuote attribution="Andy McMaster, Editor">
        Every renovation budget that comes in on quote was over-budgeted
        on day one. The good builders know this. The good owners budget
        for it.
      </PullQuote>

      <h2 id="pre-construction">Pre-construction costs</h2>
      <p>
        Easy to forget, easy to underestimate. Before any builder turns up,
        you&rsquo;ll typically pay:
      </p>
      <ul>
        <li><strong>Architect or building designer</strong>: 8–12% of construction cost for a full service (concept through to documentation and contract admin). Building designers are typically 50–70% of an architect&rsquo;s fee.</li>
        <li><strong>Structural engineer</strong>: $3,000–$8,000 for most projects.</li>
        <li><strong>Soil test</strong>: $400–$900.</li>
        <li><strong>Surveyor (boundary, contour)</strong>: $1,000–$3,000.</li>
        <li><strong>Council application fees</strong>: $1,500–$5,000+, escalating with complexity.</li>
        <li><strong>Private certifier</strong>: $2,000–$5,000.</li>
        <li><strong>Bushfire / flood reports</strong> where applicable: $1,500–$5,000 each.</li>
        <li><strong>Heritage / planning reports</strong> where applicable: $2,000–$10,000.</li>
      </ul>
      <p>
        Total pre-construction costs typically run <strong>8–15%</strong> of
        project value. On a $400,000 renovation that&rsquo;s $32,000–$60,000
        spent before any tools come out.
      </p>

      <h2 id="fixed-vs-cost-plus">Fixed-price vs cost-plus contracts</h2>
      <p>
        The two main contract structures.
      </p>
      <h3>Fixed-price (lump sum)</h3>
      <p>
        Builder quotes a single total. You pay that, regardless of what it
        actually costs them to build. Pros: certainty of cost, easier to
        finance, simpler invoice cycle. Cons: builder bakes in a contingency
        margin (typically 8–15% on top of expected cost), variations are
        expensive because each one is a contract amendment, and quality
        builders may decline if scope is too uncertain.
      </p>
      <h3>Cost-plus</h3>
      <p>
        You pay the actual cost of materials and trades, plus a fixed
        builder&rsquo;s margin (typically 15–20%) and a fixed management fee.
        Pros: transparency on actual costs, often cheaper if well-managed,
        better fit for complex jobs and heritage properties. Cons: you carry
        the cost-overrun risk, harder to finance, requires more active
        management from the homeowner.
      </p>
      <p>
        For straightforward renovations under $300K, fixed-price is usually
        the right call. For complex jobs, heritage properties, or projects
        where scope will evolve, cost-plus often delivers better value if you
        trust the builder. Before you sign either kind, read our guide on{" "}
        <Link href="/guides/how-to-find-a-builder-australia#contract">what to check in a building contract</Link>.
      </p>

      <h2 id="finance">How to finance the work</h2>
      <p>
        Four common options:
      </p>
      <ul>
        <li><strong>Cash / savings.</strong> The cheapest financing, no interest cost. Suits cosmetic and small structural work.</li>
        <li><strong>Equity release / top-up loan.</strong> Refinance your existing home loan to release equity and use it for renovation. Best for smaller-to-mid renovations where the timeline is short.</li>
        <li><strong>Renovation loan</strong> (drawdown loan). A purpose-built product that releases funds in progress payments tied to construction milestones. Better for larger structural work but harder to qualify for, with stricter LVR limits during the build phase.</li>
        <li><strong>Construction loan.</strong> Used for knock-down rebuilds and substantial extensions. Interest is charged on progressive drawdowns, principal-and-interest payments don&rsquo;t start until the build is complete. Most lenders cap LVR at 80% during the build phase, sometimes 90% with LMI.</li>
      </ul>
      <p>
        For anything over $100K, talk to a broker. Most lenders price
        renovation and construction lending very differently, and a broker
        with construction experience will know which lenders to approach for
        your specific scope. See our <Link href="/guides/how-to-choose-a-mortgage-broker">how to choose a mortgage broker
        guide</Link>.
      </p>

      <h2 id="what-adds-value">What actually adds value at sale</h2>
      <p>
        We know of no published, dated Australian study that measures how much
        of a renovation&rsquo;s cost comes back at sale, so this guide quotes
        no return ratios. What decides it:
      </p>
      <ul>
        <li><strong>Whether the work lifts the buyer pool.</strong> A change that makes the home suit more of the buyers in your suburb, such as the bedroom or bathroom comparable homes already have, matters more than finishes.</li>
        <li><strong>Whether it over-capitalises for the suburb.</strong> Spending past what comparable sold homes in the street offer is the most common way to lose money at sale.</li>
        <li><strong>Whether it fixes what stops a sale.</strong> Defects, unapproved work and tired presentation put buyers off; cosmetic work such as paint, flooring and the garden is the cheapest way to change how a home presents.</li>
      </ul>
      <p>
        Renovation pays off most when it is for you to live in. If you are
        renovating to sell, our guide to{" "}
        <Link href="/guides/what-to-fix-before-selling-a-house">what to fix before selling a house</Link>{" "}
        covers which jobs to do and which to leave.
      </p>
      <h3>What devalues a house</h3>
      <p>
        Problems a buyer cannot see past: structural defects, unapproved
        building work and hazardous materials. If your home was built or
        renovated before 1990 it might contain asbestos (Asbestos Safety and
        Eradication Agency), so have it checked before you budget. Spending
        past what the suburb supports also loses money at sale.
      </p>

      <h2 id="budgeting-method">How to budget honestly</h2>
      <p>
        A defensible renovation budget has five parts:
      </p>
      <ol>
        <li><strong>Builder quote</strong> (or your trades-by-trade quotes if managing yourself).</li>
        <li><strong>Pre-construction costs</strong>: design, engineering, council, surveys.</li>
        <li><strong>Contingency</strong>: 10–15% baseline, 15–20% for older homes or structural work.</li>
        <li><strong>Scope creep</strong>: 3–7% for the changes of mind you haven&rsquo;t had yet but will.</li>
        <li><strong>Holding costs</strong>: somewhere to live during the build, storage, double mortgage if relevant.</li>
      </ol>
      <p>
        Add them up. If your quoted price is $300,000, your defensible total
        budget is closer to $370,000–$410,000. If you can&rsquo;t fund the
        upper end of that range without stress, narrow the scope before
        signing. The{" "}
        <Link href="#estimator">calculator</Link> adds the first three for you.
      </p>

      <MatchCTA kind="mortgage-broker" />

      <Sources items={[
        ...renovationSourceItems(),
        {
          label: "Asbestos Safety and Eradication Agency, Householders and home renovators (homes built or renovated before 1990 might contain asbestos)",
          href: "https://www.asbestossafety.gov.au/about-asbestos/practical-guidance/householders-and-home-renovators",
          note: "read 11 October 2026",
        },
        {
          label: "Approvals: NSW, State Environmental Planning Policy (Exempt and Complying Development Codes) 2008, as named in the Housing SEPP 2021 dictionary (NSW Planning Portal for applications); VIC, Building Act 1993 and the planning scheme under the Planning and Environment Act 1987 (Cardinia Shire Council, Planning vs building); QLD, Building Act 1975 and Planning Act 2016 (Queensland legislation, current reprint)",
          href: "https://www.legislation.qld.gov.au/view/whole/html/inforce/current/act-1975-011",
          note: "read 11 October 2026",
        },
      ]} />
    </GuideArticleLayout>
  );
}
