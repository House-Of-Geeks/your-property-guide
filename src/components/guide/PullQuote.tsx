interface PullQuoteProps {
  /** The quote text. Renders in italic Fraunces at display scale. */
  children: React.ReactNode;
  /** Optional attribution line shown below the quote. */
  attribution?: string;
}

/**
 * Editorial pull quote for breaking up long-form guide bodies. Sits inside
 * the prose-ypg flow, resets prose styles via not-prose, and uses the
 * brand's italic-Fraunces emphasis treatment at display scale.
 *
 * Use for short, memorable lines (one or two sentences) that summarise a
 * key argument or land a strong opinion the reader will remember.
 */
export function PullQuote({ children, attribution }: PullQuoteProps) {
  return (
    <figure className="not-prose my-12 sm:my-14">
      <div className="relative pl-6 sm:pl-10 border-l-2 border-primary/40">
        <blockquote className="font-display italic font-light text-primary text-2xl sm:text-3xl lg:text-4xl leading-[1.2] tracking-tight">
          &ldquo;{children}&rdquo;
        </blockquote>
        {attribution && (
          <figcaption className="mt-4 text-xs font-sans uppercase tracking-[0.22em] text-ink-subtle font-medium">
            {attribution}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
