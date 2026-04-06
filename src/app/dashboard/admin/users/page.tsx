import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { UserRoleSelect } from "@/components/dashboard/UserRoleSelect";

export const metadata: Metadata = { title: "Users & Roles" };

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/dashboard/login");
  if ((session.user as any).role !== "admin") redirect("/dashboard/profile");

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users & Roles</h1>
        <p className="text-sm text-gray-500 mt-1">
          Change a user's role to grant or restrict dashboard access.
        </p>
      </div>

      <div className="rounded-xl bg-white shadow-card border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Joined</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{u.email}</td>
                <td className="px-4 py-3 text-gray-500">{u.name ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(u.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <UserRoleSelect userId={u.id} currentRole={u.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
