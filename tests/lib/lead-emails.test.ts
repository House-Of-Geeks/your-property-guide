import { describe, it, expect } from "vitest";
import {
  scoreGuideLead,
  confirmationCopy,
  buildAdminEmailHtml,
  buildConfirmationHtml,
  GUIDE_PDF_URL,
  type LeadEmailData,
} from "@/lib/lead-emails";
import { EMAIL_COLORS } from "@/lib/email-theme";

const guideLead = (overrides: Partial<LeadEmailData> = {}): LeadEmailData => ({
  type: "guide-download",
  firstName: "Sarah",
  email: "sarah@example.com",
  suburb: "burpengary-qld-4505",
  sellingTimeframe: "0-3-months",
  agentStatus: "comparing",
  marketingConsent: false,
  ...overrides,
});

describe("scoreGuideLead", () => {
  it("scores 0-3 months + not listed as HOT", () => {
    expect(scoreGuideLead(guideLead())).toBe("HOT");
    expect(scoreGuideLead(guideLead({ agentStatus: "not-started" }))).toBe("HOT");
  });

  it("scores 3-6 months as WARM", () => {
    expect(scoreGuideLead(guideLead({ sellingTimeframe: "3-6-months" }))).toBe("WARM");
  });

  it("scores longer timeframes and researchers as COLD", () => {
    expect(scoreGuideLead(guideLead({ sellingTimeframe: "6-12-months" }))).toBe("COLD");
    expect(scoreGuideLead(guideLead({ sellingTimeframe: "12-plus-months" }))).toBe("COLD");
    expect(scoreGuideLead(guideLead({ sellingTimeframe: "researching" }))).toBe("COLD");
    expect(scoreGuideLead(guideLead({ sellingTimeframe: undefined }))).toBe("COLD");
  });

  it("already-listed always wins: DO-NOT-CONTACT even on a hot timeframe", () => {
    expect(scoreGuideLead(guideLead({ agentStatus: "already-listed" }))).toBe("DO-NOT-CONTACT");
    expect(
      scoreGuideLead(guideLead({ agentStatus: "already-listed", sellingTimeframe: "0-3-months" })),
    ).toBe("DO-NOT-CONTACT");
  });
});

describe("guide-download confirmation copy", () => {
  it("delivers the PDF download CTA with the value-led subject and preheader", () => {
    const copy = confirmationCopy(guideLead());
    expect(copy.cta?.url).toBe(GUIDE_PDF_URL);
    expect(copy.subject).toBe("Your selling guide + the $20,000 question");
    expect(copy.preheader).toContain("pay for themselves");
  });

  it("each score band gets its own momentum copy", () => {
    const hot = confirmationCopy(guideLead());
    expect(hot.next).toContain("within three months");
    const warm = confirmationCopy(guideLead({ sellingTimeframe: "3-6-months" }));
    expect(warm.next).toContain("sweet spot");
    const cold = confirmationCopy(guideLead({ sellingTimeframe: "researching" }));
    expect(cold.next).not.toContain("within three months");
    expect(cold.next).toContain("pick your moment");
    const listed = confirmationCopy(guideLead({ agentStatus: "already-listed" }));
    expect(listed.next).toContain("already listed");
    expect(listed.next).toContain("go to no one");
  });
});

describe("email branding", () => {
  it("admin email uses the warm brand palette, not the legacy navy", () => {
    const html = buildAdminEmailHtml(guideLead(), "Jane Agent", "suburb-coverage");
    expect(html).toContain(EMAIL_COLORS.ink);
    expect(html).toContain(EMAIL_COLORS.cream);
    expect(html).not.toContain("#1a3a5c");
    expect(html).not.toContain("#93c5fd");
  });

  it("admin email surfaces the score and qualification fields", () => {
    const html = buildAdminEmailHtml(guideLead({ motivation: "Downsizing" }), null, "round-robin");
    expect(html).toContain("HOT");
    expect(html).toContain("Within 3 months");
    expect(html).toContain("Comparing agents now");
    expect(html).toContain("Downsizing");
  });

  it("confirmation email carries the download button, value strip and HOT extras", () => {
    const html = buildConfirmationHtml(guideLead());
    expect(html).toContain(EMAIL_COLORS.terracotta);
    expect(html).toContain(GUIDE_PDF_URL);
    expect(html).toContain("Where the money is");
    expect(html).toContain("$20,000 question");
    // HOT gets the dark appraisal panel and the fast-track P.S.
    expect(html).toContain("Put a number on it");
    expect(html).toContain("fast-track");
    expect(html).not.toContain("#1a3a5c");
  });

  it("COLD emails skip the appraisal panel and P.S.", () => {
    const html = buildConfirmationHtml(guideLead({ sellingTimeframe: "researching" }));
    expect(html).not.toContain("Put a number on it");
    expect(html).not.toContain("fast-track");
  });

  it("non-guide confirmations have no download button or value strip", () => {
    const html = buildConfirmationHtml({
      type: "general-contact",
      firstName: "Marco",
      email: "marco@example.com",
    });
    expect(html).not.toContain(GUIDE_PDF_URL);
    expect(html).not.toContain("Where the money is");
  });
});
