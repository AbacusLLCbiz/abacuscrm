"use client"

import { useState, useEffect } from "react"
import { TopBar } from "@/shared/components/layout/TopBar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Zap, Mail, MessageSquare, FolderOpen, ArrowRight, Calendar, Loader2 } from "lucide-react"
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

const ACTION_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  SEND_EMAIL: { label: "Send Email", icon: Mail, color: "text-[#1e40af] bg-[#dbeafe]" },
  SEND_SMS: { label: "Send SMS", icon: MessageSquare, color: "text-green-700 bg-green-50" },
  REQUEST_DOCUMENTS: { label: "Request Documents", icon: FolderOpen, color: "text-amber-700 bg-amber-50" },
  CREATE_REMINDER: { label: "Create Reminder", icon: Calendar, color: "text-purple-700 bg-purple-50" },
}

interface AutomationRule {
  id: string
  name: string
  description?: string
  trigger: string
  triggerDaysBefore?: number
  action: string
  isActive: boolean
}

export default function AutomationsPage() {
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/automations")
      .then(async (r) => { if (r.ok) setRules(await r.json()) })
      .finally(() => setLoading(false))
  }, [])

  const toggleActive = async (rule: AutomationRule) => {
    await fetch(`/api/automations/${rule.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !rule.isActive }),
    })
    setRules((prev) => prev.map((r) => r.id === rule.id ? { ...r, isActive: !r.isActive } : r))
  }

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
      <main className="flex-1 overflow-y-auto p-8">
        {/* Intro card */}
        <Card className="mb-6 border-[#bfdbfe] bg-[#eff6ff]">
          <CardContent className="flex items-start gap-4 pt-5">
            <div className="rounded-lg bg-[#1e40af] p-2.5">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1e3a8a]">Automations run in the background</p>
              <p className="text-xs text-[#3b82f6] mt-1">
                Create rules that automatically send emails, SMS, or request documents based on dates, appointments, and client events.
              </p>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-[#94a3b8]" />
          </div>
        ) : rules.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Zap className="h-12 w-12 text-[#bfdbfe] mb-4" />
              <p className="text-sm font-semibold text-[#64748b]">No automations yet</p>
              <p className="text-xs text-[#94a3b8] mt-1 mb-4">Create your first automation rule to get started</p>
              <Button size="sm" asChild>
                <Link href="/automations/new"><Plus className="h-4 w-4" /> New Automation</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => {
              const actionConfig = ACTION_CONFIG[rule.action]
              const ActionIcon = actionConfig?.icon ?? Zap
              return (
                <Card key={rule.id} className="hover:border-[#93c5fd] transition-colors">
                  <CardContent className="flex items-center gap-4 py-4">
                    <button
                      onClick={() => toggleActive(rule)}
                      className={`h-2.5 w-2.5 rounded-full shrink-0 transition-colors ${rule.isActive ? "bg-green-400" : "bg-[#cbd5e1]"}`}
                      title={rule.isActive ? "Click to pause" : "Click to activate"}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0f172a]">{rule.name}</p>
                      {rule.description && <p className="text-xs text-[#64748b] mt-0.5">{rule.description}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="cobalt" className="text-[10px]">
                          {TRIGGER_LABELS[rule.trigger] ?? rule.trigger}
                          {rule.triggerDaysBefore ? ` · ${rule.triggerDaysBefore} days before` : ""}
                        </Badge>
                        <ArrowRight className="h-3 w-3 text-[#94a3b8]" />
                        {actionConfig && (
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${actionConfig.color}`}>
                            <ActionIcon className="h-2.5 w-2.5" />
                            {actionConfig.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={rule.isActive ? "success" : "secondary"}>
                        {rule.isActive ? "Active" : "Paused"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
