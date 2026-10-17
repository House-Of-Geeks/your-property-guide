// Emails for the two paths (Oct 2026): introduction requests (the team's
// notification and the person's confirmation, both written from the real
// outcome) and next-step plans. Pure string builders, unit-tested.

import { EMAIL_COLORS, emailButton, emailButtonOutline, emailLayout } from "@/lib/email-theme";
import { escapeHtml, textBlocks, visitorGreeting, visitorSubjectName } from "@/lib/email-format";
import { SITE_URL } from "@/lib/constants/seo";
import {
  FEE_DISCLOSURE,
  FEE_DISTINCTION,
  RESPONSE_WINDOW,
  SERVICES,
  WHAT_WE_DONT_DO,
  type ContactMethod,
  type IntroService,
} from "@/lib/service-model";
import { STATUS_LABELS, outcomeCopy, type IntroStatus } from "@/lib/introductions/rules";
import { PLAN_DISCLAIMER, type Plan } from "@/lib/plans/engine";

const C = EMAIL_COLORS;

export function esc(s: string | null | undefined): string {
  return escapeHtml(s ?? "");
}

const abs = (href: string) => (href.startsWith("http") ? href : `${SITE_URL}${href}`);

function rowsTable(rows: Array<[string, string]>): string {
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;">${rows
    .map(
      ([label, value]) => `<tr>
        <td style="padding:7px 12px 7px 24px;font-weight:600;vertical-align:top;width:140px;max-width:140px;color:${C.inkMuted};background:${C.cream};border-bottom:1px solid ${C.line};">${esc(label)}</td>
        <td style="padding:7px 24px 7px 12px;color:${C.ink};border-bottom:1px solid ${C.line};overflow-wrap:anywhere;word-break:break-word;">${esc(value)}</td>
      </tr>`,
    )
    .join("")}</table>`;
}

const CONTACT_LABELS: Record<ContactMethod, string> = { phone: "Phone call", sms: "Text message", email: "Email" };

// ---------------------------------------------------------------------------
// Introductions
// ---------------------------------------------------------------------------

export interface IntroEmailPerson {
  firstName: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  preferredContact?: ContactMethod | null;
  bestTime?: string | null;
}

export interface IntroEmailOutcome {
  leadId: string;
  service: IntroService;
  status: IntroStatus;
  reason?: string | null;
  delivery?: string | null;
  feedbackToken?: string | null;
}

export interface IntroEmailContext {
  journey: string;
  state?: string | null;
  suburbLabel?: string | null;
  propertyType?: string | null;
  timeframe?: string | null;
  proStatus?: string | null;
  buyerType?: string | null;
  budget?: string | null;
  notes?: string | null;
  marketingConsent: boolean;
  /** The exact permission statement(s) ticked, by service. */
  consentTexts: Partial<Record<IntroService, string>>;
}

/** Subject for the team: what, who, where, and whether it already went to a partner. */
export function introTeamSubject(person: IntroEmailPerson, ctx: IntroEmailContext, outcomes: IntroEmailOutcome[]): string {
  const what = outcomes.map((o) => SERVICES[o.service].short).join(" + ");
  const flag = outcomes.some((o) => o.status === "held") ? "[ACTION] " : outcomes.every((o) => o.status === "sent") ? "[SENT] " : "";
  const where = ctx.suburbLabel ? ` (${ctx.suburbLabel})` : ctx.state ? ` (${ctx.state})` : "";
  const name = visitorSubjectName(person.firstName, person.lastName);
  return `${flag}Introduction request: ${what}${name ? `, ${name}` : ""}${where}`;
}

export function buildIntroTeamEmailHtml(
  person: IntroEmailPerson,
  ctx: IntroEmailContext,
  outcomes: IntroEmailOutcome[],
  attributionRows: Array<[string, string]> = [],
): string {
  const rows: Array<[string, string]> = [
    ["Name", `${person.firstName}${person.lastName ? ` ${person.lastName}` : ""}`],
    ["Email", person.email],
    ...(person.phone ? ([["Phone", person.phone]] as Array<[string, string]>) : []),
    ["Preferred contact", person.preferredContact ? CONTACT_LABELS[person.preferredContact] : "Not given"],
    ...(person.bestTime ? ([["Best time", person.bestTime]] as Array<[string, string]>) : []),
    ["Journey", ctx.journey],
    ...(ctx.state ? ([["State", ctx.state]] as Array<[string, string]>) : []),
    ...(ctx.suburbLabel ? ([["Suburb", ctx.suburbLabel]] as Array<[string, string]>) : []),
    ...(ctx.propertyType ? ([["Property type", ctx.propertyType]] as Array<[string, string]>) : []),
    ...(ctx.buyerType ? ([["Buyer type", ctx.buyerType]] as Array<[string, string]>) : []),
    ...(ctx.budget ? ([["Budget", ctx.budget]] as Array<[string, string]>) : []),
    ...(ctx.timeframe ? ([["Timeframe", ctx.timeframe]] as Array<[string, string]>) : []),
    ...(ctx.proStatus ? ([["Working with an agent?", ctx.proStatus]] as Array<[string, string]>) : []),
    ...(ctx.notes ? ([["Their note", ctx.notes]] as Array<[string, string]>) : []),
    ["Marketing emails", ctx.marketingConsent ? "Yes (ticked the separate box)" : "No"],
  ];
  const outcomeBlocks = outcomes
    .map(
      (o) => `
      <p style="margin:22px 24px 8px;font-size:14px;font-weight:700;color:${C.ink};">${esc(SERVICES[o.service].label)}: ${esc(STATUS_LABELS[o.status])}</p>
      ${rowsTable([
        ["Lead id", o.leadId],
        ["Decision", o.reason ?? (o.status === "sent" ? "Delivered to the partner channel" : "-")],
        ...(o.delivery ? ([["Delivery", o.delivery]] as Array<[string, string]>) : []),
        ["Permission ticked", ctx.consentTexts[o.service] ?? "-"],
        [
          "What to do",
          o.status === "held"
            ? `Review and reply to them ${RESPONSE_WINDOW}: introduce a participating ${SERVICES[o.service].short} if one covers the area, or tell them we can't. Record the outcome in /dashboard/admin/leads.`
            : o.status === "sent"
              ? "Nothing now. Record acceptance, appointment and signing in /dashboard/admin/leads as they're confirmed."
              : "Don't pass these details to any agent.",
        ],
      ])}`,
    )
    .join("");
  const attribution = attributionRows.length
    ? `<p style="margin:24px 24px 8px;font-size:13px;color:${C.inkMuted};">How they found us</p>${rowsTable(attributionRows)}`
    : "";
  return emailLayout({
    title: "Introduction request",
    body: `${rowsTable(rows)}${outcomeBlocks}${attribution}`,
    footer: `Submitted via yourpropertyguide.com.au · ${new Date().toLocaleString("en-AU", { timeZone: "Australia/Brisbane" })} AEST`,
  });
}

export function introConfirmationSubject(outcomes: IntroEmailOutcome[]): string {
  if (outcomes.length === 1 && outcomes[0].status === "sent") return `Your request is with one ${SERVICES[outcomes[0].service].short}`;
  if (outcomes.every((o) => o.status === "not-introduced")) return "We haven’t passed your details to anyone";
  return "We’ve got your request: here’s what happens next";
}

export function buildIntroConfirmationHtml(
  person: IntroEmailPerson,
  ctx: IntroEmailContext,
  outcomes: IntroEmailOutcome[],
): string {
  const blocks = outcomes
    .map((o) => {
      const copy = outcomeCopy({ service: o.service, status: o.status, reason: o.reason, areaLabel: ctx.suburbLabel, contact: person.preferredContact });
      return `
      <tr><td style="padding:0 28px 18px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.line};border-radius:8px;">
          <tr><td style="padding:16px 18px;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:${C.inkMuted};">${esc(SERVICES[o.service].label)}</p>
            <p style="margin:0 0 8px;font-size:17px;font-weight:700;color:${C.ink};">${esc(copy.headline)}</p>
            <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:${C.ink};">${esc(copy.body)}</p>
            <p style="margin:0;font-size:13px;color:${C.inkMuted};"><strong style="color:${C.ink};">Who will contact you:</strong> ${esc(copy.who)}</p>
          </td></tr>
        </table>
      </td></tr>`;
    })
    .join("");
  const anySent = outcomes.some((o) => o.status === "sent" || o.status === "held");
  const feedback = outcomes.find((o) => o.feedbackToken && (o.status === "sent" || o.status === "held"));
  return emailLayout({
    preheader: introConfirmationSubject(outcomes),
    body: `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:24px 28px 14px;">
        <p style="margin:0;font-size:15px;line-height:1.6;color:${C.ink};">${esc(visitorGreeting(person.firstName))} thanks for asking. Here’s exactly what happens with your request.</p>
      </td></tr>
      ${blocks}
      <tr><td style="padding:4px 28px 0;">
        ${anySent ? `<p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:${C.ink};"><strong>Before you meet anyone:</strong> ${esc(FEE_DISTINCTION)}</p>` : ""}
        <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:${C.inkMuted};">${esc(FEE_DISCLOSURE)}</p>
        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:${C.ink};">What we don’t do</p>
        <ul style="margin:0 0 16px;padding-left:18px;font-size:13px;line-height:1.6;color:${C.inkMuted};">${WHAT_WE_DONT_DO.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        ${feedback ? `<p style="margin:0 0 16px;font-size:13px;line-height:1.6;color:${C.inkMuted};">In a week or two we’ll ask whether the introduction was useful. You can also tell us any time: <a href="${esc(abs(`/feedback/${feedback.feedbackToken}`))}" style="color:${C.terracottaDark};">how did it go?</a></p>` : ""}
        <p style="margin:0 0 6px;">${emailButtonOutline("Your free guides and tools", abs("/guides"))}</p>
        <p style="margin:18px 0 24px;font-size:14px;line-height:1.5;color:${C.inkMuted};">Questions? Reply to this email and a person will answer.<br/><span style="color:${C.ink};">The team at Your Property Guide</span></p>
      </td></tr>
    </table>`,
  });
}

// ---------------------------------------------------------------------------
// Plans
// ---------------------------------------------------------------------------

export function planEmailSubject(plan: Plan): string {
  return plan.title;
}

export function buildPlanEmailHtml(input: {
  firstName?: string | null;
  plan: Plan;
  planUrl: string;
  sequenceLabel?: string | null;
  unsubscribeUrl?: string | null;
}): string {
  const { plan } = input;
  const steps = plan.nextSteps
    .map(
      (s, i) => `
      <tr><td style="padding:0 28px 14px;">
        <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:${C.ink};">${i + 1}. ${esc(s.title)}</p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:${C.ink};">${esc(s.body)}${s.link ? ` <a href="${esc(abs(s.link.href))}" style="color:${C.terracottaDark};">${esc(s.link.label)}</a>` : ""}</p>
      </td></tr>`,
    )
    .join("");
  const links = (title: string, items: { label: string; href: string; note: string }[]) =>
    items.length
      ? `<tr><td style="padding:8px 28px 4px;"><p style="margin:0 0 6px;font-size:13px;font-weight:700;color:${C.inkMuted};">${esc(title)}</p>
        <ul style="margin:0 0 8px;padding-left:18px;font-size:14px;line-height:1.6;color:${C.ink};">${items
          .map((l) => `<li><a href="${esc(abs(l.href))}" style="color:${C.terracottaDark};">${esc(l.label)}</a>: ${esc(l.note)}</li>`)
          .join("")}</ul></td></tr>`
      : "";
  const checklist = `<tr><td style="padding:8px 28px 4px;"><p style="margin:0 0 6px;font-size:13px;font-weight:700;color:${C.inkMuted};">${esc(plan.checklist.title)}</p>${plan.checklist.groups
    .map(
      (g) => `<p style="margin:8px 0 4px;font-size:14px;font-weight:700;color:${C.ink};">${esc(g.heading)}</p>
      <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.6;color:${C.ink};">${g.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul>`,
    )
    .join("")}</td></tr>`;
  const questions = `<tr><td style="padding:12px 28px 4px;"><p style="margin:0 0 6px;font-size:13px;font-weight:700;color:${C.inkMuted};">Questions to settle</p>
    <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.6;color:${C.ink};">${plan.questions.map((q) => `<li>${esc(q)}</li>`).join("")}</ul></td></tr>`;
  const help =
    plan.help.level !== "none" && plan.help.cta
      ? `<tr><td style="padding:16px 28px 4px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};border-radius:8px;"><tr><td style="padding:16px 18px;">
          <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:${C.ink};">${esc(plan.help.headline)}</p>
          <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:${C.ink};">${esc(plan.help.body)}</p>
          ${emailButtonOutline(plan.help.cta.label, abs(plan.help.cta.href))}
        </td></tr></table></td></tr>`
      : "";
  const sequenceNote = input.sequenceLabel
    ? `You asked for our short ${esc(input.sequenceLabel)} email series. The next one arrives in a few days.`
    : "This is a one-off email. We won’t send you anything else unless you asked for it.";
  const unsubscribe = input.unsubscribeUrl ? ` <a href="${esc(input.unsubscribeUrl)}" style="color:${C.inkSubtle};">Unsubscribe</a>` : "";
  return emailLayout({
    preheader: plan.intro,
    body: `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:24px 28px 8px;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:${C.inkMuted};">Your next-step plan</p>
        <h2 style="margin:0 0 10px;font-size:22px;line-height:1.25;color:${C.ink};">${esc(plan.title)}</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${C.ink};">${esc(visitorGreeting(input.firstName))} here’s the plan you made. ${esc(plan.intro)}</p>
        <p style="margin:0 0 18px;">${emailButton("Open your plan", input.planUrl)}</p>
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:${C.inkMuted};">Your next three steps</p>
      </td></tr>
      ${steps}
      ${links("Tools", plan.tools)}
      ${links("Guides", plan.guides)}
      ${checklist}
      ${questions}
      ${help}
      <tr><td style="padding:16px 28px 24px;">
        <p style="margin:0 0 10px;font-size:12px;line-height:1.6;color:${C.inkSubtle};">${esc(PLAN_DISCLAIMER)}</p>
        <p style="margin:0;font-size:12px;line-height:1.6;color:${C.inkSubtle};">${sequenceNote}${unsubscribe}</p>
      </td></tr>
    </table>`,
  });
}

