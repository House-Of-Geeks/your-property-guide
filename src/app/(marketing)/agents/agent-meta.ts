// What the agent directory and the agent profiles may say about an agent.
// Pure; tested in tests/seo/agents-directory.test.ts.
//
// Owner decision, 10 Oct 2026: the Thomson Property Group agents on /agents
// are real agents who agreed to be listed, so the profiles stay. What goes is
// any claim the site cannot back: "vetted" (no vetting criteria are stated),
// a "Featured Agent" badge (no criterion for featuring), a rating block that
// reads "0 (0 reviews)", and a meta description that said "0 properties
// sold" while the page listed seven sold properties.
import type { Agent } from "@/types/agent";

/** "burpengary-qld-4505" -> "Burpengary". */
export function suburbNameFromSlug(slug: string): string {
  return slug
    .replace(/-[a-z]{2,3}-\d{4}$/, "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** A rating prints only when real reviews stand behind it. */
export function showsRating(agent: Pick<Agent, "reviewCount" | "averageRating">): boolean {
  return agent.reviewCount > 0 && agent.averageRating > 0;
}

/** A sales total prints only when the profile records one: a 0 beside a list of sold properties contradicts the page. */
export function showsSalesTotal(agent: Pick<Agent, "propertiesSold">): boolean {
  return agent.propertiesSold > 0;
}

const DESCRIPTION_BUDGET = 160;

function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/**
 * The profile's meta description: who the agent is and the suburbs they
 * cover, by name. No sales count (the profile's own field and the sold
 * listings on the page can disagree), no rating, no ranking word.
 */
export function agentMetaDescription(agent: Pick<Agent, "fullName" | "firstName" | "title" | "agencyName" | "suburbs">): string {
  const role = (agent.title || "Real estate agent").trim();
  const at = agent.agencyName ? ` at ${agent.agencyName}` : "";
  const lead = `${agent.fullName}, ${role.charAt(0).toLowerCase()}${role.slice(1)}${at}`;
  const close = "Contact details and listings.";
  const names = agent.suburbs.map(suburbNameFromSlug).filter(Boolean);
  // Drop suburbs from the end until the sentence fits the budget.
  for (let n = names.length; n >= 1; n--) {
    const shown = names.slice(0, n);
    const list = n < names.length ? `${shown.join(", ")} and nearby suburbs` : joinNames(shown);
    const text = `${lead}, covering ${list}. ${close}`;
    if (text.length <= DESCRIPTION_BUDGET) return text;
  }
  const bare = `${lead}. ${close}`;
  return bare.length <= DESCRIPTION_BUDGET ? bare : `${agent.fullName}. ${close}`;
}
