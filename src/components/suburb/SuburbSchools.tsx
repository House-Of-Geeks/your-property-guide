"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { School } from "@/types";
import { makeSchoolSlug } from "@/lib/utils/school";

interface SuburbSchoolsProps {
  suburbName: string;
  schools: School[];
}

type TabId = "all" | "primary" | "secondary" | "private";

const TABS: { id: TabId; label: string }[] = [
  { id: "all",       label: "All"       },
  { id: "primary",   label: "Primary"   },
  { id: "secondary", label: "Secondary" },
  { id: "private",   label: "Private"   },
];

const INITIAL_VISIBLE = 3;

function filterSchools(schools: School[], tab: TabId): School[] {
  if (tab === "primary")   return schools.filter((s) => s.type === "primary");
  if (tab === "secondary") return schools.filter((s) => s.type === "secondary" || s.type === "combined");
  if (tab === "private")   return schools.filter((s) => s.sector === "catholic" || s.sector === "independent");
  return schools;
}

function SectorBadge({ sector }: { sector: School["sector"] }) {
  const label = sector === "government" ? "Government" : sector === "catholic" ? "Catholic" : "Independent";
  return (
    <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-500 text-white">
      {label}
    </span>
  );
}

function YearBadge({ yearRange }: { yearRange: string }) {
  return (
    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-800 text-white">
      {yearRange}
    </span>
  );
}

function GenderBadge({ gender }: { gender: School["gender"] }) {
  if (!gender || gender === "coed") {
    return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-600 text-white">CoEd</span>;
  }
  return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-600 text-white">{gender === "girls" ? "Girls" : "Boys"}</span>;
}

function SchoolRow({ school }: { school: School }) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-gray-100 last:border-0">
      <div>
        <p className="font-semibold text-gray-900">{school.name}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {school.yearRange && <YearBadge yearRange={school.yearRange} />}
          <GenderBadge gender={school.gender} />
          <SectorBadge sector={school.sector} />
        </div>
      </div>
      {school.acaraId && (
        <a
          href={`/schools/${makeSchoolSlug(school.name, school.acaraId)}`}
          className="ml-4 flex-shrink-0 px-4 py-1.5 text-sm font-medium border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View Catchment
        </a>
      )}
    </div>
  );
}

function SchoolGroup({ schools, label }: { schools: School[]; label?: string }) {
  const [expanded, setExpanded] = useState(false);

  if (schools.length === 0) return null;

  const shown = expanded ? schools : schools.slice(0, INITIAL_VISIBLE);
  const hasMore = schools.length > INITIAL_VISIBLE;

  return (
    <div className="mb-6">
      {label && (
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      )}
      <div>
        {shown.map((school) => (
          <SchoolRow key={school.name} school={school} />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          {expanded ? (
            <><ChevronUp className="w-4 h-4" /> View less</>
          ) : (
            <><ChevronDown className="w-4 h-4" /> View more</>
          )}
        </button>
      )}
    </div>
  );
}

export function SuburbSchools({ suburbName, schools }: SuburbSchoolsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [expanded, setExpanded] = useState(false);

  if (schools.length === 0) return null;

  // Gov first, then others — same order as Domain
  const filtered     = filterSchools(schools, activeTab);
  const govSchools   = filtered.filter((s) => s.sector === "government");
  const otherSchools = filtered.filter((s) => s.sector !== "government");
  const ordered      = [...govSchools, ...otherSchools];
  const shown        = expanded ? ordered : ordered.slice(0, INITIAL_VISIBLE);
  const hasMore      = ordered.length > INITIAL_VISIBLE;

  // Find where gov→other boundary falls within the shown slice (for label insertion)
  const govCount = Math.min(govSchools.length, shown.length);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Local schools for {suburbName}</h2>
      <p className="text-sm text-gray-500 mb-5">View the catchment for each school to find out more.</p>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setExpanded(false); }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {ordered.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No schools found for this filter.</p>
      ) : (
        <div>
          {govCount > 0 && (
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
              Government School Catchment
            </p>
          )}
          <div>
            {shown.slice(0, govCount).map((school) => (
              <SchoolRow key={school.name} school={school} />
            ))}
          </div>

          {shown.length > govCount && (
            <>
              {govCount > 0 && (
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-4 mb-1">
                  Non-Government Schools
                </p>
              )}
              <div>
                {shown.slice(govCount).map((school) => (
                  <SchoolRow key={school.name} school={school} />
                ))}
              </div>
            </>
          )}

          {hasMore && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {expanded ? (
                <><ChevronUp className="w-4 h-4" /> View less</>
              ) : (
                <><ChevronDown className="w-4 h-4" /> View more</>
              )}
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-6">© ACARA, licensed under CC BY 4.0.</p>
    </div>
  );
}
