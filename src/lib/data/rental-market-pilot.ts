// Fix item 13 pilot: the rebuilt rental-market sub-page renders for these
// 50 Victorian suburbs only (the state with full rental data: house, unit
// and 1/2/3-bedroom medians), chosen by population on 8 Sep 2026. Every
// other suburb keeps the previous page until the pilot is checked by eye
// on mobile and Bing's 5xx count has not moved; the rollout then removes
// this list in one commit.
export const RENTAL_MARKET_PILOT_SLUGS: readonly string[] = [
  "werribee-vic-3030", "glen-waverley-vic-3150", "frankston-vic-3199", "hoppers-crossing-vic-3029", "mount-waverley-vic-3149",
  "mildura-vic-3500", "noble-park-vic-3174", "shepparton-vic-3630", "warrnambool-vic-3280", "doncaster-east-vic-3109",
  "dandenong-vic-3175", "mill-park-vic-3082", "narre-warren-vic-3805", "traralgon-vic-3844", "coburg-vic-3058",
  "hampton-park-vic-3976", "northcote-vic-3070", "south-yarra-vic-3141", "doncaster-vic-3108", "endeavour-hills-vic-3802",
  "roxburgh-park-vic-3064", "boronia-vic-3155", "lalor-vic-3075", "dandenong-north-vic-3175", "malvern-east-vic-3145",
  "carrum-downs-vic-3201", "cranbourne-vic-3977", "essendon-vic-3040", "greensborough-vic-3088", "wodonga-vic-3690",
  "thomastown-vic-3074", "warragul-vic-3820", "thornbury-vic-3071", "clayton-vic-3168", "pascoe-vale-vic-3044",
  "deer-park-vic-3023", "bentleigh-vic-3204", "carnegie-vic-3163", "port-melbourne-vic-3207", "footscray-vic-3011",
  "templestowe-vic-3106", "brighton-east-vic-3187", "moonee-ponds-vic-3039", "yarraville-vic-3013", "corio-vic-3214",
  "ascot-vale-vic-3032", "elwood-vic-3184", "horsham-vic-3400", "keilor-east-vic-3033", "brighton-vic-3186",
];

const PILOT = new Set(RENTAL_MARKET_PILOT_SLUGS);

export function isRentalMarketPilot(slug: string): boolean {
  return PILOT.has(slug);
}
