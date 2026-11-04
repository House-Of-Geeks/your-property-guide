// The guidance series emails as HTML (kept apart from the series data in
// ./email-sequences so the browser bundle never carries email templates).

import { EMAIL_COLORS, emailButton, emailHeading, emailHeroImage, emailLabel, emailLayout, marketingFooter } from "@/lib/email-theme";
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
  // The window photograph opens the first email of a series only (21 Oct
  // 2026): a welcome, not a pattern; later emails stay light and text-led.
  const html = emailLayout({
    preheader: e.paragraphs[0],
    body: `
    ${step === 0 ? emailHeroImage() : ""}
    <div class="ypg-pad" style="padding:26px 32px 28px;">
      ${emailLabel(esc(`Email ${step + 1} of ${s.emails.length}: ${s.label}`))}
      ${emailHeading(esc(e.subject), { size: 24, margin: "0 0 14px" })}
      <p style="margin:0 0 12px;font-size:16px;line-height:1.65;color:${C.ink};">${esc(greeting)}</p>
      ${e.paragraphs.map((p) => `<p style="margin:0 0 12px;font-size:16px;line-height:1.65;color:${C.ink};">${esc(p)}</p>`).join("")}
      <ul style="margin:0 0 20px;padding-left:20px;font-size:16px;line-height:1.6;color:${C.ink};">${e.points.map((p) => `<li style="margin:0 0 6px;">${esc(p)}</li>`).join("")}</ul>
      <div style="margin:0 0 6px;">${emailButton(esc(e.link.label), href)}</div>
    </div>`,
    footer: marketingFooter(`You’re getting this because you asked for this short series (${s.label}). It ends after email ${s.emails.length}.`, opts.unsubscribeUrl),
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
