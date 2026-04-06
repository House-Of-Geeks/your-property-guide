import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM ?? "noreply@yourpropertyguide.com.au",
    }),
  ],
  pages: {
    signIn: "/dashboard/login",
    verifyRequest: "/dashboard/verify",
    error: "/dashboard/login",
  },
  callbacks: {
    async session({ session, user }) {
      // Attach the user's role to the session
      if (session.user) {
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        (session.user as typeof session.user & { role: string }).role =
          dbUser?.role ?? "agent";
      }
      return session;
    },
  },
});
