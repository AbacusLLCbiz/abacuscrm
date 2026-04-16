import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createClientSchema } from "@/features/clients/schemas"

export const POST = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = createClientSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const client = await prisma.client.create({
    data: {
      ...parsed.data,
      services: [],
      assignedToId: req.auth.user.id,
    },
  })

  return NextResponse.json({ id: client.id }, { status: 201 })
})

export const GET = auth(async () => {
  const clients = await prisma.client.findMany({
    include: { assignedTo: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(clients)
})
