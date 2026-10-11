// The eight renters' rights guides (/guides/renters-rights-{state}): the
// link card each guide shows for its siblings, and the dated primary sources
// each guide's rules were checked against. One module so a sibling blurb
// cannot say something about a state that the state's own guide contradicts
// (commercial-intent review, 10 Oct 2026, renting 0.2 to 0.4: six guides
// told readers NSW "still permits no-grounds evictions" 17 months after
// NSW ended them).
//
// Every rule a guide prints comes from the state regulator's own page or the
// legislation site, read on the date in `read`. Where a page shows its own
// "last updated" date, `date` carries it; otherwise it says none is shown.
import type { RelatedGuide, SourceItem } from "@/components/guide";

export type RentersState = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";

export interface RentersSource {
  label: string;
  href: string;
  /** The page's own last-updated date, or "no date shown". */
  date: string;
  /** The day we read it. */
  read: string;
}

export interface RentersGuide {
  state: RentersState;
  slug: string;
  /** Link-card title on the sibling guides. */
  linkTitle: string;
  /**
   * Link-card line on the sibling guides. States a rule only where the
   * state's sources below verify it; otherwise names the regulator and
   * tribunal, which every guide covers.
   */
  blurb: string;
}

export const RENTERS_GUIDES: Record<RentersState, RentersGuide> = {
  NSW: {
    state: "NSW",
    slug: "renters-rights-nsw",
    linkTitle: "Renters' rights in NSW",
    blurb: "Since 19 May 2025 a NSW landlord needs a reason to end a lease.",
  },
  VIC: {
    state: "VIC",
    slug: "renters-rights-vic",
    linkTitle: "Renters' rights in Victoria",
    blurb: "Victorian renting rules, bonds, repairs and VCAT.",
  },
  QLD: {
    state: "QLD",
    slug: "renters-rights-qld",
    linkTitle: "Renters' rights in Queensland",
    blurb: "Queensland tenancy rules and the Residential Tenancies Authority.",
  },
  WA: {
    state: "WA",
    slug: "renters-rights-wa",
    linkTitle: "Renters' rights in WA",
    blurb: "WA's Residential Tenancies Act, bonds and entry rules.",
  },
  SA: {
    state: "SA",
    slug: "renters-rights-sa",
    linkTitle: "Renters' rights in SA",
    blurb: "SA tenancy rules and SACAT dispute resolution.",
  },
  TAS: {
    state: "TAS",
    slug: "renters-rights-tas",
    linkTitle: "Renters' rights in Tasmania",
    blurb: "Tasmanian tenancy rules, bonds and repairs.",
  },
  ACT: {
    state: "ACT",
    slug: "renters-rights-act",
    linkTitle: "Renters' rights in the ACT",
    blurb: "ACT tenancy rules, bonds and ACAT.",
  },
  NT: {
    state: "NT",
    slug: "renters-rights-nt",
    linkTitle: "Renters' rights in the NT",
    blurb: "Northern Territory tenancy rules, bonds and repairs.",
  },
};

/** The sibling link cards, in the order given. */
export function renterGuideLinks(states: readonly RentersState[]): RelatedGuide[] {
  return states.map((s) => {
    const g = RENTERS_GUIDES[s];
    return { title: g.linkTitle, href: `/guides/${g.slug}`, description: g.blurb };
  });
}

const READ = "11 October 2026";
const NSW_GOV = "https://www.nsw.gov.au/housing-and-construction";

/** NSW Government (NSW Fair Trading) pages behind /guides/renters-rights-nsw. */
export const NSW_RENTERS_SOURCES = {
  changes: {
    label: "NSW Fair Trading, Changes to rental laws (timeline of the changes from 31 October 2024)",
    href: "https://www.nsw.gov.au/departments-and-agencies/fair-trading/news/changes-to-rental-laws",
    date: "last updated 8 October 2026",
    read: READ,
  },
  notice: {
    label: "NSW Fair Trading, Minimum notice periods for ending a residential tenancy",
    href: `${NSW_GOV}/rules/minimum-notice-periods-for-ending-a-residential-tenancy`,
    date: "last updated 19 May 2025",
    read: READ,
  },
  landlordEnding: {
    label: "NSW Fair Trading, Landlord ending a tenancy",
    href: `${NSW_GOV}/rules/landlord-ending-a-tenancy`,
    date: "last updated 18 November 2025",
    read: READ,
  },
  rentIncreases: {
    label: "NSW Government, Tenants and rent increases",
    href: `${NSW_GOV}/renting-a-place-to-live/rent-increases`,
    date: "no date shown",
    read: READ,
  },
  bond: {
    label: "NSW Government, Rental Bonds Online for tenants (a bond cannot be more than 4 weeks' rent)",
    href: `${NSW_GOV}/renting-a-place-to-live/residential-rental-bonds/rental-bonds-online-for-tenants`,
    date: "no date shown",
    read: READ,
  },
  bondBack: {
    label: "NSW Government, Getting your bond back at the end of a tenancy",
    href: `${NSW_GOV}/renting-a-place-to-live/getting-your-bond-back`,
    date: "no date shown",
    read: READ,
  },
  repairs: {
    label: "NSW Government, Getting repairs done on a rental property",
    href: `${NSW_GOV}/renting-a-place-to-live/getting-repairs-done`,
    date: "no date shown",
    read: READ,
  },
  access: {
    label: "NSW Fair Trading, Minimum notice periods for access to rental property",
    href: `${NSW_GOV}/rules/minimum-notice-periods-for-access-to-rental-property`,
    date: "no date shown",
    read: READ,
  },
  entry: {
    label: "NSW Fair Trading, Landlord access and entry to a rental property",
    href: `${NSW_GOV}/rules/landlord-access-and-entry-to-a-rental-property`,
    date: "no date shown",
    read: READ,
  },
  pets: {
    label: "NSW Fair Trading, Keeping a pet in a rental property",
    href: `${NSW_GOV}/rules/pets-rentals`,
    date: "last updated 8 October 2026",
    read: READ,
  },
  breakLease: {
    label: "NSW Fair Trading, Breaking a fixed-term residential tenancy early",
    href: `${NSW_GOV}/rules/breaking-a-fixed-term-residential-tenancy-early`,
    date: "last updated 21 September 2026",
    read: READ,
  },
  domesticViolence: {
    label: "NSW Fair Trading, Ending a tenancy because of domestic violence and abuse",
    href: `${NSW_GOV}/rules/ending-a-tenancy-because-of-domestic-violence-and-abuse`,
    date: "no date shown",
    read: READ,
  },
} as const satisfies Record<string, RentersSource>;

/** A source as a line in the page's Sources block. */
export function sourceItem(s: RentersSource): SourceItem {
  return { label: s.label, href: s.href, note: `${s.date}; read ${s.read}` };
}

export function sourceItems(sources: Record<string, RentersSource>): SourceItem[] {
  return Object.values(sources).map(sourceItem);
}
