import { enqueueEmail, sendQueuedNow, type EnqueueInput } from "./queue";

// The two ways a route sends (21 Oct 2026). Both write the EmailMessage row
// first, so the email exists and is retried by the cron even if the send
// below fails or the function stops.

export type SendStatus = "accepted" | "queued" | "failed" | "ambiguous" | "suppressed" | "sending" | "delivered" | string;

/**
 * Queue and send now, waiting for SendGrid's answer: for the email the
 * person on the page is waiting for, so the page can say honestly whether
 * it's on its way. "accepted" means SendGrid took it, not that it arrived.
 * "queued" means a temporary failure: the cron retries it.
 */
export async function queueAndSendNow(input: EnqueueInput): Promise<{ id: string; status: SendStatus; created: boolean }> {
  const q = await enqueueEmail(input);
  if (!q.created || q.status !== "queued") return q;
  const outcome = await sendQueuedNow(q.id);
  const status = outcome === "retry" || outcome === "not-claimed" ? "queued" : outcome;
  return { id: q.id, status, created: true };
}

/**
 * Queue now and send after the response (team notifications, anything the
 * person isn't waiting on). `defer` is next/server's after(); without a
 * request scope (tests) the send runs immediately.
 */
export async function queueAndSendLater(input: EnqueueInput, defer?: (task: () => Promise<unknown>) => void): Promise<{ id: string; status: SendStatus }> {
  const q = await enqueueEmail(input);
  if (q.created && q.status === "queued") {
    const task = () => sendQueuedNow(q.id).catch((err) => console.error("Deferred send failed (the cron will retry):", { id: q.id, error: err instanceof Error ? err.message : String(err) }));
    if (defer) {
      try {
        defer(task);
      } catch {
        void task();
      }
    } else {
      void task();
    }
  }
  return q;
}
