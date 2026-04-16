export const dynamic = "force-dynamic"

import { TopBar } from "@/shared/components/layout/TopBar"
import { ClientTable } from "@/features/clients/components/ClientTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

async function getClients() {
  return prisma.client.findMany({
    include: { assignedTo: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export default async function ClientsPage() {
  const clients = await getClients()

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
        <ClientTable initialClients={clients} />
      </main>
    </>
  )
}
