import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // AUTH_SECRET must be set in Vercel env vars — this fallback is only for initial setup
  secret: process.env.AUTH_SECRET ?? "change-me-set-AUTH_SECRET-in-vercel",
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Nodemailer({
      server: {
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
          user: "apikey",
          pass: process.env.SENDGRID_API_KEY ?? "not-configured",
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
