import { describe, it, expect, vi, beforeEach } from "vitest";

const m = vi.hoisted(() => ({ findUnique: vi.fn(), eventCreate: vi.fn(), suppress: vi.fn() }));
vi.mock("@/lib/db", () => ({
  db: { lead: { findUnique: m.findUnique }, leadEvent: { create: m.eventCreate } },
}));
vi.mock("@/lib/mail/suppression", () => ({ suppress: m.suppress }));

import { GET, POST } from "@/app/api/unsubscribe/route";

// Unsubscribing (21 Oct 2026): GET never acts (link scanners open links),
// it sends the reader to a page that asks first. POST unsubscribes, from
// that page's button or a mail client's RFC 8058 one-click request, as a
// marketing suppression for the address (every row, any letter case).

beforeEach(() => {
  Object.values(m).forEach((f) => f.mockReset());
  m.eventCreate.mockResolvedValue({});
  m.suppress.mockResolvedValue(undefined);
});

describe("GET /api/unsubscribe", () => {
  it("doesn't unsubscribe; it sends the reader to the page that asks first", async () => {
    const res = await GET(new Request("https://example.com/api/unsubscribe?t=tok_1234567890"));
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("https://example.com/unsubscribe?t=tok_1234567890");
    expect(m.findUnique).not.toHaveBeenCalled();
    expect(m.suppress).not.toHaveBeenCalled();
  });
});

describe("POST /api/unsubscribe", () => {
  it("one-click: suppresses marketing for the address and answers 200", async () => {
    m.findUnique.mockResolvedValue({ id: "lead_1", email: "Pat@Example.com" });
    const res = await POST(
      new Request("https://example.com/api/unsubscribe?t=tok_1234567890", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: "List-Unsubscribe=One-Click",
      }),
    );
    expect(res.status).toBe(200);
    expect(m.suppress).toHaveBeenCalledWith("Pat@Example.com", "marketing", "unsubscribe", "app", expect.any(String));
    expect(m.eventCreate).toHaveBeenCalledWith({ data: expect.objectContaining({ leadId: "lead_1", type: "unsubscribed" }) });
  });

  it("the page's button: suppresses and lands on /unsubscribed", async () => {
    m.findUnique.mockResolvedValue({ id: "lead_1", email: "pat@example.com" });
    const body = new URLSearchParams({ confirm: "1" });
    const res = await POST(new Request("https://example.com/api/unsubscribe?t=tok_1234567890", { method: "POST", body }));
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("https://example.com/unsubscribed");
    expect(m.suppress).toHaveBeenCalledTimes(1);
  });

  it("does nothing for an unknown or short token, and answers the same way", async () => {
    m.findUnique.mockResolvedValue(null);
    const res = await POST(new Request("https://example.com/api/unsubscribe?t=nope", { method: "POST" }));
    expect(res.status).toBe(200);
    expect(m.suppress).not.toHaveBeenCalled();
  });
});
