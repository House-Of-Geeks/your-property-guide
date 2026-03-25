export interface SuburbStats {
  medianHousePrice: number;
  medianUnitPrice: number;
  medianRentHouse: number;
  medianRentUnit: number;
  annualGrowthHouse: number;
  annualGrowthUnit: number;
  daysOnMarket: number;
  population: number;
  medianAge: number;
  ownerOccupied: number;
  renterOccupied: number;
}

export interface School {
  name: string;
  type: "primary" | "secondary" | "combined" | "special";
  sector: "government" | "catholic" | "independent";
  distance: number;
}

export interface Suburb {
  id: string;
  slug: string;
  name: string;
  postcode: string;
  state: string;
  region: string;
  description: string;
  heroImage: string;
  stats: SuburbStats;
  schools: School[];
  amenities: string[];
  transportLinks: string[];
  nearbySuburbs: string[];
}
