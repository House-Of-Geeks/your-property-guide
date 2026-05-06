import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp } from "lucide-react";
import { getFeaturedSuburbs } from "@/lib/services/suburb-service";
import { db } from "@/lib/db";
import { formatPrice, formatPercentage } from "@/lib/utils/format";

const GMAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

export async function SuburbSpotlight() {
  const suburbs = await getFeaturedSuburbs(6);
  const slugs = suburbs.map((s) => s.slug);
  const hazards = await db.suburbHazard.findMany({ where: { suburbSlug: { in: slugs } } });
  const hazardMap = Object.fromEntries(hazards.map((h) => [h.suburbSlug, h]));

  return (
    <section className="py-16 sm:py-20 bg-surface-raised border-t border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-surface-warm border border-line-warm flex items-center justify-center shrink-0">
                <img src="/images/icons/map.svg" alt="" width={24} height={24} className="w-6 h-6" aria-hidden="true" />
              </div>
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle">
                Explore suburb data
              </p>
            </div>
            <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
              Six suburbs <span className="italic text-primary">worth a look</span>.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex items-end justify-end">
            <Link
              href="/suburbs"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-primary transition-colors border-b border-line-strong hover:border-primary pb-0.5"
            >
              All suburbs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suburbs.map((suburb) => {
            const query = encodeURIComponent(`${suburb.name} ${suburb.state} ${suburb.postcode}`);
            const embedUrl = GMAPS_KEY
              ? `https://www.google.com/maps/embed/v1/place?key=${GMAPS_KEY}&q=${query}&zoom=13&maptype=satellite`
              : null;

            return (
              <Link key={suburb.slug} href={`/suburbs/${suburb.slug}`} className="group block">
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-gray-900">

                  {/* Map background */}
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Aerial map of ${suburb.name}`}
                    />
                  ) : (
                    <Image
                      src={suburb.heroImage}
                      alt={suburb.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Top-right badges */}
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1 pointer-events-none">
                    {suburb.stats.walkScore != null && (
                      <span className="rounded-full bg-black/50 backdrop-blur-sm border border-white/20 px-2 py-0.5 text-xs font-semibold text-white">
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
                        <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white border border-white/20 bg-black/50 backdrop-blur-sm">
                          {risk ? "High risk" : "Med risk"}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Text */}
                  <div className="absolute bottom-0 inset-x-0 p-4 pointer-events-none">
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
