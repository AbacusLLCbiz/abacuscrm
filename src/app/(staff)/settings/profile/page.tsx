"use client"

import { useState } from "react"
import { TopBar } from "@/shared/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Loader2, KeyRound, User } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [profileMsg, setProfileMsg] = useState("")
  const [passwordMsg, setPasswordMsg] = useState("")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileMsg("")
    // TODO: wire to PATCH /api/users/me
    await new Promise((r) => setTimeout(r, 500))
    setProfileMsg("Profile saved.")
    setSavingProfile(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Passwords do not match.")
      return
    }
    setSavingPassword(true)
    setPasswordMsg("")
    // TODO: wire to PATCH /api/users/me/password
    await new Promise((r) => setTimeout(r, 500))
    setPasswordMsg("Password updated.")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setSavingPassword(false)
  }

  return (
    <>
      <TopBar
        title="My Profile"
        subtitle="Update your name, email, and password"
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/settings"><ArrowLeft className="h-4 w-4" /> Settings</Link>
          </Button>
        }
      />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-xl space-y-8">

          {/* Profile info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (for SMS 2FA)</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (515) 000-0000" />
                </div>
                {profileMsg && <p className="text-sm text-green-600">{profileMsg}</p>}
                <Button type="submit" disabled={savingProfile} className="gap-2">
                  {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Profile
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <KeyRound className="h-4 w-4" /> Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                {passwordMsg && (
                  <p className={`text-sm ${passwordMsg.includes("match") ? "text-red-600" : "text-green-600"}`}>{passwordMsg}</p>
                )}
                <Button type="submit" disabled={savingPassword} className="gap-2">
                  {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>
      </main>
    </>
  )
}
