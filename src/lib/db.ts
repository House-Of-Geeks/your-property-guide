import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// In Vercel serverless, globalThis persists across warm invocations of the
// same function instance. Always reuse the singleton to avoid opening a new
// connection pool on every warm request.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
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
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: isBuild ? 10 : 2,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: isBuild ? 30_000 : 5_000,
  });

  // Retry transient connection drops at the POOL level. The Prisma pg adapter
  // runs every non-transaction query — model finders AND raw $queryRawUnsafe
  // (used by the suburb-rankings service the build prerenders) — through
  // pool.query, so wrapping it here covers them all. node-postgres evicts the
  // dead socket on failure, so the retry runs on a fresh connection. We retry
  // harder during the build (where one drop kills the whole run) than at
  // runtime (where a request can fail fast and be retried by the client/ISR).
  // NB: a model-level Prisma `$extends` retry does NOT catch raw queries, which
  // is why the failing /best-suburbs/* path slipped through earlier.
  // Retry hard at build (one drop kills the whole deploy and the proxy can stay
  // bad for several seconds at a time); the capped backoff rides out a bad
  // window of up to ~20s. Runtime stays light — a request can fail fast and be
  // retried by the client/ISR.
  const maxRetries = isBuild ? 12 : 2;
  const runQuery = pool.query.bind(pool) as (...a: unknown[]) => unknown;
  (pool as unknown as { query: unknown }).query = (...qargs: unknown[]) => {
    // Callback form (last arg is a function): defer to the original.
    if (typeof qargs[qargs.length - 1] === "function") return runQuery(...qargs);
    return (async () => {
      for (let attempt = 0; ; attempt++) {
        try {
          return await runQuery(...qargs);
        } catch (err) {
          if (attempt >= maxRetries || !isTransientConnectionError(err)) throw err;
          await sleep(Math.min(150 * 2 ** attempt, 2000)); // 150,300,600,1200,2000,2000…
        }
      }
    })();
  };

  // Cast: @prisma/adapter-pg bundles its own nested @types/pg, so our pg.Pool
  // is structurally identical but nominally distinct from the type it expects.
  const adapter = new PrismaPg(pool as unknown as ConstructorParameters<typeof PrismaPg>[0]);
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

// Always set the global, not just in development.
// Each Vercel function instance gets its own globalThis, so this is safe.
// It ensures warm invocations reuse the same client (and its connection pool)
// rather than opening fresh connections on every request.
globalForPrisma.prisma = db;
