import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

// POST /api/revalidate
// Body: { path?: string, tag?: string }
// Auth: Authorization: Bearer <INDEXNOW_KEY>
//
// On-demand ISR invalidation. Used to bust a specific page's cached HTML
// after a DB edit (e.g. agency logo fix) without waiting for the route's
// `revalidate` window or redeploying.
//
// Reuses INDEXNOW_KEY for auth, already provisioned and serves a similar
// "trusted admin tooling" role.
export async function POST(request: NextRequest) {
  const key = process.env.INDEXNOW_KEY;
  const auth = request.headers.get("authorization");
  if (!key || auth !== `Bearer ${key}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { path?: unknown; tag?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.path !== "string" && typeof body.tag !== "string") {
    return NextResponse.json(
      { error: "Provide a `path` (string) or `tag` (string)" },
      { status: 400 },
    );
  }

  if (typeof body.path === "string") revalidatePath(body.path);
  // Next 16 requires a second arg on revalidateTag; "max" expires the
  // tagged entries immediately (matches the old single-arg behaviour).
  if (typeof body.tag === "string") revalidateTag(body.tag, "max");

  return NextResponse.json({
    revalidated: true,
    path: typeof body.path === "string" ? body.path : null,
    tag:  typeof body.tag  === "string" ? body.tag  : null,
    now:  Date.now(),
  });
}
