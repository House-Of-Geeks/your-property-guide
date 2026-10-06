// Monthly principal-and-interest repayment, shared by the bridging and Help
// to Buy calculators so both print the same figure for the same loan.
export function monthlyRepayment(principal: number, ratePct: number, termYears: number): number {
  if (principal <= 0 || termYears <= 0) return 0;
  const n = termYears * 12;
  const i = ratePct / 100 / 12;
  if (i === 0) return Math.round(principal / n);
  return Math.round((principal * i) / (1 - Math.pow(1 + i, -n)));
}
