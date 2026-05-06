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
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-primary transition-colors border-b border-line-strong hover:border-primary pb-0.5"
            >
              All guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Featured article — spans 3 cols */}
          <Link
            href={`/blog/${featured.slug}`}
            className="group lg:col-span-3 block bg-surface-raised rounded-2xl overflow-hidden border border-line hover:border-ink hover:shadow-card-hover transition-all duration-200"
          >
            {featured.coverImage ? (
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7">
                  <span className="inline-block text-xs font-sans font-medium uppercase tracking-wider px-3 py-1 rounded-full bg-surface-raised/20 text-white backdrop-blur-sm mb-3">
                    {featured.category}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl text-white leading-tight">
                    {featured.title}
                  </h3>
                  {featured.readingTime && (
                    <span className="inline-flex items-center gap-1.5 text-sm text-white/80 mt-3 font-sans">
                      <Clock className="w-3.5 h-3.5" /> {featured.readingTime} min read
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-7 sm:p-8">
                <span className="inline-block text-xs font-sans font-medium uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary mb-4">
                  {featured.category}
                </span>
                <h3 className="font-display text-2xl text-ink leading-tight mb-3">{featured.title}</h3>
                <p className="font-sans text-sm text-ink-muted leading-relaxed line-clamp-3">{featured.excerpt}</p>
              </div>
            )}
          </Link>

          {/* Two smaller articles — stacked */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
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
