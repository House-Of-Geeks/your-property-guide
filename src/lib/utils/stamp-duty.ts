export type AustralianState = "QLD" | "NSW" | "VIC" | "WA" | "SA" | "TAS" | "NT" | "ACT";

export interface StampDutyResult {
  transferDuty: number;
  foreignSurcharge: number;
  total: number;
  effectiveRate: number;
  concessionApplied: boolean;
  concessionAmount: number;
  notes: string[];
}

// ─── Bracket helper ──────────────────────────────────────────────────────────

interface Bracket {
  min: number;
  max: number;
  /** flat $ amount for bracket base */
  base: number;
  /** marginal rate as a decimal (e.g. 0.035) */
  rate: number;
}

function calcFromBrackets(price: number, brackets: Bracket[]): number {
  for (const b of brackets) {
    if (price > b.min && price <= b.max) {
      return b.base + (price - b.min) * b.rate;
    }
  }
  return 0;
}

// ─── QLD ─────────────────────────────────────────────────────────────────────

const QLD_BRACKETS: Bracket[] = [
  { min: 0,         max: 5_000,     base: 0,        rate: 0 },
  { min: 5_000,     max: 75_000,    base: 0,        rate: 0.015 },
  { min: 75_000,    max: 540_000,   base: 1_050,    rate: 0.035 },
  { min: 540_000,   max: 1_000_000, base: 17_325,   rate: 0.045 },
  { min: 1_000_000, max: Infinity,  base: 38_025,   rate: 0.0575 },
];

function calcQLD(
  price: number,
  isFirstHome: boolean,
  isForeign: boolean,
  isInvestment: boolean
): StampDutyResult {
  const transferDuty = calcFromBrackets(price, QLD_BRACKETS);

  let concessionAmount = 0;
  const notes: string[] = [];

  if (isFirstHome && !isForeign && !isInvestment) {
    if (price <= 700_000) {
      concessionAmount = transferDuty;
    } else if (price < 800_000) {
      const ratio = (800_000 - price) / (800_000 - 700_000);
      concessionAmount = transferDuty * ratio;
    }
    if (concessionAmount > 0) {
      notes.push("QLD First Home Buyer concession applied. Full concession up to $700,000, phased out to $800,000.");
    }
  }

  const foreignSurcharge = isForeign ? price * 0.08 : 0;
  if (isForeign) notes.push("Foreign buyer surcharge of 8% applies.");

  const dutyAfterConcession = Math.max(0, transferDuty - concessionAmount);
  const total = dutyAfterConcession + foreignSurcharge;
  const effectiveRate = price > 0 ? (total / price) * 100 : 0;

  return {
    transferDuty: Math.round(transferDuty),
    foreignSurcharge: Math.round(foreignSurcharge),
    total: Math.round(total),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    concessionApplied: concessionAmount > 0,
    concessionAmount: Math.round(concessionAmount),
    notes,
  };
}

// ─── NSW ─────────────────────────────────────────────────────────────────────

const NSW_BRACKETS: Bracket[] = [
  { min: 0,           max: 17_000,      base: 0,         rate: 0.0125 },
  { min: 17_000,      max: 35_000,      base: 212,       rate: 0.015 },
  { min: 35_000,      max: 92_000,      base: 482,       rate: 0.0175 },
  { min: 92_000,      max: 304_000,     base: 1_477,     rate: 0.035 },
  { min: 304_000,     max: 1_013_000,   base: 8_897,     rate: 0.045 },
  { min: 1_013_000,   max: 3_040_000,   base: 40_805,    rate: 0.055 },
  { min: 3_040_000,   max: Infinity,    base: 152_285,   rate: 0.07 },
];

function calcNSW(
  price: number,
  isFirstHome: boolean,
  isForeign: boolean,
  isInvestment: boolean
): StampDutyResult {
  const transferDuty = calcFromBrackets(price, NSW_BRACKETS);

  let concessionAmount = 0;
  const notes: string[] = [];

  if (isFirstHome && !isForeign && !isInvestment) {
    if (price <= 800_000) {
      concessionAmount = transferDuty;
      notes.push("NSW First Home Buyer: full transfer duty exemption for properties up to $800,000.");
    } else if (price <= 1_000_000) {
      // Sliding scale: concession tapers linearly from full at $800k to $0 at $1m
      const ratio = (1_000_000 - price) / (1_000_000 - 800_000);
      concessionAmount = transferDuty * ratio;
      notes.push("NSW First Home Buyer: partial concession (sliding scale $800,001–$1,000,000).");
    }
  }

  const foreignSurcharge = isForeign ? price * 0.08 : 0;
  if (isForeign) notes.push("NSW foreign buyer surcharge of 8% applies.");

  const dutyAfterConcession = Math.max(0, transferDuty - concessionAmount);
  const total = dutyAfterConcession + foreignSurcharge;
  const effectiveRate = price > 0 ? (total / price) * 100 : 0;

  return {
    transferDuty: Math.round(transferDuty),
    foreignSurcharge: Math.round(foreignSurcharge),
    total: Math.round(total),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    concessionApplied: concessionAmount > 0,
    concessionAmount: Math.round(concessionAmount),
    notes,
  };
}

