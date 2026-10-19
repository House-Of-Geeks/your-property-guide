import { SITE_NAME } from "@/lib/constants";

// Next.js replaces the layout's openGraph object wholesale when a page sets
// its own, so any page that sets openGraph without images would lose the
// default social card. Spread DEFAULT_OG first in a page's openGraph; keys
// the page sets afterwards (including images) win.
// /og-image.jpg is exactly 1200x630.
export const DEFAULT_OG_IMAGES = [
  {
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
    alt: `${SITE_NAME}: it’s the campaign that wins. Not the market.`,
  },
];

export const DEFAULT_OG = { images: DEFAULT_OG_IMAGES };
