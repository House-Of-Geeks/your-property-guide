import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface RelatedGuide {
  title: string;
  href: string;
  description?: string;
}

interface RelatedGuidesProps {
  items: readonly RelatedGuide[];
  title?: string;
}

// Internal-link block at the end of every guide. Per the SEO advice, every
// guide should link to >= 2 related guides + >= 1 tool.

export function RelatedGuides({ items, title = "Keep reading" }: RelatedGuidesProps) {
  if (items.length === 0) return null;
  return (
    <section className="my-12 pt-12 border-t border-line">
      <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
        {title}
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-2xl border border-line bg-surface-raised hover:border-ink hover:shadow-card p-6 transition-all flex flex-col"
          >
            <h3 className="font-display text-xl text-ink leading-tight mb-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            {item.description && (
              <p className="font-sans text-sm text-ink-muted leading-relaxed mb-4 flex-1">
                {item.description}
              </p>
            )}
            <span className="inline-flex items-center gap-1 text-sm font-medium text-ink mt-auto">
              Read
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
