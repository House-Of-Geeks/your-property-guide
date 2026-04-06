import { db } from "@/lib/db";
import type { Agent, Agency } from "@/generated/prisma/client";

export type Role = "agent" | "agency_admin" | "admin";

export interface AgentContext {
  agent: Agent;
  agency: Agency;
  role: Role;
}

export interface AdminContext {
  role: "admin";
  agent: Agent | null;
  agency: Agency | null;
}

/** Returns the role for any logged-in user. Never throws. */
export async function getUserRole(email: string): Promise<Role> {
  const user = await db.user.findUnique({ where: { email }, select: { role: true } });
  return (user?.role as Role) ?? "agent";
}

/**
 * Returns agent + agency + role for a given email.
 * Throws if no agent profile or no agency exists.
 * For pure admins with no agent profile, use getAdminContext instead.
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
 * For admin users who may not have an agent profile.
 * Throws if user is not admin.
 */
export async function getAdminContext(email: string): Promise<AdminContext> {
  const role = await getUserRole(email);
  if (role !== "admin") throw new Error("Forbidden: admin role required");

  const agent = await db.agent.findUnique({ where: { email } }).catch(() => null);
  const agency = agent ? await db.agency.findUnique({ where: { id: agent.agencyId } }).catch(() => null) : null;

  return { role: "admin", agent: agent ?? null, agency: agency ?? null };
}

/**
 * Like getAgentContext but throws if not agency_admin or admin.
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