// ─── VIC ─────────────────────────────────────────────────────────────────────

const VIC_BRACKETS: Bracket[] = [
  { min: 0,       max: 25_000,   base: 0,        rate: 0.014 },
  { min: 25_000,  max: 130_000,  base: 350,      rate: 0.024 },
  { min: 130_000, max: 960_000,  base: 2_870,    rate: 0.06 },
  { min: 960_000, max: Infinity, base: 55_370,   rate: 0.065 },
];

function calcVIC(
  price: number,
  isFirstHome: boolean,
  isForeign: boolean,
  isInvestment: boolean
): StampDutyResult {
  const transferDuty = calcFromBrackets(price, VIC_BRACKETS);

  let concessionAmount = 0;
  const notes: string[] = [];

  if (isFirstHome && !isForeign && !isInvestment) {
    if (price <= 600_000) {
      concessionAmount = transferDuty;
      notes.push("VIC First Home Buyer: full land transfer duty exemption for properties up to $600,000.");
    } else if (price <= 750_000) {
      const ratio = (750_000 - price) / (750_000 - 600_000);
      concessionAmount = transferDuty * ratio;
      notes.push("VIC First Home Buyer: partial concession (sliding scale $600,001–$750,000).");
    }
  }

  const foreignSurcharge = isForeign ? price * 0.08 : 0;
  if (isForeign) notes.push("VIC foreign buyer additional duty of 8% applies.");

  const dutyAfterConcession = Math.max(0, transferDuty - concessionAmount);
  const total = dutyAfterConcession + foreignSurcharge;
  const effectiveRate = price > 0 ? (total / price) * 100 : 0;

  return {
    transferDuty: Math.round(transferDuty),
    foreignSurcharge: Math.round(foreignSurcharge),
    total: Math.round(total),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    concessionApplied: concessionAmount > 0,
    concessionAmount: Math.round(concessionAmount),
    notes,
  };
}

// ─── WA ──────────────────────────────────────────────────────────────────────

const WA_BRACKETS: Bracket[] = [
  { min: 0,       max: 120_000,  base: 0,        rate: 0.019 },
  { min: 120_000, max: 150_000,  base: 2_280,    rate: 0.0285 },
  { min: 150_000, max: 360_000,  base: 3_135,    rate: 0.038 },
  { min: 360_000, max: 725_000,  base: 11_115,   rate: 0.0475 },
  { min: 725_000, max: Infinity, base: 28_453,   rate: 0.0515 },
];

function calcWA(
  price: number,
  isFirstHome: boolean,
  isForeign: boolean,
  isInvestment: boolean
): StampDutyResult {
  const transferDuty = calcFromBrackets(price, WA_BRACKETS);

  let concessionAmount = 0;
  const notes: string[] = [];

  if (isFirstHome && !isForeign && !isInvestment) {
    if (price <= 450_000) {
      concessionAmount = transferDuty;
      notes.push("WA First Home Buyer: full transfer duty exemption for properties up to $450,000.");
    } else if (price <= 600_000) {
      const ratio = (600_000 - price) / (600_000 - 450_000);
      concessionAmount = transferDuty * ratio;
      notes.push("WA First Home Buyer: partial concession (sliding scale $450,001–$600,000).");
    }
  }

  const foreignSurcharge = isForeign ? price * 0.07 : 0;
  if (isForeign) notes.push("WA foreign buyer surcharge of 7% applies.");

  const dutyAfterConcession = Math.max(0, transferDuty - concessionAmount);
  const total = dutyAfterConcession + foreignSurcharge;
  const effectiveRate = price > 0 ? (total / price) * 100 : 0;

  return {
    transferDuty: Math.round(transferDuty),
    foreignSurcharge: Math.round(foreignSurcharge),
    total: Math.round(total),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    concessionApplied: concessionAmount > 0,
    concessionAmount: Math.round(concessionAmount),
    notes,
  };
}

