import Link from "next/link";
import { ScrollTable } from "./ScrollTable";
import type { SourceItem } from "./Sources";
import {
  COMMISSION_AS_AT,
  COMMISSION_SOURCES,
  STATE_COMMISSION,
  STATE_ORDER,
  STATE_RATES,
  capitalCell,
  commissionAmount,
  commissionWithGst,
  medianCell,
  pct,
  regionalCell,
  ruleCell,
  stateAverageCell,
  type CommissionCell,
  type CommissionSource,
  type StateCode,
} from "@/lib/data/commission-rates";

// The sourced commission tables (commercial-intent review, 10 Oct 2026,
// selling 0.1): every cell carries its footnote, the footnotes are listed
// under the table with their dates, and the as-at line names when they were
// read. Figures come only from src/lib/data/commission-rates.ts.

const money = (n: number) => `$${n.toLocaleString("en-AU")}`;

export function Ref({ refs }: { refs: number[] }) {
  if (refs.length === 0) return null;
  return (
    <>
      {" "}
      <sup>[{refs.join(", ")}]</sup>
    </>
  );
}

function CellText({ c }: { c: CommissionCell }) {
  return (
    <>
      {c.text}
      <Ref refs={c.refs} />
    </>
  );
}

function Footnotes({ sources }: { sources: CommissionSource[] }) {
  return (
    <ol className="text-xs text-ink-muted list-none pl-0 space-y-1">
      {sources.map((s) => (
        <li key={s.n}>
          [{s.n}]{" "}
          <a href={s.href} target="_blank" rel="nofollow noopener">
            {s.label}
          </a>
          , {s.date}.
        </li>
      ))}
    </ol>
  );
}

const byNumber = (ns: number[]) =>
  [...new Set(ns)]
    .sort((a, b) => a - b)
    .map((n) => Object.values(COMMISSION_SOURCES).find((s) => s.n === n)!)
    .filter(Boolean);

/** The commission sources as Sources-block items, numbered as in the tables. */
export function commissionSourceItems(sources: CommissionSource[]): SourceItem[] {
  return sources.map((s) => ({ label: `[${s.n}] ${s.label}`, href: s.href, note: s.date }));
}

/**
 * Every state on one table: capital average, regional averages, state
 * average and median, and the typical commission on an $800,000 sale before
 * and with GST. Used by the national fees guide and the commission
 * calculator, server-rendered.
 */
export function NationalCommissionTable({ price = 800_000, linkStates = true }: { price?: number; linkStates?: boolean }) {
  const refs: number[] = [COMMISSION_SOURCES["ato-gst"].n];
  const rows = STATE_ORDER.map((st) => {
    const cells = [capitalCell(st), regionalCell(st), stateAverageCell(st), medianCell(st)];
    for (const c of cells) refs.push(...c.refs);
    return { st, cells };
  });
  return (
    <>
      <ScrollTable label="Real estate commission by state">
        <table>
          <thead>
            <tr>
              <th>State</th>
              <th>Capital city</th>
              <th>Regional</th>
              <th>State average</th>
              <th>State median</th>
              <th>At {money(price)}, state average<Ref refs={[COMMISSION_SOURCES["ato-gst"].n]} /></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ st, cells }) => {
              const typical = STATE_RATES[st].typical;
              return (
                <tr key={st}>
                  <td>
                    {linkStates ? (
                      <Link href={`/guides/real-estate-commission-${st.toLowerCase()}`}><strong>{st}</strong></Link>
                    ) : (
                      <strong>{st}</strong>
                    )}
                  </td>
                  {cells.map((c, i) => (
                    <td key={i}><CellText c={c} /></td>
                  ))}
                  <td>
                    {money(commissionAmount(price, typical))} before GST
                    <br />
                    <small>{money(commissionWithGst(price, typical))} with GST</small>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ScrollTable>
      <p>
        <small>
          As at {COMMISSION_AS_AT}. No state or territory sets a commission rate: every figure is a published average or median,
          and your own quote can sit outside it. Capital, regional and state averages are OpenAgent&rsquo;s (pages last updated
          September 2026); state medians are bRight Agent&rsquo;s across more than 200 postcodes (February 2026). The two measure
          different things, which is why the medians run higher. GST of 10% is added where a quote excludes it.
        </small>
      </p>
      <Footnotes sources={byNumber(refs)} />
    </>
  );
}

/**
 * One state's published figures, row by row: the capital, each regional
 * area, the state average, the state median and what the law says. Used on
 * the state commission guides.
 */
export function StateCommissionTable({ state, price }: { state: StateCode; price: number }) {
  const s = STATE_COMMISSION[state];
  const oaRef = COMMISSION_SOURCES[s.openAgent].n;
  const brightRef = COMMISSION_SOURCES.bright.n;
  const gstRef = COMMISSION_SOURCES["ato-gst"].n;
  const rule = ruleCell(state);
  const reg = regionalCell(state);
  const rows: { area: string; rate: number | null; refs: number[]; note?: string }[] = [
    { area: `${s.capital.name} (capital city average)`, rate: s.capital.rate, refs: [oaRef] },
    ...s.regions.map((r) => ({ area: `${r.name} (regional average)`, rate: r.rate, refs: [oaRef] })),
    ...s.regionsWithoutFigure.map((name) => ({ area: `${name} (regional)`, rate: null, refs: [] })),
    { area: "State average", rate: s.stateAverage, refs: [oaRef] },
    { area: "State median, more than 200 postcodes nationally", rate: s.median, refs: [brightRef] },
  ];
  if (s.regions.length === 0 && s.regionsWithoutFigure.length === 0) {
    rows.splice(1, 0, { area: "Regional", rate: null, refs: reg.refs });
  }
  return (
    <>
      <ScrollTable label={`Published commission figures, ${state}`}>
        <table>
          <thead>
            <tr>
              <th>Area</th>
              <th>Published figure</th>
              <th>At {money(price)}<Ref refs={[gstRef]} /></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.area}>
                <td>{r.area}</td>
                <td>{r.rate === null ? "No published figure" : <>{pct(r.rate)}<Ref refs={r.refs} /></>}</td>
                <td>
                  {r.rate === null ? "" : (
                    <>
                      {money(commissionAmount(price, r.rate))} before GST
                      <br />
                      <small>{money(commissionWithGst(price, r.rate))} with GST</small>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
      <p>
        <small>
          As at {COMMISSION_AS_AT}. What the law says: {rule.text}
          <Ref refs={rule.refs} /> Averages are OpenAgent&rsquo;s (last updated September 2026); the median is bRight
          Agent&rsquo;s (February 2026). They measure different things, so treat them as a range, not a price list.
        </small>
      </p>
      <Footnotes sources={byNumber([oaRef, brightRef, gstRef, ...rule.refs])} />
    </>
  );
}
