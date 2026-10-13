import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { unstable_cache } from "next/cache";
import { getAllPostcodesWithState } from "@/lib/services/postcode-service";
import { NOT_PLACES_VERSION } from "@/lib/non-localities";
import { SITE_URL } from "@/lib/constants";

// The directory queries the DB. As a static ISR page this served its
// build-time render (the build is DB-free) for up to a day after every
// deploy: on 13 Oct 2026 it read "0 postcodes" and linked none of the 2,661.
// Render on request instead and cache the list behind the postcode
// sitemap's tag, the pattern /regions uses.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Australian Postcode Property Guide",
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

// The data cache outlives a deploy, so the deployment is part of the key.
const getCachedPostcodes = unstable_cache(
  getAllPostcodesWithState,
  ["postcodes-index:v1", NOT_PLACES_VERSION, process.env.VERCEL_DEPLOYMENT_ID ?? "local"],
  { revalidate: 86400, tags: ["sitemap-postcodes"] },
);

export default async function PostcodesPage() {
  const postcodes = await getCachedPostcodes();

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
      <CollectionPageJsonLd
        name="Browse by Postcode"
        description="Browse Australian suburb and property data by postcode."
        url="/postcodes"
      />
      <BreadcrumbJsonLd items={[{ name: "Postcodes", url: "/postcodes" }]} />

      {/* Answer first: what the page is, then a jump to each state. */}
      <section className="bg-surface-warm border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-8 sm:pb-10">
          <Breadcrumbs items={[{ label: "Postcodes" }]} />
          <h1 className="pt-3 font-display text-ink font-bold leading-[1.05] tracking-[-0.03em] text-[2rem] sm:text-5xl lg:text-[3.25rem]">
            Australian postcodes by state
          </h1>
          <p className="mt-4 font-sans text-base sm:text-lg text-ink leading-relaxed max-w-2xl">
            {`${postcodes.length.toLocaleString("en-AU")} postcodes, grouped by state. Each postcode page names the suburbs it covers and links to their profiles, prices and schools.`}
          </p>
          {sortedStates.length > 0 && (
            <nav aria-label="Jump to a state" className="mt-6">
              <ul className="flex flex-wrap gap-2">
                {sortedStates.map((state) => (
                  <li key={state}>
                    <a
                      href={`#${state.toLowerCase()}`}
                      className="inline-flex items-center rounded-lg border border-line-strong bg-white px-3 py-2 text-sm font-semibold text-ink hover:border-ink transition-colors"
                    >
                      {state}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </section>

      {/* Postcode directory */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 sm:space-y-12">
        {sortedStates.map((state) => {
          const codes = byState.get(state) ?? [];
          const stateLabel = STATE_LABELS[state] ?? state;
          return (
            <section key={state} id={state.toLowerCase()} className="scroll-mt-20">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight mb-4 pb-2 border-b border-line">
                {stateLabel}{" "}
                <span className="text-sm font-sans font-normal text-ink-muted">
                  {codes.length} postcode{codes.length !== 1 ? "s" : ""}
                </span>
              </h2>
              <ul className="flex flex-wrap gap-1.5">
                {codes.map((postcode) => (
                  <li key={postcode}>
                    <Link
                      href={`/postcodes/${postcode}`}
                      className="inline-flex items-center rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm font-medium text-ink hover:border-ink transition-colors"
                    >
                      {postcode}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
