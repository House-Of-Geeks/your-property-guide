import { describe, it, expect, vi, beforeEach } from "vitest";

const m = vi.hoisted(() => ({ findUnique: vi.fn(), update: vi.fn(), updateMany: vi.fn(), eventCreate: vi.fn() }));
vi.mock("@/lib/db", () => ({
  db: { lead: { findUnique: m.findUnique, update: m.update, updateMany: m.updateMany }, leadEvent: { create: m.eventCreate } },
}));

import { GET } from "@/app/api/unsubscribe/route";

// One unsubscribe covers every row for that email (20 Oct 2026): a newsletter
// signup and a guide download can't keep each other alive.

beforeEach(() => {
  Object.values(m).forEach((f) => f.mockReset());
  m.update.mockResolvedValue({});
  m.updateMany.mockResolvedValue({ count: 2 });
  m.eventCreate.mockResolvedValue({});
});

describe("GET /api/unsubscribe", () => {
  it("stops marketing on every row with the same email, and lands on /unsubscribed", async () => {
    m.findUnique.mockResolvedValue({ id: "lead_1", email: "pat@example.com", unsubscribedAt: null });
    const res = await GET(new Request("https://example.com/api/unsubscribe?t=tok_1234567890"));
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("https://example.com/unsubscribed");
    expect(m.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "lead_1" }, data: expect.objectContaining({ marketingConsent: false, sequenceNextAt: null }) }));
    expect(m.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: "pat@example.com", id: { not: "lead_1" }, unsubscribedAt: null }, data: expect.objectContaining({ marketingConsent: false }) }),
    );
    expect(m.eventCreate).toHaveBeenCalledWith({ data: expect.objectContaining({ leadId: "lead_1", type: "unsubscribed" }) });
  });

  it("does nothing for an unknown or short token, and still lands on /unsubscribed", async () => {
    m.findUnique.mockResolvedValue(null);
    const res = await GET(new Request("https://example.com/api/unsubscribe?t=nope"));
    expect(res.status).toBe(303);
    expect(m.update).not.toHaveBeenCalled();
    expect(m.updateMany).not.toHaveBeenCalled();
  });
});
