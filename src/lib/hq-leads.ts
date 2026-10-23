import { after } from "next/server";
import { leadGclid } from "@/lib/attribution";
import type { LeadAttribution } from "@/lib/attribution-server";
import { SITE_URL } from "@/lib/constants/seo";

// House of Geeks HQ lead hand-off, plus the spam check every lead form shares.
//
// Each accepted agent enquiry (the for-agents form) becomes a deal in HQ (POST
// {HQ_URL}/api/inbound/leads). The call is server-side only, best effort and
// never throws: the lead is already saved and the team email already goes
// out whatever HQ does. The spam check runs first, so dropped submissions
// reach neither the email nor HQ.

export const HQ_VENTURE = "your-property-guide";
export const HQ_VENTURE_NAME = "Your Property Guide";
const DEFAULT_HQ_URL = "https://hq.houseofgeeks.com.au";
const HQ_TIMEOUT_MS = 4000;

// ---------------------------------------------------------------------------
// Spam check
// ---------------------------------------------------------------------------

export interface SpamInput {
  /** The hidden "website" field. Real visitors never fill it. */
  honeypot?: string | null;
  /** Full name as typed. */
  name?: string | null;
  /** Free-text message or notes. */
  message?: string | null;
}

export type SpamVerdict = { spam: false } | { spam: true; reason: string };

// This is an English-language Australian site, so a name or message written
// mostly in these scripts is a bot, not a customer.
const FOREIGN_LETTER = /[\p{Script=Cyrillic}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;
const ANY_LETTER = /\p{L}/gu;
const LINK = /(?:https?:\/\/|www\.)\S+/gi;
const URL_IN_NAME = /https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|net|org|info|biz|xyz|top|club|online|site|shop|ru|cn|io|co|au)\b/i;
const MAX_LINKS = 2;

const SPAM_PHRASES: RegExp[] = [
  /\bseo\s+(?:services?|packages?|agency|expert|specialist|audit)\b/i,
  /\bsearch\s+engine\s+optimi[sz]ation\b/i,
  /\bback-?links?\b/i,
  /\blink[\s-]?building\b/i,
  /\bguest\s+post(?:s|ing)?\b/i,
  /\b(?:first|top)\s+page\s+(?:of|on)\s+google\b/i,
  /\brank(?:ing)?\s+(?:your\s+)?(?:website|site)\b/i,
  /\b(?:increase|boost|drive)\s+(?:your\s+)?(?:website\s+)?(?:traffic|ranking|rankings|sales\s+leads)\b/i,
  /\bdigital\s+marketing\s+(?:services?|agency|packages?)\b/i,
  /\b(?:buy|cheap)\s+(?:followers|likes|backlinks|traffic)\b/i,
  /\bmake\s+money\s+(?:online|fast|from\s+home)\b/i,
  /\b(?:casino|viagra|cialis|forex|crypto\s*(?:currency)?\s+(?:invest|trading)|bitcoin\s+(?:invest|doubl))/i,
  /\bwork\s+from\s+home\s+(?:and\s+)?earn\b/i,
];

function foreignScriptShare(text: string): number {
  const letters = text.match(ANY_LETTER)?.length ?? 0;
  if (letters === 0) return 0;
  return (text.match(FOREIGN_LETTER)?.length ?? 0) / letters;
}

/**
 * Deterministic spam check for a lead form submission. A spam verdict means
 * the route answers success but sends no email and creates no HQ deal.
 */
export function checkLeadSpam(input: SpamInput): SpamVerdict {
  if (input.honeypot && input.honeypot.trim().length > 0) return { spam: true, reason: "honeypot" };

  const name = (input.name ?? "").trim();
  const message = (input.message ?? "").trim();

  if (foreignScriptShare(name) > 0.5) return { spam: true, reason: "name_script" };
  if (foreignScriptShare(message) > 0.5) return { spam: true, reason: "message_script" };
  if (URL_IN_NAME.test(name)) return { spam: true, reason: "name_url" };
  if ((message.match(LINK)?.length ?? 0) > MAX_LINKS) return { spam: true, reason: "message_links" };

  const text = `${name}\n${message}`;
  if (SPAM_PHRASES.some((re) => re.test(text))) return { spam: true, reason: "spam_phrase" };

  return { spam: false };
}

/** The one lead HQ takes: the for-agents enquiry form, which posts a general-contact lead. */
export function isAgentEnquiry(lead: { type: string; source?: string | null }): boolean {
  return lead.type === "general-contact" && lead.source === "for-agents";
}

