import { Check } from "lucide-react";

interface TldrProps {
  // 4 to 6 short, citation-ready bullet points. Each should be a complete
  // factual statement so AI search engines can quote it directly.
  points: readonly string[];
}

// Top-of-article Key Takeaways block. Per the SEO ranking advice doc this is
// a primary citation surface for AI Overviews / Perplexity-style retrievers.
// Each bullet should be a fact that stands alone without surrounding context.

export function Tldr({ points }: TldrProps) {
  return (
    <aside className="my-8 rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-7">
      <p className="text-xs font-sans uppercase tracking-[0.2em] text-cta mb-4">
        Key takeaways
      </p>
      <ul className="space-y-3">
        {points.map((point, i) => (
          <li key={i} className="flex gap-3 font-sans text-base text-ink leading-relaxed">
            <Check className="w-5 h-5 shrink-0 mt-0.5 text-primary" aria-hidden="true" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
