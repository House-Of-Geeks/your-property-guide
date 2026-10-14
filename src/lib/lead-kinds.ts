// Which path a Lead row belongs to (Lead.kind). New rows store it; rows from
// before 14 Oct 2026 have none, so readers call leadKind() to infer it from
// type. Learning rows never go to an agent. See prisma/schema.prisma.

export type LeadKind = "learning" | "introduction" | "enquiry" | "newsletter";

export type Journey = "buying" | "selling" | "buying-and-selling";

const LEARNING_TYPES = new Set(["guide-download", "plan-email"]);
const INTRODUCTION_TYPES = new Set(["introduction-request", "appraisal-request", "match-request"]);

export function kindForType(type: string, opts: { call?: boolean } = {}): LeadKind {
  if (type === "newsletter") return "newsletter";
  // A guide "call request" from an old thanks page (call: true) asked for
  // contact, so it is an introduction request, not a download.
  if (type === "guide-download" && opts.call) return "introduction";
  if (LEARNING_TYPES.has(type)) return "learning";
  if (INTRODUCTION_TYPES.has(type)) return "introduction";
  return "enquiry";
}

/** The stored kind, or the inferred one for older rows. */
export function leadKind(row: { kind?: string | null; type: string }): LeadKind {
  if (row.kind === "learning" || row.kind === "introduction" || row.kind === "enquiry" || row.kind === "newsletter") {
    return row.kind;
  }
  return kindForType(row.type);
}

export const JOURNEYS: ReadonlyArray<{ id: Journey; label: string; short: string; href: string }> = [
  { id: "buying", label: "I’m buying", short: "Buying", href: "/buying" },
  { id: "selling", label: "I’m selling", short: "Selling", href: "/selling" },
  { id: "buying-and-selling", label: "I’m buying and selling", short: "Buying and selling", href: "/buying-and-selling" },
];

export function isJourney(v: unknown): v is Journey {
  return v === "buying" || v === "selling" || v === "buying-and-selling";
}
