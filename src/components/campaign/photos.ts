// The homepage's photographs (15 Oct 2026), generated with ImagineArt
// (Nano Banana Pro, 2K) to match what each band says, with Australian
// vernacular anchored in every prompt (sandstone, angophora and banksia on
// Sydney Harbour; brick veneer, Colorbond and a gum on the nature strip in
// Brisbane). They are illustrations: the two homes are labelled "Example"
// on the page, and none is ever captioned as a real property or sale.
// Files: public/images/campaign/, JPEG, 2400px wide for the hero and 1800px
// for the rest.

export const CAMPAIGN_PHOTOS = {
  /** A prestige sandstone home on Sydney Harbour, house on the right so the text sits on the sky. */
  hero: { src: "/images/campaign/hero-harbour-home.jpg", position: "object-[72%_50%] lg:object-center" },
  /** The $18.5M example: a harbourfront 5-bed with a pool, lawn and jetty. */
  topEnd: { src: "/images/campaign/example-harbourfront.jpg", position: "object-center" },
  /** The $640K example: a Brisbane brick-veneer 3-bed. */
  suburban: { src: "/images/campaign/example-suburban.jpg", position: "object-[40%_55%]" },
  /** "Present for the top buyer": a living room styled for sale. */
  styled: { src: "/images/campaign/styled-living-room.jpg", position: "object-center" },
} as const;
