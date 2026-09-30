import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { GuideLinkGroup } from "@/lib/guides/hub-guides";

// The one "Related guides" list every hub shares: /guides, the guide
// category pages, the persona hubs, /buying-guide, /tools and the glossary
// terms. Links come from the guide registry (src/lib/guides), never typed
// by hand. Server-rendered markup only, no client JavaScript.

interface GuideLinkListProps {
  groups: readonly GuideLinkGroup[];
  /** Show each guide's one-line description under its title (the /guides listing). */
  showDescriptions?: boolean;
  /** Columns from the lg breakpoint; one column on phones, two from sm. */
  columns?: 2 | 3;
}

export function GuideLinkList({ groups, showDescriptions = false, columns = 3 }: GuideLinkListProps) {
  const visible = groups.filter((g) => g.links.length > 0);
  if (visible.length === 0) return null;
  const grid = columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div className="space-y-8">
      {visible.map((group, i) => (
        <div key={group.label ?? `group-${i}`}>
          {group.label && (
            <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-ink-subtle mb-3">
              {group.href ? (
                <Link href={group.href} className="text-ink hover:text-primary transition-colors">
                  {group.label}
                </Link>
              ) : (
                group.label
              )}
            </h3>
          )}
          <ul className={`grid grid-cols-1 ${grid} gap-x-8 border-t border-line`}>
            {group.links.map((link) => (
              <li key={link.href} className="border-b border-line">
                <Link href={link.href} className="group flex items-start justify-between gap-3 py-3">
                  <span className="min-w-0">
                    <span className="block font-display text-base text-ink group-hover:text-primary transition-colors leading-snug">
                      {link.title}
                    </span>
                    {showDescriptions && link.description && (
                      <span className="mt-1 font-sans text-sm text-ink-muted leading-relaxed line-clamp-2">
                        {link.description}
                      </span>
                    )}
                  </span>
                  <ArrowRight
                    className="w-4 h-4 shrink-0 mt-1 text-ink-subtle group-hover:text-primary transition-colors"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

interface RelatedGuidesSectionProps {
  heading: string;
  intro?: string;
  groups: readonly GuideLinkGroup[];
  /** Section background; hubs alternate warm and raised bands. */
  tone?: "raised" | "warm";
  id?: string;
}

/** A full-width hub band: eyebrow, heading, intro, then the shared list. */
export function RelatedGuidesSection({ heading, intro, groups, tone = "raised", id }: RelatedGuidesSectionProps) {
  if (groups.every((g) => g.links.length === 0)) return null;
  const bg = tone === "warm" ? "bg-surface-warm" : "bg-surface-raised";
  return (
    <section id={id} className={`${bg} border-t border-line`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <p className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium mb-4">
          Related guides
        </p>
        <h2 className="font-display text-ink leading-[1.05] tracking-tight text-3xl sm:text-4xl font-medium mb-4 max-w-3xl">
          {heading}
        </h2>
        {intro && (
          <p className="font-sans text-base text-ink-muted leading-relaxed max-w-2xl mb-8">{intro}</p>
        )}
        <GuideLinkList groups={groups} />
      </div>
    </section>
  );
}
