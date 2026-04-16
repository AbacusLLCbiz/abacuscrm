import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

// Edge-compatible middleware — no Prisma, no bcrypt.
// Runs on staff routes to make the session available server-side.
export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/scheduler/:path*",
    "/documents/:path*",
    "/calls/:path*",
    "/automations/:path*",
    "/settings/:path*",
  ],
}
