export type FaqAccordionItem = {
  question: string;
  answer: string;
};

/**
 * Native-details FAQ accordion, server-rendered. Answers stay in the
 * DOM for search and AI surfaces (FAQPageJsonLd mirrors them) and the
 * open/close works without JS; the grid-rows transition just adds the
 * easing in browsers that animate details content.
 */
export function FaqAccordion({ items }: { items: FaqAccordionItem[] }) {
  return (
    <div>
      {items.map((item) => (
        <details key={item.question} className="group border-t border-line">
          <summary className="list-none cursor-pointer py-5 flex items-baseline justify-between gap-4 [&::-webkit-details-marker]:hidden">
            <h3 className="font-sans text-base font-semibold text-ink">{item.question}</h3>
            <span
              className="shrink-0 font-display text-xl leading-none text-primary transition-transform duration-200 group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-[var(--ease-out-quint)] group-open:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <p className="pb-5 font-sans text-sm text-ink-muted leading-relaxed">{item.answer}</p>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
