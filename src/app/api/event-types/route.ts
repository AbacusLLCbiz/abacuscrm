import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createEventTypeSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().optional(),
  durationMinutes: z.number().int().min(5).default(60),
  color: z.string().default("#1E40AF"),
  meetingTypes: z.array(z.enum(["IN_PERSON", "ZOOM", "GOOGLE_MEET", "PHONE"])).min(1),
  bufferMinutes: z.number().int().min(0).default(15),
  requiresConfirmation: z.boolean().default(false),
  locationDetails: z.string().optional(),
  zoomLink: z.string().optional(),
  googleMeetLink: z.string().optional(),
})

export const GET = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const eventTypes = await prisma.eventType.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(eventTypes)
})

export const POST = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = createEventTypeSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const existing = await prisma.eventType.findUnique({ where: { slug: parsed.data.slug } })
  if (existing) return NextResponse.json({ error: "Slug already in use" }, { status: 400 })

  const eventType = await prisma.eventType.create({ data: parsed.data })
  return NextResponse.json({ id: eventType.id }, { status: 201 })
})
