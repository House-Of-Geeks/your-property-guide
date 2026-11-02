import type { ReactNode } from "react";
import { Footprints, Bus, Bike } from "lucide-react";
import { walkLabel } from "@/lib/suburb-snapshot";

interface SuburbWalkabilityProps {
  walkScore:    number | null;
  transitScore: number | null;
  bikeScore:    number | null;
}

interface ScoreConfig {
  label:   string;
  score:   number | null;
  icon:    ReactNode;
}

// One row of up to three scores out of 100, each with a thin bar. Ink, not
// traffic-light colours: a score is a measure, not a warning. A score that is
// not held is left out, and the row takes the width of the ones that are.
function Score({ label, score, icon }: Omit<ScoreConfig, "score"> & { score: number }) {
  return (
    <div className="py-3 px-3 first:pl-0">
      <dt className="flex items-center gap-1.5 text-[13px] font-sans text-ink-muted">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 font-display text-2xl font-normal text-ink leading-none">
        {score}<span className="text-sm font-normal text-ink-subtle">/100</span>
      </dd>
      <dd className="mt-2 h-1 w-full rounded-full bg-surface-warm overflow-hidden" aria-hidden="true">
        <div className="h-full rounded-full bg-ink" style={{ width: `${score}%` }} />
      </dd>
    </div>
  );
}

// Tailwind reads class names from the source: spelt out.
const SCORE_COLUMNS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
};

export function SuburbWalkability({ walkScore, transitScore, bikeScore }: SuburbWalkabilityProps) {
  if (walkScore === null && transitScore === null && bikeScore === null) {
    return (
      <p className="text-sm font-sans text-ink-muted py-2">
        Walkability data not yet available for this suburb.
      </p>
    );
  }

  const scores: { label: string; score: number | null; icon: ReactNode }[] = [
    { label: "Walk", score: walkScore, icon: <Footprints className="w-4 h-4" aria-hidden="true" /> },
    { label: "Transit", score: transitScore, icon: <Bus className="w-4 h-4" aria-hidden="true" /> },
    { label: "Bike", score: bikeScore, icon: <Bike className="w-4 h-4" aria-hidden="true" /> },
  ];
  const held = scores.filter((c): c is { label: string; score: number; icon: ReactNode } => c.score !== null);

  return (
    <div>
      <dl className={`grid ${SCORE_COLUMNS[held.length]} divide-x divide-line border-y border-line`}>
        {held.map((c) => (
          <Score key={c.label} label={c.label} score={c.score} icon={c.icon} />
        ))}
      </dl>
      <p className="mt-3 text-xs font-sans text-ink-subtle">
        {walkScore !== null && <>{walkLabel(walkScore)}. </>}
        Scores out of 100, calculated from OpenStreetMap data (ODbL).
      </p>
    </div>
  );
}
