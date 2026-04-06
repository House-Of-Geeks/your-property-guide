import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getAgentContext } from "@/lib/auth/permissions";
import { ListingEditForm } from "@/components/dashboard/ListingEditForm";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const metadata: Metadata = { title: "Edit Listing" };

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect("/dashboard/login");

  const { agent, agency, role } = await getAgentContext(session.user.email);
  const isAdmin = role === "agency_admin" || role === "admin";

  const property = await db.property.findUnique({ where: { id } });
  if (!property) notFound();

  // Permission: agent can only access own listings; admin can access agency listings
  if (!isAdmin && property.agentId !== agent.id) {
    redirect("/dashboard/listings");
  }
  if (isAdmin && property.agencyId !== agency.id) {
    redirect("/dashboard/listings");
  }

  // Load all agents in this agency for the co-agent dropdown
  const agencyAgents = await db.agent.findMany({
    where: { agencyId: agency.id },
    select: { id: true, fullName: true },
    orderBy: { lastName: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/dashboard/listings"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Listings
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 truncate max-w-lg">{property.addressFull}</h1>
        </div>
        <Link
          href={`/buy/${property.slug}`}
          target="_blank"
          className="flex items-center gap-1.5 text-sm text-primary hover:underline shrink-0"
        >
          View listing <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="rounded-xl bg-white shadow-card border border-gray-100 p-6">
        <ListingEditForm
          property={property}
          agents={agencyAgents}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}
