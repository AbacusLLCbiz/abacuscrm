"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TopBarProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-[#e2e8f0] bg-white px-6 shrink-0">
      <div>
        <h1 className="text-base font-semibold text-[#0f172a]">{title}</h1>
        {subtitle && <p className="text-xs text-[#64748b]">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
          <Input className="pl-8 h-8 w-56 text-xs" placeholder="Search..." />
        </div>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4 text-[#64748b]" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#1e40af]" />
        </Button>
        {actions}
      </div>
    </header>
  )
}
