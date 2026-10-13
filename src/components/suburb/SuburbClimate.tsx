import { ChevronDown } from "lucide-react";
import type { Suburb } from "@/types/suburb";

interface SuburbClimateProps {
  climate: Suburb["climate"];
}

const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export function SuburbClimate({ climate }: SuburbClimateProps) {
  if (!climate) {
    return (
      <p className="text-sm font-sans text-ink-muted py-2">
        Climate data not yet available for this suburb.
      </p>
    );
  }

  const { bomStationName, distanceKm, meanMaxTemp, meanMinTemp, meanRainfall, annualRainfallMm } = climate;

  // Summary stats
  const hottest = meanMaxTemp.length > 0 ? Math.max(...meanMaxTemp) : null;
  const coldest = meanMinTemp.length > 0 ? Math.min(...meanMinTemp) : null;

  // Bar chart, scale bars to max rainfall
  const maxRainfall = meanRainfall.length > 0 ? Math.max(...meanRainfall, 1) : 1;

  const stats = [
    { label: "Annual rainfall", value: annualRainfallMm !== null ? `${Math.round(annualRainfallMm).toLocaleString("en-AU")} mm` : "–" },
    { label: "Hottest month, avg max", value: hottest !== null ? `${hottest.toFixed(1)}°C` : "–" },
    { label: "Coldest month, avg min", value: coldest !== null ? `${coldest.toFixed(1)}°C` : "–" },
  ];

  return (
    <div>
      <dl className="grid grid-cols-3 divide-x divide-line border-y border-line">
        {stats.map((s) => (
          <div key={s.label} className="py-3 px-3 first:pl-0 flex flex-col justify-between gap-1">
            <dt className="text-[13px] font-sans text-ink-muted leading-snug">{s.label}</dt>
            <dd className="font-display text-xl sm:text-2xl font-bold text-ink leading-none">{s.value}</dd>
          </div>
        ))}
      </dl>

      {/* Monthly rainfall, folded: the three figures above answer the
          question; the chart stays in the HTML for anyone who opens it. */}
      {meanRainfall.length === 12 && (
        <details className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
            Rainfall by month
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="flex items-end gap-1 h-24 pb-4">
            {meanRainfall.map((mm, i) => {
              const heightPct = (mm / maxRainfall) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end" style={{ height: "64px" }}>
                    <div
                      className="w-full rounded-t-sm bg-ink-muted"
                      style={{ height: `${heightPct}%` }}
                      title={`${MONTH_LABELS[i]}: ${mm.toFixed(0)} mm`}
                    />
                  </div>
                  <span className="text-[10px] font-sans text-ink-subtle leading-none">{MONTH_LABELS[i]}</span>
                </div>
              );
            })}
          </div>
        </details>
      )}

      <p className="mt-3 text-xs font-sans text-ink-subtle">
        Weather data from BOM station {bomStationName} ({distanceKm.toFixed(0)} km away)
      </p>
    </div>
  );
}
