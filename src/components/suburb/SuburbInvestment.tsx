import { formatPriceFull } from "@/lib/utils/format";
import { SourceTooltip } from "./SourceTooltip";
import type { SuburbDataFreshness } from "@/types";

interface InvestmentStats {
  medianHousePrice: number;
  medianUnitPrice: number;
  medianRentHouse: number;
  medianRentUnit: number;
  annualGrowthHouse: number;
  annualGrowthUnit: number;
  ownerOccupied: number;
  renterOccupied: number;
  daysOnMarket: number;
}

interface SuburbInvestmentProps {
  suburb: {
    stats: InvestmentStats;
    dataFreshness?: SuburbDataFreshness;
  };
}

function calcYield(rentPerWeek: number, price: number): string | null {
  if (!rentPerWeek || !price) return null;
  const yld = ((rentPerWeek * 52) / price) * 100;
  return `${yld.toFixed(2)}%`;
}

interface Row {
  label: string;
  value: string | null;
  sub?: string;
  source?: string | null;
  asOf?: Date | string | null;
}

export function SuburbInvestment({ suburb }: SuburbInvestmentProps) {
  const s = suburb.stats;
  const f = suburb.dataFreshness;

  const houseYield = s.medianRentHouse && s.medianHousePrice
    ? calcYield(s.medianRentHouse, s.medianHousePrice)
    : null;

  const unitYield = s.medianRentUnit && s.medianUnitPrice
    ? calcYield(s.medianRentUnit, s.medianUnitPrice)
    : null;

  const houseGrowth = s.annualGrowthHouse
    ? `${s.annualGrowthHouse >= 0 ? "+" : ""}${s.annualGrowthHouse.toFixed(1)}%`
    : null;

  const unitGrowth = s.annualGrowthUnit
    ? `${s.annualGrowthUnit >= 0 ? "+" : ""}${s.annualGrowthUnit.toFixed(1)}%`
    : null;

  // Owner occupancy sits with the demographics and days on market with the
  // figures at the top of the page, so they are not repeated here. A row
  // with nothing to show is left out rather than printed as a dash.
  const candidates: Row[] = [
    {
      label: "Gross yield, houses",
      value: houseYield,
      sub: s.medianHousePrice ? `On the ${formatPriceFull(s.medianHousePrice)} median` : undefined,
      source: f?.salesSource ?? f?.rentalSource,
      asOf: f?.salesAsOf ?? f?.rentalAsOf,
    },
    {
      label: "Gross yield, units",
      value: unitYield,
      sub: s.medianUnitPrice ? `On the ${formatPriceFull(s.medianUnitPrice)} median` : undefined,
      source: f?.salesSource ?? f?.rentalSource,
      asOf: f?.salesAsOf ?? f?.rentalAsOf,
    },
    { label: "12-month change, houses", value: houseGrowth, source: f?.salesSource, asOf: f?.salesAsOf },
    { label: "12-month change, units", value: unitGrowth, source: f?.salesSource, asOf: f?.salesAsOf },
  ];
  const rows = candidates.filter((r): r is Row & { value: string } => r.value !== null);

  if (rows.length === 0) return null;

  return (
    <div>
      <dl className="grid grid-cols-2 border-t border-line">
        {rows.map((r, i) => (
          <div key={r.label} className={`py-3 border-b border-line ${i % 2 === 1 ? "pl-4 border-l" : "pr-4"}`}>
            <dt className="flex items-center gap-1 text-[13px] font-sans text-ink-muted">
              <span className="flex-1">{r.label}</span>
              <SourceTooltip source={r.source} asOf={r.asOf} />
            </dt>
            <dd className="mt-1 font-display text-2xl font-normal text-ink leading-none">{r.value}</dd>
            {r.sub && <dd className="mt-1.5 text-xs text-ink-muted leading-snug">{r.sub}</dd>}
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs font-sans text-ink-muted leading-relaxed">
        Gross rental yield is a year&rsquo;s rent divided by the purchase
        price, before expenses. It leaves out vacancy, management fees,
        maintenance and financing costs, so treat it as a starting point.
      </p>
    </div>
  );
}
