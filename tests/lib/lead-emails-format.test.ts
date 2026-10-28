import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendMail, transporter } from "@/lib/email";
import { visitorGreeting, visitorSubjectName } from "@/lib/email-format";
import {
  buildAdminEmailHtml,
  buildAdminEmailText,
  buildConfirmationHtml,
  buildConfirmationText,
  buildFailureAlertHtml,
  buildFailureAlertText,
  buildPhoneAddedHtml,
  buildPhoneAddedText,
  confirmationCopy,
  type LeadEmailData,
} from "@/lib/lead-emails";
import { SEQUENCES } from "@/lib/email-sequences";
import { buildSequenceEmailHtml } from "@/lib/email-sequence-html";
import {
  buildCheckInEmailHtml,
  buildIntroConfirmationHtml,
  buildIntroConfirmationText,
  buildIntroTeamEmailHtml,
  buildIntroTeamEmailText,
  buildPlanEmailHtml,
  buildPlanEmailText,
  introTeamSubject,
} from "@/lib/journey-emails";
import { buildPlan } from "@/lib/plans/engine";
import type { IntroService } from "@/lib/service-model";

const PAYLOAD = `<img src=x onerror=alert(1)>"&'`;
const ESCAPED = "&lt;img src=x onerror=alert(1)&gt;&quot;&amp;&#39;";

const lead = (overrides: Partial<LeadEmailData> = {}): LeadEmailData => ({
  type: "general-contact",
  firstName: "Mary",
  lastName: "Lee",
  email: "mary@example.com",
  ...overrides,
});

function assertNoEmDash(parts: Array<string | null | undefined>) {
  for (const part of parts) {
    const value = part ?? "";
    expect(value).not.toContain("\u2014");
    expect(value).not.toContain("&mdash;");
    expect(value).not.toContain("&#8212;");
  }
}

function visibleText(html: string): string {
  return html.replace(/<[^>]+>/g, " ");
}

describe("first-name greeting", () => {
  it("sentence-cases a single-case token and keeps mixed case", () => {
    expect(visitorGreeting("JOS AGUIAR")).toBe("Hi Jos,");
    expect(visitorGreeting("jos")).toBe("Hi Jos,");
    expect(visitorGreeting("MARY")).toBe("Hi Mary,");
    expect(visitorGreeting("McKenzie")).toBe("Hi McKenzie,");
  });

  it("falls back when the name is empty, an email, a URL, or too long", () => {
    expect(visitorGreeting("")).toBe("Hi there,");
    expect(visitorGreeting("   ")).toBe("Hi there,");
    expect(visitorGreeting("jos@x.com")).toBe("Hi there,");
    expect(visitorGreeting("https://example.com")).toBe("Hi there,");
    expect(visitorGreeting("a".repeat(41))).toBe("Hi there,");
  });

  it("collapses spaces and sentence-cases a full name for subjects", () => {
    expect(visitorSubjectName("JOS  AGUIAR")).toBe("Jos Aguiar");
    expect(visitorSubjectName("jos", "AGUIAR")).toBe("Jos Aguiar");
    expect(visitorSubjectName("McKenzie", "Smith")).toBe("McKenzie Smith");
    expect(visitorSubjectName("jos@x.com", "Lee")).toBe("Lee");
  });

  it("confirmationCopy greets Mary from MARY", () => {
    const copy = confirmationCopy(lead({ firstName: "MARY", lastName: undefined, type: "general-contact" }));
    expect(copy.intro.startsWith("Hi Mary,")).toBe(true);
    expect(copy.intro).not.toContain("MARY");
  });

  it("uses the same greeting on introduction, plan, sequence and check-in emails", () => {
    const ctx = { journey: "selling", marketingConsent: false, consentTexts: {} };
    const outcomes = [{ leadId: "l1", service: "selling-agent" as const, status: "held" as const }];
    expect(buildIntroConfirmationHtml({ firstName: "JOS AGUIAR", email: "j@example.com" }, ctx, outcomes)).toContain("Hi Jos,");
    expect(buildIntroConfirmationHtml({ firstName: "jos", email: "j@example.com" }, ctx, outcomes)).toContain("Hi Jos,");
    expect(buildIntroConfirmationHtml({ firstName: "McKenzie", email: "j@example.com" }, ctx, outcomes)).toContain("Hi McKenzie,");
    expect(buildIntroConfirmationHtml({ firstName: "", email: "j@example.com" }, ctx, outcomes)).toContain("Hi there,");
    expect(buildIntroConfirmationHtml({ firstName: "jos@x.com", email: "j@example.com" }, ctx, outcomes)).toContain("Hi there,");

    const plan = buildPlan({ journey: "selling", state: null, timeframe: null, sellStage: "preparing" });
    expect(buildPlanEmailHtml({ firstName: "JOS AGUIAR", plan, planUrl: "https://www.yourpropertyguide.com.au/plan" })).toContain("Hi Jos,");
    expect(buildPlanEmailHtml({ firstName: "", plan, planUrl: "https://www.yourpropertyguide.com.au/plan" })).toContain("Hi there,");

    const sequence = buildSequenceEmailHtml("seller-early", 0, { firstName: "jos", unsubscribeUrl: "https://www.yourpropertyguide.com.au/api/unsubscribe?t=abc" });
    expect(sequence?.html).toContain("Hi Jos,");
    const blank = buildSequenceEmailHtml("seller-early", 0, { firstName: "jos@x.com", unsubscribeUrl: "https://www.yourpropertyguide.com.au/api/unsubscribe?t=abc" });
    expect(blank?.html).toContain("Hi there,");

    expect(buildCheckInEmailHtml({ firstName: "MARY", service: "selling-agent", feedbackUrl: "https://www.yourpropertyguide.com.au/feedback/abc" }).html).toContain("Hi Mary,");
    expect(introTeamSubject({ firstName: "JOS", lastName: "AGUIAR", email: "j@example.com" }, ctx, outcomes)).toContain("Jos Aguiar");
  });
});

