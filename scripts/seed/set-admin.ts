/**
 * Promotes (or creates) a user to the "admin" role.
 * Run: npx tsx scripts/seed/set-admin.ts your@email.com
 */
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npx tsx scripts/seed/set-admin.ts your@email.com");
    process.exit(1);
  }

  const user = await db.user.upsert({
    where: { email },
    update: { role: "admin" },
    create: {
      email,
      role: "admin",
      name: email.split("@")[0],
    },
  });

  console.log(`✅ ${user.email} is now role: admin (id: ${user.id})`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
