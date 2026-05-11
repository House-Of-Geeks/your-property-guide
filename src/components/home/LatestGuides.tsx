import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { getBlogPosts } from "@/lib/services/blog-service";

export async function LatestGuides() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts.slice(0, 3);

  if (!featured) return null;

  return (
    <section className="py-16 sm:py-20 bg-surface-warm border-y border-line-warm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-surface-raised border border-line-warm flex items-center justify-center shrink-0">
                <img src="/images/icons/guide.svg" alt="" width={24} height={24} className="w-6 h-6" aria-hidden="true" />
              </div>
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle">
                Latest from the editorial desk
              </p>
            </div>
            <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
              Research and <span className="italic text-primary">guides</span>.
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
          {/* Featured article — spans 3 cols. Image up top, editorial
              body (category + title + excerpt + meta) underneath so the
              card actually fills its share of the grid-row instead of
              leaving an empty band below a 16:9 image. */}
          <Link
            href={`/guides/${featured.slug}`}
            className="group lg:col-span-3 block bg-surface-raised rounded-2xl overflow-hidden border border-line hover:border-ink hover:shadow-card-hover transition-all duration-200 flex flex-col"
          >
            {featured.coverImage && (
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
              </div>
            )}
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

          {/* Two smaller articles — stacked */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/guides/${post.slug}`}
                className="group flex-1 block bg-surface-raised rounded-2xl overflow-hidden border border-line hover:border-ink hover:shadow-card-hover transition-all duration-200 flex flex-col"
              >
                {post.coverImage && (
                  <div className="relative aspect-[16/7] overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  </div>
                )}
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
      </div>
    </section>
  );
}
