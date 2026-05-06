import { FAQPageJsonLd } from "@/components/seo";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  items: readonly FaqItem[];
  title?: string;
}

// End-of-article structured Q&A. Renders the visible Q&A AND the FAQPage
// JSON-LD schema so Google AI Overviews and structured-data crawlers can
// pick it up. Per the SEO ranking advice doc, FAQ schema MUST match visible
// content, otherwise Google penalises.

export function Faq({ items, title = "Common questions" }: FaqProps) {
  if (items.length === 0) return null;
  return (
    <section className="my-12">
      <FAQPageJsonLd faqs={items as FaqItem[]} />
      <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
        {title}
      </h2>
      <div className="rounded-2xl border border-line bg-surface-raised divide-y divide-line">
        {items.map((item, i) => (
          <details
            key={i}
            className="group p-6 sm:p-7"
          >
            <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
              <h3 className="font-display text-lg sm:text-xl text-ink leading-snug pr-4">
                {item.question}
              </h3>
              <span
                aria-hidden="true"
                className="shrink-0 w-6 h-6 rounded-full border border-line-strong flex items-center justify-center text-ink-muted text-sm leading-none transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="mt-3 font-sans text-base text-ink-muted leading-relaxed">
              {item.answer.split("\n\n").map((para, pi) => (
                <p key={pi} className={pi > 0 ? "mt-3" : ""}>{para}</p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
