import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { ExternalLink, Users } from "lucide-react";

export const metadata: Metadata = { title: "All Agencies" };

export default async function AdminAgenciesPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/dashboard/login");
  if ((session.user as any).role !== "admin") redirect("/dashboard/profile");

  const agencies = await db.agency.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { agents: true, properties: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">All Agencies</h1>

      <div className="rounded-xl bg-white shadow-card border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Agency</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Location</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600">Agents</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600">Listings</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {agencies.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-8 flex-shrink-0 rounded border border-gray-100 overflow-hidden bg-white">
                      <Image src={a.logo} alt={a.name} fill className="object-contain p-0.5" sizes="40px" />
                    </div>
                    <span className="font-medium text-gray-900">{a.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{a.addressSuburb}, {a.addressState}</td>
                <td className="px-4 py-3 text-center text-gray-700">{a._count.agents}</td>
                <td className="px-4 py-3 text-center text-gray-700">{a._count.properties}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/real-estate-agencies/${a.slug}`}
                      target="_blank"
                      className="text-xs text-gray-400 hover:text-primary flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/dashboard/admin/agencies/${a.id}`}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Manage
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
