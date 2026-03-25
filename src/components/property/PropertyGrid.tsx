import { PropertyCard } from "./PropertyCard";
import type { Property } from "@/types";

interface PropertyGridProps {
  properties: Property[];
  variant?: "grid" | "list";
  emptyMessage?: string;
}

export function PropertyGrid({
  properties,
  variant = "grid",
  emptyMessage = "No properties found matching your criteria.",
}: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-4">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} variant="list" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} variant="grid" />
      ))}
    </div>
  );
}
