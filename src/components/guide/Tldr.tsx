import { Check } from "lucide-react";

interface TldrProps {
  // 4 to 6 short, citation-ready bullet points. Each should be a complete
  // factual statement so AI search engines can quote it directly.
  points: readonly string[];
  title?: string;
}

// Top-of-article key takeaways: the answer first, before any contents or
// body. A primary citation surface for AI Overviews and answer engines, so
// each bullet is a fact that stands alone without surrounding context.

export function Tldr({ points, title = "Key takeaways" }: TldrProps) {
  if (points.length === 0) return null;
  return (
    <section aria-labelledby="key-takeaways" className="rounded-xl border border-line bg-surface-warm px-5 py-5 sm:px-7 sm:py-6">
      <h2 id="key-takeaways" className="text-base font-bold text-ink tracking-[-0.01em] mb-3">
        {title}
      </h2>
      <ul className="space-y-2.5">
        {points.map((point, i) => (
          <li key={i} className="flex gap-3 text-[15px] sm:text-base text-ink leading-relaxed">
            <Check className="w-4 h-4 shrink-0 mt-[0.3rem] text-ink" strokeWidth={2.5} aria-hidden="true" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
