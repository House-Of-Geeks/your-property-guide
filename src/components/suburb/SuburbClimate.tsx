import type { Suburb } from "@/types/suburb";

interface SuburbClimateProps {
  climate: Suburb["climate"];
}

const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export function SuburbClimate({ climate }: SuburbClimateProps) {
  if (!climate) {
    return (
      <p className="text-sm text-gray-500 italic py-2">
        Climate data not yet available for this suburb.
      </p>
    );
  }

  const { bomStationName, distanceKm, meanMaxTemp, meanMinTemp, meanRainfall, annualRainfallMm } = climate;

  // Summary stats
  const hottest = meanMaxTemp.length > 0 ? Math.max(...meanMaxTemp) : null;
  const coldest = meanMinTemp.length > 0 ? Math.min(...meanMinTemp) : null;

  // Bar chart — scale bars to max rainfall
  const maxRainfall = meanRainfall.length > 0 ? Math.max(...meanRainfall, 1) : 1;

  return (
    <div className="space-y-5">

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Annual Rainfall</p>
          <p className="text-2xl font-bold text-gray-900">
            {annualRainfallMm !== null ? `${Math.round(annualRainfallMm)} mm` : "–"}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Hottest Month (avg max)</p>
          <p className="text-2xl font-bold text-gray-900">
            {hottest !== null ? `${hottest.toFixed(1)}°C` : "–"}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Coldest Month (avg min)</p>
          <p className="text-2xl font-bold text-gray-900">
            {coldest !== null ? `${coldest.toFixed(1)}°C` : "–"}
          </p>
        </div>
      </div>

      {/* Monthly rainfall bar chart */}
      {meanRainfall.length === 12 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">Monthly Rainfall (mm)</p>
          <div className="flex items-end gap-1 h-24">
            {meanRainfall.map((mm, i) => {
              const heightPct = (mm / maxRainfall) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end" style={{ height: "80px" }}>
                    <div
                      className="w-full rounded-t bg-blue-400"
                      style={{ height: `${heightPct}%` }}
                      title={`${MONTH_LABELS[i]}: ${mm.toFixed(0)} mm`}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 leading-none">{MONTH_LABELS[i]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Attribution */}
      <p className="text-xs text-gray-400">
        Weather data from BOM station {bomStationName} ({distanceKm.toFixed(0)} km away)
      </p>

    </div>
  );
}
