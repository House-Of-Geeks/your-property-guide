"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { RECORDABLE_STATUSES, type IntroStatus } from "@/lib/introductions/rules";

// The team records what really happened to an introduction (partner
// accepted, appraisal or consultation booked, agreement signed, closed).
// Every change is a LeadEvent with who recorded it, so the funnel report
// counts confirmed outcomes, not clicks. Admins only.

const schema = z.object({
  leadId: z.string().min(5),
  status: z.enum(RECORDABLE_STATUSES as unknown as [IntroStatus, ...IntroStatus[]]),
  note: z.string().trim().max(500).optional(),
  actor: z.enum(["team", "partner"]),
});

export async function recordLeadOutcome(formData: FormData): Promise<void> {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user?.email || role !== "admin") throw new Error("Not authorised");
  const parsed = schema.safeParse({
    leadId: formData.get("leadId"),
    status: formData.get("status"),
    note: formData.get("note") || undefined,
    actor: formData.get("actor") || "team",
  });
  if (!parsed.success) throw new Error("Invalid outcome");
  const { leadId, status, note, actor } = parsed.data;
  const lead = await db.lead.findUnique({ where: { id: leadId }, select: { status: true, kind: true } });
  if (!lead || lead.kind !== "introduction") throw new Error("Not an introduction request");
  if (lead.status === status && !note) return;
  await db.lead.update({ where: { id: leadId }, data: { status, statusReason: note ?? `recorded by ${actor}`, statusAt: new Date() } });
  await db.leadEvent.create({
    data: { leadId, type: "status-changed", actor, detail: { from: lead.status, to: status, note: note ?? null, by: session.user.email } },
  });
  revalidatePath("/dashboard/admin/leads");
}
