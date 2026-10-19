// Introduction rules (Oct 2026): who we can introduce, when our team reviews a
// request by hand first, and what we tell the person in each case. Pure, so
// the form, the API and the tests share one copy.
//
// The operational rules carried over from the guide pipeline (sent247.ts
// sent247HoldReason, the agent terms on /real-estate-leads):
//   - someone already signed with an agent is never introduced to another;
//   - sellers more than six months out ("cold vendors") are not passed on
//     automatically: the team follows up instead;
//   - no suburb, no automatic introduction: there is no local agent to pick;
//   - no tick in the permission box, no introduction. Ever.

import type { AustralianState } from "@/lib/utils/stamp-duty";
import { RESPONSE_WINDOW, SERVICES, type ContactMethod, type IntroService } from "@/lib/service-model";

export type Timeframe = "0-3-months" | "3-6-months" | "6-12-months" | "12-plus-months" | "researching";

/**
 * Where the person is up to with professionals. Sellers: not started,
 * comparing agents, or already signed (listed). Buyers: not started,
 * comparing buyer's agents, or already engaged one.
 */
export type ProStatus = "not-started" | "comparing" | "already-listed" | "already-engaged";

// ---------------------------------------------------------------------------
// Partner coverage
// ---------------------------------------------------------------------------

/**
 * How we can help in a state, per service:
 *   "direct"   a participating agent can receive the request straight away
 *              (when partner delivery is switched on), otherwise the team
 *              forwards it by hand;
 *   "reviewed" our team checks every request by hand and tells the person
 *              whether we can introduce someone;
 *   "none"     we can't introduce anyone there yet (the form says so before
 *              anything is sent).
 *
 * Selling: Andy confirmed Australia-wide seller coverage on 13 Oct 2026.
 * Buyer's agents: the network is still being built, so every request is
 * reviewed by hand and nothing is promised. Change these only when the
 * partner list changes.
 */
export type CoverageLevel = "direct" | "reviewed" | "none";

const ALL_STATES: readonly AustralianState[] = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

export const PARTNER_COVERAGE: Record<IntroService, Record<AustralianState, CoverageLevel>> = {
  "selling-agent": Object.fromEntries(ALL_STATES.map((s) => [s, "direct"])) as Record<AustralianState, CoverageLevel>,
  "buyers-agent": Object.fromEntries(ALL_STATES.map((s) => [s, "reviewed"])) as Record<AustralianState, CoverageLevel>,
};

export function coverageFor(service: IntroService, state: AustralianState | null | undefined): CoverageLevel {
  if (!state) return service === "selling-agent" ? "direct" : "reviewed";
  return PARTNER_COVERAGE[service][state] ?? "none";
}

/** What the form says about availability before anything is sent. */
/** The state in a suburb slug ("hamilton-qld-4007" → "QLD"), or null. */
export function stateFromSuburbSlug(slug: string | null | undefined): AustralianState | null {
  const s = slug?.match(/-([a-z]{2,3})-\d{4}$/)?.[1]?.toUpperCase();
  return s && ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"].includes(s) ? (s as AustralianState) : null;
}

export function availabilityNote(service: IntroService, state: AustralianState | null | undefined): { level: CoverageLevel; text: string } {
  const level = coverageFor(service, state);
  const where = state ?? "your state";
  if (level === "direct") {
    return {
      level,
      text: `We introduce participating selling agents across ${where}. If none covers your suburb, we’ll tell you rather than send you to someone who doesn’t know it.`,
    };
  }
  if (level === "reviewed") {
    return {
      level,
      text:
        service === "buyers-agent"
          ? `We’re still building our network of buyer’s agents, so we can’t promise an introduction in ${where} yet. Our team reads every request and will email you ${RESPONSE_WINDOW} to say whether we can introduce someone, and if not, how to choose one yourself.`
          : `Our team reviews requests in ${where} by hand and will email you ${RESPONSE_WINDOW} to say whether we can introduce someone.`,
    };
  }
  return {
    level,
    text: `We can’t introduce a ${SERVICES[service].short} in ${where} at the moment. The guides and tools below are still yours to use.`,
  };
}

// ---------------------------------------------------------------------------
// The decision for one request
// ---------------------------------------------------------------------------

export interface IntroRequestFacts {
  service: IntroService;
  state?: AustralianState | null;
  suburb?: string | null;
  timeframe?: Timeframe | null;
  proStatus?: ProStatus | null;
  introConsent: boolean;
}

export type IntroDecision =
  | { action: "deliver" }
  | { action: "hold"; reason: string }
  | { action: "not-introduced"; reason: string };

const NEAR_TERM: ReadonlySet<Timeframe> = new Set(["0-3-months", "3-6-months"]);

