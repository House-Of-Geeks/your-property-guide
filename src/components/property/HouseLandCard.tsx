import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Car, Ruler } from "lucide-react";
import { Badge } from "@/components/ui";
import type { HouseAndLandPackage } from "@/types";

interface HouseLandCardProps {
  pkg: HouseAndLandPackage;
}

export function HouseLandCard({ pkg }: HouseLandCardProps) {
  return (
    <Link href={`/house-and-land/${pkg.slug}`} className="group block">
      <div className="rounded-2xl bg-surface-raised border border-line overflow-hidden hover:border-ink hover:shadow-card-hover transition-all duration-200 flex flex-col h-full">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={pkg.images[0]?.url || "/images/placeholder.jpg"}
            alt={pkg.title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {pkg.isNew && (
            <div className="absolute top-3 left-3">
              <Badge variant="accent">New Package</Badge>
            </div>
          )}
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <p className="font-display text-xl text-ink leading-tight">{pkg.price.display}</p>
          <h3 className="text-sm font-sans font-medium text-ink mt-2 group-hover:text-primary transition-colors line-clamp-2">
            {pkg.title}
          </h3>
          <p className="text-xs font-sans text-ink-subtle mt-1 line-clamp-1">
            {pkg.builder} &middot; {pkg.estate}, {pkg.suburb}
          </p>
          <div className="flex items-center gap-4 text-sm font-sans text-ink-muted mt-3">
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4 text-ink-subtle" aria-hidden="true" /> {pkg.features.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-ink-subtle" aria-hidden="true" /> {pkg.features.bathrooms}
            </span>
            <span className="flex items-center gap-1">
              <Car className="w-4 h-4 text-ink-subtle" aria-hidden="true" /> {pkg.features.carSpaces}
            </span>
            <span className="flex items-center gap-1">
              <Ruler className="w-4 h-4 text-ink-subtle" aria-hidden="true" /> {pkg.features.landSize}m²
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