// ---------------------------------------------------------------------------
// The check-in after an introduction
// ---------------------------------------------------------------------------

export function buildCheckInEmailHtml(input: { firstName: string; service: IntroService; feedbackUrl: string }): { subject: string; html: string; text: string } {
  const pro = SERVICES[input.service].short;
  const subject = "How did your introduction go?";
  const text = textBlocks([
    visitorGreeting(input.firstName),
    `A little while ago you asked us to introduce you to a ${pro}. Did they get in touch, and was it useful? Your answer decides which agents keep receiving introductions from us.`,
    `Tell us how it went\n${input.feedbackUrl}`,
    "Four quick questions. If nobody contacted you, tell us and we’ll follow it up.",
  ]);
  return {
    subject,
    html: emailLayout({
      preheader: `Two minutes to tell us whether the ${pro} we introduced was useful.`,
      body: `
      <div style="padding:24px 28px;">
        <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:${C.ink};">${esc(visitorGreeting(input.firstName))}</p>
        <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:${C.ink};">A little while ago you asked us to introduce you to a ${esc(pro)}. Did they get in touch, and was it useful? Your answer decides which agents keep receiving introductions from us.</p>
        <p style="margin:0 0 20px;">${emailButton("Tell us how it went", input.feedbackUrl)}</p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:${C.inkMuted};">Four quick questions. If nobody contacted you, tell us and we’ll follow it up.</p>
      </div>`,
    }),
    text,
  };
}