/** Obvious test names ("test", "Test User", "TEST Dev Bot"). They still go through, flagged as tests. */
export function isTestName(name: string | null | undefined): boolean {
  return /\b(?:test|testing|tester)\b/i.test(name ?? "");
}

// ---------------------------------------------------------------------------
// HQ hand-off
// ---------------------------------------------------------------------------

export interface HqAttribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  referrer?: string;
  landing_page?: string;
}

export interface HqLead {
  name: string;
  email?: string | null;
  phone?: string | null;
  /** Short snake_case label of which form, e.g. "agent_enquiry". */
  source: string;
  /** One line. */
  brief: string;
  /** The full message and form fields as readable text. */
  notes: string;
  sourceUrl?: string | null;
  nextAction?: string;
  attribution?: HqAttribution;
}

/** Readable "Label: value" lines, skipping blanks. */
export function hqNotes(rows: Array<[string, string | number | null | undefined]>): string {
  return rows
    .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "")
    .map(([k, v]) => `${k}: ${String(v).trim()}`)
    .join("\n");
}

/** Absolute URL of the page the form was submitted from, or the site root. */
export function hqSourceUrl(sourcePage: string | null | undefined): string {
  return sourcePage ? `${SITE_URL}${sourcePage.startsWith("/") ? "" : "/"}${sourcePage}` : SITE_URL;
}

/** Map the ypg_attr cookie state onto HQ's attribution fields. */
export function hqAttribution(a: LeadAttribution): HqAttribution | undefined {
  const s = a.state;
  if (!s) return undefined;
  const touch = s.last ?? s.first;
  const out: HqAttribution = {};
  const set = <K extends keyof HqAttribution>(key: K, value: string | undefined | null) => {
    if (value) out[key] = value as HqAttribution[K];
  };
  set("utm_source", touch.utm_source);
  set("utm_medium", touch.utm_medium);
  set("utm_campaign", touch.utm_campaign);
  set("utm_term", touch.utm_term);
  set("utm_content", touch.utm_content);
  set("gclid", leadGclid(s));
  set("fbclid", touch.fbclid ?? s.first.fbclid);
  set("msclkid", s.microsoft?.msclkid ?? touch.msclkid);
  set("referrer", s.first.referrer);
  set("landing_page", s.first.landing_page);
  return Object.keys(out).length > 0 ? out : undefined;
}

function hqConfig(): { url: string; secret: string } | null {
  const secret = process.env.HQ_LEADS_SECRET?.trim();
  if (!secret) return null;
  const url = (process.env.HQ_URL?.trim() || DEFAULT_HQ_URL).replace(/\/+$/, "");
  return { url, secret };
}

/**
 * Post one lead to HQ. Never throws and never rejects: a missing secret, a
 * timeout, a non-2xx or a network error is logged and swallowed. Returns
 * whether HQ accepted it.
 */
export async function sendLeadToHq(lead: HqLead): Promise<boolean> {
  const cfg = hqConfig();
  if (!cfg) {
    console.log("HQ lead skipped: HQ_LEADS_SECRET is not set");
    return false;
  }
  try {
    const body = {
      venture: HQ_VENTURE,
      ventureName: HQ_VENTURE_NAME,
      name: lead.name,
      email: lead.email || undefined,
      phone: lead.phone || undefined,
      source: lead.source,
      brief: lead.brief,
      notes: lead.notes,
      sourceUrl: lead.sourceUrl || undefined,
      nextAction: lead.nextAction,
      attribution: lead.attribution,
      ...(isTestName(lead.name) ? { test: true } : {}),
    };
    const res = await fetch(`${cfg.url}/api/inbound/leads`, {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.secret}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(HQ_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error("HQ lead rejected:", { status: res.status, source: lead.source });
      return false;
    }
    return true;
  } catch (err) {
    console.error("HQ lead failed:", { source: lead.source, error: err instanceof Error ? err.message : String(err) });
    return false;
  }
}

/**
 * Send a lead to HQ after the response, so the visitor never waits on HQ.
 * Where there is no request scope (unit tests), it runs unawaited instead.
 * Does nothing, beyond a log line, when HQ_LEADS_SECRET is not set.
 */
export function deferLeadToHq(lead: HqLead): void {
  if (!hqConfig()) {
    console.log("HQ lead skipped: HQ_LEADS_SECRET is not set");
    return;
  }
  const task = () => sendLeadToHq(lead);
  try {
    after(task);
  } catch {
    void task();
  }
}
