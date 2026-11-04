import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { guidanceSeriesEnabled, introCheckInsEnabled } from "@/lib/flags";
import { previewSeries, STALE_START_DAYS } from "@/lib/mail/sequences";
import { addSuppression, requeueEmail } from "@/lib/actions/email-admin";

export const metadata: Metadata = { title: "Email" };
export const dynamic = "force-dynamic";

// What the email system did (21 Oct 2026). "Accepted" is SendGrid taking a
// message; "delivered", "bounced" and "dropped" come only from the signed
// Event Webhook. Ambiguous sends are held, never resent automatically.

const STATUSES = ["queued", "sending", "accepted", "delivered", "deferred", "bounced", "dropped", "failed", "ambiguous", "suppressed"] as const;
const ATTENTION = ["failed", "ambiguous", "bounced", "dropped"];

function since(days: number): Date {
  return new Date(Date.now() - days * 86_400_000);
}

const fmt = (d: Date | null) => (d ? d.toLocaleString("en-AU", { timeZone: "Australia/Brisbane" }) : "");

export default async function EmailAdminPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/dashboard/login");
  if ((session.user as { role?: string }).role !== "admin") redirect("/dashboard/profile");

  const week = since(7);
  const [byStatus, byStream, attention, recent, lastEvent, eventCount, suppressions, suppressionCount, preview] = await Promise.all([
    db.emailMessage.groupBy({ by: ["status"], where: { createdAt: { gte: week } }, _count: { _all: true } }),
    db.emailMessage.groupBy({ by: ["stream", "status"], where: { createdAt: { gte: week } }, _count: { _all: true } }),
    db.emailMessage.findMany({ where: { status: { in: ATTENTION } }, orderBy: { updatedAt: "desc" }, take: 30, select: { id: true, toEmail: true, stream: true, status: true, attempts: true, lastError: true, updatedAt: true } }),
    db.emailMessage.findMany({ orderBy: { createdAt: "desc" }, take: 40, select: { id: true, toEmail: true, stream: true, subject: true, status: true, attempts: true, createdAt: true, acceptedAt: true, deliveredAt: true } }),
    db.emailEvent.findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true, event: true } }),
    db.emailEvent.count({ where: { createdAt: { gte: week } } }),
    db.emailSuppression.findMany({ orderBy: { updatedAt: "desc" }, take: 25 }),
    db.emailSuppression.count(),
    previewSeries(),
  ]);

  const n = (st: string) => byStatus.find((g) => g.status === st)?._count._all ?? 0;
  const streams = [...new Set(byStream.map((g) => g.stream))].sort();
  const cell = (stream: string, st: string) => byStream.find((g) => g.stream === stream && g.status === st)?._count._all ?? 0;
  const webhookConfigured = Boolean(process.env.SENDGRID_WEBHOOK_PUBLIC_KEY);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-ink">Email</h1>
        <p className="mt-1 max-w-3xl text-sm text-ink-muted">
          Every email the site sends, through SendGrid. Accepted means SendGrid took it; delivered, bounced and dropped come from the signed Event Webhook.
          Ambiguous sends (we couldn’t tell whether SendGrid took them) are never resent automatically.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink-muted">Last 7 days</h2>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {STATUSES.map((st) => (
            <div key={st} className={`rounded-xl border bg-white p-4 ${ATTENTION.includes(st) && n(st) > 0 ? "border-danger" : "border-line"}`}>
              <dt className="text-xs capitalize text-ink-muted">{st}</dt>
              <dd className="mt-1 text-2xl font-bold text-ink">{n(st)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-white p-4 text-sm">
          <h2 className="font-semibold text-ink">Delivery events</h2>
          <p className="mt-1 text-ink-muted">
            Webhook key: {webhookConfigured ? "set" : <strong className="text-danger">not set (SENDGRID_WEBHOOK_PUBLIC_KEY): delivery can’t be confirmed</strong>}.
            {" "}Events received in 7 days: {eventCount}. Last: {lastEvent ? `${lastEvent.event}, ${fmt(lastEvent.createdAt)}` : "none yet"}.
          </p>
        </div>
        <div className="rounded-xl border border-line bg-white p-4 text-sm">
          <h2 className="font-semibold text-ink">Guidance series and check-ins</h2>
          <p className="mt-1 text-ink-muted">
            Series: <strong className="text-ink">{guidanceSeriesEnabled() ? "on" : "off"}</strong> (GUIDANCE_SEQUENCE_ENABLED). Check-ins:{" "}
            <strong className="text-ink">{introCheckInsEnabled() ? "on" : "off"}</strong> (INTRO_CHECKIN_ENABLED).
          </p>
          <p className="mt-2 text-ink-muted">
            If switched on today: {preview.dueNow} due; {preview.wouldExpire} would not start (first email due over {STALE_START_DAYS} days ago);{" "}
            {preview.suppressed} suppressed; {preview.duplicatesByAddress} addresses with more than one series (the oldest wins).
          </p>
          {Object.keys(preview.byStep).length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-ink-muted">
              {Object.entries(preview.byStep).map(([k, v]) => (
                <li key={k}>{`${k}: ${v}`}</li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-ink-subtle">At most 50 queued a day, one per address per day; later steps keep the series’ spacing from when they’re sent.</p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-ink">By flow, last 7 days</h2>
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink-muted">
                <th className="p-2">Flow</th>
                {STATUSES.map((st) => (
                  <th key={st} className="p-2 capitalize">{st}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {streams.length === 0 && (
                <tr><td className="p-3 text-ink-muted" colSpan={STATUSES.length + 1}>Nothing sent yet.</td></tr>
              )}
              {streams.map((s) => (
                <tr key={s} className="border-b border-line last:border-0">
                  <td className="p-2 font-medium text-ink">{s}</td>
                  {STATUSES.map((st) => (
                    <td key={st} className="p-2 text-ink-muted">{cell(s, st) || ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-ink">Needs a look</h2>
        <div className="divide-y divide-line rounded-xl border border-line bg-white">
          {attention.length === 0 && <p className="p-4 text-sm text-ink-muted">Nothing failed, bounced, dropped or ambiguous.</p>}
          {attention.map((m) => (
            <div key={m.id} className="grid gap-2 p-4 text-sm lg:grid-cols-[1fr_auto]">
              <div className="min-w-0">
                <p className="font-semibold text-ink">
                  {m.toEmail} <span className="font-normal text-ink-muted">· {m.stream} · {m.status} · {m.attempts} attempt{m.attempts === 1 ? "" : "s"} · {fmt(m.updatedAt)}</span>
                </p>
                {m.lastError && <p className="mt-1 break-words text-xs text-ink-subtle">{m.lastError}</p>}
              </div>
              {(m.status === "ambiguous" || m.status === "failed") && (
                <form action={requeueEmail}>
                  <input type="hidden" name="id" value={m.id} />
                  <button type="submit" className="rounded-md border border-line-strong px-3 py-1.5 text-sm font-semibold text-ink" title="Only after checking it wasn't delivered (SendGrid activity)">
                    Send again
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-ink">Recent</h2>
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink-muted">
                <th className="p-2">Queued</th><th className="p-2">To</th><th className="p-2">Flow</th><th className="p-2">Subject</th><th className="p-2">Status</th><th className="p-2">Accepted</th><th className="p-2">Delivered</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((m) => (
                <tr key={m.id} className="border-b border-line last:border-0 align-top">
                  <td className="whitespace-nowrap p-2 text-ink-muted">{fmt(m.createdAt)}</td>
                  <td className="p-2 text-ink">{m.toEmail}</td>
                  <td className="p-2 text-ink-muted">{m.stream}</td>
                  <td className="p-2 text-ink">{m.subject}</td>
                  <td className="p-2 font-medium text-ink">{m.status}{m.attempts > 1 ? ` (${m.attempts})` : ""}</td>
                  <td className="whitespace-nowrap p-2 text-ink-muted">{fmt(m.acceptedAt)}</td>
                  <td className="whitespace-nowrap p-2 text-ink-muted">{fmt(m.deliveredAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div>
          <h2 className="mb-3 text-lg font-bold text-ink">Suppressed addresses ({suppressionCount})</h2>
          <div className="divide-y divide-line rounded-xl border border-line bg-white text-sm">
            {suppressions.length === 0 && <p className="p-4 text-ink-muted">None.</p>}
            {suppressions.map((s) => (
              <p key={s.id} className="p-3 text-ink">
                {s.email} <span className="text-ink-muted">· {s.scope} · {s.reason} · {s.source} · {fmt(s.updatedAt)}</span>
              </p>
            ))}
          </div>
        </div>
        <form action={addSuppression} className="h-fit space-y-2 rounded-xl border border-line bg-white p-4 text-sm">
          <h2 className="font-semibold text-ink">Stop email to an address</h2>
          <input name="email" type="email" required placeholder="name@example.com" className="block w-full rounded-md border border-line-strong bg-white px-2 py-1.5" />
          <select name="scope" defaultValue="marketing" className="block w-full rounded-md border border-line-strong bg-white px-2 py-1.5">
            <option value="marketing">Marketing only (series, newsletter)</option>
            <option value="all">Everything</option>
          </select>
          <input name="note" maxLength={300} placeholder="Why (optional)" className="block w-full rounded-md border border-line-strong bg-white px-2 py-1.5" />
          <button type="submit" className="rounded-md bg-ink px-3 py-1.5 font-semibold text-white">Suppress</button>
        </form>
      </section>
    </div>
  );
}
