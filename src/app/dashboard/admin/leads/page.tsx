import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { leadKind } from "@/lib/lead-kinds";
import { RECORDABLE_STATUSES, STATUS_LABELS, type IntroStatus } from "@/lib/introductions/rules";
import { SERVICES, type IntroService } from "@/lib/service-model";
import { recordLeadOutcome } from "@/lib/actions/lead-outcomes";

export const metadata: Metadata = { title: "Leads and outcomes" };
export const dynamic = "force-dynamic";

// The two paths, measured separately (Oct 2026). Learning: guides and plans
// delivered, series opt-ins. Introductions: requested, permission given,
// sent to a partner, held for the team, then the outcomes the team, the
// partner or the customer confirmed. Nothing here counts a click.

const DAYS = 30;

/** The start of the reporting window (a request-time read, outside render purity checks). */
function windowStart(days: number): Date {
  return new Date(Date.now() - days * 86_400_000);
}

export default async function LeadsAdminPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/dashboard/login");
  if ((session.user as { role?: string }).role !== "admin") redirect("/dashboard/profile");

  const since = windowStart(DAYS);
  const [rows, events, intros] = await Promise.all([
    db.lead.findMany({
      where: { createdAt: { gte: since } },
      select: { id: true, type: true, kind: true, marketingConsent: true, sequence: true, introConsent: true, status: true },
    }),
    db.leadEvent.findMany({ where: { createdAt: { gte: since } }, select: { type: true, detail: true, leadId: true } }),
    db.lead.findMany({
      where: { OR: [{ kind: "introduction" }, { type: { in: ["introduction-request", "appraisal-request", "match-request"] } }] },
      orderBy: { createdAt: "desc" },
      take: 60,
      select: {
        id: true, createdAt: true, type: true, service: true, journey: true, firstName: true, lastName: true, suburb: true, state: true,
        preferredContact: true, status: true, statusReason: true, statusAt: true, introConsent: true, source: true,
        events: { orderBy: { createdAt: "desc" }, take: 3, select: { type: true, actor: true, createdAt: true } },
      },
    }),
  ]);

  const byKind = (k: string) => rows.filter((r) => leadKind(r) === k);
  const learning = byKind("learning");
  const introductions = byKind("introduction");
  const count = (list: typeof rows, pred: (r: (typeof rows)[number]) => boolean) => list.filter(pred).length;
  const evCount = (type: string) => events.filter((e) => e.type === type).length;
  const feedback = events.filter((e) => e.type === "feedback").map((e) => (e.detail as { useful?: string } | null)?.useful);

  const tiles: Array<{ group: string; items: Array<[string, number]> }> = [
    {
      group: `Learning, last ${DAYS} days`,
      items: [
        ["Guide downloads", count(learning, (r) => r.type === "guide-download")],
        ["Plans emailed", count(learning, (r) => r.type === "plan-email")],
        ["Joined a tips series", count(learning, (r) => !!r.sequence)],
        ["Series emails sent", evCount("sequence-email")],
        ["Unsubscribed", evCount("unsubscribed")],
      ],
    },
    {
      group: `Introductions, last ${DAYS} days`,
      items: [
        ["Requested", introductions.length],
        ["With permission", count(introductions, (r) => r.introConsent === true || r.type !== "introduction-request")],
        ["Sent to a partner", evCount("delivered")],
        ["Held for the team", count(introductions, (r) => r.status === "held")],
        ["Not introduced", count(introductions, (r) => r.status === "not-introduced")],
      ],
    },
    {
      group: "Confirmed outcomes (all time on these rows)",
      items: [
        ["Partner accepted", intros.filter((r) => r.status === "accepted").length],
        ["Appraisal or consultation booked", intros.filter((r) => r.status === "appointment").length],
        ["Agreement signed", intros.filter((r) => r.status === "signed").length],
        ["Feedback received", feedback.length],
        ["Said it was useful", feedback.filter((u) => u === "yes" || u === "somewhat").length],
      ],
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-ink">Leads and outcomes</h1>
        <p className="text-sm text-ink-muted mt-1">
          Learning requests never go to an agent. Introduction outcomes are recorded here by the team, the partner or the customer, never from a click.
        </p>
      </div>

      {tiles.map((t) => (
        <section key={t.group}>
          <h2 className="text-sm font-semibold text-ink-muted mb-3">{t.group}</h2>
          <dl className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {t.items.map(([label, value]) => (
              <div key={label} className="rounded-xl border border-line bg-white p-4">
                <dt className="text-xs text-ink-muted">{label}</dt>
                <dd className="mt-1 text-2xl font-bold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <section>
        <h2 className="text-lg font-bold text-ink mb-3">Introduction requests</h2>
        <div className="rounded-xl border border-line bg-white divide-y divide-line">
          {intros.length === 0 && <p className="p-4 text-sm text-ink-muted">No introduction requests yet.</p>}
          {intros.map((r) => {
            const service = (r.service as IntroService | null) ?? null;
            const status = (r.status as IntroStatus | null) ?? null;
            return (
              <div key={r.id} className="p-4 grid gap-3 lg:grid-cols-[1fr_auto]">
                <div className="min-w-0 text-sm">
                  <p className="font-semibold text-ink">
                    {r.firstName} {r.lastName ?? ""}
                    <span className="font-normal text-ink-muted">
                      {" · "}
                      {service ? SERVICES[service].label : r.type}
                      {r.suburb ? ` · ${r.suburb}` : r.state ? ` · ${r.state}` : ""}
                      {r.preferredContact ? ` · prefers ${r.preferredContact}` : ""}
                    </span>
                  </p>
                  <p className="text-ink-muted">
                    {r.createdAt.toLocaleString("en-AU", { timeZone: "Australia/Brisbane" })} ·{" "}
                    <strong className="text-ink">{status ? STATUS_LABELS[status] : "No status (older row)"}</strong>
                    {r.statusReason ? ` · ${r.statusReason}` : ""}
                  </p>
                  {r.events.length > 0 && (
                    <p className="text-xs text-ink-subtle mt-1">
                      {r.events.map((e) => `${e.type} (${e.actor})`).join(" ← ")}
                    </p>
                  )}
                </div>
                <form action={recordLeadOutcome} className="flex flex-wrap items-end gap-2">
                  <input type="hidden" name="leadId" value={r.id} />
                  <label className="text-xs text-ink-muted">
                    Outcome
                    <select name="status" defaultValue={status ?? "held"} className="mt-1 block rounded-md border border-line-strong bg-white px-2 py-1.5 text-sm text-ink">
                      {RECORDABLE_STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs text-ink-muted">
                    Confirmed by
                    <select name="actor" defaultValue="team" className="mt-1 block rounded-md border border-line-strong bg-white px-2 py-1.5 text-sm text-ink">
                      <option value="team">Our team</option>
                      <option value="partner">The partner</option>
                    </select>
                  </label>
                  <label className="text-xs text-ink-muted">
                    Note
                    <input name="note" maxLength={500} className="mt-1 block w-40 rounded-md border border-line-strong bg-white px-2 py-1.5 text-sm text-ink" />
                  </label>
                  <button type="submit" className="rounded-md bg-ink text-white px-3 py-1.5 text-sm font-semibold">Save</button>
                </form>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
