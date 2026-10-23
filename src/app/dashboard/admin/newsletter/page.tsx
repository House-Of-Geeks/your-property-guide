import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { newsletterAudience } from "@/lib/mail/newsletter";

export const metadata: Metadata = { title: "Newsletter" };
export const dynamic = "force-dynamic";

// The newsletter (21 Oct 2026): drafts, tests and published issues. No
// schedule is promised to subscribers; an issue goes when it's published.

export default async function NewsletterAdminPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/dashboard/login");
  if ((session.user as { role?: string }).role !== "admin") redirect("/dashboard/profile");

  const [issues, audience] = await Promise.all([
    db.newsletterIssue.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    newsletterAudience(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Newsletter</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-muted">
            Consented audience today: <strong className="text-ink">{audience.members.length}</strong> subscribers (newsletter signups, one per address,
            not unsubscribed){audience.excluded.suppressed ? `; ${audience.excluded.suppressed} suppressed` : ""}. Guide, plan and introduction contacts are not included.
          </p>
        </div>
        <Link href="/dashboard/admin/newsletter/new" className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">New draft</Link>
      </div>
      <div className="divide-y divide-line rounded-xl border border-line bg-white">
        {issues.length === 0 && <p className="p-4 text-sm text-ink-muted">No issues yet.</p>}
        {issues.map((i) => (
          <Link key={i.id} href={`/dashboard/admin/newsletter/${i.id}`} className="block p-4 text-sm hover:bg-surface-sunken">
            <span className="font-semibold text-ink">{i.subject}</span>
            <span className="text-ink-muted">
              {" · "}{i.status}
              {i.publishedAt ? ` · published ${i.publishedAt.toLocaleString("en-AU", { timeZone: "Australia/Brisbane" })} to ${i.audienceSize ?? 0}` : ""}
              {i.status === "draft" && i.testSentAt ? " · test sent" : ""}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
