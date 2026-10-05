import type { Lead } from "@/types";

interface RoutingResult {
  agentId: string;
  reason: string;
}

// A lead is assigned to an agent only when the visitor chose one: the
// form was on that agent's profile or on a listing, so it carries the
// agentId. Every other lead stays unassigned and the team places it with
// one paying agent by hand. The suburb map and round-robin fallback that
// used to sit here were placeholders that named Thomson agents on leads
// nobody had assigned to them.
export function routeLead(lead: Lead): RoutingResult | null {
  if (lead.agentId) {
    return { agentId: lead.agentId, reason: "direct-agent" };
  }
  return null;
}
