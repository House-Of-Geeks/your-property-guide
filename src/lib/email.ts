import nodemailer from "nodemailer";

// Single SendGrid SMTP transporter shared by /api/leads and any cron
// or admin route that needs to send mail. Re-created per Node process
// (Vercel serverless funcs reuse this across warm invocations).
export const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

export const DEFAULT_FROM = `"Your Property Guide" <${process.env.EMAIL_FROM ?? "noreply@yourpropertyguide.com.au"}>`;
export const ANDY_EMAIL = "andy@theandylife.com";
// Standard CC on lead notifications. Match-request leads skip it (per
// Andy 2026-05-10) — both /api/leads and /api/leads/enrich apply that rule.
export const LEADS_CC_EMAIL = "jos@profitgeeks.com.au";

export interface SendMailOptions {
  to: string;
  cc?: string;
  subject: string;
  html: string;
  /** Plain-text alternative. Visitor emails set this so clients that
      prefer text still get a tidy copy. */
  text?: string;
  from?: string;
  /** Where replies land. Customer-facing sends set this so "reply to this
      email" is a real call to action instead of a bounce. */
  replyTo?: string;
  /** Extra SMTP headers. Merged with the click-tracking header below. */
  headers?: Record<string, string>;
  /**
   * SendGrid unique arguments (X-SMTPAPI unique_args), echoed back on every
   * Event Webhook event. Opaque ids only, never personal details (SendGrid
   * keeps them long-term): the queue sends { ypg_mid: <EmailMessage.id> }.
   */
  customArgs?: Record<string, string>;
  /** SendGrid categories, for SendGrid's own stats (no personal details). */
  categories?: string[];
}

/** What the provider said when it took (or refused) the message. */
export interface SendResult {
  /** SendGrid's SMTP reply, e.g. "250 Ok: queued as AbC123". */
  response: string;
  /** The queue id from that reply ("AbC123"), the first half of sg_message_id. */
  providerMessageId: string | null;
  /** True when written to the log instead of sent (EMAIL_TRANSPORT=log). */
  logged: boolean;
}

// SendGrid SMTP has no trackingSettings field. The X-SMTPAPI header is the
// per-message backstop that keeps links off SendGrid's shared click domain
// (tokenised download, feedback and unsubscribe links stay exactly as
// written). Since 21 Oct 2026 it also turns off open tracking for our mail:
// the account has it on (shared with other brands), we report delivery from
// the Event Webhook instead, and a tracking pixel adds nothing for readers.
const CLICKTRACK_OFF = { enable: 0, enable_text: 0 } as const;
const OPENTRACK_OFF = { enable: 0 } as const;

export function withClickTrackingDisabled(
  headers?: Record<string, string>,
  extra?: { customArgs?: Record<string, string>; categories?: string[] },
): Record<string, string> {
  const merged: Record<string, string> = { ...(headers ?? {}) };
  let payload: Record<string, unknown> = {};
  const existing = merged["X-SMTPAPI"];
  if (existing) {
    try {
      const parsed: unknown = JSON.parse(existing);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        payload = parsed as Record<string, unknown>;
      }
    } catch {
      payload = {};
    }
  }
  const filters =
    payload.filters && typeof payload.filters === "object" && !Array.isArray(payload.filters)
      ? { ...(payload.filters as Record<string, unknown>) }
      : {};
  filters.clicktrack = { settings: { ...CLICKTRACK_OFF } };
  filters.opentrack = { settings: { ...OPENTRACK_OFF } };
  payload.filters = filters;
  if (extra?.customArgs && Object.keys(extra.customArgs).length) {
    const prior = payload.unique_args && typeof payload.unique_args === "object" ? (payload.unique_args as Record<string, string>) : {};
    payload.unique_args = { ...prior, ...extra.customArgs };
  }
  if (extra?.categories?.length) payload.category = extra.categories;
  merged["X-SMTPAPI"] = JSON.stringify(payload);
  return merged;
}

/** "250 Ok: queued as AbC123" → "AbC123". */
export function queueIdFromResponse(response: string | undefined): string | null {
  const m = response?.match(/queued as\s+([A-Za-z0-9._-]+)/i);
  return m ? m[1] : null;
}

// Thin wrapper around transporter.sendMail. Caller is expected to
// try/catch — we never want a mail failure to take down a request that
// has already persisted the canonical data (lead row) to the DB. Customer
// email goes through the durable queue (src/lib/mail/queue.ts), which calls
// this and records the result; only the queue should call it for customers.
export async function sendMail(opts: SendMailOptions): Promise<SendResult> {
  const headers = withClickTrackingDisabled(opts.headers, { customArgs: opts.customArgs, categories: opts.categories });
  // EMAIL_TRANSPORT=log (local runs, tests and staging checks): record the
  // email instead of sending it, so an end-to-end test can't email Andy, Jos
  // or a real address. MAIL_LOG_DIR keeps a JSON copy of each for inspection.
  if (process.env.EMAIL_TRANSPORT === "log") {
    const record = { at: new Date().toISOString(), from: opts.from ?? DEFAULT_FROM, ...opts, headers };
    console.info(`[mail:log] to=${opts.to}${opts.cc ? ` cc=${opts.cc}` : ""} subject=${JSON.stringify(opts.subject)}`);
    const dir = process.env.MAIL_LOG_DIR;
    if (dir) {
      const { mkdir, writeFile } = await import("node:fs/promises");
      await mkdir(dir, { recursive: true });
      await writeFile(`${dir}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`, JSON.stringify(record, null, 2));
    }
    return { response: "250 Ok: logged", providerMessageId: null, logged: true };
  }
  const info = await transporter.sendMail({
    from: opts.from ?? DEFAULT_FROM,
    to: opts.to,
    cc: opts.cc,
    replyTo: opts.replyTo,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    headers,
  });
  const response = typeof info?.response === "string" ? info.response : "";
  return { response, providerMessageId: queueIdFromResponse(response), logged: false };
}
