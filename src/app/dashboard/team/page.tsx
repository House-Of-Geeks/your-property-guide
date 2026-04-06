import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAgencyAdmin } from "@/lib/auth/permissions";
import { Star } from "lucide-react";

export const metadata: Metadata = { title: "Our Team" };

export default async function TeamPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/dashboard/login");

  const { agency } = await requireAgencyAdmin(session.user.email).catch(() => {
    redirect("/dashboard/profile");
    // Unreachable but satisfies TS
    return Promise.reject();
  });

  const agents = await db.agent.findMany({
    where: { agencyId: agency.id },
    orderBy: { lastName: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Our Team</h1>
          <p className="text-sm text-gray-500 mt-1">{agents.length} agent{agents.length !== 1 ? "s" : ""} at {agency.name}</p>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-card border border-gray-100 overflow-hidden">
        {agents.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">No agents found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Featured</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{agent.fullName}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{agent.title}</td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{agent.email}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {agent.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        <Star className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/team/${agent.id}`}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
