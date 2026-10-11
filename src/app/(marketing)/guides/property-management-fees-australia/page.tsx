import type { Metadata } from "next";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { PropertyManagementFeesCalculator } from "@/components/calculators/PropertyManagementFeesCalculator";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import {
  PM_FEES_AS_AT,
  PM_FEES_FAQS,
  PM_FEE_SOURCE_LIST,
  PM_NATIONAL,
  PM_STATE_FEES,
  PM_STATE_ORDER,
  dollarCell,
  lettingCell,
  managementCell,
  stateFeeAnswer,
  type PmCell,
} from "@/lib/data/property-management-fees";
import { computePmFees, defaultPmFeesInput } from "@/lib/property-management-fees-calc";
import { formatPriceFull } from "@/lib/utils/format";

const FRONTMATTER: GuideFrontmatter = {
  title: "Property Management Fees in Australia 2026: Rates by State, With Calculator",
  description:
    "Management fees by state for 2026 (5.8% NSW to 8.7% WA and Tasmania), letting fees in weeks, renewal, inspection and statement charges, sourced and dated, with an annual cost calculator.",
  slug: "property-management-fees-australia",
  publishedAt: "2026-05-06",
  updatedAt: "2026-10-11",
  readingTimeMinutes: 12,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "investing",
};

// The <title> is shorter than the H1: the root layout appends
// " | Your Property Guide", and 60 characters before that suffix is the SERP
// budget (tests/seo/titles.test.ts). The long form stays the H1 and the
// Article headline, which read FRONTMATTER.title.
const SEO_TITLE = "Property Management Fees 2026: Rates by State & Calculator";

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

// The worked example uses Western Australia because it is one of the two
// states where every line has a published range; the numbers come from the
// same engine as the calculator, so they cannot drift from it.
const EXAMPLE_RENT = 600;
const EXAMPLE = computePmFees(defaultPmFeesInput("WA", EXAMPLE_RENT));
const money = (n: number) => formatPriceFull(n);

const TLDR = [
  `Management fees average ${PM_NATIONAL.managementAverage}% of rent nationally: ${PM_STATE_FEES.NSW.management.average}% in New South Wales, ${PM_STATE_FEES.VIC.management.average}% in Victoria, ${PM_STATE_FEES.ACT.management.average}% in the ACT, ${PM_STATE_FEES.QLD.management.average}% in Queensland and South Australia, ${PM_STATE_FEES.NT.management.average}% in the Northern Territory and ${PM_STATE_FEES.WA.management.average}% in Western Australia and Tasmania (LocalAgentFinder, March 2026). Regional areas run higher than the capitals everywhere.`,
  `Letting fees average ${PM_NATIONAL.lettingAverageWeeks} weeks' rent each time a new tenant is signed: about 1 week in Queensland and the Territory, 2 weeks in Tasmania and 2 to 3 weeks in Perth.`,
  "No state sets or caps the fee. Each requires it in a written agreement (NSW's agency agreement, Victoria's managing authority, Queensland's Form 6, WA's written authority) and each consumer regulator says it is negotiable.",
  "Lease renewal, routine inspection and statement charges come on top where the agency levies them. Only Western Australia and South Australia have published ranges for those lines, so get every charge in writing before you sign.",
  `The calculator below starts at your state's published figures and shows the annual cost as a share of rent: about ${computePmFees(defaultPmFeesInput("NSW", EXAMPLE_RENT)).pctOfRent}% at New South Wales' figures and ${EXAMPLE.pctOfRent}% at Western Australia's.`,
];

const TOC: GuideTOCEntry[] = [
  { id: "by-state",        label: "Fees by state (table)" },
  { id: "calculator",      label: "Annual cost calculator" },
  { id: "fee-types",       label: "The 8 fee types" },
  { id: "fees-nsw",        label: "New South Wales" },
  { id: "fees-vic",        label: "Victoria" },
  { id: "fees-qld",        label: "Queensland" },
  { id: "fees-wa",         label: "Western Australia" },
  { id: "fees-sa",         label: "South Australia" },
  { id: "fees-tas",        label: "Tasmania" },
  { id: "fees-act",        label: "ACT" },
  { id: "fees-nt",         label: "Northern Territory" },
  { id: "annual-example",  label: "A worked annual example" },
  { id: "negotiable",      label: "What's actually negotiable" },
  { id: "cheap-vs-good",   label: "Cheap isn't the same as good" },
  { id: "self-managing",   label: "Should you self-manage?" },
  { id: "next-steps",      label: "Next steps" },
];

