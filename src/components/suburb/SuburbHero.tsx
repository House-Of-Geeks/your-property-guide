import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SuburbSearch } from "./SuburbSearch";
import type { Suburb } from "@/types";
import { formatPriceFull, formatPercentage } from "@/lib/utils/format";
import { fullLgaName } from "@/lib/utils/lga-names";
import { SourceTooltip } from "./SourceTooltip";

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
      <div className="bg-surface-raised border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-sm font-sans text-ink-subtle flex-wrap">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li className="flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/suburbs" className="hover:text-primary transition-colors">Suburbs</Link>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-ink font-medium">
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
        {/* Editorial gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/55 pointer-events-none" />
        {/* Editorial suburb label with Playfair display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
          <p className="text-xs font-sans uppercase tracking-[0.3em] text-white/70 mb-3 drop-shadow">
            {fullLgaName(suburb.region)}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white drop-shadow-lg leading-[1.05] tracking-tight">
            <span className="italic">{suburb.name}</span>
          </h1>
          <div className="mt-4 inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-sm font-sans font-medium tracking-wide text-white">
              {suburb.state}
            </span>
            <span className="w-px h-3 bg-white/30" />
            <span className="text-sm font-sans tracking-wide text-white/80">
              {suburb.postcode}
            </span>
          </div>
        </div>
      </div>

      {/* Tab navigation bar */}
      <nav className="sticky top-0 z-30 bg-surface-raised border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto scrollbar-none">
            {TAB_LINKS.map((tab) => (
              <a
                key={tab.href}
                href={tab.href}
                className="flex-shrink-0 px-5 py-4 text-xs font-sans uppercase tracking-[0.2em] text-ink-muted hover:text-ink border-b-2 border-transparent hover:border-cta transition-colors"
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
  const { stats, dataFreshness: f } = suburb;
  const na = "–";
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard
        label="Median House Price"
        value={stats.medianHousePrice ? formatPriceFull(stats.medianHousePrice) : na}
        subtext={stats.annualGrowthHouse ? `${formatPercentage(stats.annualGrowthHouse)} annual growth` : "Sales data pending"}
        icon="/images/icons/median.svg"
        source={f?.salesSource}
        asOf={f?.salesAsOf}
      />
      <StatCard
        label="Median Unit Price"
        value={stats.medianUnitPrice ? formatPriceFull(stats.medianUnitPrice) : na}
        subtext={stats.annualGrowthUnit ? `${formatPercentage(stats.annualGrowthUnit)} annual growth` : "Sales data pending"}
        icon="/images/icons/yield.svg"
        source={f?.salesSource}
        asOf={f?.salesAsOf}
      />
      <StatCard
        label="Days on Market"
        value={stats.daysOnMarket ? `${stats.daysOnMarket}` : na}
        subtext="Average days to sell"
        icon="/images/icons/growth.svg"
        source={f?.salesSource}
        asOf={f?.salesAsOf}
      />
      <StatCard
        label="Population"
        value={stats.population ? stats.population.toLocaleString() : na}
        subtext={stats.medianAge ? `Median age: ${stats.medianAge}` : "Census data pending"}
        icon="/images/icons/people.svg"
        source="abs-census"
        asOf={f?.censusAsOf}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  subtext,
  icon,
  source,
  asOf,
}: {
  label: string;
  value: string;
  subtext: string;
  icon: string;
  source?: string | null;
  asOf?: Date | string | null;
}) {
  return (
    <div className="p-5 rounded-xl bg-surface-raised border border-line">
      <div className="flex items-center gap-2 mb-2">
        <Image src={icon} alt="" width={20} height={20} className="w-5 h-5" aria-hidden="true" />
        <span className="text-xs font-sans font-medium text-ink-subtle uppercase tracking-wider">{label}</span>
        <SourceTooltip source={source} asOf={asOf} />
      </div>
      <p className="font-display text-3xl text-ink leading-none mt-2">{value}</p>
      <p className="text-xs font-sans text-ink-muted mt-2">{subtext}</p>
    </div>
  );
}
