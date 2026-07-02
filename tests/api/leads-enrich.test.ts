import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.mock factories are hoisted above top-level variables. Use vi.hoisted
// to define the spies in the same hoisted scope so the factories can
// reference them safely.
const { dbLeadFind, dbLeadUpdateMany, sendMailMock } = vi.hoisted(() => ({
  dbLeadFind:       vi.fn(),
  dbLeadUpdateMany: vi.fn(),
  sendMailMock:     vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    lead: { findUnique: dbLeadFind, updateMany: dbLeadUpdateMany },
  },
}));

vi.mock("@/lib/email", () => ({
  sendMail: sendMailMock,
  ANDY_EMAIL: "andy@theandylife.com",
  LEADS_CC_EMAIL: "jos@profitgeeks.com.au",
  transporter: {},
  DEFAULT_FROM: "test-from",
}));

import { POST } from "@/app/api/leads/enrich/route";

function makeRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("https://example.com/api/leads/enrich", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 254) + 1}`,
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

const freshLead = {
  id: "clead_test_1234567890",
  type: "guide-download",
  firstName: "Sarah",
  lastName: null,
  email: "sarah@example.com",
  phone: null,
  suburb: "burpengary-qld-4505",
  source: "selling-guide-page",
  createdAt: new Date(),
};

beforeEach(() => {
  dbLeadFind.mockReset();
  dbLeadUpdateMany.mockReset();
  sendMailMock.mockReset();
  dbLeadFind.mockResolvedValue(freshLead);
  dbLeadUpdateMany.mockResolvedValue({ count: 1 });
  sendMailMock.mockResolvedValue(undefined);
});

describe("POST /api/leads/enrich", () => {
  it("normalises and saves the phone on a phone-less lead, then notifies", async () => {
    const res = await POST(makeRequest({ id: freshLead.id, phone: "+61 412 345 678" }));
    expect(res.status).toBe(200);
    expect(dbLeadUpdateMany).toHaveBeenCalledWith({
      where: { id: freshLead.id, phone: null },
      data: { phone: "0412345678" },
    });
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock.mock.calls[0][0].subject).toContain("Phone added: Sarah");
  });

  it("rejects an undialable phone", async () => {
    const res = await POST(makeRequest({ id: freshLead.id, phone: "not a number" }));
    expect(res.status).toBe(400);
    expect(dbLeadUpdateMany).not.toHaveBeenCalled();
  });

  it("404s an unknown lead id", async () => {
    dbLeadFind.mockResolvedValue(null);
    const res = await POST(makeRequest({ id: "clead_does_not_exist_1", phone: "0412345678" }));
    expect(res.status).toBe(404);
    expect(dbLeadUpdateMany).not.toHaveBeenCalled();
  });

  it("404s a lead older than the enrichment window", async () => {
    dbLeadFind.mockResolvedValue({
      ...freshLead,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    });
    const res = await POST(makeRequest({ id: freshLead.id, phone: "0412345678" }));
    expect(res.status).toBe(404);
    expect(dbLeadUpdateMany).not.toHaveBeenCalled();
  });

  it("never overwrites an existing phone (idempotent success)", async () => {
    dbLeadFind.mockResolvedValue({ ...freshLead, phone: "0499999999" });
    const res = await POST(makeRequest({ id: freshLead.id, phone: "0412345678" }));
    expect(res.status).toBe(200);
    expect(dbLeadUpdateMany).not.toHaveBeenCalled();
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("a concurrent write losing the updateMany race stays silent (no email)", async () => {
    // findUnique saw phone: null, but another request set it first — the
    // guarded where clause matches zero rows.
    dbLeadUpdateMany.mockResolvedValue({ count: 0 });
    const res = await POST(makeRequest({ id: freshLead.id, phone: "0412345678" }));
    expect(res.status).toBe(200);
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("match-request enrichment notifies without the standard CC", async () => {
    dbLeadFind.mockResolvedValue({ ...freshLead, type: "match-request" });
    const res = await POST(makeRequest({ id: freshLead.id, phone: "0412 345 678" }));
    expect(res.status).toBe(200);
    expect(sendMailMock.mock.calls[0][0].cc).toBeUndefined();
  });

  it("phone saves even when the notification email fails", async () => {
    sendMailMock.mockImplementationOnce(async () => { throw new Error("SendGrid down"); });
    const res = await POST(makeRequest({ id: freshLead.id, phone: "0412345678" }));
    expect(res.status).toBe(200);
    expect(dbLeadUpdateMany).toHaveBeenCalledTimes(1);
  });

  it("rate-limits after 5 requests from the same IP within 60s", async () => {
    const opts = { "x-forwarded-for": "203.0.113.77" };
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest({ id: freshLead.id, phone: "0412345678" }, opts));
      expect(res.status).toBe(200);
    }
    const res = await POST(makeRequest({ id: freshLead.id, phone: "0412345678" }, opts));
    expect(res.status).toBe(429);
  });
});
