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

// One row of three scores out of 100, each with a thin bar. Ink, not
// traffic-light colours: a score is a measure, not a warning.
function Score({ label, score, icon }: ScoreConfig) {
  return (
    <div className="py-3 px-3 first:pl-0">
      <dt className="flex items-center gap-1.5 text-[13px] font-sans text-ink-muted">
        {icon}
        {label}
      </dt>
      {score !== null ? (
        <>
          <dd className="mt-1 font-display text-2xl font-normal text-ink leading-none">
            {score}<span className="text-sm font-normal text-ink-subtle">/100</span>
          </dd>
          <dd className="mt-2 h-1 w-full rounded-full bg-surface-warm overflow-hidden" aria-hidden="true">
            <div className="h-full rounded-full bg-ink" style={{ width: `${score}%` }} />
          </dd>
        </>
      ) : (
        <dd className="mt-1 font-display text-2xl text-ink-subtle leading-none">–</dd>
      )}
    </div>
  );
}

export function SuburbWalkability({ walkScore, transitScore, bikeScore }: SuburbWalkabilityProps) {
  if (walkScore === null && transitScore === null && bikeScore === null) {
    return (
      <p className="text-sm font-sans text-ink-muted py-2">
        Walkability data not yet available for this suburb.
      </p>
    );
  }

  return (
    <div>
      <dl className="grid grid-cols-3 divide-x divide-line border-y border-line">
        <Score label="Walk" score={walkScore} icon={<Footprints className="w-4 h-4" aria-hidden="true" />} />
        <Score label="Transit" score={transitScore} icon={<Bus className="w-4 h-4" aria-hidden="true" />} />
        <Score label="Bike" score={bikeScore} icon={<Bike className="w-4 h-4" aria-hidden="true" />} />
      </dl>
      <p className="mt-3 text-xs font-sans text-ink-subtle">
        {walkScore !== null && <>{walkLabel(walkScore)}. </>}
        Scores out of 100, calculated from OpenStreetMap data (ODbL).
      </p>
    </div>
  );
}
