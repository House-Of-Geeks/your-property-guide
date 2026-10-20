import Link from "next/link";

export interface NextStepLink {
  href: string;
  label: string;
  /** A short figure or note beside the link, e.g. "$550 a week". */
  note?: string;
}

export interface NextStepGroup {
  title: string;
  links: NextStepLink[];
}

/**
 * The closing link block of the suburb sub-pages: the suburb's other pages,
 * its neighbours and the state guides, in scannable columns. Groups with no
 * links are left out.
 */
export function SubpageNextSteps({ title, groups, id }: { title: string; groups: NextStepGroup[]; id?: string }) {
  const shown = groups.filter((g) => g.links.length > 0);
  if (shown.length === 0) return null;
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className="scroll-mt-20">
      <h2 id={id ? `${id}-title` : undefined} className="font-display text-2xl sm:text-3xl font-normal text-ink tracking-[-0.03em] mb-6">
        {title}
      </h2>
      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((g) => (
          <div key={g.title}>
            <h3 className="font-sans text-sm font-semibold text-ink mb-2">{g.title}</h3>
            <ul className="border-t border-line">
              {g.links.map((l) => (
                <li key={l.href} className="border-b border-line">
                  <Link
                    href={l.href}
                    className="flex items-baseline justify-between gap-4 py-2.5 font-sans text-[15px] text-ink hover:text-primary transition-colors"
                  >
                    <span>{l.label}</span>
                    {l.note && <span className="shrink-0 text-sm text-ink-muted">{l.note}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
