import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui";
import { getFeaturedSuburbs } from "@/lib/services/suburb-service";
import { formatPrice, formatPercentage } from "@/lib/utils/format";

export async function SuburbSpotlight() {
  const suburbs = await getFeaturedSuburbs(6);

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Explore Suburbs</h2>
            <p className="text-gray-500 mt-1">Discover the best of Moreton Bay</p>
          </div>
          <Link href="/suburbs" className="hidden sm:block">
            <Button variant="outline" size="sm">
              All Suburbs <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suburbs.map((suburb) => (
            <Link key={suburb.slug} href={`/suburbs/${suburb.slug}`} className="group block">
              <div className="relative rounded-xl overflow-hidden">
                <div className="aspect-[16/10]">
                  <Image
                    src={suburb.heroImage}
                    alt={suburb.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <h3 className="text-xl font-bold text-white">{suburb.name}</h3>
                  <p className="text-sm text-white/80">{suburb.state} {suburb.postcode}</p>
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
          ))}
        </div>
      </div>
    </section>
  );
}
