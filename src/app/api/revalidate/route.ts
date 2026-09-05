import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

// POST /api/revalidate
// Body: { path?: string, paths?: string[], type?: "page" | "layout", tag?: string }
// Auth: Authorization: Bearer <INDEXNOW_KEY>
//
// On-demand ISR invalidation. Used to bust a specific page's cached HTML
// after a DB edit (e.g. agency logo fix) without waiting for the route's
// `revalidate` window or redeploying, and by the sync pipeline
// (scripts/sync/revalidate-paths.ts) to refresh every suburb a sync touched.
// `paths` takes up to MAX_PATHS per call; `type: "page"` with a route
// pattern such as "/schools/[slug]" invalidates every page of that route.
// Invalidation is lazy: the next request regenerates the page, so a large
// batch does not cause a render storm.
//
// Reuses INDEXNOW_KEY for auth, already provisioned and serves a similar
// "trusted admin tooling" role.
const MAX_PATHS = 1000;
export async function POST(request: NextRequest) {
  const key = process.env.INDEXNOW_KEY;
  const auth = request.headers.get("authorization");
  if (!key || auth !== `Bearer ${key}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { path?: unknown; paths?: unknown; type?: unknown; tag?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const paths: string[] = [];
  if (typeof body.path === "string") paths.push(body.path);
  if (Array.isArray(body.paths)) {
    for (const p of body.paths) if (typeof p === "string") paths.push(p);
  }
  const type = body.type === "page" || body.type === "layout" ? body.type : undefined;
  if (paths.length === 0 && typeof body.tag !== "string") {
    return NextResponse.json(
      { error: "Provide a `path` (string), `paths` (string[]) or `tag` (string)" },
      { status: 400 },
    );
  }
  if (paths.length > MAX_PATHS) {
    return NextResponse.json({ error: `At most ${MAX_PATHS} paths per call` }, { status: 400 });
  }
  if (paths.some((p) => !p.startsWith("/"))) {
    return NextResponse.json({ error: "Paths must start with /" }, { status: 400 });
  }
  for (const p of paths) {
    if (type) revalidatePath(p, type); else revalidatePath(p);
  }
  // Next 16 requires a second arg on revalidateTag; "max" expires the
  // tagged entries immediately (matches the old single-arg behaviour).
  if (typeof body.tag === "string") revalidateTag(body.tag, "max");
  return NextResponse.json({
    revalidated: true,
    paths: paths.length,
    type: type ?? null,
    tag:  typeof body.tag === "string" ? body.tag : null,
    now:  Date.now(),
  });
}
