// For route tests that mock @/lib/email and @/lib/db (21 Oct 2026): the
// email queue needs a real database, so these tests swap its two entry
// points for a passthrough that calls the mocked sendMail directly. A
// rejected send with an SMTP 5xx counts as "failed" (a permanent refusal);
// any other rejection is "queued" (the cron would retry it). The queue's
// own behaviour is tested against Postgres in tests/lib/mail-*.db.test.ts.
import { sendMail } from "@/lib/email";
import type { EnqueueInput } from "@/lib/mail/queue";

async function send(input: EnqueueInput) {
  try {
    await sendMail({ to: input.to, cc: input.cc, subject: input.subject, html: input.html, text: input.text, replyTo: input.replyTo, headers: input.headers });
    return { id: `msg:${input.key}`, status: "accepted", created: true };
  } catch (err) {
    const code = (err as { responseCode?: number })?.responseCode;
    return { id: `msg:${input.key}`, status: typeof code === "number" && code >= 500 ? "failed" : "queued", created: true };
  }
}

export const queueAndSendNow = send;
export async function queueAndSendLater(input: EnqueueInput, defer?: (task: () => Promise<unknown>) => void) {
  const task = () => send(input);
  if (defer) defer(task);
  else await task();
  return { id: `msg:${input.key}`, status: "queued" };
}
