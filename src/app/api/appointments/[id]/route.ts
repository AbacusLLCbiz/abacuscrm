import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const patchSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]),
})

export const PATCH = auth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status: parsed.data.status },
    include: {
      client: true,
      eventType: true,
      staffUser: { select: { name: true } },
    },
  })

  return NextResponse.json(appointment)
})