export function buildIntroTeamEmailText(
  person: IntroEmailPerson,
  ctx: IntroEmailContext,
  outcomes: IntroEmailOutcome[],
  attributionRows: Array<[string, string]> = [],
): string {
  const lines = [
    "Introduction request",
    "",
    `Name: ${person.firstName}${person.lastName ? ` ${person.lastName}` : ""}`,
    `Email: ${person.email}`,
    person.phone ? `Phone: ${person.phone}` : null,
    `Preferred contact: ${person.preferredContact ? CONTACT_LABELS[person.preferredContact] : "Not given"}`,
    person.bestTime ? `Best time: ${person.bestTime}` : null,
    `Journey: ${ctx.journey}`,
    ctx.state ? `State: ${ctx.state}` : null,
    ctx.suburbLabel ? `Suburb: ${ctx.suburbLabel}` : null,
    ctx.propertyType ? `Property type: ${ctx.propertyType}` : null,
    ctx.buyerType ? `Buyer type: ${ctx.buyerType}` : null,
    ctx.budget ? `Budget: ${ctx.budget}` : null,
    ctx.timeframe ? `Timeframe: ${ctx.timeframe}` : null,
    ctx.proStatus ? `Working with an agent?: ${ctx.proStatus}` : null,
    ctx.notes ? `Their note: ${ctx.notes}` : null,
    `Marketing emails: ${ctx.marketingConsent ? "Yes (ticked the separate box)" : "No"}`,
  ].filter((line): line is string => line !== null);
  for (const o of outcomes) {
    lines.push("", `${SERVICES[o.service].label}: ${STATUS_LABELS[o.status]}`);
    lines.push(`Lead id: ${o.leadId}`);
    lines.push(`Decision: ${o.reason ?? (o.status === "sent" ? "Delivered to the partner channel" : "-")}`);
    if (o.delivery) lines.push(`Delivery: ${o.delivery}`);
    lines.push(`Permission ticked: ${ctx.consentTexts[o.service] ?? "-"}`);
  }
  if (attributionRows.length) {
    lines.push("", "How they found us");
    for (const [label, value] of attributionRows) lines.push(`${label}: ${value}`);
  }
  return lines.join("\n").trim();
}

