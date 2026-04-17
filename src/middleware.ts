import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    const loginUrl = new URL("/admin", req.url)
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Protect all staff routes — public routes (/, /book, /portal, /review, /admin, /api) are not matched
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
