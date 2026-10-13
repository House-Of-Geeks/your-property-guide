import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, GraduationCap, BookOpen, FileText, Search as SearchIcon } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo";
import { unifiedSearch } from "@/lib/services/search-service";
import { JumpToSuburb } from "@/components/search/JumpToSuburb";
import { formatPrice } from "@/lib/utils/format";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { BUTTON_PRIMARY, Band, HeroTitle, PhotoHero } from "@/components/premium";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const title = query
    ? `Search results for "${query}"`
    : "Search Your Property Guide";
  const description = query
    ? `Suburbs, schools, guides and glossary terms matching "${query}". Free property research from Your Property Guide.`
    : "Search Australian suburbs, schools, property guides, and glossary terms in one place.";

  return {
    title,
    description,
    // We canonicalise to the param-less /search to avoid query-string indexing pollution
    alternates: { canonical: `${SITE_URL}/search` },
    robots: query ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      url: `${SITE_URL}/search`,
      // og titles don't get the root title.template — brand them explicitly
      // (the no-query title already ends with the site name, so skip it there)
      title: query ? `${title} | ${SITE_NAME}` : title,
      description,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query.length >= 2
    ? await unifiedSearch(query)
    : { suburbs: [], schools: [], glossary: [], guides: [], totalCount: 0 };

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Search", url: "/search" }]} />

      <PhotoHero photo="market" breadcrumbs={[{ label: "Search" }]}>
        <p className="flex items-center gap-2 text-sm text-ink-muted mb-5">
          <SearchIcon className="w-3.5 h-3.5" aria-hidden="true" />
          {query ? `${results.totalCount} matches for "${query}"` : "Site search"}
        </p>
        <HeroTitle>
          {query ? (
            <>Search results for <span>{query}</span>.</>
          ) : (
            <>Find <span>anything</span> on the site.</>
          )}
        </HeroTitle>

        {/* Search box at top, submits via GET so URL is bookmarkable. The
            field is white on the dark hero, so its root resets the tone. */}
        <form method="GET" action="/search" className="tone-light mt-8 max-w-2xl">
          <label htmlFor="search-q" className="sr-only">Search</label>
          <div className="flex gap-2">
            <div className="relative flex-1 min-w-0">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle pointer-events-none" aria-hidden="true" />
              <input
                id="search-q"
                type="search"
                name="q"
                defaultValue={query}
                autoFocus={!query}
                placeholder="Suburb, school, postcode, or topic…"
                className="w-full h-full pl-11 pr-4 py-3 rounded-lg border border-line bg-surface-raised text-base text-ink placeholder:text-ink-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              type="submit"
              className={`${BUTTON_PRIMARY} justify-center shrink-0`}
            >
              Search
            </button>
          </div>
        </form>
      </PhotoHero>

      <Band tone="quiet" spacing="compact">
        {!query ? (
          <EmptyState />
        ) : results.totalCount === 0 ? (
          <NoResultsState query={query} />
        ) : (
          <ResultsGrid results={results} />
        )}
      </Band>
    </>
  );
}

// ─── Empty / no-results states ──────────────────────────────────────────

