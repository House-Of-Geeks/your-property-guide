"use client";

import { useSearchParams } from "next/navigation";
import { MatchAgent } from "./MatchAgent";

/**
 * Thin client wrapper that re-mounts MatchAgent whenever the URL search
 * params change. MatchAgent initialises step/intent/suburb from
 * `useSearchParams` once on mount; re-keying on the params string makes
 * in-page navigation (e.g. lane buttons on /find-an-expert pushing
 * ?intent=buying) actually re-initialise the form to that intent.
 *
 * On the homepage where there's no in-page nav between params, the same
 * pattern is a no-op (the key never changes during the session), so it's
 * safe to use everywhere MatchAgent is embedded.
 */
export function MatchAgentEmbed() {
  const params = useSearchParams();
  return <MatchAgent key={params.toString()} source={matchSourceFromParam(params.get("from"))} />;
}

/**
 * Pages that send readers to /find-an-expert add ?from=<page> so the lead
 * carries where it started ("find-an-expert-help-to-buy"). Only a short
 * slug is accepted; anything else keeps MatchAgent's default source.
 */
export function matchSourceFromParam(from: string | null): string | undefined {
  return from && /^[a-z0-9-]{1,40}$/.test(from) ? `find-an-expert-${from}` : undefined;
}
