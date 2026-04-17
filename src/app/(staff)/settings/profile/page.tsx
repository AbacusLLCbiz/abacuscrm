"use client"

import { useState, useEffect } from "react"
import { TopBar } from "@/shared/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Loader2, KeyRound, User, Check } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [profileMsg, setProfileMsg] = useState("")
  const [profileErr, setProfileErr] = useState("")
  const [passwordMsg, setPasswordMsg] = useState("")
  const [passwordErr, setPasswordErr] = useState("")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Load current user on mount
  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.name) setName(d.name)
        if (d.email) setEmail(d.email)
        if (d.phone) setPhone(d.phone)
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false))
  }, [])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileMsg("")
    setProfileErr("")

    const res = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone: phone || null }),
    })

    setSavingProfile(false)
    if (res.ok) {
      setProfileMsg("Profile saved.")
      setTimeout(() => setProfileMsg(""), 3000)
    } else {
      const d = await res.json()
      setProfileErr(d.error ?? "Failed to save profile.")
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMsg("")
    setPasswordErr("")

    if (newPassword !== confirmPassword) {
      setPasswordErr("Passwords do not match.")
      return
    }

    setSavingPassword(true)
    const res = await fetch("/api/users/me/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    setSavingPassword(false)
    if (res.ok) {
      setPasswordMsg("Password updated.")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setPasswordMsg(""), 3000)
    } else {
      const d = await res.json()
      setPasswordErr(d.error ?? "Failed to update password.")
    }
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
              {loadingProfile ? (
                <div className="flex items-center gap-2 py-4 text-sm text-[#94a3b8]">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                </div>
              ) : (
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
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
                  </div>
                  {profileMsg && <p className="text-sm text-green-600 flex items-center gap-1"><Check className="h-3.5 w-3.5" />{profileMsg}</p>}
                  {profileErr && <p className="text-sm text-red-600">{profileErr}</p>}
                  <Button type="submit" disabled={savingProfile} className="gap-2">
                    {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Profile
                  </Button>
                </form>
              )}
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
                {passwordMsg && <p className="text-sm text-green-600 flex items-center gap-1"><Check className="h-3.5 w-3.5" />{passwordMsg}</p>}
                {passwordErr && <p className="text-sm text-red-600">{passwordErr}</p>}
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
