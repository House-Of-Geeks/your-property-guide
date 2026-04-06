import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getAgentContext } from "@/lib/auth/permissions";
import { PlusIcon } from "lucide-react";

export const metadata: Metadata = { title: "Listings" };

const STATUS_BADGE: Record<string, string> = {
  "active":          "bg-green-100 text-green-700",
  "under-contract":  "bg-amber-100 text-amber-700",
  "sold":            "bg-gray-100 text-gray-600",
  "off-market":      "bg-gray-100 text-gray-600",
};

export default async function ListingsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/dashboard/login");

  const { agent, agency, role } = await getAgentContext(session.user.email);
  const isAdmin = role === "agency_admin" || role === "admin";

  const properties = await db.property.findMany({
    where: isAdmin
      ? { agencyId: agency.id }
      : { agentId: agent.id },
    orderBy: { dateAdded: "desc" },
    select: {
      id: true,
      slug: true,
      addressFull: true,
      propertyType: true,
      status: true,
      priceDisplay: true,
      dateAdded: true,
      listingType: true,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin ? "All Listings" : "My Listings"}
        </h1>
        {isAdmin && (
          <Link
            href="/dashboard/listings/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Listing
          </Link>
        )}
      </div>

      {properties.length === 0 ? (
        <div className="rounded-xl bg-white shadow-card border border-gray-100 p-12 text-center">
          <p className="text-gray-500 text-sm">No listings found.</p>
          {isAdmin && (
            <Link
              href="/dashboard/listings/new"
              className="mt-4 inline-block px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90"
            >
              Create your first listing
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-white shadow-card border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Price</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date Added</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-900 font-medium max-w-[200px] truncate">{p.addressFull}</td>
                  <td className="px-4 py-3 text-gray-500 capitalize hidden sm:table-cell">{p.propertyType}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[p.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {p.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.priceDisplay}</td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">
                    {new Date(p.dateAdded).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/listings/${p.id}`}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
