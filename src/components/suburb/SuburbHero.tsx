import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SuburbSearch } from "./SuburbSearch";
import type { Suburb } from "@/types";
import { formatPriceFull, formatPercentage } from "@/lib/utils/format";
import { TrendingUp, Clock, Users } from "lucide-react";

interface SuburbHeroProps {
  suburb: Suburb;
}

const GMAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

const TAB_LINKS = [
  { label: "About",        href: "#about"        },
  { label: "Market",       href: "#market"       },
  { label: "Demographics", href: "#demographics" },
  { label: "Location",     href: "#location"     },
  { label: "Schools",      href: "#schools"      },
];

export function SuburbHero({ suburb }: SuburbHeroProps) {
  const query = encodeURIComponent(`${suburb.name} ${suburb.state} ${suburb.postcode}`);
  const embedUrl = GMAPS_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${GMAPS_KEY}&q=${query}&zoom=13&maptype=satellite`
    : null;

  return (
    <>
      {/* Breadcrumb + search bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li className="flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/suburbs" className="hover:text-primary transition-colors">Suburb Profile</Link>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-gray-900 font-medium">
                  {suburb.name} {suburb.state} {suburb.postcode}
                </span>
              </li>
            </ol>
          </nav>

          <SuburbSearch />
        </div>
      </div>

      {/* Satellite hero */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-gray-900">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Aerial map of ${suburb.name}`}
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
        {/* Subtle dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        {/* Centered suburb label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
            {suburb.name}
          </h1>
          <p className="text-xl font-medium text-white/95 mt-2 drop-shadow">
            {suburb.state} {suburb.postcode}
          </p>
          <p className="text-sm text-white/80 mt-1 drop-shadow">
            {suburb.region}
          </p>
        </div>
      </div>

      {/* Tab navigation bar */}
      <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto scrollbar-none">
            {TAB_LINKS.map((tab) => (
              <a
                key={tab.href}
                href={tab.href}
                className="flex-shrink-0 px-5 py-4 text-sm font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-primary transition-colors"
              >
                {tab.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
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
    <div className="p-4 rounded-xl bg-white shadow-card border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtext}</p>
    </div>
  );
}
