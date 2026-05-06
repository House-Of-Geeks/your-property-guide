import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// GET /api/properties/[id]/saved
// Returns { saved: boolean } for the current user. Always 200, even for
// anonymous visitors (returns { saved: false }), so PropertyActions can
// render its initial state without branching on session existence.
//
// This endpoint exists so the property detail pages (/buy/[slug],
// /rent/[slug], /sold/[slug]) can stay static / CDN-cacheable, the
// auth-dependent saved status is fetched client-side after hydration
// rather than rendered on the server.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ saved: false });
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ saved: false });

  const saved = await db.savedProperty.findUnique({
    where: { userId_propertyId: { userId: user.id, propertyId: id } },
  });

  return NextResponse.json({ saved: Boolean(saved) });
}
