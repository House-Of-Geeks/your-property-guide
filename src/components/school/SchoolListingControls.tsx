"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LayoutList, Map, Calendar, ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "",            label: "Featured" },
  { value: "newest",      label: "Newest" },
  { value: "price-asc",   label: "Lowest price" },
  { value: "price-desc",  label: "Highest price" },
];

interface Props {
  count: number;
  schoolName: string;
  currentSort: string;
}

export function SchoolListingControls({ count, schoolName, currentSort }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sortOpen, setSortOpen] = useState(false);
  const [activeView, setActiveView] = useState<"list" | "map" | "inspections">("list");

  const currentLabel = SORT_OPTIONS.find((o) => o.value === currentSort)?.label ?? "Featured";

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sort", value); else params.delete("sort");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setSortOpen(false);
  }

  return (
    <div className="mb-5">
      <p className="text-sm text-gray-600 mb-3">
        {count} {count === 1 ? "property" : "properties"} for sale near {schoolName}
      </p>

      {/* View tabs */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden w-fit mb-4">
        {([
          { key: "list",        label: "List view",           icon: <LayoutList className="w-4 h-4" /> },
          { key: "map",         label: "Map view",            icon: <Map className="w-4 h-4" /> },
          { key: "inspections", label: "Inspections / Auctions", icon: <Calendar className="w-4 h-4" /> },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveView(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-r border-gray-200 last:border-r-0 cursor-pointer ${
              activeView === tab.key
                ? "bg-primary/5 text-primary border-primary"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sort row */}
      <div className="flex items-center justify-between">
        <div /> {/* spacer — could add "Create alert" here later */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((o) => !o)}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            Sort by
            <span className="font-medium text-gray-900">{currentLabel}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSort(opt.value)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                    opt.value === currentSort
                      ? "bg-primary/5 text-primary font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
