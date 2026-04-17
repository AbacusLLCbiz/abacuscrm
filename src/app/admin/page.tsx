"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Building2, Mail, Lock, Shield, ArrowRight, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Suspense } from "react"

type Step = "credentials" | "otp"

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"

  const [step, setStep] = useState<Step>("credentials")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (res.status === 401) {
      setError("Invalid email or password.")
      setLoading(false)
      return
    }

    // Twilio not configured — sign in directly without OTP
    if (!res.ok || data.smsDisabled) {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      setLoading(false)
      if (result?.error) {
        setError("Invalid email or password.")
      } else {
        router.push(callbackUrl)
      }
      return
    }

    // SMS enabled — show OTP step
    setLoading(false)
    setStep("otp")
  }

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const otpCode = (e.currentTarget as HTMLFormElement).otp.value

    const result = await signIn("credentials", {
      email,
      password,
      otpCode,
      redirect: false,
    })

    setLoading(false)
    if (result?.error) {
      setError("Invalid or expired code. Try again.")
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — cobalt sidebar */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-14"
        style={{ background: "linear-gradient(160deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%)" }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="leading-none">
            <span className="text-lg font-black text-white">abacus</span>
            <span className="text-lg font-black text-blue-200"> accounting</span>
          </div>
        </Link>

        <div>
          <h1 className="text-4xl font-black text-white leading-tight">
            Your clients.
            <br />
            <span className="text-blue-200 italic">Your workflow.</span>
            <br />
            All in one place.
          </h1>
          <p className="text-blue-200 mt-5 text-sm leading-relaxed max-w-xs">
            Manage client documents, appointments, automations, and voice calls — built for accounting professionals.
          </p>
          <div className="mt-10 space-y-3">
            {[
              "Client portal with document exchange",
              "Scheduler with email & SMS reminders",
              "Date-based automation triggers",
              "Twilio voice calls — inbound & outbound",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-blue-100">
                <div className="h-1.5 w-1.5 rounded-full bg-[#60a5fa] shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-blue-400">Secure staff access · Abacus Accounting, LLC</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-[#f8fafc]">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#1e40af] transition-colors mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to website
          </Link>

          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1e40af]">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-black text-[#1e3a8a]">Abacus Accounting</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-[#0f172a]">
              {step === "credentials" ? "Staff sign in" : "Check your phone"}
            </h2>
            <p className="text-sm text-[#64748b] mt-2">
              {step === "credentials"
                ? "Enter your email and password to continue"
                : "We sent a 6-digit verification code via SMS"}
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {step === "credentials" ? (
            <form onSubmit={handleCredentials} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-9 h-11"
                    placeholder="you@abacusllc.biz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-9 h-11"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-11 text-base font-bold" disabled={loading}>
                {loading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <span className="flex items-center gap-2">Continue <ArrowRight className="h-4 w-4" /></span>}
              </Button>
              <p className="text-center text-xs text-[#94a3b8]">
                A verification code will be sent to your registered phone number.
              </p>
            </form>
          ) : (
            <form onSubmit={handleOtp} className="space-y-4">
              <div className="rounded-xl border border-[#bfdbfe] bg-[#eff6ff] p-4 flex items-start gap-3">
                <Shield className="h-4 w-4 text-[#1e40af] mt-0.5 shrink-0" />
                <p className="text-xs text-[#1e40af] leading-relaxed">
                  Two-factor authentication required. Enter the 6-digit code sent to your phone.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">Verification code</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  className="text-center text-3xl font-mono tracking-[0.6em] h-16"
                  placeholder="000000"
                  required
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full h-11 text-base font-bold" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Sign In"}
              </Button>
              <button
                type="button"
                className="w-full text-xs text-[#64748b] hover:text-[#1e40af] transition-colors"
                onClick={() => setStep("credentials")}
              >
                ← Try a different account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  )
}
