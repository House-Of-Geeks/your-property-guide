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
  if (score >= 70) return { text: "text-green-600",  bar: "bg-green-500" };
  if (score >= 40) return { text: "text-amber-600",  bar: "bg-amber-500" };
  return              { text: "text-red-600",    bar: "bg-red-400" };
}

function ScoreBar({ label, score, icon }: ScoreConfig) {
  const colours = score !== null ? scoreColour(score) : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-gray-600">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>

      {score !== null && colours ? (
        <>
          <p className={`text-4xl font-bold leading-none ${colours.text}`}>{score}</p>
          <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${colours.bar}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </>
      ) : (
        <p className="text-2xl font-bold text-gray-300">–</p>
      )}
    </div>
  );
}

export function SuburbWalkability({ walkScore, transitScore, bikeScore }: SuburbWalkabilityProps) {
  if (walkScore === null && transitScore === null && bikeScore === null) {
    return (
      <p className="text-sm text-gray-500 italic py-2">
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
      <p className="text-xs text-gray-400">
        Scores calculated from OpenStreetMap data (ODbL)
      </p>
    </div>
  );
}
