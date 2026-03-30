import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getSuburbs } from "@/lib/services/suburb-service";
import { formatPrice, formatPercentage } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Explore Suburbs in Moreton Bay",
  description: "Explore suburbs in the Moreton Bay region. View median prices, growth rates, schools, and available properties.",
  alternates: { canonical: `${SITE_URL}/suburbs` },
  openGraph: { title: "Explore Suburbs in Moreton Bay", description: "Explore suburbs in the Moreton Bay region. View median prices, growth rates, schools, and available properties.", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default async function SuburbsPage() {
  const suburbs = await getSuburbs();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Suburbs", url: "/suburbs" }]} />
      <Breadcrumbs items={[{ label: "Suburbs" }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Explore Moreton Bay Suburbs</h1>
        <p className="text-gray-500 mt-1">
          Discover property market data, schools, and lifestyle across {suburbs.length} suburbs
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {suburbs.map((suburb) => (
          <Link key={suburb.slug} href={`/suburbs/${suburb.slug}`} className="group block">
            <div className="rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow bg-white">
              <div className="relative aspect-[16/10]">
                <Image
                  src={suburb.heroImage}
                  alt={suburb.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <h2 className="text-xl font-bold text-white">{suburb.name}</h2>
                  <p className="text-sm text-white/80">{suburb.state} {suburb.postcode}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Median House</p>
                    <p className="font-semibold text-gray-900">{formatPrice(suburb.stats.medianHousePrice)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Growth</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                      {formatPercentage(suburb.stats.annualGrowthHouse)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">{suburb.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
