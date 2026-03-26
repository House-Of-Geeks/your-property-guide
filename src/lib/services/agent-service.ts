import type { Agent, Agency } from "@/types";
import { db } from "@/lib/db";
import type { Agent as DbAgent, Agency as DbAgency } from "@/generated/prisma";

function toAgent(a: DbAgent): Agent {
  return {
    id: a.id,
    slug: a.slug,
    firstName: a.firstName,
    lastName: a.lastName,
    fullName: a.fullName,
    title: a.title,
    phone: a.phone,
    email: a.email,
    bio: a.bio,
    image: a.image,
    agencyId: a.agencyId,
    suburbs: a.suburbs,
    specialties: a.specialties,
    yearsExperience: a.yearsExperience,
    propertiesSold: a.propertiesSold,
    reviewCount: a.reviewCount,
    averageRating: a.averageRating,
    isFeatured: a.isFeatured,
  };
}

function toAgency(a: DbAgency): Agency {
  return {
    id: a.id,
    slug: a.slug,
    name: a.name,
    logo: a.logo,
    description: a.description,
    phone: a.phone,
    email: a.email,
    website: a.website,
    address: {
      street: a.addressStreet,
      suburb: a.addressSuburb,
      state: a.addressState,
      postcode: a.addressPostcode,
      full: a.addressFull,
    },
    suburbs: a.suburbs,
    agentIds: [],
    primaryColor: a.primaryColor ?? undefined,
  };
}

export async function getAgents(): Promise<Agent[]> {
  const rows = await db.agent.findMany({ orderBy: { lastName: "asc" } });
  return rows.map(toAgent);
}

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  const row = await db.agent.findUnique({ where: { slug } });
  return row ? toAgent(row) : null;
}

export async function getAgentById(id: string): Promise<Agent | null> {
  const row = await db.agent.findUnique({ where: { id } });
  return row ? toAgent(row) : null;
}

export async function getFeaturedAgents(): Promise<Agent[]> {
  const rows = await db.agent.findMany({ where: { isFeatured: true } });
  return rows.map(toAgent);
}

export async function getAgentsByAgency(agencyId: string): Promise<Agent[]> {
  const rows = await db.agent.findMany({ where: { agencyId } });
  return rows.map(toAgent);
}

export async function getAgencies(): Promise<Agency[]> {
  const rows = await db.agency.findMany({ orderBy: { name: "asc" } });
  return rows.map(toAgency);
}

export async function getAgencyBySlug(slug: string): Promise<Agency | null> {
  const row = await db.agency.findUnique({ where: { slug } });
  return row ? toAgency(row) : null;
}

export async function getAgencyById(id: string): Promise<Agency | null> {
  const row = await db.agency.findUnique({ where: { id } });
  return row ? toAgency(row) : null;
}

export async function getAllAgentSlugs(): Promise<string[]> {
  const rows = await db.agent.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}

export async function getAllAgencySlugs(): Promise<string[]> {
  const rows = await db.agency.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}