// ─── SA ──────────────────────────────────────────────────────────────────────

const SA_BRACKETS: Bracket[] = [
  { min: 0,       max: 12_000,   base: 0,        rate: 0.01 },
  { min: 12_000,  max: 30_000,   base: 120,      rate: 0.02 },
  { min: 30_000,  max: 50_000,   base: 480,      rate: 0.03 },
  { min: 50_000,  max: 100_000,  base: 1_080,    rate: 0.035 },
  { min: 100_000, max: 200_000,  base: 2_830,    rate: 0.04 },
  { min: 200_000, max: 250_000,  base: 6_830,    rate: 0.0425 },
  { min: 250_000, max: 300_000,  base: 8_955,    rate: 0.0475 },
  { min: 300_000, max: 500_000,  base: 11_330,   rate: 0.05 },
  { min: 500_000, max: Infinity, base: 21_330,   rate: 0.055 },
];

function calcSA(
  price: number,
  isFirstHome: boolean,
  isForeign: boolean,
  _isInvestment: boolean
): StampDutyResult {
  const transferDuty = calcFromBrackets(price, SA_BRACKETS);
  const notes: string[] = [];

  if (isFirstHome) {
    notes.push("SA does not offer a stamp duty concession for first home buyers. A separate First Home Owner Grant may be available — visit revenue.sa.gov.au for details.");
  }

  const foreignSurcharge = isForeign ? price * 0.07 : 0;
  if (isForeign) notes.push("SA foreign buyer surcharge of 7% applies.");

  const total = transferDuty + foreignSurcharge;
  const effectiveRate = price > 0 ? (total / price) * 100 : 0;

  return {
    transferDuty: Math.round(transferDuty),
    foreignSurcharge: Math.round(foreignSurcharge),
    total: Math.round(total),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    concessionApplied: false,
    concessionAmount: 0,
    notes,
  };
}

// ─── TAS ─────────────────────────────────────────────────────────────────────

const TAS_BRACKETS: Bracket[] = [
  { min: 3_000,    max: 25_000,   base: 0,          rate: 0.0175 },
  { min: 25_000,   max: 75_000,   base: 437.5,      rate: 0.0225 },
  { min: 75_000,   max: 200_000,  base: 1_562.5,    rate: 0.035 },
  { min: 200_000,  max: 375_000,  base: 5_937.5,    rate: 0.04 },
  { min: 375_000,  max: 725_000,  base: 12_937.5,   rate: 0.0425 },
  { min: 725_000,  max: Infinity, base: 27_812.5,   rate: 0.045 },
];

function calcTAS(
  price: number,
  isFirstHome: boolean,
  isForeign: boolean,
  isInvestment: boolean
): StampDutyResult {
  const baseDuty = price <= 3_000 ? 0 : calcFromBrackets(price, TAS_BRACKETS);

  let concessionAmount = 0;
  const notes: string[] = [];

  if (isFirstHome && !isForeign && !isInvestment) {
    concessionAmount = baseDuty * 0.5;
    notes.push("TAS First Home Buyer: 50% concession on stamp duty payable.");
  }

  const foreignSurcharge = isForeign ? price * 0.08 : 0;
  if (isForeign) notes.push("TAS foreign buyer surcharge of 8% applies.");

  const dutyAfterConcession = Math.max(0, baseDuty - concessionAmount);
  const total = dutyAfterConcession + foreignSurcharge;
  const effectiveRate = price > 0 ? (total / price) * 100 : 0;

  return {
    transferDuty: Math.round(baseDuty),
    foreignSurcharge: Math.round(foreignSurcharge),
    total: Math.round(total),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    concessionApplied: concessionAmount > 0,
    concessionAmount: Math.round(concessionAmount),
    notes,
  };
}

// ─── NT ──────────────────────────────────────────────────────────────────────

function calcNT(
  price: number,
  isFirstHome: boolean,
  isForeign: boolean,
  _isInvestment: boolean
): StampDutyResult {
  const notes: string[] = [];
  let transferDuty: number;

  if (price <= 525_000) {
    const V = price / 1000;
    transferDuty = (0.06571441 * V * V + 15 * V) * 0.01;
  } else if (price <= 3_000_000) {
    transferDuty = 28_928 + (price - 525_000) * 0.0495;
  } else {
    // Cap at top bracket for display
    transferDuty = 28_928 + (3_000_000 - 525_000) * 0.0495;
    notes.push("For properties over $3,000,000 in the NT, please contact the NT Revenue Office for an exact calculation.");
  }

  if (isFirstHome) {
    notes.push("NT First Home Owner Grant of $10,000 may be available for new or substantially renovated homes. This is a separate grant, not a stamp duty exemption.");
  }

  // NT has no foreign buyer surcharge
  if (isForeign) {
    notes.push("The NT does not apply a foreign buyer surcharge.");
  }

  const total = transferDuty;
  const effectiveRate = price > 0 ? (total / price) * 100 : 0;

  return {
    transferDuty: Math.round(transferDuty),
    foreignSurcharge: 0,
    total: Math.round(total),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    concessionApplied: false,
    concessionAmount: 0,
    notes,
  };
}