describe("HTML escaping", () => {
  it("escapes the payload in every lead template and keeps the raw tag out", () => {
    const hostile = lead({
      firstName: PAYLOAD,
      lastName: PAYLOAD,
      email: `${PAYLOAD}@example.com`,
      phone: PAYLOAD,
      message: PAYLOAD,
      suburb: PAYLOAD,
      source: PAYLOAD,
      appraisalAddress: PAYLOAD,
    });
    const htmls = [
      buildConfirmationHtml(hostile),
      buildConfirmationHtml({ ...hostile, type: "appraisal-request" }),
      buildConfirmationHtml({ ...hostile, type: "guide-download", sellingTimeframe: "0-3-months", agentStatus: "comparing" }),
      buildAdminEmailHtml(hostile, PAYLOAD, PAYLOAD, [["Landing page", PAYLOAD]]),
      buildFailureAlertHtml(PAYLOAD, hostile, new Error(PAYLOAD)),
      buildPhoneAddedHtml(
        { id: PAYLOAD, type: "general-contact", firstName: PAYLOAD, lastName: PAYLOAD, email: `${PAYLOAD}@example.com`, suburb: PAYLOAD, source: PAYLOAD },
        PAYLOAD,
      ),
    ];
    for (const html of htmls) {
      expect(html).not.toContain(PAYLOAD);
      expect(html).not.toContain("<img src=x");
      expect(html).not.toContain("<Img src=x");
    }
    expect(buildConfirmationHtml({ ...hostile, type: "general-contact" })).toContain("Hi &lt;Img,");
    expect(buildConfirmationHtml({ ...hostile, type: "appraisal-request" })).toContain(ESCAPED);
    expect(buildAdminEmailHtml(hostile, null, "")).toContain(ESCAPED);
    expect(buildPhoneAddedHtml(
      { id: "lead_1", type: "general-contact", firstName: PAYLOAD, lastName: null, email: "m@example.com", suburb: null, source: null },
      PAYLOAD,
    )).toContain(`tel:${ESCAPED}`);
  });

  it("escapes the payload in introduction, plan, sequence and check-in emails", () => {
    const person = { firstName: PAYLOAD, lastName: PAYLOAD, email: `${PAYLOAD}@example.com`, phone: PAYLOAD, notes: PAYLOAD };
    const ctx = {
      journey: "selling",
      suburbLabel: PAYLOAD,
      notes: PAYLOAD,
      marketingConsent: false,
      consentTexts: { "selling-agent": PAYLOAD } as Partial<Record<IntroService, string>>,
    };
    const outcomes = [{ leadId: PAYLOAD, service: "selling-agent" as const, status: "held" as const, reason: PAYLOAD, feedbackToken: "tok_abc" }];
    const plan = buildPlan({ journey: "selling", state: null, timeframe: null, sellStage: "preparing" });
    const withFullPayload = [
      buildIntroConfirmationHtml(person, ctx, outcomes),
      buildIntroTeamEmailHtml(person, ctx, outcomes, [["Referrer", PAYLOAD]]),
    ];
    const greetingsOnly = [
      buildPlanEmailHtml({ firstName: PAYLOAD, plan, planUrl: "https://www.yourpropertyguide.com.au/plan" }),
      buildCheckInEmailHtml({ firstName: PAYLOAD, service: "selling-agent", feedbackUrl: "https://www.yourpropertyguide.com.au/feedback/abc" }).html,
      buildSequenceEmailHtml("buyer-early", 0, { firstName: PAYLOAD, unsubscribeUrl: "https://www.yourpropertyguide.com.au/api/unsubscribe?t=abc" })!.html,
    ];
    for (const html of [...withFullPayload, ...greetingsOnly]) {
      expect(html).not.toContain(PAYLOAD);
      expect(html).not.toContain("<img src=x");
    }
    for (const html of withFullPayload) expect(html).toContain(ESCAPED);
    for (const html of greetingsOnly) expect(html).toContain("Hi &lt;Img,");
  });
});

