export interface StampDutyInput {
  purchasePrice: number;
  isFirstHomeBuyer: boolean;
  isForeignBuyer: boolean;
  isInvestment: boolean;
}

export interface StampDutyResult {
  transferDuty: number;
  foreignBuyerSurcharge: number;
  totalDuty: number;
  firstHomeConcession: number;
  effectiveRate: number;
}

// QLD 2025-2026 transfer duty brackets
const QLD_BRACKETS = [
  { min: 0, max: 5_000, rate: 0, base: 0 },
  { min: 5_000, max: 75_000, rate: 0.015, base: 0 },
  { min: 75_000, max: 540_000, rate: 0.035, base: 1_050 },
  { min: 540_000, max: 1_000_000, rate: 0.045, base: 17_325 },
  { min: 1_000_000, max: Infinity, rate: 0.0575, base: 38_025 },
];

// QLD first home concession: full concession up to $700K, phased out to $800K
const FIRST_HOME_THRESHOLD = 700_000;
const FIRST_HOME_PHASE_OUT = 800_000;

// Foreign buyer surcharge: 8% of dutiable value
const FOREIGN_BUYER_SURCHARGE_RATE = 0.08;

export function calculateStampDuty(input: StampDutyInput): StampDutyResult {
  const { purchasePrice, isFirstHomeBuyer, isForeignBuyer } = input;

  // Calculate base transfer duty
  let transferDuty = 0;
  for (const bracket of QLD_BRACKETS) {
    if (purchasePrice > bracket.min) {
      if (purchasePrice <= bracket.max) {
        transferDuty = bracket.base + (purchasePrice - bracket.min) * bracket.rate;
        break;
      }
    }
  }

  // First home buyer concession (home, not investment, not foreign)
  let firstHomeConcession = 0;
  if (isFirstHomeBuyer && !isForeignBuyer && !input.isInvestment) {
    if (purchasePrice <= FIRST_HOME_THRESHOLD) {
      firstHomeConcession = transferDuty; // Full concession
    } else if (purchasePrice < FIRST_HOME_PHASE_OUT) {
      // Phased reduction
      const ratio =
        (FIRST_HOME_PHASE_OUT - purchasePrice) /
        (FIRST_HOME_PHASE_OUT - FIRST_HOME_THRESHOLD);
      firstHomeConcession = transferDuty * ratio;
    }
  }

  // Foreign buyer surcharge
  const foreignBuyerSurcharge = isForeignBuyer
    ? purchasePrice * FOREIGN_BUYER_SURCHARGE_RATE
    : 0;

  const totalDuty = transferDuty - firstHomeConcession + foreignBuyerSurcharge;
  const effectiveRate = purchasePrice > 0 ? (totalDuty / purchasePrice) * 100 : 0;

  return {
    transferDuty: Math.round(transferDuty),
    foreignBuyerSurcharge: Math.round(foreignBuyerSurcharge),
    totalDuty: Math.round(totalDuty),
    firstHomeConcession: Math.round(firstHomeConcession),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
  };
}
