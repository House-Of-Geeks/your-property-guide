export interface SuggestLocation {
  slug: string;
  name: string;
  state: string;
  postcode: string;
}

export interface SuggestSchool {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  suburbName: string;
  suburbSlug: string;
}

export interface SuggestAgency {
  slug: string;
  name: string;
  suburb: string;
  state: string;
}

export interface SuggestResponse {
  locations: SuggestLocation[];
  schools: SuggestSchool[];
  agencies: SuggestAgency[];
}
