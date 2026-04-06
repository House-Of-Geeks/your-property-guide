import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { requireAgencyAdmin } from "@/lib/auth/permissions";
import { TeamAgentForm } from "@/components/dashboard/TeamAgentForm";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const metadata: Metadata = { title: "Edit Team Member" };

export default async function TeamAgentEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect("/dashboard/login");

  const { agency } = await requireAgencyAdmin(session.user.email).catch(() => {
    redirect("/dashboard/profile");
    return Promise.reject();
  });

  const agent = await db.agent.findUnique({ where: { id } });
  if (!agent) notFound();

  // Guard: agent must belong to this agency
  if (agent.agencyId !== agency.id) redirect("/dashboard/team");

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link
            href="/dashboard/team"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Team
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-200 shrink-0">
              <Image src={agent.image} alt={agent.imageAlt ?? agent.fullName} fill className="object-cover" sizes="56px" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{agent.fullName}</h1>
              <p className="text-sm text-gray-500">{agent.title}</p>
            </div>
          </div>
        </div>
        <Link
          href={`/agents/${agent.slug}`}
          target="_blank"
          className="flex items-center gap-1.5 text-sm text-primary hover:underline shrink-0"
        >
          View public profile <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="rounded-xl bg-white shadow-card border border-gray-100 p-6">
        <TeamAgentForm agent={agent} />
      </div>
    </div>
  );
}
