"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyEnquireModal } from "./PropertyEnquireModal";
import { RevealPhone } from "./RevealPhone";
import type { Agent, Agency } from "@/types";

interface AgentSidebarCardProps {
  agents: Agent[];           // 1 or 2 agents
  agency: Agency | null;
  propertyId: string;
  agencyId: string;
  propertyAddress: string;
  inspectionTimes: string[];
  landSize?: number;
  buildingSize?: number;
  priceDisplay: string;
}

export function AgentSidebarCard({
  agents,
  agency,
  propertyId,
  agencyId,
  propertyAddress,
  inspectionTimes,
  landSize,
  buildingSize,
  priceDisplay,
}: AgentSidebarCardProps) {
  const [idx, setIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const agent = agents[idx];
  const hasMultiple = agents.length > 1;

  if (!agent) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Prev / Next arrows */}
      {hasMultiple && hovered && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + agents.length) % agents.length)}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-card border border-gray-100 flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
            aria-label="Previous agent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % agents.length)}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-card border border-gray-100 flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
            aria-label="Next agent"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div className="rounded-2xl bg-white shadow-card border border-gray-100 overflow-visible">
        {/* Top: agent photo (protruding) + agency logo */}
        <div className="relative px-5 pt-5">
          <div className="flex items-start justify-between">
            {/* Protruding agent photo */}
            <div className="relative -mt-12 flex-shrink-0">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                <Image
                  src={agent.image}
                  alt={agent.fullName}
                  fill
                  className="object-cover transition-all duration-300"
                  sizes="80px"
                />
              </div>
            </div>
            {/* Agency logo top-right */}
            {agency && (
              <Link href={`/real-estate-agencies/${agency.slug}`} className="flex-shrink-0 mt-1">
                <Image
                  src={agency.logo}
                  alt={agency.name}
                  width={100}
                  height={40}
                  className="object-contain max-h-10"
                />
              </Link>
            )}
          </div>

          {/* Agent name + agency */}
          <div className="mt-3 pb-4 border-b border-gray-100">
            <Link
              href={`/agents/${agent.slug}`}
              className="font-bold text-gray-900 hover:text-primary text-base leading-tight block transition-colors"
            >
              {agent.fullName}
            </Link>
            {agency && (
              <Link href={`/real-estate-agencies/${agency.slug}`} className="text-sm text-gray-500 hover:text-primary">
                {agency.name}
              </Link>
            )}
            {/* Agent dots indicator */}
            {hasMultiple && (
              <div className="flex gap-1.5 mt-2">
                {agents.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? "bg-primary" : "bg-gray-300"}`}
                    aria-label={`Agent ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info rows */}
        <div className="px-5 py-4 space-y-3 border-b border-gray-100">
          {[
            inspectionTimes.length > 0
              ? `Inspection times (${inspectionTimes.length})`
              : "Inspection times",
            "Rates and fees",
            landSize
              ? `Property size — ${landSize.toLocaleString()} m²`
              : "Property size",
            `Price guide — ${priceDisplay}`,
          ].map((label) => (
            <div key={label} className="flex items-center gap-3">
              <span className="w-4 h-4 flex-shrink-0 rounded border border-gray-300 bg-white" />
              <span className="text-sm text-gray-700">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="px-5 py-4 space-y-2.5">
          <PropertyEnquireModal
            propertyId={propertyId}
            agentId={agent.id}
            agencyId={agencyId}
            propertyAddress={propertyAddress}
            agentFirstName={agent.firstName}
          />
          <RevealPhone
            phone={agent.phone}
            agentId={agent.id}
            propertyId={propertyId}
          />
        </div>
      </div>
    </div>
  );
}
