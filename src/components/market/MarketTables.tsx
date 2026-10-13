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
    <div className="tone-light rounded-xl border border-line bg-surface-raised p-6">
      <div className="flex items-center gap-2 mb-4 text-ink-subtle">
        {icon}
        <p className="text-sm">{label}</p>
      </div>
      <p className="text-3xl sm:text-4xl font-bold text-ink leading-none tracking-[-0.03em]">{value}</p>
      {sub && <p className="mt-3 text-sm text-ink-subtle">{sub}</p>}
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
      <Heading
        className={`${as === "h2" ? "text-3xl sm:text-4xl leading-[1.1] tracking-[-0.025em] mb-6" : "text-2xl leading-tight mb-4"} text-ink`}
      >
        {heading}
      </Heading>
      <div className="tone-light overflow-x-auto rounded-xl border border-line bg-surface-raised">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-warm border-b border-line">
              <th className="px-4 py-3 text-left text-[13px] font-sans font-medium text-ink w-10">#</th>
              <th className="px-4 py-3 text-left text-[13px] font-sans font-medium text-ink">Suburb</th>
              <th className="px-4 py-3 text-right text-[13px] font-sans font-medium text-ink">Median price</th>
              {showGrowth && (
                <th className="px-4 py-3 text-right text-[13px] font-sans font-medium text-ink">12-month change</th>
              )}
              {showSales && (
                <th className="px-4 py-3 text-right text-[13px] font-sans font-medium text-ink">House sales</th>
              )}
              <th className="px-4 py-3 text-right text-[13px] font-sans font-medium text-ink">Prices</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row, i) => (
              <tr key={row.slug} className="hover:bg-surface-warm/60 transition-colors">
                <td className="px-4 py-3 font-sans text-ink-subtle">{i + 1}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/suburbs/${row.slug}#market`}
                    className="font-sans font-medium text-ink hover:text-primary transition-colors"
                  >
                    {row.name}
                  </Link>
                  <span className="text-xs font-sans text-ink-subtle ml-1.5">{row.postcode}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-display text-base text-ink">
                    {row.medianHousePrice > 0 ? formatPriceFull(row.medianHousePrice) : "-"}
                  </span>
                </td>
                {showGrowth && (
                  <td className="px-4 py-3 text-right">
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
                  <td className="px-4 py-3 text-right font-sans text-sm text-ink-muted">
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
