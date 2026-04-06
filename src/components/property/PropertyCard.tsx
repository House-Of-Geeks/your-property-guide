import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Car, Ruler, MapPin } from "lucide-react";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  variant?: "grid" | "list" | "featured";
}

export function PropertyCard({ property, variant = "grid" }: PropertyCardProps) {
  const { address, price, features, images, listingType, propertyType, status } = property;
  const href = listingType === "rent" ? `/rent/${property.slug}` : listingType === "sold" ? `/sold/${property.slug}` : `/buy/${property.slug}`;

  if (variant === "list") {
    return (
      <Link href={href} className="block">
        <div className="flex gap-4 rounded-xl bg-white overflow-hidden shadow-card hover:shadow-card-hover transition-shadow border border-gray-100">
          <div className="relative w-72 flex-shrink-0">
            <Image
              src={images[0]?.url || "/images/placeholder.jpg"}
              alt={images[0]?.alt || address.full}
              fill
              className="object-cover"
              sizes="288px"
            />
            <StatusBadge status={status} listingType={listingType} />
          </div>
          <div className="flex-1 p-4">
            <p className="text-lg font-bold text-gray-900">{price.display}</p>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {address.full}
            </p>
            <FeatureIcons features={features} className="mt-3" />
            <div className="mt-2 flex gap-2">
              <Badge>{propertyType}</Badge>
              {property.isFeatured && <Badge variant="accent">Featured</Badge>}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={href} className="block">
        <div className="rounded-xl bg-white shadow-card border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
          <div className="relative aspect-[4/3]">
            <Image
              src={images[0]?.url || "/images/placeholder.jpg"}
              alt={images[0]?.alt || address.full}
              fill
              className="object-cover transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <StatusBadge status={status} listingType={listingType} />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-xl font-bold text-white">{price.display}</p>
              <p className="text-sm text-white/90 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {address.full}
              </p>
            </div>
          </div>
          <div className="p-4">
            <FeatureIcons features={features} />
            <div className="mt-2 flex gap-2">
              <Badge>{propertyType}</Badge>
              <Badge variant="accent">Featured</Badge>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid variant (default)
  return (
    <Link href={href} className="block">
      <div className="rounded-2xl bg-white overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-200">
        {/* Image with suburb overlay */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={images[0]?.url || "/images/placeholder.jpg"}
            alt={images[0]?.alt || address.full}
            fill
            className="object-cover transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <StatusBadge status={status} listingType={listingType} />
          {/* Suburb + state overlaid bottom-left — not scaled with image */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pt-10 pb-3 px-3">
            <p className="text-sm font-semibold text-white drop-shadow">
              {address.suburb} <span className="font-normal opacity-80">· {address.state}</span>
            </p>
          </div>
        </div>
        {/* Card body */}
        <div className="p-4">
          <p className="font-bold text-gray-900 text-base">{price.display}</p>
          <FeatureIcons features={features} className="mt-2" />
          <p className="text-xs text-gray-400 mt-2 truncate">{address.street}</p>
        </div>
      </div>
    </Link>
  );
}

function StatusBadge({ status, listingType }: { status: string; listingType: string }) {
  const label =
    status === "under-contract" ? "Under Contract" :
    status === "sold" ? "Sold" :
    listingType === "off-market" ? "Off-Market" :
    listingType === "rent" ? "For Rent" :
    null;

  if (!label) return null;

  return (
    <div className="absolute top-3 left-3">
      <Badge
        variant={
          status === "sold" ? "success" :
          status === "under-contract" ? "warning" :
          listingType === "off-market" ? "primary" :
          "accent"
        }
        className="text-xs shadow-sm"
      >
        {label}
      </Badge>
    </div>
  );
}

function FeatureIcons({
  features,
  className,
}: {
  features: Property["features"];
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4 text-sm text-gray-600", className)}>
      <span className="flex items-center gap-1">
        <Bed className="w-4 h-4" /> {features.bedrooms}
      </span>
      <span className="flex items-center gap-1">
        <Bath className="w-4 h-4" /> {features.bathrooms}
      </span>
      <span className="flex items-center gap-1">
        <Car className="w-4 h-4" /> {features.carSpaces}
      </span>
      {features.landSize && (
        <span className="flex items-center gap-1">
          <Ruler className="w-4 h-4" /> {features.landSize}m²
        </span>
      )}
    </div>
  );
}
