"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Mail } from "lucide-react";
import { PropertyEnquireDialog, type EnquiryType } from "./PropertyEnquireModal";
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
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [enquireSelected, setEnquireSelected] = useState<EnquiryType[]>([]);
  const agent = agents[idx];
  const hasMultiple = agents.length > 1;

  if (!agent) return null;

  // Each info-row button opens the enquire modal pre-checked with that topic,
  // so the row is actual UI rather than a faux-checkbox label.
  const openEnquire = (preset: EnquiryType[] = []) => {
    setEnquireSelected(preset);
    setEnquireOpen(true);
  };

  const infoRows: Array<{ key: EnquiryType; label: string }> = [
    {
      key: "Inspection times",
      label: inspectionTimes.length > 0
        ? `Inspection times (${inspectionTimes.length})`
        : "Inspection times",
    },
    { key: "Rates and fees", label: "Rates and fees" },
    {
      key: "Property size",
      label: landSize ? `Property size, ${landSize.toLocaleString()} m²` : "Property size",
    },
    { key: "Price guide", label: `Price guide, ${priceDisplay}` },
  ];

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
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-surface-raised border border-line shadow-card flex items-center justify-center text-ink-muted hover:text-primary hover:border-ink transition-colors"
            aria-label="Previous agent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % agents.length)}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-surface-raised border border-line shadow-card flex items-center justify-center text-ink-muted hover:text-primary hover:border-ink transition-colors"
            aria-label="Next agent"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div className="rounded-2xl bg-surface-raised border border-line shadow-card overflow-visible">
        {/* Top: agent photo (protruding) + agency logo */}
        <div className="relative px-5 pt-5">
          <div className="flex items-start justify-between">
            {/* Protruding agent photo */}
            <div className="relative -mt-12 flex-shrink-0">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-surface-raised shadow-md">
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
          <div className="mt-3 pb-4 border-b border-line">
            <Link
              href={`/agents/${agent.slug}`}
              className="font-display text-base text-ink hover:text-primary leading-tight block transition-colors"
            >
              {agent.fullName}
            </Link>
            {agency && (
              <Link href={`/real-estate-agencies/${agency.slug}`} className="text-sm font-sans text-ink-muted hover:text-primary mt-1 block">
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
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? "bg-cta" : "bg-line-strong"}`}
                    aria-label={`Agent ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info rows, each click opens the enquire modal pre-checked for
            that topic. Previously these were faux-checkbox labels that did
            nothing; visitors who tried to click bounced. */}
        <div className="px-5 py-1 border-b border-line">
          {infoRows.map((row) => (
            <button
              key={row.key}
              type="button"
              onClick={() => openEnquire([row.key])}
              className="w-full flex items-center gap-3 py-3 -mx-2 px-2 rounded-lg text-left hover:bg-surface-sunken transition-colors group cursor-pointer"
            >
              <span className="w-4 h-4 flex-shrink-0 rounded border border-line-strong bg-surface-raised group-hover:border-primary transition-colors" />
              <span className="text-sm font-sans text-ink-muted group-hover:text-ink transition-colors">{row.label}</span>
            </button>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="px-5 py-4 space-y-2.5">
          <button
            onClick={() => openEnquire([])}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Enquire
          </button>
          <RevealPhone
            phone={agent.phone}
            agentId={agent.id}
            propertyId={propertyId}
          />
        </div>
      </div>

      <PropertyEnquireDialog
        open={enquireOpen}
        onClose={() => setEnquireOpen(false)}
        initialSelected={enquireSelected}
        propertyId={propertyId}
        agentId={agent.id}
        agencyId={agencyId}
        propertyAddress={propertyAddress}
        agentFirstName={agent.firstName}
      />
    </div>
  );
}
