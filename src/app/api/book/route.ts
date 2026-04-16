import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  slug: z.string(),
  meetingType: z.enum(["IN_PERSON", "ZOOM", "GOOGLE_MEET", "PHONE"]),
  startAt: z.string().datetime(),
  timezone: z.string().default("America/Chicago"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { slug, meetingType, startAt, timezone, firstName, lastName, email, phone, notes } = parsed.data

  // Find event type
  let eventType = await prisma.eventType.findUnique({ where: { slug } })

  // Auto-create a default "consultation" event type if it doesn't exist yet
  if (!eventType && slug === "consultation") {
    eventType = await prisma.eventType.create({
      data: {
        slug: "consultation",
        title: "Free Consultation",
        description: "A free 60-minute consultation with our team.",
        durationMinutes: 60,
        color: "#1E40AF",
        meetingTypes: ["IN_PERSON", "ZOOM", "GOOGLE_MEET", "PHONE"],
        bufferMinutes: 15,
        isActive: true,
      },
    })
  }

  if (!eventType) return NextResponse.json({ error: "Event type not found" }, { status: 404 })

  // Find or create the client record
  let client = await prisma.client.findUnique({ where: { email } })

  // Assign to admin/first staff user
  const staffUser = await prisma.user.findFirst({
    where: { isActive: true, role: { in: ["ADMIN", "STAFF"] } },
    orderBy: { createdAt: "asc" },
  })
  if (!staffUser) return NextResponse.json({ error: "No staff available" }, { status: 500 })

  if (!client) {
    client = await prisma.client.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        status: "PROSPECT",
        assignedToId: staffUser.id,
      },
    })
  }

  const start = new Date(startAt)
  const end = new Date(start.getTime() + eventType.durationMinutes * 60 * 1000)

  const appointment = await prisma.appointment.create({
    data: {
      clientId: client.id,
      eventTypeId: eventType.id,
      staffUserId: staffUser.id,
      startAt: start,
      endAt: end,
      timezone,
      meetingType,
      status: "PENDING",
      notes,
    },
  })

  return NextResponse.json({ id: appointment.id, clientId: client.id }, { status: 201 })
}
