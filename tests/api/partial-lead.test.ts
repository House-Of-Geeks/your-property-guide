import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { dbPartialUpsert, dbPartialFind } = vi.hoisted(() => ({
  dbPartialUpsert: vi.fn(),
  dbPartialFind: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: { partialLead: { upsert: dbPartialUpsert, findUnique: dbPartialFind } },
}));

vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/server")>()),
  after: (fn: () => unknown) => {
    void fn();
  },
}));

import { NextRequest } from "next/server";
import { POST } from "@/app/api/partial-lead/route";
import { GET } from "@/app/api/partial-lead/restore/route";

const fetchMock = vi.fn();
const ip = () => `198.51.100.${Math.floor(Math.random() * 254) + 1}`;
const post = (body: unknown) =>
  POST(
    new Request("https://example.com/api/partial-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": ip() },
      body: JSON.stringify(body),
    }),
  );
const restore = (qs: string) =>
  GET(new NextRequest(`https://example.com/api/partial-lead/restore?${qs}`, { headers: { "x-forwarded-for": ip() } }));
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const answers = { suburb: "bondi-nsw-2026", sellingTimeframe: "0-3-months", agentStatus: "comparing" };
const row = {
  email: "sarah@example.com",
  firstName: "Sarah",
  lastName: "Lee",
  source: "selling-guide",
  data: { answers, placement: "selling-guide-page" },
};

beforeEach(() => {
  dbPartialUpsert.mockReset().mockResolvedValue({ id: "pl_1" });
  dbPartialFind.mockReset();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("POST /api/partial-lead", () => {
  it("upserts one row per email per guide and returns its id", async () => {
    const res = await post({ email: "Sarah@Example.com ", firstName: "Sarah", source: "selling-guide", answers });
    expect(res.status).toBe(200);
    expect((await res.json()).id).toBe("pl_1");
    const call = dbPartialUpsert.mock.calls[0][0];
    expect(call.where).toEqual({ email_source: { email: "sarah@example.com", source: "selling-guide" } });
    expect(call.create.data.answers).toEqual(answers);
    expect(fetchMock).not.toHaveBeenCalled(); // Sent 24/7 not configured
  });

  it("rejects an unknown guide and saves nothing for the honeypot", async () => {
    expect((await post({ email: "a@b.com", source: "other" })).status).toBe(400);
    expect((await post({ email: "a@b.com", source: "selling-guide", website: "spam" })).status).toBe(200);
    expect(dbPartialUpsert).not.toHaveBeenCalled();
  });

  it("holds a sellable vendor partial in Sent 24/7, and not an already-listed one", async () => {
    vi.stubEnv("SENT247_API_KEY", "sk_live_test");
    vi.stubEnv("SENT247_VENDOR_CAMPAIGN_ID", "camp-vendor");
    fetchMock.mockResolvedValue(json(201, { success: true, lead_id: "s1", status: "partial" }));
    await post({ email: "sarah@example.com", source: "selling-guide", answers });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      campaign_id: "camp-vendor",
      custom_fields: { ws_resume: "pl_1" },
    });
    fetchMock.mockClear();
    await post({ email: "sarah@example.com", source: "selling-guide", answers: { ...answers, agentStatus: "already-listed" } });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("GET /api/partial-lead/restore", () => {
  it("restores by our id (the link's ws_resume)", async () => {
    dbPartialFind.mockResolvedValue(row);
    const res = await restore("id=pl_1");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ email: "sarah@example.com", firstName: "Sarah", lastName: "Lee", source: "selling-guide", answers });
  });

  it("404s an unknown id", async () => {
    dbPartialFind.mockResolvedValue(null);
    expect((await restore("id=nope")).status).toBe(404);
  });

  it("410s a token Sent 24/7 says was already completed", async () => {
    fetchMock.mockResolvedValue(json(410, { error: "already_completed" }));
    expect((await restore("token=tok&source=selling-guide")).status).toBe(410);
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.sent247.com/partials/tok");
  });

  it("matches a token's partial by the email Sent 24/7 returns, never one from the request", async () => {
    fetchMock.mockResolvedValue(json(200, { email: "Sarah@Example.com", first_name: "Sarah", custom_fields: {} }));
    dbPartialFind.mockResolvedValue(row);
    const res = await restore("token=tok&source=selling-guide&email=someone-else@example.com");
    expect(dbPartialFind.mock.calls[0][0].where).toEqual({ email_source: { email: "sarah@example.com", source: "selling-guide" } });
    expect((await res.json()).answers).toEqual(answers);
  });

  it("falls back to Sent 24/7's name and email when we hold no partial", async () => {
    fetchMock.mockResolvedValue(json(200, { email: "sarah@example.com", first_name: "Sarah", last_name: "Lee", custom_fields: {} }));
    dbPartialFind.mockResolvedValue(null);
    expect(await (await restore("token=tok&source=selling-guide")).json()).toEqual({
      email: "sarah@example.com",
      firstName: "Sarah",
      lastName: "Lee",
      source: "selling-guide",
      answers: {},
    });
  });
});
