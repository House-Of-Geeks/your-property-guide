import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

export interface RelatedGuide {
  title: string;
  href: string;
  description?: string;
}

interface RelatedGuidesProps {
  items: readonly RelatedGuide[];
  title?: string;
  id?: string;
}

/** Calculators live at /<name>-calculator; they get a small label in the list. */
export function isCalculatorHref(href: string): boolean {
  return /^\/[a-z0-9-]+-calculator\/?$/.test(href);
}

// Internal-link block at the end of every guide: the next guides to read and
// the calculator that goes with them, as one scannable list rather than a
// grid of cards.

export function RelatedGuides({ items, title = "Keep reading", id }: RelatedGuidesProps) {
  if (items.length === 0) return null;
  return (
    <section id={id} className="my-12 scroll-mt-28">
      <h2 className="font-display text-[1.625rem] sm:text-[1.75rem] font-normal text-ink leading-tight tracking-[-0.02em] mb-4">
        {title}
      </h2>
      <ul className="border-t border-line">
        {items.map((item) => {
          const calc = isCalculatorHref(item.href);
          return (
            <li key={item.href} className="border-b border-line">
              <Link href={item.href} className="group flex items-start gap-4 py-4">
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-base sm:text-[17px] font-semibold text-ink leading-snug group-hover:underline underline-offset-4 decoration-line-strong">
                      {item.title}
                    </span>
                    {calc && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-line px-1.5 py-0.5 text-xs font-medium text-ink-muted">
                        <Calculator className="w-3 h-3" aria-hidden="true" />
                        Calculator
                      </span>
                    )}
                  </span>
                  {item.description && (
                    <span className="mt-1 text-[15px] text-ink-muted leading-relaxed line-clamp-2">{item.description}</span>
                  )}
                </span>
                <ArrowRight className="w-4 h-4 shrink-0 mt-1.5 text-ink-muted group-hover:text-ink" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
