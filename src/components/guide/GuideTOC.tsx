import Link from "next/link";

export interface GuideTOCEntry {
  id: string;        // anchor id within the article
  label: string;     // display label
  level?: 2 | 3;     // h2 or h3 indentation; defaults to 2
}

interface GuideTOCProps {
  entries: readonly GuideTOCEntry[];
  // When true, renders inline at the top of the article (mobile-friendly).
  // When false, renders compact for sidebar / desktop sticky use.
  variant?: "inline" | "sidebar";
}

export function GuideTOC({ entries, variant = "inline" }: GuideTOCProps) {
  if (variant === "sidebar") {
    return (
      <nav aria-label="In this guide" className="font-sans">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-subtle mb-3">In this guide</p>
        <ul className="space-y-2 text-sm">
          {entries.map((e) => (
            <li key={e.id} className={e.level === 3 ? "pl-3" : ""}>
              <Link
                href={`#${e.id}`}
                className="text-ink-muted hover:text-ink hover:underline underline-offset-4 leading-snug block"
              >
                {e.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="In this guide" className="my-8 rounded-2xl border border-line bg-surface-raised p-6 sm:p-7">
      <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-4">
        In this guide
      </p>
      <ol className="space-y-2 font-sans text-base">
        {entries.map((e, i) => (
          <li key={e.id} className="flex gap-3">
            <span className="font-display italic text-cta shrink-0 w-6">{String(i + 1).padStart(2, "0")}</span>
            <Link
              href={`#${e.id}`}
              className="text-ink-muted hover:text-ink hover:underline underline-offset-4 leading-snug"
            >
              {e.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
