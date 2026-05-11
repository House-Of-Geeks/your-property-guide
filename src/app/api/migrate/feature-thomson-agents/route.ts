import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

// One-shot, idempotent: flag the Thomson Property Group agents as
// featured so they pin to the top of the SpecialistShowcase. No-op if
// they're already featured. Delete after the showcase is curated.
export async function GET() {
  const TARGET_SLUGS = ["matthew-thomson", "dylan-thomson", "hannah-thomson"];

  const before = await db.agent.findMany({
    where: { slug: { in: TARGET_SLUGS } },
    select: { slug: true, fullName: true, isFeatured: true },
    orderBy: { slug: "asc" },
  });

  const result = await db.agent.updateMany({
    where: { slug: { in: TARGET_SLUGS }, isFeatured: false },
    data: { isFeatured: true },
  });

  // Bust ISR for pages that render the showcase.
  revalidatePath("/");
  revalidatePath("/find-an-expert");

  const after = await db.agent.findMany({
    where: { slug: { in: TARGET_SLUGS } },
    select: { slug: true, fullName: true, isFeatured: true },
    orderBy: { slug: "asc" },
  });

  return NextResponse.json({
    status: result.count > 0 ? "featured" : "already-featured",
    updated: result.count,
    before,
    after,
  });
}
