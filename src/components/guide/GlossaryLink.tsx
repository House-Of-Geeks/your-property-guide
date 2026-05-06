import Link from "next/link";
import { GLOSSARY_TERMS } from "@/lib/data/glossary";

interface GlossaryLinkProps {
  /** The glossary term slug, e.g. "bridging-finance". Must exist in lib/data/glossary.ts. */
  term: string;
  /** Display text — defaults to the slug's own term name */
  children?: React.ReactNode;
  /** Optional title override for the tooltip */
  title?: string;
}

/**
 * Inline link to a glossary term page. Renders the same dotted-underline
 * style as the auto-linker (so manual and auto links look consistent).
 *
 * If the slug doesn't exist in the glossary data we fall back to plain text
 * — fail-safe so a typo doesn't break a guide page render.
 */
export function GlossaryLink({ term, children, title }: GlossaryLinkProps) {
  const entry = GLOSSARY_TERMS.find((t) => t.slug === term);

  if (!entry) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        `[GlossaryLink] Unknown term slug "${term}". Add to lib/data/glossary.ts or fix the prop.`,
      );
    }
    return <>{children ?? term}</>;
  }

  return (
    <Link
      href={`/glossary/${entry.slug}`}
      className="glossary-link"
      title={title ?? `${entry.term}: open the glossary definition`}
      data-glossary-slug={entry.slug}
    >
      {children ?? entry.term}
    </Link>
  );
}
