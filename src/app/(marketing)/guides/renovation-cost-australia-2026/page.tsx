import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Renovation Cost in Australia (2026)",
  description:
    "Real-world renovation costs in Australia for 2026: kitchens, bathrooms, full renovations, second storeys, extensions and knock-down rebuilds. Per-square-metre ranges, builder margins, and how to budget.",
  slug: "renovation-cost-australia-2026",
  publishedAt: "2026-05-13",
  updatedAt: "2026-05-13",
  readingTimeMinutes: 13,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "renovating",
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
  "Australian renovation costs in 2026 have stabilised after the 2021–24 spike but remain 30–45% higher than 2019. Expect $2,800–$4,500/m² for a mid-range full renovation in metro areas.",
  "Kitchen renovations: $15K (budget refresh), $25K–$45K (mid-range), $60K+ (premium). Cabinetry and stone benchtops drive most of the cost.",
  "Bathroom renovations: $15K–$22K (standard), $25K–$40K (premium). Waterproofing and tiling labour drive cost.",
  "Full house renovation: $200K–$500K for a mid-range three-bedroom. Second-storey addition: $250K–$450K. Knock-down rebuild: $400K–$900K plus demolition.",
  "Builder margin sits at 15–25% on smaller jobs, 12–18% on larger ones. Add 10–15% contingency on top of every quoted price.",
  "Pre-construction costs (architect, structural engineer, council, certifier, surveyor) typically run 8–15% of total project cost and are easy to forget when budgeting.",
];

const TOC: GuideTOCEntry[] = [
  { id: "why-costs-rose",        label: "Why costs rose, and what's stabilised" },
  { id: "kitchens",               label: "Kitchen renovation costs" },
  { id: "bathrooms",              label: "Bathroom renovation costs" },
  { id: "full-renovation",        label: "Full house renovation" },
  { id: "extensions",             label: "Extensions and second storeys" },
  { id: "knock-down-rebuild",     label: "Knock-down rebuild" },
  { id: "pre-construction",       label: "Pre-construction costs" },
  { id: "fixed-vs-cost-plus",     label: "Fixed-price vs cost-plus contracts" },
  { id: "finance",                label: "How to finance the work" },
  { id: "what-adds-value",        label: "What actually adds value at sale" },
  { id: "budgeting-method",       label: "How to budget honestly" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much does a full renovation cost in Australia in 2026?",
    answer:
      "For a standard three-bedroom house in a metro area, mid-range full renovation budgets in 2026 are $200,000 to $500,000, or roughly $2,800 to $4,500 per square metre of the area being renovated. Budget projects can land at $2,000 to $2,500/m² for cosmetic work only; premium projects (architect-designed, high-end finishes, structural work) can exceed $6,000/m². Regional areas are typically 10–20% cheaper than capital cities, though the gap narrows in tight markets.",
  },
  {
    question: "What's the cheapest way to renovate a house?",
    answer:
      "Cosmetic work delivers the biggest perceived change for the smallest spend. Paint, new flooring, new lighting, new tapware, deep cleaning, and tidying up the garden can transform a tired home for $20,000–$40,000 and is realistic DIY-plus-tradies territory. Structural work (moving walls, new wet areas, new windows) multiplies cost quickly because it triggers waterproofing, electrical, plumbing, certification, and structural engineering. If you don't need to move a wall, don't move a wall.",
  },
  {
    question: "Do I need council approval to renovate?",
    answer:
      "Depends on what you're doing and where. Cosmetic work (paint, flooring, tapware swap, kitchen cabinet replacement in the same footprint) generally doesn't need approval. Structural changes (moving walls, new windows, extensions, second storeys), new wet areas, and most external changes typically need either a Complying Development Certificate (NSW) / building permit (VIC) / building work approval (QLD) at minimum, and a full DA / planning permit if you're changing footprint, height, or use. Every council has different exempt-development rules, so confirm before you start. Doing work without required approval can mean stop-work orders, fines, and forced rectification at sale.",
  },
  {
    question: "How much does a kitchen renovation cost in Australia?",
    answer:
      "Budget kitchen ($12,000–$18,000): flat-pack cabinetry, laminate benchtop, basic appliances, kept in the same layout. Mid-range ($25,000–$45,000): custom or premium flat-pack cabinetry, stone benchtop, quality appliances, possible minor layout change. Premium ($60,000+): designer cabinetry, premium stone or porcelain benchtop, integrated high-end appliances, full layout reconfiguration with new plumbing and electrical. Cabinetry typically represents 40–55% of the kitchen budget; benchtops 10–20%; appliances 15–25%; labour for installation, plumbing, electrical and tiling 15–25%.",
  },
  {
    question: "How much does a bathroom renovation cost?",
    answer:
      "Standard bathroom ($15,000–$22,000): in-place refresh, new tiles, vanity, toilet, shower screen, tapware. Premium bathroom ($25,000–$40,000+): premium tiles and stone, frameless screen, freestanding bath, designer tapware, possible layout change, underfloor heating. Waterproofing alone is $1,500–$3,000 and is legally required to AS 3740. Never skip or shortcut this; it's the single biggest cause of insurance claims years later. Tiling labour is usually $60–$120/m² for the labour alone, materials separate.",
  },
  {
    question: "How much should I budget for contingency?",
    answer:
      "Add 10–15% on top of every quoted price for unexpected issues, and another 5% for scope creep (you'll change your mind about something, almost everyone does). On structural work or older homes (pre-1990 in metro areas, anything pre-1970), increase to 15–20% contingency because you can't see what's behind the walls until you open them up. Asbestos, rotten timbers, outdated wiring, lead paint, and undocumented previous work all cost money to remediate when discovered.",
  },
  {
    question: "Should I get a fixed-price or cost-plus contract?",
    answer:
      "Fixed-price gives you cost certainty but at the price of a larger contingency baked into the builder's quote (typically 8–15% of the contract value). Best for straightforward jobs where the scope is clear. Cost-plus (where you pay actual costs plus a fixed builder's margin, typically 15–20%) gives you transparency on actual costs and is often cheaper if the scope is well-managed, but you carry the risk of overruns. Best for complex jobs, heritage properties, or when you trust the builder. Get our fixed-vs-variable contracts guide for the full comparison.",
  },
  {
    question: "Will renovating add value at sale?",
    answer:
      "Sometimes, but the maths is often disappointing. As a rough guide: cosmetic work (paint, flooring, styling) returns 3–10× its cost at sale. Kitchen and bathroom renovations return 0.6–1.2× their cost, usually less than you spent. Second storey additions and extensions return 0.7–1.0× their cost in most suburbs (the exception is high-end suburbs where the per-square-metre value justifies the build cost). The renovation premium goes up when the renovation lifts the property into a different buyer pool (e.g. a 2-bed house becomes a family-suitable 4-bed), and down when it over-improves for the suburb.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Fixed vs Variable Rate Loans Guide",  href: "/guides/fixed-vs-variable-rate-guide",      description: "How home loan rates work, relevant when adding a construction or equity loan." },
  { title: "Granny Flat Guides by State",         href: "/guides/granny-flat-guide-nsw",             description: "Cost, planning, and approvals for granny flats. Often the highest-ROI renovation move." },
  { title: "How to Sell a House in Australia",    href: "/guides/how-to-sell-a-house-australia",     description: "If you're renovating to sell, read this on what actually moves the price." },
  { title: "How to Choose a Mortgage Broker",     href: "/guides/how-to-choose-a-mortgage-broker",   description: "Renovation finance is broker territory. Most lenders price construction differently." },
  { title: "Borrowing Power Calculator",           href: "/borrowing-power-calculator",               description: "Run the numbers on what your renovation loan looks like before you talk to a broker." },
];

