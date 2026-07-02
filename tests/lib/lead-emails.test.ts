import { describe, it, expect } from "vitest";
import {
  scoreGuideLead,
  confirmationCopy,
  buildAdminEmailHtml,
  buildConfirmationHtml,
  buildFailureAlertHtml,
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

const buyerLead = (overrides: Partial<LeadEmailData> = {}): LeadEmailData => ({
  type: "guide-download",
  guideType: "buying",
  firstName: "Sam",
  email: "sam@example.com",
  suburb: "burpengary-qld-4505",
  buyerPersona: "first-home",
  financeStatus: "pre-approved",
  budget: "$750k to $1m",
  sellingTimeframe: "0-3-months",
  marketingConsent: false,
  ...overrides,
});

describe("scoreGuideLead (buying)", () => {
  it("buying soon with finance sorted is HOT", () => {
    expect(scoreGuideLead(buyerLead())).toBe("HOT");
    expect(scoreGuideLead(buyerLead({ financeStatus: "cash" }))).toBe("HOT");
  });

  it("buying soon without finance is only WARM", () => {
    expect(scoreGuideLead(buyerLead({ financeStatus: "talking-to-lenders" }))).toBe("WARM");
    expect(scoreGuideLead(buyerLead({ financeStatus: "not-started" }))).toBe("WARM");
  });

  it("3-6 months is WARM regardless of finance", () => {
    expect(scoreGuideLead(buyerLead({ sellingTimeframe: "3-6-months", financeStatus: "cash" }))).toBe("WARM");
  });

  it("longer timeframes and researchers are COLD", () => {
    expect(scoreGuideLead(buyerLead({ sellingTimeframe: "6-12-months" }))).toBe("COLD");
    expect(scoreGuideLead(buyerLead({ sellingTimeframe: "researching", financeStatus: "cash" }))).toBe("COLD");
  });
});

describe("buying-guide confirmation email", () => {
  it("uses buying subject and links the buying PDF, not the selling one", () => {
    const copy = confirmationCopy(buyerLead());
    expect(copy.subject).toContain("buying guide");
    const html = buildConfirmationHtml(buyerLead());
    expect(html).toContain("buying-property-australia.pdf");
    expect(html).not.toContain("selling-property-australia.pdf");
  });

  it("points buyers at the borrowing power calculator instead of the appraisal", () => {
    const html = buildConfirmationHtml(buyerLead());
    expect(html).toContain("/borrowing-power-calculator");
    expect(html).not.toContain("/appraisal");
  });

  it("admin email surfaces buyer persona, finance and budget", () => {
    const html = buildAdminEmailHtml(buyerLead(), null, "round-robin");
    expect(html).toContain("First home buyer");
    expect(html).toContain("Pre-approved");
    expect(html).toContain("$750k to $1m");
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

// Lead fields arrive from an open POST endpoint, so anything the submitter
// typed must render as text, never as markup, in every email we build.
describe("HTML escaping of lead fields", () => {
  const hostile = guideLead({
    firstName: `<img src="https://evil.example/beacon">Sarah`,
    lastName: `O'Brien <b>CEO</b>`,
    email: `sarah@example.com"><script>alert(1)</script>`,
    message: `Click <a href="https://evil.example/phish">here</a> to verify`,
    suburb: `Burpengary <i>QLD</i>`,
    source: `google" onmouseover="steal()`,
    motivation: `1 > 0 & "downsizing"`,
  });

  it("admin email renders injected markup as text", () => {
    const html = buildAdminEmailHtml(hostile, "Jane Agent", "suburb-coverage");
    expect(html).not.toContain('<img src="https://evil.example');
    expect(html).not.toContain("<script>");
    expect(html).not.toContain('<a href="https://evil.example/phish">');
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&lt;img src=&quot;https://evil.example/beacon&quot;&gt;Sarah");
  });

  it("guide confirmation escapes the first name in the hero headline", () => {
    const html = buildConfirmationHtml(hostile);
    expect(html).not.toContain('<img src="https://evil.example');
    expect(html).toContain("Your guide is ready, &lt;img");
  });

  it("plain confirmation escapes name, suburb and address in the copy", () => {
    const html = buildConfirmationHtml({
      type: "appraisal-request",
      firstName: `<b>Sam</b>`,
      email: "sam@example.com",
      appraisalAddress: `12 <script>x</script> St`,
    });
    expect(html).not.toContain("<b>Sam</b>");
    expect(html).not.toContain("<script>");
    expect(html).toContain("Thanks &lt;b&gt;Sam&lt;/b&gt;.");
    expect(html).toContain("12 &lt;script&gt;x&lt;/script&gt; St");
  });

  it("subjects stay raw text — they are mail headers, not HTML", () => {
    const copy = confirmationCopy({
      type: "suburb-alert",
      firstName: "Sam",
      email: "sam@example.com",
      suburb: "Bray Park & District",
    });
    expect(copy.subject).toContain("Bray Park & District");
    expect(copy.intro).toContain("Bray Park &amp; District");
  });

  it("failure alert escapes lead fields and the SMTP error message", () => {
    const html = buildFailureAlertHtml(
      "lead_123",
      hostile,
      new Error(`550 rejected recipient <sarah@example.com"><script>x</script>>`),
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("550 rejected recipient &lt;");
  });
});
