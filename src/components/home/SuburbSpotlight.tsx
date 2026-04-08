import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui";
import { getFeaturedSuburbs } from "@/lib/services/suburb-service";
import { db } from "@/lib/db";
import { formatPrice, formatPercentage } from "@/lib/utils/format";

const MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

function staticMapUrl(name: string, state: string, postcode: string): string | null {
  if (!MAP_KEY) return null;
  const center = encodeURIComponent(`${name} ${state} ${postcode} Australia`);
  // Muted roadmap style — strips most colour for a clean magazine feel
  const styles = [
    "style=feature:all|element:geometry|color:0xf0efec",
    "style=feature:water|element:geometry|color:0xd4d1cc",
    "style=feature:road|element:geometry|color:0xe8e6e2",
    "style=feature:road.arterial|element:geometry|color:0xdedbd6",
    "style=feature:poi|visibility:off",
    "style=feature:transit|visibility:off",
    "style=feature:all|element:labels|visibility:simplified",
    "style=feature:all|element:labels.text.fill|color:0x888888",
    "style=feature:all|element:labels.text.stroke|color:0xf0efec",
  ].join("&");
  return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=13&size=640x400&maptype=roadmap&${styles}&key=${MAP_KEY}`;
}

export async function SuburbSpotlight() {
  const suburbs = await getFeaturedSuburbs(6);
  const slugs = suburbs.map((s) => s.slug);
  const hazards = await db.suburbHazard.findMany({ where: { suburbSlug: { in: slugs } } });
  const hazardMap = Object.fromEntries(hazards.map((h) => [h.suburbSlug, h]));

  return (
    <section className="py-16 bg-white border-t border-[#e8e6e2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-black">Explore suburb data</h2>
            <p className="text-gray-500 mt-1">Median prices, growth trends and local insights</p>
          </div>
          <Link href="/suburbs" className="hidden sm:block">
            <Button variant="outline" size="sm">
              All Suburbs <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suburbs.map((suburb) => {
            const mapUrl = staticMapUrl(suburb.name, suburb.state, suburb.postcode);
            const imgSrc = mapUrl ?? suburb.heroImage;

            return (
              <Link key={suburb.slug} href={`/suburbs/${suburb.slug}`} className="group block">
                <div className="relative rounded-xl overflow-hidden">
                  <div className="aspect-[16/10]">
                    <Image
                      src={imgSrc}
                      alt={`Map of ${suburb.name}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized={!!mapUrl}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  {/* Top-right badges */}
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                    {suburb.stats.walkScore != null && (
                      <span className="rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-2 py-0.5 text-xs font-semibold text-white">
                        Walk {suburb.stats.walkScore}
                      </span>
                    )}
                    {(() => {
                      const h = hazardMap[suburb.slug];
                      if (!h) return null;
                      const risk = h.floodClass === "high" || h.floodClass === "floodway" || h.bushfireRisk === "high";
                      const medium = h.floodClass === "medium" || h.bushfireRisk === "medium";
                      if (!risk && !medium) return null;
                      return (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold text-white border backdrop-blur-sm ${risk ? "bg-black/60 border-white/30" : "bg-black/40 border-white/20"}`}>
                          {risk ? "High risk" : "Med risk"}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <h3 className="text-xl font-bold text-white">{suburb.name}</h3>
                    <p className="text-sm text-white/70">{suburb.state} {suburb.postcode}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-white/90">
                      <span>Median: {formatPrice(suburb.stats.medianHousePrice)}</span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {formatPercentage(suburb.stats.annualGrowthHouse)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
