import { ChevronDown } from "lucide-react";

interface CrimeStat {
  totalOffences: number;
  offenceBreakdown: unknown;
  period: string;
  state: string;
  /** "suburb" = exact match for this suburb; "lga" = LGA-wide fallback. */
  geoLevel?: "suburb" | "lga";
  /** Set when geoLevel is "lga", name of the LGA the data covers. */
  lgaName?: string;
}

interface SuburbCrimeProps {
  crimeStat: CrimeStat | null;
}

function parseBreakdown(raw: unknown): Record<string, number> {
  if (raw === null || raw === undefined) return {};
  if (typeof raw === "object" && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>;
    const result: Record<string, number> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === "number") result[key] = val;
    }
    return result;
  }
  return {};
}

export function SuburbCrime({ crimeStat }: SuburbCrimeProps) {
  if (!crimeStat) {
    return (
      <p className="text-sm font-sans text-ink-muted">
        Crime data not available for this suburb.
      </p>
    );
  }

  const breakdown = parseBreakdown(crimeStat.offenceBreakdown);
  const total = crimeStat.totalOffences;

  const topCategories = Object.entries(breakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxCount = topCategories.length > 0 ? topCategories[0][1] : 1;

  return (
    <div>
      <p className="text-ink">
        <span className="font-display text-3xl font-normal tracking-[-0.03em]">{total.toLocaleString()}</span>{" "}
        <span className="text-[15px] text-ink-muted">
          {crimeStat.geoLevel === "lga"
            ? <>offences recorded in {crimeStat.period} across the {crimeStat.lgaName} LGA</>
            : <>offences recorded in {crimeStat.period}</>}
        </span>
      </p>

      {crimeStat.geoLevel === "lga" && (
        <p className="mt-3 text-sm font-sans text-ink-muted leading-relaxed">
          {crimeStat.state} Police publishes these figures only for the whole{" "}
          <span className="font-medium text-ink">{crimeStat.lgaName ?? "LGA"}</span>, which
          may include suburbs with very different crime profiles. Quieter
          residential pockets likely have lower rates than the total suggests;
          busier areas may have higher.
        </p>
      )}

      {/* The breakdown stays in the HTML, folded: the total answers most
          readers, and five bars cost a phone screen. */}
      {topCategories.length > 0 && (
        <details className="group mt-4 border-y border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
            Top offence categories
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="space-y-3 pb-4">
            {topCategories.map(([category, count]) => {
              const pct = total > 0 ? (count / total) * 100 : 0;
              const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <div key={category}>
                  <div className="flex items-center justify-between gap-3 text-sm font-sans mb-1">
                    <span className="text-ink capitalize">
                      {category.replace(/_/g, " ")}
                    </span>
                    <span className="text-ink-muted shrink-0">
                      {count.toLocaleString()}{" "}
                      <span className="text-ink-subtle">
                        ({pct.toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-surface-warm rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ink-muted rounded-full"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      )}

      <p className="mt-3 text-xs font-sans text-ink-subtle">
        Source: State Police Open Data
      </p>
    </div>
  );
}
