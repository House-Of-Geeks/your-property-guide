import { ShieldCheck } from "lucide-react";

interface CrimeStat {
  totalOffences: number;
  offenceBreakdown: unknown;
  period: string;
  state: string;
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
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-sm text-gray-500 italic">
          Crime data not available for this suburb.
        </p>
      </div>
    );
  }

  const breakdown = parseBreakdown(crimeStat.offenceBreakdown);
  const total = crimeStat.totalOffences;

  const topCategories = Object.entries(breakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxCount = topCategories.length > 0 ? topCategories[0][1] : 1;

  return (
    <div className="space-y-4">
      {/* Summary card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <span className="font-semibold text-gray-800">Offence Summary</span>
        </div>

        <div className="mb-4">
          <p className="text-3xl font-bold text-gray-900">
            {total.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            total offences in {crimeStat.period}
          </p>
        </div>

        {topCategories.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Top offence categories
            </p>
            {topCategories.map(([category, count]) => {
              const pct = total > 0 ? (count / total) * 100 : 0;
              const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <div key={category}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 capitalize">
                      {category.replace(/_/g, " ")}
                    </span>
                    <span className="text-gray-500 tabular-nums">
                      {count.toLocaleString()}{" "}
                      <span className="text-gray-500">
                        ({pct.toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-400 rounded-full"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-50 space-y-1">
          <p className="text-xs text-gray-500 italic">
            Crime statistics are reported at LGA level and may cover a broader area than this suburb.
          </p>
          <p className="text-xs text-gray-500">
            Source: State Police Open Data
          </p>
        </div>
      </div>
    </div>
  );
}
