import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ANDY_EMAIL } from "@/lib/email";
import { newsletterAudience, renderNewsletter } from "@/lib/mail/newsletter";
import { cancelNewsletter, publishNewsletter, saveNewsletterDraft, sendNewsletterTest } from "@/lib/actions/email-admin";

export const metadata: Metadata = { title: "Newsletter issue" };
export const dynamic = "force-dynamic";

// One issue: write it, preview the HTML and the plain text, send a test to
// an internal inbox, then publish (typed confirmation; only after a test of
// this exact version). After publishing: how its emails are doing.

const field = "mt-1 block w-full rounded-md border border-line-strong bg-white px-2 py-1.5 text-sm text-ink";

export default async function IssuePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/dashboard/login");
  if ((session.user as { role?: string }).role !== "admin") redirect("/dashboard/profile");

  const { id } = await params;
  const q = await searchParams;
  const isNew = id === "new";
  const issue = isNew ? null : await db.newsletterIssue.findUnique({ where: { id } });
  if (!isNew && !issue) redirect("/dashboard/admin/newsletter");
  const editable = isNew || issue?.status === "draft";

  const [audience, stats] = await Promise.all([
    newsletterAudience(),
    issue ? db.emailMessage.groupBy({ by: ["status"], where: { newsletterIssueId: issue.id, stream: "newsletter" }, _count: { _all: true } }) : Promise.resolve([]),
  ]);
  const preview = issue ? renderNewsletter(issue, "https://www.yourpropertyguide.com.au/unsubscribe?t=PREVIEW") : null;
  const testTo = process.env.NEWSLETTER_TEST_TO || ANDY_EMAIL;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard/admin/newsletter" className="text-sm text-ink-muted underline">All issues</Link>
        <h1 className="mt-2 text-2xl font-bold text-ink">{isNew ? "New draft" : issue!.subject}</h1>
        {issue && <p className="mt-1 text-sm text-ink-muted">Status: <strong className="text-ink">{issue.status}</strong>{issue.testSentAt ? ` · test sent to ${issue.testSentTo}` : " · no test of this version yet"}</p>}
        {q.error && <p className="mt-2 rounded-md border border-danger px-3 py-2 text-sm text-danger">{q.error}</p>}
        {q.saved && <p className="mt-2 text-sm text-success">Saved.</p>}
        {q.test && <p className="mt-2 text-sm text-ink">Test: {q.test === "accepted" ? "SendGrid accepted it (check the inbox)." : q.test === "logged" ? "written to the mail log (EMAIL_TRANSPORT=log)." : `status ${q.test}.`}</p>}
        {q.published && <p className="mt-2 text-sm text-success">Published: {q.published} emails queued. The email cron sends them in batches.</p>}
      </div>

      {editable && (
        <form action={saveNewsletterDraft} className="grid gap-3 rounded-xl border border-line bg-white p-4 text-sm lg:grid-cols-2">
          {issue && <input type="hidden" name="id" value={issue.id} />}
          <label className="text-ink-muted">Subject<input name="subject" required maxLength={150} defaultValue={issue?.subject ?? ""} className={field} /></label>
          <label className="text-ink-muted">Preheader (inbox preview)<input name="preheader" maxLength={150} defaultValue={issue?.preheader ?? ""} className={field} /></label>
          <label className="text-ink-muted lg:col-span-2">Heading<input name="heading" required maxLength={150} defaultValue={issue?.heading ?? ""} className={field} /></label>
          <label className="text-ink-muted lg:col-span-2">
            Body (blank line between paragraphs; “## ” for a heading; “- ” for a list; [label](https://…) for a link)
            <textarea name="body" required rows={14} defaultValue={issue?.body ?? ""} className={`${field} font-mono`} />
          </label>
          <label className="text-ink-muted">Button label (optional)<input name="linkLabel" maxLength={60} defaultValue={issue?.linkLabel ?? ""} className={field} /></label>
          <label className="text-ink-muted">Button link (https://…)<input name="linkHref" maxLength={300} defaultValue={issue?.linkHref ?? ""} className={field} /></label>
          <label className="flex items-center gap-2 text-ink"><input type="checkbox" name="showImage" defaultChecked={issue?.showImage ?? true} /> Show the window photograph at the top</label>
          <div className="lg:col-span-2"><button type="submit" className="rounded-md bg-ink px-4 py-2 font-semibold text-white">Save draft</button></div>
        </form>
      )}

      {preview && (
        <section className="grid gap-4 lg:grid-cols-[1fr_24rem]">
          <div>
            <h2 className="mb-2 text-sm font-semibold text-ink-muted">HTML preview (browser rendering, not an email client)</h2>
            <iframe title="Newsletter HTML preview" srcDoc={preview.html} className="h-[720px] w-full rounded-xl border border-line bg-white" sandbox="" />
          </div>
          <div>
            <h2 className="mb-2 text-sm font-semibold text-ink-muted">Plain text</h2>
            <pre className="h-[720px] overflow-auto whitespace-pre-wrap rounded-xl border border-line bg-white p-3 text-xs text-ink">{preview.text}</pre>
          </div>
        </section>
      )}

      {issue && issue.status === "draft" && (
        <section className="grid gap-4 lg:grid-cols-2">
          <form action={sendNewsletterTest} className="space-y-2 rounded-xl border border-line bg-white p-4 text-sm">
            <h2 className="font-semibold text-ink">Send a test</h2>
            <input type="hidden" name="id" value={issue.id} />
            <input name="to" type="email" required defaultValue={testTo} className={field} />
            <p className="text-xs text-ink-subtle">Internal inboxes only. The subject starts [TEST].</p>
            <button type="submit" className="rounded-md border border-line-strong px-3 py-1.5 font-semibold text-ink">Send test</button>
          </form>
          <form action={publishNewsletter} className="space-y-2 rounded-xl border border-line bg-white p-4 text-sm">
            <h2 className="font-semibold text-ink">Publish to {audience.members.length} subscribers</h2>
            <input type="hidden" name="id" value={issue.id} />
            <p className="text-ink-muted">Queues one email per subscriber (with an unsubscribe link and one-click unsubscribe). It can’t be undone once the cron starts sending.</p>
            <input name="confirm" placeholder="Type PUBLISH" className={field} />
            <button type="submit" disabled={!issue.testSentAt} className="rounded-md bg-ink px-3 py-1.5 font-semibold text-white disabled:opacity-40">Publish</button>
          </form>
          <form action={cancelNewsletter} className="text-sm">
            <input type="hidden" name="id" value={issue.id} />
            <button type="submit" className="text-ink-muted underline">Cancel this draft</button>
          </form>
        </section>
      )}

      {issue && issue.status !== "draft" && (
        <section className="rounded-xl border border-line bg-white p-4 text-sm">
          <h2 className="font-semibold text-ink">How it’s going</h2>
          <p className="mt-1 text-ink-muted">
            {stats.length === 0 ? "No emails for this issue." : stats.map((s) => `${s.status}: ${s._count._all}`).join(" · ")}
          </p>
          <p className="mt-1 text-xs text-ink-subtle">Accepted = SendGrid took it. Delivered, bounced and dropped come from the Event Webhook.</p>
        </section>
      )}
    </div>
  );
}
