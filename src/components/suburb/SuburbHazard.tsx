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
      <p className="text-sm text-gray-400 italic py-2">
        No significant hazard data recorded for this suburb.
      </p>
    );
  }

  const floodBadge    = badgeConfig(floodLevel);
  const bushfireBadge = badgeConfig(bushfireLevel);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Flood card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Droplets className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <span className="font-semibold text-gray-800">Flood Risk</span>
          </div>
          <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${floodBadge.className}`}>
            {floodLevel ? (floodClass ?? floodBadge.label) : floodBadge.label}
          </span>
          {floodSource && (
            <p className="mt-2 text-xs text-gray-400">{floodSource}</p>
          )}
        </div>

        {/* Bushfire card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <span className="font-semibold text-gray-800">Bushfire Risk</span>
          </div>
          <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${bushfireBadge.className}`}>
            {bushfireLevel ? (bushfireRisk ?? bushfireBadge.label) : bushfireBadge.label}
          </span>
          {bushfireSource && (
            <p className="mt-2 text-xs text-gray-400">{bushfireSource}</p>
          )}
        </div>

      </div>
      <p className="text-xs text-gray-400 italic">
        Risk levels are indicative. Always check with local council.
      </p>
    </div>
  );
}
