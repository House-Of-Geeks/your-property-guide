import type { HouseAndLandPackage } from "@/types";

async function loadPackages(): Promise<HouseAndLandPackage[]> {
  const { houseAndLandPackages } = await import("@/lib/data/house-and-land");
  return houseAndLandPackages;
}

export async function getHouseAndLandPackages(): Promise<HouseAndLandPackage[]> {
  return loadPackages();
}

export async function getHouseAndLandBySlug(slug: string): Promise<HouseAndLandPackage | null> {
  const packages = await loadPackages();
  return packages.find((p) => p.slug === slug) ?? null;
}

export async function getAllHouseAndLandSlugs(): Promise<string[]> {
  const packages = await loadPackages();
  return packages.map((p) => p.slug);
}
