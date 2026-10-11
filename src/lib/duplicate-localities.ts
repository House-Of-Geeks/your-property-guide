// Suburb rows that repeat another row of the same name and state under a
// second postcode, and the row each one repeats. Prahran VIC exists as
// prahran-vic-3181 and prahran-vic-3143 (3143 is Armadale's postcode):
// both pages printed the same $1,667,500 median and the same 2021 Census
// figures, both were self-canonical and both were in the sitemaps, and
// Google split "real estate agents prahran" between them, the wrong
// postcode ranking higher (agents-appraisal F6 and item 14 of 0.2 in the
// commercial intent review of 10 Oct 2026). Malvern 3143 and 3144 and
// Bandiana 3691 and 3694 were the other pairs it named.
//
// What the site does with a secondary row: its profile's canonical points
// to the primary, and it leaves the profiles sitemap. Its URL still answers
// 200: no redirects until the owner decides (10 Oct 2026, "no URL changes;
// canonicals are fine"). The agents, rental-market and sub-page templates
// and the sub-page sitemap read the same lookup (canonicalSuburbSlug,
// isSecondaryLocality).
//
// How the list was built (11 Oct 2026), without the database:
//   1. Every profile slug in the live profiles sitemap and the Search
//      Console page exports of the review, grouped by name and state: 467
//      names carry more than one postcode.
//   2. Australia Post's postcode search (auspost.com.au/postcode/{name},
//      read 11 Oct 2026): kept where exactly one of the postcodes is a
//      "Delivery Area" for that name and state. That one is the primary.
//      Names Australia Post lists under both postcodes (Melbourne 3000 and
//      3004, Canberra 2600 and 2601, Mount Gambier 5290 and 5291) are real
//      localities either way and are left out for the owner.
//   3. Postcodes at most 20 apart (one district; a pair further apart is
//      usually two places with one name), plus Prahran, Windsor and
//      Carlton, checked by hand.
//   4. The two live profiles print the same 2021 Census figures and the
//      same median house price (or both print none). Pairs whose pages
//      differ (the census rows sit on one postcode only, as on North Sydney
//      2055 and 2060) are left out: they need a database check first.
// Pure; tested in tests/lib/duplicate-localities.test.ts.

/** When the list was built. */
export const DUPLICATE_LOCALITIES_AS_AT = "2026-10-11";

