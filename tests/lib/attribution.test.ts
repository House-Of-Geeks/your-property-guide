import { describe, it, expect } from "vitest";
import {
  attributionEmailRows,
  entryFromLanding,
  leadGclid,
  parseAttribution,
  serializeAttribution,
  touchFromLanding,
  updateAttribution,
  type AttributionState,
} from "@/lib/attribution";

const T1 = "2026-09-25T01:00:00.000Z";
const T2 = "2026-10-10T01:00:00.000Z";

describe("touchFromLanding", () => {
  it("copies click ids and UTMs, keeps path + query, drops the host", () => {
    const t = touchFromLanding(
      "https://www.yourpropertyguide.com.au/selling-guide?gclid=Cj0KCQ&utm_source=google&utm_medium=cpc&utm_campaign=sellers-qld&foo=bar",
      "",
      T1,
    );
    expect(t).toMatchObject({
      at: T1,
      gclid: "Cj0KCQ",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "sellers-qld",
      landing_page: "/selling-guide?gclid=Cj0KCQ&utm_source=google&utm_medium=cpc&utm_campaign=sellers-qld&foo=bar",
    });
    expect(t).not.toHaveProperty("foo");
  });

  it("keeps an external referrer as origin + path and drops our own host", () => {
    const ext = touchFromLanding("https://www.yourpropertyguide.com.au/", "https://www.google.com/search?q=x", T1);
    expect(ext.referrer).toBe("https://www.google.com/search");
    const own = touchFromLanding("https://www.yourpropertyguide.com.au/a", "https://www.yourpropertyguide.com.au/b", T1);
    expect(own.referrer).toBeUndefined();
  });

  it("clips very long values", () => {
    const t = touchFromLanding(`https://x.test/?gclid=${"a".repeat(1000)}`, "", T1);
    expect(t.gclid!.length).toBe(300);
  });
});

describe("updateAttribution", () => {
  it("first organic visit: first touch only", () => {
    const s = updateAttribution(null, "https://x.test/suburbs/a", "https://www.google.com/", T1);
    expect(s?.first.landing_page).toBe("/suburbs/a");
    expect(s?.last).toBeUndefined();
  });

  it("first visit from an ad: first, last and google are the same touch", () => {
    const s = updateAttribution(null, "https://x.test/?gclid=G1", "", T1);
    expect(s?.first.gclid).toBe("G1");
    expect(s?.last?.gclid).toBe("G1");
    expect(s?.google?.gclid).toBe("G1");
  });

  it("returning without campaign params changes nothing", () => {
    const existing: AttributionState = { first: { at: T1, landing_page: "/" } };
    expect(updateAttribution(existing, "https://x.test/appraisal", "", T2)).toBeNull();
  });

  it("keeps the Google click when a later email or Meta link lands", () => {
    let s = updateAttribution(null, "https://x.test/", "", T1);
    s = updateAttribution(s, "https://x.test/a?gclid=G1", "", T1) ?? s;
    s = updateAttribution(s, "https://x.test/b?utm_source=newsletter", "", T2) ?? s;
    s = updateAttribution(s, "https://x.test/c?fbclid=F1", "", T2) ?? s;
    expect(s?.last?.fbclid).toBe("F1");
    expect(s?.google?.gclid).toBe("G1");
    expect(leadGclid(s)).toBe("G1");
  });

  it("keeps a Microsoft click separately from a later Google click", () => {
    let s = updateAttribution(null, "https://x.test/?msclkid=M1", "", T1);
    s = updateAttribution(s, "https://x.test/?gclid=G1", "", T2) ?? s;
    expect(s?.microsoft?.msclkid).toBe("M1");
    expect(s?.google?.gclid).toBe("G1");
  });

  it("a reload of the same campaign landing is not a new click", () => {
    const s = updateAttribution(null, "https://x.test/?gclid=G1", "", T1);
    expect(updateAttribution(s, "https://x.test/?gclid=G1", "", T2)).toBeNull();
  });

  it("a new ad click replaces last and keeps first", () => {
    const existing: AttributionState = {
      first: { at: T1, landing_page: "/", referrer: "https://www.google.com/" },
      last: { at: T1, gclid: "OLD" },
    };
    const s = updateAttribution(existing, "https://x.test/selling-guide?gclid=NEW", "", T2);
    expect(s?.first).toEqual(existing.first);
    expect(s?.last).toMatchObject({ gclid: "NEW", at: T2, landing_page: "/selling-guide?gclid=NEW" });
  });

  it("treats a UTM-only link (email, social) as a campaign touch", () => {
    const existing: AttributionState = { first: { at: T1 } };
    const s = updateAttribution(existing, "https://x.test/?utm_source=newsletter&utm_medium=email", "", T2);
    expect(s?.last?.utm_source).toBe("newsletter");
  });
});

