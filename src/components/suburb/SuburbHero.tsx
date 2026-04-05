import Image from "next/image";
import type { Suburb } from "@/types";
import { formatPriceFull, formatPercentage } from "@/lib/utils/format";
import { TrendingUp, Clock, Users } from "lucide-react";

interface SuburbHeroProps {
  suburb: Suburb;
}

const GMAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

export function SuburbHero({ suburb }: SuburbHeroProps) {
  const query = encodeURIComponent(`${suburb.name} ${suburb.state} ${suburb.postcode}`);
  const embedUrl = GMAPS_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${GMAPS_KEY}&q=${query}&zoom=14`
    : null;

  return (
    <div className="relative">
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${suburb.name}`}
          />
        ) : (
          <Image
            src={suburb.heroImage}
            alt={`${suburb.name} ${suburb.state}`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 lg:p-12 pointer-events-none">
          <div className="mx-auto max-w-7xl">
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow">
              {suburb.name}
            </p>
            <p className="text-lg text-white/90 mt-2 drop-shadow">
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
