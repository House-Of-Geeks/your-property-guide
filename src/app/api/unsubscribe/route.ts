import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { suppress } from "@/lib/mail/suppression";

// /api/unsubscribe?t=<token> (21 Oct 2026).
//
//   GET   never acts. It sends the reader to /unsubscribe?t=, which asks
//         first, so a link scanner or a preview fetch can't unsubscribe
//         anyone (emails sent before this change link straight here).
//   POST  unsubscribes. Two senders: the confirm button on /unsubscribe
//         (a form, answered with a redirect to /unsubscribed), and a mail
//         client's RFC 8058 one-click request ("List-Unsubscribe=One-Click"
//         in the body; answered 200).
//
// An unsubscribe is a marketing suppression for the address
// (src/lib/mail/suppression.ts): every Lead row with that address, in any
// letter case, stops the series and the newsletter. Guides, plans and
// confirmations someone asks for still arrive. The original consent stays
// on the rows as a record. Whether or not the token matched, the answer is
// the same, so the endpoint can't be used to test which tokens exist.

async function unsubscribe(token: string | null): Promise<void> {
  if (!token || token.length < 10) return;
  const lead = await db.lead.findUnique({ where: { token }, select: { id: true, email: true } });
  if (!lead?.email) return;
  await suppress(lead.email, "marketing", "unsubscribe", "app", `token ${lead.id}`);
  await db.leadEvent.create({ data: { leadId: lead.id, type: "unsubscribed", actor: "customer", detail: { allRowsForEmail: true } } });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const t = url.searchParams.get("t");
  return NextResponse.redirect(new URL(t ? `/unsubscribe?t=${encodeURIComponent(t)}` : "/unsubscribe", url.origin), 303);
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  let fromPage = false;
  try {
    const type = request.headers.get("content-type") ?? "";
    if (type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data")) {
      const form = await request.formData();
      fromPage = form.get("confirm") === "1";
    }
  } catch {
    // An empty or odd body is still a one-click request.
  }
  try {
    await unsubscribe(url.searchParams.get("t"));
  } catch (err) {
    console.error("Unsubscribe failed:", err instanceof Error ? err.message : String(err));
  }
  if (fromPage) return NextResponse.redirect(new URL("/unsubscribed", url.origin), 303);
  return NextResponse.json({ ok: true });
}
