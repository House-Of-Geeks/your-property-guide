// Typical real estate commission by state. One source of truth for the
// commission calculator, the state commission guides and the selling-cost
// tables. Ranges are typical market figures seen in published guides and
// agent-comparison platforms, cross-checked in docs/lead-gen-strategy.md;
// no state sets an official rate and every figure is negotiable.

export type StateCode = "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "NT" | "ACT";

export interface CommissionRange {
  low: number;
  high: number;
  typical: number;
}

export const STATE_RATES: Record<StateCode, CommissionRange> = {
  NSW: { low: 1.8, high: 2.5,  typical: 2.0 },
  VIC: { low: 1.6, high: 2.5,  typical: 2.0 },
  QLD: { low: 2.3, high: 2.9,  typical: 2.5 },
  SA:  { low: 1.8, high: 2.75, typical: 2.0 },
  WA:  { low: 2.0, high: 2.8,  typical: 2.4 },
  TAS: { low: 2.5, high: 3.25, typical: 2.9 },
  NT:  { low: 2.4, high: 2.7,  typical: 2.5 },
  ACT: { low: 1.8, high: 2.25, typical: 2.1 },
};

export const STATE_NAMES: Record<StateCode, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  SA: "South Australia",
  WA: "Western Australia",
  TAS: "Tasmania",
  NT: "the Northern Territory",
  ACT: "the ACT",
};
