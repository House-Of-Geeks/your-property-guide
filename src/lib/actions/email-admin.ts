"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { requeue, sendQueuedNow } from "@/lib/mail/queue";
import { suppress, normaliseEmail } from "@/lib/mail/suppression";
import { publishIssue, sendTest } from "@/lib/mail/newsletter";

// Admin actions for the email system and the newsletter (21 Oct 2026).
// Admins only; every change is attributable to the signed-in user.

async function admin(): Promise<string> {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user?.email || role !== "admin") throw new Error("Not authorised");
  return session.user.email;
}

/** Put an ambiguous or failed email back in the queue, after checking it wasn't delivered. */
export async function requeueEmail(formData: FormData): Promise<void> {
  await admin();
  const id = String(formData.get("id") ?? "");
  if (id && (await requeue(id))) await sendQueuedNow(id).catch(() => {});
  revalidatePath("/dashboard/admin/email");
}

const suppressSchema = z.object({ email: z.string().trim().email().max(200), scope: z.enum(["marketing", "all"]), note: z.string().trim().max(300).optional() });

/** Stop email to an address by hand (someone asked by phone or reply). */
export async function addSuppression(formData: FormData): Promise<void> {
  const by = await admin();
  const parsed = suppressSchema.safeParse({ email: formData.get("email"), scope: formData.get("scope"), note: formData.get("note") || undefined });
  if (!parsed.success) throw new Error("Invalid suppression");
  await suppress(parsed.data.email, parsed.data.scope, "manual", "admin", `${by}${parsed.data.note ? `: ${parsed.data.note}` : ""}`);
  revalidatePath("/dashboard/admin/email");
}

// ---------------------------------------------------------------- newsletter

const issueSchema = z.object({
  subject: z.string().trim().min(3).max(150),
  preheader: z.string().trim().max(150).optional(),
  heading: z.string().trim().min(3).max(150),
  body: z.string().trim().min(20).max(20_000),
  linkLabel: z.string().trim().max(60).optional(),
  linkHref: z.string().trim().max(300).regex(/^https:\/\//, "Links must start with https://").optional(),
  showImage: z.boolean(),
});

function readIssue(formData: FormData) {
  const opt = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" && v.trim() ? v : undefined;
  };
  return issueSchema.safeParse({
    subject: formData.get("subject"),
    preheader: opt("preheader"),
    heading: formData.get("heading"),
    body: formData.get("body"),
    linkLabel: opt("linkLabel"),
    linkHref: opt("linkHref"),
    showImage: formData.get("showImage") === "on",
  });
}

export async function saveNewsletterDraft(formData: FormData): Promise<void> {
  const by = await admin();
  const id = typeof formData.get("id") === "string" ? String(formData.get("id")) : "";
  const parsed = readIssue(formData);
  if (!parsed.success) redirect(`/dashboard/admin/newsletter/${id || "new"}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Check the fields")}`);
  const data = parsed.data;
  if (id) {
    const issue = await db.newsletterIssue.findUnique({ where: { id }, select: { status: true } });
    if (!issue || issue.status !== "draft") throw new Error("Only a draft can be edited");
    // An edit needs a fresh test before it can be published.
    await db.newsletterIssue.update({ where: { id }, data: { ...data, testSentAt: null, testSentTo: null } });
    revalidatePath(`/dashboard/admin/newsletter/${id}`);
    redirect(`/dashboard/admin/newsletter/${id}?saved=1`);
  }
  const created = await db.newsletterIssue.create({ data: { ...data, createdBy: by } });
  redirect(`/dashboard/admin/newsletter/${created.id}?saved=1`);
}

/** Test recipients: our own inboxes only (NEWSLETTER_TEST_DOMAINS overrides). */
function internalAddress(email: string): boolean {
  const domains = (process.env.NEWSLETTER_TEST_DOMAINS ?? "theandylife.com,profitgeeks.com.au,yourpropertyguide.com.au,houseofgeeks.com.au")
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  const domain = normaliseEmail(email).split("@")[1] ?? "";
  return domains.includes(domain);
}

export async function sendNewsletterTest(formData: FormData): Promise<void> {
  await admin();
  const id = String(formData.get("id") ?? "");
  const to = String(formData.get("to") ?? "").trim();
  if (!z.string().email().safeParse(to).success || !internalAddress(to)) {
    redirect(`/dashboard/admin/newsletter/${id}?error=${encodeURIComponent("Tests go to an internal address only")}`);
  }
  const q = await sendTest(id, to);
  const outcome = q.created && q.status === "queued" ? await sendQueuedNow(q.id) : q.status;
  revalidatePath(`/dashboard/admin/newsletter/${id}`);
  redirect(`/dashboard/admin/newsletter/${id}?test=${encodeURIComponent(outcome)}`);
}

export async function publishNewsletter(formData: FormData): Promise<void> {
  const by = await admin();
  const id = String(formData.get("id") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const issue = await db.newsletterIssue.findUnique({ where: { id }, select: { status: true, testSentAt: true } });
  if (!issue || issue.status !== "draft") redirect(`/dashboard/admin/newsletter/${id}?error=${encodeURIComponent("Only a draft can be published")}`);
  if (!issue.testSentAt) redirect(`/dashboard/admin/newsletter/${id}?error=${encodeURIComponent("Send yourself a test of this version first")}`);
  if (confirm !== "PUBLISH") redirect(`/dashboard/admin/newsletter/${id}?error=${encodeURIComponent("Type PUBLISH to confirm")}`);
  const res = await publishIssue(id, by);
  revalidatePath(`/dashboard/admin/newsletter/${id}`);
  redirect(`/dashboard/admin/newsletter/${id}?published=${res.queued}`);
}

export async function cancelNewsletter(formData: FormData): Promise<void> {
  await admin();
  const id = String(formData.get("id") ?? "");
  await db.newsletterIssue.updateMany({ where: { id, status: "draft" }, data: { status: "cancelled" } });
  redirect("/dashboard/admin/newsletter");
}
