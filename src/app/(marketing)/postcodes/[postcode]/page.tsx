import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Home, TrendingUp, GraduationCap, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { Badge } from "@/components/ui";
import {
  getSuburbsByPostcode,
  getAllPostcodes,
  getPostcodeStats,
} from "@/lib/services/postcode-service";
import { formatPriceFull } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";

interface PostcodePageProps {
  params: Promise<{ postcode: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const postcodes = await getAllPostcodes();
  return postcodes.map((postcode) => ({ postcode }));
}

export async function generateMetadata({ params }: PostcodePageProps): Promise<Metadata> {
  const { postcode } = await params;
  const suburbs = await getSuburbsByPostcode(postcode);
  if (suburbs.length === 0) return { title: "Postcode Not Found" };

  const state = suburbs[0].state;
  const suburbNames = suburbs.map((s) => s.name).slice(0, 3).join(", ");
  const stats = await getPostcodeStats(postcode);

  const title = `Postcode ${postcode} Property Guide | Your Property Guide`;
  const description = `Postcode ${postcode} covers ${suburbs.length} suburb${suburbs.length !== 1 ? "s" : ""} in ${state}: ${suburbNames}. ${
    stats.avgMedianHousePrice
      ? `Average median house price ${formatPriceFull(stats.avgMedianHousePrice)}.`
      : ""
  } Browse suburb profiles, schools and property data.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/postcodes/${postcode}` },
    openGraph: {
      url: `${SITE_URL}/postcodes/${postcode}`,
      title,
      description,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function PostcodePage({ params }: PostcodePageProps) {
  const { postcode } = await params;

  const [suburbs, stats] = await Promise.all([
    getSuburbsByPostcode(postcode),
    getPostcodeStats(postcode),
  ]);

  if (suburbs.length === 0) notFound();

  const state = suburbs[0].state;

  // Flatten all schools across suburbs in this postcode
  const allSchools = suburbs.flatMap((suburb) =>
    suburb.schools.map((school) => ({
      ...school,
      suburbName: suburb.name,
      suburbSlug: suburb.slug,
    }))
  );

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Postcodes", url: "/postcodes" },
          { name: `Postcode ${postcode}`, url: `/postcodes/${postcode}` },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 to-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumbs
            items={[
              { label: "Postcodes", href: "/postcodes" },
              { label: `Postcode ${postcode}` },
            ]}
          />

          <div className="flex items-center gap-3 mt-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Postcode {postcode}
            </h1>
            <Badge variant="default">{state}</Badge>
          </div>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl">
            Property data, schools and market statistics for all suburbs in postcode {postcode},{" "}
            {state}.
          </p>

          {/* Aggregate stats */}
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-semibold text-gray-900">{suburbs.length}</span>
              <span className="text-gray-500">suburb{suburbs.length !== 1 ? "s" : ""}</span>
            </div>
            {stats.totalPopulation > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-semibold text-gray-900">
                  {stats.totalPopulation.toLocaleString()}
                </span>
                <span className="text-gray-500">total population</span>
              </div>
            )}
            {stats.avgMedianHousePrice && (
              <div className="flex items-center gap-2 text-sm">
                <Home className="w-4 h-4 text-primary" />
                <span className="font-semibold text-gray-900">
                  {formatPriceFull(stats.avgMedianHousePrice)}
                </span>
                <span className="text-gray-500">avg median house price</span>
              </div>
            )}
            {stats.avgAnnualGrowthHouse !== null && (
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="font-semibold text-gray-900">
                  {stats.avgAnnualGrowthHouse >= 0 ? "+" : ""}
                  {stats.avgAnnualGrowthHouse}%
                </span>
                <span className="text-gray-500">avg annual growth</span>
              </div>
            )}
            {stats.totalSchoolCount > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="font-semibold text-gray-900">{stats.totalSchoolCount}</span>
                <span className="text-gray-500">schools</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-14">

        {/* Suburbs grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Suburbs in Postcode {postcode}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Explore suburb profiles, median prices, annual growth and schools.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suburbs.map((suburb) => (
              <Link
                key={suburb.slug}
                href={`/suburbs/${suburb.slug}`}
                className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-primary hover:shadow-md transition-all shadow-card"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {suburb.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {suburb.state} {suburb.postcode}
                    </p>
                  </div>
                  {suburb.annualGrowthHouse != null && (
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        suburb.annualGrowthHouse >= 0
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {suburb.annualGrowthHouse >= 0 ? "+" : ""}
                      {suburb.annualGrowthHouse.toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Median house</p>
                    <p className="text-sm font-bold text-gray-900">
                      {suburb.medianHousePrice > 0
                        ? formatPriceFull(suburb.medianHousePrice)
                        : "–"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Median unit</p>
                    <p className="text-sm font-bold text-gray-900">
                      {suburb.medianUnitPrice > 0
                        ? formatPriceFull(suburb.medianUnitPrice)
                        : "–"}
                    </p>
                  </div>
                  {suburb.schools.length > 0 && (
                    <div className="ml-auto">
                      <p className="text-xs text-gray-400">Schools</p>
                      <p className="text-sm font-bold text-gray-900">{suburb.schools.length}</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Schools */}
        {allSchools.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Schools in Postcode {postcode}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              All schools across suburbs in this postcode.
            </p>
            <div className="rounded-xl border border-gray-200 bg-white shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">School</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">
                      Sector
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">
                      ICSEA
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden lg:table-cell">
                      Suburb
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allSchools.map((school, i) => {
                    const schoolSlug = school.acaraId
                      ? `${school.name
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, "")}-${school.acaraId}`
                      : null;
                    return (
                      <tr
                        key={i}
                        className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          {schoolSlug ? (
                            <Link
                              href={`/schools/${schoolSlug}`}
                              className="font-medium text-gray-900 hover:text-primary transition-colors"
                            >
                              {school.name}
                            </Link>
                          ) : (
                            <span className="font-medium text-gray-900">{school.name}</span>
                          )}
                          {school.yearRange && (
                            <span className="text-xs text-gray-400 ml-2">
                              ({school.yearRange})
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500 capitalize hidden sm:table-cell">
                          {school.type}
                        </td>
                        <td className="px-4 py-3 text-gray-500 capitalize hidden sm:table-cell">
                          {school.sector}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700 hidden md:table-cell">
                          {school.icsea ?? "–"}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <Link
                            href={`/suburbs/${school.suburbSlug}`}
                            className="text-gray-500 hover:text-primary transition-colors"
                          >
                            {school.suburbName}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Back to postcodes */}
        <div className="pt-4 border-t border-gray-100">
          <Link
            href="/postcodes"
            className="text-sm text-primary hover:underline"
          >
            Browse all postcodes
          </Link>
        </div>
      </div>
    </>
  );
}
