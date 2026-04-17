"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { CalendarDays, MapPin, Video, Phone, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

interface ClientData {
  appointments: Appointment[]
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
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

// ─── Appointment Row ──────────────────────────────────────────────────────────

function AppointmentRow({ appt }: { appt: Appointment }) {
  return (
    <li className="grid grid-cols-[auto_1fr_auto_auto] gap-x-4 items-center py-3 border-b border-[#f1f5f9] last:border-0">
      {/* Color bar */}
      <div
        className="h-10 w-1 rounded-full"
        style={{ backgroundColor: appt.eventType.color || "#1e40af" }}
      />
      {/* Event type + date */}
      <div className="min-w-0">
        <p className="font-medium text-[#0f172a] truncate">{appt.eventType.title}</p>
        <p className="text-sm text-[#64748b]">{formatDateTime(appt.startAt)}</p>
      </div>
      {/* Meeting type */}
      <div className="hidden sm:flex items-center gap-1.5 text-sm text-[#64748b] whitespace-nowrap">
        <MeetingIcon type={appt.meetingType} />
        {meetingLabel(appt.meetingType)}
      </div>
      {/* Status */}
      <Badge variant={statusBadgeVariant(appt.status)}>
        {appt.status.charAt(0) + appt.status.slice(1).toLowerCase()}
      </Badge>
    </li>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortalAppointmentsPage() {
  const [client, setClient] = useState<ClientData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/portal/me")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load appointments.")
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
        <p className="text-[#64748b] text-sm">{error || "Could not load appointments."}</p>
      </div>
    )
  }

  const now = new Date()
  const upcoming = client.appointments
    .filter((a) => new Date(a.startAt) >= now)
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())

  const past = client.appointments
    .filter((a) => new Date(a.startAt) < now)
    .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime())

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a]">Appointments</h1>
        <p className="text-sm text-[#64748b] mt-1">All your scheduled and past appointments.</p>
      </div>

      {/* Upcoming */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#1e40af]" />
            Upcoming
            {upcoming.length > 0 && (
              <span className="ml-1 rounded-full bg-[#dbeafe] px-2 py-0.5 text-xs font-semibold text-[#1e40af]">
                {upcoming.length}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {upcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <CalendarDays className="h-8 w-8 text-[#cbd5e1]" />
              <p className="text-sm text-[#64748b]">No upcoming appointments</p>
            </div>
          ) : (
            <ul>
              {upcoming.map((appt) => (
                <AppointmentRow key={appt.id} appt={appt} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Past */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-[#64748b]">Past Appointments</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {past.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <CalendarDays className="h-8 w-8 text-[#cbd5e1]" />
              <p className="text-sm text-[#64748b]">No past appointments</p>
            </div>
          ) : (
            <ul>
              {past.map((appt) => (
                <AppointmentRow key={appt.id} appt={appt} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
