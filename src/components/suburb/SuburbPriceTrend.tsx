interface SuburbPriceTrendProps {
  /** Current median house price in dollars */
  medianHousePrice: number;
  /** Annual growth rate as a percentage, e.g. 6.5 for 6.5% */
  annualGrowthHouse: number;
  /** Suburb name for the aria-label */
  suburbName: string;
  /** How many years back to project (default 5) */
  years?: number;
}

function formatPriceShort(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1000)}K`;
  return `$${Math.round(n)}`;
}

/**
 * Backward-projecting 5-year price trend sparkline.
 *
 * The trend is derived from the current median house price compounded
 * backward at the suburb's current annual growth rate. We show this as
 * "trajectory at this growth rate", not "historical sales", labelled
 * honestly so readers understand it's a derived projection, not raw
 * sale-by-sale history.
 *
 * Renders inline in the suburb hero/snapshot area. Pure SVG, no chart
 * library, keeps the bundle clean and the render server-side.
 */
export function SuburbPriceTrend({
  medianHousePrice,
  annualGrowthHouse,
  suburbName,
  years = 5,
}: SuburbPriceTrendProps) {
  // Bail out if we don't have meaningful data
  if (medianHousePrice <= 0 || annualGrowthHouse === 0) return null;

  // Compound the current price backward to derive the trajectory line
  const growthFactor = 1 + annualGrowthHouse / 100;
  const trajectory: { year: number; price: number }[] = [];
  const currentYear = new Date().getFullYear();
  for (let i = years; i >= 0; i--) {
    const price = medianHousePrice / Math.pow(growthFactor, i);
    trajectory.push({ year: currentYear - i, price });
  }

  // SVG dimensions
  const w = 280;
  const h = 60;
  const padX = 4;
  const padY = 8;

  const minPrice = Math.min(...trajectory.map((t) => t.price));
  const maxPrice = Math.max(...trajectory.map((t) => t.price));
  const priceRange = Math.max(maxPrice - minPrice, 1);

  const xStep = (w - padX * 2) / (trajectory.length - 1);
  const points = trajectory.map((t, i) => ({
    x: padX + i * xStep,
    y: padY + (h - padY * 2) * (1 - (t.price - minPrice) / priceRange),
    price: t.price,
    year: t.year,
  }));

  const pathLine = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const pathArea = `${pathLine} L${points[points.length - 1].x.toFixed(1)},${h - padY} L${points[0].x.toFixed(1)},${h - padY} Z`;

  const isPositive = annualGrowthHouse >= 0;
  const stroke = isPositive ? "#059669" : "#b91c1c"; // emerald-600 or red-700
  const fillFrom = isPositive ? "rgba(5,150,105,0.20)" : "rgba(185,28,28,0.18)";
  const fillTo = isPositive ? "rgba(5,150,105,0.00)" : "rgba(185,28,28,0.00)";

  const startPrice = points[0].price;
  const endPrice = points[points.length - 1].price;
  const totalChange = ((endPrice - startPrice) / startPrice) * 100;

  return (
    <div
      className="rounded-2xl border border-line bg-surface-warm p-5"
      role="figure"
      aria-label={`${suburbName} median house price trend over ${years} years at ${annualGrowthHouse.toFixed(1)}% annual growth`}
    >
      <div className="flex items-baseline justify-between mb-3 gap-3">
        <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle">
          {years}-year trajectory
        </p>
        <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle">
          at {annualGrowthHouse > 0 ? "+" : ""}{annualGrowthHouse.toFixed(1)}%/yr
        </p>
      </div>

      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height={h}
        preserveAspectRatio="none"
        className="block"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`trend-fill-${isPositive ? "pos" : "neg"}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillFrom} />
            <stop offset="100%" stopColor={fillTo} />
          </linearGradient>
        </defs>
        <path d={pathArea} fill={`url(#trend-fill-${isPositive ? "pos" : "neg"})`} />
        <path
          d={pathLine}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* End point dot */}
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3.5" fill={stroke} />
      </svg>

      <div className="mt-3 grid grid-cols-3 gap-2 items-baseline">
        <div>
          <p className="text-[10px] font-sans uppercase tracking-wider text-ink-subtle">
            {trajectory[0].year}
          </p>
          <p className="font-display text-base text-ink-muted leading-tight">
            {formatPriceShort(trajectory[0].price)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-sans uppercase tracking-wider text-ink-subtle">
            {years}-year change
          </p>
          <p className={`font-display text-base leading-tight ${totalChange >= 0 ? "text-emerald-700" : "text-red-700"}`}>
            {totalChange >= 0 ? "+" : ""}
            {totalChange.toFixed(0)}%
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-sans uppercase tracking-wider text-ink-subtle">
            {trajectory[trajectory.length - 1].year}
          </p>
          <p className="font-display text-base text-ink leading-tight">
            {formatPriceShort(trajectory[trajectory.length - 1].price)}
          </p>
        </div>
      </div>

      <p className="mt-3 text-[11px] font-sans text-ink-subtle leading-relaxed">
        Trajectory derived from the current median compounded at the suburb&rsquo;s
        annual growth rate, not raw sale-by-sale history.
      </p>
    </div>
  );
}