// ─── ACT ─────────────────────────────────────────────────────────────────────

const ACT_BRACKETS: Bracket[] = [
  { min: 0,           max: 200_000,   base: 0,        rate: 0.02 },
  { min: 200_000,     max: 300_000,   base: 4_000,    rate: 0.035 },
  { min: 300_000,     max: 500_000,   base: 7_500,    rate: 0.04 },
  { min: 500_000,     max: 750_000,   base: 15_500,   rate: 0.05 },
  { min: 750_000,     max: 1_000_000, base: 28_000,   rate: 0.065 },
  { min: 1_000_000,   max: 1_455_000, base: 44_250,   rate: 0.07 },
  { min: 1_455_000,   max: Infinity,  base: 76_150,   rate: 0.0454 },
];

function calcACT(
  price: number,
  isFirstHome: boolean,
  isForeign: boolean,
  _isInvestment: boolean
): StampDutyResult {
  const transferDuty = calcFromBrackets(price, ACT_BRACKETS);
  const notes: string[] = [];

  if (isFirstHome) {
    notes.push("ACT Home Buyer Concession Scheme may provide a full duty exemption for eligible first home buyers with household income below the threshold. This is income-tested — visit act.gov.au for eligibility details.");
  }

  // ACT has no foreign buyer surcharge
  if (isForeign) {
    notes.push("The ACT does not apply a foreign buyer surcharge.");
  }

  const effectiveRate = price > 0 ? (transferDuty / price) * 100 : 0;

  return {
    transferDuty: Math.round(transferDuty),
    foreignSurcharge: 0,
    total: Math.round(transferDuty),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    concessionApplied: false,
    concessionAmount: 0,
    notes,
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function calculateStampDuty(
  purchasePrice: number,
  state: AustralianState,
  isFirstHomeBuyer: boolean,
  isForeignBuyer: boolean,
  isInvestment: boolean
): StampDutyResult {
  switch (state) {
    case "QLD": return calcQLD(purchasePrice, isFirstHomeBuyer, isForeignBuyer, isInvestment);
    case "NSW": return calcNSW(purchasePrice, isFirstHomeBuyer, isForeignBuyer, isInvestment);
    case "VIC": return calcVIC(purchasePrice, isFirstHomeBuyer, isForeignBuyer, isInvestment);
    case "WA":  return calcWA(purchasePrice, isFirstHomeBuyer, isForeignBuyer, isInvestment);
    case "SA":  return calcSA(purchasePrice, isFirstHomeBuyer, isForeignBuyer, isInvestment);
    case "TAS": return calcTAS(purchasePrice, isFirstHomeBuyer, isForeignBuyer, isInvestment);
    case "NT":  return calcNT(purchasePrice, isFirstHomeBuyer, isForeignBuyer, isInvestment);
    case "ACT": return calcACT(purchasePrice, isFirstHomeBuyer, isForeignBuyer, isInvestment);
  }
}

// ─── Legacy single-object signature (backward compat) ────────────────────────

export interface StampDutyInput {
  purchasePrice: number;
  isFirstHomeBuyer: boolean;
  isForeignBuyer: boolean;
  isInvestment: boolean;
  /** defaults to QLD */
  state?: AustralianState;
}

/** @deprecated Prefer calling calculateStampDuty() with explicit parameters */
export function calculateStampDutyLegacy(input: StampDutyInput): {
  transferDuty: number;
  foreignBuyerSurcharge: number;
  totalDuty: number;
  firstHomeConcession: number;
  effectiveRate: number;
} {
  const result = calculateStampDuty(
    input.purchasePrice,
    input.state ?? "QLD",
    input.isFirstHomeBuyer,
    input.isForeignBuyer,
    input.isInvestment
  );
  return {
    transferDuty: result.transferDuty,
    foreignBuyerSurcharge: result.foreignSurcharge,
    totalDuty: result.total,
    firstHomeConcession: result.concessionAmount,
    effectiveRate: result.effectiveRate,
  };
}
