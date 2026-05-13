import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// In Vercel serverless, globalThis persists across warm invocations of the
// same function instance. Always reuse the singleton to avoid opening a new
// connection pool on every warm request.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

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
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

// Always set the global, not just in development.
// Each Vercel function instance gets its own globalThis, so this is safe.
// It ensures warm invocations reuse the same client (and its connection pool)
// rather than opening fresh connections on every request.
globalForPrisma.prisma = db;
