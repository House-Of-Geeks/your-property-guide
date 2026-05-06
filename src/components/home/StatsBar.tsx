import Image from "next/image";
import { db } from "@/lib/db";

async function getStats() {
  const [suburbs, schools, listings] = await Promise.all([
    db.suburb.count(),
    db.school.count(),
    db.property.count({ where: { status: "active" } }),
  ]);
  return { suburbs, schools, listings };
}

export async function StatsBar() {
  const { suburbs, schools, listings } = await getStats();

  const listingsLabel = listings >= 1000
    ? `${(listings / 1000).toFixed(1)}k+`
    : `${listings}+`;

  const stats = [
    { value: `${(suburbs / 1000).toFixed(0)}k+`, label: "suburbs profiled", icon: "/images/icons/map.svg" },
    { value: `${(schools / 1000).toFixed(1)}k+`, label: "schools tracked",  icon: "/images/icons/schools.svg" },
    { value: listingsLabel,                       label: "active listings", icon: "/images/icons/median.svg" },
    { value: "Free",                              label: "no signup required", icon: "/images/icons/yield.svg" },
  ];

  return (
    <section className="bg-surface-raised border-y border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6">
          {stats.map(({ value, label, icon }) => (
            <div key={label} className="flex items-start gap-3">
              <Image src={icon} alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">{value}</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
