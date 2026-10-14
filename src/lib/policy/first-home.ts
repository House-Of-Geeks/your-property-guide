// First home buyer policy for the eight states and territories, stored once:
// the first home owner grant (or the state's equivalent) and the first home
// buyer duty relief for each kind of property, each as a list of dated
// versions with its official source. The stamp duty engine
// (src/lib/utils/stamp-duty.ts), the stamp duty calculator, the first home
// buyer guides, the persona hub and the blog posts read these records, so a
// change in the rules is one edit here plus the tests in
// tests/lib/first-home-policy.test.ts and tests/seo/first-home-accuracy.test.ts.
//
// Every figure was checked against the revenue office named in its source on
// FIRST_HOME_REVIEWED_ON. Dates are ISO strings; effectiveFrom and effectiveTo
// are inclusive, and null means "no start we track" or "no end date
// published". Recheck each 1 July, after every state budget, and before the
// dated end of any version below (TAS grant 30 June 2027, NT grant
// 30 September 2027, VIC off-the-plan concession 20 April 2027).
import type { AustralianState } from "@/lib/utils/stamp-duty";

/** The date every record in this file was last checked against its source. */
export const FIRST_HOME_REVIEWED_ON = "2026-10-14";

export type PropertyKind = "established" | "new" | "vacant-land";

export const PROPERTY_KINDS: readonly PropertyKind[] = ["established", "new", "vacant-land"];

export const PROPERTY_KIND_LABELS: Record<PropertyKind, string> = {
  established: "Established home",
  new: "New home",
  "vacant-land": "Vacant land to build",
};

/**
 * Which date decides the rule: the contract (agreement, exchange) date, the
 * settlement date (Tasmania's duty relief), the transaction date (the ACT,
 * generally the date of the agreement), or the commencement date of the
 * eligible transaction (Tasmania's grant: the contract, or the building
 * contract or start of building for a build).
 */
export type DateBasis = "contract" | "settlement" | "transaction" | "commencement";

export const DATE_BASIS_LABELS: Record<DateBasis, string> = {
  contract: "contract date",
  settlement: "settlement date",
  transaction: "transaction date",
  commencement: "commencement date",
};

export interface PolicySource {
  label: string;
  href: string;
  /** The "page updated" date the source shows, where it shows one (ISO). */
  updated?: string;
}

interface Versioned {
  /** First day the version applies, inclusive (ISO). null: before any date we track. */
  effectiveFrom: string | null;
  /** Last day the version applies, inclusive (ISO). null: no end date published. */
  effectiveTo: string | null;
  dateBasis: DateBasis;
}

// ─── Formatting ──────────────────────────────────────────────────────────────

