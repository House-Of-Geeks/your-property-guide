import type { Lead } from "@/types";

interface RoutingResult {
  agentId: string;
  agencyId: string;
  reason: string;
}

// Agent-to-suburb coverage mapping
const AGENT_COVERAGE: Record<string, { agentId: string; agencyId: string }> = {
  "burpengary-qld-4505": { agentId: "agent-1", agencyId: "agency-1" },
  "caboolture-qld-4510": { agentId: "agent-2", agencyId: "agency-1" },
  "narangba-qld-4504": { agentId: "agent-3", agencyId: "agency-1" },
  "morayfield-qld-4506": { agentId: "agent-4", agencyId: "agency-1" },
  "deception-bay-qld-4508": { agentId: "agent-5", agencyId: "agency-1" },
  "north-lakes-qld-4509": { agentId: "agent-6", agencyId: "agency-2" },
};

const FALLBACK_AGENTS = [
  { agentId: "agent-1", agencyId: "agency-1" },
  { agentId: "agent-2", agencyId: "agency-1" },
];

let roundRobinIndex = 0;

export function routeLead(lead: Lead): RoutingResult {
  // 1. If lead has a specific agent, route directly
  if (lead.agentId) {
    return {
      agentId: lead.agentId,
      agencyId: lead.agencyId || "agency-1",
      reason: "direct-agent",
    };
  }

  // 2. If lead is for a specific property, route to listing agent
  if (lead.propertyId && lead.agentId) {
    return {
      agentId: lead.agentId,
      agencyId: lead.agencyId || "agency-1",
      reason: "listing-agent",
    };
  }

  // 3. If lead has a suburb, route to covering agent
  if (lead.suburb) {
    const coverage = AGENT_COVERAGE[lead.suburb];
    if (coverage) {
      return {
        ...coverage,
        reason: "suburb-coverage",
      };
    }
  }

  // 4. Fallback: round-robin
  const fallback = FALLBACK_AGENTS[roundRobinIndex % FALLBACK_AGENTS.length];
  roundRobinIndex++;
  return {
    ...fallback,
    reason: "round-robin",
  };
}
