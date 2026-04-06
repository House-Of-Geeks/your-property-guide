import { db } from "@/lib/db";
import type { Agent, Agency } from "@/generated/prisma/client";

export type Role = "agent" | "agency_admin" | "admin";

export interface AgentContext {
  agent: Agent;
  agency: Agency;
  role: Role;
}

/**
 * Returns the agent + agency context for a given email, plus the role
 * from the User table. Throws if the email has no agent profile or agency.
 */
export async function getAgentContext(email: string): Promise<AgentContext> {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const agent = await db.agent.findUnique({ where: { email } });
  if (!agent) throw new Error("No agent profile linked to this email");

  const agency = await db.agency.findUnique({ where: { id: agent.agencyId } });
  if (!agency) throw new Error("No agency found for this agent");

  return { agent, agency, role: (user.role as Role) ?? "agent" };
}

/**
 * Like getAgentContext but throws a 403-style error if the caller is not
 * agency_admin or admin.
 */
export async function requireAgencyAdmin(
  email: string
): Promise<{ agent: Agent; agency: Agency }> {
  const { agent, agency, role } = await getAgentContext(email);
  if (role !== "agency_admin" && role !== "admin") {
    throw new Error("Forbidden: agency admin or admin role required");
  }
  return { agent, agency };
}
