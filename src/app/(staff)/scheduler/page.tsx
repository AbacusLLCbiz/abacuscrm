"use client"

import { useState, useEffect, useCallback } from "react"
import { useTimezone } from "@/app/providers"
import { fmtTime, fmtDateKey } from "@/lib/format-time"
import { TopBar } from "@/shared/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus, Calendar, Clock, Video, Phone, MapPin, Settings,
  CheckCircle2, XCircle, Copy, ExternalLink, Loader2, Users, LogIn
} from "lucide-react"
import Link from "next/link"

// ─── Types ───────────────────────────────────────────────────────────────────

type MeetingType = "IN_PERSON" | "ZOOM" | "GOOGLE_MEET" | "PHONE"
type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW"

interface Appointment {
  id: string
  startAt: string
  endAt: string
  status: AppointmentStatus
  meetingType: MeetingType
  notes?: string
  checkedInAt?: string | null
  client: { firstName: string; lastName: string; email: string; phone?: string }
  eventType: { title: string; color: string; durationMinutes: number }
  staffUser: { name: string | null }
}

interface EventType {
  id: string
  slug: string
  title: string
  durationMinutes: number
  color: string
  isActive: boolean
  meetingTypes: MeetingType[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MEETING_ICONS: Record<MeetingType, React.ElementType> = {
  IN_PERSON: MapPin,
  ZOOM: Video,
  GOOGLE_MEET: Video,
  PHONE: Phone,
}

const MEETING_LABELS: Record<MeetingType, string> = {
  IN_PERSON: "In Person",
  ZOOM: "Zoom",
  GOOGLE_MEET: "Google Meet",
  PHONE: "Phone",
}

const STATUS_VARIANT: Record<AppointmentStatus, "warning" | "success" | "secondary" | "cobalt" | "destructive"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "secondary",
  COMPLETED: "cobalt",
  NO_SHOW: "destructive",
}

function groupByDate(appointments: Appointment[], tz: string) {
  const groups: Record<string, Appointment[]> = {}
  for (const appt of appointments) {
    const dateKey = fmtDateKey(appt.startAt, tz)
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(appt)
  }
  return Object.entries(groups)
}

function formatTime(iso: string, tz: string) {
  return fmtTime(iso, tz)
}

// ─── Appointment Card ─────────────────────────────────────────────────────────

function AppointmentCard({
  appt,
  tz,
  onStatusChange,
  onCheckIn,
}: {
  appt: Appointment
  tz: string
  onStatusChange: (id: string, status: AppointmentStatus) => Promise<void>
  onCheckIn: (id: string) => Promise<void>
}) {
  const [loading, setLoading] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const MeetingIcon = MEETING_ICONS[appt.meetingType]

  const handleStatus = async (status: AppointmentStatus) => {
    setLoading(true)
    await onStatusChange(appt.id, status)
    setLoading(false)
  }

  const handleCheckIn = async () => {
    setCheckingIn(true)
    await onCheckIn(appt.id)
    setCheckingIn(false)
  }

  const isCheckedIn = !!appt.checkedInAt

  return (
    <div
      className="flex gap-0 rounded-xl border border-[#e2e8f0] bg-white overflow-hidden hover:shadow-sm transition-shadow"
      style={{ borderLeftColor: appt.eventType.color, borderLeftWidth: 4 }}
    >
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-semibold text-sm text-[#0f172a]">
              {appt.client.firstName} {appt.client.lastName}
            </p>
            <p className="text-xs text-[#64748b]">{appt.client.email}</p>
            <p className="text-xs text-[#94a3b8] mt-1">{appt.eventType.title}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isCheckedIn && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                <LogIn className="h-2.5 w-2.5" /> Checked In
              </span>
            )}
            <Badge variant={STATUS_VARIANT[appt.status]}>
              {appt.status.charAt(0) + appt.status.slice(1).toLowerCase().replace("_", " ")}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-[#64748b]">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(appt.startAt, tz)} – {formatTime(appt.endAt, tz)}
          </span>
          <span className="flex items-center gap-1">
            <MeetingIcon className="h-3 w-3" />
            {MEETING_LABELS[appt.meetingType]}
          </span>
        </div>

        <div className="flex gap-2 mt-3 flex-wrap">
          {/* Check In button — available for confirmed/pending appointments */}
          {(appt.status === "PENDING" || appt.status === "CONFIRMED") && !isCheckedIn && (
            <Button
              size="sm"
              className="h-7 text-xs gap-1 bg-[#1e40af] hover:bg-[#1e3a8a]"
              disabled={checkingIn}
              onClick={handleCheckIn}
            >
              {checkingIn ? <Loader2 className="h-3 w-3 animate-spin" /> : <LogIn className="h-3 w-3" />}
              Check In
            </Button>
          )}
          {appt.status === "PENDING" && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1 text-green-700 border-green-200 hover:bg-green-50"
              disabled={loading}
              onClick={() => handleStatus("CONFIRMED")}
            >
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
              Confirm
            </Button>
          )}
          {(appt.status === "PENDING" || appt.status === "CONFIRMED") && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50"
              disabled={loading}
              onClick={() => handleStatus("CANCELLED")}
            >
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SchedulerPage() {
  const tz = useTimezone()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [loadingAppts, setLoadingAppts] = useState(true)
  const [loadingETs, setLoadingETs] = useState(true)
  const [apiError, setApiError] = useState(false)

  const fetchAppointments = useCallback(async () => {
    setLoadingAppts(true)
    setApiError(false)
    try {
      const res = await fetch("/api/appointments")
      if (res.ok) {
        setAppointments(await res.json())
      } else {
        setApiError(true)
      }
    } catch {
      setApiError(true)
    } finally {
      setLoadingAppts(false)
    }
  }, [])

  useEffect(() => {
    fetchAppointments()
    fetch("/api/event-types")
      .then(async (r) => { if (r.ok) setEventTypes(await r.json()) })
      .finally(() => setLoadingETs(false))
  }, [fetchAppointments])

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    await fetchAppointments()
  }

  const handleCheckIn = async (id: string) => {
    await fetch(`/api/appointments/${id}/check-in`, { method: "POST" })
    await fetchAppointments()
  }

  const grouped = groupByDate(appointments, tz)

  return (
    <>
      <TopBar
        title="Scheduler"
        subtitle="Manage appointments"
        actions={
          <Button asChild size="sm">
            <Link href="/scheduler/event-types/new">
              <Plus className="h-4 w-4" />
              New Event Type
            </Link>
          </Button>
        }
      />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ── Appointments ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#0f172a]">Upcoming Appointments</h2>
              <Link href="/scheduler/event-types" className="text-xs text-[#1e40af] hover:underline flex items-center gap-1">
                <Settings className="h-3 w-3" /> Manage Event Types
              </Link>
            </div>

            {loadingAppts ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-[#94a3b8]" />
              </div>
            ) : apiError ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Calendar className="h-12 w-12 text-[#bfdbfe] mb-4" />
                  <p className="text-sm font-semibold text-[#64748b]">Could not load appointments</p>
                  <p className="text-xs text-[#94a3b8] mt-1 mb-4">
                    The scheduler data may still be syncing. Please refresh the page.
                  </p>
                  <Button variant="outline" size="sm" onClick={fetchAppointments}>
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : grouped.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Calendar className="h-12 w-12 text-[#bfdbfe] mb-4" />
                  <p className="text-sm font-semibold text-[#64748b]">No upcoming appointments</p>
                  <p className="text-xs text-[#94a3b8] mt-1 mb-4">
                    Share your booking link to start receiving appointments
                  </p>
                  {eventTypes.length > 0 && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/book/${eventTypes[0].slug}`} target="_blank">
                        <ExternalLink className="h-3.5 w-3.5" /> View Booking Page
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              grouped.map(([date, appts]) => (
                <div key={date}>
                  <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">{date}</p>
                  <div className="space-y-3">
                    {appts.map((appt) => (
                      <AppointmentCard key={appt.id} appt={appt} tz={tz} onStatusChange={handleStatusChange} onCheckIn={handleCheckIn} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── Event Types Sidebar ── */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-semibold">Event Types</CardTitle>
                <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0">
                  <Link href="/scheduler/event-types"><Settings className="h-3.5 w-3.5" /></Link>
                </Button>
              </CardHeader>
              <CardContent>
                {loadingETs ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin text-[#94a3b8]" />
                  </div>
                ) : eventTypes.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-xs text-[#94a3b8]">No event types yet</p>
                    <Button variant="outline" size="sm" className="mt-3" asChild>
                      <Link href="/scheduler/event-types/new"><Plus className="h-3.5 w-3.5" /> Create one</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {eventTypes.map((et) => (
                      <div
                        key={et.id}
                        className="rounded-lg border border-[#e2e8f0] p-3 hover:border-[#1e40af] hover:bg-[#eff6ff] transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 mb-1">
                          <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: et.color }} />
                          <p className="text-xs font-semibold text-[#0f172a] flex-1 truncate">{et.title}</p>
                          {!et.isActive && <Badge variant="secondary" className="text-[9px] px-1.5 py-0">Inactive</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#94a3b8] ml-5">
                          <Clock className="h-2.5 w-2.5" /> {et.durationMinutes} min
                          <span className="text-[#e2e8f0]">·</span>
                          {et.meetingTypes.map((mt) => MEETING_LABELS[mt]).join(", ")}
                        </div>
                        <div className="flex items-center gap-2 mt-2 ml-5">
                          <Link
                            href={`/book/${et.slug}`}
                            target="_blank"
                            className="text-[10px] text-[#1e40af] hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-2.5 w-2.5" /> Book
                          </Link>
                          <Link
                            href={`/scheduler/event-types/${et.id}/edit`}
                            className="text-[10px] text-[#64748b] hover:text-[#1e40af] hover:underline"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button variant="outline" size="sm" className="w-full mt-3 text-xs" asChild>
                  <Link href="/scheduler/event-types/new">
                    <Plus className="h-3.5 w-3.5" /> Add Event Type
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Availability link */}
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#eff6ff] flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-[#1e40af]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#0f172a]">Availability</p>
                    <p className="text-[10px] text-[#94a3b8]">Set your working hours</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                    <Link href="/scheduler/availability">Configure</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            {appointments.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-[#64748b]">This Week</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(["PENDING", "CONFIRMED", "COMPLETED"] as AppointmentStatus[]).map((s) => {
                    const count = appointments.filter((a) => a.status === s).length
                    return (
                      <div key={s} className="flex items-center justify-between text-xs">
                        <span className="text-[#64748b] capitalize">{s.toLowerCase()}</span>
                        <Badge variant={STATUS_VARIANT[s]}>{count}</Badge>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
