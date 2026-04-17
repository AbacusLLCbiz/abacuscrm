import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createRequestSchema = z.object({
  clientId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional().nullable(),
})

export const GET = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get("clientId")

  const requests = await prisma.documentRequest.findMany({
    where: clientId ? { clientId } : undefined,
    include: {
      client: { select: { firstName: true, lastName: true, email: true } },
      _count: { select: { documents: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(requests)
})

export const POST = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = createRequestSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { dueDate, ...rest } = parsed.data
  const request = await prisma.documentRequest.create({
    data: {
      ...rest,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    },
  })

  return NextResponse.json({ id: request.id }, { status: 201 })
})
