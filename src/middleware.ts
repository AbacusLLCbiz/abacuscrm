import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

// Edge-compatible auth instance — no Prisma, no bcrypt
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  if (!req.auth) {
    const loginUrl = new URL("/admin", req.url)
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return Response.redirect(loginUrl)
  }
})

export const config = {
  // Protect all staff routes. Public routes (/admin, /book, /portal, /review, /api, /) are excluded.
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/scheduler/:path*",
    "/automations/:path*",
    "/documents/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    "/calls/:path*",
  ],
}
