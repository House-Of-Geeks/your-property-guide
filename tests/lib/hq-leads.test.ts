import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("next/server", () => ({
  after: () => {
    throw new Error("outside a request scope");
  },
}));

import {
  checkLeadSpam,
  deferLeadToHq,
  hqAttribution,
  hqNotes,
  hqSource,
  hqSourceUrl,
  isTestName,
  sendLeadToHq,
  type HqLead,
} from "@/lib/hq-leads";

const lead: HqLead = {
  name: "Sarah Lee",
  email: "sarah@example.com",
  phone: "0412345678",
  source: "appraisal_request",
  brief: "Appraisal request from Sarah Lee",
  notes: "Suburb: Burpengary",
  sourceUrl: "https://www.yourpropertyguide.com.au/appraisal",
};

describe("checkLeadSpam", () => {
  it("passes a normal enquiry", () => {
    expect(checkLeadSpam({ honeypot: "", name: "Sarah Lee", message: "Keen to know what my unit is worth. See https://example.com/listing" })).toEqual({ spam: false });
  });

  it("drops a filled honeypot", () => {
    expect(checkLeadSpam({ honeypot: "http://x.test", name: "Sarah Lee" })).toEqual({ spam: true, reason: "honeypot" });
    expect(checkLeadSpam({ honeypot: "   ", name: "Sarah Lee" }).spam).toBe(false);
  });

  it("drops names and messages written mostly in Cyrillic or CJK", () => {
    expect(checkLeadSpam({ name: "Иван Петров" })).toMatchObject({ spam: true, reason: "name_script" });
    expect(checkLeadSpam({ name: "Sam", message: "你好，我们提供优质服务，请联系我们" })).toMatchObject({ spam: true, reason: "message_script" });
    expect(checkLeadSpam({ name: "Sam", message: "Hello, my friend Саша lives next door and wants to sell" }).spam).toBe(false);
  });

  it("drops a URL in the name", () => {
    expect(checkLeadSpam({ name: "http://spam.example" })).toMatchObject({ spam: true, reason: "name_url" });
    expect(checkLeadSpam({ name: "Best deals www.cheap.shop" })).toMatchObject({ spam: true, reason: "name_url" });
    expect(checkLeadSpam({ name: "Buy now cheapdeals.com" })).toMatchObject({ spam: true, reason: "name_url" });
  });

  it("drops more than two links but allows two", () => {
    const two = "See http://a.example and https://b.example";
    expect(checkLeadSpam({ name: "Sam", message: two }).spam).toBe(false);
    expect(checkLeadSpam({ name: "Sam", message: `${two} and www.c.example` })).toMatchObject({ spam: true, reason: "message_links" });
  });

  it("drops SEO and advertising phrases", () => {
    expect(checkLeadSpam({ name: "Sam", message: "We offer SEO services to get you on the first page of Google" })).toMatchObject({ spam: true, reason: "spam_phrase" });
    expect(checkLeadSpam({ name: "Sam", message: "Cheap backlinks for your site" }).spam).toBe(true);
    expect(checkLeadSpam({ name: "Sam", message: "Boost your traffic today" }).spam).toBe(true);
  });

  it("does not flag ordinary property talk", () => {
    expect(checkLeadSpam({ name: "Jo Nguyen", message: "Looking at a back-yard granny flat and the link road nearby" }).spam).toBe(false);
  });
});

describe("isTestName", () => {
  it("recognises obvious test names", () => {
    for (const n of ["test", "Test User", "TEST Dev Bot", "Tester"]) expect(isTestName(n)).toBe(true);
  });
  it("leaves real names alone", () => {
    for (const n of ["Sarah Lee", "Contest Winner", "Latest Smith", ""]) expect(isTestName(n)).toBe(false);
  });
});

