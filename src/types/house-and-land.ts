export interface HouseAndLandPackage {
  id: string;
  slug: string;
  title: string;
  builder: string;
  estate: string;
  suburb: string;
  suburbSlug: string;
  price: {
    display: string;
    value: number;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    carSpaces: number;
    landSize: number;
    buildingSize: number;
  };
  description: string;
  images: { url: string; alt: string }[];
  floorPlanImage?: string;
  agentId: string;
  agencyId: string;
  inclusions: string[];
  isNew?: boolean;
  dateAdded: string;
}