describe("guide entry (?from=)", () => {
  const COMMISSION = "https://x.test/selling-guide?suburb=paddington-qld-4064&from=real-estate-commission-qld";

  it("reads the page slug a guide CTA adds, lowercased; ignores anything that is not a slug", () => {
    expect(entryFromLanding(COMMISSION, T1)).toEqual({
      from: "real-estate-commission-qld",
      landing_page: "/selling-guide?suburb=paddington-qld-4064&from=real-estate-commission-qld",
      at: T1,
    });
    expect(entryFromLanding("https://x.test/selling-guide?from=Cost-Of-Selling", T1)?.from).toBe("cost-of-selling");
    expect(entryFromLanding("https://x.test/selling-guide", T1)).toBeNull();
    expect(entryFromLanding("https://x.test/selling-guide?from=%3Cscript%3E", T1)).toBeNull();
    expect(entryFromLanding(`https://x.test/selling-guide?from=${"a".repeat(101)}`, T1)).toBeNull();
  });

  it("records the entry on a returning visitor without touching first, last or the Google click", () => {
    const existing: AttributionState = {
      first: { at: T1, landing_page: "/guides/real-estate-commission-qld", referrer: "https://www.bing.com/" },
      google: { at: T1, gclid: "G1" },
    };
    const s = updateAttribution(existing, COMMISSION, "https://www.bing.com/", T2);
    expect(s?.first).toEqual(existing.first);
    expect(s?.google).toEqual(existing.google);
    expect(s?.last).toBeUndefined();
    expect(s?.entry).toMatchObject({ from: "real-estate-commission-qld", at: T2 });
  });

  it("a reload of the same entry changes nothing; a later CTA replaces it", () => {
    const s1 = updateAttribution({ first: { at: T1 } }, COMMISSION, "", T1)!;
    expect(updateAttribution(s1, COMMISSION, "", T2)).toBeNull();
    const s2 = updateAttribution(s1, "https://x.test/buying-guide?from=stamp-duty-nsw", "", T2);
    expect(s2?.entry).toMatchObject({ from: "stamp-duty-nsw", landing_page: "/buying-guide?from=stamp-duty-nsw", at: T2 });
  });

  it("keeps the entry when a later ad click lands", () => {
    const s1 = updateAttribution({ first: { at: T1 } }, COMMISSION, "", T1)!;
    const s2 = updateAttribution(s1, "https://x.test/?gclid=G2", "", T2);
    expect(s2?.last?.gclid).toBe("G2");
    expect(s2?.entry?.from).toBe("real-estate-commission-qld");
  });

  it("survives the cookie round trip, and a tampered entry is dropped", () => {
    const state = updateAttribution(null, COMMISSION, "", T1)!;
    expect(parseAttribution(serializeAttribution(state))).toEqual(state);
    const raw = encodeURIComponent(JSON.stringify({ first: { at: T1 }, entry: { from: "<b>", landing_page: "/", at: T1 } }));
    expect(parseAttribution(raw)).toEqual({ first: { at: T1 } });
  });

  it("is the first row after the submit page in the team email", () => {
    const rows = attributionEmailRows(
      { first: { at: T1 }, entry: { from: "real-estate-agent-fees-australia", landing_page: "/selling-guide?from=real-estate-agent-fees-australia", at: T2 } },
      "/selling-guide?from=real-estate-agent-fees-australia",
    );
    expect(rows[1]).toEqual(["Guide CTA clicked on", "real-estate-agent-fees-australia"]);
  });
});

describe("parseAttribution / serializeAttribution", () => {
  it("round-trips through the cookie encoding", () => {
    const state: AttributionState = { first: { at: T1, landing_page: "/" }, last: { at: T2, gclid: "G2" } };
    expect(parseAttribution(serializeAttribution(state))).toEqual(state);
  });

  it("returns null for missing, malformed or first-less values", () => {
    expect(parseAttribution(undefined)).toBeNull();
    expect(parseAttribution("not json")).toBeNull();
    expect(parseAttribution(encodeURIComponent(JSON.stringify({ last: { at: T1 } })))).toBeNull();
  });

  it("strips control characters and lone surrogates Postgres would reject", () => {
    expect(touchFromLanding("https://x.test/?utm_source=%00", "", T1).utm_source).toBeUndefined();
    const raw = encodeURIComponent(JSON.stringify({ first: { at: T1, utm_content: "a\u0000b\ud800c" } }));
    expect(parseAttribution(raw)?.first.utm_content).toBe("abc");
  });

  it("drops unknown keys and non-string values from a tampered cookie", () => {
    const raw = encodeURIComponent(JSON.stringify({ first: { at: T1, gclid: "G", evil: "<script>", utm_source: 5 } }));
    expect(parseAttribution(raw)).toEqual({ first: { at: T1, gclid: "G" } });
  });

  it("stays under the cookie size limit with a very long landing URL", () => {
    const long = "/x?" + "p=" + "y".repeat(480);
    const state: AttributionState = { first: { at: T1, landing_page: long }, last: { at: T2, landing_page: long, gclid: "G" } };
    const value = serializeAttribution(state);
    expect(value.length).toBeLessThan(3800);
    expect(parseAttribution(value)?.last?.gclid).toBe("G");
  });
});

describe("leadGclid", () => {
  it("returns the latest Google click's gclid, only when well formed", () => {
    expect(leadGclid({ first: { at: T1, gclid: "A" }, google: { at: T2, gclid: "B-_9" } })).toBe("B-_9");
    expect(leadGclid({ first: { at: T1 }, google: { at: T2, gclid: "bad value" } })).toBeNull();
    expect(leadGclid({ first: { at: T1 }, google: { at: T2, gbraid: "iOS" } })).toBeNull();
    expect(leadGclid({ first: { at: T1 } })).toBeNull();
    expect(leadGclid(null)).toBeNull();
  });
});

describe("attributionEmailRows", () => {
  it("labels a gclid click without UTMs as google / cpc and lists the gclid", () => {
    const rows = attributionEmailRows({ first: { at: T1 }, last: { at: T2, gclid: "G" } }, "/appraisal");
    expect(rows[0]).toEqual(["Submitted on", "/appraisal"]);
    expect(rows).toContainEqual(["Latest campaign", "google / cpc"]);
    expect(rows).toContainEqual(["gclid", "G"]);
  });

  it("describes an organic first visit by its referrer, or as direct", () => {
    expect(attributionEmailRows({ first: { at: T1, referrer: "https://www.google.com/" } })).toContainEqual([
      "First visit",
      "referral: https://www.google.com/",
    ]);
    expect(attributionEmailRows({ first: { at: T1 } })).toContainEqual(["First visit", "direct or organic"]);
  });
});
