import { describe, it, expect } from "vitest";
import {
  AU_MOBILE_ERROR,
  NON_AU_MOBILE_ERROR,
  auMobileError,
  isLikelyTestNumber,
  isNonAusValidNumber,
  isValidAusMobile,
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