describe("links and plain text", () => {
  it("shows guide links as buttons, with the URL once in the text part", () => {
    const guide = lead({ type: "guide-download", firstName: "Mary", sellingTimeframe: "0-3-months", agentStatus: "comparing", guideType: "selling" });
    const html = buildConfirmationHtml(guide);
    const text = buildConfirmationText(guide);
    expect(visibleText(html)).not.toMatch(/https?:\/\//);
    expect(html).toContain("Download your guide (PDF)");
    expect(html).toContain("How introductions work");
    expect(text).toContain("Download your guide (PDF)\nhttps://www.yourpropertyguide.com.au/");
    expect(text).toContain("How introductions work\nhttps://www.yourpropertyguide.com.au/get-help");
    expect(text.split("https://www.yourpropertyguide.com.au/get-help").length - 1).toBe(1);
  });
});

describe("no em dash in rendered emails", () => {
  const guideBands: Array<Partial<LeadEmailData>> = [
    { type: "guide-download", guideType: "selling", sellingTimeframe: "0-3-months", agentStatus: "comparing" },
    { type: "guide-download", guideType: "selling", sellingTimeframe: "3-6-months", agentStatus: "comparing" },
    { type: "guide-download", guideType: "selling", sellingTimeframe: "researching", agentStatus: "not-started" },
    { type: "guide-download", guideType: "selling", sellingTimeframe: "0-3-months", agentStatus: "already-listed" },
    { type: "guide-download", guideType: "selling", callKind: "agent" },
    { type: "guide-download", guideType: "selling", callKind: "ypg" },
    { type: "guide-download", guideType: "buying", sellingTimeframe: "0-3-months", financeStatus: "pre-approved" },
    { type: "guide-download", guideType: "buying", sellingTimeframe: "3-6-months", financeStatus: "not-started" },
    { type: "guide-download", guideType: "buying", sellingTimeframe: "researching", financeStatus: "not-started" },
    { type: "appraisal-request", appraisalAddress: "15 Smith St" },
    { type: "rental-appraisal", address: "15 Smith St", tenanted: "yes", managerTimeframe: "asap" },
    { type: "agreement-check", agencyName: "Northside", signDate: "2026-10-20" },
    { type: "match-request", suburb: "Paddington" },
    { type: "suburb-alert", suburb: "Paddington" },
    { type: "off-market-register", suburb: "Paddington" },
    { type: "house-and-land-enquiry" },
    { type: "property-interest" },
    { type: "property-enquiry" },
    { type: "general-contact", message: "Hello there" },
  ];

  it("lead confirmations, admin alerts and phone-added emails", () => {
    for (const sample of guideBands) {
      const row = lead(sample);
      const copy = confirmationCopy(row);
      assertNoEmDash([copy.subject, copy.intro, copy.next, copy.preheader, buildConfirmationHtml(row), buildConfirmationText(row)]);
    }
    const row = lead({ message: "Please call", phone: "0400000000" });
    assertNoEmDash([
      buildAdminEmailHtml(row, "Jane Agent", "suburb-coverage", [["Landing page", "/guides"]], [["Path", "Learning"]]),
      buildAdminEmailText(row, "Jane Agent", "suburb-coverage", [["Landing page", "/guides"]], [["Path", "Learning"]]),
      buildFailureAlertHtml("lead_1", row, new Error("SMTP down")),
      buildFailureAlertText("lead_1", row, new Error("SMTP down")),
      buildPhoneAddedHtml({ id: "lead_1", type: "general-contact", firstName: "Mary", lastName: "Lee", email: "mary@example.com", suburb: "Paddington", source: "guide" }, "0400000000"),
      buildPhoneAddedText({ id: "lead_1", type: "general-contact", firstName: "Mary", lastName: "Lee", email: "mary@example.com", suburb: "Paddington", source: "guide" }, "0400000000"),
    ]);
  });

  it("introduction, plan, check-in and guidance emails", () => {
    const person = { firstName: "Mary", lastName: "Lee", email: "mary@example.com", phone: "0400000000", preferredContact: "phone" as const };
    const ctx = { journey: "selling", state: "QLD", suburbLabel: "Paddington, QLD", marketingConsent: false, consentTexts: { "selling-agent": "Yes, introduce me." } as Partial<Record<IntroService, string>> };
    for (const status of ["sent", "held", "not-introduced"] as const) {
      const outcomes = [{ leadId: "l1", service: "selling-agent" as const, status, reason: status === "not-introduced" ? "already listed" : "review", feedbackToken: "tok123", delivery: "Sent 24/7" }];
      assertNoEmDash([
        introTeamSubject(person, ctx, outcomes),
        buildIntroTeamEmailHtml(person, ctx, outcomes, [["Landing page", "/guides"]]),
        buildIntroTeamEmailText(person, ctx, outcomes, [["Landing page", "/guides"]]),
        buildIntroConfirmationHtml(person, ctx, outcomes),
        buildIntroConfirmationText(person, ctx, outcomes),
      ]);
    }
    const plan = buildPlan({ journey: "selling", state: "QLD", timeframe: "0-3-months", sellStage: "preparing" });
    const planInput = { firstName: "Mary", plan, planUrl: "https://www.yourpropertyguide.com.au/plan/result?j=selling", sequenceLabel: "getting ready to sell", unsubscribeUrl: "https://www.yourpropertyguide.com.au/api/unsubscribe?t=abc" };
    assertNoEmDash([plan.title, buildPlanEmailHtml(planInput), buildPlanEmailText(planInput)]);
    const checkIn = buildCheckInEmailHtml({ firstName: "Mary", service: "buyers-agent", feedbackUrl: "https://www.yourpropertyguide.com.au/feedback/abc" });
    assertNoEmDash([checkIn.subject, checkIn.html, checkIn.text]);
    for (const seq of Object.values(SEQUENCES)) {
      seq.emails.forEach((_, step) => {
        const built = buildSequenceEmailHtml(seq.id, step, { firstName: "Mary", unsubscribeUrl: "https://www.yourpropertyguide.com.au/api/unsubscribe?t=abc" });
        assertNoEmDash([built?.subject, built?.html, built?.text]);
      });
    }
  });
});

describe("sendMail click tracking", () => {
  const previous = process.env.EMAIL_TRANSPORT;

  beforeEach(() => {
    delete process.env.EMAIL_TRANSPORT;
  });

  afterEach(() => {
    if (previous === undefined) delete process.env.EMAIL_TRANSPORT;
    else process.env.EMAIL_TRANSPORT = previous;
    vi.restoreAllMocks();
  });

  it("sends X-SMTPAPI with click and open tracking disabled and keeps caller headers", async () => {
    const spy = vi.spyOn(transporter, "sendMail").mockResolvedValue({} as never);
    await sendMail({
      to: "mary@example.com",
      subject: "Hi Mary",
      html: "<p>Hi Mary</p>",
      text: "Hi Mary",
      headers: {
        "X-Custom": "ypg",
        "X-SMTPAPI": JSON.stringify({ unique_args: { lead: "1" }, filters: { opentrack: { settings: { enable: 1 } } } }),
      },
    });
    expect(spy).toHaveBeenCalledTimes(1);
    const sent = spy.mock.calls[0][0] as { headers?: Record<string, string>; text?: string };
    expect(sent.headers?.["X-Custom"]).toBe("ypg");
    expect(sent.text).toBe("Hi Mary");
    const smtp = JSON.parse(sent.headers?.["X-SMTPAPI"] ?? "{}") as {
      unique_args?: { lead?: string };
      filters?: { clicktrack?: { settings?: { enable?: number; enable_text?: number } }; opentrack?: { settings?: { enable?: number } } };
    };
    expect(smtp.filters?.clicktrack?.settings).toEqual({ enable: 0, enable_text: 0 });
    // Open tracking is always off for our mail (21 Oct 2026): delivery is
    // reported from the Event Webhook, not a tracking pixel.
    expect(smtp.filters?.opentrack?.settings?.enable).toBe(0);
    expect(smtp.unique_args?.lead).toBe("1");
  });

  it("adds the queue's opaque id as a SendGrid custom argument, and returns the queue id", async () => {
    const spy = vi.spyOn(transporter, "sendMail").mockResolvedValue({ response: "250 Ok: queued as AbC-123.x" } as never);
    const result = await sendMail({ to: "mary@example.com", subject: "Hi", html: "<p>Hi</p>", customArgs: { ypg_mid: "cmabc123" }, categories: ["ypg", "plan"] });
    const smtp = JSON.parse((spy.mock.calls[0][0] as { headers: Record<string, string> }).headers["X-SMTPAPI"]) as { unique_args?: Record<string, string>; category?: string[] };
    expect(smtp.unique_args).toEqual({ ypg_mid: "cmabc123" });
    expect(smtp.category).toEqual(["ypg", "plan"]);
    expect(result).toEqual({ response: "250 Ok: queued as AbC-123.x", providerMessageId: "AbC-123.x", logged: false });
  });
});
