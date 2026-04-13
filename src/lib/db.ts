import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// In Vercel serverless, globalThis persists across warm invocations of the
// same function instance. Always reuse the singleton to avoid opening a new
// connection pool on every warm request.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

// Always set the global — not just in development.
// Each Vercel function instance gets its own globalThis, so this is safe.
// It ensures warm invocations reuse the same client (and its connection pool)
// rather than opening fresh connections on every request.
globalForPrisma.prisma = db;
