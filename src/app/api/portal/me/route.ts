import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const GET = auth(async (req) => {
  if (!req.auth?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (req.auth.user.role !== "CLIENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const client = await prisma.client.findUnique({
    where: { portalUserId: req.auth.user.id },
    include: {
      appointments: {
        include: {
          eventType: true,
        },
        orderBy: { startAt: "desc" },
        take: 10,
      },
      documentRequests: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      documents: {
        include: {
          folder: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  })

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  }

  return NextResponse.json(client)
})
