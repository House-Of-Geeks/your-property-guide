import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { PropertyManagementFeesCalculator } from "@/components/calculators/PropertyManagementFeesCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import type { FaqItem, RelatedGuide } from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { STATE_NAMES } from "@/lib/data/commission-rates";
import {
  PM_FEES_AS_AT,
  PM_FEES_FAQS,
  PM_FEE_SOURCE_LIST,
  PM_STATE_FEES,
  PM_STATE_ORDER,
  lettingCell,
  managementCell,
  type PmCell,
} from "@/lib/data/property-management-fees";
import { computePmFees, defaultPmFeesInput } from "@/lib/property-management-fees-calc";
import { formatPriceFull } from "@/lib/utils/format";

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Property management fees calculator",
  h1: "Property management fees calculator: what you pay a year",
  description:
    "Add up the management fee, letting fee, lease renewals, inspections and admin charges to see what a managed rental costs you a year, with the published fee ranges for each state.",
  slug: "property-management-fees-calculator",
  schemaName: "Property Management Fees Calculator",
  schemaDescription:
    "Calculate the annual cost of property management for an Australian rental: management fee, letting fee, lease renewals, inspections and admin charges, starting from each state's published fee ranges.",
  updatedAt: "2026-10-28",
  persona: "investing",
};

