import Image from "next/image";
import type { Suburb } from "@/types";
import { buildSnapshotProvenance, buildSnapshotStats } from "@/lib/suburb-snapshot";

interface SuburbSnapshotProps {
  suburb: Suburb;
}

// Magazine-style stat band that sits directly below the satellite hero: the
// opening snapshot (fix item 3). Up to six editorial stats with a thin
// vertical rule between each, and a provenance line underneath naming the
// source and period of each data family shown. Renders nothing below three
// tiles. Every number comes through the gates in suburb-service, so this
// band and the lead sentence in the brief cannot disagree.

// Map of tile count → grid column class. Tailwind needs explicit class
// strings at build time so we can't `grid-cols-${n}` dynamically.
const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

export function SuburbSnapshot({ suburb }: SuburbSnapshotProps) {
  const stats = buildSnapshotStats(suburb);
  if (stats.length === 0) return null;
  const provenance = buildSnapshotProvenance(suburb, stats);
  const colsClass = GRID_COLS[stats.length] ?? GRID_COLS[6];
  return (
    <section
      aria-label={`${suburb.name} snapshot`}
      className="bg-surface-warm border-b border-line-warm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-6">
          {suburb.name} at a glance
        </p>
        <div className={`grid ${colsClass} gap-y-6 lg:gap-y-0`}>
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-4 sm:px-6 ${
                i > 0 ? "lg:border-l lg:border-line-warm" : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Image src={s.icon} alt="" width={18} height={18} className="w-[18px] h-[18px]" aria-hidden="true" />
                <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle">
                  {s.label}
                </p>
              </div>
              <p className="font-display text-3xl sm:text-4xl text-ink leading-none tracking-tight">
                {s.value}
              </p>
              {s.detail && (
                <p className="text-xs font-sans text-ink-muted mt-2 leading-snug">
                  {s.detail}
                </p>
              )}
            </div>
          ))}
        </div>
        {provenance.length > 0 && (
          <p className="mt-6 text-xs font-sans text-ink-subtle leading-relaxed">
            {provenance.join("  ·  ")}
          </p>
        )}
      </div>
    </section>
  );
}
