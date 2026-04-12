import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getRankedSuburbs, type RankingCategory, type RankedSuburb } from "@/lib/services/suburb-rankings-service";
import { formatPrice, formatPriceFull, formatPercentage } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

const VALID_CATEGORIES: RankingCategory[] = [
  "for-families",
  "highest-growth",
  "most-affordable",
  "most-walkable",
  "lowest-flood-risk",
  "best-rental-yield",
];

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"];

interface CategoryConfig {
  title: string;
  description: string;
  metaDescription: string;
}

const CATEGORY_CONFIG: Record<RankingCategory, CategoryConfig> = {
  "for-families": {
    title: "Best Suburbs for Families",
    description:
      "Suburbs ranked by average school ICSEA score with high proportions of family households.",
    metaDescription:
      "Find the best Australian suburbs for families — ranked by school quality (ICSEA), family household percentage, and local amenities.",
  },
  "highest-growth": {
    title: "Highest Growth Suburbs",
    description:
      "Suburbs with the strongest annual house price growth over the past 12 months.",
    metaDescription:
      "Discover Australian suburbs with the highest annual house price growth — ideal for capital-gain focused buyers and investors.",
  },
  "most-affordable": {
    title: "Most Affordable Suburbs",
    description:
      "Suburbs with the lowest median house prices — great entry points into the property market.",
    metaDescription:
      "Explore Australia's most affordable suburbs ranked by median house price. Find your way into the property market.",
  },
  "most-walkable": {
    title: "Most Walkable Suburbs",
    description:
      "Suburbs with the highest walk scores — perfect for car-free or car-light lifestyles.",
    metaDescription:
      "Australia's most walkable suburbs ranked by walk score. Live close to shops, cafes, parks, and public transport.",
  },
  "lowest-flood-risk": {
    title: "Lowest Flood Risk Suburbs",
    description:
      "Suburbs assessed as low flood risk or with no flood hazard record — peace of mind for homeowners.",
    metaDescription:
      "Find Australian suburbs with the lowest flood risk, assessed using Geoscience Australia hazard data. Safe, liveable communities.",
  },
  "best-rental-yield": {
    title: "Best Rental Yield Suburbs",
    description:
      "Suburbs with the highest gross rental yields, calculated from median house price and weekly rent.",
    metaDescription:
      "Australia's top suburbs for rental yield — ranked by gross yield percentage. Maximise your investment property returns.",
  },
};

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ state?: string }>;
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const { state } = await searchParams;

  if (!VALID_CATEGORIES.includes(category as RankingCategory)) {
    return { title: "Not Found" };
  }

  const config = CATEGORY_CONFIG[category as RankingCategory];
  const stateSuffix = state && STATES.includes(state) ? ` in ${state}` : " in Australia";
  const title = `${config.title}${stateSuffix} | Your Property Guide`;

  return {
    title,
    description: config.metaDescription,
    alternates: { canonical: `${SITE_URL}/best-suburbs/${category}` },
    openGraph: {
      url: `${SITE_URL}/best-suburbs/${category}`,
      title,
      description: config.metaDescription,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

function floodBadge(floodClass: string | null): React.ReactElement {
  if (!floodClass) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
        No data
      </span>
    );
  }
  const colours: Record<string, string> = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
    floodway: "bg-red-200 text-red-800",
  };
  const cls = colours[floodClass] ?? "bg-gray-100 text-gray-500";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {floodClass}
    </span>
  );
}

function PrimaryMetric({ category, suburb }: { category: RankingCategory; suburb: RankedSuburb }) {
  switch (category) {
    case "for-families":
      return <span>{suburb.avgSchoolIcsea != null ? suburb.avgSchoolIcsea.toLocaleString() : "–"}</span>;
    case "highest-growth":
      return (
        <span className={suburb.annualGrowthHouse >= 0 ? "text-green-700 font-semibold" : "text-red-600 font-semibold"}>
          {suburb.annualGrowthHouse !== 0 ? formatPercentage(suburb.annualGrowthHouse) : "–"}
        </span>
      );
    case "most-affordable":
      return <span className="font-semibold">{suburb.medianHousePrice > 0 ? formatPriceFull(suburb.medianHousePrice) : "–"}</span>;
    case "most-walkable":
      return <span className="font-semibold">{suburb.walkScore != null ? suburb.walkScore : "–"}<span className="text-gray-400 font-normal">/100</span></span>;
    case "lowest-flood-risk":
      return floodBadge(suburb.hazard?.floodClass ?? null);
    case "best-rental-yield":
      return (
        <span className="font-semibold text-green-700">
          {suburb.grossRentalYield != null ? `${suburb.grossRentalYield.toFixed(2)}%` : "–"}
        </span>
      );
  }
}

