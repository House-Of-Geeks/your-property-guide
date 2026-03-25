import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Car, Ruler, Package } from "lucide-react";
import { Badge } from "@/components/ui";
import type { HouseAndLandPackage } from "@/types";

interface HouseLandCardProps {
  pkg: HouseAndLandPackage;
}

export function HouseLandCard({ pkg }: HouseLandCardProps) {
  return (
    <Link href={`/house-and-land/${pkg.slug}`} className="group block">
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-[4/3]">
          <Image
            src={pkg.images[0]?.url || "/images/placeholder.jpg"}
            alt={pkg.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {pkg.isNew && (
            <div className="absolute top-3 left-3">
              <Badge variant="accent">New Package</Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="font-bold text-gray-900">{pkg.price.display}</p>
          <h3 className="text-sm font-medium text-gray-900 mt-1 group-hover:text-primary transition-colors">
            {pkg.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {pkg.builder} &middot; {pkg.estate}, {pkg.suburb}
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-600 mt-3">
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" /> {pkg.features.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" /> {pkg.features.bathrooms}
            </span>
            <span className="flex items-center gap-1">
              <Car className="w-4 h-4" /> {pkg.features.carSpaces}
            </span>
            <span className="flex items-center gap-1">
              <Ruler className="w-4 h-4" /> {pkg.features.landSize}m²
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
