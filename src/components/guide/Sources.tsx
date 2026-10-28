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
  /** Optional paragraph between the heading and the list. */
  intro?: string;
}

export function Sources({ items, title = "Sources and methodology", intro }: SourcesProps) {
  if (items.length === 0) return null;
  return (
    <section id="sources" className="mt-12 pt-8 border-t border-line scroll-mt-28">
      <h2 className="text-base font-bold text-ink mb-3">
        {title}
      </h2>
      {intro && <p className="font-sans text-sm text-ink-muted leading-relaxed mb-3">{intro}</p>}
      <ul className="font-sans text-sm text-ink-muted leading-relaxed space-y-2 list-disc pl-5 marker:text-line-strong">
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
