import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
    Credentials({
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
        name:     { label: "Name",     type: "text" },
        mode:     { label: "Mode",     type: "text" }, // "login" | "register"
      },
      async authorize(credentials) {
        const email    = credentials?.email    as string | undefined;
        const password = credentials?.password as string | undefined;
        const name     = credentials?.name     as string | undefined;
        const mode     = credentials?.mode     as string | undefined;

        if (!email || !password) return null;

        const existing = await db.user.findUnique({ where: { email } });

        if (mode === "register") {
          if (existing) return null; // account already exists
          const hash = await bcrypt.hash(password, 12);
          const user = await db.user.create({
            data: { email, name: name || null, password: hash },
          });
          return { id: user.id, email: user.email, name: user.name };
        }

        // login mode
        if (!existing || !existing.password) return null;
        const valid = await bcrypt.compare(password, existing.password);
        if (!valid) return null;
        return { id: existing.id, email: existing.email, name: existing.name };
      },
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
