import { NextResponse } from "next/server";
import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_MAX_AGE_DAYS,
  parseAttribution,
  serializeAttribution,
  updateAttribution,
} from "@/lib/attribution";
import { readCookie } from "@/lib/attribution-server";

// Sets the ypg_attr attribution cookie from a server response.
//
// Safari and every iOS browser (WebKit tracking prevention) cap cookies
// written by page script at 7 days, and at 24 hours after a click from a
// Google or Facebook ad with a decorated URL, which is exactly an ad
// landing. First-party cookies set by a same-host HTTP response are not
// capped, so AttributionCapture posts the landing URL here instead of
// writing document.cookie. Pages stay static; this runs only on a first
// visit or a campaign landing.
//
// The header is written by hand: NextResponse.cookies.set() would
// URI-encode the already-encoded value a second time.

export async function POST(request: Request) {
  const res = new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  let body: { href?: unknown; referrer?: unknown };
  try {
    body = await request.json();
  } catch {
    return res;
  }
  if (typeof body.href !== "string" || body.href.length > 4000) return res;

  // Only record landings on this site.
  const own = new URL(request.url);
  const host = request.headers.get("host") ?? own.host;
  let landing: URL;
  try {
    landing = new URL(body.href);
  } catch {
    return res;
  }
  if (landing.host !== host && landing.host !== own.host) return res;

  const existing = parseAttribution(readCookie(request.headers.get("cookie"), ATTRIBUTION_COOKIE));
  const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 2000) : "";
  const next = updateAttribution(existing, landing.href, referrer, new Date().toISOString());
  if (!next) return res;

  const https = own.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
  res.headers.append(
    "Set-Cookie",
    `${ATTRIBUTION_COOKIE}=${serializeAttribution(next)}; Path=/; Max-Age=${ATTRIBUTION_MAX_AGE_DAYS * 86400}; SameSite=Lax${https ? "; Secure" : ""}`,
  );
  return res;
}
