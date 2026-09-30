import Link from "next/link";
import type { Metadata } from "next";
import { GuideArticleLayout, type GuideFrontmatter } from "./GuideArticleLayout";
import { Callout } from "./Callout";
import { EditorNote } from "./EditorNote";
import { KeyFigure } from "./KeyFigure";
import { MatchCTA } from "./MatchCTA";
import { Sources } from "./Sources";
import type { GuideTOCEntry } from "./GuideTOC";
import { WebApplicationJsonLd } from "@/components/seo";
import { StampDutyCalculator } from "@/components/calculators/StampDutyCalculator";
import { StampDutyStateLinks } from "@/components/calculators/StampDutyStateLinks";
import {
  ABBR,
  IN,
  STAMP_DUTY_GUIDES,
  STAMP_DUTY_GUIDE_PUBLISHED,
  STAMP_DUTY_VERIFIED_ON,
  firstHomeTable,
  hasOwnerOccupierRate,
  money,
  otherStates,
  standardRateRows,
  workedExamples,
  type AustralianState,
  type DataTable,
} from "@/lib/data/stamp-duty-state";
import { STATE_DUTY_SCHEDULES, officeRef } from "@/lib/utils/stamp-duty";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { stampDutyFrontmatter } from "@/lib/guides/stamp-duty-frontmatter";

export { stampDutyFrontmatter };

// Item 20 of the September 2026 fix review: the eight state stamp duty guides
// on one calculator-first template. Copy lives in src/lib/data/stamp-duty-state.ts
// and every figure is computed from src/lib/utils/stamp-duty.ts.

/** <title> and og:title take the short form; the H1 and Article headline keep the long one (frontmatter.title). */
export function stampDutyMetadata(state: AustralianState): Metadata {
  const f = stampDutyFrontmatter(state);
  const metaTitle = STAMP_DUTY_GUIDES[state].metaTitle;
  return {
    title: metaTitle,
    description: f.description,
    alternates: { canonical: `${SITE_URL}/guides/${f.slug}` },
    openGraph: {
      url: `${SITE_URL}/guides/${f.slug}`,
      title: metaTitle,
      description: f.description,
      type: "article",
      publishedTime: f.publishedAt,
      modifiedTime: f.updatedAt,
      images: guideOgImages({ slug: f.slug, title: f.title, description: f.description, persona: f.persona }),
    },
  };
}

/** Renders a paragraph string, turning [text](/path) and [text](https://...) into links. */
function Para({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <p className={className}>
      {parts.map((p, i) => {
        const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!m) return <span key={i}>{p}</span>;
        return m[2].startsWith("/") ? (
          <Link key={i} href={m[2]}>{m[1]}</Link>
        ) : (
          <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer">{m[1]}</a>
        );
      })}
    </p>
  );
}

