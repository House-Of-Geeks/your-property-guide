import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

// One-shot, idempotent migration. Hit it once to fix Thomson Property
// Group's logo+heroBg in whichever DB this deployment is wired to.
//
// No auth needed:
//   - Only ever rewrites the *exact* known-broken values to the known-good
//     ones. Anything else is a no-op.
//   - Only touches one row by slug.
//
// Delete this file once the audit shows the row is healed.
export async function GET() {
  const before = await db.agency.findUnique({
    where: { slug: "thomson-property-group" },
    select: { logo: true, heroBg: true },
  });

  if (!before) {
    return NextResponse.json({ status: "agency-not-found" }, { status: 404 });
  }

  const BROKEN_LOGO    = "https://www.thomsonpropertygroup.com.au/_assets/7958/images/coffs.png";
  const BROKEN_HEROBG  = "https://renet.photos/10049013/images/432172/slider1.jpg";
  const FIXED_LOGO     = "/images/agencies/thomson-property-group.png";
  const FIXED_HEROBG   = "/images/agencies/thomson-hero.jpg";

  const data: { logo?: string; heroBg?: string } = {};
  if (before.logo === BROKEN_LOGO)       data.logo = FIXED_LOGO;
  if (before.heroBg === BROKEN_HEROBG)   data.heroBg = FIXED_HEROBG;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ status: "already-healed", before });
  }

  await db.agency.update({
    where: { slug: "thomson-property-group" },
    data,
  });

  // Bust ISR for every page that renders this agency's logo.
  revalidatePath("/real-estate-agencies/thomson-property-group");
  revalidatePath("/buy/[slug]", "page");

  const after = await db.agency.findUnique({
    where: { slug: "thomson-property-group" },
    select: { logo: true, heroBg: true },
  });

  return NextResponse.json({ status: "healed", before, after });
}
