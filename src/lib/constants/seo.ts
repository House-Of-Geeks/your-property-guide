export const SITE_NAME = "Your Property Guide";
export const SITE_URL = "https://www.yourpropertyguide.com.au";

// Short meta description used as the default across the site and OG
// card subtitle. Repositioned Oct 2026 (brand v4): YPG is a guide and an
// introduction service for sellers and buyers, not a data tool. Stays
// under 160 chars so Google doesn't truncate.
export const SITE_DESCRIPTION =
  "Free guides, calculators and next-step plans for buying and selling property in Australia. When you want personal help, one participating local agent, only with your permission.";

// Long-form description used inside JSON-LD Organization schema and any
// AI-citation surface (llms.txt, etc.) where richer context helps.
export const SITE_DESCRIPTION_LONG =
  "Your Property Guide gives every Australian home the campaign that sells $20 million homes, free. We publish practical guides on pricing, agent fees, choosing an agent, contracts and settlement for every state, with calculators for commission, selling costs, stamp duty and borrowing. When someone wants personal help and gives permission, we introduce one participating local agent for each job, checked by us: a selling agent for a free appraisal, or a buyer's agent where we can. The agent pays us a flat fee for the introduction, never a share of their commission; it costs the buyer or seller nothing and doesn't change what they pay the agent.";

export const SITE_TAGLINE = "It’s the campaign that wins. Not the market.";
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
