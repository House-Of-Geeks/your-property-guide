import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Building2, Users, Home, FileText, ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "Site Overview" };

export default async function AdminOverviewPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/dashboard/login");
  if ((session.user as any).role !== "admin") redirect("/dashboard/profile");

  const [agencyCount, agentCount, propertyCount, userCount] = await Promise.all([
    db.agency.count(),
    db.agent.count(),
    db.property.count({ where: { status: "active" } }),
    db.user.count(),
  ]);

  const recentListings = await db.property.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, addressFull: true, priceDisplay: true, status: true, agencyId: true, agency: { select: { name: true } } },
  });

  const recentUsers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-gray-900">Site Overview</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<Building2 className="w-5 h-5 text-primary" />} label="Agencies" value={agencyCount} href="/dashboard/admin/agencies" />
        <StatCard icon={<Users className="w-5 h-5 text-blue-500" />} label="Agents" value={agentCount} href="/dashboard/admin/users" />
        <StatCard icon={<Home className="w-5 h-5 text-green-500" />} label="Active Listings" value={propertyCount} href="/dashboard/listings" />
        <StatCard icon={<FileText className="w-5 h-5 text-amber-500" />} label="Registered Users" value={userCount} href="/dashboard/admin/users" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Recent listings */}
        <div className="rounded-xl bg-white shadow-card border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Recent Listings</h2>
          <div className="space-y-3">
            {recentListings.map((p) => (
              <div key={p.id} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.addressFull}</p>
                  <p className="text-xs text-gray-500">{p.agency?.name} · {p.priceDisplay}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent users */}
        <div className="rounded-xl bg-white shadow-card border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Recent Users</h2>
          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-2">
                <p className="text-sm text-gray-900 truncate">{u.email}</p>
                <RoleBadge role={u.role} />
              </div>
            ))}
          </div>
          <Link href="/dashboard/admin/users" className="block mt-4 text-xs text-primary hover:underline">
            Manage all users →
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: number; href: string }) {
  return (
    <Link href={href} className="rounded-xl bg-white shadow-card border border-gray-100 p-5 flex items-center gap-3 hover:shadow-card-hover transition-shadow">
      {icon}
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls = status === "active" ? "bg-green-100 text-green-700" : status === "under-contract" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600";
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${cls}`}>{status}</span>;
}

function RoleBadge({ role }: { role: string }) {
  const cls = role === "admin" ? "bg-purple-100 text-purple-700" : role === "agency_admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600";
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${cls}`}>{role}</span>;
}
