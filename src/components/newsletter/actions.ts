"use server";

import { z } from "zod";
import { db } from "@/lib/db";

const NewsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("That doesn't look like a valid email")
    .max(200, "Email too long"),
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
 * the required name + phone fields. Future: extract to a dedicated
 * NewsletterSubscriber model when we wire to Mailchimp / Resend.
 */
export async function subscribeToNewsletter(
  input: { email: string },
): Promise<SubscribeResult> {
  const parsed = NewsletterSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid email",
    };
  }

  const { email } = parsed.data;
  const normalised = email.trim().toLowerCase();

  try {
    // Idempotent: if this email already subscribed, just return ok.
    const existing = await db.lead.findFirst({
      where: { email: normalised, type: "newsletter" },
      select: { id: true },
    });

    if (existing) {
      return { ok: true };
    }

    await db.lead.create({
      data: {
        type: "newsletter",
        firstName: "newsletter",
        lastName: "subscriber",
        email: normalised,
        phone: "0000000000", // Lead schema requires phone; sentinel for newsletter rows
        source: "newsletter-signup",
      },
    });

    return { ok: true };
  } catch (err) {
    console.error("[newsletter] subscription failed", err);
    return {
      ok: false,
      error: "We couldn't save your subscription. Try again in a minute?",
    };
  }
}
