import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Car, MapPin } from "lucide-react";
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
        <div className="flex gap-4 rounded-xl bg-surface-raised overflow-hidden border border-line hover:border-ink hover:shadow-card-hover transition-all duration-200">
          <div className="group relative w-72 flex-shrink-0 overflow-hidden">
            <Image
              src={images[0]?.url || "/images/placeholder.jpg"}
              alt={images[0]?.alt || address.full}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              sizes="288px"
            />
            <StatusBadge status={status} listingType={listingType} />
          </div>
          <div className="flex-1 p-5">
            <p className="font-display text-xl text-ink leading-tight">{price.display}</p>
            <p className="text-sm font-sans text-ink-muted mt-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-ink-subtle" aria-hidden="true" />
              {address.full}
            </p>
            <FeatureIcons features={features} className="mt-3" />
            <div className="mt-3 flex gap-2">
              <Badge>{propertyType}</Badge>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={href} className="block">
        <div className="rounded-2xl bg-surface-raised border border-line overflow-hidden hover:border-ink hover:shadow-card-hover transition-all duration-200">
          <div className="group relative aspect-[4/3] overflow-hidden">
            <Image
              src={images[0]?.url || "/images/placeholder.jpg"}
              alt={images[0]?.alt || address.full}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <StatusBadge status={status} listingType={listingType} />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent p-5">
              <p className="font-display text-2xl text-white leading-tight">{price.display}</p>
              <p className="text-sm font-sans text-white/85 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                {address.full}
              </p>
            </div>
          </div>
          <div className="p-5">
            <FeatureIcons features={features} />
            <div className="mt-3 flex gap-2">
              <Badge>{propertyType}</Badge>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid variant (default)
  return (
    <Link href={href} className="block">
      <div className="rounded-2xl bg-surface-raised overflow-hidden border border-line hover:border-ink hover:shadow-card-hover transition-all duration-200 flex flex-col h-full">
        {/* Image with suburb overlay */}
        <div className="group relative aspect-[4/3] overflow-hidden">
          <Image
            src={images[0]?.url || "/images/placeholder.jpg"}
            alt={images[0]?.alt || address.full}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <StatusBadge status={status} listingType={listingType} />
          {/* Suburb + state overlaid bottom-left */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent pt-10 pb-3 px-4">
            <p className="text-sm font-sans font-medium text-white drop-shadow">
              {address.suburb} <span className="font-normal opacity-80">· {address.state}</span>
            </p>
          </div>
        </div>
        {/* Card body */}
        <div className="p-5 flex-1 flex flex-col">
          <p className="font-display text-xl text-ink leading-tight">{price.display}</p>
          <FeatureIcons features={features} className="mt-3" />
          <p className="text-xs font-sans text-ink-subtle mt-3 truncate">{address.street}</p>
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
    <div className={cn("flex items-center gap-5 text-ink-muted", className)}>
      <span className="flex items-center gap-1.5 text-sm font-sans">
        <Bed className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
        <strong className="font-semibold text-ink">{features.bedrooms}</strong>
      </span>
      <span className="flex items-center gap-1.5 text-sm font-sans">
        <Bath className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
        <strong className="font-semibold text-ink">{features.bathrooms}</strong>
      </span>
      <span className="flex items-center gap-1.5 text-sm font-sans">
        <Car className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
        <strong className="font-semibold text-ink">{features.carSpaces}</strong>
      </span>
    </div>
  );
}
