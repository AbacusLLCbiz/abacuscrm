"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/shared/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"

interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
}

export default function NewRequestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [clientsLoading, setClientsLoading] = useState(true)
  const [error, setError] = useState("")
  const [clients, setClients] = useState<Client[]>([])

  const [form, setForm] = useState({
    clientId: "",
    title: "",
    description: "",
    dueDate: "",
  })

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }))

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) => {
        setClients(data)
        setClientsLoading(false)
      })
      .catch(() => setClientsLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const payload: Record<string, unknown> = {
      clientId: form.clientId,
      title: form.title,
    }
    if (form.description) payload.description = form.description
    if (form.dueDate) payload.dueDate = new Date(form.dueDate).toISOString()

    const res = await fetch("/api/document-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error?.fieldErrors ? "Please fix the errors below." : (data.error ?? "Something went wrong."))
      return
    }

    router.push("/documents/requests")
  }

  return (
    <>
      <TopBar
        title="New Document Request"
        subtitle="Ask a client for specific documents"
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/documents/requests">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          </Button>
        }
      />
      <main className="flex-1 overflow-y-auto p-8">
        <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="clientId">
                  Client <span className="text-red-500">*</span>
                </Label>
                {clientsLoading ? (
                  <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading clients…
                  </div>
                ) : (
                  <Select value={form.clientId} onValueChange={(v) => set("clientId", v)} required>
                    <SelectTrigger id="clientId">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.firstName} {c.lastName} — {c.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. 2024 W-2 and 1099 forms"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[100px] rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e40af] resize-y"
                  placeholder="Additional details or instructions for the client…"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => set("dueDate", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={loading || !form.clientId || !form.title} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Create Request
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/documents/requests">Cancel</Link>
            </Button>
          </div>
        </form>
      </main>
    </>
  )
}
