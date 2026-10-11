import {
  ABS_PPI_HOUSE_ANNUAL_PCT,
  COST_ITEMS,
  FIGURES_BASIS_ID,
  FINISHES,
  FINISH_LABELS,
  KDR_ROWS,
  NO_PUBLISHED_RANGE,
  RENOVATION_COSTS_AS_AT,
  RENOVATION_SOURCES,
  RENOVATION_SOURCE_ORDER,
  SCOPE_PER_M2,
  STATE_COSTS,
  STATE_ORDER,
  REGIONAL_ADJUSTMENT_PCT,
  money,
  rangeCellText,
  type Cell,
  type CheckTable,
  type Range,
  type SourceId,
} from "@/lib/data/renovation-costs";

/**
 * The tables on /guides/renovation-cost-australia-2026 (commercial intent
 * review, 30 Sep 2026, section 3.7). Every figure is read from
 * src/lib/data/renovation-costs.ts; every cell that has no published figure
 * prints "no published range". Server components; the page's .prose-ypg
 * styles the tables. Each table sits in a scroller sized `w-0 min-w-full`:
 * it fills the column without adding the table's width to the column's
 * minimum, so a wide table scrolls inside itself instead of widening the page
 * on a phone (the guide column is a grid item with the default min-width).
 */

function Src({ id }: { id: SourceId }) {
  const s = RENOVATION_SOURCES[id];
  // "this guide" links to the basis statement on the page (review 10 Oct
  // 2026, F8f, and the Clarity dead clicks on the plain-text tag).
  if (id === "guide") return <a href={`#${FIGURES_BASIS_ID}`}>{s.short}</a>;
  return s.href ? (
    <a href={s.href} target="_blank" rel="noopener noreferrer">{s.short}</a>
  ) : (
    <>{s.short}</>
  );
}

function CellText({ cell, unit }: { cell: Cell; unit: "each" | "m2" }) {
  if (!cell.range) {
    return (
      <>
        <em>{NO_PUBLISHED_RANGE}</em>
        {cell.note ? <><br /><small>{cell.note}</small></> : null}
      </>
    );
  }
  return (
    <>
      {rangeCellText(cell.range, unit === "m2" ? "/m²" : "")}
      <br />
      <small>
        <Src id={cell.source} />
        {cell.exGst ? ", excl. GST" : ""}
        {cell.note ? `: ${cell.note}` : ""}
      </small>
    </>
  );
}

