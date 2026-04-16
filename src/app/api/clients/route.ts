import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createClientSchema } from "@/features/clients/schemas"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = createClientSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const data = parsed.data

  const client = await prisma.client.create({
    data: {
      ...data,
      services: [],
      assignedToId: session.user.id,
    },
  })

  return NextResponse.json({ id: client.id }, { status: 201 })
}

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const clients = await prisma.client.findMany({
    include: { assignedTo: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(clients)
}
