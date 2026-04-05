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
  householdsFamily: number;
  householdsLonePerson: number;
}

export interface School {
  name: string;
  type: "primary" | "secondary" | "combined" | "special";
  sector: "government" | "catholic" | "independent";
  distance: number;
  yearRange: string | null;
  gender: "coed" | "girls" | "boys" | null;
  website: string | null;
  icsea: number | null;
  enrolment: number | null;
  acaraId: string | null;
}

export interface SuburbDataFreshness {
  rentalAsOf:    Date | null;
  rentalSource:  string | null;
  crimeAsOf:     Date | null;
  crimeSource:   string | null;
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
  dataFreshness?: SuburbDataFreshness;
}
