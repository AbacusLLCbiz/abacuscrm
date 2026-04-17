"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/shared/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Save, Zap } from "lucide-react"
import Link from "next/link"

const TRIGGERS = [
  { value: "CLIENT_CREATED", label: "New Client Created" },
  { value: "APPOINTMENT_BOOKED", label: "Appointment Booked" },
  { value: "APPOINTMENT_CONFIRMED", label: "Appointment Confirmed" },
  { value: "APPOINTMENT_CANCELLED", label: "Appointment Cancelled" },
  { value: "APPOINTMENT_CHECKED_IN", label: "Client Checked In" },
  { value: "APPOINTMENT_REMINDER_24H", label: "24h Before Appointment" },
  { value: "APPOINTMENT_REMINDER_1H", label: "1h Before Appointment" },
  { value: "DOCUMENT_UPLOADED", label: "Document Uploaded" },
  { value: "DOCUMENT_REVIEWED", label: "Document Reviewed" },
  { value: "DOCUMENT_REQUEST_DUE", label: "Document Request Due" },
  { value: "CUSTOM_DATE", label: "Custom Date (days before a date field)" },
]

const ACTIONS = [
  { value: "SEND_EMAIL", label: "Send Email" },
  { value: "SEND_SMS", label: "Send SMS" },
  { value: "REQUEST_DOCUMENTS", label: "Request Documents" },
  { value: "CREATE_REMINDER", label: "Create Reminder" },
  { value: "REQUEST_REVIEW", label: "Request Google Review" },
]

const DATE_FIELDS = [
  { value: "fiscalYearEnd", label: "Fiscal Year End" },
  { value: "customDate", label: "Custom Date" },
]

