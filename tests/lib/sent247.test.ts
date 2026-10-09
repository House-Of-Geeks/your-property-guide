import { describe, it, expect } from "vitest";
import {
  addressFromSuburbSlug,
  buildSent247LeadBody,
  buildSent247PartialBody,
  describeSent247,
  guideCustomFields,
  sent247HoldReason,
  toE164AU,
} from "@/lib/sent247";
import { SELLING_CONSENT_SHARES } from "@/lib/guide-consent";

const seller = {
  type: "guide-download",
  firstName: "Sarah",
  email: "sarah@example.com",
  phone: "0412 345 678",
  suburb: "burpengary-qld-4505",
  propertyType: "house",
  bedrooms: "4",
  sellingTimeframe: "0-3-months",
  agentStatus: "comparing",
  source: "selling-guide-page",
};

describe("sent247HoldReason: only leads YPG may sell go to Sent 24/7", () => {
  it("sends HOT and WARM vendors who agreed to agent contact", () => {
    expect(sent247HoldReason(seller)).toBeNull();
    expect(sent247HoldReason({ ...seller, sellingTimeframe: "3-6-months" })).toBeNull();
  });
  it("holds cold vendors, already-listed vendors, buyers and other lead types", () => {
    expect(sent247HoldReason({ ...seller, sellingTimeframe: "6-12-months" })).toMatch(/COLD/);
    expect(sent247HoldReason({ ...seller, sellingTimeframe: "researching" })).toMatch(/COLD/);
    expect(sent247HoldReason({ ...seller, agentStatus: "already-listed" })).toMatch(/already listed/);
    expect(sent247HoldReason({ ...seller, guideType: "buying", financeStatus: "cash" })).toMatch(/buying guide/);
    expect(sent247HoldReason({ ...seller, type: "appraisal-request" })).toMatch(/not a guide lead/);
  });
});

describe("payload helpers", () => {
  it("writes AU mobiles and landlines as E.164 and leaves other numbers normalised", () => {
    expect(toE164AU("0412 345 678")).toBe("+61412345678");
    expect(toE164AU("+61 412 345 678")).toBe("+61412345678");
    expect(toE164AU("(02) 9555 1234")).toBe("+61295551234");
    expect(toE164AU("1300 123 456")).toBe("1300123456");
  });
  it("turns a suburb slug into an address", () => {
    expect(addressFromSuburbSlug("burpengary-qld-4505")).toEqual({ city: "Burpengary", state: "QLD", zip: "4505", country: "AU" });
    expect(addressFromSuburbSlug("east-melbourne-vic-3002")?.city).toBe("East Melbourne");
    expect(addressFromSuburbSlug(undefined)).toBeUndefined();
  });
  it("labels the answers as custom fields", () => {
    expect(guideCustomFields(seller)).toMatchObject({
      guide_type: "selling",
      lead_score: "HOT",
      selling_timeframe: "Within 3 months",
      agent_status: "Comparing agents now",
      suburb: "burpengary-qld-4505",
      source: "selling-guide-page",
    });
  });
});

describe("buildSent247LeadBody", () => {
  const body = buildSent247LeadBody({
    lead: seller,
    campaignId: "camp-1",
    referenceId: "lead_1",
    consentText: SELLING_CONSENT_SHARES,
    attribution: {
      state: { first: { at: "2026-10-01T00:00:00Z", landing_page: "/selling-guide", referrer: "https://www.google.com/" }, last: { at: "2026-10-02T00:00:00Z", utm_source: "google", utm_medium: "cpc", gclid: "g1" } },
      sourcePage: "/selling-guide",
      gclid: "g1",
    },
    ctx: { ip: "203.0.113.9", userAgent: "UA" },
    resumeToken: "tok",
    resumeClickId: "click",
  });
  it("carries the contact, consent and resume token the intake requires", () => {
    expect(body.campaign_id).toBe("camp-1");
    expect(body.resume_token).toBe("tok");
    expect(body.resume_click_id).toBe("click");
    expect(body.lead).toMatchObject({ first_name: "Sarah", last_name: "-", email: "sarah@example.com", phone: "+61412345678" });
    expect(body.lead.address).toMatchObject({ state: "QLD", zip: "4505" });
    expect(body.consent).toMatchObject({ tcpa_consent: true, consent_ip: "203.0.113.9", consent_text: SELLING_CONSENT_SHARES });
    expect(body.custom_fields.reference_id).toBe("lead_1");
  });
  it("takes campaign params from the latest touch and the landing page from the first", () => {
    expect(body.attribution).toMatchObject({ source: "google", medium: "cpc", gclid: "g1", landing_page: "/selling-guide", ip_address: "203.0.113.9" });
  });
});

describe("buildSent247PartialBody", () => {
  it("puts our PartialLead id in ws_resume so the recovery link can bring it back", () => {
    const body = buildSent247PartialBody({
      partialId: "pl_1",
      email: "sarah@example.com",
      firstName: "Sarah",
      lastName: null,
      answers: seller,
      campaignId: "camp-1",
      attribution: null,
      ctx: {},
    });
    expect(body.custom_fields.ws_resume).toBe("pl_1");
    expect(body.lead).toMatchObject({ first_name: "Sarah", email: "sarah@example.com" });
    expect("phone" in body.lead).toBe(false);
    expect("consent" in body).toBe(false);
  });
});

describe("describeSent247", () => {
  it("says plainly when a lead was not delivered", () => {
    expect(describeSent247({ kind: "failed", reason: "HTTP 500" })).toMatch(/^FAILED, not delivered: HTTP 500/);
    expect(describeSent247({ kind: "accepted", leadId: "s1", status: "pending" })).toBe("Accepted (pending), lead s1");
    expect(describeSent247({ kind: "off" })).toMatch(/not configured/);
  });
});
