import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Users } from "lucide-react";
import type { Agency } from "@/types";

interface AgencyCardProps {
  agency: Agency;
}

export function AgencyCard({ agency }: AgencyCardProps) {
  return (
    <Link href={`/real-estate-agencies/${agency.slug}`} className="group block">
      <div className="p-6 rounded-2xl bg-surface-raised border border-line hover:border-ink hover:shadow-card-hover transition-all duration-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-line-warm bg-surface-warm">
            <Image
              src={agency.logo}
              alt={agency.name}
              fill
              className="object-contain p-1.5"
              sizes="64px"
            />
          </div>
          <div>
            <h3 className="font-display text-lg text-ink leading-tight group-hover:text-primary transition-colors">
              {agency.name}
            </h3>
            <p className="text-sm font-sans text-ink-muted flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-ink-subtle" aria-hidden="true" />
              {agency.address.suburb}, {agency.address.state}
            </p>
          </div>
        </div>
        <p className="text-sm font-sans text-ink-muted leading-relaxed line-clamp-2">{agency.description}</p>
        <div className="flex items-center gap-5 mt-4 text-sm font-sans text-ink-muted">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
            {agency.agentIds.length} agents
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
            {agency.phone}
          </span>
        </div>
      </div>
    </Link>
  );
}
