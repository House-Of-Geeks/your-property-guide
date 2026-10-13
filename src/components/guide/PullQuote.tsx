interface PullQuoteProps {
  /** The quote text, set large in the brand face. */
  children: React.ReactNode;
  /** Optional attribution line shown below the quote. */
  attribution?: string;
}

/**
 * Editorial pull quote for breaking up long-form guide bodies. Sits inside
 * the prose-ypg flow and resets prose styles via not-prose. Ink on white
 * with a rule: roof tile is kept for actions.
 *
 * Use for short, memorable lines (one or two sentences) that summarise a
 * key argument or land a strong opinion the reader will remember.
 */
export function PullQuote({ children, attribution }: PullQuoteProps) {
  return (
    <figure className="not-prose my-10 sm:my-12">
      <div className="relative pl-5 sm:pl-7 border-l-2 border-ink">
        <blockquote className="font-display font-bold text-ink text-[1.375rem] sm:text-[1.625rem] leading-[1.25] tracking-[-0.02em]">
          &ldquo;{children}&rdquo;
        </blockquote>
        {attribution && (
          <figcaption className="mt-3 text-sm text-ink-muted">
            {attribution}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
