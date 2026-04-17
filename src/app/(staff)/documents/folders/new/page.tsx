"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/shared/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"

const COLOR_OPTIONS = [
  { value: "#1e40af", label: "Cobalt Blue" },
  { value: "#0f766e", label: "Teal" },
  { value: "#7c3aed", label: "Violet" },
  { value: "#b45309", label: "Amber" },
  { value: "#b91c1c", label: "Red" },
  { value: "#166534", label: "Green" },
  { value: "#374151", label: "Slate" },
]

export default function NewFolderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#1e40af",
    isDefault: false,
  })

  const set = (field: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const payload: Record<string, unknown> = { name: form.name, color: form.color }
    if (form.description) payload.description = form.description

    const res = await fetch("/api/document-folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error?.fieldErrors ? "Please fix the errors below." : (data.error ?? "Something went wrong."))
      return
    }

    router.push("/documents/folders")
  }

  return (
    <>
      <TopBar
        title="New Folder"
        subtitle="Create a document folder"
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/documents/folders">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          </Button>
        }
      />
      <main className="flex-1 overflow-y-auto p-8">
        <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Folder Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Tax Returns"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[80px] rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e40af] resize-y"
                  placeholder="Brief description of what goes in this folder…"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex items-center gap-2 flex-wrap">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      title={c.label}
                      onClick={() => set("color", c.value)}
                      className="h-8 w-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e40af]"
                      style={{
                        backgroundColor: c.value,
                        outline: form.color === c.value ? `3px solid ${c.value}` : undefined,
                        outlineOffset: form.color === c.value ? "2px" : undefined,
                        boxShadow: form.color === c.value ? `0 0 0 2px white, 0 0 0 4px ${c.value}` : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="isDefault"
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => set("isDefault", e.target.checked)}
                  className="h-4 w-4 rounded border-[#e2e8f0] text-[#1e40af] focus:ring-[#1e40af]"
                />
                <Label htmlFor="isDefault" className="cursor-pointer">
                  Set as default folder
                </Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Create Folder
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/documents/folders">Cancel</Link>
            </Button>
          </div>
        </form>
      </main>
    </>
  )
}