export function buildIntroConfirmationText(
  person: IntroEmailPerson,
  ctx: IntroEmailContext,
  outcomes: IntroEmailOutcome[],
): string {
  const blocks = outcomes.map((o) => {
    const copy = outcomeCopy({ service: o.service, status: o.status, reason: o.reason, areaLabel: ctx.suburbLabel, contact: person.preferredContact });
    return `${copy.headline}\n${copy.body}\nWho will contact you: ${copy.who}`;
  });
  const feedback = outcomes.find((o) => o.feedbackToken && (o.status === "sent" || o.status === "held"));
  return textBlocks([
    `${visitorGreeting(person.firstName)} thanks for asking. Here’s exactly what happens with your request.`,
    ...blocks,
    outcomes.some((o) => o.status === "sent" || o.status === "held") ? `Before you meet anyone: ${FEE_DISTINCTION}` : null,
    FEE_DISCLOSURE,
    `What we don’t do\n${WHAT_WE_DONT_DO.map((t) => `- ${t}`).join("\n")}`,
    feedback ? `How did it go?\n${abs(`/feedback/${feedback.feedbackToken}`)}` : null,
    `Your free guides and tools\n${abs("/guides")}`,
    "Questions? Reply to this email and a person will answer.\nThe team at Your Property Guide",
  ]);
}

