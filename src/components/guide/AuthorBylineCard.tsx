import Image from "next/image";
import Link from "next/link";
import { METHODOLOGY_HREF, findPerson, formatGuideDate, personHref } from "./people";

interface AuthorBylineCardProps {
  /** Name of the author. */
  authorName: string;
  /** Optional role/title for the author. */
  authorRole?: string;
  /** Author headshot; falls back to the person's photo on /about. */
  authorImage?: string;
  /** Optional reviewer for the article. */
  reviewerName?: string;
  reviewerRole?: string;
  /** ISO date of last review. */
  lastReviewed?: string;
}

/**
 * "About this guide" at the foot of every guide and article: the named
 * person behind it (the writer when they are a named person, otherwise the
 * editor who reviewed it), with their own photo, role, bio and /about link,
 * plus the update date and the methodology link. A team byline never borrows
 * a person's face or bio.
 */
export function AuthorBylineCard({
  authorName,
  authorRole,
  authorImage,
  reviewerName,
  reviewerRole,
  lastReviewed,
}: AuthorBylineCardProps) {
  const author = findPerson(authorName);
  const reviewer = reviewerName && reviewerName !== authorName ? findPerson(reviewerName) : undefined;
  const featured = author ?? reviewer;
  const featuredIsAuthor = featured !== undefined && featured === author;
  const image = featuredIsAuthor ? authorImage ?? featured.image : featured?.image;
  const role = featuredIsAuthor ? authorRole ?? featured.role : reviewerRole ?? featured?.role;

  const credit: string[] = [];
  if (!featuredIsAuthor) credit.push(`Written by ${authorName}${authorRole ? `, ${authorRole}` : ""}`);
  if (featuredIsAuthor && reviewerName && reviewerName !== authorName) credit.push(`Reviewed by ${reviewerName}`);

  return (
    <aside className="not-prose mt-12 rounded-xl border border-line p-5 sm:p-6" aria-label="About this guide">
      <div className="flex items-start gap-4">
        {featured && image && (
          <Link href={personHref(featured)} className="shrink-0" aria-label={`About ${featured.name}`}>
            <Image
              src={image}
              alt={featured.name}
              width={64}
              height={64}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-line"
            />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm text-ink-muted">{featuredIsAuthor ? "Written by" : featured ? "Reviewed by" : "Written by"}</p>
          <p className="text-lg font-bold text-ink leading-tight">
            {featured ? featured.name : authorName}
            {role && <span className="font-normal text-ink-muted">, {role}</span>}
          </p>
          {featured && <p className="mt-2 text-[15px] text-ink-muted leading-relaxed">{featured.bio}</p>}
          {(credit.length > 0 || lastReviewed) && (
            <p className="mt-3 text-sm text-ink-muted">
              {credit.join(" · ")}
              {credit.length > 0 && lastReviewed && " · "}
              {lastReviewed && (
                <>
                  Updated <time dateTime={lastReviewed.slice(0, 10)}>{formatGuideDate(lastReviewed)}</time>
                </>
              )}
            </p>
          )}
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium">
            {featured && (
              <Link href={personHref(featured)} className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                More about {featured.name.split(" ")[0]}
              </Link>
            )}
            <Link href={METHODOLOGY_HREF} className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
              How we keep this accurate
            </Link>
          </p>
        </div>
      </div>
    </aside>
  );
}
