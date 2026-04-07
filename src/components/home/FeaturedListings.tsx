import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui";
import { getProperties } from "@/lib/services/property-service";

export async function FeaturedListings() {
  const featured = await getProperties({ listingType: "buy" });
  const displayProperties = featured.filter((p) => p.isFeatured).slice(0, 6);

  if (displayProperties.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Properties for sale</h2>
            <p className="text-gray-500 mt-1">Current listings across our covered areas</p>
          </div>
          <Link href="/buy" className="hidden sm:block">
            <Button variant="outline" size="sm">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProperties.map((property) => (
            <PropertyCard key={property.id} property={property} variant="featured" />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/buy">
            <Button variant="outline">
              View All Properties <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
