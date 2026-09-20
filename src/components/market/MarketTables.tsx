import Link from "next/link";
import type { CityMarketSuburb } from "@/lib/services/city-market-service";
import { formatPriceFull } from "@/lib/utils/format";

// Shared presentation for the market rollup pages (/property-market/{city}
// and /regions/{slug}): the stat card row and the ranked suburb table.
// Extracted from the city page unchanged so the region template renders
// the same rollup the same way.

export function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface-raised p-6">
      <div className="flex items-center gap-2 mb-3 text-ink-subtle">
        {icon}
        <p className="text-xs font-sans uppercase tracking-[0.2em]">{label}</p>
      </div>
      <p className="font-display text-3xl text-ink leading-none">{value}</p>
      {sub && <p className="mt-2 text-xs font-sans text-ink-subtle">{sub}</p>}
    </div>
  );
}

export function SuburbTable({
  heading,
  rows,
  showGrowth,
  showSales,
  as,
}: {
  heading: string;
  rows: CityMarketSuburb[];
  showGrowth?: boolean;
  showSales?: boolean;
  as?: "h2" | "h3";
}) {
  if (rows.length === 0) return null;
  const Heading = as ?? "h3";
  return (
    <section>
      <Heading className={`font-display ${as === "h2" ? "text-2xl sm:text-3xl" : "text-2xl"} text-ink mb-4 leading-tight`}>{heading}</Heading>
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface-raised">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-warm border-b border-line">
              <th className="px-4 py-3 text-left text-xs font-sans font-medium text-ink uppercase tracking-wide w-10">#</th>
              <th className="px-4 py-3 text-left text-xs font-sans font-medium text-ink uppercase tracking-wide">Suburb</th>
              <th className="px-4 py-3 text-right text-xs font-sans font-medium text-ink uppercase tracking-wide">Median price</th>
              {showGrowth && (
                <th className="px-4 py-3 text-right text-xs font-sans font-medium text-ink uppercase tracking-wide">12-month change</th>
              )}
              {showSales && (
                <th className="px-4 py-3 text-right text-xs font-sans font-medium text-ink uppercase tracking-wide">House sales</th>
              )}
              <th className="px-4 py-3 text-right text-xs font-sans font-medium text-ink uppercase tracking-wide">Prices</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row, i) => (
              <tr key={row.slug} className="hover:bg-surface-warm/60 transition-colors">
                <td className="px-4 py-3 font-sans text-ink-subtle tabular-nums">{i + 1}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/suburbs/${row.slug}#market`}
                    className="font-sans font-medium text-ink hover:text-primary transition-colors"
                  >
                    {row.name}
                  </Link>
                  <span className="text-xs font-sans text-ink-subtle ml-1.5">{row.postcode}</span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  <span className="font-display text-base text-ink">
                    {row.medianHousePrice > 0 ? formatPriceFull(row.medianHousePrice) : "-"}
                  </span>
                </td>
                {showGrowth && (
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span
                      className={`font-display text-base ${
                        (row.annualGrowthHouse ?? 0) > 0
                          ? "text-emerald-700"
                          : (row.annualGrowthHouse ?? 0) < 0
                            ? "text-red-700"
                            : "text-ink-subtle"
                      }`}
                    >
                      {row.annualGrowthHouse
                        ? `${row.annualGrowthHouse > 0 ? "+" : ""}${row.annualGrowthHouse.toFixed(1)}%`
                        : "-"}
                    </span>
                  </td>
                )}
                {showSales && (
                  <td className="px-4 py-3 text-right tabular-nums font-sans text-sm text-ink-muted">
                    {row.salesCountHouse > 0 ? row.salesCountHouse.toLocaleString() : "–"}
                  </td>
                )}
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/suburbs/${row.slug}#market`}
                    className="font-sans text-xs font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors whitespace-nowrap"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
