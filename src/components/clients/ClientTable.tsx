"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Phone,
  Mail,
  Building2,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { cn, getInitials, formatPhone } from "@/lib/utils"

type Client = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  company?: string | null
  entityType?: string | null
  status: "ACTIVE" | "INACTIVE" | "PROSPECT"
  fiscalYearEnd?: string | null
  assignedTo: { name: string | null }
  tags: string[]
}

const statusConfig = {
  ACTIVE: { label: "Active", variant: "success" as const },
  INACTIVE: { label: "Inactive", variant: "secondary" as const },
  PROSPECT: { label: "Prospect", variant: "warning" as const },
}

const entityLabels: Record<string, string> = {
  INDIVIDUAL: "Individual",
  SOLE_PROPRIETOR: "Sole Prop.",
  LLC: "LLC",
  S_CORP: "S-Corp",
  C_CORP: "C-Corp",
  PARTNERSHIP: "Partnership",
  NON_PROFIT: "Non-Profit",
  OTHER: "Other",
}

// Demo placeholder rows
const DEMO_CLIENTS: Client[] = []

export function ClientTable() {
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<"name" | "status" | "company">("name")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDir("asc")
    }
  }

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return <ChevronUp className="h-3 w-3 opacity-30" />
    return sortDir === "asc"
      ? <ChevronUp className="h-3 w-3 text-[#1e40af]" />
      : <ChevronDown className="h-3 w-3 text-[#1e40af]" />
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
          <Input
            className="pl-9"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-3.5 w-3.5" />
          Filter
        </Button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-lg border border-[#e2e8f0] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
              <th className="px-4 py-3 text-left">
                <button
                  className="flex items-center gap-1 text-xs font-semibold text-[#64748b] hover:text-[#1e40af]"
                  onClick={() => handleSort("name")}
                >
                  Client <SortIcon field="name" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  className="flex items-center gap-1 text-xs font-semibold text-[#64748b] hover:text-[#1e40af]"
                  onClick={() => handleSort("company")}
                >
                  Company / Entity <SortIcon field="company" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">Fiscal Year End</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">Assigned To</th>
              <th className="px-4 py-3 text-left">
                <button
                  className="flex items-center gap-1 text-xs font-semibold text-[#64748b] hover:text-[#1e40af]"
                  onClick={() => handleSort("status")}
                >
                  Status <SortIcon field="status" />
                </button>
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {DEMO_CLIENTS.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Building2 className="h-10 w-10 text-[#bfdbfe]" />
                    <p className="text-sm font-medium text-[#64748b]">No clients yet</p>
                    <p className="text-xs text-[#94a3b8]">Add your first client to get started</p>
                    <Button size="sm" className="mt-2" asChild>
                      <a href="/clients/new">Add Client</a>
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              DEMO_CLIENTS.map((client) => {
                const status = statusConfig[client.status]
                const initials = getInitials(`${client.firstName} ${client.lastName}`)
                return (
                  <tr key={client.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#dbeafe] flex items-center justify-center text-xs font-bold text-[#1e40af] shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="font-medium text-[#0f172a]">
                            {client.firstName} {client.lastName}
                          </p>
                          {client.tags.length > 0 && (
                            <div className="flex gap-1 mt-0.5">
                              {client.tags.slice(0, 2).map((t) => (
                                <span key={t} className="text-[10px] text-[#64748b] bg-[#f1f5f9] rounded px-1.5 py-0.5">{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#374151]">{client.company ?? "—"}</p>
                      {client.entityType && (
                        <p className="text-xs text-[#94a3b8]">{entityLabels[client.entityType] ?? client.entityType}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <a href={`mailto:${client.email}`} className="flex items-center gap-1 text-xs text-[#64748b] hover:text-[#1e40af]">
                          <Mail className="h-3 w-3" /> {client.email}
                        </a>
                        {client.phone && (
                          <a
                            href={`tel:${client.phone}`}
                            className="inline-flex items-center gap-1.5 rounded-md bg-[#eff6ff] border border-[#bfdbfe] px-2.5 py-1 text-xs font-medium text-[#1e40af] hover:bg-[#dbeafe] transition-colors"
                          >
                            <Phone className="h-3 w-3" /> Call
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#374151]">{client.fiscalYearEnd ?? "—"}</td>
                    <td className="px-4 py-3 text-sm text-[#374151]">{client.assignedTo.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                          <a href={`/clients/${client.id}`}><Eye className="h-3.5 w-3.5" /></a>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
