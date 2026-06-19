import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// In Vercel serverless, globalThis persists across warm invocations of the
// same function instance. Always reuse the singleton to avoid opening a new
// connection pool on every warm request.
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createClient> | undefined;
};

// The Railway connection proxy intermittently drops a pooled connection
// mid-query. During `next build` this is fatal: prerendering 22 DB-backed
// routes fires a burst of hundreds of queries, and a single dropped
// connection ("Connection terminated unexpectedly" / P1017 "Server has closed
// the connection") aborts the whole build. Because the connection is closed
// server-side, the query never committed, so re-issuing it on a fresh pooled
// connection is safe. We retry only these transient connection errors.
function isTransientConnectionError(err: unknown): boolean {
  const e = err as { code?: string; message?: string };
  if (e?.code === "P1017") return true; // Server has closed the connection
  const msg = (e?.message ?? "").toLowerCase();
  return (
    msg.includes("connection terminated") ||
    msg.includes("server has closed the connection") ||
    msg.includes("connection closed") ||
    msg.includes("connection is closed") ||
    msg.includes("connection ended") ||
    msg.includes("econnreset")
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function createClient() {
  // Connection-pool sizing splits by phase:
  //
  // - Runtime (Vercel serverless): each function instance handles one request
  //   at a time; 1 connection per instance is enough and reuses across warm
  //   requests via globalForPrisma. Default `max: 10` was the cause of the
  //   P2037 TooManyConnections outage, under load Vercel spawned many warm
  //   instances and 10 × instances exhausted Postgres' 100-connection limit.
  //
  // - Build (`next build` prerender): pages issue several DB queries in
  //   parallel inside a single render via `Promise.all`. Capping at 1
  //   serialises them all and times out the 5s connection wait. Build runs in
  //   a single container with 3 worker processes, so 10 × 3 = 30 connections
  //   total is safe.
  //
  // - idleTimeoutMillis releases unused connections so warm-but-idle instances
  //   don't squat on a slot indefinitely.
  // - connectionTimeoutMillis fails fast instead of hanging the request when
  //   the upstream pool is exhausted.
  const isBuild = process.env.NEXT_PHASE === "phase-production-build";
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    max: isBuild ? 10 : 2,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: isBuild ? 30_000 : 5_000,
  });

  // Retry transient connection drops with exponential backoff. pg evicts the
  // dead socket and hands out a fresh connection on the retry. We retry harder
  // during the build (where one drop kills the whole run) than at runtime
  // (where a request can fail fast and be retried by the client/ISR).
  const maxRetries = isBuild ? 5 : 2;
  return new PrismaClient({ adapter }).$extends({
    query: {
      async $allOperations({ args, query }) {
        for (let attempt = 0; ; attempt++) {
          try {
            return await query(args);
          } catch (err) {
            if (attempt >= maxRetries || !isTransientConnectionError(err)) throw err;
            await sleep(150 * 2 ** attempt); // 150, 300, 600, 1200, 2400ms
          }
        }
      },
    },
  });
}

export const db = globalForPrisma.prisma ?? createClient();

// Always set the global, not just in development.
// Each Vercel function instance gets its own globalThis, so this is safe.
// It ensures warm invocations reuse the same client (and its connection pool)
// rather than opening fresh connections on every request.
globalForPrisma.prisma = db;
