import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js 16 Proxy
 *
 * Purpose: Lightweight network gateway managing redirects and header modifications.
 * Rules:
 * - NO response bodies (e.g., NextResponse.json() will throw).
 * - Auth checks here are strictly for routing; final security is enforced in Server Actions/Layouts.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = pathname.startsWith("/admin");
  const isAuthRoute = pathname === "/login";

  // Skip proxy logic entirely for public assets to maximize performance
  if (!isProtected && !isAuthRoute) {
    return NextResponse.next();
  }

  // Lightweight session refresh and validation
  const { supabaseResponse, user } = await updateSession(request);

  // ROUTING MANIPULATION ONLY

  // 1. Unauthenticated user accessing protected route -> Redirect to login
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Authenticated user accessing login -> Redirect to admin
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // 3. Valid request -> Proceed with refreshed cookies
  return supabaseResponse;
}

// Matcher remains the same: exclude static assets for performance
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
