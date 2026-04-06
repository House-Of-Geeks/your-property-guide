"use client";

import { useState } from "react";

type SchoolType = "all" | "primary" | "secondary" | "private" | "childcare";

interface School {
  id: string;
  name: string;
  type: string;
  sector: string;
  distance: number;
  yearRange?: string | null;
  icsea?: number | null;
}

const SECTOR_COLOURS: Record<string, string> = {
  government: "bg-blue-100 text-blue-700",
  catholic:   "bg-purple-100 text-purple-700",
  independent:"bg-orange-100 text-orange-700",
};

function sectorLabel(sector: string) {
  return sector.charAt(0).toUpperCase() + sector.slice(1);
}

export function PropertySchoolTabs({ schools }: { schools: School[] }) {
  const [tab, setTab] = useState<SchoolType>("all");

  const tabs: { key: SchoolType; label: string }[] = [
    { key: "all",       label: "All" },
    { key: "primary",   label: "Primary" },
    { key: "secondary", label: "Secondary" },
    { key: "private",   label: "Private" },
    { key: "childcare", label: "Childcare" },
  ];

  const filtered = schools.filter((s) => {
    if (tab === "all") return true;
    if (tab === "private") return s.sector !== "government";
    if (tab === "childcare") return s.type === "childcare";
    return s.type === tab;
  });

  if (schools.length === 0) {
    return <p className="text-sm text-gray-500">No school data available for this suburb.</p>;
  }

  return (
    <div>
      <div className="flex gap-1 border-b border-gray-200 mb-4 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500">No {tab} schools nearby.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div key={s.id} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{s.name}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SECTOR_COLOURS[s.sector] ?? "bg-gray-100 text-gray-600"}`}>
                    {sectorLabel(s.sector)}
                  </span>
                  {s.yearRange && (
                    <span className="text-xs text-gray-500">{s.yearRange}</span>
                  )}
                  {s.icsea && (
                    <span className="text-xs text-gray-500">ICSEA {s.icsea}</span>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-500 flex-shrink-0">{s.distance.toFixed(1)} km</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
