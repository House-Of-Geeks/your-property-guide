import type { Metadata } from "next";
import { StampDutyStateGuide, stampDutyMetadata } from "@/components/guide/StampDutyStateGuide";

// Item 20: the TAS stamp duty guide, calculator first. Copy lives in
// src/lib/data/stamp-duty-state.ts; every figure comes from src/lib/utils/stamp-duty.ts.
export const metadata: Metadata = stampDutyMetadata("TAS");

export default function StampDutyTASPage() {
  return <StampDutyStateGuide state="TAS" />;
}
