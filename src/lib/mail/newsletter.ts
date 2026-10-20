import { db as prisma } from "@/lib/db";
import { ANDY_EMAIL } from "@/lib/email";
import { escapeHtml } from "@/lib/email-format";
import {
  EMAIL_COLORS as C,
  EMAIL_FONTS,
  emailButton,
  emailHeading,
  emailHeroImage,
  emailLayout,
  marketingFooter,
} from "@/lib/email-theme";
import { NEWSLETTER_CONSENT } from "@/lib/newsletter";
import { enqueueEmail } from "./queue";
import { normaliseEmail } from "./suppression";
import { listUnsubscribeHeaders, unsubscribePageUrl } from "./unsubscribe";

// The newsletter (21 Oct 2026). Written, previewed, tested and published
// from /dashboard/admin/newsletter; no schedule is promised, it goes when
// the team publishes one. The audience is people who signed up for the
// newsletter itself (Lead type "newsletter", consent stored, not
// unsubscribed), one email per address, minus suppressions. Guide, plan and
// introduction contacts are NOT in it: their consent was for something else.

export const NEWSLETTER_REASON = "You’re getting this because you signed up for Your Property Guide’s updates.";

export interface IssueContent {
  subject: string;
  preheader?: string | null;
  heading: string;
  body: string;
  linkLabel?: string | null;
  linkHref?: string | null;
  showImage?: boolean;
}

const P = `margin:0 0 14px;font-size:16px;line-height:1.65;color:${C.ink};font-family:${EMAIL_FONTS.sans};`;

function inline(text: string): string {
  // [label](https://…) links; everything else escaped.
  return escapeHtml(text).replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, (_m, label: string, href: string) => `<a href="${href}" style="color:${C.forest};text-decoration:underline;">${label}</a>`);
}

/** The body format: blank-line paragraphs, "## " headings, "- " bullets, [label](https://…) links. */
export function renderBody(body: string): { html: string; text: string } {
  const blocks = body.replace(/\r\n/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const html: string[] = [];
  const text: string[] = [];
  for (const block of blocks) {
    if (block.startsWith("## ")) {
      html.push(emailHeading(inline(block.slice(3)), { size: 21, margin: "22px 0 8px" }));
      text.push(block.slice(3).toUpperCase());
    } else if (block.split("\n").every((l) => l.trim().startsWith("- "))) {
      const items = block.split("\n").map((l) => l.trim().slice(2));
      html.push(`<ul style="margin:0 0 14px;padding-left:20px;color:${C.ink};font-family:${EMAIL_FONTS.sans};font-size:16px;line-height:1.6;">${items.map((i) => `<li style="margin:0 0 6px;">${inline(i)}</li>`).join("")}</ul>`);
      text.push(items.map((i) => `- ${i}`).join("\n"));
    } else {
      html.push(`<p style="${P}">${inline(block).replace(/\n/g, "<br>")}</p>`);
      text.push(block);
    }
  }
  return { html: html.join("\n"), text: text.join("\n\n").replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, "$1 ($2)") };
}

