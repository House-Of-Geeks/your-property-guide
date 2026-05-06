import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Edge-compatible auth wrapper, no Prisma, no Node.js modules.
//
// SCOPE: dashboard only. Running auth() on every public path causes Vercel
// to mark every response `cache-control: private, no-cache, no-store`,
// killing CDN caching for the entire site. The marketing surface does not
// need session lookup; dashboard pages handle their own auth via
// `await auth()` calls in their page files for any UI that depends on it.
//
// The `authorized` callback in auth.config.ts handles the redirect to the
// signin page for protected dashboard routes.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/dashboard/:path*"],
};
