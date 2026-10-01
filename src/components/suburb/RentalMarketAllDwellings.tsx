import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DataFreshnessNote } from "@/components/suburb/DataFreshnessNote";
import type { AllDwellingsMarket } from "@/lib/rental-market";
import { ALL_DWELLINGS_LABEL, SMALL_SAMPLE_BONDS, quarterSpan } from "@/lib/rental-labels";

// The rental-market body for a suburb whose rent comes from a feed with no
// dwelling type (WA bond data): one median across all dwellings, its bond
// count, the change on a year earlier, the quarterly history and the
// attribution the CC BY licence asks for. No yield: a yield needs a house
// rent against the house price (src/lib/rental-labels.ts).

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface-raised p-4 shadow-card">
      <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-1">{label}</p>
      <p className="font-display text-2xl text-ink leading-none">{value}</p>
    </div>
  );
}

const money = (n: number) => `$${n.toLocaleString("en-AU")}`;

export function RentalMarketAllDwellings({
  name,
  slug,
  all,
  rentListings,
}: {
  name: string;
  slug: string;
  all: AllDwellingsMarket;
  rentListings: boolean;
}) {
  const c = all.current;
  const change = all.change;
  const bondsText = c.bonds !== null ? `${c.bonds.toLocaleString("en-AU")} bonds lodged` : "the bonds lodged";
  return (
    <>
      <section>
        <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
          Current rent
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
          What it costs to rent here right now.
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <MetricCard label={`${ALL_DWELLINGS_LABEL} (median)`} value={`${money(c.weekly)}/wk`} />
          {c.bonds !== null && <MetricCard label="Bonds lodged" value={c.bonds.toLocaleString("en-AU")} />}
          {change && (
            <MetricCard
              label="On a year earlier"
              value={change.pct === 0 ? "No change" : `${change.pct > 0 ? "+" : "-"}${Math.abs(change.pct)}%`}
            />
          )}
        </div>
        <p className="font-sans text-sm text-ink-muted mt-4 max-w-3xl">
          {`The median of the ${bondsText} in ${c.span} for properties in ${name}: houses, units and every other dwelling together. The bond records carry no dwelling type, so this page shows no separate house or unit rent and no gross yield, which needs a house rent against the house price.`}
          {c.smallSample && c.bonds !== null
            ? ` With ${c.bonds} bonds (${SMALL_SAMPLE_BONDS} or fewer) this is a small sample: a few unusual leases move it, so read it as a guide.`
            : ""}
          {change ? ` A year earlier, in ${quarterSpan(change.fromPeriod)}, the median was ${money(change.fromWeekly)}.` : ""}
        </p>
        <DataFreshnessNote label="Rental" asOf={c.periodDate} source={c.label} />
      </section>

      {all.quarters.length >= 2 && (
        <section>
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
            History
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
            How rents have moved.
          </h2>
          <div className="rounded-2xl border border-line bg-surface-raised overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-warm border-b border-line-warm">
                    <th className="py-4 px-5 text-left text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">Quarter</th>
                    <th className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">{`${ALL_DWELLINGS_LABEL} (median)`}</th>
                    <th className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">Bonds lodged</th>
                  </tr>
                </thead>
                <tbody>
                  {all.quarters.map((q) => (
                    <tr key={q.period} className="border-b border-line last:border-0 hover:bg-surface-sunken transition-colors">
                      <td className="py-4 px-5 font-medium text-ink">{quarterSpan(q.period)}</td>
                      <td className="py-4 px-5 text-right tabular-nums text-ink-muted">{`${money(q.weekly)}/wk`}</td>
                      <td className="py-4 px-5 text-right tabular-nums text-ink-muted">{q.bonds !== null ? q.bonds.toLocaleString("en-AU") : "–"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="font-sans text-xs text-ink-subtle mt-3">
            {`A quarter with 10 or fewer bonds, or with half or more of its bonds at one rent, is not shown: a gap in the list means no reliable median for that quarter.`}
          </p>
        </section>
      )}

      {all.attribution && (
        <section className="rounded-2xl border border-line bg-surface-raised p-5 sm:p-6">
          <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">Source</p>
          <p className="font-sans text-sm text-ink-muted leading-relaxed">
            <a href={all.attribution.datasetUrl} className="underline hover:text-primary" rel="noopener">
              {all.attribution.dataset}
            </a>
            {`, ${all.attribution.credit}, used under `}
            <a href={all.attribution.licenceUrl} className="underline hover:text-primary" rel="noopener license">
              {all.attribution.licence}
            </a>
            {`. ${all.attribution.method}`}
          </p>
        </section>
      )}

      {rentListings && (
        <div className="rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
              Active listings
            </p>
            <h3 className="font-display text-xl sm:text-2xl text-ink leading-tight">
              {`Properties for rent in ${name}.`}
            </h3>
            <p className="font-sans text-sm text-ink-muted mt-2">
              Browse current rental listings.
            </p>
          </div>
          <Link
            href={`/suburbs/${slug}/rent`}
            className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface-raised text-ink hover:border-ink font-medium px-5 py-2.5 transition-colors"
          >
            View rentals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </>
  );
}
