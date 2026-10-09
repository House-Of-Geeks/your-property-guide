import { describe, it, expect } from "vitest";
import {
  AU_MOBILE_ERROR,
  NON_AU_MOBILE_ERROR,
  auMobileError,
  cleanAuPhone,
  isLikelyTestNumber,
  isNonAusValidNumber,
  isValidAusMobile,
  pastedAuPhone,
} from "@/lib/utils/au-mobile";

describe("isValidAusMobile", () => {
  it("accepts AU mobiles in the field's E.164 form", () => {
    expect(isValidAusMobile("+61430835484")).toBe(true);
    expect(isValidAusMobile("+61412345678")).toBe(true);
  });

  it("turns away landlines, short numbers and overseas numbers", () => {
    expect(isValidAusMobile("+61295551234")).toBe(false);
    expect(isValidAusMobile("+6143083548")).toBe(false);
    expect(isValidAusMobile("+6421123456")).toBe(false);
    expect(isValidAusMobile("")).toBe(false);
    expect(isValidAusMobile(undefined)).toBe(false);
  });
});

describe("isNonAusValidNumber", () => {
  it("spots a real number from another country", () => {
    expect(isNonAusValidNumber("+6421123456")).toBe(true);
    expect(isNonAusValidNumber("+61430835484")).toBe(false);
    expect(isNonAusValidNumber("+6143")).toBe(false);
  });
});

describe("isLikelyTestNumber", () => {
  it("flags dummy mobiles", () => {
    expect(isLikelyTestNumber("+61412345678")).toBe(true);
    expect(isLikelyTestNumber("+61400000000")).toBe(true);
    expect(isLikelyTestNumber("+61433333333")).toBe(true);
    expect(isLikelyTestNumber("+61487654321")).toBe(true);
  });

  it("leaves real-looking mobiles alone", () => {
    expect(isLikelyTestNumber("+61430835484")).toBe(false);
  });
});

describe("auMobileError", () => {
  it("is null only for a real-looking AU mobile", () => {
    expect(auMobileError("+61430835484")).toBeNull();
    expect(auMobileError("+61412345678")).toBe(AU_MOBILE_ERROR);
    expect(auMobileError("+61295551234")).toBe(AU_MOBILE_ERROR);
    expect(auMobileError("")).toBe(AU_MOBILE_ERROR);
    expect(auMobileError(undefined)).toBe(AU_MOBILE_ERROR);
    expect(auMobileError("+6421123456")).toBe(NON_AU_MOBILE_ERROR);
  });
});

describe("cleanAuPhone", () => {
  it("repairs what autofill and 0061 leave in the field", () => {
    expect(cleanAuPhone("+0491570156")).toBe("+61491570156");
    expect(cleanAuPhone("+610491570156")).toBe("+61491570156");
    expect(cleanAuPhone("+6161491570156")).toBe("+61491570156");
  });

  it("leaves good values and other countries alone", () => {
    expect(cleanAuPhone("+61491570156")).toBe("+61491570156");
    expect(cleanAuPhone("+447700900123")).toBe("+447700900123");
    expect(cleanAuPhone("")).toBe("");
  });
});

describe("pastedAuPhone", () => {
  it("turns every AU format into the field's value", () => {
    for (const text of [
      "0491 570 156",
      "0491-570-156",
      "(0491) 570 156",
      "491 570 156",
      "+61 491 570 156",
      "+61491570156",
      "61491570156",
      "+61 (0) 491 570 156",
      "0061 491 570 156",
      "0011 61 491 570 156",
      "Mob: 0491 570 156",
    ]) {
      expect(pastedAuPhone(text), text).toBe("+61491570156");
    }
  });

  it("keeps landlines AU, for the field to refuse", () => {
    expect(pastedAuPhone("(02) 9555 1234")).toBe("+61295551234");
  });

  it("hands other countries and junk to the field", () => {
    expect(pastedAuPhone("+44 7700 900123")).toBeNull();
    expect(pastedAuPhone("0044 7700 900123")).toBeNull();
    expect(pastedAuPhone("call me")).toBeNull();
  });
});
