import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { AUTH_BYPASS } from "@/lib/env";
import { hasAdminAccess } from "@/lib/permissions";

const ADMIN_ONLY_PATHS = ["/dashboard", "/tools", "/projects", "/history", "/settings"];

export default withAuth(
  function middleware(request) {
    if (AUTH_BYPASS) {
      return NextResponse.next();
    }

    const token = request.nextauth.token;
    const pathname = request.nextUrl.pathname;
    const isAdminOnlyPath = ADMIN_ONLY_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    if (isAdminOnlyPath && !hasAdminAccess(token?.role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => AUTH_BYPASS || Boolean(token),
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/tools/:path*", "/projects/:path*", "/history/:path*", "/settings/:path*"],
};
