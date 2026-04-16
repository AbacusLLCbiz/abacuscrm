"use client"

import { useState } from "react"
import { Building2, Mail, Lock, Shield, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Step = "credentials" | "otp"

export default function LoginPage() {
  const [step, setStep] = useState<Step>("credentials")
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: call /api/auth/send-otp then move to OTP step
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setStep("otp")
  }

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: call NextAuth signIn with credentials + OTP
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12" style={{ background: "var(--sidebar-bg)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-white leading-none">Abacus Accounting</p>
            <p className="text-xs text-blue-300 mt-0.5">Client Relationship Management</p>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white leading-tight">
            Everything you need to <br />
            <span className="text-blue-300">manage your clients</span>
          </h1>
          <p className="text-blue-200 mt-4 text-sm leading-relaxed">
            Appointments, documents, automations, and communications — all in one place designed for accounting professionals.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "Client portal with document exchange",
              "Scheduler with email & SMS reminders",
              "Date-based automation triggers",
              "Twilio voice calls built in",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-blue-100">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-blue-400">© 2025 Abacus Accounting. Secure admin access.</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-8 bg-[#f8fafc]">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1e3a8a] mb-4 lg:hidden">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#0f172a]">
              {step === "credentials" ? "Sign in" : "Verify your identity"}
            </h2>
            <p className="text-sm text-[#64748b] mt-1">
              {step === "credentials"
                ? "Enter your email and password"
                : `We sent a 6-digit code to your phone number on file`}
            </p>
          </div>

          {step === "credentials" ? (
            <form onSubmit={handleCredentials} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-9"
                    placeholder="you@abacus.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                  <Input id="password" type="password" className="pl-9" placeholder="••••••••" required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtp} className="space-y-4">
              <div className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] p-4 flex items-start gap-3">
                <Shield className="h-4 w-4 text-[#1e40af] mt-0.5 shrink-0" />
                <p className="text-xs text-[#1e40af]">
                  Two-factor authentication is required for staff accounts. A 6-digit code was sent via SMS.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="otp">Verification code</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  className="text-center text-2xl font-mono tracking-[0.5em] h-14"
                  placeholder="000000"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Verify & Sign In</>}
              </Button>
              <button
                type="button"
                className="w-full text-xs text-[#64748b] hover:text-[#1e40af] transition-colors"
                onClick={() => setStep("credentials")}
              >
                ← Back to sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
