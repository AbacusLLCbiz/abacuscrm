"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  CalendarDays,
  FileText,
  FolderOpen,
  MapPin,
  Video,
  Phone,
  ExternalLink,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// ─── Types ────────────────────────────────────────────────────────────────────

interface EventType {
  id: string
  title: string
  color: string | null
}

interface Appointment {
  id: string
  startAt: string
  endAt: string
  meetingType: "IN_PERSON" | "ZOOM" | "GOOGLE_MEET" | "PHONE"
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW"
  eventType: EventType
}

interface DocumentRequest {
  id: string
  title: string
  dueDate: string | null
  fulfilled: boolean
  createdAt: string
}

interface ClientData {
  id: string
  firstName: string
  lastName: string
  status: "ACTIVE" | "INACTIVE" | "PROSPECT"
  entityType: string | null
  appointments: Appointment[]
  documentRequests: DocumentRequest[]
  documents: unknown[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusBadgeVariant(
  status: Appointment["status"]
): "success" | "cobalt" | "destructive" | "secondary" | "warning" {
  switch (status) {
    case "CONFIRMED":
      return "success"
    case "PENDING":
      return "cobalt"
    case "CANCELLED":
      return "destructive"
    case "COMPLETED":
      return "secondary"
    case "NO_SHOW":
      return "warning"
  }
}

function clientStatusVariant(
  s: ClientData["status"]
): "success" | "secondary" | "warning" {
  switch (s) {
    case "ACTIVE":
      return "success"
    case "INACTIVE":
      return "secondary"
    case "PROSPECT":
      return "warning"
  }
}

function formatEntityType(e: string | null): string {
  if (!e) return ""
  return e
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function MeetingIcon({ type }: { type: Appointment["meetingType"] }) {
  switch (type) {
    case "IN_PERSON":
      return <MapPin className="h-4 w-4 text-[#64748b]" />
    case "ZOOM":
    case "GOOGLE_MEET":
      return <Video className="h-4 w-4 text-[#64748b]" />
    case "PHONE":
      return <Phone className="h-4 w-4 text-[#64748b]" />
  }
}

function meetingLabel(type: Appointment["meetingType"]): string {
  switch (type) {
    case "IN_PERSON":
      return "In Person"
    case "ZOOM":
      return "Zoom"
    case "GOOGLE_MEET":
      return "Google Meet"
    case "PHONE":
      return "Phone"
  }
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortalDashboardPage() {
  const [client, setClient] = useState<ClientData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/portal/me")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load your profile.")
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
        <p className="text-[#64748b] text-sm">{error || "Could not load your portal."}</p>
      </div>
    )
  }

  const now = new Date()
  const upcomingAppointments = client.appointments.filter(
    (a) => new Date(a.startAt) >= now && a.status !== "CANCELLED"
  )
  const pendingRequests = client.documentRequests.filter((r) => !r.fulfilled)

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">
            Welcome back, {client.firstName}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant={clientStatusVariant(client.status)}>
              {client.status.charAt(0) + client.status.slice(1).toLowerCase()}
            </Badge>
            {client.entityType && (
              <Badge variant="outline">{formatEntityType(client.entityType)}</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dbeafe]">
              <CalendarDays className="h-6 w-6 text-[#1e40af]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0f172a]">{upcomingAppointments.length}</p>
              <p className="text-sm text-[#64748b]">Upcoming appointments</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
              <FileText className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0f172a]">{pendingRequests.length}</p>
              <p className="text-sm text-[#64748b]">Pending document requests</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <FolderOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0f172a]">{client.documents.length}</p>
              <p className="text-sm text-[#64748b]">Documents on file</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Upcoming Appointments</CardTitle>
            <Link
              href="/portal/appointments"
              className="text-sm text-[#1e40af] hover:underline font-medium"
            >
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {upcomingAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <CalendarDays className="h-8 w-8 text-[#cbd5e1]" />
              <p className="text-sm text-[#64748b]">No upcoming appointments</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#f1f5f9]">
              {upcomingAppointments.map((appt) => (
                <li key={appt.id} className="flex items-center gap-4 py-3">
                  {/* Color bar */}
                  <div
                    className="hidden sm:block h-10 w-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: appt.eventType.color || "#1e40af" }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#0f172a] truncate">
                      {appt.eventType.title}
                    </p>
                    <p className="text-sm text-[#64748b]">{formatDateTime(appt.startAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div
                      className="flex items-center gap-1 text-xs text-[#64748b]"
                      title={meetingLabel(appt.meetingType)}
                    >
                      <MeetingIcon type={appt.meetingType} />
                      <span className="hidden sm:inline">{meetingLabel(appt.meetingType)}</span>
                    </div>
                    <Badge variant={statusBadgeVariant(appt.status)}>
                      {appt.status.charAt(0) + appt.status.slice(1).toLowerCase()}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Document Requests */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Document Requests</CardTitle>
          <p className="text-sm text-[#64748b] mt-1">
            Your accountant will request documents here when needed.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          {client.documentRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <FileText className="h-8 w-8 text-[#cbd5e1]" />
              <p className="text-sm text-[#64748b]">No requests at this time</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#f1f5f9]">
              {client.documentRequests.map((req) => {
                const overdue = !req.fulfilled && isOverdue(req.dueDate)
                return (
                  <li key={req.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[#0f172a] truncate">{req.title}</p>
                      {req.dueDate && (
                        <p
                          className={`text-sm ${overdue ? "text-red-600 font-medium" : "text-[#64748b]"}`}
                        >
                          Due {new Date(req.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          {overdue && " — Overdue"}
                        </p>
                      )}
                    </div>
                    <Badge variant={req.fulfilled ? "success" : "warning"}>
                      {req.fulfilled ? "Fulfilled" : "Pending"}
                    </Badge>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex flex-wrap gap-3">
          <Button asChild>
            <a href="/book/consultation" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Book a Consultation
            </a>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/portal/appointments">
              <CalendarDays className="h-4 w-4 mr-2" />
              View All Appointments
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
