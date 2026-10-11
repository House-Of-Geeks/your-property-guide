import { ScrollTable } from "./ScrollTable";
import type { SourceItem } from "./Sources";
import {
  ARCHICENTRE_2026,
  grannyFlatBuildRange,
  money,
  rangeCellText,
} from "@/lib/data/renovation-costs";

/**
 * Granny flat build cost by floor area, derived from Archicentre Australia's
 * Cost Guide 2026 the way that guide says to add it up (shell rate per m2 plus
 * the wet area fit-outs). One table for the five state granny flat guides, so
 * no state page carries a cost range of its own (commercial-intent review,
 * 10 Oct 2026, F1 to F5 and section 3.3).
 */
export function GrannyFlatCostTable({ sizes, state }: { sizes: readonly number[]; state: string }) {
  const a = ARCHICENTRE_2026;
  const shell = (m2: number) => ({
    low: a.newConstructionPerM2.low * m2,
    high: a.newConstructionPerM2.high * m2,
  });
  return (
    <>
      <ScrollTable label={`Granny flat build cost by floor area, ${state}`}>
        <table>
          <caption className="sr-only">
            Granny flat build cost by floor area, derived from Archicentre Australia Cost Guide 2026
          </caption>
          <thead>
            <tr>
              <th>Floor area</th>
              <th>Shell and roof</th>
              <th>Kitchen and bathroom fit-out</th>
              <th>Build estimate</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((m2) => (
              <tr key={m2}>
                <td>{m2} m²</td>
                <td>{rangeCellText(shell(m2))}</td>
                <td>
                  {rangeCellText({
                    low: a.kitchen.low + a.bathroom.low,
                    high: a.kitchen.high + a.bathroom.high,
                  })}
                </td>
                <td><strong>{rangeCellText(grannyFlatBuildRange(m2))}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
      <p>
        <small>
          Derived by us from Archicentre Australia&rsquo;s Cost Guide 2026 (read {a.readOn}), including
          GST: new construction at {money(a.newConstructionPerM2.low)} to{" "}
          {money(a.newConstructionPerM2.high)} per m² for the shell and roof, plus one kitchen
          fit-out ({rangeCellText(a.kitchen)}) and one bathroom fit-out ({rangeCellText(a.bathroom)}),
          which the guide says to add for any wet area. Standard materials and good site access.
          Not included: site works, service connections, approvals, design and other professional
          fees, landscaping, white goods, and the premium Archicentre says regional areas may attract.
          It is a planning range, not a quote.
        </small>
      </p>
    </>
  );
}

/** The Sources entry for the table, for each guide's Sources block. */
export function grannyFlatCostSource(): SourceItem {
  return {
    label: "Archicentre Australia, Cost Guide 2026, Renovations and Additions (new construction per m², wet area fit-out)",
    href: "https://www.archicentreaustralia.com.au/wp-content/uploads/CostGuide-2026.pdf",
    note: `includes GST; read ${ARCHICENTRE_2026.readOn}`,
  };
}
