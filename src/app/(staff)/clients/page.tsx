import { TopBar } from "@/components/layout/TopBar"
import { ClientTable } from "@/components/clients/ClientTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function ClientsPage() {
  return (
    <>
      <TopBar
        title="Clients"
        subtitle="Manage your client roster"
        actions={
          <Button asChild size="sm">
            <Link href="/clients/new">
              <Plus className="h-4 w-4" />
              Add Client
            </Link>
          </Button>
        }
      />
      <main className="flex-1 overflow-hidden p-8">
        <ClientTable />
      </main>
    </>
  )
}
