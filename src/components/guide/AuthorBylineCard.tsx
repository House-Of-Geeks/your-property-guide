import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AuthorBylineCardProps {
  /** Name of the author. */
  authorName: string;
  /** Optional role/title for the author. */
  authorRole?: string;
  /** Author headshot. Defaults to Andy's portrait, since most guides are
   *  written or edited by him. */
  authorImage?: string;
  /** Optional reviewer for the article (shown as a second line). */
  reviewerName?: string;
  reviewerRole?: string;
  /** ISO date of last review. */
  lastReviewed?: string;
}

/**
 * Author byline footer card for guide articles. Sits at the bottom of every
 * guide body, after the related-guides rail, and reinforces E-E-A-T (Google's
 * authorship + expertise signals) with a portrait, role, and link to the
 * editor's page. Bing reads it as a named-author signal too.
 *
 * Renders in the main column inside prose-ypg flow; uses not-prose so the
 * portrait + text don't pick up article typography.
 */
export function AuthorBylineCard({
  authorName,
  authorRole,
  authorImage = "/images/agents/andy-mcmaster.jpg",
  reviewerName,
  reviewerRole,
  lastReviewed,
}: AuthorBylineCardProps) {
  return (
    <aside className="not-prose mt-12 rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-8">
      <div className="flex items-start gap-5">
        <Link
          href="/about#andy-mcmaster"
          className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full overflow-hidden border border-line-warm hover:border-ink transition-colors block"
          aria-label={`About ${authorName}`}
        >
          <Image
            src={authorImage}
            alt={`${authorName} portrait`}
            fill
            className="object-cover"
            sizes="80px"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="font-display italic text-primary text-sm leading-none mb-2">
            About the author
          </p>
          <p className="font-display text-xl sm:text-2xl text-ink leading-tight mb-1 font-medium">
            {authorName}
          </p>
          {authorRole && (
            <p className="text-[11px] uppercase tracking-[0.22em] text-ink-subtle font-sans font-medium mb-3">
              {authorRole}
            </p>
          )}
          <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-prose mb-4">
            Editor of Your Property Guide. Writes the editorial
            methodology, scheme and policy commentary, and oversees the
            suburb data review. Based in Brisbane, Australia.
          </p>
          {(reviewerName || lastReviewed) && (
            <p className="font-sans text-xs text-ink-subtle leading-relaxed mb-4">
              {reviewerName && (
                <>
                  Reviewed by <span className="text-ink font-medium">{reviewerName}</span>
                  {reviewerRole && <span className="text-ink-subtle">, {reviewerRole}</span>}
                </>
              )}
              {reviewerName && lastReviewed && " · "}
              {lastReviewed && (
                <>
                  Last updated <FormattedDate iso={lastReviewed} />
                </>
              )}
            </p>
          )}
          <Link
            href="/about#andy-mcmaster"
            className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-ink hover:text-primary border-b border-line-strong hover:border-primary pb-0.5 transition-colors"
          >
            Read the editor&rsquo;s page
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

function FormattedDate({ iso }: { iso: string }) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return <>{iso}</>;
  const month = d.toLocaleString("en-AU", { month: "long", timeZone: "Australia/Brisbane" });
  return <>{month} {d.getUTCFullYear()}</>;
}
