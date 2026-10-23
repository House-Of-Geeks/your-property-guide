import { NextResponse } from "next/server";
import { applyEvents, SIGNATURE_HEADER, TIMESTAMP_HEADER, verifySignature, type SendGridEvent } from "@/lib/mail/webhook";

// POST /api/webhooks/sendgrid: SendGrid's signed Event Webhook (21 Oct 2026).
// Configure in SendGrid: Settings → Mail Settings → Event Webhook, a new
// webhook pointing here with Signature Verification on; put its public key
// in SENDGRID_WEBHOOK_PUBLIC_KEY. Events: processed, delivered, deferred,
// bounce, dropped, spam report, unsubscribe, group unsubscribe. Until the
// key is set this answers 503, so nothing unsigned is ever applied.

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const publicKey = process.env.SENDGRID_WEBHOOK_PUBLIC_KEY;
  if (!publicKey) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });

  const rawBody = Buffer.from(await request.arrayBuffer());
  const ok = verifySignature({
    publicKey,
    signature: request.headers.get(SIGNATURE_HEADER),
    timestamp: request.headers.get(TIMESTAMP_HEADER),
    rawBody,
  });
  if (!ok) return NextResponse.json({ error: "Invalid signature" }, { status: 403 });

  let events: unknown;
  try {
    events = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }
  if (!Array.isArray(events)) return NextResponse.json({ error: "Bad payload" }, { status: 400 });

  try {
    const result = await applyEvents(events as SendGridEvent[]);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    // A 5xx makes SendGrid retry the batch; events already stored are skipped then.
    console.error("SendGrid webhook failed:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
