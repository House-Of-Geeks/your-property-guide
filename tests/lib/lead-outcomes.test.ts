import { describe, it, expect, vi, beforeEach } from "vitest";

const m = vi.hoisted(() => ({ auth: vi.fn(), findUnique: vi.fn(), update: vi.fn(), eventCreate: vi.fn(), revalidate: vi.fn() }));
vi.mock("@/auth", () => ({ auth: m.auth }));
vi.mock("next/cache", () => ({ revalidatePath: m.revalidate }));
vi.mock("@/lib/db", () => ({ db: { lead: { findUnique: m.findUnique, update: m.update }, leadEvent: { create: m.eventCreate } } }));

import { recordLeadOutcome } from "@/lib/actions/lead-outcomes";

const form = (o: Record<string, string>) => {
  const f = new FormData();
  Object.entries(o).forEach(([k, v]) => f.set(k, v));
  return f;
};

beforeEach(() => {
  Object.values(m).forEach((f) => f.mockReset());
  m.auth.mockResolvedValue({ user: { email: "andy@example.com", role: "admin" } });
  m.findUnique.mockResolvedValue({ status: "sent", kind: "introduction" });
});

describe("recording an introduction's outcome", () => {
  it("records who confirmed it, as an event, and moves the status", async () => {
    await recordLeadOutcome(form({ leadId: "lead_12345", status: "appointment", actor: "partner", note: "Appraisal Tuesday" }));
    expect(m.update).toHaveBeenCalledWith({ where: { id: "lead_12345" }, data: expect.objectContaining({ status: "appointment", statusReason: "Appraisal Tuesday" }) });
    expect(m.eventCreate).toHaveBeenCalledWith({
      data: { leadId: "lead_12345", type: "status-changed", actor: "partner", detail: { from: "sent", to: "appointment", note: "Appraisal Tuesday", by: "andy@example.com" } },
    });
  });

  it("is for admins only", async () => {
    m.auth.mockResolvedValueOnce({ user: { email: "agent@example.com", role: "agent" } });
    await expect(recordLeadOutcome(form({ leadId: "lead_12345", status: "signed", actor: "team" }))).rejects.toThrow("Not authorised");
    expect(m.update).not.toHaveBeenCalled();
  });

  it("only applies to introduction requests, with known statuses", async () => {
    m.findUnique.mockResolvedValueOnce({ status: null, kind: "learning" });
    await expect(recordLeadOutcome(form({ leadId: "lead_12345", status: "signed", actor: "team" }))).rejects.toThrow();
    await expect(recordLeadOutcome(form({ leadId: "lead_12345", status: "made-up", actor: "team" }))).rejects.toThrow("Invalid outcome");
  });
});
