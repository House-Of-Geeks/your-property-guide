import type { ReactNode } from "react";
import { Footprints, Bus, Bike } from "lucide-react";

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

function scoreColour(score: number): { text: string; bar: string } {
  if (score >= 70) return { text: "text-success", bar: "bg-success" };
  if (score >= 40) return { text: "text-warning", bar: "bg-warning" };
  return              { text: "text-danger",  bar: "bg-danger" };
}

function ScoreBar({ label, score, icon }: ScoreConfig) {
  const colours = score !== null ? scoreColour(score) : null;

  return (
    <div className="bg-surface-raised rounded-2xl border border-line p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-ink-muted">
        {icon}
        <span className="text-xs font-sans uppercase tracking-wider text-ink-subtle">{label}</span>
      </div>

      {score !== null && colours ? (
        <>
          <p className={`font-display text-4xl leading-none ${colours.text}`}>{score}</p>
          <div className="h-1.5 w-full rounded-full bg-surface-warm overflow-hidden">
            <div
              className={`h-full rounded-full ${colours.bar}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </>
      ) : (
        <p className="font-display text-3xl text-ink-subtle">–</p>
      )}
    </div>
  );
}

export function SuburbWalkability({ walkScore, transitScore, bikeScore }: SuburbWalkabilityProps) {
  if (walkScore === null && transitScore === null && bikeScore === null) {
    return (
      <p className="text-sm font-sans text-ink-muted italic py-2">
        Walkability data not yet available for this suburb.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ScoreBar
          label="Walk Score"
          score={walkScore}
          icon={<Footprints className="w-5 h-5" />}
        />
        <ScoreBar
          label="Transit Score"
          score={transitScore}
          icon={<Bus className="w-5 h-5" />}
        />
        <ScoreBar
          label="Bike Score"
          score={bikeScore}
          icon={<Bike className="w-5 h-5" />}
        />
      </div>
      <p className="text-xs font-sans text-ink-subtle">
        Scores calculated from OpenStreetMap data (ODbL)
      </p>
    </div>
  );
}
