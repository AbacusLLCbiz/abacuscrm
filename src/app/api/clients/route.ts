import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createClientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  entityType: z.enum(["INDIVIDUAL", "SOLE_PROPRIETOR", "LLC", "S_CORP", "C_CORP", "PARTNERSHIP", "NON_PROFIT", "OTHER"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "PROSPECT"]).default("ACTIVE"),
  fiscalYearEnd: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
})

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
