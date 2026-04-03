import { prisma } from "./db";

export async function startSync(id: string): Promise<void> {
  await prisma.dataSource.update({
    where: { id },
    data: { status: "running", errorMsg: null, lastFetchedAt: new Date() },
  });
  console.log(`[${id}] started`);
}

export async function finishSync(
  id: string,
  recordCount: number,
  dataAsOf?: Date
): Promise<void> {
  await prisma.dataSource.update({
    where: { id },
    data: { status: "ok", recordCount, dataAsOf: dataAsOf ?? null },
  });
  console.log(`[${id}] ✓ ${recordCount} records`);
}

export async function failSync(id: string, err: unknown): Promise<void> {
  const msg = err instanceof Error ? err.message : String(err);
  await prisma.dataSource.update({
    where: { id },
    data: { status: "error", errorMsg: msg },
  });
  console.error(`[${id}] ✗ ${msg}`);
}

export function log(id: string, msg: string): void {
  console.log(`[${id}] ${msg}`);
}
