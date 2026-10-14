import { describe, expect, it } from "vitest";
import { safeAnalyticsProps } from "@/lib/analytics-props";

describe("safeAnalyticsProps: nothing personal reaches analytics", () => {
  it("keeps only the allowed keys", () => {
    const out = safeAnalyticsProps({ journey: "selling", status: "sent", ...({ email: "a@b.com", firstName: "Jane", message: "hello" } as object) });
    expect(out).toEqual({ journey: "selling", status: "sent" });
  });

  it("drops values that look like an email address or a phone number, even under an allowed key", () => {
    expect(safeAnalyticsProps({ placement: "jane@example.com" })).toEqual({});
    expect(safeAnalyticsProps({ placement: "jane%40example.com" })).toEqual({});
    expect(safeAnalyticsProps({ placement: "0491 570 156" })).toEqual({});
    expect(safeAnalyticsProps({ placement: "+61491570156" })).toEqual({});
  });

  it("trims long values and skips empty ones", () => {
    expect(safeAnalyticsProps({ placement: "x".repeat(100), stage: "", state: null }).placement).toHaveLength(60);
    expect(safeAnalyticsProps({ stage: "" })).toEqual({});
  });
});
