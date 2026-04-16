"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Building2 } from "lucide-react"

const links = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
]

export function MarketingNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e2e8f0]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1e40af]">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="leading-none">
              <span className="text-base font-black text-[#1e3a8a] tracking-tight">abacus</span>
              <span className="text-base font-black text-[#60a5fa] tracking-tight"> accounting</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-[#475569] hover:text-[#1e40af] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/client-portal"
              className="text-sm font-semibold text-[#475569] hover:text-[#1e40af] transition-colors px-3 py-2"
            >
              Client Login
            </Link>
            <a
              href="#book"
              className="rounded-full bg-[#1e40af] px-7 py-3 text-sm font-bold text-white hover:bg-[#1d4ed8] transition-colors shadow-sm"
            >
              Book a Meeting →
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-[#475569]"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-[#e2e8f0] py-4 space-y-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="block text-sm font-medium text-[#475569] hover:text-[#1e40af] py-1"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/client-portal" className="text-sm font-semibold text-[#475569] py-2">Client Login</Link>
              <a href="#book" className="rounded-full bg-[#1e40af] px-7 py-3 text-sm font-bold text-white text-center">Book a Meeting →</a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
