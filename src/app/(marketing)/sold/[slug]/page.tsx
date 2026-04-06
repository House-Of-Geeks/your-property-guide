import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bed, Bath, Car, MapPin, Calendar } from "lucide-react";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { Badge } from "@/components/ui";
import { getPropertyBySlug } from "@/lib/services/property-service";
import { formatPriceFull, formatDate } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";
import { auth } from "@/auth";
import { isPropertySaved } from "@/lib/actions/dashboard";
import { PropertyActions } from "@/components/property/PropertyActions";

interface SoldDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SoldDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };
  const description = `${property.address.full} sold for ${property.soldPrice ? formatPriceFull(property.soldPrice) : "undisclosed price"}.`;
  return {
    title: `Sold - ${property.address.full}`,
    description,
    alternates: { canonical: `${SITE_URL}/sold/${slug}` },
    openGraph: {
      title: `Sold - ${property.address.full}`,
      description,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SoldDetailPage({ params }: SoldDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const session = await auth();
  const isLoggedIn = !!session?.user?.email;
  const initialSaved = await isPropertySaved(property.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Sold", url: "/sold" },
          { name: property.address.street, url: `/sold/${property.slug}` },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Sold", href: "/sold" },
          { label: property.address.street },
        ]}
      />

      <div className="max-w-4xl mt-4 space-y-6">
        <PropertyGallery images={property.images} address={property.address.full} />

        <div>
          <Badge variant="success">Sold</Badge>
          <div className="flex items-start justify-between gap-4 mt-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {property.address.full}
            </h1>
            <PropertyActions
              propertyId={property.id}
              address={property.address.full}
              initialSaved={initialSaved}
              isLoggedIn={isLoggedIn}
            />
          </div>
          {property.soldPrice && (
            <p className="text-xl font-semibold text-gray-700 flex items-center gap-1 mt-1">
              <MapPin className="w-5 h-5" /> {formatPriceFull(property.soldPrice)}
            </p>
          )}
          {property.dateSold && (
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-2">
              <Calendar className="w-4 h-4" /> Sold {formatDate(property.dateSold)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-6 py-4 border-y border-gray-200">
          <span className="flex items-center gap-2 text-gray-700"><Bed className="w-5 h-5" /> {property.features.bedrooms} Beds</span>
          <span className="flex items-center gap-2 text-gray-700"><Bath className="w-5 h-5" /> {property.features.bathrooms} Baths</span>
          <span className="flex items-center gap-2 text-gray-700"><Car className="w-5 h-5" /> {property.features.carSpaces} Cars</span>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">About This Property</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
        </div>
      </div>
    </div>
  );
}
