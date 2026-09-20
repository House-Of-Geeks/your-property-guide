import type { Metadata } from "next";
import { CostOfSellingStateGuide, costOfSellingMetadata } from "@/components/guide/CostOfSellingStateGuide";

// Content gap 10: the ACT cost-of-selling guide. Copy and numbers live in
// src/lib/data/cost-of-selling-state.ts and src/lib/data/selling-costs.ts.
export const metadata: Metadata = costOfSellingMetadata("ACT");

export default function CostOfSellingAHouseACTPage() {
  return <CostOfSellingStateGuide state="ACT" />;
}
