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
    { value: `${(suburbs / 1000).toFixed(0)}k+`, label: "suburbs profiled" },
    { value: `${(schools / 1000).toFixed(1)}k+`, label: "schools tracked" },
    { value: listingsLabel, label: "active listings" },
    { value: "Free", label: "no signup required" },
  ];

  return (
    <div className="bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-sm text-white/70 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
