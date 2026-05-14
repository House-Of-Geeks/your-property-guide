import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { getAllPostcodesWithState } from "@/lib/services/postcode-service";
import { SITE_URL } from "@/lib/constants";

// Page body queries the DB; render on every request (no build-time prerender,
// no stale cache). Add HTTP caching at the edge later if traffic warrants it.
export const revalidate = 86400;

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
      <CollectionPageJsonLd
        name="Browse by Postcode"
        description="Browse Australian suburb and property data by postcode."
        url="/postcodes"
      />
      <BreadcrumbJsonLd items={[{ name: "Postcodes", url: "/postcodes" }]} />

      {/* Editorial hero */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.10] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Postcodes" }]} />
          </div>

          <div className="flex items-center gap-4 mb-10">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              {postcodes.length.toLocaleString()} postcodes
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Browse by state
            </span>
          </div>
          <h1 className="font-display text-ink leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-10 max-w-[18ch] font-medium">
            Browse by{" "}
            <span className="italic font-light text-primary">postcode</span>.
          </h1>
          <p className="font-display font-light text-xl sm:text-2xl text-ink leading-[1.25] max-w-3xl">
            Property data, suburb profiles, and market statistics for every
            Australian postcode, grouped by state.
          </p>
        </div>
      </section>

      {/* Postcode directory */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {sortedStates.map((state) => {
          const codes = byState.get(state) ?? [];
          const stateLabel = STATE_LABELS[state] ?? state;
          return (
            <section key={state}>
              <h2 className="font-display text-2xl text-ink mb-5 pb-2 border-b border-line">
                {stateLabel}{" "}
                <span className="text-sm font-sans font-normal text-ink-subtle">
                  ({codes.length} postcode{codes.length !== 1 ? "s" : ""})
                </span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {codes.map((postcode) => (
                  <Link
                    key={postcode}
                    href={`/postcodes/${postcode}`}
                    className="inline-flex items-center rounded-lg border border-line bg-surface-raised px-3 py-1.5 text-sm font-sans font-medium text-ink hover:border-primary/40 hover:text-primary transition-colors"
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
