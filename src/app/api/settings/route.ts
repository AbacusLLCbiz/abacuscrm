import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { invalidateTimezoneCache } from "@/lib/firm-timezone"

const patchSchema = z.object({
  timezone: z.string().min(1).optional(),
  firmName: z.string().min(1).optional(),
  fromEmail: z.string().email().optional(),
})

export const GET = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const settings = await prisma.firmSettings.upsert({
    where: { id: "default" },
    create: { id: "default" },
    update: {},
  })
  return NextResponse.json(settings)
})

export const PATCH = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const settings = await prisma.firmSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...parsed.data },
    update: parsed.data,
  })

  invalidateTimezoneCache()
  return NextResponse.json(settings)
})
