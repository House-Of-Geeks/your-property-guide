import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getAgentContext } from "@/lib/auth/permissions";
import { ListingCreateForm } from "@/components/dashboard/ListingCreateForm";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "New Listing" };

export default async function NewListingPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/dashboard/login");

  const { agent, agency, role } = await getAgentContext(session.user.email);
  const isAdmin = role === "agency_admin" || role === "admin";

  // Only agency_admin and admin can create listings
  if (!isAdmin) redirect("/dashboard/listings");

  const agencyAgents = await db.agent.findMany({
    where: { agencyId: agency.id },
    select: { id: true, fullName: true },
    orderBy: { lastName: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/listings"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Listings
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New Listing</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new property listing for {agency.name}.</p>
      </div>

      <div className="rounded-xl bg-white shadow-card border border-gray-100 p-6">
        <ListingCreateForm
          agents={agencyAgents}
          agencyId={agency.id}
          currentAgentId={agent.id}
        />
      </div>
    </div>
  );
}
