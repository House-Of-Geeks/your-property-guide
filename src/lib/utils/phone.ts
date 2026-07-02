// AU-first phone validation + normalisation, shared by the lead forms
// (client-side validation) and the leads API (server-side normalisation
// before persisting). Deliberately lenient: the goal is to catch junk
// ("asdf", "123") without ever rejecting a real reachable number — an
// over-strict validator costs leads, which is worse than a messy string.

import { z } from "zod";

const FORMATTING = /[\s\-().]/g;

/**
 * Normalise a phone number to a canonical storable form.
 * Returns null when the input can't be a reachable number.
 *
 * Accepted (examples):
 *   "0412 345 678"      → "0412345678"   (AU mobile)
 *   "+61 412 345 678"   → "0412345678"   (intl AU → local)
 *   "61412345678"       → "0412345678"
 *   "(02) 9555 1234"    → "0295551234"   (AU landline)
 *   "1300 123 456"      → "1300123456"   (13/1300/1800 business)
 *   "+44 20 7946 0958"  → "+442079460958" (overseas buyer, kept intl)
 */
export function normalizePhone(raw: string): string | null {
  let value = raw.trim().replace(FORMATTING, "");
  if (!value) return null;

  // "0011"/"00" international dial prefixes → "+"
  if (value.startsWith("0011")) value = `+${value.slice(4)}`;
  else if (value.startsWith("00") && value.length > 10) value = `+${value.slice(2)}`;

  // Intl-format AU numbers → local. "+61 4xx xxx xxx" and bare "61..."
  // (people paste the latter from WhatsApp/contact cards). The "+61 (0)"
  // convention keeps the local trunk zero — dropping "+61" alone would
  // otherwise leave "+610412345678", which passes the generic intl rule
  // below but doesn't dial.
  if (/^\+610[2-478]\d{8}$/.test(value)) value = value.slice(3);
  else if (/^\+61\d{9}$/.test(value)) value = `0${value.slice(3)}`;
  else if (/^61[2-478]\d{8}$/.test(value)) value = `0${value.slice(2)}`;

  // AU local: mobiles (04), landlines (02/03/07/08).
  if (/^0[2-478]\d{8}$/.test(value)) return value;
  // 13 / 1300 / 1800 business numbers.
  if (/^13\d{4}$/.test(value) || /^1[38]00\d{6}$/.test(value)) return value;
  // Overseas buyers are a real audience — keep any plausible intl number.
  if (/^\+\d{8,15}$/.test(value)) return value;

  return null;
}

export function isValidPhone(raw: string): boolean {
  return normalizePhone(raw) !== null;
}

/** Standard inline error for forms — one message everywhere. */
export const PHONE_ERROR = "Enter a valid phone number, e.g. 0412 345 678";

// Shared zod fragments for the react-hook-form lead forms, so every form
// applies exactly the same phone rules instead of re-encoding them.

/** Phone the form can't submit without. `message` is the required-field
 *  error; each form words it around why the number is needed. */
export function requiredPhoneSchema(message = "Phone number is required") {
  return z.string().min(1, message).refine(isValidPhone, PHONE_ERROR);
}

/** Optional phone: empty or whitespace-only input passes (the user never
 *  really filled the field in, so it must not error), anything else must
 *  be a valid number. */
export const optionalPhoneSchema = z
  .string()
  .optional()
  .refine((v) => !v || v.trim() === "" || isValidPhone(v), PHONE_ERROR);
