"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { School as FullSchool } from "@/types";
import { makeSchoolSlug } from "@/lib/utils/school";

// Only the fields this list draws. The page passes these and nothing else, so
// the other School fields (website, ICSEA, enrolment, distance) are not
// serialized into the HTML and the RSC payload of every suburb page.
export type School = Pick<FullSchool, "name" | "type" | "sector" | "yearRange" | "gender" | "acaraId">;

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

// One quiet chip style for every attribute (brand v4: colour is for actions
// and state, and a school's sector or gender is neither).
const CHIP = "px-1.5 py-0.5 rounded border border-line text-xs font-sans text-ink-muted";

function SectorBadge({ sector }: { sector: School["sector"] }) {
  const label = sector === "government" ? "Government" : sector === "catholic" ? "Catholic" : "Independent";
  return <span className={CHIP}>{label}</span>;
}

function YearBadge({ yearRange }: { yearRange: string }) {
  return <span className={`${CHIP} font-semibold text-ink`}>{yearRange}</span>;
}

function GenderBadge({ gender }: { gender: School["gender"] }) {
  if (!gender || gender === "coed") {
    return <span className={CHIP}>Co-ed</span>;
  }
  return <span className={CHIP}>{gender === "girls" ? "Girls" : "Boys"}</span>;
}

function SchoolRow({ school }: { school: School }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-line last:border-0">
      <div className="min-w-0">
        <p className="font-sans text-base font-semibold text-ink leading-snug">{school.name}</p>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {school.yearRange && <YearBadge yearRange={school.yearRange} />}
          <GenderBadge gender={school.gender} />
          <SectorBadge sector={school.sector} />
        </div>
      </div>
      {school.acaraId && (
        <a
          href={`/schools/${makeSchoolSlug(school.name, school.acaraId)}`}
          className="flex-shrink-0 text-sm font-sans font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
        >
          Catchment
        </a>
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
      <p className="text-[15px] font-sans text-ink-muted mb-4">
        {`Schools serving ${suburbName}: government first, then Catholic and independent.`}
      </p>

      {/* Tabs. At px-4 the four need 310px and a 320px screen offers 288px,
          so the row ran 6px past the edge of the page. Under 22rem (352px)
          they take px-3 and need 278px. */}
      <div className="flex gap-0 border-b border-line mb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={activeTab === tab.id}
            onClick={() => { setActiveTab(tab.id); setExpanded(false); }}
            className={`px-4 max-[22rem]:px-3 py-2.5 text-sm font-sans font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-ink text-ink"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {ordered.length === 0 ? (
        <p className="text-sm font-sans text-ink-muted">No schools found for this filter.</p>
      ) : (
        <div>
          {govCount > 0 && (
            <p className="text-[13px] font-sans text-ink-subtle mt-3">
              Government schools
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
                <p className="text-[13px] font-sans text-ink-subtle mt-4">
                  Non-government schools
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
              aria-expanded={expanded}
              className="mt-3 flex items-center gap-1.5 text-sm font-sans font-semibold text-ink hover:text-primary transition-colors cursor-pointer"
            >
              {expanded ? (
                <><ChevronUp className="w-4 h-4" aria-hidden="true" /> Show fewer</>
              ) : (
                <><ChevronDown className="w-4 h-4" aria-hidden="true" /> Show {ordered.length - INITIAL_VISIBLE} more</>
              )}
            </button>
          )}
        </div>
      )}

      <p className="text-xs font-sans text-ink-subtle mt-4">© ACARA, licensed under CC BY 4.0.</p>
    </div>
  );
}
