"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Save, MapPin, Video, Phone } from "lucide-react"
import Link from "next/link"

const MEETING_TYPES = [
  { value: "IN_PERSON", label: "In Person", icon: MapPin },
  { value: "ZOOM", label: "Zoom", icon: Video },
  { value: "GOOGLE_MEET", label: "Google Meet", icon: Video },
  { value: "PHONE", label: "Phone", icon: Phone },
]

const COLORS = [
  "#1E40AF", "#0891b2", "#7c3aed", "#16a34a", "#ca8a04", "#dc2626", "#db2777",
]

const DURATIONS = [15, 30, 45, 60, 90, 120]

export default function NewEventTypePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState(60)
  const [color, setColor] = useState("#1E40AF")
  const [meetingTypes, setMeetingTypes] = useState<string[]>(["IN_PERSON"])
  const [buffer, setBuffer] = useState(15)
  const [requiresConfirmation, setRequiresConfirmation] = useState(false)
  const [locationDetails, setLocationDetails] = useState("")
  const [zoomLink, setZoomLink] = useState("")
  const [googleMeetLink, setGoogleMeetLink] = useState("")

  const handleTitleChange = (val: string) => {
    setTitle(val)
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
  }

  const toggleMeetingType = (val: string) => {
    setMeetingTypes((prev) =>
      prev.includes(val) ? prev.filter((t) => t !== val) : [...prev, val]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (meetingTypes.length === 0) { setError("Select at least one meeting type."); return }
    setLoading(true)
    setError("")

    const payload: Record<string, unknown> = {
      title, slug, description: description || undefined,
      durationMinutes: duration, color, meetingTypes,
      bufferMinutes: buffer, requiresConfirmation,
      locationDetails: locationDetails || undefined,
      zoomLink: zoomLink || undefined,
      googleMeetLink: googleMeetLink || undefined,
    }

    const res = await fetch("/api/event-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Please fix the errors below.")
      return
    }

    router.push("/scheduler")
  }

  return (
    <>
      <TopBar
        title="New Event Type"
        subtitle="Configure a bookable appointment type"
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/scheduler"><ArrowLeft className="h-4 w-4" /> Back</Link>
          </Button>
        }
      />
      <main className="flex-1 overflow-y-auto p-8">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>
          )}

          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                <Input id="title" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Tax Consultation" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug <span className="text-red-500">*</span></Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#94a3b8]">/book/</span>
                  <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="tax-consultation" pattern="[a-z0-9-]+" required />
                </div>
                <p className="text-xs text-[#94a3b8]">Lowercase letters, numbers, and hyphens only.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[80px] rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e40af] resize-y"
                  placeholder="What is this appointment for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Duration & Buffer</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Duration</Label>
                <div className="flex flex-wrap gap-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${
                        duration === d
                          ? "border-[#1e40af] bg-[#eff6ff] text-[#1e40af]"
                          : "border-[#e2e8f0] text-[#64748b] hover:border-[#1e40af]"
                      }`}
                    >
                      {d < 60 ? `${d} min` : `${d / 60}h`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="buffer">Buffer time after appointment</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="buffer"
                    type="number"
                    min={0}
                    max={60}
                    value={buffer}
                    onChange={(e) => setBuffer(Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-sm text-[#64748b]">minutes</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="confirmation"
                  type="checkbox"
                  checked={requiresConfirmation}
                  onChange={(e) => setRequiresConfirmation(e.target.checked)}
                  className="h-4 w-4 rounded border-[#e2e8f0] text-[#1e40af]"
                />
                <Label htmlFor="confirmation" className="cursor-pointer">Require manual confirmation before booking is confirmed</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Meeting Types</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {MEETING_TYPES.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => toggleMeetingType(m.value)}
                    className={`flex items-center gap-3 rounded-xl border-2 p-4 text-sm font-medium transition-colors text-left ${
                      meetingTypes.includes(m.value)
                        ? "border-[#1e40af] bg-[#eff6ff] text-[#1e40af]"
                        : "border-[#e2e8f0] text-[#64748b] hover:border-[#1e40af]"
                    }`}
                  >
                    <m.icon className="h-4 w-4 shrink-0" />
                    {m.label}
                  </button>
                ))}
              </div>
              {meetingTypes.includes("IN_PERSON") && (
                <div className="space-y-2">
                  <Label htmlFor="locationDetails">Location / Address</Label>
                  <Input id="locationDetails" value={locationDetails} onChange={(e) => setLocationDetails(e.target.value)} placeholder="123 Main St, Des Moines, IA" />
                </div>
              )}
              {meetingTypes.includes("ZOOM") && (
                <div className="space-y-2">
                  <Label htmlFor="zoomLink">Zoom Link</Label>
                  <Input id="zoomLink" value={zoomLink} onChange={(e) => setZoomLink(e.target.value)} placeholder="https://zoom.us/j/..." />
                </div>
              )}
              {meetingTypes.includes("GOOGLE_MEET") && (
                <div className="space-y-2">
                  <Label htmlFor="googleMeetLink">Google Meet Link</Label>
                  <Input id="googleMeetLink" value={googleMeetLink} onChange={(e) => setGoogleMeetLink(e.target.value)} placeholder="https://meet.google.com/..." />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Color</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-9 w-9 rounded-full transition-all ${color === c ? "ring-2 ring-offset-2 ring-[#1e40af] scale-110" : "hover:scale-105"}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Event Type
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/scheduler">Cancel</Link>
            </Button>
          </div>
        </form>
      </main>
    </>
  )
}
