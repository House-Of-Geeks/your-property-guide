"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAgentContext, requireAgencyAdmin } from "@/lib/auth/permissions";

async function getAgentBySession() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");
  const agent = await db.agent.findUnique({ where: { email: session.user.email } });
  if (!agent) throw new Error("No agent profile linked to this email");
  return agent;
}

async function getAgencyBySession() {
  const agent = await getAgentBySession();
  const agency = await db.agency.findUnique({ where: { id: agent.agencyId } });
  if (!agency) throw new Error("No agency found");
  return { agent, agency };
}

// ─── Agent profile ────────────────────────────────────────────────────────────

const profileSchema = z.object({
  firstName:       z.string().min(1),
  lastName:        z.string().min(1),
  title:           z.string().min(1),
  phone:           z.string().min(8),
  bio:             z.string(),
  yearsExperience: z.coerce.number().int().min(0),
  specialties:     z.string(), // comma-separated
  metaTitle:       z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  ogImage:         z.string().url().optional().or(z.literal("")),
  imageAlt:        z.string().max(120).optional(),
});

export async function updateAgentProfile(formData: FormData) {
  const agent = await getAgentBySession();

  const raw = Object.fromEntries(formData.entries());
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) return { error: "Invalid data", issues: parsed.error.flatten() };

  const { specialties, ogImage, ...rest } = parsed.data;

  await db.agent.update({
    where: { id: agent.id },
    data: {
      ...rest,
      fullName: `${rest.firstName} ${rest.lastName}`,
      specialties: specialties.split(",").map((s) => s.trim()).filter(Boolean),
      ogImage: ogImage || null,
    },
  });

  revalidatePath(`/agents/${agent.slug}`);
  revalidatePath("/agents");
  return { success: true };
}

// ─── Agency profile ───────────────────────────────────────────────────────────

const agencySchema = z.object({
  name:            z.string().min(1),
  phone:           z.string().min(8),
  email:           z.string().email(),
  website:         z.string().url().optional().or(z.literal("")),
  description:     z.string(),
  facebookUrl:     z.string().url().optional().or(z.literal("")),
  instagramUrl:    z.string().url().optional().or(z.literal("")),
  linkedinUrl:     z.string().url().optional().or(z.literal("")),
  youtubeUrl:      z.string().url().optional().or(z.literal("")),
  metaTitle:       z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  ogImage:         z.string().url().optional().or(z.literal("")),
});

export async function updateAgencyProfile(formData: FormData) {
  const { agency } = await getAgencyBySession();

  const raw = Object.fromEntries(formData.entries());
  const parsed = agencySchema.safeParse(raw);
  if (!parsed.success) return { error: "Invalid data", issues: parsed.error.flatten() };

  const { website, facebookUrl, instagramUrl, linkedinUrl, youtubeUrl, ogImage, ...rest } = parsed.data;

  await db.agency.update({
    where: { id: agency.id },
    data: {
      ...rest,
      website:      website      || undefined,
      facebookUrl:  facebookUrl  || undefined,
      instagramUrl: instagramUrl || undefined,
      linkedinUrl:  linkedinUrl  || undefined,
      youtubeUrl:   youtubeUrl   || undefined,
      ogImage:      ogImage      || undefined,
    },
  });

  revalidatePath(`/real-estate-agencies/${agency.slug}`);
  return { success: true };
}

// ─── Listings ─────────────────────────────────────────────────────────────────

const listingSchema = z.object({
  status:          z.enum(["active", "under-contract", "sold", "off-market"]),
  title:           z.string().min(1),
  priceDisplay:    z.string().min(1),
  priceValue:      z.coerce.number().int().optional().nullable(),
  propertyType:    z.enum(["house", "townhouse", "apartment", "unit", "land", "acreage", "villa"]),
  bedrooms:        z.coerce.number().int().min(0),
  bathrooms:       z.coerce.number().int().min(0),
  carSpaces:       z.coerce.number().int().min(0),
  landSize:        z.coerce.number().int().optional().nullable(),
  buildingSize:    z.coerce.number().int().optional().nullable(),
  description:     z.string(),
  inspectionTimes: z.string().optional(),
  coAgentId:       z.string().optional().nullable(),
  isFeatured:      z.string().optional(), // checkbox sends "on" or undefined
});

