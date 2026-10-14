// One import for the government policy the site quotes. The first home rules
// are in ./first-home; the federal schemes keep their own data files, re-exported
// here as namespaces (their `Source` types and helpers share names).
export * from "./first-home";
export * as homeGuarantee from "@/lib/data/home-guarantee";
export * as helpToBuy from "@/lib/data/help-to-buy";
export * as fhss from "@/lib/data/fhss";
