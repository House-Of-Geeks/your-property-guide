import { Droplets, Flame } from "lucide-react";

interface SuburbHazardProps {
  floodClass:      string | null;
  bushfireRisk:    string | null;
  floodSource?:    string | null;
  bushfireSource?: string | null;
}

type RiskLevel = "high" | "medium" | "low" | "floodway" | null;

function normalise(value: string | null): RiskLevel {
  if (!value) return null;
  const v = value.toLowerCase().trim();
  if (v === "floodway") return "floodway";
  if (v === "high")     return "high";
  if (v === "medium")   return "medium";
  if (v === "low")      return "low";
  return null;
}

interface BadgeConfig {
  label: string;
  className: string;
}

function badgeConfig(level: RiskLevel): BadgeConfig {
  switch (level) {
    case "floodway": return { label: "Floodway",    className: "bg-red-700 text-white" };
    case "high":     return { label: "High Risk",   className: "bg-red-100 text-red-700 border border-red-200" };
    case "medium":   return { label: "Medium Risk", className: "bg-amber-100 text-amber-700 border border-amber-200" };
    case "low":      return { label: "Low Risk",    className: "bg-green-100 text-green-700 border border-green-200" };
    default:         return { label: "No data",     className: "bg-gray-100 text-gray-500 border border-gray-200" };
  }
}

export function SuburbHazard({ floodClass, bushfireRisk, floodSource, bushfireSource }: SuburbHazardProps) {
  const floodLevel     = normalise(floodClass);
  const bushfireLevel  = normalise(bushfireRisk);

  if (floodLevel === null && bushfireLevel === null) {
    return (
      <p className="text-sm font-sans text-ink-muted py-2">
        No significant hazard data recorded for this suburb.
      </p>
    );
  }

  const floodBadge    = badgeConfig(floodLevel);
  const bushfireBadge = badgeConfig(bushfireLevel);

  const rows = [
    { label: "Flood risk", icon: <Droplets className="w-4 h-4 text-ink-muted flex-shrink-0" aria-hidden="true" />, level: floodLevel, raw: floodClass, badge: floodBadge, source: floodSource },
    { label: "Bushfire risk", icon: <Flame className="w-4 h-4 text-ink-muted flex-shrink-0" aria-hidden="true" />, level: bushfireLevel, raw: bushfireRisk, badge: bushfireBadge, source: bushfireSource },
  ];

  return (
    <div>
      <dl className="divide-y divide-line border-y border-line">
        {rows.map((r) => (
          <div key={r.label} className="py-3 grid grid-cols-[1fr_auto] items-center gap-x-3">
            <dt className="flex items-center gap-2 text-[15px] font-sans text-ink">
              {r.icon}
              {r.label}
            </dt>
            <dd>
              <span className={`inline-block text-sm font-medium px-2.5 py-0.5 rounded-md ${r.badge.className}`}>
                {r.level ? (r.raw ?? r.badge.label) : r.badge.label}
              </span>
            </dd>
            {r.source && <dd className="col-span-2 mt-1 text-xs font-sans text-ink-subtle">{r.source}</dd>}
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs font-sans text-ink-subtle">
        Risk levels are indicative. Always check with local council.
      </p>
    </div>
  );
}