const RELATED: RelatedGuide[] = [
  { title: "Rental Yield Calculator", href: "/rental-yield-calculator", description: "Calculate gross and net rental yield with management fees factored in." },
  { title: "Negative Gearing in Australia", href: "/guides/negative-gearing-australia", description: "How property management fees flow through to your tax return." },
  { title: "Property Depreciation Guide", href: "/guides/property-depreciation-guide", description: "The other big deduction on your investment property." },
  { title: "House vs Apartment Investment", href: "/guides/house-vs-apartment-investment-australia", description: "How property management fits into the holding-cost picture." },
  { title: "Rentvesting in Australia", href: "/guides/rentvesting-australia", description: "Renting where you live and owning an investment, and the 1 July 2027 tax change." },
];

const SOURCES: SourceItem[] = PM_FEE_SOURCE_LIST.map((s) => ({
  label: `[${s.n}] ${s.label}`,
  href: s.href,
  note: s.date,
}));

function Cell({ c }: { c: PmCell }) {
  return (
    <>
      {c.text}
      {c.refs.length > 0 && (
        <>
          {" "}
          <sup>[{c.refs.join(", ")}]</sup>
        </>
      )}
    </>
  );
}

// Footnotes used in the table, so the list under it names exactly those.
const TABLE_REFS = [
  ...new Set(
    PM_STATE_ORDER.flatMap((code) => {
      const s = PM_STATE_FEES[code];
      return [
        ...managementCell(s).refs,
        ...lettingCell(s).refs,
        ...dollarCell(code, s.renewal).refs,
        ...dollarCell(code, s.inspection).refs,
        ...dollarCell(code, s.admin).refs,
      ];
    }),
  ),
].sort((a, b) => a - b);

