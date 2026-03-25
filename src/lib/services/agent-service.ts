import type { Agent, Agency } from "@/types";

async function loadAgents(): Promise<Agent[]> {
  const { agents } = await import("@/lib/data/agents");
  return agents;
}

async function loadAgencies(): Promise<Agency[]> {
  const { agencies } = await import("@/lib/data/agencies");
  return agencies;
}

export async function getAgents(): Promise<Agent[]> {
  return loadAgents();
}

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  const agents = await loadAgents();
  return agents.find((a) => a.slug === slug) ?? null;
}

export async function getAgentById(id: string): Promise<Agent | null> {
  const agents = await loadAgents();
  return agents.find((a) => a.id === id) ?? null;
}

export async function getFeaturedAgents(): Promise<Agent[]> {
  const agents = await loadAgents();
  return agents.filter((a) => a.isFeatured);
}

export async function getAgentsByAgency(agencyId: string): Promise<Agent[]> {
  const agents = await loadAgents();
  return agents.filter((a) => a.agencyId === agencyId);
}

export async function getAgencies(): Promise<Agency[]> {
  return loadAgencies();
}

export async function getAgencyBySlug(slug: string): Promise<Agency | null> {
  const agencies = await loadAgencies();
  return agencies.find((a) => a.slug === slug) ?? null;
}

export async function getAgencyById(id: string): Promise<Agency | null> {
  const agencies = await loadAgencies();
  return agencies.find((a) => a.id === id) ?? null;
}

export async function getAllAgentSlugs(): Promise<string[]> {
  const agents = await loadAgents();
  return agents.map((a) => a.slug);
}

export async function getAllAgencySlugs(): Promise<string[]> {
  const agencies = await loadAgencies();
  return agencies.map((a) => a.slug);
}
