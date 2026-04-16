import { TopBar } from "@/components/layout/TopBar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, Calendar, Clock, Video, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export default function SchedulerPage() {
  return (
    <>
      <TopBar
        title="Scheduler"
        subtitle="Manage appointments and event types"
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Calendar placeholder */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-sm font-semibold">Calendar</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Week</Button>
                  <Button variant="outline" size="sm">Month</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Calendar className="h-12 w-12 text-[#bfdbfe] mb-3" />
                  <p className="text-sm font-medium text-[#64748b]">Calendar view coming soon</p>
                  <p className="text-xs text-[#94a3b8] mt-1">Set up event types and availability to start accepting bookings</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Types */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-sm font-semibold">Event Types</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/scheduler/event-types"><Settings className="h-3.5 w-3.5" /></Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { title: "Tax Consultation", duration: 60, types: ["In Person", "Zoom"], color: "#1e40af" },
                    { title: "Initial Review", duration: 30, types: ["Phone", "Google Meet"], color: "#0891b2" },
                    { title: "Document Review", duration: 45, types: ["In Person"], color: "#7c3aed" },
                  ].map((et) => (
                    <div key={et.title} className="flex items-center gap-3 rounded-md border border-[#e2e8f0] p-3 hover:border-[#1e40af] hover:bg-[#eff6ff] transition-colors cursor-pointer group">
                      <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: et.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#0f172a] truncate">{et.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock className="h-2.5 w-2.5 text-[#94a3b8]" />
                          <span className="text-[10px] text-[#94a3b8]">{et.duration} min</span>
                          <span className="text-[#e2e8f0]">·</span>
                          <span className="text-[10px] text-[#94a3b8]">{et.types.join(", ")}</span>
                        </div>
                      </div>
                      <Badge variant="success" className="text-[10px] shrink-0">Active</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                  <Link href="/scheduler/event-types/new">
                    <Plus className="h-3.5 w-3.5" /> Add Event Type
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Meeting types legend */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-[#64748b]">Meeting Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "In Person", icon: MapPin, color: "text-[#1e40af]" },
                  { label: "Zoom", icon: Video, color: "text-blue-400" },
                  { label: "Google Meet", icon: Video, color: "text-green-500" },
                  { label: "Phone", icon: Phone, color: "text-[#64748b]" },
                ].map((m) => (
                  <div key={m.label} className="flex items-center gap-2 text-xs text-[#374151]">
                    <m.icon className={`h-3.5 w-3.5 ${m.color}`} />
                    {m.label}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
