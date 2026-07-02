// Enquiry topics offered on the agent profile page (/agents/[slug]).
// `value` keys the selector UI; `apiType` is what actually gets POSTed as
// the lead `type` — /api/leads validates against a closed enum that has no
// per-topic values for these, so the chosen topic travels in `source` and
// the pre-filled message instead. tests/api/leads.test.ts pins every
// apiType against the schema so the two can't silently drift again.
export const AGENT_ENQUIRY_TYPES = [
  { value: "sell-appraisal", label: "Selling my property & appraisals", apiType: "appraisal-request" },
  { value: "leasing", label: "Leasing my property", apiType: "general-contact" },
  { value: "buy", label: "Buying a property", apiType: "general-contact" },
  { value: "rent", label: "Renting a property", apiType: "general-contact" },
  { value: "general", label: "I have a general enquiry", apiType: "general-contact" },
] as const;
