import { emailButton, emailHeading, emailLayout } from "@/lib/email-theme";
import { escapeHtml } from "@/lib/email-format";
import { sendMail } from "@/lib/email";

// The dashboard sign-in link (21 Oct 2026). Sent straight through sendMail,
// not the queue: the link is a credential, so no copy is kept in
// EmailMessage, and sendMail turns SendGrid's click tracking off so the link
// is never rewritten (or pre-fetched through a tracking redirect).

export function buildSignInEmail(url: string): { subject: string; html: string; text: string } {
  const subject = "Your sign-in link for Your Property Guide";
  const P = "margin:0 0 14px;font-size:15px;line-height:1.6;";
  const html = emailLayout({
    preheader: "Use this link to sign in. It works once and expires in 24 hours.",
    body: `<div class="ypg-pad" style="padding:26px 32px 30px;">
        ${emailHeading("Sign in to your dashboard", { size: 24, margin: "0 0 14px", tag: "h1" })}
        <p style="${P}">Use the button below to sign in. The link works once and expires in 24 hours.</p>
        ${emailButton("Sign in", url)}
        <p style="${P}margin-top:18px;font-size:13px;">If the button doesn’t work, paste this address into your browser:<br><span style="word-break:break-all;">${escapeHtml(url)}</span></p>
        <p style="${P}font-size:13px;">If you didn’t ask to sign in, you can ignore this email.</p>
      </div>`,
  });
  const text = `Sign in to your Your Property Guide dashboard\n\nUse this link to sign in. It works once and expires in 24 hours:\n${url}\n\nIf you didn't ask to sign in, you can ignore this email.`;
  return { subject, html, text };
}

export async function sendSignInEmail({ identifier, url }: { identifier: string; url: string }): Promise<void> {
  const m = buildSignInEmail(url);
  await sendMail({ to: identifier, ...m, ...(process.env.EMAIL_FROM ? { from: process.env.EMAIL_FROM } : {}), categories: ["ypg", "sign-in"] });
}
