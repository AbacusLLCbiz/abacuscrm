export const dynamic = "force-dynamic"

import { TopBar } from "@/shared/components/layout/TopBar"
import { StatsCard } from "@/shared/components/layout/StatsCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, FolderOpen, Zap, Clock, MapPin, Video, Phone } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

type MeetingType = "IN_PERSON" | "ZOOM" | "GOOGLE_MEET" | "PHONE"
type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW"

const STATUS_VARIANT: Record<AppointmentStatus, "warning" | "success" | "secondary" | "cobalt" | "destructive"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "secondary",
  COMPLETED: "cobalt",
  NO_SHOW: "destructive",
}

const MEETING_ICONS: Record<MeetingType, React.ElementType> = {
  IN_PERSON: MapPin,
  ZOOM: Video,
  GOOGLE_MEET: Video,
  PHONE: Phone,
}

async function getUpcomingAppointments() {
  const now = new Date()
  return prisma.appointment.findMany({
    where: {
      startAt: { gte: now },
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    include: {
      client: true,
      eventType: true,
    },
    orderBy: { startAt: "asc" },
    take: 5,
  })
}

async function getStats() {
  const [totalClients, appointmentsToday, pendingDocs, activeAutomations] = await Promise.all([
    prisma.client.count({ where: { status: "ACTIVE" } }),
    prisma.appointment.count({
      where: {
        startAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
    prisma.document.count({ where: { status: "PENDING" } }),
    prisma.automationRule.count({ where: { isActive: true } }),
  ])
  return { totalClients, appointmentsToday, pendingDocs, activeAutomations }
}

export default async function DashboardPage() {
  const [appointments, stats] = await Promise.all([getUpcomingAppointments(), getStats()])

  const statCards = [
    { title: "Total Clients", value: stats.totalClients, subtitle: "Active clients", icon: Users, color: "blue" as const },
    { title: "Appointments Today", value: stats.appointmentsToday, subtitle: "Scheduled", icon: Calendar, color: "green" as const },
    { title: "Pending Documents", value: stats.pendingDocs, subtitle: "Awaiting review", icon: FolderOpen, color: "amber" as const },
    { title: "Active Automations", value: stats.activeAutomations, subtitle: "Rules running", icon: Zap, color: "blue" as const },
  ]

  return (
    <>
      <TopBar title="Dashboard" subtitle="Welcome back" />
      <main className="flex-1 overflow-y-auto p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((s) => (
            <StatsCard key={s.title} {...s} />
          ))}
        </div>

        {/* Content Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Upcoming Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-sm font-semibold">Upcoming Appointments</CardTitle>
              <Link href="/scheduler" className="text-xs text-[#1e40af] hover:underline">View all</Link>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-10 w-10 text-[#bfdbfe] mb-3" />
                  <p className="text-sm font-medium text-[#64748b]">No upcoming appointments</p>
                  <p className="text-xs text-[#94a3b8] mt-1">Add clients and set up event types to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map((appt) => {
                    const MeetingIcon = MEETING_ICONS[appt.meetingType as MeetingType] ?? Calendar
                    const startTime = new Date(appt.startAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
                    const dateStr = new Date(appt.startAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
                    return (
                      <div
                        key={appt.id}
                        className="flex items-center gap-4 rounded-xl border border-[#e2e8f0] bg-white p-4"
                        style={{ borderLeftColor: appt.eventType.color, borderLeftWidth: 3 }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#0f172a]">
                            {appt.client.firstName} {appt.client.lastName}
                          </p>
                          <p className="text-xs text-[#64748b]">{appt.eventType.title}</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#64748b] shrink-0">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {dateStr} · {startTime}
                          </span>
                          <MeetingIcon className="h-3.5 w-3.5" />
                          <Badge variant={STATUS_VARIANT[appt.status as AppointmentStatus]}>
                            {appt.status.charAt(0) + appt.status.slice(1).toLowerCase()}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-8 w-8 text-[#bfdbfe] mb-3" />
                <p className="text-xs text-[#94a3b8]">Activity will appear here</p>
              </div>
            </CardContent>
          </Card>

          {/* Document Requests */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-sm font-semibold">Pending Document Requests</CardTitle>
              <Badge variant="warning">0 pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FolderOpen className="h-8 w-8 text-[#bfdbfe] mb-3" />
                <p className="text-xs text-[#94a3b8]">No pending document requests</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Add New Client", href: "/clients/new", icon: Users },
                { label: "Schedule Appointment", href: "/scheduler", icon: Calendar },
                { label: "Request Documents", href: "/documents/requests/new", icon: FolderOpen },
                { label: "Create Automation", href: "/automations/new", icon: Zap },
              ].map((action) => (
                <a
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg border border-[#e2e8f0] px-4 py-3.5 text-sm font-medium text-[#374151] hover:border-[#1e40af] hover:text-[#1e40af] hover:bg-[#eff6ff] transition-colors"
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
