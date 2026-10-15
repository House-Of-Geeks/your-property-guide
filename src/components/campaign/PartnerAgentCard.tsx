import Image from "next/image";
import { getAgentBySlug } from "@/lib/services/agent-service";
import { PARTNER_AGENTS } from "@/lib/partner-agents";

// One partner agent, from real data (v6). It renders only for an agent Andy
// has listed in src/lib/partner-agents.ts, with figures from their database
// row and the campaign approach they've written. With no partner listed, or
// the row missing, it renders nothing: no placeholder agent, ever.

export async function PartnerAgentCard() {
  const partner = PARTNER_AGENTS[0];
  if (!partner) return null;
  const agent = await getAgentBySlug(partner.agentSlug).catch(() => null);
  if (!agent) return null;

  const facts = [
    agent.propertiesSold > 0 ? { value: String(agent.propertiesSold), label: "properties sold" } : null,
    agent.reviewCount > 0 ? { value: `${agent.averageRating.toFixed(1)} from ${agent.reviewCount}`, label: "reviews from past clients" } : null,
    agent.yearsExperience > 0 ? { value: String(agent.yearsExperience), label: "years selling" } : null,
  ].filter((f): f is { value: string; label: string } => f !== null);

  return (
    <article className="tone-light rounded-3xl bg-white p-6 text-ink shadow-card sm:p-7">
      <p className="text-sm font-semibold text-ink-muted">A partner agent, checked by us</p>
      <div className="mt-4 flex items-center gap-4">
        {agent.image && (
          <Image src={agent.image} alt={agent.imageAlt ?? agent.fullName} width={64} height={64} className="h-16 w-16 rounded-full object-cover" />
        )}
        <div>
          <h3 className="text-xl text-ink">{agent.fullName}</h3>
          <p className="text-sm text-ink-muted">{[agent.agencyName, partner.suburbs.join(", ")].filter(Boolean).join(" · ")}</p>
        </div>
      </div>
      {facts.length > 0 && (
        <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-line py-4">
          {facts.map((f) => (
            <div key={f.label}>
              <dd className="font-display text-xl leading-none text-ink">{f.value}</dd>
              <dt className="mt-1 text-xs text-ink-muted">{f.label}</dt>
            </div>
          ))}
        </dl>
      )}
      <h4 className="mt-5 text-sm text-ink">How they run a campaign</h4>
      <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{partner.campaignApproach}</p>
    </article>
  );
}
