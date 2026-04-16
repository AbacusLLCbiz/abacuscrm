"use client"

import { useState } from "react"
import { Building2, MapPin, Video, Phone, Calendar, ChevronLeft, ChevronRight, Check, Loader2, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

// ─── Helpers ────────────────────────────────────────────────────────────────

const MEETING_TYPES = [
  { value: "IN_PERSON", label: "In Person", sub: "Our office", icon: MapPin, color: "text-[#1e40af] bg-[#eff6ff]" },
  { value: "ZOOM", label: "Zoom", sub: "Video call link sent by email", icon: Video, color: "text-blue-400 bg-blue-50" },
  { value: "GOOGLE_MEET", label: "Google Meet", sub: "Video call link sent by email", icon: Video, color: "text-green-600 bg-green-50" },
  { value: "PHONE", label: "Phone Call", sub: "We'll call you", icon: Phone, color: "text-[#64748b] bg-[#f1f5f9]" },
]

// Returns Mon–Fri dates for the next 14 days starting tomorrow
function getAvailableDates(): Date[] {
  const dates: Date[] = []
  const d = new Date()
  d.setDate(d.getDate() + 1)
  while (dates.length < 10) {
    const day = d.getDay()
    if (day !== 0 && day !== 6) dates.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return dates
}

// Business hours: 9am–5pm, hourly slots in CT
const SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

function toDatetimeString(date: Date, timeLabel: string): string {
  const [time, ampm] = timeLabel.split(" ")
  const [h, m] = time.split(":").map(Number)
  let hour = h
  if (ampm === "PM" && h !== 12) hour += 12
  if (ampm === "AM" && h === 12) hour = 0
  const d = new Date(date)
  d.setHours(hour, m, 0, 0)
  return d.toISOString()
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
}

function formatMonth(d: Date) {
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

// ─── Page ────────────────────────────────────────────────────────────────────

type Step = "meeting-type" | "date-time" | "info" | "confirmed"

export default function BookingPage({ params }: { params: { slug: string } }) {
  const [step, setStep] = useState<Step>("meeting-type")
  const [meetingType, setMeetingType] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [weekOffset, setWeekOffset] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")

  const allDates = getAvailableDates()
  const visibleDates = allDates.slice(weekOffset * 5, weekOffset * 5 + 5)
  const canGoBack = weekOffset > 0
  const canGoForward = (weekOffset + 1) * 5 < allDates.length

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return
    setLoading(true)
    setError("")

    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: params.slug,
        meetingType,
        startAt: toDatetimeString(selectedDate, selectedTime),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        notes: notes || undefined,
      }),
    })

    setLoading(false)
    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? "Something went wrong. Please try again.")
      return
    }
    setStep("confirmed")
  }

  const stepIndex = ["meeting-type", "date-time", "info"].indexOf(step)

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e40af]">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <div className="leading-none">
              <span className="text-sm font-black text-[#0f172a]">abacus</span>
              <span className="text-sm font-black text-[#1e40af]"> accounting</span>
            </div>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#1e40af] transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to website
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Event info */}
        <div className="mb-10 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e40af] mb-4">
            <Calendar className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-[#0f172a]">Free Consultation</h1>
          <p className="text-[#64748b] mt-2 flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" /> 60 minutes · No charge
          </p>
        </div>

        {/* Progress bar */}
        {step !== "confirmed" && (
          <div className="flex items-center justify-center gap-3 mb-10">
            {["Meeting Type", "Date & Time", "Your Info"].map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 text-sm font-medium ${i <= stepIndex ? "text-[#1e40af]" : "text-[#94a3b8]"}`}>
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${i < stepIndex ? "bg-[#1e40af] text-white" : i === stepIndex ? "border-2 border-[#1e40af] text-[#1e40af]" : "border-2 border-[#e2e8f0] text-[#94a3b8]"}`}>
                    {i < stepIndex ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < 2 && <div className={`h-px w-8 ${i < stepIndex ? "bg-[#1e40af]" : "bg-[#e2e8f0]"}`} />}
              </div>
            ))}
          </div>
        )}

        {/* ── Step 1: Meeting Type ─────────────────────────────────────── */}
        {step === "meeting-type" && (
          <div className="max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-[#0f172a] mb-6 text-center">How would you like to meet?</h2>
            <div className="space-y-3">
              {MEETING_TYPES.map((m) => (
                <button
                  key={m.value}
                  onClick={() => { setMeetingType(m.value); setStep("date-time") }}
                  className="w-full flex items-center gap-4 rounded-xl border-2 border-[#e2e8f0] bg-white p-5 text-left hover:border-[#1e40af] hover:bg-[#eff6ff] transition-all group"
                >
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${m.color}`}>
                    <m.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0f172a] group-hover:text-[#1e40af]">{m.label}</p>
                    <p className="text-sm text-[#64748b]">{m.sub}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#94a3b8] ml-auto group-hover:text-[#1e40af]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Date & Time ──────────────────────────────────────── */}
        {step === "date-time" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-[#0f172a] mb-6 text-center">Pick a date and time</h2>

            {/* Week nav */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => { setWeekOffset(w => w - 1); setSelectedDate(null); setSelectedTime("") }} disabled={!canGoBack} className="p-2 rounded-lg hover:bg-white border border-[#e2e8f0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="h-4 w-4 text-[#64748b]" />
              </button>
              <p className="text-sm font-semibold text-[#64748b]">{formatMonth(visibleDates[0])}</p>
              <button onClick={() => { setWeekOffset(w => w + 1); setSelectedDate(null); setSelectedTime("") }} disabled={!canGoForward} className="p-2 rounded-lg hover:bg-white border border-[#e2e8f0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="h-4 w-4 text-[#64748b]" />
              </button>
            </div>

            {/* Date grid */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {visibleDates.map((d) => {
                const isSelected = selectedDate?.toDateString() === d.toDateString()
                return (
                  <button
                    key={d.toISOString()}
                    onClick={() => { setSelectedDate(d); setSelectedTime("") }}
                    className={`rounded-xl border-2 p-3 text-center transition-all ${isSelected ? "border-[#1e40af] bg-[#1e40af] text-white" : "border-[#e2e8f0] bg-white hover:border-[#1e40af] text-[#0f172a]"}`}
                  >
                    <p className="text-xs font-medium">{d.toLocaleDateString("en-US", { weekday: "short" })}</p>
                    <p className="text-lg font-black mt-0.5">{d.getDate()}</p>
                  </button>
                )
              })}
            </div>

            {/* Time slots */}
            {selectedDate && (
              <>
                <p className="text-sm font-semibold text-[#64748b] mb-3">{formatDate(selectedDate)} — Central Time</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-8">
                  {SLOTS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`rounded-lg border-2 py-2.5 text-sm font-semibold transition-all ${selectedTime === t ? "border-[#1e40af] bg-[#1e40af] text-white" : "border-[#e2e8f0] bg-white hover:border-[#1e40af] text-[#0f172a]"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("meeting-type")} className="gap-2">
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <Button onClick={() => setStep("info")} disabled={!selectedDate || !selectedTime} className="flex-1">
                Continue →
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Info ─────────────────────────────────────────────── */}
        {step === "info" && (
          <div className="max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-[#0f172a] mb-2 text-center">Your information</h2>

            {/* Summary */}
            <div className="rounded-xl border border-[#bfdbfe] bg-[#eff6ff] p-4 mb-6 text-sm text-[#1e40af]">
              <p className="font-semibold">{MEETING_TYPES.find(m => m.value === meetingType)?.label}</p>
              <p>{selectedDate && formatDate(selectedDate)} at {selectedTime} CT</p>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 mb-4">{error}</div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First name <span className="text-red-500">*</span></Label>
                  <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last name <span className="text-red-500">*</span></Label>
                  <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(515) 000-0000" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes">Anything you&apos;d like us to know?</Label>
                <textarea
                  id="notes"
                  className="w-full min-h-[80px] rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e40af] resize-none"
                  placeholder="e.g. I'm a small business owner looking for tax help..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep("date-time")} className="gap-2">
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <Button
                onClick={handleBook}
                disabled={loading || !firstName || !lastName || !email}
                className="flex-1 gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Confirm Booking <Check className="h-4 w-4" /></>}
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 4: Confirmed ────────────────────────────────────────── */}
        {step === "confirmed" && (
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-[#0f172a] mb-3">You&apos;re booked!</h2>
            <p className="text-[#475569] mb-2">
              We&apos;ve received your request for a <strong>Free Consultation</strong>.
            </p>
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 my-6 text-left space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-[#1e40af]" />
                <span className="font-medium text-[#0f172a]">{selectedDate && formatDate(selectedDate)} at {selectedTime} CT</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                {(() => { const m = MEETING_TYPES.find(m => m.value === meetingType); return m ? <><m.icon className="h-4 w-4 text-[#1e40af]" /><span className="font-medium text-[#0f172a]">{m.label}</span></> : null })()}
              </div>
              <div className="flex items-center gap-3 text-sm text-[#64748b]">
                <span>A confirmation will be sent to <strong className="text-[#0f172a]">{email}</strong></span>
              </div>
            </div>
            <p className="text-sm text-[#64748b] mb-6">
              We&apos;ll confirm your appointment within 24 hours. Questions? Call us at{" "}
              <a href="tel:+15152007831" className="text-[#1e40af] font-semibold">(515) 200-7831</a>.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1e40af] hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to website
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
