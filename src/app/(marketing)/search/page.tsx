import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, GraduationCap, BookOpen, FileText, Search as SearchIcon } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { unifiedSearch } from "@/lib/services/search-service";
import { JumpToSuburb } from "@/components/search/JumpToSuburb";
import { formatPrice } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const title = query
    ? `Search results for "${query}" | Your Property Guide`
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
      title,
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
            <Breadcrumbs items={[{ label: "Search" }]} />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5 inline-flex items-center gap-2">
            <SearchIcon className="w-3.5 h-3.5" aria-hidden="true" />
            {query ? `${results.totalCount} matches for "${query}"` : "Site search"}
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            {query ? (
              <>Search results for <span className="italic text-primary">{query}</span>.</>
            ) : (
              <>Find <span className="italic text-primary">anything</span> on the site.</>
            )}
          </h1>

          {/* Search box at top, submits via GET so URL is bookmarkable */}
          <form method="GET" action="/search" className="mt-6 max-w-2xl">
            <label htmlFor="search-q" className="sr-only">Search</label>
            <div className="flex gap-2">
              <div className="relative flex-1 min-w-0">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle pointer-events-none" />
                <input
                  id="search-q"
                  type="search"
                  name="q"
                  defaultValue={query}
                  autoFocus={!query}
                  placeholder="Suburb, school, postcode, or topic…"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-line bg-surface-raised text-base font-sans text-ink placeholder:text-ink-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-cta px-5 py-3 text-sm font-sans font-medium text-white hover:bg-cta-hover transition-colors shrink-0"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {!query ? (
          <EmptyState />
        ) : results.totalCount === 0 ? (
          <NoResultsState query={query} />
        ) : (
          <ResultsGrid results={results} />
        )}
      </div>
    </>
  );
}

// ─── Empty / no-results states ──────────────────────────────────────────

function EmptyState() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <section>
        <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
          Quick suburb lookup
        </p>
        <h2 className="font-display text-2xl text-ink leading-tight mb-4">
          Or jump straight to a suburb.
        </h2>
        <JumpToSuburb placeholder="Try Bondi, Newtown, or 4006" size="lg" />
        <p className="mt-3 font-sans text-sm text-ink-muted">
          Pick a suburb to see its profile. Or use the full-text search above
          to find suburbs, schools, guides, and glossary terms.
        </p>
      </section>
      <section>
        <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
          What you can search
        </p>
        <h2 className="font-display text-2xl text-ink leading-tight mb-4">
          Four kinds of results.
        </h2>
        <ul className="space-y-3 font-sans text-sm text-ink leading-relaxed">
          <li className="flex gap-3 items-start">
            <MapPin className="w-4 h-4 text-ink-subtle mt-1 shrink-0" />
            <span>
              <strong>Suburbs &amp; postcodes</strong>: every Australian suburb with median, growth, schools, walk score and hazard.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <GraduationCap className="w-4 h-4 text-ink-subtle mt-1 shrink-0" />
            <span>
              <strong>Schools</strong>: 9,600+ government, Catholic, and independent schools with catchments and ICSEA.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <FileText className="w-4 h-4 text-ink-subtle mt-1 shrink-0" />
            <span>
              <strong>Guides</strong>: 60+ guides on buying, selling, investing and renting.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <BookOpen className="w-4 h-4 text-ink-subtle mt-1 shrink-0" />
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
    <div className="rounded-2xl border border-line bg-surface-raised p-10 text-center max-w-2xl mx-auto">
      <p className="font-display text-2xl text-ink mb-3">
        Nothing matched &ldquo;{query}&rdquo;.
      </p>
      <p className="font-sans text-base text-ink-muted leading-relaxed">
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
            className="inline-flex items-center rounded-lg border border-line bg-surface-warm px-3 py-1.5 text-sm font-sans font-medium text-ink hover:border-primary/40 hover:text-primary transition-colors"
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
    <div className="space-y-12">
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
                className="group rounded-2xl border border-line bg-surface-raised p-5 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-1">
                  {s.state} · {s.postcode}
                </p>
                <h3 className="font-display text-xl text-ink group-hover:text-primary transition-colors leading-tight">
                  {s.name}
                </h3>
                {s.medianHousePrice > 0 && (
                  <p className="mt-3 font-sans text-sm text-ink-muted">
                    Median{" "}
                    <span className="font-display text-base text-ink">
                      {formatPrice(s.medianHousePrice)}
                    </span>
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-sans uppercase tracking-wider text-ink group-hover:text-primary transition-colors">
                  See profile <ArrowRight className="w-3.5 h-3.5" />
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
                  className="group block rounded-2xl border border-line bg-surface-raised p-5 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <h3 className="font-display text-base text-ink group-hover:text-primary transition-colors leading-tight">
                    {g.title}
                  </h3>
                  <p className="mt-1.5 font-sans text-sm text-ink-muted leading-relaxed">
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
                  className="group block rounded-xl border border-line bg-surface-raised p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <p className="font-display text-base text-ink group-hover:text-primary transition-colors leading-tight">
                    {g.term}
                  </p>
                  <p className="mt-1 font-sans text-xs text-ink-muted leading-snug">
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
                  className="group block rounded-xl border border-line bg-surface-raised p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <p className="font-display text-base text-ink group-hover:text-primary transition-colors leading-tight">
                    {s.name}
                  </p>
                  <p className="mt-1 font-sans text-xs text-ink-muted">
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
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-line">
        <h2 className="font-display text-2xl text-ink leading-tight inline-flex items-center gap-2">
          <span className="text-ink-subtle">{icon}</span>
          {label}
        </h2>
        <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle">
          {count} {count === 1 ? "match" : "matches"}
        </p>
      </div>
      {children}
    </section>
  );
}