export default function PropertyManagementFeesGuide() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={PM_FEES_FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="The headline rate is just the start">
        <p>
          Most quotes advertise the management percentage and stop there. The
          full picture is the management fee, plus the letting fee each time a
          tenant changes, plus the renewal, inspection and statement charges
          the agency levies. The table gives each state&rsquo;s published
          figures; the calculator adds them up for your rent.
        </p>
      </Callout>

      <h2 id="by-state">Property management fees by state (2026)</h2>
      <p className="lead">
        The management fee is a percentage of the rent collected. The letting
        fee is charged in weeks of rent each time a new tenant is signed. The
        table gives each state&rsquo;s published range and its state average,
        then the three extra charges where a named source publishes a range for
        that state; where none does, the cell says so rather than guessing.
        Footnotes point to the sources listed under the table, as at{" "}
        {PM_FEES_AS_AT}.
      </p>
      {/* Six columns do not fit the article column at the global th
          nowrap, so the headers wrap and the table scrolls inside its own
          box on narrow screens. `contain: inline-size` stops the table's
          width reaching the layout's grid column, which otherwise grows to
          fit it and widens the whole page on a phone (720px at 375px). */}
      <div className="overflow-x-auto" style={{ contain: "inline-size" }} data-table="pm-fees-by-state">
      <table style={{ minWidth: "44rem" }}>
        <thead>
          <tr>
            {["State", "Management fee (% of rent)", "Letting fee (weeks of rent)", "Lease renewal", "Routine inspection", "Statements and admin"].map((h) => (
              <th key={h} style={{ whiteSpace: "normal" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PM_STATE_ORDER.map((code) => {
            const s = PM_STATE_FEES[code];
            return (
              <tr key={code}>
                <td>
                  <strong>{s.name.replace(/^the /, "")}</strong>
                  <br />
                  <small>{s.capital}</small>
                </td>
                <td><Cell c={managementCell(s)} /></td>
                <td><Cell c={lettingCell(s)} /></td>
                <td><Cell c={dollarCell(code, s.renewal)} /></td>
                <td><Cell c={dollarCell(code, s.inspection)} /></td>
                <td><Cell c={dollarCell(code, s.admin)} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      <p>
        <small>
          Sources for the table, with dates. The state averages are
          LocalAgentFinder&rsquo;s, the same figures Google&rsquo;s AI Overview
          prints for this search; the ranges are REIQ&rsquo;s table (sourced to
          realestate.com.au) and WhichRealEstateAgent&rsquo;s city guides. A
          &ldquo;no published range&rdquo; cell means none of these names a
          figure for that state, not that the charge does not exist.
        </small>
      </p>
      <ol>
        {PM_FEE_SOURCE_LIST.filter((s) => TABLE_REFS.includes(s.n)).map((s) => (
          <li key={s.n}>
            <small>
              [{s.n}]{" "}
              <a href={s.href} target="_blank" rel="nofollow noopener">
                {s.label}
              </a>
              , {s.date}.
            </small>
          </li>
        ))}
      </ol>

      <KeyFigure
        value={`${PM_NATIONAL.managementAverage}%`}
        label="National average management fee, as a share of rent collected"
        context={`LocalAgentFinder, March 2026, from agency quotes across the eight states; the letting fee averages ${PM_NATIONAL.lettingAverageWeeks} weeks' rent.`}
      />

      <h2 id="calculator">Annual property management cost calculator</h2>
      <p>
        Enter the weekly rent and pick the state. The management percentage
        and letting weeks start at the state average from the table, the extra
        charges at the midpoint of the state&rsquo;s published range (or empty
        where none is published), and every line is editable. The result is the
        annual cost of management and its share of the rent, which is the
        figure to put into the{" "}
        <a href="/rental-yield-calculator">rental yield calculator</a> as your
        management cost.
      </p>
      <div className="not-prose my-6">
        <PropertyManagementFeesCalculator initialState="NSW" initialRent={EXAMPLE_RENT} headingLevel="h3" />
      </div>

      <h2 id="fee-types">The 8 fee types you need to know</h2>
      <p>
        A residential property manager finds tenants, collects rent,
        coordinates repairs, inspects the property, holds the bond and handles
        disputes. The headline fee covers rent collection and day-to-day
        management; the rest is charged separately or bundled, depending on the
        agency.
      </p>

      <h3>1. Management fee</h3>
      <p>
        The headline percentage, calculated on rent <em>collected</em>, not
        rent owed, so a vacancy costs no fee. About 5% to 8% in Sydney and
        Melbourne, 7% to 12% in Brisbane, Perth and Adelaide and in regional
        areas; the table above has each state.
      </p>

      <h3>2. Letting fee</h3>
      <p>
        Charged when a new tenant is signed. Covers advertising, screening,
        the tenancy agreement and the ingoing condition report. Usually 1 to 2
        weeks&rsquo; rent, 2 to 3 weeks in Perth and up to 4 weeks at some
        Melbourne and Hobart agencies (WhichRealEstateAgent, 2026). On $600 a
        week that is $600 to $1,800 each time tenants change.
      </p>

      <h3>3. Lease renewal fee</h3>
      <p>
        Charged when the existing tenant signs a new fixed term. Perth
        agencies quote {dollarCell("WA", PM_STATE_FEES.WA.renewal).text.replace(/ \(.*\)$/, "")}{" "}
        and Adelaide agencies often one week&rsquo;s rent (WhichRealEstateAgent,
        2026); no other state has a published range. Often waived on request.
      </p>

      <h3>4. Routine inspection fee</h3>
      <p>
        $50 to $100 an inspection where a figure is published (Perth and
        Adelaide, WhichRealEstateAgent, 2026). Some agencies include two or
        four a year in the management fee. New South Wales and Western
        Australia cap routine inspections at four in 12 months; Victoria allows
        one every six months.
      </p>

      <h3>5. Ingoing and outgoing condition reports</h3>
      <p>
        The detailed reports at the start and end of each tenancy, which the
        bond claim rests on. Some agencies fold them into the letting fee,
        others charge for each; no state range is published, so ask for the
        figure before you sign.
      </p>

      <h3>6. Statement and admin fees</h3>
      <p>
        Monthly or annual statement fees, the end-of-financial-year summary and
        postage. Perth agencies quote $20 to $40 a year for statements and
        Adelaide agencies $30 to $100 for the annual statement
        (WhichRealEstateAgent, 2026). Almost always negotiable.
      </p>

      <h3>7. Tribunal and arrears</h3>
      <p>
        Charged when the agent attends NCAT, VCAT, QCAT, SACAT or the
        Magistrates Court for you, usually at an hourly rate; Adelaide agencies
        quote from $300 (WhichRealEstateAgent, March 2026). Arrears follow-up
        is normally part of the management fee.
      </p>

      <h3>8. End-of-management fee</h3>
      <p>
        Some agreements charge a fee to leave before the term ends. No range
        is published; read the termination clause and have it removed before
        you sign.
      </p>

      {PM_STATE_ORDER.map((code) => {
        const s = PM_STATE_FEES[code];
        return (
          <div key={code}>
            <h2 id={`fees-${code.toLowerCase()}`}>How much are property management fees in {s.name}?</h2>
            <p>{stateFeeAnswer(code)}</p>
          </div>
        );
      })}

      <h2 id="annual-example">A worked annual example</h2>
      <p>
        Western Australia and South Australia are the two states where every
        line has a published range, so here is Perth at {money(EXAMPLE_RENT)} a
        week on the table&rsquo;s figures: a management fee of{" "}
        {PM_STATE_FEES.WA.management.average}%, a letting fee of{" "}
        {PM_STATE_FEES.WA.letting.average} weeks spread over a two-year tenancy
        with one renewal, four inspections and the statement fee, all quoted
        inclusive of GST.
      </p>
      <ul>
        <li>Annual rent: <strong>{money(EXAMPLE.annualRent)}</strong></li>
        {EXAMPLE.lines.map((l) => (
          <li key={l.key}>
            {l.label}
            {l.key === "letting" ? ` (${money(EXAMPLE.lettingFeeOnce)} once, halved)` : ""}
            {l.key === "renewal" ? " (one renewal in two years)" : ""}
            : {money(l.amount)}
          </li>
        ))}
        <li>
          <strong>Total: {money(EXAMPLE.total)} = {EXAMPLE.pctOfRent}% of annual rent</strong>
        </li>
      </ul>
      <p>
        If the tenant leaves after a year instead, the full{" "}
        {money(EXAMPLE.lettingFeeOnce)} letting fee lands in that year and the
        total rises to about{" "}
        {computePmFees({ ...defaultPmFeesInput("WA", EXAMPLE_RENT), tenancyYears: 1 }).pctOfRent}% of
        rent. Turnover, not the headline rate, is what moves the annual cost
        most; the calculator lets you test it.
      </p>

      <h2 id="negotiable">What&rsquo;s actually negotiable</h2>
      <ul>
        <li><strong>Headline management fee:</strong> negotiable in every state; agencies move most on higher rents and multi-property portfolios.</li>
        <li><strong>Lease renewal fee:</strong> the easiest line to have removed.</li>
        <li><strong>Statement and admin fees:</strong> almost always dropped on request.</li>
        <li><strong>Routine inspection fee:</strong> ask for the year&rsquo;s inspections to be included in the management fee.</li>
        <li><strong>Letting fee:</strong> the hardest to move, but worth asking on a longer management term.</li>
        <li><strong>End-of-management fee:</strong> push to remove it; it locks you in.</li>
      </ul>

      <Callout variant="warning" title="Get the full fee schedule in writing">
        <p>
          Every state&rsquo;s regulator says the same thing: the fee is not
          set by law, so it must be in the agreement you sign. Ask for the full
          schedule before signing. If a manager is reluctant to put every
          charge on paper, take it as a signal about how transparent the rest
          of the relationship will be.
        </p>
      </Callout>

      <h2 id="cheap-vs-good">Cheap isn&rsquo;t the same as good</h2>
      <p>
        A 5% manager who lets rent slip into 14-day arrears, or whose vacancies
        stretch from one week to four, easily costs more than an 8% manager who
        keeps the property tenanted and chases late rent on day one. One extra
        week empty on a $600 property is $600, the same as a full percentage
        point of management fee for a year.
      </p>
      <p>
        Ask each candidate for their average vacancy period in days and their
        arrears rate (share of rent more than 7 days late). The good ones will
        tell you. The ones who can&rsquo;t are the ones to skip.
      </p>

      <h2 id="self-managing">Should you self-manage?</h2>
      <p>
        Self-management saves the management fee but requires you to learn
        your state&rsquo;s tenancy law, run the application screening, deal
        with maintenance calls at all hours and represent yourself at the
        tenancy tribunal if it comes to that. It works for owners with one
        property nearby, time on their hands and the stomach for difficult
        conversations.
      </p>
      <p>
        For most investors, the time and risk reduction is worth the 6% to 12%.
      </p>

      <h2 id="next-steps">Next steps</h2>
      <ol>
        <li>
          Get three written fee schedules from local managers. Compare the
          all-in annual number from the calculator, not the headline
          percentage.
        </li>
        <li>
          Ask each candidate for their average vacancy days and arrears rate.
        </li>
        <li>
          Put the all-in cost, not just the management percentage, into the{" "}
          <a href="/rental-yield-calculator">rental yield calculator</a> to
          see your true net yield.
        </li>
        <li>
          Read the agreement&rsquo;s termination clause and remove any fee for
          switching managers before signing.
        </li>
      </ol>

      <Sources items={SOURCES} />
    </GuideArticleLayout>
  );
}
