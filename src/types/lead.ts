export type LeadType =
  | "property-enquiry"
  | "appraisal-request"
  | "off-market-register"
  | "general-contact"
  | "house-and-land-enquiry";

export interface Lead {
  id?: string;
  type: LeadType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
  propertyId?: string;
  agentId?: string;
  agencyId?: string;
  suburb?: string;
  source?: string;
  buyingCriteria?: {
    suburbs?: string[];
    propertyTypes?: string[];
    minPrice?: number;
    maxPrice?: number;
    minBeds?: number;
  };
  appraisalAddress?: string;
  createdAt?: string;
}
