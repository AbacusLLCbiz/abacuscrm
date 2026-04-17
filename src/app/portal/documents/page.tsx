"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { FileText, FolderOpen, AlertCircle, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// ─── Types ────────────────────────────────────────────────────────────────────

interface DocumentRequest {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  fulfilled: boolean
  createdAt: string
}

interface ClientData {
  documentRequests: DocumentRequest[]
  documents: unknown[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortalDocumentsPage() {
  const [client, setClient] = useState<ClientData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/portal/me")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load documents.")
        return r.json()
      })
      .then(setClient)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1e40af] border-t-transparent" />
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-[#0f172a] font-semibold">Something went wrong</p>
        <p className="text-[#64748b] text-sm">{error || "Could not load documents."}</p>
      </div>
    )
  }

  const pendingRequests = client.documentRequests.filter((r) => !r.fulfilled)
  const fulfilledRequests = client.documentRequests.filter((r) => r.fulfilled)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a]">Documents</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Manage your document requests and uploaded files.
        </p>
      </div>

      {/* Document Requests */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-500" />
              Document Requests
              {pendingRequests.length > 0 && (
                <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  {pendingRequests.length} pending
                </span>
              )}
            </CardTitle>
          </div>
          <p className="text-sm text-[#64748b] mt-1">
            Your accountant will request documents here when needed.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          {client.documentRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <FileText className="h-8 w-8 text-[#cbd5e1]" />
              <p className="text-sm text-[#64748b]">No document requests at this time</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pending */}
              {pendingRequests.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-3">
                    Pending
                  </p>
                  <ul className="space-y-2">
                    {pendingRequests.map((req) => {
                      const overdue = isOverdue(req.dueDate)
                      return (
                        <li
                          key={req.id}
                          className="flex items-start justify-between gap-4 rounded-lg border border-[#e2e8f0] p-4"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-[#0f172a]">{req.title}</p>
                            {req.description && (
                              <p className="text-sm text-[#64748b] mt-0.5">{req.description}</p>
                            )}
                            {req.dueDate && (
                              <p
                                className={`text-sm mt-1 ${
                                  overdue ? "text-red-600 font-medium" : "text-[#64748b]"
                                }`}
                              >
                                Due {formatDate(req.dueDate)}
                                {overdue && " — Overdue"}
                              </p>
                            )}
                          </div>
                          <Badge variant={overdue ? "destructive" : "warning"}>Pending</Badge>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {/* Fulfilled */}
              {fulfilledRequests.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-3">
                    Fulfilled
                  </p>
                  <ul className="space-y-2">
                    {fulfilledRequests.map((req) => (
                      <li
                        key={req.id}
                        className="flex items-start justify-between gap-4 rounded-lg border border-[#e2e8f0] p-4 opacity-70"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[#0f172a] line-through">{req.title}</p>
                          {req.dueDate && (
                            <p className="text-sm text-[#64748b] mt-0.5">
                              Due {formatDate(req.dueDate)}
                            </p>
                          )}
                        </div>
                        <Badge variant="success">Fulfilled</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-[#1e40af]" />
            Uploaded Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <FolderOpen className="h-10 w-10 text-[#cbd5e1]" />
            <p className="text-sm font-medium text-[#0f172a]">No documents uploaded yet</p>
            <div className="flex items-start gap-2 max-w-sm rounded-lg bg-[#f8fafc] border border-[#e2e8f0] p-3 text-left">
              <Info className="h-4 w-4 text-[#64748b] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#64748b] leading-relaxed">
                Document uploads will be available soon. Your accountant can share files with you
                directly through this portal.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