/** [secondary, primary]: the secondary row repeats the primary under a postcode Australia Post does not give that locality. */
export const DUPLICATE_LOCALITY_PAIRS: ReadonlyArray<readonly [secondary: string, primary: string]> = [
  ["amoonguna-nt-0872", "amoonguna-nt-0873"],
  ["anakie-vic-3221", "anakie-vic-3213"],
  ["angledool-nsw-2832", "angledool-nsw-2834"],
  ["armatree-nsw-2831", "armatree-nsw-2828"],
  ["avoca-vale-qld-4306", "avoca-vale-qld-4314"],
  ["avon-plains-vic-3478", "avon-plains-vic-3477"],
  ["bamawm-extension-vic-3561", "bamawm-extension-vic-3564"],
  ["bandiana-vic-3694", "bandiana-vic-3691"],
  ["barkly-vic-3381", "barkly-vic-3384"],
  ["barkstead-vic-3352", "barkstead-vic-3364"],
  ["barnawartha-north-vic-3688", "barnawartha-north-vic-3691"],
  ["barragup-wa-6210", "barragup-wa-6209"],
  ["batesford-vic-3221", "batesford-vic-3213"],
  ["beauchamp-vic-3581", "beauchamp-vic-3579"],
  ["beaumaris-vic-3192", "beaumaris-vic-3193"],
  ["beazleys-bridge-vic-3478", "beazleys-bridge-vic-3477"],
  ["bellarine-vic-3221", "bellarine-vic-3223"],
  ["bellellen-vic-3380", "bellellen-vic-3381"],
  ["benalla-vic-3673", "benalla-vic-3672"],
  ["benarkin-north-qld-4306", "benarkin-north-qld-4314"],
  ["benarkin-qld-4306", "benarkin-qld-4314"],
  ["blackbutt-north-qld-4306", "blackbutt-north-qld-4314"],
  ["blackbutt-qld-4306", "blackbutt-qld-4314"],
  ["blackbutt-south-qld-4306", "blackbutt-south-qld-4314"],
  ["bolangum-vic-3381", "bolangum-vic-3387"],
  ["bonshaw-vic-3356", "bonshaw-vic-3352"],
  ["bonville-nsw-2441", "bonville-nsw-2450"],
  ["borambil-nsw-2329", "borambil-nsw-2343"],
  ["bournda-nsw-2550", "bournda-nsw-2548"],
  ["bouvard-wa-6210", "bouvard-wa-6211"],
  ["branditt-vic-3630", "branditt-vic-3631"],
  ["brimpaen-vic-3400", "brimpaen-vic-3401"],
  ["brinerville-nsw-2441", "brinerville-nsw-2454"],
  ["brisbane-airport-qld-4007", "brisbane-airport-qld-4008"],
  ["brunswick-east-vic-3056", "brunswick-east-vic-3057"],
  ["bunjil-wa-6623", "bunjil-wa-6620"],
  ["callawadda-vic-3381", "callawadda-vic-3387"],
  ["campbells-bridge-vic-3381", "campbells-bridge-vic-3387"],
  ["canunda-sa-5291", "canunda-sa-5280"],
  ["carani-wa-6566", "carani-wa-6569"],
  ["carapooee-vic-3478", "carapooee-vic-3477"],
  ["carapooee-west-vic-3478", "carapooee-west-vic-3477"],
  ["carlton-vic-3000", "carlton-vic-3053"],
  ["carlyle-vic-3687", "carlyle-vic-3685"],
  ["cherry-creek-qld-4306", "cherry-creek-qld-4314"],
  ["clear-lake-vic-3401", "clear-lake-vic-3409"],
  ["clifton-hill-vic-3066", "clifton-hill-vic-3068"],
  ["clifton-wa-6210", "clifton-wa-6211"],
  ["colinton-qld-4306", "colinton-qld-4314"],
  ["concongella-vic-3381", "concongella-vic-3384"],
  ["coomrith-qld-4423", "coomrith-qld-4422"],
  ["coonooer-bridge-vic-3478", "coonooer-bridge-vic-3477"],
  ["coonooer-west-vic-3478", "coonooer-west-vic-3477"],
  ["cowabbie-nsw-2663", "cowabbie-nsw-2652"],
  ["creek-view-vic-3558", "creek-view-vic-3551"],
  ["crowea-wa-6258", "crowea-wa-6262"],
  ["dean-vic-3352", "dean-vic-3363"],
  ["deep-lead-vic-3381", "deep-lead-vic-3385"],
  ["dirty-creek-nsw-2460", "dirty-creek-nsw-2456"],
  ["doncaster-vic-3107", "doncaster-vic-3108"],
  ["dowlingville-sa-5555", "dowlingville-sa-5571"],
  ["east-damboring-wa-6608", "east-damboring-wa-6606"],
  ["farina-sa-5733", "farina-sa-5731"],
  ["freshwater-creek-vic-3216", "freshwater-creek-vic-3217"],
  ["furnissdale-wa-6210", "furnissdale-wa-6209"],
  ["fyansford-vic-3221", "fyansford-vic-3218"],
  ["galore-nsw-2652", "galore-nsw-2650"],
  ["gearys-flat-nsw-2446", "gearys-flat-nsw-2441"],
  ["gerangamete-vic-3243", "gerangamete-vic-3249"],
  ["german-creek-sa-5280", "german-creek-sa-5291"],
  ["germania-vic-3381", "germania-vic-3387"],
  ["giffard-vic-3850", "giffard-vic-3851"],
  ["googa-creek-qld-4306", "googa-creek-qld-4314"],
  ["gooroc-vic-3478", "gooroc-vic-3477"],
  ["gowar-east-vic-3478", "gowar-east-vic-3477"],
  ["gower-vic-3451", "gower-vic-3463"],
  ["gre-gre-north-vic-3478", "gre-gre-north-vic-3477"],
  ["gre-gre-south-vic-3478", "gre-gre-south-vic-3477"],
  ["gre-gre-vic-3478", "gre-gre-vic-3477"],
  ["great-western-vic-3377", "great-western-vic-3374"],
  ["greens-creek-vic-3381", "greens-creek-vic-3387"],
  ["grey-river-vic-3221", "grey-river-vic-3234"],
  ["harlin-qld-4306", "harlin-qld-4314"],
  ["herron-wa-6210", "herron-wa-6211"],
  ["hobart-tas-7001", "hobart-tas-7000"],
  ["hollands-landing-vic-3875", "hollands-landing-vic-3862"],
  ["horsham-vic-3401", "horsham-vic-3400"],
  ["iredale-qld-4352", "iredale-qld-4344"],
  ["iron-knob-sa-5601", "iron-knob-sa-5611"],
  ["jews-lagoon-nsw-2388", "jews-lagoon-nsw-2397"],
  ["jimenbuen-nsw-2630", "jimenbuen-nsw-2628"],
  ["joel-joel-vic-3381", "joel-joel-vic-3384"],
  ["joel-south-vic-3381", "joel-south-vic-3384"],
  ["kanya-vic-3381", "kanya-vic-3387"],
  ["karte-sa-5307", "karte-sa-5304"],
  ["kedumba-nsw-2787", "kedumba-nsw-2782"],
  ["kennett-river-vic-3221", "kennett-river-vic-3234"],
  ["keybarbin-nsw-2460", "keybarbin-nsw-2469"],
  ["kingoonya-sa-5710", "kingoonya-sa-5719"],
  ["kirk-rock-wa-6370", "kirk-rock-wa-6372"],
  ["koah-qld-4871", "koah-qld-4881"],
  ["kooreh-vic-3478", "kooreh-vic-3477"],
  ["kulpara-sa-5555", "kulpara-sa-5552"],
  ["kuranda-qld-4872", "kuranda-qld-4881"],
  ["kyalite-nsw-2734", "kyalite-nsw-2715"],
  ["landervale-nsw-2663", "landervale-nsw-2652"],
  ["leets-vale-nsw-2756", "leets-vale-nsw-2775"],
  ["linville-qld-4306", "linville-qld-4314"],
  ["little-italy-wa-6355", "little-italy-wa-6359"],
  ["longerenong-vic-3399", "longerenong-vic-3401"],
  ["lovely-banks-vic-3221", "lovely-banks-vic-3213"],
  ["low-isles-qld-4877", "low-isles-qld-4873"],
  ["lower-broughton-sa-5522", "lower-broughton-sa-5540"],
  ["lubeck-vic-3381", "lubeck-vic-3385"],
  ["maggea-sa-5308", "maggea-sa-5311"],
  ["malvern-vic-3143", "malvern-vic-3144"],
  ["manyung-qld-4601", "manyung-qld-4605"],
  ["marlo-merrican-nsw-2446", "marlo-merrican-nsw-2441"],
  ["maxwelton-qld-4816", "maxwelton-qld-4822"],
  ["melton-sa-5555", "melton-sa-5552"],
  ["miga-lake-vic-3401", "miga-lake-vic-3409"],
  ["minjah-vic-3280", "minjah-vic-3276"],
  ["mitchell-park-vic-3352", "mitchell-park-vic-3355"],
  ["mitre-vic-3401", "mitre-vic-3409"],
  ["mokepilly-vic-3380", "mokepilly-vic-3381"],
  ["monteith-sa-5254", "monteith-sa-5253"],
  ["moolap-vic-3221", "moolap-vic-3224"],
  ["moolerr-vic-3478", "moolerr-vic-3477"],
  ["moorabool-vic-3221", "moorabool-vic-3213"],
  ["moore-qld-4306", "moore-qld-4314"],
  ["morrl-morrl-vic-3381", "morrl-morrl-vic-3387"],
  ["mount-alfred-vic-3691", "mount-alfred-vic-3709"],
  ["mount-binga-qld-4306", "mount-binga-qld-4314"],
  ["mount-duneed-vic-3216", "mount-duneed-vic-3217"],
  ["mount-stanley-qld-4306", "mount-stanley-qld-4314"],
  ["moyreisk-vic-3467", "moyreisk-vic-3477"],
  ["muntham-vic-3312", "muntham-vic-3315"],
  ["murgheboluc-vic-3221", "murgheboluc-vic-3218"],
  ["murrah-nsw-2550", "murrah-nsw-2546"],
  ["nariel-valley-vic-3705", "nariel-valley-vic-3707"],
  ["nayook-vic-3821", "nayook-vic-3832"],
  ["neerim-junction-vic-3821", "neerim-junction-vic-3832"],
  ["neerim-north-vic-3821", "neerim-north-vic-3832"],
  ["nimmo-nsw-2630", "nimmo-nsw-2628"],
  ["ninyeunook-vic-3540", "ninyeunook-vic-3527"],
  ["noradjuha-vic-3401", "noradjuha-vic-3409"],
  ["nukku-qld-4306", "nukku-qld-4314"],
  ["omeo-valley-vic-3888", "omeo-valley-vic-3898"],
  ["parkside-qld-4807", "parkside-qld-4825"],
  ["petwood-sa-5254", "petwood-sa-5252"],
  ["point-souttar-sa-5575", "point-souttar-sa-5577"],
  ["port-julia-sa-5575", "port-julia-sa-5580"],
  ["prahran-vic-3143", "prahran-vic-3181"],
  ["prairie-qld-4816", "prairie-qld-4821"],
  ["pranjip-vic-3665", "pranjip-vic-3666"],
  ["punyelroo-sa-5354", "punyelroo-sa-5353"],
  ["pygery-sa-5655", "pygery-sa-5652"],
  ["ramsay-qld-4352", "ramsay-qld-4358"],
  ["rocky-gully-sa-5253", "rocky-gully-sa-5254"],
  ["runnymede-vic-3559", "runnymede-vic-3558"],
  ["separation-creek-vic-3221", "separation-creek-vic-3234"],
  ["shays-flat-vic-3384", "shays-flat-vic-3377"],
  ["silver-ridge-qld-4344", "silver-ridge-qld-4352"],
  ["slaty-creek-vic-3478", "slaty-creek-vic-3477"],
  ["spring-mountain-nsw-2360", "spring-mountain-nsw-2370"],
  ["st-albans-vic-3020", "st-albans-vic-3021"],
  ["st-arnaud-east-vic-3478", "st-arnaud-east-vic-3477"],
  ["st-arnaud-north-vic-3478", "st-arnaud-north-vic-3477"],
  ["st-helens-plains-vic-3400", "st-helens-plains-vic-3401"],
  ["stonehaven-vic-3221", "stonehaven-vic-3218"],
  ["stuart-mill-vic-3478", "stuart-mill-vic-3477"],
  ["sugarloaf-creek-vic-3659", "sugarloaf-creek-vic-3658"],
  ["swanwater-vic-3478", "swanwater-vic-3477"],
  ["taromeo-qld-4306", "taromeo-qld-4314"],
  ["tarramba-qld-4715", "tarramba-qld-4702"],
  ["teddywaddy-vic-3525", "teddywaddy-vic-3527"],
  ["teddywaddy-west-vic-3525", "teddywaddy-west-vic-3527"],
  ["teelah-qld-4306", "teelah-qld-4314"],
  ["the-pines-sa-5575", "the-pines-sa-5577"],
  ["tooan-vic-3401", "tooan-vic-3409"],
  ["toolamba-west-vic-3616", "toolamba-west-vic-3614"],
  ["tottington-vic-3478", "tottington-vic-3477"],
  ["traynors-lagoon-vic-3478", "traynors-lagoon-vic-3477"],
  ["ullina-vic-3364", "ullina-vic-3370"],
  ["upotipotpon-vic-3673", "upotipotpon-vic-3669"],
  ["upper-coopers-creek-nsw-2480", "upper-coopers-creek-nsw-2482"],
  ["vale-view-qld-4358", "vale-view-qld-4352"],
  ["virginia-nt-0822", "virginia-nt-0834"],
  ["wal-wal-vic-3381", "wal-wal-vic-3385"],
  ["wallaloo-east-vic-3381", "wallaloo-east-vic-3387"],
  ["wallaloo-vic-3381", "wallaloo-vic-3387"],
  ["wallingat-nsw-2423", "wallingat-nsw-2428"],
  ["wallington-vic-3221", "wallington-vic-3222"],
  ["waranga-vic-3612", "waranga-vic-3616"],
  ["wartook-vic-3400", "wartook-vic-3401"],
  ["warumbul-nsw-2229", "warumbul-nsw-2232"],
  ["washpool-qld-4309", "washpool-qld-4306"],
  ["white-hill-sa-5253", "white-hill-sa-5254"],
  ["willung-south-vic-3844", "willung-south-vic-3847"],
  ["windsor-vic-3004", "windsor-vic-3181"],
  ["winulta-sa-5555", "winulta-sa-5570"],
  ["wombelano-vic-3401", "wombelano-vic-3409"],
  ["wongarra-vic-3221", "wongarra-vic-3234"],
  ["woodlane-sa-5238", "woodlane-sa-5254"],
  ["wye-river-vic-3221", "wye-river-vic-3234"],
  ["yamba-sa-5341", "yamba-sa-5340"],
];

const PRIMARY_BY_SECONDARY = new Map<string, string>(DUPLICATE_LOCALITY_PAIRS.map(([s, p]) => [s, p]));

/** Every secondary slug, for filters (sitemaps, suburb lists). */
export const SECONDARY_LOCALITY_SLUGS: readonly string[] = DUPLICATE_LOCALITY_PAIRS.map(([s]) => s);

/** The slug is a secondary row: its pages canonicalise to the primary and stay out of the sitemaps. */
export function isSecondaryLocality(slug: string): boolean {
  return PRIMARY_BY_SECONDARY.has(slug);
}

/** The primary row a secondary repeats, or null for any other slug. */
export function primaryLocalitySlug(slug: string): string | null {
  return PRIMARY_BY_SECONDARY.get(slug) ?? null;
}

/** The slug a suburb page (profile or sub-page) names as canonical: the primary for a secondary row, the slug itself otherwise. */
export function canonicalSuburbSlug(slug: string): string {
  return PRIMARY_BY_SECONDARY.get(slug) ?? slug;
}
