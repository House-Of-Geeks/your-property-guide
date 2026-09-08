import Link from "next/link";
import { ArrowRight, BarChart3, Home, TrendingUp } from "lucide-react";
import type { Suburb } from "@/types/suburb";
import type { RentalMarketModel } from "@/lib/rental-market";
import { Faq } from "@/components/guide/Faq";
import { formatPriceFull } from "@/lib/utils/format";
import { monthYear } from "@/lib/rental-labels";

const money = (n: number) => `$${n.toLocaleString("en-AU")}`;

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface-raised p-4 shadow-card">
      <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-1">{label}</p>
      <p className="font-display text-2xl text-ink leading-none">{value}</p>
      {sub && <p className="font-sans text-xs text-ink-muted mt-2">{sub}</p>}
    </div>
  );
}

const changeText = (n: number | null) => (n === null ? undefined : `${n > 0 ? "+" : ""}${n}% over 12 months`);

/**
 * The rebuilt rental-market sub-page (fix item 13). Every section renders
 * only when the model says its data exists; the model also built the title
 * and the FAQ from the same figures, so nothing on the page promises what
 * another section cannot show.
 */
export function RentalMarketSections({ suburb, slug, model: m }: { suburb: Suburb; slug: string; model: RentalMarketModel }) {
  const c = m.current;
  if (!c) return null;
  const has = (s: RentalMarketModel["sections"][number]) => m.sections.includes(s);
  return (
    <>
      <section id="current-rent">
        <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">Current rent</p>
        <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
          What it costs to rent in {suburb.name} now.
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {c.house && <MetricCard label="Houses (median)" value={`${money(c.house)}/wk`} sub={changeText(m.change?.house ?? null)} />}
          {c.unit && <MetricCard label="Units (median)" value={`${money(c.unit)}/wk`} sub={changeText(m.change?.unit ?? null)} />}
          {c.bed3 && <MetricCard label="3 bedroom" value={`${money(c.bed3)}/wk`} />}
          {c.bed2 && <MetricCard label="2 bedroom" value={`${money(c.bed2)}/wk`} />}
          {c.bed1 && <MetricCard label="1 bedroom" value={`${money(c.bed1)}/wk`} />}
        </div>
        {m.provenance && (
          <p className="font-sans text-xs text-ink-subtle mt-4">
            Source: {m.provenance}. Medians of new rentals recorded in the period.
          </p>
        )}
      </section>

      {has("yield") && (
        <section id="yield" className="rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">Investor view</p>
          <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-6">
            Rental yield against the purchase price.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {m.yieldHouse && c.house && (
              <>
                <div>
                  <div className="flex items-center gap-2 text-ink-muted text-sm mb-2"><Home className="w-4 h-4 text-cta" />Median house price</div>
                  <p className="font-display text-3xl text-ink leading-none">{formatPriceFull(suburb.stats.medianHousePrice)}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-ink-muted text-sm mb-2"><BarChart3 className="w-4 h-4 text-cta" />Median house rent</div>
                  <p className="font-display text-3xl text-ink leading-none">{money(c.house)}/wk</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-ink-muted text-sm mb-2"><TrendingUp className="w-4 h-4 text-cta" />Gross yield, houses</div>
                  <p className="font-display text-3xl text-success leading-none">{m.yieldHouse}%</p>
                </div>
              </>
            )}
          </div>
          {m.yieldUnit && c.unit && (
            <p className="font-sans text-sm text-ink-muted mt-5">
              Units: {money(c.unit)}/wk against a {formatPriceFull(suburb.stats.medianUnitPrice)} median, a gross yield of about {m.yieldUnit}%.
            </p>
          )}
          <p className="font-sans text-xs text-ink-subtle mt-6">
            Gross yield = weekly rent × 52 ÷ median price. Before rates, insurance, management fees, maintenance and vacancy. The{" "}
            <Link href="/rental-yield-calculator" className="underline hover:text-primary">rental yield calculator</Link>{" "}
            gives a net estimate.
          </p>
        </section>
      )}

      {has("history") && (
        <section id="history">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">History</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">How rents have moved.</h2>
          <div className="rounded-2xl border border-line bg-surface-raised overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-warm border-b border-line-warm">
                    <th className="py-4 px-5 text-left text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">Period</th>
                    <th className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">Houses</th>
                    <th className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">Units</th>
                    {m.columns.bed3 && <th className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider hidden sm:table-cell">3 bed</th>}
                    {m.columns.bed2 && <th className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider hidden sm:table-cell">2 bed</th>}
                    {m.columns.bed1 && <th className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider hidden sm:table-cell">1 bed</th>}
                    {m.columns.bonds && <th className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider hidden md:table-cell">New bonds</th>}
                  </tr>
                </thead>
                <tbody>
                  {m.history.map((row) => (
                    <tr key={row.id} className="border-b border-line last:border-0">
                      <td className="py-4 px-5 font-medium text-ink">{monthYear(row.periodDate)}</td>
                      <td className="py-4 px-5 text-right tabular-nums text-ink-muted">{row.medianRentHouse ? `${money(row.medianRentHouse)}/wk` : "–"}</td>
                      <td className="py-4 px-5 text-right tabular-nums text-ink-muted">{row.medianRentUnit ? `${money(row.medianRentUnit)}/wk` : "–"}</td>
                      {m.columns.bed3 && <td className="py-4 px-5 text-right tabular-nums text-ink-muted hidden sm:table-cell">{row.medianRent3Bed ? `${money(row.medianRent3Bed)}/wk` : "–"}</td>}
                      {m.columns.bed2 && <td className="py-4 px-5 text-right tabular-nums text-ink-muted hidden sm:table-cell">{row.medianRent2Bed ? `${money(row.medianRent2Bed)}/wk` : "–"}</td>}
                      {m.columns.bed1 && <td className="py-4 px-5 text-right tabular-nums text-ink-muted hidden sm:table-cell">{row.medianRent1Bed ? `${money(row.medianRent1Bed)}/wk` : "–"}</td>}
                      {m.columns.bonds && <td className="py-4 px-5 text-right tabular-nums text-ink-muted hidden md:table-cell">{row.bondLodgements ? row.bondLodgements.toLocaleString("en-AU") : "–"}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {has("listings") && (
        <section id="listings" className="rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">For rent now</p>
            <h2 className="font-display text-xl sm:text-2xl text-ink leading-tight">
              {m.listings} {m.listings === 1 ? "property" : "properties"} for rent in {suburb.name}.
            </h2>
            <p className="font-sans text-sm text-ink-muted mt-2">Current listings with prices, bedrooms and inspection times.</p>
          </div>
          <Link href={`/suburbs/${slug}/rent`} className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface-raised text-ink hover:border-ink font-medium px-5 py-2.5 transition-colors">
            View rentals <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      )}

      {has("faq") && <Faq items={m.faqs} title={`Renting and investing in ${suburb.name}`} />}
    </>
  );
}
