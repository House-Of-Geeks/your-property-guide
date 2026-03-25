import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Users } from "lucide-react";
import type { Agency } from "@/types";

interface AgencyCardProps {
  agency: Agency;
}

export function AgencyCard({ agency }: AgencyCardProps) {
  return (
    <Link href={`/agencies/${agency.slug}`} className="group block">
      <div className="p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
            <Image
              src={agency.logo}
              alt={agency.name}
              fill
              className="object-contain p-1"
              sizes="64px"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
              {agency.name}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {agency.address.suburb}, {agency.address.state}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{agency.description}</p>
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {agency.agentIds.length} agents
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            {agency.phone}
          </span>
        </div>
      </div>
    </Link>
  );
}
