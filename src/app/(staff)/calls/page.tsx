import { TopBar } from "@/shared/components/layout/TopBar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Mic, MicOff, Plus } from "lucide-react"

export default function CallsPage() {
  return (
    <>
      <TopBar
        title="Calls"
        subtitle="Place and receive calls via Twilio Voice"
        actions={
          <Button size="sm">
            <Phone className="h-4 w-4" />
            New Call
          </Button>
        }
      />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Dialer */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Quick Dial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full">
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    className="w-full rounded-md border border-[#e2e8f0] px-3 py-2 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                  />
                </div>
                {/* Keypad */}
                <div className="grid grid-cols-3 gap-2 w-full">
                  {["1","2","3","4","5","6","7","8","9","*","0","#"].map((k) => (
                    <button
                      key={k}
                      className="flex h-12 items-center justify-center rounded-lg border border-[#e2e8f0] text-base font-medium text-[#374151] hover:bg-[#eff6ff] hover:border-[#1e40af] hover:text-[#1e40af] transition-colors"
                    >
                      {k}
                    </button>
                  ))}
                </div>
                <Button className="w-full" size="lg">
                  <Phone className="h-4 w-4" /> Call
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Call Log */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold">Call History</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs">All</Button>
                <Button variant="ghost" size="sm" className="text-xs">Inbound</Button>
                <Button variant="ghost" size="sm" className="text-xs">Outbound</Button>
                <Button variant="ghost" size="sm" className="text-xs">Missed</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Phone className="h-10 w-10 text-[#bfdbfe] mb-3" />
                <p className="text-sm font-medium text-[#64748b]">No calls yet</p>
                <p className="text-xs text-[#94a3b8] mt-1">
                  Call history will appear here once Twilio Voice is configured
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Setup notice */}
        <Card className="mt-6 border-amber-200 bg-amber-50">
          <CardContent className="flex items-start gap-3 pt-4 pb-4">
            <Phone className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Twilio Voice Setup Required</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Configure your Twilio credentials and set the webhook URL for inbound calls to{" "}
                <code className="bg-amber-100 px-1 rounded">/api/webhooks/twilio/voice</code>.
                Outbound calls use the Twilio Programmable Voice API.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
