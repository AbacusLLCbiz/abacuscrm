export { auth as middleware } from "@/lib/auth"

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
