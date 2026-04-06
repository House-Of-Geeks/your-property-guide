import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const headers = new Headers(req.headers);
  headers.set("x-pathname", pathname);

  // Protect /dashboard — allow login + verify pages through unauthenticated
  if (
    pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/dashboard/login") &&
    !pathname.startsWith("/dashboard/verify") &&
    !req.auth
  ) {
    const loginUrl = new URL("/dashboard/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({ request: { headers } });
});

export const config = {
  matcher: ["/((?!_next|favicon.ico|images|icons|fonts).*)"],
};
