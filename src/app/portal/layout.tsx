"use client"

export const dynamic = "force-dynamic"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Building2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Dashboard", href: "/portal/dashboard" },
  { label: "Appointments", href: "/portal/appointments" },
  { label: "Documents", href: "/portal/documents" },
]

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const user = session?.user

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top Nav */}
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/portal/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1e40af]">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div className="leading-none">
                <span className="text-base font-black text-[#1e3a8a] tracking-tight">abacus</span>
                <span className="text-base font-black text-[#60a5fa] tracking-tight"> accounting</span>
              </div>
            </Link>

            {/* Nav tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-[#dbeafe] text-[#1e40af]"
                        : "text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* User info + sign out */}
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-[#0f172a] leading-tight">{user.name}</p>
                  <p className="text-xs text-[#64748b] leading-tight">{user.email}</p>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/client-portal" })}
                className="flex items-center gap-2 text-[#64748b] border-[#e2e8f0] hover:text-[#0f172a]"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>

          {/* Mobile nav */}
          <div className="flex md:hidden gap-1 pb-2 overflow-x-auto">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                    active
                      ? "bg-[#dbeafe] text-[#1e40af]"
                      : "text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
