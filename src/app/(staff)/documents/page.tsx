import { TopBar } from "@/shared/components/layout/TopBar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FolderOpen, Upload, Search, FileText, Download, Plus } from "lucide-react"
import Link from "next/link"

export default function DocumentsPage() {
  return (
    <>
      <TopBar
        title="Documents"
        subtitle="Client files and document requests"
        actions={
          <Button size="sm" disabled>
            <Upload className="h-4 w-4" />
            Upload
          </Button>
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
          <h2 className="text-sm font-semibold text-[#0f172a] mb-4">Folders</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[
              "Tax Returns",
              "W-2 / 1099s",
              "Financial Statements",
              "Contracts & Agreements",
              "Bank Statements",
              "Correspondence",
            ].map((folder) => (
              <button
                key={folder}
                className="flex flex-col items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white p-5 hover:border-[#1e40af] hover:bg-[#eff6ff] transition-colors group"
              >
                <FolderOpen className="h-8 w-8 text-[#bfdbfe] group-hover:text-[#1e40af] transition-colors" />
                <p className="text-xs font-medium text-[#374151] text-center leading-tight">{folder}</p>
                <p className="text-[10px] text-[#94a3b8]">0 files</p>
              </button>
            ))}
            <button className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#e2e8f0] bg-white p-5 hover:border-[#1e40af] hover:bg-[#eff6ff] transition-colors group">
              <Plus className="h-8 w-8 text-[#cbd5e1] group-hover:text-[#1e40af] transition-colors" />
              <p className="text-xs font-medium text-[#94a3b8] group-hover:text-[#1e40af]">New Folder</p>
            </button>
          </div>
        </div>

        {/* Recent documents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#0f172a]">Recent Documents</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
                <input
                  className="rounded-lg border border-[#e2e8f0] bg-white pl-8 pr-3 py-1.5 text-xs text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e40af] w-48"
                  placeholder="Search files..."
                  disabled
                />
              </div>
            </div>
          </div>

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
        </div>
      </main>
    </>
  )
}
