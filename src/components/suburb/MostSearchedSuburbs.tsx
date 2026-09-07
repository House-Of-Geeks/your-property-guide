import Link from "next/link";
import type { TopSuburb } from "@/lib/data/top-suburbs";

interface Props {
  /** "New South Wales", "Greater Brisbane" */
  label: string;
  suburbs: TopSuburb[];
  /** Match the page's palette: the state pages use the grey scale, the market pages the ink tokens. */
  tone?: "gray" | "ink";
}

// Fix item 5: links to the suburbs that carry most of the search impressions,
// capped so the block reads as navigation rather than a link farm. Renders
// nothing below five entries (the smaller states and cities).
export function MostSearchedSuburbs({ label, suburbs, tone = "gray" }: Props) {
  if (suburbs.length < 5) return null;
  const h = tone === "ink" ? "font-display text-2xl sm:text-3xl text-ink leading-tight mb-2" : "text-2xl font-bold text-gray-900 mb-2";
  const p = tone === "ink" ? "font-sans text-sm text-ink-muted mb-6" : "text-sm text-gray-500 mb-6";
  const chip = tone === "ink"
    ? "inline-block rounded-full border border-line bg-surface-raised px-3 py-1.5 text-sm text-ink hover:border-primary hover:text-primary transition-colors"
    : "inline-block rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 hover:border-primary hover:text-primary transition-colors";
  const muted = tone === "ink" ? "text-ink-subtle" : "text-gray-400";
  return (
    <section aria-labelledby="most-searched-suburbs">
      <h2 id="most-searched-suburbs" className={h}>Most searched suburbs in {label}</h2>
      <p className={p}>The {label} suburbs people look up most on Your Property Guide, by Google search impressions over the last three months.</p>
      <ul className="flex flex-wrap gap-2">
        {suburbs.map((s) => (
          <li key={s.slug}>
            <Link href={`/suburbs/${s.slug}`} className={chip}>
              {s.name} <span className={muted}>{s.postcode}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
