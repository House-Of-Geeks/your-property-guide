"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

  revalidatePath(`/agencies/${agency.slug}`);
  return { success: true };
}
