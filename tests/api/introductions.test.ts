import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const m = vi.hoisted(() => ({
  findMany: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  eventCreate: vi.fn(),
  eventCreateMany: vi.fn(),
  sendMail: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    lead: { findMany: m.findMany, create: m.create, update: m.update },
    leadEvent: { create: m.eventCreate, createMany: m.eventCreateMany },
  },
}));
vi.mock("@/lib/email", () => ({
  sendMail: m.sendMail,
  ANDY_EMAIL: "andy@theandylife.com",
  LEADS_CC_EMAIL: "leads-cc@example.com",
  transporter: {},
  DEFAULT_FROM: "test-from",
}));

import { POST } from "@/app/api/introductions/route";
import { SERVICES } from "@/lib/service-model";

const fetchMock = vi.fn();

function req(body: unknown): Request {
  return new Request("https://example.com/api/introductions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": `203.0.113.${Math.floor(Math.random() * 250) + 1}` },
    body: JSON.stringify(body),
  });
}

const seller = {
  services: ["selling-agent"],
  consents: { "selling-agent": true },
  journey: "selling",
  firstName: "Sarah",
  lastName: "Lee",
  email: "sarah@example.com",
  phone: "+61491570156",
  preferredContact: "sms",
  bestTime: "evening",
  state: "QLD",
  suburb: "burpengary-qld-4505",
  propertyType: "house",
  timeframe: "0-3-months",
  sellerStatus: "not-started",
  marketingConsent: false,
  requestKey: "key-12345678",
  source: "get-help",
};

