"use server";

import { randomBytes } from "node:crypto";
import { z } from "zod";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { checkRateLimit, ipKeyFromHeaders } from "@/lib/rate-limit";
import { NEWSLETTER_CONSENT } from "@/lib/newsletter";
import { after } from "next/server";
import { queueWelcome } from "@/lib/mail/newsletter";
import { sendQueuedNow } from "@/lib/mail/queue";

const NewsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("That doesn't look like a valid email")
    .max(200, "Email too long"),
  // Honeypot — must remain empty. Real users never see this field; bots
  // autofill it. If populated we silently succeed without persisting, the
  // same tactic /api/leads uses so the bot doesn't learn why it failed.
  website: z.string().optional(),
});

interface SubscribeResult {
  ok: boolean;
  error?: string;
}

/**
 * Server action: subscribe an email to the newsletter list.
 *
 * We store newsletter signups in the existing Lead table to avoid a schema
 * migration on every iteration. type="newsletter" + placeholder values for
 * the required name + phone fields. The app sends the newsletter itself,
 * through SendGrid (src/lib/mail/newsletter.ts).
 *
 * Bot protection mirrors /api/leads: an IP rate limit plus a honeypot,
 * because this form (like the lead forms) is an unauthenticated public
 * endpoint that spam bots probe.
 */
export async function subscribeToNewsletter(
  input: { email: string; website?: string },
): Promise<SubscribeResult> {
  // Rate limit first so a scripted flood can't hammer validation or the DB.
  // Sliding 5/min per IP — the same budget as /api/leads; a real reader
  // won't trip it. In-memory + per-instance, so it's a casual-bot deterrent
  // rather than a hard wall (see rate-limit.ts).
  const ipKey = ipKeyFromHeaders(await headers());
  if (!checkRateLimit(`newsletter:${ipKey}`, { limit: 5, windowMs: 60_000 }).allowed) {
    return { ok: false, error: "Too many attempts. Please try again in a moment." };
  }

  const parsed = NewsletterSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid email",
    };
  }

  const { email, website } = parsed.data;

  // Honeypot trip: pretend it worked, persist nothing, so the bot believes
  // the submission succeeded and doesn't retry differently.
  if (website && website.trim().length > 0) {
    return { ok: true };
  }

  const normalised = email.trim().toLowerCase();

  // The welcome goes after the response, through the email queue (21 Oct
  // 2026): what they signed up for, and how to leave.
  const welcome = (lead: { id: string; email: string; token: string | null }, occasion: string) => {
    const task = async () => {
      const q = await queueWelcome(lead, occasion);
      if (q?.created && q.status === "queued") await sendQueuedNow(q.id);
    };
    try {
      after(task);
    } catch {
      void task().catch(() => {});
    }
  };

  try {
    // One newsletter row per address. Signing up again after unsubscribing
    // is a new, explicit consent: the row is reactivated, the marketing
    // unsubscribe lifted (never a bounce or a spam complaint), and a
    // welcome sent again.
    const existing = await db.lead.findFirst({
      where: { email: { equals: normalised, mode: "insensitive" }, type: "newsletter" },
      select: { id: true, email: true, token: true, unsubscribedAt: true },
    });

    if (existing) {
      if (existing.unsubscribedAt) {
        await db.lead.update({
          where: { id: existing.id },
          data: { unsubscribedAt: null, marketingConsent: true, consentText: NEWSLETTER_CONSENT, events: { create: { type: "resubscribed", actor: "customer" } } },
        });
        await db.emailSuppression.deleteMany({ where: { email: normalised, scope: "marketing", reason: "unsubscribe" } });
        welcome(existing, `resubscribed-${Date.now()}`);
      }
      return { ok: true };
    }

    const created = await db.lead.create({
      data: {
        type: "newsletter",
        firstName: "newsletter",
        lastName: "subscriber",
        email: normalised,
        phone: "0000000000", // Lead schema requires phone; sentinel for newsletter rows
        source: "newsletter-signup",
        // What they agreed to, and a token so an update can carry an
        // unsubscribe link (20 Oct 2026). A learning row: never to an agent.
        kind: "learning",
        marketingConsent: true,
        consentText: NEWSLETTER_CONSENT,
        token: randomBytes(18).toString("base64url"),
        events: { create: { type: "submitted", actor: "customer", detail: { lead: "newsletter" } } },
      },
      select: { id: true, email: true, token: true },
    });
    welcome(created, "signup");

    return { ok: true };
  } catch (err) {
    console.error("[newsletter] subscription failed", err);
    return {
      ok: false,
      error: "We couldn't save your subscription. Try again in a minute?",
    };
  }
}
