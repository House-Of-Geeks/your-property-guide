import type { Suburb } from "@/types";

async function loadSuburbs(): Promise<Suburb[]> {
  const { suburbs } = await import("@/lib/data/suburbs");
  return suburbs;
}

export async function getSuburbs(): Promise<Suburb[]> {
  return loadSuburbs();
}

export async function getSuburbBySlug(slug: string): Promise<Suburb | null> {
  const suburbs = await loadSuburbs();
  return suburbs.find((s) => s.slug === slug) ?? null;
}

export async function getAllSuburbSlugs(): Promise<string[]> {
  const suburbs = await loadSuburbs();
  return suburbs.map((s) => s.slug);
}
