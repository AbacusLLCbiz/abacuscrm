"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/shared/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft, Mail, Phone, Building2, Calendar, FileText,
  Loader2, KeyRound, Check, X, ShieldCheck, ShieldOff,
  MapPin, Clock, Edit2, Save,
} from "lucide-react"
import Link from "next/link"

type MeetingType = "IN_PERSON" | "ZOOM" | "GOOGLE_MEET" | "PHONE"
type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW"

interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  company?: string | null
  entityType?: string | null
  status: "ACTIVE" | "INACTIVE" | "PROSPECT"
  fiscalYearEnd?: string | null
  street?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  notes?: string | null
  portalEnabled: boolean
  portalUserId?: string | null
  tags: string[]
  assignedTo: { name: string | null; email: string }
  appointments: Array<{
    id: string
    startAt: string
    status: AppointmentStatus
    meetingType: MeetingType
    eventType: { title: string; color: string }
  }>
  documents: Array<{
    id: string
    name: string
    status: string
    createdAt: string
    folder?: { name: string } | null
  }>
  documentRequests: Array<{
    id: string
    title: string
    fulfilled: boolean
    dueDate?: string | null
    createdAt: string
  }>
}

const STATUS_CONFIG = {
  ACTIVE: { label: "Active", variant: "success" as const },
  INACTIVE: { label: "Inactive", variant: "secondary" as const },
  PROSPECT: { label: "Prospect", variant: "warning" as const },
}

const APPT_STATUS_VARIANT: Record<AppointmentStatus, "warning" | "success" | "secondary" | "cobalt" | "destructive"> = {
  PENDING: "warning", CONFIRMED: "success", CANCELLED: "secondary", COMPLETED: "cobalt", NO_SHOW: "destructive",
}