export async function updateListing(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Not authenticated" };

  const { agent, agency, role } = await getAgentContext(session.user.email);
  const isAdmin = role === "agency_admin" || role === "admin";

  const property = await db.property.findUnique({ where: { id } });
  if (!property) return { error: "Listing not found" };

  // Permission check: agent can only edit own listings
  if (!isAdmin && property.agentId !== agent.id) {
    return { error: "You don't have permission to edit this listing" };
  }
  // agency_admin can only edit listings in their own agency
  if (isAdmin && property.agencyId !== agency.id) {
    return { error: "Listing does not belong to your agency" };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = listingSchema.safeParse(raw);
  if (!parsed.success) return { error: "Invalid data", issues: parsed.error.flatten() };

  const {
    inspectionTimes,
    isFeatured,
    coAgentId,
    priceValue,
    landSize,
    buildingSize,
    ...rest
  } = parsed.data;

  await db.property.update({
    where: { id },
    data: {
      ...rest,
      priceValue: priceValue ?? null,
      landSize: landSize ?? null,
      buildingSize: buildingSize ?? null,
      inspectionTimes: inspectionTimes
        ? inspectionTimes.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      coAgentId: coAgentId || null,
      isFeatured: isAdmin ? isFeatured === "on" : property.isFeatured,
    },
  });

  revalidatePath(`/dashboard/listings/${id}`);
  revalidatePath(`/dashboard/listings`);
  revalidatePath(`/properties/${property.slug}`);
  return { success: true };
}

const createListingSchema = listingSchema.extend({
  listingType:     z.enum(["buy", "rent"]),
  addressStreet:   z.string().min(1),
  addressSuburb:   z.string().min(1),
  addressState:    z.string().min(2),
  addressPostcode: z.string().min(4).max(4),
  agentId:         z.string().min(1),
});

export async function createListing(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Not authenticated" };

  const { agent, agency } = await requireAgencyAdmin(session.user.email).catch(() => {
    return Promise.reject(new Error("Forbidden"));
  }).catch((e) => { throw e; });

  const raw = Object.fromEntries(formData.entries());
  const parsed = createListingSchema.safeParse(raw);
  if (!parsed.success) return { error: "Invalid data", issues: parsed.error.flatten() };

  const {
    inspectionTimes,
    isFeatured,
    coAgentId,
    priceValue,
    landSize,
    buildingSize,
    addressStreet,
    addressSuburb,
    addressState,
    addressPostcode,
    agentId,
    listingType,
    ...rest
  } = parsed.data;

  const addressFull = `${addressStreet}, ${addressSuburb} ${addressState} ${addressPostcode}`;

  // Generate slug: street + suburb + state + postcode (kebab-case) + unique suffix
  const slugBase = `${addressStreet} ${addressSuburb} ${addressState} ${addressPostcode}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  const suffix = Date.now().toString(36);
  const slug = `${slugBase}-${suffix}`;

  // Generate suburbSlug: suburb-state-postcode
  const suburbSlug = `${addressSuburb} ${addressState} ${addressPostcode}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  // Generate a unique id
  const id = `prop_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

  await db.property.create({
    data: {
      id,
      slug,
      listingType,
      addressStreet,
      addressSuburb,
      addressState,
      addressPostcode,
      addressFull,
      suburbSlug,
      agentId,
      agencyId: agency.id,
      ...rest,
      priceValue: priceValue ?? null,
      landSize: landSize ?? null,
      buildingSize: buildingSize ?? null,
      inspectionTimes: inspectionTimes
        ? inspectionTimes.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      coAgentId: coAgentId || null,
      isFeatured: isFeatured === "on",
      dateAdded: new Date(),
    },
  });

  revalidatePath("/dashboard/listings");
  return { success: true, slug };
}

// ─── Team management ──────────────────────────────────────────────────────────

export async function updateTeamAgent(agentId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Not authenticated" };

  const { agency } = await requireAgencyAdmin(session.user.email).catch(() => {
    return Promise.reject(new Error("Forbidden"));
  }).catch((e) => { throw e; });

  // Make sure target agent belongs to the same agency
  const targetAgent = await db.agent.findUnique({ where: { id: agentId } });
  if (!targetAgent) return { error: "Agent not found" };
  if (targetAgent.agencyId !== agency.id) {
    return { error: "Agent does not belong to your agency" };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) return { error: "Invalid data", issues: parsed.error.flatten() };

  const { specialties, ogImage, ...profileRest } = parsed.data;

  await db.agent.update({
    where: { id: agentId },
    data: {
      ...profileRest,
      fullName: `${profileRest.firstName} ${profileRest.lastName}`,
      specialties: specialties.split(",").map((s) => s.trim()).filter(Boolean),
      ogImage: ogImage || null,
    },
  });

  revalidatePath(`/agents/${targetAgent.slug}`);
  revalidatePath("/dashboard/team");
  revalidatePath(`/dashboard/team/${agentId}`);
  return { success: true };
}

// ─── Admin: set user role ─────────────────────────────────────────────────────

export async function setUserRole(userId: string, role: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");
  const caller = await db.user.findUnique({ where: { email: session.user.email }, select: { role: true } });
  if (caller?.role !== "admin") throw new Error("Forbidden");

  const validRoles = ["agent", "agency_admin", "admin"];
  if (!validRoles.includes(role)) throw new Error("Invalid role");

  await db.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/dashboard/admin/users");
  return { success: true };
}
