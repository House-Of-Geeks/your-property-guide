import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Home, User, Building2, LogOut } from "lucide-react";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Your Property Guide" },
  robots: { index: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // login and verify pages render without the shell
  if (!session) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/" className="text-sm font-bold text-primary">Your Property Guide</Link>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{session.user?.email}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink href="/dashboard/profile" icon={<User className="w-4 h-4" />} label="My Profile" />
          <NavLink href="/dashboard/agency" icon={<Building2 className="w-4 h-4" />} label="Agency" />
          <NavLink href="/" icon={<Home className="w-4 h-4" />} label="View Site" />
        </nav>
        <div className="px-3 py-4 border-t border-gray-100">
          <form action="/api/auth/signout" method="POST">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-10">{children}</div>
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
