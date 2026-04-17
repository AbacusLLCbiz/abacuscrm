export const dynamic = "force-dynamic"

import { TopBar } from "@/shared/components/layout/TopBar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FolderOpen, Upload, FileText, Plus } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

async function getFolders() {
  return prisma.documentFolder.findMany({
    include: { _count: { select: { documents: true } } },
    orderBy: { sortOrder: "asc" },
  })
}

async function getRecentDocuments() {
  return prisma.document.findMany({
    include: {
      client: { select: { firstName: true, lastName: true } },
      folder: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  })
}

const STATUS_VARIANT: Record<string, "warning" | "success" | "secondary"> = {
  PENDING: "warning",
  REVIEWED: "success",
  ARCHIVED: "secondary",
}

export default async function DocumentsPage() {
  const [folders, documents] = await Promise.all([getFolders(), getRecentDocuments()])

  return (
    <>
      <TopBar
        title="Documents"
        subtitle="Client files and document requests"
        actions={
          <div className="relative group">
            <Button size="sm" disabled>
              <Upload className="h-4 w-4" />
              Upload
            </Button>
            <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block z-50 w-64 rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-xs text-[#64748b] shadow-md">
              Configure R2 storage in Settings to enable uploads
            </div>
          </div>
        }
      />
      <main className="flex-1 overflow-y-auto p-8">
        {/* Info banner */}
        <Card className="mb-6 border-[#bfdbfe] bg-[#eff6ff]">
          <CardContent className="flex items-start gap-4 pt-5">
            <div className="rounded-lg bg-[#1e40af] p-2.5 shrink-0">
              <FolderOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1e3a8a]">Document storage requires Cloudflare R2</p>
              <p className="text-xs text-[#3b82f6] mt-1">
                Configure your R2 bucket credentials in{" "}
                <Link href="/settings" className="underline font-semibold">Settings → Integrations</Link>{" "}
                to enable file uploads. Once configured, you can upload, organize, and share documents with clients.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Folder grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#0f172a]">Folders</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/documents/folders/new">
                <Plus className="h-3.5 w-3.5" />
                New Folder
              </Link>
            </Button>
          </div>
          {folders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#e2e8f0] bg-white p-10 flex flex-col items-center justify-center text-center">
              <FolderOpen className="h-10 w-10 text-[#bfdbfe] mb-3" />
              <p className="text-sm font-medium text-[#64748b]">No folders yet</p>
              <p className="text-xs text-[#94a3b8] mt-1 mb-4">Create folders to organize client documents</p>
              <Button size="sm" asChild>
                <Link href="/documents/folders/new">
                  <Plus className="h-4 w-4" /> Create Folder
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {folders.map((folder) => (
                <Link
                  key={folder.id}
                  href={`/documents/folders/${folder.id}`}
                  className="flex flex-col items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white p-5 hover:border-[#1e40af] hover:bg-[#eff6ff] transition-colors group"
                >
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: folder.color ?? "#1e40af" }}
                  >
                    <FolderOpen className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs font-medium text-[#374151] text-center leading-tight">{folder.name}</p>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {folder._count.documents} file{folder._count.documents === 1 ? "" : "s"}
                  </Badge>
                </Link>
              ))}
              <Link
                href="/documents/folders/new"
                className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#e2e8f0] bg-white p-5 hover:border-[#1e40af] hover:bg-[#eff6ff] transition-colors group"
              >
                <Plus className="h-8 w-8 text-[#cbd5e1] group-hover:text-[#1e40af] transition-colors" />
                <p className="text-xs font-medium text-[#94a3b8] group-hover:text-[#1e40af]">New Folder</p>
              </Link>
            </div>
          )}
        </div>

        {/* Recent documents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#0f172a]">Recent Documents</h2>
          </div>

          {documents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-12 w-12 text-[#bfdbfe] mb-4" />
                <p className="text-sm font-semibold text-[#64748b]">No documents yet</p>
                <p className="text-xs text-[#94a3b8] mt-1 mb-4 max-w-xs">
                  Documents uploaded by staff or clients will appear here. Configure R2 storage to enable uploads.
                </p>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/settings">Configure Storage</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/documents/requests">
                      <FileText className="h-4 w-4" /> Document Requests
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#e2e8f0]">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">Folder</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-[#94a3b8] shrink-0" />
                            <span className="font-medium text-[#0f172a] truncate max-w-[200px]">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#374151]">
                          {doc.client.firstName} {doc.client.lastName}
                        </td>
                        <td className="px-4 py-3 text-[#64748b]">{doc.folder?.name ?? "—"}</td>
                        <td className="px-4 py-3">
                          <Badge variant={STATUS_VARIANT[doc.status] ?? "secondary"}>
                            {doc.status.charAt(0) + doc.status.slice(1).toLowerCase()}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-[#64748b] text-xs">
                          {new Date(doc.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </main>
    </>
  )
}
