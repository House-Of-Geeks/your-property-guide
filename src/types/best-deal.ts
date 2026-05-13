// BestDeal — partner-submitted, staff-moderated featured property.
//
// See prisma/schema.prisma `BestDeal` for the canonical model. This file
// exposes the shape consumed by UI code and provides the discriminated
// unions for status/property-type/deal-type that the schema stores as
// plain strings (Postgres-friendly, but the union is safer in TS).

export type DealStatus =
  | "draft"
  | "pending_review"
  | "live"
  | "expired"
  | "rejected";

export type DealPropertyType =
  | "house"
  | "apartment"
  | "townhouse"
  | "land"
  | "commercial";

export type DealAudience =
  | "first-home"
  | "investor"
  | "downsizer"
  | "upgrader"
  | "renovator";

export interface BestDealAgentSummary {
  id: string;
  slug: string;
  fullName: string;
  phone: string;
  email: string;
  image: string;
  agencyId: string;
  agencyName?: string;
}

export interface BestDeal {
  id: string;
  partnerAgentId: string;
  status: DealStatus;

  title: string;
  headline: string;
  pitch: string;

  propertyType: DealPropertyType;
  suburbSlug: string;
  suburbName: string;
  state: string;
  postcode: string;
  bedrooms: number | null;
  bathrooms: number | null;
  carSpaces: number | null;
  landArea: number | null;
  buildArea: number | null;

  priceMin: number | null;
  priceMax: number | null;
  priceText: string | null;

  heroImage: string;
  gallery: string[];
  floorplanUrl: string | null;
  externalListingUrl: string | null;

  dealTypes: DealAudience[];
  tags: string[];

  publishAt: string | null; // ISO
  expiresAt: string;        // ISO
  lastReviewedBy: string | null;
  lastReviewedAt: string | null;
  rejectionReason: string | null;

  disclosureText: string;
  agentCommissionDisclosed: boolean;

  viewCount: number;
  clickCount: number;

  // Joined relations, populated by the service layer
  agent?: BestDealAgentSummary;

  createdAt: string;
  updatedAt: string;
}

export interface BestDealFilters {
  state?: string;
  suburbSlug?: string;
  propertyType?: DealPropertyType;
  dealType?: DealAudience;
  limit?: number;
}
