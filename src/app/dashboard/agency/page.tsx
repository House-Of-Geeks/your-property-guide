import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { AgencyForm } from "@/components/dashboard/AgencyForm";
import { getAgencyBySlug, getAgentBySlug } from "@/lib/services/agent-service";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = { title: "Agency Profile" };

export default async function AgencyDashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/dashboard/login");

  const agentRow = await db.agent.findUnique({
    where: { email: session.user.email },
    select: { slug: true, agencyId: true },
  });

  if (!agentRow) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No agent profile linked to this account.</p>
      </div>
    );
  }

  const agencyRow = await db.agency.findUnique({
    where: { id: agentRow.agencyId },
    select: { slug: true },
  });

  if (!agencyRow) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No agency linked to your profile.</p>
      </div>
    );
  }

  const agency = await getAgencyBySlug(agencyRow.slug);
  if (!agency) redirect("/dashboard/profile");

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-12 rounded border border-gray-200 overflow-hidden shrink-0 bg-white p-1">
            <Image src={agency.logo} alt={agency.name} fill className="object-contain" sizes="64px" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{agency.name}</h1>
            <p className="text-sm text-gray-500">{agency.address.full}</p>
          </div>
        </div>
        <Link
          href={`/agencies/${agency.slug}`}
          target="_blank"
          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          View public profile <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <AgencyForm agency={agency} />
    </div>
  );
}
