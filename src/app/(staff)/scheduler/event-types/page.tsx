"use client"

import { useState, useEffect, useCallback } from "react"
import { TopBar } from "@/components/layout/TopBar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus, Clock, Video, Phone, MapPin, Copy, ExternalLink,
  Pencil, Trash2, Loader2, Zap, Check
} from "lucide-react"
import Link from "next/link"

type MeetingType = "IN_PERSON" | "ZOOM" | "GOOGLE_MEET" | "PHONE"

interface EventType {
  id: string
  slug: string
  title: string
  description?: string
  durationMinutes: number
  color: string
  isActive: boolean
  meetingTypes: MeetingType[]
}

const MEETING_LABELS: Record<MeetingType, string> = {
  IN_PERSON: "In Person",
  ZOOM: "Zoom",
  GOOGLE_MEET: "Google Meet",
  PHONE: "Phone",
}

const MEETING_ICONS: Record<MeetingType, React.ElementType> = {
  IN_PERSON: MapPin,
  ZOOM: Video,
  GOOGLE_MEET: Video,
  PHONE: Phone,
}

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchEventTypes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/event-types")
      if (res.ok) setEventTypes(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEventTypes() }, [fetchEventTypes])

  const handleToggleActive = async (et: EventType) => {
    setTogglingId(et.id)
    await fetch(`/api/event-types/${et.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !et.isActive }),
    })
    await fetchEventTypes()
    setTogglingId(null)
  }

  const handleDelete = async (et: EventType) => {
    if (!confirm(`Delete "${et.title}"? This will also delete its availability settings.`)) return
    setDeletingId(et.id)
    await fetch(`/api/event-types/${et.id}`, { method: "DELETE" })
    await fetchEventTypes()
    setDeletingId(null)
  }

  const handleCopyLink = async (slug: string) => {
    const url = `${window.location.origin}/book/${slug}`
    await navigator.clipboard.writeText(url)
    setCopiedId(slug)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <>
      <TopBar
        title="Event Types"
        subtitle="Configure bookable appointment types"
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-[#94a3b8]" />
          </div>
        ) : eventTypes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-14 w-14 rounded-2xl bg-[#eff6ff] flex items-center justify-center mb-4">
                <Zap className="h-7 w-7 text-[#1e40af]" />
              </div>
              <p className="text-sm font-semibold text-[#0f172a] mb-1">No event types yet</p>
              <p className="text-xs text-[#94a3b8] mb-5">
                Create your first event type so clients can book appointments online.
              </p>
              <Button asChild>
                <Link href="/scheduler/event-types/new">
                  <Plus className="h-4 w-4" /> Create your first event type
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {eventTypes.map((et) => (
              <Card key={et.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    {/* Color accent bar */}
                    <div className="w-1.5 shrink-0" style={{ background: et.color }} />

                    <div className="flex flex-1 items-center gap-5 px-5 py-4">
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-[#0f172a]">{et.title}</span>
                          <span className="text-xs text-[#94a3b8]">/{et.slug}</span>
                          <Badge variant={et.isActive ? "success" : "secondary"} className="text-[10px] px-1.5 py-0">
                            {et.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[#64748b]">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {et.durationMinutes} min
                          </span>
                          <div className="flex items-center gap-1.5">
                            {et.meetingTypes.map((mt) => {
                              const Icon = MEETING_ICONS[mt]
                              return (
                                <Badge key={mt} variant="outline" className="text-[10px] gap-1 px-1.5 py-0">
                                  <Icon className="h-2.5 w-2.5" />
                                  {MEETING_LABELS[mt]}
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Copy link */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 text-xs"
                          onClick={() => handleCopyLink(et.slug)}
                        >
                          {copiedId === et.slug
                            ? <><Check className="h-3.5 w-3.5 text-green-600" /> Copied!</>
                            : <><Copy className="h-3.5 w-3.5" /> Copy Link</>
                          }
                        </Button>

                        {/* View booking page */}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                          <Link href={`/book/${et.slug}`} target="_blank">
                            <ExternalLink className="h-3.5 w-3.5 text-[#64748b]" />
                          </Link>
                        </Button>

                        {/* Toggle active */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 text-xs px-3 ${et.isActive ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"}`}
                          disabled={togglingId === et.id}
                          onClick={() => handleToggleActive(et)}
                        >
                          {togglingId === et.id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : et.isActive ? "Deactivate" : "Activate"
                          }
                        </Button>

                        {/* Edit */}
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild>
                          <Link href={`/scheduler/event-types/${et.id}/edit`}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </Button>

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                          disabled={deletingId === et.id}
                          onClick={() => handleDelete(et)}
                        >
                          {deletingId === et.id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <Trash2 className="h-3.5 w-3.5" />
                          }
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