export const money = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-05-07" → "7 May 2026" */
export function formatPolicyDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** A Date or date string as an ISO date (YYYY-MM-DD), using the local calendar date of a Date. */
export function toIsoDate(date: Date | string | undefined | null): string | null {
  if (date == null || date === "") return null;
  if (typeof date === "string") {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? null : toIsoDate(parsed);
  }
  if (Number.isNaN(date.getTime())) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Today's date, ISO, in the local calendar. */
export const todayIso = () => toIsoDate(new Date()) as string;

function covers(v: Versioned, iso: string): boolean {
  return (v.effectiveFrom === null || iso >= v.effectiveFrom) && (v.effectiveTo === null || iso <= v.effectiveTo);
}

/** "from 7 May 2026", "1 July 2025 to 30 June 2026", "to 6 May 2026" */
export function periodLabel(v: { effectiveFrom: string | null; effectiveTo: string | null }): string {
  if (v.effectiveFrom && v.effectiveTo) return `${formatPolicyDate(v.effectiveFrom)} to ${formatPolicyDate(v.effectiveTo)}`;
  if (v.effectiveFrom) return `from ${formatPolicyDate(v.effectiveFrom)}`;
  if (v.effectiveTo) return `to ${formatPolicyDate(v.effectiveTo)}`;
  return "no dated start or end";
}

// ─── First home owner grants ─────────────────────────────────────────────────

/** What the grant can be paid on. "build" is land plus a contract to build, or a house-and-land package. */
export type GrantPropertyKind = "new" | "off-the-plan" | "substantially-renovated" | "build" | "owner-builder" | "established";

export interface GrantCap {
  /** What the cap applies to, e.g. "a new home you buy". */
  appliesTo: string;
  /** null: no value cap. */
  cap: number | null;
  /** The value must be below the cap rather than at or below it (Queensland: "less than $750,000"). */
  below?: boolean;
}

export interface GrantVersion extends Versioned {
  /** The grant's name for this version, where it differs from the record's. */
  name?: string;
  /** 0 where the state pays no grant. */
  amount: number;
  /** The amount is a maximum ("up to $15,000"). */
  upTo?: boolean;
  caps: readonly GrantCap[];
  kinds: readonly GrantPropertyKind[];
  /** One plain sentence for pages: amount, what it's for, the cap. */
  summary: string;
  note?: string;
  source?: PolicySource;
}

export interface FirstHomeGrant {
  state: AustralianState;
  name: string;
  /** Newest first. Can include a scheduled future version and versions for different property kinds at once (the NT). */
  versions: readonly GrantVersion[];
  /** Short eligibility facts that change how the grant is used. */
  conditions: readonly string[];
  source: PolicySource;
  reviewedOn: string;
}

const NEW_HOME_KINDS: readonly GrantPropertyKind[] = ["new", "off-the-plan", "substantially-renovated", "build", "owner-builder"];

export const FIRST_HOME_GRANTS: Record<AustralianState, FirstHomeGrant> = {
  NSW: {
    state: "NSW",
    name: "First Home Owner (New Homes) Grant",
    versions: [
      {
        amount: 10_000,
        caps: [
          { appliesTo: "a new or substantially renovated home you buy", cap: 600_000 },
          { appliesTo: "land and a building contract, a house-and-land package or an owner-builder home", cap: 750_000 },
        ],
        kinds: NEW_HOME_KINDS,
        effectiveFrom: null,
        effectiveTo: null,
        dateBasis: "contract",
        summary: "$10,000 for a new home bought for up to $600,000, or $750,000 for land and a building contract",
      },
    ],
    conditions: ["Live in the home for 12 continuous months, moving in within 12 months (contracts from 1 July 2023)"],
    source: { label: "Revenue NSW: First Home Owner (New Homes) Grant", href: "https://www.revenue.nsw.gov.au/grants-schemes/first-home-owner-new-homes-grant" },
    reviewedOn: FIRST_HOME_REVIEWED_ON,
  },
  VIC: {
    state: "VIC",
    name: "First Home Owner Grant",
    versions: [
      {
        amount: 10_000,
        caps: [{ appliesTo: "a new home, including the land", cap: 750_000 }],
        kinds: NEW_HOME_KINDS,
        effectiveFrom: "2013-07-01",
        effectiveTo: null,
        dateBasis: "contract",
        summary: "$10,000 for a new home valued up to $750,000",
        note: "The $20,000 grant for new homes in regional Victoria ended on 30 June 2021.",
      },
      {
        name: "First Home Owner Grant (regional Victoria)",
        amount: 20_000,
        caps: [{ appliesTo: "a new home in regional Victoria", cap: 750_000 }],
        kinds: NEW_HOME_KINDS,
        effectiveFrom: "2017-07-01",
        effectiveTo: "2021-06-30",
        dateBasis: "contract",
        summary: "$20,000 for a new home in regional Victoria (ended 30 June 2021)",
      },
    ],
    conditions: ["Live in the home for 12 continuous months, moving in within 12 months"],
    source: { label: "State Revenue Office Victoria: First Home Owner Grant", href: "https://www.sro.vic.gov.au/first-home-owner" },
    reviewedOn: FIRST_HOME_REVIEWED_ON,
  },
  QLD: {
    state: "QLD",
    name: "First Home Owner Grant",
    versions: [
      {
        amount: 30_000,
        caps: [{ appliesTo: "a new home, including the land", cap: 750_000, below: true }],
        kinds: NEW_HOME_KINDS,
        effectiveFrom: "2023-11-20",
        effectiveTo: null,
        dateBasis: "contract",
        summary: "$30,000 for a new home valued under $750,000",
        note: "The 2026-27 Queensland Budget kept the $30,000 grant; the Queensland Revenue Office lists no end date.",
      },
      {
        amount: 15_000,
        caps: [{ appliesTo: "a new home, including the land", cap: 750_000, below: true }],
        kinds: NEW_HOME_KINDS,
        effectiveFrom: null,
        effectiveTo: "2023-11-19",
        dateBasis: "contract",
        summary: "$15,000 for a new home valued under $750,000 (contracts before 20 November 2023)",
      },
    ],
    conditions: ["Move in within 1 year and live there for 6 continuous months", "No grant on an established home or on vacant land alone"],
    source: { label: "Queensland Revenue Office: First Home Owner Grant", href: "https://qro.qld.gov.au/property-concessions-grants/first-home-grant/" },
    reviewedOn: FIRST_HOME_REVIEWED_ON,
  },
  WA: {
    state: "WA",
    name: "First Home Owner Grant",
    versions: [
      {
        amount: 10_000,
        caps: [
          { appliesTo: "a new home south of the 26th parallel, including Perth", cap: 800_000 },
          { appliesTo: "a new home north of the 26th parallel", cap: 1_000_000 },
        ],
        kinds: NEW_HOME_KINDS,
        effectiveFrom: "2026-05-07",
        effectiveTo: null,
        dateBasis: "transaction",
        summary: "$10,000 for a new home valued up to $800,000 in Perth and the south of the state, or $1,000,000 north of the 26th parallel",
        note: "Since 7 May 2026 the grant cap no longer limits the first home owner rate of duty.",
        source: { label: "WA Government: 2026-27 Housing Taxation Package", href: "https://www.wa.gov.au/government/announcements/2026-27-housing-taxation-package" },
      },
      {
        amount: 10_000,
        caps: [
          { appliesTo: "a new home south of the 26th parallel, including Perth", cap: 750_000 },
          { appliesTo: "a new home north of the 26th parallel", cap: 1_000_000 },
        ],
        kinds: NEW_HOME_KINDS,
        effectiveFrom: null,
        effectiveTo: "2026-05-06",
        dateBasis: "transaction",
        summary: "$10,000 for a new home valued up to $750,000 south of the 26th parallel, or $1,000,000 north of it (before 7 May 2026)",
      },
    ],
    conditions: ["Live in the home for 6 continuous months, moving in within 12 months"],
    source: { label: "WA Government: About the First Home Owner Grant", href: "https://www.wa.gov.au/government/publications/about-the-first-home-owner-grant" },
    reviewedOn: FIRST_HOME_REVIEWED_ON,
  },
  SA: {
    state: "SA",
    name: "First Home Owner Grant",
    versions: [
      {
        amount: 15_000,
        upTo: true,
        caps: [{ appliesTo: "a new home, an off-the-plan home, a substantially renovated home or a building contract", cap: null }],
        kinds: NEW_HOME_KINDS,
        effectiveFrom: "2024-06-06",
        effectiveTo: null,
        dateBasis: "contract",
        summary: "Up to $15,000 for a new home, with no value cap",
      },
      {
        amount: 15_000,
        upTo: true,
        caps: [{ appliesTo: "a new home", cap: 650_000 }],
        kinds: NEW_HOME_KINDS,
        effectiveFrom: "2023-06-15",
        effectiveTo: "2024-06-05",
        dateBasis: "contract",
        summary: "Up to $15,000 for a new home valued up to $650,000",
      },
      {
        amount: 15_000,
        upTo: true,
        caps: [{ appliesTo: "a new home", cap: 575_000 }],
        kinds: NEW_HOME_KINDS,
        effectiveFrom: "2010-09-17",
        effectiveTo: "2023-06-14",
        dateBasis: "contract",
        summary: "Up to $15,000 for a new home valued up to $575,000",
      },
    ],
    conditions: ["No grant on an established home or on vacant land alone"],
    source: { label: "RevenueSA: First Home Owner Grant, eligible properties", href: "https://www.revenuesa.sa.gov.au/FHOG/eligible-properties" },
    reviewedOn: FIRST_HOME_REVIEWED_ON,
  },
  TAS: {
    state: "TAS",
    name: "First Home Owner Grant",
    versions: [
      {
        amount: 10_000,
        caps: [{ appliesTo: "a new home", cap: null }],
        kinds: NEW_HOME_KINDS,
        effectiveFrom: "2027-07-01",
        effectiveTo: null,
        dateBasis: "commencement",
        summary: "$10,000 for a new home (scheduled from 1 July 2027)",
        note: "Scheduled: the grant reverts to $10,000 from 1 July 2027 unless the government extends the higher amount.",
      },
      {
        amount: 20_000,
        caps: [{ appliesTo: "a new home, including a kit home", cap: null }],
        kinds: NEW_HOME_KINDS,
        effectiveFrom: "2026-07-01",
        effectiveTo: "2027-06-30",
        dateBasis: "commencement",
        summary: "$20,000 for a new home, with no value cap, for transactions from 1 July 2026 to 30 June 2027",
      },
      {
        amount: 30_000,
        caps: [{ appliesTo: "a new home", cap: null }],
        kinds: NEW_HOME_KINDS,
        effectiveFrom: "2025-07-01",
        effectiveTo: "2026-06-30",
        dateBasis: "commencement",
        summary: "$30,000 for a new home (1 July 2025 to 30 June 2026)",
      },
      {
        amount: 10_000,
        caps: [{ appliesTo: "a new home", cap: null }],
        kinds: NEW_HOME_KINDS,
        effectiveFrom: "2024-07-01",
        effectiveTo: "2025-06-30",
        dateBasis: "commencement",
        summary: "$10,000 for a new home (1 July 2024 to 30 June 2025)",
      },
      {
        amount: 30_000,
        caps: [{ appliesTo: "a new home", cap: null }],
        kinds: NEW_HOME_KINDS,
        effectiveFrom: "2021-04-01",
        effectiveTo: "2024-06-30",
        dateBasis: "commencement",
        summary: "$30,000 for a new home (1 April 2021 to 30 June 2024)",
      },
    ],
    conditions: ["New homes only, including kit homes; no grant on an established home"],
    source: { label: "State Revenue Office Tasmania: First Home Owner Grant eligibility", href: "https://www.sro.tas.gov.au/first-home-owner/eligibility", updated: "2026-07-14" },
    reviewedOn: FIRST_HOME_REVIEWED_ON,
  },
  ACT: {
    state: "ACT",
    name: "First Home Owner Grant",
    versions: [
      {
        amount: 0,
        caps: [],
        kinds: [],
        effectiveFrom: "2019-07-01",
        effectiveTo: null,
        dateBasis: "transaction",
        summary: "No first home owner grant; it ceased on 1 July 2019, and the Home Buyer Concession Scheme removes the duty instead",
      },
    ],
    conditions: [],
    source: { label: "ACT Revenue Office: About the Home Buyer Concession Scheme", href: "https://www.revenue.act.gov.au/home-buyer-assistance/home-buyer-concession-scheme/about-the-home-buyer-concession-scheme" },
    reviewedOn: FIRST_HOME_REVIEWED_ON,
  },
  NT: {
    state: "NT",
    name: "HomeGrown Territory Grant",
    versions: [
      {
        name: "First Home Owner Grant",
        amount: 10_000,
        caps: [{ appliesTo: "a new home", cap: null }],
        kinds: ["new", "off-the-plan", "build", "owner-builder"],
        effectiveFrom: "2027-10-01",
        effectiveTo: null,
        dateBasis: "contract",
        summary: "$10,000 First Home Owner Grant for a new home (scheduled for contracts from 1 October 2027)",
        note: "Scheduled: after the HomeGrown Territory Grant ends, the $10,000 First Home Owner Grant applies to new homes.",
      },
      {
        amount: 50_000,
        caps: [{ appliesTo: "a new home, including off-the-plan and owner-builder homes", cap: null }],
        kinds: ["new", "off-the-plan", "build", "owner-builder"],
        effectiveFrom: "2024-10-01",
        effectiveTo: "2027-09-30",
        dateBasis: "contract",
        summary: "$50,000 for building or buying a new home, with no price cap, for contracts from 1 October 2024 to 30 September 2027",
        note: "Not for vacant land alone. Apply by 30 September 2028 and live in the home for 12 months.",
      },
      {
        amount: 10_000,
        caps: [{ appliesTo: "an established home", cap: null }],
        kinds: ["established"],
        effectiveFrom: "2024-10-01",
        effectiveTo: "2025-09-30",
        dateBasis: "contract",
        summary: "$10,000 for an established home (contracts 1 October 2024 to 30 September 2025, now closed)",
      },
    ],
    conditions: ["Live in the home for 12 months", "Apply by 30 September 2028"],
    source: { label: "Territory Revenue Office: HomeGrown Territory grants guide", href: "https://treasury.nt.gov.au/dtf/territory-revenue-office/homegrown-territory-guide-grants", updated: "2026-05-19" },
    reviewedOn: FIRST_HOME_REVIEWED_ON,
  },
};

function grantKindsFor(kind: GrantPropertyKind | PropertyKind): GrantPropertyKind[] {
  if (kind === "vacant-land") return []; // no state pays a grant on land alone
  return [kind];
}

/**
 * The grant version that applies on a date to a kind of property. A new home
 * is the default. Returns the record with version null where nothing applies
 * (an established home in most states, the ACT, land alone).
 */
export function grantFor(
  state: AustralianState,
  date?: Date | string | null,
  kind: GrantPropertyKind | PropertyKind = "new",
): { grant: FirstHomeGrant; version: GrantVersion | null } {
  const grant = FIRST_HOME_GRANTS[state];
  const iso = toIsoDate(date ?? null) ?? FIRST_HOME_REVIEWED_ON;
  const kinds = grantKindsFor(kind);
  // An amount-0 version (the ACT) says "no grant" for every kind of property.
  const version = grant.versions.find((v) => covers(v, iso) && (v.amount === 0 || v.kinds.some((k) => kinds.includes(k)))) ?? null;
  return { grant, version };
}

/** The grant for a new home as at FIRST_HOME_REVIEWED_ON. */
export function currentGrant(state: AustralianState): GrantVersion {
  const v = grantFor(state, FIRST_HOME_REVIEWED_ON, "new").version;
  if (!v) throw new Error(`No current grant version for ${state}`);
  return v;
}

/** The current grant in one sentence: "$10,000 for a new home bought for up to $600,000, ...". */
export function grantSummary(state: AustralianState, date?: Date | string | null): string {
  return grantFor(state, date ?? FIRST_HOME_REVIEWED_ON, "new").version?.summary ?? "No first home owner grant";
}

/** The current grant's amount, 0 for none: "$10,000", "Up to $15,000", "No grant". */
export function grantAmountLabel(state: AustralianState): string {
  const v = currentGrant(state);
  if (v.amount === 0) return "No grant";
  return `${v.upTo ? "Up to " : ""}${money(v.amount)}`;
}

/** The current grant's caps in words: "$600,000 (a new home you buy), $750,000 (...)" or "No value cap". */
export function grantCapLabel(state: AustralianState): string {
  const v = currentGrant(state);
  if (v.amount === 0) return "";
  if (v.caps.every((c) => c.cap === null)) return "No value cap";
  return v.caps
    .map((c) => (c.cap === null ? `no cap for ${c.appliesTo}` : `${c.below ? "under " : ""}${money(c.cap)} for ${c.appliesTo}`))
    .join("; ");
}

// ─── First home buyer duty relief ────────────────────────────────────────────

/** How the relief is worked out. The engine in src/lib/utils/stamp-duty.ts implements each method. */
export type ReliefMethod =
  /** No first home relief. */
  | { type: "none" }
  /** No duty at any value. */
  | { type: "full" }
  /**
   * No duty up to exemptTo; between exemptTo and concessionTo the duty rises in a
   * straight line to full duty. scale "duty-at-cap": payable = duty at concessionTo
   * × the share of the band crossed (Revenue NSW); "duty-at-price": payable = duty
   * at the price × that share (SRO Victoria).
   */
  | { type: "linear"; exemptTo: number; concessionTo: number; concessionBelow: boolean; scale: "duty-at-cap" | "duty-at-price" }
  /**
   * No duty up to exemptTo, then a flat rate per $100 (or part) of the value above
   * exemptTo, up to concessionTo (WA's first home owner rate). Two bands where the
   * cap differs by area (Perth and Peel, or elsewhere).
   */
  | { type: "rate-per-100"; exemptTo: number; bands: readonly { area: "all" | "metro" | "regional"; concessionTo: number; ratePer100: number }[] }
  /** A fixed amount off the duty by price band; no duty up to exemptTo, nil from concessionTo (Queensland's first home concession). */
  | { type: "deduction-table"; exemptTo: number; concessionTo: number; table: readonly { below: number; amount: number }[] }
  /** A fixed amount off the duty, so no duty up to exemptTo (the ACT's Home Buyer Concession Scheme, 2025-26). */
  | { type: "flat-reduction"; exemptTo: number; maxConcession: number }
  /** A percentage of the duty off, on a value up to capTo; no relief above it (Tasmania). */
  | { type: "percent"; percent: number; capTo: number }
  /** No duty up to exemptTo and a partial concession below concessionTo that the engine doesn't model. */
  | { type: "exempt-partial-unmodelled"; exemptTo: number; concessionTo: number };

export interface DutyReliefVersion extends Versioned {
  method: ReliefMethod;
  /** Overrides the generated summary. */
  summary?: string;
  /** Conditions that change the outcome but the calculator can't test (an income test, citizenship). */
  notes?: readonly string[];
  source?: PolicySource;
}

export interface FirstHomeDutyRelief {
  state: AustralianState;
  kind: PropertyKind;
  /** The scheme's name. */
  name: string;
  /** Newest first. */
  versions: readonly DutyReliefVersion[];
  source: PolicySource;
  reviewedOn: string;
}

// The Queensland first home concession amounts, contracts from 9 June 2024: a
// fixed amount off the home concession duty by price band. $17,350 clears the
// whole bill up to $700,000; nil from $800,000.
// https://qro.qld.gov.au/duties/transfer-duty/calculate/concession-rates/
export const QLD_FIRST_HOME_DEDUCTION: ReadonlyArray<{ below: number; amount: number }> = [
  { below: 710_000, amount: 17_350 },
  { below: 720_000, amount: 15_615 },
  { below: 730_000, amount: 13_880 },
  { below: 740_000, amount: 12_145 },
  { below: 750_000, amount: 10_410 },
  { below: 760_000, amount: 8_675 },
  { below: 770_000, amount: 6_940 },
  { below: 780_000, amount: 5_205 },
  { below: 790_000, amount: 3_470 },
  { below: 800_000, amount: 1_735 },
];

const NONE: ReliefMethod = { type: "none" };
const FULL: ReliefMethod = { type: "full" };

// NSW: First Home Buyers Assistance Scheme, by contract exchange date.
const NSW_SOURCE: PolicySource = { label: "Revenue NSW: First Home Buyers Assistance Scheme", href: "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme" };
const nswLinear = (exemptTo: number, concessionTo: number): ReliefMethod => ({ type: "linear", exemptTo, concessionTo, concessionBelow: true, scale: "duty-at-cap" });
const NSW_HOME_VERSIONS = (kind: "established" | "new"): DutyReliefVersion[] => [
  { method: nswLinear(800_000, 1_000_000), effectiveFrom: "2023-07-01", effectiveTo: null, dateBasis: "contract" },
  { method: nswLinear(650_000, 800_000), effectiveFrom: "2021-08-01", effectiveTo: "2023-06-30", dateBasis: "contract" },
  kind === "new"
    ? { method: nswLinear(800_000, 1_000_000), effectiveFrom: "2020-08-01", effectiveTo: "2021-07-31", dateBasis: "contract" }
    : { method: nswLinear(650_000, 800_000), effectiveFrom: "2020-08-01", effectiveTo: "2021-07-31", dateBasis: "contract" },
  { method: nswLinear(650_000, 800_000), effectiveFrom: "2017-07-01", effectiveTo: "2020-07-31", dateBasis: "contract" },
];
const NSW_LAND_VERSIONS: DutyReliefVersion[] = [
  { method: nswLinear(350_000, 450_000), effectiveFrom: "2021-08-01", effectiveTo: null, dateBasis: "contract" },
  { method: nswLinear(400_000, 500_000), effectiveFrom: "2020-08-01", effectiveTo: "2021-07-31", dateBasis: "contract" },
  { method: nswLinear(350_000, 450_000), effectiveFrom: "2017-07-01", effectiveTo: "2020-07-31", dateBasis: "contract" },
];

// VIC: first home buyer duty exemption or concession, contracts from 1 July 2017;
// new and established homes, and vacant land (duty on the land value).
const VIC_SOURCE: PolicySource = {
  label: "State Revenue Office Victoria: First home buyer duty exemption or concession",
  href: "https://www.sro.vic.gov.au/buying-property/land-transfer-stamp-duty/concessions-exemptions-and-waivers/first-home-buyers/first-home-buyer-duty-exemption-or-concession",
  updated: "2026-09-15",
};
const VIC_VERSIONS: DutyReliefVersion[] = [
  {
    method: { type: "linear", exemptTo: 600_000, concessionTo: 750_000, concessionBelow: false, scale: "duty-at-price" },
    effectiveFrom: "2017-07-01",
    effectiveTo: null,
    dateBasis: "contract",
  },
];

// QLD: first home concessions, by contract date. From 1 August 2026 the home
// concessions need an Australian citizen, permanent resident or specified
// foreign retiree.
const QLD_CITIZEN_NOTE = "From 1 August 2026 Queensland's home concessions need an Australian citizen, permanent resident or specified foreign retiree.";
const QLD_ESTABLISHED: DutyReliefVersion = {
  method: { type: "deduction-table", exemptTo: 700_000, concessionTo: 800_000, table: QLD_FIRST_HOME_DEDUCTION },
  effectiveFrom: "2024-06-09",
  effectiveTo: null,
  dateBasis: "contract",
  notes: [QLD_CITIZEN_NOTE],
};
const QLD_ESTABLISHED_OLD: DutyReliefVersion = {
  method: { type: "exempt-partial-unmodelled", exemptTo: 500_000, concessionTo: 550_000 },
  effectiveFrom: null,
  effectiveTo: "2024-06-08",
  dateBasis: "contract",
};

// WA: first home owner rate of duty, by the date of the agreement (not settlement).
const WA_SOURCE: PolicySource = {
  label: "RevenueWA: Duties fact sheet, first home owner rate",
  href: "https://www.wa.gov.au/government/publications/duties-fact-sheet-first-home-owner-rate",
  updated: "2026-08-27",
};
const WA_HOME_VERSIONS: DutyReliefVersion[] = [
  {
    method: { type: "rate-per-100", exemptTo: 600_000, bands: [{ area: "all", concessionTo: 800_000, ratePer100: 16.15 }] },
    effectiveFrom: "2026-05-07",
    effectiveTo: null,
    dateBasis: "contract",
    source: { label: "WA Government: 2026-27 Housing Taxation Package", href: "https://www.wa.gov.au/government/announcements/2026-27-housing-taxation-package" },
  },
  {
    method: {
      type: "rate-per-100",
      exemptTo: 500_000,
      bands: [
        { area: "metro", concessionTo: 700_000, ratePer100: 13.63 },
        { area: "regional", concessionTo: 750_000, ratePer100: 11.89 },
      ],
    },
    effectiveFrom: "2025-03-21",
    effectiveTo: "2026-05-06",
    dateBasis: "contract",
  },
  {
    method: { type: "rate-per-100", exemptTo: 450_000, bands: [{ area: "all", concessionTo: 600_000, ratePer100: 15.01 }] },
    effectiveFrom: "2024-05-09",
    effectiveTo: "2025-03-20",
    dateBasis: "contract",
  },
  {
    method: { type: "rate-per-100", exemptTo: 430_000, bands: [{ area: "all", concessionTo: 530_000, ratePer100: 19.19 }] },
    effectiveFrom: null,
    effectiveTo: "2024-05-08",
    dateBasis: "contract",
  },
];
const WA_LAND_VERSIONS: DutyReliefVersion[] = [
  {
    method: { type: "rate-per-100", exemptTo: 450_000, bands: [{ area: "all", concessionTo: 550_000, ratePer100: 20.14 }] },
    effectiveFrom: "2026-05-07",
    effectiveTo: null,
    dateBasis: "contract",
  },
  {
    method: { type: "rate-per-100", exemptTo: 350_000, bands: [{ area: "all", concessionTo: 450_000, ratePer100: 15.39 }] },
    effectiveFrom: "2025-03-21",
    effectiveTo: "2026-05-06",
    dateBasis: "contract",
  },
  {
    method: { type: "rate-per-100", exemptTo: 300_000, bands: [{ area: "all", concessionTo: 400_000, ratePer100: 13.01 }] },
    effectiveFrom: null,
    effectiveTo: "2025-03-20",
    dateBasis: "contract",
  },
];

// SA: stamp duty relief for eligible first home buyers, by contract date. From
// 13 February 2025 the relief doesn't cover the foreign ownership surcharge,
// and any previous interest in residential property disqualifies.
const SA_SOURCE: PolicySource = { label: "RevenueSA: Stamp duty relief for eligible first home buyers", href: "https://www.revenuesa.sa.gov.au/stamp-duty-land/first-home-buyer-relief" };
const SA_PRIOR_INTEREST_NOTE = "From 13 February 2025 any previous interest in residential property rules you out, and the relief doesn't cover the foreign ownership surcharge.";
const SA_NEW_VERSIONS: DutyReliefVersion[] = [
  { method: FULL, effectiveFrom: "2024-06-06", effectiveTo: null, dateBasis: "contract", notes: [SA_PRIOR_INTEREST_NOTE] },
  { method: { type: "exempt-partial-unmodelled", exemptTo: 650_000, concessionTo: 700_000 }, effectiveFrom: "2023-06-15", effectiveTo: "2024-06-05", dateBasis: "contract" },
  { method: NONE, effectiveFrom: null, effectiveTo: "2023-06-14", dateBasis: "contract" },
];
const SA_LAND_VERSIONS: DutyReliefVersion[] = [
  { method: FULL, effectiveFrom: "2024-06-06", effectiveTo: null, dateBasis: "contract", notes: [SA_PRIOR_INTEREST_NOTE] },
  { method: { type: "exempt-partial-unmodelled", exemptTo: 400_000, concessionTo: 450_000 }, effectiveFrom: "2023-06-15", effectiveTo: "2024-06-05", dateBasis: "contract" },
  { method: NONE, effectiveFrom: null, effectiveTo: "2023-06-14", dateBasis: "contract" },
];

// TAS: first home buyers of established homes duty relief, by SETTLEMENT date.
const TAS_SOURCE: PolicySource = {
  label: "State Revenue Office Tasmania: First home buyers of established homes duty relief",
  href: "https://www.sro.tas.gov.au/property-transfer-duties/concessions-exemptions/first-home-buyers-of-established-homes-duty-relief",
  updated: "2026-07-16",
};
const TAS_ESTABLISHED_VERSIONS: DutyReliefVersion[] = [
  {
    method: NONE,
    effectiveFrom: "2026-07-01",
    effectiveTo: null,
    dateBasis: "settlement",
    summary: "No first home duty relief for a transfer settling after 30 June 2026",
  },
  { method: { type: "percent", percent: 100, capTo: 750_000 }, effectiveFrom: "2024-02-18", effectiveTo: "2026-06-30", dateBasis: "settlement" },
  { method: { type: "percent", percent: 50, capTo: 600_000 }, effectiveFrom: "2022-01-01", effectiveTo: "2024-02-17", dateBasis: "settlement" },
];

// ACT: Home Buyer Concession Scheme, by transaction date. Eligibility: no
// interest in any property in the 5 years before the transaction, and live in
// the home for at least a year, moving in within a year of settlement.
const ACT_SOURCE: PolicySource = {
  label: "ACT Revenue Office: About the Home Buyer Concession Scheme",
  href: "https://www.revenue.act.gov.au/home-buyer-assistance/home-buyer-concession-scheme/about-the-home-buyer-concession-scheme",
};
const ACT_VERSIONS: DutyReliefVersion[] = [
  {
    method: FULL,
    effectiveFrom: "2026-07-01",
    effectiveTo: null,
    dateBasis: "transaction",
    summary: "No duty at any price, with no income test, if you haven't held an interest in any property in the last five years",
  },
  {
    method: { type: "flat-reduction", exemptTo: 1_020_000, maxConcession: 35_238 },
    effectiveFrom: "2025-07-01",
    effectiveTo: "2026-06-30",
    dateBasis: "transaction",
    notes: ["An income test applied: household income up to $250,000, plus $4,600 for each dependent child. The calculator can't check it."],
  },
];

const NT_SOURCE: PolicySource = { label: "NT Government: Buying or building a new home", href: "https://nt.gov.au/property/home-owner-assistance/buy-build-new-home" };
const NT_VERSIONS: DutyReliefVersion[] = [
  {
    method: NONE,
    effectiveFrom: null,
    effectiveTo: null,
    dateBasis: "contract",
    summary: "No first home buyer duty concession; the help comes as the HomeGrown Territory Grant",
    notes: ["The House and Land Package Exemption (any buyer of a new house-and-land package from a builder, contracts 1 July 2022 to 30 June 2027) isn't modelled."],
  },
];

function relief(state: AustralianState, kind: PropertyKind, name: string, versions: DutyReliefVersion[], source: PolicySource): FirstHomeDutyRelief {
  return { state, kind, name, versions, source, reviewedOn: FIRST_HOME_REVIEWED_ON };
}

export const FIRST_HOME_DUTY_RELIEF: Record<AustralianState, Record<PropertyKind, FirstHomeDutyRelief>> = {
  NSW: {
    established: relief("NSW", "established", "First Home Buyers Assistance Scheme", NSW_HOME_VERSIONS("established"), NSW_SOURCE),
    new: relief("NSW", "new", "First Home Buyers Assistance Scheme", NSW_HOME_VERSIONS("new"), NSW_SOURCE),
    "vacant-land": relief("NSW", "vacant-land", "First Home Buyers Assistance Scheme (vacant land)", NSW_LAND_VERSIONS, NSW_SOURCE),
  },
  VIC: {
    established: relief("VIC", "established", "First home buyer duty exemption or concession", VIC_VERSIONS, VIC_SOURCE),
    new: relief("VIC", "new", "First home buyer duty exemption or concession", VIC_VERSIONS, VIC_SOURCE),
    "vacant-land": relief("VIC", "vacant-land", "First home buyer duty exemption or concession (vacant land)", VIC_VERSIONS, VIC_SOURCE),
  },
  QLD: {
    established: relief("QLD", "established", "First home concession", [QLD_ESTABLISHED, QLD_ESTABLISHED_OLD], {
      label: "Queensland Revenue Office: First home concession",
      href: "https://qro.qld.gov.au/duties/transfer-duty/concessions/homes/first-home/",
      updated: "2026-07-31",
    }),
    new: relief(
      "QLD",
      "new",
      "First home (new home) concession",
      [
        { method: FULL, effectiveFrom: "2025-05-01", effectiveTo: null, dateBasis: "contract", notes: [QLD_CITIZEN_NOTE] },
        { ...QLD_ESTABLISHED, effectiveTo: "2025-04-30", notes: [] },
        QLD_ESTABLISHED_OLD,
      ],
      { label: "Queensland Revenue Office: First home (new home) concession", href: "https://qro.qld.gov.au/duties/transfer-duty/concessions/homes/first-home-new/", updated: "2026-07-31" },
    ),
    "vacant-land": relief(
      "QLD",
      "vacant-land",
      "First home vacant land concession",
      [
        { method: FULL, effectiveFrom: "2025-05-01", effectiveTo: null, dateBasis: "contract", summary: "No duty on residential vacant land to build a first home, with no value cap" },
        { method: { type: "exempt-partial-unmodelled", exemptTo: 350_000, concessionTo: 500_000 }, effectiveFrom: "2024-06-09", effectiveTo: "2025-04-30", dateBasis: "contract" },
        { method: { type: "exempt-partial-unmodelled", exemptTo: 250_000, concessionTo: 400_000 }, effectiveFrom: null, effectiveTo: "2024-06-08", dateBasis: "contract" },
      ],
      { label: "Queensland Revenue Office: First home vacant land concession", href: "https://qro.qld.gov.au/duties/transfer-duty/concessions/homes/first-home-vacant-land/", updated: "2026-07-31" },
    ),
  },
  WA: {
    established: relief("WA", "established", "First home owner rate of duty", WA_HOME_VERSIONS, WA_SOURCE),
    new: relief("WA", "new", "First home owner rate of duty", WA_HOME_VERSIONS, WA_SOURCE),
    "vacant-land": relief("WA", "vacant-land", "First home owner rate of duty (vacant land)", WA_LAND_VERSIONS, WA_SOURCE),
  },
  SA: {
    established: relief(
      "SA",
      "established",
      "First home buyer stamp duty relief",
      [{ method: NONE, effectiveFrom: null, effectiveTo: null, dateBasis: "contract", summary: "No first home duty relief on an established home" }],
      SA_SOURCE,
    ),
    new: relief("SA", "new", "First home buyer stamp duty relief (new home or off-the-plan)", SA_NEW_VERSIONS, SA_SOURCE),
    "vacant-land": relief("SA", "vacant-land", "First home buyer stamp duty relief (vacant land to build)", SA_LAND_VERSIONS, SA_SOURCE),
  },
  TAS: {
    established: relief("TAS", "established", "First home buyers of established homes duty relief", TAS_ESTABLISHED_VERSIONS, TAS_SOURCE),
    new: relief(
      "TAS",
      "new",
      "No first home duty relief on a new home",
      [{ method: NONE, effectiveFrom: null, effectiveTo: null, dateBasis: "settlement", summary: "No first home duty relief on a new home; the First Home Owner Grant applies instead" }],
      TAS_SOURCE,
    ),
    "vacant-land": relief(
      "TAS",
      "vacant-land",
      "No first home duty relief on vacant land",
      [{ method: NONE, effectiveFrom: null, effectiveTo: null, dateBasis: "settlement", summary: "No first home duty relief on vacant land" }],
      TAS_SOURCE,
    ),
  },
  ACT: {
    established: relief("ACT", "established", "Home Buyer Concession Scheme", ACT_VERSIONS, ACT_SOURCE),
    new: relief("ACT", "new", "Home Buyer Concession Scheme", ACT_VERSIONS, ACT_SOURCE),
    "vacant-land": relief("ACT", "vacant-land", "Home Buyer Concession Scheme (vacant land)", ACT_VERSIONS, ACT_SOURCE),
  },
  NT: {
    established: relief("NT", "established", "No first home duty concession", NT_VERSIONS, NT_SOURCE),
    new: relief("NT", "new", "No first home duty concession", NT_VERSIONS, NT_SOURCE),
    "vacant-land": relief("NT", "vacant-land", "No first home duty concession", NT_VERSIONS, NT_SOURCE),
  },
};

/** The relief version for a state, kind of property and date (the date its dateBasis names). null where we hold no rules for that date. */
export function dutyReliefFor(
  state: AustralianState,
  kind: PropertyKind = "established",
  date?: Date | string | null,
): { relief: FirstHomeDutyRelief; version: DutyReliefVersion | null } {
  const r = FIRST_HOME_DUTY_RELIEF[state][kind];
  const iso = toIsoDate(date ?? null) ?? FIRST_HOME_REVIEWED_ON;
  return { relief: r, version: r.versions.find((v) => covers(v, iso)) ?? null };
}

/** The relief version in force on FIRST_HOME_REVIEWED_ON. */
export function currentDutyRelief(state: AustralianState, kind: PropertyKind = "established"): DutyReliefVersion {
  const v = dutyReliefFor(state, kind, FIRST_HOME_REVIEWED_ON).version;
  if (!v) throw new Error(`No current duty relief version for ${state} ${kind}`);
  return v;
}

/** One plain sentence for a relief version: "No duty up to $600,000, reduced duty to $750,000". */
export function summariseRelief(v: DutyReliefVersion): string {
  if (v.summary) return v.summary;
  const m = v.method;
  switch (m.type) {
    case "none":
      return "No first home duty relief";
    case "full":
      return "No duty, with no price cap";
    case "linear":
      return `No duty up to ${money(m.exemptTo)}, reduced duty ${m.concessionBelow ? "below" : "to"} ${money(m.concessionTo)}`;
    case "rate-per-100": {
      if (m.bands.length === 1) {
        const b = m.bands[0];
        return `No duty up to ${money(m.exemptTo)}, then $${b.ratePer100.toFixed(2)} per $100 above that, to ${money(b.concessionTo)}`;
      }
      const metro = m.bands.find((b) => b.area === "metro");
      const regional = m.bands.find((b) => b.area === "regional");
      return `No duty up to ${money(m.exemptTo)}, then $${metro?.ratePer100.toFixed(2)} per $100 above that to ${money(metro?.concessionTo ?? 0)} in Perth and Peel, or $${regional?.ratePer100.toFixed(2)} per $100 to ${money(regional?.concessionTo ?? 0)} elsewhere`;
    }
    case "deduction-table":
      return `No duty up to ${money(m.exemptTo)}, reduced duty below ${money(m.concessionTo)}`;
    case "flat-reduction":
      return `No duty up to ${money(m.exemptTo)}, and ${money(m.maxConcession)} off the duty above that`;
    case "percent":
      return m.percent === 100 ? `No duty up to ${money(m.capTo)}` : `${m.percent}% off the duty up to ${money(m.capTo)}`;
    case "exempt-partial-unmodelled":
      return `No duty up to ${money(m.exemptTo)}, reduced duty below ${money(m.concessionTo)}`;
  }
}

/** The current relief for a state and kind in one sentence. */
export function dutyReliefSummary(state: AustralianState, kind: PropertyKind = "established", date?: Date | string | null): string {
  const v = dutyReliefFor(state, kind, date ?? FIRST_HOME_REVIEWED_ON).version;
  return v ? summariseRelief(v) : "We don't hold the rules for that date";
}

/** The exemption threshold of the current relief, null where there is no threshold (none, or no cap). */
export function currentExemptTo(state: AustralianState, kind: PropertyKind = "established"): number | null {
  const m = currentDutyRelief(state, kind).method;
  if ("exemptTo" in m) return m.exemptTo;
  if (m.type === "percent" && m.percent === 100) return m.capTo;
  return null;
}

/** The top of the concession band of the current relief, null where there is none. */
export function currentConcessionTo(state: AustralianState, kind: PropertyKind = "established"): number | null {
  const m = currentDutyRelief(state, kind).method;
  if (m.type === "linear" || m.type === "deduction-table" || m.type === "exempt-partial-unmodelled") return m.concessionTo;
  if (m.type === "rate-per-100") return Math.max(...m.bands.map((b) => b.concessionTo));
  return null;
}

// ─── Schemes that have closed ────────────────────────────────────────────────

/** First home schemes that pages used to describe as open. Pages should mention them only as closed. */
export const CLOSED_FIRST_HOME_SCHEMES = [
  { state: "NSW", name: "First Home Buyer Choice", closed: "Closed to new buyers in 2023; contracts from 1 July 2023 use the First Home Buyers Assistance Scheme" },
  { state: "NSW", name: "Shared Equity Home Buyer Helper", closed: "Closed on 30 June 2024" },
  { state: "VIC", name: "Victorian Homebuyer Fund", closed: "Closed to new applications on 10 September 2025" },
  { state: "TAS", name: "First home buyers of established homes duty relief", closed: "Not available for transfers settling after 30 June 2026" },
  { state: "NT", name: "HomeGrown Territory Grant for established homes ($10,000)", closed: "Contracts 1 October 2024 to 30 September 2025 only" },
  { state: "NT", name: "First Home Owner Discount", closed: "No longer offered; the NT has no first home duty concession" },
] as const satisfies readonly { state: AustralianState; name: string; closed: string }[];

// ─── Victoria's temporary off-the-plan concession (all buyers) ───────────────

/**
 * SRO Victoria: a temporary off-the-plan duty concession for any buyer of a
 * strata lot in a subdivision with common property (apartments, units,
 * townhouses), contracts from 21 October 2024 to before 21 April 2027. SRO
 * says it has been extended to that date; check the legislation has passed
 * before relying on a late contract date.
 */
export const VIC_OFF_THE_PLAN_TEMPORARY = {
  effectiveFrom: "2024-10-21",
  effectiveTo: "2027-04-20",
  source: {
    label: "State Revenue Office Victoria: Strata apartments and townhouses temporary concession",
    href: "https://www.sro.vic.gov.au/buying-property/land-transfer-stamp-duty/concessions-exemptions-and-waivers/plan-duty-concession-0/strata-apartments-and-townhouses-temporary-concession",
  },
} as const;
