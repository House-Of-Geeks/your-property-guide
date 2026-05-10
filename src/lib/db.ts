import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// In Vercel serverless, globalThis persists across warm invocations of the
// same function instance. Always reuse the singleton to avoid opening a new
// connection pool on every warm request.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  // Connection-pool sizing for Vercel serverless:
  // - Each function instance handles one request at a time, so max=1 is enough.
  // - With Postgres max_connections=100 and tens of warm instances under load,
  //   any larger `max` exhausts the upstream pool (P2037 TooManyConnections).
  // - idleTimeoutMillis releases unused connections so warm-but-idle instances
  //   don't squat on a slot indefinitely.
  // - connectionTimeoutMillis fails fast instead of hanging the request when
  //   the upstream pool is exhausted.
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    max: 1,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

// Always set the global — not just in development.
// Each Vercel function instance gets its own globalThis, so this is safe.
// It ensures warm invocations reuse the same client (and its connection pool)
// rather than opening fresh connections on every request.
globalForPrisma.prisma = db;
