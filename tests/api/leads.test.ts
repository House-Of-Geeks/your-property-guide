import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.mock factories are hoisted above top-level variables. Use vi.hoisted
// to define the spies in the same hoisted scope so the factories can
// reference them safely.
const { dbLeadCreate, dbAgentFind, sendMailMock } = vi.hoisted(() => ({
  dbLeadCreate: vi.fn(),
  dbAgentFind:  vi.fn(),
  sendMailMock: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    lead: { create: dbLeadCreate },
    agent: { findUnique: dbAgentFind },
  },
}));

vi.mock("@/lib/email", () => ({
  sendMail: sendMailMock,
  ANDY_EMAIL: "andy@theandylife.com",
  transporter: {},
  DEFAULT_FROM: "test-from",
}));

vi.mock("@/lib/utils/lead-routing", () => ({
  routeLead: () => ({ agentId: "agent_test", reason: "test-route" }),
}));

import { POST } from "@/app/api/leads/route";

function makeRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("https://example.com/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 254) + 1}`,
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

const baseLead = {
  type: "appraisal-request" as const,
  firstName: "Jane",
  email: "jane@example.com",
  address: "1 Test St",
  appraisalAddress: "1 Test St",
  suburb: "testville",
  source: "website",
};

beforeEach(() => {
  dbLeadCreate.mockReset();
  dbAgentFind.mockReset();
  sendMailMock.mockReset();
  dbLeadCreate.mockResolvedValue({ id: "lead_test_123" });
  dbAgentFind.mockResolvedValue({ fullName: "Test Agent" });
  sendMailMock.mockResolvedValue(undefined);
});

describe("POST /api/leads", () => {
  it("validates schema and rejects missing required fields", async () => {
    const res = await POST(makeRequest({ type: "appraisal-request" }));
    expect(res.status).toBe(400);
    expect(dbLeadCreate).not.toHaveBeenCalled();
  });

  it("persists lead and sends notify + confirmation on success", async () => {
    const res = await POST(makeRequest(baseLead));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.id).toBe("lead_test_123");
    expect(dbLeadCreate).toHaveBeenCalledTimes(1);
    // Two sendMail calls: admin notify + user confirmation
    expect(sendMailMock).toHaveBeenCalledTimes(2);
    const calls = sendMailMock.mock.calls.map((c) => c[0]);
    const adminCall = calls.find((c) => c.to === "andy@theandylife.com");
    const userCall  = calls.find((c) => c.to === "jane@example.com");
    expect(adminCall).toBeTruthy();
    expect(userCall).toBeTruthy();
  });

  it("honeypot trip returns 200 but does NOT persist or email", async () => {
    const res = await POST(makeRequest({ ...baseLead, website: "http://spam.example" }));
    expect(res.status).toBe(200);
    expect(dbLeadCreate).not.toHaveBeenCalled();
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("rate-limits after 5 requests from the same IP within 60s", async () => {
    const ip = "203.0.113.99";
    const opts = { "x-forwarded-for": ip };
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest(baseLead, opts));
      expect(res.status).toBe(200);
    }
    const res = await POST(makeRequest(baseLead, opts));
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBeTruthy();
  });

  it("when notify email fails, lead still saves and fallback alert is sent", async () => {
    sendMailMock.mockImplementationOnce(async () => { throw new Error("SendGrid down"); });
    sendMailMock.mockResolvedValueOnce(undefined); // fallback alert succeeds
    sendMailMock.mockResolvedValueOnce(undefined); // user confirmation succeeds

    const res = await POST(makeRequest(baseLead));
    expect(res.status).toBe(200);
    expect(dbLeadCreate).toHaveBeenCalledTimes(1);
    // notify (failed) + fallback alert + user confirmation = 3 attempts
    expect(sendMailMock).toHaveBeenCalledTimes(3);
    const subjects = sendMailMock.mock.calls.map((c) => c[0].subject);
    expect(subjects.some((s: string) => s.startsWith("ALERT: Lead notification failed"))).toBe(true);
  });

  it("confirmation-email failure does not block the success response", async () => {
    sendMailMock.mockResolvedValueOnce(undefined); // notify ok
    sendMailMock.mockImplementationOnce(async () => { throw new Error("user mailbox bounced"); });

    const res = await POST(makeRequest(baseLead));
    expect(res.status).toBe(200);
    expect(dbLeadCreate).toHaveBeenCalledTimes(1);
  });
});
