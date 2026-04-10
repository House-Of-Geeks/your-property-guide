import { type NextRequest, NextResponse } from "next/server";
import { submitToIndexNow } from "@/lib/indexnow";

// POST /api/indexnow
// Body: { urls: string[] }
// Auth: Authorization: Bearer <INDEXNOW_KEY>
export async function POST(request: NextRequest) {
  const key = process.env.INDEXNOW_KEY;
  const auth = request.headers.get("authorization");

  if (!key || auth !== `Bearer ${key}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let urls: unknown;
  try {
    ({ urls } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: "urls must be a non-empty array of strings" }, { status: 400 });
  }

  const stringUrls = (urls as unknown[]).filter((u): u is string => typeof u === "string");

  try {
    const result = await submitToIndexNow(stringUrls);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