let n = 0;
beforeEach(() => {
  n = 0;
  Object.values(m).forEach((f) => f.mockReset());
  m.findMany.mockResolvedValue([]);
  m.create.mockImplementation(async ({ data }: { data: { service: string } }) => ({ id: `lead_${++n}_${data.service}`, token: `tok_${n}` }));
  m.update.mockResolvedValue({});
  m.eventCreate.mockResolvedValue({});
  m.eventCreateMany.mockResolvedValue({});
  m.sendMail.mockResolvedValue(undefined);
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(new Response(JSON.stringify({ success: true, lead_id: "s247_1", status: "accepted" }), { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("SENT247_API_KEY", "test-key");
  vi.stubEnv("SENT247_VENDOR_CAMPAIGN_ID", "camp_vendor");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

const teamMail = () => m.sendMail.mock.calls.map((c) => c[0]).find((c) => c.to === "andy@theandylife.com");
const customerMail = () => m.sendMail.mock.calls.map((c) => c[0]).find((c) => c.to === "sarah@example.com");

describe("POST /api/introductions", () => {
  it("refuses an introduction without the permission tick, and stores nothing", async () => {
    const res = await POST(req({ ...seller, consents: {} }));
    expect(res.status).toBe(400);
    expect(m.create).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("validates the phone and the contact preference", async () => {
    expect((await POST(req({ ...seller, phone: "12" }))).status).toBe(400);
    expect((await POST(req({ ...seller, preferredContact: "carrier-pigeon" }))).status).toBe(400);
  });

  it("sends an eligible seller to one partner, records the exact permission and the outcome, and says so", async () => {
    const res = await POST(req(seller));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.items).toHaveLength(1);
    expect(body.items[0]).toMatchObject({ service: "selling-agent", status: "sent" });
    expect(body.items[0].body).toContain("by text message");

    const data = m.create.mock.calls[0][0].data;
    expect(data).toMatchObject({
      type: "introduction-request",
      kind: "introduction",
      service: "selling-agent",
      introConsent: true,
      consentText: SERVICES["selling-agent"].permission,
      marketingConsent: false,
      preferredContact: "sms",
      phone: "0491570156",
      requestKey: "key-12345678:selling-agent",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.sent247.com/api/v1/leads");
    const posted = JSON.parse(init.body);
    expect(posted.campaign_id).toBe("camp_vendor");
    expect(posted.consent.consent_text).toBe(SERVICES["selling-agent"].permission);
    expect(posted.custom_fields).toMatchObject({ service: "selling-agent", preferred_contact: "sms", best_time: "After 5pm" });

    expect(m.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: "sent" }) }));
    expect(m.eventCreate.mock.calls.map((c) => c[0].data.type)).toContain("delivered");
    expect(teamMail().subject).toMatch(/^\[SENT\] Introduction request: selling agent, Sarah Lee/);
    expect(customerMail().subject).toBe("Your request is with one selling agent");
  });

  it("never passes an already-listed seller to an agent", async () => {
    const body = await (await POST(req({ ...seller, sellerStatus: "already-listed" }))).json();
    expect(body.items[0].status).toBe("not-introduced");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(customerMail().subject).toBe("We haven’t passed your details to anyone");
  });

  it("holds a buyer's agent request for the team and says availability is limited", async () => {
    const buyer = { ...seller, services: ["buyers-agent"], consents: { "buyers-agent": true }, journey: "buying", sellerStatus: undefined, buyerStatus: "not-started", suburb: "bondi-nsw-2026", state: "NSW" };
    const body = await (await POST(req(buyer))).json();
    expect(body.items[0]).toMatchObject({ service: "buyers-agent", status: "held" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(teamMail().subject).toMatch(/^\[ACTION\]/);
  });

  it("makes two rows with separate permissions for a combined request, and only introduces where permission was given", async () => {
    const both = { ...seller, services: ["selling-agent", "buyers-agent"], consents: { "selling-agent": true, "buyers-agent": false }, journey: "buying-and-selling", buyerStatus: "not-started" };
    const body = await (await POST(req(both))).json();
    expect(m.create).toHaveBeenCalledTimes(2);
    const rows = m.create.mock.calls.map((c) => c[0].data);
    expect(rows.map((r) => [r.service, r.introConsent])).toEqual([["selling-agent", true], ["buyers-agent", false]]);
    expect(rows[0].groupId).toBe(rows[1].groupId);
    expect(rows[1].consentText).toBeNull();
    expect(body.items.map((i: { status: string }) => i.status)).toEqual(["sent", "not-introduced"]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns the first request's outcome for a double submit, without a second row, delivery or email", async () => {
    m.findMany.mockResolvedValueOnce([
      { id: "lead_existing", service: "selling-agent", status: "sent", statusReason: "accepted", suburb: "burpengary-qld-4505", preferredContact: "sms", groupId: "g1" },
    ]);
    const body = await (await POST(req(seller))).json();
    expect(body.duplicate).toBe(true);
    expect(body.items[0]).toMatchObject({ leadId: "lead_existing", status: "sent" });
    expect(m.create).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(m.sendMail).not.toHaveBeenCalled();
    expect(m.eventCreateMany).toHaveBeenCalledWith({ data: [expect.objectContaining({ leadId: "lead_existing", type: "duplicate-submit" })] });
  });

  it("handles a newly added service within 30 minutes instead of dropping it, and doesn't resend the first", async () => {
    // Earlier: a selling request with permission. Now: the same person adds a buyer's agent.
    m.findMany
      .mockResolvedValueOnce([]) // requestKey lookup
      .mockResolvedValueOnce([
        { id: "lead_earlier", service: "selling-agent", status: "sent", statusReason: "accepted", suburb: "burpengary-qld-4505", preferredContact: "sms", groupId: "g1", introConsent: true },
      ]);
    const both = { ...seller, services: ["selling-agent", "buyers-agent"], consents: { "selling-agent": true, "buyers-agent": true }, journey: "buying-and-selling", buyerStatus: "not-started", requestKey: "key-second-1" };
    const body = await (await POST(req(both))).json();
    expect(m.create).toHaveBeenCalledTimes(1);
    expect(m.create.mock.calls[0][0].data.service).toBe("buyers-agent");
    expect(fetchMock).not.toHaveBeenCalled(); // the selling request isn't sent twice; buyer's agents are held
    expect(body.items.map((i: { leadId: string }) => i.leadId)).toEqual(["lead_earlier", expect.stringContaining("buyers-agent")]);
    expect(m.eventCreateMany).toHaveBeenCalledWith({ data: [expect.objectContaining({ leadId: "lead_earlier", type: "duplicate-submit" })] });
  });

  it("handles a newly ticked permission within 30 minutes instead of returning the earlier refusal", async () => {
    m.findMany
      .mockResolvedValueOnce([]) // requestKey lookup
      .mockResolvedValueOnce([
        { id: "lead_no_tick", service: "selling-agent", status: "not-introduced", statusReason: "no permission given", suburb: "burpengary-qld-4505", preferredContact: "sms", groupId: "g0", introConsent: false },
      ]);
    const body = await (await POST(req({ ...seller, requestKey: "key-second-2" }))).json();
    expect(body.duplicate).toBe(false);
    expect(m.create).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(body.items[0]).toMatchObject({ status: "sent" });
  });

  it("passes the person's note to the agent, alongside their answers", async () => {
    await POST(req({ ...seller, notes: "Tenant in place until March", requestKey: "key-notes-1" }));
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.custom_fields.notes).toBe("Tenant in place until March");
    // Buyer-only answers never ride on a selling request.
    expect(sent.custom_fields.buyer_type).toBeUndefined();
    expect(sent.custom_fields.budget).toBeUndefined();
  });

  it("answers a simultaneous double submit with the first request's outcome, not an error", async () => {
    // Both copies passed the duplicate check; the database's unique key stops the second.
    m.findMany
      .mockResolvedValueOnce([]) // requestKey lookup
      .mockResolvedValueOnce([]) // recent-email lookup
      .mockResolvedValueOnce([{ id: "lead_first", service: "selling-agent", status: "sent", statusReason: "accepted", suburb: "burpengary-qld-4505", preferredContact: "sms", groupId: "g1" }]);
    m.create.mockRejectedValueOnce(Object.assign(new Error("Unique constraint failed"), { code: "P2002" }));
    const res = await POST(req(seller));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ duplicate: true, items: [expect.objectContaining({ leadId: "lead_first", status: "sent" })] });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(m.sendMail).not.toHaveBeenCalled();
  });

  it("holds the request (never 'sent') when the partner declines or fails, so the team follows up", async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ success: false, rejection_reasons: ["no buyer for area"] }), { status: 200 }));
    const rejected = await (await POST(req(seller))).json();
    expect(rejected.items[0].status).toBe("held");
    fetchMock.mockRejectedValueOnce(new Error("network down"));
    const failed = await (await POST(req({ ...seller, requestKey: "key-87654321" }))).json();
    expect(failed.items[0].status).toBe("held");
    expect(m.eventCreate.mock.calls.map((c) => c[0].data.type)).toContain("delivery-failed");
  });

  it("holds for the team when partner delivery isn't switched on", async () => {
    vi.stubEnv("SENT247_API_KEY", "");
    const body = await (await POST(req(seller))).json();
    expect(body.items[0].status).toBe("held");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("swallows a honeypot hit without storing anything", async () => {
    const res = await POST(req({ ...seller, website: "spam" }));
    expect(res.status).toBe(200);
    expect(m.create).not.toHaveBeenCalled();
  });

  it("drops script, link and SEO spam like a honeypot hit", async () => {
    for (const bad of [{ firstName: "Иван" }, { notes: "Cheap backlinks and SEO services" }, { notes: "http://a.example http://b.example http://c.example" }]) {
      const res = await POST(req({ ...seller, ...bad }));
      expect(res.status).toBe(200);
    }
    expect(m.create).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the request to HQ as one deal, best effort", async () => {
    vi.stubEnv("HQ_LEADS_SECRET", "hq-secret");
    vi.stubEnv("SENT247_API_KEY", "");
    const res = await POST(req(seller));
    expect(res.status).toBe(200);
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://hq.houseofgeeks.com.au/api/inbound/leads");
    expect(init.headers.Authorization).toBe("Bearer hq-secret");
    expect(JSON.parse(init.body)).toMatchObject({ venture: "your-property-guide", name: "Sarah Lee", source: "introduction_request", email: "sarah@example.com" });
  });

  it("does not fail the request or the emails when HQ is down", async () => {
    vi.stubEnv("HQ_LEADS_SECRET", "hq-secret");
    vi.stubEnv("SENT247_API_KEY", "");
    fetchMock.mockRejectedValue(new Error("down"));
    const res = await POST(req(seller));
    expect(res.status).toBe(200);
    expect(teamMail()).toBeTruthy();
  });
});