const ENTITY_LABELS: Record<string, string> = {
  INDIVIDUAL: "Individual", SOLE_PROPRIETOR: "Sole Proprietor", LLC: "LLC",
  S_CORP: "S-Corp", C_CORP: "C-Corp", PARTNERSHIP: "Partnership",
  NON_PROFIT: "Non-Profit", OTHER: "Other",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Portal access
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [tempPassword, setTempPassword] = useState("")
  const [savingPortal, setSavingPortal] = useState(false)
  const [portalMsg, setPortalMsg] = useState("")

  useEffect(() => {
    fetch(`/api/clients/${id}`)
      .then(async (r) => {
        if (r.status === 404) { setNotFound(true); return }
        if (r.ok) setClient(await r.json())
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSetPortalPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingPortal(true)
    setPortalMsg("")
    const res = await fetch(`/api/clients/${id}/portal-access`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: tempPassword, enablePortal: true }),
    })
    setSavingPortal(false)
    if (res.ok) {
      setPortalMsg(`Portal access enabled. Login: ${client!.email} / ${tempPassword}`)
      setTempPassword("")
      setShowPasswordForm(false)
      setClient((c) => c ? { ...c, portalEnabled: true } : c)
    } else {
      const d = await res.json()
      setPortalMsg(d.error ?? "Failed to set password.")
    }
  }

  const handleRevokePortal = async () => {
    if (!confirm("Revoke portal access for this client?")) return
    await fetch(`/api/clients/${id}/portal-access`, { method: "DELETE" })
    setClient((c) => c ? { ...c, portalEnabled: false } : c)
    setPortalMsg("Portal access revoked.")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#94a3b8]" />
      </div>
    )
  }

  if (notFound || !client) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Building2 className="h-12 w-12 text-[#bfdbfe]" />
        <p className="text-sm font-semibold text-[#64748b]">Client not found</p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/clients"><ArrowLeft className="h-4 w-4" /> Back to Clients</Link>
        </Button>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[client.status]
  const fullName = `${client.firstName} ${client.lastName}`
  const initials = `${client.firstName[0]}${client.lastName[0]}`.toUpperCase()

  return (
    <>
      <TopBar
        title={fullName}
        subtitle={client.company ?? client.email}
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/clients"><ArrowLeft className="h-4 w-4" /> Clients</Link>
          </Button>
        }
      />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl space-y-6">

          {/* Header card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-5">
                <div className="h-14 w-14 rounded-full bg-[#dbeafe] flex items-center justify-center text-lg font-black text-[#1e40af] shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-bold text-[#0f172a]">{fullName}</h2>
                    <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                    {client.entityType && (
                      <Badge variant="outline">{ENTITY_LABELS[client.entityType] ?? client.entityType}</Badge>
                    )}
                  </div>
                  {client.company && <p className="text-sm text-[#64748b] mt-0.5">{client.company}</p>}
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-[#64748b]">
                    <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 hover:text-[#1e40af]">
                      <Mail className="h-3.5 w-3.5" /> {client.email}
                    </a>
                    {client.phone && (
                      <a href={`tel:${client.phone}`} className="flex items-center gap-1.5 hover:text-[#1e40af]">
                        <Phone className="h-3.5 w-3.5" /> {client.phone}
                      </a>
                    )}
                    {(client.city || client.state) && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {[client.city, client.state].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/clients/${id}/edit`}><Edit2 className="h-3.5 w-3.5" /> Edit</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="space-y-6">

              {/* Details */}
              <Card>
                <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {[
                    { label: "Fiscal Year End", value: client.fiscalYearEnd },
                    { label: "Assigned To", value: client.assignedTo.name ?? client.assignedTo.email },
                    { label: "Tags", value: client.tags.length > 0 ? client.tags.join(", ") : null },
                  ].map(({ label, value }) => value ? (
                    <div key={label}>
                      <p className="text-xs text-[#94a3b8] font-medium">{label}</p>
                      <p className="text-[#374151] mt-0.5">{value}</p>
                    </div>
                  ) : null)}
                  {(client.street || client.city) && (
                    <div>
                      <p className="text-xs text-[#94a3b8] font-medium">Address</p>
                      <p className="text-[#374151] mt-0.5">
                        {[client.street, client.city, client.state, client.zip].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              {client.notes && (
                <Card>
                  <CardHeader><CardTitle className="text-sm">Notes</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#374151] whitespace-pre-wrap">{client.notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Portal Access */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="h-4 w-4 text-[#1e40af]" /> Client Portal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${client.portalEnabled ? "bg-green-400" : "bg-[#cbd5e1]"}`} />
                    <span className="text-sm text-[#374151]">
                      {client.portalEnabled ? "Portal access enabled" : "No portal access"}
                    </span>
                  </div>

                  {portalMsg && (
                    <div className={`rounded-lg px-3 py-2 text-xs ${portalMsg.includes("Failed") || portalMsg.includes("error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700 font-mono"}`}>
                      {portalMsg}
                    </div>
                  )}

                  {showPasswordForm ? (
                    <form onSubmit={handleSetPortalPassword} className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="tempPw" className="text-xs">Temporary Password</Label>
                        <Input
                          id="tempPw"
                          type="text"
                          value={tempPassword}
                          onChange={(e) => setTempPassword(e.target.value)}
                          placeholder="min. 6 characters"
                          minLength={6}
                          required
                          className="text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" size="sm" disabled={savingPortal} className="gap-1.5">
                          {savingPortal ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                          Set Password
                        </Button>
                        <Button type="button" size="sm" variant="ghost" onClick={() => setShowPasswordForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" className="gap-1.5 w-full justify-start" onClick={() => { setShowPasswordForm(true); setPortalMsg("") }}>
                        <KeyRound className="h-3.5 w-3.5" />
                        {client.portalEnabled ? "Reset Password" : "Set Temp Password"}
                      </Button>
                      {client.portalEnabled && (
                        <Button size="sm" variant="outline" className="gap-1.5 w-full justify-start text-red-600 border-red-200 hover:bg-red-50" onClick={handleRevokePortal}>
                          <ShieldOff className="h-3.5 w-3.5" /> Revoke Access
                        </Button>
                      )}
                    </div>
                  )}

                  {client.portalEnabled && (
                    <p className="text-[10px] text-[#94a3b8]">
                      Client logs in at <span className="font-mono">/client-portal</span> using their email address.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right column */}
            <div className="lg:col-span-2 space-y-6">

              {/* Appointments */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Appointments
                  </CardTitle>
                  <Button size="sm" variant="outline" asChild className="h-7 text-xs">
                    <Link href="/scheduler">View Scheduler</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {client.appointments.length === 0 ? (
                    <p className="text-xs text-[#94a3b8] py-4 text-center">No appointments yet</p>
                  ) : (
                    <div className="space-y-2">
                      {client.appointments.map((appt) => (
                        <div key={appt.id} className="flex items-center gap-3 rounded-lg border border-[#e2e8f0] px-3 py-2.5"
                          style={{ borderLeftColor: appt.eventType.color, borderLeftWidth: 3 }}>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#0f172a] truncate">{appt.eventType.title}</p>
                            <p className="text-xs text-[#64748b] flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3" />
                              {formatDate(appt.startAt)} at {formatTime(appt.startAt)}
                            </p>
                          </div>
                          <Badge variant={APPT_STATUS_VARIANT[appt.status]} className="shrink-0 text-[10px]">
                            {appt.status.charAt(0) + appt.status.slice(1).toLowerCase().replace("_", " ")}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Document Requests */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Document Requests
                  </CardTitle>
                  <Button size="sm" variant="outline" asChild className="h-7 text-xs">
                    <Link href={`/documents/requests/new?clientId=${id}`}>New Request</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {client.documentRequests.length === 0 ? (
                    <p className="text-xs text-[#94a3b8] py-4 text-center">No document requests</p>
                  ) : (
                    <div className="space-y-2">
                      {client.documentRequests.map((req) => (
                        <div key={req.id} className="flex items-center gap-3 rounded-lg border border-[#e2e8f0] px-3 py-2.5">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#0f172a] truncate">{req.title}</p>
                            {req.dueDate && (
                              <p className="text-xs text-[#94a3b8] mt-0.5">Due {formatDate(req.dueDate)}</p>
                            )}
                          </div>
                          <Badge variant={req.fulfilled ? "success" : "warning"} className="shrink-0 text-[10px]">
                            {req.fulfilled ? "Fulfilled" : "Pending"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {client.documents.length === 0 ? (
                    <p className="text-xs text-[#94a3b8] py-4 text-center">No documents uploaded yet</p>
                  ) : (
                    <div className="space-y-2">
                      {client.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-3 rounded-lg border border-[#e2e8f0] px-3 py-2.5">
                          <FileText className="h-4 w-4 text-[#94a3b8] shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#0f172a] truncate">{doc.name}</p>
                            {doc.folder && <p className="text-xs text-[#94a3b8]">{doc.folder.name}</p>}
                          </div>
                          <Badge variant="secondary" className="shrink-0 text-[10px]">{doc.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
