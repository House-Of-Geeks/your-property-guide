import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// vi.mock factories are hoisted above top-level variables. Use vi.hoisted
// to define the spies in the same hoisted scope so the factories can
// reference them safely.
const { dbLeadCreate, dbAgentFind, sendMailMock, deferred } = vi.hoisted(() => ({
  dbLeadCreate: vi.fn(),
  dbAgentFind:  vi.fn(),
  sendMailMock: vi.fn(),
  deferred:     [] as Array<() => unknown>,
}));

// after() queues its callback here instead of running it, so a test can
// see that background work (the lead magnet retry) was scheduled.
vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/server")>()),
  after: (fn: () => unknown) => {
    deferred.push(fn);
  },
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

import { POST } from "@/app/api/leads/route";
import { AGENT_CALL_CONSENT, BUYING_EMAIL_CONSENT, SELLING_EMAIL_CONSENT } from "@/lib/guide-consent";
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
  deferred.length = 0;
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
        phone: "0412 345 678",
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
    expect(saved.message).toContain("Consent: one agent may call");
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

  // Leads are assigned only when the visitor chose an agent. A suburb or
  // a fallback must never name one: the old placeholder routing put
  // "Routed to Matthew Thomson (round-robin)" on leads nobody assigned.
  it("leaves a lead with no chosen agent unassigned and the email without a Routed to row", async () => {
    const res = await POST(makeRequest({ ...baseLead, suburb: "burpengary-qld-4505" }));
    expect(res.status).toBe(200);
    expect(dbAgentFind).not.toHaveBeenCalled();
    const data = dbLeadCreate.mock.calls[0][0].data;
    expect(data.routedToAgent).toBeUndefined();
    expect(data.routedReason).toBeUndefined();
    const notify = sendMailMock.mock.calls[0][0];
    expect(notify.html).not.toContain("Routed to");
  });

  it("routes a lead to the agent the visitor chose", async () => {
    const res = await POST(makeRequest({ ...baseLead, agentId: "agent-7" }));
    expect(res.status).toBe(200);
    expect(dbAgentFind).toHaveBeenCalledWith({ where: { id: "agent-7" }, select: { fullName: true } });
    const data = dbLeadCreate.mock.calls[0][0].data;
    expect(data.routedToAgent).toBe("agent-7");
    expect(data.routedReason).toBe("direct-agent");
    const notify = sendMailMock.mock.calls[0][0];
    expect(notify.html).toContain("Routed to");
    expect(notify.html).toContain("Test Agent (direct-agent)");
  });
});

