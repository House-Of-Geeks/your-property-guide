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
      <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow">
        <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden">
          <Image
            src={agent.image}
            alt={agent.fullName}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
            {agent.fullName}
          </p>
          <p className="text-sm text-gray-500">
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
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-sm text-gray-600">
              {agent.averageRating} ({agent.reviewCount} reviews)
            </span>
          </div>
          {showContact && (
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {agent.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                Email
              </span>
            </div>
          )}
          {agent.isFeatured && (
            <Badge variant="accent" className="mt-2">Featured Agent</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}

export function AgentCardCompact({ agent }: { agent: Agent }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden">
        <Image
          src={agent.image}
          alt={agent.fullName}
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>
      <div>
        <Link href={`/agents/${agent.slug}`} className="text-sm font-medium text-gray-900 hover:text-primary">
          {agent.fullName}
        </Link>
        <p className="text-xs text-gray-500">{agent.phone}</p>
      </div>
    </div>
  );
}
