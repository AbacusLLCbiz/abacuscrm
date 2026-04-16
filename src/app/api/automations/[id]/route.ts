import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const patchSchema = z.object({
  isActive: z.boolean().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
})

export const PATCH = auth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const rule = await prisma.automationRule.update({ where: { id }, data: parsed.data })
  return NextResponse.json(rule)
})

export const DELETE = auth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await prisma.automationRule.delete({ where: { id } })
  return NextResponse.json({ ok: true })
})
