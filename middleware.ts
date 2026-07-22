import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. STRICTLY define protected routes. 
  // If the path is NOT /admin or /login, do absolutely nothing and let it pass.
  const isProtectedRoute = pathname === "/login" || pathname.startsWith("/admin");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // 2. Refresh session and get user for protected routes ONLY
  const { supabaseResponse, user } = await updateSession(request);

  // 3. Redirect unauthenticated users away from /admin
  if (pathname.startsWith("/admin") && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Redirect authenticated users away from /login
  if (pathname === "/login" && user) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    adminUrl.search = "";
    return NextResponse.redirect(adminUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match ONLY the routes that require authentication checks.
     * By omitting "/", "/shop", "/services", etc., Next.js will NOT 
     * even execute this middleware for public routes, guaranteeing 
     * zero interference and maximum performance.
     */
    "/admin",
    "/admin/:path*",
    "/login",
  ],
};