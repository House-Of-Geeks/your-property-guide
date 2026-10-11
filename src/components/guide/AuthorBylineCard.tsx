import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Key } from "lucide-react";
import { EDITORIAL_BIO, authorAboutHref, authorProfile } from "@/lib/authors";

interface AuthorBylineCardProps {
  /** Name of the author. */
  authorName: string;
  /** Optional role/title for the author. Defaults to the job title /about
   *  gives a named writer (src/lib/authors.ts). */
  authorRole?: string;
  /** Author headshot. Defaults to the named writer's portrait; an author
   *  /about does not introduce as a person gets the brand mark, never
   *  someone else's face. */
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
 * author's card on /about. Bing reads it as a named-author signal too.
 *
 * Each named writer gets their own bio and /about anchor from
 * src/lib/authors.ts (until 10 Oct 2026 every card carried the editor's bio
 * and linked to /about#andy-mcmaster). An author /about does not list, such
 * as "Your Property Guide editorial", gets a neutral line and a link to the
 * methodology; a named reviewer links to their own card.
 *
 * Renders in the main column inside prose-ypg flow; uses not-prose so the
 * portrait + text don't pick up article typography.
 */
export function AuthorBylineCard({
  authorName,
  authorRole,
  authorImage,
  reviewerName,
  reviewerRole,
  lastReviewed,
}: AuthorBylineCardProps) {
  const profile = authorProfile(authorName);
  const href = authorAboutHref(authorName);
  const image = authorImage ?? profile?.image;
  const role = authorRole ?? profile?.jobTitle;
  const reviewer = authorProfile(reviewerName);
  const firstName = authorName.split(/\s+/)[0];
  return (
    <aside className="not-prose mt-12 rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-8">
      <div className="flex items-start gap-5">
        <Link
          href={href}
          className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full overflow-hidden border border-line-warm hover:border-ink transition-colors block"
          aria-label={profile ? `About ${authorName}` : "How we research and check our guides"}
        >
          {image ? (
            <Image
              src={image}
              alt={`${authorName} portrait`}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <span className="flex w-full h-full items-center justify-center bg-surface-inverse">
              <Key className="w-7 h-7 sm:w-8 sm:h-8 text-accent" aria-hidden="true" strokeWidth={2.25} />
            </span>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <p className="font-display italic text-primary text-sm leading-none mb-2">
            About the author
          </p>
          <p className="font-display text-xl sm:text-2xl text-ink leading-tight mb-1 font-medium">
            {authorName}
          </p>
          {role && (
            <p className="text-[11px] uppercase tracking-[0.22em] text-ink-subtle font-sans font-medium mb-3">
              {role}
            </p>
          )}
          <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-prose mb-4">
            {profile ? profile.bio : EDITORIAL_BIO}
          </p>
          {(reviewerName || lastReviewed) && (
            <p className="font-sans text-xs text-ink-subtle leading-relaxed mb-4">
              {reviewerName && (
                <>
                  Reviewed by{" "}
                  {reviewer ? (
                    <Link
                      href={authorAboutHref(reviewerName)}
                      className="text-ink font-medium hover:text-primary border-b border-transparent hover:border-primary transition-colors"
                    >
                      {reviewerName}
                    </Link>
                  ) : (
                    <span className="text-ink font-medium">{reviewerName}</span>
                  )}
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
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-ink hover:text-primary border-b border-line-strong hover:border-primary pb-0.5 transition-colors"
          >
            {profile ? <>More about {firstName}</> : <>How we research and check our guides</>}
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