function Table({ table }: { table: DataTable }) {
  return (
    <div className="overflow-x-auto">
      <table>
        <caption className="caption-top text-left font-sans text-sm font-medium text-ink pb-2">{table.caption}</caption>
        <thead>
          <tr>{table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StampDutyStateGuide({ state }: { state: AustralianState }) {
  const g = STAMP_DUTY_GUIDES[state];
  const s = STATE_DUTY_SCHEDULES[state];
  const abbr = ABBR[state];
  const inState = IN[state];
  const examples = workedExamples(state);
  const ooRate = hasOwnerOccupierRate(state);
  const fhTable = firstHomeTable(state);
  const foreign = s.foreign;
  const office = officeRef(state);
  const officeThe = office.startsWith("the ") ? "the " : "";

  const toc: GuideTOCEntry[] = [
    { id: "calculator", label: `${abbr} stamp duty calculator` },
    { id: "worked-examples", label: "Worked examples: $500k, $750k, $1m" },
    { id: "rates", label: `${abbr} stamp duty rates` },
    { id: "first-home", label: "First home buyer thresholds" },
    { id: "concessions", label: "Concession rates" },
    { id: "foreign-buyers", label: "Foreign buyer surcharge" },
    { id: "exemptions", label: "Exemptions" },
    { id: "what-is-it", label: `What is stamp duty in ${inState}?` },
    { id: "when-you-pay", label: "When you pay it" },
    { id: "other-states", label: "Other states" },
  ];

  const exampleHead = [
    "Price",
    ooRate ? "Investor" : "Standard rate",
    ...(ooRate ? ["Owner-occupier"] : []),
    "First home buyer",
    ...(foreign ? ["Foreign surcharge"] : []),
  ];
  const exampleRows = examples.map((e) => [
    money(e.price),
    money(e.investor),
    ...(ooRate ? [money(e.owner)] : []),
    e.first < e.owner ? `${money(e.first)} (saves ${money(e.owner - e.first)})` : money(e.first),
    ...(foreign ? [money(e.foreignSurcharge)] : []),
  ]);

  const calculator = (
    <div id="calculator" className="scroll-mt-28 grid lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5">
        <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2">Free calculator</p>
        <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-4">
          Work out your {abbr} stamp duty
        </h2>
        <p className="font-sans text-base text-ink-muted leading-relaxed mb-3">
          Preset to {s.name} and a $750,000 home. Change the price, tick first home buyer, investment or foreign
          buyer, and the result shows the duty, any concession, any surcharge and the total you pay.
        </p>
        <p className="font-sans text-sm text-ink-subtle leading-relaxed">
          Rates checked against {office} on 30 September 2026. The tables and examples below use the same
          figures.
        </p>
      </div>
      <div className="lg:col-span-7">
        <StampDutyCalculator state={state} initialPrice={750_000} />
      </div>
    </div>
  );

  return (
    <GuideArticleLayout
      frontmatter={stampDutyFrontmatter(state)}
      tldr={g.tldr}
      toc={toc}
      faqs={g.faqs}
      related={[
        { title: "Stamp Duty Calculator", href: "/stamp-duty-calculator", description: "All eight states and territories in one calculator." },
        ...g.related,
      ]}
      beforeBody={calculator}
    >
      <WebApplicationJsonLd
        name={`${abbr} Stamp Duty Calculator`}
        description={`Calculate ${s.dutyName} in ${inState}, with first home buyer concessions and the foreign buyer surcharge, on rates checked against ${office} on 30 September 2026.`}
        url={`/guides/${g.slug}`}
      />

      <Callout variant="warning" title={`Rates checked against ${office} on 30 September 2026`}>
        <Para
          text={`Duty rates, thresholds and concessions change, sometimes at budget time. The calculator and every table on this page use the ${s.office.name} schedules as published on 30 September 2026. Confirm your own figure with ${officeThe}[${s.office.name}](${s.office.href}) or your conveyancer before you sign a contract.`}
        />
      </Callout>

      <EditorNote>
        <p>{g.editorNote}</p>
      </EditorNote>

      <h2 id="worked-examples">{abbr} stamp duty worked examples: $500,000, $750,000 and $1,000,000</h2>
      <p>
        What {s.dutyName} comes to at three common prices, worked by the calculator above on the {s.office.name} rates.
        {ooRate ? " The investor column is the standard rate; the owner-occupier column is for a buyer who will live in the home." : ""}
        {foreign ? ` A foreign buyer pays the ${Math.round(foreign.rate * 100)}% ${foreign.name} on top.` : ""}
      </p>
      <Table table={{ caption: `${abbr} stamp duty at three prices (rates checked 30 September 2026)`, head: exampleHead, rows: exampleRows }} />
      <p>
        The figures exclude the land titles registration and transfer fees. First home buyer figures assume an
        established home and that you meet the eligibility rules set out below.
      </p>

      <h2 id="rates">{abbr} stamp duty rates 2026</h2>
      {g.howCalculated.map((p, i) => <Para key={i} text={p} />)}
      <Table table={{ caption: s.standard.label, head: ["Dutiable value", "Duty"], rows: standardRateRows(state).map((r) => [r.band, r.duty]) }} />
      <Para
        className="text-sm"
        text={`Source: [${s.standard.source.label}](${s.standard.source.href}), ${s.standard.source.note}.`}
      />

      <h2 id="first-home">First home buyer thresholds in {inState}</h2>
      {g.firstHome.map((p, i) => <Para key={i} text={p} />)}
      <KeyFigure value={g.keyFigure.value} label={g.keyFigure.label} context={g.keyFigure.context} />
      {fhTable && <Table table={fhTable} />}

      <h2 id="concessions">{abbr} stamp duty concession rates</h2>
      {g.concessionIntro.map((p, i) => <Para key={i} text={p} />)}
      {g.concessionTables.map((t) => <Table key={t.caption} table={t} />)}

      <h2 id="foreign-buyers">Foreign buyer surcharge in {inState}</h2>
      {g.foreign.map((p, i) => <Para key={i} text={p} />)}

      <h2 id="exemptions">Exemptions: who pays less or nothing in {inState}</h2>
      <ul>
        {g.exemptions.map((e) => (
          <li key={e.title}>
            <strong>{e.title}.</strong>{" "}{e.body}
          </li>
        ))}
      </ul>
      <p>
        Each one has its own eligibility test, set out by {office}. A concession you are not entitled to can be
        reassessed with interest and penalties, so confirm it before settlement.
      </p>

      <h2 id="what-is-it">What is stamp duty in {inState}?</h2>
      {g.whatIs.map((p, i) => <Para key={i} text={p} className={i === 0 ? "lead" : undefined} />)}

      <h2 id="when-you-pay">When do you pay stamp duty in {inState}?</h2>
      {g.whenPay.map((p, i) => <Para key={i} text={p} />)}

      <MatchCTA kind={g.cta.kind} lead={g.cta.lead} ctaLabel={g.cta.ctaLabel} href={g.cta.href} />

      <h2 id="other-states">Stamp duty calculators for other states</h2>
      <p>
        Every state sets its own rates. Each of these pages runs the same calculator, locked to that state, with its
        rates table and first home buyer rules.
      </p>
      <StampDutyStateLinks states={otherStates(state)} />

      <Sources items={g.sources} />
    </GuideArticleLayout>
  );
}
