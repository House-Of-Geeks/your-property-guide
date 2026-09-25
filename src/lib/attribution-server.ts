import type { Prisma } from "@/generated/prisma/client";
import {
  ATTRIBUTION_COOKIE,
  attributionEmailRows,
  leadGclid,
  parseAttribution,
  type AttributionState,
} from "@/lib/attribution";

// Server side of lead attribution. The browser keeps the ypg_attr cookie
// (components/analytics/AttributionCapture); every lead POST carries it, so
// /api/leads reads attribution here instead of trusting a form payload.

export interface LeadAttribution {
  state: AttributionState | null;
  /** Path of the page the form was submitted on, from the Referer header. */
  sourcePage: string | null;
  gclid: string | null;
}

export function readCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf("=");
    if (eq > 0 && part.slice(0, eq) === name) return part.slice(eq + 1);
  }
  return undefined;
}

/** Same-origin Referer as path + query, else null (cross-origin or absent). */
function sameOriginPath(request: Request): string | null {
  const referer = request.headers.get("referer");
  if (!referer) return null;
  try {
    const ref = new URL(referer);
    const own = new URL(request.url);
    const host = request.headers.get("host") ?? own.host;
    if (ref.host !== host && ref.host !== own.host) return null;
    const path = ref.pathname + ref.search;
    return path.length > 500 ? path.slice(0, 500) : path;
  } catch {
    return null;
  }
}

export function attributionFromRequest(request: Request): LeadAttribution {
  const state = parseAttribution(readCookie(request.headers.get("cookie"), ATTRIBUTION_COOKIE));
  return { state, sourcePage: sameOriginPath(request), gclid: leadGclid(state) };
}

/** JSON for the Lead.attribution column, or undefined when there is nothing to store. */
export function attributionJson(a: LeadAttribution): Prisma.InputJsonObject | undefined {
  if (!a.state && !a.sourcePage) return undefined;
  const out: Record<string, unknown> = {};
  if (a.state) {
    out.first = a.state.first;
    if (a.state.last) out.last = a.state.last;
    if (a.state.google) out.google = a.state.google;
    if (a.state.microsoft) out.microsoft = a.state.microsoft;
  }
  if (a.sourcePage) out.source_page = a.sourcePage;
  return out as Prisma.InputJsonObject;
}

export function attributionRowsFor(a: LeadAttribution): Array<[string, string]> {
  return attributionEmailRows(a.state, a.sourcePage);
}
