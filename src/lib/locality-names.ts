// Names in the Suburb table that are not places people live. Pure; tested in
// tests/seo/non-localities.test.ts.
//
// The table was seeded from Australia Post's postcode list, which carries
// its own delivery names next to the real localities: delivery centres
// ("South Melbourne DC"), business and mail centres ("Nerang BC", "Cairns
// MC"), post offices in shopping centres ("Penrith Plaza", "Chadstone
// Centre") and large institutions with their own mail ("Parliament House",
// "HMAS Kuttabul", "Monash University"). Each got a suburb profile ("What
// it's like to live in Hervey Bay Dc"), a place in every suburb list and in
// the suburb picker on the lead forms. 290 rows on 29 Sep 2026.
//
// A postal suffix is never a locality. Institution and shopping-centre names
// are only treated as non-localities when the row has no census population:
// Brisbane Airport, Melbourne Airport, Noarlunga Centre and Airport West are
// gazetted suburbs with residents.

export type NonLocalityKind = "postal" | "institution" | "shopping-centre";

const POSTAL_SUFFIX = /\b(dc|bc|mc|po|gpo|lpo|cpo|mdc|ldc)$/i;
const POSTAL_WORDS = /\b(private boxes|private bag|locked bag|delivery centre|mail centre|business centre|post office|po box(?:es)?)\b/i;
const INSTITUTION = /\b(university|tafe|airport|aerodrome|hospital|barracks|raaf|hmas|parliament house|immigration centre|naval base|air force base|army base)\b/i;
const SHOPPING_SUFFIX = /\b(shopping centre|shoppingtown|town centre|city centre|plaza|westfield|arcade|centre)$/i;

export function nonLocalityKind(name: string, population: number): NonLocalityKind | null {
  const n = name.trim();
  if (POSTAL_SUFFIX.test(n) || POSTAL_WORDS.test(n)) return "postal";
  if (population > 0) return null;
  if (INSTITUTION.test(n)) return "institution";
  if (SHOPPING_SUFFIX.test(n)) return "shopping-centre";
  return null;
}

/**
 * The suburb a postal or shopping-centre name is built on: "South Melbourne
 * Dc" → "South Melbourne", "Penrith Plaza" → "Penrith", "Parramatta
 * Westfield" → "Parramatta". Null when nothing is left or nothing was
 * stripped (institutions have no base).
 */
export function baseLocalityName(name: string): string | null {
  const original = name.trim().replace(/\s+/g, " ");
  let n = original;
  for (let pass = 0; pass < 2; pass++) {
    n = n
      .replace(new RegExp(POSTAL_WORDS.source, "gi"), " ")
      .replace(POSTAL_SUFFIX, " ")
      .replace(SHOPPING_SUFFIX, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  if (!n || n.toLowerCase() === original.toLowerCase()) return null;
  return n;
}

const UPPER = new Set(["dc", "bc", "mc", "po", "gpo", "lpo", "cpo", "mdc", "ldc", "hmas", "raaf", "tafe"]);

/** The name as it should be printed: "Cairns Mc" → "Cairns MC", "The University Of Sydney" → "The University of Sydney". */
export function displayLocalityName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w, i) => {
      const lower = w.toLowerCase();
      if (UPPER.has(lower)) return w.toUpperCase();
      if (i > 0 && lower === "of") return "of";
      return w;
    })
    .join(" ");
}

const KIND_LABEL: Record<NonLocalityKind, string> = {
  postal: "Australia Post delivery name",
  institution: "institution with its own mail address",
  "shopping-centre": "post office in a shopping centre",
};

export function nonLocalityLabel(kind: NonLocalityKind): string {
  return KIND_LABEL[kind];
}
