// The homepage's photographs (15 Oct 2026).
//
// TODO(andy): these are interim picks from the documentary library in
// public/images/photos. Swap in the mock's images (docs/design/ypg-homepage/
// assets) once they're in the repo: a prestige home for the hero and the
// $18.5M card, a suburban house for the $640K card and a styled living room
// for the five steps. Each is a one-line change here.

export const CAMPAIGN_PHOTOS = {
  hero: { src: "/images/photos/home-street.jpg", position: "object-[50%_60%]" },
  topEnd: { src: "/images/photos/brisbane-view.jpg", position: "object-[50%_55%]" },
  suburban: { src: "/images/photos/selling-house.jpg", position: "object-[50%_45%]" },
  styled: { src: "/images/photos/renovation.jpg", position: "object-center" },
} as const;
