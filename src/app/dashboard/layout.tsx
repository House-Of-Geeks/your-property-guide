import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Home, User, Building2, LogOut, List, Users, ShieldCheck } from "lucide-react";
import { signOut } from "@/auth";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Your Property Guide" },
  robots: { index: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // login and verify pages render without the shell
  if (!session) return <>{children}</>;

  const role = (session.user as any).role as string | undefined;
  const isAdmin = role === "agency_admin" || role === "admin";
  const isSuperAdmin = role === "admin";

  const roleBadgeLabel =
    role === "admin" ? "Admin" :
    role === "agency_admin" ? "Agency Admin" :
    "Agent";

  const roleBadgeClass =
    role === "admin" ? "bg-purple-100 text-purple-700" :
    role === "agency_admin" ? "bg-blue-100 text-blue-700" :
    "bg-gray-100 text-gray-600";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/" className="text-sm font-bold text-primary">Your Property Guide</Link>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{session.user?.email}</p>
          <span className={`inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${roleBadgeClass}`}>
            {roleBadgeLabel}
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink href="/dashboard/profile" icon={<User className="w-4 h-4" />} label="My Profile" />
          <NavLink
            href="/dashboard/listings"
            icon={<List className="w-4 h-4" />}
            label={isAdmin ? "All Listings" : "My Listings"}
          />
          {isAdmin && (
            <>
              <NavLink href="/dashboard/agency" icon={<Building2 className="w-4 h-4" />} label="Agency Profile" />
              <NavLink href="/dashboard/team" icon={<Users className="w-4 h-4" />} label="Our Team" />
            </>
          )}
          {isSuperAdmin && (
            <div className="pt-2 mt-2 border-t border-gray-100">
              <p className="px-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin</p>
              <NavLink href="/dashboard/admin" icon={<ShieldCheck className="w-4 h-4" />} label="Site Overview" />
              <NavLink href="/dashboard/admin/agencies" icon={<Building2 className="w-4 h-4" />} label="All Agencies" />
              <NavLink href="/dashboard/admin/users" icon={<Users className="w-4 h-4" />} label="Users & Roles" />
            </div>
          )}
          <NavLink href="/" icon={<Home className="w-4 h-4" />} label="View Site" />
        </nav>
        <div className="px-3 py-4 border-t border-gray-100">
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/dashboard/login" });
          }}>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-10">{children}</div>
      </main>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}
