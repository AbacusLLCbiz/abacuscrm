import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  let eventType = await prisma.eventType.findFirst({
    where: { slug, isActive: true },
    include: { availability: { orderBy: { dayOfWeek: "asc" } } },
  })

  // Auto-create the default consultation event type on first visit
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
      include: { availability: true },
    })
  }

  if (!eventType) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { availability, ...et } = eventType
  return NextResponse.json({ eventType: et, availability })
}