export default function RenovationCostAustralia2026Page() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="Why these numbers, and how to use them">
        <p>
          Every figure on this page is a 2026 metro-Australia range derived
          from current builder quotes, HIA &quot;Renovations Roundup&quot;
          tracking data, and ABS construction cost indices. Use them as a
          rough budgeting starting point. The actual quote for <em>your</em>{" "}
          project will vary with site access, structural condition, design
          complexity, and your finish choices.
        </p>
      </Callout>

      <h2 id="why-costs-rose">Why costs rose, and what&rsquo;s stabilised</h2>
      <p className="lead">
        Renovation costs in Australia rose sharply between 2021 and 2024,
        driven by COVID-era supply chain disruption, materials inflation, and
        a building trades shortage that pushed labour rates up 25–40%. As of
        early 2026, costs have stabilised but the new baseline sits 30–45%
        above 2019. Don&rsquo;t budget against pre-2021 numbers. The
        renovation market has reset.
      </p>
      <p>
        What&rsquo;s happened since:
      </p>
      <ul>
        <li><strong>Materials</strong> are back to single-digit annual inflation. Timber, steel and tiles have stabilised; the 2022–23 shortages are behind us.</li>
        <li><strong>Labour</strong> remains the binding constraint. Construction trades shortages haven&rsquo;t eased: apprenticeships dropped in the late 2010s and the pipeline is still thin. Expect 6 to 12 week waits to engage a{" "}
        <Link href="/guides/how-to-find-a-builder-australia">quality builder</Link> for anything substantial.</li>
        <li><strong>Energy efficiency</strong> requirements (NCC 2025) now mandate higher insulation, glazing performance, and air-tightness on new and substantially renovated work. Real cost: 3–8% added to most renovation budgets but partially offset by lower energy bills.</li>
        <li><strong>Builder failures</strong> in 2023–24 (multiple high-profile insolvencies, especially in NSW and VIC) have driven up insurance costs and made owner-builders and small renovators more cautious. Always check builder solvency and home warranty insurance before signing.</li>
      </ul>

      <h2 id="kitchens">Kitchen renovation costs</h2>
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

      <h2 id="full-renovation">Full house renovation</h2>
      <p>
        For a standard three-bedroom house being renovated room-by-room or as
        a whole-house project, 2026 budgets break down as follows:
      </p>
      <ul>
        <li><strong>Cosmetic only</strong> (paint, flooring, tapware, lighting, minor): <strong>$2,000–$2,500/m²</strong>. Total $80,000–$150,000 for a 50–60m² affected area.</li>
        <li><strong>Mid-range</strong> (cosmetic plus kitchen, one bathroom, some replanning): <strong>$2,800–$4,500/m²</strong>. Total $200,000–$400,000.</li>
        <li><strong>Premium</strong> (architect-designed, structural work, full re-stack of services, designer finishes): <strong>$5,000–$7,500/m²+</strong>. Total $400,000–$800,000.</li>
      </ul>
      <p>
        Regional builds are typically 10–20% cheaper than capital city metro
        in 2026, though the gap narrows in undersupplied regional markets
        (Cairns, Geelong, Newcastle outer). Sydney is the most expensive city
        per square metre by a small margin, Melbourne second, then Brisbane,
        Perth, Adelaide.
      </p>

      <h2 id="extensions">Extensions and second storeys</h2>
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
        A 60m² second storey (typically two bedrooms and a bathroom) lands at
        $270,000–$420,000. Some builders won&rsquo;t take on second-storey
        adds because of structural risk; specialists are the better
        approach.
      </p>
      <h3>Granny flat: $130,000–$220,000</h3>
      <p>
        A separate dwelling on your existing block. State-by-state planning
        rules vary significantly, so read our <Link href="/guides/granny-flat-guide-nsw">granny flat guides</Link> for the full
        per-state breakdown. Granny flats often have the best ROI of any
        renovation because they add rental income (or accommodate aging
        parents / adult children without buying a second property), and they
        appeal to the investor buyer pool at sale.
      </p>

      <MatchCTA kind="builder" />

      <h2 id="knock-down-rebuild">Knock-down rebuild</h2>
      <p>
        At some point, renovation becomes worse value than starting fresh.
        Rough rule: if your projected renovation budget exceeds 70–80% of the
        cost of a new build, look at knock-down rebuild instead.
      </p>
      <ul>
        <li><strong>Demolition</strong>: $20,000–$45,000 for a typical detached house, more for asbestos remediation or difficult access.</li>
        <li><strong>New build (volume builder)</strong>: $1,800–$2,800/m² for a project home. A 220m² home lands at $400,000–$600,000.</li>
        <li><strong>New build (custom architect-designed)</strong>: $3,500–$6,000/m². A 220m² home lands at $750,000–$1.3M.</li>
        <li><strong>Renting elsewhere during the build</strong>: 8–14 months of rent, factor it in.</li>
      </ul>

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
        trust the builder. Read our <Link href="/guides/fixed-vs-variable-rate-guide">fixed vs variable
        guide</Link> (the same principle applies to contract types).
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
        If your motivation is selling later for more, the ROI is consistently
        disappointing. Approximate &quot;recover at sale&quot; ratios in 2026
        metro markets:
      </p>
      <ul>
        <li><strong>Cosmetic refresh</strong> (paint, flooring, tapware, garden, deep clean): 3× to 10× cost recovered at sale.</li>
        <li><strong>Kitchen renovation</strong> (mid-range): 0.6× to 1.2× cost recovered.</li>
        <li><strong>Bathroom renovation</strong>: 0.5× to 1.0× cost recovered.</li>
        <li><strong>Granny flat</strong> (suburb dependent): 0.8× to 1.4× cost recovered, plus rental income before sale.</li>
        <li><strong>Second storey or extension</strong>: 0.7× to 1.0× cost recovered in most suburbs; can exceed 1.0× in high-end suburbs where per-m² value is high.</li>
        <li><strong>Pool</strong>: 0.4× to 0.8× cost recovered.</li>
      </ul>
      <p>
        Renovation pays off when it&rsquo;s for you to live in. Renovating
        purely to flip is usually a worse trade than buying a better
        property in the first place.
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
        signing.
      </p>

      <MatchCTA
        kind="mortgage-broker"
        lead="Renovation finance is where a good broker earns their fee. Most lenders price construction differently, drawdown rules vary, LVR caps are stricter."
        ctaLabel="Talk to a renovation broker"
      />

      <Sources items={[
        "Housing Industry Association (HIA), \"Renovations Roundup\" quarterly tracking, 2024–2026 metro Australia.",
        "ABS Construction Output Price Indices and Producer Price Indices, March 2024–March 2026.",
        "Master Builders Australia, 2025 trades-wages tracking and supply-chain reports.",
        { label: "National Construction Code 2025, energy efficiency provisions", note: "mandatory commencement 1 May 2024 in most jurisdictions" },
        "State-by-state planning portals (Service NSW Planning, VBA Victoria, QBCC Queensland, etc.) for current approval requirements.",
      ]} />
    </GuideArticleLayout>
  );
}
