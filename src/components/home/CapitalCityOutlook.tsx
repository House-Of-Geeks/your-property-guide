import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getBlogPosts } from "@/lib/services/blog-service";

const CAPITAL_CITIES = [
  { slug: "sydney-property-market-2026",   city: "Sydney",   state: "NSW" },
  { slug: "melbourne-property-market-2026", city: "Melbourne", state: "VIC" },
  { slug: "brisbane-property-market-2026", city: "Brisbane", state: "QLD" },
  { slug: "perth-property-market-2026",    city: "Perth",    state: "WA"  },
] as const;

/**
 * "2026 capital city outlooks" rail for the home page. Pulls the four
 * capital-city market posts and renders them as image-led editorial cards.
 * If a post is missing we silently drop it — the rail still renders with the
 * remaining cities.
 */
export async function CapitalCityOutlook() {
  const posts = await getBlogPosts();
  const found = CAPITAL_CITIES.map((c) => {
    const post = posts.find((p) => p.slug === c.slug);
    return post ? { ...c, post } : null;
  }).filter((x): x is NonNullable<typeof x> => x != null);

  if (found.length === 0) return null;

  return (
    <section className="bg-surface-raised border-y border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-7">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
              2026 capital city outlooks
            </p>
            <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
              Each major market, <span className="italic text-primary">read fresh</span>.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex items-end justify-end">
            <Link
              href="/insights"
              className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-ink hover:text-primary border-b border-line-strong hover:border-primary pb-0.5 transition-colors"
            >
              All insights <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {found.map(({ city, state, post }) => (
            <Link
              key={post.slug}
              href={`/guides/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-line bg-surface-warm overflow-hidden hover:border-primary/40 hover:shadow-md transition-all"
            >
              {post.coverImage ? (
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-warm-sunken">
                  <Image
                    src={post.coverImage}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-block rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-sans uppercase tracking-[0.2em] text-ink">
                      {state}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/3] bg-surface-warm-sunken flex items-center justify-center">
                  <span className="font-display text-3xl text-ink/30">{state}</span>
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
                  {city} 2026
                </p>
                <h3 className="font-display text-lg text-ink group-hover:text-primary transition-colors leading-tight mb-3 flex-1">
                  {post.title}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider text-ink group-hover:text-primary transition-colors">
                  Read the outlook <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