// Each case mirrors the exact JSON a client form posts (JSON.stringify drops
// undefined keys, same as the browser). If a form and the schema drift apart
// again, it fails here instead of 400-ing real leads in production.
// Guide funnels (Oct 2026, Why Solar's ebook flow): a download is name +
// email and gets the guide (Sent 24/7 lead magnet when switched on); a call
// request from the thanks page is the lead, for one agent or for YPG.
describe("guide funnels: download, call request and Sent 24/7", () => {
  const seller = {
    type: "guide-download" as const,
    firstName: "Sarah",
    lastName: "Lee",
    email: "Sarah@Example.com",
    suburb: "burpengary-qld-4505",
    propertyType: "house",
    bedrooms: "4",
    sellingTimeframe: "0-3-months" as const,
    agentStatus: "comparing" as const,
    marketingConsent: true,
    source: "selling-guide-page",
  };
  const mails = () => sendMailMock.mock.calls.map((c) => c[0]);
  const adminMail = () => mails().find((m) => m.to === "andy@theandylife.com");
  const readerMail = () => mails().find((m) => m.to === "Sarah@Example.com");
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });
  const configure = (magnets = true) => {
    vi.stubEnv("SENT247_API_KEY", "sk_live_test");
    vi.stubEnv("SENT247_VENDOR_CAMPAIGN_ID", "camp-vendor");
    if (magnets) vi.stubEnv("LEAD_MAGNET_TO_SENT247", "true");
  };
  const s247 = (status: number, body: unknown) =>
    fetchMock.mockResolvedValue(new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));

  describe("a download (no phone)", () => {
    it("is saved, YPG emails the guide while Sent 24/7 is off, and the team is not emailed", async () => {
      const res = await POST(makeRequest(seller));
      expect(res.status).toBe(200);
      expect((await res.json()).emailOnItsWay).toBe(true);
      expect(dbLeadCreate.mock.calls[0][0].data.phone).toBeUndefined();
      expect(dbLeadCreate.mock.calls[0][0].data.message).toContain("Consent: guide and tips emails (download)");
      expect(mails()).toHaveLength(1);
      expect(readerMail().subject).toBe("Your selling guide + the $20,000 question");
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("is posted to Sent 24/7 as a lead magnet when switched on, and YPG sends nothing", async () => {
      configure();
      s247(201, { success: true, signup_id: "sg_1", status: "new", emails: "started" });
      const res = await POST(makeRequest(seller));
      expect((await res.json()).emailOnItsWay).toBe(true);
      expect(sendMailMock).not.toHaveBeenCalled();
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("https://api.sent247.com/api/v1/lead-magnets");
      expect(init.headers).toMatchObject({ Authorization: "Bearer sk_live_test" });
      const body = JSON.parse(init.body);
      expect(body.campaign_id).toBe("camp-vendor");
      expect(body.magnet).toEqual({
        slug: "selling-guide",
        name: "The Complete Guide to Selling Your Property in Australia",
        download_url: "https://www.yourpropertyguide.com.au/downloads/your-property-guide-selling-a-home-australia.pdf",
      });
      expect(body.lead).toMatchObject({ email: "Sarah@Example.com", first_name: "Sarah", postcode: "4505", state: "QLD" });
      expect("phone" in body.lead).toBe(false);
      expect(body.consent).toMatchObject({ email_consent: true, consent_text: SELLING_EMAIL_CONSENT });
      expect(body.custom_fields).toMatchObject({ reference_id: "lead_test_123", lead_score: "HOT" });
    });

    it("uses the buying-guide magnet and consent for buyers", async () => {
      configure();
      s247(201, { success: true, emails: "started" });
      await POST(makeRequest({ ...seller, guideType: "buying", agentStatus: undefined, buyerPersona: "first-home" }));
      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.magnet.slug).toBe("buying-guide");
      expect(body.consent.consent_text).toBe(BUYING_EMAIL_CONSENT);
    });

    it("falls back to YPG's guide email when Sent 24/7 has no series to start", async () => {
      configure();
      s247(201, { success: true, status: "new", emails: "not_started", emails_reason: "no_active_series" });
      const res = await POST(makeRequest(seller));
      expect((await res.json()).emailOnItsWay).toBe(true);
      expect(readerMail()).toBeTruthy();
    });

    it("emails nobody who is on Sent 24/7's suppression list, or who already has the series", async () => {
      configure();
      s247(201, { success: true, status: "new", emails: "not_started", emails_reason: "suppressed" });
      expect((await (await POST(makeRequest(seller))).json()).emailOnItsWay).toBe(false);
      s247(200, { success: true, status: "repeat", emails: "already_started" });
      expect((await (await POST(makeRequest(seller))).json()).emailOnItsWay).toBe(false);
      expect(sendMailMock).not.toHaveBeenCalled();
    });

    it("on a Sent 24/7 outage schedules a background retry and sends no second guide email", async () => {
      configure();
      s247(503, { error: { code: "UNAVAILABLE" } });
      const res = await POST(makeRequest(seller));
      expect(res.status).toBe(200);
      expect((await res.json()).emailOnItsWay).toBe(false);
      expect(deferred).toHaveLength(1);
      expect(sendMailMock).not.toHaveBeenCalled();
    });
  });

  describe("a call request (thanks page, with a phone)", () => {
    const call = { ...seller, phone: "0412 345 678", call: true, resumeClickId: "c_1" };

    it("from a HOT seller goes to the Sent 24/7 vendor campaign with the one-agent consent", async () => {
      configure(false);
      s247(201, { success: true, lead_id: "s247_1", status: "pending" });
      const res = await POST(makeRequest(call));
      expect(res.status).toBe(200);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("https://api.sent247.com/api/v1/leads");
      expect(init.headers).toMatchObject({ "Idempotency-Key": "lead_test_123" });
      const body = JSON.parse(init.body);
      expect(body).toMatchObject({ campaign_id: "camp-vendor", resume_click_id: "c_1" });
      expect(body.lead).toMatchObject({ phone: "+61412345678", last_name: "Lee" });
      expect(body.consent.consent_text).toBe(AGENT_CALL_CONSENT);
      expect(adminMail().subject).toMatch(/^\[HOT\] Appraisal call: Selling Guide Download, Sarah Lee/);
      expect(adminMail().html).toContain("One top local agent (vendor lead)");
      expect(adminMail().html).toContain("Accepted (pending), lead s247_1");
      expect(readerMail().subject).toBe("Your free appraisal call is booked");
      expect(dbLeadCreate.mock.calls[0][0].data.message).toContain("Consent: one agent may call");
    });

    it("sends the flagged field's E.164 number to Sent 24/7 as is, and stores 04…", async () => {
      configure(false);
      s247(201, { success: true, lead_id: "s247_2", status: "pending" });
      await POST(makeRequest({ ...call, phone: "+61491570156" }));
      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.lead.phone).toBe("+61491570156");
      expect(dbLeadCreate.mock.calls[0][0].data.phone).toBe("0491570156");
    });

    it.each([
      ["an already-listed seller", { agentStatus: "already-listed" }],
      ["a cold seller", { sellingTimeframe: "12-plus-months" }],
      ["a buyer", { guideType: "buying", agentStatus: undefined, buyerPersona: "investing", financeStatus: "cash" }],
    ])("from %s is a call from YPG, never sent to Sent 24/7", async (_label, overrides) => {
      configure(false);
      await POST(makeRequest({ ...call, ...overrides }));
      expect(fetchMock).not.toHaveBeenCalled();
      expect(adminMail().subject).toContain("Call from YPG (not for agents)");
      expect(adminMail().html).toContain("Never pass to an agent.");
      expect(readerMail().subject).toBe("We'll give you a call");
      expect(dbLeadCreate.mock.calls[0][0].data.message).toContain("Consent: call from YPG only");
    });

    it("says plainly when Sent 24/7 isn't configured or didn't take it", async () => {
      await POST(makeRequest(call));
      expect(adminMail().html).toContain("Not sent (Sent 24/7 not configured)");
      sendMailMock.mockClear();
      configure(false);
      s247(502, { error: { message: "bad gateway" } });
      const res = await POST(makeRequest(call));
      expect(res.status).toBe(200);
      expect(adminMail().html).toContain("FAILED, not delivered: HTTP 502: bad gateway");
    });

    it("a one-step guide submit with a phone (a tab from before this change) still gets the guide", async () => {
      await POST(makeRequest({ ...seller, phone: "0412 345 678" }));
      expect(readerMail().subject).toBe("Your selling guide + the $20,000 question");
      expect(adminMail()).toBeTruthy();
    });
  });
});