export function renderNewsletter(issue: IssueContent, unsubscribeUrl: string): { subject: string; html: string; text: string } {
  const body = renderBody(issue.body);
  const link = issue.linkLabel && issue.linkHref ? { label: issue.linkLabel, href: issue.linkHref } : null;
  const html = emailLayout({
    preheader: issue.preheader ?? undefined,
    body: `${issue.showImage === false ? "" : emailHeroImage()}
      <div class="ypg-pad" style="padding:26px 32px 30px;">
        ${emailHeading(escapeHtml(issue.heading), { size: 26, margin: "0 0 14px", tag: "h1" })}
        ${body.html}
        ${link ? `<div style="margin:22px 0 4px;">${emailButton(escapeHtml(link.label), link.href)}</div>` : ""}
        <p style="margin:22px 0 0;font-size:15px;line-height:1.6;color:${C.inkMuted};font-family:${EMAIL_FONTS.sans};">Andy McMaster<br>Your Property Guide</p>
      </div>`,
    footer: marketingFooter(NEWSLETTER_REASON, unsubscribeUrl),
  });
  const text = [
    issue.heading,
    "",
    body.text,
    link ? `\n${link.label}: ${link.href}` : "",
    "",
    "Andy McMaster",
    "Your Property Guide",
    "",
    `${NEWSLETTER_REASON} Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");
  return { subject: issue.subject, html, text };
}

/** The welcome a new subscriber gets: what they signed up for, and how to leave. */
export function renderWelcome(unsubscribeUrl: string): { subject: string; html: string; text: string } {
  const subject = "You’re on the list for Your Property Guide updates";
  const lines = [
    "Thanks for signing up. Here’s what that means.",
    "We’ll email you when there’s something worth knowing: a rule or scheme change, a new guide or tool, or what a market shift means if you’re buying or selling. There’s no fixed schedule, and we keep it short.",
    "These updates are separate from any guide, plan or introduction you ask us for. We never pass your address to an agent or sell it.",
  ];
  const html = emailLayout({
    preheader: "What you signed up for, and how to change your mind.",
    body: `${emailHeroImage()}
      <div class="ypg-pad" style="padding:26px 32px 30px;">
        ${emailHeading("You’re on the list.", { size: 26, margin: "0 0 14px", tag: "h1" })}
        ${lines.map((l) => `<p style="${P}">${escapeHtml(l)}</p>`).join("\n")}
        <p style="${P}">In the meantime, the free guides and tools are all on the site.</p>
        <div style="margin:20px 0 4px;">${emailButton("Find my next step", "https://www.yourpropertyguide.com.au/plan?from=newsletter-welcome")}</div>
        <p style="margin:22px 0 0;font-size:15px;line-height:1.6;color:${C.inkMuted};font-family:${EMAIL_FONTS.sans};">Andy McMaster<br>Your Property Guide</p>
      </div>`,
    footer: marketingFooter("You’re getting this because you signed up for Your Property Guide’s updates.", unsubscribeUrl),
  });
  const text = ["You’re on the list.", "", ...lines, "", "The free guides and tools: https://www.yourpropertyguide.com.au/plan", "", "Andy McMaster", "Your Property Guide", "", `Unsubscribe: ${unsubscribeUrl}`].join("\n\n").replace(/\n{3,}/g, "\n\n");
  return { subject, html, text };
}

/** Queue the welcome for a newsletter signup (or a re-signup after unsubscribing). */
export async function queueWelcome(lead: { id: string; email: string; token: string | null }, occasion: string) {
  if (!lead.token) return null;
  const { subject, html, text } = renderWelcome(unsubscribePageUrl(lead.token));
  return enqueueEmail({
    key: `newsletter-welcome:${lead.id}:${occasion}`,
    category: "marketing",
    stream: "newsletter-welcome",
    template: "newsletter/welcome",
    to: lead.email,
    leadId: lead.id,
    subject,
    html,
    text,
    replyTo: ANDY_EMAIL,
    headers: listUnsubscribeHeaders(lead.token),
  });
}

export interface AudienceMember {
  leadId: string;
  email: string;
  token: string;
}

/** The consented newsletter audience: one row per address, minus unsubscribes and suppressions. */
export async function newsletterAudience(): Promise<{ members: AudienceMember[]; excluded: { suppressed: number; noToken: number } }> {
  const rows = await prisma.lead.findMany({
    where: { type: "newsletter", marketingConsent: true, unsubscribedAt: null },
    select: { id: true, email: true, token: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  const suppressed = new Set(
    (await prisma.emailSuppression.findMany({ where: { scope: { in: ["marketing", "all"] } }, select: { email: true } })).map((s) => s.email),
  );
  const seen = new Set<string>();
  const members: AudienceMember[] = [];
  let sup = 0;
  let noToken = 0;
  for (const r of rows) {
    const email = normaliseEmail(r.email);
    if (seen.has(email)) continue;
    seen.add(email);
    if (suppressed.has(email)) {
      sup++;
      continue;
    }
    if (!r.token) {
      noToken++;
      continue;
    }
    members.push({ leadId: r.id, email, token: r.token });
  }
  return { members, excluded: { suppressed: sup, noToken } };
}

/** Send one copy of an issue to an internal address (labelled TEST; no list headers). */
export async function sendTest(issueId: string, to: string) {
  const issue = await prisma.newsletterIssue.findUniqueOrThrow({ where: { id: issueId } });
  const { subject, html, text } = renderNewsletter(issue, "https://www.yourpropertyguide.com.au/unsubscribe?t=TEST");
  const res = await enqueueEmail({
    key: `newsletter-test:${issueId}:${Date.now()}`,
    category: "operational",
    stream: "newsletter-test",
    template: "newsletter/issue",
    to,
    newsletterIssueId: issueId,
    subject: `[TEST] ${subject}`,
    html,
    text,
  });
  await prisma.newsletterIssue.update({ where: { id: issueId }, data: { testSentTo: normaliseEmail(to), testSentAt: new Date() } });
  return res;
}

/**
 * Publish: queue one email per audience member (unique per issue and
 * address, so publishing twice can't double-send) and mark the issue
 * published. The email cron sends them in batches.
 */
export async function publishIssue(issueId: string, by: string) {
  const issue = await prisma.newsletterIssue.findUniqueOrThrow({ where: { id: issueId } });
  if (issue.status === "published") return { queued: 0, alreadyPublished: true, audience: issue.audienceSize ?? 0 };
  await prisma.newsletterIssue.update({ where: { id: issueId }, data: { status: "publishing" } });
  const { members } = await newsletterAudience();
  let queued = 0;
  for (const m of members) {
    const { subject, html, text } = renderNewsletter(issue, unsubscribePageUrl(m.token));
    const res = await enqueueEmail({
      key: `newsletter:${issueId}:${m.email}`,
      category: "marketing",
      stream: "newsletter",
      template: "newsletter/issue",
      to: m.email,
      leadId: m.leadId,
      newsletterIssueId: issueId,
      subject,
      html,
      text,
      replyTo: ANDY_EMAIL,
      headers: listUnsubscribeHeaders(m.token),
    });
    if (res.created) queued++;
  }
  await prisma.newsletterIssue.update({
    where: { id: issueId },
    data: { status: "published", audienceSize: members.length, publishedAt: new Date(), publishedBy: by },
  });
  return { queued, alreadyPublished: false, audience: members.length };
}

export { NEWSLETTER_CONSENT };
