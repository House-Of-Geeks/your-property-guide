import Link from "next/link";
import { GraduationCap, ArrowRight, CheckCircle } from "lucide-react";

const POINTS = [
  "9,600+ schools with ACARA enrolment data",
  "NAPLAN results linked via MySchool",
  "Nearby properties for sale and rent",
  "Government, Catholic and independent schools",
];

export function SchoolFinderCallout() {
  return (
    <section className="py-20 bg-black overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Text side */}
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-sm font-medium px-3 py-1.5 rounded-full mb-5">
              <GraduationCap className="w-4 h-4" />
              School catchment research
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Find homes near<br className="hidden sm:block" /> the right school
            </h2>
            <p className="text-white/60 mt-4 text-lg leading-relaxed">
              School catchment boundaries matter. Research any school in Australia, view enrolment statistics, and browse properties within the catchment zone. All in one place.
            </p>
            <ul className="mt-6 space-y-3">
              {POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-white/70">
                  <CheckCircle className="w-4 h-4 text-white mt-0.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/schools"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Browse all schools <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Visual card */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">

              {/* Card header */}
              <div className="bg-black px-6 py-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm leading-tight">St Luke's Catholic College</p>
                  <p className="text-white/70 text-xs mt-0.5">Capalaba, QLD</p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {["Catholic", "Secondary", "Co-ed", "Yr 7–12"].map((tag) => (
                    <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: "Students", value: "1,240" },
                    { label: "Teaching staff", value: "98" },
                    { label: "Year range", value: "7–12" },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-base font-bold text-gray-900">{value}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Nearby listings */}
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs font-medium text-gray-400 mb-2.5 uppercase tracking-wide">Nearby properties</p>
                  <div className="space-y-2">
                    {[
                      { address: "12 Redland Bay Rd, Capalaba", detail: "3 bed · 2 bath · $720k" },
                      { address: "8 Windemere St, Alexandra Hills", detail: "4 bed · 2 bath · $795k" },
                    ].map((item) => (
                      <div key={item.address} className="flex items-start gap-2.5 bg-gray-50 rounded-xl px-3.5 py-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-800 leading-tight">{item.address}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