describe("rental-appraisal (landlord) leads", () => {
  const landlord = {
    type: "rental-appraisal",
    firstName: "Priya",
    lastName: "Nair",
    email: "priya@example.com",
    phone: "0412 345 678",
    address: "15 Smith Street, Goodna",
    appraisalAddress: "15 Smith Street, Goodna",
    suburb: "goodna-qld-4300",
    propertyType: "house",
    bedrooms: "3",
    tenanted: "yes",
    managerTimeframe: "asap",
    website: "",
    source: "suburb-page-goodna-qld-4300-rental-appraisal",
  };
  it("is accepted, serialised into message and flagged HOT when wanted as soon as possible", async () => {
    const res = await POST(makeRequest(landlord));
    expect(res.status).toBe(200);
    const data = dbLeadCreate.mock.calls[0][0].data;
    expect(data.type).toBe("rental-appraisal");
    expect(data.message).toBe("Tenanted: Yes, tenanted · Wants a manager: As soon as possible");
    expect(data.phone).toBe("0412345678");
    expect(data.propertyType).toBe("house");
    expect(data.bedrooms).toBe("3");
    const [notify, confirm] = sendMailMock.mock.calls.map((c) => c[0]);
    expect(notify.subject).toBe("[HOT] Rental Appraisal Request (landlord), Priya Nair (goodna-qld-4300)");
    expect(notify.html).toContain("Currently tenanted");
    expect(notify.html).toContain("As soon as possible");
    expect(confirm.subject).toBe("Your rental appraisal request is in");
    expect(confirm.html).toContain("property manager");
  });
  it("without the optional answers keeps message empty and no HOT prefix", async () => {
    const res = await POST(makeRequest({ ...landlord, tenanted: undefined, managerTimeframe: undefined }));
    expect(res.status).toBe(200);
    expect(dbLeadCreate.mock.calls[0][0].data.message).toBeUndefined();
    expect(sendMailMock.mock.calls[0][0].subject).toMatch(/^Rental Appraisal Request/);
  });
  it("rejects an answer outside the enums", async () => {
    const res = await POST(makeRequest({ ...landlord, managerTimeframe: "tomorrow" }));
    expect(res.status).toBe(400);
    expect(dbLeadCreate).not.toHaveBeenCalled();
  });
});

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

  describe("ad attribution (ypg_attr cookie)", () => {
    const cookie = `ypg_attr=${encodeURIComponent(JSON.stringify({
      first: { at: "2026-09-01T00:00:00.000Z", landing_page: "/", referrer: "https://www.google.com/" },
      last: { at: "2026-09-20T00:00:00.000Z", gclid: "Cj0KCQ_test", utm_source: "google", utm_medium: "cpc", utm_campaign: "sellers-qld", landing_page: "/selling-guide?gclid=Cj0KCQ_test" },
      google: { at: "2026-09-20T00:00:00.000Z", gclid: "Cj0KCQ_test", utm_source: "google", utm_medium: "cpc", utm_campaign: "sellers-qld", landing_page: "/selling-guide?gclid=Cj0KCQ_test" },
    }))}`;

    it("stores the latest gclid, both touches and the submitting page on the lead", async () => {
      const res = await POST(makeRequest(baseLead, { cookie: `other=1; ${cookie}`, referer: "https://example.com/appraisal" }));
      expect(res.status).toBe(200);
      const data = dbLeadCreate.mock.calls[0][0].data;
      expect(data.gclid).toBe("Cj0KCQ_test");
      expect(data.attribution).toMatchObject({
        first: { landing_page: "/", referrer: "https://www.google.com/" },
        last: { gclid: "Cj0KCQ_test", utm_campaign: "sellers-qld" },
        google: { gclid: "Cj0KCQ_test" },
        source_page: "/appraisal",
      });
    });

    it("adds a 'How they found us' block to the internal email only", async () => {
      await POST(makeRequest(baseLead, { cookie, referer: "https://example.com/appraisal" }));
      const calls = sendMailMock.mock.calls.map((c) => c[0]);
      const admin = calls.find((c) => c.to === "andy@theandylife.com");
      const confirmation = calls.find((c) => c.to === baseLead.email);
      expect(admin.html).toContain("How they found us");
      expect(admin.html).toContain("Cj0KCQ_test");
      expect(admin.html).toContain("sellers-qld");
      expect(confirmation.html).not.toContain("Cj0KCQ_test");
    });

    it("saves nothing extra when there is no cookie and a cross-origin referer", async () => {
      await POST(makeRequest(baseLead, { referer: "https://evil.example.net/page" }));
      const data = dbLeadCreate.mock.calls[0][0].data;
      expect(data.gclid).toBeUndefined();
      expect(data.attribution).toBeUndefined();
    });

    it("ignores a malformed cookie instead of failing the lead", async () => {
      const res = await POST(makeRequest(baseLead, { cookie: "ypg_attr=%7Bnot-json" }));
      expect(res.status).toBe(200);
      expect(dbLeadCreate.mock.calls[0][0].data.gclid).toBeUndefined();
    });
  });
});
