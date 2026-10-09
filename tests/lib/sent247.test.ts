import { describe, it, expect, afterEach, vi } from "vitest";
import {
  addressFromSuburbSlug,
  buildSent247LeadBody,
  buildSent247LeadMagnetBody,
  describeSent247,
  guideCustomFields,
  leadMagnetDeliveryEnabled,
  sent247HoldReason,
  toE164AU,
} from "@/lib/sent247";
import { AGENT_CALL_CONSENT, SELLING_EMAIL_CONSENT, guideCallKind } from "@/lib/guide-consent";

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
    consentText: AGENT_CALL_CONSENT,
    attribution: {
      state: { first: { at: "2026-10-01T00:00:00Z", landing_page: "/selling-guide", referrer: "https://www.google.com/" }, last: { at: "2026-10-02T00:00:00Z", utm_source: "google", utm_medium: "cpc", gclid: "g1" } },
      sourcePage: "/selling-guide",
      gclid: "g1",
    },
    ctx: { ip: "203.0.113.9", userAgent: "UA" },
    resumeClickId: "click",
  });
  it("carries the contact, consent and email click id the intake requires", () => {
    expect(body.campaign_id).toBe("camp-1");
    expect(body.resume_click_id).toBe("click");
    expect(body.lead).toMatchObject({ first_name: "Sarah", last_name: "-", email: "sarah@example.com", phone: "+61412345678" });
    expect(body.lead.address).toMatchObject({ state: "QLD", zip: "4505" });
    expect(body.consent).toMatchObject({ tcpa_consent: true, consent_ip: "203.0.113.9", consent_text: AGENT_CALL_CONSENT });
    expect(body.custom_fields.reference_id).toBe("lead_1");
  });
  it("takes campaign params from the latest touch and the landing page from the first", () => {
    expect(body.attribution).toMatchObject({ source: "google", medium: "cpc", gclid: "g1", landing_page: "/selling-guide", ip_address: "203.0.113.9" });
  });
});

describe("buildSent247LeadMagnetBody", () => {
  it("records the guide download with email consent and no phone", () => {
    const body = buildSent247LeadMagnetBody({
      lead: { ...seller, lastName: "Lee" },
      campaignId: "camp-1",
      referenceId: "lead_9",
      consentText: SELLING_EMAIL_CONSENT,
      attribution: null,
      ctx: { ip: "203.0.113.9" },
    });
    expect(body.magnet.slug).toBe("selling-guide");
    expect(body.magnet.download_url).toMatch(/^https:\/\/www\.yourpropertyguide\.com\.au\/downloads\/.+\.pdf$/);
    expect(body.lead).toEqual({ email: "sarah@example.com", first_name: "Sarah", last_name: "Lee", postcode: "4505", state: "QLD" });
    expect(body.consent).toMatchObject({ email_consent: true, consent_text: SELLING_EMAIL_CONSENT, consent_ip: "203.0.113.9" });
    expect(body.custom_fields.reference_id).toBe("lead_9");
  });
});

describe("leadMagnetDeliveryEnabled", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("needs the flag to be exactly \"true\" and the key and campaign set", () => {
    vi.stubEnv("SENT247_API_KEY", "sk_live_x");
    vi.stubEnv("SENT247_VENDOR_CAMPAIGN_ID", "camp");
    vi.stubEnv("LEAD_MAGNET_TO_SENT247", "1");
    expect(leadMagnetDeliveryEnabled()).toBe(false);
    vi.stubEnv("LEAD_MAGNET_TO_SENT247", "true");
    expect(leadMagnetDeliveryEnabled()).toBe(true);
    vi.stubEnv("SENT247_API_KEY", "");
    expect(leadMagnetDeliveryEnabled()).toBe(false);
  });
});

describe("guideCallKind agrees with sent247HoldReason", () => {
  it("offers an agent call exactly when the lead may go to Sent 24/7", () => {
    for (const guideType of ["selling", "buying"])
      for (const sellingTimeframe of ["0-3-months", "3-6-months", "6-12-months", "12-plus-months", "researching"])
        for (const agentStatus of ["comparing", "not-started", "already-listed", undefined]) {
          const a = { ...seller, guideType, sellingTimeframe, agentStatus };
          expect(guideCallKind(a) === "agent").toBe(sent247HoldReason(a) === null);
        }
  });
});

describe("describeSent247", () => {
  it("says plainly when a lead was not delivered", () => {
    expect(describeSent247({ kind: "failed", reason: "HTTP 500" })).toMatch(/^FAILED, not delivered: HTTP 500/);
    expect(describeSent247({ kind: "accepted", leadId: "s1", status: "pending" })).toBe("Accepted (pending), lead s1");
    expect(describeSent247({ kind: "off" })).toMatch(/not configured/);
  });
});
