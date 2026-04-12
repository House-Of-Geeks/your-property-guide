import { formatPriceFull } from "@/lib/utils/format";

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
  suburb: { stats: InvestmentStats };
}

function calcYield(rentPerWeek: number, price: number): string {
  if (!rentPerWeek || !price) return "–";
  const yld = ((rentPerWeek * 52) / price) * 100;
  return `${yld.toFixed(2)}%`;
}

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
}

function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="p-4 rounded-xl bg-white shadow-card border border-gray-100">
      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export function SuburbInvestment({ suburb }: SuburbInvestmentProps) {
  const s = suburb.stats;

  const houseYield = s.medianRentHouse && s.medianHousePrice
    ? calcYield(s.medianRentHouse, s.medianHousePrice)
    : "–";

  const unitYield = s.medianRentUnit && s.medianUnitPrice
    ? calcYield(s.medianRentUnit, s.medianUnitPrice)
    : "–";

  const houseGrowth = s.annualGrowthHouse
    ? `${s.annualGrowthHouse >= 0 ? "+" : ""}${s.annualGrowthHouse.toFixed(1)}%`
    : "–";

  const unitGrowth = s.annualGrowthUnit
    ? `${s.annualGrowthUnit >= 0 ? "+" : ""}${s.annualGrowthUnit.toFixed(1)}%`
    : "–";

  const ownerOccupied = s.ownerOccupied ? `${s.ownerOccupied.toFixed(0)}%` : "–";
  const daysOnMarket = s.daysOnMarket ? `${s.daysOnMarket} days` : "–";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard
          label="Gross Yield (House)"
          value={houseYield}
          sub={
            s.medianHousePrice
              ? `Based on ${formatPriceFull(s.medianHousePrice)} median`
              : undefined
          }
        />
        <StatCard
          label="Gross Yield (Unit)"
          value={unitYield}
          sub={
            s.medianUnitPrice
              ? `Based on ${formatPriceFull(s.medianUnitPrice)} median`
              : undefined
          }
        />
        <StatCard
          label="Annual Growth (House)"
          value={houseGrowth}
          sub="Year-on-year capital growth"
        />
        <StatCard
          label="Annual Growth (Unit)"
          value={unitGrowth}
          sub="Year-on-year capital growth"
        />
        <StatCard
          label="Owner Occupancy"
          value={ownerOccupied}
          sub="Higher = more owner-occupier demand"
        />
        <StatCard
          label="Days on Market"
          value={daysOnMarket}
          sub="Lower = higher buyer demand"
        />
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-xs text-blue-700">
          <span className="font-semibold">Gross rental yield</span> is annual rent divided by purchase price, before expenses. It does not account for vacancy rates, management fees, maintenance, or financing costs. Use this as a starting point for further research.
        </p>
      </div>
    </div>
  );
}
