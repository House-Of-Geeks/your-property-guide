import { describe, it, expect, vi } from "vitest";

const m = vi.hoisted(() => ({ sendMail: vi.fn() }));
vi.mock("@/lib/email", async (importOriginal) => ({ ...(await importOriginal<typeof import("@/lib/email")>()), sendMail: m.sendMail }));

import { buildSignInEmail, sendSignInEmail } from "@/lib/mail/sign-in";

// The dashboard sign-in link (21 Oct 2026): branded, and sent through
// sendMail (click tracking off) rather than next-auth's default template.

const URL_ = "https://www.yourpropertyguide.com.au/api/auth/callback/nodemailer?token=abc&email=a%40b.com";

describe("sign-in email", () => {
  it("carries the link in the button, as text, and in the plain-text part", () => {
    const e = buildSignInEmail(URL_);
    expect(e.html).toContain('href="https://www.yourpropertyguide.com.au/api/auth/callback/nodemailer?token=abc&amp;email=a%40b.com"');
    expect(e.text).toContain(URL_);
    expect(e.html).toContain("Your Property Guide");
  });

  it("goes through sendMail, so SendGrid's click tracking is off for it", async () => {
    m.sendMail.mockResolvedValue({ response: "250 Ok", providerMessageId: null, logged: true });
    await sendSignInEmail({ identifier: "andy@example.com", url: URL_ });
    expect(m.sendMail).toHaveBeenCalledWith(expect.objectContaining({ to: "andy@example.com", categories: ["ypg", "sign-in"] }));
  });
});
