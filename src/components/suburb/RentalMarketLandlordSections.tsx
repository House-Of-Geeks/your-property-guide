import Link from "next/link";
import type { Suburb } from "@/types/suburb";
import { FEE_SOURCES, STATE_FEES, formatPct, formatPctRange, formatWeeksOfRent, type LandlordModel } from "@/lib/rental-landlord";
import { RentalAppraisalForm } from "./RentalAppraisalForm";

/**
 * The landlord blocks of the rental-market sub-page (commercial intent review
 * 30 Sep 2026, section 3.1): the rental appraisal request and what property
 * managers charge in the suburb's state. Rendered on every rental-market
 * page, with or without rental data; the worked line prints only where the
 * model found a rent whose source it can name. Copy that follows an
 * expression is written as a string so the Turbopack build keeps its
 * leading space.
 */
export function RentalMarketLandlordSections({ suburb, landlord }: { suburb: Suburb; landlord: LandlordModel }) {
  const { fees, workedLine, ancillary } = landlord;
  const ancillarySources = [...new Map(ancillary.map((f) => [f.source.label, f.source])).values()];
  return (
    <>
      <section id="rental-appraisal" className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-2">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">Landlords</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-4">
            Get a rental appraisal for your {suburb.name} property.
          </h2>
          <p className="font-sans text-base text-ink-muted leading-relaxed">
            {`A rental appraisal tells you what your property should let for in ${suburb.name} today, from recent comparable lettings rather than the suburb median. One local property manager receives your request and calls to arrange it; there is no charge and no obligation to appoint them.`}
          </p>
          <ul className="mt-5 space-y-2 font-sans text-sm text-ink-muted">
            <li className="flex gap-2"><span className="text-cta" aria-hidden="true">•</span>A weekly rent range for your property, in writing.</li>
            <li className="flex gap-2"><span className="text-cta" aria-hidden="true">•</span>Their management and letting fees, so you can check them against the table below.</li>
            <li className="flex gap-2"><span className="text-cta" aria-hidden="true">•</span>Suits an owner with a tenant in place, a vacant property, or one still being bought.</li>
          </ul>
        </div>
        <div className="lg:col-span-3">
          <RentalAppraisalForm suburbName={suburb.name} suburbSlug={suburb.slug} state={suburb.state} postcode={suburb.postcode} />
        </div>
      </section>

      <section id="property-manager-fees">
        <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">Management fees</p>
        <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-4">
          What property managers charge in {suburb.name}.
        </h2>
        <p className="font-sans text-base text-ink-muted leading-relaxed max-w-3xl">
          {"No state fixes property management fees. The "}
          <a href={FEE_SOURCES.nswGov.url} rel="noopener" className="underline hover:text-primary">NSW Government</a>
          {" says the fees and conditions of a management agency agreement are negotiable; the "}
          <a href={FEE_SOURCES.qldGov.url} rel="noopener" className="underline hover:text-primary">Queensland Government</a>
          {" asks landlords to agree every fee first and put it in writing; "}
          <a href={FEE_SOURCES.reiwa.url} rel="noopener" className="underline hover:text-primary">REIWA</a>
          {" publishes no guideline fees and says they are set by the market. The table is what published guides report for each state, so use it to check a quote, not as a rate card."}
        </p>

        <div className="mt-6 rounded-2xl border border-line bg-surface-raised overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-warm border-b border-line-warm">
                  <th scope="col" className="py-4 px-5 text-left text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">State</th>
                  <th scope="col" className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">Management fee, typical</th>
                  <th scope="col" className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider hidden sm:table-cell">Metro range</th>
                  <th scope="col" className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider hidden sm:table-cell">Regional range</th>
                  <th scope="col" className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">Letting fee</th>
                </tr>
              </thead>
              <tbody>
                {STATE_FEES.map((row) => {
                  const here = fees?.state === row.state;
                  return (
                    <tr key={row.state} className={`border-b border-line last:border-0 ${here ? "bg-surface-warm" : ""}`}>
                      <th scope="row" className="py-4 px-5 text-left font-medium text-ink">
                        {row.name}
                        {here && <span className="ml-2 text-[11px] font-sans font-normal uppercase tracking-wider text-ink-subtle">{suburb.name}</span>}
                      </th>
                      <td className="py-4 px-5 text-right tabular-nums text-ink-muted">{formatPct(row.managementPct)}</td>
                      <td className="py-4 px-5 text-right tabular-nums text-ink-muted hidden sm:table-cell">{formatPctRange(row.metro)}</td>
                      <td className="py-4 px-5 text-right tabular-nums text-ink-muted hidden sm:table-cell">{formatPctRange(row.regional)}</td>
                      <td className="py-4 px-5 text-right tabular-nums text-ink-muted">{formatWeeksOfRent(row.lettingWeeks)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <p className="font-sans text-xs text-ink-subtle mt-3">
          {`Typical management fee and letting fee: ${FEE_SOURCES.laf.label}, ${FEE_SOURCES.laf.date}. Metro and regional ranges: ${FEE_SOURCES.reiq.label}, ${FEE_SOURCES.reiq.date}. Percentages are of the rent collected; a letting fee is charged once per new tenancy.`}
        </p>

        {workedLine && (
          <div className="mt-6 rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-8">
            <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">Worked on the {suburb.name} median</p>
            <p className="font-sans text-base text-ink leading-relaxed">{workedLine}</p>
            <p className="font-sans text-xs text-ink-subtle mt-3">
              {"Before the other fees below, and before tax: management and letting fees are deductible against the rent. The "}
              <Link href="/rental-yield-calculator" className="underline hover:text-primary">rental yield calculator</Link>
              {" takes the full set of costs."}
            </p>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-display text-xl text-ink mb-3">Other fees to ask about</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 font-sans text-sm text-ink-muted">
            {ancillary.map((f) => (
              <li key={f.label} className="flex justify-between gap-4 border-b border-line py-2">
                <span>{f.label}</span>
                <span className="tabular-nums text-ink">{f.range}</span>
              </li>
            ))}
          </ul>
          <p className="font-sans text-xs text-ink-subtle mt-3">
            {`Sources: ${ancillarySources.map((s) => `${s.label}, ${s.date}`).join("; ")}. Tribunal representation, maintenance mark-ups and statement fees vary by agency and belong on the schedule you ask for. `}
            <Link href="/guides/property-management-fees-australia" className="underline hover:text-primary">The eight fee types and what is negotiable</Link>
            {" covers the full list."}
          </p>
        </div>
      </section>
    </>
  );
}
