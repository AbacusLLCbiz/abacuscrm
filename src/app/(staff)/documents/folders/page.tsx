"use client"

import { useState, useEffect, useCallback } from "react"
import { TopBar } from "@/shared/components/layout/TopBar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, FolderOpen, Loader2 } from "lucide-react"
import Link from "next/link"

interface Folder {
  id: string
  name: string
  description: string | null
  color: string | null
  isDefault: boolean
  sortOrder: number
  createdAt: string
  _count: { documents: number }
}

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/document-folders")
    const data = await res.json()
    setFolders(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async (folder: Folder) => {
    if (!confirm(`Delete folder "${folder.name}"? This cannot be undone.`)) return
    setDeletingId(folder.id)
    setError("")

    const res = await fetch(`/api/document-folders/${folder.id}`, { method: "DELETE" })
    const data = await res.json()
    setDeletingId(null)

    if (!res.ok) {
      setError(data.error ?? "Failed to delete folder.")
      return
    }

    setFolders((prev) => prev.filter((f) => f.id !== folder.id))
  }

  return (
    <>
      <TopBar
        title="Folders"
        subtitle="Organize documents into folders"
        actions={
          <Button size="sm" asChild>
            <Link href="/documents/folders/new">
              <Plus className="h-4 w-4" />
              New Folder
            </Link>
          </Button>
        }
      />
      <main className="flex-1 overflow-y-auto p-8">
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-[#1e40af]" />
          </div>
        ) : folders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <FolderOpen className="h-12 w-12 text-[#bfdbfe] mb-4" />
              <p className="text-sm font-semibold text-[#64748b]">No folders yet</p>
              <p className="text-xs text-[#94a3b8] mt-1 mb-4">Create folders to organize client documents</p>
              <Button size="sm" asChild>
                <Link href="/documents/folders/new">
                  <Plus className="h-4 w-4" /> Create Folder
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] w-10">Color</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">Documents</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">Default</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-[#64748b]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {folders.map((folder) => (
                    <tr key={folder.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                      <td className="px-4 py-3">
                        <div
                          className="h-5 w-5 rounded"
                          style={{ backgroundColor: folder.color ?? "#1e40af" }}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-[#0f172a]">{folder.name}</td>
                      <td className="px-4 py-3 text-[#64748b] max-w-[260px] truncate">
                        {folder.description ?? <span className="text-[#cbd5e1]">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary">{folder._count.documents}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {folder.isDefault ? (
                          <Badge variant="cobalt">Default</Badge>
                        ) : (
                          <span className="text-[#cbd5e1] text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild className="h-7 px-2">
                            <Link href={`/documents/folders/${folder.id}/edit`}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(folder)}
                            disabled={deletingId === folder.id}
                          >
                            {deletingId === folder.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </>
  )
}
