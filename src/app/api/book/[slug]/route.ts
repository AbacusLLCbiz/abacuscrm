import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { MeetingType } from "@prisma/client"

const CONSULTATION_MEETING_TYPES: MeetingType[] = ["IN_PERSON", "ZOOM", "GOOGLE_MEET", "PHONE"]

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  let eventType = await prisma.eventType.findUnique({
    where: { slug, isActive: true },
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
        meetingTypes: CONSULTATION_MEETING_TYPES,
        bufferMinutes: 15,
        isActive: true,
      },
    })
  }

  if (!eventType) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(eventType)
}
