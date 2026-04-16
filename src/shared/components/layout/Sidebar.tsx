"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Calendar,
  FolderOpen,
  Zap,
  Phone,
  Settings,
  ChevronDown,
  Building2,
} from "lucide-react"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Clients",
    href: "/clients",
    icon: Users,
  },
  {
    label: "Scheduler",
    href: "/scheduler",
    icon: Calendar,
    children: [
      { label: "Calendar", href: "/scheduler" },
      { label: "Event Types", href: "/scheduler/event-types" },
      { label: "Availability", href: "/scheduler/availability" },
    ],
  },
  {
    label: "Documents",
    href: "/documents",
    icon: FolderOpen,
    children: [
      { label: "All Documents", href: "/documents" },
      { label: "Folders", href: "/documents/folders" },
      { label: "Requests", href: "/documents/requests" },
    ],
  },
  {
    label: "Calls",
    href: "/calls",
    icon: Phone,
  },
  {
    label: "Automations",
    href: "/automations",
    icon: Zap,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

function NavItem({
  item,
  depth = 0,
}: {
  item: (typeof navItems)[number]
  depth?: number
}) {
  const pathname = usePathname()
  const isActive = pathname === item.href || (item.children && item.children.some((c) => pathname.startsWith(c.href)))
  const isExactActive = pathname === item.href
  const hasChildren = item.children && item.children.length > 0
  const isOpen = hasChildren && item.children!.some((c) => pathname.startsWith(c.href))

  return (
    <div>
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors group",
          depth === 0
            ? isActive
              ? "bg-white/15 text-white"
              : "text-blue-100 hover:bg-white/10 hover:text-white"
            : isExactActive
            ? "bg-white/15 text-white"
            : "text-blue-200 hover:bg-white/10 hover:text-white"
        )}
      >
        {depth === 0 && item.icon && (
          <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-blue-300 group-hover:text-white")} />
        )}
        {depth === 1 && <span className="ml-7 h-1 w-1 rounded-full bg-blue-400 group-hover:bg-white" />}
        <span className="flex-1">{item.label}</span>
        {hasChildren && (
          <ChevronDown className={cn("h-3.5 w-3.5 text-blue-300 transition-transform", isOpen && "rotate-180")} />
        )}
      </Link>

      {hasChildren && isOpen && (
        <div className="mt-0.5 space-y-0.5">
          {item.children!.map((child) => (
            <NavItem key={child.href} item={{ ...child, icon: undefined as unknown as typeof LayoutDashboard }} depth={1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col overflow-hidden" style={{ background: "var(--sidebar-bg)" }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-6 border-b border-white/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
          <Building2 className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">Abacus</p>
          <p className="text-[10px] text-blue-300 mt-0.5">Accounting CRM</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 py-5 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom user area */}
      <div className="border-t border-white/10 px-3 py-3">
        <Link
          href="/settings/profile"
          className="flex items-center gap-2.5 rounded-md px-2 py-2 hover:bg-white/10 transition-colors group"
        >
          <div className="h-7 w-7 rounded-full bg-blue-400 flex items-center justify-center text-xs font-bold text-white">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">Admin</p>
            <p className="text-[10px] text-blue-300 truncate">admin@abacus.com</p>
          </div>
        </Link>
      </div>
    </aside>
  )
}
