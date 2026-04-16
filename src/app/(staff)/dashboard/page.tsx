import { TopBar } from "@/components/layout/TopBar"
import { StatsCard } from "@/components/layout/StatsCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, FolderOpen, Zap, Clock, CheckCircle2, AlertCircle } from "lucide-react"

// Placeholder data — will be replaced with real DB queries
const stats = [
  { title: "Total Clients", value: 0, subtitle: "Active clients", icon: Users, color: "blue" as const },
  { title: "Appointments Today", value: 0, subtitle: "Scheduled", icon: Calendar, color: "green" as const },
  { title: "Pending Documents", value: 0, subtitle: "Awaiting review", icon: FolderOpen, color: "amber" as const },
  { title: "Active Automations", value: 0, subtitle: "Rules running", icon: Zap, color: "blue" as const },
]

const recentActivity = [
  { type: "appointment", label: "No recent activity yet", time: "", status: "neutral" },
]

export default function DashboardPage() {
  return (
    <>
      <TopBar title="Dashboard" subtitle="Welcome back" />
      <main className="flex-1 overflow-y-auto p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <StatsCard key={s.title} {...s} />
          ))}
        </div>

        {/* Content Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Upcoming Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-sm font-semibold">Upcoming Appointments</CardTitle>
              <Badge variant="cobalt">Today</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-10 w-10 text-[#bfdbfe] mb-3" />
                <p className="text-sm font-medium text-[#64748b]">No appointments scheduled</p>
                <p className="text-xs text-[#94a3b8] mt-1">Add clients and set up event types to get started</p>
              </div>
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
