// Builder licence registers and home warranty insurance by state, for
// /guides/how-to-find-a-builder-australia (commercial-intent review, 10 Oct
// 2026, new homes F6) and the granny flat guides. Every row was read on the
// regulator's or the state government's own page on the date in `readOn`.
// A threshold we could not confirm on a government page is null, and the
// page prints "not confirmed" rather than a guess.
import type { StateCode } from "./commission-rates";

export interface HomeWarrantyRow {
  state: StateCode;
  /** The body that licenses or registers builders. */
  regulator: string;
  /** Where a homeowner checks a licence or registration. */
  register: { label: string; href: string };
  /** The insurance or fund that protects the owner. */
  scheme: string;
  /** Contract value that triggers compulsory cover, in dollars, or null where not confirmed. */
  threshold: number | null;
  /** How the threshold applies, as the source words it. */
  thresholdWording: string;
  /** The law the source names, where it names one. */
  law?: string;
  /** A change the reader needs to know about, dated. */
  change?: string;
  source: { label: string; href: string; dated?: string };
  readOn: string;
}

export const HOME_WARRANTY_AS_AT = "11 October 2026";

export const HOME_WARRANTY: Record<StateCode, HomeWarrantyRow> = {
  NSW: {
    state: "NSW",
    regulator: "Building Commission NSW",
    register: { label: "Verify NSW (Service NSW), check a licence", href: "https://verify.licence.nsw.gov.au/home/Trades" },
    scheme: "Home Building Compensation Fund (HBCF), run by icare",
    threshold: 20_000,
    thresholdWording: "residential building work valued over $20,000, before any work or payment, including the deposit",
    source: {
      label: "NSW Government, Step by step guide to choosing the right tradesperson or builder; icare, Before I build, what do I need to know?",
      href: "https://www.nsw.gov.au/housing-and-construction/building-or-renovating-a-home/preparing/step-by-step-guide-to-choosing-right-tradesperson-or-builder",
      dated: "last updated 22 July 2026",
    },
    readOn: "11 October 2026",
  },
  VIC: {
    state: "VIC",
    regulator: "Building and Plumbing Commission (BPC), the trading name of the Victorian Building Authority",
    register: { label: "BPC, find and check a practitioner", href: "https://www.bpc.vic.gov.au/find-and-check-a-practitioner" },
    scheme: "Home Warranty, provided by the BPC (Domestic Building Insurance for contracts signed before 1 July 2026)",
    threshold: 20_000,
    thresholdWording: "eligible domestic building work valued at more than $20,000, under contracts signed on or after 1 July 2026",
    change: "Domestic Building Insurance, required over $16,000, applies to contracts signed before 1 July 2026.",
    source: {
      label: "Building and Plumbing Commission, Domestic Building Insurance and Home Warranty",
      href: "https://www.bpc.vic.gov.au/home-owners/insurance-for-domestic-building-work/domestic-building-insurance-and-home-warranty",
      dated: "last updated 1 July 2026",
    },
    readOn: "11 October 2026",
  },
  QLD: {
    state: "QLD",
    regulator: "Queensland Building and Construction Commission (QBCC)",
    register: { label: "QBCC, search a QBCC register", href: "https://www.qbcc.qld.gov.au/about-us/our-lists-registers" },
    scheme: "Queensland Home Warranty Scheme",
    threshold: 3_300,
    thresholdWording: "most residential building work valued at more than $3,300, including materials, labour and GST",
    source: {
      label: "QBCC, What work requires insurance",
      href: "https://www.qbcc.qld.gov.au/running-your-business/home-warranty-insurance-obligations/what-work-requires-insurance",
    },
    readOn: "11 October 2026",
  },
  WA: {
    state: "WA",
    regulator: "Building and Energy (Building Commissioner), Department of Local Government, Industry Regulation and Safety",
    register: { label: "Find a registered building service provider", href: "https://www.wa.gov.au/service/business-support/professional-accreditation/find-registered-building-service-provider" },
    scheme: "Home indemnity insurance",
    threshold: 20_000,
    thresholdWording: "residential building work valued over $20,000, taken out in the owner's name before any payment or work",
    law: "Home Building Contracts Act 1991",
    source: {
      label: "Department of Local Government, Industry Regulation and Safety, Dealing with building challenges",
      href: "https://www.wa.gov.au/system/files/2026-05/260158_dealing_with_building_challenges.pdf",
      dated: "April 2026",
    },
    readOn: "11 October 2026",
  },
  SA: {
    state: "SA",
    regulator: "Consumer and Business Services (CBS)",
    register: { label: "Consumer and Business Services", href: "https://www.cbs.sa.gov.au/" },
    scheme: "Building indemnity insurance",
    threshold: 20_000,
    thresholdWording: "building work that requires development approval and is worth $20,000 or more",
    law: "Building Work Contractors Act 1995",
    change: "The threshold rose from $12,000 to $20,000 on 10 November 2025.",
    source: {
      label: "South Australian Government Financing Authority, Building Indemnity Insurance",
      href: "https://safa.sa.gov.au/insurance/building-indemnity-insurance",
    },
    readOn: "11 October 2026",
  },
  TAS: {
    state: "TAS",
    regulator: "Building Standards Tasmania",
    register: { label: "Find a licensed tradesperson", href: "https://buildingstandards.tas.gov.au/topics/licensing-and-registration/search-licensed-occupations/find-a-licensed-tradesperson" },
    scheme: "Home warranty insurance (legislated in 2023)",
    threshold: null,
    thresholdWording: "not confirmed: Building Standards Tasmania's consumer building page does not say whether the 2023 scheme has started, so ask the builder for any policy and confirm with the regulator",
    source: {
      label: "Building Standards Tasmania, Consumer building information",
      href: "https://buildingstandards.tas.gov.au/topics/building-renovating/consumer-building-information",
    },
    readOn: "11 October 2026",
  },
  ACT: {
    state: "ACT",
    regulator: "ACT Government, City and Environment Directorate",
    register: { label: "ACT Planning, construction licences", href: "https://www.planning.act.gov.au/professionals/regulation-and-responsibilities/construction-licences" },
    scheme: "Residential building insurance or a fidelity certificate",
    threshold: 12_000,
    thresholdWording: "new residences of certain kinds, and alterations or additions valued at $12,000 or more",
    law: "Building Act 2004 and Construction Occupations (Licensing) Act 2004",
    source: {
      label: "ACT Planning, Builders: responsibilities",
      href: "https://www.planning.act.gov.au/professionals/regulation-and-responsibilities/responsibilities/accordion-content/builders",
    },
    readOn: "11 October 2026",
  },
  NT: {
    state: "NT",
    regulator: "Building Practitioners Board",
    register: { label: "NT Government, residential building insurance", href: "https://nt.gov.au/property/building/build-or-renovate-your-home/residential-building-insurance" },
    scheme: "Fidelity fund certificate (residential building cover)",
    threshold: 25_000,
    thresholdWording: "prescribed residential building work, for certificates issued after 30 March 2026",
    law: "Building Act 1993",
    change: "The trigger rose from $12,000 to $25,000 on 30 March 2026.",
    source: {
      label: "NT Government, Fidelity fund certificate",
      href: "https://nt.gov.au/property/building/build-or-renovate-your-home/residential-building-insurance/fidelity-fund-certificate",
    },
    readOn: "11 October 2026",
  },
};

export const HOME_WARRANTY_ORDER: StateCode[] = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

export const warrantyThresholdText = (row: HomeWarrantyRow): string =>
  row.threshold === null ? "not confirmed" : `$${row.threshold.toLocaleString("en-AU")}`;
