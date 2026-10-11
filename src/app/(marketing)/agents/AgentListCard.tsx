import Link from "next/link";
import Image from "next/image";
import { Phone, Star } from "lucide-react";
import type { Agent } from "@/types";
import { showsRating } from "./agent-meta";

// The directory card for /agents. Replaces the shared AgentCard here because
// that card always printed a rating ("0 (0 reviews)" on every listed agent)
// and a "Featured Agent" badge with no stated criterion (owner decision,
// 10 Oct 2026). The rating shows only with real reviews; there is no badge.
export function AgentListCard({ agent }: { agent: Agent }) {
  return (
    <Link href={`/agents/${agent.slug}`} className="group block">
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-surface-raised border border-line hover:border-ink hover:shadow-card-hover transition-all duration-200">
        <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border border-line-warm">
          <Image src={agent.image} alt={agent.fullName} fill className="object-cover" sizes="64px" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-lg text-ink leading-tight group-hover:text-primary transition-colors">
            {agent.fullName}
          </p>
          <p className="text-sm font-sans text-ink-muted mt-1">
            {agent.title}
            {agent.agencyName ? <> · {agent.agencyName}</> : null}
          </p>
          {showsRating(agent) && (
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-3.5 h-3.5 text-cta fill-cta" aria-hidden="true" />
              <span className="text-sm font-sans text-ink-muted">
                {agent.averageRating}{" "}
                <span className="text-ink-subtle">({agent.reviewCount} review{agent.reviewCount === 1 ? "" : "s"})</span>
              </span>
            </div>
          )}
          {agent.phone && (
            <p className="flex items-center gap-1.5 mt-3 text-sm font-sans text-ink-muted">
              <Phone className="w-3.5 h-3.5 text-ink-subtle" aria-hidden="true" />
              {agent.phone}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