/** Table 1: every room at three finish levels, plus knock-down rebuild. */
export function RenovationAtAGlanceTable() {
  return (
    <>
      <div className="overflow-x-auto w-0 min-w-full">
      <table>
        <caption className="sr-only">Renovation costs at a glance, metro Australia, {RENOVATION_COSTS_AS_AT}</caption>
        <thead>
          <tr>
            <th>Room or work</th>
            {FINISHES.map((f) => <th key={f}>{FINISH_LABELS[f]}</th>)}
          </tr>
        </thead>
        <tbody>
          {COST_ITEMS.map((item) => (
            <tr key={item.key}>
              <td>
                <strong>{item.label}</strong>{item.unit === "m2" ? " (per m²)" : ""}
                {item.note ? <><br /><small>{item.note}</small></> : null}
              </td>
              {FINISHES.map((f) => (
                <td key={f}><CellText cell={item.byFinish[f]} unit={item.unit} /></td>
              ))}
            </tr>
          ))}
          {KDR_ROWS.map((row) => (
            <tr key={row.label}>
              <td>
                <strong>{row.label}</strong>{row.unit === "m2" ? " (per m²)" : ""}
                {row.note ? <><br /><small>{row.note}</small></> : null}
              </td>
              {row.all ? (
                <td colSpan={FINISHES.length}><CellText cell={row.all} unit={row.unit} /></td>
              ) : (
                FINISHES.map((f) => (
                  <td key={f}>{row.byFinish ? <CellText cell={row.byFinish[f]} unit={row.unit} /> : <em>{NO_PUBLISHED_RANGE}</em>}</td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p>
        <small>
          As at {RENOVATION_COSTS_AS_AT}. &quot;This guide&quot; figures are our editorial working ranges
          for metro Australia including GST (<a href={`#${FIGURES_BASIS_ID}`}>how we use them</a>).
          A cell reads &quot;{NO_PUBLISHED_RANGE}&quot; where neither this guide nor a dated
          published source gives a figure for that finish level; nothing is interpolated.
          CKA figures use Sydney prices as the base and exclude GST. The knock-down rebuild
          rows are demolition and new-build rates, not renovation rates.
        </small>
      </p>
    </>
  );
}

/** Table 2: cost per square metre by scope, one row per source. */
export function RenovationPerM2Table() {
  const g = SCOPE_PER_M2.guide;
  const c = SCOPE_PER_M2.ckaShell;
  const m2 = (r: Range) => rangeCellText(r, "/m²");
  return (
    <>
      <div className="overflow-x-auto w-0 min-w-full">
      <table>
        <caption className="sr-only">Renovation cost per square metre by scope, by source</caption>
        <thead>
          <tr>
            <th>Source</th>
            <th>Cosmetic</th>
            <th>Mid-range</th>
            <th>Structural or premium</th>
            <th>Basis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong><Src id="guide" /></strong></td>
            <td>{m2(g.cosmetic)}</td>
            <td>{m2(g.mid)}</td>
            <td>{m2(g.premium)}</td>
            <td><small>Metro Australia, incl. GST, {RENOVATION_COSTS_AS_AT}. Cosmetic: paint, flooring, tapware, lighting. Mid: plus kitchen, one bathroom, some replanning. Premium: architect-designed, structural, full re-stack of services.</small></td>
          </tr>
          <tr>
            <td><strong><Src id="archicentre2026" /></strong></td>
            <td><em>no separate range</em></td>
            <td>{m2(SCOPE_PER_M2.archicentreExisting)}</td>
            <td>{m2(SCOPE_PER_M2.archicentreNewAndExtension)}</td>
            <td><small>Incl. GST, standard materials. Mid column: one range for all renovation inside an existing building in sound condition. Premium column: new construction and extensions, basic shell and roofline.</small></td>
          </tr>
          <tr>
            <td><strong><Src id="cka2026" /></strong></td>
            <td><em>no separate range</em></td>
            <td>{m2(c.standard)}</td>
            <td>{m2(c.quality)} quality; {m2(c.luxury)} luxury</td>
            <td><small>Sydney price base, excl. GST and fees. Structural shell for a home under 300 m²: standard (brick veneer or timber), quality, luxury.</small></td>
          </tr>
          <tr>
            <td><strong><Src id="canstar2025" /></strong></td>
            <td><em>no separate range</em></td>
            <td>{m2(SCOPE_PER_M2.canstar)}</td>
            <td><em>no separate range</em></td>
            <td><small>One range for a home renovation, attributed to Soho.</small></td>
          </tr>
        </tbody>
      </table>
      </div>
      <p>
        <small>
          The published ranges sit below this guide&rsquo;s at the bottom end because Archicentre and
          Canstar quote standard materials on a sound house and CKA quotes the shell without fees or GST;
          this guide&rsquo;s ranges include the trades, fit-out and GST a metro quote carries. The ABS
          reports house construction output prices up {ABS_PPI_HOUSE_ANNUAL_PCT}% in the year to
          June 2026 (<Src id="absPpi2026" />), so a 2025 range needs that added.
        </small>
      </p>
    </>
  );
}

/** Table 3: by state and capital. */
export function RenovationByStateTable() {
  return (
    <>
      <div className="overflow-x-auto w-0 min-w-full">
      <table>
        <caption className="sr-only">Renovation and building cost by state and capital city</caption>
        <thead>
          <tr>
            {/* .prose-ypg th is nowrap; these headers are long, so let them wrap. */}
            {["State", "Capital", "Renovation cost against Sydney", "Custom-built house, per m²", "Average new house, per m², 2024-25", "House construction prices, year to Jun 2026"].map((h) => (
              <th key={h} style={{ whiteSpace: "normal" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STATE_ORDER.map((code) => {
            const s = STATE_COSTS[code];
            return (
              <tr key={code}>
                <td><strong>{s.state}</strong></td>
                <td>{s.capital}</td>
                <td>
                  {s.ckaPct === null
                    ? <em>no published adjustment</em>
                    : s.ckaPct === 0
                      ? (code === "NSW" ? "0% (base)" : "0%")
                      : `${s.ckaPct > 0 ? "+" : "−"}${Math.abs(s.ckaPct)}%`}
                </td>
                <td>{s.rlbCustom ? rangeCellText(s.rlbCustom, "/m²") : <em>{NO_PUBLISHED_RANGE}</em>}</td>
                <td>{s.absNewHousePerM2 !== null ? `${money(s.absNewHousePerM2)} /m²` : <em>no published figure</em>}</td>
                <td>{s.ppiAnnualPct !== null ? `+${s.ppiAnnualPct.toFixed(1)}%` : <em>not covered</em>}</td>
              </tr>
            );
          })}
          <tr>
            <td><strong>Regional</strong></td>
            <td>outside a capital</td>
            <td>+{REGIONAL_ADJUSTMENT_PCT.low}% to +{REGIONAL_ADJUSTMENT_PCT.high}%</td>
            <td><em>{NO_PUBLISHED_RANGE}</em></td>
            <td><em>no published figure</em></td>
            <td><em>not covered</em></td>
          </tr>
        </tbody>
      </table>
      </div>
      <p>
        <small>
          Column sources: renovation cost against Sydney and the regional premium from the{" "}
          <Src id="cka2026" /> (six capitals; none published for Canberra or Darwin); custom-built
          single and double storey house per m² of gross floor area from{" "}
          <Src id="rlb2026" /> (no Hobart column); average new house cost per m² for 2024-25 from
          ABS Building Activity as analysed by Landmark Valuations
          (<Src id="absBuildCost2025" />; no Tasmania, ACT or NT figure); house construction output prices
          from <Src id="absPpi2026" /> (six capitals). The house-building columns are new-build
          rates, shown because they set the labour and materials prices a renovation pays. No
          source publishes a renovation cost per square metre by state; the state table on the
          co-architecture page that ranks for this query cites none.
        </small>
      </p>
    </>
  );
}

function CheckCell({ value, unit }: { value: Range | string | null; unit?: "" | "/m²" }) {
  if (value === null) return <em>{NO_PUBLISHED_RANGE}</em>;
  if (typeof value === "string") return <>{value}</>;
  return <>{rangeCellText(value, unit ?? "")}</>;
}

/** The cross-check tables in the kitchen, bathroom, secondary-room, extension and rebuild sections. */
export function RenovationCheckTable({ table }: { table: CheckTable }) {
  const twoColumn = table.columns.length === 3;
  return (
    <div className="overflow-x-auto w-0 min-w-full">
    <table id={table.id}>
      <caption className="sr-only">{table.caption}</caption>
      <thead>
        <tr>
          {table.columns.map((c) => <th key={c}>{c}</th>)}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, i) => (
          <tr key={`${row.source}-${i}`}>
            {twoColumn ? (
              <>
                <td><strong>{row.basis}</strong></td>
                <td><CheckCell value={row.cells[0]} unit={row.unit} /></td>
                <td><small><Src id={row.source} /></small></td>
              </>
            ) : (
              <>
                <td><strong><Src id={row.source} /></strong></td>
                {row.cells.map((c, j) => (
                  <td key={j}><CheckCell value={c} unit={row.unit} /></td>
                ))}
                <td><small>{row.basis}</small></td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
      </div>
  );
}

/** The dated source list for the Sources block, in the order the tables use them. */
export function renovationSourceItems(): { label: string; href?: string; note?: string }[] {
  return RENOVATION_SOURCE_ORDER.map((id) => {
    const s = RENOVATION_SOURCES[id];
    return { label: `${s.label}, ${s.date}`, href: s.href ?? undefined, note: s.note };
  });
}
