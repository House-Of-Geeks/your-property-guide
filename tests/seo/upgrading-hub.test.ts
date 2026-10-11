// /upgrading's stamp duty figures were typed in and two were off (NSW $1.5m
// "$66,000", QLD $1m "$34,000"). They now match the stamp duty engine, which
// the state revenue offices' rates feed (verified 30 Sep 2026); this keeps them
// in step when the engine moves.
import { describe, expect, it } from "vitest";
import { PERSONA_HUB_CONTENT } from "@/lib/persona-hub-content";
import { calculateStampDuty, type AustralianState } from "@/lib/utils/stamp-duty";

const k = (n: number) => `$${(Math.round(n / 1_000) * 1_000).toLocaleString("en-AU")}`;
const duty = (state: AustralianState, price: number) => calculateStampDuty(price, state, false, false, false).total;

describe("/upgrading stamp duty figures", () => {
  const hub = PERSONA_HUB_CONTENT.upgrading;
  const deep = hub.deepDive.paragraphs.find((p) => p.startsWith("Stamp duty on the next home"))!;
  const faq = hub.faqs.find((f) => f.question === "How much stamp duty will I pay when upgrading?")!.answer;

  it("match the engine, rounded to $1,000", () => {
    expect(deep).toContain(`around ${k(duty("NSW", 1_500_000))}`);
    expect(deep).toContain(`about ${k(duty("VIC", 1_000_000))}`);
    expect(faq).toContain(`NSW costs around ${k(duty("NSW", 1_000_000))}`);
    expect(faq).toContain(`VIC around ${k(duty("VIC", 1_000_000))}`);
    expect(faq).toContain(`QLD around ${k(duty("QLD", 1_000_000))}`);
    expect(faq).toContain(`WA around ${k(duty("WA", 1_000_000))}`);
  });
});
