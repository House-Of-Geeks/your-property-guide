"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Star } from "lucide-react";
import { Badge } from "@/components/ui";
import type { Agent } from "@/types";

interface AgentCardProps {
  agent: Agent;
  showContact?: boolean;
}

export function AgentCard({ agent, showContact = true }: AgentCardProps) {
  return (
    <Link href={`/agents/${agent.slug}`} className="group block">
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-surface-raised border border-line hover:border-ink hover:shadow-card-hover transition-all duration-200">
        <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border border-line-warm">
          <Image
            src={agent.image}
            alt={agent.fullName}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-lg text-ink leading-tight group-hover:text-primary transition-colors">
            {agent.fullName}
          </p>
          <p className="text-sm font-sans text-ink-muted mt-1">
            {agent.title}
            {agent.agencyName && agent.agencySlug && (
              <>
                {" · "}
                <span
                  className="text-primary hover:underline"
                  onClick={(e) => { e.preventDefault(); window.location.href = `/real-estate-agencies/${agent.agencySlug}`; }}
                >
                  {agent.agencyName}
                </span>
              </>
            )}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-3.5 h-3.5 text-cta fill-cta" />
            <span className="text-sm font-sans text-ink-muted">
              {agent.averageRating} <span className="text-ink-subtle">({agent.reviewCount} reviews)</span>
            </span>
          </div>
          {showContact && (
            <div className="flex items-center gap-4 mt-3 text-sm font-sans text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-ink-subtle" aria-hidden="true" />
                {agent.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-ink-subtle" aria-hidden="true" />
                Email
              </span>
            </div>
          )}
          {agent.isFeatured && (
            <Badge variant="accent" className="mt-3">Featured Agent</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}

export function AgentCardCompact({ agent }: { agent: Agent }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden border border-line-warm">
        <Image
          src={agent.image}
          alt={agent.fullName}
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>
      <div>
        <Link href={`/agents/${agent.slug}`} className="text-sm font-sans font-medium text-ink hover:text-primary">
          {agent.fullName}
        </Link>
        <p className="text-xs font-sans text-ink-subtle">{agent.phone}</p>
      </div>
    </div>
  );
}
