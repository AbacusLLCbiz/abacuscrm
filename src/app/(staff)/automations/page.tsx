import { TopBar } from "@/components/layout/TopBar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Zap, Mail, MessageSquare, FolderOpen, ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"

const TRIGGER_LABELS: Record<string, string> = {
  DOCUMENT_UPLOADED: "Document Uploaded",
  DOCUMENT_REQUEST_DUE: "Document Request Due",
  APPOINTMENT_BOOKED: "Appointment Booked",
  APPOINTMENT_CONFIRMED: "Appointment Confirmed",
  APPOINTMENT_CANCELLED: "Appointment Cancelled",
  APPOINTMENT_REMINDER_24H: "24h Before Appointment",
  APPOINTMENT_REMINDER_1H: "1h Before Appointment",
  CLIENT_CREATED: "New Client Created",
  DOCUMENT_REVIEWED: "Document Reviewed",
  CUSTOM_DATE: "Custom Date",
}

const ACTION_CONFIG = {
  SEND_EMAIL: { label: "Send Email", icon: Mail, color: "text-[#1e40af] bg-[#dbeafe]" },
  SEND_SMS: { label: "Send SMS", icon: MessageSquare, color: "text-green-700 bg-green-50" },
  REQUEST_DOCUMENTS: { label: "Request Documents", icon: FolderOpen, color: "text-amber-700 bg-amber-50" },
  CREATE_REMINDER: { label: "Create Reminder", icon: Calendar, color: "text-purple-700 bg-purple-50" },
}

// Sample automations to demonstrate the UI
const sampleRules = [
  {
    id: "1",
    name: "Tax Deadline Document Request",
    trigger: "CUSTOM_DATE",
    triggerDaysBefore: 30,
    triggerDateField: "fiscalYearEnd",
    action: "REQUEST_DOCUMENTS",
    isActive: true,
    description: "Request tax documents 30 days before fiscal year end",
  },
  {
    id: "2",
    name: "Appointment Confirmation Email",
    trigger: "APPOINTMENT_BOOKED",
    action: "SEND_EMAIL",
    isActive: true,
    description: "Send confirmation email when appointment is booked",
  },
  {
    id: "3",
    name: "24h Appointment SMS Reminder",
    trigger: "APPOINTMENT_REMINDER_24H",
    action: "SEND_SMS",
    isActive: true,
    description: "Send SMS reminder 24 hours before appointment",
  },
  {
    id: "4",
    name: "Document Upload Notification",
    trigger: "DOCUMENT_UPLOADED",
    action: "SEND_EMAIL",
    isActive: false,
    description: "Notify staff when client uploads a document",
  },
]

export default function AutomationsPage() {
  return (
    <>
      <TopBar
        title="Automations"
        subtitle="Configure triggers and automated actions"
        actions={
          <Button asChild size="sm">
            <Link href="/automations/new">
              <Plus className="h-4 w-4" />
              New Automation
            </Link>
          </Button>
        }
      />
      <main className="flex-1 overflow-y-auto p-6">
        {/* Intro card */}
        <Card className="mb-6 border-[#bfdbfe] bg-[#eff6ff]">
          <CardContent className="flex items-start gap-4 pt-5">
            <div className="rounded-lg bg-[#1e40af] p-2.5">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1e3a8a]">Automations run in the background</p>
              <p className="text-xs text-[#3b82f6] mt-1">
                Create rules that automatically send emails, SMS, or request documents based on dates, appointments, and client events. Date-based triggers (like &quot;30 days before fiscal year end&quot;) run daily.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rules list */}
        <div className="space-y-3">
          {sampleRules.map((rule) => {
            const actionConfig = ACTION_CONFIG[rule.action as keyof typeof ACTION_CONFIG]
            const ActionIcon = actionConfig.icon
            return (
              <Card key={rule.id} className="hover:border-[#93c5fd] transition-colors">
                <CardContent className="flex items-center gap-4 py-4">
                  {/* Status toggle */}
                  <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${rule.isActive ? "bg-green-400" : "bg-[#cbd5e1]"}`} />

                  {/* Trigger */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0f172a]">{rule.name}</p>
                    <p className="text-xs text-[#64748b] mt-0.5">{rule.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="cobalt" className="text-[10px]">
                        {TRIGGER_LABELS[rule.trigger]}
                        {rule.triggerDaysBefore ? ` · ${rule.triggerDaysBefore} days before` : ""}
                      </Badge>
                      <ArrowRight className="h-3 w-3 text-[#94a3b8]" />
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${actionConfig.color}`}>
                        <ActionIcon className="h-2.5 w-2.5" />
                        {actionConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={rule.isActive ? "success" : "secondary"}>
                      {rule.isActive ? "Active" : "Paused"}
                    </Badge>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </>
  )
}
