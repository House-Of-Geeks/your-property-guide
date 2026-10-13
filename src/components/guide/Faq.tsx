import { Plus } from "lucide-react";
import { FAQPageJsonLd } from "@/components/seo";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  items: readonly FaqItem[];
  title?: string;
  /** Anchor id for the section, so a contents list can link to it. */
  id?: string;
}

// End-of-article structured Q&A. Renders the visible Q&A AND the FAQPage
// JSON-LD schema so Google AI Overviews and structured-data crawlers can
// pick it up. FAQ schema must match visible content: the answers stay in the
// HTML inside native <details>, open or closed.

export function Faq({ items, title = "Common questions", id }: FaqProps) {
  if (items.length === 0) return null;
  return (
    <section id={id} className="my-12 scroll-mt-28">
      <FAQPageJsonLd faqs={items as FaqItem[]} />
      <h2 className="font-display text-[1.625rem] sm:text-[1.75rem] font-bold text-ink leading-tight tracking-[-0.02em] mb-4">
        {title}
      </h2>
      <div className="border-b border-line">
        {items.map((item, i) => (
          <details key={i} className="group border-t border-line">
            <summary className="flex items-start justify-between gap-4 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <h3 className="text-base sm:text-[17px] font-semibold text-ink leading-snug">
                {item.question}
              </h3>
              <Plus
                className="w-5 h-5 shrink-0 mt-0.5 text-ink-muted group-open:rotate-45"
                aria-hidden="true"
              />
            </summary>
            <div className="pb-5 -mt-1 text-[15px] sm:text-base text-ink-muted leading-relaxed max-w-[65ch]">
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
