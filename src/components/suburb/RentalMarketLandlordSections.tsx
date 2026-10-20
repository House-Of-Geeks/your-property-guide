import Link from "next/link";
import type { Suburb } from "@/types/suburb";
import { FEE_SOURCES, STATE_FEES, formatPct, formatPctRange, formatWeeksOfRent, type LandlordModel } from "@/lib/rental-landlord";

/**
 * The landlord block of the rental-market sub-page (commercial intent review
 * 30 Sep 2026, section 3.1): what property managers charge in the suburb's
 * state, worked on the suburb's own rent where the model found one whose
 * source it can name. The suburb's state answers first; the eight-state
 * table sits in a <details> (in the HTML, closed on a phone-length page).
 * The owner's action, the selling guide, is in the page header. (The rental
 * appraisal request is gone: no property manager is contracted to take it.
 * RentalAppraisalForm stays for if one is.) Copy that follows an expression
 * is written as a string so the Turbopack build keeps its leading space.
 */
export function RentalMarketLandlordSections({ suburb, landlord }: { suburb: Suburb; landlord: LandlordModel }) {
  const { fees, workedLine, ancillary } = landlord;
  const ancillarySources = [...new Map(ancillary.map((f) => [f.source.label, f.source])).values()];
  return (
    <section id="property-manager-fees" className="scroll-mt-20">
      <h2 className="font-display text-2xl sm:text-3xl font-normal text-ink tracking-[-0.03em] mb-4">
        What property managers charge in {suburb.name}
      </h2>

      {fees && (
        <p className="font-sans text-base sm:text-lg text-ink leading-relaxed max-w-3xl">
          {`In ${fees.name} a property manager typically charges `}
          <strong className="font-semibold">{`${formatPct(fees.managementPct)} of the rent collected`}</strong>
          {", plus a letting fee of about "}
          <strong className="font-semibold">{formatWeeksOfRent(fees.lettingWeeks)}</strong>
          {` each time a new tenant signs. REIQ's guide puts the range at ${formatPctRange(fees.metro)} in metro areas and ${formatPctRange(fees.regional)} in regional areas.`}
        </p>
      )}

      {workedLine && (
        <div className="mt-5 rounded-xl border border-line bg-surface-warm p-5 sm:p-6 max-w-3xl">
          <p className="font-sans text-[13px] text-ink-muted mb-1.5">Worked on the {suburb.name} median</p>
          <p className="font-sans text-base text-ink leading-relaxed">{workedLine}</p>
          <p className="font-sans text-xs text-ink-subtle mt-3">
            {"Before the other fees below, and before tax: management and letting fees are deductible against the rent. The "}
            <Link href="/rental-yield-calculator" className="underline hover:text-primary">rental yield calculator</Link>
            {" takes the full set of costs."}
          </p>
        </div>
      )}

      <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-3xl mt-5">
        {"No state fixes property management fees. The "}
        <a href={FEE_SOURCES.nswGov.url} rel="noopener" className="underline hover:text-primary">NSW Government</a>
        {" says the fees and conditions of a management agency agreement are negotiable; the "}
        <a href={FEE_SOURCES.qldGov.url} rel="noopener" className="underline hover:text-primary">Queensland Government</a>
        {" asks landlords to agree every fee first and put it in writing; "}
        <a href={FEE_SOURCES.reiwa.url} rel="noopener" className="underline hover:text-primary">REIWA</a>
        {" publishes no guideline fees and says they are set by the market. The table is what published guides report for each state, so use it to check a quote, not as a rate card."}
      </p>

      <details className="group mt-5 rounded-xl border border-line" open={fees ? undefined : true}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-sans text-[15px] font-semibold text-ink">
          Property management fees in every state
          <span aria-hidden="true" className="text-ink-muted text-lg leading-none transition-transform group-open:rotate-45">+</span>
        </summary>
        <div className="overflow-x-auto border-t border-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-warm border-b border-line">
                <th scope="col" className="py-3 px-4 text-left font-semibold text-ink">State</th>
                <th scope="col" className="py-3 px-4 text-right font-semibold text-ink">Typical fee</th>
                <th scope="col" className="py-3 px-4 text-right font-semibold text-ink hidden sm:table-cell">Metro range</th>
                <th scope="col" className="py-3 px-4 text-right font-semibold text-ink hidden sm:table-cell">Regional range</th>
                <th scope="col" className="py-3 px-4 text-right font-semibold text-ink">Letting fee</th>
              </tr>
            </thead>
            <tbody>
              {STATE_FEES.map((row) => {
                const here = fees?.state === row.state;
                return (
                  <tr key={row.state} className={`border-b border-line last:border-0 ${here ? "bg-surface-warm" : ""}`}>
                    <th scope="row" className="py-3 px-4 text-left font-medium text-ink">
                      {row.name}
                      {here && <span className="ml-2 text-[13px] font-normal text-ink-muted">{suburb.name}</span>}
                    </th>
                    <td className="py-3 px-4 text-right text-ink whitespace-nowrap">{formatPct(row.managementPct)}</td>
                    <td className="py-3 px-4 text-right text-ink-muted hidden sm:table-cell whitespace-nowrap">{formatPctRange(row.metro)}</td>
                    <td className="py-3 px-4 text-right text-ink-muted hidden sm:table-cell whitespace-nowrap">{formatPctRange(row.regional)}</td>
                    <td className="py-3 px-4 text-right text-ink">{formatWeeksOfRent(row.lettingWeeks)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
      <p className="font-sans text-xs text-ink-subtle mt-3 max-w-3xl">
        {`Typical management fee and letting fee: ${FEE_SOURCES.laf.label}, ${FEE_SOURCES.laf.date}. Metro and regional ranges: ${FEE_SOURCES.reiq.label}, ${FEE_SOURCES.reiq.date}. Percentages are of the rent collected; a letting fee is charged once per new tenancy.`}
      </p>

      <div className="mt-8 max-w-3xl">
        <h3 className="font-display text-lg font-normal text-ink mb-2">Other fees to ask about</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 font-sans text-sm text-ink-muted border-t border-line sm:border-t-0">
          {ancillary.map((f) => (
            <li key={f.label} className="flex justify-between gap-4 border-b border-line py-2.5">
              <span>{f.label}</span>
              <span className="text-ink">{f.range}</span>
            </li>
          ))}
        </ul>
        <p className="font-sans text-xs text-ink-subtle mt-3">
          {`Sources: ${ancillarySources.map((s) => `${s.label}, ${s.date}`).join("; ")}. Tribunal representation, maintenance mark-ups and statement fees vary by agency and belong on the schedule you ask for. `}
          <Link href="/guides/property-management-fees-australia" className="underline hover:text-primary">Property management fees by state</Link>
          {" covers the full list."}
        </p>
      </div>
    </section>
  );
}
