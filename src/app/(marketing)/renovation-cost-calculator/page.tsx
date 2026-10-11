import type { Metadata } from "next";
import Link from "next/link";
import { RenovationCostEstimator } from "@/components/calculators/RenovationCostEstimator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Callout, Sources, type FaqItem, type RelatedGuide } from "@/components/guide";
import { RenovationAtAGlanceTable, renovationSourceItems } from "@/components/guide/RenovationCostTables";
import { SITE_URL } from "@/lib/constants";
import {
  ARCHICENTRE_2026,
  FIGURES_BASIS_ID,
  ON_COSTS,
  REGIONAL_ADJUSTMENT_PCT,
  RENOVATION_COSTS_AS_AT,
  STATE_COSTS,
  STATE_ORDER,
  money,
  rangeText,
} from "@/lib/data/renovation-costs";
import { defaultRenovationInput, estimateRenovation, roundForDisplay } from "@/lib/renovation-estimate";

// /renovation-cost-calculator (commercial-intent review, 10 Oct 2026, new
// homes section 5.1): the estimator from /guides/renovation-cost-australia-2026
// on its own URL, for "renovation cost calculator" (Keyword Planner 480 a
// month) and the estimator queries that were landing on /renovating. It reuses
// the guide's engine (src/lib/renovation-estimate.ts) and tables
// (src/lib/data/renovation-costs.ts); no figure lives in this file. Every
// FAQ number below is computed by the same engine the widget runs.

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Renovation Cost Calculator",
  h1: "Renovation cost calculator",
  description:
    "Pick your rooms, finish level and state for a cost range built from the sourced tables in our renovation cost guide, with the capital-city adjustment, design and approvals and a contingency added. It is an estimate, not a quote.",
  slug: "renovation-cost-calculator",
  schemaName: "Renovation Cost Calculator",
  schemaDescription:
    "Estimate an Australian renovation's cost by room, finish level and state, from dated published ranges, with design, approvals and contingency added.",
  updatedAt: "2026-10-11",
  persona: "renovating",
};

