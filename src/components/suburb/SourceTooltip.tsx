import { Info } from "lucide-react";

/**
 * Maps internal source IDs to human-readable labels.
 * Add new entries here as sync scripts are added.
 */
const SOURCE_LABELS: Record<string, string> = {
  // Sales
  "sales-nsw":  "NSW Valuer General (PSI)",
  "sales-vic":  "Land Victoria / DTP",
  "sales-sa":   "data.sa.gov.au",
  "sales-abs":  "ABS Data by Region (SA2-level, 2024)",
  "sales-qld":  "ABS Census 2021 (estimated)",
  "sales-wa":   "ABS Census 2021 (estimated)",
  "seed":       "Estimated (seed data)",
  // Rental
  "rental-vic": "RTBA — Residential Tenancies Bond Authority (VIC)",
  "rental-nsw": "NSW Fair Trading",
  "rental-sa":  "Consumer and Business Services SA",
  "rental-qld": "QLD Government (RTA)",
  // Crime
  "crime-nsw":  "BOCSAR — NSW Bureau of Crime Statistics",
  "crime-vic":  "Crime Statistics Agency VIC",
  "crime-sa":   "SA Police",
  "crime-qld":  "Queensland Police Service (LGA-level)",
  "crime-wa":   "WA Police Force",
  "crime-act":  "ACT Policing (PROMIS)",
  // Other
  "housing-rai":    "SGS Economics Rental Affordability Index",
  "acara-schools":  "ACARA",
  "bom-climate":    "Bureau of Meteorology",
  "hazard-flood":   "Geoscience Australia (AFRIP)",
  "hazard-bushfire":"State Government GIS",
  "walkability":    "OpenStreetMap / Overpass",
  "abs-census":     "ABS Census 2021",
};

export function sourceLabel(id: string | null | undefined): string {
  if (!id) return "Unknown source";
  return SOURCE_LABELS[id] ?? id;
}

interface SourceTooltipProps {
  source: string | null | undefined;
  asOf?:  Date | string | null;
}

/**
 * Small ℹ icon that reveals data provenance on hover.
 * Pure CSS — works in Server Components.
 */
export function SourceTooltip({ source, asOf }: SourceTooltipProps) {
  if (!source) return null;

  const label = sourceLabel(source);
  const dateStr = asOf
    ? new Date(asOf).toLocaleDateString("en-AU", { month: "short", year: "numeric" })
    : null;

  const tip = dateStr ? `${label} · ${dateStr}` : label;

  return (
    <span className="relative inline-flex items-center group/tip ml-auto flex-shrink-0">
      <Info className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500 cursor-help transition-colors" />
      {/* Tooltip bubble */}
      <span
        className={[
          "pointer-events-none absolute bottom-full right-0 mb-1.5 z-20",
          "w-max max-w-56 rounded-md bg-gray-900 px-2.5 py-1.5",
          "text-xs text-white leading-snug whitespace-normal",
          "opacity-0 group-hover/tip:opacity-100",
          "translate-y-1 group-hover/tip:translate-y-0",
          "transition-all duration-150",
          "shadow-lg",
        ].join(" ")}
        role="tooltip"
      >
        <span className="font-medium">Source: </span>{tip}
        {/* Arrow */}
        <span className="absolute top-full right-3 border-4 border-transparent border-t-gray-900" />
      </span>
    </span>
  );
}