function EmptyState() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <section>
        <p className="text-sm text-ink-subtle mb-3">
          Quick suburb lookup
        </p>
        <h2 className="text-2xl sm:text-3xl text-ink leading-tight tracking-[-0.02em] mb-5">
          Or jump straight to a suburb
        </h2>
        <JumpToSuburb placeholder="Try Bondi, Newtown, or 4006" size="lg" />
        <p className="mt-3 text-sm text-ink-muted">
          Pick a suburb to see its profile. Or use the full-text search above
          to find suburbs, schools, guides, and glossary terms.
        </p>
      </section>
      <section>
        <p className="text-sm text-ink-subtle mb-3">
          What you can search
        </p>
        <h2 className="text-2xl sm:text-3xl text-ink leading-tight tracking-[-0.02em] mb-5">
          Four kinds of results
        </h2>
        <ul className="space-y-3 text-base text-ink leading-relaxed">
          <li className="flex gap-3 items-start">
            <MapPin className="w-4 h-4 text-primary mt-1.5 shrink-0" aria-hidden="true" />
            <span>
              <strong>Suburbs &amp; postcodes</strong>: every Australian suburb with median, growth, schools, walk score and hazard.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <GraduationCap className="w-4 h-4 text-primary mt-1.5 shrink-0" aria-hidden="true" />
            <span>
              <strong>Schools</strong>: 9,600+ government, Catholic, and independent schools with catchments and ICSEA.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <FileText className="w-4 h-4 text-primary mt-1.5 shrink-0" aria-hidden="true" />
            <span>
              <strong>Guides</strong>: 60+ guides on buying, selling, investing and renting.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <BookOpen className="w-4 h-4 text-primary mt-1.5 shrink-0" aria-hidden="true" />
            <span>
              <strong>Glossary terms</strong>: 99 plain-English definitions of property terms.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function NoResultsState({ query }: { query: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface-raised p-10 text-center max-w-2xl mx-auto">
      <p className="text-2xl font-bold text-ink mb-3">
        Nothing matched &ldquo;{query}&rdquo;.
      </p>
      <p className="text-base text-ink-muted leading-relaxed">
        Try a shorter query, a postcode, or browse one of these starting points:
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {[
          { href: "/find-your-suburb", label: "Find your suburb (quiz)" },
          { href: "/best-suburbs", label: "Best suburbs rankings" },
          { href: "/guides", label: "All guides" },
          { href: "/glossary", label: "A–Z glossary" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="inline-flex items-center rounded-lg border border-line bg-surface-warm px-3 py-1.5 text-sm font-medium text-ink hover:border-ink transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Results grid ───────────────────────────────────────────────────────

function ResultsGrid({
  results,
}: {
  results: Awaited<ReturnType<typeof unifiedSearch>>;
}) {
  return (
    <div className="space-y-14">
      {results.suburbs.length > 0 && (
        <ResultSection
          icon={<MapPin className="w-4 h-4" aria-hidden="true" />}
          label="Suburbs"
          count={results.suburbs.length}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.suburbs.map((s) => (
              <Link
                key={s.slug}
                href={`/suburbs/${s.slug}`}
                className="group flex flex-col rounded-xl border border-line bg-surface-raised p-5 hover:border-ink transition-colors"
              >
                <p className="text-sm text-ink-subtle mb-1">
                  {s.state} · {s.postcode}
                </p>
                <h3 className="text-xl text-ink group-hover:text-primary transition-colors leading-tight">
                  {s.name}
                </h3>
                {s.medianHousePrice > 0 && (
                  <p className="mt-3 text-sm text-ink-muted">
                    Median{" "}
                    <span className="text-base font-semibold text-ink">
                      {formatPrice(s.medianHousePrice)}
                    </span>
                  </p>
                )}
                <span className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink group-hover:text-primary transition-colors">
                  See profile <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </ResultSection>
      )}

      {results.guides.length > 0 && (
        <ResultSection
          icon={<FileText className="w-4 h-4" aria-hidden="true" />}
          label="Guides"
          count={results.guides.length}
        >
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.guides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guides/${g.slug}`}
                  className="group block h-full rounded-xl border border-line bg-surface-raised p-5 hover:border-ink transition-colors"
                >
                  <h3 className="text-lg text-ink group-hover:text-primary transition-colors leading-tight">
                    {g.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">
                    {g.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </ResultSection>
      )}

      {results.glossary.length > 0 && (
        <ResultSection
          icon={<BookOpen className="w-4 h-4" aria-hidden="true" />}
          label="Glossary"
          count={results.glossary.length}
        >
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {results.glossary.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/glossary/${g.slug}`}
                  className="group block h-full rounded-xl border border-line bg-surface-raised p-4 hover:border-ink transition-colors"
                >
                  <p className="text-base font-semibold text-ink group-hover:text-primary transition-colors leading-tight">
                    {g.term}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted leading-snug">
                    {g.preview}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </ResultSection>
      )}

      {results.schools.length > 0 && (
        <ResultSection
          icon={<GraduationCap className="w-4 h-4" aria-hidden="true" />}
          label="Schools"
          count={results.schools.length}
        >
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.schools.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/schools/${s.slug}`}
                  className="group block h-full rounded-xl border border-line bg-surface-raised p-4 hover:border-ink transition-colors"
                >
                  <p className="text-base font-semibold text-ink group-hover:text-primary transition-colors leading-tight">
                    {s.name}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {s.suburbName}, {s.state}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </ResultSection>
      )}
    </div>
  );
}

function ResultSection({
  icon,
  label,
  count,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-line">
        <h2 className="text-2xl sm:text-3xl text-ink leading-tight tracking-[-0.02em] inline-flex items-center gap-3">
          <span className="text-primary">{icon}</span>
          {label}
        </h2>
        <p className="text-sm text-ink-subtle">
          {count} {count === 1 ? "match" : "matches"}
        </p>
      </div>
      {children}
    </section>
  );
}
