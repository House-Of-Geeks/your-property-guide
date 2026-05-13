import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { getBlogPostsByCategory } from "@/lib/services/blog-service";
import { AuthorAvatar } from "@/components/blog/AuthorAvatar";
import { formatDate } from "@/lib/utils/format";

const NEWS_CATEGORY = "News";

export async function LatestNews() {
  const posts = await getBlogPostsByCategory(NEWS_CATEGORY, 4);
  if (posts.length === 0) return null;

  const [lead, ...rest] = posts;

  return (
    <section className="py-16 sm:py-20 bg-surface-raised border-y border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-sans font-medium uppercase tracking-[0.2em] px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                Latest news
              </span>
              <span className="text-xs font-sans text-ink-subtle">
                Policy, budget &amp; market moves
              </span>
            </div>
            <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
              The property <span className="italic text-primary">news desk</span>.
            </h2>
            <p className="font-sans text-base text-ink-muted leading-relaxed mt-3 max-w-xl">
              Fresh, sourced reporting on the policy changes, budget moves and
              market shifts that change what you should actually do next.
            </p>
          </div>
          <Link
            href={`/guides/category/${NEWS_CATEGORY}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-primary transition-colors border-b border-line-strong hover:border-primary pb-0.5"
          >
            All news <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Lead story — spans 7 columns */}
          <Link
            href={`/guides/${lead.slug}`}
            className="group lg:col-span-7 block bg-surface-warm rounded-2xl overflow-hidden border border-line hover:border-ink hover:shadow-card-hover transition-all duration-200 flex flex-col"
          >
            {lead.coverImage && (
              <div className="relative aspect-[16/9] overflow-hidden bg-surface-warm-sunken">
                <Image
                  src={lead.coverImage}
                  alt={lead.title}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            )}
            <div className="p-6 sm:p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-3 text-xs font-sans uppercase tracking-[0.18em] text-ink-subtle">
                <span className="font-semibold text-primary">News</span>
                <span aria-hidden="true">·</span>
                <time dateTime={lead.publishedAt}>{formatDate(lead.publishedAt)}</time>
                {lead.readingTime && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 normal-case tracking-normal">
                      <Clock className="w-3 h-3" /> {lead.readingTime} min read
                    </span>
                  </>
                )}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight group-hover:text-primary transition-colors">
                {lead.title}
              </h3>
              {lead.excerpt && (
                <p className="mt-3 font-sans text-base text-ink-muted leading-relaxed line-clamp-3">
                  {lead.excerpt}
                </p>
              )}
              <div className="mt-auto pt-5 flex items-center gap-2.5">
                <AuthorAvatar name={lead.author.name} image={lead.author.image} size={28} />
                <span className="text-sm font-sans font-medium text-ink">{lead.author.name}</span>
                <span className="text-ink-subtle ml-auto inline-flex items-center gap-1.5 text-sm font-medium group-hover:text-primary transition-colors">
                  Read story <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Stacked secondary stories — span 5 columns */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/guides/${post.slug}`}
                className="group flex-1 flex bg-surface-warm rounded-2xl overflow-hidden border border-line hover:border-ink hover:shadow-card-hover transition-all duration-200"
              >
                {post.coverImage && (
                  <div className="relative w-32 sm:w-40 shrink-0 bg-surface-warm-sunken">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      sizes="160px"
                    />
                  </div>
                )}
                <div className="p-4 sm:p-5 flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.18em] text-ink-subtle mb-2">
                    <span className="font-semibold text-primary">News</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </div>
                  <h3 className="font-display text-base sm:text-lg text-ink leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-3">
                    {post.title}
                  </h3>
                  <div className="mt-auto pt-3 flex items-center gap-2">
                    <AuthorAvatar name={post.author.name} image={post.author.image} size={20} />
                    <span className="text-xs font-sans text-ink-muted truncate">{post.author.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
