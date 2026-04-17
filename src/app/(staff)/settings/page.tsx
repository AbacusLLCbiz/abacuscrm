"use client"

import { useState, useEffect } from "react"
import { TopBar } from "@/shared/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Users, Key, FolderOpen, Loader2, Check } from "lucide-react"

const TIMEZONES = [
  // US
  { value: "America/New_York",     label: "Eastern Time (ET) — New York" },
  { value: "America/Chicago",      label: "Central Time (CT) — Chicago" },
  { value: "America/Denver",       label: "Mountain Time (MT) — Denver" },
  { value: "America/Phoenix",      label: "Mountain Time — Phoenix (no DST)" },
  { value: "America/Los_Angeles",  label: "Pacific Time (PT) — Los Angeles" },
  { value: "America/Anchorage",    label: "Alaska Time — Anchorage" },
  { value: "Pacific/Honolulu",     label: "Hawaii Time — Honolulu" },
  // Canada / Mexico
  { value: "America/Toronto",      label: "Eastern Time — Toronto" },
  { value: "America/Vancouver",    label: "Pacific Time — Vancouver" },
  { value: "America/Mexico_City",  label: "Central Time — Mexico City" },
  // Latin America
  { value: "America/Bogota",       label: "Colombia Time — Bogotá" },
  { value: "America/Lima",         label: "Peru Time — Lima" },
  { value: "America/Santiago",     label: "Chile Time — Santiago" },
  { value: "America/Sao_Paulo",    label: "Brasília Time — São Paulo" },
  { value: "America/Buenos_Aires", label: "Argentina Time — Buenos Aires" },
  // Europe
  { value: "Europe/London",        label: "GMT/BST — London" },
  { value: "Europe/Paris",         label: "CET/CEST — Paris" },
  { value: "Europe/Berlin",        label: "CET/CEST — Berlin" },
  { value: "Europe/Madrid",        label: "CET/CEST — Madrid" },
  { value: "Europe/Rome",          label: "CET/CEST — Rome" },
  // Asia / Pacific
  { value: "Asia/Dubai",           label: "Gulf Time — Dubai" },
  { value: "Asia/Kolkata",         label: "India Standard Time — Mumbai" },
  { value: "Asia/Singapore",       label: "Singapore Time" },
  { value: "Asia/Tokyo",           label: "Japan Standard Time — Tokyo" },
  { value: "Australia/Sydney",     label: "AEST/AEDT — Sydney" },
  { value: "Pacific/Auckland",     label: "NZST/NZDT — Auckland" },
  // UTC
  { value: "UTC",                  label: "UTC" },
]

export default function SettingsPage() {
  const [timezone, setTimezone] = useState("America/New_York")
  const [firmName, setFirmName] = useState("Abacus Accounting")
  const [fromEmail, setFromEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.timezone) setTimezone(d.timezone)
        if (d.firmName) setFirmName(d.firmName)
        if (d.fromEmail) setFromEmail(d.fromEmail)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timezone, firmName, fromEmail: fromEmail || undefined }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <>
      <TopBar title="Settings" subtitle="Configure your CRM" />
      <main className="flex-1 overflow-y-auto p-6 max-w-4xl">
        <div className="space-y-6">

          {/* Firm Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#1e40af]" />
                <CardTitle className="text-sm">Firm Information</CardTitle>
              </div>
              <CardDescription>Your accounting firm&apos;s details used in emails and client portal</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-4 text-sm text-[#94a3b8]">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                </div>
              ) : (
                <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Firm Name</Label>
                    <Input value={firmName} onChange={(e) => setFirmName(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>From Email</Label>
                    <Input type="email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} placeholder="noreply@yourfirm.com" />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label>Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-[#94a3b8]">
                      All appointment times and date displays across the CRM will use this timezone.
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" size="sm" disabled={saving} className="gap-2">
                      {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : null}
                      {saved ? "Saved!" : "Save Changes"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Staff Users */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#1e40af]" />
                <CardTitle className="text-sm">Staff Users</CardTitle>
              </div>
              <CardDescription>Manage staff accounts and roles. Staff use email + SMS OTP to sign in.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-[#e2e8f0] divide-y divide-[#e2e8f0]">
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-[#64748b]">admin@abacus.com · Admin</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-3">
                <Users className="h-3.5 w-3.5" /> Invite Staff Member
              </Button>
            </CardContent>
          </Card>

          {/* Document Folders */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-[#1e40af]" />
                <CardTitle className="text-sm">Document Folders</CardTitle>
              </div>
              <CardDescription>Customize the folder categories for client documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-3">
                {["Tax Returns", "W-2 / 1099s", "Financial Statements", "Contracts & Agreements", "Bank Statements", "Correspondence"].map((f) => (
                  <div key={f} className="flex items-center justify-between rounded-md border border-[#e2e8f0] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#1e40af]" />
                      <span className="text-sm">{f}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs h-7">Edit</Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm">
                <FolderOpen className="h-3.5 w-3.5" /> Add Folder
              </Button>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-[#1e40af]" />
                <CardTitle className="text-sm">Integrations</CardTitle>
              </div>
              <CardDescription>API keys and third-party connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Resend (Email)", key: "RESEND_API_KEY", status: "Not configured" },
                { name: "Twilio (SMS & Voice)", key: "TWILIO_*", status: "Not configured" },
                { name: "Cloudflare R2 (Documents)", key: "R2_*", status: "Not configured" },
                { name: "Google Calendar", key: "OAuth", status: "Not connected" },
              ].map((i) => (
                <div key={i.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{i.name}</p>
                    <p className="text-xs text-[#94a3b8]">{i.status}</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </main>
    </>
  )
}
