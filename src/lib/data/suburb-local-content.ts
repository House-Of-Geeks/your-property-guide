export interface SuburbShopsAndAmenities {
  paragraphs: string[];
  links?: { label: string; href: string }[];
}

export interface SuburbLocalContent {
  shopsAndAmenities?: SuburbShopsAndAmenities;
}

/** Supplied copy for a suburb's "Shops and amenities" section, keyed by suburb slug. */
export const SUBURB_LOCAL_CONTENT: Record<string, SuburbLocalContent> = {};

export function localContentFor(slug: string): SuburbLocalContent | null {
  return Object.prototype.hasOwnProperty.call(SUBURB_LOCAL_CONTENT, slug) ? SUBURB_LOCAL_CONTENT[slug] : null;
}
