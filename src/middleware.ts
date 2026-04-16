import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

// Use the edge-compatible config — no Prisma, no bcrypt
const { auth } = NextAuth(authConfig)
export { auth as middleware }

export const config = {
  matcher: [
    // Protect all staff/admin routes
    "/dashboard/:path*",
    "/clients/:path*",
    "/scheduler/:path*",
    "/documents/:path*",
    "/calls/:path*",
    "/automations/:path*",
    "/settings/:path*",
  ],
}
