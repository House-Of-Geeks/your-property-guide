import "dotenv/config";
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Runs from outside Railway reach the database through its TCP proxy, which
// can drop a connection without telling the client: a query then waits
// forever (the SILO run stalled this way on 14 Oct 2026). TCP keepalive
// finds dead sockets, idle connections are closed rather than reused, and
// SYNC_QUERY_TIMEOUT_MS (set it for long runs from a laptop) turns a hung
// query into an error the sync can retry.
const queryTimeout = Number(process.env.SYNC_QUERY_TIMEOUT_MS) || undefined;

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10_000,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 30_000,
  ...(queryTimeout ? { query_timeout: queryTimeout } : {}),
});
export const prisma = new PrismaClient({ adapter });
