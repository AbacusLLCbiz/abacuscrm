import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional().nullable(),
  durationMinutes: z.number().int().min(5).optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
  meetingTypes: z.array(z.enum(["IN_PERSON", "ZOOM", "GOOGLE_MEET", "PHONE"])).min(1).optional(),
  bufferMinutes: z.number().int().min(0).optional(),
  requiresConfirmation: z.boolean().optional(),
  locationDetails: z.string().optional().nullable(),
  zoomLink: z.string().optional().nullable(),
  googleMeetLink: z.string().optional().nullable(),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const eventType = await prisma.eventType.findUnique({ where: { id } })
  if (!eventType) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(eventType)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  // If slug is changing, check uniqueness
  if (parsed.data.slug) {
    const existing = await prisma.eventType.findFirst({
      where: { slug: parsed.data.slug, id: { not: id } },
    })
    if (existing) return NextResponse.json({ error: "Slug already in use" }, { status: 400 })
  }

  const eventType = await prisma.eventType.update({
    where: { id },
    data: parsed.data,
  })

  return NextResponse.json(eventType)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await prisma.eventType.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
