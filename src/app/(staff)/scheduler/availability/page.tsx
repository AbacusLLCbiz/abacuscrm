"use client"

import { useState, useEffect, useCallback } from "react"
import { TopBar } from "@/shared/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, Clock } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface EventType {
  id: string
  slug: string
  title: string
  color: string
}

interface AvailabilityRecord {
  id?: string
  dayOfWeek: number
  startTime: string
  endTime: string
  timezone: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAYS = [
  { label: "Sunday", short: "Sun", value: 0 },
  { label: "Monday", short: "Mon", value: 1 },
  { label: "Tuesday", short: "Tue", value: 2 },
  { label: "Wednesday", short: "Wed", value: 3 },
  { label: "Thursday", short: "Thu", value: 4 },
  { label: "Friday", short: "Fri", value: 5 },
  { label: "Saturday", short: "Sat", value: 6 },
]

// Generate time options in 30-min increments from 7:00am–9:00pm
function generateTimeOptions(): string[] {
  const times: string[] = []
  for (let h = 7; h <= 21; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 21 && m > 0) break
      const hh = h.toString().padStart(2, "0")
      const mm = m.toString().padStart(2, "0")
      times.push(`${hh}:${mm}`)
    }
  }
  return times
}

function formatDisplayTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  const ampm = h >= 12 ? "PM" : "AM"
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`
}

const TIME_OPTIONS = generateTimeOptions()

const DEFAULT_AVAILABILITY: Record<number, { enabled: boolean; startTime: string; endTime: string }> = {
  0: { enabled: false, startTime: "09:00", endTime: "17:00" },
  1: { enabled: true, startTime: "09:00", endTime: "17:00" },
  2: { enabled: true, startTime: "09:00", endTime: "17:00" },
  3: { enabled: true, startTime: "09:00", endTime: "17:00" },
  4: { enabled: true, startTime: "09:00", endTime: "17:00" },
  5: { enabled: true, startTime: "09:00", endTime: "17:00" },
  6: { enabled: false, startTime: "09:00", endTime: "17:00" },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AvailabilityPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [selectedEventTypeId, setSelectedEventTypeId] = useState<string | null>(null)
  const [schedule, setSchedule] = useState(structuredClone(DEFAULT_AVAILABILITY))
  const [timezone, setTimezone] = useState("America/New_York")
  const [loadingETs, setLoadingETs] = useState(true)
  const [loadingAvail, setLoadingAvail] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Fetch event types on mount
  useEffect(() => {
    fetch("/api/event-types")
      .then((r) => r.json())
      .then((data: EventType[]) => {
        setEventTypes(data)
        if (data.length > 0) setSelectedEventTypeId(data[0].id)
      })
      .finally(() => setLoadingETs(false))
  }, [])

  // Fetch availability when event type changes
  const fetchAvailability = useCallback(async (etId: string) => {
    setLoadingAvail(true)
    try {
      const res = await fetch(`/api/availability?eventTypeId=${etId}`)
      if (!res.ok) return
      const records: AvailabilityRecord[] = await res.json()

      // Start from defaults, then overlay DB records
      const newSchedule = structuredClone(DEFAULT_AVAILABILITY)
      for (const r of records) {
        newSchedule[r.dayOfWeek] = {
          enabled: true,
          startTime: r.startTime,
          endTime: r.endTime,
        }
        if (r.timezone) setTimezone(r.timezone)
      }
      setSchedule(newSchedule)
    } finally {
      setLoadingAvail(false)
    }
  }, [])

  useEffect(() => {
    if (selectedEventTypeId) fetchAvailability(selectedEventTypeId)
  }, [selectedEventTypeId, fetchAvailability])

  const handleToggleDay = (day: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }))
  }

  const handleTimeChange = (day: number, field: "startTime" | "endTime", value: string) => {
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }))
  }

  const handleSave = async () => {
    if (!selectedEventTypeId) return
    setSaving(true)
    setSaved(false)

    const availability = DAYS.filter((d) => schedule[d.value].enabled).map((d) => ({
      dayOfWeek: d.value,
      startTime: schedule[d.value].startTime,
      endTime: schedule[d.value].endTime,
      timezone,
    }))

    await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventTypeId: selectedEventTypeId, availability }),
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const selectedET = eventTypes.find((et) => et.id === selectedEventTypeId)

  return (
    <>
      <TopBar title="Availability" subtitle="Set your working hours per event type" />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl space-y-6">
          {/* Event type selector */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Event Type</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingETs ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#94a3b8]" />
              ) : eventTypes.length === 0 ? (
                <p className="text-sm text-[#94a3b8]">
                  No event types found.{" "}
                  <a href="/scheduler/event-types/new" className="text-[#1e40af] hover:underline">Create one first.</a>
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map((et) => (
                    <button
                      key={et.id}
                      type="button"
                      onClick={() => setSelectedEventTypeId(et.id)}
                      className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${
                        selectedEventTypeId === et.id
                          ? "border-[#1e40af] bg-[#eff6ff] text-[#1e40af]"
                          : "border-[#e2e8f0] text-[#64748b] hover:border-[#1e40af]"
                      }`}
                    >
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: et.color }} />
                      {et.title}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timezone */}
          {selectedET && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Timezone</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                >
                  {[
                    "America/New_York",
                    "America/Chicago",
                    "America/Denver",
                    "America/Los_Angeles",
                    "America/Phoenix",
                    "Pacific/Honolulu",
                    "America/Anchorage",
                  ].map((tz) => (
                    <option key={tz} value={tz}>{tz.replace("America/", "").replace(/_/g, " ")}</option>
                  ))}
                </select>
              </CardContent>
            </Card>
          )}

          {/* Day grid */}
          {selectedET && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm">
                  Weekly Schedule
                  {selectedET && (
                    <span className="ml-2 font-normal text-[#64748b]">— {selectedET.title}</span>
                  )}
                </CardTitle>
                {loadingAvail && <Loader2 className="h-4 w-4 animate-spin text-[#94a3b8]" />}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {DAYS.map((day) => {
                    const dayState = schedule[day.value]
                    return (
                      <div
                        key={day.value}
                        className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-colors ${
                          dayState.enabled
                            ? "border-[#1e40af] bg-[#eff6ff]"
                            : "border-[#e2e8f0] bg-[#f8fafc]"
                        }`}
                      >
                        {/* Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleDay(day.value)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                            dayState.enabled ? "bg-[#1e40af]" : "bg-[#e2e8f0]"
                          }`}
                          aria-label={`Toggle ${day.label}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                              dayState.enabled ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>

                        {/* Day label */}
                        <span className={`w-20 text-sm font-semibold ${dayState.enabled ? "text-[#1e40af]" : "text-[#94a3b8]"}`}>
                          {day.label}
                        </span>

                        {dayState.enabled ? (
                          <>
                            <div className="flex items-center gap-2">
                              <select
                                value={dayState.startTime}
                                onChange={(e) => handleTimeChange(day.value, "startTime", e.target.value)}
                                className="rounded-lg border border-[#bfdbfe] bg-white px-3 py-1.5 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                              >
                                {TIME_OPTIONS.map((t) => (
                                  <option key={t} value={t}>{formatDisplayTime(t)}</option>
                                ))}
                              </select>
                              <span className="text-sm text-[#64748b]">to</span>
                              <select
                                value={dayState.endTime}
                                onChange={(e) => handleTimeChange(day.value, "endTime", e.target.value)}
                                className="rounded-lg border border-[#bfdbfe] bg-white px-3 py-1.5 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                              >
                                {TIME_OPTIONS.filter((t) => t > dayState.startTime).map((t) => (
                                  <option key={t} value={t}>{formatDisplayTime(t)}</option>
                                ))}
                              </select>
                            </div>
                            <Badge variant="cobalt" className="ml-auto text-[10px]">
                              <Clock className="h-2.5 w-2.5 mr-1" />
                              Available
                            </Badge>
                          </>
                        ) : (
                          <span className="text-sm text-[#94a3b8] ml-2">Unavailable</span>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <Button onClick={handleSave} disabled={saving || !selectedEventTypeId} className="gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Availability
                  </Button>
                  {saved && (
                    <span className="text-sm text-green-600 font-medium">Saved successfully!</span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  )
}
