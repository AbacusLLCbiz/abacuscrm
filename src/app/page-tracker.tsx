"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

// Routes that belong to staff or portal — never tracked
const SKIP_PREFIXES = [
  "/dashboard", "/clients", "/portal", "/scheduler",
  "/settings", "/documents", "/automations", "/calls",
  "/analytics", "/admin", "/api",
]

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem("_abacus_sid")
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36)
      sessionStorage.setItem("_abacus_sid", id)
    }
    return id
  } catch {
    return ""
  }
}

export function PageTracker() {
  const pathname = usePathname()
  const lastTracked = useRef<string | null>(null)

  useEffect(() => {
    if (pathname === lastTracked.current) return
    if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) return
    lastTracked.current = pathname

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
        sessionId: getSessionId(),
      }),
      keepalive: true,
    }).catch(() => {})
  }, [pathname])

  return null
}
