import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { getAgentBySlug } from "@/lib/services/agent-service";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/dashboard/login");

  // Find agent by the logged-in email
  const row = await db.agent.findUnique({
    where: { email: session.user.email },
    select: { slug: true },
  });

  if (!row) {
    // Admins don't have agent profiles — send them to the admin overview
    if ((session.user as any).role === "admin") redirect("/dashboard/admin");

    return (
      <div className="text-center py-20">
        <h1 className="text-xl font-bold text-gray-900">No agent profile found</h1>
        <p className="text-sm text-gray-500 mt-2">
          Your email ({session.user.email}) isn't linked to an agent account.
          Contact support to get set up.
        </p>
      </div>
    );
  }

  const agent = await getAgentBySlug(row.slug);
  if (!agent) redirect("/dashboard/login");

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200 shrink-0">
            <Image src={agent.image} alt={agent.imageAlt ?? agent.fullName} fill className="object-cover" sizes="64px" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{agent.fullName}</h1>
            <p className="text-sm text-gray-500">{agent.title}{agent.agencyName ? ` · ${agent.agencyName}` : ""}</p>
          </div>
        </div>
        <Link
          href={`/agents/${agent.slug}`}
          target="_blank"
          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          View public profile <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <ProfileForm agent={agent} />
    </div>
  );
}
