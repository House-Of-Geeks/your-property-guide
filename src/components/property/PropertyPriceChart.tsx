import { formatPrice } from "@/lib/utils/format";

interface PriceChartPoint {
  date: Date;
  price: number;
}

interface PropertyPriceChartProps {
  points: PriceChartPoint[];
  suburbMedian?: number | null;
}

export function PropertyPriceChart({ points, suburbMedian }: PropertyPriceChartProps) {
  if (points.length < 2) return null;

  const sorted = [...points].sort((a, b) => a.date.getTime() - b.date.getTime());
  const w = 720;
  const h = 220;
  const padX = 56;
  const padY = 32;

  const yVals = sorted.map((p) => p.price);
  const xVals = sorted.map((p) => p.date.getTime());
  if (suburbMedian) yVals.push(suburbMedian);
  const minY = Math.min(...yVals);
  const maxY = Math.max(...yVals);
  const minX = Math.min(...xVals);
  const maxX = Math.max(...xVals);
  const yRange = Math.max(1, maxY - minY);
  const xRange = Math.max(1, maxX - minX);

  const sx = (t: number) => padX + ((t - minX) / xRange) * (w - padX * 2);
  const sy = (v: number) => h - padY - ((v - minY) / yRange) * (h - padY * 2);

  const linePoints = sorted.map((p) => `${sx(p.date.getTime())},${sy(p.price)}`).join(" ");
  const areaPoints = `${padX},${h - padY} ${linePoints} ${w - padX},${h - padY}`;

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const yearsSpan = (last.date.getTime() - first.date.getTime()) / (365.25 * 24 * 3600 * 1000);
  const totalGrowth = ((last.price - first.price) / first.price) * 100;
  const cagr = yearsSpan > 0.5 ? (Math.pow(last.price / first.price, 1 / yearsSpan) - 1) * 100 : null;
  const isUp = last.price >= first.price;

  // y-axis tick values, 3 ticks
  const ticks = [minY, (minY + maxY) / 2, maxY];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-700">Sale price history</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {sorted.length} sales over {yearsSpan < 1 ? "less than a year" : `${yearsSpan.toFixed(1)} years`}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isUp
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : "bg-red-50 text-red-700 border border-red-100"
          }`}
        >
          {isUp ? "▲" : "▼"} {Math.abs(totalGrowth).toFixed(1)}%
          {cagr !== null && <span className="text-gray-400 font-normal ml-1">({cagr.toFixed(1)}%/yr)</span>}
        </span>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ppc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* horizontal gridlines */}
        {ticks.map((v, i) => (
          <line
            key={i}
            x1={padX}
            x2={w - padX}
            y1={sy(v)}
            y2={sy(v)}
            stroke="#f3f4f6"
            strokeWidth={1}
          />
        ))}

        {/* y-axis labels */}
        {ticks.map((v, i) => (
          <text
            key={`t-${i}`}
            x={padX - 8}
            y={sy(v) + 3}
            textAnchor="end"
            fontSize="10"
            fill="#9ca3af"
          >
            {formatPrice(v)}
          </text>
        ))}

        {/* suburb median benchmark */}
        {suburbMedian && suburbMedian >= minY && suburbMedian <= maxY && (
          <>
            <line
              x1={padX}
              x2={w - padX}
              y1={sy(suburbMedian)}
              y2={sy(suburbMedian)}
              stroke="#9ca3af"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
            <text
              x={w - padX - 4}
              y={sy(suburbMedian) - 6}
              textAnchor="end"
              fontSize="10"
              fill="#6b7280"
              fontWeight={500}
            >
              Suburb median
            </text>
          </>
        )}

        {/* area + line */}
        <polygon points={areaPoints} fill="url(#ppc-fill)" />
        <polyline
          points={linePoints}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* dots + labels for first/last */}
        {sorted.map((p, i) => {
          const cx = sx(p.date.getTime());
          const cy = sy(p.price);
          const showLabel = i === 0 || i === sorted.length - 1;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={5} fill="white" stroke="var(--primary)" strokeWidth={2.5} />
              {showLabel && (
                <text
                  x={cx}
                  y={cy - 12}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={600}
                  fill="#111827"
                >
                  {formatPrice(p.price)}
                </text>
              )}
              {showLabel && (
                <text
                  x={cx}
                  y={h - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6b7280"
                >
                  {p.date.getFullYear()}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
