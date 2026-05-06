import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { GLOSSARY_TERMS } from "@/lib/data/glossary";

interface GuideGlossaryRailProps {
  /** Slugs from src/lib/data/glossary.ts to surface on this guide */
  slugs: readonly string[];
  /** Optional title override */
  title?: string;
}

// Strip HTML tags for the short preview text shown under each term name.
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Surfaces 3 to 4 hand-picked glossary terms on a guide page. Each one links
 * to the dedicated /glossary/[term] page so guides become entry points to the
 * 99-term glossary network.
 *
 * Authors pass the slug list explicitly — terms must already exist in
 * `lib/data/glossary.ts`. Missing slugs are silently dropped.
 */
export function GuideGlossaryRail({
  slugs,
  title = "Terms in this guide",
}: GuideGlossaryRailProps) {
  const matched = slugs
    .map((s) => GLOSSARY_TERMS.find((t) => t.slug === s))
    .filter((t): t is NonNullable<typeof t> => t != null);

  if (matched.length === 0) return null;

  return (
    <aside className="not-prose my-10 rounded-2xl border border-line bg-surface-warm p-6 sm:p-8">
      <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2 inline-flex items-center gap-2">
        <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
        Glossary
      </p>
      <h3 className="font-display text-2xl text-ink leading-tight mb-5">
        {title}
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {matched.map((t) => {
          const preview = stripHtml(t.html);
          const truncated = preview.length > 110 ? `${preview.slice(0, 107)}…` : preview;
          return (
            <li key={t.slug}>
              <Link
                href={`/glossary/${t.slug}`}
                className="group flex items-start gap-3 rounded-xl border border-line bg-surface-raised p-4 hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base text-ink group-hover:text-primary transition-colors leading-tight">
                    {t.term}
                  </p>
                  <p className="mt-1 font-sans text-xs text-ink-muted leading-snug">
                    {truncated}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-ink-subtle group-hover:text-primary transition-colors shrink-0 mt-1" />
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 font-sans text-sm">
        <Link
          href="/glossary"
          className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 font-medium transition-colors"
        >
          Browse the full A-Z glossary →
        </Link>
      </p>
    </aside>
  );
}
