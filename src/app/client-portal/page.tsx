"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Building2, Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function ClientPortalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)
    if (result?.error) {
      setError("Invalid email or password.")
    } else {
      router.push("/portal/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#1e3a8a]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-white leading-none">Abacus Accounting</p>
            <p className="text-xs text-blue-300 mt-0.5">Client Portal</p>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white leading-tight">
            Access your documents,{" "}
            <span className="text-blue-300">appointments, and tax files.</span>
          </h1>
          <p className="text-blue-200 mt-4 text-sm leading-relaxed">
            Your secure portal for managing documents, scheduling appointments, and staying on top of your tax filings.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "View and download your tax documents",
              "Schedule and manage appointments",
              "Communicate with your accountant",
              "Track the status of your filings",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-blue-100">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-blue-400">© {new Date().getFullYear()} Abacus Accounting, LLC.</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-8 bg-[#f8fafc]">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1e3a8a] mb-4 lg:hidden">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#0f172a]">Client Portal</h2>
            <p className="text-sm text-[#64748b] mt-1">Enter your email and password to sign in</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  placeholder="you@example.com"
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
                <Input
                  id="password"
                  type="password"
                  className="pl-9"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign in <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-[#64748b] hover:text-[#1e40af] transition-colors"
            >
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
