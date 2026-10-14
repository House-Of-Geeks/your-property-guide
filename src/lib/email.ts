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
  from?: string;
  /** Where replies land. Customer-facing sends set this so "reply to this
      email" is a real call to action instead of a bounce. */
  replyTo?: string;
}

// Thin wrapper around transporter.sendMail. Caller is expected to
// try/catch — we never want a mail failure to take down a request that
// has already persisted the canonical data (lead row) to the DB.
export async function sendMail(opts: SendMailOptions): Promise<void> {
  // EMAIL_TRANSPORT=log (local runs, tests and staging checks): record the
  // email instead of sending it, so an end-to-end test can't email Andy, Jos
  // or a real address. MAIL_LOG_DIR keeps a JSON copy of each for inspection.
  if (process.env.EMAIL_TRANSPORT === "log") {
    const record = { at: new Date().toISOString(), from: opts.from ?? DEFAULT_FROM, ...opts };
    console.info(`[mail:log] to=${opts.to}${opts.cc ? ` cc=${opts.cc}` : ""} subject=${JSON.stringify(opts.subject)}`);
    const dir = process.env.MAIL_LOG_DIR;
    if (dir) {
      const { mkdir, writeFile } = await import("node:fs/promises");
      await mkdir(dir, { recursive: true });
      await writeFile(`${dir}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`, JSON.stringify(record, null, 2));
    }
    return;
  }
  await transporter.sendMail({
    from: opts.from ?? DEFAULT_FROM,
    to: opts.to,
    cc: opts.cc,
    replyTo: opts.replyTo,
    subject: opts.subject,
    html: opts.html,
  });
}
