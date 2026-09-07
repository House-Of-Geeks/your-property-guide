import Link from "next/link";
import { CommissionCalculator } from "@/components/calculators/CommissionCalculator";
import { STATE_NAMES, STATE_RATES, type StateCode } from "@/lib/data/commission-rates";
import { EXAMPLE_PRICE } from "@/lib/data/selling-costs";

/**
 * The commission calculator at the top of a state commission guide (fix
 * item 8), preset to the state's typical rate and the guide's example price.
 * It imports the calculator; it does not copy it, and it carries no
 * WebApplication schema: /real-estate-commission-calculator keeps its
 * canonical and its schema and is linked as the full tool.
 */
export function CommissionCalculatorEmbed({ state }: { state: StateCode }) {
  const r = STATE_RATES[state];
  const name = STATE_NAMES[state];
  return (
    <>
      <h2 id="calculator">Work out commission on your {state} sale</h2>
      <p>
        Preset to the typical {name} rate of {r.typical}%, with the {r.low}% to{" "}
        {r.high}% range shown against your price. Change any figure; the
        result updates as you type. The{" "}
        <Link href="/real-estate-commission-calculator">full commission calculator</Link>{" "}
        also links to the capital gains tax and stamp duty calculators.
      </p>
      <div className="not-prose my-6">
        <CommissionCalculator initialState={state} initialPrice={EXAMPLE_PRICE[state]} headingLevel="h3" showGuideCta={false} />
      </div>
    </>
  );
}
