import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getAllPostcodesWithState } from "@/lib/services/postcode-service";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Australian Postcode Property Guide | Your Property Guide",
  description:
    "Browse Australian property data by postcode. Find suburb profiles, median house prices, schools and market statistics for every postcode.",
  alternates: { canonical: `${SITE_URL}/postcodes` },
  openGraph: {
    url: `${SITE_URL}/postcodes`,
    title: "Australian Postcode Property Guide | Your Property Guide",
    description:
      "Browse Australian property data by postcode. Find suburb profiles, median house prices, schools and market statistics for every postcode.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

// Full state names for display
const STATE_LABELS: Record<string, string> = {
  ACT: "Australian Capital Territory",
  NSW: "New South Wales",
  NT: "Northern Territory",
  QLD: "Queensland",
  SA: "South Australia",
  TAS: "Tasmania",
  VIC: "Victoria",
  WA: "Western Australia",
};

export default async function PostcodesPage() {
  const postcodes = await getAllPostcodesWithState();

  // Group by state
  const byState = new Map<string, string[]>();
  for (const { postcode, state } of postcodes) {
    const list = byState.get(state) ?? [];
    list.push(postcode);
    byState.set(state, list);
  }

  // Sort states
  const sortedStates = Array.from(byState.keys()).sort((a, b) => a.localeCompare(b));

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Postcodes", url: "/postcodes" }]} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 to-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumbs items={[{ label: "Postcodes" }]} />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
            Browse by Postcode
          </h1>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl">
            Find property data, suburb profiles and market statistics for any Australian postcode.
          </p>
        </div>
      </div>

      {/* Postcode directory */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {sortedStates.map((state) => {
          const codes = byState.get(state) ?? [];
          const stateLabel = STATE_LABELS[state] ?? state;
          return (
            <section key={state}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {stateLabel}{" "}
                <span className="text-sm font-normal text-gray-400">
                  ({codes.length} postcode{codes.length !== 1 ? "s" : ""})
                </span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {codes.map((postcode) => (
                  <Link
                    key={postcode}
                    href={`/postcodes/${postcode}`}
                    className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors shadow-sm"
                  >
                    {postcode}
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
