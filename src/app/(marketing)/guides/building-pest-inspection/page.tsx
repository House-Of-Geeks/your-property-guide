import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  ScrollTable,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { HowToJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import {
  BUILDING_ALL,
  HOUSE_ALL,
  HOUSE_BIG_THREE,
  INSPECTION_COSTS,
  INSPECTION_FAQS,
  PEST_ALL,
  UNIT_ALL,
  cityCosts,
  formatCostRange,
  type CostRange,
} from "@/lib/data/inspection-costs";

const FRONTMATTER: GuideFrontmatter = {
  title: "Building and Pest Inspection Cost in Australia (2026): Prices by City and Property Type",
  description:
    "What a building and pest inspection costs in Sydney, Melbourne, Brisbane, Perth, Adelaide, Hobart, Canberra and Darwin, by unit, house and large property, combined or separate, from inspectors' own price lists, plus who pays and what the report covers.",
  slug: "building-pest-inspection",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-11",
  readingTimeMinutes: 11,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "first-home",
};

// The <title> is shorter than the H1: the root layout appends
// " | Your Property Guide", and 60 characters before that suffix is the SERP
// budget (tests/seo/titles.test.ts). The long form stays the H1 and the
// Article headline, which read FRONTMATTER.title.
const SEO_TITLE = "Building and Pest Inspection Cost 2026: Prices by City";

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: FRONTMATTER.description,
  alternates: { canonical: `${SITE_URL}/guides/${FRONTMATTER.slug}` },
  openGraph: {
    url: `${SITE_URL}/guides/${FRONTMATTER.slug}`,
    title: SEO_TITLE,
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

const prose = (r: CostRange) => formatCostRange(r, "prose");
const perth = cityCosts("Perth");
const CITY_H3 = ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"] as const;
const sydney = cityCosts("Sydney");

const TLDR = [
  `A combined building and pest inspection on a standard three or four bedroom house costs ${prose(HOUSE_ALL)} including GST across the capitals, and ${prose(HOUSE_BIG_THREE)} in Sydney, Melbourne and Brisbane. Units run ${prose(UNIT_ALL)}. Every figure comes from an inspector's price list or a dated price guide, listed under Sources.`,
  `Building-only inspections are published at ${prose(BUILDING_ALL)} and pest-only at ${prose(PEST_ALL)}; booking both with one inspector is usually $30 to $80 cheaper than two visits (Pest Inspections Adelaide, 2026).`,
  "The buyer pays in every state except the ACT, where the seller commissions the reports and the buyer reimburses them at completion. Victoria has announced a seller-pays scheme for legislation in 2027; nothing has changed yet.",
  "The fee is not a tax deduction. On an investment property it joins the cost base as an incidental cost of acquisition and reduces the capital gain at sale (ATO, cost base of assets, 29 June 2026).",
  "Australia operates on caveat emptor (buyer beware), so you must investigate the property's condition before signing an unconditional contract. Auction buyers must inspect before auction day: there is no cooling-off and no subject-to-inspection clause at auction.",
  "Inspectors check what's accessible and visible. They aren't structural engineers and don't test individual electrical or plumbing fixtures. Don't use the selling agent's inspector: get your own, insured, and attend if you can.",
];

const TOC: GuideTOCEntry[] = [
  { id: "cost",             label: "Cost by city and property type" },
  { id: "combined-vs-separate", label: "Combined vs building-only vs pest-only" },
  { id: "what-changes-price", label: "What changes the price" },
  { id: "hidden-fees",      label: "Hidden fees to ask about" },
  { id: "who-pays",         label: "Who pays" },
  { id: "why-need",         label: "Why you need one" },
  { id: "whats-inspected",  label: "What's inspected" },
  { id: "common-issues",    label: "Common issues found" },
  { id: "who-to-hire",      label: "Who to hire" },
  { id: "timing",           label: "When to get the inspection" },
  { id: "reading-report",   label: "How to read the report" },
  { id: "negotiating",      label: "Negotiating after an inspection" },
  { id: "new-homes",        label: "Inspections for new homes" },
];

const RELATED: RelatedGuide[] = [
  { title: "Buying Property in Australia",  href: "/guides/buying-property-australia",  description: "Where the inspection sits in the broader buying process." },
  { title: "Property Auction Guide",        href: "/guides/property-auction-guide",     description: "Why auction buyers must inspect before auction day." },
  { title: "Conveyancing Fees by State",    href: "/guides/conveyancing-guide",         description: "The other professional you'll engage before settlement, and what they charge." },
  { title: "First Home Buyer Guide",        href: "/guides/first-home-buyer-guide",     description: "Inspections in the broader first-home process." },
  { title: "Stamp Duty Calculator",         href: "/stamp-duty-calculator",             description: "Inspection cost is small relative to settlement-day stamp duty." },
  { title: "Browse suburbs",                href: "/suburbs",                           description: "Pick the suburb first, then commission inspections on shortlisted properties." },
];

const OTHER_SOURCES: SourceItem[] = [
  { label: "ATO, Cost base of assets (the five elements; incidental costs of acquisition)", href: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/calculating-your-cgt/cost-base-of-asset", note: "last updated 29 Jun 2026" },
  { label: "ATO, Rental properties 2025: rental expenses (acquisition and disposal costs are not deductible)", href: "https://www.ato.gov.au/forms-and-instructions/rental-properties-2025/rental-expenses", note: "last updated 29 May 2025" },
  { label: "Queensland Government, Inspections when making an offer on a home (QBCC-licensed inspectors; write inspection terms into the contract)", href: "https://www.qld.gov.au/law/housing-and-neighbours/buying-and-selling-a-property/buying-a-home/making-an-offer-on-a-home/inspections", note: "last updated 22 Aug 2024" },
  { label: "Statewide Legal, Subject to building and pest (the buyer organises the inspection and bears the cost under the REIQ contract)", href: "https://www.swc.net.au/publications/subject-to-building-amp-pest", note: "10 Sep 2018" },
  { label: "Preston Law, Building and pest clause QLD (the contractual remedy is termination, acting reasonably)", href: "https://www.prestonlaw.com.au/blog/building-and-pest-clause-qld/", note: "13 Nov 2024" },
  { label: "Duotax, Investment property cost base for CGT (building and pest inspections usually included if incurred when buying)", href: "https://duotax.com.au/insights/investment-property-cost-base-cgt/", note: "21 May 2026" },
  { label: "Civil Law (Sale of Residential Property) Act 2003 (ACT), s 9 required documents and s 18 buyer to reimburse seller for cost of certain reports", href: "https://www.legislation.act.gov.au/a/2003-40", note: "republication effective 1 Nov 2025" },
  { label: "Premier of Victoria, No more hassles getting pre-sale building inspections (seller-commissioned reports, legislation in 2027)", href: "https://www.premier.vic.gov.au/no-more-hassles-getting-pre-sale-building-inspections", note: "12 Mar 2026" },
  { label: "Westla, Conveyancing costs NSW 2026 (strata inspection reports $350 to $450)", href: "https://westla.com.au/conveyancing-costs-nsw/", note: "2026" },
];

const SOURCES: SourceItem[] = [
  ...INSPECTION_COSTS.flatMap((c) => c.sources.map((s) => ({ label: `${c.city}: ${s.label}`, href: s.href, note: s.note }))),
  ...OTHER_SOURCES,
  "Where a page quotes ex GST, the table adds 10% and rounds to the dollar; the note beside each source says which. Prices read 30 September 2026.",
];

export default function BuildingPestInspectionPage() {
  return (
    <>
      <HowToJsonLd
        name="How to commission a building and pest inspection"
        description="The six-step process for booking and acting on a building and pest inspection in Australia."
        url={`/guides/${FRONTMATTER.slug}`}
        steps={[
          { name: "Pick licensed inspectors", text: "Building inspector + pest inspector. Some firms bundle both. Always check the licence number on your state register." },
          { name: "Book before exchange", text: "Or before auction day if buying at auction (no cooling-off applies)." },
          { name: "Attend the inspection if possible", text: "An inspector who knows you'll join will explain findings live and let you ask questions." },
          { name: "Read the full report carefully", text: "Major structural issues vs cosmetic. Major: structural cracks, termite damage, drainage. Cosmetic: paint, kitchens, gardens." },
          { name: "Negotiate or rescind based on findings", text: "Use significant findings to renegotiate price or repairs, or rescind during cooling-off." },
          { name: "Get specialist follow-ups if flagged", text: "Structural engineer, plumber, or roofer if the inspector recommends specialist review." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={INSPECTION_FAQS}
      related={RELATED}
    >
      <h2 id="cost">How much does a building and pest inspection cost?</h2>
      <p className="lead">
        A combined building and pest inspection on a standard three or four
        bedroom house costs {prose(HOUSE_ALL)} including GST across the eight
        capital cities, and {prose(HOUSE_BIG_THREE)} in Sydney, Melbourne and
        Brisbane. The table below gives each city by property type. Every figure is a price an inspector or a dated price guide
        publishes; the source for each row is listed at the end of the page.
      </p>

      <ScrollTable label="Building and pest inspection cost by city and property type">
      <table>
        <thead>
          <tr>
            <th>City</th>
            <th>Unit</th>
            <th>1–2 bed</th>
            <th>3–4 bed</th>
            <th>Large</th>
          </tr>
        </thead>
        <tbody>
          {INSPECTION_COSTS.map((c) => (
            <tr key={c.city}>
              <td><strong>{c.city}</strong></td>
              <td>{formatCostRange(c.combined.unit)}</td>
              <td>{formatCostRange(c.combined.small)}</td>
              <td>{formatCostRange(c.combined.house)}</td>
              <td>{formatCostRange(c.combined.large)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </ScrollTable>
      <p>
        <small>
          Combined building and pest inspection, GST included. Unit: unit or
          apartment. 1&ndash;2 bed: townhouse or one to two bedroom house.
          3&ndash;4 bed: three to four bedroom house. Large: five or more
          bedrooms, multi-storey, older or rural. A plus sign means the top
          figure is a &ldquo;from&rdquo; price with no published ceiling. An
          asterisk means only one named source publishes that figure. Read 30
          September 2026.
        </small>
      </p>

      {/* One answer-first line per big capital: the cost SERPs that rank are city pages (buying 3.5). */}
      {CITY_H3.map((city) => {
        const c = cityCosts(city);
        return (
          <div key={city}>
            <h3>Building and pest inspection cost in {city}</h3>
            <p>
              A combined building and pest inspection on a three to four bedroom house in {city} costs{" "}
              {prose(c.combined.house)} including GST, and {prose(c.combined.unit)} for a unit (
              {c.sources.map((src) => src.label.split(",")[0]).join("; ")}; {c.sources[0].note.split(";")[0]}).
            </p>
          </div>
        );
      })}

      <KeyFigure
        value={formatCostRange(HOUSE_BIG_THREE)}
        label="Combined building and pest inspection on a three to four bedroom house in Sydney, Melbourne or Brisbane, GST included. The cheapest leverage point in the buying process."
        context="iSPECT, Rapid Building Inspections, BuyWise, Inspect My Home and Pest & Building Inspections price pages, August and September 2026"
      />

      <h2 id="combined-vs-separate">Combined vs building-only vs pest-only</h2>
      <p>
        Most inspectors price the combined inspection as the default and the
        two halves as separate products. Where a source publishes the split,
        the table shows it; where the sources for a city price only the
        combined inspection, the cell says so.
      </p>
      <ScrollTable label="Combined, building-only and pest-only inspection cost by city">
      <table>
        <thead>
          <tr>
            <th>City</th>
            <th>Combined, 3–4 bed</th>
            <th>Building only</th>
            <th>Pest only</th>
          </tr>
        </thead>
        <tbody>
          {INSPECTION_COSTS.map((c) => (
            <tr key={c.city}>
              <td><strong>{c.city}</strong></td>
              <td>{formatCostRange(c.combined.house)}</td>
              <td>{c.buildingOnly ? formatCostRange(c.buildingOnly) : "Not published"}</td>
              <td>{c.pestOnly ? formatCostRange(c.pestOnly) : "Not published"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </ScrollTable>
      <ul>
        {INSPECTION_COSTS.map((c) => (
          <li key={c.city}><strong>{c.city}.</strong> {c.note}</li>
        ))}
      </ul>
      <p>
        Book the combined inspection unless cost is a real constraint. The
        defects that attract termites (moisture, timber-to-soil contact,
        blocked subfloor ventilation) are the same ones a building inspector
        writes up, and one visit is cheaper than two: Pest Inspections
        Adelaide puts the saving at $30 to $80 (2026), and Inscope says adding
        the pest inspection to a Melbourne building inspection costs $100 to
        $200 (2026).
      </p>

      <h2 id="what-changes-price">What changes the price</h2>
      <ul>
        <li><strong>Bedrooms and storeys.</strong> iSPECT prices by bedroom count: $465 plus GST for a one to two bedroom house rising to $515 for five or more bedrooms in Sydney, Melbourne, Hobart, Canberra and Darwin, and $490 to $590 in Brisbane. Swell in Hobart runs from $550 for a one bedroom unit to $968 for a five bedroom, three bathroom house (18 May 2026).</li>
        <li><strong>Age and construction.</strong> Older homes take longer and produce longer reports: Pest Inspections Adelaide adds $50 to $150 for pre-1990 homes and more for stone or double-brick character homes; Rapid prices an older Brisbane character home at $750 to $900 or more against $550 to $750 for a standard house (12 August 2026).</li>
        <li><strong>Access.</strong> A roof void and a subfloor the inspector can enter cost nothing extra; ones they cannot get into are listed as &ldquo;not inspected&rdquo; and are the risk you carry.</li>
        <li><strong>Location.</strong> Metro prices are base prices. Rapid (Adelaide), Point and Inscope (Melbourne) all say properties outside the metro area can attract a travel fee, and WA Building Inspections charges $89 plus GST per hour of additional travel.</li>
        <li><strong>Urgency.</strong> Point Building Inspections adds $50 to $150 for priority or 24-hour turnaround in Melbourne (2026). Auction week is the expensive time to book.</li>
        <li><strong>Extras.</strong> Thermal imaging, drone roof photography, drug-residue testing, pool and asbestos checks are priced separately: WA Building Inspections charges $799 plus GST for its thermographic package against $499 for the standard one, and Point quotes $200 to $500 for an asbestos or pool add-on.</li>
      </ul>

      <h2 id="hidden-fees">Hidden fees to ask about</h2>
      <p>
        The price pages agree on what to check before you accept a quote.
        Ask, in writing:
      </p>
      <ul>
        <li><strong>Is GST included?</strong> iSPECT, WA Building Inspections, APBI and My Canberra all quote ex GST; add 10%. Inspect My Home, Swell and QLD Build Check quote GST inclusive.</li>
        <li><strong>Are sheds, granny flats and outbuildings included?</strong> WA Building Inspections charges $89 plus GST for each auxiliary dwelling or shed.</li>
        <li><strong>Are common areas included for an apartment?</strong> Rapid notes that adding common areas to an apartment inspection costs extra.</li>
        <li><strong>Does the roof void and subfloor get entered, or viewed from the hatch?</strong> BuyWise&rsquo;s checklist lists roof and subfloor access, moisture testing, thermal imaging and photography as the items to confirm.</li>
        <li><strong>Is there a travel fee, and from where?</strong> Most metro quotes hold inside a set radius; My Canberra includes travel within 30 minutes of Canberra and confirms any extra before booking.</li>
        <li><strong>What is the report turnaround, and is a phone debrief included?</strong> iSPECT, Inspect My Home, QLD Build Check and Pest &amp; Building Inspections all promise the report within 24 hours; a same-day rush may cost more.</li>
      </ul>

      <h2 id="who-pays">Who pays for the inspection</h2>
      <p>
        In New South Wales, Victoria, Queensland, Western Australia, South
        Australia, Tasmania and the Northern Territory the buyer commissions
        and pays for the inspection, because it is for the buyer&rsquo;s
        benefit and an inspector chosen and paid by the seller is not
        independent. Three points of difference:
      </p>
      <ul>
        <li>
          <strong>Queensland.</strong>{" "}
          The REIQ standard contract&rsquo;s
          building and pest condition puts the inspection on the buyer, who
          organises it with licensed inspectors and bears the cost (Statewide
          Legal, 10 September 2018), then tells the seller by the contract
          date whether the reports are satisfactory. The contractual remedy
          is termination, acting reasonably; a price cut is a negotiation,
          not a right (Preston Law, 13 November 2024). The building inspector
          must hold a QBCC licence (Queensland Government, Inspections, 22
          August 2024).
        </li>
        <li>
          <strong>The ACT.</strong> The seller must have a building and
          compliance inspection report and a pest inspection report, each no
          more than three months old, in the contract before the property is
          listed, and the buyer reimburses their cost at completion, not
          including any premium the seller paid for a faster turnaround
          (Civil Law (Sale of Residential Property) Act 2003 (ACT), sections
          9 and 18). That is why Canberra inspectors sell vendor packages:
          ACTBIS at $1,790 and My Canberra at $1,697 plus GST for building,
          pest, compliance and energy rating reports.
        </li>
        <li>
          <strong>Victoria.</strong> On 12 March 2026 the Premier announced a
          mandatory building and pest inspection scheme under which sellers
          would commission the reports before sale, make them available to
          every prospective buyer and recover the cost from the successful
          purchaser, modelled partly on the ACT, with legislation to be
          introduced in 2027 if the government is re-elected. Until then the
          buyer pays.
        </li>
      </ul>
      <p>
        Strata buyers pay twice: a strata records inspection ($350 to $450 in
        New South Wales, Westla, 2026) covers the scheme&rsquo;s finances, levies and
        defect history, which a building inspection does not.
      </p>

      <Callout variant="tip" title="The single best few hundred dollars you'll spend">
        <p>
          A {prose(sydney.combined.house)} inspection on a Sydney house, or{" "}
          {prose(perth.combined.house)} in Perth, can
          uncover tens of thousands of dollars in issues, or give you
          confidence to proceed at full price. Either way it is the
          highest-leverage spend in the buying process.
        </p>
      </Callout>

      <h2 id="why-need">Why you need a building and pest inspection</h2>
      <p>
        When purchasing property in Australia, you have limited rights to seek
        remedies after settlement for defects you could have discovered
        beforehand. The principle of <em>caveat emptor</em> (buyer beware)
        means the burden is on you to investigate the property&rsquo;s
        condition before signing an unconditional contract.
      </p>
      <p>A professional building and pest inspection commissioned before exchange gives you:</p>
      <ul>
        <li><strong>Full disclosure of the property&rsquo;s condition</strong> from a qualified professional, not just what&rsquo;s visible to the naked eye.</li>
        <li><strong>Negotiating power.</strong> If significant defects are found, you can ask for a price reduction or require the vendor to fix them before settlement.</li>
        <li><strong>Walk-away rights.</strong> In a private sale with a building inspection condition, you can withdraw from the purchase if major defects are found.</li>
        <li><strong>Future maintenance planning.</strong> Even if all issues are minor, the report helps you understand what maintenance to budget for.</li>
      </ul>

      <Callout variant="warning" title="Auction buyers: inspect BEFORE auction day">
        <p>
          There is no cooling-off period at auction and no subject-to-inspection
          clause. Once the hammer falls, you&rsquo;re committed. Always have
          your inspection report in hand before raising your bidder number.
        </p>
      </Callout>

      <h2 id="whats-inspected">What&rsquo;s inspected</h2>
      <p>A standard combined building and pest inspection in Australia covers:</p>

      <h3>Building inspection</h3>
      <ul>
        <li>Roof (tiles, gutters, flashings, penetrations)</li>
        <li>Roof space (structure, insulation, ventilation)</li>
        <li>Subfloor area (drainage, moisture, structure)</li>
        <li>External walls (cladding, rendering, cracks)</li>
        <li>Internal walls and ceilings (cracks, water damage, stains)</li>
        <li>Floors (bounce, squeaks, levelness)</li>
        <li>Windows and doors (operation, sealing, frames)</li>
        <li>Wet areas (bathrooms, laundry, kitchen) for waterproofing and drainage</li>
        <li>Garage and outbuildings</li>
        <li>Visible drainage and stormwater</li>
        <li>Retaining walls and fencing</li>
      </ul>

      <h3>Pest inspection</h3>
      <ul>
        <li>Termite activity (live termites, past activity, damage)</li>
        <li>Termite conducive conditions (timber-to-soil contact, excessive moisture)</li>
        <li>Timber borers</li>
        <li>Evidence of other pests (rodents, wood decay fungus)</li>
      </ul>
      <p>
        Note: inspectors can only assess what is accessible and visible. A
        building inspection is not a structural engineering report or a
        compliance inspection, it identifies visible defects and issues, not
        hidden structural faults (unless there are visual indicators).
      </p>
      <p>
        Inspectors generally do not test individual electrical outlets, gas
        appliances, or plumbing fixtures (beyond a visual check). A separate
        electrical or plumbing inspection may be warranted for older properties.
      </p>

      <h2 id="common-issues">Common issues found</h2>
      <p>
        Experienced inspectors find something in almost every property they
        inspect, the question is severity.
      </p>

      <h3>High severity (deal-breakers or major price negotiation)</h3>
      <ul>
        <li><strong>Active termite infestation.</strong> Termites can cause extensive structural damage, particularly to timber-framed homes. Active infestations require immediate professional treatment and can require significant structural repairs.</li>
        <li><strong>Rising damp.</strong> Moisture wicking up through walls from the ground, often caused by failed damp-proof courses. Can cause structural damage, mould, and health issues. Repairs can cost $5,000 to $30,000+.</li>
        <li><strong>Major structural cracks.</strong> Diagonal or step cracking through external masonry walls, particularly around windows and door frames, can indicate foundation movement. May require a structural engineer&rsquo;s assessment.</li>
        <li><strong>Significant roof damage.</strong> Failed flashings, cracked tiles, or deteriorated roofing membranes that require full replacement. Roof replacements can cost $10,000 to $30,000+.</li>
        <li><strong>Subfloor drainage issues.</strong> Poor drainage allowing water pooling under the house, which promotes termite activity and timber decay.</li>
      </ul>

      <h3>What is the biggest red flag in a home inspection?</h3>
      <p>
        The findings most likely to change a purchase are structural: moving footings or cracked
        walls, roof framing faults, and active termites or termite damage. They can cost more to
        fix than any discount you negotiate, so treat any of them as a reason to get a specialist
        report before you go further. The inspection itself costs {prose(HOUSE_ALL)} on a standard
        house across the capitals (inspector price lists above).
      </p>

      <h3>Moderate (maintenance items to budget for)</h3>
      <ul>
        <li>Cracked or missing roof tiles</li>
        <li>Blocked or poorly graded gutters and downpipes</li>
        <li>Failed bathroom waterproofing (common in older properties)</li>
        <li>Termite conducive conditions (but no active infestation)</li>
        <li>Deteriorated external paint and caulking</li>
        <li>Substandard electrical (older switchboards, surface-mounted wiring)</li>
        <li>Retaining walls showing signs of movement</li>
      </ul>

      <h3>Minor (normal wear and tear)</h3>
      <ul>
        <li>Sticking doors and windows</li>
        <li>Hairline cracks in plasterboard walls</li>
        <li>Worn or damaged floor coverings</li>
        <li>Minor external paint deterioration</li>
      </ul>

      <h2 id="who-to-hire">Who to hire</h2>
      <p>Look for an inspector with the following qualifications:</p>
      <ul>
        <li><strong>Building inspector.</strong> Should be a licensed builder, architect, or engineer with inspection qualifications. Check for membership in the Australian Institute of Building Surveyors (AIBS) or similar. In Queensland only a QBCC-licensed residential building inspector can do a pre-purchase inspection.</li>
        <li><strong>Pest inspector.</strong> Should be a licensed pest controller or timber pest inspector, qualified under Australian Standard AS 4349.3.</li>
        <li><strong>Professional indemnity insurance.</strong> Essential. If the inspector misses a significant issue, you need recourse.</li>
      </ul>

      <Callout variant="warning" title="Don't use the agent's recommended inspector">
        <p>
          The agent works for the vendor. An inspector with an ongoing referral
          relationship may be unwilling to flag issues that could derail a
          sale. Always engage your own independent inspector.
        </p>
      </Callout>

      <p>
        Try to attend the inspection in person. A good inspector will walk you
        through the property and explain findings in plain English, far more
        valuable than reading a report alone.
      </p>

      <h2 id="timing">When to get the inspection</h2>
      <ul>
        <li><strong>Private sale with conditions.</strong> The inspection clause in your contract gives you a set timeframe to commission the inspection and, if issues are found, to either withdraw or renegotiate. Read the date in your contract, not a rule of thumb.</li>
        <li><strong>Before auction.</strong> Must be done <em>before</em> auction day. Contact the agent to arrange access. Allow at least 48 to 72 hours turnaround to receive the report.</li>
        <li><strong>Before making an offer (preferred).</strong> Some buyers commission inspections before making an offer to negotiate with full knowledge. This means paying for an inspection on properties you may not buy, but avoids conditional delays.</li>
      </ul>

      <h2 id="reading-report">How to read the report</h2>
      <p>
        Building and pest reports follow a standard format (typically AS 4349.1
        for building and AS 4349.3 for pests). Key sections to focus on:
      </p>
      <ol>
        <li><strong>Summary / overview.</strong> This section gives the inspector&rsquo;s overall assessment. Read this first, does the inspector flag any &ldquo;major defects&rdquo; or &ldquo;safety hazards&rdquo;?</li>
        <li><strong>Major defects.</strong> These are defects that require significant remediation. A major defect in the report is different from minor maintenance items.</li>
        <li><strong>Pest activity.</strong> Any active termite evidence, past termite damage, or conducive conditions. Note: past termite activity (treated and resolved) is less concerning than active infestation.</li>
        <li><strong>Photographs.</strong> Good reports include photos of all significant findings. Review these carefully, a crack in a photo often communicates more than a paragraph of text.</li>
        <li><strong>Items not inspected.</strong> Reports must disclose what could not be accessed. Unexplored areas (e.g. concealed roof void, locked rooms) are risk areas.</li>
      </ol>
      <p>
        Not all defects are created equal. A report listing 15 minor items is
        very different from one listing 3 major defects. If in doubt, call the
        inspector directly and ask them to explain the severity and estimated
        cost of remediation.
      </p>

      <h2 id="negotiating">Negotiating after an inspection</h2>
      <p>If the inspection reveals significant issues, you have several options:</p>
      <ol>
        <li><strong>Withdraw from the purchase</strong> (if within your inspection condition timeframe). You are entitled to a refund of the deposit.</li>
        <li><strong>Negotiate a price reduction.</strong> Get quotes for the identified repairs and ask the vendor to reduce the price by that amount. Be specific, quote the estimated cost and attach the relevant section of the report.</li>
        <li><strong>Ask the vendor to fix it.</strong> For some issues (particularly safety hazards), you can request the vendor rectify the defect before settlement. Less common, most vendors prefer to reduce the price than arrange repairs.</li>
        <li><strong>Accept and proceed.</strong> If defects are minor and the price already reflects the condition, you may choose to proceed without negotiation.</li>
      </ol>
      <p>When negotiating based on inspection findings:</p>
      <ul>
        <li>Get repair quotes from licensed tradespeople (not verbal estimates)</li>
        <li>Be reasonable, all properties have some defects</li>
        <li>Focus on major defects, not minor wear and tear</li>
        <li>Negotiate through your conveyancer or agent, in writing</li>
      </ul>

      <h2 id="new-homes">Inspections for new homes</h2>
      <p>
        Many buyers assume new homes don&rsquo;t need an inspection. This is
        a mistake. Common issues found in new construction include:
      </p>
      <ul>
        <li>Incomplete waterproofing or substandard bathroom tiling</li>
        <li>Drainage issues not visible at ground level</li>
        <li>Structural cracks in brickwork from settling</li>
        <li>Substandard insulation or missing insulation</li>
        <li>Defects in electrical or plumbing that didn&rsquo;t pass handover inspection</li>
      </ul>
      <p>
        For new homes, consider engaging a <strong>pre-handover inspector</strong>{" "}
        who attends the builder&rsquo;s handover inspection with you. Any
        defects identified can be included in a defects list that the builder
        must rectify before you take possession. Handover inspections are
        priced separately from pre-purchase ones: iSPECT charges $465 to $525
        plus GST by bedroom count and WA Building Inspections $499 plus GST.
      </p>
      <p>
        New homes typically come with a statutory warranty period (usually 6
        years for structural defects, 2 years for non-structural defects in
        most states). Document any issues with photos and written notices to
        the builder. See our{" "}
        <Link href="/guides/buying-property-australia">complete buying guide</Link>{" "}
        for the broader process.
      </p>

      <Sources items={SOURCES} />
    </GuideArticleLayout>
    </>
  );
}
