import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { getBlogPosts } from "@/lib/services/blog-service";

export async function LatestGuides() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts.slice(0, 3);

  if (!featured) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Research guides</h2>
            <p className="text-gray-500 mt-1">Practical advice for buyers, renters and investors</p>
          </div>
          <Link href="/blog" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            All guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Featured article — spans 3 cols */}
          <Link
            href={`/blog/${featured.slug}`}
            className="group lg:col-span-3 block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200"
          >
            {featured.coverImage && (
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm mb-3">
                    {featured.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug group-hover:text-white/90 transition-colors">
                    {featured.title}
                  </h3>
                  {featured.readingTime && (
                    <span className="inline-flex items-center gap-1.5 text-sm text-white/70 mt-2">
                      <Clock className="w-3.5 h-3.5" /> {featured.readingTime} min read
                    </span>
                  )}
                </div>
              </div>
            )}
            {!featured.coverImage && (
              <div className="p-6">
                <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary mb-3">
                  {featured.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 leading-snug">{featured.title}</h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-3">{featured.excerpt}</p>
              </div>
            )}
          </Link>

          {/* Two smaller articles — span 2 cols, stacked */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex-1 block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200"
              >
                {post.coverImage && (
                  <div className="relative aspect-[16/7] overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                      {post.category}
                    </span>
                    {post.readingTime && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" /> {post.readingTime} min
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2 text-sm">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            All guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
