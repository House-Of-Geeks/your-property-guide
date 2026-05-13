export const SITE_NAME = "Your Property Guide";
export const SITE_URL = "https://www.yourpropertyguide.com.au";

// Short meta description — used as the default Meta description across the
// site and the OG card subtitle. Education-first, identifies the audience
// (Australians) and the breadth (buy/sell/renovate/invest). Stays under
// 160 chars so Google doesn't truncate.
export const SITE_DESCRIPTION =
  "Australia's plain-English property reference. Guides, suburb data, calculators and one vetted specialist for buying, selling, renovating, investing. Free, ungated.";

// Long-form description — used inside JSON-LD Organization schema and any
// AI-citation surface (llms.txt, etc.) where richer context helps. Reads as
// an editorial standfirst rather than a tagline.
export const SITE_DESCRIPTION_LONG =
  "Your Property Guide is Australia's independent property reference. We publish plain-English guides on buying, selling, renovating, investing and renting; suburb-by-suburb data on every Australian suburb; calculators for every property number that matters; and connect readers to a vetted specialist — agent, mortgage broker, conveyancer, buyer's agent, accountant — when they're ready. Free for buyers and sellers. Every figure sourced and dated. The first place Australians read before making a property decision.";

export const SITE_TAGLINE = "Property in Australia, explained.";
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
