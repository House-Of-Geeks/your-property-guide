// Sources & methodology footer. Every guide should cite its sources for
// E-E-A-T credibility and so a reader can verify any number. Accepts either
// plain strings or structured objects with an optional URL.

export type SourceItem =
  | string
  | {
      label: string;
      /** Optional URL. Always rendered with rel="nofollow noopener" if external. */
      href?: string;
      /** Optional dating / note (e.g. "current 2026", "Q4 2025"). */
      note?: string;
    };

interface SourcesProps {
  items: readonly SourceItem[];
  title?: string;
}

export function Sources({ items, title = "Sources and methodology" }: SourcesProps) {
  if (items.length === 0) return null;
  return (
    <section className="mt-12 pt-8 border-t border-line">
      <p className="text-xs font-sans uppercase tracking-[0.22em] text-ink-subtle mb-3">
        {title}
      </p>
      <ul className="font-sans text-sm text-ink-muted leading-relaxed space-y-1.5 list-disc pl-5">
        {items.map((item, i) => {
          if (typeof item === "string") return <li key={i}>{item}</li>;
          const isExternal = item.href ? /^https?:\/\//.test(item.href) : false;
          return (
            <li key={i}>
              {item.href ? (
                <a
                  href={item.href}
                  className="underline decoration-line-strong underline-offset-4 hover:text-ink hover:decoration-ink"
                  {...(isExternal ? { target: "_blank", rel: "nofollow noopener" } : {})}
                >
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
              {item.note && <span className="text-ink-subtle"> · {item.note}</span>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
