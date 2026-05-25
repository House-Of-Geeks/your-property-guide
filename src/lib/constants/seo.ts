export const SITE_NAME = "Your Property Guide";
export const SITE_URL = "https://www.yourpropertyguide.com.au";

// Short meta description used as the default across the site and OG
// card subtitle. Repositioned 2026-05 from data-led ("Australia's
// plain-English property reference") to education-led: the site
// teaches the Australian property machinery in plain English. Once
// readers know what's really happening they can make better choices.
// Stays under 160 chars so Google doesn't truncate.
export const SITE_DESCRIPTION =
  "Plain-English Australian property: 60+ guides, every property calculator, suburb profiles. We explain what's happening so you can make better choices. Free, no sign-up.";

// Long-form description used inside JSON-LD Organization schema and any
// AI-citation surface (llms.txt, etc.) where richer context helps.
// Education-led: positions YPG as the place that explains the rules,
// not the place that reports the prices.
export const SITE_DESCRIPTION_LONG =
  "Your Property Guide is Australia's plain-English property education site. We publish 60+ guides on buying, selling, renovating, investing and renting; we run every property calculator that matters; we hold suburb-by-suburb profiles for every Australian suburb. The site exists because property is the biggest financial decision most Australians make, and most of the people explaining it have something to sell. Once readers understand what's actually happening, they can make better choices. When they want to talk to a person, we introduce them to one vetted specialist for their situation, free for buyers and sellers, fully disclosed.";

export const SITE_TAGLINE = "Plain-English Australian property.";
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

// Topics we claim authority on — used in OrganizationJsonLd `knowsAbout`
// for AI search engines (Claude, ChatGPT, Perplexity, Gemini, Bing Copilot)
// to recognise the site's domain expertise during retrieval.
export const SITE_KNOWS_ABOUT = [
  "Australian residential property",
  "First home buyer schemes Australia",
  "Property investment Australia",
  "Negative gearing and property tax",
  "Capital gains tax on property",
  "Stamp duty by Australian state",
  "Lenders mortgage insurance",
  "Home loan pre-approval",
  "Mortgage brokers in Australia",
  "Conveyancing in Australia",
  "Section 32 vendor statements Victoria",
  "Cooling-off periods by state",
  "Property auctions in Australia",
  "Selling a house in Australia",
  "Renovation costs in Australia",
  "Granny flats and secondary dwellings",
  "Rentvesting strategy",
  "Buyer's agents",
  "Australian suburb research",
  "Australian school catchments",
];

/** Site contact phone, used in tel: links + display formatting. */
export const CONTACT_PHONE_E164    = "+61455221921";       // for tel: hrefs
export const CONTACT_PHONE_DISPLAY = "0455 221 921";       // human-readable