describe("payload helpers", () => {
  it("snake_cases a lead type", () => {
    expect(hqSource("appraisal-request")).toBe("appraisal_request");
    expect(hqSource("introduction-request")).toBe("introduction_request");
  });

  it("builds readable notes without blank rows", () => {
    expect(hqNotes([["Suburb", "Burpengary"], ["Bedrooms", ""], ["Message", undefined], ["Beds", 3]])).toBe("Suburb: Burpengary\nBeds: 3");
  });

  it("builds an absolute source URL", () => {
    expect(hqSourceUrl("/appraisal?x=1")).toBe("https://www.yourpropertyguide.com.au/appraisal?x=1");
    expect(hqSourceUrl(null)).toBe("https://www.yourpropertyguide.com.au");
  });

  it("maps cookie attribution, preferring the last touch", () => {
    const out = hqAttribution({
      sourcePage: "/appraisal",
      gclid: "abc",
      state: {
        first: { at: "2026-10-01T00:00:00Z", referrer: "https://google.com/", landing_page: "/suburbs/x", utm_source: "newsletter" },
        last: { at: "2026-10-05T00:00:00Z", utm_source: "google", utm_medium: "cpc", utm_campaign: "sellers", fbclid: "fb1" },
        google: { at: "2026-10-05T00:00:00Z", gclid: "abc123" },
        microsoft: { at: "2026-10-06T00:00:00Z", msclkid: "ms1" },
      },
    });
    expect(out).toEqual({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "sellers",
      gclid: "abc123",
      fbclid: "fb1",
      msclkid: "ms1",
      referrer: "https://google.com/",
      landing_page: "/suburbs/x",
    });
    expect(hqAttribution({ sourcePage: null, gclid: null, state: null })).toBeUndefined();
  });
});

describe("sendLeadToHq", () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("skips without calling HQ when the secret is not set", async () => {
    vi.stubEnv("HQ_LEADS_SECRET", "");
    expect(await sendLeadToHq(lead)).toBe(false);
    deferLeadToHq(lead);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the contract payload with the bearer secret", async () => {
    vi.stubEnv("HQ_LEADS_SECRET", "shh");
    vi.stubEnv("HQ_URL", "https://hq.example.test/");
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ data: { dealId: "d1", url: "u" } }), { status: 201 }));
    expect(await sendLeadToHq({ ...lead, nextAction: "Reply to the enquiry" })).toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://hq.example.test/api/inbound/leads");
    expect(init.headers).toMatchObject({ Authorization: "Bearer shh", "Content-Type": "application/json" });
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({
      venture: "your-property-guide",
      ventureName: "Your Property Guide",
      name: "Sarah Lee",
      email: "sarah@example.com",
      phone: "0412345678",
      source: "appraisal_request",
      nextAction: "Reply to the enquiry",
    });
    expect(body.test).toBeUndefined();
  });

  it("defaults the HQ URL and flags test names", async () => {
    vi.stubEnv("HQ_LEADS_SECRET", "shh");
    vi.stubEnv("HQ_URL", "");
    fetchMock.mockResolvedValue(new Response("{}", { status: 201 }));
    await sendLeadToHq({ ...lead, name: "TEST Dev Bot" });
    expect(fetchMock.mock.calls[0][0]).toBe("https://hq.houseofgeeks.com.au/api/inbound/leads");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).test).toBe(true);
  });

  it("never throws on HQ errors, timeouts or network failures", async () => {
    vi.stubEnv("HQ_LEADS_SECRET", "shh");
    fetchMock.mockResolvedValueOnce(new Response("no", { status: 503 }));
    expect(await sendLeadToHq(lead)).toBe(false);
    fetchMock.mockResolvedValueOnce(new Response("no", { status: 401 }));
    expect(await sendLeadToHq(lead)).toBe(false);
    fetchMock.mockRejectedValueOnce(new DOMException("timed out", "TimeoutError"));
    expect(await sendLeadToHq(lead)).toBe(false);
    expect(console.error).toHaveBeenCalledTimes(3);
  });

  it("falls back to running the task unawaited outside a request scope", async () => {
    vi.stubEnv("HQ_LEADS_SECRET", "shh");
    fetchMock.mockResolvedValue(new Response("{}", { status: 201 }));
    deferLeadToHq(lead);
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  });
});
