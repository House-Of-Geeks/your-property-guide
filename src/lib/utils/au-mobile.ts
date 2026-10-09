// Mobile checks for the flagged phone field, AuPhoneInput (Oct 2026,
// ported from Why Solar's rebate quiz). Stricter than ./phone on purpose:
// these fields ask for a mobile someone will call, so landlines and dummy
// numbers are turned away everywhere, and overseas numbers everywhere but
// the listing enquiry forms (overseas buyers are real buyers). Client side
// only, because it pulls in libphonenumber's metadata; the leads API keeps
// the lenient normalizePhone and never bounces a lead.

import { z } from "zod";
import {
  formatPhoneNumber,
  formatPhoneNumberIntl,
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";

export const AU_MOBILE_ERROR = "Please enter a valid Australian mobile number (e.g. 0412 345 678)";
export const NON_AU_MOBILE_ERROR = "Sorry, we can only call Australian mobile numbers.";
export const MOBILE_ERROR = "Please enter a valid mobile number (e.g. 0412 345 678)";

/** `overseas`: the listing enquiry forms, which also take a valid
 *  overseas number. Everywhere else it's an Australian mobile. */
export interface MobileRules {
  overseas?: boolean;
}

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

/** The field's value for people to read: "0491 570 156", or
 *  "+44 7911 123456" for an overseas number. */
export function displayPhone(phone: string): string {
  return (phone.startsWith("+61") ? formatPhoneNumber(phone) : formatPhoneNumberIntl(phone)) || phone;
}

/** Repairs values the field builds from a few real habits: "+0430…"
 *  (autofill), "+610430…" (the trunk 0 kept after +61) and "+6161430…"
 *  (0061 typed, which the field reads as a national number). */
export function cleanAuPhone(value: string): string {
  if (/^\+0/.test(value)) return "+61" + value.slice(2);
  return value.replace(/^\+610/, "+61").replace(/^\+6161(\d{9})$/, "+61$1");
}

/** A pasted number as the field's value ("+61491570156"), whatever the
 *  format: 0491 570 156, +61 (0) 491…, 61491570156, 0011 61…, "Mob: 04…".
 *  Null for another country or no number, which the field then handles. */
export function pastedAuPhone(text: string): string | null {
  let s = text.replace(/[^\d+]/g, "");
  if (s.startsWith("0011")) s = "+" + s.slice(4);
  else if (s.startsWith("00")) s = "+" + s.slice(2);
  if (s.startsWith("+61")) s = s.slice(3);
  else if (s.startsWith("+")) return null;
  else if (/^61\d{9}$/.test(s)) s = s.slice(2);
  if (s.startsWith("0")) s = s.slice(1);
  return /^\d+$/.test(s) ? "+61" + s : null;
}

/** What to show under the field, or null when the number can be sent. */
export function auMobileError(phone: string | undefined, { overseas = false }: MobileRules = {}): string | null {
  if (isNonAusValidNumber(phone)) return overseas ? null : NON_AU_MOBILE_ERROR;
  if (!isValidAusMobile(phone) || isLikelyTestNumber(phone!)) return overseas ? MOBILE_ERROR : AU_MOBILE_ERROR;
  return null;
}

// zod fragments for the react-hook-form forms, so they apply exactly the
// same rules as the useState forms.

/** A mobile the form can't submit without; `message` says why it's needed. */
export function requiredMobileSchema(message: string, rules: MobileRules = {}) {
  return z
    .string()
    .min(1, message)
    .superRefine((v, ctx) => {
      const error = auMobileError(v, rules);
      if (error) ctx.addIssue({ code: "custom", message: error });
    });
}

/** An optional mobile: empty passes, anything else must be valid. */
export function optionalMobileSchema(rules: MobileRules = {}) {
  return z
    .string()
    .optional()
    .superRefine((v, ctx) => {
      const error = v ? auMobileError(v, rules) : null;
      if (error) ctx.addIssue({ code: "custom", message: error });
    });
}