export function buildPlanEmailText(input: {
  firstName?: string | null;
  plan: Plan;
  planUrl: string;
  sequenceLabel?: string | null;
  unsubscribeUrl?: string | null;
}): string {
  const { plan } = input;
  const steps = plan.nextSteps
    .map((s, i) => `${i + 1}. ${s.title}\n${s.body}${s.link ? `\n${s.link.label}\n${abs(s.link.href)}` : ""}`)
    .join("\n\n");
  const linkList = (title: string, items: { label: string; href: string; note: string }[]) =>
    items.length ? `${title}\n${items.map((l) => `${l.label}: ${l.note}\n${abs(l.href)}`).join("\n")}` : null;
  const checklist = [
    plan.checklist.title,
    ...plan.checklist.groups.map((g) => `${g.heading}\n${g.items.map((it) => `- ${it}`).join("\n")}`),
  ].join("\n\n");
  return textBlocks([
    `${visitorGreeting(input.firstName)} here’s the plan you made. ${plan.intro}`,
    `Open your plan\n${input.planUrl}`,
    `Your next three steps\n\n${steps}`,
    linkList("Tools", plan.tools),
    linkList("Guides", plan.guides),
    checklist,
    `Questions to settle\n${plan.questions.map((q) => `- ${q}`).join("\n")}`,
    plan.help.level !== "none" && plan.help.cta ? `${plan.help.headline}\n${plan.help.body}\n${plan.help.cta.label}\n${abs(plan.help.cta.href)}` : null,
    PLAN_DISCLAIMER,
    input.sequenceLabel
      ? `You asked for our short ${input.sequenceLabel} email series. The next one arrives in a few days.`
      : "This is a one-off email. We won’t send you anything else unless you asked for it.",
    input.unsubscribeUrl ? `Unsubscribe\n${input.unsubscribeUrl}` : null,
  ]);
}
