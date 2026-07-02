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
  LEADS_CC_EMAIL: "leads-cc@example.com",
  transporter: {},
  DEFAULT_FROM: "test-from",
}));

vi.mock("@/lib/utils/lead-routing", () => ({
  routeLead: () => ({ agentId: "agent_test", reason: "test-route" }),
}));

import { POST } from "@/app/api/leads/route";
import { AGENT_ENQUIRY_TYPES } from "@/components/agent/enquiry-types";

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

  it("guide-download lead is scored, subject-prefixed and serialised into message", async () => {
    const res = await POST(
      makeRequest({
        type: "guide-download",
        firstName: "Sarah",
        email: "sarah@example.com",
        suburb: "burpengary-qld-4505",
        propertyType: "house",
        bedrooms: "4",
        sellingTimeframe: "0-3-months",
        agentStatus: "comparing",
        motivation: "Downsizing",
        priceExpectation: "$750k to $1m",
        marketingConsent: true,
        source: "selling-guide-page",
      }),
    );
    expect(res.status).toBe(200);

    // Score lands in the admin subject for inbox-level triage.
    const adminCall = sendMailMock.mock.calls.map((c) => c[0]).find((c) => c.to === "andy@theandylife.com");
    expect(adminCall.subject).toContain("[HOT]");
    expect(adminCall.subject).toContain("burpengary-qld-4505");

    // Qualification answers + consent snapshot persist in message (the
    // Lead table has no dedicated columns for them).
    const saved = dbLeadCreate.mock.calls[0][0].data;
    expect(saved.message).toContain("Score: HOT");
    expect(saved.message).toContain("Timeframe: Within 3 months");
    expect(saved.message).toContain("Marketing consent: yes");
    expect(saved.message).toContain("disclosure shown");
  });

  it("rejects a guide-download with an invalid timeframe enum", async () => {
    const res = await POST(
      makeRequest({
        type: "guide-download",
        firstName: "Sarah",
        email: "sarah@example.com",
        sellingTimeframe: "next-week",
      }),
    );
    expect(res.status).toBe(400);
    expect(dbLeadCreate).not.toHaveBeenCalled();
  });

  it("confirmation-email failure does not block the success response", async () => {
    sendMailMock.mockResolvedValueOnce(undefined); // notify ok
    sendMailMock.mockImplementationOnce(async () => { throw new Error("user mailbox bounced"); });

    const res = await POST(makeRequest(baseLead));
    expect(res.status).toBe(200);
    expect(dbLeadCreate).toHaveBeenCalledTimes(1);
  });
});

// Each case mirrors the exact JSON a client form posts (JSON.stringify drops
// undefined keys, same as the browser). If a form and the schema drift apart
// again, it fails here instead of 400-ing real leads in production.
describe("client payload contracts", () => {
  it("agent-profile page: every enquiry topic maps to a type the schema accepts", async () => {
    for (const topic of AGENT_ENQUIRY_TYPES) {
      const res = await POST(
        makeRequest({
          type: topic.apiType,
          firstName: "Jane",
          email: "jane@example.com",
          phone: "0400111222",
          message: `Hi Andy, I'd like to get in touch about ${topic.label.toLowerCase()}.`,
          agentId: "agent-1",
          agencyId: "agency-1",
          website: "",
          source: `agent-profile-${topic.value}`,
        }),
      );
      expect(res.status, `topic "${topic.value}" posts type "${topic.apiType}"`).toBe(200);
    }
  });

  it("property enquire modal payload is accepted", async () => {
    const res = await POST(
      makeRequest({
        firstName: "Jane",
        lastName: "Citizen",
        email: "jane@example.com",
        phone: "0400111222",
        type: "property-enquiry",
        message: "Enquiring about: Price guide",
        propertyId: "prop-1",
        agentId: "agent-1",
        agencyId: "agency-1",
        website: "",
        source: "property-enquire-modal",
      }),
    );
    expect(res.status).toBe(200);
  });

  it("property interest form with blank optional phone is accepted", async () => {
    const res = await POST(
      makeRequest({
        type: "property-interest",
        firstName: "Jane",
        lastName: "Citizen",
        email: "jane@example.com",
        // blank phone field posts as undefined (dropped), never ""
        address: "1 Test St, Testville",
        suburb: "Testville",
        message: "Registered interest in: 1 Test St, Testville",
        website: "",
        source: "property-page",
      }),
    );
    expect(res.status).toBe(200);
  });

  it("suburb alert widget payload is accepted", async () => {
    const res = await POST(
      makeRequest({
        type: "suburb-alert",
        firstName: "Jane",
        lastName: "Citizen",
        email: "jane@example.com",
        phone: "0400111222",
        suburb: "burpengary-qld-4505",
        source: "suburb-page-burpengary-qld-4505",
        website: "",
      }),
    );
    expect(res.status).toBe(200);
  });

  it("agency contact form with blank optional phone is accepted", async () => {
    const res = await POST(
      makeRequest({
        type: "general-contact",
        firstName: "Jane",
        lastName: "Citizen",
        email: "jane@example.com",
        message: "Enquiry type: General\nPostcode: 4505\n\nHello",
        agencyId: "agency-1",
        website: "",
        source: "agency-page",
      }),
    );
    expect(res.status).toBe(200);
  });

  it("blank phone collapses to undefined server-side; empty-string lastName still rejects", async () => {
    // The schema preprocesses "" → undefined for phone (never bounce a lead
    // over the phone field), but other min(1) fields treat "" as invalid —
    // clients must send undefined, not "", for blank optional fields.
    expect((await POST(makeRequest({ ...baseLead, phone: "" }))).status).toBe(200);
    expect(dbLeadCreate.mock.calls[0][0].data.phone).toBeUndefined();
    expect((await POST(makeRequest({ ...baseLead, lastName: "" }))).status).toBe(400);
    expect(dbLeadCreate).toHaveBeenCalledTimes(1);
  });
});