function SecondaryMetric({ category, suburb }: { category: RankingCategory; suburb: RankedSuburb }) {
  switch (category) {
    case "for-families":
      return <span>{suburb.householdsFamily > 0 ? `${suburb.householdsFamily.toFixed(0)}%` : "–"}</span>;
    case "highest-growth":
      return <span>{suburb.medianHousePrice > 0 ? formatPrice(suburb.medianHousePrice) : "–"}</span>;
    case "most-affordable":
      return (
        <span className={suburb.annualGrowthHouse !== 0 ? (suburb.annualGrowthHouse >= 0 ? "text-green-700" : "text-red-600") : "text-gray-400"}>
          {suburb.annualGrowthHouse !== 0 ? formatPercentage(suburb.annualGrowthHouse) : "–"}
        </span>
      );
    case "most-walkable":
      return <span>{suburb.medianHousePrice > 0 ? formatPrice(suburb.medianHousePrice) : "–"}</span>;
    case "lowest-flood-risk":
      return <span>{suburb.medianHousePrice > 0 ? formatPrice(suburb.medianHousePrice) : "–"}</span>;
    case "best-rental-yield":
      return <span>{suburb.medianRentHouse > 0 ? `$${suburb.medianRentHouse}/wk` : "–"}</span>;
  }
}

const PRIMARY_LABEL: Record<RankingCategory, string> = {
  "for-families": "Avg ICSEA",
  "highest-growth": "Annual Growth",
  "most-affordable": "Median Price",
  "most-walkable": "Walk Score",
  "lowest-flood-risk": "Flood Risk",
  "best-rental-yield": "Gross Yield",
};

const SECONDARY_LABEL: Record<RankingCategory, string> = {
  "for-families": "Family HH %",
  "highest-growth": "Median Price",
  "most-affordable": "Annual Growth",
  "most-walkable": "Median Price",
  "lowest-flood-risk": "Median Price",
  "best-rental-yield": "Weekly Rent",
};

export default async function BestSuburbsCategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const { state: stateParam } = await searchParams;

  if (!VALID_CATEGORIES.includes(category as RankingCategory)) {
    notFound();
  }

  const cat = category as RankingCategory;
  const state = stateParam && STATES.includes(stateParam.toUpperCase())
    ? stateParam.toUpperCase()
    : undefined;

  const config = CATEGORY_CONFIG[cat];
  const suburbs = await getRankedSuburbs(cat, state, 50);

  const pageTitle = state
    ? `${config.title} in ${state}`
    : config.title;

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbJsonLd
        items={[
          { name: "Best Suburbs", url: "/best-suburbs" },
          { name: config.title, url: `/best-suburbs/${category}` },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 to-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <Breadcrumbs
            items={[
              { label: "Best Suburbs", href: "/best-suburbs" },
              { label: config.title },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
            {pageTitle}
          </h1>
          <p className="text-gray-600 mt-3 max-w-2xl">{config.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* State filter */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm font-medium text-gray-600">Filter by state:</span>
          <Link
            href={`/best-suburbs/${category}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !state
                ? "bg-primary text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
            }`}
          >
            All
          </Link>
          {STATES.map((s) => (
            <Link
              key={s}
              href={`/best-suburbs/${category}?state=${s}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                state === s
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing top {suburbs.length} suburbs{state ? ` in ${state}` : " across Australia"}
        </p>

        {suburbs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500">No suburbs found for this filter. Try a different state.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-10">#</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Suburb</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">State</th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {PRIMARY_LABEL[cat]}
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {SECONDARY_LABEL[cat]}
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {suburbs.map((suburb, i) => (
                    <tr
                      key={suburb.slug}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-gray-400 tabular-nums">{i + 1}</td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/suburbs/${suburb.slug}`}
                          className="font-medium text-gray-900 hover:text-primary transition-colors"
                        >
                          {suburb.name}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">{suburb.postcode}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{suburb.state}</td>
                      <td className="py-3 px-4 text-right tabular-nums">
                        <PrimaryMetric category={cat} suburb={suburb} />
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-gray-600">
                        <SecondaryMetric category={cat} suburb={suburb} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/suburbs/${suburb.slug}`}
                          className="text-xs font-medium text-primary hover:underline whitespace-nowrap"
                        >
                          View profile →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {suburbs.map((suburb, i) => (
                <Link
                  key={suburb.slug}
                  href={`/suburbs/${suburb.slug}`}
                  className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-primary hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 tabular-nums">#{i + 1}</span>
                        <span className="font-semibold text-gray-900 truncate">{suburb.name}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {suburb.state} {suburb.postcode}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-400">{PRIMARY_LABEL[cat]}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        <PrimaryMetric category={cat} suburb={suburb} />
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{SECONDARY_LABEL[cat]}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        <SecondaryMetric category={cat} suburb={suburb} />
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-primary mt-3">View suburb profile →</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
