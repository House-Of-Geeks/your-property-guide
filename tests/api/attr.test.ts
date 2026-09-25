import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/attr/route";
import { parseAttribution } from "@/lib/attribution";

function req(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("https://www.yourpropertyguide.com.au/api/attr", {
    method: "POST",
    headers: { "content-type": "application/json", host: "www.yourpropertyguide.com.au", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function cookieValue(res: Response): string | null {
  const header = res.headers.get("set-cookie");
  const m = header?.match(/ypg_attr=([^;]*)/);
  return m ? m[1] : null;
}

describe("POST /api/attr", () => {
  it("sets a 90-day, Secure, Lax first-party cookie from the server on an ad landing", async () => {
    const res = await POST(req({ href: "https://www.yourpropertyguide.com.au/selling-guide?gclid=G1", referrer: "https://www.google.com/" }));
    expect(res.status).toBe(204);
    const header = res.headers.get("set-cookie")!;
    expect(header).toContain("Max-Age=7776000");
    expect(header).toContain("SameSite=Lax");
    expect(header).toContain("Secure");
    expect(header).not.toContain("HttpOnly");
    expect(res.headers.get("cache-control")).toBe("no-store");
    const state = parseAttribution(cookieValue(res));
    expect(state?.google?.gclid).toBe("G1");
    expect(state?.first.referrer).toBe("https://www.google.com/");
  });

  it("does not double-encode the value", async () => {
    const res = await POST(req({ href: "https://www.yourpropertyguide.com.au/?gclid=G1" }));
    expect(cookieValue(res)?.startsWith("%7B")).toBe(true);
  });

  it("keeps the first touch and updates the Google click when the cookie exists", async () => {
    const first = cookieValue(await POST(req({ href: "https://www.yourpropertyguide.com.au/suburbs/a" })))!;
    const res = await POST(req({ href: "https://www.yourpropertyguide.com.au/appraisal?gclid=G2" }, { cookie: `ypg_attr=${first}` }));
    const state = parseAttribution(cookieValue(res));
    expect(state?.first.landing_page).toBe("/suburbs/a");
    expect(state?.google?.gclid).toBe("G2");
  });

  it("sets nothing for a repeat visit without campaign params", async () => {
    const first = cookieValue(await POST(req({ href: "https://www.yourpropertyguide.com.au/" })))!;
    const res = await POST(req({ href: "https://www.yourpropertyguide.com.au/guides" }, { cookie: `ypg_attr=${first}` }));
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("ignores other hosts, bad JSON and missing href", async () => {
    expect((await POST(req({ href: "https://evil.example.net/?gclid=X" }))).headers.get("set-cookie")).toBeNull();
    expect((await POST(req("not json"))).headers.get("set-cookie")).toBeNull();
    expect((await POST(req({ referrer: "x" }))).headers.get("set-cookie")).toBeNull();
  });
});
