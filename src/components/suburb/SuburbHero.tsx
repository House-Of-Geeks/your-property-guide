import Image from "next/image";
import type { Suburb } from "@/types";
import { formatPriceFull, formatPercentage } from "@/lib/utils/format";
import { TrendingUp, Clock, Users } from "lucide-react";

interface SuburbHeroProps {
  suburb: Suburb;
}

export function SuburbHero({ suburb }: SuburbHeroProps) {
  return (
    <div className="relative">
      <div className="relative h-64 sm:h-80 lg:h-96">
        <Image
          src={suburb.heroImage}
          alt={`${suburb.name} ${suburb.state}`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 lg:p-12">
          <div className="mx-auto max-w-7xl">
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              {suburb.name}
            </p>
            <p className="text-lg text-white/90 mt-2">
              {suburb.state} {suburb.postcode} &middot; {suburb.region}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SuburbStats({ suburb }: SuburbHeroProps) {
  const { stats } = suburb;
  const na = "–";
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard
        label="Median House Price"
        value={stats.medianHousePrice ? formatPriceFull(stats.medianHousePrice) : na}
        subtext={stats.annualGrowthHouse ? `${formatPercentage(stats.annualGrowthHouse)} annual growth` : "Sales data pending"}
        icon={<TrendingUp className="w-5 h-5 text-primary" />}
      />
      <StatCard
        label="Median Unit Price"
        value={stats.medianUnitPrice ? formatPriceFull(stats.medianUnitPrice) : na}
        subtext={stats.annualGrowthUnit ? `${formatPercentage(stats.annualGrowthUnit)} annual growth` : "Sales data pending"}
        icon={<TrendingUp className="w-5 h-5 text-accent" />}
      />
      <StatCard
        label="Days on Market"
        value={stats.daysOnMarket ? `${stats.daysOnMarket}` : na}
        subtext="Average days to sell"
        icon={<Clock className="w-5 h-5 text-primary" />}
      />
      <StatCard
        label="Population"
        value={stats.population ? stats.population.toLocaleString() : na}
        subtext={stats.medianAge ? `Median age: ${stats.medianAge}` : "Census data pending"}
        icon={<Users className="w-5 h-5 text-accent" />}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  subtext,
  icon,
}: {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtext}</p>
    </div>
  );
}
