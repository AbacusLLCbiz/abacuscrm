import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Public endpoint — no auth required (tracks public website visitors)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const path = typeof body.path === "string" ? body.path.slice(0, 500) : "/"
    const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null
    const sessionId = typeof body.sessionId === "string" ? body.sessionId.slice(0, 64) : null

    // Skip internal routes
    const skip = ["/api/", "/dashboard", "/clients", "/portal", "/scheduler",
      "/settings", "/documents", "/automations", "/calls", "/analytics", "/admin"]
    if (skip.some((p) => path.startsWith(p))) {
      return NextResponse.json({ ok: true })
    }

    await prisma.pageView.create({
      data: { path, referrer, sessionId },
    })

    return NextResponse.json({ ok: true })
  } catch {
    // Never error to client — tracking must be silent
    return NextResponse.json({ ok: true })
  }
}
