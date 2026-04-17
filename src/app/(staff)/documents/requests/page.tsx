"use client"

import { useState, useEffect, useCallback } from "react"
import { TopBar } from "@/shared/components/layout/TopBar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, CheckCircle2, Clock, FileText, Loader2 } from "lucide-react"
import Link from "next/link"

interface DocumentRequest {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  fulfilled: boolean
  fulfilledAt: string | null
  createdAt: string
  client: { firstName: string; lastName: string; email: string }
  _count: { documents: number }
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<DocumentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/document-requests")
    const data = await res.json()
    setRequests(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const toggleFulfilled = async (req: DocumentRequest) => {
    setTogglingId(req.id)
    setError("")
    const res = await fetch(`/api/document-requests/${req.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fulfilled: !req.fulfilled }),
    })
    setTogglingId(null)
    if (!res.ok) {
      setError("Failed to update request status.")
      return
    }
    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id ? { ...r, fulfilled: !req.fulfilled, fulfilledAt: !req.fulfilled ? new Date().toISOString() : null } : r
      )
    )
  }

  const handleDelete = async (req: DocumentRequest) => {
    if (!confirm(`Delete request "${req.title}"? This cannot be undone.`)) return
    setDeletingId(req.id)
    setError("")
    const res = await fetch(`/api/document-requests/${req.id}`, { method: "DELETE" })
    setDeletingId(null)
    if (!res.ok) {
      setError("Failed to delete request.")
      return
    }
    setRequests((prev) => prev.filter((r) => r.id !== req.id))
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const isDue = (req: DocumentRequest) => {
    if (!req.dueDate || req.fulfilled) return false
    return new Date(req.dueDate) < new Date()
  }

  return (
    <>
      <TopBar
        title="Document Requests"
        subtitle="Track documents requested from clients"
        actions={
          <Button size="sm" asChild>
            <Link href="/documents/requests/new">
              <Plus className="h-4 w-4" />
              New Request
            </Link>
          </Button>
        }
      />
      <main className="flex-1 overflow-y-auto p-8">
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-[#1e40af]" />
          </div>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <FileText className="h-12 w-12 text-[#bfdbfe] mb-4" />
              <p className="text-sm font-semibold text-[#64748b]">No document requests yet</p>
              <p className="text-xs text-[#94a3b8] mt-1 mb-4">
                Create requests to ask clients for specific documents
              </p>
              <Button size="sm" asChild>
                <Link href="/documents/requests/new">
                  <Plus className="h-4 w-4" /> Create Request
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">Client</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">Documents</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-[#64748b]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#0f172a]">{req.title}</p>
                        {req.description && (
                          <p className="text-xs text-[#94a3b8] mt-0.5 max-w-[260px] truncate">{req.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#374151]">
                        <p>{req.client.firstName} {req.client.lastName}</p>
                        <p className="text-xs text-[#94a3b8]">{req.client.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        {req.dueDate ? (
                          <span className={isDue(req) ? "text-red-600 font-medium" : "text-[#374151]"}>
                            {formatDate(req.dueDate)}
                            {isDue(req) && <span className="ml-1 text-xs">(overdue)</span>}
                          </span>
                        ) : (
                          <span className="text-[#cbd5e1]">No due date</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {req.fulfilled ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Fulfilled
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="gap-1">
                            <Clock className="h-3 w-3" /> Pending
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary">{req._count.documents}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => toggleFulfilled(req)}
                            disabled={togglingId === req.id}
                            title={req.fulfilled ? "Mark as pending" : "Mark as fulfilled"}
                          >
                            {togglingId === req.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : req.fulfilled ? (
                              <Clock className="h-3.5 w-3.5" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(req)}
                            disabled={deletingId === req.id}
                          >
                            {deletingId === req.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </>
  )
}
