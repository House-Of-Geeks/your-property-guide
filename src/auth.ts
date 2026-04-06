import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Nodemailer({
      server: {
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
          user: "apikey",
          pass: process.env.SENDGRID_API_KEY ?? "",
        },
      },
      from: process.env.EMAIL_FROM ?? "noreply@yourpropertyguide.com.au",
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await db.user.findUnique({
          where: { email: user.email },
          select: { role: true },
        });
        token.role = dbUser?.role ?? "agent";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        (session.user as typeof session.user & { role: string }).role = token.role as string;
      }
      return session;
    },
  },
});
