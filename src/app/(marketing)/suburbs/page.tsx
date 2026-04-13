import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, MapPin, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { getSuburbs } from "@/lib/services/suburb-service";
import { formatPrice, formatPercentage } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explore Suburbs Across Australia",
  description: "Explore suburbs across Australia. View median prices, growth rates, schools, and available properties.",
  alternates: { canonical: `${SITE_URL}/suburbs` },
  openGraph: { url: `${SITE_URL}/suburbs`, title: "Explore Suburbs Across Australia", description: "Explore suburbs across Australia. View median prices, growth rates, schools, and available properties.", type: "website" },
  twitter: { card: "summary_large_image" },
};

const STATES = [
  { code: "NSW", label: "New South Wales" },
  { code: "VIC", label: "Victoria" },
  { code: "QLD", label: "Queensland" },
  { code: "WA",  label: "Western Australia" },
  { code: "SA",  label: "South Australia" },
  { code: "TAS", label: "Tasmania" },
  { code: "ACT", label: "ACT" },
  { code: "NT",  label: "Northern Territory" },
];

const PAGE_SIZE = 24;

// Gradient placeholders when no heroImage
const PLACEHOLDER_GRADIENTS = [
  "from-slate-700 to-slate-900",
  "from-zinc-700 to-zinc-900",
  "from-stone-700 to-stone-900",
  "from-neutral-700 to-neutral-900",
];

interface PageProps {
  searchParams: Promise<{ state?: string; q?: string; page?: string }>;
}

export default async function SuburbsPage({ searchParams }: PageProps) {
  const { state, q, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10));
  const offset = (page - 1) * PAGE_SIZE;

  const { suburbs, total } = await getSuburbs({
    state: state || undefined,
    search: q || undefined,
    limit: PAGE_SIZE,
    offset,
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (state) params.set("state", state);
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/suburbs${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <CollectionPageJsonLd
        name="Suburb Profiles"
        description="Browse suburb profiles across Australia with median prices, school data, and local insights."
        url="/suburbs"
      />
      <BreadcrumbJsonLd items={[{ name: "Suburbs", url: "/suburbs" }]} />
      <Breadcrumbs items={[{ label: "Suburbs" }]} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Explore Australian Suburbs</h1>
        <p className="text-gray-500 mt-1">
          {total.toLocaleString()} suburbs with property data, schools, and local insights
        </p>
      </div>

      {/* Search + state filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form method="GET" action="/suburbs" className="flex-1 flex gap-2">
          {state && <input type="hidden" name="state" value={state} />}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search by suburb name…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black bg-white"
            />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-900 transition-colors">
            Search
          </button>
        </form>

        {/* State pills */}
        <div className="flex gap-1.5 flex-wrap">
          <Link
            href="/suburbs"
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              !state ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
            }`}
          >
            All
          </Link>
          {STATES.map((s) => (
            <Link
              key={s.code}
              href={`/suburbs?state=${s.code}${q ? `&q=${q}` : ""}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                state === s.code ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
              }`}
            >
              {s.code}
            </Link>
          ))}
        </div>
      </div>

      {suburbs.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <MapPin className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No suburbs found</p>
          <Link href="/suburbs" className="mt-2 inline-block text-sm text-black underline">Clear filters</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {suburbs.map((suburb, i) => {
              const gradient = PLACEHOLDER_GRADIENTS[i % PLACEHOLDER_GRADIENTS.length];
              const hasImage = !!suburb.heroImage;
              return (
                <Link key={suburb.slug} href={`/suburbs/${suburb.slug}`} className="group block">
                  <div className="rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow bg-white">
                    <div className="relative aspect-[16/10]">
                      {hasImage ? (
                        <Image
                          src={suburb.heroImage}
                          alt={suburb.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          onError={undefined}
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 inset-x-0 p-4">
                        <h2 className="text-lg font-bold text-white leading-tight">{suburb.name}</h2>
                        <p className="text-sm text-white/80">{suburb.state} {suburb.postcode}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Median House</p>
                          <p className="font-semibold text-gray-900">{formatPrice(suburb.stats.medianHousePrice)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Annual Growth</p>
                          <p className="font-semibold text-gray-900 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                            {formatPercentage(suburb.stats.annualGrowthHouse)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-3 line-clamp-2">{suburb.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {page > 1 && (
                <Link href={pageUrl(page - 1)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-black transition-colors">
                  ← Previous
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-gray-500">
                Page {page} of {totalPages.toLocaleString()}
              </span>
              {page < totalPages && (
                <Link href={pageUrl(page + 1)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-black transition-colors">
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
