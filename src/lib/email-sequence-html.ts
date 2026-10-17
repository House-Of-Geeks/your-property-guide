// The guidance series emails as HTML (kept apart from the series data in
// ./email-sequences so the browser bundle never carries email templates).

import { EMAIL_COLORS, emailButton, emailLayout } from "@/lib/email-theme";
import { textBlocks, visitorGreeting } from "@/lib/email-format";
import { SITE_URL } from "@/lib/constants/seo";
import { esc } from "@/lib/journey-emails";
import { SEQUENCES, type SequenceId } from "@/lib/email-sequences";

export function buildSequenceEmailHtml(seq: SequenceId, step: number, opts: { firstName?: string | null; unsubscribeUrl: string }): { subject: string; html: string; text: string } | null {
  const s = SEQUENCES[seq];
  const e = s.emails[step];
  if (!e) return null;
  const C = EMAIL_COLORS;
  const href = e.link.href.startsWith("http") ? e.link.href : `${SITE_URL}${e.link.href}`;
  const greeting = visitorGreeting(opts.firstName);
  const html = emailLayout({
    preheader: e.paragraphs[0],
    body: `
    <div style="padding:24px 28px;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:${C.inkMuted};">${esc(`Email ${step + 1} of ${s.emails.length}: ${s.label}`)}</p>
      <h2 style="margin:0 0 12px;font-size:21px;line-height:1.3;color:${C.ink};">${esc(e.subject)}</h2>
      <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:${C.ink};">${esc(greeting)}</p>
      ${e.paragraphs.map((p) => `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:${C.ink};">${esc(p)}</p>`).join("")}
      <ul style="margin:0 0 18px;padding-left:18px;font-size:15px;line-height:1.6;color:${C.ink};">${e.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      <p style="margin:0 0 20px;">${emailButton(e.link.label, href)}</p>
      <p style="margin:0;font-size:12px;line-height:1.6;color:${C.inkSubtle};">You’re getting this because you asked for this short series. It ends after email ${s.emails.length}. <a href="${esc(opts.unsubscribeUrl)}" style="color:${C.inkSubtle};">Unsubscribe</a></p>
    </div>`,
  });
  const text = textBlocks([
    greeting,
    ...e.paragraphs,
    e.points.map((p) => `- ${p}`).join("\n"),
    `${e.link.label}\n${href}`,
    `You’re getting this because you asked for this short series. It ends after email ${s.emails.length}.`,
    `Unsubscribe\n${opts.unsubscribeUrl}`,
  ]);
  return { subject: e.subject, html, text };
}