const META_TITLE = "Property Management Fees Calculator";
const META_DESCRIPTION =
  "Free property management fees calculator. Work out the annual cost of managing your rental, starting from the published fee ranges for each state.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` },
  openGraph: { ...DEFAULT_OG, url: `${SITE_URL}/${FRONTMATTER.slug}`, title: META_TITLE, description: META_DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

export const revalidate = 604800;

const fmt = (n: number) => formatPriceFull(n);

// The worked example is the calculator's own starting figures for Perth at
// $600 a week, run through the same engine, so page and tool agree.
const EX_STATE = "WA" as const;
const EX_INPUT = defaultPmFeesInput(EX_STATE, 600);
const ex = computePmFees(EX_INPUT);

const UNPUBLISHED_STATES = PM_STATE_ORDER.filter((s) => {
  const f = PM_STATE_FEES[s];
  return f.renewal === null && f.inspection === null && f.admin === null;
});
const UNPUBLISHED_LIST = `${UNPUBLISHED_STATES.slice(0, -1).join(", ")} and ${UNPUBLISHED_STATES[UNPUBLISHED_STATES.length - 1]}`;

const FAQ_QUESTIONS = [
  "What percentage do most property management companies charge?",
  "What is a reasonable management fee?",
  "What is the average property management fee in Australia?",
  "Is the property management fee tax deductible?",
  "What is a letting fee?",
];
const FAQS: FaqItem[] = PM_FEES_FAQS.filter((f) => FAQ_QUESTIONS.includes(f.question)).map((f) => ({
  question: f.question,
  answer: f.answer,
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

// Footnotes used in the state table, so the list under it names exactly those.
const TABLE_REFS = [
  ...new Set(PM_STATE_ORDER.flatMap((s) => [...managementCell(PM_STATE_FEES[s]).refs, ...lettingCell(PM_STATE_FEES[s]).refs])),
].sort((a, b) => a - b);

const RELATED: RelatedGuide[] = [
  { title: "Property management fees in Australia", href: "/guides/property-management-fees-australia", description: "Fee ranges by state, what the law says and the sources." },
  { title: "Rental yield calculator", href: "/rental-yield-calculator", description: "Gross and net yield on the same property." },
  { title: "Negative gearing calculator", href: "/negative-gearing-calculator", description: "How management fees fit into your rental loss and tax." },
];

export default function PropertyManagementFeesCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<PropertyManagementFeesCalculator />}
      faqs={FAQS}
      related={RELATED}
      explainer={
        <>
          <h2>What the calculator includes</h2>
          <ul>
            <li>The management fee, as a percentage of the rent collected.</li>
            <li>The letting fee, in weeks of rent, charged each time a new tenant is signed.</li>
            <li>The lease renewal fee, charged when the same tenant renews.</li>
            <li>Routine inspections, at a fee for each one.</li>
            <li>The annual statement or admin fee.</li>
          </ul>
          <p>
            GST is not added if you tell the calculator the quoted fees already include it, which is how it starts. Choose the
            option to add 10% GST and the calculator adds it on top of all five lines.
          </p>

          <h2>How the annual cost is worked out</h2>
          <ol>
            <li>Annual rent is the weekly rent times 52.</li>
            <li>The management fee is the annual rent times your management percentage.</li>
            <li>
              The letting fee is the weekly rent times the letting weeks, divided by the years between tenant changes. The calculator
              starts at {EX_INPUT.tenancyYears} years, so the letting fee is counted once every {EX_INPUT.tenancyYears} years.
            </li>
            <li>
              The renewal fee is multiplied by the renewals a year, assuming 12-month leases inside the tenancy: a tenant who stays
              two years renews once, so half a renewal a year.
            </li>
            <li>Inspections are the fee for each inspection times the number of inspections a year.</li>
            <li>Statements and admin is the yearly amount you enter.</li>
            <li>
              The lines are added up, then 10% GST is added if the quotes exclude it. The total is also shown as a percentage of
              annual rent.
            </li>
          </ol>

          <h2>Fees by state</h2>
          <p>
            The calculator starts from each state&rsquo;s published figures. The{" "}
            <Link href="/guides/property-management-fees-australia">property management fees guide</Link>{" "}
            sets out the sources and what each state&rsquo;s law says. {UNPUBLISHED_LIST}{" "}
            have no renewal, inspection or admin ranges in the sources we use, so
            those lines start at zero for those states, the starting total may understate the cost, and you enter the amounts from your agency&rsquo;s fee schedule.
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr><th>State</th><th>Management fee</th><th>Letting fee</th></tr>
              </thead>
              <tbody>
                {PM_STATE_ORDER.map((s) => (
                  <tr key={s}>
                    <td>{STATE_NAMES[s].replace(/^the /, "")}</td>
                    <td><Cell c={managementCell(PM_STATE_FEES[s])} /></td>
                    <td><Cell c={lettingCell(PM_STATE_FEES[s])} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <small>
              Sources for the table, with dates. The state averages are LocalAgentFinder&rsquo;s; the ranges are REIQ&rsquo;s table
              (sourced to realestate.com.au) and WhichRealEstateAgent&rsquo;s city guides.
            </small>
          </p>
          <ol>
            {PM_FEE_SOURCE_LIST.filter((src) => TABLE_REFS.includes(src.n)).map((src) => (
              <li key={src.n}>
                <small>
                  [{src.n}]{" "}
                  <a href={src.href} target="_blank" rel="nofollow noopener">
                    {src.label}
                  </a>
                  , {src.date}.
                </small>
              </li>
            ))}
          </ol>

          <h2>A worked example</h2>
          <p>
            A rental in Perth at {fmt(EX_INPUT.weeklyRent)} a week, on the calculator&rsquo;s Western Australian starting figures: a{" "}
            {EX_INPUT.managementPct}% management fee, a letting fee of {EX_INPUT.lettingWeeks}{" "}
            weeks&rsquo; rent ({fmt(ex.lettingFeeOnce)} each time), a tenant change every {EX_INPUT.tenancyYears} years,{" "}
            {EX_INPUT.inspectionsPerYear} inspections a year at {fmt(EX_INPUT.inspectionFee)} each, a {fmt(EX_INPUT.renewalFee)} renewal
            fee and {fmt(EX_INPUT.adminFeePerYear)} a year for statements. Annual rent is {fmt(ex.annualRent)}.
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr><th>Line</th><th>A year</th></tr>
              </thead>
              <tbody>
                {ex.lines.map((l) => (
                  <tr key={l.key}>
                    <td>{l.label}</td>
                    <td>{fmt(l.amount)}</td>
                  </tr>
                ))}
                <tr>
                  <td><strong>Annual cost of management</strong></td>
                  <td><strong>{fmt(ex.total)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>That total is {ex.pctOfRent}% of the annual rent. Change any figure in the calculator above to see your own.</p>

          <h2>What the calculator does not include</h2>
          <ul>
            <li>Advertising or marketing charged separately from the letting fee.</li>
            <li>Maintenance and repairs, and any margin an agency adds to tradespeople&rsquo;s invoices.</li>
            <li>Tribunal or legal fees, such as the cost of an application over arrears or damage.</li>
            <li>Vacancy: it assumes rent is collected for all 52 weeks of the year.</li>
            <li>Any other charge not listed in the five fee lines above.</li>
          </ul>

          <p>
            This is an estimate, not a quote, and not financial, tax or legal advice. The fee figures are as at {PM_FEES_AS_AT}, and
            the sources are in the{" "}
            <Link href="/guides/property-management-fees-australia">property management fees guide</Link>.
          </p>
        </>
      }
    />
  );
}
