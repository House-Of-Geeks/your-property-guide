import { ChevronDown } from "lucide-react";
import type { Suburb } from "@/types/suburb";
import {
  TEMPERATURE_UNAVAILABLE,
  climateSourceNote,
  hasRealRainfallSeries,
  hasRealTemperatureSeries,
  realAnnualRainfallMm,
  stationDistanceCaveat,
  climateWithheldNote,
} from "@/lib/climate";

interface SuburbClimateProps {
  climate: Suburb["climate"];
  /** The only station on file is too far away to describe this suburb. */
  withheld?: Suburb["climateWithheld"];
  suburbName?: string;
}

const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

// Tailwind needs whole class names, so the column count is looked up.
const GRID_COLS: Record<number, string> = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" };

export function SuburbClimate({ climate, withheld, suburbName }: SuburbClimateProps) {
  if (!climate && withheld) {
    return (
      <p className="text-sm font-sans text-ink-muted py-2">
        {climateWithheldNote(suburbName ?? "this suburb", withheld.stationName, withheld.distanceKm)}
      </p>
    );
  }
  const notYet = (
    <p className="text-sm font-sans text-ink-muted py-2">
      Climate data not yet available for this suburb.
    </p>
  );
  if (!climate) return notYet;

  const { meanMaxTemp, meanMinTemp, meanRainfall } = climate;

  // A rainfall-only station has no temperature series (older syncs stored
  // twelve zeros). Never turn that into 0.0°C: leave the figure out and say so.
  const maxOk = hasRealTemperatureSeries(meanMaxTemp);
  const minOk = hasRealTemperatureSeries(meanMinTemp);
  const rainfallOk = hasRealRainfallSeries(meanRainfall);
  const annualRainfall = realAnnualRainfallMm(climate);

  if (!maxOk && !minOk && annualRainfall === null) return notYet;

  const stats: Array<{ label: string; value: string }> = [];
  if (annualRainfall !== null) {
    stats.push({ label: "Annual rainfall", value: `${Math.round(annualRainfall).toLocaleString("en-AU")} mm` });
  }
  if (maxOk) {
    stats.push({ label: "Hottest month, avg max", value: `${Math.max(...meanMaxTemp).toFixed(1)}°C` });
  }
  if (minOk) {
    stats.push({ label: "Coldest month, avg min", value: `${Math.min(...meanMinTemp).toFixed(1)}°C` });
  }

  const temperatureNote =
    !maxOk && !minOk
      ? TEMPERATURE_UNAVAILABLE
      : !maxOk
      ? "Maximum temperatures aren't available from the nearest station."
      : !minOk
      ? "Minimum temperatures aren't available from the nearest station."
      : null;

  // Bar chart, scaled to the wettest month
  const maxRainfall = rainfallOk ? Math.max(...meanRainfall, 1) : 1;
  const source = [climateSourceNote(climate), stationDistanceCaveat(climate.distanceKm)]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      {stats.length > 0 && (
        <dl className={`grid ${GRID_COLS[stats.length]} divide-x divide-line border-y border-line`}>
          {stats.map((s) => (
            <div key={s.label} className="py-3 px-3 first:pl-0 flex flex-col justify-between gap-1">
              <dt className="text-[13px] font-sans text-ink-muted leading-snug">{s.label}</dt>
              <dd className="font-display text-xl sm:text-2xl font-normal text-ink leading-none">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {temperatureNote && (
        <p className="py-3 text-sm font-sans text-ink-muted border-b border-line">{temperatureNote}</p>
      )}

      {/* Monthly rainfall, folded: the figures above answer the question;
          the chart stays in the HTML for anyone who opens it. */}
      {rainfallOk && (
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

      <p className="mt-3 text-xs font-sans text-ink-subtle">{source}</p>
    </div>
  );
}
