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

export interface SendMailOptions {
  to: string;
  cc?: string;
  subject: string;
  html: string;
  from?: string;
}

// Thin wrapper around transporter.sendMail. Caller is expected to
// try/catch — we never want a mail failure to take down a request that
// has already persisted the canonical data (lead row) to the DB.
export async function sendMail(opts: SendMailOptions): Promise<void> {
  await transporter.sendMail({
    from: opts.from ?? DEFAULT_FROM,
    to: opts.to,
    cc: opts.cc,
    subject: opts.subject,
    html: opts.html,
  });
}
