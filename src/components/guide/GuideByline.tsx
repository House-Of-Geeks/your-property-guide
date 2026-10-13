import Image from "next/image";
import Link from "next/link";
import { METHODOLOGY_HREF, findPerson, formatGuideDate, personHref } from "./people";

interface GuideBylineProps {
  author: { name: string; role?: string; image?: string };
  reviewer?: { name: string; role?: string };
  /** ISO date the page was last updated (or published, when never updated). */
  updatedAt: string;
  /** ISO publish date; shown only when it differs from updatedAt. */
  publishedAt?: string;
  readingMinutes?: number;
  /** Anchor of the page's sources block; adds a "Sources" jump link. */
  sourcesHref?: string;
}

/**
 * The byline under a guide's H1: who reviewed it (with their photo), who
 * wrote it, when it was last updated, and where the method is written down.
 * The photo is only ever the named person's own: a team byline gets no face.
 */
export function GuideByline({ author, reviewer, updatedAt, publishedAt, readingMinutes, sourcesHref }: GuideBylineProps) {
  const authorPerson = findPerson(author.name);
  const reviewerPerson = reviewer && reviewer.name !== author.name ? findPerson(reviewer.name) : undefined;
  // The face beside the byline: the writer when they are a named person,
  // else the reviewer who signed the guide off.
  const face = authorPerson ?? reviewerPerson;
  const faceImage = face === authorPerson ? author.image ?? face?.image : face?.image;
  const showPublished = publishedAt && publishedAt.slice(0, 10) !== updatedAt.slice(0, 10);

  const lead = authorPerson ? (
    <>
      By{" "}
      <Link href={personHref(authorPerson)} className="font-semibold text-ink hover:underline underline-offset-4">
        {author.name}
      </Link>
      {(author.role ?? authorPerson.role) && <span className="text-ink-muted">, {author.role ?? authorPerson.role}</span>}
    </>
  ) : reviewer ? (
    <>
      Reviewed by{" "}
      {reviewerPerson ? (
        <Link href={personHref(reviewerPerson)} className="font-semibold text-ink hover:underline underline-offset-4">
          {reviewer.name}
        </Link>
      ) : (
        <span className="font-semibold text-ink">{reviewer.name}</span>
      )}
      {reviewer.role && <span className="text-ink-muted">, {reviewer.role}</span>}
    </>
  ) : (
    <>
      By <span className="font-semibold text-ink">{author.name}</span>
    </>
  );

  const meta: React.ReactNode[] = [];
  if (!authorPerson && reviewer) meta.push(<span key="by">Written by {author.name}</span>);
  if (authorPerson && reviewer && reviewer.name !== author.name) {
    meta.push(<span key="rev">Reviewed by {reviewer.name}</span>);
  }
  meta.push(
    <span key="upd">
      Updated <time dateTime={updatedAt.slice(0, 10)}>{formatGuideDate(updatedAt)}</time>
    </span>,
  );
  if (showPublished) {
    meta.push(
      <span key="pub">
        First published <time dateTime={publishedAt!.slice(0, 10)}>{formatGuideDate(publishedAt!)}</time>
      </span>,
    );
  }
  if (readingMinutes) meta.push(<span key="read">{readingMinutes} min read</span>);

  return (
    <div className="flex items-start gap-3.5">
      {face && faceImage && (
        <Link href={personHref(face)} className="shrink-0" aria-label={`About ${face.name}`}>
          <Image
            src={faceImage}
            alt={face.name}
            width={48}
            height={48}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border border-line"
          />
        </Link>
      )}
      <div className="min-w-0 text-sm leading-relaxed">
        <p className="text-ink">{lead}</p>
        <p className="text-ink-muted">
          {meta.map((m, i) => (
            <span key={i}>
              {i > 0 && " "}
              <span className="whitespace-nowrap">
                {i > 0 && <span aria-hidden="true" className="pr-1.5 text-line-strong">·</span>}
                {m}
              </span>
            </span>
          ))}
        </p>
        <p className="text-ink-muted">
          <Link href={METHODOLOGY_HREF} className="underline decoration-line-strong underline-offset-4 hover:text-ink hover:decoration-ink">
            How we keep this accurate
          </Link>
          {sourcesHref && (
            <>
              <span aria-hidden="true" className="px-1.5 text-line-strong">·</span>
              <a href={sourcesHref} className="underline decoration-line-strong underline-offset-4 hover:text-ink hover:decoration-ink">
                Sources
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
