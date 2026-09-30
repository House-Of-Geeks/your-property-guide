import type { Metadata } from "next";
import { StampDutyStateGuide, stampDutyMetadata } from "@/components/guide/StampDutyStateGuide";

// Item 20: the NSW stamp duty guide, calculator first. Copy lives in
// src/lib/data/stamp-duty-state.ts; every figure comes from src/lib/utils/stamp-duty.ts.
export const metadata: Metadata = stampDutyMetadata("NSW");

export default function StampDutyNSWPage() {
  return <StampDutyStateGuide state="NSW" />;
}
