import { ChevronDown } from "lucide-react";
import { GuideTOCRail } from "./GuideTOCRail";

export interface GuideTOCEntry {
  id: string;        // anchor id within the article
  label: string;     // display label
  level?: 2 | 3;     // h2 or h3 indentation; defaults to 2
}

interface GuideTOCProps {
  entries: readonly GuideTOCEntry[];
  /**
   * "inline": a collapsed "In this guide" list for phones and tablets, so the
   * contents cost one line until the reader opens them.
   * "sidebar": the sticky desktop rail, which marks the section in view.
   */
  variant?: "inline" | "sidebar";
  title?: string;
}

export function GuideTOC({ entries, variant = "inline", title = "In this guide" }: GuideTOCProps) {
  if (entries.length === 0) return null;
  if (variant === "sidebar") return <GuideTOCRail entries={entries} title={title} />;

  const sections = entries.filter((e) => e.level !== 3).length;
  return (
    <details className="group rounded-xl border border-line bg-white">
      <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="text-[15px] font-semibold text-ink">{title}</span>
        <span className="inline-flex items-center gap-1.5 text-sm text-ink-muted">
          {sections} {sections === 1 ? "section" : "sections"}
          <ChevronDown className="w-4 h-4 group-open:rotate-180" aria-hidden="true" />
        </span>
      </summary>
      <nav aria-label={title} className="border-t border-line px-4 py-2">
        <ul>
          {entries.map((e) => (
            <li key={e.id} className={e.level === 3 ? "pl-4" : ""}>
              <a
                href={`#${e.id}`}
                className="block py-2 text-[15px] leading-snug text-ink-muted hover:text-ink"
              >
                {e.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
