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

  // Role badges aligned to the warm-cream brand: primary terracotta tints for
  // the super-admin and agency-admin roles, neutral warm for plain agents.
  const roleBadgeClass =
    role === "admin"        ? "bg-primary/10 text-primary" :
    role === "agency_admin" ? "bg-cta/10 text-cta-hover" :
                              "bg-surface-warm-sunken text-ink-muted border border-line-warm";

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-56 bg-surface-raised border-r border-line flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-line">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="inline-flex w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            <span className="font-display text-ink text-base tracking-tight leading-none">Your Property Guide</span>
          </Link>
          <p className="text-xs text-ink-subtle mt-2 truncate">{session.user?.email}</p>
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
            <div className="pt-2 mt-2 border-t border-line">
              <p className="px-3 pb-1 text-xs font-semibold text-ink-subtle uppercase tracking-wider">Admin</p>
              <NavLink href="/dashboard/admin" icon={<ShieldCheck className="w-4 h-4" />} label="Site Overview" />
              <NavLink href="/dashboard/admin/agencies" icon={<Building2 className="w-4 h-4" />} label="All Agencies" />
              <NavLink href="/dashboard/admin/users" icon={<Users className="w-4 h-4" />} label="Users & Roles" />
            </div>
          )}
          <NavLink href="/" icon={<Home className="w-4 h-4" />} label="View Site" />
        </nav>
        <div className="px-3 py-4 border-t border-line">
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/dashboard/login" });
          }}>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-muted hover:text-ink rounded-lg hover:bg-surface-warm transition-colors">
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
      className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}
