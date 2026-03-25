import Image from "next/image";
import Link from "next/link";
import { Lock, Bed, Bath, Car, MapPin } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import type { Property } from "@/types";

interface OffMarketTeaserProps {
  property: Property;
}

export function OffMarketTeaser({ property }: OffMarketTeaserProps) {
  const { features, address, price } = property;

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Blurred image */}
      <div className="relative aspect-[4/3]">
        <Image
          src={property.images[0]?.url || "/images/placeholder.jpg"}
          alt="Off-market property"
          fill
          className="object-cover off-market-blur"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="text-center">
            <Lock className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-white font-semibold">Off-Market Listing</p>
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="primary">Off-Market</Badge>
        </div>
      </div>

      <div className="p-4">
        <p className="font-bold text-gray-900">{price.display}</p>
        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {address.suburb}, {address.state} {address.postcode}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
          <span className="flex items-center gap-1">
            <Bed className="w-4 h-4" /> {features.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-4 h-4" /> {features.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Car className="w-4 h-4" /> {features.carSpaces}
          </span>
        </div>
        <Link href="/off-market" className="block mt-4">
          <Button variant="primary" size="sm" className="w-full">
            <Lock className="w-3.5 h-3.5" />
            Register to View
          </Button>
        </Link>
      </div>
    </div>
  );
}
