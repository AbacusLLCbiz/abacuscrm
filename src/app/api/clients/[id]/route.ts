import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const patchSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  entityType: z.enum(["INDIVIDUAL", "SOLE_PROPRIETOR", "LLC", "S_CORP", "C_CORP", "PARTNERSHIP", "NON_PROFIT", "OTHER"]).optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE", "PROSPECT"]).optional(),
  fiscalYearEnd: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zip: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  preferredLanguage: z.enum(["EN", "ES"]).optional(),
})

export const GET = auth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
      appointments: {
        include: { eventType: true },
        orderBy: { startAt: "desc" },
        take: 10,
      },
      documents: {
        include: { folder: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      documentRequests: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  })

  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(client)
})

export const PATCH = auth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const client = await prisma.client.update({ where: { id }, data: parsed.data })
  return NextResponse.json(client)
})

export const DELETE = auth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await prisma.client.delete({ where: { id } })
  return NextResponse.json({ ok: true })
})
