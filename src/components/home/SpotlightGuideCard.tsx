import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { getBlogPostBySlug } from "@/lib/services/blog-service";
import { pickSpotlightGuideSlug } from "@/lib/guide-spotlight";

// Hero spotlight: a real guide rendered as a magazine "today's read"
// card on the right side of the homepage hero. Tells the visitor at
// a glance what the site is for — plain-English explainers of the
// Australian property machinery, free.
//
// Async server component. Picks today's slug, fetches once, degrades
// to null silently if the guide isn't published yet (so the layout
// doesn't break if we curate a slug ahead of publication).

export async function SpotlightGuideCard() {
  const slug = pickSpotlightGuideSlug();
  const post = await getBlogPostBySlug(slug);
  if (!post) return null;

  const href = `/guides/${slug}`;
  const readingTime = post.readingTime > 0 ? `${post.readingTime} min read` : null;

  return (
    <Link
      href={href}
      aria-label={`Today's read: ${post.title}. Open the guide.`}
      className="group block rounded-2xl border border-line bg-surface-raised shadow-card overflow-hidden hover:shadow-card-hover hover:border-line-strong transition-all"
    >
      {/* Editorial dark band, same visual language as the suburb
          spotlight we replaced. Decorative contour + grid SVGs only,
          no per-guide cover image dependency so the card works for
          every guide in the rotation. */}
      <div className="relative bg-ink overflow-hidden h-32 sm:h-36">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.22] invert"
        />
        <Image
          src="/images/illustrations/street-grid.svg"
          alt=""
          width={400}
          height={400}
          aria-hidden="true"
          className="absolute -right-4 -bottom-4 w-44 opacity-[0.18] invert pointer-events-none select-none"
        />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-white/70 font-sans font-medium mb-1">
              Today&rsquo;s read
            </p>
            <p className="font-display italic text-cta text-sm leading-none">
              Featured guide
            </p>
          </div>
          {readingTime && (
            <span className="font-sans text-white/60 text-xs uppercase tracking-[0.22em] inline-flex items-center gap-1.5">
              <Clock className="w-3 h-3" aria-hidden="true" />
              {readingTime}
            </span>
          )}
        </div>
      </div>

      {/* Body. Title + excerpt + read CTA. Category is a small
          uppercase tag above the title. */}
      <div className="p-5 sm:p-6">
        {post.category && (
          <p className="text-[11px] uppercase tracking-[0.25em] text-cta font-sans font-medium mb-3">
            {post.category}
          </p>
        )}
        <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-4 group-hover:text-primary transition-colors line-clamp-3">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="font-sans text-sm sm:text-base text-ink-muted leading-relaxed mb-5 line-clamp-4">
            {post.excerpt}
          </p>
        )}

        <div className="pt-4 border-t border-line flex items-center justify-between gap-3">
          <span className="font-sans text-xs text-ink-subtle">
            One of 60+ guides, free.
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink group-hover:text-primary transition-colors">
            Read the guide
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
