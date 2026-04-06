import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

// Use only the Edge-compatible config here — no Prisma, no Node.js modules
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const headers = new Headers(req.headers);
  headers.set("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
});

export const config = {
  matcher: ["/((?!_next|favicon.ico|images|icons|fonts).*)"],
};
