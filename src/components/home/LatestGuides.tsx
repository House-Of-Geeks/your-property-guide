import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getBlogPosts } from "@/lib/services/blog-service";
import { BlogCover } from "@/components/blog/BlogCover";

// Cornerstone evergreen guides surfaced directly from the homepage so the
// site's deepest, highest-value pages get internal-link juice straight from
// the top of the funnel. Each line is one Google query the page should rank
// for. Update sparingly: every change here re-prioritises which evergreen
// content the homepage signals to Google + AI search.
const CORNERSTONE = [
  { title: "How to buy property in Australia",  href: "/guides/buying-property-australia",          minutes: 15, audience: "First home buyer" },
  { title: "How much deposit do I really need", href: "/guides/how-much-deposit-to-buy-a-house",    minutes: 9,  audience: "First home buyer" },
  { title: "How to sell a house in Australia",  href: "/guides/how-to-sell-a-house-australia",      minutes: 14, audience: "Seller" },
  { title: "Rentvesting, the full playbook",    href: "/guides/rentvesting-australia",              minutes: 12, audience: "Investor" },
  { title: "Negative gearing, explained",       href: "/guides/negative-gearing-australia",         minutes: 10, audience: "Investor" },
  { title: "Renovation costs in 2026",          href: "/guides/renovation-cost-australia-2026",     minutes: 13, audience: "Renovator" },
] as const;

export async function LatestGuides() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts.slice(0, 3);

  if (!featured) return null;

  return (
    <section className="pt-20 pb-14 sm:pt-24 sm:pb-16 bg-surface-warm border-y border-line-warm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="font-display italic text-primary text-base sm:text-lg leading-none">
            No. 03
          </span>
          <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
          <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
            Fresh off the desk
          </span>
        </div>
        <div className="grid lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-7">
            <h2 className="font-display text-ink leading-[1.05] tracking-tight text-3xl sm:text-4xl lg:text-5xl font-medium">
              Plain-English <span className="italic text-primary">guides</span>.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex items-end justify-end">
            <Link
              href="/guides"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-primary transition-colors border-b border-line-strong hover:border-primary pb-0.5"
            >
              All guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Featured article, spans 3 cols. Image up top, editorial
              body (category + title + excerpt + meta) underneath so the
              card actually fills its share of the grid-row instead of
              leaving an empty band below a 16:9 image. */}
          <Link
            href={`/guides/${featured.slug}`}
            className="group lg:col-span-3 block bg-surface-raised rounded-2xl overflow-hidden border border-line hover:border-ink hover:shadow-card-hover transition-all duration-200 flex flex-col"
          >
            <div className="media-warm relative aspect-[16/9] overflow-hidden">
              <BlogCover
                slug={featured.slug}
                title={featured.title}
                category={featured.category}
                coverImage={featured.coverImage}
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
                className="group-hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-sans font-medium uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                  {featured.category}
                </span>
                {featured.readingTime && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-ink-subtle font-sans">
                    <Clock className="w-3.5 h-3.5" /> {featured.readingTime} min read
                  </span>
                )}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight group-hover:text-primary transition-colors">
                {featured.title}
              </h3>
              {featured.excerpt && (
                <p className="mt-3 font-sans text-base text-ink-muted leading-relaxed line-clamp-3">
                  {featured.excerpt}
                </p>
              )}
              <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink group-hover:text-primary transition-colors">
                Read guide <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>

          {/* Two smaller articles, stacked */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/guides/${post.slug}`}
                className="group flex-1 block bg-surface-raised rounded-2xl overflow-hidden border border-line hover:border-ink hover:shadow-card-hover transition-all duration-200 flex flex-col"
              >
                <div className="media-warm relative aspect-[16/7] overflow-hidden">
                  <BlogCover
                    slug={post.slug}
                    title={post.title}
                    category={post.category}
                    coverImage={post.coverImage}
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-sans font-medium uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                      {post.category}
                    </span>
                    {post.readingTime && (
                      <span className="inline-flex items-center gap-1 text-xs text-ink-subtle font-sans">
                        <Clock className="w-3 h-3" /> {post.readingTime} min
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-base text-ink leading-tight group-hover:text-primary transition-colors line-clamp-2 flex-1">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Cornerstone evergreen guides. Magazine-style numbered list. Six
            highest-value pages surfaced from the homepage so Google sees
            them as priority internal-link targets. Big serif numerals on
            the left read as an editorial "best of" column rather than a
            SaaS feature grid. */}
        <div className="mt-14 pt-10 border-t border-line-warm">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="font-display italic text-primary text-lg leading-none mb-2">
                Editor&rsquo;s reading list
              </p>
              <p className="text-[11px] uppercase tracking-[0.24em] text-ink-subtle font-sans font-medium">
                Six guides our readers open first
              </p>
            </div>
            <Link
              href="/guides"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-primary transition-colors border-b border-line-strong hover:border-primary pb-0.5"
            >
              Every guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10">
            {CORNERSTONE.map((g, i) => (
              <Link
                key={g.href}
                href={g.href}
                className="group flex items-start gap-5 py-6 border-b border-line hover:border-ink transition-colors"
              >
                <span className="font-display text-4xl sm:text-5xl text-ink-subtle group-hover:text-primary transition-colors leading-none mt-0.5 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.22em] text-cta mb-2 font-medium">
                    {g.audience}
                  </p>
                  <p className="font-display text-lg sm:text-xl text-ink leading-[1.2] group-hover:text-primary transition-colors">
                    {g.title}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs text-ink-subtle font-sans">
                    <Clock className="w-3 h-3" /> {g.minutes} min read
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-ink-subtle group-hover:text-primary transition-colors mt-2 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
