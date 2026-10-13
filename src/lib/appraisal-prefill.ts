// The appraisal form's prefill contract: ?suburb=<slug>&type=<property type>.
// The instant price range on /appraisal and /property-valuation writes it
// into the page's own URL when a suburb and dwelling are chosen, and any
// page can link /appraisal?suburb=…&type=… the same way. AppraisalForm reads
// both; an unknown type is ignored, never sent.

import { PROPERTY_TYPES } from "@/lib/constants";

export type AppraisalPropertyType = (typeof PROPERTY_TYPES)[number]["value"];

/** The form's property type for a ?type= value, or "" when it isn't one. */
export function appraisalTypeParam(value: string | null | undefined): AppraisalPropertyType | "" {
  return PROPERTY_TYPES.some((t) => t.value === value) ? (value as AppraisalPropertyType) : "";
}

/** `href` with ?suburb= and ?type= set (other params and the hash kept). */
export function appraisalPrefillHref(href: string, suburb: string, type: string): string {
  const url = new URL(href);
  url.searchParams.set("suburb", suburb);
  url.searchParams.set("type", type);
  return url.toString();
}
