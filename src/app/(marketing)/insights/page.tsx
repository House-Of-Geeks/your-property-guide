import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, TrendingUp } from "lucide-react";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { getBlogPosts } from "@/lib/services/blog-service";
import { formatDate } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";
import { getRecentUpdates } from "@/lib/data/data-updates";
import { Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";

export const revalidate = 86400; // daily. Page lists blog posts + data updates, neither change hourly.

export const metadata: Metadata = {
  title: "Australian Property Insights, Latest News, Analysis & Updates",
  description:
    "The latest property market analysis, capital city updates, RBA cash rate moves, and data refreshes from Your Property Guide. Updated weekly.",
  alternates: { canonical: `${SITE_URL}/insights` },
  openGraph: {
    url: `${SITE_URL}/insights`,
    title: "Australian Property Insights",
    description:
      "Latest market analysis, capital city updates, RBA decisions, and data refreshes.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

// Recent data updates pulled from the centralised changelog
// (lib/data/data-updates.ts). The full list lives at /data-updates.
const DATA_UPDATES = getRecentUpdates(5).map((u) => ({
  date: u.date,
  type: u.kind === "data" ? "Data refresh" : u.kind === "guide" ? "Guide" : u.kind === "tool" ? "Tool" : "Correction",
  title: u.title,
  href: u.href ?? "/data-updates",
}));

// Most-read guides for the "what others are reading" panel. Hand-curated to
// surface the highest-ranking evergreen content.
const TOP_GUIDES = [
  { href: "/guides/how-much-deposit-to-buy-a-house",       title: "How much deposit do you need to buy a house?",   eyebrow: "First home buyer" },
  { href: "/guides/sydney-vs-melbourne-property-market",   title: "Sydney vs Melbourne property market",            eyebrow: "Market comparison" },
  { href: "/guides/buyers-agent-cost-australia",           title: "How much does a buyer's agent cost in Australia?", eyebrow: "Investor" },
  { href: "/guides/cooling-off-period-by-state-australia", title: "Cooling-off period by state",                    eyebrow: "Process" },
  { href: "/guides/how-long-does-it-take-to-buy-a-house-australia", title: "How long does it take to buy a house?", eyebrow: "Process" },
];

// State-of-the-market posts to surface in the lead rail
const FEATURED_BLOG_SLUGS = [
  "sydney-property-market-2026",
  "melbourne-property-market-2026",
  "brisbane-property-market-2026",
  "perth-property-market-2026",
];

export default async function InsightsPage() {
  const allPosts = await getBlogPosts(40);

  // Featured = capital city outlooks (most authoritative, most useful)
  const featuredPosts = FEATURED_BLOG_SLUGS
    .map((slug) => allPosts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => p != null)
    .slice(0, 4);

  // Recent = anything else, by date
  const featuredSet = new Set(FEATURED_BLOG_SLUGS);
  const recentPosts = allPosts
    .filter((p) => !featuredSet.has(p.slug))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 12);

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Insights", url: "/insights" }]} />
      <CollectionPageJsonLd
        name="Australian Property Insights"
        description="The latest property market analysis, capital city updates, RBA decisions, and data refreshes."
        url="/insights"
      />

      <PhotoHero photo="market" breadcrumbs={[{ label: "Insights" }]}>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted mb-5">
          <span className="font-semibold">
            Insights
          </span>
          <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
          <span className="inline-flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
            Updated {formatDate(new Date().toISOString())}
          </span>
        </p>
        <HeroTitle>
          Australian property,{" "}
          <span>explained</span>
        </HeroTitle>
        <HeroLead>
          Capital city market reads, RBA decisions, suburb data refreshes,
          and the guides our readers are turning to right now. Sourced and
          dated.
        </HeroLead>
      </PhotoHero>

      {/* Featured: capital city market reads */}
      {featuredPosts.length > 0 && (
        <Band spacing="compact">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-ink-subtle mb-3">
                Capital cities
              </p>
              <SectionHeading size="md" title="2026 market outlooks" />
            </div>
            <Link
              href="/guides"
              className="hidden sm:inline-flex items-center gap-1.5 text-base font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
            >
              All articles
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/guides/${p.slug}`}
                className="group flex flex-col rounded-xl border border-line bg-surface-raised overflow-hidden hover:border-ink transition-colors"
              >
                {p.coverImage && (
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-warm-sunken">
                    <Image
                      src={p.coverImage}
                      alt={`Cover image for ${p.title}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-sm text-ink-subtle mb-2">
                    {formatDate(p.publishedAt)}
                  </p>
                  <h3 className="text-lg text-ink group-hover:text-primary transition-colors leading-tight">
                    {p.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </Band>
      )}

      <Band tone="quiet" spacing="compact">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Recent posts main column */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <p className="text-sm text-ink-subtle mb-3">
                Latest
              </p>
              <SectionHeading size="md" title="Recent articles" />
            </div>
            <ul className="space-y-4">
              {recentPosts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/guides/${p.slug}`}
                    className="group grid grid-cols-[80px_1fr] sm:grid-cols-[120px_1fr] gap-4 rounded-xl border border-line bg-surface-raised p-4 hover:border-ink transition-colors"
                  >
                    {p.coverImage ? (
                      <div className="relative aspect-square sm:aspect-[5/4] overflow-hidden rounded-lg bg-surface-warm">
                        <Image
                          src={p.coverImage}
                          alt=""
                          fill
                          sizes="120px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square sm:aspect-[5/4] rounded-lg bg-surface-warm-sunken" />
                    )}
                    <div className="min-w-0 flex flex-col">
                      <p className="text-sm text-ink-subtle mb-1.5">
                        {formatDate(p.publishedAt)}
                        {p.category && (
                          <>
                            <span className="mx-1.5 text-ink-subtle">·</span>
                            {p.category}
                          </>
                        )}
                      </p>
                      <h3 className="text-lg text-ink group-hover:text-primary transition-colors leading-tight mb-1">
                        {p.title}
                      </h3>
                      <p className="text-sm text-ink-muted line-clamp-2">
                        {p.excerpt}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link
                href="/guides"
                className="inline-flex items-center gap-1.5 text-base font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
              >
                Browse all articles
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-12">
            {/* RBA + market reports */}
            <div>
              <p className="text-sm text-ink-subtle mb-3">
                Live market data
              </p>
              <h2 className="text-2xl text-ink leading-tight tracking-[-0.02em] mb-5">
                Track the numbers
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/rba-cash-rate"
                    className="block rounded-xl border border-line bg-surface-raised p-4 hover:border-ink transition-colors group"
                  >
                    <p className="text-sm text-ink-subtle mb-1">
                      RBA
                    </p>
                    <p className="text-base font-semibold text-ink group-hover:text-primary transition-colors leading-tight">
                      Cash rate history &amp; latest decision →
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/market-reports"
                    className="block rounded-xl border border-line bg-surface-raised p-4 hover:border-ink transition-colors group"
                  >
                    <p className="text-sm text-ink-subtle mb-1">
                      Market reports
                    </p>
                    <p className="text-base font-semibold text-ink group-hover:text-primary transition-colors leading-tight">
                      State-by-state quarterly reports →
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/best-suburbs/highest-growth"
                    className="block rounded-xl border border-line bg-surface-raised p-4 hover:border-ink transition-colors group"
                  >
                    <p className="text-sm text-ink-subtle mb-1">
                      Live ranking
                    </p>
                    <p className="text-base font-semibold text-ink group-hover:text-primary transition-colors leading-tight">
                      Highest growth suburbs right now →
                    </p>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Most-read guides */}
            <div>
              <p className="text-sm text-ink-subtle mb-3">
                Most-read guides
              </p>
              <h2 className="text-2xl text-ink leading-tight tracking-[-0.02em] mb-5">
                What others are reading
              </h2>
              <ul className="divide-y divide-line border-y border-line">
                {TOP_GUIDES.map((g) => (
                  <li key={g.href}>
                    <Link
                      href={g.href}
                      className="block py-3 group"
                    >
                      <p className="text-sm text-ink-subtle mb-0.5">
                        {g.eyebrow}
                      </p>
                      <p className="text-base text-ink group-hover:text-primary transition-colors leading-snug">
                        {g.title} <ArrowRight className="inline w-3.5 h-3.5 ml-0.5" aria-hidden="true" />
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent data updates */}
            <div>
              <p className="text-sm text-ink-subtle mb-3">
                Data updates
              </p>
              <h2 className="text-2xl text-ink leading-tight tracking-[-0.02em] mb-5">
                Recent refreshes
              </h2>
              <ol className="space-y-4">
                {DATA_UPDATES.map((u) => (
                  <li
                    key={u.title}
                    className="flex gap-3 text-sm"
                  >
                    <Clock className="w-3.5 h-3.5 text-ink-subtle mt-1 shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm text-ink-subtle mb-0.5">
                        {formatDate(u.date)} · {u.type}
                      </p>
                      <Link
                        href={u.href}
                        className="text-base text-ink hover:text-primary transition-colors leading-snug"
                      >
                        {u.title}
                      </Link>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                <Link
                  href="/data-updates"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
                >
                  Full changelog →
                </Link>
                <Link
                  href="/methodology"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
                >
                  Methodology →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Band>
    </>
  );
}
