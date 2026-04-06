// @ts-ignore — custom prisma output path
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  if (!email || !password) {
    console.error("Usage: npx tsx scripts/set-password.ts <email> <password>");
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 12);
  const user = await db.user.update({ where: { email }, data: { password: hash } });
  console.log("Password set for:", user.email);
}

main().finally(() => db.$disconnect());
