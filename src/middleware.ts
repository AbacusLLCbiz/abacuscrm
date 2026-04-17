import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  // If no valid session, redirect to the staff login page
  if (!req.auth) {
    const loginUrl = new URL("/admin", req.url)
    // Preserve the original URL so we can redirect back after login
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
})

export const config = {
  // Protect all staff routes — public routes (/, /book, /portal, /review, /admin, /api) are excluded
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/scheduler/:path*",
    "/automations/:path*",
    "/documents/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    "/calls/:path*",
    "/admin/dashboard/:path*",
  ],
}
