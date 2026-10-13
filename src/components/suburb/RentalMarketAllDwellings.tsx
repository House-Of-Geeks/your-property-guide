import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AllDwellingsMarket } from "@/lib/rental-market";
import { ALL_DWELLINGS_LABEL, SMALL_SAMPLE_BONDS, quarterSpan } from "@/lib/rental-labels";

// The rental-market body for a suburb whose rent comes from a feed with no
// dwelling type (WA bond data): one median across all dwellings, its bond
// count, the change on a year earlier, the quarterly history and the
// attribution the CC BY licence asks for. No yield: a yield needs a house
// rent against the house price (src/lib/rental-labels.ts).

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="font-sans text-[13px] text-ink-muted mb-1.5">{label}</p>
      <p className="font-display text-2xl font-bold text-ink leading-none">{value}</p>
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
      <section id="current-rent" className="scroll-mt-20">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-5">
          {`Median weekly rent in ${name}`}
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
        <p className="font-sans text-sm text-ink-muted mt-4 max-w-3xl leading-relaxed">
          {`The median of the ${bondsText} in ${c.span} for properties in ${name}: houses, units and every other dwelling together. The bond records carry no dwelling type, so this page shows no separate house or unit rent and no gross yield, which needs a house rent against the house price.`}
          {c.smallSample && c.bonds !== null
            ? ` With ${c.bonds} bonds (${SMALL_SAMPLE_BONDS} or fewer) this is a small sample: a few unusual leases move it, so read it as a guide.`
            : ""}
          {change ? ` A year earlier, in ${quarterSpan(change.fromPeriod)}, the median was ${money(change.fromWeekly)}.` : ""}
        </p>
      </section>

      {all.quarters.length >= 2 && (
        <section id="history" className="scroll-mt-20">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-5">
            How rents have moved
          </h2>
          <div className="rounded-xl border border-line overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-warm border-b border-line">
                    <th scope="col" className="py-3 px-4 text-left font-semibold text-ink">Quarter</th>
                    <th scope="col" className="py-3 px-4 text-right font-semibold text-ink">{`${ALL_DWELLINGS_LABEL} (median)`}</th>
                    <th scope="col" className="py-3 px-4 text-right font-semibold text-ink">Bonds lodged</th>
                  </tr>
                </thead>
                <tbody>
                  {all.quarters.map((q) => (
                    <tr key={q.period} className="border-b border-line last:border-0">
                      <td className="py-3 px-4 font-medium text-ink">{quarterSpan(q.period)}</td>
                      <td className="py-3 px-4 text-right text-ink">{`${money(q.weekly)}/wk`}</td>
                      <td className="py-3 px-4 text-right text-ink">{q.bonds !== null ? q.bonds.toLocaleString("en-AU") : "–"}</td>
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
        <section className="border-t border-line pt-4">
          <p className="font-sans text-xs text-ink-muted leading-relaxed max-w-3xl">
            {"Source: "}
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
        <p className="font-sans text-base text-ink">
          <Link
            href={`/suburbs/${slug}/rent`}
            className="inline-flex items-center gap-2 font-medium underline decoration-line-strong underline-offset-4 hover:text-primary hover:decoration-primary"
          >
            {`Properties for rent in ${name} now`} <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </p>
      )}
    </>
  );
}
