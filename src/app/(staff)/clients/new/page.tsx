"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"

const ENTITY_TYPES = [
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "SOLE_PROPRIETOR", label: "Sole Proprietor" },
  { value: "LLC", label: "LLC" },
  { value: "S_CORP", label: "S-Corp" },
  { value: "C_CORP", label: "C-Corp" },
  { value: "PARTNERSHIP", label: "Partnership" },
  { value: "NON_PROFIT", label: "Non-Profit" },
  { value: "OTHER", label: "Other" },
]

const STATUSES = [
  { value: "ACTIVE", label: "Active" },
  { value: "PROSPECT", label: "Prospect" },
  { value: "INACTIVE", label: "Inactive" },
]

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
]

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    entityType: "",
    status: "ACTIVE",
    fiscalYearEnd: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
  })

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const payload: Record<string, unknown> = { ...form, tags: [] }
    // Strip empty strings for optional fields
    for (const key of ["phone","company","entityType","fiscalYearEnd","street","city","state","zip","notes"]) {
      if (!payload[key]) delete payload[key]
    }

    const res = await fetch("/api/clients", {
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

    router.push("/clients")
  }

  return (
    <>
      <TopBar
        title="Add Client"
        subtitle="Create a new client record"
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/clients"><ArrowLeft className="h-4 w-4" /> Back</Link>
          </Button>
        }
      />
      <main className="flex-1 overflow-y-auto p-8">
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>
          )}

          {/* Basic info */}
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                <Input id="firstName" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                <Input id="lastName" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(515) 000-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Business info */}
          <Card>
            <CardHeader><CardTitle>Business Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" value={form.company} onChange={(e) => set("company", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entityType">Entity Type</Label>
                <Select value={form.entityType} onValueChange={(v) => set("entityType", v)}>
                  <SelectTrigger id="entityType"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {ENTITY_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fiscalYearEnd">Fiscal Year End</Label>
                <Input id="fiscalYearEnd" value={form.fiscalYearEnd} onChange={(e) => set("fiscalYearEnd", e.target.value)} placeholder="e.g. December 31" />
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader><CardTitle>Address</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="street">Street Address</Label>
                <Input id="street" value={form.street} onChange={(e) => set("street", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={form.state} onValueChange={(v) => set("state", v)}>
                  <SelectTrigger id="state"><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" value={form.zip} onChange={(e) => set("zip", e.target.value)} />
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
            <CardContent>
              <textarea
                id="notes"
                className="w-full min-h-[120px] rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e40af] resize-y"
                placeholder="Internal notes about this client..."
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </CardContent>
          </Card>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Client
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/clients">Cancel</Link>
            </Button>
          </div>
        </form>
      </main>
    </>
  )
}
