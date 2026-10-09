// Australian mobile checks for the flagged phone field (Oct 2026, ported
// from Why Solar's rebate quiz). Stricter than ./phone on purpose: these
// fields ask for a mobile someone will call, so landlines, overseas numbers
// and dummy numbers are turned away. Client side only, because it pulls in
// libphonenumber's metadata; the leads API keeps using normalizePhone.

import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";

export const AU_MOBILE_ERROR = "Please enter a valid Australian mobile number (e.g. 0412 345 678)";
export const NON_AU_MOBILE_ERROR = "Sorry, we can only call Australian mobile numbers.";

/** The field's E.164 value ("+61412345678") is a real AU mobile (04 / 05). */
export function isValidAusMobile(phone: string | undefined): boolean {
  if (!phone || !isValidPhoneNumber(phone)) return false;
  try {
    const parsed = parsePhoneNumber(phone);
    if (!parsed || parsed.country !== "AU") return false;
    const type = parsed.getType();
    return type === "MOBILE" || type === "FIXED_LINE_OR_MOBILE";
  } catch {
    return false;
  }
}

/** A valid number, just not an Australian one. */
export function isNonAusValidNumber(phone: string | undefined): boolean {
  if (!phone || !isValidPhoneNumber(phone)) return false;
  try {
    const parsed = parsePhoneNumber(phone);
    return !!parsed && parsed.country !== "AU";
  } catch {
    return false;
  }
}

/** Obviously fake mobiles that still pass isValidAusMobile: 0412 345 678,
 *  0400 000 000, eight repeated or sequential digits after the 04. */
export function isLikelyTestNumber(phone: string): boolean {
  const national = phone.replace(/\D/g, "").replace(/^61/, "0");
  if (!/^04\d{8}$/.test(national)) return false; // only judge well-formed AU mobiles
  const sub = national.slice(2);
  if (/^(\d)\1{7}$/.test(sub)) return true;
  if (/^(?:01234567|12345678|23456789|98765432|87654321)$/.test(sub)) return true;
  return new Set(["0412345678", "0400000000", "0411111111", "0401234567"]).has(national);
}

/** What to show under the field, or null when the number can be sent. */
export function auMobileError(phone: string | undefined): string | null {
  if (isNonAusValidNumber(phone)) return NON_AU_MOBILE_ERROR;
  if (!isValidAusMobile(phone) || isLikelyTestNumber(phone!)) return AU_MOBILE_ERROR;
  return null;
}