/** Whether a request may go to a partner now, waits for the team, or gets no introduction. */
export function decideIntroduction(f: IntroRequestFacts): IntroDecision {
  if (!f.introConsent) return { action: "not-introduced", reason: "no permission given" };
  if (f.proStatus === "already-listed") return { action: "not-introduced", reason: "already signed with a selling agent" };
  if (f.proStatus === "already-engaged") return { action: "not-introduced", reason: "already working with a buyer’s agent" };
  const level = coverageFor(f.service, f.state ?? null);
  if (level === "none") return { action: "hold", reason: "outside partner coverage" };
  if (!f.suburb?.trim()) return { action: "hold", reason: "no suburb: team to confirm the area" };
  if (level === "reviewed") return { action: "hold", reason: `${SERVICES[f.service].short} requests are reviewed by hand` };
  if (f.service === "selling-agent" && (!f.timeframe || !NEAR_TERM.has(f.timeframe))) {
    return { action: "hold", reason: "selling more than six months out: team to follow up" };
  }
  return { action: "deliver" };
}

// ---------------------------------------------------------------------------
// Status, events and what we tell the person
// ---------------------------------------------------------------------------

/**
 * Lead.status for introductions. Set only from real outcomes: the partner
 * channel's response, the team recording a step, the partner or customer
 * telling us. Never from a click.
 */
export const INTRO_STATUSES = [
  "received",       // saved, nothing decided yet (only between the insert and the decision)
  "sent",           // the partner channel accepted it
  "held",           // with our team to review or forward by hand
  "not-introduced", // we won't introduce anyone (already signed, no permission, no coverage)
  "accepted",       // a partner took it on and made contact
  "appointment",    // appraisal or buyer consultation booked
  "signed",         // agency agreement or buyer's agent engagement signed
  "closed",         // ended without an engagement
] as const;
export type IntroStatus = (typeof INTRO_STATUSES)[number];

export const STATUS_LABELS: Record<IntroStatus, string> = {
  received: "Received",
  sent: "Sent to partner",
  held: "With our team",
  "not-introduced": "Not introduced",
  accepted: "Partner accepted",
  appointment: "Appraisal or consultation booked",
  signed: "Agreement signed",
  closed: "Closed",
};

/** LeadEvent.type values. */
export const LEAD_EVENT_TYPES = [
  "submitted",
  "delivered",
  "delivery-failed",
  "held",
  "not-introduced",
  "status-changed",
  "feedback",
  "guide-delivered",
  "plan-emailed",
  "sequence-email",
  "check-in-sent",
  "unsubscribed",
  "duplicate-submit",
] as const;
export type LeadEventType = (typeof LEAD_EVENT_TYPES)[number];

/** Statuses the team can record from the admin page, in pipeline order. */
export const RECORDABLE_STATUSES: readonly IntroStatus[] = ["held", "sent", "accepted", "appointment", "signed", "closed", "not-introduced"];

const CONTACT_WORDS: Record<ContactMethod, string> = {
  phone: "by phone",
  sms: "by text message",
  email: "by email",
};

export interface IntroOutcomeCopy {
  headline: string;
  body: string;
  /** Who will contact the person. */
  who: string;
}

/**
 * What the confirmation page and email say, from the request's real status.
 * "sent" only when the partner channel accepted it.
 */
export function outcomeCopy(input: {
  service: IntroService;
  status: IntroStatus;
  reason?: string | null;
  areaLabel?: string | null;
  contact?: ContactMethod | null;
}): IntroOutcomeCopy {
  const pro = SERVICES[input.service].short;
  const area = input.areaLabel?.trim() || "your area";
  const how = input.contact ? CONTACT_WORDS[input.contact] : "the way you asked";
  switch (input.status) {
    case "sent":
      return {
        headline: `We’ve passed your request to one ${pro}`,
        body: `One participating ${pro} who covers ${area} has your request. They’ll contact you ${how}, normally ${RESPONSE_WINDOW}. If you haven’t heard by then, reply to our confirmation email and we’ll follow up. Nobody else has your details.`,
        who: `One participating ${pro}`,
      };
    case "not-introduced":
      if (input.reason?.startsWith("already")) {
        return {
          headline: "We won’t introduce another agent",
          body: `You told us you’re already working with ${input.service === "selling-agent" ? "a selling agent" : "a buyer’s agent"}, so we haven’t passed your details to anyone. The guides and tools are still yours, and the checklists below cover the stage you’re at.`,
          who: "Nobody. Your details stay with us.",
        };
      }
      return {
        headline: "We haven’t introduced you to anyone",
        body: "Without your permission we don’t pass your details on. You can come back and ask any time.",
        who: "Nobody. Your details stay with us.",
      };
    case "held":
    default:
      return {
        headline: "Our team has your request",
        body: `Someone from our team will read it and email you ${RESPONSE_WINDOW} to confirm whether we can introduce a participating ${pro} in ${area}${input.reason?.includes("six months") ? ", and the best time to do it" : ""}. Until then nobody else has your details.`,
        who: "Our team first, then one agent if we can match you",
      };
  }
}
