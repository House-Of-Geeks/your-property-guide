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
    <span className="px-2 py-0.5 rounded text-xs font-sans font-medium bg-ink-muted text-white">
      {label}
    </span>
  );
}

function YearBadge({ yearRange }: { yearRange: string }) {
  return (
    <span className="px-2 py-0.5 rounded text-xs font-sans font-semibold bg-ink text-white">
      {yearRange}
    </span>
  );
}

function GenderBadge({ gender }: { gender: School["gender"] }) {
  if (!gender || gender === "coed") {
    return <span className="px-2 py-0.5 rounded text-xs font-sans font-semibold bg-success text-white">CoEd</span>;
  }
  return <span className="px-2 py-0.5 rounded text-xs font-sans font-semibold bg-info text-white">{gender === "girls" ? "Girls" : "Boys"}</span>;
}

function SchoolRow({ school }: { school: School }) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-line last:border-0">
      <div>
        <p className="font-display text-base text-ink leading-tight">{school.name}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {school.yearRange && <YearBadge yearRange={school.yearRange} />}
          <GenderBadge gender={school.gender} />
          <SectorBadge sector={school.sector} />
        </div>
      </div>
      {school.acaraId && (
        <a
          href={`/schools/${makeSchoolSlug(school.name, school.acaraId)}`}
          className="ml-4 flex-shrink-0 px-4 py-1.5 text-sm font-sans font-medium border border-line-strong rounded-lg text-ink hover:border-ink hover:bg-surface-warm transition-colors"
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
        <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">{label}</p>
      )}
      <div>
        {shown.map((school) => (
          <SchoolRow key={school.name} school={school} />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-3 flex items-center gap-1.5 text-sm font-sans font-medium text-cta hover:text-cta-hover transition-colors"
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

  // Gov first, then others, same order as Domain
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
      <h2 className="font-display text-2xl text-ink leading-tight mb-1">Local schools for {suburbName}</h2>
      <p className="text-sm font-sans text-ink-muted mb-5">View the catchment for each school to find out more.</p>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-line mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setExpanded(false); }}
            className={`px-4 py-2.5 text-sm font-sans font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-cta text-ink"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {ordered.length === 0 ? (
        <p className="text-sm font-sans text-ink-muted italic">No schools found for this filter.</p>
      ) : (
        <div>
          {govCount > 0 && (
            <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
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
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mt-5 mb-2">
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
              className="mt-4 flex items-center gap-1.5 text-sm font-sans font-medium text-cta hover:text-cta-hover transition-colors"
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

      <p className="text-xs font-sans text-ink-subtle mt-6">© ACARA, licensed under CC BY 4.0.</p>
    </div>
  );
}