export default function NewAutomationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [trigger, setTrigger] = useState("")
  const [triggerDaysBefore, setTriggerDaysBefore] = useState(7)
  const [triggerDateField, setTriggerDateField] = useState("fiscalYearEnd")
  const [action, setAction] = useState("")

  // Action config fields
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [emailTo, setEmailTo] = useState("client")
  const [smsBody, setSmsBody] = useState("")
  const [smsTo, setSmsTo] = useState("client")
  const [docTitle, setDocTitle] = useState("")
  const [docDescription, setDocDescription] = useState("")
  const [reminderChannel, setReminderChannel] = useState("EMAIL")
  const [reminderSubject, setReminderSubject] = useState("")
  const [reminderBody, setReminderBody] = useState("")

  // REQUEST_REVIEW config
  const [reviewSubjectEn, setReviewSubjectEn] = useState("How was your visit?")
  const [reviewBodyEn, setReviewBodyEn] = useState("Hi {{firstName}}, thank you for visiting us! Please take a moment to rate your experience.")
  const [reviewSubjectEs, setReviewSubjectEs] = useState("¿Cómo fue su visita?")
  const [reviewBodyEs, setReviewBodyEs] = useState("Hola {{firstName}}, ¡gracias por visitarnos! Por favor, tómese un momento para calificar su experiencia.")
  const [reviewMinRating, setReviewMinRating] = useState(4)
  const [reviewGoogleUrl, setReviewGoogleUrl] = useState("")

  const buildActionConfig = () => {
    switch (action) {
      case "SEND_EMAIL":
        return { subject: emailSubject, body: emailBody, to: emailTo }
      case "SEND_SMS":
        return { body: smsBody, to: smsTo }
      case "REQUEST_DOCUMENTS":
        return { title: docTitle, description: docDescription || undefined }
      case "CREATE_REMINDER":
        return { channel: reminderChannel, subject: reminderSubject || undefined, body: reminderBody }
      case "REQUEST_REVIEW":
        return {
          subject: reviewSubjectEn,
          body: reviewBodyEn,
          subject_es: reviewSubjectEs || undefined,
          body_es: reviewBodyEs || undefined,
          minRating: reviewMinRating,
          googleUrl: reviewGoogleUrl || undefined,
        }
      default:
        return {}
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trigger) { setError("Please select a trigger."); return }
    if (!action) { setError("Please select an action."); return }

    setLoading(true)
    setError("")

    const payload: Record<string, unknown> = {
      name,
      description: description || undefined,
      trigger,
      action,
      actionConfig: buildActionConfig(),
      isActive: true,
    }

    if (trigger === "CUSTOM_DATE") {
      payload.triggerDaysBefore = triggerDaysBefore
      payload.triggerDateField = triggerDateField
    }

    const res = await fetch("/api/automations", {
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

    router.push("/automations")
  }

  return (
    <>
      <TopBar
        title="New Automation"
        subtitle="Set up a trigger and automated action"
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/automations"><ArrowLeft className="h-4 w-4" /> Back</Link>
          </Button>
        }
      />
      <main className="flex-1 overflow-y-auto p-8">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>
          )}

          {/* Basic info */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-4 w-4" /> Automation Details</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Send welcome email to new clients" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional notes about what this automation does" />
              </div>
            </CardContent>
          </Card>

          {/* Trigger */}
          <Card>
            <CardHeader><CardTitle>When this happens… (Trigger)</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Trigger Event <span className="text-red-500">*</span></Label>
                <Select value={trigger} onValueChange={setTrigger}>
                  <SelectTrigger><SelectValue placeholder="Select a trigger" /></SelectTrigger>
                  <SelectContent>
                    {TRIGGERS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {trigger === "CUSTOM_DATE" && (
                <div className="grid grid-cols-2 gap-4 rounded-lg border border-[#e2e8f0] p-4 bg-[#f8fafc]">
                  <div className="space-y-2">
                    <Label htmlFor="daysBefore">Days Before</Label>
                    <Input
                      id="daysBefore"
                      type="number"
                      min={1}
                      max={365}
                      value={triggerDaysBefore}
                      onChange={(e) => setTriggerDaysBefore(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date Field</Label>
                    <Select value={triggerDateField} onValueChange={setTriggerDateField}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DATE_FIELDS.map((f) => (
                          <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action */}
          <Card>
            <CardHeader><CardTitle>Do this… (Action)</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Action Type <span className="text-red-500">*</span></Label>
                <Select value={action} onValueChange={setAction}>
                  <SelectTrigger><SelectValue placeholder="Select an action" /></SelectTrigger>
                  <SelectContent>
                    {ACTIONS.map((a) => (
                      <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* SEND_EMAIL config */}
              {action === "SEND_EMAIL" && (
                <div className="space-y-4 rounded-lg border border-[#e2e8f0] p-4 bg-[#f8fafc]">
                  <div className="space-y-2">
                    <Label>Send To</Label>
                    <Select value={emailTo} onValueChange={setEmailTo}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="staff">Assigned Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailSubject">Subject <span className="text-red-500">*</span></Label>
                    <Input id="emailSubject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="e.g. Your appointment is confirmed" required={action === "SEND_EMAIL"} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailBody">Body <span className="text-red-500">*</span></Label>
                    <textarea
                      id="emailBody"
                      className="w-full min-h-[100px] rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e40af] resize-y"
                      placeholder="Hi {{firstName}}, ..."
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      required={action === "SEND_EMAIL"}
                    />
                    <p className="text-xs text-[#94a3b8]">Use {"{{firstName}}"}, {"{{lastName}}"}, {"{{email}}"} as placeholders.</p>
                  </div>
                </div>
              )}

              {/* SEND_SMS config */}
              {action === "SEND_SMS" && (
                <div className="space-y-4 rounded-lg border border-[#e2e8f0] p-4 bg-[#f8fafc]">
                  <div className="space-y-2">
                    <Label>Send To</Label>
                    <Select value={smsTo} onValueChange={setSmsTo}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="staff">Assigned Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smsBody">Message <span className="text-red-500">*</span></Label>
                    <textarea
                      id="smsBody"
                      className="w-full min-h-[80px] rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e40af] resize-y"
                      placeholder="Hi {{firstName}}, your appointment is tomorrow at..."
                      value={smsBody}
                      onChange={(e) => setSmsBody(e.target.value)}
                      required={action === "SEND_SMS"}
                    />
                    <p className="text-xs text-[#94a3b8]">Keep under 160 characters for a single SMS. Use {"{{firstName}}"}, {"{{lastName}}"} as placeholders.</p>
                  </div>
                </div>
              )}

              {/* REQUEST_DOCUMENTS config */}
              {action === "REQUEST_DOCUMENTS" && (
                <div className="space-y-4 rounded-lg border border-[#e2e8f0] p-4 bg-[#f8fafc]">
                  <div className="space-y-2">
                    <Label htmlFor="docTitle">Request Title <span className="text-red-500">*</span></Label>
                    <Input id="docTitle" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder="e.g. Please upload your W-2 forms" required={action === "REQUEST_DOCUMENTS"} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="docDescription">Instructions (optional)</Label>
                    <textarea
                      id="docDescription"
                      className="w-full min-h-[80px] rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e40af] resize-y"
                      placeholder="Any specific instructions for the client..."
                      value={docDescription}
                      onChange={(e) => setDocDescription(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* REQUEST_REVIEW config */}
              {action === "REQUEST_REVIEW" && (
                <div className="space-y-5 rounded-lg border border-[#e2e8f0] p-4 bg-[#f8fafc]">
                  <p className="text-xs text-[#64748b] font-medium">Sends a bilingual review request email. High ratings are redirected to Google Reviews.</p>

                  {/* English */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-[#0f172a] uppercase tracking-wide">English</p>
                    <div className="space-y-2">
                      <Label htmlFor="reviewSubjectEn">Subject (EN) <span className="text-red-500">*</span></Label>
                      <Input id="reviewSubjectEn" value={reviewSubjectEn} onChange={(e) => setReviewSubjectEn(e.target.value)} required={action === "REQUEST_REVIEW"} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reviewBodyEn">Body (EN) <span className="text-red-500">*</span></Label>
                      <textarea
                        id="reviewBodyEn"
                        className="w-full min-h-[80px] rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e40af] resize-y"
                        value={reviewBodyEn}
                        onChange={(e) => setReviewBodyEn(e.target.value)}
                        required={action === "REQUEST_REVIEW"}
                      />
                    </div>
                  </div>

                  {/* Spanish */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-[#0f172a] uppercase tracking-wide">Spanish (optional)</p>
                    <div className="space-y-2">
                      <Label htmlFor="reviewSubjectEs">Subject (ES)</Label>
                      <Input id="reviewSubjectEs" value={reviewSubjectEs} onChange={(e) => setReviewSubjectEs(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reviewBodyEs">Body (ES)</Label>
                      <textarea
                        id="reviewBodyEs"
                        className="w-full min-h-[80px] rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e40af] resize-y"
                        value={reviewBodyEs}
                        onChange={(e) => setReviewBodyEs(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Gate settings */}
                  <div className="space-y-3 border-t border-[#e2e8f0] pt-4">
                    <p className="text-xs font-semibold text-[#0f172a] uppercase tracking-wide">Review Gate</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reviewMinRating">Minimum rating for Google redirect</Label>
                        <Select value={String(reviewMinRating)} onValueChange={(v) => setReviewMinRating(Number(v))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[3, 4, 5].map((n) => (
                              <SelectItem key={n} value={String(n)}>{n} stars</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reviewGoogleUrl">Google Review URL</Label>
                        <Input
                          id="reviewGoogleUrl"
                          value={reviewGoogleUrl}
                          onChange={(e) => setReviewGoogleUrl(e.target.value)}
                          placeholder="https://g.page/r/..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CREATE_REMINDER config */}
              {action === "CREATE_REMINDER" && (
                <div className="space-y-4 rounded-lg border border-[#e2e8f0] p-4 bg-[#f8fafc]">
                  <div className="space-y-2">
                    <Label>Channel</Label>
                    <Select value={reminderChannel} onValueChange={setReminderChannel}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMAIL">Email</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {reminderChannel === "EMAIL" && (
                    <div className="space-y-2">
                      <Label htmlFor="reminderSubject">Subject</Label>
                      <Input id="reminderSubject" value={reminderSubject} onChange={(e) => setReminderSubject(e.target.value)} placeholder="Reminder subject" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="reminderBody">Message <span className="text-red-500">*</span></Label>
                    <textarea
                      id="reminderBody"
                      className="w-full min-h-[80px] rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e40af] resize-y"
                      placeholder="Hi {{firstName}}, just a reminder that..."
                      value={reminderBody}
                      onChange={(e) => setReminderBody(e.target.value)}
                      required={action === "CREATE_REMINDER"}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Automation
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/automations">Cancel</Link>
            </Button>
          </div>
        </form>
      </main>
    </>
  )
}
