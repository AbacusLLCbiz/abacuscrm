import { TopBar } from "@/shared/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Building2, Users, Bell, Key, Zap, FolderOpen } from "lucide-react"

export default function SettingsPage() {
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
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Firm Name</Label>
                <Input defaultValue="Abacus Accounting" />
              </div>
              <div className="space-y-1.5">
                <Label>From Email</Label>
                <Input type="email" placeholder="noreply@yourfirm.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input type="tel" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="space-y-1.5">
                <Label>Timezone</Label>
                <Input defaultValue="America/New_York" />
              </div>
              <div className="sm:col-span-2">
                <Button size="sm">Save Changes</Button>
              </div>
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