const META_TITLE = "Renovation Cost Calculator Australia (2026)";
const META_DESCRIPTION =
  "Free renovation cost calculator for Australia: kitchens, bathrooms, extensions and more by finish level and state, from dated sources. An estimate, not a quote.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` },
  openGraph: { url: `${SITE_URL}/${FRONTMATTER.slug}`, title: META_TITLE, description: META_DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

const d = ON_COSTS.designAndApprovalsPct;
const c = ON_COSTS.contingencyPct;
const fmt = (n: number) => money(roundForDisplay(n));
const span = (t: { low: number; high: number; open: boolean }) => `${fmt(t.low)} to ${fmt(t.high)}${t.open ? " or more" : ""}`;

// Worked examples, run through the same engine as the widget.
const nsw = estimateRenovation(defaultRenovationInput("NSW"));
const qldRegional = estimateRenovation({ ...defaultRenovationInput("QLD"), regional: true });
const ext = estimateRenovation({ ...defaultRenovationInput("VIC"), kitchen: false, bathrooms: 0, extensionM2: 25 });
const capitals = STATE_ORDER.filter((s) => STATE_COSTS[s].ckaPct !== null && STATE_COSTS[s].ckaPct !== 0);

const FAQS: FaqItem[] = [
  {
    question: "How much does a kitchen and bathroom renovation cost together?",
    answer:
      `In Sydney, a mid-range kitchen and one bathroom come to ${span(nsw.subtotal)} on the calculator's ranges as at ${RENOVATION_COSTS_AS_AT}, or ${span(nsw.budget)} once design and approvals (${d.low} to ${d.high}%) and a contingency (${c.low} to ${c.high}%) are added. ` +
      `The kitchen and bathroom lines are this guide's working ranges, set beside Archicentre Australia's Cost Guide 2026 (${rangeText(ARCHICENTRE_2026.kitchen)} for a kitchen fit-out and ${rangeText(ARCHICENTRE_2026.bathroom)} for a bathroom, including GST).`,
  },
  {
    question: "How accurate is a renovation cost calculator?",
    answer:
      "It gives an order of magnitude, not a price. Each line is a published range or this guide's working range for that room and finish level, so the real quote can sit anywhere in it, or outside it if the site has poor access, structural problems, asbestos or unusual finishes. " +
      "Use the range to set a budget and sort the scope, then get itemised written quotes on the same brief from licensed builders.",
  },
  {
    question: "Why does my state change the estimate?",
    answer:
      `The calculator applies the capital-city adjustments in the Caulfield Krivanek Architecture cost indicator (June 2026), which uses Sydney prices as the base: ${capitals.map((s) => `${STATE_COSTS[s].capital} ${STATE_COSTS[s].ckaPct! > 0 ? "plus" : "minus"} ${Math.abs(STATE_COSTS[s].ckaPct!)}%`).join(", ")}. ` +
      `Ticking regional adds ${REGIONAL_ADJUSTMENT_PCT.low} to ${REGIONAL_ADJUSTMENT_PCT.high}%: a mid-range kitchen and bathroom in regional Queensland come to ${span(qldRegional.adjusted)} before on-costs. The indicator publishes no adjustment for Canberra or Darwin, so the metro figures apply there unchanged.`,
  },
  {
    question: "Does the calculator include GST?",
    answer:
      "Yes. Every range it uses includes GST. Where a source publishes figures without GST (the CKA cost indicator's extension shell rates), the calculator adds 10% and says so on that line.",
  },
  {
    question: "What does a ground-floor extension cost per square metre?",
    answer:
      `A 25 m² ground-floor extension in Melbourne comes to ${span(ext.adjusted)} for the shell on the calculator's mid-range figure, before any kitchen or bathroom in the new space and before on-costs. ` +
      `Archicentre Australia's Cost Guide 2026 prices new construction and extensions at ${rangeText(ARCHICENTRE_2026.newConstructionPerM2, "/m²")} for the shell and roof, including GST, and says to add the wet area fit-outs on top.`,
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Renovation Cost in Australia (2026)", href: "/guides/renovation-cost-australia-2026", description: "Every table the calculator uses, room by room, with the published sources beside them." },
  { title: "How to Find a Builder",               href: "/guides/how-to-find-a-builder-australia", description: "Licence registers and home warranty thresholds for every state." },
  { title: "Borrowing Power Calculator",          href: "/borrowing-power-calculator", description: "What you can borrow to fund the work." },
  { title: "Mortgage Calculator",                 href: "/mortgage-calculator", description: "What the extra borrowing costs each month." },
  { title: "Granny Flat Rules by State",          href: "/guides/granny-flat-guide-nsw", description: "Approvals and build costs for a granny flat, starting with NSW." },
];

export default function RenovationCostCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<RenovationCostEstimator />}
      faqs={FAQS}
      related={RELATED}
      estimateNote={`An estimate from published ranges and our working ranges as at ${RENOVATION_COSTS_AS_AT}. Get itemised written quotes before you sign.`}
      explainer={
        <>
          <h2>How the calculator works</h2>
          <ol>
            <li>
              <strong>Each room or area</strong> takes the range for your finish level from the table below. Where no
              source publishes a figure for that level, it uses the mid-range figure and says so on the line.
            </li>
            <li>
              <strong>Your state</strong> applies the capital-city adjustment from the CKA cost indicator (June 2026),
              against a Sydney base, and ticking regional adds {REGIONAL_ADJUSTMENT_PCT.low} to{" "}
              {REGIONAL_ADJUSTMENT_PCT.high}%.
            </li>
            <li>
              <strong>The budget to plan for</strong> adds design and approvals ({d.low} to {d.high}%) and a contingency
              ({c.low} to {c.high}%), this guide&rsquo;s working allowances. Scope creep and somewhere to live during
              the build are extra.
            </li>
          </ol>

          <div id={FIGURES_BASIS_ID} className="scroll-mt-28">
            <Callout variant="info" title="Where these numbers come from">
              <p>
                The ranges come from Archicentre Australia&rsquo;s Cost Guide 2026, the CKA cost indicator (June
                2026) and Canstar, and from ranges marked &quot;this guide&quot;: our editorial working ranges for
                metro Australia, including GST, first published in May 2026 and set beside those sources in our{" "}
                <Link href="/guides/renovation-cost-australia-2026">renovation cost guide</Link> as at{" "}
                {RENOVATION_COSTS_AS_AT}. They are not a survey or a published index. Every line in the result names
                its source.
              </p>
            </Callout>
          </div>

          <h2>Renovation costs at a glance</h2>
          <p>
            The ranges the calculator adds up, by room and finish level. The guide sets each one beside every
            published source, room by room.
          </p>
          <RenovationAtAGlanceTable />

          <h2>What the calculator leaves out</h2>
          <ul>
            <li>Structural repairs, asbestos or other hazardous material removal, and upgrading old wiring or plumbing.</li>
            <li>Site access, adverse ground and scaffold beyond a normal job.</li>
            <li>White goods, furniture and landscaping.</li>
            <li>Somewhere to live and store furniture during the build, and finance costs.</li>
            <li>Kitchens or bathrooms inside an extension: add them as rooms, because the extension rates are for the shell.</li>
          </ul>
          <p>
            For a granny flat, use the build cost table in your state&rsquo;s guide:{" "}
            <Link href="/guides/granny-flat-guide-nsw">NSW</Link>,{" "}
            <Link href="/guides/granny-flat-guide-vic">Victoria</Link>,{" "}
            <Link href="/guides/granny-flat-guide-qld">Queensland</Link>,{" "}
            <Link href="/guides/granny-flat-guide-wa">WA</Link> or{" "}
            <Link href="/guides/granny-flat-guide-sa">South Australia</Link>.
          </p>

          <Sources items={renovationSourceItems()} />
        </>
      }
    />
  );
}
