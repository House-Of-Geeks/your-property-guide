import { describe, expect, it } from "vitest";
import {
  buildCheckInEmailHtml,
  buildIntroConfirmationHtml,
  buildIntroTeamEmailHtml,
  buildPlanEmailHtml,
  introConfirmationSubject,
  introTeamSubject,
} from "@/lib/journey-emails";
import { SEQUENCES, dueAt, sequenceFor } from "@/lib/email-sequences";
import { buildSequenceEmailHtml } from "@/lib/email-sequence-html";
import { buildPlan } from "@/lib/plans/engine";
import { FEE_DISCLOSURE, SERVICES } from "@/lib/service-model";

const person = { firstName: "Sam <b>", lastName: "Ng", email: "sam@example.com", phone: "0491570156", preferredContact: "phone" as const, bestTime: "Mornings" };
const ctx = {
  journey: "selling",
  state: "QLD",
  suburbLabel: "Burpengary, QLD 4505",
  timeframe: "Within 3 months",
  marketingConsent: false,
  consentTexts: { "selling-agent": SERVICES["selling-agent"].permission },
};

describe("introduction emails", () => {
  it("tell the person what really happened, who will contact them and how we're paid", () => {
    const sent = [{ leadId: "l1", service: "selling-agent" as const, status: "sent" as const, feedbackToken: "tok123456789" }];
    const html = buildIntroConfirmationHtml(person, ctx, sent);
    expect(introConfirmationSubject(sent)).toBe("Your request is with one selling agent");
    expect(html).toContain("One participating selling agent");
    expect(html).toContain("by phone");
    expect(html).toContain(FEE_DISCLOSURE.replace(/’/g, "’"));
    expect(html).toContain("/feedback/tok123456789");
    expect(html).toContain("Hi Sam,");
    expect(html).not.toContain("Sam <b>");
    expect(html).not.toContain("<b>");

    const held = [{ leadId: "l2", service: "selling-agent" as const, status: "held" as const, reason: "no suburb: team to confirm the area" }];
    const heldHtml = buildIntroConfirmationHtml(person, ctx, held);
    expect(heldHtml).toContain("Our team has your request");
    expect(heldHtml).not.toContain("One participating selling agent who covers");
  });

  it("give the team the permission wording, the decision and what to do", () => {
    const outcomes = [{ leadId: "l2", service: "selling-agent" as const, status: "held" as const, reason: "selling more than six months out: team to follow up" }];
    expect(introTeamSubject(person, ctx, outcomes)).toMatch(/^\[ACTION\] Introduction request: selling agent/);
    const html = buildIntroTeamEmailHtml(person, ctx, outcomes, [["Landing page", "/guides/real-estate-agent-fees-australia"]]);
    expect(html).toContain("Sam &lt;b&gt;");
    expect(html).not.toContain("Sam <b>");
    expect(html).toContain("Yes, introduce me to one participating local selling agent");
    expect(html).toContain("Preferred contact");
    expect(html).toContain("Phone call");
    expect(html).toContain("/dashboard/admin/leads");
  });

  it("check-in asks how it went, with the feedback link", () => {
    const { subject, html } = buildCheckInEmailHtml({ firstName: "Sam", service: "buyers-agent", feedbackUrl: "https://x.test/feedback/abc" });
    expect(subject).toBe("How did your introduction go?");
    expect(html).toContain("buyer’s agent");
    expect(html).toContain("https://x.test/feedback/abc");
  });
});

describe("plan email", () => {
  it("carries the steps, the disclaimer, and an unsubscribe link only when a series was asked for", () => {
    const plan = buildPlan({ journey: "selling", state: "NSW", timeframe: "0-3-months", sellStage: "preparing" });
    const oneOff = buildPlanEmailHtml({ plan, planUrl: "https://x.test/plan/result?j=selling" });
    expect(oneOff).toContain(plan.nextSteps[0].title);
    expect(oneOff).toContain("isn’t personal financial, legal or real estate advice");
    expect(oneOff).toContain("This is a one-off email");
    expect(oneOff).not.toContain("Unsubscribe");
    const series = buildPlanEmailHtml({ plan, planUrl: "https://x.test/p", sequenceLabel: "getting ready to sell", unsubscribeUrl: "https://x.test/api/unsubscribe?t=abc" });
    expect(series).toContain("Unsubscribe");
  });
});

describe("guidance series", () => {
  it("fits the stage", () => {
    expect(sequenceFor("selling", "thinking")).toBe("seller-early");
    expect(sequenceFor("selling", "choosing-agent")).toBe("seller-choosing");
    expect(sequenceFor("selling", "comparing")).toBe("seller-choosing");
    expect(sequenceFor("buying", "offer")).toBe("buyer-active");
    expect(sequenceFor("buying", "starting")).toBe("buyer-early");
    expect(sequenceFor("buying-and-selling", null)).toBe("mover");
  });

  it("schedules each email from the sign-up date and stops after the last", () => {
    const joined = new Date("2026-10-14T00:00:00Z");
    expect(dueAt("seller-early", 0, joined)?.toISOString()).toBe("2026-10-17T00:00:00.000Z");
    expect(dueAt("seller-early", SEQUENCES["seller-early"].emails.length, joined)).toBeNull();
  });

  it("every email links somewhere real and carries an unsubscribe link, and none asks for an introduction", () => {
    for (const seq of Object.values(SEQUENCES)) {
      seq.emails.forEach((e, i) => {
        const built = buildSequenceEmailHtml(seq.id, i, { unsubscribeUrl: "https://x.test/api/unsubscribe?t=t" })!;
        expect(built.html).toContain("Unsubscribe");
        expect(e.link.href).not.toContain("/get-help");
      });
    }
  });
});
