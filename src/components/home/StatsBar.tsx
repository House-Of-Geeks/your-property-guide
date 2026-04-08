import { db } from "@/lib/db";

async function getStats() {
  const [suburbs, schools] = await Promise.all([
    db.suburb.count(),
    db.school.count(),
  ]);
  return { suburbs, schools };
}

export async function StatsBar() {
  const { suburbs, schools } = await getStats();

  const stats = [
    { value: `${(suburbs / 1000).toFixed(0)}k+`, label: "suburbs profiled" },
    { value: `${(schools / 1000).toFixed(1)}k+`, label: "schools tracked" },
    { value: "10+", label: "data points per suburb" },
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
