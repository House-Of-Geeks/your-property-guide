export interface Agent {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  fullName: string;
  title: string;
  phone: string;
  email: string;
  bio: string;
  image: string;
  agencyId: string;
  agencyName?: string;
  agencySlug?: string;
  suburbs: string[];
  specialties: string[];
  yearsExperience: number;
  propertiesSold: number;
  reviewCount: number;
  averageRating: number;
  isFeatured?: boolean;
}

export interface Agency {
  id: string;
  slug: string;
  name: string;
  logo: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: {
    street: string;
    suburb: string;
    state: string;
    postcode: string;
    full: string;
  };
  suburbs: string[];
  agentIds: string[];
  primaryColor?: string;
  youtubeVideoId?: string;
}
