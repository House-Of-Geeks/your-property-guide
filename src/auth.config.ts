import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config — no Node.js imports (no Prisma, no bcrypt etc.)
 * Used by middleware. The full config with PrismaAdapter lives in auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/dashboard/login",
    verifyRequest: "/dashboard/verify",
    error: "/dashboard/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const isProtected =
        pathname.startsWith("/dashboard") &&
        !pathname.startsWith("/dashboard/login") &&
        !pathname.startsWith("/dashboard/verify");

      if (isProtected && !isLoggedIn) return false; // triggers redirect to signIn page
      return true;
    },
  },
  providers: [], // providers added in auth.ts
} satisfies NextAuthConfig;
