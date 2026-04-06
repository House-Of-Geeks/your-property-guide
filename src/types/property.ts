export type ListingType = "buy" | "rent" | "sold" | "off-market" | "house-and-land";

export type PropertyType =
  | "house"
  | "townhouse"
  | "apartment"
  | "unit"
  | "land"
  | "acreage"
  | "villa";

export type PropertyStatus = "active" | "under-contract" | "sold" | "off-market";

export interface PropertyImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface Property {
  id: string;
  slug: string;
  listingType: ListingType;
  propertyType: PropertyType;
  status: PropertyStatus;
  title: string;
  address: {
    street: string;
    suburb: string;
    state: string;
    postcode: string;
    full: string;
  };
  price: {
    display: string;
    value: number | null;
    isRange: boolean;
    min?: number;
    max?: number;
    rentPerWeek?: number;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    carSpaces: number;
    landSize?: number;
    buildingSize?: number;
  };
  description: string;
  images: PropertyImage[];
  agentId: string;
  coAgentId?: string;
  agencyId: string;
  suburbSlug: string;
  inspectionTimes?: string[];
  auctionDate?: string;
  dateAdded: string;
  dateSold?: string;
  soldPrice?: number;
  isOffMarket?: boolean;
  isFeatured?: boolean;
}

export interface PropertySearchParams {
  listingType?: ListingType;
  suburb?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  maxBeds?: number;
  minBaths?: number;
  sort?: string;
  page?: number;
}
