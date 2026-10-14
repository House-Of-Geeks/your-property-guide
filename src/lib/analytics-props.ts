// The PII screen for analytics events (src/lib/analytics.ts). Pure, so it is
// unit-tested without a browser.

const ALLOWED_KEYS = [
  "journey",
  "lead_type",
  "service",
  "stage",
  "timeframe",
  "state",
  "tool",
  "guide",
  "placement",
  "status",
  "coverage",
  "contact_method",
  "sequence",
  "step",
] as const;
export type AnalyticsKey = (typeof ALLOWED_KEYS)[number];
export type AnalyticsProps = Partial<Record<AnalyticsKey, string | number | boolean | null | undefined>>;

const EMAILISH = /@|%40/;
const PHONEISH = /(?:\+?\d[\s-]?){8,}/;

/** The props that may be sent, cleaned. Exported for tests. */
export function safeAnalyticsProps(props: AnalyticsProps): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of ALLOWED_KEYS) {
    const raw = props[key];
    if (raw === undefined || raw === null || raw === "") continue;
    const value = String(raw).trim().slice(0, 60);
    if (!value || EMAILISH.test(value) || PHONEISH.test(value)) continue;
    out[key] = value;
  }
  return out;
}
