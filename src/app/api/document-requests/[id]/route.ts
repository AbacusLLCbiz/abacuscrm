import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const patchSchema = z.object({
  fulfilled: z.boolean().optional(),
  dueDate: z.string().datetime().optional().nullable(),
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
})

export const PATCH = auth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { dueDate, fulfilled, ...rest } = parsed.data

  const request = await prisma.documentRequest.update({
    where: { id },
    data: {
      ...rest,
      ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
      ...(fulfilled !== undefined
        ? { fulfilled, fulfilledAt: fulfilled ? new Date() : null }
        : {}),
    },
  })

  return NextResponse.json(request)
})

export const DELETE = auth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await prisma.documentRequest.delete({ where: { id } })
  return NextResponse.json({ success: true })
})
