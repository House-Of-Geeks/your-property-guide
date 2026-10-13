import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { getAllPostcodesWithState } from "@/lib/services/postcode-service";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";

// Page body queries the DB; render on every request (no build-time prerender,
// no stale cache). Add HTTP caching at the edge later if traffic warrants it.
export const revalidate = 86400;

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

export default async function PostcodesPage() {
  // Skip the DB at build (Railway proxy drops build-time connections); ISR
  // (revalidate above) fills real data on first request. Empty renders cleanly
  // — the grouping below drops empty states.
  const postcodes =
    process.env.NEXT_PHASE === "phase-production-build"
      ? ([] as Awaited<ReturnType<typeof getAllPostcodesWithState>>)
      : await getAllPostcodesWithState();

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
      <PhotoHero breadcrumbs={[{ label: "Postcodes" }]}>
        <HeroTitle>
          Australian postcodes by state
        </HeroTitle>
        <HeroLead>
          {`${postcodes.length.toLocaleString("en-AU")} postcodes, grouped by state. Each postcode page names the suburbs it covers and links to their profiles, prices and schools.`}
        </HeroLead>
        {sortedStates.length > 0 && (
          <nav aria-label="Jump to a state" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {sortedStates.map((state) => (
                <li key={state}>
                  <a
                    href={`#${state.toLowerCase()}`}
                    className="inline-flex items-center rounded-lg border border-line-strong px-3 py-2 text-sm font-semibold text-ink hover:border-ink transition-colors"
                  >
                    {state}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </PhotoHero>

      {/* Postcode directory */}
      <Band spacing="compact">
        <div className="space-y-12 sm:space-y-14">
        {sortedStates.map((state) => {
          const codes = byState.get(state) ?? [];
          const stateLabel = STATE_LABELS[state] ?? state;
          return (
            <section key={state} id={state.toLowerCase()} className="scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl text-ink tracking-[-0.02em] mb-5 pb-3 border-b-2 border-ink">
                {stateLabel}{" "}
                <span className="text-sm font-normal text-ink-muted tracking-normal">
                  {codes.length} postcode{codes.length !== 1 ? "s" : ""}
                </span>
              </h2>
              <ul className="flex flex-wrap gap-1.5">
                {codes.map((postcode) => (
                  <li key={postcode}>
                    <Link
                      href={`/postcodes/${postcode}`}
                      className="inline-flex items-center rounded-lg border border-line bg-surface-raised px-2.5 py-1.5 text-sm font-medium text-ink hover:border-ink transition-colors"
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
      </Band>
    </>
  );
}
