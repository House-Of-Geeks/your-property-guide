import pg from "pg";

// The Postgres-backed test files truncate the same tables, and vitest runs
// files in parallel. Each file holds this advisory lock for its whole run,
// so they take turns instead of wiping each other's rows.

const LOCK_ID = 7_171_021;

export async function lockTestDatabase(url: string): Promise<() => Promise<void>> {
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  await client.query("SELECT pg_advisory_lock($1)", [LOCK_ID]);
  return async () => {
    await client.query("SELECT pg_advisory_unlock($1)", [LOCK_ID]).catch(() => {});
    await client.end().catch(() => {});
  };
}
