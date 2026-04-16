import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const availabilityEntrySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  timezone: z.string().default("America/New_York"),
})

const postSchema = z.object({
  eventTypeId: z.string(),
  availability: z.array(availabilityEntrySchema),
})

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const eventTypeId = searchParams.get("eventTypeId")
  if (!eventTypeId) return NextResponse.json({ error: "eventTypeId required" }, { status: 400 })

  const availability = await prisma.availability.findMany({
    where: { eventTypeId },
    orderBy: { dayOfWeek: "asc" },
  })

  return NextResponse.json(availability)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = postSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { eventTypeId, availability } = parsed.data

  // Delete existing and replace
  await prisma.availability.deleteMany({ where: { eventTypeId } })

  const created = await prisma.availability.createMany({
    data: availability.map((a) => ({ ...a, eventTypeId })),
  })

  return NextResponse.json({ count: created.count })
}
